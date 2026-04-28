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
  Pagination,
  Tab,
  Table,
  TableContainer,
  Text,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { ProfileLayout, RowActionMenu } from "../_components";

// モックデータ: 給与明細
interface SalaryDetail {
  id: string;
  targetMonth: string;
  paymentDate: string;
  totalPayment: string;
  totalDeduction: string;
  netPayment: string;
}

const mockSalaryDetails: SalaryDetail[] = [
  {
    id: "1",
    targetMonth: "2024年12月",
    paymentDate: "2024/12/25",
    totalPayment: "450,000円",
    totalDeduction: "95,000円",
    netPayment: "355,000円",
  },
  {
    id: "2",
    targetMonth: "2024年11月",
    paymentDate: "2024/11/25",
    totalPayment: "450,000円",
    totalDeduction: "95,000円",
    netPayment: "355,000円",
  },
  {
    id: "3",
    targetMonth: "2024年10月",
    paymentDate: "2024/10/25",
    totalPayment: "450,000円",
    totalDeduction: "95,000円",
    netPayment: "355,000円",
  },
];

// モックデータ: 賞与明細
interface BonusDetail {
  id: string;
  targetPeriod: string;
  paymentDate: string;
  totalPayment: string;
  totalDeduction: string;
  netPayment: string;
}

const mockBonusDetails: BonusDetail[] = [
  {
    id: "1",
    targetPeriod: "2024年冬季",
    paymentDate: "2024/12/10",
    totalPayment: "900,000円",
    totalDeduction: "180,000円",
    netPayment: "720,000円",
  },
  {
    id: "2",
    targetPeriod: "2024年夏季",
    paymentDate: "2024/06/10",
    totalPayment: "850,000円",
    totalDeduction: "170,000円",
    netPayment: "680,000円",
  },
];

// モックデータ: 源泉徴収票
interface TaxWithholding {
  id: string;
  year: string;
  totalIncome: string;
  taxWithheld: string;
  status: string;
}

const mockTaxWithholdings: TaxWithholding[] = [
  { id: "1", year: "2023年", totalIncome: "6,200,000円", taxWithheld: "320,000円", status: "確定" },
  { id: "2", year: "2022年", totalIncome: "5,800,000円", taxWithheld: "290,000円", status: "確定" },
];

// モックデータ: 住民税通知書
interface TaxNotification {
  id: string;
  year: string;
  municipality: string;
  annualTax: string;
  status: string;
}

const mockTaxNotifications: TaxNotification[] = [
  { id: "1", year: "2024年度", municipality: "千代田区", annualTax: "180,000円", status: "通知済" },
  { id: "2", year: "2023年度", municipality: "千代田区", annualTax: "168,000円", status: "通知済" },
];

