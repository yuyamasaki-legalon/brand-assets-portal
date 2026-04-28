import {
  LfAngleDownMiddle,
  LfAngleLeftMiddle,
  LfAngleRightMiddle,
  LfAngleUpMiddle,
  LfArchive,
  LfArrowsRotate,
  LfArrowUpRightFromSquare,
  LfAt,
  LfBarSparkles,
  LfBook,
  LfClip,
  LfCloseLarge,
  LfComment,
  LfEllipsisDot,
  LfFile,
  LfFileLines,
  LfFilter,
  LfInformationCircle,
  LfList,
  LfMagnifyingGlass,
  LfMail,
  LfMenu,
  LfPen,
  LfPlusLarge,
  LfQuestionCircle,
  LfScaleBalanced,
  LfTrash,
  LfWand,
} from "@legalforce/aegis-icons";
import { SlackLogo } from "@legalforce/aegis-logos/react";
import {
  ActionList,
  Avatar,
  Banner,
  BottomSheet,
  Button,
  ButtonGroup,
  Checkbox,
  ContentHeader,
  DateField,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Divider,
  EmptyState,
  Form,
  FormControl,
  Header,
  Icon,
  IconButton,
  Link,
  Logo,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  PageLayoutSidebar,
  PageLayoutStickyContainer,
  Popover,
  Radio,
  RadioGroup,
  Select,
  SideNavigation,
  Tab,
  Tag,
  TagPicker,
  Text,
  Textarea,
  TextField,
  Tooltip,
} from "@legalforce/aegis-react";
import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { useLocale } from "../../../../../hooks/useLocale";
import { type TranslationDictionary, useTranslation } from "../../../../../hooks/useTranslation";

// Microsoft Teamsアイコンコンポーネント
const MicrosoftTeamsIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    viewBox="-0.12979372698077785 0 32.42343730730004 32"
    width={size}
    height={size}
    role="img"
    aria-label="Microsoft Teams"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Microsoft Teams</title>
    <circle cx="17" cy="6" fill="#7b83eb" r="4.667" />
    <path
      d="M16.667 7H12.44l.021.093.002.008.022.086A4.671 4.671 0 0 0 18 10.559V8.333A1.337 1.337 0 0 0 16.667 7z"
      opacity=".1"
    />
    <path d="M15.667 8h-2.884A4.667 4.667 0 0 0 17 10.667V9.333A1.337 1.337 0 0 0 15.667 8z" opacity=".2" />
    <circle cx="27.5" cy="7.5" fill="#5059c9" r="3.5" />
    <path
      d="M30.5 12h-7.861a.64.64 0 0 0-.64.64v8.11a5.121 5.121 0 0 0 3.967 5.084A5.006 5.006 0 0 0 32 20.938V13.5a1.5 1.5 0 0 0-1.5-1.5z"
      fill="#5059c9"
    />
    <path
      d="M25 13.5V23a7.995 7.995 0 0 1-14.92 4 7.173 7.173 0 0 1-.5-1 8.367 8.367 0 0 1-.33-1A8.24 8.24 0 0 1 9 23v-9.5a1.498 1.498 0 0 1 1.5-1.5h13a1.498 1.498 0 0 1 1.5 1.5z"
      fill="#7b83eb"
    />
    <path d="M15.667 8h-2.884A4.667 4.667 0 0 0 17 10.667V9.333A1.337 1.337 0 0 0 15.667 8z" opacity=".2" />
    <path
      d="M18 12v12.67a1.32 1.32 0 0 1-1.04 1.29.966.966 0 0 1-.29.04H9.58a8.367 8.367 0 0 1-.33-1A8.24 8.24 0 0 1 9 23v-9.5a1.498 1.498 0 0 1 1.5-1.5z"
      opacity=".1"
    />
    <path
      d="M17 12v13.67a.967.967 0 0 1-.04.29A1.32 1.32 0 0 1 15.67 27h-5.59a7.173 7.173 0 0 1-.5-1 8.367 8.367 0 0 1-.33-1A8.24 8.24 0 0 1 9 23v-9.5a1.498 1.498 0 0 1 1.5-1.5z"
      opacity=".2"
    />
    <path
      d="M17 12v11.67A1.336 1.336 0 0 1 15.67 25H9.25A8.24 8.24 0 0 1 9 23v-9.5a1.498 1.498 0 0 1 1.5-1.5z"
      opacity=".2"
    />
    <path
      d="M10.5 12A1.498 1.498 0 0 0 9 13.5V23a8.24 8.24 0 0 0 .25 2h5.42A1.336 1.336 0 0 0 16 23.67V12z"
      opacity=".2"
    />
    <path
      d="M1.333 8h13.334A1.333 1.333 0 0 1 16 9.333v13.334A1.333 1.333 0 0 1 14.667 24H1.333A1.333 1.333 0 0 1 0 22.667V9.333A1.333 1.333 0 0 1 1.333 8z"
      fill="#4b53bc"
    />
    <path d="M11.98 12.975H8.99v8.02H7.028v-8.02H4.02v-1.97h7.96z" fill="#fff" />
    <path d="M0 0h32v32H0z" fill="none" />
  </svg>
);

// メールアドレス（送信元・宛先用）
const emailAddressOptions = [
  {
    label: "juna.kondo <legal.request@case-m.example.com>",
    value: "juna.kondo <legal.request@case-m.example.com>",
  },
  { label: "legal@example.com", value: "legal@example.com" },
  { label: "sales@example.com", value: "sales@example.com" },
  { label: "support@example.com", value: "support@example.com" },
];

type TabType = "all" | "public" | "private";
type MessageViewType = "messages" | "threads";
type MessageType = "lo-message" | "slack" | "teams" | "mail" | "active-history";
type PaneType = "case-attribute" | "case-summary" | "linked-file" | "linked-case" | "reference" | "book";

interface Comment {
  id: string;
  type: MessageType;
  user: string;
  date: string;
  content: string;
  visibility: "public" | "private";
  subject?: string;
  channel?: string;
  threadId?: string;
  parentId?: string;
  hasAttachment?: boolean;
}

const getCaseData = (locale: "ja-JP" | "en-US") => {
  if (locale === "en-US") {
    return {
      id: "2022-06-0012",
      title: "Legal Review Request for Advertising Expression",
      requestContent:
        'Hello,\nI would like to request a legal review of the following catchphrase for our new service advertisement.\n\n【Catchphrase】\n"Double your sales just by doing ○○!"\n\nCould you please check if there are any issues with exaggerated expressions?\nI apologize for the urgency, but it would be very helpful if you could confirm by tomorrow at ○○ o\'clock.',
      requesterEmail: "user01+work_management@example.com",
    };
  }
  return {
    id: "2022-06-0012",
    title: "広告表現の法務確認依頼",
    requestContent:
      "お疲れ様です。\n新サービスの広告掲載にあたり、以下キャッチコピーについて法務確認をお願いしたくご相談です。\n\n【キャッチコピー案】\n「○○するだけで売上2倍!」\n\n誇大表現等、問題がないかご確認いただけますでしょうか。\n急ぎで恐縮ですが、明日○時までに確認いただけますと大変助かります。",
    requesterEmail: "user01+work_management@example.com",
  };
};

const getComments = (locale: "ja-JP" | "en-US"): Comment[] => {
  if (locale === "en-US") {
    return [
      // 【Mail thread】Legal staff (Okumura) consulting with external lawyer (Tsunoda) about double-checking and details (Private)
      {
        id: "mail-1",
        type: "mail",
        user: "Okumura",
        date: "2023/07/07 10:00",
        content:
          "Hello Tsunoda-san. I am contacting you regarding this case to request a double-check and consultation on details. Regarding the interpretation of the contract, I would appreciate your opinion on Article 3, the automatic renewal clause.",
        visibility: "private",
        subject: "Consultation on Double-Checking Contract Review",
        threadId: "thread-mail-consultation",
        hasAttachment: true,
      },
      {
        id: "mail-2",
        type: "mail",
        user: "Tsunoda",
        date: "2023/07/07 14:30",
        content:
          "Hello Okumura-san. I understand your inquiry. Regarding Article 3, the automatic renewal clause, written notice is required 30 days before the contract period expires. Please refer to the attached materials for details.",
        visibility: "private",
        subject: "Re: Consultation on Double-Checking Contract Review",
        threadId: "thread-mail-consultation",
        parentId: "mail-1",
        hasAttachment: true,
      },
      {
        id: "mail-3",
        type: "mail",
        user: "Okumura",
        date: "2023/07/07 16:00",
        content:
          "Thank you for your response, Tsunoda-san. I understand that 30 days' notice is required. I would also like to consult with you about creating the notice.",
        visibility: "private",
        subject: "Re: Consultation on Double-Checking Contract Review",
        threadId: "thread-mail-consultation",
        parentId: "mail-2",
        hasAttachment: false,
      },
      {
        id: "mail-4",
        type: "mail",
        user: "Tsunoda",
        date: "2023/07/07 17:00",
        content:
          "Hello Okumura-san. I understand about creating the notice. I will attach a template, so please review it. Please feel free to modify it as needed.",
        visibility: "private",
        subject: "Re: Consultation on Double-Checking Contract Review",
        threadId: "thread-mail-consultation",
        parentId: "mail-3",
        hasAttachment: true,
      },
      // 【Mail thread】Email with Tsunoda-san (3 months later)
      {
        id: "mail-5",
        type: "mail",
        user: "Okumura",
        date: "2023/10/07 10:00",
        content:
          "Hello Tsunoda-san. Three months have passed since our last consultation. I am contacting you again to consult about contract renewal.",
        visibility: "public",
        subject: "Consultation on Contract Renewal",
        threadId: "thread-mail-kakuda-3months",
        hasAttachment: false,
      },
      {
        id: "mail-6",
        type: "mail",
        user: "Tsunoda",
        date: "2023/10/07 14:30",
        content:
          "Hello Okumura-san. Thank you for contacting me. Regarding contract renewal, I will prepare a new template based on our previous discussion.",
        visibility: "public",
        subject: "Re: Consultation on Contract Renewal",
        threadId: "thread-mail-kakuda-3months",
        parentId: "mail-5",
        hasAttachment: true,
      },
      // 【Mail thread】Email with Matsumura-san (second external lawyer)
      {
        id: "mail-7",
        type: "mail",
        user: "Okumura",
        date: "2023/07/15 09:00",
        content:
          "Hello Matsumura-san. I am Okumura, the legal staff at our company. I am contacting you to request your opinion on contract review.",
        visibility: "public",
        subject: "Consultation on Contract Review",
        threadId: "thread-mail-matsumura",
        hasAttachment: true,
      },
      {
        id: "mail-8",
        type: "mail",
        user: "Matsumura",
        date: "2023/07/15 15:00",
        content:
          "Hello Okumura-san. I understand your inquiry. I will review the contract and respond at a later date.",
        visibility: "public",
        subject: "Re: Consultation on Contract Review",
        threadId: "thread-mail-matsumura",
        parentId: "mail-7",
        hasAttachment: false,
      },
      // 【Slack thread】Sending to business division staff (Imano-san) that overall seems okay but review will take some time (oldest history)
      {
        id: "slack-0",
        type: "slack",
        user: "Okumura",
        date: "2023/07/07 09:00",
        content: "Hello Imano-san. Overall it seems okay, but the review will take some time.",
        visibility: "public",
        channel: "#legal-review",
        threadId: "thread-slack-review",
        hasAttachment: false,
      },
      {
        id: "slack-0-1",
        type: "slack",
        user: "Imano",
        date: "2023/07/07 09:15",
        content: "Understood, thank you.",
        visibility: "public",
        channel: "#legal-review",
        threadId: "thread-slack-review",
        parentId: "slack-0",
        hasAttachment: false,
      },
      // 【Slack thread】Sending to case owner (Imano-san) that overall summary is fine but need some time for review
      {
        id: "slack-1",
        type: "slack",
        user: "Okumura",
        date: "2023/07/07 11:00",
        content:
          "Hello Imano-san. I have determined that the overall summary of the case is fine. However, I would like some time for detailed review. I expect to be able to respond by next week.",
        visibility: "public",
        channel: "#legal-review",
        threadId: "thread-slack-review",
        hasAttachment: false,
      },
      {
        id: "slack-2",
        type: "slack",
        user: "Imano",
        date: "2023/07/07 11:15",
        content: "Hello Okumura-san. Understood. I understand it will be by next week. Thank you in advance.",
        visibility: "public",
        channel: "#legal-review",
        threadId: "thread-slack-review",
        parentId: "slack-1",
        hasAttachment: false,
      },
      {
        id: "slack-3",
        type: "slack",
        user: "Imano",
        date: "2023/07/07 11:20",
        content: "Understood. Thank you.",
        visibility: "public",
        channel: "#legal-review",
        threadId: "thread-slack-review",
        parentId: "slack-1",
        hasAttachment: false,
      },
      // 【Teams thread】Contacting business division (Nomura-san) to request confirmation for case sharing
      {
        id: "teams-1",
        type: "teams",
        user: "Okumura",
        date: "2023/07/07 13:00",
        content:
          "Hello Nomura-san. I would like to request your confirmation for case sharing. The contract review has been completed, so please review it.",
        visibility: "public",
        subject: "Regarding Case Sharing",
        threadId: "thread-teams-share",
        hasAttachment: false,
      },
      {
        id: "teams-2",
        type: "teams",
        user: "Nomura",
        date: "2023/07/07 13:30",
        content: "Hello Okumura-san. I will confirm. Thank you.",
        visibility: "public",
        subject: "Re: Regarding Case Sharing",
        threadId: "thread-teams-share",
        parentId: "teams-1",
        hasAttachment: false,
      },
      // 【LO message】Individual consultation with legal department reception (Amano-san) about contract period
      {
        id: "lo-1",
        type: "lo-message",
        user: "Okumura",
        date: "2023/07/07 09:30",
        content:
          "@Amano Hello. I have a quick question about the contract period. For contracts with automatic renewal clauses, how many days before the contract period expires is notice required?",
        visibility: "public",
        hasAttachment: false,
      },
      {
        id: "lo-2",
        type: "lo-message",
        user: "Amano",
        date: "2023/07/07 09:45",
        content:
          "@Okumura Hello. Generally, notice is required 30 days before the contract period expires, but this may vary depending on the contract terms. Could you please let me review the relevant contract?",
        visibility: "public",
        hasAttachment: false,
      },
      {
        id: "lo-3",
        type: "lo-message",
        user: "Okumura",
        date: "2023/07/07 10:00",
        content: "@Amano Thank you. I will review the contract and consult with an external lawyer if necessary.",
        visibility: "public",
        hasAttachment: false,
      },
      // System message
      {
        id: "system-1",
        type: "active-history",
        user: "System",
        date: "2023/07/05 09:00",
        content: 'Case status has been updated to "In progress".',
        visibility: "public",
        hasAttachment: false,
      },
    ];
  }
  return [
    // 【メールスレッド】法務担当者（奥村さん）が外部弁護士（角田さん）に案件の2重確認＆詳細に関する相談（非公開）
    {
      id: "mail-1",
      type: "mail",
      user: "奥村",
      date: "2023/07/07 10:00",
      content:
        "角田さん、お世話になっております。当案件について、2重確認と詳細に関する相談をさせていただきたく、ご連絡いたしました。契約書の解釈について、特に第3条の自動更新条項について、ご意見をいただけますでしょうか。",
      visibility: "private",
      subject: "契約書レビューに関する2重確認のご相談",
      threadId: "thread-mail-consultation",
      hasAttachment: true,
    },
    {
      id: "mail-2",
      type: "mail",
      user: "角田",
      date: "2023/07/07 14:30",
      content:
        "奥村さん、お疲れ様です。ご相談の件、承知いたしました。第3条の自動更新条項については、契約期間満了の30日前までに書面による通知が必要となります。詳細は添付の資料をご確認ください。",
      visibility: "private",
      subject: "Re: 契約書レビューに関する2重確認のご相談",
      threadId: "thread-mail-consultation",
      parentId: "mail-1",
      hasAttachment: true,
    },
    {
      id: "mail-3",
      type: "mail",
      user: "奥村",
      date: "2023/07/07 16:00",
      content:
        "角田さん、ご回答ありがとうございます。30日前の通知が必要とのこと、承知いたしました。それでは、通知書の作成についてもご相談させていただきたく存じます。",
      visibility: "private",
      subject: "Re: 契約書レビューに関する2重確認のご相談",
      threadId: "thread-mail-consultation",
      parentId: "mail-2",
      hasAttachment: false,
    },
    {
      id: "mail-4",
      type: "mail",
      user: "角田",
      date: "2023/07/07 17:00",
      content:
        "奥村さん、通知書の作成について承知いたしました。テンプレートを添付いたしますので、ご確認ください。必要に応じて修正していただければと思います。",
      visibility: "private",
      subject: "Re: 契約書レビューに関する2重確認のご相談",
      threadId: "thread-mail-consultation",
      parentId: "mail-3",
      hasAttachment: true,
    },
    // 【メールスレッド】角田さんとのメール（3ヶ月後）
    {
      id: "mail-5",
      type: "mail",
      user: "奥村",
      date: "2023/10/07 10:00",
      content:
        "角田さん、お世話になっております。前回のご相談から3ヶ月が経過いたしました。契約書の更新に関する件で、再度ご相談させていただきたく、ご連絡いたしました。",
      visibility: "public",
      subject: "契約書更新に関するご相談",
      threadId: "thread-mail-kakuda-3months",
      hasAttachment: false,
    },
    {
      id: "mail-6",
      type: "mail",
      user: "角田",
      date: "2023/10/07 14:30",
      content:
        "奥村さん、お疲れ様です。ご連絡ありがとうございます。契約書の更新について、前回の内容を踏まえて、新しいテンプレートを準備いたします。",
      visibility: "public",
      subject: "Re: 契約書更新に関するご相談",
      threadId: "thread-mail-kakuda-3months",
      parentId: "mail-5",
      hasAttachment: true,
    },
    // 【メールスレッド】松村さん（外部弁護士二人目）とのメール
    {
      id: "mail-7",
      type: "mail",
      user: "奥村",
      date: "2023/07/15 09:00",
      content:
        "松村さん、初めまして。当社の法務担当の奥村と申します。契約書のレビューについて、ご意見をいただきたく、ご連絡いたしました。",
      visibility: "public",
      subject: "契約書レビューに関するご相談",
      threadId: "thread-mail-matsumura",
      hasAttachment: true,
    },
    {
      id: "mail-8",
      type: "mail",
      user: "松村",
      date: "2023/07/15 15:00",
      content:
        "奥村さん、お世話になっております。ご相談の件、承知いたしました。契約書を確認させていただき、後日ご返答いたします。",
      visibility: "public",
      subject: "Re: 契約書レビューに関するご相談",
      threadId: "thread-mail-matsumura",
      parentId: "mail-7",
      hasAttachment: false,
    },
    // 【Slackスレッド】事業部担当の今野さんに、全体的に大丈夫そうだが、少しレビューに時間が必要とのことを送信（一番古い履歴）
    {
      id: "slack-0",
      type: "slack",
      user: "奥村",
      date: "2023/07/07 09:00",
      content: "今野さん、お疲れ様です。全体的に大丈夫そうですが、少しレビューに時間が必要です。",
      visibility: "public",
      channel: "#legal-review",
      threadId: "thread-slack-review",
      hasAttachment: false,
    },
    {
      id: "slack-0-1",
      type: "slack",
      user: "今野",
      date: "2023/07/07 09:15",
      content: "承知しました、お願いします。",
      visibility: "public",
      channel: "#legal-review",
      threadId: "thread-slack-review",
      parentId: "slack-0",
      hasAttachment: false,
    },
    // 【Slackスレッド】案件担当者（今野さん）に概要全体は問題ないが、レビューに少し時間が欲しいとのことを送信
    {
      id: "slack-1",
      type: "slack",
      user: "奥村",
      date: "2023/07/07 11:00",
      content:
        "今野さん、お疲れ様です。案件の概要全体については問題ないと判断いたします。ただし、詳細レビューに少し時間をいただきたく存じます。来週中にはご回答できる見込みです。",
      visibility: "public",
      channel: "#legal-review",
      threadId: "thread-slack-review",
      hasAttachment: false,
    },
    {
      id: "slack-2",
      type: "slack",
      user: "今野",
      date: "2023/07/07 11:15",
      content: "奥村さん、了解いたしました。来週中とのこと、承知いたします。よろしくお願いいたします。",
      visibility: "public",
      channel: "#legal-review",
      threadId: "thread-slack-review",
      parentId: "slack-1",
      hasAttachment: false,
    },
    {
      id: "slack-3",
      type: "slack",
      user: "今野",
      date: "2023/07/07 11:20",
      content: "承知しました。お願いします。",
      visibility: "public",
      channel: "#legal-review",
      threadId: "thread-slack-review",
      parentId: "slack-1",
      hasAttachment: false,
    },
    // 【Teamsスレッド】事業部側の野村さんに案件の共有として確認をお願いする連絡
    {
      id: "teams-1",
      type: "teams",
      user: "奥村",
      date: "2023/07/07 13:00",
      content:
        "野村さん、お疲れ様です。案件の共有として、ご確認をお願いいたします。契約書のレビューが完了しましたので、ご確認のほどよろしくお願いいたします。",
      visibility: "public",
      subject: "案件の共有について",
      threadId: "thread-teams-share",
      hasAttachment: false,
    },
    {
      id: "teams-2",
      type: "teams",
      user: "野村",
      date: "2023/07/07 13:30",
      content: "奥村さん、お疲れ様です。確認いたします。ありがとうございます。",
      visibility: "public",
      subject: "Re: 案件の共有について",
      threadId: "thread-teams-share",
      parentId: "teams-1",
      hasAttachment: false,
    },
    // 【LOメッセージ単体】法務部相談受付（天野さん）に契約期間に関するちょっとした相談
    {
      id: "lo-1",
      type: "lo-message",
      user: "奥村",
      date: "2023/07/07 09:30",
      content:
        "@天野 お疲れ様です。契約期間に関するちょっとした相談です。自動更新条項がある契約の場合、契約期間満了の何日前までに通知が必要でしょうか？",
      visibility: "public",
      hasAttachment: false,
    },
    {
      id: "lo-2",
      type: "lo-message",
      user: "天野",
      date: "2023/07/07 09:45",
      content:
        "@奥村 お疲れ様です。一般的には契約期間満了の30日前までに通知が必要とされていますが、契約書の条項によって異なる場合があります。該当契約書を確認させていただけますでしょうか。",
      visibility: "public",
      hasAttachment: false,
    },
    {
      id: "lo-3",
      type: "lo-message",
      user: "奥村",
      date: "2023/07/07 10:00",
      content: "@天野 ありがとうございます。契約書を確認して、必要に応じて外部弁護士にも相談させていただきます。",
      visibility: "public",
      hasAttachment: false,
    },
    // システムメッセージ
    {
      id: "system-1",
      type: "active-history",
      user: "システム",
      date: "2023/07/05 09:00",
      content: "案件ステータスが「対応中」に更新されました。",
      visibility: "public",
      hasAttachment: false,
    },
  ];
};

