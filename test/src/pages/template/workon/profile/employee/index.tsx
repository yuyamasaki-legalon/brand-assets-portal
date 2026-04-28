import { LfHistory, LfPen } from "@legalforce/aegis-icons";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  ContentHeaderTitle,
  DescriptionList,
  DescriptionListDetail,
  DescriptionListItem,
  DescriptionListTerm,
  Divider,
  Link,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Table,
  TableContainer,
  Tag,
  Text,
} from "@legalforce/aegis-react";
import { BlockTable, ProfileLayout, TableHeaderButtons } from "../_components";

// モックデータ: 所属・役職
interface Organization {
  id: string;
  primarySecondaryType: string;
  roleName: string;
  isOrganizationHead: boolean;
  departmentPath: string;
  departmentName: string;
  departmentCode: string;
}

const mockOrganization: Organization[] = [
  {
    id: "1",
    primarySecondaryType: "主務",
    roleName: "部長",
    isOrganizationHead: true,
    departmentPath: "AG（603）/デザイン基盤（8）/",
    departmentName: "デザインシステム",
    departmentCode: "2",
  },
  {
    id: "2",
    primarySecondaryType: "兼務",
    roleName: "メンバー",
    isOrganizationHead: false,
    departmentPath: "AG（603）/LegalOn（101）/",
    departmentName: "ワークマネジメント",
    departmentCode: "22",
  },
];

// モックデータ: 基本情報
interface BasicInfo {
  fullName: string;
  fullNameKana: string;
  employeeNumber: string;
  workOnProfileNumber: string;
  companyEmail: string;
  companyPhoneNumber: string;
  employmentType: string;
  office: string;
  jobType: string;
  workType: string;
  laborTimeSystem: string;
  workTime: string;
  restTime: string;
  weeklyWorkTime: string;
  shortTime: string;
  workTypeDetail: string;
  employmentKind: string;
  attendanceManagementTarget: string;
  payrollCalculationTarget: string;
  settlementDate: string;
  payrollCalculationDate: string;
  paymentCycle: string;
  changeDeadline: string;
  status: string;
  startDate: string;
  retirementDate: string;
  retirementReason: string;
  naturalRetirementReasonDetail: string;
  retirementReasonDetail: string;
}

const mockBasicInfo: BasicInfo = {
  fullName: "山田 太郎",
  fullNameKana: "ヤマダ タロウ",
  employeeNumber: "EMP-001234",
  workOnProfileNumber: "WO-2024-0001",
  companyEmail: "taro.yamada@example.com",
  companyPhoneNumber: "03-1234-5678",
  employmentType: "正社員",
  office: "東京本社",
  jobType: "エンジニア",
  workType: "フルタイム",
  laborTimeSystem: "通常勤務",
  workTime: "9:00〜18:00（8時間）",
  restTime: "12:00〜13:00（60分）",
  weeklyWorkTime: "40時間",
  shortTime: "対象外",
  workTypeDetail: "標準勤務形態",
  employmentKind: "無期雇用",
  attendanceManagementTarget: "対象",
  payrollCalculationTarget: "対象",
  settlementDate: "月末締め",
  payrollCalculationDate: "当月25日",
  paymentCycle: "月1回",
  changeDeadline: "当月15日",
  status: "在籍中",
  startDate: "2020/04/01",
  retirementDate: "--",
  retirementReason: "--",
  naturalRetirementReasonDetail: "--",
  retirementReasonDetail: "--",
};

