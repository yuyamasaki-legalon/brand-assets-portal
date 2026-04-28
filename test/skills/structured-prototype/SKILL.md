---
name: structured-prototype
description: "UI/ロジック/データを分離した構造化 Prototype（Container/Presentation パターン）を作成。WHEN: 新規プロトタイプを Lib 移行を見据えて作るとき、既存の単一ファイルプロトタイプを構造化するとき。NOT WHEN: 簡単な実験や使い捨ての検証。"
disable-model-invocation: true
---

# Structured Prototype ガイド

新規 Prototype を最初からレイヤー分離した構造で作成し、将来的な Lib 移行を容易にする。

---

## ファイル構造

```
{prototype}/
├── index.tsx          # エクスポートのみ（エントリーポイント）
├── Container.tsx      # ロジック層（state, handlers, 副作用）
├── Presentation.tsx   # UI層（純粋なレンダリング）
├── types.ts           # 型定義（Props, State, データ型）
├── data/
│   ├── constants.ts   # 定数・設定・オプション
│   └── mock.ts        # モックデータ
└── components/        # 子コンポーネント（必要に応じて）
    └── {ComponentName}.tsx
```

---

## 各ファイルの責務

### index.tsx

Container をエクスポートするだけ。ルーティングからのエントリーポイント。

```tsx
export { CaseDetailContainer as default } from "./Container";
```

### Container.tsx

**責務**: ロジック層（state 管理、handlers、API 呼び出し、副作用）

```tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaseDetailPresentation } from "./Presentation";
import { caseData, statusOptions, assigneeOptions } from "./data/constants";
import type { PaneType, TimelineMessage } from "./types";

export const CaseDetailContainer = (): JSX.Element => {
  const navigate = useNavigate();

  // State 定義
  const [paneOpen, setPaneOpen] = useState(true);
  const [paneType, setPaneType] = useState<PaneType>("case-info");
  const [status, setStatus] = useState("in_progress");

  // Handlers 定義
  const handleNavigateBack = () => {
    navigate("/template/loc/case");
  };

  const handleSelectPane = (nextPane: PaneType) => {
    setPaneType(nextPane);
    setPaneOpen(true);
  };

  // Presentation に props を渡す
  return (
    <CaseDetailPresentation
      // data props
      caseData={caseData}
      statusOptions={statusOptions}
      assigneeOptions={assigneeOptions}
      // state props
      paneOpen={paneOpen}
      paneType={paneType}
      status={status}
      // handler props
      onNavigateBack={handleNavigateBack}
      onSelectPane={handleSelectPane}
      onStatusChange={setStatus}
    />
  );
};
```

**ポイント**:
- `useState`, `useEffect`, `useNavigate` などの hooks はここに集約
- Presentation に渡す props を明確に分類（data / state / handler）
- ビジネスロジックはここで処理

### Presentation.tsx

**責務**: UI 層（純粋なレンダリング、props のみに依存）

```tsx
import {
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  ContentHeader,
  Card,
  CardBody,
  Select,
} from "@legalforce/aegis-react";
import type { CaseDetailPresentationProps } from "./types";

export const CaseDetailPresentation = ({
  // data props
  caseData,
  statusOptions,
  assigneeOptions,
  // state props
  paneOpen,
  paneType,
  status,
  // handler props
  onNavigateBack,
  onSelectPane,
  onStatusChange,
}: CaseDetailPresentationProps): JSX.Element => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader
            title={caseData.title}
            onBackButtonClick={onNavigateBack}
          />
        </PageLayoutHeader>
        <PageLayoutBody>
          <Card>
            <CardBody>
              <Select
                value={status}
                onChange={(e) => onStatusChange(e.target.value)}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </CardBody>
          </Card>
        </PageLayoutBody>
      </PageLayoutContent>
      {paneOpen && (
        <PageLayoutPane>{/* Pane content */}</PageLayoutPane>
      )}
    </PageLayout>
  );
};
```

**ポイント**:
- `useState` などの hooks を使わない（完全に props 依存）
- Aegis コンポーネントを使って UI を構築
- デザイナーがこのファイルだけ見れば UI 構造がわかる

### types.ts

**責務**: 全ての型定義を集約

```tsx
// === データ型 ===

export interface CaseData {
  id: string;
  title: string;
  status: string;
  assignee: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

// === State 型 ===

export type PaneType = "case-info" | "linked-file";

// === Props 型 ===

export interface CaseDetailPresentationProps {
  // data props
  caseData: CaseData;
  statusOptions: SelectOption[];
  assigneeOptions: SelectOption[];
  // state props
  paneOpen: boolean;
  paneType: PaneType;
  status: string;
  // handler props
  onNavigateBack: () => void;
  onSelectPane: (pane: PaneType) => void;
  onStatusChange: (status: string) => void;
}
```

