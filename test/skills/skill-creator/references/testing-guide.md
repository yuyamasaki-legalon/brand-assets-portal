# Testing Guide

Thorough testing ensures a skill triggers correctly and produces quality output. Testing has three phases: trigger testing, functional testing, and structural validation.

## 1. Trigger Testing

Verify the skill activates for the right prompts and stays silent for unrelated ones.

### Should-trigger prompts (aim for 3-5)

Write user prompts that should activate the skill. Cover different phrasings and contexts:

```
Skill: pdf-editor
✓ "Help me rotate this PDF"
✓ "I need to merge these two PDF files"
✓ "Extract text from document.pdf"
✓ "Can you add a watermark to my PDF?"
✓ "/pdf-editor invoice.pdf"
```

### Should-not-trigger prompts (aim for 2-3)

Write prompts that are related but should NOT activate the skill:

```
Skill: pdf-editor
✗ "Convert this Word document to PDF" (OS/tool task, not PDF editing)
✗ "What is the PDF specification?" (general knowledge question)
✗ "Help me write a resume" (content creation, not PDF manipulation)
```

### Evaluation

Test each prompt by asking Claude with the skill installed. Record:

| Prompt | Expected | Actual | Pass? |
|--------|----------|--------|-------|
| "Rotate this PDF" | Trigger | Trigger | ✓ |
| "What is PDF?" | No trigger | No trigger | ✓ |

**Target:** 100% of should-trigger prompts activate the skill; 0% of should-not-trigger prompts activate it.

**Common fixes:**
- Skill doesn't trigger → Add more trigger contexts to description
- Skill triggers too broadly → Narrow description with specific conditions

## 2. Functional Testing

Run the skill on real (or realistic) tasks end-to-end to verify output quality.

### Steps

1. **Prepare a test task:** Use a realistic user request that exercises the skill's core workflow
2. **Execute:** Run the skill and observe the full output
3. **Check output quality:**
   - Does the output match the expected format?
   - Are all workflow steps followed?
   - Are bundled scripts/references used correctly?
4. **Edge cases:** Test with unusual inputs (empty files, large inputs, missing data)

### Checklist

- [ ] Core workflow produces correct output
- [ ] Scripts execute without errors
- [ ] References are loaded when needed (not eagerly)
- [ ] Output matches specified format/template
- [ ] Error cases are handled gracefully

## 3. Structural Validation

Run the automated validation script to check SKILL.md structure:

```bash
python skills/skill-creator/scripts/quick_validate.py <path/to/skill>
```

### What it checks

- SKILL.md exists and has valid YAML frontmatter
- `name` field: hyphen-case, max 64 characters
- `description` field: no angle brackets, max 1024 characters
- No unexpected frontmatter properties
- Directory structure is valid

### Additional manual checks

- [ ] SKILL.md is under 500 lines (`wc -l`)
- [ ] All referenced files exist (references/, scripts/, assets/)
- [ ] No TODO placeholders remain in SKILL.md
- [ ] No duplicate information between SKILL.md and reference files

## 4. Performance Comparison (Optional)

For skills that automate existing workflows, compare results with and without the skill:

| Metric | Without skill | With skill |
|--------|--------------|------------|
| Steps to completion | — | — |
| Output quality | — | — |
| Consistency across runs | — | — |

This comparison helps quantify the skill's value and identify areas for improvement.
