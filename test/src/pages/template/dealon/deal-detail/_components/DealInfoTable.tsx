import { Table, TableContainer, Text } from "@legalforce/aegis-react";
import type { ReactNode } from "react";

export type InfoItem = {
  key: string;
  label: string;
  content: ReactNode;
};

/**
 * ラベル＋値の 2 列テーブル。「基本情報」タブ内の各情報セクションで共通利用する。
 */
export function DealInfoTable({ items }: { items: InfoItem[] }) {
  return (
    <TableContainer>
      <Table>
        <Table.Body>
          {items.map((item) => (
            <Table.Row key={item.key}>
              <Table.Cell as="td" width="fit" minWidth="xxSmall">
                <Text variant="body.medium">{item.label}</Text>
              </Table.Cell>
              <Table.Cell>{item.content}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </TableContainer>
  );
}
