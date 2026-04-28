import { LfArrowUpRightFromSquare, LfEllipsisDotVertical } from "@legalforce/aegis-icons";
import {
  Avatar,
  DataTableCell,
  type DataTableColumnDef,
  DataTableLink,
  Icon,
  IconButton,
  StatusLabel,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import styles from "./index.module.css";
import mockStyles from "./mock.module.css";
import { categoryConfig, formatDateTime, formatTimeRange, typeConfig } from "./utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MeetingCategory =
  | "Sales"
  | "Success"
  | "Legal"
  | "Security"
  | "Finance"
  | "Onboarding"
  | "Support"
  | "Product"
  | "Training"
  | "Other";

export type MeetingType = "online_meet" | "online_other" | "offline" | "telephone";

export interface MeetingItem {
  id: string;
  title: string;
  category: MeetingCategory;
  type: MeetingType;
  startDateTime: string;
  endDateTime: string;
  owner: string;
  url?: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const meetingItems: MeetingItem[] = [
  {
    id: "1",
    title: "DealOn導入検討ミーティング",
    category: "Sales",
    type: "online_meet",
    startDateTime: "2026-01-10T19:00:00",
    endDateTime: "2026-01-10T20:00:00",
    owner: "田中 真央",
    url: "https://meet.google.com/example1",
  },
  {
    id: "2",
    title: "三峰商事株式会社様 デモセッション",
    category: "Sales",
    type: "online_meet",
    startDateTime: "2026-01-17T23:00:00",
    endDateTime: "2026-01-18T00:00:00",
    owner: "田中 真央",
    url: "https://meet.google.com/example2",
  },
];

// ---------------------------------------------------------------------------
// Column definitions
// ---------------------------------------------------------------------------

export const meetingColumns: DataTableColumnDef<MeetingItem, string>[] = [
  {
    id: "title",
    name: "ミーティングタイトル",
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
    id: "category",
    name: "ミーティングカテゴリー",
    pinnable: false,
    getValue: (row): string => row.category,
    renderCell: ({ row }) => {
      const config = categoryConfig[row.category];
      return (
        <DataTableCell>
          <StatusLabel variant="fill" color={config.color}>
            {config.label}
          </StatusLabel>
        </DataTableCell>
      );
    },
    sortable: true,
  },
  {
    id: "datetime",
    name: "開始日時、終了日時",
    pinnable: false,
    getValue: (row): string => row.startDateTime,
    renderCell: ({ row }) => {
      const { date } = formatDateTime(row.startDateTime);
      return (
        <DataTableCell>
          <div className={mockStyles.participantCell}>
            <Text variant="body.medium">{date}</Text>
            <Text variant="body.medium" color="subtle">
              {formatTimeRange(row.startDateTime, row.endDateTime)}
            </Text>
          </div>
        </DataTableCell>
      );
    },
    sortable: true,
  },
  {
    id: "type",
    name: "ミーティングタイプ",
    pinnable: false,
    getValue: (row): string => row.type,
    renderCell: ({ row }) => {
      const config = typeConfig[row.type];
      return (
        <DataTableCell>
          <StatusLabel variant="fill" color={config.color}>
            {config.label}
          </StatusLabel>
        </DataTableCell>
      );
    },
    sortable: true,
  },
  {
    id: "owner",
    name: "オーナーユーザー",
    pinnable: false,
    getValue: (row): string => row.owner,
    renderCell: ({ row }) => (
      <DataTableCell>
        <div className={mockStyles.statusCell}>
          <Avatar name={row.owner} size="xSmall" />
          <Text variant="body.medium">{row.owner}</Text>
        </div>
      </DataTableCell>
    ),
    sortable: true,
  },
  {
    id: "actions",
    name: "",
    pinnable: false,
    getValue: (): string => "",
    renderCell: ({ row }) => (
      <DataTableCell>
        <div className={styles.actions}>
          {row.url && (
            <Tooltip title="ミーティングに参加">
              <IconButton variant="plain" size="xSmall" aria-label="ミーティングに参加">
                <Icon>
                  <LfArrowUpRightFromSquare />
                </Icon>
              </IconButton>
            </Tooltip>
          )}
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
