export type PromptItem = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  author: string;
  isFavorite: boolean;
  isPublic: boolean;
};

export const mockPromptItems: PromptItem[] = [
  {
    id: "1",
    title: "秘密保持契約の確認",
    description: "NDAの主要条項をチェックするプロンプト",
    prompt:
      "以下の秘密保持契約書について、秘密情報の定義範囲、存続期間、損害賠償条項の3点を中心に確認し、リスクがあれば指摘してください。",
    author: "田中 太郎",
    isFavorite: true,
    isPublic: true,
  },
  {
    id: "2",
    title: "損害賠償条項の分析",
    description: "損害賠償の上限や免責事項を分析",
    prompt: "契約書中の損害賠償条項について、賠償上限の有無、間接損害の免責範囲、違約金の妥当性を分析してください。",
    author: "佐藤 花子",
    isFavorite: false,
    isPublic: true,
  },
  {
    id: "3",
    title: "契約書の要約",
    description: "契約書全体を簡潔に要約する",
    prompt: "この契約書の主要な条件（契約期間、対価、解除条件、責任範囲）を箇条書きで要約してください。",
    author: "鈴木 一郎",
    isFavorite: true,
    isPublic: false,
  },
  {
    id: "4",
    title: "競業避止義務の確認",
    description: "競業避止条項の有効性と範囲を確認",
    prompt:
      "契約書中の競業避止義務条項について、制限期間、地理的範囲、対象業務の範囲を確認し、過度に広範でないか評価してください。",
    author: "田中 太郎",
    isFavorite: false,
    isPublic: true,
  },
  {
    id: "5",
    title: "知的財産権の帰属確認",
    description: "成果物の知的財産権の帰属を確認する",
    prompt:
      "この契約における成果物の知的財産権の帰属について、発生時期、譲渡条件、共有の場合の取り扱いを整理してください。",
    author: "佐藤 花子",
    isFavorite: false,
    isPublic: true,
  },
  {
    id: "6",
    title: "解除条件の整理",
    description: "契約解除に関する条件を整理する",
    prompt:
      "契約の解除条件（任意解除、債務不履行解除、期限の利益喪失事由）を一覧化し、各条件の発動要件を整理してください。",
    author: "鈴木 一郎",
    isFavorite: true,
    isPublic: true,
  },
];
