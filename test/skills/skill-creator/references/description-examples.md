# Description Examples

The `description` field in SKILL.md frontmatter is the **primary triggering mechanism**. Claude reads it to decide whether to activate the skill. A well-crafted description directly determines skill effectiveness.

## Structure Formula

```
[What the skill does] + [When to use / trigger conditions] + [Key capabilities (optional)]
```

Japanese variant:

```
[機能の説明]。[トリガー条件]。[主要な機能（任意）]
```

## Good Examples

### Example 1: component-tips (Japanese, Aegis-specific)

```yaml
description: >-
  Aegis コンポーネントの使い方、Props、注意点を提供。
  Button、Dialog、Card などの実装時や質問時に自動トリガー。
  引数でコンポーネント名を指定可能（例: /component-tips Button）。
```

**Why it works:** States what it does (component guidance), lists concrete trigger contexts (implementation, questions), and mentions key capability (argument support).

### Example 2: a11y-audit (Japanese, detailed triggers)

```yaml
description: >-
  アクセシビリティ監査。WCAG 2.1 AA 準拠チェック（カラーコントラスト、
  キーボード操作、スクリーンリーダー対応、フォーム、見出し階層など）と
  Aegis コンポーネント固有のルールを検証。
  コードレビュー時やアクセシビリティ品質チェック時に使用。
```

**Why it works:** Enumerates specific check areas (contrast, keyboard, etc.) so Claude can match diverse accessibility-related queries.

### Example 3: docx skill (English, comprehensive)

```yaml
description: >-
  Comprehensive document creation, editing, and analysis with support for
  tracked changes, comments, formatting preservation, and text extraction.
  Use when Claude needs to work with professional documents (.docx files) for:
  (1) Creating new documents, (2) Modifying or editing content,
  (3) Working with tracked changes, (4) Adding comments,
  or any other document tasks.
```

**Why it works:** Lists all supported operations and explicitly enumerates trigger scenarios.

### Example 4: sandbox-creator (Japanese, action-oriented)

```yaml
description: >-
  Sandbox ページの作成方法、テンプレート一覧、CLI オプションを案内。
  新規ページ作成やテンプレートコピー時に使用。
```

**Why it works:** Short but covers what (creation guidance) and when (new page creation, template copy).

## Bad Examples

### Bad 1: Too vague

```yaml
description: Helps with documents.
```

**Problem:** No trigger conditions, no specifics. Could match almost anything or nothing.

### Bad 2: Too narrow

```yaml
description: Rotates PDF files 90 degrees clockwise.
```

**Problem:** Only matches one exact operation. Won't trigger for other PDF tasks like merging, splitting, or extracting text.

### Bad 3: Instructions mixed into description

```yaml
description: >-
  PDF editor. When triggered, first check if the file exists,
  then run the analysis script, and output results in markdown format.
```

**Problem:** Procedural instructions belong in the SKILL.md body, not the description. The description should only describe what and when, not how.

## Tips

- **Test with examples:** After writing a description, list 5 user prompts that should trigger the skill and 3 that should not. Verify the description covers the right scope.
- **Use concrete nouns:** "Button, Dialog, Card" is better than "UI elements."
- **Include format triggers:** If the skill handles specific file types, mention them (`.docx`, `.pdf`, `.csv`).
- **Keep under 1024 characters:** This is the hard limit enforced by validation.
