# Empty Patterns 詳細リファレンス

## EmptyState サイズ選択ルール

| サイズ | 用途 | visual | 例 |
|-------|------|--------|-----|
| `large` | ページ全体 | illustration (`ErrorCat1`, `Box` 等) | ページレベルのエラー、初期状態 |
| `medium` | リスト/メインコンテンツ | illustration または `Icon size="xLarge"` | データなし、検索結果なし |
| `small` | ペイン/Combobox/Dialog | **Icon のみ（illustration 禁止）** | サイドパネル、ポップオーバー |

## パターン詳細

### 1. ページ全体（large）

**いつ使うか**: ページ全体のフェッチエラー、サービス初期状態

```tsx
<EmptyState
  size="large"
  orientation="vertical"
  visual={<ErrorCat1 />}
  title={<Text as="span" variant="title.small">エラーが発生しました</Text>}
  action={<Button minWidth="wide">再読み込み</Button>}
>
  <Text as="span">サーバーで問題が発生しているためページを表示できません。</Text>
</EmptyState>
```

**重要ルール**:
- `orientation="vertical"` を使用
- title に `Text variant="title.small"` を使用可
- action ボタンに `minWidth="wide"` で適切な幅を確保

---

### 2. リスト/メインコンテンツ（medium）

**いつ使うか**: データ一覧が空、検索結果が0件

**データなし**:
```tsx
<EmptyState
  size="medium"
  visual={<Box />}
  title="案件がありません"
  action={<Button variant="subtle">新規作成</Button>}
>
  <Text variant="body.small">案件を作成して管理を始めましょう。</Text>
</EmptyState>
```

**検索結果なし**:
```tsx
<EmptyState
  size="medium"
  visual={<Icon size="xLarge"><LfMagnifyingGlass /></Icon>}
  title="検索結果がありません"
  action={<Button variant="subtle">フィルタをリセット</Button>}
>
  <Text variant="body.small">検索条件を変更してお試しください。</Text>
</EmptyState>
```

**重要ルール**:
- データなしの場合は illustration + 「新規作成」action
- 検索結果なしの場合は Icon + 「フィルタをリセット」action
- 検索結果なしでは `LfMagnifyingGlass` アイコンを `Icon size="xLarge"` で使用

---

### 3. ペイン/Combobox/Popover（small）

**いつ使うか**: サイドパネル、ドロップダウン、ポップオーバー内の空状態

```tsx
<EmptyState
  size="small"
  visual={<Icon><LfSparkles /></Icon>}
  title="AI要約がありません"
  action={<Button variant="subtle" size="small">生成</Button>}
>
  <Text variant="body.small">AIで案件の要約を生成できます。</Text>
</EmptyState>
```

**テキストのみ（visual なし）**:
```tsx
<EmptyState size="small" title="該当する選択肢がありません">
  <Text variant="body.small">別のキーワードで検索してください。</Text>
</EmptyState>
```

**重要ルール**:
- **illustration 使用禁止** — `Icon` コンポーネントのみ使用可
- action ボタンは `size="small"` を使用
- Combobox 内は visual なしでテキストのみも可

---

## illustration vs Icon の判断

```
size="large" or "medium" ?
├── Yes → illustration (`@legalforce/aegis-illustrations/react`) OK
│         Icon (`@legalforce/aegis-icons/react` + `<Icon>`) も OK
└── No (size="small") → illustration 禁止。Icon のみ使用可
```

**テンプレート**: `src/pages/template/states/empty/EmptyStatePatterns.tsx`
