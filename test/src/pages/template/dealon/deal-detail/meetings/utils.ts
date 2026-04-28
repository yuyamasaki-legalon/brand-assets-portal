import type { MeetingCategory, MeetingType } from "./mock";

export const categoryConfig: Record<MeetingCategory, { label: string; color: "blue" | "teal" | "red" | "yellow" }> = {
  Sales: { label: "営業", color: "blue" },
  Success: { label: "更新・関係維持", color: "teal" },
  Legal: { label: "契約/NDA/DPA", color: "teal" },
  Security: { label: "セキュリティ審査", color: "red" },
  Finance: { label: "見積・発注・ベンダー登録・請求", color: "yellow" },
  Onboarding: { label: "導入", color: "teal" },
  Support: { label: "サポート", color: "yellow" },
  Product: { label: "要望・技術検討", color: "blue" },
  Training: { label: "教育", color: "teal" },
  Other: { label: "その他", color: "teal" },
};

export const typeConfig: Record<MeetingType, { label: string; color: "blue" | "teal" }> = {
  online_meet: { label: "ONLINE(Meet)", color: "blue" },
  online_other: { label: "ONLINE(その他)", color: "teal" },
  offline: { label: "OFFLINE（対面）", color: "teal" },
  telephone: { label: "TELEPHONE（電話）", color: "blue" },
};

export const formatDateTime = (dateTimeStr: string): { date: string; time: string } => {
  const date = new Date(dateTimeStr);
  const dateStr = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
  const timeStr = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  return { date: dateStr, time: timeStr };
};

export const formatTimeRange = (start: string, end: string): string => {
  const startTime = formatDateTime(start).time;
  const endTime = formatDateTime(end).time;
  return `${startTime} - ${endTime}`;
};
