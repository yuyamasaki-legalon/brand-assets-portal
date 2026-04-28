import {
  ContentHeader,
  ContentHeaderTitle,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Table,
} from "@legalforce/aegis-react";
import { BlockTable, ProfileLayout, TableHeaderButtons } from "../_components";

// モックデータ: 雇用保険
const mockEmploymentInsurance = {
  employmentInsuranceNumber: "1234-567890-1",
  acquisitionDate: "2020/04/01",
  lossDate: "--",
  insuranceType: "一般被保険者",
};

// モックデータ: 社会保険
const mockSocialInsurance = {
  healthInsuranceNumber: "12345678",
  pensionNumber: "1234-567890",
  acquisitionDate: "2020/04/01",
  lossDate: "--",
  standardMonthlyRemuneration: "320,000円",
  healthInsuranceType: "協会けんぽ",
};

// モックデータ: 住民税
const mockResidentTax = {
  collectionMethod: "特別徴収",
  municipalCode: "131016",
  municipalName: "千代田区",
  taxAmount: "月額 15,000円",
};

// モックデータ: 所得税
const mockIncomeTax = {
  taxCategory: "甲欄",
  dependentCount: "3人",
  basicDeduction: "480,000円",
  spouseDeduction: "380,000円",
};

function ProfileEmploymentInsurance() {
  return (
    <BlockTable title="雇用保険" trailing={<TableHeaderButtons showAdd={false} />}>
      <Table.Row>
        <Table.Cell width="fit" as="th">
          被保険者番号
        </Table.Cell>
        <Table.Cell as="td">{mockEmploymentInsurance.employmentInsuranceNumber}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">資格取得日</Table.Cell>
        <Table.Cell as="td">{mockEmploymentInsurance.acquisitionDate}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">資格喪失日</Table.Cell>
        <Table.Cell as="td">{mockEmploymentInsurance.lossDate}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">被保険者種別</Table.Cell>
        <Table.Cell as="td">{mockEmploymentInsurance.insuranceType}</Table.Cell>
      </Table.Row>
    </BlockTable>
  );
}

function ProfileSocialInsurance() {
  return (
    <BlockTable title="社会保険" trailing={<TableHeaderButtons showAdd={false} />}>
      <Table.Row>
        <Table.Cell width="fit" as="th">
          健康保険番号
        </Table.Cell>
        <Table.Cell as="td">{mockSocialInsurance.healthInsuranceNumber}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">基礎年金番号</Table.Cell>
        <Table.Cell as="td">{mockSocialInsurance.pensionNumber}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">資格取得日</Table.Cell>
        <Table.Cell as="td">{mockSocialInsurance.acquisitionDate}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">資格喪失日</Table.Cell>
        <Table.Cell as="td">{mockSocialInsurance.lossDate}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">標準報酬月額</Table.Cell>
        <Table.Cell as="td">{mockSocialInsurance.standardMonthlyRemuneration}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">健康保険種別</Table.Cell>
        <Table.Cell as="td">{mockSocialInsurance.healthInsuranceType}</Table.Cell>
      </Table.Row>
    </BlockTable>
  );
}

function ProfileLivingTax() {
  return (
    <BlockTable title="住民税" trailing={<TableHeaderButtons showAdd={false} />}>
      <Table.Row>
        <Table.Cell width="fit" as="th">
          徴収方法
        </Table.Cell>
        <Table.Cell as="td">{mockResidentTax.collectionMethod}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">市区町村コード</Table.Cell>
        <Table.Cell as="td">{mockResidentTax.municipalCode}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">市区町村名</Table.Cell>
        <Table.Cell as="td">{mockResidentTax.municipalName}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">税額</Table.Cell>
        <Table.Cell as="td">{mockResidentTax.taxAmount}</Table.Cell>
      </Table.Row>
    </BlockTable>
  );
}

function ProfileIncomeTax() {
  return (
    <BlockTable title="所得税" trailing={<TableHeaderButtons showAdd={false} />}>
      <Table.Row>
        <Table.Cell width="fit" as="th">
          税区分
        </Table.Cell>
        <Table.Cell as="td">{mockIncomeTax.taxCategory}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">扶養人数</Table.Cell>
        <Table.Cell as="td">{mockIncomeTax.dependentCount}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">基礎控除</Table.Cell>
        <Table.Cell as="td">{mockIncomeTax.basicDeduction}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">配偶者控除</Table.Cell>
        <Table.Cell as="td">{mockIncomeTax.spouseDeduction}</Table.Cell>
      </Table.Row>
    </BlockTable>
  );
}

export default function TaxInsurancePage() {
  return (
    <ProfileLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader size="large">
            <ContentHeaderTitle as="h2">税・保険</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
            <ProfileEmploymentInsurance />
            <ProfileSocialInsurance />
            <ProfileLivingTax />
            <ProfileIncomeTax />
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </ProfileLayout>
  );
}