**ポイント**:
- データ型、State 型、Props 型を分類
- Presentation の Props は明示的にインターフェースを定義
- コメントで役割を明確化

### data/constants.ts

**責務**: 定数・設定・セレクトオプション

```tsx
import type { CaseData, SelectOption } from "../types";

export const statusOptions: SelectOption[] = [
  { label: "進行中", value: "in_progress" },
  { label: "完了", value: "completed" },
  { label: "保留", value: "on_hold" },
];

export const assigneeOptions: SelectOption[] = [
  { label: "山田太郎", value: "yamada" },
  { label: "田中花子", value: "tanaka" },
];

export const DEFAULT_STATUS = "in_progress";
```

### data/mock.ts

**責務**: モックデータ

```tsx
import type { CaseData } from "../types";

export const caseData: CaseData = {
  id: "case-001",
  title: "契約書レビュー依頼",
  status: "in_progress",
  assignee: "yamada",
};

export const caseList: CaseData[] = [
  caseData,
  // ... more mock data
];
```

---

## レイヤー間の依存ルール

```
┌─────────────────┐
│    index.tsx    │  エントリーポイント
└────────┬────────┘
         │ imports
         ▼
┌─────────────────┐
│  Container.tsx  │  ロジック層
└────────┬────────┘
         │ imports
         ▼
┌─────────────────┐
│ Presentation.tsx│  UI層
└─────────────────┘
         ▲
         │ imports (型のみ)
         │
┌─────────────────┐
│    types.ts     │  型定義
└─────────────────┘
         ▲
         │ imports
         │
┌─────────────────┐
│  data/*.ts      │  データ層
└─────────────────┘
```

**重要なルール**:
- Presentation は Container に依存しない
- Container は Presentation をインポートしてレンダリング
- 全てのファイルが types.ts を参照可能
- data/ は types.ts を参照してデータを生成

---

## デザイナー向けガイド

### UI を確認するには

1. **`Presentation.tsx`** を見る
   - 使用している Aegis コンポーネントがわかる
   - レイアウト構造がわかる
   - props として何を受け取っているかわかる

2. **`types.ts`** で Props 型を確認
   - データの形がわかる
   - 必要な handler がわかる

3. **`data/constants.ts`** でオプション値を確認
   - セレクトの選択肢
   - ラベルテキスト

### レビュー時のチェックポイント

| 確認項目 | 確認ファイル |
|---------|-------------|
| 使用コンポーネント | `Presentation.tsx` |
| レイアウト構造 | `Presentation.tsx` |
| データの型 | `types.ts` |
| 表示テキスト | `data/constants.ts` |
| モックデータ | `data/mock.ts` |

---

## 作成手順

### 1. ディレクトリ作成

```bash
mkdir -p src/pages/sandbox/users/{username}/{page-name}/data
mkdir -p src/pages/sandbox/users/{username}/{page-name}/components
```

### 2. types.ts を最初に作成

データ構造を決めてから実装を始める。

### 3. data/ を作成

型に基づいてモックデータと定数を用意。

### 4. Presentation.tsx を作成

UI を先に組む（ロジックなし）。

### 5. Container.tsx を作成

state と handlers を実装し、Presentation に渡す。

### 6. index.tsx を作成

Container をエクスポート。

---

## コーディングスタイル

### コンポーネント定義はアロー関数形式（戻り値型を明示）

```tsx
// Good - 戻り値型 JSX.Element を明示
export const CaseDetailContainer = (): JSX.Element => {
  return <div>...</div>;
};

export const CaseDetailPresentation = ({ data }: Props): JSX.Element => {
  return <div>...</div>;
};

// Not recommended - function 宣言
export function CaseDetailContainer() {
  return <div>...</div>;
}

// Not recommended - 戻り値型なし
export const CaseDetailContainer = () => {
  return <div>...</div>;
};
```

---

## チェックリスト

作成時の確認:

```
- [ ] types.ts にデータ型・Props 型を定義した
- [ ] Presentation に useState がない（純粋な UI）
- [ ] Container に UI コンポーネントの直接描画がない
- [ ] data/ にモックデータと定数を分離した
- [ ] Aegis コンポーネントのみ使用している
- [ ] コンポーネントはアロー関数形式で定義
```

---

## 関連スキル

- `/prototype-to-lib` - 構造化 Prototype を Lib に変換
- `/sandbox-creator` - Sandbox ページ作成
- `/page-layout-assistant` - PageLayout パターンの選択
- `/component-tips` - Aegis コンポーネントの使い方
