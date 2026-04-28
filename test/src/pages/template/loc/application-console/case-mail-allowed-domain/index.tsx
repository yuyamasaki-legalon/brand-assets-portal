import { LfArrowUpRightFromSquare, LfEllipsisDot, LfPlusLarge, LfQuestionCircle } from "@legalforce/aegis-icons";
import {
  ActionList,
  Button,
  Divider,
  FormControl,
  Icon,
  IconButton,
  Link,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Radio,
  RadioGroup,
  Table,
  TableContainer,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { LocSidebarLayout } from "../../_shared";
import { Navigation, NavigationHeader } from "../_shared";

const sampleDomains = [
  { id: "1", domain: "example.com", memo: "自社ドメイン" },
  { id: "2", domain: "legalforce.co.jp", memo: "" },
  { id: "3", domain: "partner-company.jp", memo: "子会社" },
];

const CaseMailAllowedDomainTemplate = () => {
  return (
    <LocSidebarLayout activeId="cases">
      <PageLayout>
        <PageLayoutPane>
          <PageLayoutHeader>
            <NavigationHeader />
          </PageLayoutHeader>
          <PageLayoutBody>
            <Navigation currentPage="case-mail-allowed-domain" />
          </PageLayoutBody>
        </PageLayoutPane>
        <PageLayoutContent>
          <PageLayoutHeader>
            <Text as="h1" variant="title.large">
              ドメイン制限
            </Text>
          </PageLayoutHeader>
          <PageLayoutBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxLarge)" }}>
              {/* リードテキスト */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-xSmall)",
                  maxWidth: "var(--aegis-layout-width-medium)",
                }}
              >
                <Text as="p" variant="component.medium" whiteSpace="pre-wrap">
                  {
                    "メールでの案件作成と送受信を、登録したドメインに制限できます。\n外部からの攻撃や、偽装メールによる情報漏洩を防ぐため、設定を推奨します。"
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
                    ドメインを制限する
                  </Link>
                </div>
              </div>

              {/* ドメイン制限の適用範囲 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-medium)",
                  maxWidth: "var(--aegis-layout-width-medium)",
                }}
              >
                <Text as="h2" variant="title.small">
                  ドメイン制限の適用範囲
                </Text>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-xxLarge)",
                  }}
                >
                  <FormControl>
                    <FormControl.Label>LegalOnの受信元</FormControl.Label>
                    <RadioGroup value="all">
                      <Radio value="all">登録ドメインからのみ受信</Radio>
                      <Radio value="firstMail">
                        新規案件の作成時は登録ドメインからのみ受信、以降の返信はすべて受信
                      </Radio>
                      <Radio value="nothing">ドメイン制限を適用しない</Radio>
                    </RadioGroup>
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>LegalOnの送信先</FormControl.Label>
                    <RadioGroup value="all">
                      <Radio value="all">登録ドメインの宛先にのみ送信</Radio>
                      <Radio value="nothing">ドメイン制限を適用しない</Radio>
                    </RadioGroup>
                  </FormControl>
                  <div>
                    <Button>保存</Button>
                  </div>
                </div>
              </div>

              <Divider />

              {/* 送受信できるドメイン */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-medium)",
                }}
              >
                <Text as="h2" variant="title.small">
                  送受信できるドメイン
                </Text>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-large)",
                  }}
                >
                  <div>
                    <Button leading={LfPlusLarge}>ドメインを追加</Button>
                  </div>
                  <TableContainer>
                    <Table>
                      <Table.Head>
                        <Table.Row>
                          <Table.Cell>ドメイン</Table.Cell>
                          <Table.Cell>メモ</Table.Cell>
                          <Table.Cell />
                        </Table.Row>
                      </Table.Head>
                      <Table.Body>
                        {sampleDomains.map((domain) => (
                          <Table.Row key={domain.id} hover={false}>
                            <Table.Cell>{domain.domain}</Table.Cell>
                            <Table.Cell>{domain.memo}</Table.Cell>
                            <Table.Cell>
                              <Menu placement="bottom-end">
                                <Menu.Anchor>
                                  <Tooltip title="メニューボタン">
                                    <IconButton variant="plain" aria-label="メニューボタン" size="small">
                                      <Icon>
                                        <LfEllipsisDot />
                                      </Icon>
                                    </IconButton>
                                  </Tooltip>
                                </Menu.Anchor>
                                <Menu.Box width="xSmall">
                                  <ActionList size="large">
                                    <ActionList.Group>
                                      <ActionList.Item>
                                        <ActionList.Body>編集</ActionList.Body>
                                      </ActionList.Item>
                                    </ActionList.Group>
                                    <ActionList.Group>
                                      <ActionList.Item color="danger">
                                        <ActionList.Body>削除</ActionList.Body>
                                      </ActionList.Item>
                                    </ActionList.Group>
                                  </ActionList>
                                </Menu.Box>
                              </Menu>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
};

export default CaseMailAllowedDomainTemplate;
