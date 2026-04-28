import {
  ContentHeader,
  ContentHeaderTitle,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Table,
} from "@legalforce/aegis-react";
import { BlockTable, ProfileLayout, TableHeaderButtons } from "../_components";

// モックデータ: 在留資格
const mockVisaStatus = {
  residenceStatus: "永住者",
  residenceStatusExpiry: "--",
  workPermission: "就労制限なし",
  visaType: "--",
  visaExpiry: "--",
};

// モックデータ: 障害者情報
const mockDisability = {
  disabilityType: "該当なし",
  disabilityGrade: "--",
  disabilityCertificateNumber: "--",
  disabilityCertificateExpiry: "--",
  specialDisability: "--",
};

// モックデータ: 勤労学生
const mockLabor = {
  workingStudent: "該当なし",
  schoolName: "--",
  enrollmentPeriod: "--",
};

// モックデータ: 寡婦・ひとり親
const mockSingleParent = {
  widowSingleParentType: "該当なし",
  childCount: "--",
};

// モックデータ: 定年後再雇用
const mockReEmployment = {
  reEmploymentType: "該当なし",
  originalRetirementDate: "--",
  reEmploymentStartDate: "--",
  reEmploymentEndDate: "--",
};

function ProfileVisaStatus() {
  return (
    <BlockTable title="在留資格" trailing={<TableHeaderButtons showAdd={false} />}>
      <Table.Row>
        <Table.Cell width="fit" as="th">
          在留資格
        </Table.Cell>
        <Table.Cell as="td">{mockVisaStatus.residenceStatus}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">在留期限</Table.Cell>
        <Table.Cell as="td">{mockVisaStatus.residenceStatusExpiry}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">就労許可</Table.Cell>
        <Table.Cell as="td">{mockVisaStatus.workPermission}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">ビザ種別</Table.Cell>
        <Table.Cell as="td">{mockVisaStatus.visaType}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">ビザ有効期限</Table.Cell>
        <Table.Cell as="td">{mockVisaStatus.visaExpiry}</Table.Cell>
      </Table.Row>
    </BlockTable>
  );
}

function ProfileDisability() {
  return (
    <BlockTable title="障害者情報" trailing={<TableHeaderButtons showAdd={false} />}>
      <Table.Row>
        <Table.Cell width="fit" as="th">
          障害区分
        </Table.Cell>
        <Table.Cell as="td">{mockDisability.disabilityType}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">障害等級</Table.Cell>
        <Table.Cell as="td">{mockDisability.disabilityGrade}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">障害者手帳番号</Table.Cell>
        <Table.Cell as="td">{mockDisability.disabilityCertificateNumber}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">障害者手帳有効期限</Table.Cell>
        <Table.Cell as="td">{mockDisability.disabilityCertificateExpiry}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">特別障害者</Table.Cell>
        <Table.Cell as="td">{mockDisability.specialDisability}</Table.Cell>
      </Table.Row>
    </BlockTable>
  );
}

function ProfileLabor() {
  return (
    <BlockTable title="勤労学生" trailing={<TableHeaderButtons showAdd={false} />}>
      <Table.Row>
        <Table.Cell width="fit" as="th">
          勤労学生
        </Table.Cell>
        <Table.Cell as="td">{mockLabor.workingStudent}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">学校名</Table.Cell>
        <Table.Cell as="td">{mockLabor.schoolName}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">在学期間</Table.Cell>
        <Table.Cell as="td">{mockLabor.enrollmentPeriod}</Table.Cell>
      </Table.Row>
    </BlockTable>
  );
}

function ProfileSingleParent() {
  return (
    <BlockTable title="寡婦・ひとり親" trailing={<TableHeaderButtons showAdd={false} />}>
      <Table.Row>
        <Table.Cell width="fit" as="th">
          寡婦・ひとり親区分
        </Table.Cell>
        <Table.Cell as="td">{mockSingleParent.widowSingleParentType}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">扶養親族数（子）</Table.Cell>
        <Table.Cell as="td">{mockSingleParent.childCount}</Table.Cell>
      </Table.Row>
    </BlockTable>
  );
}

function ProfileReEmployment() {
  return (
    <BlockTable title="定年後再雇用" trailing={<TableHeaderButtons showAdd={false} />}>
      <Table.Row>
        <Table.Cell width="fit" as="th">
          再雇用区分
        </Table.Cell>
        <Table.Cell as="td">{mockReEmployment.reEmploymentType}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">定年退職日</Table.Cell>
        <Table.Cell as="td">{mockReEmployment.originalRetirementDate}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">再雇用開始日</Table.Cell>
        <Table.Cell as="td">{mockReEmployment.reEmploymentStartDate}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">再雇用終了日</Table.Cell>
        <Table.Cell as="td">{mockReEmployment.reEmploymentEndDate}</Table.Cell>
      </Table.Row>
    </BlockTable>
  );
}

export default function AdditionalInfoPage() {
  return (
    <ProfileLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader size="large">
            <ContentHeaderTitle as="h2">付加情報</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
            <ProfileVisaStatus />
            <ProfileDisability />
            <ProfileLabor />
            <ProfileSingleParent />
            <ProfileReEmployment />
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </ProfileLayout>
  );
}
