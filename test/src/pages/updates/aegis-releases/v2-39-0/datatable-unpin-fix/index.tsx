import {
  Link as AegisLink,
  ContentHeader,
  DataTable,
  type DataTableColumnDef,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

type Task = {
  id: string;
  title: string;
  assignee: string;
  priority: string;
  status: string;
};

const rows: Task[] = [
  { id: "1", title: "API 設計", assignee: "田中", priority: "High", status: "進行中" },
  { id: "2", title: "UI 実装", assignee: "鈴木", priority: "Medium", status: "未着手" },
  { id: "3", title: "テスト作成", assignee: "佐藤", priority: "Low", status: "完了" },
  { id: "4", title: "ドキュメント更新", assignee: "高橋", priority: "Medium", status: "進行中" },
];

const columns: DataTableColumnDef<Task, string>[] = [
  {
    id: "title",
    name: "タスク名",
    getValue: (row) => row.title,
    pinnable: false,
  },
  {
    id: "assignee",
    name: "担当者",
    getValue: (row) => row.assignee,
    pinnable: true,
  },
  {
    id: "priority",
    name: "優先度",
    getValue: (row) => row.priority,
    pinnable: true,
  },
  {
    id: "status",
    name: "ステータス",
    getValue: (row) => row.status,
    pinnable: false,
  },
];

export const DataTableUnpinFix = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>DataTable pin disabled デモ</ContentHeader.Title>
            <ContentHeader.Description>
              v2.39.0: pinnable: false のカラムでヘッダーメニューの pin ボタンが disabled に
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            v2.39.0 では、<code>pinnable: false</code> に設定されたカラムのヘッダーメニューにある pin ボタンが正しく
            disabled 状態で表示されるようになりました。
          </Text>
          <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-large)" }}>
            各カラムのヘッダーメニュー（右クリックまたはメニューアイコン）を開いて、pin ボタンの状態を確認してください。
          </Text>

          <div style={{ marginBottom: "var(--aegis-space-large)" }}>
            <DataTable columns={columns} rows={rows} getRowId={(row) => row.id} />
          </div>

          <div
            style={{
              padding: "var(--aegis-space-medium)",
              backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
              borderRadius: "var(--aegis-radius-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              カラム設定
            </Text>
            <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              - <strong>タスク名</strong>: <code>pinnable: false</code> → pin ボタンが disabled
            </Text>
            <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              - <strong>担当者</strong>: <code>pinnable: true</code> → pin ボタンが有効
            </Text>
            <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              - <strong>優先度</strong>: <code>pinnable: true</code> → pin ボタンが有効
            </Text>
            <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-medium)" }}>
              - <strong>ステータス</strong>: <code>pinnable: false</code> → pin ボタンが disabled
            </Text>
            <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              修正内容
            </Text>
            <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              - v2.38.x 以前: <code>pinnable: false</code> でもヘッダーメニューの pin ボタンが有効のまま表示されていた
            </Text>
            <Text as="p" variant="body.small">
              - v2.39.0: <code>pinnable: false</code> の場合、pin ボタンが正しく disabled になるよう修正
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-39-0">← Back to v2.39.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
