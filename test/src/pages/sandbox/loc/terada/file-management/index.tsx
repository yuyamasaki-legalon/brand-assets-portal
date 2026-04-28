import { LfEllipsisDot, LfFilter, LfPlusLarge } from "@legalforce/aegis-icons";
import {
  Button,
  ButtonGroup,
  ContentHeader,
  ContentHeaderTitle,
  Drawer,
  FormControl,
  Icon,
  IconButton,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutStickyContainer,
  RangeDateField,
  Search,
  Select,
  Table,
  TableContainer,
  Text,
  TextField,
  Toolbar,
  ToolbarSpacer,
  Tooltip,
} from "@legalforce/aegis-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocSidebarLayout } from "../../../../template/loc/_shared";

type FileRow = {
  id: string;
  title: string;
  partner: string;
  version: number;
  status: string;
  manager: string;
  uploader: string;
  managementNumber: string;
};

const sampleFiles: FileRow[] = [
  {
    id: "1",
    title: "秘密保持契約",
    partner: "株式会社LegalOn Technologies",
    version: 2,
    status: "なし",
    manager: "山田太郎",
    uploader: "田中花子",
    managementNumber: "CTR-2024-001",
  },
  {
    id: "2",
    title: "業務委託契約書",
    partner: "株式会社サンプル商事",
    version: 1,
    status: "なし",
    manager: "佐藤次郎",
    uploader: "鈴木一郎",
    managementNumber: "CTR-2024-002",
  },
  {
    id: "3",
    title: "ソフトウェア使用許諾契約",
    partner: "テクノロジー株式会社",
    version: 3,
    status: "なし",
    manager: "高橋美咲",
    uploader: "伊藤健太",
    managementNumber: "CTR-2024-003",
  },
  {
    id: "4",
    title: "販売代理店契約書",
    partner: "株式会社グローバル商社",
    version: 1,
    status: "なし",
    manager: "中村真理",
    uploader: "小林良太",
    managementNumber: "CTR-2024-004",
  },
  {
    id: "5",
    title: "秘密保持契約",
    partner: "株式会社イノベーション",
    version: 1,
    status: "なし",
    manager: "渡辺直樹",
    uploader: "加藤明美",
    managementNumber: "CTR-2024-005",
  },
  {
    id: "6",
    title: "リース契約書",
    partner: "株式会社ファイナンス",
    version: 2,
    status: "なし",
    manager: "山本恵子",
    uploader: "吉田大輔",
    managementNumber: "CTR-2024-006",
  },
  {
    id: "7",
    title: "保守サービス契約",
    partner: "サポート株式会社",
    version: 1,
    status: "なし",
    manager: "松本裕子",
    uploader: "井上修",
    managementNumber: "CTR-2024-007",
  },
  {
    id: "8",
    title: "秘密保持契約",
    partner: "株式会社パートナーズ",
    version: 1,
    status: "なし",
    manager: "木村智子",
    uploader: "林誠",
    managementNumber: "CTR-2024-008",
  },
  {
    id: "9",
    title: "共同開発契約書",
    partner: "株式会社リサーチ",
    version: 2,
    status: "なし",
    manager: "清水雅人",
    uploader: "斎藤由美",
    managementNumber: "CTR-2024-009",
  },
  {
    id: "10",
    title: "顧問契約書",
    partner: "コンサルティング株式会社",
    version: 1,
    status: "なし",
    manager: "山口博之",
    uploader: "阿部千尋",
    managementNumber: "CTR-2024-010",
  },
  {
    id: "11",
    title: "秘密保持契約",
    partner: "株式会社エンタープライズ",
    version: 1,
    status: "なし",
    manager: "橋本優子",
    uploader: "藤田浩二",
    managementNumber: "CTR-2024-011",
  },
  {
    id: "12",
    title: "売買基本契約書",
    partner: "トレーディング株式会社",
    version: 3,
    status: "なし",
    manager: "石井正樹",
    uploader: "前田美穂",
    managementNumber: "CTR-2024-012",
  },
  {
    id: "13",
    title: "秘密保持契約",
    partner: "株式会社ビジネスソリューションズ",
    version: 1,
    status: "なし",
    manager: "長谷川隆",
    uploader: "近藤さくら",
    managementNumber: "CTR-2024-013",
  },
  {
    id: "14",
    title: "システム開発契約書",
    partner: "ソフトウェア開発株式会社",
    version: 2,
    status: "なし",
    manager: "森田和也",
    uploader: "池田香織",
    managementNumber: "CTR-2024-014",
  },
];

