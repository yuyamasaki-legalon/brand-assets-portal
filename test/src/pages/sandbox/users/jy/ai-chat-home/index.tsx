import { LfClip, LfDownload, LfPrint, LfSend, LfSetting, LfSparkles } from "@legalforce/aegis-icons";
import {
  Avatar,
  Banner,
  Button,
  ButtonGroup,
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
  Select,
  Text,
  Textarea,
  TextField,
  Tooltip,
} from "@legalforce/aegis-react";
import { useEffect, useRef, useState } from "react";
import { StartSidebar } from "../../../../../components/StartSidebar";

type MessageType = "user" | "agent";

type Message = {
  id: string;
  type: MessageType;
  text?: string;
  uiComponent?: "restaurant-reservation" | "commute-route-calculation" | "employment-certificate";
  employeeName?: string; // For employment certificate with pre-filled data
};

type RestaurantReservationData = {
  date: Date | null;
  numberOfPeople: string;
  restaurant: string;
};

type CommuteRouteCalculationData = {
  targetType: string; // "user-group" or "department"
  targetValue: string;
  employmentStartMonth: Date | null;
  username: string;
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

const RestaurantReservationForm = ({ onSubmit }: { onSubmit: (data: RestaurantReservationData) => void }) => {
  const [date, setDate] = useState<Date | null>(null);
  const [numberOfPeople, setNumberOfPeople] = useState<string>("");
  const [restaurant, setRestaurant] = useState<string>("");

  const peopleOptions = [
    { label: "1 person", value: "1" },
    { label: "2 people", value: "2" },
    { label: "3 people", value: "3" },
    { label: "4 people", value: "4" },
    { label: "5 people", value: "5" },
    { label: "6+ people", value: "6+" },
  ];

  const restaurantOptions = [
    { label: "A Restaurant", value: "a-restaurant" },
    { label: "B Restaurant", value: "b-restaurant" },
    { label: "C Restaurant", value: "c-restaurant" },
  ];

  const handleSubmit = () => {
    if (date && numberOfPeople && restaurant) {
      onSubmit({ date, numberOfPeople, restaurant });
    }
  };

  const isFormValid = date !== null && numberOfPeople !== "" && restaurant !== "";

  return (
    <Card>
      <CardBody>
        <Form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--aegis-space-medium)",
          }}
        >
          <FormControl required>
            <FormControl.Label>Restaurant</FormControl.Label>
            <Select
              placeholder="Select a restaurant"
              options={restaurantOptions}
              value={restaurant}
              onChange={(value) => setRestaurant(value)}
            />
          </FormControl>

          <FormControl required>
            <FormControl.Label>Date</FormControl.Label>
            <DateField value={date} onChange={(newDate) => setDate(newDate ?? null)} />
          </FormControl>

          <FormControl required>
            <FormControl.Label>Number of People</FormControl.Label>
            <Select
              placeholder="Select number of people"
              options={peopleOptions}
              value={numberOfPeople}
              onChange={(value) => setNumberOfPeople(value)}
            />
          </FormControl>

          <Button width="full" onClick={handleSubmit} disabled={!isFormValid}>
            Make Reservation
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

