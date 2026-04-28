#!/usr/bin/env tsx

import { exec } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import prompts from "prompts";
import { isValidKebabCase, toKebabCase, toPascalCase } from "./create-user-sandbox-page.helpers";
import type { CliFlag } from "./utils/cli-args";
import { handleHelpFlag, isNonInteractiveMode, parseCliArgs, validateCliArgs } from "./utils/cli-args";

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

// CLI flags definition
const CLI_FLAGS: CliFlag[] = [
  {
    name: "user",
    alias: "u",
    description: "Username in kebab-case format (e.g., ryo-watanabe)",
    type: "string",
    required: true,
  },
];

const main = async () => {
  console.log("\n🎨 User Sandbox Environment Creator\n");

  // Parse CLI arguments
  const cliArgs = parseCliArgs();

  // Handle --help flag
  if (
    handleHelpFlag(cliArgs, "sandbox:create-user", "Create a new user sandbox environment", CLI_FLAGS, [
      "pnpm sandbox:create-user --user ryo-watanabe",
      "pnpm sandbox:create-user -u john-doe",
      "pnpm sandbox:create-user  # Interactive mode (no arguments)",
    ])
  ) {
    process.exit(0);
  }

  // Determine if non-interactive mode
  const isNonInteractive = isNonInteractiveMode(cliArgs);

  let userKebabName: string;

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
      console.log("\n使用例: pnpm sandbox:create-user --user ryo-watanabe");
      console.log("ヘルプ: pnpm sandbox:create-user --help\n");
      process.exit(1);
    }

    // validation.valid === true なので config は必ず存在する
    if (!validation.config) {
      console.error("❌ エラー: 内部エラーが発生しました\n");
      process.exit(1);
    }

    const username = validation.config.user as string;
    userKebabName = toKebabCase(username);

    // Validate kebab-case format
    if (!isValidKebabCase(userKebabName)) {
      console.error(`❌ エラー: 無効なユーザー名形式\n`);
      console.error(`   ユーザー名は kebab-case 形式である必要があります`);
      console.error(`   例: ryo-watanabe, john-doe`);
      console.error(`   入力値: "${username}"`);
      console.error(`   変換後: "${userKebabName}"\n`);
      process.exit(1);
    }

    console.log("✅ 設定を読み込みました");
  } else {
    // === Interactive Mode ===
    // Prompt for username
    const response = await prompts({
      type: "text",
      name: "username",
      message: "ユーザー名を入力してください (kebab-case形式):",
      validate: (value) => {
        if (value.trim().length === 0) return "ユーザー名は必須です";
        const kebabValue = toKebabCase(value);
        if (!isValidKebabCase(kebabValue)) {
          return `無効な形式です。kebab-case (例: ryo-watanabe) で入力してください。変換例: "${kebabValue}"`;
        }
        return true;
      },
    });

    if (!response.username) {
      console.log("\n❌ キャンセルされました");
      process.exit(0);
    }

    userKebabName = toKebabCase(response.username);
  }

  console.log(`\n📝 生成情報:`);
  console.log(`   ユーザー名: ${userKebabName}`);

  // Paths
  const projectRoot = path.join(__dirname, "..");
  const sandboxDir = path.join(projectRoot, "src", "pages", "sandbox");
  const usersDir = path.join(sandboxDir, "users");
  const userDir = path.join(usersDir, userKebabName);
  const userIndexFile = path.join(userDir, "index.tsx");
  const userRoutesFile = path.join(userDir, "routes.tsx");

  // Check if user directory already exists
  try {
    await fs.access(userDir);
    console.log(`\n❌ エラー: ユーザー環境 "${userKebabName}" は既に存在します`);
    process.exit(1);
  } catch {
    // Directory doesn't exist, continue
  }

  // Create user directory
  console.log(`\n📁 ユーザーディレクトリを作成: ${userKebabName}/`);
  await fs.mkdir(userDir, { recursive: true });

  // Create user index.tsx (clone of sandbox/index.tsx with modified title)
  console.log(`\n📝 ${userKebabName}/index.tsx を作成中...`);
  const userIndexContent = `import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Card,
  CardBody,
  CardHeader,
  CardLink,
  Code,
  ContentHeader,
  Link as AegisLink,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

export const User${toPascalCase(userKebabName)}Sandbox = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>${userKebabName} の Sandbox</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            ${userKebabName} の実験的な機能やプロトタイプを試す場所です。自由にページを追加してください。
          </Text>

          <Accordion style={{ marginBottom: "var(--aegis-space-large)" }}>
            <AccordionItem>
              <AccordionButton>
                <Text as="p" variant="label.medium">
                  コマンドの使い方
                </Text>
              </AccordionButton>
              <AccordionPanel>
                <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
                  この環境に新しいページを作成するには、以下のコマンドを実行してください：
                </Text>
                <Code
                  style={{
                    display: "block",
                    marginBottom: "var(--aegis-space-medium)",
                  }}
                >
                  pnpm run sandbox:create
                </Code>
                <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
                  作成先の選択で「ユーザー環境」を選び、${userKebabName} を選択してください。
                </Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(var(--aegis-layout-width-x5Small), 1fr))",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            <Card>
              <CardBody>
                <Text variant="body.small">まだページがありません</Text>
              </CardBody>
            </Card>
          </div>

          <AegisLink asChild>
            <Link to="/sandbox">← Back to Sandbox</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
`;

  await fs.writeFile(userIndexFile, userIndexContent, "utf-8");

  // Format with Biome
  await applyBiomeCheck(userIndexFile);

  console.log(`✅ ${userKebabName}/index.tsx を作成しました`);

  // Create user routes.tsx from template
  console.log(`\n📝 ${userKebabName}/routes.tsx を作成中...`);
  const routesTemplateFile = path.join(__dirname, "templates", "user-routes.template.tsx");
  let routesTemplate = await fs.readFile(routesTemplateFile, "utf-8");

  // Replace placeholders
  routesTemplate = routesTemplate
    .replace(/\{\{USERNAME_PASCAL\}\}/g, toPascalCase(userKebabName))
    .replace(/\{\{username\}\}/g, userKebabName);

  await fs.writeFile(userRoutesFile, routesTemplate, "utf-8");
  await applyBiomeCheck(userRoutesFile);
  console.log(`✅ ${userKebabName}/routes.tsx を作成しました`);

  // Update main sandbox index to add user card
  const sandboxIndexFile = path.join(sandboxDir, "index.tsx");
  await updateMainSandboxIndex(sandboxIndexFile, userKebabName);

  // Display next steps
  console.log(`\n🎉 完了しました！\n`);
  console.log(`📍 作成されたファイル:`);
  console.log(`   - src/pages/sandbox/users/${userKebabName}/index.tsx`);
  console.log(`   - src/pages/sandbox/users/${userKebabName}/routes.tsx`);
  console.log(`\n✅ 自動更新されたファイル:`);
  console.log(`   - src/pages/sandbox/index.tsx (カード追加)`);
  console.log(`\n🌐 次のステップ:`);
  console.log(`   1. 開発サーバーを起動: pnpm run dev`);
  console.log(`   2. ブラウザで http://localhost:5173/sandbox/${userKebabName} を開く`);
  console.log(`   3. ページを追加: pnpm run sandbox:create`);
  console.log(`      → 作成先で「ユーザー環境」→「${userKebabName}」を選択\n`);
};

