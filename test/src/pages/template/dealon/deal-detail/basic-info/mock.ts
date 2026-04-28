import type { InfoItem } from "../_components";

export const dealInfoItems: InfoItem[] = [
  { key: "dealName", label: "案件名", content: "【三峰商事株式会社】DealOn20260101" },
  { key: "dealCategory", label: "カテゴリ", content: "営業" },
  { key: "phase", label: "フェーズ", content: "正式検討" },
  { key: "expectedDealValue", label: "受注見込み額", content: "¥350,000" },
  { key: "expectedCloseDate", label: "受注予定日", content: "2026年3月31日" },
  { key: "probability", label: "見込み度", content: "60%" },
];

export const assigneeInfoItems: InfoItem[] = [
  { key: "customerContact", label: "取引先主担当", content: "田中 真央" },
  { key: "assignee", label: "自社主担当", content: "田中 真央" },
  { key: "relatedMembers", label: "案件関係者一覧", content: "伊藤 隆二、渡辺 美咲" },
];

export const dateInfoItems: InfoItem[] = [
  { key: "lastContactAt", label: "最終対応日時", content: "2026年1月10日" },
  { key: "lastUpdatedAt", label: "最終更新日時", content: "2026年1月12日 10:00" },
];

export const phaseHistory = [
  {
    changedAt: "2026年2月3日 13:21",
    changedBy: "田中一郎",
    prev: "パイプライン化",
    next: "正式検討",
    reason: "契約条件が確定したため",
  },
  {
    changedAt: "2026年1月27日 12:14",
    changedBy: "Sela",
    prev: "商談獲得",
    next: "パイプライン化",
    reason: "決裁プロセスに移行したため",
  },
  {
    changedAt: "2026年1月20日 11:07",
    changedBy: "佐藤花子",
    prev: "案件流入",
    next: "商談獲得",
    reason: "提案内容の合意が取れたため",
  },
  {
    changedAt: "2026年1月13日 10:00",
    changedBy: "山田太郎",
    prev: "リード",
    next: "案件流入",
    reason: "初回ヒアリングが完了したため",
  },
];
