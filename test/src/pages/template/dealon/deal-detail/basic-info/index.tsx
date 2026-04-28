import { Card, CardBody, CardHeader, Divider, Table, TableContainer, Text } from "@legalforce/aegis-react";
import { DealInfoTable, EditButton } from "../_components";
import styles from "./index.module.css";
import { assigneeInfoItems, dateInfoItems, dealInfoItems, phaseHistory } from "./mock";

/**
 * 「基本情報」タブのコンテンツ。
 * 案件情報・担当者情報・日時情報・フェーズ変更履歴の 4 セクションを表示する。
 */
export function BasicInfoTabContent() {
  return (
    <div className={styles.wrapper}>
      {/* 案件情報 */}
      <Card variant="plain" size="small">
        <CardHeader trailing={<EditButton label="案件情報を編集" />}>
          <Text variant="title.xSmall">案件情報</Text>
        </CardHeader>
        <CardBody>
          <DealInfoTable items={dealInfoItems} />
        </CardBody>
      </Card>

      <Divider />

      {/* 担当者情報 */}
      <Card variant="plain" size="small">
        <CardHeader trailing={<EditButton label="担当者情報を編集" />}>
          <Text variant="title.xSmall">担当者情報</Text>
        </CardHeader>
        <CardBody>
          <DealInfoTable items={assigneeInfoItems} />
        </CardBody>
      </Card>

      <Divider />

      {/* 日時情報 */}
      <Card variant="plain" size="small">
        <CardHeader>
          <Text variant="title.xSmall">日時情報</Text>
        </CardHeader>
        <CardBody>
          <DealInfoTable items={dateInfoItems} />
        </CardBody>
      </Card>

      <Divider />

      {/* フェーズ変更履歴 */}
      <Card variant="plain" size="small">
        <CardHeader>
          <Text variant="title.xSmall">フェーズ変更履歴</Text>
        </CardHeader>
        <CardBody>
          <TableContainer>
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Cell as="th">変更日時</Table.Cell>
                  <Table.Cell as="th">変更者</Table.Cell>
                  <Table.Cell as="th">変更前</Table.Cell>
                  <Table.Cell as="th">変更後</Table.Cell>
                  <Table.Cell as="th">フェーズ変更理由</Table.Cell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {phaseHistory.map((row) => (
                  <Table.Row key={row.changedAt}>
                    <Table.Cell>{row.changedAt}</Table.Cell>
                    <Table.Cell>{row.changedBy}</Table.Cell>
                    <Table.Cell>{row.prev}</Table.Cell>
                    <Table.Cell>{row.next}</Table.Cell>
                    <Table.Cell>{row.reason}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
    </div>
  );
}
