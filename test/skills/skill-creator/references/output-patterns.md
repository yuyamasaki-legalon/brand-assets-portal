# Output Patterns

Use these patterns when skills need to produce consistent, high-quality output.

## Template Pattern

Provide templates for output format. Match the level of strictness to your needs.

**For strict requirements (like API responses or data formats):**

```markdown
## Report structure

ALWAYS use this exact template structure:

# [Analysis Title]

## Executive summary
[One-paragraph overview of key findings]

## Key findings
- Finding 1 with supporting data
- Finding 2 with supporting data
- Finding 3 with supporting data

## Recommendations
1. Specific actionable recommendation
2. Specific actionable recommendation
```

**For flexible guidance (when adaptation is useful):**

```markdown
## Report structure

Here is a sensible default format, but use your best judgment:

# [Analysis Title]

## Executive summary
[Overview]

## Key findings
[Adapt sections based on what you discover]

## Recommendations
[Tailor to the specific context]

Adjust sections as needed for the specific analysis type.
```

## Examples Pattern

For skills where output quality depends on seeing examples, provide input/output pairs:

```markdown
## Commit message format

Generate commit messages following these examples:

**Example 1:**
Input: Added user authentication with JWT tokens
Output:
```
feat(auth): implement JWT-based authentication

Add login endpoint and token validation middleware
```

**Example 2:**
Input: Fixed bug where dates displayed incorrectly in reports
Output:
```
fix(reports): correct date formatting in timezone conversion

Use UTC timestamps consistently across report generation
```

Follow this style: type(scope): brief description, then detailed explanation.
```

Examples help Claude understand the desired style and level of detail more clearly than descriptions alone.

## Interactive Dialog Pattern

For skills that gather information through conversation before producing output:

```markdown
## Information gathering

Collect requirements through focused questions. Ask one topic at a time to avoid overwhelming the user.

### Phase 1: Core requirements
Ask about the primary goal and constraints:
- "What is the main objective?"
- "Who is the target audience?"

### Phase 2: Details
Based on Phase 1 answers, ask follow-up questions:
- If [condition A] → ask about [detail X]
- If [condition B] → ask about [detail Y]

### Phase 3: Confirmation
Summarize collected information and confirm before proceeding:
"Here is what I'll create: [summary]. Proceed?"
```

Use this pattern when the skill needs user input to customize its output (e.g., prd-generator collecting requirements section by section).

## Structured Report Pattern

For skills that produce analysis or audit results with consistent structure:

```markdown
## Output format

### Summary
[1-2 sentence overview of findings]

### Results

#### Critical (must fix)
| # | Location | Issue | Recommendation |
|---|----------|-------|----------------|
| 1 | file:line | Description | How to fix |

#### Warning (should fix)
| # | Location | Issue | Recommendation |
|---|----------|-------|----------------|
| 1 | file:line | Description | How to fix |

#### Info (optional improvement)
- Description and suggestion

### Score: [X/Y checks passed]
```

Use this pattern when the skill evaluates artifacts against defined criteria and needs to communicate results clearly (e.g., a11y-audit producing WCAG compliance reports).

## Language Consistency Note

For skills in the aegis-lab project:

- **Japanese skills:** Use Japanese for section headers, descriptions, and explanatory text. Code examples and technical terms (component names, file paths, CLI commands) remain in English.
- **English skills:** Use English throughout.
- **Mixed output:** When a skill produces both prose and structured data (tables, code), keep prose in the skill's primary language and technical content in English.
