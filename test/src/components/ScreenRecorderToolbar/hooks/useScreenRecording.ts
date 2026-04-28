import { useCallback, useRef, useState } from "react";
import type { RecordingState } from "../types";

export const generateRecordingFilename = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `review-${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}.webm`;
};

interface UseScreenRecordingOptions {
  onStopped?: () => void;
  onRecordingChange?: (recording: boolean) => void;
}

interface StartRecordingResult {
  started: boolean;
  micActive: boolean;
}

interface UseScreenRecordingReturn {
  state: RecordingState;
  startRecording: (options: { mic: boolean }) => Promise<StartRecordingResult>;
  stopRecording: () => void;
  error: string | null;
  warning: string | null;
}

export const useScreenRecording = ({
  onStopped,
  onRecordingChange,
}: UseScreenRecordingOptions = {}): UseScreenRecordingReturn => {
  const onStoppedRef = useRef(onStopped);
  onStoppedRef.current = onStopped;
  const onRecordingChangeRef = useRef(onRecordingChange);
  onRecordingChangeRef.current = onRecordingChange;
  const [state, setState] = useState<RecordingState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const download = useCallback((blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = generateRecordingFilename(new Date());
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const cleanup = useCallback(() => {
    for (const track of streamRef.current?.getTracks() ?? []) {
      track.stop();
    }
    for (const track of micStreamRef.current?.getTracks() ?? []) {
      track.stop();
    }
    audioContextRef.current?.close();
    streamRef.current = null;
    micStreamRef.current = null;
    audioContextRef.current = null;
    mediaRecorderRef.current = null;
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      setState("stopping");
      mediaRecorderRef.current.stop();
    }
  }, []);

  const startRecording = useCallback(
    async ({ mic }: { mic: boolean }) => {
      setError(null);
      setWarning(null);
      chunksRef.current = [];
      let micActive = mic;

      try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
          preferCurrentTab: true,
          selfBrowserSurface: "include",
          monitorTypeSurfaces: "exclude",
          surfaceSwitching: "exclude",
        } as DisplayMediaStreamOptions);
        streamRef.current = displayStream;

        // Warn if the captured surface is not the current tab
        const videoTrack = displayStream.getVideoTracks()[0];
        const settings = videoTrack.getSettings() as MediaTrackSettings & { displaySurface?: string };
        if (settings.displaySurface && settings.displaySurface !== "browser") {
          setWarning("現在のタブ以外を選択中: ハイライト・メモ・字幕は録画に含まれません");
        }

        // Mix tab audio + mic audio if mic is enabled
        let combinedStream: MediaStream;
        if (mic) {
          try {
            const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            micStreamRef.current = micStream;

            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;
            const destination = audioContext.createMediaStreamDestination();

            const tabAudioTracks = displayStream.getAudioTracks();
            if (tabAudioTracks.length > 0) {
              const tabSource = audioContext.createMediaStreamSource(new MediaStream(tabAudioTracks));
              tabSource.connect(destination);
            }

            const micSource = audioContext.createMediaStreamSource(micStream);
            micSource.connect(destination);

            combinedStream = new MediaStream([
              ...displayStream.getVideoTracks(),
              ...destination.stream.getAudioTracks(),
            ]);
          } catch {
            micActive = false;
            setWarning("マイクを取得できませんでした（音声なしで録画します）");
            combinedStream = displayStream;
          }
        } else {
          combinedStream = displayStream;
        }

        // Determine supported mime type
        const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
          ? "video/webm;codecs=vp9,opus"
          : "video/webm";

        const recorder = new MediaRecorder(combinedStream, { mimeType });
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: mimeType });
          download(blob);
          cleanup();
          setState("idle");
          onRecordingChangeRef.current?.(false);
          onStoppedRef.current?.();
        };

        // Handle "Stop sharing" from Chrome UI
        displayStream.getVideoTracks()[0].onended = () => {
          stopRecording();
        };

        recorder.start(1000); // collect data every second
        setState("recording");
        onRecordingChangeRef.current?.(true);
        return { started: true, micActive };
      } catch (err) {
        cleanup();
        setState("idle");
        if (err instanceof DOMException && err.name === "NotAllowedError") {
          setError("画面共有の許可が拒否されました");
        } else {
          setError("画面収録の開始に失敗しました");
        }
        return { started: false, micActive: false };
      }
    },
    [download, cleanup, stopRecording],
  );

  return { state, startRecording, stopRecording, error, warning };
};
