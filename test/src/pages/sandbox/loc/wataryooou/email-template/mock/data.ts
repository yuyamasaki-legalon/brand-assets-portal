export type EmailTemplateCategory = "contract" | "consultation" | "notification" | "reminder" | "other";

export type EmailTemplate = {
  id: string;
  title: string;
  category: EmailTemplateCategory;
  subject: string;
  body: string;
  updatedAt: string;
  createdBy: string;
};

export const categoryLabels: Record<EmailTemplateCategory, string> = {
  contract: "契約関連",
  consultation: "法務相談",
  notification: "通知",
  reminder: "リマインド",
  other: "その他",
};

export const categoryColors: Record<EmailTemplateCategory, "blue" | "teal" | "yellow" | "orange" | "neutral"> = {
  contract: "blue",
  consultation: "teal",
  notification: "yellow",
  reminder: "orange",
  other: "neutral",
};

export const mockTemplates: EmailTemplate[] = [
  {
    id: "TPL-001",
    title: "契約書レビュー完了通知",
    category: "contract",
    subject: "【法務部】契約書レビュー完了のご連絡",
    body: "お疲れ様です。法務部の{{担当者名}}です。\n\nご依頼いただいておりました下記契約書のレビューが完了いたしましたのでご連絡いたします。\n\n案件番号：{{案件番号}}\n契約書名：{{契約書名}}\n\nレビュー結果をご確認のうえ、ご不明点等がございましたらお気軽にお問い合わせください。\n\nよろしくお願いいたします。",
    updatedAt: "2025/01/15",
    createdBy: "山田 太郎",
  },
  {
    id: "TPL-002",
    title: "契約書修正依頼",
    category: "contract",
    subject: "【法務部】契約書の修正についてのお願い",
    body: "お疲れ様です。法務部の{{担当者名}}です。\n\nご提出いただきました下記契約書について、修正をお願いしたい箇所がございます。\n\n案件番号：{{案件番号}}\n契約書名：{{契約書名}}\n\n■ 修正箇所\n{{修正箇所の詳細}}\n\n修正後、再度ご提出いただけますようお願いいたします。\nご質問がございましたら、お気軽にご連絡ください。\n\nよろしくお願いいたします。",
    updatedAt: "2025/01/14",
    createdBy: "山田 太郎",
  },
  {
    id: "TPL-003",
    title: "NDA締結依頼",
    category: "contract",
    subject: "【法務部】秘密保持契約書（NDA）の締結について",
    body: "お疲れ様です。法務部の{{担当者名}}です。\n\n{{相手方企業名}}様との取引開始にあたり、秘密保持契約書（NDA）の締結が必要となります。\n\n下記の内容をご確認いただき、問題がなければ署名をお願いいたします。\n\n■ 契約概要\n・契約当事者：当社 / {{相手方企業名}}\n・秘密保持期間：{{期間}}\n・対象情報：{{対象情報の範囲}}\n\n締結期限：{{期限日}}\n\nご不明点がございましたら、お気軽にお問い合わせください。\n\nよろしくお願いいたします。",
    updatedAt: "2025/01/10",
    createdBy: "佐藤 花子",
  },
  {
    id: "TPL-004",
    title: "法務相談受付確認",
    category: "consultation",
    subject: "【法務部】法務相談の受付確認",
    body: "お疲れ様です。法務部の{{担当者名}}です。\n\nご相談いただきありがとうございます。下記の内容で受け付けいたしました。\n\n案件番号：{{案件番号}}\n相談内容：{{相談概要}}\n担当者：{{担当者名}}\n\n回答予定日：{{回答予定日}}\n\n内容を確認のうえ、回答させていただきます。\n追加情報が必要な場合は、別途ご連絡いたします。\n\nよろしくお願いいたします。",
    updatedAt: "2025/01/08",
    createdBy: "佐藤 花子",
  },
  {
    id: "TPL-005",
    title: "法務相談回答",
    category: "consultation",
    subject: "【法務部】法務相談への回答",
    body: "お疲れ様です。法務部の{{担当者名}}です。\n\nご相談いただいた件について回答いたします。\n\n案件番号：{{案件番号}}\n\n■ 回答内容\n{{回答内容}}\n\n■ 留意事項\n{{留意事項}}\n\n上記内容についてご不明点がございましたら、お気軽にお問い合わせください。\n\nよろしくお願いいたします。",
    updatedAt: "2025/01/05",
    createdBy: "鈴木 一郎",
  },
  {
    id: "TPL-006",
    title: "案件ステータス変更通知",
    category: "notification",
    subject: "【法務部】案件ステータス変更のお知らせ",
    body: "お疲れ様です。法務部の{{担当者名}}です。\n\n下記案件のステータスが変更されましたのでお知らせいたします。\n\n案件番号：{{案件番号}}\n案件名：{{案件名}}\n変更前ステータス：{{変更前ステータス}}\n変更後ステータス：{{変更後ステータス}}\n\n詳細はマターマネジメントシステムよりご確認ください。\n\nよろしくお願いいたします。",
    updatedAt: "2025/01/03",
    createdBy: "鈴木 一郎",
  },
  {
    id: "TPL-007",
    title: "契約更新通知",
    category: "notification",
    subject: "【法務部】契約更新時期のお知らせ",
    body: "お疲れ様です。法務部の{{担当者名}}です。\n\n下記契約の更新時期が近づいておりますのでお知らせいたします。\n\n■ 契約情報\n・契約書名：{{契約書名}}\n・相手方：{{相手方企業名}}\n・現契約期間：{{契約開始日}} ～ {{契約終了日}}\n・自動更新：{{自動更新の有無}}\n\n更新・解約の判断が必要な場合は、{{対応期限日}}までにご連絡ください。\n\nよろしくお願いいたします。",
    updatedAt: "2024/12/28",
    createdBy: "田中 美咲",
  },
  {
    id: "TPL-008",
    title: "納期リマインド（3日前）",
    category: "reminder",
    subject: "【法務部】案件納期のリマインド（3日前）",
    body: "お疲れ様です。法務部の{{担当者名}}です。\n\n下記案件の納期が3日後に迫っておりますので、リマインドいたします。\n\n案件番号：{{案件番号}}\n案件名：{{案件名}}\n納期：{{納期日}}\n\n対応状況をご確認いただき、期限内の完了にご協力をお願いいたします。\n延長が必要な場合は、早めにご相談ください。\n\nよろしくお願いいたします。",
    updatedAt: "2024/12/25",
    createdBy: "田中 美咲",
  },
  {
    id: "TPL-009",
    title: "納期超過通知",
    category: "reminder",
    subject: "【法務部】案件納期超過のお知らせ",
    body: "お疲れ様です。法務部の{{担当者名}}です。\n\n下記案件が納期を超過しておりますので、ご確認をお願いいたします。\n\n案件番号：{{案件番号}}\n案件名：{{案件名}}\n納期：{{納期日}}（{{超過日数}}日超過）\n\n至急、対応状況のご確認と完了見込み日のご連絡をお願いいたします。\n\nよろしくお願いいたします。",
    updatedAt: "2024/12/20",
    createdBy: "高橋 健太",
  },
  {
    id: "TPL-010",
    title: "社外向け契約書送付",
    category: "other",
    subject: "契約書の送付について",
    body: "{{相手方担当者名}} 様\n\nいつもお世話になっております。\n{{自社名}}の{{担当者名}}でございます。\n\n先日お打ち合わせさせていただきました件につきまして、契約書を送付いたします。\n\n■ 契約書名：{{契約書名}}\n■ 部数：{{部数}}\n■ ご返送期限：{{返送期限日}}\n\n内容をご確認いただき、問題がなければ署名・捺印のうえご返送くださいますようお願いいたします。\n\nご不明点等がございましたら、お気軽にお問い合わせください。\n\n何卒よろしくお願い申し上げます。",
    updatedAt: "2024/12/18",
    createdBy: "高橋 健太",
  },
];
