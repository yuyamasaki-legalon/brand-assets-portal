import {
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  ContentHeaderTitle,
  Link,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Table,
  TableContainer,
  Text,
} from "@legalforce/aegis-react";
import { ProfileLayout, RowActionMenu, TableHeaderButtons } from "../_components";

// モックデータ: 休職歴
interface LeaveHistory {
  id: string;
  startDate: string;
  endDate: string;
  leaveDays: string;
  leaveType: string;
  leaveReason: string;
  document: string;
}

const mockLeaveHistories: LeaveHistory[] = [
  {
    id: "1",
    startDate: "2023/06/01",
    endDate: "2023/08/31",
    leaveDays: "92日",
    leaveType: "育児休業",
    leaveReason: "第二子出産のため",
    document: "育児休業申請書.pdf",
  },
  {
    id: "2",
    startDate: "2021/03/01",
    endDate: "2021/05/31",
    leaveDays: "92日",
    leaveType: "育児休業",
    leaveReason: "第一子出産のため",
    document: "育児休業申請書.pdf",
  },
];

// 合計日数計算
const totalLeaveDays = "184日";

export default function LeaveOfAbsencePage() {
  return (
    <ProfileLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader size="large">
            <ContentHeaderTitle as="h2">休職歴</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Card variant="fill">
            <CardHeader trailing={<TableHeaderButtons />}>
              <Text variant="title.small" color="bold">
                休職歴
              </Text>
            </CardHeader>
            <CardBody>
              <TableContainer>
                <Table>
                  <Table.Body>
                    <Table.Row hover={false}>
                      <Table.Cell as="th" width="fit">
                        <Text variant="title.xxSmall" color="bold">
                          開始日
                        </Text>
                      </Table.Cell>
                      <Table.Cell as="th" width="fit">
                        <Text variant="title.xxSmall" color="bold">
                          終了日
                        </Text>
                      </Table.Cell>
                      <Table.Cell as="th" width="fit">
                        <Text variant="title.xxSmall" color="bold">
                          休職日数
                        </Text>
                      </Table.Cell>
                      <Table.Cell as="th" width="fit">
                        <Text variant="title.xxSmall" color="bold">
                          休職種別
                        </Text>
                      </Table.Cell>
                      <Table.Cell as="th">
                        <Text variant="title.xxSmall" color="bold">
                          休職理由
                        </Text>
                      </Table.Cell>
                      <Table.Cell as="th" width="fit">
                        <Text variant="title.xxSmall" color="bold">
                          リンク
                        </Text>
                      </Table.Cell>
                      <Table.Cell as="th" width="fit" />
                    </Table.Row>
                    {mockLeaveHistories.map((item) => (
                      <Table.Row key={item.id}>
                        <Table.Cell>{item.startDate}</Table.Cell>
                        <Table.Cell>{item.endDate}</Table.Cell>
                        <Table.Cell>{item.leaveDays}</Table.Cell>
                        <Table.Cell>{item.leaveType}</Table.Cell>
                        <Table.Cell>{item.leaveReason}</Table.Cell>
                        <Table.Cell>
                          <Link href="#">{item.document}</Link>
                        </Table.Cell>
                        <Table.Cell>
                          <RowActionMenu />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </TableContainer>

              {/* 合計行 */}
              <div style={{ marginTop: "var(--aegis-space-medium)" }}>
                <TableContainer>
                  <Table>
                    <Table.Body>
                      <Table.Row hover={false}>
                        <Table.Cell as="th">
                          <Text variant="title.xxSmall" color="bold">
                            合計休職日数
                          </Text>
                        </Table.Cell>
                        <Table.Cell as="td">
                          <Text variant="body.medium" color="bold">
                            {totalLeaveDays}
                          </Text>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </TableContainer>
              </div>
            </CardBody>
          </Card>
        </PageLayoutBody>
      </PageLayoutContent>
    </ProfileLayout>
  );
}