const updateMainSandboxIndex = async (indexFile: string, userKebabName: string) => {
  try {
    console.log(`\n📝 メインsandbox/index.tsxを更新中...`);
    let content = await fs.readFile(indexFile, "utf-8");

    // Check if user link already exists
    if (content.includes(`to="/sandbox/${userKebabName}"`)) {
      console.log(`⚠️  ユーザー "${userKebabName}" のリンクは既に存在します`);
      return;
    }

    // Find where to insert the user directory section
    // We'll add it before the "共有ページ" section
    // Use a string-based search to find the insertion point
    const sharedPageIndex = content.indexOf("共有ページ");
    let insertPos = -1;

    if (sharedPageIndex !== -1) {
      // Go backwards to find the start of the <Text tag
      let searchStart = sharedPageIndex;
      while (searchStart > 0 && content[searchStart] !== "<") {
        searchStart--;
      }

      // Go back to start of line (preserve indentation)
      insertPos = searchStart;
      while (insertPos > 0 && content[insertPos - 1] !== "\n") {
        insertPos--;
      }
    }

    if (insertPos !== -1) {
      // Create user directories section if it doesn't exist
      if (!content.includes("ユーザー環境")) {
        const userSection = `          <Text as="h2" variant="title.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            ユーザー環境
          </Text>
          <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-medium)", color: "var(--aegis-color-text-subtle)" }}>
            各開発者専用のSandbox環境です。
          </Text>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(var(--aegis-layout-width-x5Small), 1fr))",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/${userKebabName}">
                    <Text variant="title.xSmall">${userKebabName}</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">${userKebabName} の実験ページ</Text>
              </CardBody>
            </Card>
          </div>

          `;

        content = content.slice(0, insertPos) + userSection + content.slice(insertPos);
      } else {
        // User section already exists, add card to it
        // Find the user environment section heading (not the accordion text)
        // Look for the h2 variant which is used for section headings
        const userEnvPattern = /<Text\s+as="h2"[^>]*>\s*ユーザー環境/;
        const userEnvMatch = content.match(userEnvPattern);
        if (!userEnvMatch || userEnvMatch.index === undefined) {
          console.warn("⚠️  ユーザー環境セクションの見出しが見つかりませんでした");
          return;
        }
        const userEnvIndex = userEnvMatch.index;
        const sharedPageSectionIndex = content.indexOf("共有ページ", userEnvIndex);

        if (userEnvIndex !== -1 && sharedPageSectionIndex !== -1) {
          // Search for grid div ONLY within the user environment section
          // This ensures we don't accidentally find the shared pages grid
          const userEnvSection = content.slice(userEnvIndex, sharedPageSectionIndex);

          // Find the grid display property within user env section
          const gridDisplayIndex = userEnvSection.indexOf('display: "grid"');

          if (gridDisplayIndex !== -1) {
            // Work backwards to find the opening <div tag
            let divStart = gridDisplayIndex;
            while (divStart > 0 && userEnvSection.slice(divStart - 4, divStart) !== "<div") {
              divStart--;
            }

            // Now find the end of the opening tag (the >)
            let divOpenEnd = gridDisplayIndex;
            while (divOpenEnd < userEnvSection.length && userEnvSection[divOpenEnd] !== ">") {
              divOpenEnd++;
            }
            divOpenEnd++; // Include the >

            const gridDivStart = userEnvIndex + divOpenEnd;

            // Find the closing </div> for this grid
            const afterGridDiv = content.slice(gridDivStart);
            const closingDivMatch = afterGridDiv.match(/<\/div>/);

            if (closingDivMatch && closingDivMatch.index !== undefined) {
              // Find the last </Card> within this grid
              const gridContent = afterGridDiv.slice(0, closingDivMatch.index);
              const lastCardIndex = gridContent.lastIndexOf("</Card>");

              let insertPosition: number;
              if (lastCardIndex !== -1) {
                // There are existing cards, insert after the last one
                insertPosition = gridDivStart + lastCardIndex + 7; // 7 = "</Card>".length
              } else {
                // No existing cards, insert right after the opening div tag
                insertPosition = gridDivStart;
              }

              const newUserCard = `
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/${userKebabName}">
                    <Text variant="title.xSmall">${userKebabName}</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">${userKebabName} の実験ページ</Text>
              </CardBody>
            </Card>`;

              content = content.slice(0, insertPosition) + newUserCard + content.slice(insertPosition);
            }
          }
        }
      }

      await fs.writeFile(indexFile, content, "utf-8");

      // Format with Biome
      await applyBiomeCheck(indexFile);

      console.log(`✅ sandbox/index.tsx にユーザーカードを追加しました`);
    } else {
      console.warn(`⚠️  「共有ページ」セクションが見つかりませんでした`);
    }
  } catch (error) {
    console.warn(`⚠️  sandbox/index.tsx の更新に失敗しました:`, error);
    console.log(`   手動でユーザーカードを追加してください`);
  }
};

