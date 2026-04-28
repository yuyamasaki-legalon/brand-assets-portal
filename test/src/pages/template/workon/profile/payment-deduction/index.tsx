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

// モックデータ: 支給項目
interface PaymentItem {
  id: string;
  itemId: string;
  itemName: string;
  amount: string;
}

const mockPayments: PaymentItem[] = [
  { id: "1", itemId: "P001", itemName: "通勤手当", amount: "12,500円" },
  { id: "2", itemId: "P002", itemName: "住宅手当", amount: "30,000円" },
  { id: "3", itemId: "P003", itemName: "家族手当", amount: "15,000円" },
  { id: "4", itemId: "P004", itemName: "役職手当", amount: "50,000円" },
];

// モックデータ: 控除項目
const mockDeductions: PaymentItem[] = [
  { id: "1", itemId: "D001", itemName: "財形貯蓄", amount: "20,000円" },
  { id: "2", itemId: "D002", itemName: "組合費", amount: "3,000円" },
  { id: "3", itemId: "D003", itemName: "生命保険", amount: "10,000円" },
];

function PaymentDeductionTable({ title, items }: { title: string; items: PaymentItem[] }) {
  return (
    <BlockTable title={title} trailing={<TableHeaderButtons />}>
      <Table.Row hover={false}>
        <Table.Cell as="th" width="fit">
          <Text variant="title.xxSmall" color="bold">
            項目ID
          </Text>
        </Table.Cell>
        <Table.Cell as="th">
          <Text variant="title.xxSmall" color="bold">
            項目名
          </Text>
        </Table.Cell>
        <Table.Cell as="th" width="fit">
          <Text variant="title.xxSmall" color="bold">
            金額
          </Text>
        </Table.Cell>
        <Table.Cell as="th" width="fit" />
      </Table.Row>
      {items.map((item) => (
        <Table.Row key={item.id}>
          <Table.Cell>{item.itemId}</Table.Cell>
          <Table.Cell>{item.itemName}</Table.Cell>
          <Table.Cell>{item.amount}</Table.Cell>
          <Table.Cell>
            <RowActionMenu />
          </Table.Cell>
        </Table.Row>
      ))}
    </BlockTable>
  );
}

export default function PaymentDeductionPage() {
  return (
    <ProfileLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader size="large">
            <ContentHeaderTitle as="h2">支給・控除</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
            <PaymentDeductionTable title="支給" items={mockPayments} />
            <PaymentDeductionTable title="控除" items={mockDeductions} />
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </ProfileLayout>
  );
}
