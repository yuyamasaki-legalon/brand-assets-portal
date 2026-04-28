import { LfClock, LfEllipsisDotVertical } from "@legalforce/aegis-icons";
import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableLink,
  Icon,
  IconButton,
  StatusLabel,
  Tooltip,
} from "@legalforce/aegis-react";
import styles from "./index.module.css";

export type TaskType = "自社アクション" | "手動作成";
export type TaskStatus = "対応中" | "未対応";
export type TaskPriority = "優先度：高";

export interface TaskItem {
  id: string;
  title: string;
  taskType: TaskType;
  assignee: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

export const taskItems: TaskItem[] = [
  {
    id: "1",
    title: "DealOn導入フォロー",
    taskType: "自社アクション",
    assignee: "Sela、田中 真央",
    status: "対応中",
    priority: "優先度：高",
    dueDate: "2026年1月15日",
  },
  {
    id: "2",
    title: "顧客要件ヒアリング",
    taskType: "手動作成",
    assignee: "田中 真央",
    status: "未対応",
    priority: "優先度：高",
    dueDate: "2026年1月18日",
  },
  {
    id: "3",
    title: "契約書レビュー",
    taskType: "自社アクション",
    assignee: "Sela",
    status: "対応中",
    priority: "優先度：高",
    dueDate: "2026年1月20日",
  },
  {
    id: "4",
    title: "決裁者向け提案サマリー作成",
    taskType: "手動作成",
    assignee: "田中 真央",
    status: "未対応",
    priority: "優先度：高",
    dueDate: "2026年1月22日",
  },
];

const taskTypeColorMap: Record<TaskType, "teal" | "neutral"> = {
  自社アクション: "teal",
  手動作成: "neutral",
};

const taskStatusColorMap: Record<TaskStatus, "teal" | "red"> = {
  対応中: "teal",
  未対応: "red",
};

export const taskFilterOptions = [{ label: "全て" }, { label: "未完了" }, { label: "期限切れ" }, { label: "完了" }];

export const taskColumns: DataTableColumnDef<TaskItem, string>[] = [
  {
    id: "title",
    name: "タスクタイトル",
    pinnable: false,
    getValue: (row): string => row.title,
    renderCell: ({ value }) => (
      <DataTableCell>
        <DataTableLink href="#">{value}</DataTableLink>
      </DataTableCell>
    ),
    sortable: true,
  },
  {
    id: "taskType",
    name: "タスクタイプ",
    pinnable: false,
    getValue: (row): string => row.taskType,
    renderCell: ({ row }) => (
      <DataTableCell>
        <StatusLabel variant="fill" color={taskTypeColorMap[row.taskType]}>
          {row.taskType}
        </StatusLabel>
      </DataTableCell>
    ),
    sortable: true,
  },
  {
    id: "assignee",
    name: "担当者",
    pinnable: false,
    getValue: (row): string => row.assignee,
    sortable: true,
  },
  {
    id: "status",
    name: "ステータス",
    pinnable: false,
    getValue: (row): string => row.status,
    renderCell: ({ row }) => (
      <DataTableCell>
        <StatusLabel variant="fill" color={taskStatusColorMap[row.status]}>
          {row.status}
        </StatusLabel>
      </DataTableCell>
    ),
    sortable: true,
  },
  {
    id: "priority",
    name: "優先度",
    pinnable: false,
    getValue: (row): string => row.priority,
    renderCell: ({ row }) => (
      <DataTableCell>
        <StatusLabel variant="fill" color="red">
          {row.priority}
        </StatusLabel>
      </DataTableCell>
    ),
    sortable: true,
  },
  {
    id: "dueDate",
    name: "期限",
    pinnable: false,
    getValue: (row): string => row.dueDate,
    sortable: true,
  },
  {
    id: "actions",
    name: "",
    pinnable: false,
    getValue: (): string => "",
    renderCell: () => (
      <DataTableCell>
        <div className={styles.actions}>
          <Tooltip title="リマインダー">
            <IconButton variant="plain" size="xSmall" aria-label="リマインダー">
              <Icon>
                <LfClock />
              </Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="その他の操作">
            <IconButton variant="plain" size="xSmall" aria-label="その他の操作">
              <Icon>
                <LfEllipsisDotVertical />
              </Icon>
            </IconButton>
          </Tooltip>
        </div>
      </DataTableCell>
    ),
  },
];
