---
name: skill-creator
description: "スキルの新規作成・既存スキル改善・eval 実行・パフォーマンス計測を支援。WHEN: ユーザーが「スキルを作りたい」「スキルを改善したい」と言ったとき、または /skill-creator を実行したとき。NOT WHEN: スキルの利用（実行）時。"
license: Complete terms in LICENSE.txt
disable-model-invocation: true
---

# Skill Creator

This skill provides guidance for creating effective skills.

## About Skills

Skills are modular, self-contained packages that extend Claude's capabilities by providing
specialized knowledge, workflows, and tools. Think of them as "onboarding guides" for specific
domains or tasks—they transform Claude from a general-purpose agent into a specialized agent
equipped with procedural knowledge that no model can fully possess.

### What Skills Provide

1. Specialized workflows - Multi-step procedures for specific domains
2. Tool integrations - Instructions for working with specific file formats or APIs
3. Domain expertise - Company-specific knowledge, schemas, business logic
4. Bundled resources - Scripts, references, and assets for complex and repetitive tasks

## Aegis-Lab Project Context

This skill operates within the aegis-lab project. Be aware of the following conventions.

### Directory Structure

Skills live in `skills/` and are symlinked from `.claude/skills -> ../skills`. New skills are created under `skills/<skill-name>/`.

### Language Conventions

- **Primary language:** Japanese (日本語). Most skills use Japanese for descriptions and body text.
- **Exceptions:** English is acceptable. The `name` field is always English hyphen-case.
- **Technical terms:** Component names, file paths, and CLI commands remain in English regardless of primary language.

### Available MCP Tools

aegis-lab provides Aegis design system MCP tools. Skills that interact with UI components can reference:

- `mcp__aegis__list_components` / `mcp__aegis__get_component_detail` - Component documentation
- `mcp__aegis__list_icons` / `mcp__aegis__list_tokens` - Icons and design tokens

### Existing Skills (18 skills)

| Category | Skills |
|----------|--------|
| UI/Component | component-tips, design-token-resolver, icon-finder, page-layout-assistant |
| Sandbox/Prototype | sandbox-creator, structured-prototype, prototype-generator, word-addin-layout |
| Code Quality | a11y-audit, writing-review, react-useeffect, sync-storybook-docs |
| Workflow/Generation | commit-message, prd-generator, spec-generator, loc-sync |
| i18n | i18n-sandbox |
| Meta | skill-creator |

### Related Skills Section

When a new skill relates to existing skills, add a `## 関連スキル` section at the end of SKILL.md listing related skills and their relationships.

## Core Principles

### Concise is Key

The context window is a public good. Skills share the context window with everything else Claude needs: system prompt, conversation history, other Skills' metadata, and the actual user request.

**Default assumption: Claude is already very smart.** Only add context Claude doesn't already have. Challenge each piece of information: "Does Claude really need this explanation?" and "Does this paragraph justify its token cost?"

Prefer concise examples over verbose explanations.

### Set Appropriate Degrees of Freedom

Match the level of specificity to the task's fragility and variability:

**High freedom (text-based instructions)**: Use when multiple approaches are valid, decisions depend on context, or heuristics guide the approach.

**Medium freedom (pseudocode or scripts with parameters)**: Use when a preferred pattern exists, some variation is acceptable, or configuration affects behavior.

**Low freedom (specific scripts, few parameters)**: Use when operations are fragile and error-prone, consistency is critical, or a specific sequence must be followed.

Think of Claude as exploring a path: a narrow bridge with cliffs needs specific guardrails (low freedom), while an open field allows many routes (high freedom).

### Anatomy of a Skill

Every skill consists of a required SKILL.md file and optional bundled resources:

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter metadata (required)
│   │   ├── name: (required)
│   │   └── description: (required)
│   └── Markdown instructions (required)
└── Bundled Resources (optional)
    ├── scripts/          - Executable code (Python/Bash/etc.)
    ├── references/       - Documentation intended to be loaded into context as needed
    └── assets/           - Files used in output (templates, icons, fonts, etc.)
