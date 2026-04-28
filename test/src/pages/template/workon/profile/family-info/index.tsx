import { LfPlusLarge, LfTrash } from "@legalforce/aegis-icons";
import {
  Button,
  ContentHeader,
  ContentHeaderTitle,
  IconButton,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Table,
  Tooltip,
} from "@legalforce/aegis-react";
import { BlockTable, ProfileLayout, TableHeaderButtons } from "../_components";

// モックデータ: 家族情報
interface FamilyMember {
  id: string;
  name: string;
  nameKana: string;
  relationship: string;
  birthDate: string;
  gender: string;
  livingTogether: string;
  dependentType: string;
  healthInsuranceDependent: string;
  taxDependent: string;
  disabilityType: string;
  occupation: string;
  annualIncome: string;
}

const mockFamilyMembers: FamilyMember[] = [
  {
    id: "1",
    name: "山田 花子",
    nameKana: "ヤマダ ハナコ",
    relationship: "配偶者",
    birthDate: "1992/03/20",
    gender: "女性",
    livingTogether: "同居",
    dependentType: "扶養あり",
    healthInsuranceDependent: "対象",
    taxDependent: "対象",
    disabilityType: "該当なし",
    occupation: "パート",
    annualIncome: "100万円",
  },
  {
    id: "2",
    name: "山田 一郎",
    nameKana: "ヤマダ イチロウ",
    relationship: "子",
    birthDate: "2018/06/10",
    gender: "男性",
    livingTogether: "同居",
    dependentType: "扶養あり",
    healthInsuranceDependent: "対象",
    taxDependent: "対象",
    disabilityType: "該当なし",
    occupation: "就学前",
    annualIncome: "--",
  },
  {
    id: "3",
    name: "山田 二郎",
    nameKana: "ヤマダ ジロウ",
    relationship: "子",
    birthDate: "2021/09/15",
    gender: "男性",
    livingTogether: "同居",
    dependentType: "扶養あり",
    healthInsuranceDependent: "対象",
    taxDependent: "対象",
    disabilityType: "該当なし",
    occupation: "就学前",
    annualIncome: "--",
  },
];

function ProfileFamilyCard({ member }: { member: FamilyMember }) {
  return (
    <BlockTable
      title={`家族情報 - ${member.name}`}
      trailing={
        <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)", alignItems: "center" }}>
          <TableHeaderButtons showAdd={false} />
          <Tooltip title="削除">
            <IconButton size="medium" variant="subtle" color="neutral" aria-label="削除">
              <LfTrash />
            </IconButton>
          </Tooltip>
        </div>
      }
    >
      <Table.Row>
        <Table.Cell width="fit" as="th">
          氏名
        </Table.Cell>
        <Table.Cell as="td">{member.name}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">氏名（カナ）</Table.Cell>
        <Table.Cell as="td">{member.nameKana}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">続柄</Table.Cell>
        <Table.Cell as="td">{member.relationship}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">生年月日</Table.Cell>
        <Table.Cell as="td">{member.birthDate}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">性別</Table.Cell>
        <Table.Cell as="td">{member.gender}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">同居・別居</Table.Cell>
        <Table.Cell as="td">{member.livingTogether}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">扶養区分</Table.Cell>
        <Table.Cell as="td">{member.dependentType}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">健康保険扶養</Table.Cell>
        <Table.Cell as="td">{member.healthInsuranceDependent}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">税扶養</Table.Cell>
        <Table.Cell as="td">{member.taxDependent}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">障害区分</Table.Cell>
        <Table.Cell as="td">{member.disabilityType}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">職業</Table.Cell>
        <Table.Cell as="td">{member.occupation}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">年収</Table.Cell>
        <Table.Cell as="td">{member.annualIncome}</Table.Cell>
      </Table.Row>
    </BlockTable>
  );
}

export default function FamilyInfoPage() {
  return (
    <ProfileLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader size="large">
            <ContentHeaderTitle as="h2">配偶者・家族</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
            {mockFamilyMembers.map((member) => (
              <ProfileFamilyCard key={member.id} member={member} />
            ))}
            <Button variant="subtle" color="neutral" leading={LfPlusLarge}>
              家族を追加
            </Button>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </ProfileLayout>
  );
}
