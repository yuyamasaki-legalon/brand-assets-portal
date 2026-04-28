# foreground-subtle ScrollArea workaround fix

## 修正前の課題

scrollbar hover 色をテーマカスタマイズの影響から守るために、sandbox-builder では
`--aegis-color-foreground-subtle` を global に
`--aegis-color-foreground-xSubtle` へ差し替えていた。

この実装により、ScrollArea 以外でも `foreground-subtle` を使う箇所がすべて
`xSubtle` 相当で描画されていた。

代表例:

- TextField の blank / placeholder
- Textarea の placeholder
- FormControl caption
- subtle text を使う各種 component

その結果、Aegis 本番では `foreground-subtle` で描画される input placeholder が、
prototype では `foreground-xSubtle` として扱われていた。

## 原因

Aegis 本体の ScrollArea / DataTable の scrollbar thumb hover が
`foreground-subtle` を参照している。

この既知問題に対して、sandbox-builder では token の意味を保ったまま局所対処する代わりに、
semantic token 自体を global override で潰してしまっていた。

## 修正箇所

### 1. global override を除去

`token-overrides/tokens.ts`

- `buildTokenOverrideStyle()` 末尾の
  `--aegis-color-foreground-subtle: var(--aegis-color-foreground-xSubtle)`
  を削除

### 2. ScrollArea workaround を局所化

`token-overrides/tokens.ts`

- `buildScrollAreaWorkaroundCss()` を追加
- `buildThemeCssText()` に export 用 CSS を追加
- runtime 側でも同じ workaround CSS を注入
- ScrollArea / DataTable の scrollbar thumb hover だけを
  `foreground-xSubtle` に固定

### 3. contrast spec を本番実装に合わせて修正

`token-overrides/contrast-utils.ts`

- input placeholder の foreground を `xSubtle` から `subtle` に修正

### 4. docs を更新

- `docs/theme/contrast-check-requirements.md`
- `docs/customize-theme.md`
- `MEMO.md`

## 修正理由

semantic token の意味を保つことを優先するため。

ScrollArea の既知問題は ScrollArea 自体の CSS に閉じた workaround で対処できる一方、
`foreground-subtle` の global override は placeholder や caption など、
本来 Aegis 本番と一致させるべき subtle 表現まで壊してしまう。

そのため、sandbox-builder では

- token の意味は本番どおりに戻す
- scrollbar だけ局所 CSS で守る

という責務分離へ変更した。

## Aegis 更新時の確認事項

今回の workaround は、Aegis の ScrollArea / DataTable が現在出力している
scrollbar thumb の class 名に依存している。

そのため Aegis 更新時は、次を確認すること。

- ScrollArea thumb の selector が変わっていないか
- DataTable thumb の selector が変わっていないか
- scrollbar hover が依然として `foreground-subtle` を参照しているか
- Aegis 本体にスクロールバー専用トークンが追加されていないか

もし Aegis 側で selector や実装が変わった場合は、
`buildScrollAreaWorkaroundCss()` の selector を更新するか、
専用トークンが追加されていれば workaround 自体を削除する。
