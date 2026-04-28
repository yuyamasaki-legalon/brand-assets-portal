# Primary Scale Resolution Fix

2026-04-21 時点で修正した、sandbox-builder の semantic token 解決不具合の記録。

## 修正前の課題

`buildTokenOverrideStyle({ paletteText: INITIAL_PALETTE_TEXT, designTokenText: "{}" })` の時点で、次の semantic token が未解決参照のまま残っていた。

- `--aegis-color-background-danger-bold`
- `--aegis-color-background-success-bold`
- `--aegis-color-background-warning-bold`
- `--aegis-color-background-information-bold`
- `--aegis-color-background-accent-yellow-subtle-pressed`
- `--aegis-color-border-danger-bold`
- `--aegis-color-border-information-bold`
- `--aegis-color-border-warning`
- `--aegis-color-border-warning-bold`

値はすべて `{internal.color.palette.primary.*}` のままで、preview だけでなく runtime の semantic token 注入自体が壊れていた。

## 原因

原因は `primary` スケール生成の仕様ズレだった。

- `background.tokens.json` / `border.tokens.json` は `primary.red.800` や `primary.yellow.500` のような参照を前提にしている
- `docs/theme/palette-spec.md` でも、`primary` は `800` を opaque identity とする前提で記述されている
- しかし実装では `palette-config.json` の `primaryBaseColors` をそのまま出力キーとして扱い、`red -> 600`、`yellow -> 400` のように `800` 未満で打ち切る primary スケールを生成していた

その結果、`INITIAL_PALETTE.primary.red.800` のような参照先が存在せず、`resolveTokenCategory()` が semantic token を実色へ解決できなかった。

## 修正箇所

### `token-overrides/palette-computer.ts`

- semantic token 用 primary スケール生成を修正
- `primaryBaseColors[color]` は「どの scale tone を identity として採用するか」を表し、出力先は常に `primary.<color>.800` になるよう変更
- 出力 tone 群は `palette-config.json` の `primaryScales` を使って生成するよう変更

### `token-overrides/tokens.ts`

- `INITIAL_PALETTE.primary` 生成時に `primaryScales` を使うよう変更
- これにより `buildBaseLocalTokenStyle()` が最初から解決済みの semantic token を出力できるようになった

### `token-overrides/contrast-utils.ts`

- `primary.*` 参照の RGB 解決ロジックを semantic token と同じ仕様へ揃えた
- これにより Contrast Check でも `primary.red.800` / `primary.yellow.500` を正しく評価できる

## 修正理由

runtime の CSS 変数解決、Contrast Check、docs の 3 つが別々の primary スケール前提を持っている状態は、今後のテーマ調整で再発しやすい。

そのため、以下の 1 本化を行った。

- semantic token の primary 解決仕様
  - `800` が opaque identity
  - `primaryBaseColors` は identity に採用する source tone を決める
  - `primaryScales` は出力 tone 群と alpha を決める

## 確認

修正後、次の確認を実施した。

- `buildTokenOverrideStyle({ paletteText: INITIAL_PALETTE_TEXT, designTokenText: "{}" })` で `{internal.color.palette...}` が 0 件
- `INITIAL_PALETTE.primary.red|teal|yellow|blue` に `800` が存在
- `pnpm exec tsc --noEmit` が成功