// スレッドタイトルのマッピング
const getThreadTitles = (locale: "ja-JP" | "en-US"): Record<string, string> => {
  if (locale === "en-US") {
    return {
      "thread-mail-consultation": "Consultation on Double-Checking Contract Review",
      "thread-mail-kakuda-3months": "Consultation on Contract Renewal",
      "thread-mail-matsumura": "Consultation on Contract Review",
      "thread-slack-review": "Request for Additional Review Time",
      "thread-teams-share": "Regarding Case Sharing",
    };
  }
  return {
    "thread-mail-consultation": "契約書レビューに関する2重確認のご相談",
    "thread-mail-kakuda-3months": "契約書更新に関するご相談",
    "thread-mail-matsumura": "契約書レビューに関するご相談",
    "thread-slack-review": "レビューに少し時間が欲しい件",
    "thread-teams-share": "案件の共有について",
  };
};

const getSharedUsers = (locale: "ja-JP" | "en-US") => {
  if (locale === "en-US") {
    return {
      standard: [{ name: "Taro Yamada" }, { name: "Ichiro Yamashita" }, { name: "Sakura Shibata" }],
      pro: [
        { name: "Makoto Homu" },
        { name: "Satoko Koenji" },
        { name: "Yuki Suzuki" },
        { name: "Kenta Hayashi" },
        { name: "Shintaro Koyama" },
      ],
    };
  }
  return {
    standard: [{ name: "山田太郎" }, { name: "山下一郎" }, { name: "柴田さくら" }],
    pro: [{ name: "法務誠" }, { name: "高円寺聡子" }, { name: "鈴木ゆき" }, { name: "林健太" }, { name: "小山信太郎" }],
  };
};

const getAvailableUsers = (locale: "ja-JP" | "en-US") => {
  if (locale === "en-US") {
    return [
      {
        id: "1",
        name: "Yuka Monma",
        email: "user02+hinagata@example.com",
        role: "Administrator",
        suspended: false,
      },
      {
        id: "2",
        name: "Yuki Konno",
        email: "user03+hinagata@example.com",
        role: "Administrator",
        suspended: false,
      },
      {
        id: "3",
        name: "Akihiro Oomura",
        email: "user04+hinagata@example.com",
        role: "Administrator",
        suspended: true,
      },
      {
        id: "4",
        name: "Kaori Taniguchi",
        email: "user05+hinagata@example.com",
        role: "Administrator",
        suspended: false,
      },
      {
        id: "5",
        name: "Tomohiro Okumura",
        email: "user06+hinagata@example.com",
        role: "Administrator",
        suspended: false,
      },
    ];
  }
  return [
    {
      id: "1",
      name: "門馬 由佳",
      email: "user02+hinagata@example.com",
      role: "管理者",
      suspended: false,
    },
    {
      id: "2",
      name: "今野 悠樹",
      email: "user03+hinagata@example.com",
      role: "管理者",
      suspended: false,
    },
    {
      id: "3",
      name: "大村 彰博",
      email: "user04+hinagata@example.com",
      role: "管理者",
      suspended: true,
    },
    {
      id: "4",
      name: "谷口 香織",
      email: "user05+hinagata@example.com",
      role: "管理者",
      suspended: false,
    },
    {
      id: "5",
      name: "奥村 奥村",
      email: "user06+hinagata@example.com",
      role: "管理者",
      suspended: false,
    },
  ];
};

// テンプレート用モックデータ（案件情報パネル）
const linkedFiles = [
  { name: "業務委託契約書_v3.docx", updatedAt: "2024/10/21 17:02" },
  { name: "秘密保持契約書（NDA）.pdf", updatedAt: "2024/10/18 12:44" },
  { name: "条件変更要望.pdf", updatedAt: "2024/10/22 09:17" },
];
const relatedCases = [
  { id: "2024-02-0015", title: "基本契約書_取引先A", status: "完了" },
  { id: "2024-05-0031", title: "委託先B_契約条件変更", status: "対応中" },
];
const referenceLinks = [
  { title: "業務委託契約に関するガイドライン", url: "https://example.com/guideline" },
  { title: "秘密保持条項チェックリスト", url: "https://example.com/checklist" },
  { title: "損害賠償条項のサンプル", url: "https://example.com/sample" },
];
const keywords = ["業務委託", "契約書レビュー", "リスク確認", "秘密保持", "損害賠償", "契約期間"];

const inlineStyles: Record<string, CSSProperties> = {
  pageBody: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-large)",
  },
  card: {
    padding: "var(--aegis-space-large)",
    backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
    borderRadius: "var(--aegis-radius-large)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-large)",
  },
  requestContent: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-small)",
  },
  messageForm: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-small)",
    padding: "var(--aegis-space-medium)",
    border: "1px solid var(--aegis-color-border-default)",
    borderRadius: "var(--aegis-radius-medium)",
    backgroundColor: "var(--aegis-color-surface-default)",
  },
  messageToolbar: {
    display: "flex",
    gap: "var(--aegis-space-xxSmall)",
    alignItems: "center",
  },
  messageActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  messageActionsLeft: {
    display: "flex",
    gap: "var(--aegis-space-xSmall)",
  },
  messageActionsRight: {
    display: "flex",
    gap: "var(--aegis-space-small)",
    alignItems: "center",
  },
  commentItem: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-small)",
    padding: "var(--aegis-space-medium)",
  },
  commentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentUserInfo: {
    display: "flex",
    gap: "var(--aegis-space-small)",
    alignItems: "center",
  },
  commentActions: {
    display: "flex",
    gap: "var(--aegis-space-xSmall)",
    alignItems: "center",
  },
  popoverContent: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-small)",
    minWidth: "200px",
  },
  popoverSection: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-medium)",
  },
  userList: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-small)",
  },
  userItem: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-small)",
  },
  licenseSection: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-small)",
    flex: 1,
  },
  licenseContainer: {
    display: "flex",
    gap: "var(--aegis-space-large)",
    alignItems: "flex-start",
  },
  messageTypeIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    height: 20,
  },
  commentWithIcon: {
    display: "flex",
    gap: "var(--aegis-space-small)",
    alignItems: "flex-start",
    marginBottom: "var(--aegis-space-medium)",
  },
  // テンプレート LOC case detail のタイムライン・メッセージ用スタイル
  timelineEvent: {
    display: "flex",
    alignItems: "flex-start",
    gap: "var(--aegis-space-small)",
  },
  eventHeader: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-small)",
  },
  eventMeta: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-xxSmall)",
    marginLeft: "auto",
  },
  eventBody: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xSmall)",
    width: "100%",
  },
  externalCard: {
    width: "100%",
    padding: "var(--aegis-size-xSmall)",
    border: "1px solid var(--aegis-color-border-input)",
    borderRadius: "var(--aegis-radius-medium)",
    backgroundColor: "var(--aegis-color-surface-default)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-small)",
  },
  mailCardHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "var(--aegis-space-small)",
  },
  mailHeaderText: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xxSmall)",
  },
  mailToolbar: {
    display: "flex",
    gap: "var(--aegis-space-small)",
    marginLeft: "auto",
  },
  attachmentRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--aegis-space-xSmall)",
  },
  slackCard: {
    width: "100%",
    padding: "var(--aegis-space-small)",
    border: "1px solid var(--aegis-color-border-default)",
    borderRadius: "var(--aegis-radius-medium)",
    backgroundColor: "var(--aegis-color-surface-default)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-small)",
  },
  slackCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-small)",
  },
  paneBody: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-medium)",
  },
  summaryBody: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-medium)",
  },
  summaryTextGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xxSmall)",
  },
};

// 日本語をマスターとして定義（すべての翻訳キーをここに定義）
const japaneseTranslations = {
  close: "閉じる",
  home: "ホーム",
  search: "検索",
  assistant: "アシスタント",
  cases: "案件",
  review: "レビュー",
  contracts: "契約書",
  eContract: "電子契約",
  executedContract: "締結版契約書",
  template: "ひな形",
  reviewCriteria: "契約審査基準",
  adminSettings: "管理者設定",
  personalSettings: "個人設定",
  maintenance: "メンテナンス・障害情報",
  helpSite: "ヘルプサイト",
  logout: "ログアウト",
  menu: "メニュー",
  prev: "前へ",
  next: "次へ",
  other: "その他",
  language: "言語",
  localeJapanese: "日本語",
  localeEnglish: "English",
  tabVerification: "タブの検証",
  tabDefault: "デフォルト",
  tabOne: "タブ 1",
  tabTwo: "タブ 2",
  edit: "編集",
  requestContent: "依頼内容",
  showAll: "すべて表示",
  timelineVisibilityTitle: "タイムライン公開・非公開設定",
  perMessageVisibilityTitle: "メッセージごとの公開・非公開設定",
  tabAll: "すべて",
  tabPublic: "公開",
  tabPrivate: "非公開",
  sharedUsers: "共有中のユーザー",
  sharedUsersTitle: "共有中のユーザー",
  sharedUsersDesc: "案件詳細ページは共有中のユーザーのみが閲覧できます。",
  standardLicense: "Standardライセンス",
  proLicense: "Proライセンス",
  publicOnlyAccess: "公開のみ閲覧可能",
  publicPrivateAccess: "公開・非公開どちらも閲覧可能",
  configureSharedUsers: "共有ユーザーを設定",
  displaySettings: "表示設定",
  selectAll: "全てを選択",
  loMessage: "LOメッセージ",
  slack: "Slack",
  teams: "Microsoft Teams",
  mail: "メール",
  activeHistory: "アクティブ履歴",
  refresh: "更新",
  new: "新規",
  createNewMail: "新規メールを作成",
  createSlackThread: "Slackに案件のスレッドを作成",
  createTeamsThread: "Teamsに案件のスレッドを作成",
  bold: "太字",
  italic: "斜体",
  underline: "下線",
  list: "リスト",
  mention: "メンション",
  messagePlaceholder: "メッセージを入力",
  attachFile: "ファイル添付",
  visibilityPrivate: "非公開",
  visibilityPublic: "公開",
  visibilitySettingTitle: "公開設定",
  visibilityPrivateDesc: "非公開 Proユーザーのみが閲覧可能",
  visibilityPublicDesc: "公開 Standard・Proユーザーが閲覧可能",
  send: "送信",
  sendAsPublic: "公開で送信",
  sendAsPrivate: "非公開で送信",
  backToThreads: "全てのスレッド一覧に戻る",
  viewAllMailsInThread: "スレッド内のすべてのメールを見る",
  thisThread: "このスレッド",
  replyCount: "件の返信",
  lastUpdated: "更新日時:",
  requestDetails: "依頼詳細",
  relatedThreads: "関連スレッド",
  threadComments: "スレッドコメント一覧",
  attachment: "添付ファイル",
  download: "↓ダウンロード",
  showReplies: "件の返信を表示",
  openInTeams: "Teamsで開く",
  reply: "返信",
  slackThreadInChannel: "#general内のスレッド",
  slackThreadCreatedMessage: "案件のスレッドが作成されました。[スレッドに返信] から返信してください。",
  replyToThread: "スレッドに返信",
  caseNumber: "案件番号",
  caseName: "案件名",
  titlePlaceholder: "タイトルはここに載せます",
  cancel: "キャンセル",
  publish: "公開",
  publishThread: "スレッドを公開しますか?",
  publishThreadDesc: "公開設定を変更すると、今後作成されるスレッドのデフォルト設定が公開になります。",
  existingThreadsNotChanged: "既存のスレッドの公開設定は変更されません。",
  threadContainsCount: "このスレッドに含まれる",
  messageCount: "の件数:",
  allMessagesInThreadPublished: "スレッド内のすべての",
  willBePublished: "が一括で公開されます。",
  slackIntegration: "Slack連携について",
  createSlackThreadTitle: "Slackに案件のスレッドを作成",
  slackChannelDesc: "Slackチャンネルを設定し、本案件のSlackスレッドを作成します。",
  selectSlackChannel: "スレッドを作成するSlackチャンネル",
  selectSlackChannelRequired: "スレッドを作成するSlackチャンネル *必須",
  searchSlackChannel: "Slackチャンネルを検索",
  channelCannotChange: "設定後、Slackチャンネルの変更はできません。",
  notificationRecipient: "スレッド作成の通知先 (Slackアカウント)",
  mentionSentOnce: "スレッド作成時に一度だけメンションを送ります。案件の依頼者などを設定しておくと便利です。",
  teamsIntegration: "Teams連携について",
  createTeamsThreadTitle: "Teamsに案件のスレッドを作成",
  teamsChannelDesc: "Teamsチャンネルを設定し、本案件のTeamsスレッドを作成します。",
  selectTeamsChannel: "スレッドを作成するTeamsチャンネル",
  searchTeamsChannel: "Teamsチャンネルを検索",
  teamsChannelCannotChange: "設定後、Teamsチャンネルの変更はできません。",
  teamsNotificationRecipient: "スレッド作成の通知先 (Teamsアカウント)",
  teamsMentionSentOnce: "スレッド作成時に一度だけメンションを送ります。案件の依頼者などを設定しておくと便利です。",
  selectTeamsChannelError: "スレッドを作成するTeamsチャンネルを選択してください。",
  visibilitySetting: "公開設定",
  visibilitySettingRequired: "公開設定 *必須",
  publicStandardPro: "公開 Standard・Proユーザーに表示",
  privateProOnly: "非公開 Proユーザーのみに表示",
  selectSlackChannelError: "スレッドを作成するSlackチャンネルを選択してください。",
  configureSharedUsersTitle: "共有ユーザーを設定",
  inheritAccessRights: "上位階層のアクセス権限を継承する",
  aboutInheritance: "継承について",
  users: "ユーザー",
  userGroups: "ユーザーグループ",
  searchUserPlaceholder: "ユーザー名またはメールアドレスを入力",
  suspended: "利用停止",
  userGroupFeatureComing: "ユーザーグループ機能は準備中です",
  save: "保存",
  delete: "削除",
  clear: "クリア",
  expand: "展開",
  collapse: "折りたたみ",
  strikethrough: "取り消し線",
  mailCompose: "メール作成",
  sender: "差出人:",
  to: "宛先",
  cc: "Cc:",
  subject: "件名:",
  body: "本文を入力",
  caseInfo: "案件情報",
  info: "情報",
  caseType: "案件タイプ",
  contractReview: "契約書審査",
  contractCreation: "契約書作成",
  caseStatus: "案件ステータス",
  notStarted: "未着手",
  inProgress: "対応中",
  completed: "完了",
  caseOwner: "案件担当者",
  subOwner: "副担当者",
  requestingDepartment: "依頼部署",
  notEntered: "未入力",
  requester: "依頼者",
  deliveryDate: "納期",
  saveLocation: "保存場所",
  caseReceptionSpace: "案件受付スペース",
};

