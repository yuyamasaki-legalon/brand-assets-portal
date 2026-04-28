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

type SampleRow = {
  id: string;
  name: string;
  department: string;
  role: string;
};

const rows: SampleRow[] = [
  { id: "1", name: "田中太郎", department: "法務部", role: "マネージャー" },
  { id: "2", name: "佐藤花子", department: "法務部", role: "リーダー" },
  { id: "3", name: "鈴木一郎", department: "知財部", role: "スペシャリスト" },
  { id: "4", name: "高橋美咲", department: "総務部", role: "アシスタント" },
  { id: "5", name: "伊藤健太", department: "法務部", role: "メンバー" },
];

const columns: DataTableColumnDef<SampleRow, string>[] = [
  { id: "name", name: "氏名", getValue: (row) => row.name },
  { id: "department", name: "部署", getValue: (row) => row.department },
  { id: "role", name: "役職", getValue: (row) => row.role },
];

export const DataTableCheckboxFix = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>DataTable checkbox 修正デモ</ContentHeader.Title>
            <ContentHeader.Description>
              v2.40.0: 全行選択時のヘッダーチェックボックス表示を修正
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            v2.40.0 以前は、すべての行を選択した場合でもヘッダーのチェックボックスが indeterminate（横線）のまま
            になるケースがありました。本修正により、全行選択時はチェックマーク（✓）が正しく表示されます。
          </Text>

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            操作方法
          </Text>
          <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-large)" }}>
            各行のチェックボックスをクリックして全行を選択するか、ヘッダーのチェックボックスで一括選択してください。
            全行が選択された状態でヘッダーのチェックボックスにチェックマークが表示されることを確認できます。
          </Text>

          <div style={{ marginBottom: "var(--aegis-space-large)" }}>
            <DataTable columns={columns} rows={rows} getRowId={(row) => row.id} rowSelectionType="multiple" />
          </div>

          {/* Info box */}
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
            <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              - 全行を個別に選択した場合、ヘッダーのチェックボックスが indeterminate ではなく checked になる
            </Text>
            <Text as="p" variant="body.small">
              - ヘッダーのチェックボックスで一括選択 → 一括解除が正しく動作する
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-40-0">← Back to v2.40.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
