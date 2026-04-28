import { LfAngleDownMiddle, LfPen, LfPlusLarge, LfTrash } from "@legalforce/aegis-icons";
import {
  ActionList,
  Button,
  ButtonGroup,
  Icon,
  IconButton,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Table,
  TableContainer,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { LocSidebarLayout } from "../../../_shared";
import { Navigation, NavigationHeader } from "../_shared";

// =============================================================================
// Types
// =============================================================================

interface ContractCustomAttribute {
  id: string;
  name: string;
  /** AI 抽出状況のラベル。空文字なら未設定 */
  extractionStatus: string;
}

// =============================================================================
// Mock Data
// =============================================================================

const MAX_ATTRIBUTES = 50;

const initialAttributes: ContractCustomAttribute[] = [
  { id: "1", name: "重要度", extractionStatus: "" },
  { id: "2", name: "カスタム", extractionStatus: "" },
  { id: "3", name: "関連部門", extractionStatus: "" },
  { id: "4", name: "test", extractionStatus: "" },
  { id: "5", name: "hoge", extractionStatus: "" },
];

// =============================================================================
// Component
// =============================================================================

export default function ContractCustomAttributeDefinitionTemplate() {
  const canAdd = initialAttributes.length < MAX_ATTRIBUTES;

  return (
    <LocSidebarLayout activeId="others">
      <PageLayout>
        <PageLayoutPane>
          <PageLayoutHeader>
            <NavigationHeader />
          </PageLayoutHeader>
          <PageLayoutBody>
            <Navigation currentPage="custom-attribute-definition" />
          </PageLayoutBody>
        </PageLayoutPane>
        <PageLayoutContent align="start" maxWidth="large">
          <PageLayoutHeader>
            <Text as="h1" variant="title.large">
              契約カスタム項目
            </Text>
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
              <Text as="p" variant="body.medium">
                契約書に付与する管理項目を最大{MAX_ATTRIBUTES}件追加できます。
              </Text>

              {/* 項目を追加 ButtonGroup */}
              <div>
                <ButtonGroup attached>
                  <Button leading={LfPlusLarge} variant="solid" disabled={!canAdd}>
                    項目を追加
                  </Button>
                  <Menu placement="bottom-start">
                    <Menu.Anchor>
                      <Tooltip title="その他の追加方法">
                        <IconButton variant="solid" aria-label="その他の追加方法を表示">
                          <Icon>
                            <LfAngleDownMiddle />
                          </Icon>
                        </IconButton>
                      </Tooltip>
                    </Menu.Anchor>
                    <Menu.Box>
                      <ActionList size="large">
                        <ActionList.Item>
                          <ActionList.Body>手動入力する項目を追加</ActionList.Body>
                        </ActionList.Item>
                        <ActionList.Item>
                          <ActionList.Body>自動抽出する項目を追加</ActionList.Body>
                        </ActionList.Item>
                      </ActionList>
                    </Menu.Box>
                  </Menu>
                </ButtonGroup>
              </div>

              {/* テーブル */}
              <TableContainer>
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Cell>項目名</Table.Cell>
                      <Table.Cell>抽出状況</Table.Cell>
                      <Table.Cell />
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {initialAttributes.map((attr) => (
                      <Table.Row key={attr.id} hover={false}>
                        <Table.Cell>
                          <Text>{attr.name}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text color="subtle">{attr.extractionStatus || "-"}</Text>
                        </Table.Cell>
                        <Table.Cell width="auto">
                          <div
                            style={{
                              display: "flex",
                              gap: "var(--aegis-space-xxSmall)",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Tooltip title="編集">
                              <IconButton variant="plain" size="small" aria-label={`${attr.name}を編集`}>
                                <Icon>
                                  <LfPen />
                                </Icon>
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="削除">
                              <IconButton variant="plain" size="small" aria-label={`${attr.name}を削除`} color="danger">
                                <Icon>
                                  <LfTrash />
                                </Icon>
                              </IconButton>
                            </Tooltip>
                          </div>
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