// 英語の翻訳（部分的な定義のみ。未定義のキーは自動的に日本語がフォールバックとして使用される）
const englishTranslations: Partial<typeof japaneseTranslations> = {
  close: "Close",
  home: "Home",
  search: "Search",
  assistant: "Assistant",
  cases: "Cases",
  review: "Review",
  contracts: "Contracts",
  eContract: "E-Contract",
  executedContract: "Executed Contract",
  template: "Template",
  reviewCriteria: "Review Criteria",
  adminSettings: "Admin Settings",
  personalSettings: "Personal Settings",
  maintenance: "Maintenance & Outages",
  helpSite: "Help Site",
  logout: "Logout",
  menu: "Menu",
  prev: "Previous",
  next: "Next",
  other: "More",
  language: "Language",
  localeJapanese: "Japanese",
  localeEnglish: "English",
  tabVerification: "Tab verification",
  tabDefault: "Default",
  tabOne: "Tab 1",
  tabTwo: "Tab 2",
  edit: "Edit",
  requestContent: "Request details",
  showAll: "Show all",
  timelineVisibilityTitle: "Timeline visibility",
  perMessageVisibilityTitle: "Per-message public/private settings",
  tabAll: "All",
  tabPublic: "Public",
  tabPrivate: "Private",
  sharedUsers: "Shared users",
  sharedUsersTitle: "Shared users",
  sharedUsersDesc: "Only shared users can view this case detail page.",
  standardLicense: "Standard License",
  proLicense: "Pro License",
  publicOnlyAccess: "Public only",
  publicPrivateAccess: "Public & Private",
  configureSharedUsers: "Configure shared users",
  displaySettings: "Display settings",
  selectAll: "Select all",
  loMessage: "LO Message",
  slack: "Slack",
  teams: "Microsoft Teams",
  mail: "Mail",
  activeHistory: "Active History",
  refresh: "Refresh",
  new: "New",
  createNewMail: "Compose a new email",
  createSlackThread: "Create a new Slack thread",
  createTeamsThread: "Create a new Teams thread",
  bold: "Bold",
  italic: "Italic",
  underline: "Underline",
  list: "List",
  mention: "Mention",
  messagePlaceholder: "Type a message",
  attachFile: "Attach file",
  visibilityPrivate: "Private",
  visibilityPublic: "Public",
  visibilitySettingTitle: "Visibility",
  visibilityPrivateDesc: "Private (Pro only)",
  visibilityPublicDesc: "Public (Standard & Pro)",
  send: "Send",
  sendAsPublic: "Send as Public",
  sendAsPrivate: "Send as Private",
  backToThreads: "Back to all threads",
  viewAllMailsInThread: "View all mails in thread",
  thisThread: "This thread",
  replyCount: " replies",
  lastUpdated: "Last updated:",
  requestDetails: "Request details",
  relatedThreads: "Related threads",
  threadComments: "Thread comments",
  attachment: "Attachment",
  download: "↓ Download",
  showReplies: " replies",
  openInTeams: "Open in Teams",
  reply: "Reply",
  slackThreadInChannel: "Thread in #general",
  slackThreadCreatedMessage: "A case thread has been created. Please reply from [Reply to thread].",
  replyToThread: "Reply to thread",
  caseNumber: "Case number",
  caseName: "Case name",
  titlePlaceholder: "Title goes here",
  cancel: "Cancel",
  publish: "Publish",
  publishThread: "Publish thread?",
  publishThreadDesc: "Changing visibility will set future threads to public by default.",
  existingThreadsNotChanged: "Existing thread visibility will not change.",
  threadContainsCount: "This thread contains ",
  messageCount: " messages: ",
  allMessagesInThreadPublished: "All ",
  willBePublished: " in this thread will be published.",
  slackIntegration: "About Slack integration",
  createSlackThreadTitle: "Create Slack thread for case",
  slackChannelDesc: "Configure a Slack channel and create a Slack thread for this case.",
  selectSlackChannel: "Slack channel for thread",
  selectSlackChannelRequired: "Slack channel for thread *Required",
  searchSlackChannel: "Search Slack channel",
  channelCannotChange: "Channel cannot be changed after configuration.",
  notificationRecipient: "Notification recipient (Slack account)",
  mentionSentOnce: "A mention will be sent once when the thread is created. Setting the requester is recommended.",
  teamsIntegration: "About Teams integration",
  createTeamsThreadTitle: "Create Teams thread for case",
  teamsChannelDesc: "Configure a Teams channel and create a Teams thread for this case.",
  selectTeamsChannel: "Teams channel for thread",
  searchTeamsChannel: "Search Teams channel",
  teamsChannelCannotChange: "Channel cannot be changed after configuration.",
  teamsNotificationRecipient: "Notification recipient (Teams account)",
  teamsMentionSentOnce: "A mention will be sent once when the thread is created. Setting the requester is recommended.",
  selectTeamsChannelError: "Please select a Teams channel for the thread.",
  visibilitySetting: "Visibility",
  visibilitySettingRequired: "Visibility *Required",
  publicStandardPro: "Public (Standard & Pro)",
  privateProOnly: "Private (Pro only)",
  selectSlackChannelError: "Please select a Slack channel for the thread.",
  configureSharedUsersTitle: "Configure shared users",
  inheritAccessRights: "Inherit access rights from parent",
  aboutInheritance: "About inheritance",
  users: "Users",
  userGroups: "User Groups",
  searchUserPlaceholder: "Enter user name or email",
  userGroupFeatureComing: "User groups feature coming soon",
  suspended: "Suspended",
  save: "Save",
  delete: "Delete",
  clear: "Clear",
  expand: "Expand",
  collapse: "Collapse",
  strikethrough: "Strikethrough",
  mailCompose: "Mail compose",
  sender: "From:",
  to: "To",
  cc: "Cc:",
  subject: "Subject:",
  body: "Enter body",
  caseInfo: "Case information",
  info: "Info",
  caseType: "Case type",
  contractReview: "Contract Review",
  contractCreation: "Contract Creation",
  caseStatus: "Case status",
  notStarted: "Not started",
  inProgress: "In progress",
  completed: "Completed",
  caseOwner: "Case owner",
  subOwner: "Sub owner",
  requestingDepartment: "Requesting department",
  notEntered: "Not entered",
  requester: "Requester",
  deliveryDate: "Delivery date",
  saveLocation: "Save location",
  caseReceptionSpace: "Case Reception Space",
};

type TranslationKey = keyof typeof japaneseTranslations;

// 翻訳辞書（en-US にないキーは ja-JP で補う）
const translations: TranslationDictionary<TranslationKey> = {
  "ja-JP": japaneseTranslations,
  "en-US": { ...japaneseTranslations, ...englishTranslations } as typeof japaneseTranslations,
};

