# Loading Patterns 詳細リファレンス

## 1. Skeleton — 初回ページ読込

**いつ使うか**: ページの初回読込時に、最終的なレイアウトの形状を模したプレースホルダーを表示

**コンポーネント構成**:
- `Skeleton.Table`: テーブル全体のローディング（`numberOfRows` で行数指定）
- `Skeleton.Text`: テキスト行のローディング（`width` で幅指定）
- `Skeleton`: 任意のサイズの矩形（`width`, `height`, `radius` で指定）

**パターン別構成**:
| パターン | 構成 |
|---------|------|
| リスト | フィルタ Skeleton + `Skeleton.Table` |
| 詳細 | `Skeleton.Text` + 2カラム grid の Skeleton |
| フォーム | ラベル Skeleton + 入力欄 Skeleton + ボタン Skeleton |
| ヘッダー | ヘッダー Skeleton + `Skeleton.Text` + コンテンツ Skeleton |

**a11y 要件（必須）**:
```tsx
<div role="alert" aria-busy="true" aria-live="polite">
  <Skeleton.Table numberOfRows={8} />
</div>
```

Skeleton を含むコンテナに `role="alert"`, `aria-busy="true"`, `aria-live="polite"` を **必ず** 付与すること。

**テンプレート**: `src/pages/template/states/loading/SkeletonPatterns.tsx`

---

## 2. ProgressBar / ProgressCircle — 後続操作

**いつ使うか**: コンテンツの再読み込み、バックグラウンド処理の進捗表示

**コンポーネント構成**:
- `ProgressBar`: 横幅いっぱいのバー型。`value` 省略で indeterminate
- `ProgressBar.Label`: 進捗率テキスト表示
- `ProgressCircle`: インラインの円形。`size` で xSmall〜xLarge

**使い分け**:
| 状況 | コンポーネント |
|------|-------------|
| ページ上部の再読込 | `ProgressBar size="small"` (indeterminate) |
| 進捗率あり | `ProgressBar value={n}` + `ProgressBar.Label` |
| インライン読込 | `ProgressCircle size="small"` + テキスト |
| Combobox ポップオーバー内 | `ProgressCircle size="xSmall"` |

**テンプレート**: `src/pages/template/states/loading/ProgressIndicators.tsx`

---

## 3. ProgressOverlay — ブロッキング操作

**いつ使うか**: 保存処理、ファイルアップロードなど、ユーザー操作をブロックする必要がある場合

**コンポーネント構成**:
- `ProgressOverlay`: `open` で表示制御
- `root` prop: `useRef` で特定要素にスコープを限定可能

**使い分け**:
| 状況 | 設定 |
|------|------|
| 全画面ブロック | `<ProgressOverlay open={isLoading} />` |
| 特定エリアのみ | `<ProgressOverlay open={isLoading} root={scopedRef} />` |

**重要ルール**:
- スコープ付きの場合、root 要素に `position: relative` を設定すること
- 処理完了後は必ず `open={false}` に戻すこと

**テンプレート**: `src/pages/template/states/loading/ProgressIndicators.tsx`

---

## 4. Button / Combobox loading — コンポーネントレベル

**いつ使うか**: フォーム送信中や非同期オプション読込時

**Button loading**:
```tsx
<ButtonGroup>
  <Button variant="plain" disabled={isSubmitting}>キャンセル</Button>
  <Button loading={isSubmitting} onClick={handleSubmit}>保存</Button>
</ButtonGroup>
```

**重要ルール**:
- 送信ボタンに `loading` 設定時、他のすべての入力/ボタンは `disabled` にする
- `loading` は自動的に `disabled` を含む

**Combobox loading**:
```tsx
<Combobox
  options={isLoading ? [] : options}
  loading={isLoading}
  placeholder="部署を選択"
/>
```

**重要ルール**:
- loading 中は `options` を空配列にする
- loading 完了後にオプションを設定

**テンプレート**: `src/pages/template/states/loading/ButtonAndComboboxLoading.tsx`