const CommuteRouteCalculationForm = ({ onSubmit }: { onSubmit: (data: CommuteRouteCalculationData) => void }) => {
  const [targetType, setTargetType] = useState<string>("");
  const [targetValue, setTargetValue] = useState<string>("");
  const [employmentStartMonth, setEmploymentStartMonth] = useState<Date | null>(null);
  const [username, setUsername] = useState<string>("");

  const targetTypeOptions = [
    { label: "ユーザーグループ", value: "user-group" },
    { label: "部署", value: "department" },
  ];

  const userGroupOptions = [
    { label: "営業部", value: "sales" },
    { label: "開発部", value: "development" },
    { label: "人事部", value: "hr" },
    { label: "経理部", value: "accounting" },
  ];

  const departmentOptions = [
    { label: "東京本社", value: "tokyo-hq" },
    { label: "大阪支社", value: "osaka-branch" },
    { label: "名古屋支社", value: "nagoya-branch" },
  ];

  const usernameOptions = [
    { label: "山田 太郎", value: "yamada-taro" },
    { label: "佐藤 花子", value: "sato-hanako" },
    { label: "鈴木 一郎", value: "suzuki-ichiro" },
    { label: "田中 美咲", value: "tanaka-misaki" },
    { label: "伊藤 健太", value: "ito-kenta" },
    { label: "渡辺 さくら", value: "watanabe-sakura" },
    { label: "中村 大輔", value: "nakamura-daisuke" },
    { label: "小林 愛美", value: "kobayashi-manami" },
  ];

  const handleTargetTypeChange = (value: string) => {
    setTargetType(value);
    setTargetValue(""); // Reset target value when type changes
  };

  const handleSubmit = () => {
    onSubmit({ targetType, targetValue, employmentStartMonth, username });
  };

  return (
    <Card>
      <CardBody>
        <Form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--aegis-space-medium)",
          }}
        >
          <FormControl>
            <FormControl.Label>対象選択</FormControl.Label>
            <Select
              placeholder="ユーザーグループまたは部署を選択"
              options={targetTypeOptions}
              value={targetType}
              onChange={handleTargetTypeChange}
            />
          </FormControl>

          {targetType && (
            <FormControl>
              <FormControl.Label>{targetType === "user-group" ? "ユーザーグループ" : "部署"}</FormControl.Label>
              <Select
                placeholder={`${targetType === "user-group" ? "ユーザーグループ" : "部署"}を選択`}
                options={targetType === "user-group" ? userGroupOptions : departmentOptions}
                value={targetValue}
                onChange={(value) => setTargetValue(value)}
              />
            </FormControl>
          )}

          <FormControl required>
            <FormControl.Label>入社月</FormControl.Label>
            <DateField value={employmentStartMonth} onChange={(newDate) => setEmploymentStartMonth(newDate ?? null)} />
          </FormControl>

          <FormControl>
            <FormControl.Label>ユーザー名</FormControl.Label>
            <Select
              placeholder="ユーザー名を選択"
              options={usernameOptions}
              value={username}
              onChange={(value) => setUsername(value)}
            />
          </FormControl>

          <Button width="full" onClick={handleSubmit}>
            計算する
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

