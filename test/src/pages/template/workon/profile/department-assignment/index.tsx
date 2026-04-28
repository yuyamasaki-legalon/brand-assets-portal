import {
  ContentHeader,
  ContentHeaderTitle,
  Link,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Table,
  Tag,
  Text,
} from "@legalforce/aegis-react";
import { BlockTable, ProfileLayout, RowActionMenu, TableHeaderButtons } from "../_components";

interface AffiliationHistory {
  id: string;
  issuanceDate: string;
  type: string;
  role: string;
  isOrganizationHead: boolean;
  departmentCode: string;
  departmentName: string;
  departmentLink: string;
  period: string;
}

interface SecondmentHistory {
  id: string;
  startDate: string;
  endDate: string;
  destination: string;
  renewalCount: string;
  totalPeriod: string;
}

interface GradeHistory {
  id: string;
  gradeTable: string;
  grade: string;
  effectiveDate: string;
  stayPeriod: string;
}

const affiliationHistoryData: AffiliationHistory[] = [
  {
    id: "1",
    issuanceDate: "2024/01/01",
    type: "主務",
    role: "部長",
    isOrganizationHead: true,
    departmentCode: "AG（603）/デザイン基盤（8）",
    departmentName: "デザインシステム（2）",
    departmentLink: "#",
    period: "1年4ヶ月10日",
  },
  {
    id: "2",
    issuanceDate: "2023/11/01",
    type: "主務",
    role: "課長",
    isOrganizationHead: false,
    departmentCode: "AG（603）/LegalOn（101）",
    departmentName: "ワークマネジメント（22）",
    departmentLink: "#",
    period: "2ヶ月4日",
  },
];

const secondmentHistoryData: SecondmentHistory[] = [
  {
    id: "1",
    startDate: "2020/12/01",
    endDate: "2022/12/31",
    destination: "経産省",
    renewalCount: "--",
    totalPeriod: "2年1ヶ月",
  },
];

const gradeHistoryData: GradeHistory[] = [
  {
    id: "1",
    gradeTable: "ビジネス用",
    grade: "L3",
    effectiveDate: "2023/01/01",
    stayPeriod: "2年5ヶ月10日",
  },
];

export default function DepartmentAssignmentPage() {
  return (
    <ProfileLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader size="large">
            <ContentHeaderTitle as="h2">異動歴</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>

        <PageLayoutBody>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-large)",
            }}
          >
            <BlockTable title="所属歴" trailing={<TableHeaderButtons />}>
              <Table.Row hover={false}>
                <Table.Cell as="th" width="fit">
                  <Text variant="title.xxSmall" color="bold">
                    発令日（所属開始日）
                  </Text>
                </Table.Cell>
                <Table.Cell as="th" width="fit">
                  <Text variant="title.xxSmall" color="bold">
                    主務・兼務
                  </Text>
                </Table.Cell>
                <Table.Cell as="th" width="fit">
                  <Text variant="title.xxSmall" color="bold">
                    役職
                  </Text>
                </Table.Cell>
                <Table.Cell as="th">
                  <Text variant="title.xxSmall" color="bold">
                    部署名
                  </Text>
                </Table.Cell>
                <Table.Cell as="th" width="fit">
                  <Text variant="title.xxSmall" color="bold">
                    部署滞留期間
                  </Text>
                </Table.Cell>
                <Table.Cell as="th" width="fit" />
              </Table.Row>
              {affiliationHistoryData.map((row) => (
                <Table.Row key={row.id}>
                  <Table.Cell>{row.issuanceDate}</Table.Cell>
                  <Table.Cell>{row.type}</Table.Cell>
                  <Table.Cell>
                    <Text as="span" style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                      {row.role}
                      {row.isOrganizationHead && (
                        <Tag variant="fill" size="small" color="neutral">
                          組織長
                        </Tag>
                      )}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    {row.departmentCode} /<Link href={row.departmentLink}>{row.departmentName}</Link>
                  </Table.Cell>
                  <Table.Cell>{row.period}</Table.Cell>
                  <Table.Cell>
                    <RowActionMenu />
                  </Table.Cell>
                </Table.Row>
              ))}
            </BlockTable>

            <BlockTable title="出向歴" trailing={<TableHeaderButtons />}>
              <Table.Row hover={false}>
                <Table.Cell as="th" width="fit">
                  <Text variant="title.xxSmall" color="bold">
                    出向開始日
                  </Text>
                </Table.Cell>
                <Table.Cell as="th" width="fit">
                  <Text variant="title.xxSmall" color="bold">
                    出向終了日
                  </Text>
                </Table.Cell>
                <Table.Cell as="th">
                  <Text variant="title.xxSmall" color="bold">
                    出向先
                  </Text>
                </Table.Cell>
                <Table.Cell as="th" width="fit">
                  <Text variant="title.xxSmall" color="bold">
                    更新回数
                  </Text>
                </Table.Cell>
                <Table.Cell as="th" width="fit">
                  <Text variant="title.xxSmall" color="bold">
                    通算契約期間
                  </Text>
                </Table.Cell>
              </Table.Row>
              {secondmentHistoryData.map((row) => (
                <Table.Row key={row.id}>
                  <Table.Cell>{row.startDate}</Table.Cell>
                  <Table.Cell>{row.endDate}</Table.Cell>
                  <Table.Cell>{row.destination}</Table.Cell>
                  <Table.Cell>{row.renewalCount}</Table.Cell>
                  <Table.Cell>{row.totalPeriod}</Table.Cell>
                </Table.Row>
              ))}
            </BlockTable>

            <BlockTable title="等級" trailing={<TableHeaderButtons showAdd={false} />}>
              <Table.Row hover={false}>
                <Table.Cell as="th">
                  <Text variant="title.xxSmall" color="bold">
                    等級テーブル
                  </Text>
                </Table.Cell>
                <Table.Cell as="th" width="fit">
                  <Text variant="title.xxSmall" color="bold">
                    等級
                  </Text>
                </Table.Cell>
                <Table.Cell as="th">
                  <Text variant="title.xxSmall" color="bold">
                    発令日（等級開始日）
                  </Text>
                </Table.Cell>
                <Table.Cell as="th">
                  <Text variant="title.xxSmall" color="bold">
                    等級滞留期間
                  </Text>
                </Table.Cell>
                <Table.Cell as="th" width="fit" />
              </Table.Row>
              {gradeHistoryData.map((row) => (
                <Table.Row key={row.id}>
                  <Table.Cell>{row.gradeTable}</Table.Cell>
                  <Table.Cell>{row.grade}</Table.Cell>
                  <Table.Cell>{row.effectiveDate}</Table.Cell>
                  <Table.Cell>{row.stayPeriod}</Table.Cell>
                  <Table.Cell>
                    <RowActionMenu />
                  </Table.Cell>
                </Table.Row>
              ))}
            </BlockTable>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </ProfileLayout>
  );
}
