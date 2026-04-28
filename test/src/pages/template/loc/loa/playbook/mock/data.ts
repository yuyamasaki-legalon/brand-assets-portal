export interface PlaybookMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  status: "complete" | "loading";
}

export interface PlaybookAlert {
  id: string;
  playbookInstruction: string;
  sourceSnippet: string;
  modelLanguage: string;
  fallbackPosition: string;
  other: string;
}

export interface PlaybookDraft {
  id: string;
  title: string;
  alerts: PlaybookAlert[];
  status: "draft" | "finalized";
}

export const mockPlaybookConversation: PlaybookMessage[] = [
  {
    id: "msg-1",
    role: "user",
    content: "アップロードしたプレイブックを元に、LegalOnレビュー用のプレイブックを作成してください。",
    status: "complete",
  },
  {
    id: "msg-2",
    role: "assistant",
    content:
      "プレイブックファイルを確認しました。以下の内容を基に、LegalOnレビュー用のプレイブックを作成します。\n\n■ 検出された審査基準:\n1. 秘密保持義務の範囲と期間の確認\n2. 損害賠償の上限条項の有無\n3. 競業避止義務の妥当性確認\n\nプレイブックのドラフトを作成しました。右側のパネルで内容を確認・編集できます。",
    status: "complete",
  },
  {
    id: "msg-3",
    role: "user",
    content: "秘密保持義務の項目に、開示先の制限に関するレビュー指示を追加してください。",
    status: "complete",
  },
  {
    id: "msg-4",
    role: "assistant",
    content: "",
    status: "loading",
  },
];

export const mockPlaybookDraft: PlaybookDraft = {
  id: "pb-001",
  title: "秘密保持契約レビュー基準",
  status: "draft",
  alerts: [
    {
      id: "alert-1",
      playbookInstruction:
        "秘密保持義務の範囲が広すぎないか確認する。「一切の情報」のような包括的な定義になっていないか注意する。",
      sourceSnippet: "第2条（秘密情報の定義）\n甲が乙に開示する一切の技術上又は営業上の情報をいう。",
      modelLanguage:
        "「秘密情報」とは、開示当事者が受領当事者に対し、秘密である旨を明示して開示した技術上又は営業上の情報をいう。",
      fallbackPosition: "口頭開示の場合は30日以内の書面確認を条件に秘密情報に含める。",
      other: "",
    },
    {
      id: "alert-2",
      playbookInstruction: "損害賠償の上限条項が設定されているか確認する。上限がない場合はリスクとして指摘する。",
      sourceSnippet: "第8条（損害賠償）\n相手方に損害を与えた場合、直接かつ現実に生じた損害を賠償する。",
      modelLanguage:
        "本契約に基づく損害賠償の総額は、本契約に基づき支払われた対価の総額を上限とする。ただし、故意又は重過失の場合はこの限りでない。",
      fallbackPosition: "上限条項の追加が困難な場合、間接損害・逸失利益の免責条項を設ける。",
      other: "特別損害、間接損害の定義についても確認すること。",
    },
    {
      id: "alert-3",
      playbookInstruction:
        "競業避止義務が含まれている場合、期間・地域・業種の制限が妥当かレビューする。過度に広範な競業避止は無効となるリスクがある。",
      sourceSnippet: "第10条（競業避止）\n乙は、本契約終了後2年間、甲と同一又は類似の事業を行ってはならない。",
      modelLanguage:
        "乙は、本契約終了後1年間、日本国内において、甲の事業と直接競合する事業を自ら行い又は第三者をして行わせてはならない。",
      fallbackPosition: "期間を1年以内、地域を日本国内に限定する。業種の限定も明確にする。",
      other: "",
    },
  ],
};
