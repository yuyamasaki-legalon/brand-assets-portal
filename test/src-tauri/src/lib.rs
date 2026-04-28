use serde::Serialize;
use std::collections::HashMap;
use std::env;
use std::ffi::OsString;
use std::io::{BufRead, BufReader, Read, Write};
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::{Duration, Instant};
use tauri::async_runtime;
use tauri::Emitter;

#[cfg(unix)]
use std::os::unix::process::CommandExt;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct CodexHealthResponse {
    available: bool,
    binary_path: Option<String>,
    diagnostics: Vec<String>,
    version: Option<String>,
    workspace_dir: Option<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct CodexExecResponse {
    binary_path: String,
    command_preview: String,
    duration_ms: u128,
    exit_code: i32,
    stderr: String,
    stdout: String,
    success: bool,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct OpenInEditorResponse {
    launched_with: String,
    target: String,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct CodexStreamEvent {
    line: String,
    run_id: String,
    stream: String,
}

#[derive(Default)]
struct RunningCodexProcesses(Arc<Mutex<HashMap<String, Arc<Mutex<std::process::Child>>>>>);

fn native_binary_candidates() -> Vec<PathBuf> {
    let mut candidates = Vec::new();

    if let Ok(path) = env::var("CODEX_BINARY") {
        candidates.push(PathBuf::from(path));
    }

    if cfg!(target_os = "macos") && cfg!(target_arch = "aarch64") {
        candidates.push(PathBuf::from("/opt/homebrew/lib/node_modules/@openai/codex/node_modules/@openai/codex-darwin-arm64/vendor/aarch64-apple-darwin/codex/codex"));
    }

    if cfg!(target_os = "macos") && cfg!(target_arch = "x86_64") {
        candidates.push(PathBuf::from("/usr/local/lib/node_modules/@openai/codex/node_modules/@openai/codex-darwin-x64/vendor/x86_64-apple-darwin/codex/codex"));
    }

    if let Some(path_value) = env::var_os("PATH") {
        for path in env::split_paths(&path_value) {
            candidates.push(path.join(if cfg!(target_os = "windows") {
                "codex.exe"
            } else {
                "codex"
            }));
        }
    }

    let mut deduped = Vec::new();
    for candidate in candidates {
        if !deduped.iter().any(|existing: &PathBuf| existing == &candidate) {
            deduped.push(candidate);
        }
    }

    deduped
}

fn run_codex_version(candidate: &Path) -> Result<String, String> {
    if !candidate.exists() {
        return Err("candidate not found".into());
    }

    let output = Command::new(candidate)
        .arg("--version")
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output()
        .map_err(|error| error.to_string())?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        let stdout = String::from_utf8_lossy(&output.stdout);
        let combined = format!("{} {}", stdout.trim(), stderr.trim()).trim().to_string();
        return Err(if combined.is_empty() {
            format!("exit status {}", output.status)
        } else {
            combined
        });
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    let version_line = stdout
        .lines()
        .rev()
        .find(|line| !line.trim().is_empty())
        .unwrap_or_default()
        .trim()
        .to_string();

    Ok(version_line)
}

fn resolve_codex_binary() -> Result<(PathBuf, String, Vec<String>), Vec<String>> {
    let mut diagnostics = Vec::new();

    for candidate in native_binary_candidates() {
        match run_codex_version(&candidate) {
            Ok(version) => {
                diagnostics.push(format!("Using Codex binary: {}", candidate.display()));
                return Ok((candidate, version, diagnostics));
            }
            Err(error) => {
                diagnostics.push(format!("{} -> {}", candidate.display(), error));
            }
        }
    }

    Err(diagnostics)
}

fn build_command_preview(binary_path: &Path, workspace_dir: &str, sandbox_mode: &str) -> String {
    let mut command = format!("{} exec --json ", binary_path.display());

    if sandbox_mode == "workspace-write" {
        command.push_str("--full-auto ");
    } else {
        command.push_str(&format!("--sandbox {} ", sandbox_mode));
    }

    command.push_str(&format!("-C {} -", workspace_dir));
    command
}

fn detect_workspace_dir() -> Option<String> {
    let manifest_dir = Path::new(env!("CARGO_MANIFEST_DIR"));
    let repo_root = manifest_dir.parent().unwrap_or(manifest_dir);
    Some(repo_root.to_string_lossy().to_string())
}

fn path_command_candidates(binary_name: &str) -> Vec<PathBuf> {
    let mut candidates = Vec::new();

    if let Some(path_value) = env::var_os("PATH") {
        for path in env::split_paths(&path_value) {
            candidates.push(path.join(if cfg!(target_os = "windows") {
                format!("{binary_name}.exe")
            } else {
                binary_name.to_string()
            }));
        }
    }

    candidates
}

fn has_command(binary_name: &str) -> bool {
    path_command_candidates(binary_name).iter().any(|candidate| candidate.exists())
}

fn build_editor_target(path: &Path, line: Option<u32>, column: Option<u32>) -> String {
    let mut target = path.to_string_lossy().to_string();

    if let Some(line) = line {
        target.push(':');
        target.push_str(&line.to_string());

        if let Some(column) = column {
            target.push(':');
            target.push_str(&column.to_string());
        }
    }

    target
}

fn spawn_editor_command(binary_name: &str, args: &[String]) -> Result<(), String> {
    Command::new(binary_name)
        .args(args)
        .spawn()
        .map(|_| ())
        .map_err(|error| format!("Failed to launch {binary_name}: {error}"))
}

#[tauri::command]
fn open_in_editor(
    path: String,
    line: Option<u32>,
    column: Option<u32>,
    workspace_dir: Option<String>,
) -> Result<OpenInEditorResponse, String> {
    let target_path = PathBuf::from(&path)
        .canonicalize()
        .map_err(|error| format!("File not found or inaccessible: {path} ({error})"))?;

    if !target_path.is_file() {
        return Err(format!("Not a file: {}", target_path.display()));
    }

    // Allow files under either the user-specified workspace or the default repo root
    let allowed_roots: Vec<PathBuf> = [
        workspace_dir.map(PathBuf::from),
        detect_workspace_dir().map(PathBuf::from),
    ]
    .into_iter()
    .flatten()
    .filter_map(|p| p.canonicalize().ok())
    .collect();

    if !allowed_roots.is_empty() && !allowed_roots.iter().any(|root| target_path.starts_with(root)) {
        return Err(format!(
            "Refusing to open file outside workspace: {}",
            target_path.display()
        ));
    }

    let editor_target = build_editor_target(&target_path, line, column);

    let editor_candidates: [(&str, Vec<String>); 4] = [
        ("cursor", vec!["--goto".to_string(), editor_target.clone()]),
        ("code", vec!["--goto".to_string(), editor_target.clone()]),
        ("windsurf", vec!["--goto".to_string(), editor_target.clone()]),
        ("zed", vec![editor_target.clone()]),
    ];

    for (binary_name, args) in editor_candidates {
        if has_command(binary_name) {
            spawn_editor_command(binary_name, &args)?;
            return Ok(OpenInEditorResponse {
                launched_with: binary_name.to_string(),
                target: editor_target,
            });
        }
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg(&target_path)
            .spawn()
            .map_err(|error| format!("Failed to open file: {error}"))?;

        return Ok(OpenInEditorResponse {
            launched_with: "open".to_string(),
            target: target_path.to_string_lossy().to_string(),
        });
    }

    #[cfg(target_os = "linux")]
    {
        Command::new("xdg-open")
            .arg(&target_path)
            .spawn()
            .map_err(|error| format!("Failed to open file: {error}"))?;

        return Ok(OpenInEditorResponse {
            launched_with: "xdg-open".to_string(),
            target: target_path.to_string_lossy().to_string(),
        });
    }

    #[cfg(target_os = "windows")]
    {
        Command::new("cmd")
            .args(["/C", "start", "", &target_path.to_string_lossy()])
            .spawn()
            .map_err(|error| format!("Failed to open file: {error}"))?;

        return Ok(OpenInEditorResponse {
            launched_with: "start".to_string(),
            target: target_path.to_string_lossy().to_string(),
        });
    }

    #[allow(unreachable_code)]
    Err("No editor launcher is available on this platform.".to_string())
}

fn emit_stream_line(app: &tauri::AppHandle, run_id: &str, stream: &str, line: &str) {
    let _ = app.emit(
        "visual-editor://codex-stream",
        CodexStreamEvent {
            line: line.to_string(),
            run_id: run_id.to_string(),
            stream: stream.to_string(),
        },
    );
}

fn stream_reader<R: Read>(reader: R, app: tauri::AppHandle, run_id: String, stream: String) -> Result<String, String> {
    let mut collected = String::new();
    let buffered = BufReader::new(reader);

    for line_result in buffered.lines() {
        let line = line_result.map_err(|error| format!("Failed to read Codex {stream}: {error}"))?;
        emit_stream_line(&app, &run_id, &stream, &line);
        collected.push_str(&line);
        collected.push('\n');
    }

    Ok(collected)
}

fn stop_child_process(child: &mut std::process::Child) -> Result<(), String> {
    #[cfg(unix)]
    {
        let process_group_id = format!("-{}", child.id());

        let term_status = Command::new("kill")
            .args(["-TERM", &process_group_id])
            .status()
            .map_err(|error| format!("Failed to send SIGTERM to Codex: {error}"))?;

        if !term_status.success() {
            child
                .kill()
                .map_err(|error| format!("Failed to stop Codex: {error}"))?;
        }

        for _ in 0..10 {
            if child
                .try_wait()
                .map_err(|error| format!("Failed to observe Codex shutdown: {error}"))?
                .is_some()
            {
                return Ok(());
            }

            thread::sleep(Duration::from_millis(50));
        }

        let kill_status = Command::new("kill")
            .args(["-KILL", &process_group_id])
            .status()
            .map_err(|error| format!("Failed to send SIGKILL to Codex: {error}"))?;

        if !kill_status.success() {
            child
                .kill()
                .map_err(|error| format!("Failed to force stop Codex: {error}"))?;
        }

        return Ok(());
    }

    #[cfg(not(unix))]
    {
        child
            .kill()
            .map_err(|error| format!("Failed to stop Codex: {error}"))?;
        Ok(())
    }
}

#[tauri::command]
fn get_codex_health() -> Result<CodexHealthResponse, String> {
    let workspace_dir = detect_workspace_dir();

    match resolve_codex_binary() {
        Ok((binary_path, version, diagnostics)) => Ok(CodexHealthResponse {
            available: true,
            binary_path: Some(binary_path.to_string_lossy().to_string()),
            diagnostics,
            version: Some(version),
            workspace_dir,
        }),
        Err(diagnostics) => Ok(CodexHealthResponse {
            available: false,
            binary_path: None,
            diagnostics,
            version: None,
            workspace_dir,
        }),
    }
}

#[tauri::command]
async fn run_codex_exec(
    app: tauri::AppHandle,
    state: tauri::State<'_, RunningCodexProcesses>,
    run_id: String,
    prompt: String,
    workspace_dir: String,
    sandbox_mode: Option<String>,
    binary_path: Option<String>,
) -> Result<CodexExecResponse, String> {
    let process_registry = state.0.clone();

    async_runtime::spawn_blocking(move || {
        let app_handle = app.clone();
        let sandbox_mode = sandbox_mode.unwrap_or_else(|| "workspace-write".to_string());
        let workspace_dir = if workspace_dir.trim().is_empty() {
            detect_workspace_dir().unwrap_or_else(|| ".".to_string())
        } else {
            workspace_dir
        };

        let resolved_binary = if let Some(binary_path) = binary_path {
            // Validate that the user-supplied binary path matches a known Codex candidate
            let candidate = PathBuf::from(&binary_path);
            let known_candidates = native_binary_candidates();
            let canonical = candidate.canonicalize().ok();
            let is_known = known_candidates.iter().any(|known| {
                known.canonicalize().ok().as_ref() == canonical.as_ref() && canonical.is_some()
            });
            if !is_known {
                return Err(format!(
                    "Refusing to execute unknown binary: {binary_path}. Use CODEX_BINARY env var or install Codex globally."
                ));
            }
            candidate
        } else {
            resolve_codex_binary()
                .map(|(binary_path, _, _)| binary_path)
                .map_err(|diagnostics| diagnostics.join("\n"))?
        };

        let mut args: Vec<OsString> = vec!["exec".into(), "--json".into()];
        if sandbox_mode == "workspace-write" {
            args.push("--full-auto".into());
        } else {
            args.push("--sandbox".into());
            args.push(sandbox_mode.clone().into());
        }
        args.push("-C".into());
        args.push(workspace_dir.clone().into());
        args.push("-".into());

        let command_preview = build_command_preview(&resolved_binary, &workspace_dir, &sandbox_mode);
        let started_at = Instant::now();

        let mut command = Command::new(&resolved_binary);
        command
            .args(&args)
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped());

        #[cfg(unix)]
        command.process_group(0);

        let child = command
            .spawn()
            .map_err(|error| format!("Failed to spawn Codex: {error}"))?;

        let child = Arc::new(Mutex::new(child));
        process_registry
            .lock()
            .map_err(|_| "Failed to lock process registry".to_string())?
            .insert(run_id.clone(), child.clone());

        let mut child_guard = child
            .lock()
            .map_err(|_| "Failed to lock Codex process".to_string())?;

        if let Some(mut stdin) = child_guard.stdin.take() {
            stdin
                .write_all(prompt.as_bytes())
                .map_err(|error| format!("Failed to write prompt to Codex stdin: {error}"))?;
        }

        let stdout_reader = child_guard
            .stdout
            .take()
            .ok_or_else(|| "Failed to capture Codex stdout".to_string())?;
        let stderr_reader = child_guard
            .stderr
            .take()
            .ok_or_else(|| "Failed to capture Codex stderr".to_string())?;
        drop(child_guard);

        let stdout_handle = {
            let app_handle = app_handle.clone();
            let run_id = run_id.clone();
            thread::spawn(move || stream_reader(stdout_reader, app_handle, run_id, "stdout".to_string()))
        };
        let stderr_handle = {
            let app_handle = app_handle.clone();
            let run_id = run_id.clone();
            thread::spawn(move || stream_reader(stderr_reader, app_handle, run_id, "stderr".to_string()))
        };

        let status = loop {
            let maybe_status = child
                .lock()
                .map_err(|_| "Failed to lock Codex process for wait".to_string())?
                .try_wait()
                .map_err(|error| format!("Failed to wait for Codex: {error}"))?;

            if let Some(status) = maybe_status {
                break status;
            }

            thread::sleep(Duration::from_millis(50));
        };
        let stdout = stdout_handle
            .join()
            .map_err(|_| "Failed to join Codex stdout reader".to_string())??;
        let stderr = stderr_handle
            .join()
            .map_err(|_| "Failed to join Codex stderr reader".to_string())??;

        process_registry
            .lock()
            .map_err(|_| "Failed to lock process registry".to_string())?
            .remove(&run_id);

        Ok(CodexExecResponse {
            binary_path: resolved_binary.to_string_lossy().to_string(),
            command_preview,
            duration_ms: started_at.elapsed().as_millis(),
            exit_code: status.code().unwrap_or(1),
            stderr,
            stdout,
            success: status.success(),
        })
    })
    .await
    .map_err(|error| format!("Failed to join Codex task: {error}"))?
}

#[tauri::command]
fn stop_codex_exec(
    app: tauri::AppHandle,
    state: tauri::State<'_, RunningCodexProcesses>,
    run_id: String,
) -> Result<bool, String> {
    let process = state
        .0
        .lock()
        .map_err(|_| "Failed to lock process registry".to_string())?
        .get(&run_id)
        .cloned();

    let Some(process) = process else {
        return Ok(false);
    };

    let mut child = process
        .lock()
        .map_err(|_| "Failed to lock Codex process".to_string())?;
    stop_child_process(&mut child)?;
    let _ = app.emit(
        "visual-editor://codex-stream",
        CodexStreamEvent {
            line: "Execution stopped by user.".to_string(),
            run_id,
            stream: "stderr".to_string(),
        },
    );
    Ok(true)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(RunningCodexProcesses::default())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_codex_health,
            open_in_editor,
            run_codex_exec,
            stop_codex_exec
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
