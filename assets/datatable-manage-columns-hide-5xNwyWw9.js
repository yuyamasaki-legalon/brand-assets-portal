var e=`import type { DataTableColumnDef } from "@legalforce/aegis-react";
import {
  Link as AegisLink,
  ContentHeader,
  DataTable,
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
  status: string;
  owner: string;
  updatedAt: string;
}

const sampleRows: Row[] = [
  { id: "1", name: "売買契約書 v2", status: "レビュー中", owner: "山田太郎", updatedAt: "2026-05-30" },
  { id: "2", name: "業務委託契約書", status: "承認済み", owner: "佐藤花子", updatedAt: "2026-05-28" },
  { id: "3", name: "秘密保持契約書", status: "下書き", owner: "鈴木一郎", updatedAt: "2026-05-25" },
  { id: "4", name: "ライセンス契約書", status: "送付済み", owner: "田中三郎", updatedAt: "2026-05-22" },
];

const hideableColumns: DataTableColumnDef<Row, string>[] = [
  { id: "name", name: "名前", getValue: (row) => row.name, hideable: true },
  { id: "status", name: "ステータス", getValue: (row) => row.status, hideable: true },
  { id: "owner", name: "担当者", getValue: (row) => row.owner, hideable: true },
  { id: "updatedAt", name: "更新日", getValue: (row) => row.updatedAt, hideable: true },
];

const resizeOnlyColumns: DataTableColumnDef<Row, string>[] = [
  { id: "name", name: "名前", getValue: (row) => row.name, resizable: true, hideable: false },
  { id: "status", name: "ステータス", getValue: (row) => row.status, resizable: true, hideable: false },
  { id: "owner", name: "担当者", getValue: (row) => row.owner, resizable: true, hideable: false },
  { id: "updatedAt", name: "更新日", getValue: (row) => row.updatedAt, resizable: true, hideable: false },
];

export const DataTableManageColumnsHideDemo = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>DataTable Manage columns hide</ContentHeader.Title>
            <ContentHeader.Description>
              v2.52.0: ヘッダーメニューに「Manage columns」項目を、列の hide が無効でリサイズ操作のみのときは表示しない
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            v2.52.0 から、DataTable のヘッダーメニュー（列見出しの︙）で利用可能な操作が「列幅リセット /
            自動調整」のみのとき 「Manage columns」項目が非表示になりました。<code>hideable: false</code>{" "}
            を全列に指定したテーブルで、 メニューが整理されていることを確認できます。
          </Text>

          <div style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
            <Text as="h3" variant="title.xSmall" style={{ marginBottom: "var(--aegis-space-small)" }}>
              hideable: true (Manage columns 表示)
            </Text>
            <DataTable columns={hideableColumns} rows={sampleRows} getRowId={(row) => row.id} />
            <Text
              as="p"
              variant="body.small"
              style={{ color: "var(--aegis-color-text-subtle)", marginTop: "var(--aegis-space-xSmall)" }}
            >
              ヘッダーセルの︙メニューに「Manage columns」が表示されます。
            </Text>
          </div>

          <div style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
            <Text as="h3" variant="title.xSmall" style={{ marginBottom: "var(--aegis-space-small)" }}>
              resizable のみ / hideable: false (Manage columns 非表示)
            </Text>
            <DataTable columns={resizeOnlyColumns} rows={sampleRows} getRowId={(row) => row.id} />
            <Text
              as="p"
              variant="body.small"
              style={{ color: "var(--aegis-color-text-subtle)", marginTop: "var(--aegis-space-xSmall)" }}
            >
              リサイズ系操作だけが残るため、不要な「Manage columns」項目が非表示になります。
            </Text>
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
              挙動の変更点
            </Text>
            <Text as="p" variant="body.small">
              - 以前: 列の hide が無効でも「Manage columns」項目自体が常に表示されていた
            </Text>
            <Text as="p" variant="body.small">
              - 以降: メニューに有効な hide 操作が存在しないときは項目を出さない
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-52-0">← Back to v2.52.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
`;export{e as default};