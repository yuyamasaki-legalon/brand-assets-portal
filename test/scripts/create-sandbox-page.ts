#!/usr/bin/env tsx

import { exec } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import prompts from "prompts";
import type { CliFlag } from "./utils/cli-args";
import { handleHelpFlag, isNonInteractiveMode, parseCliArgs, validateCliArgs } from "./utils/cli-args";
import { ensureGeneratedPrd } from "./utils/generated-prd";

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Apply Biome check with auto-fix (includes formatting)
const applyBiomeCheck = async (filePath: string): Promise<void> => {
  try {
    await execAsync(`pnpm biome check --write "${filePath}"`);
  } catch (error) {
    console.warn(`⚠️  Biome check failed for ${filePath}:`, error);
  }
};

// Template mapping
const TEMPLATES = {
  "basic-layout": {
    name: "Basic Layout",
    file: "basic-layout.template.tsx",
    description: "All PageLayout elements (Sidebar, Pane, Content)",
  },
  "with-sidebar": {
    name: "With Sidebar",
    file: "with-sidebar.template.tsx",
    description: "PageLayout with SideNavigation",
  },
  "with-pane": {
    name: "With Pane",
    file: "with-pane.template.tsx",
    description: "PageLayout with toggleable Pane",
  },
  "with-resizable-pane": {
    name: "With Resizable Pane",
    file: "with-resizable-pane.template.tsx",
    description: "PageLayout with resizable Pane",
  },
  "scroll-inside": {
    name: "Scroll Inside Layout",
    file: "scroll-inside.template.tsx",
    description: "PageLayout with inside scroll behavior",
  },
  "with-sticky-container": {
    name: "With Sticky Container",
    file: "with-sticky-container.template.tsx",
    description: "PageLayout with PageLayoutStickyContainer",
  },
  blank: {
    name: "Blank",
    file: "blank.template.tsx",
    description: "Minimal template with basic structure",
  },
};

// Convert string to kebab-case
const toKebabCase = (str: string): string => {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Convert string to PascalCase
const toPascalCase = (str: string): string => {
  return str
    .trim()
    .replace(/[^a-z0-9]+/gi, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
};

// Get current date in YYYYMMDD format
const getCurrentDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

// Get existing user directories from a base directory
const getDirectoriesWithIndex = async (baseDir: string): Promise<string[]> => {
  try {
    const entries = await fs.readdir(baseDir, { withFileTypes: true });
    const dirs: string[] = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const indexFile = path.join(baseDir, entry.name, "index.tsx");
        try {
          await fs.access(indexFile);
          dirs.push(entry.name);
        } catch {
          // No index.tsx, skip
        }
      }
    }

    return dirs.sort();
  } catch (_error) {
    return [];
  }
};

// Get existing user directories (legacy users/ directory)
const getUserDirectories = async (sandboxDir: string): Promise<string[]> => {
  const usersDir = path.join(sandboxDir, "users");
  return getDirectoriesWithIndex(usersDir);
};

// Get existing user directories for a product (loc/ or workon/)
const getProductUserDirectories = async (sandboxDir: string, product: string): Promise<string[]> => {
  const productDir = path.join(sandboxDir, product);
  return getDirectoriesWithIndex(productDir);
};

// CLI flags definition
const CLI_FLAGS: CliFlag[] = [
  {
    name: "name",
    alias: "n",
    description: "Page name (e.g., 'User Profile')",
    type: "string",
    required: true,
  },
  {
    name: "description",
    alias: "d",
    description: "Page description",
    type: "string",
    default: "Sandbox experimental page",
  },
  {
    name: "template",
    alias: "t",
    description: "Template to use",
    type: "string",
    choices: Object.keys(TEMPLATES),
    default: "blank",
  },
  {
    name: "date-suffix",
    description: "Add date suffix (YYYYMMDD) to component name",
    type: "boolean",
    default: false,
  },
  {
    name: "location",
    alias: "l",
    description: "Creation location: 'flat' (shared), 'user' (users/), 'loc' (loc/), 'workon' (workon/)",
    type: "string",
    choices: ["flat", "user", "loc", "workon"],
    default: "flat",
  },
  {
    name: "user",
    alias: "u",
    description: "User directory name (required when location=user/loc/workon)",
    type: "string",
  },
];

