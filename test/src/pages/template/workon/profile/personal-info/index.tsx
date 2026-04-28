import { LfPen } from "@legalforce/aegis-icons";
import {
  Button,
  ContentHeader,
  ContentHeaderTitle,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Table,
} from "@legalforce/aegis-react";
import { BlockTable, ProfileLayout, TableHeaderButtons } from "../_components";

// モックデータ: 個人情報
const mockPersonalInfo = {
  legalName: "山田 太郎",
  legalNameKana: "ヤマダ タロウ",
  oldName: "--",
  oldNameKana: "--",
  birthDate: "1990/01/15",
  gender: "男性",
  bloodType: "A型",
  nationality: "日本",
};

// モックデータ: 住所・連絡先
const mockAddressContact = {
  postalCode: "100-0001",
  prefecture: "東京都",
  city: "千代田区",
  address1: "千代田1-1-1",
  address2: "サンプルマンション 101号室",
  phoneNumber: "090-1234-5678",
  email: "yamada.taro@personal.example.com",
  residenceType: "賃貸",
  moveInDate: "2020/04/01",
};

// モックデータ: 通勤経路
const mockCommuteRoute = {
  routeType: "電車",
  startStation: "東京駅",
  endStation: "新宿駅",
  viaStation: "渋谷駅",
  oneWayFare: "450円",
  monthlyFare: "12,500円",
  commuteTime: "45分",
};

// モックデータ: 給与銀行口座
const mockBankAccount = {
  bankName: "みずほ銀行",
  branchName: "東京営業部",
  accountType: "普通",
  accountNumber: "1234567",
  accountHolder: "ヤマダ タロウ",
};

// モックデータ: 緊急連絡先
const mockEmergencyContact = {
  name: "山田 花子",
  relationship: "配偶者",
  phoneNumber: "090-8765-4321",
  address: "東京都千代田区千代田1-1-1",
};

// モックデータ: 住民票住所
const mockResidentAddress = {
  postalCode: "100-0001",
  prefecture: "東京都",
  city: "千代田区",
  address1: "千代田1-1-1",
  address2: "サンプルマンション 101号室",
  householder: "山田 太郎",
  relationship: "本人",
};

function ProfilePersonalInfo() {
  return (
    <BlockTable title="個人情報" trailing={<TableHeaderButtons showAdd={false} />}>
      <Table.Row>
        <Table.Cell width="fit" as="th">
          戸籍上の氏名
        </Table.Cell>
        <Table.Cell as="td">{mockPersonalInfo.legalName}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">戸籍上の氏名（カナ）</Table.Cell>
        <Table.Cell as="td">{mockPersonalInfo.legalNameKana}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">旧姓</Table.Cell>
        <Table.Cell as="td">{mockPersonalInfo.oldName}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">旧姓（カナ）</Table.Cell>
        <Table.Cell as="td">{mockPersonalInfo.oldNameKana}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">生年月日</Table.Cell>
        <Table.Cell as="td">{mockPersonalInfo.birthDate}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">性別</Table.Cell>
        <Table.Cell as="td">{mockPersonalInfo.gender}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">血液型</Table.Cell>
        <Table.Cell as="td">{mockPersonalInfo.bloodType}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">国籍</Table.Cell>
        <Table.Cell as="td">{mockPersonalInfo.nationality}</Table.Cell>
      </Table.Row>
    </BlockTable>
  );
}

function ProfileAddressContact() {
  return (
    <BlockTable title="住所・連絡先" trailing={<TableHeaderButtons showAdd={false} />}>
      <Table.Row>
        <Table.Cell width="fit" as="th">
          郵便番号
        </Table.Cell>
        <Table.Cell as="td">{mockAddressContact.postalCode}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">都道府県</Table.Cell>
        <Table.Cell as="td">{mockAddressContact.prefecture}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">市区町村</Table.Cell>
        <Table.Cell as="td">{mockAddressContact.city}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">番地</Table.Cell>
        <Table.Cell as="td">{mockAddressContact.address1}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">建物名・部屋番号</Table.Cell>
        <Table.Cell as="td">{mockAddressContact.address2}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">電話番号</Table.Cell>
        <Table.Cell as="td">{mockAddressContact.phoneNumber}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">メールアドレス</Table.Cell>
        <Table.Cell as="td">{mockAddressContact.email}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">住居形態</Table.Cell>
        <Table.Cell as="td">{mockAddressContact.residenceType}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">入居日</Table.Cell>
        <Table.Cell as="td">{mockAddressContact.moveInDate}</Table.Cell>
      </Table.Row>
    </BlockTable>
  );
}

