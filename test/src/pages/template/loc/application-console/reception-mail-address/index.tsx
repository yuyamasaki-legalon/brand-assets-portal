import {
  LfArrowUpRightFromSquare,
  LfCopy,
  LfEllipsisDot,
  LfPlusLarge,
  LfQuestionCircle,
} from "@legalforce/aegis-icons";
import {
  ActionList,
  Banner,
  Button,
  ButtonGroup,
  ContentHeader,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  Form,
  FormControl,
  FormGroup,
  Icon,
  IconButton,
  Link,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  StatusLabel,
  Table,
  TableContainer,
  Text,
  TextField,
  Tooltip,
} from "@legalforce/aegis-react";
import { LocSidebarLayout } from "../../_shared";
import { Navigation, NavigationHeader } from "../_shared";

// サンプルデータ
type MailAddress = {
  id: string;
  address: string;
  status: "available";
  isSystem: boolean;
};

const sampleMailAddresses: MailAddress[] = [
  { id: "1", address: "legal@example.com", status: "available", isSystem: true },
  { id: "2", address: "legal@example.co.jp", status: "available", isSystem: false },
  { id: "3", address: "support@example.co.jp", status: "available", isSystem: false },
];

// メールアドレス追加ダイアログ
const RegisterMailAddressDialog = () => {
  return (
    <Dialog closeOnEsc>
      <DialogTrigger>
        <Button leading={LfPlusLarge}>メールアドレスを追加</Button>
      </DialogTrigger>
      <DialogContent width="xLarge">
        <DialogHeader>
          <ContentHeader>
            <ContentHeader.Title>
              <Text variant="title.medium">メールアドレスを追加</Text>
            </ContentHeader.Title>
          </ContentHeader>
        </DialogHeader>
        <DialogBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
            {/* 情報バナー */}
            <Banner color="information" closeButton={false}>
              <Text variant="body.medium">{"以下のヘルプを参考に、手順に沿って進めてください。"}</Text>
              <div>
                <Link href="#" trailing={LfArrowUpRightFromSquare} target="_blank" rel="noopener noreferrer">
                  案件受付メールアドレスの追加方法
                </Link>
              </div>
            </Banner>

            {/* 手順1 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
              <Text variant="title.xSmall">手順1：案件受付メール専用のドメインを用意</Text>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <Text as="p" variant="body.medium" whiteSpace="pre-wrap">
                  {
                    "DNS設定が可能なドメインの用意を、貴社のシステム管理部門に依頼してください。\n※手順3でDNS設定が必要です。DNS設定が必要であることもあわせてお伝えすることをおすすめします。"
                  }
                </Text>
                <div>
                  <Link
                    href="#"
                    leading={LfQuestionCircle}
                    trailing={LfArrowUpRightFromSquare}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ドメインの準備について
                  </Link>
                </div>
              </div>
            </div>

            {/* 手順2 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
              <Text variant="title.xSmall">手順2：メールアドレスを仮登録</Text>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <Text as="p" variant="body.medium" whiteSpace="pre-wrap">
                  {
                    "以下のフォームから、メールアドレスを仮登録してください。\n仮登録後、次の手順（DNS設定・本登録）で必要なDNSレコードが表示されます。\n※本登録が完了するまでメールアドレスは利用できません。"
                  }
                </Text>
              </div>
              <Form>
                <FormGroup>
                  <FormControl required>
                    <FormControl.Label>@より前の部分</FormControl.Label>
                    <TextField placeholder="legal.request" />
                  </FormControl>
                  <FormControl required>
                    <FormControl.Label>案件受付メール専用のドメイン</FormControl.Label>
                    <TextField placeholder="matter.legalontech.jp" leading="@" />
                  </FormControl>
                </FormGroup>
              </Form>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <ButtonGroup>
            <Button variant="plain">キャンセル</Button>
            <Button disabled>仮登録</Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const CaseReceptionMailAddressTemplate = () => {
  return (
    <LocSidebarLayout activeId="cases">
      <PageLayout>
        <PageLayoutPane>
          <PageLayoutHeader>
            <NavigationHeader />
          </PageLayoutHeader>
          <PageLayoutBody>
            <Navigation currentPage="reception-mail-address" />
          </PageLayoutBody>
        </PageLayoutPane>
        <PageLayoutContent align="start" maxWidth="max">
          <PageLayoutHeader>
            <Text as="h1" variant="title.large">
              案件受付メールアドレス
            </Text>
          </PageLayoutHeader>
          <PageLayoutBody>
            {/* リードテキスト */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-xSmall)",
              }}
            >
              <Text as="p" variant="component.medium" whiteSpace="pre-wrap">
                {
                  "案件受付メールアドレスに対して新規メールを送信すると、案件が作成されます。\n案件受付メールアドレスの漏洩には十分ご注意ください。"
                }
              </Text>
              <div>
                <Link
                  href="#"
                  leading={LfQuestionCircle}
                  trailing={LfArrowUpRightFromSquare}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  案件受付メールアドレスを利用した案件依頼の方法
                </Link>
              </div>
            </div>

            {/* メールアドレス一覧 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-large)",
                paddingBlockStart: "var(--aegis-space-large)",
              }}
            >
              <div>
                <RegisterMailAddressDialog />
              </div>
              <TableContainer>
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Cell>メールアドレス</Table.Cell>
                      <Table.Cell>ステータス</Table.Cell>
                      <Table.Cell />
                      <Table.Cell />
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {sampleMailAddresses.map((mail) => (
                      <Table.Row key={mail.id} hover={false}>
                        <Table.Cell>
                          <Text variant="body.medium">{mail.address}</Text>
                        </Table.Cell>
                        <Table.Cell width="auto">
                          <StatusLabel variant="fill" color="teal" size="small">
                            利用可能
                          </StatusLabel>
                        </Table.Cell>
                        <Table.Cell>
                          <Button leading={LfCopy} size="small" variant="subtle">
                            コピー
                          </Button>
                        </Table.Cell>
                        <Table.Cell>
                          {!mail.isSystem && (
                            <Menu placement="bottom-end">
                              <Menu.Anchor>
                                <Tooltip title="メニューを表示">
                                  <IconButton variant="subtle" aria-label="メニューを表示" size="small">
                                    <Icon>
                                      <LfEllipsisDot />
                                    </Icon>
                                  </IconButton>
                                </Tooltip>
                              </Menu.Anchor>
                              <Menu.Box width="xSmall">
                                <ActionList size="large">
                                  <ActionList.Group>
                                    <ActionList.Item color="danger">
                                      <ActionList.Body>削除</ActionList.Body>
                                    </ActionList.Item>
                                  </ActionList.Group>
                                </ActionList>
                              </Menu.Box>
                            </Menu>
                          )}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </TableContainer>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
};

export default CaseReceptionMailAddressTemplate;
