export type Severity = "none" | "low" | "medium" | "high";
export type PlaybookType = "thirdParty" | "firstParty";

export interface User {
  name: string;
}

export interface PlaybookSummary {
  playbookId: string;
  playbookName: string;
  updateBy?: User;
  createTime?: string;
  updateTime?: string;
}

export interface PlaybookAlert {
  playbookAlertId: string;
  playbookInstruction: string;
  severity: Severity;
  modelLanguage?: string;
  fallbackPosition?: string;
  acceptableFallbackLanguage?: string;
  escalationsOrApprovals?: string;
  other?: string;
  updateBy?: User;
  createTime?: string;
  updateTime?: string;
}

export interface PlaybookEscalation {
  playbookEscalationId: string;
  escalationTitle: string;
  escalationBody?: string;
  updateBy?: User;
  createTime?: string;
  updateTime?: string;
}

export interface Playbook {
  playbookSummary: PlaybookSummary;
  playbookAlerts: PlaybookAlert[];
  playbookEscalations: PlaybookEscalation[];
}

export interface FirstPartyPlaybookAlert {
  firstPartyPlaybookAlertId: string;
  articleTitle: string;
  issueTitle: string;
  fallbackPosition?: string;
  nonNegotiablePosition?: string;
  severity: Severity;
  escalationsOrApprovals?: string;
  explanatoryComments?: string;
  updateBy?: User;
  createTime?: string;
  updateTime?: string;
}

export interface FirstPartyPlaybook {
  playbookSummary: PlaybookSummary;
  firstPartyPlaybookAlerts: FirstPartyPlaybookAlert[];
  playbookEscalations: PlaybookEscalation[];
}

export const SEVERITY_LABEL_MAP = {
  none: "なし",
  low: "低",
  medium: "中",
  high: "高",
} satisfies Record<Severity, string>;

export const SEVERITY_COLOR_MAP = {
  none: "gray",
  low: "gray",
  medium: "yellow",
  high: "red",
} satisfies Record<Severity, "gray" | "yellow" | "red">;

export const MOCK_THIRD_PARTY_PLAYBOOKS: Playbook[] = [
  {
    playbookSummary: {
      playbookId: "pb-1",
      playbookName: "NDA 標準プレイブック",
      updateBy: { name: "山田 太郎" },
      updateTime: "2024-01-15T10:30:00Z",
    },
    playbookAlerts: [
      {
        playbookAlertId: "pa-1",
        playbookInstruction: "秘密情報の定義が明確に定められていること",
        severity: "high",
        modelLanguage:
          "本契約において「秘密情報」とは、開示者が受領者に対し書面により秘密である旨を明示して開示した情報をいう。",
        fallbackPosition: "秘密情報の範囲を限定する条項の追加を要求",
        acceptableFallbackLanguage: "口頭開示の場合は30日以内に書面で確認する旨の条項",
        escalationsOrApprovals: "法務部長の承認が必要",
        updateBy: { name: "田中 花子" },
        updateTime: "2024-01-10T09:00:00Z",
      },
      {
        playbookAlertId: "pa-2",
        playbookInstruction: "秘密保持義務の存続期間が3年以内であること",
        severity: "medium",
        modelLanguage: "本契約終了後3年間は秘密保持義務が存続するものとする。",
        fallbackPosition: "存続期間を3年以内に短縮する交渉",
        updateBy: { name: "山田 太郎" },
        updateTime: "2024-01-12T14:30:00Z",
      },
      {
        playbookAlertId: "pa-3",
        playbookInstruction: "損害賠償の範囲が直接損害に限定されていること",
        severity: "high",
        modelLanguage: "損害賠償の範囲は直接損害に限るものとし、間接損害、特別損害、逸失利益は含まないものとする。",
        escalationsOrApprovals: "取締役の承認が必要",
        updateBy: { name: "佐藤 次郎" },
        updateTime: "2024-01-08T16:45:00Z",
      },
    ],
    playbookEscalations: [
      {
        playbookEscalationId: "pe-1",
        escalationTitle: "法務部長承認",
        escalationBody: "重要度「高」のチェックポイントが満たされない場合は、法務部長の承認を得てください。",
        updateBy: { name: "山田 太郎" },
        updateTime: "2024-01-15T10:30:00Z",
      },
    ],
  },
  {
    playbookSummary: {
      playbookId: "pb-2",
      playbookName: "ライセンス契約プレイブック",
      updateBy: { name: "鈴木 一郎" },
      updateTime: "2024-01-18T11:00:00Z",
    },
    playbookAlerts: [
      {
        playbookAlertId: "pa-4",
        playbookInstruction: "ライセンスの範囲が明確に定められていること",
        severity: "high",
        modelLanguage: "本ライセンスは、日本国内における使用に限定される。",
        updateBy: { name: "鈴木 一郎" },
        updateTime: "2024-01-18T11:00:00Z",
      },
      {
        playbookAlertId: "pa-5",
        playbookInstruction: "サブライセンスの可否が明記されていること",
        severity: "medium",
        updateBy: { name: "鈴木 一郎" },
        updateTime: "2024-01-18T11:00:00Z",
      },
    ],
    playbookEscalations: [],
  },
];

export const MOCK_FIRST_PARTY_PLAYBOOKS: FirstPartyPlaybook[] = [
  {
    playbookSummary: {
      playbookId: "fp-1",
      playbookName: "自社 NDA テンプレート",
      updateBy: { name: "高橋 健一" },
      updateTime: "2024-01-20T09:15:00Z",
    },
    firstPartyPlaybookAlerts: [
      {
        firstPartyPlaybookAlertId: "fpa-1",
        articleTitle: "第3条（秘密保持義務）",
        issueTitle: "秘密保持義務の範囲",
        fallbackPosition: "秘密情報の範囲を書面で明示されたものに限定",
        nonNegotiablePosition: "秘密保持義務自体の削除は不可",
        severity: "high",
        escalationsOrApprovals: "法務部長承認",
        explanatoryComments: "当社の企業秘密保護のため、秘密保持義務は必須条項です。",
        updateBy: { name: "高橋 健一" },
        updateTime: "2024-01-20T09:15:00Z",
      },
      {
        firstPartyPlaybookAlertId: "fpa-2",
        articleTitle: "第5条（損害賠償）",
        issueTitle: "損害賠償額の上限",
        fallbackPosition: "契約金額の100%を上限とする条項の追加",
        nonNegotiablePosition: "無制限の損害賠償責任は不可",
        severity: "high",
        updateBy: { name: "高橋 健一" },
        updateTime: "2024-01-20T09:15:00Z",
      },
    ],
    playbookEscalations: [
      {
        playbookEscalationId: "fpe-1",
        escalationTitle: "取締役承認",
        escalationBody: "契約金額が1000万円を超える場合は取締役の承認が必要です。",
        updateBy: { name: "高橋 健一" },
        updateTime: "2024-01-20T09:15:00Z",
      },
    ],
  },
];