const _updateSandboxRoutes = async (routesFile: string, userKebabName: string) => {
  console.log(`\n📝 routes.tsx を更新中...`);

  try {
    let content = await fs.readFile(routesFile, "utf-8");

    const userIndexPath = `/sandbox/${userKebabName}`;
    const userIndexImportPath = `./${userKebabName}/index`;
    const userIndexComponentName = `User${toPascalCase(userKebabName)}Sandbox`;

    // Check if route already exists
    if (content.includes(`path: "${userIndexPath}"`)) {
      console.log(`⚠️  ルート "${userIndexPath}" は既に存在します`);
      return;
    }

    // 1. Add lazy import
    const lazyImportRegex = /const \w+ = lazy\(\(\) => import\("[^"]+"\)\);/g;
    const newImport = `const ${userIndexComponentName} = lazy(() => import("${userIndexImportPath}"));`;

    const matches = Array.from(content.matchAll(lazyImportRegex));
    if (matches.length > 0) {
      const lastMatch = matches[matches.length - 1];
      if (lastMatch.index !== undefined) {
        const insertPos = lastMatch.index + lastMatch[0].length;
        content = `${content.slice(0, insertPos)}\n${newImport}${content.slice(insertPos)}`;
        console.log(`✅ lazy import を追加しました`);
      }
    }

    // 2. Add route
    const newRoute = `  {
    path: "${userIndexPath}",
    element: <${userIndexComponentName} />,
  },`;

    const routesArrayRegex = /export const routes: RouteConfig\[\] = \[([\s\S]*?)\];/;
    const routesMatch = content.match(routesArrayRegex);

    if (routesMatch) {
      const routesContent = routesMatch[1];
      const lastRouteMatches = Array.from(routesContent.matchAll(/\{[^{]*?path:\s*"\/sandbox\/[^"]*"[^{]*?\},?/g));

      if (lastRouteMatches.length > 0) {
        const lastMatch = lastRouteMatches[lastRouteMatches.length - 1];
        const lastRouteText = lastMatch[0];

        const fullArrayMatch = content.match(routesArrayRegex);
        if (fullArrayMatch && fullArrayMatch.index !== undefined && lastMatch.index !== undefined) {
          const fullArrayIndex = fullArrayMatch.index;
          const arrayStartPos = fullArrayIndex + fullArrayMatch[0].lastIndexOf("[") + 1;
          const relativePos = lastMatch.index + lastMatch[0].length;
          let absolutePos = arrayStartPos + relativePos;

          if (!lastRouteText.trim().endsWith(",")) {
            const lastClosingBraceIndex = lastRouteText.lastIndexOf("}");
            if (lastClosingBraceIndex !== -1) {
              const commaInsertPos = arrayStartPos + lastMatch.index + lastClosingBraceIndex + 1;
              content = `${content.slice(0, commaInsertPos)},${content.slice(commaInsertPos)}`;
              absolutePos++;
            }
          }

          content = `${content.slice(0, absolutePos)}\n${newRoute}${content.slice(absolutePos)}`;
          console.log(`✅ routes 配列に追加しました`);
        }
      }
    }

    // 3. Add to routeFileMap
    const newMapEntry = `  "${userIndexPath}": "src/pages/sandbox/${userKebabName}/index.tsx",`;

    const lines = content.split("\n");
    let insertIndex = -1;

    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].includes('"/sandbox/') && lines[i].includes(': "src/pages/sandbox/')) {
        insertIndex = i;
        break;
      }
    }

    if (insertIndex === -1) {
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('"/sandbox": "src/pages/sandbox/index.tsx"')) {
          insertIndex = i;
          break;
        }
      }
    }

    if (insertIndex !== -1) {
      lines.splice(insertIndex + 1, 0, newMapEntry);
      content = lines.join("\n");
      console.log(`✅ routeFileMap に追加しました`);
    }

    await fs.writeFile(routesFile, content, "utf-8");

    // Format with Biome
    await applyBiomeCheck(routesFile);

    console.log(`✅ routes.tsx を更新しました`);
  } catch (error) {
    console.error(`❌ routes.tsx の更新に失敗しました:`, error);
    console.log(`\n📋 以下を手動で追加してください:\n`);
    console.log(`   // Lazy import (ファイル上部)`);
    console.log(
      `   const User${toPascalCase(userKebabName)}Sandbox = lazy(() => import("./${userKebabName}/index"));\n`,
    );
    console.log(`   // Route (routes 配列内)`);
    console.log(`   {`);
    console.log(`     path: "/sandbox/${userKebabName}",`);
    console.log(`     element: <User${toPascalCase(userKebabName)}Sandbox />,`);
    console.log(`   },\n`);
    console.log(`   // routeFileMap`);
    console.log(`   "/sandbox/${userKebabName}": "src/pages/sandbox/${userKebabName}/index.tsx",\n`);
  }
};

main().catch((error) => {
  console.error("\n❌ エラーが発生しました:", error);
  process.exit(1);
});
