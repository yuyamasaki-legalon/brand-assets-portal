---
name: i18n-sandbox
description: "sandbox ページに軽量な多言語化（i18n）を追加。WHEN: sandbox ページの多言語化・翻訳対応を依頼されたとき、言語切替機能を追加するとき。NOT WHEN: template ファイルの翻訳（template は編集禁止）、sandbox 以外の i18n。前提: 対象ページが structured-prototype パターンに従い、useTranslation hook が存在すること。"
---

# Sandbox ページへの i18n 追加

既存または新規の sandbox ページに多言語化対応を追加する。

---

## 前提条件

- 対象ページが structured-prototype パターン（Container/Presentation 分離）に従っていること
- `src/hooks/useTranslation.ts` が存在すること

---

## 追加手順

### 1. 翻訳ファイルの作成

対象ページの `data/` ディレクトリに `translations.ts` を作成:

```bash
touch src/pages/sandbox/users/{username}/{page-name}/data/translations.ts
```

### 2. 翻訳キーと辞書の定義

```tsx
import type { TranslationDictionary } from "../../../../../hooks";

export type TranslationKey =
  | "pageTitle"
  | "description"
  // ... 必要なキーを追加

export const translations: TranslationDictionary<TranslationKey> = {
  "en-US": {
    pageTitle: "Page Title",
    description: "Description text",
  },
  "ja-JP": {
    pageTitle: "ページタイトル",
    description: "説明テキスト",
  },
};
```

### 3. Presentation.tsx で hook を使用

```tsx
import { useTranslation } from "../../../../../hooks";
import { translations } from "./data/translations";
import type { TranslationKey } from "./data/translations";

export const MyPresentation = (props: Props): JSX.Element => {
  const { t } = useTranslation<TranslationKey>(translations);

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>{t("pageTitle")}</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          {/* ... */}
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
```

---

## 翻訳キーの命名規則

| カテゴリ | プレフィックス/サフィックス | 例 |
|---------|---------------------------|-----|
| ページタイトル | `page*` | `pageTitle`, `pageDescription` |
| ラベル | `*Label` | `statusLabel`, `assigneeLabel` |
| ボタン | `*Button` | `saveButton`, `cancelButton` |
| メッセージ | `*Message` | `successMessage`, `errorMessage` |
| プレースホルダー | `*Placeholder` | `searchPlaceholder` |

---

## 動的な値を含む翻訳

補間が必要な場合は、テンプレートリテラルで置換:

```tsx
// translations.ts
export const translations: TranslationDictionary<TranslationKey> = {
  "en-US": {
    greeting: "Hello, {name}!",
    itemCount: "{count} items",
  },
  "ja-JP": {
    greeting: "こんにちは、{name}さん!",
    itemCount: "{count}件",
  },
};

// 使用時
const text = t("greeting").replace("{name}", userName);
const countText = t("itemCount").replace("{count}", String(items.length));
```

---

## 言語切り替えの確認

Aegis Lab Setting パネル（右下のフローティングボタン）の **Tools** タブで **Provider locale** を切り替えると、翻訳が反映される。

---

## 共有レイアウト（サイドバー等）の翻訳

> **⚠️ 警告: `src/pages/template/` のファイルは絶対に編集しないこと。**
> template は全 sandbox ページの共通基盤であり、特定ページの翻訳のために変更してはならない。

template の `LocSidebarLayout` 等の共有レイアウトを使っている場合、ナビゲーションラベルを翻訳するには **sandbox 側に `_shared/` をコピーして翻訳対応版を作る**。

### 手順

#### 1. sandbox 側に `_shared/` ディレクトリを作成

```bash
mkdir -p src/pages/sandbox/{service}/{username}/{page-name}/_shared/data
```

#### 2. ナビゲーション翻訳ファイルを作成

`_shared/data/translations.ts` にナビゲーション用の翻訳キーと辞書を定義:

```tsx
import type { TranslationDictionary } from "../../../../../../../hooks";

export type NavigationTranslationKey =
  | "nav.home"
  | "nav.search"
  // ... ナビゲーション項目に合わせて追加

export const navigationTranslations: TranslationDictionary<NavigationTranslationKey> = {
  "en-US": {
    "nav.home": "Home",
    "nav.search": "Search",
  },
  "ja-JP": {
    "nav.home": "ホーム",
    "nav.search": "検索",
  },
};
```

#### 3. ナビゲーション定義を翻訳対応に変更

template の `locNavigation.ts` をコピーし、`label: string` → `labelKey: NavigationTranslationKey` に変更:

```tsx
// BEFORE (template 版): label は直接文字列
{ id: "home", icon: LfHome, label: "ホーム", href: "..." }

// AFTER (sandbox 翻訳版): labelKey で翻訳キーを参照
{ id: "home", icon: LfHome, labelKey: "nav.home", href: "..." }
```

#### 4. サイドバーレイアウトに翻訳を組み込む

template の `LocSidebarLayout.tsx` をコピーし、`useTranslation` を追加:

```tsx
import { useTranslation } from "../../../../../../hooks";
import { type NavigationTranslationKey, navigationTranslations } from "./data/translations";

// レンダリング部分で t() を使用
const { t } = useTranslation<NavigationTranslationKey>(navigationTranslations);
// ...
<Link to={href}>{t(labelKey)}</Link>
```

#### 5. ページ側の import を sandbox 版に切り替える

```tsx
// BEFORE: template から直接 import
import { LocSidebarLayout } from "../../../../template/loc/_shared/LocSidebarLayout";

// AFTER: sandbox 側の翻訳対応版を import
import { LocSidebarLayout } from "./_shared/LocSidebarLayout";
```

### 参考実装

`src/pages/sandbox/loc/wataryooou/template-loc-i18n/_shared/` に完全な実装例がある:

- `_shared/LocSidebarLayout.tsx` - 翻訳対応サイドバーレイアウト
- `_shared/locNavigation.ts` - `labelKey` を使うナビゲーション定義
- `_shared/data/translations.ts` - ナビゲーション翻訳辞書

---

## チェックリスト

```
- [ ] data/translations.ts を作成
- [ ] TranslationKey 型を定義
- [ ] 全てのロケール（en-US, ja-JP）で同じキーを定義
- [ ] Presentation.tsx で useTranslation を使用
- [ ] template から import している共有コンポーネント（サイドバー等）も翻訳対象に含める
- [ ] template のファイルを編集していないことを確認
- [ ] FloatingSourceCodeViewer で locale 切り替えを確認
```

---

## 関連スキル

- `/structured-prototype` - Container/Presentation 分離パターン
- `/component-tips` - Aegis コンポーネントの使い方