function ProfileDepartmentConfirm() {
  return (
    <BlockTable
      title="所属・役職"
      trailing={
        <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)" }}>
          <Button variant="subtle" color="neutral" size="small" leading={LfHistory}>
            部門履歴
          </Button>
          <Button variant="subtle" color="neutral" size="small" leading={LfPen}>
            編集
          </Button>
        </div>
      }
    >
      <Table.Row hover={false}>
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
            所属部署
          </Text>
        </Table.Cell>
      </Table.Row>
      {mockOrganization.map((item) => (
        <Table.Row key={item.id}>
          <Table.Cell>{item.primarySecondaryType}</Table.Cell>
          <Table.Cell>
            <Text as="span" style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
              {item.roleName}
              {item.isOrganizationHead && (
                <Tag variant="fill" size="small" color="neutral">
                  組織長
                </Tag>
              )}
            </Text>
          </Table.Cell>
          <Table.Cell>
            <Text variant="body.medium">{item.departmentPath}</Text>
            <Link href="#" color="information" size="medium">
              {item.departmentName}（{item.departmentCode}）
            </Link>
          </Table.Cell>
        </Table.Row>
      ))}
    </BlockTable>
  );
}

function ProfileBasicInfo() {
  return (
    <Card variant="fill">
      <CardHeader trailing={<TableHeaderButtons showAdd={false} />}>
        <Text color="bold" variant="title.small" as="h3">
          基本情報
        </Text>
      </CardHeader>
      <CardBody>
        {/* アバターと名前 */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--aegis-space-large)" }}>
          <div style={{ width: "var(--aegis-size-x13Large)", height: "var(--aegis-size-x13Large)", flexShrink: 0 }}>
            <Avatar name={mockBasicInfo.fullName} style={{ width: "100%", height: "100%" }} />
          </div>
          <DescriptionList>
            <DescriptionListItem>
              <DescriptionListTerm>
                <Text variant="label.medium.bold">ビジネスネーム</Text>
              </DescriptionListTerm>
              <DescriptionListDetail>
                <Text variant="body.medium">{mockBasicInfo.fullName}</Text>
              </DescriptionListDetail>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionListTerm>
                <Text variant="label.medium.bold">ビジネスネーム（カナ）</Text>
              </DescriptionListTerm>
              <DescriptionListDetail>
                <Text variant="body.medium">{mockBasicInfo.fullNameKana}</Text>
              </DescriptionListDetail>
            </DescriptionListItem>
          </DescriptionList>
        </div>

        <div style={{ margin: "var(--aegis-space-large) 0" }}>
          <Divider orientation="horizontal" />
        </div>

        {/* 基本情報テーブル */}
        <TableContainer>
          <Table>
            <Table.Body>
              <Table.Row>
                <Table.Cell width="fit" as="th">
                  従業員番号
                </Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.employeeNumber}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">WorkOnプロフィール番号</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.workOnProfileNumber}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">社用メールアドレス</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.companyEmail}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">社用電話番号</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.companyPhoneNumber}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">雇用形態</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.employmentType}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">勤務地</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.office}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">職種</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.jobType}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">勤務形態</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.workType}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">労働時間制</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.laborTimeSystem}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">勤務時間</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.workTime}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">休憩時間</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.restTime}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">週の所定労働時間</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.weeklyWorkTime}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">短時間勤務</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.shortTime}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">勤務形態詳細</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.workTypeDetail}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">雇用区分</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.employmentKind}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">勤怠管理対象</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.attendanceManagementTarget}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">給与計算対象</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.payrollCalculationTarget}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">締め日</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.settlementDate}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">給与計算日</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.payrollCalculationDate}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">支給サイクル</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.paymentCycle}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">変更締め切り日</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.changeDeadline}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">在籍状況</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.status}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">入社日</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.startDate}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">退職日</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.retirementDate}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">退職理由</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.retirementReason}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">自然退職理由詳細</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.naturalRetirementReasonDetail}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th">退職理由詳細</Table.Cell>
                <Table.Cell as="td">{mockBasicInfo.retirementReasonDetail}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
}

export default function EmployeePage() {
  return (
    <ProfileLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader size="large">
            <ContentHeaderTitle as="h2">従業員情報</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
            <ProfileDepartmentConfirm />
            <ProfileBasicInfo />
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </ProfileLayout>
  );
}