// Employee data mapping (shared between components)
const employeeDataMap: Record<string, Partial<EmploymentCertificateData>> = {
  "山田 太郎": {
    dateOfBirth: new Date("1985-03-15"),
    employeeNumber: "EMP001",
    employmentType: "full-time",
    department: "sales",
    position: "営業マネージャー",
    employmentStartDate: new Date("2018-04-01"),
    workType: "full-time",
  },
  "佐藤 花子": {
    dateOfBirth: new Date("1990-01-01"),
    employeeNumber: "EMP002",
    employmentType: "full-time",
    department: "development",
    position: "シニアエンジニア",
    employmentStartDate: new Date("2020-04-01"),
    workType: "full-time",
  },
  "鈴木 一郎": {
    dateOfBirth: new Date("1988-07-20"),
    employeeNumber: "EMP003",
    employmentType: "contract",
    department: "hr",
    position: "人事担当",
    employmentStartDate: new Date("2021-06-01"),
    workType: "full-time",
  },
  "田中 美咲": {
    dateOfBirth: new Date("1992-11-05"),
    employeeNumber: "EMP004",
    employmentType: "full-time",
    department: "accounting",
    position: "経理",
    employmentStartDate: new Date("2019-04-01"),
    workType: "full-time",
  },
  "伊藤 健太": {
    dateOfBirth: new Date("1987-09-12"),
    employeeNumber: "EMP005",
    employmentType: "full-time",
    department: "sales",
    position: "営業",
    employmentStartDate: new Date("2022-04-01"),
    workType: "full-time",
  },
  "渡辺 さくら": {
    dateOfBirth: new Date("1993-04-18"),
    employeeNumber: "EMP006",
    employmentType: "part-time",
    department: "general-affairs",
    position: "総務",
    employmentStartDate: new Date("2023-04-01"),
    workType: "part-time",
  },
  "中村 大輔": {
    dateOfBirth: new Date("1986-12-25"),
    employeeNumber: "EMP007",
    employmentType: "full-time",
    department: "development",
    position: "エンジニア",
    employmentStartDate: new Date("2017-04-01"),
    workType: "full-time",
  },
  "小林 愛美": {
    dateOfBirth: new Date("1991-08-30"),
    employeeNumber: "EMP008",
    employmentType: "full-time",
    department: "hr",
    position: "人事マネージャー",
    employmentStartDate: new Date("2016-04-01"),
    workType: "full-time",
  },
  "加藤 翔太": {
    dateOfBirth: new Date("1989-02-14"),
    employeeNumber: "EMP009",
    employmentType: "contract",
    department: "accounting",
    position: "経理担当",
    employmentStartDate: new Date("2021-10-01"),
    workType: "full-time",
  },
  "吉田 由美": {
    dateOfBirth: new Date("1994-06-08"),
    employeeNumber: "EMP010",
    employmentType: "full-time",
    department: "general-affairs",
    position: "総務マネージャー",
    employmentStartDate: new Date("2015-04-01"),
    workType: "full-time",
  },
};

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

  const employeeNameOptions = [
    { label: "山田 太郎", value: "山田 太郎" },
    { label: "佐藤 花子", value: "佐藤 花子" },
    { label: "鈴木 一郎", value: "鈴木 一郎" },
    { label: "田中 美咲", value: "田中 美咲" },
    { label: "伊藤 健太", value: "伊藤 健太" },
    { label: "渡辺 さくら", value: "渡辺 さくら" },
    { label: "中村 大輔", value: "中村 大輔" },
    { label: "小林 愛美", value: "小林 愛美" },
    { label: "加藤 翔太", value: "加藤 翔太" },
    { label: "吉田 由美", value: "吉田 由美" },
  ];

  const updateField = <K extends keyof EmploymentCertificateData>(field: K, value: EmploymentCertificateData[K]) => {
    onChange({ ...data, [field]: value });
  };

  const handleEmployeeNameChange = (value: string | null) => {
    if (!value) {
      updateField("employeeName", "");
      return;
    }
    const employeeData = employeeDataMap[value];
    if (employeeData) {
      // Update all fields with employee data
      onChange({
        ...data,
        employeeName: value,
        dateOfBirth: employeeData.dateOfBirth ?? data.dateOfBirth,
        employeeNumber: employeeData.employeeNumber ?? data.employeeNumber,
        employmentType: employeeData.employmentType ?? data.employmentType,
        department: employeeData.department ?? data.department,
        position: employeeData.position ?? data.position,
        employmentStartDate: employeeData.employmentStartDate ?? data.employmentStartDate,
        workType: employeeData.workType ?? data.workType,
      });
    } else {
      // Just update the name if no data found
      updateField("employeeName", value);
    }
  };

  return (
    <div
      style={{
        borderTop: "3px solid var(--aegis-color-accent-teal-bold)",
        borderRadius: "var(--aegis-radius-medium)",
        overflow: "hidden",
      }}
    >
      <Card>
        <CardBody
          style={{
            borderTop: "3px solid var(--aegis-color-accent-teal-bold)",
            marginTop: "-3px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--aegis-space-small)",
              }}
            >
              <Icon style={{ color: "var(--aegis-color-accent-teal-bold)" }}>
                <LfSparkles />
              </Icon>
              <Text variant="title.medium">在職証明書</Text>
            </div>
            <ButtonGroup variant="plain" size="small">
              <Tooltip title="Download" placement="top">
                <IconButton aria-label="Download" onClick={() => console.log("Download clicked")}>
                  <Icon>
                    <LfDownload />
                  </Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title="Print" placement="top">
                <IconButton aria-label="Print" onClick={() => console.log("Print clicked")}>
                  <Icon>
                    <LfPrint />
                  </Icon>
                </IconButton>
              </Tooltip>
            </ButtonGroup>
          </div>
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
              <FormControl required orientation="horizontal">
                <FormControl.Label>氏名</FormControl.Label>
                <Combobox
                  placeholder="氏名を検索"
                  options={employeeNameOptions}
                  value={data.employeeName}
                  onChange={handleEmployeeNameChange}
                />
              </FormControl>

              <FormControl required orientation="horizontal">
                <FormControl.Label>生年月日</FormControl.Label>
                <DateField
                  value={data.dateOfBirth}
                  onChange={(newDate) => updateField("dateOfBirth", newDate ?? null)}
                />
              </FormControl>

              <FormControl orientation="horizontal">
                <FormControl.Label>社員番号（任意）</FormControl.Label>
                <TextField
                  value={data.employeeNumber}
                  onChange={(e) => updateField("employeeNumber", e.target.value)}
                  placeholder="社員番号を入力"
                />
              </FormControl>

              <FormControl required orientation="horizontal">
                <FormControl.Label>雇用形態</FormControl.Label>
                <Select
                  placeholder="雇用形態を選択"
                  options={employmentTypeOptions}
                  value={data.employmentType}
                  onChange={(value) => updateField("employmentType", value)}
                />
              </FormControl>

              <FormControl required orientation="horizontal">
                <FormControl.Label>所属部署</FormControl.Label>
                <Combobox
                  placeholder="所属部署を選択"
                  options={departmentOptions}
                  value={data.department}
                  onChange={(value) => updateField("department", value ?? "")}
                />
              </FormControl>

              <FormControl orientation="horizontal">
                <FormControl.Label>役職</FormControl.Label>
                <TextField
                  value={data.position}
                  onChange={(e) => updateField("position", e.target.value)}
                  placeholder="役職を入力"
                />
              </FormControl>

              <FormControl required orientation="horizontal">
                <FormControl.Label>在職期間（入社日）</FormControl.Label>
                <DateField
                  value={data.employmentStartDate}
                  onChange={(newDate) => updateField("employmentStartDate", newDate ?? null)}
                />
              </FormControl>

              <FormControl required orientation="horizontal">
                <FormControl.Label>勤務形態</FormControl.Label>
                <Select
                  placeholder="勤務形態を選択"
                  options={workTypeOptions}
                  value={data.workType}
                  onChange={(value) => updateField("workType", value)}
                />
              </FormControl>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-medium)",
              }}
            >
              <FormControl required orientation="horizontal">
                <FormControl.Label>会社名</FormControl.Label>
                <TextField
                  value={data.companyName}
                  onChange={(e) => updateField("companyName", e.target.value)}
                  placeholder="会社名を入力"
                />
              </FormControl>

              <FormControl required orientation="horizontal">
                <FormControl.Label>会社所在地</FormControl.Label>
                <TextField
                  value={data.companyAddress}
                  onChange={(e) => updateField("companyAddress", e.target.value)}
                  placeholder="会社所在地を入力"
                />
              </FormControl>

              <FormControl required orientation="horizontal">
                <FormControl.Label>電話番号</FormControl.Label>
                <TextField
                  value={data.companyPhone}
                  onChange={(e) => updateField("companyPhone", e.target.value)}
                  placeholder="電話番号を入力"
                />
              </FormControl>

              <FormControl orientation="horizontal">
                <FormControl.Label>会社印／社判</FormControl.Label>
                <TextField
                  value={data.companySeal}
                  onChange={(e) => updateField("companySeal", e.target.value)}
                  placeholder="会社印／社判を入力"
                />
              </FormControl>

              <FormControl required orientation="horizontal">
                <FormControl.Label>証明書発行日</FormControl.Label>
                <DateField value={data.issueDate} onChange={(newDate) => updateField("issueDate", newDate ?? null)} />
              </FormControl>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