function ProfileCommutingRoute() {
  return (
    <BlockTable title="通勤経路" trailing={<TableHeaderButtons showAdd={false} />}>
      <Table.Row>
        <Table.Cell width="fit" as="th">
          通勤手段
        </Table.Cell>
        <Table.Cell as="td">{mockCommuteRoute.routeType}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">出発駅</Table.Cell>
        <Table.Cell as="td">{mockCommuteRoute.startStation}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">到着駅</Table.Cell>
        <Table.Cell as="td">{mockCommuteRoute.endStation}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">経由駅</Table.Cell>
        <Table.Cell as="td">{mockCommuteRoute.viaStation}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">片道運賃</Table.Cell>
        <Table.Cell as="td">{mockCommuteRoute.oneWayFare}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">定期代（月額）</Table.Cell>
        <Table.Cell as="td">{mockCommuteRoute.monthlyFare}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">通勤時間</Table.Cell>
        <Table.Cell as="td">{mockCommuteRoute.commuteTime}</Table.Cell>
      </Table.Row>
    </BlockTable>
  );
}

function ProfileSalaryBankAccount() {
  return (
    <BlockTable title="給与銀行口座" trailing={<TableHeaderButtons showAdd={false} />}>
      <Table.Row>
        <Table.Cell width="fit" as="th">
          銀行名
        </Table.Cell>
        <Table.Cell as="td">{mockBankAccount.bankName}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">支店名</Table.Cell>
        <Table.Cell as="td">{mockBankAccount.branchName}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">口座種別</Table.Cell>
        <Table.Cell as="td">{mockBankAccount.accountType}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">口座番号</Table.Cell>
        <Table.Cell as="td">{mockBankAccount.accountNumber}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">口座名義</Table.Cell>
        <Table.Cell as="td">{mockBankAccount.accountHolder}</Table.Cell>
      </Table.Row>
    </BlockTable>
  );
}

function ProfileEmergencyContact() {
  return (
    <BlockTable title="緊急連絡先" trailing={<TableHeaderButtons showAdd={false} />}>
      <Table.Row>
        <Table.Cell width="fit" as="th">
          氏名
        </Table.Cell>
        <Table.Cell as="td">{mockEmergencyContact.name}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">続柄</Table.Cell>
        <Table.Cell as="td">{mockEmergencyContact.relationship}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">電話番号</Table.Cell>
        <Table.Cell as="td">{mockEmergencyContact.phoneNumber}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">住所</Table.Cell>
        <Table.Cell as="td">{mockEmergencyContact.address}</Table.Cell>
      </Table.Row>
    </BlockTable>
  );
}

function ProfileResidentRecordAddress() {
  return (
    <BlockTable title="住民票住所" trailing={<TableHeaderButtons showAdd={false} />}>
      <Table.Row>
        <Table.Cell width="fit" as="th">
          郵便番号
        </Table.Cell>
        <Table.Cell as="td">{mockResidentAddress.postalCode}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">都道府県</Table.Cell>
        <Table.Cell as="td">{mockResidentAddress.prefecture}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">市区町村</Table.Cell>
        <Table.Cell as="td">{mockResidentAddress.city}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">番地</Table.Cell>
        <Table.Cell as="td">{mockResidentAddress.address1}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">建物名・部屋番号</Table.Cell>
        <Table.Cell as="td">{mockResidentAddress.address2}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">世帯主</Table.Cell>
        <Table.Cell as="td">{mockResidentAddress.householder}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell as="th">世帯主との続柄</Table.Cell>
        <Table.Cell as="td">{mockResidentAddress.relationship}</Table.Cell>
      </Table.Row>
    </BlockTable>
  );
}

export default function PersonalInfoPage() {
  return (
    <ProfileLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader
            size="large"
            trailing={
              <Button variant="solid" leading={LfPen}>
                一括編集
              </Button>
            }
          >
            <ContentHeaderTitle as="h2">個人情報</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
            <ProfilePersonalInfo />
            <ProfileAddressContact />
            <ProfileCommutingRoute />
            <ProfileSalaryBankAccount />
            <ProfileEmergencyContact />
            <ProfileResidentRecordAddress />
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </ProfileLayout>
  );
}
