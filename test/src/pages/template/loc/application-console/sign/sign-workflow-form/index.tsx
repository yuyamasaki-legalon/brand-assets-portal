import { LfArrowUpRightFromSquare, LfEllipsisDot, LfPlusLarge, LfQuestionCircle } from "@legalforce/aegis-icons";
import {
  ActionList,
  Avatar,
  Button,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  DataTableHeader,
  Icon,
  IconButton,
  Link,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Search,
  StatusLabel,
  Text,
  Toolbar,
  Tooltip,
} from "@legalforce/aegis-react";
import { type ChangeEvent, useMemo, useState } from "react";
import { LocSidebarLayout } from "../../../_shared";
import { Navigation, NavigationHeader } from "../_shared";

// =============================================================================
// Types
// =============================================================================

type WorkflowFormStatus = "published" | "draft";

interface SignWorkflowForm {
  id: string;
  name: string;
  status: WorkflowFormStatus;
  updatedAt: string;
  updatedBy: {
    name: string;
    avatarSrc?: string;
  };
}

// =============================================================================
// Mock Data
// =============================================================================

const MOCK_FORMS: SignWorkflowForm[] = [
  {
    id: "1",
    name: "無題のフォーム",
    status: "published",
    updatedAt: "2026/02/24 10:28",
    updatedBy: { name: "山田 太郎" },
  },
  {
    id: "2",
    name: "標準承認フロー（500万円未満）",
    status: "published",
    updatedAt: "2026/01/15 14:32",
    updatedBy: { name: "佐藤 花子" },
  },
  {
    id: "3",
    name: "高額契約承認フロー（1000万円以上）",
    status: "draft",
    updatedAt: "2025/12/08 09:15",
    updatedBy: { name: "鈴木 一郎" },
  },
];

// =============================================================================
// Columns
// =============================================================================

const statusLabels: Record<WorkflowFormStatus, string> = {
  published: "公開中",
  draft: "下書き",
};

const columns: DataTableColumnDef<SignWorkflowForm, string>[] = [
  {
    id: "name",
    name: "フォーム名",
    width: "auto",
    getValue: (row): string => row.name,
    sortable: false,
    pinnable: false,
    reorderable: false,
    renderCell: ({ value }) => (
      <DataTableCell>
        <Tooltip title={value} onlyOnOverflow placement="bottom-start">
          <Text numberOfLines={1}>{value}</Text>
        </Tooltip>
      </DataTableCell>
    ),
  },
  {
    id: "status",
    name: "公開設定",
    width: "fit",
    getValue: (row): string => statusLabels[row.status],
    sortable: false,
    pinnable: false,
    reorderable: false,
    renderCell: ({ row }) => (
      <DataTableCell>
        <StatusLabel variant="fill" size="small" color={row.status === "published" ? "teal" : "neutral"}>
          {statusLabels[row.status]}
        </StatusLabel>
      </DataTableCell>
    ),
  },
  {
    id: "updatedAt",
    name: "最終更新",
    width: "fit",
    getValue: (row): string => row.updatedAt,
    sortable: true,
    pinnable: false,
    reorderable: false,
    renderCell: ({ value }) => (
      <DataTableCell>
        <Text>{value}</Text>
      </DataTableCell>
    ),
  },
  {
    id: "updatedBy",
    name: "更新者",
    width: "small",
    getValue: (row): string => row.updatedBy.name,
    sortable: false,
    pinnable: false,
    reorderable: false,
    renderCell: ({ row }) => (
      <DataTableCell leading={<Avatar size="small" name={row.updatedBy.name} src={row.updatedBy.avatarSrc} />}>
        <Text numberOfLines={1}>{row.updatedBy.name}</Text>
      </DataTableCell>
    ),
  },
  {
    id: "actions",
    name: "",
    width: "fit",
    sortable: false,
    pinnable: false,
    reorderable: false,
    getValue: (): string => "",
    renderHeader: ({ name }) => <DataTableHeader trailing={name} />,
    renderCell: ({ row }) => (
      <DataTableCell
        trailing={
          <Menu placement="bottom-end">
            <Menu.Anchor>
              <Tooltip title="メニュー">
                <IconButton variant="plain" size="small" aria-label={`${row.name}のメニュー`}>
                  <Icon>
                    <LfEllipsisDot />
                  </Icon>
                </IconButton>
              </Tooltip>
            </Menu.Anchor>
            <Menu.Box width="xSmall">
              <ActionList>
                <ActionList.Group>
                  <ActionList.Item>
                    <ActionList.Body>編集</ActionList.Body>
                  </ActionList.Item>
                  <ActionList.Item>
                    <ActionList.Body>複製</ActionList.Body>
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
        }
      />
    ),
  },
];

// =============================================================================
// Component
// =============================================================================

export default function SignWorkflowFormTemplate() {
  const [searchValue, setSearchValue] = useState("");

  const filteredForms = useMemo(() => {
    const normalized = searchValue.trim().toLowerCase();
    if (!normalized) return MOCK_FORMS;
    return MOCK_FORMS.filter((form) => form.name.toLowerCase().includes(normalized));
  }, [searchValue]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <LocSidebarLayout activeId="others">
      <PageLayout>
        <PageLayoutPane>
          <PageLayoutHeader>
            <NavigationHeader />
          </PageLayoutHeader>
          <PageLayoutBody>
            <Navigation currentPage="sign-workflow-form" />
          </PageLayoutBody>
        </PageLayoutPane>
        <PageLayoutContent align="start" maxWidth="max">
          <PageLayoutHeader>
            <Text as="h1" variant="title.large">
              承認申請フォーム
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-xSmall)",
                }}
              >
                <Text as="p" variant="body.medium">
                  入力項目や承認フロー等の承認申請フォームを設定します。
                </Text>
                <div>
                  <Link
                    href="#"
                    leading={LfQuestionCircle}
                    trailing={LfArrowUpRightFromSquare}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ヘルプ
                  </Link>
                </div>
              </div>

              {/* フォームを追加 */}
              <div>
                <Button leading={LfPlusLarge} variant="solid">
                  フォームを追加
                </Button>
              </div>

              {/* ツールバー（検索） */}
              <Toolbar>
                <div style={{ marginInlineStart: "auto" }}>
                  <Search
                    placeholder="キーワードでフィルター"
                    shrinkOnBlur
                    value={searchValue}
                    onChange={handleSearchChange}
                  />
                </div>
              </Toolbar>

              {/* テーブル */}
              <DataTable
                columns={columns}
                rows={filteredForms}
                getRowId={(row) => row.id}
                highlightRowOnHover={false}
                defaultColumnPinning={{ end: ["actions"] }}
                defaultSorting={[{ id: "updatedAt", desc: true }]}
              />
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
}