const main = async () => {
  console.log("\n🎨 Sandbox Page Creator\n");

  const projectRoot = path.join(__dirname, "..");
  const sandboxDir = path.join(projectRoot, "src", "pages", "sandbox");

  // Parse CLI arguments
  const cliArgs = parseCliArgs();

  // Handle --help flag
  if (
    handleHelpFlag(cliArgs, "sandbox:create", "Create a new sandbox page with optional CLI arguments", CLI_FLAGS, [
      'pnpm sandbox:create --name "User Profile" --description "User profile page" --template with-sidebar',
      'pnpm sandbox:create --name "Dashboard" --template basic-layout --date-suffix',
      'pnpm sandbox:create --name "Settings" --location user --user ryo-watanabe',
      'pnpm sandbox:create --name "Case Detail" --location loc --user wataryooou',
      'pnpm sandbox:create --name "Procedure" --location workon --user wataryooou',
      "pnpm sandbox:create  # Interactive mode (no arguments)",
    ])
  ) {
    process.exit(0);
  }

  // Get existing user directories for each location
  const userDirs = await getUserDirectories(sandboxDir);
  const locUserDirs = await getProductUserDirectories(sandboxDir, "loc");
  const workonUserDirs = await getProductUserDirectories(sandboxDir, "workon");

  // Determine if non-interactive mode
  const isNonInteractive = isNonInteractiveMode(cliArgs);

  let config: {
    location: string;
    selectedUser?: string;
    pageName: string;
    pageDescription: string;
    template: string;
    addDateSuffix: boolean;
  };

  if (isNonInteractive) {
    // === Non-Interactive Mode ===
    console.log("📋 非対話モード: CLI引数から設定を読み込んでいます...\n");

    // Validate CLI arguments
    const validation = validateCliArgs(cliArgs, CLI_FLAGS);

    if (!validation.valid) {
      console.error("❌ エラー: 無効なCLI引数\n");
      for (const error of validation.errors) {
        console.error(`   - ${error}`);
      }
      console.log('\n使用例: pnpm sandbox:create --name "User Profile" --template with-sidebar');
      console.log("ヘルプ: pnpm sandbox:create --help\n");
      process.exit(1);
    }

    // validation.valid === true なので config は必ず存在する
    if (!validation.config) {
      console.error("❌ エラー: 内部エラーが発生しました\n");
      process.exit(1);
    }

    const validatedConfig = validation.config;
    const location = validatedConfig.location as string;
    const username = validatedConfig.user as string | undefined;

    // Additional validation: if location requires user, user must be specified
    const requiresUser = ["user", "loc", "workon"].includes(location);
    if (requiresUser && !username) {
      console.error(`❌ エラー: --location=${location} を指定する場合は --user も必須です\n`);
      console.log(`例: pnpm sandbox:create --name "My Page" --location ${location} --user ryo-watanabe\n`);
      process.exit(1);
    }

    // Additional validation: if location requires user, user must exist in the appropriate directory
    if (requiresUser && username) {
      const targetDirs = location === "user" ? userDirs : location === "loc" ? locUserDirs : workonUserDirs;
      const locationLabel = location === "user" ? "users/" : `${location}/`;

      if (!targetDirs.includes(username)) {
        console.error(`❌ エラー: ユーザー環境 "${username}" が ${locationLabel} に見つかりません\n`);
        console.log(`${locationLabel} 内の利用可能なユーザー環境:`);
        if (targetDirs.length > 0) {
          for (const dir of targetDirs) {
            console.log(`   - ${dir}`);
          }
        } else {
          console.log("   （なし）");
          if (location === "user") {
            console.log("\n先に pnpm run sandbox:create-user でユーザー環境を作成してください");
          } else {
            console.log(`\n${locationLabel} 配下にユーザーディレクトリを手動で作成してください`);
          }
        }
        console.log("");
        process.exit(1);
      }
    }

    config = {
      location,
      selectedUser: username,
      pageName: validatedConfig.name as string,
      pageDescription: validatedConfig.description as string,
      template: validatedConfig.template as string,
      addDateSuffix: validatedConfig["date-suffix"] as boolean,
    };

    console.log("✅ 設定を読み込みました");
  } else {
    // === Interactive Mode ===
    // Prompt for location
    const locationResponse = await prompts({
      type: "select",
      name: "location",
      message: "作成先を選択してください:",
      choices: [
        { title: "フラット（共有）", description: "sandbox/page-name", value: "flat" },
        {
          title: "LegalOn（推奨）",
          description: "sandbox/loc/user-name/page-name",
          value: "loc",
          disabled: locUserDirs.length === 0 ? "loc/ 配下にユーザーディレクトリがありません" : false,
        },
        {
          title: "WorkOn",
          description: "sandbox/workon/user-name/page-name",
          value: "workon",
          disabled: workonUserDirs.length === 0 ? "workon/ 配下にユーザーディレクトリがありません" : false,
        },
        {
          title: "ユーザー環境（従来）",
          description: "sandbox/users/user-name/page-name",
          value: "user",
          disabled:
            userDirs.length === 0 ? "先に pnpm run sandbox:create-user でユーザー環境を作成してください" : false,
        },
      ],
    });

    if (!locationResponse.location) {
      console.log("\n❌ キャンセルされました");
      process.exit(0);
    }

    const { location } = locationResponse;
    let selectedUser: string | undefined;

    // If user environment selected, choose user
    if (["user", "loc", "workon"].includes(location)) {
      const targetDirs = location === "user" ? userDirs : location === "loc" ? locUserDirs : workonUserDirs;
      const locationLabel = location === "user" ? "ユーザー環境" : location === "loc" ? "LegalOn" : "WorkOn";

      const userResponse = await prompts({
        type: "select",
        name: "username",
        message: `${locationLabel} のユーザーを選択してください:`,
        choices: targetDirs.map((dir) => ({ title: dir, value: dir })),
      });

      if (!userResponse.username) {
        console.log("\n❌ キャンセルされました");
        process.exit(0);
      }

      selectedUser = userResponse.username;
    }

    // Prompt for page details
    const response = await prompts([
      {
        type: "text",
        name: "pageName",
        message: "ページ名を入力してください:",
        validate: (value) => (value.trim().length > 0 ? true : "ページ名は必須です"),
      },
      {
        type: "text",
        name: "pageDescription",
        message: "説明を入力してください:",
        initial: "Sandbox experimental page",
      },
      {
        type: "select",
        name: "template",
        message: "PageLayoutテンプレートを選択してください:",
        choices: Object.entries(TEMPLATES).map(([key, value]) => ({
          title: value.name,
          description: value.description,
          value: key,
        })),
      },
      {
        type: "confirm",
        name: "addDateSuffix",
        message: "コンポーネント名に日付サフィックスを追加しますか?",
        initial: false,
      },
    ]);

    if (!response.pageName) {
      console.log("\n❌ キャンセルされました");
      process.exit(0);
    }

    config = {
      location,
      selectedUser,
      pageName: response.pageName,
      pageDescription: response.pageDescription,
      template: response.template,
      addDateSuffix: response.addDateSuffix,
    };
  }

  // === Common Processing (both interactive and non-interactive) ===
  const { location, selectedUser, pageName, pageDescription, template, addDateSuffix } = config;

  // Generate names
  const kebabName = toKebabCase(pageName);
  const pascalName = toPascalCase(pageName);
  const componentName = addDateSuffix ? `${pascalName}${getCurrentDate()}` : pascalName;

  // Determine base directory based on location
  const getBaseDir = (): string => {
    if ((location === "user" || location === "loc" || location === "workon") && !selectedUser) {
      throw new Error("selectedUser is required for user/loc/workon location");
    }
    switch (location) {
      case "user":
        return path.join(sandboxDir, "users", selectedUser as string);
      case "loc":
        return path.join(sandboxDir, "loc", selectedUser as string);
      case "workon":
        return path.join(sandboxDir, "workon", selectedUser as string);
      default:
        return sandboxDir;
    }
  };

  // Determine relative path for display
  const getRelativePath = (): string => {
    switch (location) {
      case "user":
        return `users/${selectedUser}/${kebabName}`;
      case "loc":
        return `loc/${selectedUser}/${kebabName}`;
      case "workon":
        return `workon/${selectedUser}/${kebabName}`;
      default:
        return kebabName;
    }
  };

  // Determine location label for display
  const getLocationLabel = (): string => {
    switch (location) {
      case "user":
        return `users/${selectedUser}/`;
      case "loc":
        return `loc/${selectedUser}/`;
      case "workon":
        return `workon/${selectedUser}/`;
      default:
        return "共有（フラット）";
    }
  };

  console.log(`\n📝 生成情報:`);
  console.log(`   作成先: ${getLocationLabel()}`);
  console.log(`   ディレクトリ名: ${kebabName}`);
  console.log(`   コンポーネント名: ${componentName}`);
  console.log(`   テンプレート: ${TEMPLATES[template as keyof typeof TEMPLATES].name}`);

  // Paths
  const baseDir = getBaseDir();
  const pageDir = path.join(baseDir, kebabName);
  const pageFile = path.join(pageDir, "index.tsx");
  const indexFile = path.join(baseDir, "index.tsx");
  const templateFile = path.join(__dirname, "templates", TEMPLATES[template as keyof typeof TEMPLATES].file);

  // Check if page already exists
  try {
    await fs.access(pageDir);
    console.log(`\n❌ エラー: ページ "${getRelativePath()}" は既に存在します`);
    process.exit(1);
  } catch {
    // Directory doesn't exist, continue
  }

  // Read template
  let templateContent = await fs.readFile(templateFile, "utf-8");

  // Replace placeholders
  templateContent = templateContent
    .replace(/\{\{COMPONENT_NAME\}\}/g, componentName)
    .replace(/\{\{PAGE_TITLE\}\}/g, pageName)
    .replace(/\{\{PAGE_DESCRIPTION\}\}/g, pageDescription);

  // Fix import paths for user environment pages (needs 2 extra ../ levels)
  if (selectedUser) {
    templateContent = templateContent.replace(/from ["']\.\.\/\.\.\/\.\.\//g, 'from "../../../../../');
  }

  // Create directory and file
  await fs.mkdir(pageDir, { recursive: true });
  await fs.writeFile(pageFile, templateContent, "utf-8");
  const relativePath = getRelativePath();
  const generatedPrd = await ensureGeneratedPrd({
    pageDir,
    pageName,
    pageDescription,
    relativePagePath: relativePath,
  });

  // Format with Biome
  await applyBiomeCheck(pageFile);
  console.log(`\n✅ ページを作成しました: src/pages/sandbox/${relativePath}/index.tsx`);

  // Update index.tsx
  await updateSandboxIndex(indexFile, kebabName, pageName, pageDescription, selectedUser, location);

  // Update routes
  const routesFile =
    location === "flat"
      ? path.join(projectRoot, "src", "pages", "sandbox", "routes.tsx")
      : path.join(baseDir, "routes.tsx");
  await updateSandboxRoutes(routesFile, kebabName, componentName, selectedUser, location);

  // Display next steps
  console.log(`\n🎉 完了しました！\n`);
  console.log(`📍 作成されたファイル:`);
  console.log(`   - src/pages/sandbox/${relativePath}/index.tsx`);
  if (generatedPrd.created) {
    console.log(`   - src/pages/sandbox/${relativePath}/auto-generated-prd.md`);
  }
  console.log(`\n✅ 自動更新されたファイル:`);
  const indexFileDisplay =
    location === "flat"
      ? "src/pages/sandbox/index.tsx"
      : `src/pages/sandbox/${relativePath.replace(`/${kebabName}`, "")}/index.tsx`;
  const routesFileDisplay =
    location === "flat"
      ? "src/pages/sandbox/routes.tsx"
      : `src/pages/sandbox/${relativePath.replace(`/${kebabName}`, "")}/routes.tsx`;
  console.log(`   - ${indexFileDisplay} (カード追加)`);
  console.log(`   - ${routesFileDisplay} (ルート追加)`);
  console.log(`\n🌐 次のステップ:`);
  console.log(`   開発サーバーを起動して確認してください:`);
  console.log(`   pnpm run dev`);
  const url =
    location === "flat"
      ? `/sandbox/${kebabName}`
      : location === "user"
        ? `/sandbox/${selectedUser}/${kebabName}`
        : `/sandbox/${location}/${selectedUser}/${kebabName}`;
  console.log(`\n   ブラウザで http://localhost:5173${url} を開く\n`);
};

const updateSandboxRoutes = async (
  routesFile: string,
  kebabName: string,
  componentName: string,
  username?: string,
  location?: string,
) => {
  console.log(`\n🔍 デバッグ: updateSandboxRoutes 開始`);
  console.log(`   routesFile: ${routesFile}`);
  console.log(`   kebabName: ${kebabName}`);
  console.log(`   componentName: ${componentName}`);
  console.log(`   username: ${username || "なし（フラット）"}`);
  console.log(`   location: ${location || "flat"}`);

  // Determine route path based on location (defined outside try block for error handling)
  const getRoutePath = (): string => {
    switch (location) {
      case "user":
        return `/sandbox/${username}/${kebabName}`;
      case "loc":
        return `/sandbox/loc/${username}/${kebabName}`;
      case "workon":
        return `/sandbox/workon/${username}/${kebabName}`;
      default:
        return `/sandbox/${kebabName}`;
    }
  };
  const routePath = getRoutePath();

  // Determine file path based on location (defined outside try block for error handling)
  const getFilePath = (): string => {
    switch (location) {
      case "user":
        return `src/pages/sandbox/users/${username}/${kebabName}/index.tsx`;
      case "loc":
        return `src/pages/sandbox/loc/${username}/${kebabName}/index.tsx`;
      case "workon":
        return `src/pages/sandbox/workon/${username}/${kebabName}/index.tsx`;
      default:
        return `src/pages/sandbox/${kebabName}/index.tsx`;
    }
  };
  const filePath = getFilePath();

  // Check if routes.tsx exists
  try {
    await fs.access(routesFile);
  } catch {
    console.log(`⚠️  routes.tsx が存在しません: ${routesFile}`);
    console.log(`   このユーザー環境には routes.tsx がないため、ルート追加をスキップします`);
    console.log(`   手動でルートを設定するか、sandbox:create-user コマンドでユーザー環境を作成してください\n`);
    return;
  }

  try {
    console.log(`📖 routes.tsx を読み込み中...`);
    let content = await fs.readFile(routesFile, "utf-8");
    console.log(`✅ routes.tsx を読み込みました (${content.length} 文字)`);
    // Import path is always relative to the routes.tsx file being updated
    // For user routes: ./page-name/index (relative to users/username/routes.tsx)
    // For shared routes: ./page-name/index (relative to sandbox/routes.tsx)
    const importPath = `./${kebabName}/index`;

    // 1. Add lazy import after the last lazy import
    console.log(`\n📝 ステップ1: lazy import の追加`);
    const lazyImportRegex = /const \w+ = lazy\(\(\) => import\("[^"]+"\)\);/g;
    const newImport = `const ${componentName} = lazy(() => import("${importPath}"));`;

    // Check if import already exists
    if (content.includes(`import("${importPath}")`)) {
      console.log(`⚠️  routes.tsx: インポートは既に存在します`);
    } else {
      // Find the last lazy import
      const matches = Array.from(content.matchAll(lazyImportRegex));
      console.log(`   見つかった lazy import: ${matches.length} 個`);
      if (matches.length > 0) {
        // Insert after the last lazy import
        const lastMatch = matches[matches.length - 1];
        const matchIndex = lastMatch.index;
        if (matchIndex === undefined) {
          console.error("⚠️  Unexpected: match index is undefined");
          return;
        }
        const insertPos = matchIndex + lastMatch[0].length;
        console.log(`   挿入位置: ${insertPos}`);
        content = `${content.slice(0, insertPos)}\n${newImport}${content.slice(insertPos)}`;
        console.log(`✅ routes.tsx に lazy import を追加しました`);
      } else {
        console.log(`⚠️  lazy import の挿入位置が見つかりませんでした`);
      }
    }

    // 2. Add route definition to routes array
    console.log(`\n📝 ステップ2: routes 配列への追加`);
    const newRoute = `  {
    path: "${routePath}",
    element: <${componentName} />,
  },`;

    // Check if route already exists
    if (content.includes(`path: "${routePath}"`)) {
      console.log(`⚠️  routes.tsx: ルートは既に存在します`);
    } else {
      // Find the routes array and insert before the closing bracket
      // For shared pages (no username), look for sharedRoutes array
      // For user pages (with username), look for routes array
      const routesArrayRegex = username
        ? /export const routes: RouteConfig\[\] = \[([\s\S]*?)\];/
        : /const sharedRoutes: RouteConfig\[\] = \[([\s\S]*?)\];/;
      const routesMatch = content.match(routesArrayRegex);

      if (routesMatch) {
        console.log(`   routes 配列が見つかりました`);
        const routesContent = routesMatch[1];
        const lastRouteRegex = /\{[^{]*?path:\s*"\/sandbox\/[^"]*"[^{]*?\},?/g;
        const lastRouteMatches = Array.from(routesContent.matchAll(lastRouteRegex));
        console.log(`   見つかった sandbox ルート: ${lastRouteMatches.length} 個`);

        if (lastRouteMatches.length > 0) {
          // Insert after the last sandbox route
          const lastMatch = lastRouteMatches[lastRouteMatches.length - 1];
          const lastRouteText = lastMatch[0];

          const fullArrayMatch = content.match(routesArrayRegex);
          if (fullArrayMatch) {
            const fullArrayIndex = fullArrayMatch.index;
            const lastMatchIndex = lastMatch.index;
            if (fullArrayIndex === undefined || lastMatchIndex === undefined) {
              console.error("⚠️  Unexpected: match index is undefined");
              return;
            }
            const arrayStartPos = fullArrayIndex + fullArrayMatch[0].lastIndexOf("[") + 1;
            const relativePos = lastMatchIndex + lastMatch[0].length;
            let absolutePos = arrayStartPos + relativePos;

            // Check if the last route ends with a comma (ignoring trailing whitespace)
            if (!lastRouteText.trim().endsWith(",")) {
              console.log(`   ⚠️  最後のルートにカンマがありません。追加します...`);
              // Need to add a comma after the closing brace of the last route
              const lastClosingBraceIndex = lastRouteText.lastIndexOf("}");
              if (lastClosingBraceIndex !== -1) {
                const commaInsertPos = arrayStartPos + lastMatchIndex + lastClosingBraceIndex + 1;
                content = `${content.slice(0, commaInsertPos)},${content.slice(commaInsertPos)}`;
                // Update absolutePos since we inserted a character before it
                absolutePos++;
                console.log(`   ✅ カンマを追加しました`);
              }
            }

            console.log(`   挿入位置: ${absolutePos}`);
            content = `${content.slice(0, absolutePos)}\n${newRoute}${content.slice(absolutePos)}`;
            console.log(`✅ routes.tsx の routes 配列に追加しました`);
          }
        } else {
          console.log(`⚠️  既存の sandbox ルートが見つかりませんでした`);
        }
      } else {
        console.log(`⚠️  routes 配列が見つかりませんでした`);
      }
    }

    // 3. Add to routeFileMap
    console.log(`\n📝 ステップ3: routeFileMap への追加`);
    const newMapEntry = `  "${routePath}": "${filePath}",`;

    // Check if map entry already exists
    if (content.includes(`"${routePath}"`)) {
      console.log(`⚠️  routes.tsx: routeFileMap エントリは既に存在します`);
    } else {
      // Split content into lines
      const lines = content.split("\n");
      let insertIndex = -1;

      // Find the last line that contains "/sandbox/" in routeFileMap
      for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].includes('"/sandbox/') && lines[i].includes(': "src/pages/sandbox/')) {
          insertIndex = i;
          break;
        }
      }

      console.log(`   見つかった routeFileMap の挿入位置（最初の検索）: ${insertIndex}`);

      // If no sandbox/* entry found, find the "/sandbox" entry
      if (insertIndex === -1) {
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('"/sandbox": "src/pages/sandbox/index.tsx"')) {
            insertIndex = i;
            break;
          }
        }
        console.log(`   見つかった routeFileMap の挿入位置（2回目の検索）: ${insertIndex}`);
      }

      if (insertIndex !== -1) {
        // Insert the new entry after the found line
        lines.splice(insertIndex + 1, 0, newMapEntry);
        content = lines.join("\n");
        console.log(`✅ routes.tsx の routeFileMap に追加しました`);
      } else {
        console.log(`⚠️  routeFileMap の挿入位置が見つかりませんでした`);
      }
    }

    console.log(`💾 ファイルに書き込み中...`);
    await fs.writeFile(routesFile, content, "utf-8");

    // Format with Biome
    console.log(`\n🎨 Biome でフォーマット中...`);
    await applyBiomeCheck(routesFile);
    console.log(`✅ Biome フォーマット完了`);

    console.log(`✅ routes.tsx にルートを追加しました`);
    console.log(`🎉 updateSandboxRoutes 完了\n`);
  } catch (error) {
    console.error(`❌ routes.tsx の更新に失敗しました:`, error);
    console.error(`エラーの詳細:`, error instanceof Error ? error.stack : error);
    console.log(`\n📋 以下を手動で追加してください:\n`);
    console.log(`   // Lazy import (ファイル上部)`);
    const errorImportPath = `./${kebabName}/index`;
    console.log(`   const ${componentName} = lazy(() => import("${errorImportPath}"));\n`);
    console.log(`   // Route (routes 配列内)`);
    console.log(`   {`);
    console.log(`     path: "${routePath}",`);
    console.log(`     element: <${componentName} />,`);
    console.log(`   },\n`);
    console.log(`   // routeFileMap`);
    console.log(`   "${routePath}": "${filePath}",\n`);
  }
};

