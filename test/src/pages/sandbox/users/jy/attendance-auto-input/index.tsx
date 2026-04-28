import {
  Link as AegisLink,
  Button,
  ContentHeader,
  DateField,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutFooter,
  PageLayoutHeader,
  Popover,
  Table,
  TableContainer,
  Text,
  TimeField,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { StartSidebar } from "../../../../../components/StartSidebar";

type Time = {
  hours: number;
  minutes: number;
};

type AttendanceRow = {
  id: string;
  name: string;
  date: Date | null;
  startTime: Time | null;
  endTime: Time | null;
};

// Helper function to convert Time object to "HH:MM" string
const timeToString = (time: Time | null): string => {
  if (!time) return "";
  return `${String(time.hours).padStart(2, "0")}:${String(time.minutes).padStart(2, "0")}`;
};

// Validate Time object
const isValidTime = (time: Time | null | undefined): time is Time => {
  if (!time) return false;
  return (
    typeof time.hours === "number" &&
    typeof time.minutes === "number" &&
    time.hours >= 0 &&
    time.hours < 24 &&
    time.minutes >= 0 &&
    time.minutes < 60
  );
};

const initialData: AttendanceRow[] = [
  {
    id: "1",
    name: "山田 太郎",
    date: new Date("2024-01-15"),
    startTime: { hours: 9, minutes: 0 },
    endTime: { hours: 18, minutes: 0 },
  },
  {
    id: "2",
    name: "佐藤 花子",
    date: new Date("2024-01-15"),
    startTime: { hours: 9, minutes: 30 },
    endTime: { hours: 18, minutes: 30 },
  },
  {
    id: "3",
    name: "鈴木 一郎",
    date: new Date("2024-01-15"),
    startTime: { hours: 10, minutes: 0 },
    endTime: { hours: 19, minutes: 0 },
  },
];

export default function AttendanceAutoInput() {
  const [rows, setRows] = useState<AttendanceRow[]>(initialData);

  const handleDateChange = (id: string, date: Date | null | undefined) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, date: date ?? null } : row)));
  };

  const handleStartTimeChange = (id: string, time: Time | null | undefined) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, startTime: time ?? null } : row)));
  };

  const handleEndTimeChange = (id: string, time: Time | null | undefined) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, endTime: time ?? null } : row)));
  };

  return (
    <PageLayout>
      <StartSidebar />
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>勤怠自動入力</ContentHeader.Title>
            <ContentHeader.Description>打刻漏れの勤怠記録を確認・編集</ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <TableContainer>
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Cell as="th">名前</Table.Cell>
                  <Table.Cell as="th">日付</Table.Cell>
                  <Table.Cell as="th">開始時間</Table.Cell>
                  <Table.Cell as="th">終了時間</Table.Cell>
                  <Table.Cell as="th">客観ログ</Table.Cell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {rows.map((row) => (
                  <Table.Row key={row.id}>
                    <Table.Cell>
                      <Text variant="body.medium">{row.name}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <DateField value={row.date} onChange={(date) => handleDateChange(row.id, date ?? null)} />
                    </Table.Cell>
                    <Table.Cell>
                      <TimeField
                        value={isValidTime(row.startTime) ? row.startTime : undefined}
                        onChange={(time) => handleStartTimeChange(row.id, time ?? null)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <TimeField
                        value={isValidTime(row.endTime) ? row.endTime : undefined}
                        onChange={(time) => handleEndTimeChange(row.id, time ?? null)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Popover trigger="click">
                        <Popover.Anchor>
                          <Button size="small">客観ログ</Button>
                        </Popover.Anchor>
                        <Popover.Content>
                          <Popover.Body>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--aegis-space-small)",
                                padding: "var(--aegis-space-small)",
                              }}
                            >
                              <Text variant="body.medium" style={{ fontWeight: "bold" }}>
                                客観ログ情報
                              </Text>
                              <Text variant="body.small">入室: {timeToString(row.startTime)}</Text>
                              <Text variant="body.small">退室: {timeToString(row.endTime)}</Text>
                              <Text variant="body.small" color="subtle">
                                位置情報: 東京本社
                              </Text>
                            </div>
                          </Popover.Body>
                        </Popover.Content>
                      </Popover>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </TableContainer>
        </PageLayoutBody>
        <PageLayoutFooter>
          <AegisLink asChild>
            <Link to="/sandbox">← Back to Sandbox</Link>
          </AegisLink>
        </PageLayoutFooter>
      </PageLayoutContent>
    </PageLayout>
  );
}
