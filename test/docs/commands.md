# Development Commands Reference

Complete reference for all development commands in aegis-lab.

## Core Commands

### Development

```bash
pnpm dev
```

Starts the development server with Hot Module Replacement (HMR).

- **URL**: http://localhost:5173
- **When to use**: During active development
- **Features**: Auto-reload on file changes, fast refresh

### Build

```bash
pnpm build
```

Type-checks the entire codebase and builds for production.

- **When to use**: **Required before creating a PR**
- **What it does**:
  - Runs TypeScript type checking
  - Compiles and bundles the application
  - Outputs to `dist/` directory
- **Important**: Must complete without errors before PR

### Preview

```bash
pnpm preview
```

Previews the production build locally.

- **When to use**: After building, before deploying
- **What it does**: Serves the `dist/` directory locally
- **URL**: http://localhost:4173 (default)

## Code Quality

### Format (Recommended)

```bash
pnpm format
```

Runs Biome check with auto-fix (lint + formatting in one command).

- **When to use**: **Recommended before every commit**
- **What it does**:
  - Runs `biome check --write` to apply lint and formatting fixes
- **Notes**: Use `pnpm lint` when you need a read-only report

### Lint

```bash
pnpm lint
```

Checks code quality with Biome linter.

- **When to use**: Before committing
- **What it checks**: Code style, potential bugs, best practices
- **Tool**: Biome 2.3.8

### Lint Styles

```bash
pnpm lint:style
```

Checks CSS files with Stylelint.

- **When to use**: After modifying CSS files
- **Tool**: Stylelint 16.0.2
- **What it checks**: CSS best practices, potential errors

### Lint Text (Japanese Text Guidelines)

```bash
pnpm lint:text
```

Checks Japanese text in TSX files against text style guidelines.

- **When to use**: To check Japanese text quality
- **What it checks**: 漢字/ひらがな表記、数字フォーマット、カタカナ表記、句読点など 30+ のルール
- **Output**: Violations with rule ID, description, and suggestions

```bash
pnpm lint:text:fix
```

Automatically fixes Japanese text violations.

- **When to use**: To apply auto-corrections
- **What it does**: Replaces incorrect text with suggested corrections

**Options**:
- `--fix`: 自動修正を適用
- `--rules <ids>`: チェックするルールを指定（カンマ区切り）
- `--help, -h`: ヘルプを表示

**Examples**:
```bash
# Check all TSX files
pnpm lint:text

# Check specific files
pnpm lint:text "src/pages/template/**/*.tsx"

# Check specific rules only
pnpm lint:text --rules GENERAL-54
pnpm lint:text --rules GENERAL-7,GENERAL-33

# Auto-fix violations
pnpm lint:text:fix

# Auto-fix specific rules only
pnpm lint:text --fix --rules GENERAL-7
```

### Lint Translation (English Translation Quality)

```bash
pnpm lint:translation
```

Checks English translations in `translations.ts` files against terminology guidelines.

- **When to use**: To check English translation quality in sandbox pages
- **What it checks**: 用語統一（案件→Matters など）、フレーズの正確性
- **Output**: Violations with rule ID, expected translation, and auto-fix availability

```bash
pnpm lint:translation:fix
```

Automatically fixes terminology violations where possible.

- **When to use**: To apply auto-corrections for incorrect translations
- **What it does**: Replaces incorrect terms with correct translations

**Options**:
- `--fix`: 自動修正を適用（用語置換のみ）
- `--rules <ids>`: チェックするルールを指定（カンマ区切り）
- `--verbose, -v`: 詳細な出力（ja-JP と en-US の両方を表示）
- `--help, -h`: ヘルプを表示

**Examples**:
```bash
# Check all translation files
pnpm lint:translation

# Check specific files
pnpm lint:translation "src/pages/sandbox/specific-page/**/translations.ts"

# Check specific rules only
pnpm lint:translation --rules TERM-001,TERM-002

# Auto-fix violations
pnpm lint:translation:fix

# Verbose output
pnpm lint:translation --verbose
```

### Generate Terminology Rules

```bash
pnpm translation:generate
```

Generates `terminology.json` from CSV dictionary database.

