import { LfCloseLarge, LfSend, LfSparkles } from "@legalforce/aegis-icons";
import {
  Link as AegisLink,
  Avatar,
  Button,
  Card,
  CardBody,
  Combobox,
  ContentHeader,
  DateField,
  Form,
  FormControl,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutFooter,
  PageLayoutHeader,
  PageLayoutPane,
  Popover,
  Select,
  Table,
  TableContainer,
  Text,
  Textarea,
  TextField,
  TimeField,
  Tooltip,
} from "@legalforce/aegis-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StartSidebar } from "../../../../../components/StartSidebar";

type Notification = {
  id: string;
  title: string;
  description: string;
  timestamp?: string;
};

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

type EmploymentCertificateData = {
  // 会社側が記入する項目
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  representativeName: string;
  companySeal: string;
  issueDate: Date | null;
  // 従業員に関する項目
  employeeName: string;
  dateOfBirth: Date | null;
  employeeNumber: string;
  employmentType: string;
  department: string;
  position: string;
  employmentStartDate: Date | null;
  workType: string;
};

type MessageType = "user" | "agent";

type Message = {
  id: string;
  type: MessageType;
  text?: string;
};

// Helper function to convert Time object to "HH:MM" string
const timeToString = (time: Time | null): string => {
  if (!time) return "";
  return `${String(time.hours).padStart(2, "0")}:${String(time.minutes).padStart(2, "0")}`;
};

const notifications: Notification[] = [
  {
    id: "1",
    title: "打刻漏れの勤怠記録を生成しました。",
    description: "客観ログをもとに打刻漏れの勤怠記録を自動生成しました。確認して編集または承認してください。",
    timestamp: "2024年1月15日 10:30",
  },
  {
    id: "2",
    title: "新しい案件が割り当てられました",
    description: "あなたに新しい案件が割り当てられました。詳細を確認してください。",
    timestamp: "2024年1月14日 15:20",
  },
  {
    id: "3",
    title: "承認待ちの案件があります",
    description: "承認待ちの案件が3件あります。確認して承認してください。",
    timestamp: "2024年1月13日 09:00",
  },
];