const detectIntent = (userMessage: string): Message | null => {
  // Detect restaurant reservation intent
  const lowerMessage = userMessage.toLowerCase();
  if (
    (lowerMessage.includes("reservation") || lowerMessage.includes("reserve") || lowerMessage.includes("book")) &&
    (lowerMessage.includes("restaurant") ||
      lowerMessage.includes("restaurant a") ||
      lowerMessage.includes("a restaurant"))
  ) {
    return {
      id: `agent-${Date.now()}`,
      type: "agent",
      text: "I'll help you make a reservation. Please fill out the form below:",
      uiComponent: "restaurant-reservation",
    };
  }

  // Detect commute route calculation intent (Japanese)
  if (
    userMessage.includes("従業員の通勤経路を計算して") ||
    userMessage.includes("通勤経路を計算") ||
    userMessage.includes("通勤経路計算")
  ) {
    return {
      id: `agent-${Date.now()}`,
      type: "agent",
      text: "従業員の通勤経路を計算します。以下のフォームにご入力ください：",
      uiComponent: "commute-route-calculation",
    };
  }

  // Employee name options for detection (normalized names with spaces)
  const employeeNames = [
    "山田 太郎",
    "佐藤 花子",
    "鈴木 一郎",
    "田中 美咲",
    "伊藤 健太",
    "渡辺 さくら",
    "中村 大輔",
    "小林 愛美",
    "加藤 翔太",
    "吉田 由美",
  ];

  // Name variations mapping (without spaces, with different formats)
  const nameVariations: Record<string, string> = {
    山田太郎: "山田 太郎",
    "山田 太郎": "山田 太郎",
    佐藤花子: "佐藤 花子",
    "佐藤 花子": "佐藤 花子",
    鈴木一郎: "鈴木 一郎",
    "鈴木 一郎": "鈴木 一郎",
    田中美咲: "田中 美咲",
    "田中 美咲": "田中 美咲",
    伊藤健太: "伊藤 健太",
    "伊藤 健太": "伊藤 健太",
    渡辺さくら: "渡辺 さくら",
    "渡辺 さくら": "渡辺 さくら",
    中村大輔: "中村 大輔",
    "中村 大輔": "中村 大輔",
    小林愛美: "小林 愛美",
    "小林 愛美": "小林 愛美",
    加藤翔太: "加藤 翔太",
    "加藤 翔太": "加藤 翔太",
    吉田由美: "吉田 由美",
    "吉田 由美": "吉田 由美",
  };

  // Function to find employee name in message (handles spaces, honorifics, etc.)
  const findEmployeeName = (message: string): string | null => {
    // Remove common honorifics and particles
    const cleanedMessage = message.replace(/[さんの]/g, "");

    // Try exact match first (with spaces)
    for (const name of employeeNames) {
      if (cleanedMessage.includes(name)) {
        return name;
      }
    }

    // Try variations (without spaces)
    for (const [variation, normalizedName] of Object.entries(nameVariations)) {
      if (cleanedMessage.includes(variation)) {
        return normalizedName;
      }
    }

    // Try partial match (first name + last name)
    for (const name of employeeNames) {
      const [lastName, firstName] = name.split(" ");
      if (cleanedMessage.includes(lastName) && cleanedMessage.includes(firstName)) {
        return name;
      }
    }

    return null;
  };

  // Detect employment certificate intent (Japanese)
  const isEmploymentCertificateRequest =
    (lowerMessage.includes("在職証明書") || lowerMessage.includes("在職証明")) &&
    (lowerMessage.includes("作成") ||
      lowerMessage.includes("作って") ||
      lowerMessage.includes("記入案") ||
      lowerMessage.includes("作成して") ||
      lowerMessage.includes("作る"));

  // More flexible detection
  const isEmploymentCertificateRequestFlexible =
    lowerMessage.includes("在職") &&
    (lowerMessage.includes("証明") || lowerMessage.includes("証明書")) &&
    (lowerMessage.includes("作成") || lowerMessage.includes("作") || lowerMessage.includes("記入"));

  if (isEmploymentCertificateRequest || isEmploymentCertificateRequestFlexible) {
    // Check if a name is mentioned in the message
    const mentionedName = findEmployeeName(userMessage);

    if (mentionedName) {
      return {
        id: `agent-${Date.now()}`,
        type: "agent",
        text: `${mentionedName}さんの在職証明書の記入案を作成しました。以下のフォームを編集してください。`,
        uiComponent: "employment-certificate",
        employeeName: mentionedName,
      };
    } else {
      return {
        id: `agent-${Date.now()}`,
        type: "agent",
        text: "在職証明書の記入案を作成しました。以下のフォームを編集してください。",
        uiComponent: "employment-certificate",
      };
    }
  }

  // Default response
  return {
    id: `agent-${Date.now()}`,
    type: "agent",
    text: `I understand you're asking about: ${userMessage}. How can I assist you further?`,
  };
};

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastEnterKeyTimeRef = useRef<number>(0);
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

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      text: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate AI processing delay
    setTimeout(() => {
      const agentResponse = detectIntent(inputValue);
      if (agentResponse) {
        setMessages((prev) => [...prev, agentResponse]);

        // If employment certificate is requested, initialize data
        if (agentResponse.uiComponent === "employment-certificate") {
          // Default company information (always filled)
          const defaultCompanyInfo = {
            companyName: "株式会社ABC",
            companyAddress: "東京都渋谷区カラス町1-1-1",
            companyPhone: "02-000-0000",
          };

          if (agentResponse.employeeName) {
            // Pre-fill with employee data
            const employeeData = employeeDataMap[agentResponse.employeeName];
            if (employeeData) {
              setEmploymentCertificateData({
                ...defaultCompanyInfo,
                representativeName: "",
                companySeal: "",
                issueDate: new Date(),
                employeeName: agentResponse.employeeName,
                dateOfBirth: employeeData.dateOfBirth ?? null,
                employeeNumber: employeeData.employeeNumber ?? "",
                employmentType: employeeData.employmentType ?? "",
                department: employeeData.department ?? "",
                position: employeeData.position ?? "",
                employmentStartDate: employeeData.employmentStartDate ?? null,
                workType: employeeData.workType ?? "",
              });
            }
          } else {
            // Empty form with default company info
            setEmploymentCertificateData({
              ...defaultCompanyInfo,
              representativeName: "",
              companySeal: "",
              issueDate: new Date(),
              employeeName: "",
              dateOfBirth: null,
              employeeNumber: "",
              employmentType: "",
              department: "",
              position: "",
              employmentStartDate: null,
              workType: "",
            });
          }
        }
      }
    }, 500);
  };

  const handleReservationSubmit = (data: RestaurantReservationData) => {
    const restaurantName = data.restaurant === "a-restaurant" ? "A Restaurant" : data.restaurant;
    const confirmationMessage: Message = {
      id: `agent-${Date.now()}`,
      type: "agent",
      text: `Reservation confirmed! ${restaurantName} on ${data.date?.toLocaleDateString()} for ${data.numberOfPeople} ${data.numberOfPeople === "1" ? "person" : "people"}.`,
    };
    setMessages((prev) => [...prev, confirmationMessage]);
  };

  const handleCommuteRouteCalculationSubmit = (data: CommuteRouteCalculationData) => {
    const parts: string[] = [];

    if (data.targetType && data.targetValue) {
      const targetTypeLabel = data.targetType === "user-group" ? "ユーザーグループ" : "部署";
      const targetValueLabel =
        data.targetType === "user-group"
          ? data.targetValue === "sales"
            ? "営業部"
            : data.targetValue === "development"
              ? "開発部"
              : data.targetValue === "hr"
                ? "人事部"
                : "経理部"
          : data.targetValue === "tokyo-hq"
            ? "東京本社"
            : data.targetValue === "osaka-branch"
              ? "大阪支社"
              : "名古屋支社";
      parts.push(`対象: ${targetTypeLabel}「${targetValueLabel}」`);
    }

    if (data.employmentStartMonth) {
      const year = data.employmentStartMonth.getFullYear();
      const month = data.employmentStartMonth.getMonth() + 1;
      parts.push(`入社月: ${year}年${month}月`);
    }

    if (data.username) {
      const usernameLabel =
        data.username === "yamada-taro"
          ? "山田 太郎"
          : data.username === "sato-hanako"
            ? "佐藤 花子"
            : data.username === "suzuki-ichiro"
              ? "鈴木 一郎"
              : data.username === "tanaka-misaki"
                ? "田中 美咲"
                : data.username === "ito-kenta"
                  ? "伊藤 健太"
                  : data.username === "watanabe-sakura"
                    ? "渡辺 さくら"
                    : data.username === "nakamura-daisuke"
                      ? "中村 大輔"
                      : "小林 愛美";
      parts.push(`ユーザー名: ${usernameLabel}`);
    }

    const detailsText = parts.length > 0 ? parts.join("、") : "指定なし";
    const confirmationMessage: Message = {
      id: `agent-${Date.now()}`,
      type: "agent",
      text: `通勤経路の計算を開始しました。${detailsText}。計算結果は後ほどお知らせします。`,
    };
    setMessages((prev) => [...prev, confirmationMessage]);
  };

  // Scroll to bottom when messages change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional trigger on messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <PageLayout scrollBehavior="inside">
      <StartSidebar />
      <PageLayoutContent scrollBehavior="inside">
        <PageLayoutHeader>
          <ContentHeader size="medium">
            <ContentHeader.Title>AI Chat</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div
            style={{
              inlineSize: "100%",
              maxInlineSize: "var(--aegis-layout-width-large)",
              marginInline: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-medium)",
              padding: "var(--aegis-space-medium)",
            }}
          >
            <div
              style={{
                position: "relative",
              }}
            >
              <Banner
                size="medium"
                color="information"
                closeButton={false}
                action={
                  <Button variant="subtle" size="small">
                    Review
                  </Button>
                }
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--aegis-space-small)",
                  }}
                >
                  <Icon>
                    <LfSparkles />
                  </Icon>
                  <Text variant="body.medium">Review your task</Text>
                </div>
              </Banner>
              <style>
                {`
                  [data-cursor-element-id="cursor-el-1"] {
                    display: none !important;
                  }
                  .aegis-zg9r7W_icon {
                    display: none !important;
                  }
                `}
              </style>
            </div>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: "flex",
                  gap: "var(--aegis-space-small)",
                  justifyContent: message.type === "user" ? "flex-end" : "flex-start",
                }}
              >
                {message.type === "agent" && <Avatar size="small" color="blue" name="AI" src={LfSparkles} />}
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
                  {message.uiComponent === "restaurant-reservation" && (
                    <RestaurantReservationForm onSubmit={handleReservationSubmit} />
                  )}
                  {message.uiComponent === "commute-route-calculation" && (
                    <CommuteRouteCalculationForm onSubmit={handleCommuteRouteCalculationSubmit} />
                  )}
                  {message.uiComponent === "employment-certificate" && (
                    <EmploymentCertificateForm
                      data={employmentCertificateData}
                      onChange={setEmploymentCertificateData}
                    />
                  )}
                </div>
                {message.type === "user" && <Avatar size="small" color="orange" name="Jy" />}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </PageLayoutBody>
        <PageLayoutFooter gutterless>
          <div
            style={{
              inlineSize: "100%",
              maxInlineSize: "var(--aegis-layout-width-large)",
              marginInline: "auto",
            }}
          >
            <Textarea
              placeholder="Type your message"
              minRows={2}
              maxRows={10}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  const now = Date.now();
                  const timeSinceLastEnter = now - lastEnterKeyTimeRef.current;

                  // If Enter is pressed within 500ms of the previous Enter, send the message
                  if (timeSinceLastEnter < 500 && lastEnterKeyTimeRef.current > 0) {
                    e.preventDefault();
                    handleSend();
                    lastEnterKeyTimeRef.current = 0; // Reset
                  } else {
                    // First Enter key - allow newline, just record the time
                    lastEnterKeyTimeRef.current = now;
                  }
                } else if (e.key !== "Enter") {
                  // Reset the timer if any other key is pressed
                  lastEnterKeyTimeRef.current = 0;
                }
              }}
              trailing={
                <div
                  style={{
                    inlineSize: "100%",
                    padding: "var(--aegis-space-xSmall)",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <ButtonGroup variant="plain" size="small">
                    <Tooltip title="Attach">
                      <IconButton aria-label="Attach">
                        <Icon>
                          <LfClip />
                        </Icon>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Settings">
                      <IconButton aria-label="Settings">
                        <Icon>
                          <LfSetting />
                        </Icon>
                      </IconButton>
                    </Tooltip>
                  </ButtonGroup>
                  <Tooltip title="Send">
                    <IconButton size="small" aria-label="Send" onClick={handleSend} disabled={!inputValue.trim()}>
                      <Icon>
                        <LfSend />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                </div>
              }
            />
          </div>
        </PageLayoutFooter>
      </PageLayoutContent>
    </PageLayout>
  );
}