function SalaryDetailTable() {
  return (
    <TableContainer>
      <Table>
        <Table.Body>
          <Table.Row hover={false}>
            <Table.Cell as="th">
              <Text variant="title.xxSmall" color="bold">
                対象月
              </Text>
            </Table.Cell>
            <Table.Cell as="th" width="fit">
              <Text variant="title.xxSmall" color="bold">
                支給日
              </Text>
            </Table.Cell>
            <Table.Cell as="th" width="fit">
              <Text variant="title.xxSmall" color="bold">
                総支給額
              </Text>
            </Table.Cell>
            <Table.Cell as="th" width="fit">
              <Text variant="title.xxSmall" color="bold">
                控除合計
              </Text>
            </Table.Cell>
            <Table.Cell as="th" width="fit">
              <Text variant="title.xxSmall" color="bold">
                差引支給額
              </Text>
            </Table.Cell>
            <Table.Cell as="th" width="fit" />
          </Table.Row>
          {mockSalaryDetails.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>
                <Link href="#">{item.targetMonth}</Link>
              </Table.Cell>
              <Table.Cell>{item.paymentDate}</Table.Cell>
              <Table.Cell>{item.totalPayment}</Table.Cell>
              <Table.Cell>{item.totalDeduction}</Table.Cell>
              <Table.Cell>{item.netPayment}</Table.Cell>
              <Table.Cell>
                <RowActionMenu />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </TableContainer>
  );
}

function BonusDetailTable() {
  return (
    <TableContainer>
      <Table>
        <Table.Body>
          <Table.Row hover={false}>
            <Table.Cell as="th">
              <Text variant="title.xxSmall" color="bold">
                対象期間
              </Text>
            </Table.Cell>
            <Table.Cell as="th" width="fit">
              <Text variant="title.xxSmall" color="bold">
                支給日
              </Text>
            </Table.Cell>
            <Table.Cell as="th" width="fit">
              <Text variant="title.xxSmall" color="bold">
                総支給額
              </Text>
            </Table.Cell>
            <Table.Cell as="th" width="fit">
              <Text variant="title.xxSmall" color="bold">
                控除合計
              </Text>
            </Table.Cell>
            <Table.Cell as="th" width="fit">
              <Text variant="title.xxSmall" color="bold">
                差引支給額
              </Text>
            </Table.Cell>
            <Table.Cell as="th" width="fit" />
          </Table.Row>
          {mockBonusDetails.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>
                <Link href="#">{item.targetPeriod}</Link>
              </Table.Cell>
              <Table.Cell>{item.paymentDate}</Table.Cell>
              <Table.Cell>{item.totalPayment}</Table.Cell>
              <Table.Cell>{item.totalDeduction}</Table.Cell>
              <Table.Cell>{item.netPayment}</Table.Cell>
              <Table.Cell>
                <RowActionMenu />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </TableContainer>
  );
}

function TaxWithholdingTable() {
  return (
    <TableContainer>
      <Table>
        <Table.Body>
          <Table.Row hover={false}>
            <Table.Cell as="th">
              <Text variant="title.xxSmall" color="bold">
                年度
              </Text>
            </Table.Cell>
            <Table.Cell as="th" width="fit">
              <Text variant="title.xxSmall" color="bold">
                支払金額
              </Text>
            </Table.Cell>
            <Table.Cell as="th" width="fit">
              <Text variant="title.xxSmall" color="bold">
                源泉徴収税額
              </Text>
            </Table.Cell>
            <Table.Cell as="th" width="fit">
              <Text variant="title.xxSmall" color="bold">
                状況
              </Text>
            </Table.Cell>
            <Table.Cell as="th" width="fit" />
          </Table.Row>
          {mockTaxWithholdings.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>
                <Link href="#">{item.year}</Link>
              </Table.Cell>
              <Table.Cell>{item.totalIncome}</Table.Cell>
              <Table.Cell>{item.taxWithheld}</Table.Cell>
              <Table.Cell>{item.status}</Table.Cell>
              <Table.Cell>
                <RowActionMenu />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </TableContainer>
  );
}

function TaxNotificationTable() {
  return (
    <TableContainer>
      <Table>
        <Table.Body>
          <Table.Row hover={false}>
            <Table.Cell as="th">
              <Text variant="title.xxSmall" color="bold">
                年度
              </Text>
            </Table.Cell>
            <Table.Cell as="th" width="fit">
              <Text variant="title.xxSmall" color="bold">
                市区町村
              </Text>
            </Table.Cell>
            <Table.Cell as="th" width="fit">
              <Text variant="title.xxSmall" color="bold">
                年税額
              </Text>
            </Table.Cell>
            <Table.Cell as="th" width="fit">
              <Text variant="title.xxSmall" color="bold">
                状況
              </Text>
            </Table.Cell>
            <Table.Cell as="th" width="fit" />
          </Table.Row>
          {mockTaxNotifications.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>
                <Link href="#">{item.year}</Link>
              </Table.Cell>
              <Table.Cell>{item.municipality}</Table.Cell>
              <Table.Cell>{item.annualTax}</Table.Cell>
              <Table.Cell>{item.status}</Table.Cell>
              <Table.Cell>
                <RowActionMenu />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </TableContainer>
  );
}

export default function SalaryBonusDetailPage() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const renderTabContent = () => {
    switch (activeTabIndex) {
      case 0:
        return <SalaryDetailTable />;
      case 1:
        return <BonusDetailTable />;
      case 2:
        return <TaxWithholdingTable />;
      case 3:
        return <TaxNotificationTable />;
      default:
        return <SalaryDetailTable />;
    }
  };

  return (
    <ProfileLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader size="large">
            <ContentHeaderTitle as="h2">給与・賞与明細</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Card variant="fill">
            <CardHeader>
              <Tab.Group index={activeTabIndex} onChange={setActiveTabIndex}>
                <Tab.List>
                  <Tab>給与明細</Tab>
                  <Tab>賞与明細</Tab>
                  <Tab>源泉徴収票</Tab>
                  <Tab>住民税通知書</Tab>
                </Tab.List>
              </Tab.Group>
            </CardHeader>
            <CardBody>
              {renderTabContent()}
              <div style={{ marginTop: "var(--aegis-space-medium)" }}>
                <Pagination totalCount={60} page={1} onChange={() => {}} />
              </div>
            </CardBody>
          </Card>
        </PageLayoutBody>
      </PageLayoutContent>
    </ProfileLayout>
  );
}