const CaseDetailRefresh = () => {
  const { locale, setLocale } = useLocale();
  const { t } = useTranslation<TranslationKey>(translations);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [messageViewType, setMessageViewType] = useState<MessageViewType>("threads");
  // 現在のユーザー名（法務担当者：奥村さん）
  const currentUserName = locale === "ja-JP" ? "奥村" : "Okumura";

  // localeに応じたデータを取得
  const caseData = useMemo(() => getCaseData(locale), [locale]);
  const initialComments = useMemo(() => getComments(locale), [locale]);
  const threadTitles = useMemo(() => getThreadTitles(locale), [locale]);

  const [messageValues, setMessageValues] = useState<Record<TabType, string>>({
    all: "",
    public: "",
    private: "",
  });
  const [visibilitySetting, setVisibilitySetting] = useState<"public" | "private">("private");
  const [tabVerificationMode, setTabVerificationMode] = useState<"3tabs" | "2tabs" | "1tab">("3tabs");

  // タブに応じてvisibilitySettingを自動更新
  useEffect(() => {
    if (activeTab === "public") {
      setVisibilitySetting("public");
    } else if (activeTab === "private") {
      setVisibilitySetting("private");
    }
    // activeTab === "all"の場合は変更しない（ユーザーが選択可能）
  }, [activeTab]);

  // 2タブ・1タブモードに切り替えたとき、非公開タブ選択中なら「すべて」にリセット
  useEffect(() => {
    if ((tabVerificationMode === "2tabs" || tabVerificationMode === "1tab") && activeTab === "private") {
      setActiveTab("all");
    }
  }, [tabVerificationMode, activeTab]);

  const [sharedUsersDialogOpen, setSharedUsersDialogOpen] = useState(false);
  const [sharedUsersPopoverOpen, setSharedUsersPopoverOpen] = useState(false);
  const [tabVerificationPopoverOpen, setTabVerificationPopoverOpen] = useState(false);
  const sharedUsersState = useMemo(() => getSharedUsers(locale), [locale]);
  const availableUsers = useMemo(() => getAvailableUsers(locale), [locale]);
  const [inheritAccessRights, setInheritAccessRights] = useState(true);
  const [userTabIndex, setUserTabIndex] = useState(0);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [displaySettings, setDisplaySettings] = useState({
    allSelected: true,
    loMessage: true,
    slack: true,
    teams: true,
    mail: true,
    activeHistory: true,
  });
  const [showAllContent, setShowAllContent] = useState(false);
  const [commentsState, setCommentsState] = useState<Comment[]>(initialComments);

  // localeが変わったときにcommentsStateを更新
  useEffect(() => {
    setCommentsState(initialComments);
  }, [initialComments]);
  const [slackDialogOpen, setSlackDialogOpen] = useState(false);
  const [slackChannel, setSlackChannel] = useState<string>("");
  const [slackNotificationUser, setSlackNotificationUser] = useState<string>("");
  const [slackVisibility, setSlackVisibility] = useState<"public" | "private">("private");
  const [slackError, setSlackError] = useState<string>("");
  const [teamsDialogOpen, setTeamsDialogOpen] = useState(false);
  const [teamsChannel, setTeamsChannel] = useState<string>("");
  const [teamsNotificationUser, setTeamsNotificationUser] = useState<string>("");
  const [teamsVisibility, setTeamsVisibility] = useState<"public" | "private">("private");
  const [teamsError, setTeamsError] = useState<string>("");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [mailThreadPopoverOpen, setMailThreadPopoverOpen] = useState<Record<string, boolean>>({});
  const [visibilityChangeDialogOpen, setVisibilityChangeDialogOpen] = useState(false);
  const [pendingVisibilityChange, setPendingVisibilityChange] = useState<{
    commentId: string | null; // nullの場合はthreadVisibilitySettingの変更
    newVisibility: "public" | "private";
  } | null>(null);
  const [expandedMessageContent, setExpandedMessageContent] = useState<Set<string>>(new Set());
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
  const [mailComposeOpen, setMailComposeOpen] = useState(false);
  const [mailFrom, setMailFrom] = useState("juna.kondo <legal.request@case-m.example.com>");
  const [mailTo, setMailTo] = useState<string[]>([]);
  const [mailCc, setMailCc] = useState<string[]>([]);
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");
  // 案件情報のstate
  const [caseType, setCaseType] = useState("contract-review");
  const [caseStatus, setCaseStatus] = useState("not-started");
  const [caseOwner, setCaseOwner] = useState("okumura");
  const subOwnerDisplay = locale === "ja-JP" ? "今野 悠樹" : "Yuki Konno";
  const [requestingDepartment, setRequestingDepartment] = useState("not-entered");
  const [requester, setRequester] = useState("sho-saikaishi");
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [saveLocation] = useState("案件受付スペース");

  // 案件情報パネル（テンプレート同様）
  const [paneType, setPaneType] = useState<PaneType>("case-attribute");
  const [paneOpen, setPaneOpen] = useState(true);
  const currentPane = paneOpen ? paneType : undefined;
  const handleSelectPane = (nextPane: PaneType) => {
    setPaneType(nextPane);
    setPaneOpen(true);
  };

  const currentMessageValue = messageValues[activeTab];

  const handleMessageChange = (value: string) => {
    setMessageValues((prev) => ({
      ...prev,
      [activeTab]: value,
    }));
  };

  const handleDisplaySettingsChange = (key: keyof typeof displaySettings, checked: boolean) => {
    if (key === "allSelected") {
      setDisplaySettings((prev) => ({
        ...prev,
        allSelected: checked,
        loMessage: checked,
        slack: checked,
        teams: checked,
        mail: checked,
        activeHistory: checked,
      }));
    } else {
      const newSettings = {
        ...displaySettings,
        [key]: checked,
      };
      const allChecked =
        newSettings.loMessage &&
        newSettings.slack &&
        newSettings.teams &&
        newSettings.mail &&
        newSettings.activeHistory;
      setDisplaySettings({
        ...newSettings,
        allSelected: allChecked,
      });
    }
  };

  const handleCommentVisibilityChange = (commentId: string, newVisibility: "public" | "private") => {
    const comment = commentsState.find((c) => c.id === commentId);
    if (!comment) return;

    // 非公開から公開に変更する場合のみDialogを表示
    if (comment.visibility === "private" && newVisibility === "public") {
      setPendingVisibilityChange({ commentId, newVisibility });
      setVisibilityChangeDialogOpen(true);
    } else {
      // 公開から非公開、または同じ状態の場合は直接変更
      // スレッドに属している場合、スレッド内の全メッセージを一括で変更
      if (comment.threadId) {
        setCommentsState((prev) =>
          prev.map((c) => (c.threadId === comment.threadId ? { ...c, visibility: newVisibility } : c)),
        );
      } else {
        setCommentsState((prev) => prev.map((c) => (c.id === commentId ? { ...c, visibility: newVisibility } : c)));
      }
    }
  };

  const handleConfirmVisibilityChange = () => {
    if (!pendingVisibilityChange) return;

    const { commentId, newVisibility } = pendingVisibilityChange;
    // commentIdがthreadIdの場合はスレッド単位で変更
    const isThreadId = threadGroups.some(([threadId]) => threadId === commentId);
    if (isThreadId) {
      setCommentsState((prev) => prev.map((c) => (c.threadId === commentId ? { ...c, visibility: newVisibility } : c)));
    } else {
      const comment = commentsState.find((c) => c.id === commentId);
      if (!comment) return;

      // スレッドに属している場合、スレッド内の全メッセージを一括で公開
      if (comment.threadId) {
        setCommentsState((prev) =>
          prev.map((c) => (c.threadId === comment.threadId ? { ...c, visibility: newVisibility } : c)),
        );
      } else {
        // スレッドに属していない場合は単一のコメントのみ変更
        setCommentsState((prev) => prev.map((c) => (c.id === commentId ? { ...c, visibility: newVisibility } : c)));
      }
    }

    setVisibilityChangeDialogOpen(false);
    setPendingVisibilityChange(null);
  };

  const handleSendMessage = () => {
    if (currentMessageValue.trim().length === 0) {
      return;
    }

    const newComment: Comment = {
      id: `new-${Date.now()}`,
      type: "lo-message",
      user: "現在のユーザー",
      date: new Date().toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      content: currentMessageValue,
      visibility: visibilitySetting,
    };

    setCommentsState((prev) => [newComment, ...prev]);
    setMessageValues((prev) => ({
      ...prev,
      [activeTab]: "",
    }));
  };

  // スレッドをグループ化（LOメッセージは除外）
  const threadGroups = useMemo(() => {
    const threads: Record<string, Comment[]> = {};
    commentsState.forEach((comment) => {
      // LOメッセージはスレッドとして扱わない
      if (comment.threadId && comment.type !== "lo-message") {
        if (!threads[comment.threadId]) {
          threads[comment.threadId] = [];
        }
        threads[comment.threadId].push(comment);
      }
    });
    // 2つ以上のメッセージがあるスレッドのみを返す
    return Object.entries(threads).filter(([_, comments]) => comments.length >= 2);
  }, [commentsState]);

  const filteredComments = useMemo(() => {
    let filtered: Comment[] = [];

    // スレッドが選択されている場合、そのスレッドのメッセージのみを表示（LOメッセージは除外）
    if (selectedThreadId) {
      filtered = commentsState.filter(
        (comment) => comment.threadId === selectedThreadId && comment.type !== "lo-message",
      );
      // 日付順にソート（最新が上）
      filtered.sort((a, b) => b.date.localeCompare(a.date));
    } else {
      // ビュータイプによるフィルタリング
      if (messageViewType === "threads") {
        // スレッドビュー: スレッドのルートメッセージ + LOメッセージ（個別）
        // メールスレッドは最新の1つのみ表示、他のスレッドはPopoverで確認
        const mailThreads = threadGroups.filter(([_threadId, comments]) => {
          return comments.some((c) => c.type === "mail");
        });
        const otherThreads = threadGroups.filter(([_threadId, comments]) => {
          return !comments.some((c) => c.type === "mail");
        });

        // メールスレッドから最新の1つを取得
        let latestMailThreadRoot: Comment | null = null;
        if (mailThreads.length > 0) {
          // 各メールスレッドの最新日付を比較
          const mailThreadsWithLatestDate = mailThreads.map(([threadId, comments]) => {
            const rootComment = comments.find((c) => !c.parentId) || comments[0];
            const latestDate = comments.reduce((latest, c) => {
              return c.date > latest ? c.date : latest;
            }, comments[0].date);
            return { threadId, rootComment, latestDate };
          });
          // 最新日付でソートして最初の1つを取得
          mailThreadsWithLatestDate.sort((a, b) => b.latestDate.localeCompare(a.latestDate));
          latestMailThreadRoot = mailThreadsWithLatestDate[0].rootComment;
        }

        // 他のスレッド（Slack、Teamsなど）のルートメッセージを取得
        const otherThreadRoots = otherThreads.map(([_threadId, comments]) => {
          const rootComment = comments.find((c) => !c.parentId) || comments[0];
          return rootComment;
        });

        // LOメッセージは個別メッセージとして追加
        const loMessages = commentsState.filter((comment) => comment.type === "lo-message");

        // メールスレッドが存在する場合は1つのみ追加、他のスレッドとLOメッセージを追加
        filtered = latestMailThreadRoot
          ? [latestMailThreadRoot, ...otherThreadRoots, ...loMessages]
          : [...otherThreadRoots, ...loMessages];
      } else {
        // メッセージビュー: スレッドに属さないメッセージ + LOメッセージ（個別）
        // メールスレッドは最新の1つのみ表示
        const mailThreads = threadGroups.filter(([_threadId, comments]) => {
          return comments.some((c) => c.type === "mail");
        });
        const otherThreads = threadGroups.filter(([_threadId, comments]) => {
          return !comments.some((c) => c.type === "mail");
        });

        // メールスレッドから最新の1つを取得
        let latestMailThreadRoot: Comment | null = null;
        if (mailThreads.length > 0) {
          const mailThreadsWithLatestDate = mailThreads.map(([threadId, comments]) => {
            const rootComment = comments.find((c) => !c.parentId) || comments[0];
            const latestDate = comments.reduce((latest, c) => {
              return c.date > latest ? c.date : latest;
            }, comments[0].date);
            return { threadId, rootComment, latestDate };
          });
          mailThreadsWithLatestDate.sort((a, b) => b.latestDate.localeCompare(a.latestDate));
          latestMailThreadRoot = mailThreadsWithLatestDate[0].rootComment;
        }

        // 他のスレッドに属さないメッセージを取得
        const otherThreadIds = new Set(otherThreads.map(([threadId]) => threadId));
        const nonThread = commentsState.filter((comment) => {
          if (comment.type === "lo-message") {
            return true;
          }
          // メールスレッドの場合は最新の1つのみ
          if (comment.type === "mail" && comment.threadId) {
            return latestMailThreadRoot && comment.id === latestMailThreadRoot.id;
          }
          return !comment.threadId || !otherThreadIds.has(comment.threadId);
        });
        filtered = nonThread;
      }
    }

    // 日付順にソート（最新が上）
    filtered.sort((a, b) => b.date.localeCompare(a.date));

    // タブによるフィルタリング
    if (activeTab !== "all") {
      filtered = filtered.filter((comment) => comment.visibility === activeTab);
    }

    // 表示設定によるフィルタリング
    filtered = filtered.filter((comment) => {
      switch (comment.type) {
        case "lo-message":
          return displaySettings.loMessage;
        case "slack":
          return displaySettings.slack;
        case "teams":
          return displaySettings.teams;
        case "mail":
          return displaySettings.mail;
        case "active-history":
          return displaySettings.activeHistory;
        default:
          return true;
      }
    });

    return filtered;
  }, [activeTab, displaySettings, messageViewType, threadGroups, commentsState, selectedThreadId]);

  const renderPaneContent = () => {
    const PaneHeader = ({ title }: { title: string }) => (
      <PageLayoutHeader>
        <ContentHeader
          size="small"
          trailing={
            <Tooltip title={t("close")} placement="top">
              <IconButton variant="plain" size="small" aria-label={t("close")} onClick={() => setPaneOpen(false)}>
                <Icon>
                  <LfCloseLarge />
                </Icon>
              </IconButton>
            </Tooltip>
          }
        >
          <ContentHeader.Title>
            <Text variant="title.small">{title}</Text>
          </ContentHeader.Title>
        </ContentHeader>
      </PageLayoutHeader>
    );

    if (paneType === "case-summary") {
      return (
        <>
          <PaneHeader title={locale === "ja-JP" ? "案件要約" : "Case summary"} />
          <PageLayoutBody>
            <div style={inlineStyles.summaryBody}>
              <Button variant="solid" width="full" leading={LfWand}>
                {locale === "ja-JP" ? "案件要約を生成" : "Generate case summary"}
              </Button>
              <EmptyState
                size="small"
                title={
                  locale === "ja-JP"
                    ? "メッセージのやり取りを元に案件要約を生成します"
                    : "Generate case summary from message history"
                }
              >
                {locale === "ja-JP"
                  ? "上記ボタンを押下しなくても、メッセージの最終更新から72時間経過した日の0:00頃に自動で生成します。"
                  : "Summary is also auto-generated around 0:00, 72 hours after the last message update."}
              </EmptyState>
              <div style={inlineStyles.summaryTextGroup}>
                <Text variant="body.small" color="subtle">
                  {locale === "ja-JP"
                    ? "メッセージ数が少ない場合、案件要約の精度が低下することがあります。要約の内容はお客様の判断でご利用ください。"
                    : "Summary accuracy may be lower with few messages. Use at your discretion."}
                </Text>
                <Link
                  href="#"
                  size="small"
                  leading={LfQuestionCircle}
                  trailing={LfArrowUpRightFromSquare}
                  target="_blank"
                  rel="noreferrer"
                  underline
                >
                  {locale === "ja-JP" ? "案件要約機能のご利用における注意点" : "Notes on case summary"}
                </Link>
              </div>
            </div>
          </PageLayoutBody>
        </>
      );
    }

    if (paneType === "linked-file") {
      return (
        <>
          <PaneHeader title={locale === "ja-JP" ? "関連ファイル" : "Linked files"} />
          <PageLayoutBody>
            <div style={inlineStyles.paneBody}>
              {linkedFiles.map((file) => (
                <div
                  key={file.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--aegis-space-small)",
                    padding: "var(--aegis-space-small)",
                    border: "1px solid var(--aegis-color-border-default)",
                    borderRadius: "var(--aegis-radius-medium)",
                  }}
                >
                  <Icon size="medium">
                    <LfFile />
                  </Icon>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}>
                    <Text variant="body.medium.bold">{file.name}</Text>
                    <Text variant="body.small" color="subtle">
                      {locale === "ja-JP" ? "最終更新" : "Updated"} {file.updatedAt}
                    </Text>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <Button size="small" variant="subtle">
                      {locale === "ja-JP" ? "開く" : "Open"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </PageLayoutBody>
        </>
      );
    }

    if (paneType === "linked-case") {
      return (
        <>
          <PaneHeader title={locale === "ja-JP" ? "関連案件" : "Related cases"} />
          <PageLayoutBody>
            <div style={inlineStyles.paneBody}>
              {relatedCases.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--aegis-space-small)",
                    padding: "var(--aegis-space-small)",
                    border: "1px solid var(--aegis-color-border-default)",
                    borderRadius: "var(--aegis-radius-medium)",
                  }}
                >
                  <div>
                    <Text variant="data.medium">{item.id}</Text>
                    <Text variant="body.medium.bold" numberOfLines={1}>
                      {item.title}
                    </Text>
                  </div>
                  <Tag variant="fill" color="neutral">
                    {item.status}
                  </Tag>
                  <div style={{ marginLeft: "auto" }}>
                    <Button size="small" variant="subtle">
                      {locale === "ja-JP" ? "詳細へ" : "Details"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </PageLayoutBody>
        </>
      );
    }

    if (paneType === "reference") {
      return (
        <>
          <PaneHeader title={locale === "ja-JP" ? "参考情報" : "Reference"} />
          <PageLayoutBody>
            <div style={inlineStyles.paneBody}>
              <Form>
                <FormControl>
                  <FormControl.Label>
                    {locale === "ja-JP" ? "案件キーワードで検索" : "Search by case keywords"}
                  </FormControl.Label>
                  <Textarea defaultValue={keywords.join(" ")} />
                </FormControl>
              </Form>
              <Divider />
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                {referenceLinks.map((item) => (
                  <div key={item.title}>
                    <Link href={item.url} target="_blank" rel="noreferrer">
                      {item.title}
                    </Link>
                    <Text variant="body.small" color="subtle">
                      {item.url}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </PageLayoutBody>
        </>
      );
    }

    if (paneType === "book") {
      return (
        <>
          <PaneHeader title={locale === "ja-JP" ? "参考資料" : "Reference materials"} />
          <PageLayoutBody>
            <div style={inlineStyles.paneBody}>
              <Text variant="body.medium">
                {locale === "ja-JP" ? "案件に関連する資料を一覧表示します。" : "Display materials related to the case."}
              </Text>
              <Divider />
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                <Text variant="body.small" color="subtle">
                  · {locale === "ja-JP" ? "業務委託契約の雛形" : "Service agreement template"}
                </Text>
                <Text variant="body.small" color="subtle">
                  · {locale === "ja-JP" ? "秘密保持条項の解説記事" : "Confidentiality clause guide"}
                </Text>
                <Text variant="body.small" color="subtle">
                  · {locale === "ja-JP" ? "判例・論文リンク" : "Case law and articles"}
                </Text>
              </div>
              <Button variant="subtle" width="full">
                {locale === "ja-JP" ? "新しい資料を追加" : "Add new material"}
              </Button>
            </div>
          </PageLayoutBody>
        </>
      );
    }

    return (
      <>
        <PaneHeader title={t("caseInfo")} />
        <PageLayoutBody>
          <div style={inlineStyles.paneBody}>
            <Form>
              <FormControl>
                <FormControl.Label>{t("caseType")}</FormControl.Label>
                <Select
                  value={caseType}
                  onChange={(value) => setCaseType(value)}
                  options={[
                    { label: t("contractReview"), value: "contract-review" },
                    { label: t("contractCreation"), value: "contract-creation" },
                    { label: locale === "ja-JP" ? "法務相談" : "Legal Consultation", value: "legal-consultation" },
                  ]}
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>{t("caseStatus")}</FormControl.Label>
                <Select
                  value={caseStatus}
                  onChange={(value) => setCaseStatus(value)}
                  options={[
                    { label: t("notStarted"), value: "not-started" },
                    { label: t("inProgress"), value: "in-progress" },
                    { label: t("completed"), value: "completed" },
                    { label: locale === "ja-JP" ? "保留" : "On hold", value: "on-hold" },
                  ]}
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>{t("caseOwner")}</FormControl.Label>
                <Select
                  value={caseOwner}
                  onChange={(value) => setCaseOwner(value)}
                  options={[
                    { label: locale === "ja-JP" ? "奥村" : "Okumura", value: "okumura" },
                    { label: locale === "ja-JP" ? "田中" : "Tanaka", value: "tanaka" },
                    { label: locale === "ja-JP" ? "佐藤" : "Sato", value: "sato" },
                  ]}
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>{t("subOwner")}</FormControl.Label>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
                  <Avatar size="small" name={subOwnerDisplay} />
                  <Text variant="body.medium">{subOwnerDisplay}</Text>
                </div>
              </FormControl>
              <FormControl>
                <FormControl.Label>{t("requestingDepartment")}</FormControl.Label>
                <Select
                  value={requestingDepartment}
                  onChange={(value) => setRequestingDepartment(value)}
                  options={[
                    { label: t("notEntered"), value: "not-entered" },
                    { label: locale === "ja-JP" ? "法務部" : "Legal Department", value: "legal" },
                    { label: locale === "ja-JP" ? "経営企画部" : "Planning Department", value: "planning" },
                  ]}
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>{t("requester")}</FormControl.Label>
                <Select
                  value={requester}
                  onChange={(value) => setRequester(value)}
                  options={[
                    { label: "Sho Saikaishi", value: "sho-saikaishi" },
                    { label: "Taro Yamada", value: "taro-yamada" },
                    { label: "Hanako Suzuki", value: "hanako-suzuki" },
                  ]}
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>{t("deliveryDate")}</FormControl.Label>
                <DateField value={deliveryDate} onChange={(value) => setDeliveryDate(value ?? null)} />
              </FormControl>
              <FormControl>
                <FormControl.Label>{t("saveLocation")}</FormControl.Label>
                <Text variant="body.medium">{saveLocation}</Text>
              </FormControl>
              <Button variant="subtle" width="full">
                {locale === "ja-JP" ? "案件を移動" : "Move case"}
              </Button>
              <Divider />
              <FormControl>
                <FormControl.Label>{locale === "ja-JP" ? "案件ラベル" : "Case labels"}</FormControl.Label>
                <Tag variant="outline">{keywords[0]}</Tag>
                <Tag variant="outline">{keywords[1]}</Tag>
                <Tag variant="outline">{keywords[2]}</Tag>
              </FormControl>
            </Form>
          </div>
        </PageLayoutBody>
      </>
    );
  };

  return (
    <>
      <Header>
        <Header.Item>
          <Tooltip title={t("menu")}>
            <IconButton variant="plain" aria-label={t("menu")}>
              <Icon>
                <LfMenu />
              </Icon>
            </IconButton>
          </Tooltip>
        </Header.Item>
        <Header.Item>
          <Header.Title>
            <Text variant="title.xxSmall" numberOfLines={1}>
              {caseData.title}
            </Text>
          </Header.Title>
          <Header.Description>{caseData.id}</Header.Description>
        </Header.Item>
        <Header.Spacer />
        <Header.Item>
          <Tooltip title={t("prev")}>
            <IconButton variant="plain" aria-label={t("prev")}>
              <Icon>
                <LfAngleLeftMiddle />
              </Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title={t("next")}>
            <IconButton variant="plain" aria-label={t("next")}>
              <Icon>
                <LfAngleRightMiddle />
              </Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title={t("search")}>
            <IconButton variant="plain" aria-label={t("search")}>
              <Icon>
                <LfMagnifyingGlass />
              </Icon>
            </IconButton>
          </Tooltip>
          <Select
            size="small"
            value={locale}
            onChange={(value) => setLocale(value as "ja-JP" | "en-US")}
            options={[
              { label: t("localeJapanese"), value: "ja-JP" },
              { label: t("localeEnglish"), value: "en-US" },
            ]}
            style={{ minWidth: "88px" }}
          />
        </Header.Item>
        <Header.Item style={{ flexShrink: 0 }}>
          <Popover
            placement="bottom-end"
            open={tabVerificationPopoverOpen}
            onOpenChange={setTabVerificationPopoverOpen}
          >
            <Popover.Anchor>
              <Tooltip title={t("other")}>
                <IconButton variant="plain" aria-label={t("other")}>
                  <Icon>
                    <LfEllipsisDot />
                  </Icon>
                </IconButton>
              </Tooltip>
            </Popover.Anchor>
            <Popover.Content width="small">
              <Popover.Body>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-xxSmall)",
                  }}
                >
                  <Text variant="body.small.bold">{t("tabVerification")}</Text>
                  <RadioGroup
                    value={tabVerificationMode}
                    onChange={(value) => setTabVerificationMode(value as "3tabs" | "2tabs" | "1tab")}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--aegis-space-xxSmall)",
                      }}
                    >
                      <Radio value="3tabs">{t("tabDefault")}</Radio>
                      <Radio value="2tabs">{t("tabTwo")}</Radio>
                      <Radio value="1tab">{t("tabOne")}</Radio>
                    </div>
                  </RadioGroup>
                </div>
              </Popover.Body>
            </Popover.Content>
          </Popover>
        </Header.Item>
      </Header>

      <PageLayout>
        <PageLayoutContent maxWidth="medium">
          <PageLayoutBody>
            <div style={inlineStyles.pageBody}>
              {/* 依頼内容セクション */}
              <section style={inlineStyles.card}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "var(--aegis-space-medium)",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                    <Text variant="body.small" color="subtle">
                      {caseData.id}
                    </Text>
                    <Text variant="body.large.bold">{caseData.title}</Text>
                  </div>
                  <Button
                    leading={
                      <Icon>
                        <LfPen />
                      </Icon>
                    }
                    variant="subtle"
                    size="small"
                  >
                    {t("edit")}
                  </Button>
                </div>
                <div style={inlineStyles.requestContent}>
                  <Text variant="body.medium.bold" style={{ marginBottom: "var(--aegis-space-small)" }}>
                    {t("requestContent")}
                  </Text>
                  <div style={{ position: "relative" }}>
                    <Text variant="body.medium" whiteSpace="pre-wrap">
                      {showAllContent ? caseData.requestContent : `${caseData.requestContent.substring(0, 100)}...`}
                    </Text>
                    {!showAllContent && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Link
                          onClick={() => {
                            setShowAllContent(true);
                          }}
                          trailing={
                            <Icon>
                              <LfAngleDownMiddle />
                            </Icon>
                          }
                          style={{ color: "var(--aegis-color-text-subtle)" }}
                        >
                          {t("showAll")}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* タイムライン公開・非公開タブ */}
              <PageLayoutStickyContainer>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "var(--aegis-space-small)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--aegis-space-xxSmall)",
                    }}
                  >
                    <Tab.Group
                      key={tabVerificationMode}
                      defaultIndex={
                        tabVerificationMode === "1tab"
                          ? 0
                          : tabVerificationMode === "2tabs"
                            ? activeTab === "public"
                              ? 1
                              : 0
                            : activeTab === "all"
                              ? 0
                              : activeTab === "public"
                                ? 1
                                : 2
                      }
                      onChange={(index) => {
                        if (tabVerificationMode === "1tab") {
                          setActiveTab("all");
                        } else if (tabVerificationMode === "2tabs") {
                          setActiveTab(index === 0 ? "all" : "public");
                        } else {
                          const tabs: TabType[] = ["all", "public", "private"];
                          setActiveTab(tabs[index] ?? "all");
                        }
                      }}
                    >
                      <Tab.List>
                        <Tab>{t("tabAll")}</Tab>
                        {tabVerificationMode !== "1tab" && <Tab>{t("tabPublic")}</Tab>}
                        {tabVerificationMode === "3tabs" && <Tab>{t("tabPrivate")}</Tab>}
                      </Tab.List>
                    </Tab.Group>
                    <Popover
                      placement="bottom-start"
                      open={sharedUsersPopoverOpen}
                      onOpenChange={setSharedUsersPopoverOpen}
                    >
                      <Popover.Anchor>
                        <Tooltip title={t("sharedUsers")}>
                          <IconButton
                            variant="plain"
                            size="xSmall"
                            aria-label={t("sharedUsers")}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Icon size="xSmall">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ display: "block" }}
                                role="img"
                                aria-label={t("sharedUsers")}
                              >
                                <path
                                  d="M11.7904 11.3567V14H10.9237V11.3567C10.9237 10.2033 9.98706 9.26667 8.83372 9.26667H7.16706C6.01372 9.26667 5.07706 10.2033 5.07706 11.3567V14H4.21039V11.3567C4.21039 9.72667 5.53706 8.4 7.16706 8.4H8.83372C10.4637 8.4 11.7904 9.72667 11.7904 11.3567ZM13.6004 5.25C13.6004 4.09333 12.6571 3.15 11.5004 3.15V4.01667C12.1804 4.01667 12.7337 4.57 12.7337 5.25C12.7337 5.93 12.1804 6.48333 11.5004 6.48333V7.35C12.6571 7.35 13.6004 6.40667 13.6004 5.25ZM11.5004 7.95667V8.82333C12.2071 8.82333 13.2337 9.86667 13.2337 11.5V12.6667H14.1004V11.5C14.1004 9.41333 12.7304 7.95667 11.5004 7.95667ZM4.50039 7.35V6.48333C3.82039 6.48333 3.26706 5.93 3.26706 5.25C3.26706 4.57 3.82039 4.01667 4.50039 4.01667V3.15C3.34372 3.15 2.40039 4.09333 2.40039 5.25C2.40039 6.40667 3.34372 7.35 4.50039 7.35ZM4.50039 7.95667C3.27039 7.95667 1.90039 9.41333 1.90039 11.5V12.6667H2.76706V11.5C2.76706 9.86667 3.79372 8.82333 4.50039 8.82333V7.95667ZM5.08372 4.91667C5.08372 3.30667 6.39039 2 8.00039 2C9.61039 2 10.9171 3.30667 10.9171 4.91667C10.9171 6.52667 9.61039 7.83333 8.00039 7.83333C6.39039 7.83333 5.08372 6.52667 5.08372 4.91667ZM5.95039 4.91667C5.95039 6.04667 6.87039 6.96667 8.00039 6.96667C9.13039 6.96667 10.0504 6.04667 10.0504 4.91667C10.0504 3.78667 9.13039 2.86667 8.00039 2.86667C6.87039 2.86667 5.95039 3.78667 5.95039 4.91667Z"
                                  fill="#2E2E2E"
                                />
                              </svg>
                            </Icon>
                          </IconButton>
                        </Tooltip>
                      </Popover.Anchor>
                      <Popover.Content width="large">
                        <Popover.Header>
                          <ContentHeader size="small">
                            <ContentHeader.Title>{t("sharedUsersTitle")}</ContentHeader.Title>
                          </ContentHeader>
                        </Popover.Header>
                        <Popover.Body>
                          <div style={inlineStyles.popoverSection}>
                            <Text variant="body.medium">{t("sharedUsersDesc")}</Text>
                            <div style={inlineStyles.licenseContainer}>
                              <div style={inlineStyles.licenseSection}>
                                <Text variant="body.medium.bold">{t("standardLicense")}</Text>
                                <Text variant="body.small" color="subtle">
                                  {t("publicOnlyAccess")}
                                </Text>
                                <div style={inlineStyles.userList}>
                                  {sharedUsersState.standard.map((user) => (
                                    <div key={user.name} style={inlineStyles.userItem}>
                                      <Avatar size="xSmall" name={user.name} />
                                      <Text variant="body.medium">{user.name}</Text>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <Divider orientation="vertical" />
                              <div style={inlineStyles.licenseSection}>
                                <Text variant="body.medium.bold">{t("proLicense")}</Text>
                                <Text variant="body.small" color="subtle">
                                  {t("publicPrivateAccess")}
                                </Text>
                                <div style={inlineStyles.userList}>
                                  {sharedUsersState.pro.map((user) => (
                                    <div key={user.name} style={inlineStyles.userItem}>
                                      <Avatar size="xSmall" name={user.name} />
                                      <Text variant="body.medium">{user.name}</Text>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="subtle"
                              size="small"
                              width="full"
                              onClick={() => {
                                setSharedUsersPopoverOpen(false);
                                setSharedUsersDialogOpen(true);
                              }}
                            >
                              {t("configureSharedUsers")}
                            </Button>
                          </div>
                        </Popover.Body>
                      </Popover.Content>
                    </Popover>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "var(--aegis-space-xSmall)",
                      alignItems: "center",
                    }}
                  >
                    <Popover placement="bottom-end">
                      <Popover.Anchor>
                        <Tooltip title={t("displaySettings")}>
                          <IconButton variant="plain" size="small" aria-label={t("displaySettings")}>
                            <Icon>
                              <LfFilter />
                            </Icon>
                          </IconButton>
                        </Tooltip>
                      </Popover.Anchor>
                      <Popover.Content width="small">
                        <Popover.Body>
                          <div style={inlineStyles.popoverContent}>
                            <Checkbox
                              checked={displaySettings.allSelected}
                              onChange={(e) => {
                                handleDisplaySettingsChange("allSelected", e.target.checked);
                              }}
                            >
                              {t("selectAll")}
                            </Checkbox>
                            <Divider />
                            <Checkbox
                              checked={displaySettings.loMessage}
                              onChange={(e) => {
                                handleDisplaySettingsChange("loMessage", e.target.checked);
                              }}
                            >
                              {t("loMessage")}
                            </Checkbox>
                            <Checkbox
                              checked={displaySettings.slack}
                              onChange={(e) => {
                                handleDisplaySettingsChange("slack", e.target.checked);
                              }}
                            >
                              {t("slack")}
                            </Checkbox>
                            <Checkbox
                              checked={displaySettings.teams}
                              onChange={(e) => {
                                handleDisplaySettingsChange("teams", e.target.checked);
                              }}
                            >
                              {t("teams")}
                            </Checkbox>
                            <Checkbox
                              checked={displaySettings.mail}
                              onChange={(e) => {
                                handleDisplaySettingsChange("mail", e.target.checked);
                              }}
                            >
                              {t("mail")}
                            </Checkbox>
                            <Checkbox
                              checked={displaySettings.activeHistory}
                              onChange={(e) => {
                                handleDisplaySettingsChange("activeHistory", e.target.checked);
                              }}
                            >
                              {t("activeHistory")}
                            </Checkbox>
                          </div>
                        </Popover.Body>
                      </Popover.Content>
                    </Popover>
                    <Menu placement="bottom-end">
                      <Menu.Anchor>
                        <Button
                          variant="solid"
                          size="small"
                          leading={
                            <Icon>
                              <LfPlusLarge />
                            </Icon>
                          }
                          trailing={
                            <Icon>
                              <LfAngleDownMiddle />
                            </Icon>
                          }
                        >
                          {t("new")}
                        </Button>
                      </Menu.Anchor>
                      <Menu.Box>
                        <ActionList>
                          <ActionList.Item
                            onClick={() => {
                              setMailComposeOpen(true);
                            }}
                          >
                            <ActionList.Body
                              leading={
                                <Icon>
                                  <LfMail />
                                </Icon>
                              }
                            >
                              {t("createNewMail")}
                            </ActionList.Body>
                          </ActionList.Item>
                          <ActionList.Item
                            onClick={() => {
                              setSlackDialogOpen(true);
                            }}
                          >
                            <ActionList.Body leading={<Logo source={SlackLogo} size="small" />}>
                              {t("createSlackThread")}
                            </ActionList.Body>
                          </ActionList.Item>
                          <ActionList.Item
                            onClick={() => {
                              setTeamsDialogOpen(true);
                            }}
                          >
                            <ActionList.Body leading={<MicrosoftTeamsIcon size={16} />}>
                              {t("createTeamsThread")}
                            </ActionList.Body>
                          </ActionList.Item>
                        </ActionList>
                      </Menu.Box>
                    </Menu>
                  </div>
                </div>
              </PageLayoutStickyContainer>

              {/* メッセージ入力エリア */}
              <div style={inlineStyles.messageForm}>
                <div style={inlineStyles.messageToolbar}>
                  <Tooltip title={t("bold")}>
                    <IconButton variant="plain" size="small" aria-label={t("bold")}>
                      <Text variant="body.medium.bold">B</Text>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t("italic")}>
                    <IconButton variant="plain" size="small" aria-label={t("italic")}>
                      <Text variant="body.medium" style={{ fontStyle: "italic" }}>
                        I
                      </Text>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t("underline")}>
                    <IconButton variant="plain" size="small" aria-label={t("underline")}>
                      <Text variant="body.medium" style={{ textDecoration: "underline" }}>
                        U
                      </Text>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t("list")}>
                    <IconButton variant="plain" size="small" aria-label={t("list")}>
                      <Icon>
                        <LfList />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t("mention")}>
                    <IconButton variant="plain" size="small" aria-label={t("mention")}>
                      <Icon>
                        <LfAt />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                </div>
                <Textarea
                  placeholder={t("messagePlaceholder")}
                  value={currentMessageValue}
                  onChange={(event) => {
                    handleMessageChange(event.target.value);
                  }}
                  minRows={4}
                />
                <div style={inlineStyles.messageActions}>
                  <div style={inlineStyles.messageActionsLeft}>
                    <Tooltip title={t("attachFile")}>
                      <IconButton variant="plain" size="small" aria-label={t("attachFile")}>
                        <Icon>
                          <LfClip />
                        </Icon>
                      </IconButton>
                    </Tooltip>
                  </div>
                  <div style={inlineStyles.messageActionsRight}>
                    {activeTab === "all" && (
                      <Popover placement="bottom-start">
                        <Popover.Anchor>
                          <Button
                            variant="subtle"
                            size="small"
                            trailing={
                              <Icon>
                                <LfAngleDownMiddle />
                              </Icon>
                            }
                          >
                            {visibilitySetting === "private" ? t("visibilityPrivate") : t("visibilityPublic")}
                          </Button>
                        </Popover.Anchor>
                        <Popover.Content width="medium">
                          <Popover.Body>
                            <div style={inlineStyles.popoverSection}>
                              <div>
                                <Text variant="body.medium.bold">{t("visibilitySettingTitle")}</Text>
                                <RadioGroup
                                  value={visibilitySetting}
                                  onChange={(value) => {
                                    setVisibilitySetting(value as "public" | "private");
                                  }}
                                >
                                  <Radio value="private">{t("visibilityPrivateDesc")}</Radio>
                                  <Radio value="public">{t("visibilityPublicDesc")}</Radio>
                                </RadioGroup>
                              </div>
                            </div>
                          </Popover.Body>
                        </Popover.Content>
                      </Popover>
                    )}
                    <Button
                      variant="solid"
                      disabled={currentMessageValue.trim().length === 0}
                      onClick={handleSendMessage}
                    >
                      {activeTab === "public"
                        ? t("sendAsPublic")
                        : activeTab === "private"
                          ? t("sendAsPrivate")
                          : t("send")}
                    </Button>
                  </div>
                </div>
              </div>

              {/* コメント/履歴セクション */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-medium)",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-x3Large)" }}>
                  {selectedThreadId
                    ? // スレッドが選択されている場合は詳細表示（1回だけ表示）
                      (() => {
                        const threadComments = commentsState
                          .filter((c) => c.threadId === selectedThreadId)
                          .sort((a, b) => {
                            if (!a.parentId) return -1;
                            if (!b.parentId) return 1;
                            return b.date.localeCompare(a.date);
                          });
                        const rootThreadComment = threadComments.find((c) => !c.parentId) || threadComments[0];
                        const threadTitle =
                          threadTitles[selectedThreadId] ||
                          rootThreadComment?.subject ||
                          rootThreadComment?.content.substring(0, 50) ||
                          "";

                        return (
                          <div
                            key={selectedThreadId}
                            style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}
                          >
                            {/* メールスレッド選択時のヘッダー */}
                            {rootThreadComment?.type === "mail" && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: "var(--aegis-space-small)",
                                  paddingBottom: "var(--aegis-space-small)",
                                  borderBottom: "1px solid var(--aegis-color-border-default)",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "var(--aegis-space-xSmall)",
                                    flex: 1,
                                    minWidth: 0,
                                  }}
                                >
                                  <Tooltip title={t("backToThreads")}>
                                    <IconButton
                                      variant="plain"
                                      size="small"
                                      aria-label={t("backToThreads")}
                                      onClick={() => {
                                        setSelectedThreadId(null);
                                        setMessageViewType("threads");
                                      }}
                                    >
                                      <Icon>
                                        <LfAngleLeftMiddle />
                                      </Icon>
                                    </IconButton>
                                  </Tooltip>
                                  <Text variant="body.medium.bold" numberOfLines={1} style={{ flex: 1, minWidth: 0 }}>
                                    {threadTitle}
                                  </Text>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "var(--aegis-space-xSmall)",
                                    flexShrink: 0,
                                  }}
                                >
                                  <Select
                                    size="small"
                                    value={rootThreadComment.visibility}
                                    onChange={(value) => {
                                      handleCommentVisibilityChange(
                                        rootThreadComment.id,
                                        value as "public" | "private",
                                      );
                                    }}
                                    options={[
                                      { label: t("visibilityPublic"), value: "public" },
                                      { label: t("visibilityPrivate"), value: "private" },
                                    ]}
                                  />
                                  <Popover
                                    open={mailThreadPopoverOpen[selectedThreadId] || false}
                                    onOpenChange={(open) => {
                                      setMailThreadPopoverOpen((prev) => ({
                                        ...prev,
                                        [selectedThreadId]: open,
                                      }));
                                    }}
                                    placement="bottom-end"
                                  >
                                    <Popover.Anchor>
                                      <Tooltip title={t("viewAllMailsInThread")}>
                                        <IconButton variant="plain" size="small" aria-label={t("viewAllMailsInThread")}>
                                          <Icon>
                                            <LfList />
                                          </Icon>
                                        </IconButton>
                                      </Tooltip>
                                    </Popover.Anchor>
                                    <Popover.Content width="large">
                                      <Popover.Body>
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "var(--aegis-space-medium)",
                                          }}
                                        >
                                          <Text variant="body.medium.bold">{t("viewAllMailsInThread")}</Text>
                                          <Divider />
                                          {/* このスレッド */}
                                          <div
                                            style={{
                                              display: "flex",
                                              flexDirection: "column",
                                              gap: "var(--aegis-space-small)",
                                            }}
                                          >
                                            {(() => {
                                              const mailComments = threadComments.filter((c) => c.type === "mail");
                                              const participants = Array.from(
                                                new Set(mailComments.map((c) => c.user)),
                                              ).slice(0, 5);
                                              const replyCount = mailComments.filter((c) => c.parentId).length;
                                              const lastUpdated =
                                                mailComments[mailComments.length - 1]?.date || rootThreadComment.date;
                                              const threadTitleForPopover =
                                                rootThreadComment.subject || rootThreadComment.content.substring(0, 50);

                                              return (
                                                <button
                                                  type="button"
                                                  style={{
                                                    padding: "var(--aegis-space-small)",
                                                    borderRadius: "var(--aegis-radius-small)",
                                                    backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
                                                    border: "1px solid var(--aegis-color-border-default)",
                                                    cursor: "pointer",
                                                    width: "100%",
                                                    textAlign: "left",
                                                  }}
                                                  onClick={() => {
                                                    // 既に選択されているスレッドなので何もしない
                                                  }}
                                                >
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      alignItems: "flex-start",
                                                      gap: "var(--aegis-space-small)",
                                                    }}
                                                  >
                                                    <div
                                                      style={{
                                                        flex: 1,
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: "var(--aegis-space-xxSmall)",
                                                      }}
                                                    >
                                                      <Text variant="body.medium" numberOfLines={2}>
                                                        {threadTitleForPopover}
                                                        {!rootThreadComment.subject &&
                                                        rootThreadComment.content.length > 50
                                                          ? "..."
                                                          : ""}
                                                      </Text>
                                                      <Text variant="body.small" color="subtle">
                                                        {participants.join(", ")}
                                                        {participants.length < mailComments.length ? "..." : ""}
                                                      </Text>
                                                      <div
                                                        style={{
                                                          display: "flex",
                                                          alignItems: "center",
                                                          gap: "var(--aegis-space-xSmall)",
                                                          flexWrap: "wrap",
                                                        }}
                                                      >
                                                        {replyCount > 0 && (
                                                          <Tag variant="fill" color="blue" size="small">
                                                            {replyCount}
                                                            {t("replyCount")}
                                                          </Tag>
                                                        )}
                                                        <Text variant="body.small" color="subtle">
                                                          {t("lastUpdated")} {lastUpdated}
                                                        </Text>
                                                      </div>
                                                    </div>
                                                    <div
                                                      style={{
                                                        display: "flex",
                                                        alignItems: "flex-start",
                                                        gap: "var(--aegis-space-xSmall)",
                                                        flexShrink: 0,
                                                      }}
                                                    >
                                                      <Select
                                                        size="small"
                                                        value={rootThreadComment.visibility}
                                                        onChange={(value) => {
                                                          handleCommentVisibilityChange(
                                                            rootThreadComment.id,
                                                            value as "public" | "private",
                                                          );
                                                        }}
                                                        options={[
                                                          { label: t("visibilityPublic"), value: "public" },
                                                          { label: t("visibilityPrivate"), value: "private" },
                                                        ]}
                                                      />
                                                    </div>
                                                  </div>
                                                </button>
                                              );
                                            })()}
                                          </div>
                                          {/* 関連スレッド */}
                                          {(() => {
                                            // 関連スレッドを表示: 角田さん（3ヶ月後）、松村さん
                                            const relatedThreadIds = [
                                              "thread-mail-kakuda-3months",
                                              "thread-mail-matsumura",
                                            ].filter((id) => id !== selectedThreadId);

                                            const relatedMailThreads = relatedThreadIds
                                              .map((id) => {
                                                const threadGroup = threadGroups.find(([tid]) => tid === id);
                                                return threadGroup ? [id, threadGroup[1]] : null;
                                              })
                                              .filter((item): item is [string, Comment[]] => item !== null);

                                            if (relatedMailThreads.length === 0) return null;

                                            return (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  gap: "var(--aegis-space-small)",
                                                }}
                                              >
                                                {relatedMailThreads.map(([relatedThreadId, relatedComments]) => {
                                                  const relatedRootComment =
                                                    relatedComments.find((c) => !c.parentId) || relatedComments[0];
                                                  const relatedReplyCount = relatedComments.length - 1;
                                                  const relatedLastUpdated =
                                                    relatedComments[relatedComments.length - 1]?.date ||
                                                    relatedRootComment.date;
                                                  const relatedParticipants = Array.from(
                                                    new Set(relatedComments.map((c) => c.user)),
                                                  ).slice(0, 5);
                                                  const relatedVisibility = relatedRootComment.visibility;
                                                  const relatedThreadTitle =
                                                    threadTitles[relatedThreadId] ||
                                                    relatedRootComment.content.substring(0, 50);

                                                  return (
                                                    <button
                                                      key={relatedThreadId}
                                                      type="button"
                                                      style={{
                                                        padding: "var(--aegis-space-small)",
                                                        borderRadius: "var(--aegis-radius-small)",
                                                        backgroundColor: "transparent",
                                                        border: "1px solid transparent",
                                                        cursor: "pointer",
                                                        width: "100%",
                                                        textAlign: "left",
                                                      }}
                                                      onClick={() => {
                                                        setSelectedThreadId(relatedThreadId);
                                                        setMessageViewType("threads");
                                                        setMailThreadPopoverOpen((prev) => ({
                                                          ...prev,
                                                          [selectedThreadId]: false,
                                                        }));
                                                      }}
                                                    >
                                                      <div
                                                        style={{
                                                          display: "flex",
                                                          alignItems: "flex-start",
                                                          gap: "var(--aegis-space-small)",
                                                        }}
                                                      >
                                                        <div
                                                          style={{
                                                            flex: 1,
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            gap: "var(--aegis-space-xxSmall)",
                                                          }}
                                                        >
                                                          <Text variant="body.small.bold" color="subtle">
                                                            {threadTitles[relatedThreadId] || t("requestDetails")}
                                                          </Text>
                                                          <Text variant="body.medium" numberOfLines={2}>
                                                            {relatedThreadTitle}
                                                            {!threadTitles[relatedThreadId] &&
                                                            relatedRootComment.content.length > 50
                                                              ? "..."
                                                              : ""}
                                                          </Text>
                                                          <Text variant="body.small" color="subtle">
                                                            {relatedParticipants.join(", ")}
                                                            {relatedParticipants.length < relatedComments.length
                                                              ? "..."
                                                              : ""}
                                                          </Text>
                                                          <div
                                                            style={{
                                                              display: "flex",
                                                              alignItems: "center",
                                                              gap: "var(--aegis-space-xSmall)",
                                                              flexWrap: "wrap",
                                                            }}
                                                          >
                                                            {relatedReplyCount > 0 && (
                                                              <Tag variant="fill" color="blue" size="small">
                                                                {relatedReplyCount}
                                                                {t("replyCount")}
                                                              </Tag>
                                                            )}
                                                            <Text variant="body.small" color="subtle">
                                                              {t("lastUpdated")} {relatedLastUpdated}
                                                            </Text>
                                                          </div>
                                                        </div>
                                                        <div
                                                          style={{
                                                            display: "flex",
                                                            alignItems: "flex-start",
                                                            gap: "var(--aegis-space-xSmall)",
                                                            flexShrink: 0,
                                                          }}
                                                        >
                                                          <Select
                                                            size="small"
                                                            value={relatedVisibility}
                                                            onChange={(value) => {
                                                              handleCommentVisibilityChange(
                                                                relatedRootComment.id,
                                                                value as "public" | "private",
                                                              );
                                                            }}
                                                            options={[
                                                              { label: t("visibilityPublic"), value: "public" },
                                                              { label: t("visibilityPrivate"), value: "private" },
                                                            ]}
                                                          />
                                                        </div>
                                                      </div>
                                                    </button>
                                                  );
                                                })}
                                              </div>
                                            );
                                          })()}
                                        </div>
                                      </Popover.Body>
                                    </Popover.Content>
                                  </Popover>
                                </div>
                              </div>
                            )}
                            {/* スレッドコメント一覧 */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
                              {threadComments.map((threadComment) => {
                                const renderMessageIcon = () => {
                                  switch (threadComment.type) {
                                    case "lo-message":
                                      return (
                                        <Icon size="small" color="subtle">
                                          <LfComment />
                                        </Icon>
                                      );
                                    case "slack":
                                      return (
                                        <div style={inlineStyles.messageTypeIcon}>
                                          <Logo source={SlackLogo} size="small" />
                                        </div>
                                      );
                                    case "teams":
                                      return (
                                        <div style={inlineStyles.messageTypeIcon}>
                                          <MicrosoftTeamsIcon size={16} />
                                        </div>
                                      );
                                    case "mail":
                                      return (
                                        <Icon size="small" color="subtle">
                                          <LfMail />
                                        </Icon>
                                      );
                                    case "active-history":
                                      return (
                                        <Icon size="small" color="subtle">
                                          <LfArrowsRotate />
                                        </Icon>
                                      );
                                    default:
                                      return null;
                                  }
                                };

                                return (
                                  <div
                                    key={threadComment.id}
                                    style={{
                                      ...inlineStyles.commentWithIcon,
                                      marginLeft: threadComment.parentId ? "var(--aegis-space-large)" : 0,
                                      paddingLeft: threadComment.parentId ? "var(--aegis-space-medium)" : 0,
                                      borderLeft: threadComment.parentId
                                        ? "2px solid var(--aegis-color-border-default)"
                                        : "none",
                                    }}
                                  >
                                    {renderMessageIcon()}
                                    <div style={{ flex: 1 }}>
                                      <div style={inlineStyles.commentItem}>
                                        <div style={inlineStyles.commentHeader}>
                                          <div style={inlineStyles.commentUserInfo}>
                                            <Avatar size="small" name={threadComment.user} />
                                            <Text variant="body.medium">{threadComment.user}</Text>
                                            <Text variant="body.small" color="subtle">
                                              {threadComment.date}
                                            </Text>
                                            {threadComment.channel && (
                                              <Text variant="body.small" color="subtle">
                                                {threadComment.channel}
                                              </Text>
                                            )}
                                          </div>
                                          <div style={inlineStyles.commentActions}>
                                            <Tooltip title={t("other")}>
                                              <IconButton variant="plain" size="small" aria-label={t("other")}>
                                                <Icon>
                                                  <LfEllipsisDot />
                                                </Icon>
                                              </IconButton>
                                            </Tooltip>
                                          </div>
                                        </div>
                                        {threadComment.subject && (
                                          <Text variant="body.medium.bold">{threadComment.subject}</Text>
                                        )}
                                        <Text variant="body.medium" whiteSpace="pre-wrap">
                                          {threadComment.content}
                                        </Text>
                                        {/* メッセージタイプ別の添付ファイル風表示 */}
                                        {threadComment.hasAttachment && (
                                          <div
                                            style={{
                                              marginTop: "var(--aegis-space-medium)",
                                              padding: "var(--aegis-space-medium)",
                                              backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
                                              borderRadius: "var(--aegis-radius-medium)",
                                              border: "1px solid var(--aegis-color-border-default)",
                                            }}
                                          >
                                            <Text
                                              variant="body.small.bold"
                                              style={{ marginBottom: "var(--aegis-space-small)" }}
                                            >
                                              {t("attachment")}
                                            </Text>
                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "var(--aegis-space-small)",
                                                padding: "var(--aegis-space-small)",
                                                backgroundColor: "var(--aegis-color-surface-default)",
                                                borderRadius: "var(--aegis-radius-small)",
                                                border: "1px solid var(--aegis-color-border-default)",
                                              }}
                                            >
                                              {(() => {
                                                const typeLabels: Record<MessageType, string> = {
                                                  "lo-message": t("loMessage"),
                                                  slack: t("slack"),
                                                  teams: t("teams"),
                                                  mail: t("mail"),
                                                  "active-history": t("activeHistory"),
                                                };
                                                const typeIcons: Record<MessageType, React.ReactElement> = {
                                                  "lo-message": (
                                                    <Icon size="medium">
                                                      <LfComment />
                                                    </Icon>
                                                  ),
                                                  slack: <Logo source={SlackLogo} size="medium" />,
                                                  teams: <MicrosoftTeamsIcon size={24} />,
                                                  mail: (
                                                    <Icon size="medium">
                                                      <LfMail />
                                                    </Icon>
                                                  ),
                                                  "active-history": (
                                                    <Icon size="medium">
                                                      <LfArrowsRotate />
                                                    </Icon>
                                                  ),
                                                };
                                                return (
                                                  <>
                                                    {typeIcons[threadComment.type]}
                                                    <div style={{ flex: 1 }}>
                                                      <Text variant="body.medium">
                                                        {typeLabels[threadComment.type]}
                                                        {threadComment.channel ? ` - ${threadComment.channel}` : ""}
                                                        {threadComment.subject ? ` - ${threadComment.subject}` : ""}
                                                      </Text>
                                                      <Text variant="body.small" color="subtle">
                                                        {threadComment.user} • {threadComment.date}
                                                      </Text>
                                                    </div>
                                                    <Button
                                                      variant="subtle"
                                                      size="small"
                                                      trailing={
                                                        <Icon>
                                                          <LfAngleDownMiddle />
                                                        </Icon>
                                                      }
                                                    >
                                                      {t("download")}
                                                    </Button>
                                                  </>
                                                );
                                              })()}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()
                    : // スレッドが選択されていない場合の通常表示
                      filteredComments.map((comment) => {
                        // スレッドビューの場合、スレッドカードとして表示（LOメッセージは除外）
                        if (messageViewType === "threads" && comment.threadId && comment.type !== "lo-message") {
                          const threadId = comment.threadId;
                          const allThreadComments = commentsState
                            .filter((c) => c.threadId === threadId)
                            .sort((a, b) => {
                              if (!a.parentId) return -1;
                              if (!b.parentId) return 1;
                              return b.date.localeCompare(a.date);
                            });
                          // ルートコメントを取得（最古の日付のルートコメントを優先）
                          const rootComments = allThreadComments.filter((c) => !c.parentId);
                          const rootComment =
                            rootComments.length > 0
                              ? rootComments.sort((a, b) => a.date.localeCompare(b.date))[0]
                              : allThreadComments[0];
                          const isContentExpanded = expandedMessageContent.has(rootComment.id);
                          const isThreadExpanded = expandedThreads.has(threadId);
                          const replyComments = allThreadComments.filter((c) => c.id !== rootComment.id);

                          // LOメッセージスレッド：テンプレート「message」スタイル（左Avatar + eventBody）
                          if (rootComment.type === "lo-message") {
                            const isCurrentUser = rootComment.user === currentUserName;
                            return (
                              <div
                                key={comment.id}
                                style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}
                              >
                                <div style={inlineStyles.timelineEvent}>
                                  <Avatar size="xSmall" name={rootComment.user} />
                                  <div style={inlineStyles.eventBody}>
                                    <div style={inlineStyles.eventHeader}>
                                      <Text variant="body.medium.bold">{rootComment.user}</Text>
                                      <div style={inlineStyles.eventMeta}>
                                        <Text variant="body.small" color="subtle">
                                          {rootComment.date}
                                        </Text>
                                        <Select
                                          size="small"
                                          value={rootComment.visibility}
                                          onChange={(value) => {
                                            handleCommentVisibilityChange(
                                              rootComment.id,
                                              value as "public" | "private",
                                            );
                                          }}
                                          options={[
                                            { label: t("visibilityPublic"), value: "public" },
                                            { label: t("visibilityPrivate"), value: "private" },
                                          ]}
                                        />
                                        {isCurrentUser && (
                                          <Menu placement="bottom-end">
                                            <Menu.Anchor>
                                              <Tooltip title={t("other")}>
                                                <IconButton variant="plain" size="small" aria-label={t("other")}>
                                                  <Icon>
                                                    <LfEllipsisDot />
                                                  </Icon>
                                                </IconButton>
                                              </Tooltip>
                                            </Menu.Anchor>
                                            <Menu.Box width="xSmall">
                                              <ActionList>
                                                <ActionList.Group>
                                                  <ActionList.Item
                                                    onClick={() => {
                                                      console.log("編集", rootComment.id);
                                                    }}
                                                  >
                                                    <ActionList.Body
                                                      leading={
                                                        <Icon>
                                                          <LfPen />
                                                        </Icon>
                                                      }
                                                    >
                                                      {t("edit")}
                                                    </ActionList.Body>
                                                  </ActionList.Item>
                                                </ActionList.Group>
                                                <ActionList.Group>
                                                  <ActionList.Item
                                                    onClick={() => {
                                                      setCommentsState((prev) =>
                                                        prev.filter((c) => c.id !== rootComment.id),
                                                      );
                                                    }}
                                                    color="danger"
                                                  >
                                                    <ActionList.Body
                                                      leading={
                                                        <Icon>
                                                          <LfTrash />
                                                        </Icon>
                                                      }
                                                    >
                                                      {t("delete")}
                                                    </ActionList.Body>
                                                  </ActionList.Item>
                                                </ActionList.Group>
                                              </ActionList>
                                            </Menu.Box>
                                          </Menu>
                                        )}
                                      </div>
                                    </div>
                                    {rootComment.subject && (
                                      <Text variant="body.medium.bold">{rootComment.subject}</Text>
                                    )}
                                    <Text variant="body.medium" whiteSpace="pre-wrap">
                                      {rootComment.content}
                                    </Text>
                                  </div>
                                </div>

                                {/* スレッドの返信を表示 */}
                                {isThreadExpanded && replyComments.length > 0 && (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "var(--aegis-space-medium)",
                                      paddingTop: "var(--aegis-space-medium)",
                                      borderTop: "1px solid var(--aegis-color-border-default)",
                                    }}
                                  >
                                    {replyComments.map((replyComment) => {
                                      const isReplyCurrentUser = replyComment.user === currentUserName;
                                      return (
                                        <div
                                          key={replyComment.id}
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "var(--aegis-space-small)",
                                          }}
                                        >
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "space-between",
                                              gap: "var(--aegis-space-small)",
                                              minWidth: 0,
                                            }}
                                          >
                                            <div style={{ ...inlineStyles.commentUserInfo, flex: 1, minWidth: 0 }}>
                                              <Avatar size="small" name={replyComment.user} />
                                              <Text variant="body.medium">{replyComment.user}</Text>
                                              <Text variant="body.small" color="subtle">
                                                {replyComment.date}
                                              </Text>
                                            </div>
                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "var(--aegis-space-xSmall)",
                                                flexShrink: 0,
                                              }}
                                            >
                                              <Select
                                                size="small"
                                                value={replyComment.visibility}
                                                onChange={(value) => {
                                                  handleCommentVisibilityChange(
                                                    replyComment.id,
                                                    value as "public" | "private",
                                                  );
                                                }}
                                                options={[
                                                  { label: t("visibilityPublic"), value: "public" },
                                                  { label: t("visibilityPrivate"), value: "private" },
                                                ]}
                                              />
                                              {isReplyCurrentUser ? (
                                                <Menu placement="bottom-end">
                                                  <Menu.Anchor>
                                                    <Tooltip title={t("other")}>
                                                      <IconButton variant="plain" size="small" aria-label={t("other")}>
                                                        <Icon>
                                                          <LfEllipsisDot />
                                                        </Icon>
                                                      </IconButton>
                                                    </Tooltip>
                                                  </Menu.Anchor>
                                                  <Menu.Box width="xSmall">
                                                    <ActionList>
                                                      <ActionList.Group>
                                                        <ActionList.Item
                                                          onClick={() => {
                                                            // 編集処理
                                                            console.log("編集", replyComment.id);
                                                          }}
                                                        >
                                                          <ActionList.Body
                                                            leading={
                                                              <Icon>
                                                                <LfPen />
                                                              </Icon>
                                                            }
                                                          >
                                                            編集
                                                          </ActionList.Body>
                                                        </ActionList.Item>
                                                      </ActionList.Group>
                                                      <ActionList.Group>
                                                        <ActionList.Item
                                                          onClick={() => {
                                                            // 削除処理
                                                            setCommentsState((prev) =>
                                                              prev.filter((c) => c.id !== replyComment.id),
                                                            );
                                                          }}
                                                          color="danger"
                                                        >
                                                          <ActionList.Body
                                                            leading={
                                                              <Icon>
                                                                <LfTrash />
                                                              </Icon>
                                                            }
                                                          >
                                                            削除
                                                          </ActionList.Body>
                                                        </ActionList.Item>
                                                      </ActionList.Group>
                                                    </ActionList>
                                                  </Menu.Box>
                                                </Menu>
                                              ) : (
                                                <div
                                                  style={{
                                                    width: "var(--aegis-size-x3Large)",
                                                    height: "var(--aegis-size-x3Large)",
                                                  }}
                                                />
                                              )}
                                            </div>
                                          </div>
                                          <Text variant="body.medium" whiteSpace="pre-wrap">
                                            {replyComment.content}
                                          </Text>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {/* 返信数を表示（カードの左下） */}
                                {allThreadComments.length > 1 && (
                                  <Button
                                    variant="gutterless"
                                    onClick={() => {
                                      setExpandedThreads((prev) => {
                                        const next = new Set(prev);
                                        if (next.has(threadId)) {
                                          next.delete(threadId);
                                        } else {
                                          next.add(threadId);
                                        }
                                        return next;
                                      });
                                    }}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "var(--aegis-space-xxSmall)",
                                      marginTop: "var(--aegis-space-small)",
                                      padding: 0,
                                      alignSelf: "flex-start",
                                    }}
                                  >
                                    <Icon size="xSmall">
                                      {isThreadExpanded ? <LfAngleDownMiddle /> : <LfAngleRightMiddle />}
                                    </Icon>
                                    <Text variant="body.small" color="subtle">
                                      {isThreadExpanded
                                        ? t("close")
                                        : `${allThreadComments.length - 1}${t("showReplies")}`}
                                    </Text>
                                  </Button>
                                )}
                              </div>
                            );
                          }

                          // Teamsスレッド：テンプレート externalCard スタイル（左アイコン + カード）
                          if (rootComment.type === "teams") {
                            return (
                              <div key={comment.id} style={inlineStyles.timelineEvent}>
                                <Icon size="large">
                                  <MicrosoftTeamsIcon size={24} />
                                </Icon>
                                <div style={inlineStyles.externalCard}>
                                  <div style={inlineStyles.mailCardHeader}>
                                    <Avatar size="xSmall" name={rootComment.user} />
                                    <div style={inlineStyles.mailHeaderText}>
                                      <Text variant="body.medium.bold">{rootComment.user}</Text>
                                      <Text variant="data.medium" color="subtle">
                                        {rootComment.date}
                                      </Text>
                                    </div>
                                    <div style={inlineStyles.mailToolbar}>
                                      <Select
                                        size="small"
                                        value={rootComment.visibility}
                                        onChange={(value) => {
                                          handleCommentVisibilityChange(rootComment.id, value as "public" | "private");
                                        }}
                                        options={[
                                          { label: t("visibilityPublic"), value: "public" },
                                          { label: t("visibilityPrivate"), value: "private" },
                                        ]}
                                      />
                                      <Tooltip title={t("other")}>
                                        <IconButton variant="plain" size="small" aria-label={t("other")}>
                                          <Icon>
                                            <LfEllipsisDot />
                                          </Icon>
                                        </IconButton>
                                      </Tooltip>
                                    </div>
                                  </div>
                                  {rootComment.subject && <Text variant="body.medium.bold">{rootComment.subject}</Text>}
                                  <Text variant="body.medium" whiteSpace="pre-wrap">
                                    {rootComment.content}
                                  </Text>
                                </div>
                              </div>
                            );
                          }

                          // Slackスレッド：テンプレート「slackMessage」スタイル（左Logo + slackCard）
                          if (rootComment.type === "slack") {
                            return (
                              <div key={comment.id} style={inlineStyles.timelineEvent}>
                                <Logo source={SlackLogo} size="large" />
                                <div style={inlineStyles.slackCard}>
                                  <div style={inlineStyles.slackCardHeader}>
                                    <Avatar size="xSmall" name={rootComment.user} />
                                    <div style={inlineStyles.mailHeaderText}>
                                      <Text variant="body.medium.bold">{rootComment.user}</Text>
                                      <Text variant="data.medium" color="subtle">
                                        {rootComment.channel || ""} | {rootComment.date}
                                      </Text>
                                    </div>
                                    <div style={inlineStyles.mailToolbar}>
                                      <Select
                                        size="small"
                                        value={rootComment.visibility}
                                        onChange={(value) => {
                                          handleCommentVisibilityChange(rootComment.id, value as "public" | "private");
                                        }}
                                        options={[
                                          { label: t("visibilityPublic"), value: "public" },
                                          { label: t("visibilityPrivate"), value: "private" },
                                        ]}
                                      />
                                      <Tooltip title={t("other")}>
                                        <IconButton variant="plain" size="small" aria-label={t("other")}>
                                          <Icon>
                                            <LfEllipsisDot />
                                          </Icon>
                                        </IconButton>
                                      </Tooltip>
                                    </div>
                                  </div>
                                  <Text variant="body.medium" whiteSpace="pre-wrap">
                                    {rootComment.content}
                                  </Text>
                                </div>
                              </div>
                            );
                          }

                          // メールスレッド：テンプレート「mail」スタイル（左LfMail + externalCard）
                          return (
                            <div key={comment.id} style={inlineStyles.timelineEvent}>
                              <Icon size="large">
                                <LfMail />
                              </Icon>
                              <div style={inlineStyles.externalCard}>
                                <div style={inlineStyles.mailCardHeader}>
                                  <Avatar size="xSmall" name={rootComment.user} />
                                  <div style={inlineStyles.mailHeaderText}>
                                    <Text variant="body.medium.bold">{rootComment.user}</Text>
                                    <Text variant="data.medium" color="subtle">
                                      {rootComment.date}
                                    </Text>
                                  </div>
                                  <div style={inlineStyles.mailToolbar}>
                                    {selectedThreadId === threadId && (
                                      <Tooltip title={t("backToThreads")}>
                                        <IconButton
                                          variant="plain"
                                          size="xSmall"
                                          aria-label={t("backToThreads")}
                                          onClick={() => {
                                            setSelectedThreadId(null);
                                            setMessageViewType("threads");
                                          }}
                                        >
                                          <Icon>
                                            <LfAngleLeftMiddle />
                                          </Icon>
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                    <Select
                                      size="small"
                                      value={rootComment.visibility}
                                      onChange={(value) => {
                                        handleCommentVisibilityChange(rootComment.id, value as "public" | "private");
                                      }}
                                      options={[
                                        { label: t("visibilityPublic"), value: "public" },
                                        { label: t("visibilityPrivate"), value: "private" },
                                      ]}
                                    />
                                    {rootComment.type === "mail" ? (
                                      <Popover
                                        open={mailThreadPopoverOpen[threadId] || false}
                                        onOpenChange={(open) => {
                                          setMailThreadPopoverOpen((prev) => ({
                                            ...prev,
                                            [threadId]: open,
                                          }));
                                        }}
                                        placement="bottom-end"
                                      >
                                        <Popover.Anchor>
                                          <Tooltip title={t("viewAllMailsInThread")}>
                                            <IconButton
                                              variant="plain"
                                              size="small"
                                              aria-label={t("viewAllMailsInThread")}
                                            >
                                              <Icon>
                                                <LfList />
                                              </Icon>
                                            </IconButton>
                                          </Tooltip>
                                        </Popover.Anchor>
                                        <Popover.Content width="large">
                                          <Popover.Body>
                                            <div
                                              style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "var(--aegis-space-medium)",
                                              }}
                                            >
                                              <Text variant="body.medium.bold">スレッド内のすべてのメールを見る</Text>
                                              <Divider />
                                              {/* このスレッド */}
                                              <div
                                                style={{
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  gap: "var(--aegis-space-small)",
                                                }}
                                              >
                                                {(() => {
                                                  const mailComments = allThreadComments.filter(
                                                    (c) => c.type === "mail",
                                                  );
                                                  const participants = Array.from(
                                                    new Set(mailComments.map((c) => c.user)),
                                                  ).slice(0, 5);
                                                  const replyCount = mailComments.filter((c) => c.parentId).length;
                                                  const lastUpdated =
                                                    mailComments[mailComments.length - 1]?.date || rootComment.date;
                                                  const threadTitle =
                                                    rootComment.subject || rootComment.content.substring(0, 50);

                                                  return (
                                                    <button
                                                      type="button"
                                                      style={{
                                                        padding: "var(--aegis-space-small)",
                                                        borderRadius: "var(--aegis-radius-small)",
                                                        backgroundColor:
                                                          "var(--aegis-color-background-neutral-xSubtle)",
                                                        border: "1px solid var(--aegis-color-border-default)",
                                                        cursor: "pointer",
                                                        width: "100%",
                                                        textAlign: "left",
                                                      }}
                                                      onClick={() => {
                                                        setSelectedThreadId(threadId);
                                                        setMessageViewType("threads");
                                                        setMailThreadPopoverOpen((prev) => ({
                                                          ...prev,
                                                          [threadId]: false,
                                                        }));
                                                      }}
                                                    >
                                                      <div
                                                        style={{
                                                          display: "flex",
                                                          alignItems: "flex-start",
                                                          gap: "var(--aegis-space-small)",
                                                        }}
                                                      >
                                                        <div
                                                          style={{
                                                            flex: 1,
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            gap: "var(--aegis-space-xxSmall)",
                                                          }}
                                                        >
                                                          <Text variant="body.medium" numberOfLines={2}>
                                                            {threadTitle}
                                                            {!rootComment.subject && rootComment.content.length > 50
                                                              ? "..."
                                                              : ""}
                                                          </Text>
                                                          <Text variant="body.small" color="subtle">
                                                            {participants.join(", ")}
                                                            {participants.length < mailComments.length ? "..." : ""}
                                                          </Text>
                                                          <div
                                                            style={{
                                                              display: "flex",
                                                              alignItems: "center",
                                                              gap: "var(--aegis-space-xSmall)",
                                                              flexWrap: "wrap",
                                                            }}
                                                          >
                                                            {replyCount > 0 && (
                                                              <Tag variant="fill" color="blue" size="small">
                                                                {replyCount}件の返信
                                                              </Tag>
                                                            )}
                                                            <Text variant="body.small" color="subtle">
                                                              更新日時: {lastUpdated}
                                                            </Text>
                                                          </div>
                                                        </div>
                                                        <div
                                                          style={{
                                                            display: "flex",
                                                            alignItems: "flex-start",
                                                            gap: "var(--aegis-space-xSmall)",
                                                            flexShrink: 0,
                                                          }}
                                                        >
                                                          <Select
                                                            size="small"
                                                            value={rootComment.visibility}
                                                            onChange={(value) => {
                                                              handleCommentVisibilityChange(
                                                                rootComment.id,
                                                                value as "public" | "private",
                                                              );
                                                            }}
                                                            options={[
                                                              { label: t("visibilityPublic"), value: "public" },
                                                              { label: t("visibilityPrivate"), value: "private" },
                                                            ]}
                                                          />
                                                        </div>
                                                      </div>
                                                    </button>
                                                  );
                                                })()}
                                              </div>
                                              {/* 関連スレッド */}
                                              {(() => {
                                                // 関連スレッドを表示: 角田さん（3ヶ月後）、松村さん
                                                const relatedThreadIds = [
                                                  "thread-mail-kakuda-3months",
                                                  "thread-mail-matsumura",
                                                ].filter((id) => id !== threadId);

                                                const relatedMailThreads = relatedThreadIds
                                                  .map((id) => {
                                                    const threadGroup = threadGroups.find(([tid]) => tid === id);
                                                    return threadGroup ? [id, threadGroup[1]] : null;
                                                  })
                                                  .filter((item): item is [string, Comment[]] => item !== null);

                                                if (relatedMailThreads.length === 0) return null;

                                                return (
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      gap: "var(--aegis-space-small)",
                                                    }}
                                                  >
                                                    {relatedMailThreads.map(([relatedThreadId, relatedComments]) => {
                                                      const relatedRootComment =
                                                        relatedComments.find((c) => !c.parentId) || relatedComments[0];
                                                      const relatedReplyCount = relatedComments.length - 1;
                                                      const relatedLastUpdated =
                                                        relatedComments[relatedComments.length - 1]?.date ||
                                                        relatedRootComment.date;
                                                      const relatedParticipants = Array.from(
                                                        new Set(relatedComments.map((c) => c.user)),
                                                      ).slice(0, 5);
                                                      const relatedVisibility = relatedRootComment.visibility;
                                                      const relatedThreadTitle =
                                                        threadTitles[relatedThreadId] ||
                                                        relatedRootComment.content.substring(0, 50);

                                                      return (
                                                        <button
                                                          key={relatedThreadId}
                                                          type="button"
                                                          style={{
                                                            padding: "var(--aegis-space-small)",
                                                            borderRadius: "var(--aegis-radius-small)",
                                                            backgroundColor: "transparent",
                                                            border: "1px solid transparent",
                                                            cursor: "pointer",
                                                            width: "100%",
                                                            textAlign: "left",
                                                          }}
                                                          onClick={() => {
                                                            setSelectedThreadId(relatedThreadId);
                                                            setMessageViewType("threads");
                                                            setMailThreadPopoverOpen((prev) => ({
                                                              ...prev,
                                                              [threadId]: false,
                                                            }));
                                                          }}
                                                        >
                                                          <div
                                                            style={{
                                                              display: "flex",
                                                              alignItems: "flex-start",
                                                              gap: "var(--aegis-space-small)",
                                                            }}
                                                          >
                                                            <div
                                                              style={{
                                                                flex: 1,
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                gap: "var(--aegis-space-xxSmall)",
                                                              }}
                                                            >
                                                              <Text variant="body.small.bold" color="subtle">
                                                                {threadTitles[relatedThreadId] || t("requestDetails")}
                                                              </Text>
                                                              <Text variant="body.medium" numberOfLines={2}>
                                                                {relatedThreadTitle}
                                                                {!threadTitles[relatedThreadId] &&
                                                                relatedRootComment.content.length > 50
                                                                  ? "..."
                                                                  : ""}
                                                              </Text>
                                                              <Text variant="body.small" color="subtle">
                                                                {relatedParticipants.join(", ")}
                                                                {relatedParticipants.length < relatedComments.length
                                                                  ? "..."
                                                                  : ""}
                                                              </Text>
                                                              <div
                                                                style={{
                                                                  display: "flex",
                                                                  alignItems: "center",
                                                                  gap: "var(--aegis-space-xSmall)",
                                                                  flexWrap: "wrap",
                                                                }}
                                                              >
                                                                {relatedReplyCount > 0 && (
                                                                  <Tag variant="fill" color="blue" size="small">
                                                                    {relatedReplyCount}
                                                                    {t("replyCount")}
                                                                  </Tag>
                                                                )}
                                                                <Text variant="body.small" color="subtle">
                                                                  {t("lastUpdated")} {relatedLastUpdated}
                                                                </Text>
                                                              </div>
                                                            </div>
                                                            <div
                                                              style={{
                                                                display: "flex",
                                                                alignItems: "flex-start",
                                                                gap: "var(--aegis-space-xSmall)",
                                                                flexShrink: 0,
                                                              }}
                                                            >
                                                              <Select
                                                                size="small"
                                                                value={relatedVisibility}
                                                                onChange={(value) => {
                                                                  handleCommentVisibilityChange(
                                                                    relatedRootComment.id,
                                                                    value as "public" | "private",
                                                                  );
                                                                }}
                                                                options={[
                                                                  { label: t("visibilityPublic"), value: "public" },
                                                                  { label: t("visibilityPrivate"), value: "private" },
                                                                ]}
                                                              />
                                                            </div>
                                                          </div>
                                                        </button>
                                                      );
                                                    })}
                                                  </div>
                                                );
                                              })()}
                                            </div>
                                          </Popover.Body>
                                        </Popover.Content>
                                      </Popover>
                                    ) : (
                                      <div
                                        style={{
                                          width: "var(--aegis-size-x3Large)",
                                          height: "var(--aegis-size-x3Large)",
                                        }}
                                      />
                                    )}
                                  </div>
                                </div>
                                {rootComment.subject && <Text variant="body.medium.bold">{rootComment.subject}</Text>}
                                {/* メッセージ内容 */}
                                <div style={{ position: "relative" }}>
                                  <Text
                                    variant="body.medium"
                                    whiteSpace="pre-wrap"
                                    style={{
                                      display: "-webkit-box",
                                      WebkitLineClamp: isContentExpanded ? undefined : 3,
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {rootComment.content}
                                  </Text>
                                  {rootComment.content.length > 150 && (
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        marginTop: "var(--aegis-space-xSmall)",
                                      }}
                                    >
                                      <Button
                                        variant="gutterless"
                                        onClick={() => {
                                          setExpandedMessageContent((prev) => {
                                            const next = new Set(prev);
                                            if (next.has(rootComment.id)) {
                                              next.delete(rootComment.id);
                                            } else {
                                              next.add(rootComment.id);
                                            }
                                            return next;
                                          });
                                        }}
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "var(--aegis-space-xxSmall)",
                                          padding: 0,
                                          color: "var(--aegis-color-text-subtle)",
                                        }}
                                      >
                                        <Text variant="body.small" color="subtle">
                                          {isContentExpanded ? "折りたたむ" : "すべて表示"}
                                        </Text>
                                        <Icon size="xSmall">
                                          {isContentExpanded ? <LfAngleUpMiddle /> : <LfAngleDownMiddle />}
                                        </Icon>
                                      </Button>
                                    </div>
                                  )}
                                </div>

                                {/* 返信数を表示（カードの左下） */}
                                {allThreadComments.length > 1 && (
                                  <Button
                                    variant="gutterless"
                                    onClick={() => {
                                      setExpandedThreads((prev) => {
                                        const next = new Set(prev);
                                        if (next.has(threadId)) {
                                          next.delete(threadId);
                                        } else {
                                          next.add(threadId);
                                        }
                                        return next;
                                      });
                                    }}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "var(--aegis-space-xxSmall)",
                                      marginTop: "var(--aegis-space-small)",
                                      padding: 0,
                                      alignSelf: "flex-start",
                                    }}
                                  >
                                    <Icon size="xSmall">
                                      {isThreadExpanded ? <LfAngleDownMiddle /> : <LfAngleRightMiddle />}
                                    </Icon>
                                    <Text variant="body.small" color="subtle">
                                      {isThreadExpanded ? "閉じる" : `${allThreadComments.length - 1}件の返信を表示`}
                                    </Text>
                                  </Button>
                                )}

                                {/* スレッドの返信を表示 */}
                                {isThreadExpanded && replyComments.length > 0 && (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "var(--aegis-space-medium)",
                                      paddingTop: "var(--aegis-space-medium)",
                                      borderTop: "1px solid var(--aegis-color-border-default)",
                                    }}
                                  >
                                    {replyComments.map((replyComment) => (
                                      <div
                                        key={replyComment.id}
                                        style={{
                                          display: "flex",
                                          gap: "var(--aegis-space-small)",
                                          paddingLeft: "var(--aegis-space-large)",
                                          borderLeft: "2px solid var(--aegis-color-border-default)",
                                        }}
                                      >
                                        <div style={{ flex: 1 }}>
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "var(--aegis-space-small)",
                                              marginBottom: "var(--aegis-space-xSmall)",
                                            }}
                                          >
                                            <Avatar size="small" name={replyComment.user} />
                                            <Text variant="body.medium">{replyComment.user}</Text>
                                            <Text variant="body.small" color="subtle">
                                              {replyComment.date}
                                            </Text>
                                          </div>
                                          <Text variant="body.medium" whiteSpace="pre-wrap">
                                            {replyComment.content}
                                          </Text>
                                          {replyComment.hasAttachment && (
                                            <div
                                              style={{
                                                marginTop: "var(--aegis-space-medium)",
                                                padding: "var(--aegis-space-medium)",
                                                backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
                                                borderRadius: "var(--aegis-radius-medium)",
                                                border: "1px solid var(--aegis-color-border-default)",
                                              }}
                                            >
                                              <Text
                                                variant="body.small.bold"
                                                style={{ marginBottom: "var(--aegis-space-small)" }}
                                              >
                                                {t("attachment")}
                                              </Text>
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: "var(--aegis-space-small)",
                                                  padding: "var(--aegis-space-small)",
                                                  backgroundColor: "var(--aegis-color-surface-default)",
                                                  borderRadius: "var(--aegis-radius-small)",
                                                  border: "1px solid var(--aegis-color-border-default)",
                                                }}
                                              >
                                                <Icon size="medium">
                                                  <LfFileLines />
                                                </Icon>
                                                <div style={{ flex: 1 }}>
                                                  <Text variant="body.medium">
                                                    {locale === "ja-JP"
                                                      ? "ECXXXXサイト利用規約.docx"
                                                      : "ECXXXX Site Terms of Service.docx"}
                                                  </Text>
                                                  <Text variant="body.small" color="subtle">
                                                    v2
                                                  </Text>
                                                </div>
                                                <Button
                                                  variant="subtle"
                                                  size="small"
                                                  trailing={
                                                    <Icon>
                                                      <LfAngleDownMiddle />
                                                    </Icon>
                                                  }
                                                >
                                                  {t("download")}
                                                </Button>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }

                        // 通常のメッセージ表示（スレッドに属さない）
                        return (
                          <div
                            key={comment.id}
                            style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}
                          >
                            {/* 既存のメッセージ表示ロジック */}
                            {(() => {
                              const renderMessageIcon = () => {
                                switch (comment.type) {
                                  case "lo-message":
                                    return (
                                      <Icon size="small" color="subtle">
                                        <LfComment />
                                      </Icon>
                                    );
                                  case "slack":
                                    return (
                                      <div style={inlineStyles.messageTypeIcon}>
                                        <Logo source={SlackLogo} size="small" />
                                      </div>
                                    );
                                  case "teams":
                                    return (
                                      <div style={inlineStyles.messageTypeIcon}>
                                        <MicrosoftTeamsIcon size={16} />
                                      </div>
                                    );
                                  case "mail":
                                    return (
                                      <Icon size="small" color="subtle">
                                        <LfMail />
                                      </Icon>
                                    );
                                  case "active-history":
                                    return (
                                      <Icon size="small" color="subtle">
                                        <LfArrowsRotate />
                                      </Icon>
                                    );
                                  default:
                                    return null;
                                }
                              };

                              // LOメッセージの場合は特別なデザイン（枠なし、公開非公開設定、編集削除機能）
                              if (comment.type === "lo-message") {
                                const isCurrentUser = comment.user === currentUserName;
                                return (
                                  <div
                                    key={comment.id}
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "var(--aegis-space-medium)",
                                    }}
                                  >
                                    {/* LOメッセージヘッダー */}
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: "var(--aegis-space-small)",
                                      }}
                                    >
                                      {/* 左側: コメントアイコン */}
                                      <div style={{ flexShrink: 0, marginTop: "var(--aegis-space-xxSmall)" }}>
                                        <Icon size="small" color="subtle">
                                          <LfComment />
                                        </Icon>
                                      </div>
                                      {/* 右側: ユーザー情報と設定 */}
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                          gap: "var(--aegis-space-small)",
                                          flex: 1,
                                          minWidth: 0,
                                        }}
                                      >
                                        <div style={{ ...inlineStyles.commentUserInfo, flex: 1, minWidth: 0 }}>
                                          <Avatar size="small" name={comment.user} />
                                          <Text variant="body.medium">{comment.user}</Text>
                                          <Text variant="body.small" color="subtle">
                                            {comment.date}
                                          </Text>
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "var(--aegis-space-xSmall)",
                                            flexShrink: 0,
                                          }}
                                        >
                                          <Select
                                            size="small"
                                            value={comment.visibility}
                                            onChange={(value) => {
                                              handleCommentVisibilityChange(comment.id, value as "public" | "private");
                                            }}
                                            options={[
                                              { label: t("visibilityPublic"), value: "public" },
                                              { label: t("visibilityPrivate"), value: "private" },
                                            ]}
                                          />
                                          {isCurrentUser ? (
                                            <Menu placement="bottom-end">
                                              <Menu.Anchor>
                                                <Tooltip title="その他">
                                                  <IconButton variant="plain" size="small" aria-label="その他">
                                                    <Icon>
                                                      <LfEllipsisDot />
                                                    </Icon>
                                                  </IconButton>
                                                </Tooltip>
                                              </Menu.Anchor>
                                              <Menu.Box width="xSmall">
                                                <ActionList>
                                                  <ActionList.Group>
                                                    <ActionList.Item
                                                      onClick={() => {
                                                        // 編集処理
                                                        console.log("編集", comment.id);
                                                      }}
                                                    >
                                                      <ActionList.Body
                                                        leading={
                                                          <Icon>
                                                            <LfPen />
                                                          </Icon>
                                                        }
                                                      >
                                                        編集
                                                      </ActionList.Body>
                                                    </ActionList.Item>
                                                  </ActionList.Group>
                                                  <ActionList.Group>
                                                    <ActionList.Item
                                                      onClick={() => {
                                                        // 削除処理
                                                        setCommentsState((prev) =>
                                                          prev.filter((c) => c.id !== comment.id),
                                                        );
                                                      }}
                                                      color="danger"
                                                    >
                                                      <ActionList.Body
                                                        leading={
                                                          <Icon>
                                                            <LfTrash />
                                                          </Icon>
                                                        }
                                                      >
                                                        削除
                                                      </ActionList.Body>
                                                    </ActionList.Item>
                                                  </ActionList.Group>
                                                </ActionList>
                                              </Menu.Box>
                                            </Menu>
                                          ) : (
                                            <div
                                              style={{
                                                width: "var(--aegis-size-x3Large)",
                                                height: "var(--aegis-size-x3Large)",
                                              }}
                                            />
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* アイコンの左下にメッセージ内容を配置 */}
                                    <div style={{ display: "flex", gap: "var(--aegis-space-small)" }}>
                                      {/* アイコンの下のスペース */}
                                      <div style={{ width: "20px", flexShrink: 0 }} />
                                      {/* メッセージ内容 */}
                                      <div
                                        style={{
                                          flex: 1,
                                          display: "flex",
                                          flexDirection: "column",
                                          gap: "var(--aegis-space-small)",
                                        }}
                                      >
                                        {comment.subject && <Text variant="body.medium.bold">{comment.subject}</Text>}
                                        <Text variant="body.medium" whiteSpace="pre-wrap">
                                          {comment.content}
                                        </Text>
                                        {comment.hasAttachment && (
                                          <div
                                            style={{
                                              marginTop: "var(--aegis-space-medium)",
                                              display: "flex",
                                              flexDirection: "column",
                                              gap: "var(--aegis-space-small)",
                                            }}
                                          >
                                            <Text variant="body.small.bold">{t("attachment")}</Text>
                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "var(--aegis-space-small)",
                                                padding: "var(--aegis-space-small)",
                                                backgroundColor: "var(--aegis-color-surface-default)",
                                                borderRadius: "var(--aegis-radius-small)",
                                                border: "1px solid var(--aegis-color-border-default)",
                                              }}
                                            >
                                              <Icon size="medium">
                                                <LfFileLines />
                                              </Icon>
                                              <div style={{ flex: 1 }}>
                                                <Text variant="body.medium">
                                                  {locale === "ja-JP"
                                                    ? "ECXXXXサイト利用規約.docx"
                                                    : "ECXXXX Site Terms of Service.docx"}
                                                </Text>
                                                <Text variant="body.small" color="subtle">
                                                  v2
                                                </Text>
                                              </div>
                                              <Button
                                                variant="subtle"
                                                size="small"
                                                trailing={
                                                  <Icon>
                                                    <LfAngleDownMiddle />
                                                  </Icon>
                                                }
                                              >
                                                {t("download")}
                                              </Button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              }

                              // その他のメッセージタイプ（既存のデザイン）
                              return (
                                <div
                                  key={comment.id}
                                  style={{
                                    ...inlineStyles.commentWithIcon,
                                  }}
                                >
                                  {renderMessageIcon()}
                                  <div style={{ flex: 1 }}>
                                    <div style={inlineStyles.commentItem}>
                                      <div style={inlineStyles.commentHeader}>
                                        <div style={inlineStyles.commentUserInfo}>
                                          <Avatar size="small" name={comment.user} />
                                          <Text variant="body.medium">{comment.user}</Text>
                                          <Text variant="body.small" color="subtle">
                                            {comment.date}
                                          </Text>
                                          {comment.channel && (
                                            <Text variant="body.small" color="subtle">
                                              {comment.channel}
                                            </Text>
                                          )}
                                        </div>
                                        <div style={inlineStyles.commentActions}>
                                          <Tooltip title={t("other")}>
                                            <IconButton variant="plain" size="small" aria-label={t("other")}>
                                              <Icon>
                                                <LfEllipsisDot />
                                              </Icon>
                                            </IconButton>
                                          </Tooltip>
                                        </div>
                                      </div>
                                      {comment.subject && <Text variant="body.medium.bold">{comment.subject}</Text>}
                                      <Text variant="body.medium" whiteSpace="pre-wrap">
                                        {comment.content}
                                      </Text>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        );
                      })}
                </div>
              </div>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
        <PageLayoutPane position="end" width="large" resizable open={paneOpen}>
          {renderPaneContent()}
        </PageLayoutPane>

        <PageLayoutSidebar position="end">
          <SideNavigation>
            <SideNavigation.Group>
              <SideNavigation.Item
                icon={LfInformationCircle}
                onClick={() => handleSelectPane("case-attribute")}
                aria-current={currentPane === "case-attribute" ? true : undefined}
              >
                {t("caseInfo")}
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfBarSparkles}
                onClick={() => handleSelectPane("case-summary")}
                aria-current={currentPane === "case-summary" ? true : undefined}
              >
                {locale === "ja-JP" ? "案件サマリー" : "Case summary"}
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfFile}
                onClick={() => handleSelectPane("linked-file")}
                aria-current={currentPane === "linked-file" ? true : undefined}
              >
                {locale === "ja-JP" ? "関連ファイル" : "Linked files"}
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfArchive}
                onClick={() => handleSelectPane("linked-case")}
                aria-current={currentPane === "linked-case" ? true : undefined}
              >
                {locale === "ja-JP" ? "関連案件" : "Linked cases"}
              </SideNavigation.Item>
            </SideNavigation.Group>
            <SideNavigation.Group>
              <SideNavigation.Item
                icon={LfScaleBalanced}
                onClick={() => handleSelectPane("reference")}
                aria-current={currentPane === "reference" ? true : undefined}
              >
                {locale === "ja-JP" ? "参考情報" : "Reference"}
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfBook}
                onClick={() => handleSelectPane("book")}
                aria-current={currentPane === "book" ? true : undefined}
              >
                {locale === "ja-JP" ? "参考資料" : "Reference materials"}
              </SideNavigation.Item>
            </SideNavigation.Group>
          </SideNavigation>
        </PageLayoutSidebar>
      </PageLayout>

      {/* メール作成フォーム（BottomSheet） */}
      <BottomSheet width="large" open={mailComposeOpen} onOpenChange={setMailComposeOpen}>
        <BottomSheet.Panel>
          <BottomSheet.Body>
            <Form>
              <FormControl>
                <FormControl.Label>{t("sender")}</FormControl.Label>
                <Select options={emailAddressOptions} value={mailFrom} onChange={(value) => setMailFrom(value)} />
              </FormControl>
              <FormControl>
                <FormControl.Label>{t("to")}</FormControl.Label>
                <TagPicker options={emailAddressOptions} value={mailTo} onChange={setMailTo} />
              </FormControl>
              <FormControl>
                <FormControl.Label>CC</FormControl.Label>
                <TagPicker options={emailAddressOptions} value={mailCc} onChange={setMailCc} />
              </FormControl>
              <FormControl>
                <FormControl.Label>{t("subject")}</FormControl.Label>
                <TextField value={mailSubject} onChange={(event) => setMailSubject(event.target.value)} />
              </FormControl>
              <FormControl>
                <FormControl.Label>{t("body")}</FormControl.Label>
                <Textarea
                  value={mailBody}
                  onChange={(event) => setMailBody(event.target.value)}
                  minRows={8}
                  maxRows={16}
                  placeholder={locale === "ja-JP" ? "メール本文を入力してください" : "Enter email body"}
                />
              </FormControl>
            </Form>
          </BottomSheet.Body>
          <BottomSheet.Footer>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <div style={{ display: "flex", gap: "var(--aegis-space-small)" }}>
                <Tooltip title={t("delete")} placement="top">
                  <IconButton
                    aria-label={t("delete")}
                    variant="plain"
                    onClick={() => {
                      setMailSubject("");
                      setMailBody("");
                      setMailTo([]);
                      setMailCc([]);
                      setMailComposeOpen(false);
                    }}
                  >
                    <Icon>
                      <LfTrash />
                    </Icon>
                  </IconButton>
                </Tooltip>
                <Tooltip title={t("attachFile")} placement="top">
                  <IconButton aria-label={t("attachFile")} variant="plain">
                    <Icon>
                      <LfClip />
                    </Icon>
                  </IconButton>
                </Tooltip>
              </div>
              <Button
                variant="solid"
                disabled={mailTo.length === 0 || mailSubject.trim().length === 0}
                onClick={() => {
                  const newComment: Comment = {
                    id: `mail-${Date.now()}`,
                    type: "mail",
                    user: locale === "ja-JP" ? "現在のユーザー" : "Current User",
                    date: new Date().toLocaleString("ja-JP", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                    content: mailBody,
                    visibility: "private",
                    subject: mailSubject,
                  };
                  setCommentsState((prev) => [newComment, ...prev]);
                  setMailSubject("");
                  setMailBody("");
                  setMailTo([]);
                  setMailCc([]);
                  setMailComposeOpen(false);
                }}
              >
                {t("send")}
              </Button>
            </div>
          </BottomSheet.Footer>
        </BottomSheet.Panel>
      </BottomSheet>

      <Dialog open={visibilityChangeDialogOpen} onOpenChange={setVisibilityChangeDialogOpen}>
        <DialogContent width="medium">
          <DialogHeader>
            <ContentHeader>
              <ContentHeader.Title>{t("publishThread")}</ContentHeader.Title>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            {pendingVisibilityChange &&
              (() => {
                // commentIdがnullの場合はthreadVisibilitySettingの変更（スレッドが選択されていない場合）
                if (pendingVisibilityChange.commentId === null) {
                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
                      <Text variant="body.medium">{t("publishThreadDesc")}</Text>
                      <div
                        style={{
                          padding: "var(--aegis-space-medium)",
                          backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
                          borderRadius: "var(--aegis-radius-medium)",
                          display: "flex",
                          gap: "var(--aegis-space-small)",
                          alignItems: "flex-start",
                        }}
                      >
                        <Icon>
                          <LfInformationCircle />
                        </Icon>
                        <Text variant="body.medium">{t("existingThreadsNotChanged")}</Text>
                      </div>
                    </div>
                  );
                }

                // スレッドが選択されている場合
                const isThreadId = threadGroups.some(([threadId]) => threadId === pendingVisibilityChange.commentId);
                let threadComments: Comment[] = [];
                let messageType: MessageType | null = null;

                if (isThreadId) {
                  threadComments = commentsState.filter((c) => c.threadId === pendingVisibilityChange.commentId);
                  messageType = threadComments[0]?.type || null;
                } else {
                  const comment = commentsState.find((c) => c.id === pendingVisibilityChange.commentId);
                  if (!comment) return null;
                  threadComments = comment.threadId
                    ? commentsState.filter((c) => c.threadId === comment.threadId)
                    : [comment];
                  messageType = comment.type;
                }

                const typeLabels: Record<MessageType, string> = {
                  "lo-message": t("loMessage"),
                  slack: t("slack"),
                  teams: t("teams"),
                  mail: t("mail"),
                  "active-history": t("activeHistory"),
                };
                if (!messageType) return null;

                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
                    <Text variant="body.medium">
                      {t("threadContainsCount")}
                      {typeLabels[messageType]}
                      {t("messageCount")}
                      {threadComments.length}
                    </Text>
                    <div
                      style={{
                        padding: "var(--aegis-space-medium)",
                        backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
                        borderRadius: "var(--aegis-radius-medium)",
                        display: "flex",
                        gap: "var(--aegis-space-small)",
                        alignItems: "flex-start",
                      }}
                    >
                      <Icon>
                        <LfInformationCircle />
                      </Icon>
                      <Text variant="body.medium">
                        {t("allMessagesInThreadPublished")}
                        {typeLabels[messageType]}
                        {t("willBePublished")}
                      </Text>
                    </div>
                  </div>
                );
              })()}
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button
                variant="subtle"
                onClick={() => {
                  setVisibilityChangeDialogOpen(false);
                  setPendingVisibilityChange(null);
                }}
              >
                {t("cancel")}
              </Button>
              <Button variant="solid" onClick={handleConfirmVisibilityChange}>
                {t("publish")}
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={slackDialogOpen}
        onOpenChange={(open) => {
          setSlackDialogOpen(open);
          if (!open) {
            // 閉じたときにエラー表示や入力状態をリセット（赤いBannerが残らないように）
            setSlackError("");
            setSlackChannel("");
            setSlackNotificationUser("");
            setSlackVisibility("private");
          }
        }}
      >
        <DialogContent width="medium">
          <DialogHeader>
            <ContentHeader
              action={
                <Link
                  href="#"
                  leading={
                    <Icon>
                      <LfInformationCircle />
                    </Icon>
                  }
                  trailing={
                    <Icon>
                      <LfArrowUpRightFromSquare />
                    </Icon>
                  }
                >
                  {t("slackIntegration")}
                </Link>
              }
            >
              <ContentHeader.Title>{t("createSlackThreadTitle")}</ContentHeader.Title>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-large)",
              }}
            >
              <Text variant="body.medium">{t("slackChannelDesc")}</Text>

              <FormControl required>
                <FormControl.Label>{t("selectSlackChannelRequired")}</FormControl.Label>
                <Select
                  placeholder={t("searchSlackChannel")}
                  value={slackChannel}
                  onChange={(value) => {
                    setSlackChannel(value);
                    setSlackError("");
                  }}
                  options={[
                    { label: "#general", value: "general" },
                    { label: "#random", value: "random" },
                    { label: locale === "ja-JP" ? "#案件" : "#case", value: "case" },
                  ]}
                />
                <FormControl.Caption>{t("channelCannotChange")}</FormControl.Caption>
              </FormControl>

              <FormControl>
                <FormControl.Label>{t("notificationRecipient")}</FormControl.Label>
                <Select
                  placeholder=""
                  value={slackNotificationUser}
                  onChange={(value) => {
                    setSlackNotificationUser(value);
                  }}
                  options={[
                    {
                      label: locale === "ja-JP" ? "@山田太郎" : "@Taro Yamada",
                      value: "yamada",
                    },
                    {
                      label: locale === "ja-JP" ? "@山下一郎" : "@Ichiro Yamashita",
                      value: "yamashita",
                    },
                    {
                      label: locale === "ja-JP" ? "@柴田さくら" : "@Sakura Shibata",
                      value: "shibata",
                    },
                  ]}
                />
                <FormControl.Caption>{t("mentionSentOnce")}</FormControl.Caption>
              </FormControl>

              <FormControl required>
                <FormControl.Label>{t("visibilitySettingRequired")}</FormControl.Label>
                <RadioGroup
                  value={slackVisibility}
                  onChange={(value) => {
                    setSlackVisibility(value as "public" | "private");
                    setSlackError("");
                  }}
                >
                  <Radio value="public">{t("publicStandardPro")}</Radio>
                  <Radio value="private">{t("privateProOnly")}</Radio>
                </RadioGroup>
              </FormControl>

              {slackError && (
                <Banner color="danger" size="small">
                  {slackError}
                </Banner>
              )}
            </div>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button
                variant="plain"
                onClick={() => {
                  setSlackDialogOpen(false);
                  setSlackError("");
                  setSlackChannel("");
                  setSlackNotificationUser("");
                  setSlackVisibility("private");
                }}
              >
                {t("cancel")}
              </Button>
              <Button
                variant="solid"
                onClick={() => {
                  if (!slackChannel) {
                    setSlackError(t("selectSlackChannelError"));
                    return;
                  }
                  // TODO: 実際のSlackスレッド作成処理を実装
                  setSlackDialogOpen(false);
                  setSlackChannel("");
                  setSlackNotificationUser("");
                  setSlackVisibility("private");
                  setSlackError("");
                }}
              >
                {t("createSlackThread")}
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={teamsDialogOpen}
        onOpenChange={(open) => {
          setTeamsDialogOpen(open);
          if (!open) {
            // 閉じたときにエラー表示や入力状態をリセット（赤いBannerが残らないように）
            setTeamsError("");
            setTeamsChannel("");
            setTeamsNotificationUser("");
            setTeamsVisibility("private");
          }
        }}
      >
        <DialogContent width="medium">
          <DialogHeader>
            <ContentHeader
              action={
                <Link
                  href="#"
                  leading={
                    <Icon>
                      <LfInformationCircle />
                    </Icon>
                  }
                  trailing={
                    <Icon>
                      <LfArrowUpRightFromSquare />
                    </Icon>
                  }
                >
                  {t("teamsIntegration")}
                </Link>
              }
            >
              <ContentHeader.Title>{t("createTeamsThreadTitle")}</ContentHeader.Title>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-large)",
              }}
            >
              <Text variant="body.medium">{t("teamsChannelDesc")}</Text>

              <FormControl required>
                <FormControl.Label>{t("selectTeamsChannel")}</FormControl.Label>
                <Select
                  placeholder={t("searchTeamsChannel")}
                  value={teamsChannel}
                  onChange={(value) => {
                    setTeamsChannel(value);
                    setTeamsError("");
                  }}
                  options={[
                    { label: "General", value: "general" },
                    { label: "Legal Team", value: "legal-team" },
                    { label: locale === "ja-JP" ? "案件" : "Case", value: "case" },
                  ]}
                />
                <FormControl.Caption>{t("teamsChannelCannotChange")}</FormControl.Caption>
              </FormControl>

              <FormControl>
                <FormControl.Label>{t("teamsNotificationRecipient")}</FormControl.Label>
                <Select
                  placeholder=""
                  value={teamsNotificationUser}
                  onChange={(value) => {
                    setTeamsNotificationUser(value);
                  }}
                  options={[
                    { label: locale === "ja-JP" ? "@山田太郎" : "@Yamada Taro", value: "yamada" },
                    { label: locale === "ja-JP" ? "@山下一郎" : "@Yamashita Ichiro", value: "yamashita" },
                    { label: locale === "ja-JP" ? "@柴田さくら" : "@Shibata Sakura", value: "shibata" },
                  ]}
                />
                <FormControl.Caption>{t("teamsMentionSentOnce")}</FormControl.Caption>
              </FormControl>

              <FormControl required>
                <FormControl.Label>{t("visibilitySetting")}</FormControl.Label>
                <RadioGroup
                  value={teamsVisibility}
                  onChange={(value) => {
                    setTeamsVisibility(value as "public" | "private");
                    setTeamsError("");
                  }}
                >
                  <Radio value="public">{t("publicStandardPro")}</Radio>
                  <Radio value="private">{t("privateProOnly")}</Radio>
                </RadioGroup>
              </FormControl>

              {teamsError && (
                <Banner color="danger" size="small">
                  {teamsError}
                </Banner>
              )}
            </div>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button
                variant="plain"
                onClick={() => {
                  setTeamsDialogOpen(false);
                  setTeamsError("");
                  setTeamsChannel("");
                  setTeamsNotificationUser("");
                  setTeamsVisibility("private");
                }}
              >
                {t("cancel")}
              </Button>
              <Button
                variant="solid"
                onClick={() => {
                  if (!teamsChannel) {
                    setTeamsError(t("selectTeamsChannelError"));
                    return;
                  }
                  // TODO: 実際のTeamsスレッド作成処理を実装
                  setTeamsDialogOpen(false);
                  setTeamsChannel("");
                  setTeamsNotificationUser("");
                  setTeamsVisibility("private");
                  setTeamsError("");
                }}
              >
                {t("createTeamsThread")}
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={sharedUsersDialogOpen}
        onOpenChange={(open) => {
          setSharedUsersDialogOpen(open);
          if (open) {
            // Dialogが開く際にPopoverを閉じる
            setSharedUsersPopoverOpen(false);
          }
        }}
      >
        <DialogContent width="large">
          <DialogHeader>
            <ContentHeader>
              <ContentHeader.Title>{t("configureSharedUsersTitle")}</ContentHeader.Title>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-large)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--aegis-space-small)",
                }}
              >
                <Checkbox
                  checked={inheritAccessRights}
                  onChange={(e) => {
                    setInheritAccessRights(e.target.checked);
                  }}
                />
                <Text variant="body.medium">{t("inheritAccessRights")}</Text>
                <Link
                  href="#"
                  trailing={
                    <>
                      <Icon>
                        <LfQuestionCircle />
                      </Icon>
                      <Icon>
                        <LfArrowUpRightFromSquare />
                      </Icon>
                    </>
                  }
                >
                  {t("aboutInheritance")}
                </Link>
              </div>
              <Tab.Group index={userTabIndex} onChange={(index) => setUserTabIndex(index)}>
                <Tab.List>
                  <Tab>{t("users")}</Tab>
                  <Tab>{t("userGroups")}</Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--aegis-space-medium)",
                      }}
                    >
                      {/* 検索バー */}
                      <FormControl>
                        <TextField
                          value={userSearchQuery}
                          onChange={(e) => {
                            setUserSearchQuery(e.target.value);
                          }}
                          placeholder={t("searchUserPlaceholder")}
                          leading={
                            <Icon>
                              <LfMagnifyingGlass />
                            </Icon>
                          }
                        />
                      </FormControl>

                      {/* ユーザーリスト */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--aegis-space-small)",
                          maxHeight: "400px",
                          overflowY: "auto",
                        }}
                      >
                        {availableUsers
                          .filter((user) => {
                            if (!userSearchQuery.trim()) return true;
                            const query = userSearchQuery.toLowerCase();
                            return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
                          })
                          .map((user) => (
                            <div
                              key={user.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--aegis-space-small)",
                                padding: "var(--aegis-space-small)",
                                borderRadius: "var(--aegis-radius-small)",
                              }}
                            >
                              <Checkbox
                                checked={selectedUsers.has(user.id)}
                                onChange={(checked) => {
                                  const newSelected = new Set(selectedUsers);
                                  if (checked) {
                                    newSelected.add(user.id);
                                  } else {
                                    newSelected.delete(user.id);
                                  }
                                  setSelectedUsers(newSelected);
                                }}
                              />
                              <Avatar size="small" name={user.name} />
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "var(--aegis-space-xxSmall)",
                                  flex: 1,
                                }}
                              >
                                <Text variant="body.medium" style={user.suspended ? { opacity: 0.5 } : {}}>
                                  {user.suspended ? `(${t("suspended")}) ${user.name}` : user.name}
                                </Text>
                                <Text variant="body.small" color="subtle">
                                  {user.email}
                                </Text>
                              </div>
                              <Button variant="subtle" size="small">
                                {user.role}
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--aegis-space-medium)",
                        padding: "var(--aegis-space-large)",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "200px",
                      }}
                    >
                      <Text variant="body.medium" color="subtle">
                        {t("userGroupFeatureComing")}
                      </Text>
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button
                variant="subtle"
                onClick={() => {
                  setSharedUsersDialogOpen(false);
                  setUserSearchQuery("");
                  setSelectedUsers(new Set());
                }}
              >
                {t("cancel")}
              </Button>
              <Button
                variant="solid"
                onClick={() => {
                  setSharedUsersDialogOpen(false);
                  setUserSearchQuery("");
                  setSelectedUsers(new Set());
                }}
              >
                {t("save")}
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CaseDetailRefresh;