```

#### SKILL.md (required)

Every SKILL.md consists of:

- **Frontmatter** (YAML): Contains `name` and `description` fields. These are the only fields that Claude reads to determine when the skill gets used, thus it is very important to be clear and comprehensive in describing what the skill is, and when it should be used.
- **Body** (Markdown): Instructions and guidance for using the skill. Only loaded AFTER the skill triggers (if at all).

#### Bundled Resources (optional)

##### Scripts (`scripts/`)

Executable code (Python/Bash/etc.) for tasks that require deterministic reliability or are repeatedly rewritten.

- **When to include**: When the same code is being rewritten repeatedly or deterministic reliability is needed
- **Example**: `scripts/rotate_pdf.py` for PDF rotation tasks
- **Benefits**: Token efficient, deterministic, may be executed without loading into context
- **Note**: Scripts may still need to be read by Claude for patching or environment-specific adjustments

##### References (`references/`)

Documentation and reference material intended to be loaded as needed into context to inform Claude's process and thinking.

- **When to include**: For documentation that Claude should reference while working
- **Examples**: `references/finance.md` for financial schemas, `references/api_docs.md` for API specifications
- **Benefits**: Keeps SKILL.md lean, loaded only when Claude determines it's needed
- **Best practice**: If files are large (>10k words), include grep search patterns in SKILL.md
- **Avoid duplication**: Information should live in either SKILL.md or references files, not both. Prefer references files for detailed information unless it's truly core to the skill—this keeps SKILL.md lean while making information discoverable without hogging the context window.

##### Assets (`assets/`)

Files not intended to be loaded into context, but rather used within the output Claude produces.

- **When to include**: When the skill needs files that will be used in the final output
- **Examples**: `assets/logo.png` for brand assets, `assets/frontend-template/` for HTML/React boilerplate
- **Use cases**: Templates, images, icons, boilerplate code, fonts, sample documents that get copied or modified
- **Benefits**: Separates output resources from documentation, enables Claude to use files without loading them into context

#### What to Not Include in a Skill

A skill should only contain essential files that directly support its functionality. Do NOT create extraneous documentation or auxiliary files, including:

- README.md
- INSTALLATION_GUIDE.md
- QUICK_REFERENCE.md
- CHANGELOG.md
- etc.

The skill should only contain the information needed for an AI agent to do the job at hand. It should not contain auxiliary context about the process that went into creating it, setup and testing procedures, user-facing documentation, etc. Creating additional documentation files just adds clutter and confusion.

### Progressive Disclosure Design Principle

Skills use a three-level loading system to manage context efficiently:

1. **Metadata (name + description)** - Always in context (~100 words)
2. **SKILL.md body** - When skill triggers (<5k words)
3. **Bundled resources** - As needed by Claude (Unlimited because scripts can be executed without reading into context window)

#### Progressive Disclosure Patterns

Keep SKILL.md body to the essentials and under 500 lines to minimize context bloat. Split content into separate files when approaching this limit. When splitting out content into other files, it is very important to reference them from SKILL.md and describe clearly when to read them, to ensure the reader of the skill knows they exist and when to use them.

**Key principle:** When a skill supports multiple variations, frameworks, or options, keep only the core workflow and selection guidance in SKILL.md. Move variant-specific details (patterns, examples, configuration) into separate reference files.

**Pattern 1: High-level guide with references**

```markdown
# PDF Processing

## Quick start
Extract text with pdfplumber:
[code example]

## Advanced features
- **Form filling**: See [FORMS.md](FORMS.md) for complete guide
- **API reference**: See [REFERENCE.md](REFERENCE.md) for all methods
```

Claude loads FORMS.md or REFERENCE.md only when needed.

**Pattern 2: Domain/variant organization** — Organize by domain or variant so Claude only loads the relevant file:

```
bigquery-skill/
├── SKILL.md (overview and navigation)
└── references/
    ├── finance.md, sales.md, product.md
```

**Pattern 3: Conditional details** — Link to advanced content from basic content so Claude reads it only when the user needs those features.

**Important guidelines:**

- **Avoid deeply nested references** - Keep references one level deep from SKILL.md. All reference files should link directly from SKILL.md.
- **Structure longer reference files** - For files longer than 100 lines, include a table of contents at the top so Claude can see the full scope when previewing.

## Description Writing Guide

The `description` field is the primary triggering mechanism. Claude reads it to decide whether to activate the skill. Invest time in crafting it well.

### Structure

```
[What the skill does] + [When to use / trigger conditions] + [Key capabilities (optional)]
```

Japanese variant: `[機能の説明]。[トリガー条件]。`

### Rules

- Include both **what** the skill does and **when** to use it
- Include all "when to use" information in the description — NOT in the body. The body is only loaded after triggering, so "When to Use This Skill" sections in the body are not helpful.
- Use concrete nouns over abstract terms ("Button, Dialog, Card" > "UI elements")
- Keep under 1024 characters (hard limit)

### Examples

**Good** (a11y-audit):
```yaml
description: >-
  アクセシビリティ監査。WCAG 2.1 AA 準拠チェック（カラーコントラスト、
  キーボード操作、スクリーンリーダー対応、フォーム、見出し階層など）と
  Aegis コンポーネント固有のルールを検証。
  コードレビュー時やアクセシビリティ品質チェック時に使用。
