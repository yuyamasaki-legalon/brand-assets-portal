import {
  ContentHeader,
  ContentHeaderTitle,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Table,
  Text,
} from "@legalforce/aegis-react";
import { BlockTable, ProfileLayout, RowActionMenu, TableHeaderButtons } from "../_components";

// モックデータ: カスタム項目
interface CustomItem {
  id: string;
  groupName: string;
  items: {
    id: string;
    fieldName: string;
    value: string;
  }[];
}

const mockCustomItems: CustomItem[] = [
  {
    id: "1",
    groupName: "スキル情報",
    items: [
      { id: "1-1", fieldName: "プログラミング言語", value: "TypeScript, Python, Go" },
      { id: "1-2", fieldName: "フレームワーク", value: "React, Next.js, FastAPI" },
      { id: "1-3", fieldName: "資格", value: "AWS Solutions Architect, PMP" },
    ],
  },
  {
    id: "2",
    groupName: "社内情報",
    items: [
      { id: "2-1", fieldName: "メンター", value: "鈴木 一郎" },
      { id: "2-2", fieldName: "入社経路", value: "リファラル採用" },
      { id: "2-3", fieldName: "研修受講歴", value: "新入社員研修, リーダーシップ研修" },
    ],
  },
  {
    id: "3",
    groupName: "健康情報",
    items: [
      { id: "3-1", fieldName: "健康診断日", value: "2024/04/15" },
      { id: "3-2", fieldName: "ストレスチェック", value: "2024/05/10（良好）" },
    ],
  },
];

function CustomItemGroup({ group }: { group: CustomItem }) {
  return (
    <BlockTable
      title={group.groupName}
      trailing={
        <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)", alignItems: "center" }}>
          <TableHeaderButtons />
          <RowActionMenu />
        </div>
      }
    >
      <Table.Row hover={false}>
        <Table.Cell as="th" width="fit">
          <Text variant="title.xxSmall" color="bold">
            項目名
          </Text>
        </Table.Cell>
        <Table.Cell as="th">
          <Text variant="title.xxSmall" color="bold">
            値
          </Text>
        </Table.Cell>
        <Table.Cell as="th" width="fit" />
      </Table.Row>
      {group.items.map((item) => (
        <Table.Row key={item.id}>
          <Table.Cell>{item.fieldName}</Table.Cell>
          <Table.Cell>{item.value}</Table.Cell>
          <Table.Cell>
            <RowActionMenu />
          </Table.Cell>
        </Table.Row>
      ))}
    </BlockTable>
  );
}

export default function CustomPage() {
  return (
    <ProfileLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader size="large">
            <ContentHeaderTitle as="h2">カスタム項目</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
            {mockCustomItems.map((group) => (
              <CustomItemGroup key={group.id} group={group} />
            ))}
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </ProfileLayout>
  );
}
