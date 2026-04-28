export type Severity = "low" | "medium" | "high";
export type AppliedSeverityType = "user" | "tenant";
export type RuleActionType =
  | "insertion"
  | "addition"
  | "deletion"
  | "revision"
  | "deletionOrAddition"
  | "deletionOrRevision"
  | "additionOrRevision"
  | "caution";

export interface RuleExample {
  fragment: string;
  highlight: boolean;
}

export interface Rule {
  ruleId: number;
  ruleSummary: string;
  examples: RuleExample[];
  note: string;
  guidance?: string;
  actionType: RuleActionType;
  userSeverity?: Severity;
  tenantSeverity?: Severity;
  recommendedSeverity: Severity;
}

export interface RuleGroup {
  ruleGroupId: string;
  name: string;
  rules: Rule[];
}

export interface FilterOption {
  value: string;
  label: string;
}

export const MOCK_RULE_GROUPS: RuleGroup[] = [
  {
    ruleGroupId: "rg-0",
    name: "実務対応アラート",
    rules: [
      {
        ruleId: 0,
        ruleSummary: "秘密保持契約に関連するひな形はこちらです",
        examples: [],
        note: "秘密保持契約のレビュー時に参照するひな形集です。",
        actionType: "caution",
        recommendedSeverity: "medium",
      },
    ],
  },
  {
    ruleGroupId: "rg-1",
    name: "開示目的",
    rules: [
      {
        ruleId: 1,
        ruleSummary: "秘密情報の開示目的を、追加しませんか？",
        examples: [
          { fragment: "甲は、", highlight: false },
          { fragment: "本取引の検討を目的として", highlight: true },
          { fragment: "、乙に対し秘密情報を開示する。", highlight: false },
        ],
        note: "秘密情報の開示目的を明確に定めることで、情報の使用範囲を限定し、不正利用を防止できます。",
        guidance: "開示目的は具体的かつ限定的に記載することを推奨します。",
        actionType: "insertion",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
    ],
  },
  {
    ruleGroupId: "rg-2",
    name: "秘密情報の第三者への非開示",
    rules: [
      {
        ruleId: 2,
        ruleSummary: "秘密保持義務を、追加しませんか？",
        examples: [
          { fragment: "受領者は、", highlight: false },
          { fragment: "秘密情報を第三者に開示してはならない", highlight: true },
          { fragment: "。", highlight: false },
        ],
        note: "秘密情報の第三者への開示禁止は、秘密保持契約の根幹をなす条項です。",
        actionType: "insertion",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
    ],
  },
  {
    ruleGroupId: "rg-3",
    name: "情報開示義務の留保",
    rules: [
      {
        ruleId: 3,
        ruleSummary: "秘密情報を開示する義務を負わない旨を、追加しませんか？",
        examples: [
          { fragment: "開示者は、受領者に対し、", highlight: false },
          { fragment: "秘密情報を開示する義務を負わない", highlight: true },
          { fragment: "ものとする。", highlight: false },
        ],
        note: "開示者が秘密情報の開示義務を負わないことを明確にすることで、開示者の裁量を確保できます。",
        actionType: "insertion",
        recommendedSeverity: "low",
      },
    ],
  },
  {
    ruleGroupId: "rg-4",
    name: "秘密情報の範囲",
    rules: [
      {
        ruleId: 4,
        ruleSummary: "秘密情報の対象範囲を、追加しませんか？",
        examples: [
          { fragment: "「秘密情報」とは、", highlight: false },
          { fragment: "技術情報、営業情報、顧客情報その他一切の情報", highlight: true },
          { fragment: "をいう。", highlight: false },
        ],
        note: "秘密情報の範囲を明確に定義することで、保護対象を特定できます。",
        actionType: "insertion",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
      {
        ruleId: 5,
        ruleSummary: "秘密保持契約の「存在・内容」を、秘密情報に含める旨を、追加しませんか？",
        examples: [
          { fragment: "秘密情報には、", highlight: false },
          { fragment: "本契約の存在および内容", highlight: true },
          { fragment: "を含むものとする。", highlight: false },
        ],
        note: "契約の存在自体を秘密とすることで、取引関係の開示を防止できます。",
        actionType: "addition",
        recommendedSeverity: "medium",
      },
      {
        ruleId: 6,
        ruleSummary: "「秘密」である旨を明示した情報でなければ、秘密情報に含まれない旨を、修正しませんか？",
        examples: [
          { fragment: "秘密情報とは、", highlight: false },
          { fragment: "秘密である旨を書面により明示して", highlight: true },
          { fragment: "開示した情報をいう。", highlight: false },
        ],
        note: "秘密表示の要件が厳格すぎると、口頭で開示した重要情報が保護されないリスクがあります。",
        guidance: "秘密表示の要件を緩和し、口頭開示の場合の事後確認規定を設けることを検討してください。",
        actionType: "revision",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
    ],
  },
  {
    ruleGroupId: "rg-5",
    name: "秘密情報の例外",
    rules: [
      {
        ruleId: 7,
        ruleSummary: "「受領者の帰責性によって」公知となった情報を、秘密情報から除外する旨を、修正しませんか？",
        examples: [
          { fragment: "次の各号に該当する情報は秘密情報に含まれない。(1)", highlight: false },
          { fragment: "受領者の責めに帰すべき事由によらず", highlight: true },
          { fragment: "公知となった情報", highlight: false },
        ],
        note: "受領者の帰責性の有無にかかわらず公知情報を除外すると、受領者による漏洩後の情報も除外される恐れがあります。",
        actionType: "revision",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
      {
        ruleId: 8,
        ruleSummary: "「第三者から取得した情報」が、限定なく秘密情報から除外される旨を、修正しませんか？",
        examples: [
          { fragment: "(2)", highlight: false },
          { fragment: "第三者から適法に取得した情報", highlight: true },
          { fragment: "。ただし、当該第三者が秘密保持義務を負っていない場合に限る。", highlight: false },
        ],
        note: "第三者からの取得情報を無条件で除外すると、間接的な情報漏洩を許容することになります。",
        actionType: "revision",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
    ],
  },
  {
    ruleGroupId: "rg-6",
    name: "その他関係者への開示",
    rules: [
      {
        ruleId: 9,
        ruleSummary: "秘密情報が第三者に開示される例外を、削除・修正しませんか？",
        examples: [
          { fragment: "受領者は、", highlight: false },
          { fragment: "自己の役員、従業員、弁護士、会計士その他のアドバイザー", highlight: true },
          { fragment: "に対し、秘密情報を開示することができる。", highlight: false },
        ],
        note: "第三者への開示例外が広範に認められると、情報管理が困難になります。",
        guidance: "開示先を必要最小限に限定し、開示先にも秘密保持義務を負わせることを検討してください。",
        actionType: "deletionOrRevision",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
    ],
  },
  {
    ruleGroupId: "rg-7",
    name: "法令などに基づく開示",
    rules: [
      {
        ruleId: 10,
        ruleSummary: "行政機関や裁判所に秘密情報が開示される場合に、開示者に事前通知を行う旨を、追加しませんか？",
        examples: [
          { fragment: "受領者は、法令等に基づき秘密情報の開示を求められた場合、", highlight: false },
          { fragment: "速やかに開示者に通知する", highlight: true },
          { fragment: "ものとする。", highlight: false },
        ],
        note: "法的開示の前に通知することで、開示者が対抗措置を講じる機会を確保できます。",
        actionType: "addition",
        recommendedSeverity: "medium",
      },
      {
        ruleId: 11,
        ruleSummary: "必要な範囲に限り、秘密情報を行政機関や裁判所に開示する旨を、追加しませんか？",
        examples: [
          { fragment: "受領者は、法令等に基づく開示の場合、", highlight: false },
          { fragment: "必要最小限の範囲に限り", highlight: true },
          { fragment: "秘密情報を開示するものとする。", highlight: false },
        ],
        note: "法的開示の範囲を必要最小限に限定することで、過度な情報開示を防止できます。",
        actionType: "addition",
        recommendedSeverity: "medium",
      },
    ],
  },
  {
    ruleGroupId: "rg-8",
    name: "目的外使用の禁止",
    rules: [
      {
        ruleId: 12,
        ruleSummary: "秘密情報の目的外使用の禁止を、追加しませんか？",
        examples: [
          { fragment: "受領者は、秘密情報を", highlight: false },
          { fragment: "本契約の目的以外に使用してはならない", highlight: true },
          { fragment: "。", highlight: false },
        ],
        note: "目的外使用の禁止は、秘密保持義務の実効性を確保するために不可欠です。",
        actionType: "insertion",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
    ],
  },
  {
    ruleGroupId: "rg-9",
    name: "秘密情報の管理に関する注意義務",
    rules: [
      {
        ruleId: 13,
        ruleSummary: "秘密情報を管理するときの、善管注意義務を、追加しませんか？",
        examples: [
          { fragment: "受領者は、", highlight: false },
          { fragment: "善良な管理者の注意をもって", highlight: true },
          { fragment: "秘密情報を管理するものとする。", highlight: false },
        ],
        note: "善管注意義務を課すことで、適切な情報管理を求めることができます。",
        actionType: "insertion",
        recommendedSeverity: "medium",
      },
      {
        ruleId: 14,
        ruleSummary: "秘密情報を管理するとき、受領者は自己と同等の注意義務しか負わない旨を、修正しませんか？",
        examples: [
          { fragment: "受領者は、", highlight: false },
          { fragment: "自己の情報と同等の注意をもって", highlight: true },
          { fragment: "秘密情報を管理する。", highlight: false },
        ],
        note: "自己同等の注意義務は、善管注意義務より低い水準となる可能性があります。",
        guidance: "善管注意義務への修正を検討してください。",
        actionType: "revision",
        recommendedSeverity: "medium",
      },
    ],
  },
  {
    ruleGroupId: "rg-10",
    name: "管理責任者",
    rules: [
      {
        ruleId: 15,
        ruleSummary: "秘密情報の管理責任者の設置義務を、追加しませんか？",
        examples: [
          { fragment: "受領者は、", highlight: false },
          { fragment: "秘密情報の管理責任者を定め", highlight: true },
          { fragment: "、開示者に通知するものとする。", highlight: false },
        ],
        note: "管理責任者を明確にすることで、情報管理体制を強化できます。",
        actionType: "insertion",
        recommendedSeverity: "medium",
      },
    ],
  },
  {
    ruleGroupId: "rg-11",
    name: "報告義務",
    rules: [
      {
        ruleId: 16,
        ruleSummary: "秘密情報漏えい時の報告義務を、追加しませんか？",
        examples: [
          { fragment: "受領者は、秘密情報の漏えいが発生した場合、", highlight: false },
          { fragment: "直ちに開示者に報告する", highlight: true },
          { fragment: "ものとする。", highlight: false },
        ],
        note: "漏洩時の速やかな報告により、被害拡大を防止する措置を講じることができます。",
        actionType: "insertion",
        recommendedSeverity: "medium",
      },
    ],
  },
  {
    ruleGroupId: "rg-12",
    name: "是正措置",
    rules: [
      {
        ruleId: 17,
        ruleSummary: "秘密情報漏えい時に、被害拡大を防止する対応処置をとる義務を、追加しませんか？",
        examples: [
          { fragment: "受領者は、秘密情報の漏えいが発生した場合、", highlight: false },
          { fragment: "被害拡大を防止するために必要な措置を講じる", highlight: true },
          { fragment: "ものとする。", highlight: false },
        ],
        note: "是正措置義務を定めることで、漏洩時の迅速な対応を確保できます。",
        actionType: "insertion",
        recommendedSeverity: "medium",
      },
    ],
  },
  {
    ruleGroupId: "rg-13",
    name: "管理状況の調査",
    rules: [
      {
        ruleId: 18,
        ruleSummary: "秘密情報の管理状況を調査できる旨を、追加しませんか？",
        examples: [
          { fragment: "開示者は、受領者に対し、", highlight: false },
          { fragment: "秘密情報の管理状況について報告を求め、または調査を行う", highlight: true },
          { fragment: "ことができる。", highlight: false },
        ],
        note: "調査権を定めることで、情報管理の実効性を監視できます。",
        actionType: "insertion",
        recommendedSeverity: "medium",
      },
    ],
  },
  {
    ruleGroupId: "rg-14",
    name: "秘密情報の複製",
    rules: [
      {
        ruleId: 19,
        ruleSummary: "開示者の承諾なく、秘密情報を複製することを禁止する旨を、追加しませんか？",
        examples: [
          { fragment: "受領者は、", highlight: false },
          { fragment: "開示者の事前の書面による承諾なく", highlight: true },
          { fragment: "、秘密情報を複製してはならない。", highlight: false },
        ],
        note: "無断複製の禁止により、情報の拡散リスクを低減できます。",
        actionType: "insertion",
        recommendedSeverity: "medium",
      },
      {
        ruleId: 20,
        ruleSummary: "開示者の承諾を要することなく、秘密情報を複製できる旨を、修正しませんか？",
        examples: [
          { fragment: "受領者は、", highlight: false },
          { fragment: "本契約の目的の範囲内で秘密情報を複製できる", highlight: true },
          { fragment: "。", highlight: false },
        ],
        note: "無制限の複製許可は、情報管理上のリスクとなります。",
        guidance: "複製の可否または条件を明確にすることを検討してください。",
        actionType: "revision",
        recommendedSeverity: "medium",
      },
    ],
  },
  {
    ruleGroupId: "rg-15",
    name: "秘密情報の複製物の取扱い",
    rules: [
      {
        ruleId: 21,
        ruleSummary: "複製した情報も秘密情報に含まれる旨を、追加しませんか？",
        examples: [
          { fragment: "秘密情報には、", highlight: false },
          { fragment: "秘密情報の複製物、要約、抜粋", highlight: true },
          { fragment: "を含むものとする。", highlight: false },
        ],
        note: "複製物も秘密情報として扱うことで、派生情報も保護対象に含めることができます。",
        actionType: "insertion",
        recommendedSeverity: "low",
      },
    ],
  },
  {
    ruleGroupId: "rg-16",
    name: "秘密情報の返還・破棄",
    rules: [
      {
        ruleId: 22,
        ruleSummary: "秘密情報を返還・破棄する義務を、追加しませんか？",
        examples: [
          { fragment: "受領者は、開示者の要求があった場合、", highlight: false },
          { fragment: "秘密情報およびその複製物を返還または破棄する", highlight: true },
          { fragment: "ものとする。", highlight: false },
        ],
        note: "返還・破棄義務を定めることで、契約終了後の情報管理を確保できます。",
        actionType: "insertion",
        recommendedSeverity: "medium",
      },
      {
        ruleId: 23,
        ruleSummary: "「契約が終了したとき」に秘密情報を返還・破棄する旨を、追加しませんか？",
        examples: [
          { fragment: "受領者は、", highlight: false },
          { fragment: "本契約が終了したとき", highlight: true },
          { fragment: "、秘密情報を返還または破棄するものとする。", highlight: false },
        ],
        note: "契約終了時の返還・破棄義務を明確にすることで、情報の継続的な管理リスクを軽減できます。",
        actionType: "addition",
        recommendedSeverity: "medium",
      },
      {
        ruleId: 24,
        ruleSummary: "「開示者が要求したとき」に秘密情報を返還・破棄する旨を、追加しませんか？",
        examples: [
          { fragment: "受領者は、", highlight: false },
          { fragment: "開示者が要求したとき", highlight: true },
          { fragment: "、秘密情報を返還または破棄するものとする。", highlight: false },
        ],
        note: "開示者の要求による返還・破棄権を確保することで、必要に応じた情報回収が可能になります。",
        actionType: "addition",
        recommendedSeverity: "medium",
      },
      {
        ruleId: 25,
        ruleSummary: "秘密情報を破棄したことの証明書の発行義務を、追加しませんか？",
        examples: [
          { fragment: "受領者は、秘密情報を破棄した場合、", highlight: false },
          { fragment: "破棄したことを証する書面を開示者に提出する", highlight: true },
          { fragment: "ものとする。", highlight: false },
        ],
        note: "破棄証明書の発行義務を定めることで、破棄の確実な履行を担保できます。",
        actionType: "addition",
        recommendedSeverity: "medium",
      },
    ],
  },
  {
    ruleGroupId: "rg-17",
    name: "法令上守秘義務を負わない者への開示",
    rules: [
      {
        ruleId: 26,
        ruleSummary: "「秘密情報を開示した第三者に、受領者と同等の義務を負わせる」旨を、追加しませんか？",
        examples: [
          { fragment: "受領者が第三者に秘密情報を開示する場合、", highlight: false },
          { fragment: "当該第三者に本契約と同等の秘密保持義務を負わせる", highlight: true },
          { fragment: "ものとする。", highlight: false },
        ],
        note: "第三者への秘密保持義務の承継を求めることで、情報の保護範囲を維持できます。",
        actionType: "addition",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
      {
        ruleId: 27,
        ruleSummary: "「秘密情報を開示した第三者の行為について、受領者が一切の責任を負う」旨を、追加しませんか？",
        examples: [
          { fragment: "受領者は、", highlight: false },
          { fragment: "秘密情報を開示した第三者の行為について一切の責任を負う", highlight: true },
          { fragment: "ものとする。", highlight: false },
        ],
        note: "第三者の行為についての責任を受領者に負わせることで、開示者の保護を強化できます。",
        actionType: "addition",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
    ],
  },
  {
    ruleGroupId: "rg-18",
    name: "表明保証",
    rules: [
      {
        ruleId: 28,
        ruleSummary: "第三者の権利を侵害しないことの不保証を、追加しませんか？",
        examples: [
          { fragment: "開示者は、秘密情報が", highlight: false },
          { fragment: "第三者の権利を侵害しないことを保証しない", highlight: true },
          { fragment: "。", highlight: false },
        ],
        note: "不保証条項を定めることで、開示者の表明保証責任を限定できます。",
        actionType: "insertion",
        recommendedSeverity: "low",
      },
      {
        ruleId: 29,
        ruleSummary: "「秘密情報が、第三者の権利を侵害しない」ことを保証する旨を、修正しませんか？",
        examples: [
          { fragment: "開示者は、秘密情報が", highlight: false },
          { fragment: "第三者の知的財産権その他の権利を侵害しない", highlight: true },
          { fragment: "ことを保証する。", highlight: false },
        ],
        note: "広範な保証は開示者に過大なリスクを負わせる可能性があります。",
        guidance: "保証の範囲を限定するか、不保証条項への修正を検討してください。",
        actionType: "revision",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
    ],
  },
  {
    ruleGroupId: "rg-19",
    name: "正当性の保証",
    rules: [
      {
        ruleId: 30,
        ruleSummary: "「秘密情報を開示する正当な権限を有する」ことを保証する旨を、削除・修正しませんか？",
        examples: [
          { fragment: "開示者は、", highlight: false },
          { fragment: "秘密情報を開示する正当な権限を有する", highlight: true },
          { fragment: "ことを保証する。", highlight: false },
        ],
        note: "開示権限の保証は、第三者の権利との関係で問題となる可能性があります。",
        guidance: "知る限りにおいて保証する形への修正を検討してください。",
        actionType: "deletionOrRevision",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
    ],
  },
  {
    ruleGroupId: "rg-20",
    name: "正確性の保証",
    rules: [
      {
        ruleId: 31,
        ruleSummary: "秘密情報の正確性を保証しない旨を、追加しませんか？",
        examples: [
          { fragment: "開示者は、秘密情報の", highlight: false },
          { fragment: "正確性、完全性、有用性を保証しない", highlight: true },
          { fragment: "。", highlight: false },
        ],
        note: "正確性の不保証条項を定めることで、情報提供に関する責任を限定できます。",
        actionType: "insertion",
        recommendedSeverity: "low",
      },
      {
        ruleId: 32,
        ruleSummary: "秘密情報が「正確である」ことを保証する旨を、削除・修正しませんか？",
        examples: [
          { fragment: "開示者は、秘密情報が", highlight: false },
          { fragment: "正確かつ完全である", highlight: true },
          { fragment: "ことを保証する。", highlight: false },
        ],
        note: "正確性の保証は、情報の誤りについて開示者が責任を負うリスクがあります。",
        guidance: "不保証条項への修正を検討してください。",
        actionType: "deletionOrRevision",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
    ],
  },
  {
    ruleGroupId: "rg-21",
    name: "権利の不譲渡",
    rules: [
      {
        ruleId: 33,
        ruleSummary: "秘密情報に関する権利が受領者に移転しない旨を、追加しませんか？",
        examples: [
          { fragment: "本契約に基づく秘密情報の開示は、", highlight: false },
          { fragment: "秘密情報に関するいかなる権利も受領者に移転するものではない", highlight: true },
          { fragment: "。", highlight: false },
        ],
        note: "権利不移転条項を定めることで、秘密情報に関する権利の帰属を明確にできます。",
        actionType: "insertion",
        recommendedSeverity: "low",
      },
    ],
  },
  {
    ruleGroupId: "rg-22",
    name: "知的財産権の帰属",
    rules: [
      {
        ruleId: 34,
        ruleSummary:
          "【成果の帰属について定める場合】秘密情報に基づく発明・創作などが生じた場合の権利帰属を、追加しませんか？",
        examples: [
          { fragment: "秘密情報に基づき発明、考案、創作等が生じた場合、", highlight: false },
          { fragment: "当該権利は開示者に帰属する", highlight: true },
          { fragment: "ものとする。", highlight: false },
        ],
        note: "秘密情報に基づく成果物の権利帰属を明確にすることで、紛争を予防できます。",
        actionType: "insertion",
        recommendedSeverity: "medium",
      },
      {
        ruleId: 35,
        ruleSummary: "「受領者が秘密情報を用いて発明・創作等を行ったとき、開示者に通知する」旨を、追加しませんか？",
        examples: [
          { fragment: "受領者は、秘密情報を用いて発明・創作等を行ったとき、", highlight: false },
          { fragment: "速やかに開示者に通知する", highlight: true },
          { fragment: "ものとする。", highlight: false },
        ],
        note: "通知義務を定めることで、成果物の発生を把握し、権利帰属の協議を行うことができます。",
        actionType: "addition",
        recommendedSeverity: "medium",
      },
      {
        ruleId: 36,
        ruleSummary: "秘密情報から生じた発明・創作などの権利が、受領者に帰属する旨を、修正しませんか？",
        examples: [
          { fragment: "秘密情報に基づく発明等の権利は、", highlight: false },
          { fragment: "受領者に帰属する", highlight: true },
          { fragment: "。", highlight: false },
        ],
        note: "受領者への権利帰属は、開示者にとって不利な条件となります。",
        guidance: "開示者への権利帰属または共同帰属への修正を検討してください。",
        actionType: "revision",
        recommendedSeverity: "medium",
      },
    ],
  },
  {
    ruleGroupId: "rg-23",
    name: "損害賠償",
    rules: [
      {
        ruleId: 37,
        ruleSummary: "損害賠償に関する規定を、追加しませんか？",
        examples: [
          { fragment: "本契約に違反した当事者は、", highlight: false },
          { fragment: "相手方に生じた損害を賠償する", highlight: true },
          { fragment: "ものとする。", highlight: false },
        ],
        note: "損害賠償条項は、契約違反に対する救済手段として重要です。",
        actionType: "insertion",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
      {
        ruleId: 38,
        ruleSummary: "受領者のみが損害賠償請求できる旨を、修正しませんか？",
        examples: [
          { fragment: "開示者は、受領者に生じた損害を賠償する。ただし、", highlight: false },
          { fragment: "受領者は開示者に損害賠償請求できない", highlight: true },
          { fragment: "。", highlight: false },
        ],
        note: "一方的な損害賠償条項は、相手方に不公平な条件となります。",
        guidance: "双方向の損害賠償条項への修正を検討してください。",
        actionType: "revision",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
      {
        ruleId: 39,
        ruleSummary: "「受領者は、自らの帰責性の有無を問わず、開示者が被った損害を賠償する」旨を、追加しませんか？",
        examples: [
          { fragment: "受領者は、", highlight: false },
          { fragment: "自らの帰責性の有無を問わず", highlight: true },
          { fragment: "、開示者が被った損害を賠償する。", highlight: false },
        ],
        note: "無過失責任を定めることで、開示者の保護を強化できます。",
        actionType: "addition",
        recommendedSeverity: "medium",
      },
      {
        ruleId: 40,
        ruleSummary: "賠償の範囲に、「特別損害・逸失利益を含む間接損害・弁護士費用」を、追加しませんか？",
        examples: [
          { fragment: "損害賠償の範囲には、", highlight: false },
          { fragment: "特別損害、逸失利益、間接損害および弁護士費用", highlight: true },
          { fragment: "を含むものとする。", highlight: false },
        ],
        note: "賠償範囲を広く定めることで、開示者の保護を強化できます。",
        actionType: "addition",
        recommendedSeverity: "medium",
      },
      {
        ruleId: 41,
        ruleSummary: "賠償の範囲に、「逸失利益」を、追加しませんか？",
        examples: [
          { fragment: "損害賠償の範囲には、", highlight: false },
          { fragment: "逸失利益", highlight: true },
          { fragment: "を含むものとする。", highlight: false },
        ],
        note: "逸失利益を賠償範囲に含めることで、機会損失の補償を確保できます。",
        actionType: "addition",
        recommendedSeverity: "medium",
      },
      {
        ruleId: 42,
        ruleSummary: "賠償の範囲に、「間接損害」を、追加しませんか？",
        examples: [
          { fragment: "損害賠償の範囲には、", highlight: false },
          { fragment: "間接損害", highlight: true },
          { fragment: "を含むものとする。", highlight: false },
        ],
        note: "間接損害を賠償範囲に含めることで、波及的な損害の補償を確保できます。",
        actionType: "addition",
        recommendedSeverity: "low",
      },
      {
        ruleId: 43,
        ruleSummary: "賠償の範囲に、「特別損害」を、追加しませんか？",
        examples: [
          { fragment: "損害賠償の範囲には、", highlight: false },
          { fragment: "特別損害", highlight: true },
          { fragment: "を含むものとする。", highlight: false },
        ],
        note: "特別損害を賠償範囲に含めることで、予見可能な特別の事情による損害も補償対象となります。",
        actionType: "addition",
        recommendedSeverity: "medium",
      },
      {
        ruleId: 44,
        ruleSummary: "賠償の範囲に、「弁護士費用」を、追加しませんか？",
        examples: [
          { fragment: "損害賠償の範囲には、", highlight: false },
          { fragment: "合理的な弁護士費用", highlight: true },
          { fragment: "を含むものとする。", highlight: false },
        ],
        note: "弁護士費用を賠償範囲に含めることで、訴訟費用の補償を確保できます。",
        actionType: "addition",
        recommendedSeverity: "medium",
      },
      {
        ruleId: 45,
        ruleSummary: "損害賠償の上限を、削除・修正しませんか？",
        examples: [
          { fragment: "損害賠償額の上限は、", highlight: false },
          { fragment: "本契約に基づき支払われた金額を上限とする", highlight: true },
          { fragment: "。", highlight: false },
        ],
        note: "損害賠償の上限設定は、開示者の十分な救済を妨げる可能性があります。",
        guidance: "上限の引き上げまたは削除を検討してください。",
        actionType: "deletionOrRevision",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
      {
        ruleId: 46,
        ruleSummary: "受領者に「重過失」がある場合のみ、損害が賠償される旨を、削除しませんか？",
        examples: [
          { fragment: "受領者は、", highlight: false },
          { fragment: "重大な過失がある場合に限り", highlight: true },
          { fragment: "損害を賠償する。", highlight: false },
        ],
        note: "重過失要件は、開示者の救済を著しく制限するため、削除を検討すべきです。",
        actionType: "deletion",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
    ],
  },
  {
    ruleGroupId: "rg-24",
    name: "第三者への損害賠償",
    rules: [
      {
        ruleId: 47,
        ruleSummary: "第三者に対する損害賠償義務を、追加しませんか？",
        examples: [
          { fragment: "受領者は、秘密情報の漏洩により", highlight: false },
          { fragment: "第三者に損害を与えた場合、開示者に代わり当該損害を賠償する", highlight: true },
          { fragment: "ものとする。", highlight: false },
        ],
        note: "第三者への損害賠償義務を定めることで、開示者の補償請求リスクを軽減できます。",
        actionType: "insertion",
        recommendedSeverity: "medium",
      },
    ],
  },
  {
    ruleGroupId: "rg-25",
    name: "差止請求",
    rules: [
      {
        ruleId: 48,
        ruleSummary: "秘密情報の使用の差止請求権を、追加しませんか？",
        examples: [
          { fragment: "開示者は、受領者による秘密情報の不正使用に対し、", highlight: false },
          { fragment: "差止めを請求する", highlight: true },
          { fragment: "ことができる。", highlight: false },
        ],
        note: "差止請求権を明記することで、不正使用に対する迅速な救済手段を確保できます。",
        actionType: "insertion",
        recommendedSeverity: "low",
      },
    ],
  },
  {
    ruleGroupId: "rg-26",
    name: "地位の譲渡禁止",
    rules: [
      {
        ruleId: 49,
        ruleSummary: "地位の譲渡禁止を、追加しませんか？",
        examples: [
          { fragment: "いずれの当事者も、相手方の事前の書面による承諾なく、", highlight: false },
          { fragment: "本契約上の地位を第三者に譲渡してはならない", highlight: true },
          { fragment: "。", highlight: false },
        ],
        note: "地位譲渡禁止条項により、契約当事者の変更を制限できます。",
        actionType: "insertion",
        recommendedSeverity: "low",
      },
      {
        ruleId: 50,
        ruleSummary: "自社が地位を譲渡できない旨を削除・修正しませんか？",
        examples: [
          { fragment: "受領者は、", highlight: false },
          { fragment: "本契約上の地位を譲渡することができない", highlight: true },
          { fragment: "。", highlight: false },
        ],
        note: "一方的な譲渡禁止は、事業再編等の際に支障となる可能性があります。",
        guidance: "双方向の譲渡禁止条項への修正を検討してください。",
        actionType: "deletionOrRevision",
        recommendedSeverity: "medium",
      },
    ],
  },
  {
    ruleGroupId: "rg-27",
    name: "契約期間",
    rules: [
      {
        ruleId: 51,
        ruleSummary: "契約の有効期間を、追加しませんか？",
        examples: [
          { fragment: "本契約の有効期間は、", highlight: false },
          { fragment: "締結日から1年間", highlight: true },
          { fragment: "とする。", highlight: false },
        ],
        note: "契約期間を明確に定めることで、権利義務の存続期間を確定できます。",
        actionType: "insertion",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
    ],
  },
  {
    ruleGroupId: "rg-28",
    name: "存続規定",
    rules: [
      {
        ruleId: 52,
        ruleSummary: "存続規定を、追加しませんか？",
        examples: [
          { fragment: "本契約終了後も、", highlight: false },
          { fragment: "秘密保持義務、損害賠償に関する条項は存続する", highlight: true },
          { fragment: "ものとする。", highlight: false },
        ],
        note: "存続規定により、契約終了後も重要な義務を継続させることができます。",
        actionType: "insertion",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
    ],
  },
  {
    ruleGroupId: "rg-29",
    name: "反社会的勢力の排除",
    rules: [
      {
        ruleId: 53,
        ruleSummary: "反社会的勢力の排除を、追加しませんか？",
        examples: [
          { fragment: "各当事者は、自らが", highlight: false },
          { fragment: "反社会的勢力に該当しないこと", highlight: true },
          { fragment: "を表明し保証する。", highlight: false },
        ],
        note: "反社会的勢力排除条項は、コンプライアンスの観点から必須の条項です。",
        actionType: "insertion",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
      {
        ruleId: 54,
        ruleSummary: "反社会的勢力の定義を、追加しませんか？",
        examples: [
          { fragment: "「反社会的勢力」とは、", highlight: false },
          { fragment: "暴力団、暴力団員、暴力団準構成員、暴力団関係企業", highlight: true },
          { fragment: "等をいう。", highlight: false },
        ],
        note: "反社会的勢力の定義を明確にすることで、該当性の判断基準を設けることができます。",
        actionType: "addition",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
      {
        ruleId: 55,
        ruleSummary: "相手方が、反社会的勢力ではない旨の確約を、追加しませんか？",
        examples: [
          { fragment: "各当事者は、", highlight: false },
          { fragment: "現在および将来にわたり反社会的勢力に該当しないことを確約する", highlight: true },
          { fragment: "。", highlight: false },
        ],
        note: "将来にわたる確約を得ることで、継続的な関係の安全性を確保できます。",
        actionType: "addition",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
      {
        ruleId: 56,
        ruleSummary: "従業員が反社会的勢力ではない旨の確約を、削除しませんか？",
        examples: [
          { fragment: "各当事者は、", highlight: false },
          { fragment: "自社の従業員が反社会的勢力に該当しない", highlight: true },
          { fragment: "ことを確約する。", highlight: false },
        ],
        note: "従業員の確約は調査が困難であり、過度な義務となる可能性があります。",
        guidance: "従業員に関する確約の削除または範囲の限定を検討してください。",
        actionType: "deletion",
        recommendedSeverity: "medium",
      },
      {
        ruleId: 57,
        ruleSummary: "「反社会的勢力の排除の規定に違反したとき、無催告で解除できる」旨を、追加しませんか？",
        examples: [
          { fragment: "相手方が反社会的勢力の排除規定に違反した場合、", highlight: false },
          { fragment: "何らの催告を要せず直ちに本契約を解除できる", highlight: true },
          { fragment: "。", highlight: false },
        ],
        note: "無催告解除権を定めることで、反社会的勢力との関係を速やかに断つことができます。",
        actionType: "addition",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
      {
        ruleId: 58,
        ruleSummary: "「無催告で解除できる」旨を、追加しませんか？",
        examples: [
          { fragment: "前項の解除は、", highlight: false },
          { fragment: "催告を要しない", highlight: true },
          { fragment: "ものとする。", highlight: false },
        ],
        note: "無催告解除を明記することで、迅速な契約解消を可能にします。",
        actionType: "addition",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
    ],
  },
  {
    ruleGroupId: "rg-30",
    name: "合意管轄",
    rules: [
      {
        ruleId: 59,
        ruleSummary: "専属的合意管轄裁判所を、追加しませんか？",
        examples: [
          { fragment: "本契約に関する紛争については、", highlight: false },
          { fragment: "東京地方裁判所を専属的合意管轄裁判所とする", highlight: true },
          { fragment: "。", highlight: false },
        ],
        note: "合意管轄条項により、紛争解決の場所を予め確定できます。",
        actionType: "insertion",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
    ],
  },
  {
    ruleGroupId: "rg-31",
    name: "準拠法",
    rules: [
      {
        ruleId: 60,
        ruleSummary: "準拠法を、追加しませんか？",
        examples: [
          { fragment: "本契約は、", highlight: false },
          { fragment: "日本法に準拠する", highlight: true },
          { fragment: "。", highlight: false },
        ],
        note: "準拠法条項により、契約の解釈および効力に適用される法律を明確にできます。",
        actionType: "insertion",
        recommendedSeverity: "low",
      },
      {
        ruleId: 61,
        ruleSummary: "「日本法」ではない準拠法を、修正しませんか？",
        examples: [
          { fragment: "本契約は、", highlight: false },
          { fragment: "シンガポール法", highlight: true },
          { fragment: "に準拠する。", highlight: false },
        ],
        note: "外国法が準拠法となる場合、法的リスクの評価が困難になる可能性があります。",
        guidance: "日本法への変更を検討してください。",
        actionType: "revision",
        tenantSeverity: "high",
        recommendedSeverity: "high",
      },
    ],
  },
  {
    ruleGroupId: "rg-32",
    name: "誠実協議",
    rules: [
      {
        ruleId: 62,
        ruleSummary: "誠実協議を、追加しませんか？",
        examples: [
          { fragment: "本契約に定めのない事項または疑義が生じた場合、", highlight: false },
          { fragment: "両当事者は誠実に協議の上解決する", highlight: true },
          { fragment: "ものとする。", highlight: false },
        ],
        note: "誠実協議条項により、紛争の円満な解決を促進できます。",
        actionType: "insertion",
        recommendedSeverity: "low",
      },
    ],
  },
];

export const MOCK_LANGUAGES = [
  { value: "ja", label: "日本語" },
  { value: "en", label: "English" },
] satisfies FilterOption[];

export const MOCK_CATEGORIES = [
  { value: "nda", label: "秘密保持契約" },
  { value: "license", label: "ライセンス契約" },
  { value: "service", label: "サービス契約" },
  { value: "employment", label: "雇用契約" },
] satisfies FilterOption[];

export const MOCK_POSITIONS = [
  { value: "discloser", label: "開示者" },
  { value: "recipient", label: "受領者" },
  { value: "both", label: "双方" },
] satisfies FilterOption[];

export const MOCK_GOVERNING_LAWS = [
  { value: "japan", label: "日本法" },
  { value: "us", label: "米国法" },
  { value: "uk", label: "英国法" },
] satisfies FilterOption[];

export const SEVERITY_OPTIONS = [
  { value: "high", label: "高" },
  { value: "medium", label: "中" },
  { value: "low", label: "低" },
] satisfies FilterOption[];

export const SEVERITY_LABEL_MAP = {
  high: "高",
  medium: "中",
  low: "低",
} satisfies Record<Severity, string>;

export const ACTION_TYPE_LABEL_MAP = {
  insertion: "抜け落ち",
  addition: "追加",
  deletion: "削除",
  revision: "修正",
  deletionOrAddition: "削除/追加",
  deletionOrRevision: "削除/修正",
  additionOrRevision: "追加/修正",
  caution: "注意点",
} satisfies Record<RuleActionType, string>;
