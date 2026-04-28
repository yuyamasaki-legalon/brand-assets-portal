export type AlertLevel = "high" | "medium" | "low" | "unknown";

export type AlertItem = {
  id: string;
  level: AlertLevel;
  category: string;
  title: string;
  description: string;
};

export const alertSummary =
  "三峰商事株式会社の営業部門でDealOnの導入を検討している。業務効率化と生産性向上を目的とし、現在は正式検討フェーズで要件定義を進めている。予算・時期など7カテゴリに関するアラートが7件検出されています。";

export const alertItems: AlertItem[] = [
  {
    id: "1",
    level: "high",
    category: "予算",
    title: "社内で「何に投資するか」を選別している段...",
    description:
      "社内で「何に投資するか」を選別している段階にあり、予算が営業DXに割り当て貰えるかが不透明。また売上の伸びが停滞してしまっているので追加投資を認めて貰えるかがわからない。",
  },
  {
    id: "2",
    level: "high",
    category: "時期",
    title: "予算が追加で取得できるか不透明な旨の発言...",
    description:
      "予算が追加で取得できるか不透明な旨の発言があり、短期的な受注には明確に難しいとガードをされている。また予算が不透明という発言に基づき、年度内の受注も難しい可能性がある。",
  },
  {
    id: "3",
    level: "high",
    category: "決裁者",
    title: "商談相手は情報収集の担当者のため決裁権は...",
    description:
      "商談相手は情報収集の担当者のため決裁権はないと明確な言質が取れている。実際の判断は「部門長会議」や「上司」に委ねられているようで、上申のフローやスケジュールが掴れていない。",
  },
  {
    id: "4",
    level: "medium",
    category: "運用",
    title: "機能面を確認して現場での活用イメージは持...",
    description:
      "機能面を確認して現場での活用イメージは持てたとの言質はあるが、サポート体制や問い合わせのしやすさの懸念の質問があり不安を払拭する必要がある。",
  },
  {
    id: "5",
    level: "low",
    category: "サービス価値",
    title: "現在のスプレッドシートでの管理",
    description:
      "現在のスプレッドシートでの管理、メンバーの案件確認と指導工数が膨大で課題を強く感じている。また、特にモニタリング機能に好感触の反応を強く示しており、AI自動化の利便性に明確に理解と期待を示している。",
  },
  {
    id: "6",
    level: "unknown",
    category: "競合",
    title: "他の具体的な類似ツールとの比較検討は今回...",
    description: "他の具体的な類似ツールとの比較検討は今回の商談の中では言及されていなかった。",
  },
  {
    id: "7",
    level: "unknown",
    category: "社内抵抗",
    title: "全社的な横断の方針ではないが",
    description:
      "全社的な横断の方針ではないが、個々の社員が既にGeminiなどのAIツールは使っているとのことで、ツールの利用に対する現場の心理的ハードルは低そう。",
  },
];

export const levelLabelMap: Record<AlertLevel, string> = {
  high: "高レベル",
  medium: "中レベル",
  low: "低レベル",
  unknown: "未判定",
};

export const levelColorMap: Record<AlertLevel, "red" | "yellow" | "blue"> = {
  high: "red",
  medium: "yellow",
  low: "blue",
  unknown: "yellow",
};

export const levelVariantMap: Record<AlertLevel, "outline" | "fill"> = {
  high: "outline",
  medium: "outline",
  low: "outline",
  unknown: "fill",
};

export const alertFilterOptions: { label: string; level: AlertLevel | "all" }[] = [
  { label: "全て", level: "all" },
  { label: "高レベル", level: "high" },
  { label: "中レベル", level: "medium" },
  { label: "低レベル", level: "low" },
  { label: "未判定", level: "unknown" },
];