```

**Bad** (too vague): `description: Helps with documents.`

For more examples and anti-patterns, see [references/description-examples.md](references/description-examples.md).

## Skill Creation Process

Skill creation involves these steps:

1. Understand the skill with concrete examples
2. Plan reusable skill contents (scripts, references, assets)
3. Initialize the skill (run init_skill.py)
4. Edit the skill (implement resources and write SKILL.md)
5. Test the skill
6. Package the skill (run package_skill.py)
7. Iterate based on real usage

Follow these steps in order, skipping only if there is a clear reason why they are not applicable.

### Step 1: Understanding the Skill with Concrete Examples

Skip this step only when the skill's usage patterns are already clearly understood. It remains valuable even when working with an existing skill.

To create an effective skill, clearly understand concrete examples of how the skill will be used. This understanding can come from either direct user examples or generated examples that are validated with user feedback.

For example, when building an image-editor skill, relevant questions include:

- "What functionality should the image-editor skill support? Editing, rotating, anything else?"
- "Can you give some examples of how this skill would be used?"
- "What would a user say that should trigger this skill?"

To avoid overwhelming users, avoid asking too many questions in a single message. Start with the most important questions and follow up as needed for better effectiveness.

Conclude this step when there is a clear sense of the functionality the skill should support.

### Step 2: Planning the Reusable Skill Contents

To turn concrete examples into an effective skill, analyze each example by:

1. Considering how to execute on the example from scratch
2. Identifying what scripts, references, and assets would be helpful when executing these workflows repeatedly

#### Use Case Categories

Identify which category the skill falls into to guide resource planning:

| Category | Examples | Typical Resources |
|----------|----------|-------------------|
| Document/Asset | pdf-editor, frontend-webapp-builder | scripts/, assets/ (templates) |
| Workflow | commit-message, prd-generator | references/ (guidelines) |
| Knowledge/Query | big-query, component-tips | references/ (schemas, docs) |
| MCP Enhancement | icon-finder, design-token-resolver | references/ (tool usage patterns) |
| Audit/Review | a11y-audit, writing-review | references/ (checklists, rules) |

Example: When building a `pdf-editor` skill to handle queries like "Help me rotate this PDF," the analysis shows:

1. Rotating a PDF requires re-writing the same code each time
2. A `scripts/rotate_pdf.py` script would be helpful to store in the skill

Example: When building a `big-query` skill to handle queries like "How many users have logged in today?" the analysis shows:

1. Querying BigQuery requires re-discovering the table schemas and relationships each time
2. A `references/schema.md` file documenting the table schemas would be helpful to store in the skill

To establish the skill's contents, analyze each concrete example to create a list of the reusable resources to include: scripts, references, and assets.

### Step 3: Initializing the Skill

At this point, it is time to actually create the skill.

Skip this step only if the skill being developed already exists, and iteration or packaging is needed. In this case, continue to the next step.

When creating a new skill from scratch, always run the `init_skill.py` script. The script conveniently generates a new template skill directory that automatically includes everything a skill requires, making the skill creation process much more efficient and reliable.

Usage:

```bash
scripts/init_skill.py <skill-name> --path <output-directory>
```

For aegis-lab, the standard path is:

```bash
scripts/init_skill.py my-new-skill --path ../../skills
```

The script:

- Creates the skill directory at the specified path
- Generates a SKILL.md template with proper frontmatter and TODO placeholders
- Creates example resource directories: `scripts/`, `references/`, and `assets/`
- Adds example files in each directory that can be customized or deleted

After initialization, customize or remove the generated SKILL.md and example files as needed.

### Step 4: Edit the Skill

When editing the (newly-generated or existing) skill, remember that the skill is being created for another instance of Claude to use. Include information that would be beneficial and non-obvious to Claude. Consider what procedural knowledge, domain-specific details, or reusable assets would help another Claude instance execute these tasks more effectively.

#### Learn Proven Design Patterns

Consult these helpful guides based on your skill's needs:

- **Multi-step processes**: See [references/workflows.md](references/workflows.md) for sequential, conditional, decision tree, and audit workflows
- **Output formats or quality standards**: See [references/output-patterns.md](references/output-patterns.md) for template, example, interactive dialog, and structured report patterns
- **Description crafting**: See [references/description-examples.md](references/description-examples.md) for good/bad examples
- **Troubleshooting**: See [references/troubleshooting.md](references/troubleshooting.md) for common problems and fixes

#### Start with Reusable Skill Contents

To begin implementation, start with the reusable resources identified above: `scripts/`, `references/`, and `assets/` files. Note that this step may require user input. For example, when implementing a `brand-guidelines` skill, the user may need to provide brand assets or templates to store in `assets/`, or documentation to store in `references/`.

Added scripts must be tested by actually running them to ensure there are no bugs and that the output matches what is expected. If there are many similar scripts, only a representative sample needs to be tested to ensure confidence that they all work while balancing time to completion.

Any example files and directories not needed for the skill should be deleted. The initialization script creates example files in `scripts/`, `references/`, and `assets/` to demonstrate structure, but most skills won't need all of them.

#### Update SKILL.md

**Writing Guidelines:** Always use imperative/infinitive form.

##### Frontmatter

Write the YAML frontmatter with `name` and `description`. See the [Description Writing Guide](#description-writing-guide) above for detailed guidance on writing effective descriptions.

Do not include any other fields in YAML frontmatter beyond `name` and `description`.

##### Body

Write instructions for using the skill and its bundled resources.

### Step 5: Test the Skill

Before packaging, verify the skill works correctly through three types of testing.

#### Trigger Testing

Write 3-5 prompts that should trigger the skill and 2-3 that should not. Verify each against the description. See [references/testing-guide.md](references/testing-guide.md) for the full methodology.

#### Functional Testing

Run the skill on a realistic task end-to-end. Verify:

- Core workflow produces correct output
- Scripts execute without errors
- References are loaded only when needed

#### Structural Validation

Run the validation script:

```bash
python skills/skill-creator/scripts/quick_validate.py <path/to/skill>
```

Confirm SKILL.md is under 500 lines and all referenced files exist.

### Step 6: Packaging a Skill

Once development of the skill is complete, it must be packaged into a distributable .skill file that gets shared with the user. The packaging process automatically validates the skill first to ensure it meets all requirements:

```bash
scripts/package_skill.py <path/to/skill-folder>
```

Optional output directory specification:

```bash
scripts/package_skill.py <path/to/skill-folder> ./dist
```

The packaging script will:

1. **Validate** the skill automatically, checking:

   - YAML frontmatter format and required fields
   - Skill naming conventions and directory structure
   - Description completeness and quality
   - File organization and resource references

2. **Package** the skill if validation passes, creating a .skill file named after the skill (e.g., `my-skill.skill`) that includes all files and maintains the proper directory structure for distribution. The .skill file is a zip file with a .skill extension.

If validation fails, the script will report the errors and exit without creating a package. Fix any validation errors and run the packaging command again.

### Step 7: Iterate

After testing the skill, users may request improvements. Often this happens right after using the skill, with fresh context of how the skill performed.

**Iteration workflow:**

1. Use the skill on real tasks
2. Notice struggles or inefficiencies
3. Identify how SKILL.md or bundled resources should be updated
4. Implement changes and test again

#### Common Iteration Signals

| Signal | Symptom | Fix |
|--------|---------|-----|
| Not firing | Skill doesn't trigger for relevant prompts | Broaden description with more trigger contexts |
| Over-firing | Skill triggers for unrelated prompts | Narrow description scope; add specificity |
| Quality mismatch | Output doesn't match expectations | Add examples or stricter templates in SKILL.md |
| Context overflow | Responses truncated or lose earlier instructions | Split SKILL.md → references/; apply progressive disclosure |

For detailed troubleshooting guidance, see [references/troubleshooting.md](references/troubleshooting.md).

## Quality Checklist

### Before Development

- [ ] Concrete usage examples are documented (Step 1)
- [ ] Use case category identified (Step 2)
- [ ] Reusable resources planned (Step 2)

### During Development

- [ ] Description follows the structure formula: `[What] + [When] + [Capabilities]`
- [ ] Description is under 1024 characters
- [ ] SKILL.md is under 500 lines
- [ ] No duplicate information between SKILL.md and references
- [ ] All referenced files exist
- [ ] Scripts tested and working
- [ ] Progressive disclosure applied (core in SKILL.md, details in references/)

### After Development

- [ ] `quick_validate.py` passes
- [ ] Trigger testing: 3-5 should-trigger and 2-3 should-not-trigger prompts verified
- [ ] Functional test on realistic task completed
- [ ] Packaging with `package_skill.py` succeeds (if distributing)