const initialAttendanceData: AttendanceRow[] = [
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

// Validate Time object
const isValidTime = (time: Time | null | undefined): time is Time => {
  if (!time) return false;
  return (
    typeof time.hours === "number" &&
    typeof time.minutes === "number" &&
    !Number.isNaN(time.hours) &&
    !Number.isNaN(time.minutes) &&
    time.hours >= 0 &&
    time.hours < 24 &&
    time.minutes >= 0 &&
    time.minutes < 60
  );
};

// Employment Certificate Form Component
const EmploymentCertificateForm = ({
  data,
  onChange,
}: {
  data: EmploymentCertificateData;
  onChange: (data: EmploymentCertificateData) => void;
}) => {
  const employmentTypeOptions = [
    { label: "正社員", value: "full-time" },
    { label: "契約社員", value: "contract" },
    { label: "派遣社員", value: "dispatch" },
    { label: "パート・アルバイト", value: "part-time" },
  ];

  const workTypeOptions = [
    { label: "常勤", value: "full-time" },
    { label: "非常勤", value: "part-time" },
  ];

  const departmentOptions = [
    { label: "営業部", value: "sales" },
    { label: "開発部", value: "development" },
    { label: "人事部", value: "hr" },
    { label: "経理部", value: "accounting" },
    { label: "総務部", value: "general-affairs" },
  ];

  const updateField = <K extends keyof EmploymentCertificateData>(field: K, value: EmploymentCertificateData[K]) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card>
      <CardBody>
        <Form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--aegis-space-large)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-medium)",
            }}
          >
            <Text variant="title.small">会社側が記入する項目</Text>
            <FormControl required>
              <FormControl.Label>会社名</FormControl.Label>
              <TextField
                value={data.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
                placeholder="会社名を入力"
              />
            </FormControl>

            <FormControl required>
              <FormControl.Label>会社所在地</FormControl.Label>
              <TextField
                value={data.companyAddress}
                onChange={(e) => updateField("companyAddress", e.target.value)}
                placeholder="会社所在地を入力"
              />
            </FormControl>

            <FormControl required>
              <FormControl.Label>電話番号</FormControl.Label>
              <TextField
                value={data.companyPhone}
                onChange={(e) => updateField("companyPhone", e.target.value)}
                placeholder="電話番号を入力"
              />
            </FormControl>

            <FormControl required>
              <FormControl.Label>代表者名（または人事担当者名）</FormControl.Label>
              <TextField
                value={data.representativeName}
                onChange={(e) => updateField("representativeName", e.target.value)}
                placeholder="代表者名を入力"
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>会社印／社判</FormControl.Label>
              <TextField
                value={data.companySeal}
                onChange={(e) => updateField("companySeal", e.target.value)}
                placeholder="会社印／社判を入力"
              />
            </FormControl>

            <FormControl required>
              <FormControl.Label>証明書発行日</FormControl.Label>
              <DateField value={data.issueDate} onChange={(newDate) => updateField("issueDate", newDate ?? null)} />
            </FormControl>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-medium)",
            }}
          >
            <Text variant="title.small">従業員に関する項目</Text>
            <FormControl required>
              <FormControl.Label>氏名</FormControl.Label>
              <TextField
                value={data.employeeName}
                onChange={(e) => updateField("employeeName", e.target.value)}
                placeholder="氏名を入力"
              />
            </FormControl>

            <FormControl required>
              <FormControl.Label>生年月日</FormControl.Label>
              <DateField value={data.dateOfBirth} onChange={(newDate) => updateField("dateOfBirth", newDate ?? null)} />
            </FormControl>

            <FormControl>
              <FormControl.Label>社員番号（任意）</FormControl.Label>
              <TextField
                value={data.employeeNumber}
                onChange={(e) => updateField("employeeNumber", e.target.value)}
                placeholder="社員番号を入力"
              />
            </FormControl>

            <FormControl required>
              <FormControl.Label>雇用形態</FormControl.Label>
              <Select
                placeholder="雇用形態を選択"
                options={employmentTypeOptions}
                value={data.employmentType}
                onChange={(value) => updateField("employmentType", value ?? "")}
              />
            </FormControl>

            <FormControl required>
              <FormControl.Label>所属部署</FormControl.Label>
              <Combobox
                placeholder="所属部署を選択"
                options={departmentOptions}
                value={data.department}
                onChange={(value) => updateField("department", value ?? "")}
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>役職</FormControl.Label>
              <TextField
                value={data.position}
                onChange={(e) => updateField("position", e.target.value)}
                placeholder="役職を入力"
              />
            </FormControl>

            <FormControl required>
              <FormControl.Label>在職期間（入社日）</FormControl.Label>
              <DateField
                value={data.employmentStartDate}
                onChange={(newDate) => updateField("employmentStartDate", newDate ?? null)}
              />
            </FormControl>

            <FormControl required>
              <FormControl.Label>勤務形態</FormControl.Label>
              <Select
                placeholder="勤務形態を選択"
                options={workTypeOptions}
                value={data.workType}
                onChange={(value) => updateField("workType", value ?? "")}
              />
            </FormControl>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default function Home() {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [paneOpen, setPaneOpen] = useState(false);
  const [attendanceRows, setAttendanceRows] = useState<AttendanceRow[]>(initialAttendanceData);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [employmentCertificateData, setEmploymentCertificateData] = useState<EmploymentCertificateData>({
    companyName: "株式会社サンプル",
    companyAddress: "東京都千代田区1-1-1",
    companyPhone: "03-1234-5678",
    representativeName: "山田 太郎",
    companySeal: "",
    issueDate: new Date(),
    employeeName: "佐藤 花子",
    dateOfBirth: new Date("1990-01-01"),
    employeeNumber: "EMP001",
    employmentType: "full-time",
    department: "sales",
    position: "営業マネージャー",
    employmentStartDate: new Date("2020-04-01"),
    workType: "full-time",
  });

  const handleCardClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setPaneOpen(true);
  };

  const handleConfirmClick = (e: React.MouseEvent, notification: Notification) => {
    e.stopPropagation(); // Prevent card click event
    setSelectedNotification(notification);
    setPaneOpen(true);
  };

  // Set width 100% on aegis-NLF5xa_content and width 480px on aegis-NLF5xa_root
  useEffect(() => {
    if (!paneOpen) return;
    const contentElements = document.querySelectorAll(".aegis-NLF5xa_content");
    contentElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.width = "100%";
        element.style.inlineSize = "100%";
      }
    });
    const rootElements = document.querySelectorAll(".aegis-Collapsible.aegis-NLF5xa_root");
    rootElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.width = "480px";
        element.style.inlineSize = "480px";
        element.style.removeProperty("background-color");
        element.style.setProperty("background-color", "", "important");
      }
    });
    // Remove background color from resizable container
    const resizableElements = document.querySelectorAll(".aegis-NLF5xa_resizable");
    resizableElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.removeProperty("background-color");
        element.style.setProperty("background-color", "", "important");
      }
    });
  });

  const handleDateChange = (id: string, date: Date | null | undefined) => {
    setAttendanceRows((prev) => prev.map((row) => (row.id === id ? { ...row, date: date ?? null } : row)));
  };

  const handleStartTimeChange = (id: string, time: Time | null | undefined) => {
    setAttendanceRows((prev) => prev.map((row) => (row.id === id ? { ...row, startTime: time ?? null } : row)));
  };

  const handleEndTimeChange = (id: string, time: Time | null | undefined) => {
    setAttendanceRows((prev) => prev.map((row) => (row.id === id ? { ...row, endTime: time ?? null } : row)));
  };

  const detectIntent = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    // 在職証明書の記入案を作成するインテントを検出
    if (
      (lowerMessage.includes("在職証明書") || lowerMessage.includes("在職証明")) &&
      (lowerMessage.includes("作成") ||
        lowerMessage.includes("作って") ||
        lowerMessage.includes("記入案") ||
        lowerMessage.includes("作成して") ||
        lowerMessage.includes("作って") ||
        lowerMessage.includes("作成") ||
        lowerMessage.includes("作る"))
    ) {
      return true;
    }
    // より柔軟な検出
    if (
      lowerMessage.includes("在職") &&
      (lowerMessage.includes("証明") || lowerMessage.includes("証明書")) &&
      (lowerMessage.includes("作成") || lowerMessage.includes("作") || lowerMessage.includes("記入"))
    ) {
      return true;
    }
    return false;
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    const message = chatInput.trim();
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setChatInput("");

    // Simulate AI processing delay
    setTimeout(() => {
      // Detect intent
      if (detectIntent(message)) {
        const agentMessage: Message = {
          id: `agent-${Date.now()}`,
          type: "agent",
          text: "在職証明書の記入案を作成しました。右側のパネルでフォームを確認・編集してください。",
        };
        setMessages((prev) => [...prev, agentMessage]);
        setPaneOpen(true);
        // Set a dummy notification to show the form
        setSelectedNotification({
          id: "employment-certificate",
          title: "在職証明書の記入案",
          description: "在職証明書の記入案を作成しました。以下のフォームを編集してください。",
        });
      } else {
        const agentMessage: Message = {
          id: `agent-${Date.now()}`,
          type: "agent",
          text: "申し訳ございませんが、そのリクエストには対応できません。在職証明書の記入案を作成する場合は、「在職証明書の記入案を作成して」と入力してください。",
        };
        setMessages((prev) => [...prev, agentMessage]);
      }
    }, 500);
  };

  return (
    <PageLayout>
      <StartSidebar />
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>ホーム</ContentHeader.Title>
            <ContentHeader.Description>通知一覧</ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-medium)",
              maxInlineSize: "var(--aegis-layout-width-large)",
            }}
          >
            {notifications.map((notification) => (
              <Card key={notification.id} style={{ cursor: "pointer" }} onClick={() => handleCardClick(notification)}>
                <CardBody>
                  <div
                    style={{
                      display: "flex",
                      gap: "var(--aegis-space-medium)",
                      alignItems: "flex-start",
                    }}
                  >
                    <Icon>
                      <LfSparkles />
                    </Icon>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--aegis-space-xSmall)",
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <Text variant="title.small">{notification.title}</Text>
                      <Text variant="body.medium" color="subtle">
                        {notification.description}
                      </Text>
                      {notification.timestamp && (
                        <Text variant="body.small" color="subtle" style={{ marginTop: "var(--aegis-space-xxSmall)" }}>
                          {notification.timestamp}
                        </Text>
                      )}
                    </div>
                    <div style={{ flexShrink: 0, alignSelf: "center" }}>
                      <Button size="small" onClick={(e) => handleConfirmClick(e, notification)}>
                        確認
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-medium)",
                marginTop: "var(--aegis-space-large)",
                paddingTop: "var(--aegis-space-large)",
                borderTop: "1px solid var(--aegis-color-neutral-border)",
              }}
            >
              <Text variant="title.small">AIアシスタント</Text>
              {messages.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-small)",
                    maxHeight: "300px",
                    overflowY: "auto",
                    padding: "var(--aegis-space-small)",
                    backgroundColor: "var(--aegis-color-neutral-subtle)",
                    borderRadius: "var(--aegis-radius-medium)",
                  }}
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      style={{
                        display: "flex",
                        gap: "var(--aegis-space-small)",
                        justifyContent: message.type === "user" ? "flex-end" : "flex-start",
                      }}
                    >
                      {message.type === "agent" && (
                        <Avatar size="small" color="blue" name="AI">
                          AI
                        </Avatar>
                      )}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--aegis-space-xSmall)",
                          maxInlineSize: "70%",
                        }}
                      >
                        {message.text && (
                          <Card>
                            <CardBody>
                              <Text variant="body.medium">{message.text}</Text>
                            </CardBody>
                          </Card>
                        )}
                      </div>
                      {message.type === "user" && (
                        <Avatar size="small" color="subtle" name="User">
                          U
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  inlineSize: "100%",
                }}
              >
                <Textarea
                  placeholder="メッセージを入力...（例: 在職証明書の記入案を作成して）"
                  minRows={2}
                  maxRows={5}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleChatSend();
                    }
                  }}
                  style={{
                    paddingRight: "48px",
                    paddingInlineEnd: "48px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    insetBlockEnd: "8px",
                    right: "8px",
                    insetInlineEnd: "8px",
                  }}
                >
                  <Tooltip title="送信">
                    <IconButton size="small" aria-label="送信" onClick={handleChatSend} disabled={!chatInput.trim()}>
                      <Icon>
                        <LfSend />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </PageLayoutBody>
        <PageLayoutFooter>
          <AegisLink asChild>
            <Link to="/sandbox">← Back to Sandbox</Link>
          </AegisLink>
        </PageLayoutFooter>
      </PageLayoutContent>

      <PageLayoutPane
        position="end"
        open={paneOpen}
        variant="fill"
        style={{
          minWidth: "480px",
          width: "auto",
        }}
        className="aegis-pane-content-full-width"
      >
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  inlineSize: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--aegis-space-xSmall)",
                  }}
                >
                  <Icon style={{ color: "var(--aegis-color-teal-600)" }}>
                    <LfSparkles />
                  </Icon>
                  {selectedNotification?.title}
                </div>
                <Tooltip title="閉じる">
                  <IconButton size="small" aria-label="閉じる" onClick={() => setPaneOpen(false)}>
                    <Icon>
                      <LfCloseLarge />
                    </Icon>
                  </IconButton>
                </Tooltip>
              </div>
            </ContentHeader.Title>
            {selectedNotification?.timestamp && (
              <ContentHeader.Description variant="data">{selectedNotification.timestamp}</ContentHeader.Description>
            )}
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody style={{ maxWidth: "none", maxInlineSize: "none", width: "100%", inlineSize: "100%" }}>
          {selectedNotification?.id === "employment-certificate" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-medium)",
                width: "100%",
                inlineSize: "100%",
              }}
            >
              <Text variant="body.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
                {selectedNotification.description}
              </Text>
              <EmploymentCertificateForm data={employmentCertificateData} onChange={setEmploymentCertificateData} />
            </div>
          ) : selectedNotification?.id === "1" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-medium)",
                minHeight: "100%",
                width: "100%",
                inlineSize: "100%",
              }}
            >
              <Text variant="body.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
                {selectedNotification.description}
              </Text>
              <TableContainer style={{ width: "100%", inlineSize: "100%" }}>
                <Table style={{ width: "100%", inlineSize: "100%" }}>
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
                    {attendanceRows.map((row) => (
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
              <Button size="medium" width="full" style={{ marginTop: "var(--aegis-space-medium)" }}>
                承認
              </Button>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-medium)",
                  marginTop: "auto",
                  paddingTop: "var(--aegis-space-medium)",
                  width: "100%",
                  inlineSize: "100%",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    inlineSize: "100%",
                    paddingTop: "2rem",
                  }}
                >
                  <Textarea
                    placeholder="メッセージを入力..."
                    minRows={2}
                    maxRows={5}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleChatSend();
                      }
                    }}
                    style={{
                      paddingRight: "48px",
                      paddingInlineEnd: "48px",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      insetBlockEnd: "8px",
                      right: "8px",
                      insetInlineEnd: "8px",
                    }}
                  >
                    <Tooltip title="送信">
                      <IconButton size="small" aria-label="送信" onClick={handleChatSend} disabled={!chatInput.trim()}>
                        <Icon>
                          <LfSend />
                        </Icon>
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-medium)",
                width: "100%",
                inlineSize: "100%",
              }}
            >
              <Text variant="body.medium">{selectedNotification?.description}</Text>
            </div>
          )}
        </PageLayoutBody>
      </PageLayoutPane>
    </PageLayout>
  );
}
