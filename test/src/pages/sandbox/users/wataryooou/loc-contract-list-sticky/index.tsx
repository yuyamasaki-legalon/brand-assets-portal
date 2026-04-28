import { LfEllipsisDot, LfFilter, LfPlusLarge } from "@legalforce/aegis-icons";
import {
  Badge,
  Button,
  ButtonGroup,
  ContentHeader,
  Icon,
  IconButton,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutStickyContainer,
  Search,
  Tab,
  Table,
  TableContainer,
  Text,
  Toolbar,
  ToolbarSpacer,
  Tooltip,
} from "@legalforce/aegis-react";
import { useRef, useState } from "react";
import { LocSidebarLayout } from "../../../../template/loc/_shared";

type ContractRow = {
  id: string;
  title: string;
  partner: string;
  status: string;
  manager: string;
  managementNumber: string;
};

const contractTabs = [
  { label: "すべて", count: 128 },
  { label: "審査中", count: 42 },
  { label: "差戻し", count: 9 },
  { label: "締結済", count: 31 },
  { label: "下書き", count: 5 },
];

const sampleContracts: ContractRow[] = [
  {
    id: "1",
    title: "業務委託契約書",
    partner: "株式会社LegalOn Technologies",
    status: "審査中",
    manager: "山田太郎",
    managementNumber: "CTR-2025-001",
  },
  {
    id: "2",
    title: "販売代理店契約書",
    partner: "株式会社グローバル商社",
    status: "締結済",
    manager: "佐藤次郎",
    managementNumber: "CTR-2025-002",
  },
  {
    id: "3",
    title: "システム開発契約書",
    partner: "ソフトウェア開発株式会社",
    status: "審査中",
    manager: "高橋美咲",
    managementNumber: "CTR-2025-003",
  },
  {
    id: "4",
    title: "秘密保持契約書",
    partner: "株式会社パートナーズ",
    status: "差戻し",
    manager: "伊藤健太",
    managementNumber: "CTR-2025-004",
  },
  {
    id: "5",
    title: "売買基本契約書",
    partner: "トレーディング株式会社",
    status: "締結済",
    manager: "加藤明美",
    managementNumber: "CTR-2025-005",
  },
  {
    id: "6",
    title: "共同開発契約書",
    partner: "株式会社リサーチ",
    status: "下書き",
    manager: "小林良太",
    managementNumber: "CTR-2025-006",
  },
  {
    id: "7",
    title: "秘密保持契約書",
    partner: "株式会社エンタープライズ",
    status: "審査中",
    manager: "橋本優子",
    managementNumber: "CTR-2025-007",
  },
  {
    id: "8",
    title: "売買基本契約書",
    partner: "株式会社サンプル商事",
    status: "締結済",
    manager: "吉田大輔",
    managementNumber: "CTR-2025-008",
  },
  {
    id: "9",
    title: "共同開発契約書",
    partner: "株式会社イノベーション",
    status: "差戻し",
    manager: "木村智子",
    managementNumber: "CTR-2025-009",
  },
  {
    id: "10",
    title: "保守サービス契約書",
    partner: "サポート株式会社",
    status: "審査中",
    manager: "前田美穂",
    managementNumber: "CTR-2025-010",
  },
  {
    id: "11",
    title: "ソフトウェア使用許諾契約書",
    partner: "テクノロジー株式会社",
    status: "下書き",
    manager: "井上修",
    managementNumber: "CTR-2025-011",
  },
  {
    id: "12",
    title: "顧問契約書",
    partner: "コンサルティング株式会社",
    status: "締結済",
    manager: "山本恵子",
    managementNumber: "CTR-2025-012",
  },
  {
    id: "13",
    title: "秘密保持契約書",
    partner: "株式会社リサーチ",
    status: "審査中",
    manager: "中村真理",
    managementNumber: "CTR-2025-013",
  },
  {
    id: "14",
    title: "業務委託契約書",
    partner: "株式会社パートナーズ",
    status: "差戻し",
    manager: "清水雅人",
    managementNumber: "CTR-2025-014",
  },
  {
    id: "15",
    title: "販売代理店契約書",
    partner: "トレーディング株式会社",
    status: "締結済",
    manager: "森田和也",
    managementNumber: "CTR-2025-015",
  },
  {
    id: "16",
    title: "システム開発契約書",
    partner: "株式会社エンタープライズ",
    status: "審査中",
    manager: "斎藤由美",
    managementNumber: "CTR-2025-016",
  },
  {
    id: "17",
    title: "秘密保持契約書",
    partner: "株式会社グローバル商社",
    status: "下書き",
    manager: "佐藤次郎",
    managementNumber: "CTR-2025-017",
  },
  {
    id: "18",
    title: "売買基本契約書",
    partner: "株式会社LegalOn Technologies",
    status: "審査中",
    manager: "山田太郎",
    managementNumber: "CTR-2025-018",
  },
  {
    id: "19",
    title: "共同開発契約書",
    partner: "テクノロジー株式会社",
    status: "締結済",
    manager: "高橋美咲",
    managementNumber: "CTR-2025-019",
  },
  {
    id: "20",
    title: "保守サービス契約書",
    partner: "株式会社サンプル商事",
    status: "差戻し",
    manager: "伊藤健太",
    managementNumber: "CTR-2025-020",
  },
  {
    id: "21",
    title: "ソフトウェア使用許諾契約書",
    partner: "株式会社リサーチ",
    status: "審査中",
    manager: "加藤明美",
    managementNumber: "CTR-2025-021",
  },
  {
    id: "22",
    title: "顧問契約書",
    partner: "株式会社イノベーション",
    status: "締結済",
    manager: "小林良太",
    managementNumber: "CTR-2025-022",
  },
  {
    id: "23",
    title: "秘密保持契約書",
    partner: "トレーディング株式会社",
    status: "下書き",
    manager: "橋本優子",
    managementNumber: "CTR-2025-023",
  },
  {
    id: "24",
    title: "業務委託契約書",
    partner: "株式会社エンタープライズ",
    status: "審査中",
    manager: "吉田大輔",
    managementNumber: "CTR-2025-024",
  },
  {
    id: "25",
    title: "販売代理店契約書",
    partner: "株式会社LegalOn Technologies",
    status: "締結済",
    manager: "木村智子",
    managementNumber: "CTR-2025-025",
  },
  {
    id: "26",
    title: "システム開発契約書",
    partner: "ソフトウェア開発株式会社",
    status: "差戻し",
    manager: "前田美穂",
    managementNumber: "CTR-2025-026",
  },
  {
    id: "27",
    title: "秘密保持契約書",
    partner: "サポート株式会社",
    status: "審査中",
    manager: "井上修",
    managementNumber: "CTR-2025-027",
  },
  {
    id: "28",
    title: "売買基本契約書",
    partner: "コンサルティング株式会社",
    status: "締結済",
    manager: "山本恵子",
    managementNumber: "CTR-2025-028",
  },
  {
    id: "29",
    title: "共同開発契約書",
    partner: "株式会社パートナーズ",
    status: "下書き",
    manager: "中村真理",
    managementNumber: "CTR-2025-029",
  },
  {
    id: "30",
    title: "保守サービス契約書",
    partner: "株式会社グローバル商社",
    status: "審査中",
    manager: "清水雅人",
    managementNumber: "CTR-2025-030",
  },
];