- **When to use**: After updating CSV files in `scripts/translation-checker/docs/translation-dictionary-database/`
- **What it does**: Parses `terms.csv` and `phrases.csv` to generate terminology rules
- **Output**: Updated `scripts/translation-checker/glossary/terminology.json`

**Guide**: See [scripts/translation-checker/README.md](/scripts/translation-checker/README.md) for complete terminology rules and adding new rules.

## Sandbox System

Sandbox は3つのエリアで構成されています：
- **プロダクト別エリア**: `src/pages/sandbox/loc/`, `src/pages/sandbox/workon/`（テーマ適用）
- **ユーザー環境**: `src/pages/sandbox/users/`
- **共有ページ**: `src/pages/sandbox/`（ルート直下）

### Create Sandbox Page

```bash
# Interactive mode (default)
pnpm sandbox:create

# Non-interactive mode (CLI arguments)
pnpm sandbox:create --name "Page Name" --template with-sidebar
```

Creates a new prototype page.

**Interactive Mode**:
- **Prompts**:
  1. Location (flat/user/loc/workon)
  2. Page name
  3. Description
  4. Layout template
  5. Date suffix option
- **Output**:
  - Creates new page in `src/pages/sandbox/[page-name]/` or `src/pages/sandbox/{loc|workon|users}/{user}/[page-name]/`
  - Auto-creates `auto-generated-prd.md` in the same page directory

**Non-Interactive Mode (CLI Arguments)**:
- `--name, -n` (required): Page name
- `--description, -d` (optional): Page description (default: "Sandbox experimental page")
- `--template, -t` (optional): Template to use (default: "blank")
  - Options: `basic-layout`, `with-sidebar`, `with-pane`, `with-resizable-pane`, `scroll-inside`, `with-sticky-container`, `blank`
- `--date-suffix` (optional): Add date suffix to component name
- `--location, -l` (optional): Creation location (default: "flat")
  - Options: `flat` (shared), `user` (user-specific), `loc` (LegalOn product), `workon` (WorkOn product)
- `--user, -u` (optional): Username (required when `--location` is `user`, `loc`, or `workon`)
- `--help`: Show help message

**Examples**:
```bash
# Create with sidebar template
pnpm sandbox:create -n "Dashboard" -t with-sidebar

# Create in user environment
pnpm sandbox:create --name "My Page" --location user --user ryo-watanabe

# Create in LegalOn product area (recommended)
pnpm sandbox:create --name "Case List" --location loc --user ryo-watanabe

# Create in WorkOn product area
pnpm sandbox:create --name "Profile" --location workon --user ryo-watanabe

# Add date suffix
pnpm sandbox:create --name "Experiment" --date-suffix
```

**Guide**: See [sandbox-guide.md](/docs/sandbox-guide.md)

### Create User Sandbox Environment

```bash
# Interactive mode (default)
pnpm sandbox:create-user

# Non-interactive mode (CLI arguments)
pnpm sandbox:create-user --user ryo-watanabe
```

Creates a new user-specific sandbox environment.

**Interactive Mode**:
- **Prompt**: Enter username in kebab-case format

**Non-Interactive Mode (CLI Arguments)**:
- `--user, -u` (required): Username in kebab-case format
- `--help`: Show help message

**Examples**:
```bash
# Create user environment
pnpm sandbox:create-user -u john-doe
```

### Use Existing Templates

Existing page templates are referenced through `src/pages/template/CATALOG.md`, not copied by a dedicated command.

**Workflow**:
- Search `src/pages/template/CATALOG.md` with keywords from the target UI
- Read the matched template source under `src/pages/template/`
- Run `pnpm sandbox:create` to create and register the sandbox page
- Adapt the generated `index.tsx` using the template structure

**When to use**: Building a sandbox page from an existing production-quality template

## Documentation

### Storybook カタログ同期

Storybook のサンプルコードをコンポーネントごとのドキュメント末尾に挿入・更新します。

```bash
pnpm docs:sync-catalog
```

- 参照元: `~/github/aegis/packages/react/stories`（直下に `.stories.tsx` が無ければ `components` 配下を自動探索）
- 反映先: `docs/rules/component/*.md`
- 追記位置: `## カタログ（Storybook）` セクション（`<!-- STORYBOOK_CATALOG_START/END -->` でガード）