const FileManagementList = () => {
  const navigate = useNavigate();
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
              <ContentHeaderTitle>契約書</ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>

          <PageLayoutBody>
            <PageLayoutStickyContainer>
              <Toolbar>
                <ToolbarSpacer />
                <Button
                  variant={filterOpen ? "subtle" : "plain"}
                  leading={
                    <Icon>
                      <LfFilter />
                    </Icon>
                  }
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  フィルター
                </Button>

                <ButtonGroup>
                  <Search placeholder="検索" shrinkOnBlur />

                  <Menu placement="bottom-end">
                    <Menu.Anchor>
                      <Tooltip title="その他のオプション">
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

            <TableContainer stickyHeader ref={drawerRoot}>
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Cell as="th">契約書タイトル</Table.Cell>
                    <Table.Cell as="th">取引先名</Table.Cell>
                    <Table.Cell as="th">バージョン</Table.Cell>
                    <Table.Cell as="th">契約書ステータス</Table.Cell>
                    <Table.Cell as="th">契約担当者</Table.Cell>
                    <Table.Cell as="th">ファイル追加者</Table.Cell>
                    <Table.Cell as="th">管理番号</Table.Cell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {sampleFiles.map((file) => (
                    <Table.Row
                      key={file.id}
                      onClick={() => navigate(`/sandbox/loc/terada/file-management/detail/${file.id}`)}
                      style={{ cursor: "pointer" }}
                    >
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
                      <Table.Cell>{file.version}</Table.Cell>
                      <Table.Cell>{file.status}</Table.Cell>
                      <Table.Cell>{file.manager}</Table.Cell>
                      <Table.Cell maxWidth="xSmall">
                        <Tooltip title={file.uploader} placement="top" onlyOnOverflow>
                          <Text numberOfLines={1}>{file.uploader}</Text>
                        </Tooltip>
                      </Table.Cell>
                      <Table.Cell>{file.managementNumber}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </TableContainer>
          </PageLayoutBody>
        </PageLayoutContent>

        <Drawer
          open={filterOpen}
          onOpenChange={setFilterOpen}
          position="end"
          root={drawerRoot as React.RefObject<HTMLElement>}
        >
          <Drawer.Header color="inverse">
            <ContentHeader>
              <ContentHeaderTitle>フィルター</ContentHeaderTitle>
            </ContentHeader>
          </Drawer.Header>

          <Drawer.Body>
            <FormControl>
              <FormControl.Label>契約書タイトル</FormControl.Label>
              <TextField placeholder="検索" />
            </FormControl>

            <FormControl>
              <FormControl.Label>取引先名</FormControl.Label>
              <TextField placeholder="検索" />
            </FormControl>

            <FormControl>
              <FormControl.Label>契約書ステータス</FormControl.Label>
              <Select
                options={[
                  { label: "すべて", value: "all" },
                  { label: "なし", value: "none" },
                ]}
                placeholder="選択してください"
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>アップロード日</FormControl.Label>
              <RangeDateField />
            </FormControl>
          </Drawer.Body>

          <div
            style={{
              borderTop: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-neutral-subtle)",
            }}
          >
            <Drawer.Footer>
              <ButtonGroup>
                <Button variant="plain" onClick={() => setFilterOpen(false)}>
                  リセット
                </Button>
              </ButtonGroup>
            </Drawer.Footer>
          </div>
        </Drawer>
      </PageLayout>
    </LocSidebarLayout>
  );
};

export default FileManagementList;
