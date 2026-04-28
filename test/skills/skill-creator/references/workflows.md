# Workflow Patterns

## Sequential Workflows

For complex tasks, break operations into clear, sequential steps. It is often helpful to give Claude an overview of the process towards the beginning of SKILL.md:

```markdown
Filling a PDF form involves these steps:

1. Analyze the form (run analyze_form.py)
2. Create field mapping (edit fields.json)
3. Validate mapping (run validate_fields.py)
4. Fill the form (run fill_form.py)
5. Verify output (run verify_output.py)
```

## Conditional Workflows

For tasks with branching logic, guide Claude through decision points:

```markdown
1. Determine the modification type:
   **Creating new content?** → Follow "Creation workflow" below
   **Editing existing content?** → Follow "Editing workflow" below

2. Creation workflow: [steps]
3. Editing workflow: [steps]
```

## Decision Tree Workflows

For tasks where Claude must select one option from multiple candidates based on criteria:

```markdown
## Select the appropriate layout

Evaluate the page requirements against these criteria:

| Requirement | Layout |
|-------------|--------|
| Data table with search/filter | list-layout |
| Single entity with tabs | detail-layout |
| Form with sections | form-layout |
| Full-screen interactive (chat, canvas) | fill-layout |
| Key-value configuration | settings-layout |

1. Identify the primary content type
2. Match to the layout table above
3. If multiple layouts could work, prefer the one that matches the dominant content
4. Apply the selected layout template from `src/pages/template/`
```

Use decision trees when the skill must choose between well-defined options based on observable criteria (e.g., page-layout-assistant selecting a layout pattern).

## Audit / Review Workflows

For tasks that analyze existing code or content and produce a structured report:

```markdown
## Audit process

1. **Collect targets**: Identify files to audit (glob pattern or user-specified)
2. **Run checks**: For each target, evaluate against the checklist:
   - [ ] Check category A
   - [ ] Check category B
   - [ ] Check category C
3. **Classify findings**: Assign severity (error / warning / info)
4. **Generate report**: Output findings grouped by severity

### Report format
**Errors** (must fix):
- [file:line] Description of issue

**Warnings** (should fix):
- [file:line] Description of issue

**Info** (consider):
- [file:line] Suggestion
```

Use audit workflows when the skill systematically reviews artifacts against a defined standard (e.g., a11y-audit checking WCAG compliance, writing-review checking UI text guidelines).