オプション:
- `--dry-run`: 書き込みせず対象のみ確認
- `--component Name1,Name2`: 対象コンポーネントを絞り込み（例: `Accordion,Button`）
- `--stories <path>`: ストーリー格納ディレクトリを上書き
- `--docs <path>`: ドキュメント格納ディレクトリを上書き

実行例:
```bash
# 影響範囲の確認のみ
pnpm docs:sync-catalog -- --dry-run

# 特定コンポーネントのみ反映
pnpm docs:sync-catalog -- --component Accordion,Button
```

## Tauri (Desktop App)

デスクトップアプリとしてビルド・起動するためのコマンドです。
Rust ツールチェーンが必要です。詳細は [tauri-guide.md](/docs/tauri-guide.md) を参照してください。

### Tauri Dev

```bash
pnpm tauri:dev
```

ネイティブウィンドウで開発サーバーを起動します。

- **前提**: Rust ツールチェーンがインストール済みであること
- **What it does**: Vite dev server 起動 → Rust ビルド → ネイティブウィンドウ表示
- **初回**: Rust クレートのコンパイルに時間がかかります

### Tauri Build

```bash
pnpm tauri:build
```

配布可能なネイティブアプリをビルドします。

- **出力**: `src-tauri/target/release/bundle/` に `.app` / `.dmg`（macOS）
- **What it does**: フロントエンドビルド → Rust ビルド → バンドル生成

### Tauri Info

```bash
pnpm tauri info
```

Tauri / Rust / OS の環境情報を表示します。

- **When to use**: トラブルシューティング時

### Tauri iOS Init

```bash
pnpm tauri ios init
```

iOS プロジェクトを初期化します（初回のみ）。

- **前提**: Xcode フル版 + iOS Simulator ランタイム + CocoaPods
- **What it does**: Rust iOS ターゲットインストール → Xcode プロジェクト生成

### Tauri iOS Dev

```bash
pnpm tauri ios dev "iPhone 17 Pro"
```

iOS Simulator でアプリを起動します。

- デバイス名は `xcrun simctl list devices available` で確認
- **初回**: iOS 向け Rust コンパイルに時間がかかります

## Deployment

### Deploy

```bash
pnpm deploy
```

Builds and deploys to Cloudflare Workers.

- **When to use**: **Requires team approval**
- **What it does**:
  - Runs `pnpm build`
  - Deploys to Cloudflare Workers
- **Important**: Do not run without approval

### Cloudflare Deploy Only

```bash
pnpm cf:deploy
```

Deploys to Cloudflare Workers without building.

- **When to use**: After manually building
- **Prerequisite**: `pnpm build` must have been run
- **Important**: Requires approval

## Workflow Examples

### Before Committing

```bash
# 1. Check code quality
pnpm format

# 2. Type check and build
pnpm build

# 3. If both succeed, commit
git add .
git commit -m "feat: add new feature"
```

### Creating a New Prototype

```bash
# 1. Create sandbox page
pnpm sandbox:create

# 2. Start dev server
pnpm dev

# 3. Develop your prototype
# (edit files in src/pages/sandbox/[your-page]/)

# 4. Before committing
pnpm format
pnpm build
```

### Before Creating a PR

```bash
# 1. Ensure on latest main
git checkout main
git pull

# 2. Rebase feature branch
git checkout feature/your-branch
git rebase main

# 3. Run quality checks
pnpm format

# 4. Type check and build (must succeed)
pnpm build

# 5. If all pass, push and create PR
git push origin feature/your-branch
```

## Command Frequency

| Command | Frequency |
|---------|-----------|
| `pnpm dev` | Every development session |
| `pnpm format` | Before every commit (recommended) |
| `pnpm lint:text` | To check Japanese text quality |
| `pnpm build` | Before every PR (required) |
| `pnpm sandbox:create` | When creating prototypes |
| `pnpm deploy` | Only with approval |

## Additional Notes

- **Never skip** `pnpm build` before PR - it's required
- **Always run** `pnpm format` before committing - catches issues early
- **Use** `pnpm sandbox:create` for rapid prototyping
- **Get approval** before running deployment commands

For development workflow details, see [workflow-guide.md](/docs/workflow-guide.md).
