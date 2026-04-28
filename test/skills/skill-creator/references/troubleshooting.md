# Troubleshooting

Common problems when developing skills, with causes and solutions.

## Skill Doesn't Trigger

**Symptoms:** Claude ignores the skill even when the user prompt clearly relates to it.

**Causes and fixes:**

| Cause | Fix |
|-------|-----|
| Description is too vague | Add specific trigger contexts: "Use when..." with concrete examples |
| Description uses abstract terms | Replace "helps with documents" → "creates, edits, and analyzes .docx files" |
| Trigger scenarios not listed | Enumerate use cases: "(1) Creating..., (2) Editing..., (3) Reviewing..." |
| Skill name doesn't match domain | Ensure the name reflects the primary function (e.g., `pdf-editor` not `document-tool`) |

**Quick fix template:** Add explicit trigger conditions to description:

```yaml
description: >-
  [What it does]. Use when [trigger 1], [trigger 2], or [trigger 3].
```

## Skill Triggers Too Broadly

**Symptoms:** Skill activates for unrelated prompts, interfering with other skills or normal operation.

**Causes and fixes:**

| Cause | Fix |
|-------|-----|
| Description is too broad | Narrow scope: "all documents" → ".docx files only" |
| Generic terms without qualifiers | Add specifics: "code review" → "accessibility code review using WCAG 2.1 AA" |
| Missing exclusion signals | Add "Not for [excluded case]" if disambiguation is needed |

**Quick fix template:** Constrain the description scope:

```yaml
description: >-
  [Specific function] for [specific domain/format].
  [Trigger condition]. Not for [common confusion case].
```

## Instructions Are Ignored

**Symptoms:** Skill triggers correctly but Claude doesn't follow the instructions in SKILL.md body.

**Causes and fixes:**

| Cause | Fix |
|-------|-----|
| Instructions are too verbose | Cut explanations; use concise examples instead |
| Conflicting or ambiguous directions | Remove contradictions; use consistent language |
| Important steps buried in text | Use numbered lists for critical workflows |
| No concrete examples | Add input/output examples showing expected behavior |
| Too many options without guidance | Add a decision tree or default recommendation |

**Key principle:** Claude already knows most things. Only include what's **non-obvious** and **specific to your domain**.

## Context Window Overflow

**Symptoms:** Skill works but responses are truncated, or Claude loses track of earlier instructions.

**Causes and fixes:**

| Cause | Fix |
|-------|-----|
| SKILL.md exceeds 500 lines | Split into SKILL.md (core) + references/ (details) |
| All references loaded eagerly | Add "Read [file] only when [condition]" guidance |
| Duplicate content in SKILL.md and references | Keep info in one place only; reference from the other |
| Large code blocks in SKILL.md | Move to scripts/ or references/; summarize in SKILL.md |

**Progressive disclosure checklist:**
- [ ] SKILL.md contains only core workflow and navigation
- [ ] Reference files have clear "when to read" conditions in SKILL.md
- [ ] No information is duplicated between files

## aegis-lab Specific Issues

### MCP Tool Connection

**Problem:** MCP tools (`mcp__aegis__list_components` etc.) are not available.

**Fix:** Verify `.mcp.json` is configured. See `docs/onboarding-guide.md` for setup.

### skills/ Directory Not Recognized

**Problem:** Skill is in `skills/` but Claude doesn't see it.

**Fix:** Verify the symlink exists: `.claude/skills -> ../skills`. If missing:

```bash
cd .claude && ln -s ../skills skills
```

### Japanese/English Mixed Content

**Problem:** Skill mixes languages inconsistently.

**Guidelines:**
- Choose a primary language for the skill (Japanese is the project default)
- `name` field: always English hyphen-case (`my-skill-name`)
- `description` field: match the primary language of the skill
- Body and references: consistent within each file; mixing is acceptable across files
- Output to users: match the user's language or the skill's primary language
