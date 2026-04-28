import { LfEllipsisDot, LfPlusLarge } from "@legalforce/aegis-icons";
import {
  ActionList,
  Button,
  Icon,
  IconButton,
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
  Tooltip,
} from "@legalforce/aegis-react";
import { LocSidebarLayout } from "../../../_shared";
import { Navigation, NavigationHeader } from "../_shared";

// 取り込み設定の型定義
interface EsignIntegrationItem {
  id: string;
  settingName: string;
  destination: string;
  service: string;
  status: "active" | "stopped";
}

// モックデータ
const integrationItems: EsignIntegrationItem[] = [
  {
    id: "1",
    settingName: "DocuSign20241115",
    destination: "署名依頼スペース",
    service: "DocuSign",
    status: "stopped",
  },
  {
    id: "2",
    settingName: "CloudSign連携_本番",
    destination: "締結済み契約書スペース",
    service: "CloudSign",
    status: "active",
  },
];

export default function EsignIntegrationTemplate() {
  return (
    <LocSidebarLayout activeId="others">
      <PageLayout>
        <PageLayoutPane>
          <PageLayoutHeader>
            <NavigationHeader />
          </PageLayoutHeader>
          <PageLayoutBody>
            <Navigation currentPage="esign-integration" />
          </PageLayoutBody>
        </PageLayoutPane>
        <PageLayoutContent align="start">
          <PageLayoutHeader>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text as="h1" variant="title.large">
                電子契約サービス連携
              </Text>
              <Button leading={LfPlusLarge}>追加</Button>
            </div>
          </PageLayoutHeader>
          <PageLayoutBody>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-large)",
              }}
            >
              {/* リードテキスト */}
              <Text as="p" variant="component.medium">
                外部の電子契約サービスと連携し、締結版契約書を取り込むことができます。
              </Text>

              {/* テーブル */}
              <TableContainer>
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Cell>取り込み設定名</Table.Cell>
                      <Table.Cell>取り込み先</Table.Cell>
                      <Table.Cell>連携サービス</Table.Cell>
                      <Table.Cell>状態</Table.Cell>
                      <Table.Cell />
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {integrationItems.map((item) => (
                      <Table.Row key={item.id} hover={false}>
                        <Table.Cell>{item.settingName}</Table.Cell>
                        <Table.Cell>{item.destination}</Table.Cell>
                        <Table.Cell>{item.service}</Table.Cell>
                        <Table.Cell>
                          <StatusLabel variant="fill" color={item.status === "active" ? "teal" : "neutral"}>
                            {item.status === "active" ? "連携中" : "連携停止中"}
                          </StatusLabel>
                        </Table.Cell>
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
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
}
