# auto-generated-insights.md 出力テンプレート

以下の構造に従って `auto-generated-insights.md` を生成する。

---

```markdown
# {Feature Name} -- Iteration Insights

> Auto-generated from sandbox prototype. Last updated: {YYYY-MM-DD}

## Summary

{開発セッションのイテレーションパターンを1-2文で概要記述}

- **Page**: `src/pages/sandbox/{path}/`
- **PRD**: `auto-generated-prd.md`
- **Total iterations**: {要件収束までのイテレーション回数}

## Refinement Timeline

| # | Timestamp | User Signal | Category | AI Response | Resolution |
|---|-----------|-------------|----------|-------------|------------|
| 1 | {YYYY-MM-DD HH:mm} | {ユーザーの意図を要約} | {Clarification / Correction / Re-request / Direction Change / Escalation} | {AI がどう対応したか} | {Resolved / Ongoing} |

## Pattern Analysis

### Requirement Convergence
- {要件が収束するまでのパターン記述}
- Avg. iterations to converge: {number}

### Friction Points
- {繰り返し調整が必要だった箇所}
- {コンポーネントやレイアウトの特定エリア}

### First-attempt Success
- {初回で受け入れられたエリア}
- {スムーズに進んだ実装箇所}

## Improvement Signals

| Area | Signal | Confidence | Suggested Improvement |
|------|--------|------------|----------------------|
| {component/pattern/workflow} | {何が起きたか} | {0.00-1.00} | {改善提案} |

## Change Log

| Date | Change |
|------|--------|
| {YYYY-MM-DD} | Initial generation |
```

---

## シグナルなしの場合

イテレーションシグナルが検出されない場合、ファイルは作成しない。
