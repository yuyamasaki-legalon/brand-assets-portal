---
name: icon-finder
description: Aegis アイコンをキーワードで検索し、適切なアイコンを提案。検索、削除、警告などの機能に適したアイコンを見つける。
---

# アイコンファインダー

Aegis デザインシステムのアイコンをキーワードで検索し、適切なアイコンを提案する。

## 検索手順

### 1. キーワードデータベースを検索

```bash
rg "{検索キーワード}" skills/icon-finder/IconKeywords.md
```

`rg` が使えない場合は `grep` を使う:

```bash
grep "{検索キーワード}" skills/icon-finder/IconKeywords.md
```

### 2. 検索結果からアイコン名を取得

結果例:
```
| LfMagnifyingGlass | 虫眼鏡 ルーペ 検索 サーチ |
```

この場合、`LfMagnifyingGlass` がアイコン名。

### 3. 実装コードを提案

```tsx
import { LfMagnifyingGlass } from "@legalforce/aegis-icons";
import { Icon } from "@legalforce/aegis-react";

<Icon><LfMagnifyingGlass /></Icon>
```

## よくある検索

| 用途 | 検索キーワード | 推奨アイコン |
|------|---------------|-------------|
| 検索機能 | 検索、サーチ | `LfMagnifyingGlass` |
| 削除ボタン | 削除、ゴミ箱 | `LfTrash` |
| 追加ボタン | 追加、プラス | `LfPlusLarge` |
| 設定 | 設定、歯車 | `LfSetting` |
| 警告 | 警告 | `LfWarningTriangle` |
| エラー | 警告、エラー | `LfWarningCircle` |
| 成功 | チェック | `LfCheckCircle` |
| 情報 | インフォメーション | `LfInformationCircle` |
| 編集 | 編集、ペン | `LfPen` |
| 保存 | チェック | `LfCheck` |
| キャンセル | 閉じる | `LfCloseLarge` |
| ダウンロード | ダウンロード | `LfDownload` |
| アップロード | アップロード | `LfUpload` |
| 共有 | シェア、共有 | `LfShare` |
| コピー | コピー | `LfCopy` |
| フィルター | フィルター | `LfFilter` |
| ソート | ソート、並べ替え | `LfSortLarge` |
| お気に入り | 星、お気に入り | `LfStar` |
| AI機能 | AI | `LfAiSparkles`, `LfWand` |

## 検索のコツ

1. **日本語と英語の両方を試す**
   - 「検索」がなければ「search」「サーチ」

2. **類義語を考慮する**
   - 「削除」→「ゴミ箱」「trash」「remove」

3. **複数候補がある場合**
   - 形状や用途で絞り込む
   - 例: 警告アイコンは三角・丸・四角などバリエーションあり

## 使用例

### ボタンにアイコンを追加

```tsx
import { LfTrash } from "@legalforce/aegis-icons";
import { Button } from "@legalforce/aegis-react";

<Button variant="destructive" leadingIcon={<LfTrash />}>
  削除
</Button>
```

### IconButton として使用

```tsx
import { LfMagnifyingGlass } from "@legalforce/aegis-icons";
import { Icon, IconButton } from "@legalforce/aegis-react";

<IconButton aria-label="検索">
  <Icon>
    <LfMagnifyingGlass />
  </Icon>
</IconButton>
```

### アイコン単体表示

```tsx
import { LfSetting } from "@legalforce/aegis-icons";
import { Icon } from "@legalforce/aegis-react";

<Icon size="large">
  <LfSetting />
</Icon>
```

## MCP ツール

最新のアイコン一覧を取得:
```
mcp__aegis__list_icons
```

## 関連ドキュメント

- `skills/icon-finder/IconKeywords.md` - キーワードデータベース
- `docs/rules/component/Icon.md` - Icon コンポーネントの使用方法
