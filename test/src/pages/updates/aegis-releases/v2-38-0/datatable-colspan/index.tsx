import {
  Link as AegisLink,
  ContentHeader,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  DataTableDescription,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

type Employee = {
  id: string;
  name: string;
  department: string;
  role: string;
  project: string;
  status: string;
  note: string;
};

const rows: Employee[] = [
  {
    id: "1",
    name: "田中 太郎",
    department: "エンジニアリング",
    role: "テックリード",
    project: "Aegis v3",
    status: "稼働中",
    note: "",
  },
  {
    id: "2",
    name: "鈴木 花子",
    department: "デザイン",
    role: "UI デザイナー",
    project: "Aegis v3",
    status: "稼働中",
    note: "",
  },
  {
    id: "3",
    name: "佐藤 次郎",
    department: "",
    role: "",
    project: "",
    status: "",
    note: "2025-07-01 より産休取得予定",
  },
  {
    id: "4",
    name: "高橋 美咲",
    department: "プロダクト",
    role: "PM",
    project: "LegalOn",
    status: "稼働中",
    note: "",
  },
  {
    id: "5",
    name: "山本 健",
    department: "",
    role: "",
    project: "",
    status: "",
    note: "2025-06-15 付で退職済み",
  },
];

const columns: DataTableColumnDef<Employee, string>[] = [
  {
    id: "name",
    name: "氏名",
    getValue: (row) => row.name,
    reorderable: false,
    pinnable: false,
    colSpan: ({ row }) => {
      if (row.note) {
        return 6;
      }
    },
    renderCell: ({ value, row }) => {
      if (row.note) {
        return (
          <DataTableCell>
            {value}
            <DataTableDescription>{row.note}</DataTableDescription>
          </DataTableCell>
        );
      }
      return <DataTableCell>{value}</DataTableCell>;
    },
  },
  {
    id: "department",
    name: "部署",
    getValue: (row) => row.department,
    reorderable: false,
    pinnable: false,
  },
  {
    id: "role",
    name: "役職",
    getValue: (row) => row.role,
    reorderable: false,
    pinnable: false,
  },
  {
    id: "project",
    name: "プロジェクト",
    getValue: (row) => row.project,
    reorderable: false,
    pinnable: false,
  },
  {
    id: "status",
    name: "ステータス",
    getValue: (row) => row.status,
    reorderable: false,
    pinnable: false,
  },
  {
    id: "note",
    name: "備考",
    getValue: (row) => row.note,
    reorderable: false,
    pinnable: false,
  },
];

export const DataTableColSpan = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>DataTable colSpan デモ</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            DataTable のカラム定義に <code>colSpan</code> プロパティを指定して、セルの結合を行うデモです。
          </Text>
          <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-large)" }}>
            備考がある行（佐藤 次郎、山本 健）では、氏名セルが全 6 列にまたがり、備考を
            <code>DataTableDescription</code> で表示しています。
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
              使い方
            </Text>
            <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              - <code>colSpan</code> は <code>DataTableColumnDef</code> の関数プロパティで、行ごとにセル結合数を返します
            </Text>
            <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              - <code>undefined</code> を返すと結合なし（デフォルト）、数値を返すとその列数分のセルを結合
            </Text>
            <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              - 結合時の表示内容は <code>renderCell</code> で制御します
            </Text>
            <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-medium)" }}>
              - <code>DataTableDescription</code> を使うとセル内にサブテキストを表示できます
            </Text>
            <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              制限事項
            </Text>
            <Text as="p" variant="body.small">
              - colSpan 使用時は reorderable / pinnable / hideable を無効にすることが推奨されます
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-38-0">← Back to v2.38.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
