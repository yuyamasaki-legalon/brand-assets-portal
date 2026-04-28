---
name: page-layout-assistant
description: "PageLayout の適切なパターンを提案。sandbox ページの新規作成時、「画面を作って」「UI を実装して」「ページを作って」等の指示時に proactively 使用。一覧、詳細、設定、Chat UI などのレイアウト選択や構成の質問時にも使用。NOT WHEN: レイアウトが既に決まっていてコンポーネント実装のみの場合、Word Add-in レイアウト（→ word-addin-layout）。"
---

# PageLayout アシスタント

Aegis デザインシステムの PageLayout コンポーネントから、ユースケースに最適なレイアウトパターンを選択・提案する。

## Step 0: テンプレートカタログ検索（必須）

レイアウトパターンを選択する前に、まず `src/pages/template/CATALOG.md` をキーワード検索して最も近い既存テンプレートを特定する。テンプレートが見つかったら、そのソースコードを読んでから下記パターン選択に進む。

## 基本パターン（5種類）

### パターン1: 一覧画面
- **Slot**: Header, Sidebar, Main
- **用途**: データの一覧表示、管理画面
- **例**: `src/pages/template/loc/dashboard/`

### パターン1.1: 一覧 ＋ 詳細表示
- **Slot**: Header, Sidebar, Main, Pane(End)
- **用途**: 一覧選択 → 右ペインで詳細表示
- **例**: `src/pages/template/loc/`

### パターン2: 詳細・編集画面
- **Slot**: Header, Main, Pane(End), SideNav(End)
- **用途**: アイテム詳細表示・編集
- **例**: `src/pages/template/fill-layout/`

### パターン3: 設定画面
- **Slot**: Header, Sidebar, Pane(Start), Main
- **用途**: カテゴリ分けされた設定項目
- **例**: `src/pages/template/loc/setting-page/`

### パターン4: Chat UI
- **Slot**: Header, Sidebar, Main, Pane(End)
- **用途**: チャット + 成果物表示
- **例**: `src/pages/template/ChatTemplate.tsx`

### パターン5: ダイアログ
- **構成**: Dialog コンポーネント
- **用途**: 短いタスク、確認
- **例**: `src/pages/template/dialog/`

## 判断フロー

1. **一覧を表示する？**
   - Yes → パターン1 or 1.1
   - No → 次へ

2. **詳細選択時に画面遷移する？**
   - Yes → パターン1（一覧のみ）
   - No → パターン1.1（一覧＋詳細）

3. **設定・設定カテゴリがある？**
   - Yes → パターン3

4. **チャット形式？**
   - Yes → パターン4

5. **単一アイテムの詳細・編集？**
   - Yes → パターン2

## PageLayout 構造図

```
┌──────────────────────────────────────────────────────────┐
│ Sidebar │ Header                                         │
│         ├────────────────────────────────────────────────┤
│         │ SideNav │ Pane    │ Main        │ Pane    │ SideNav │
│         │ (Start) │ (Start) │             │ (End)   │ (End)   │
│         ├─────────┴─────────┴─────────────┴─────────┴─────────┤
│         │ Footer                                              │
└──────────────────────────────────────────────────────────────┘
```

## ルール（必須）

- `Sidebar` と `SideNav(Start)` は同時使用禁止
- template の例を参照、sandbox は参照しない
- 独自の margin/padding は避け、デザイントークンを使用
- ページ組み立て順序: PageLayout → 内部レイアウト → variant/spacing

## 参照ドキュメント

詳細なパターンとルール:
- `docs/rules/ui/03_layouts.md` - レイアウトパターン詳細
- `docs/rules/ui/09_layout_composition.md` - Sandbox ページ組み方ガイド

## コード例

```tsx
import { PageLayout } from "@legalforce/aegis-react";

// パターン1: 一覧画面
<PageLayout>
  <PageLayout.Sidebar>{/* ナビゲーション */}</PageLayout.Sidebar>
  <PageLayout.Header>{/* ヘッダー */}</PageLayout.Header>
  <PageLayout.Main>{/* メインコンテンツ */}</PageLayout.Main>
</PageLayout>

// パターン1.1: 一覧 + 詳細
<PageLayout>
  <PageLayout.Sidebar>{/* ナビゲーション */}</PageLayout.Sidebar>
  <PageLayout.Header>{/* ヘッダー */}</PageLayout.Header>
  <PageLayout.Main>{/* 一覧 */}</PageLayout.Main>
  <PageLayout.Pane position="end">{/* 詳細 */}</PageLayout.Pane>
</PageLayout>

// パターン3: 設定画面
<PageLayout>
  <PageLayout.Sidebar>{/* グローバルナビ */}</PageLayout.Sidebar>
  <PageLayout.Header>{/* ヘッダー */}</PageLayout.Header>
  <PageLayout.Pane position="start">{/* 設定カテゴリ NavList */}</PageLayout.Pane>
  <PageLayout.Main>{/* 設定項目 */}</PageLayout.Main>
</PageLayout>
```