export const LocContractListSticky = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const drawerRoot = useRef<HTMLDivElement>(null);

  return (
    <LocSidebarLayout activeId="contracts">
      <PageLayout>
        <PageLayoutContent>
          <PageLayoutHeader>
            <ContentHeader
              trailing={
                <Button
                  leading={
                    <Icon>
                      <LfPlusLarge />
                    </Icon>
                  }
                  variant="solid"
                  size="medium"
                >
                  契約書をアップロード
                </Button>
              }
            >
              <ContentHeader.Title>契約書</ContentHeader.Title>
            </ContentHeader>
          </PageLayoutHeader>

          <PageLayoutBody>
            <Tab.Group variant="plain">
              <PageLayoutStickyContainer>
                <Toolbar>
                  <div style={{ overflow: "hidden" }}>
                    <Tab.List>
                      {contractTabs.map((tab) => (
                        <Tab key={tab.label} trailing={<Badge color="danger" count={tab.count} />}>
                          <div style={{ inlineSize: "max-content", maxInlineSize: "200px" }}>
                            <Text whiteSpace="nowrap" numberOfLines={1}>
                              {tab.label}
                            </Text>
                          </div>
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                  <ToolbarSpacer />
                  <Button
                    variant={filterOpen ? "subtle" : "plain"}
                    leading={
                      <Icon>
                        <LfFilter />
                      </Icon>
                    }
                    onClick={() => setFilterOpen((prev) => !prev)}
                  >
                    フィルター
                  </Button>
                  <ButtonGroup>
                    <Search placeholder="検索" shrinkOnBlur />
                    <Menu placement="bottom-end">
                      <Menu.Anchor>
                        <Tooltip title="その他のオプション" placement="top">
                          <IconButton aria-label="その他のオプション">
                            <Icon>
                              <LfEllipsisDot />
                            </Icon>
                          </IconButton>
                        </Tooltip>
                      </Menu.Anchor>
                    </Menu>
                  </ButtonGroup>
                </Toolbar>
              </PageLayoutStickyContainer>

              <Tab.Panels ref={drawerRoot}>
                {contractTabs.map((tab, index) => (
                  <Tab.Panel key={tab.label}>
                    {index === 0 ? (
                      <TableContainer stickyHeader>
                        <Table>
                          <Table.Head>
                            <Table.Row>
                              <Table.Cell as="th">契約書タイトル</Table.Cell>
                              <Table.Cell as="th">取引先名</Table.Cell>
                              <Table.Cell as="th">契約書ステータス</Table.Cell>
                              <Table.Cell as="th">契約担当者</Table.Cell>
                              <Table.Cell as="th">管理番号</Table.Cell>
                            </Table.Row>
                          </Table.Head>
                          <Table.Body>
                            {sampleContracts.map((file) => (
                              <Table.Row key={file.id}>
                                <Table.Cell as="th" id={file.id} maxWidth="xSmall">
                                  <Tooltip title={file.title} placement="top" onlyOnOverflow>
                                    <Text numberOfLines={1}>{file.title}</Text>
                                  </Tooltip>
                                </Table.Cell>
                                <Table.Cell maxWidth="xSmall">
                                  <Tooltip title={file.partner} placement="top" onlyOnOverflow>
                                    <Text numberOfLines={1}>{file.partner}</Text>
                                  </Tooltip>
                                </Table.Cell>
                                <Table.Cell>{file.status}</Table.Cell>
                                <Table.Cell>{file.manager}</Table.Cell>
                                <Table.Cell>{file.managementNumber}</Table.Cell>
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Text variant="body.medium">このタブの内容は準備中です。</Text>
                    )}
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
};
