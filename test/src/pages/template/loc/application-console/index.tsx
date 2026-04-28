import { LfArrowUpRightFromSquare, LfEllipsisDot, LfPlusLarge, LfQuestionCircle } from "@legalforce/aegis-icons";
import {
  ActionList,
  Button,
  Draggable,
  Icon,
  IconButton,
  Link,
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
import { useCallback, useState } from "react";
import { LocSidebarLayout } from "../_shared";
import { Navigation, NavigationHeader } from "./_shared";

// サンプルデータ
type CaseStatus = {
  id: string;
  name: string;
  kind: "builtin_not_started" | "builtin_closed" | "custom";
};

const initialNotStartedStatus: CaseStatus = {
  id: "builtin-not-started",
  name: "未着手",
  kind: "builtin_not_started",
};

const initialClosedStatus: CaseStatus = {
  id: "builtin-closed",
  name: "完了",
  kind: "builtin_closed",
};

const initialInProgressStatuses: CaseStatus[] = [
  { id: "1", name: "追加ステータス2", kind: "custom" },
  { id: "2", name: "追加ステータス1", kind: "custom" },
  { id: "3", name: "進行タスク001", kind: "custom" },
  { id: "4", name: "In other dept review", kind: "custom" },
  { id: "5", name: "案件ステータス追加", kind: "custom" },
  { id: "6", name: "test", kind: "custom" },
  { id: "7", name: "あいうえお", kind: "custom" },
  { id: "8", name: "あいうえおおあいうえおおあいうえおおあいうえお", kind: "custom" },
];

const MAX_STATUS_COUNT = 10;

// ステータス行コンポーネント
const StatusRow = ({ status, isDraggable }: { status: CaseStatus; isDraggable: boolean }) => {
  const rowContent = (
    <>
      <Table.Cell>
        {isDraggable ? <Draggable.Knob /> : <div style={{ width: "var(--aegis-size-medium)" }} />}
      </Table.Cell>
      <Table.Cell>{status.name}</Table.Cell>
      <Table.Cell>
        <Menu placement="bottom-end">
          <Menu.Anchor>
            <Tooltip title="オプション" placement="top">
              <IconButton variant="plain" aria-label="オプション">
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
              {isDraggable && (
                <ActionList.Group>
                  <ActionList.Item color="danger">
                    <ActionList.Body>削除</ActionList.Body>
                  </ActionList.Item>
                </ActionList.Group>
              )}
            </ActionList>
          </Menu.Box>
        </Menu>
      </Table.Cell>
    </>
  );

  if (isDraggable) {
    return (
      <Draggable.Item as={Table.Row} id={status.id} hover={false}>
        {rowContent}
      </Draggable.Item>
    );
  }

  return <Table.Row hover={false}>{rowContent}</Table.Row>;
};

const ApplicationConsoleTemplate = () => {
  const [inProgressStatuses, setInProgressStatuses] = useState<CaseStatus[]>(initialInProgressStatuses);

  const handleReorder = useCallback((newStatuses: CaseStatus[]) => {
    setInProgressStatuses(newStatuses);
  }, []);

  const canAddStatus = inProgressStatuses.length < MAX_STATUS_COUNT;

  return (
    <LocSidebarLayout activeId="cases">
      <PageLayout>
        <PageLayoutPane>
          <PageLayoutHeader>
            <NavigationHeader />
          </PageLayoutHeader>
          <PageLayoutBody>
            <Navigation currentPage="case-status" />
          </PageLayoutBody>
        </PageLayoutPane>
        <PageLayoutContent align="start" maxWidth="medium">
          <PageLayoutHeader>
            <Text as="h1" variant="title.large">
              案件ステータス
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
                  paddingBlockEnd: "var(--aegis-space-medium)",
                }}
              >
                <Text variant="body.medium">案件のステータスを追加・編集できます。</Text>
                <div>
                  <Link
                    href="#"
                    leading={LfQuestionCircle}
                    trailing={LfArrowUpRightFromSquare}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    案件ステータスの設定
                  </Link>
                </div>
              </div>

              {/* 未着手セクション */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-medium)",
                }}
              >
                <Text as="h2" variant="title.small">
                  未着手
                </Text>
                <TableContainer>
                  <Table>
                    <Table.Head>
                      <Table.Row>
                        <Table.Cell />
                        <Table.Cell>案件ステータス名</Table.Cell>
                        <Table.Cell />
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      <StatusRow status={initialNotStartedStatus} isDraggable={false} />
                    </Table.Body>
                  </Table>
                </TableContainer>
              </div>

              {/* 進行中セクション */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-medium)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-xSmall)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text as="h2" variant="title.small">
                      進行中
                    </Text>
                    <Button color="neutral" leading={LfPlusLarge} variant="solid" disabled={!canAddStatus}>
                      ステータスを追加
                    </Button>
                  </div>
                  <Text as="p" variant="body.medium">
                    {MAX_STATUS_COUNT}個まで登録できます。
                  </Text>
                </div>
                <Draggable
                  as={TableContainer}
                  values={inProgressStatuses}
                  onReorder={handleReorder}
                  getId={(status) => status.id}
                >
                  <Table>
                    <Table.Head>
                      <Table.Row>
                        <Table.Cell />
                        <Table.Cell>案件ステータス名</Table.Cell>
                        <Table.Cell />
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {inProgressStatuses.map((status) => (
                        <StatusRow key={status.id} status={status} isDraggable={true} />
                      ))}
                    </Table.Body>
                  </Table>
                </Draggable>
              </div>

              {/* 完了セクション */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-medium)",
                }}
              >
                <Text as="h2" variant="title.small">
                  完了
                </Text>
                <TableContainer>
                  <Table>
                    <Table.Head>
                      <Table.Row>
                        <Table.Cell />
                        <Table.Cell>案件ステータス名</Table.Cell>
                        <Table.Cell />
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      <StatusRow status={initialClosedStatus} isDraggable={false} />
                    </Table.Body>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
};

export default ApplicationConsoleTemplate;