const updateSandboxIndex = async (
  indexFile: string,
  kebabName: string,
  pageName: string,
  pageDescription: string,
  username?: string,
  location?: string,
) => {
  try {
    let content = await fs.readFile(indexFile, "utf-8");

    // Determine route path based on location
    const getRoutePath = (): string => {
      switch (location) {
        case "user":
          return `/sandbox/${username}/${kebabName}`;
        case "loc":
          return `/sandbox/loc/${username}/${kebabName}`;
        case "workon":
          return `/sandbox/workon/${username}/${kebabName}`;
        default:
          return `/sandbox/${kebabName}`;
      }
    };
    const routePath = getRoutePath();

    // Check if there's already the "まだページがありません" card
    const hasEmptyCard = content.includes("まだページがありません");

    if (hasEmptyCard) {
      // Replace the empty card with the new card
      const newCard = `            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="${routePath}">
                    <Text variant="title.xSmall">${pageName}</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">${pageDescription}</Text>
              </CardBody>
            </Card>`;

      content = content.replace(
        /\s*<Card>\s*<CardBody>\s*<Text[^>]*>\s*まだページがありません\s*<\/Text>\s*<\/CardBody>\s*<\/Card>/,
        newCard,
      );
    } else {
      // Add a new card after existing cards
      const cardInsertPoint = content.lastIndexOf("</Card>");
      if (cardInsertPoint !== -1) {
        const newCard = `</Card>

            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="${routePath}">
                    <Text variant="title.xSmall">${pageName}</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">${pageDescription}</Text>
              </CardBody>
            </Card>`;

        content = content.slice(0, cardInsertPoint) + newCard + content.slice(cardInsertPoint + 7);
      }
    }

    // Add CardHeader and CardLink imports if not present
    if (!content.includes("CardHeader")) {
      content = content.replace(/from "@legalforce\/aegis-react";/, (match) => {
        const imports = content.match(/import\s*\{([^}]+)\}\s*from "@legalforce\/aegis-react";/);
        if (imports) {
          const importList = imports[1]
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          if (!importList.includes("CardHeader")) importList.push("CardHeader");
          if (!importList.includes("CardLink")) importList.push("CardLink");
          return `from "@legalforce/aegis-react";`.replace(/from/, `{\n  ${importList.join(",\n  ")},\n} from`);
        }
        return match;
      });
    }

    await fs.writeFile(indexFile, content, "utf-8");

    // Format with Biome
    await applyBiomeCheck(indexFile);

    const targetFile = username ? `${username}/index.tsx` : "sandbox/index.tsx";
    console.log(`✅ ${targetFile} にカードを追加しました`);
  } catch (error) {
    console.warn(`⚠️  index.tsx の更新に失敗しました:`, error);
    console.log(`   手動でカードを追加してください`);
  }
};

main().catch((error) => {
  console.error("\n❌ エラーが発生しました:", error);
  process.exit(1);
});
