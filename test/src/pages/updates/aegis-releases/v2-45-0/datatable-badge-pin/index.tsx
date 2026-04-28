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

interface Row {
  id: string;
  name: string;
  department: string;
  role: string;
  status: string;
  email: string;
  location: string;
  startDate: string;
  salary: string;
}

const rows: Row[] = [
  {
    id: "1",
    name: "田中 太郎",
    department: "開発部",
    role: "エンジニア",
    status: "在籍",
    email: "tanaka@example.com",
    location: "東京",
    startDate: "2020-04-01",
    salary: "¥6,000,000",
  },
  {
    id: "2",
    name: "佐藤 花子",
    department: "デザイン部",
    role: "デザイナー",
    status: "在籍",
    email: "sato@example.com",
    location: "大阪",
    startDate: "2021-07-15",
    salary: "¥5,500,000",
  },
  {
    id: "3",
    name: "鈴木 一郎",
    department: "営業部",
    role: "マネージャー",
    status: "休職中",
    email: "suzuki@example.com",
    location: "福岡",
    startDate: "2019-01-10",
    salary: "¥7,200,000",
  },
  {
    id: "4",
    name: "山田 美咲",
    department: "人事部",
    role: "リーダー",
    status: "在籍",
    email: "yamada@example.com",
    location: "名古屋",
    startDate: "2022-03-01",
    salary: "¥5,800,000",
  },
  {
    id: "5",
    name: "高橋 健二",
    department: "開発部",
    role: "テックリード",
    status: "在籍",
    email: "takahashi@example.com",
    location: "東京",
    startDate: "2018-09-20",
    salary: "¥8,000,000",
  },
];

const columns: DataTableColumnDef<Row, string>[] = [
  { id: "name", name: "氏名", getValue: (row) => row.name },
  { id: "department", name: "部署", getValue: (row) => row.department },
  { id: "role", name: "役職", getValue: (row) => row.role },
  { id: "status", name: "ステータス", getValue: (row) => row.status },
  { id: "email", name: "メールアドレス", getValue: (row) => row.email },
  { id: "location", name: "勤務地", getValue: (row) => row.location },
  { id: "startDate", name: "入社日", getValue: (row) => row.startDate },
  { id: "salary", name: "年収", getValue: (row) => row.salary },
];

export const DataTableBadgePin = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>DataTable バッジカラム固定</ContentHeader.Title>
            <ContentHeader.Description>
              v2.45.0: DataTable のバッジカラムが自動的に固定されるよう更新
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            badgedRows を設定した DataTable
            で、バッジカラム（行の左端に表示される色付きインジケーター）が横スクロール時にも固定表示されます。
            テーブルを横にスクロールして確認してください。
          </Text>

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            バッジ付き行（ID: 3, 5）+ 横スクロール
          </Text>
          <div
            style={{
              maxWidth: "var(--aegis-layout-width-large)",
              overflow: "auto",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            <DataTable columns={columns} rows={rows} getRowId={(row) => row.id} badgedRows={["3", "5"]} stickyHeader />
          </div>

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            バッジなし（比較用）
          </Text>
          <div
            style={{
              maxWidth: "var(--aegis-layout-width-large)",
              overflow: "auto",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            <DataTable columns={columns} rows={rows} getRowId={(row) => row.id} stickyHeader />
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
              修正内容
            </Text>
            <Text as="p" variant="body.small">
              - v2.44.x 以前: バッジカラムが横スクロール時に他のカラムと一緒にスクロールしてしまう場合があった
            </Text>
            <Text as="p" variant="body.small">
              - v2.45.0: バッジカラムが自動的に固定（pin）され、横スクロール時も常に表示される
            </Text>
            <Text as="p" variant="body.small">
              - badgedRows prop に行 ID の配列を渡すと、該当行の左端にバッジインジケーターが表示される
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-45-0">← Back to v2.45.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
