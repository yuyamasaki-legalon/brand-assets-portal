import { LfTextSearch } from "@legalforce/aegis-icons";
import {
  Link as AegisLink,
  ContentHeader,
  DataTable,
  type DataTableColumnDef,
  Divider,
  FormControl,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
  TextField,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";

type Row = {
  id: string;
  name: string;
  department: string;
  role: string;
  email: string;
  note: string;
};

const rows: Row[] = [
  { id: "1", name: "田中 太郎", department: "法務部", role: "マネージャー", email: "tanaka@example.com", note: "東京" },
  { id: "2", name: "佐藤 花子", department: "営業部", role: "リーダー", email: "sato@example.com", note: "大阪" },
  { id: "3", name: "鈴木 一郎", department: "開発部", role: "エンジニア", email: "suzuki@example.com", note: "福岡" },
  { id: "4", name: "高橋 美咲", department: "法務部", role: "スタッフ", email: "takahashi@example.com", note: "東京" },
  {
    id: "5",
    name: "山田 健太",
    department: "人事部",
    role: "マネージャー",
    email: "yamada@example.com",
    note: "名古屋",
  },
  { id: "6", name: "伊藤 さくら", department: "開発部", role: "リーダー", email: "ito@example.com", note: "東京" },
  { id: "7", name: "渡辺 大輔", department: "営業部", role: "スタッフ", email: "watanabe@example.com", note: "札幌" },
  { id: "8", name: "中村 愛", department: "法務部", role: "エンジニア", email: "nakamura@example.com", note: "大阪" },
];

const columns: DataTableColumnDef<Row, string>[] = [
  { id: "name", name: "氏名", getValue: (row) => row.name },
  { id: "department", name: "部署", getValue: (row) => row.department },
  { id: "role", name: "役職", getValue: (row) => row.role },
  { id: "email", name: "メール", getValue: (row) => row.email },
  { id: "note", name: "備考", getValue: (row) => row.note, globalFilterable: false },
];

export const DataTableGlobalFilter = () => {
  const [filter, setFilter] = useState("");

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>DataTable グローバルフィルタリング</ContentHeader.Title>
            <ContentHeader.Description>
              v2.42.0: globalFilter / onGlobalFilterChange で全カラム横断検索
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            テキストを入力すると、全カラムを横断して一致する行だけが表示されます。「備考」カラムは globalFilterable:
            false に設定しているため、フィルタ対象外です。
          </Text>

          <div style={{ maxWidth: "var(--aegis-layout-width-x3Small)", marginBottom: "var(--aegis-space-medium)" }}>
            <FormControl>
              <FormControl.Label>検索</FormControl.Label>
              <TextField
                type="search"
                leading={LfTextSearch}
                placeholder="氏名、部署、役職、メールで検索..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                clearable
                onClear={() => setFilter("")}
              />
            </FormControl>
          </div>

          <DataTable columns={columns} rows={rows} getRowId={(row) => row.id} globalFilter={filter} />

          <Divider style={{ margin: "var(--aegis-space-large) 0" }} />

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            ポイント
          </Text>
          <ul style={{ margin: 0, paddingLeft: "var(--aegis-space-large)" }}>
            <li style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              <Text variant="body.small">globalFilter prop で制御モード（controlled）として使用</Text>
            </li>
            <li style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              <Text variant="body.small">defaultGlobalFilter で非制御モード（uncontrolled）も可能</Text>
            </li>
            <li style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              <Text variant="body.small">
                カラム定義で globalFilterable: false を指定すると、そのカラムはフィルタ対象外
              </Text>
            </li>
            <li>
              <Text variant="body.small">
                「備考」カラムは globalFilterable: false のため、「東京」で検索しても備考の値はマッチしない
              </Text>
            </li>
          </ul>

          <div style={{ marginTop: "var(--aegis-space-xLarge)" }}>
            <AegisLink asChild>
              <Link to="/updates/aegis-releases/v2-42-0">← Back to v2.42.0</Link>
            </AegisLink>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
