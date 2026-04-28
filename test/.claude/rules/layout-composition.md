---
paths: src/pages/**/*.tsx
---

# Page Layout Composition

## Build Order (3 Steps)
1. **Frame**: Start with PageLayout as the base
2. **Internal Layout**: Add Aegis layout components inside
3. **Details**: Apply variants, sizes, and spacing tokens

## PageLayout Hierarchy
```
PageLayout
├── PageLayoutSidebar (optional)
├── PageLayoutContent
│   ├── PageLayoutHeader (optional)
│   ├── PageLayoutBody
│   └── PageLayoutFooter (optional)
└── PageLayoutPane (optional)
```

## Reference Patterns
See `src/pages/template/pagelayout/` for examples:
- BasicLayout - Simple content area
- WithSidebar - Left sidebar navigation
- WithPane - Right side panel
- WithResizablePane - Adjustable panel
- ScrollInsideLayout - Scrollable content
- WithStickyContainer - Sticky header/footer

## Responsive Guidelines
- Standard: 1280px minimum
- Flexible scaling up to 1920px

## スキル参照
レイアウトパターンの選択が必要な場合（一覧 / 詳細 / 設定など）→ `/page-layout-assistant` スキルを使用。
