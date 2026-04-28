export interface ReferenceSource {
  id: string;
  type: "file" | "case";
  title: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  status: "complete" | "loading";
  references?: ReferenceSource[];
}

export const mockConversation: Message[] = [
  {
    id: "1",
    role: "user",
    content: "業務委託契約書の損害賠償条項について確認したいです。上限金額の設定は必要でしょうか？",
    status: "complete",
  },
  {
    id: "2",
    role: "assistant",
    content: `損害賠償条項における上限金額の設定について回答します。

**推奨事項:**
1. 損害賠償の上限金額を明記することを推奨します
2. 一般的には契約金額や年間取引額を基準とする場合が多いです
3. 間接損害・特別損害の除外条項も併せて検討してください

**参考条文例:**
「本契約に基づく損害賠償の総額は、過去12ヶ月間に支払われた委託料の総額を上限とする。」`,
    status: "complete",
    references: [
      { id: "ref1", type: "file", title: "業務委託契約書_v3.docx" },
      { id: "ref2", type: "case", title: "2024-02-0015 基本契約書_取引先A" },
    ],
  },
  {
    id: "3",
    role: "user",
    content: "ありがとうございます。秘密保持義務の範囲についても確認したいです。",
    status: "complete",
  },
  {
    id: "4",
    role: "assistant",
    content: "",
    status: "loading",
  },
];
