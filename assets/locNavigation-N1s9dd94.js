var e=`import {
  LfAngleRight,
  LfArchive,
  LfChart,
  LfCheckBook,
  LfCheckCircle,
  LfEllipsisDot,
  LfFileLines,
  LfFilesLine,
  LfHome,
  LfMagnifyingGlass,
  LfProfile,
  LfRightFromBracket,
  LfSetting,
  LfWriting,
} from "@legalforce/aegis-icons";
import { LoaLogoLight } from "@legalforce/aegis-logos/react";
import type { ComponentType } from "react";
import type { NavigationTranslationKey } from "./data/translations";

/** Navigation item identifier for active state tracking */
export type LocNavigationId =
  | "home"
  | "search"
  | "assistant"
  | "cases"
  | "review"
  | "contracts"
  | "esign"
  | "templates"
  | "review-criteria"
  | "report"
  | "others";

export type LocNavigationItem = {
  id: LocNavigationId;
  icon: ComponentType;
  /** ナビゲーションラベルの翻訳キー（_shared/data/translations.ts）。 */
  labelKey: NavigationTranslationKey;
  href: string;
  menuItems?: {
    label: string;
    href?: string;
    icon?: ComponentType;
    disabled?: boolean;
    /** 外部リンク（trailing アイコンに「↗」を表示）。 */
    external?: boolean;
  }[];
};

/** Navigation sections grouped by separators */
export const locNavigationSections = [
  [
    { id: "home", icon: LfHome, labelKey: "nav.home", href: "/template/loc/dashboard" },
    { id: "search", icon: LfMagnifyingGlass, labelKey: "nav.search", href: "/template/loc/search" },
    {
      id: "assistant",
      icon: LoaLogoLight,
      labelKey: "nav.assistant",
      href: "/template/loc/loa",
      menuItems: [
        { label: "新しい会話", href: "/template/loc/loa" },
        { label: "履歴", href: "/template/loc/loa/history" },
        { label: "プロンプトライブラリー", icon: LfAngleRight, href: "/template/loc/loa/prompt-library" },
        { label: "プレイブックエージェント", icon: LfAngleRight, href: "/template/loc/loa/playbook" },
      ],
    },
  ],
  [
    {
      id: "cases",
      icon: LfArchive,
      labelKey: "nav.cases",
      href: "/template/loc/case",
      menuItems: [
        { label: "案件", href: "/template/loc/case" },
        { label: "案件受付フォーム", href: "/template/case-reception-form" },
      ],
    },
    { id: "review", icon: LfCheckCircle, labelKey: "nav.review", href: "/template/loc/review" },
    { id: "contracts", icon: LfFileLines, labelKey: "nav.contracts", href: "/template/file-management" },
    {
      id: "esign",
      icon: LfWriting,
      labelKey: "nav.esign",
      href: "/template/esign/envelope-list",
      menuItems: [
        { label: "署名依頼", href: "/template/esign/envelope-list" },
        { label: "署名依頼テンプレート", icon: LfAngleRight, disabled: true },
      ],
    },
  ],
  [
    {
      id: "templates",
      icon: LfFilesLine,
      labelKey: "nav.templates",
      href: "/template/loc/legalon-template",
      menuItems: [
        { label: "自社ひな形", href: "/template/loc/legalon-template" },
        { label: "LegalOnテンプレート", href: "/template/loc/legalon-template" },
      ],
    },
    {
      id: "review-criteria",
      icon: LfCheckBook,
      labelKey: "nav.reviewCriteria",
      href: "/template/loc/review-console/my-playbook",
      menuItems: [
        { label: "プレイブック", href: "/template/loc/review-console/my-playbook" },
        { label: "LegalOnアラート", href: "/template/loc/review-console/rules" },
      ],
    },
  ],
  [
    { id: "report", icon: LfChart, labelKey: "nav.report", href: "/template/loc/analytics" },
    {
      id: "others",
      icon: LfEllipsisDot,
      labelKey: "nav.others",
      href: "/template/management-console",
      menuItems: [
        { label: "管理者設定", href: "/template/management-console", icon: LfSetting },
        { label: "個人設定", href: "/template/personal-setting", icon: LfProfile },
        { label: "LegalOn Forum", href: "#", external: true },
        { label: "メンテナンス・障害情報", href: "#", external: true },
        { label: "ヘルプサイト", href: "#", external: true },
        { label: "ログアウト", href: "#", icon: LfRightFromBracket },
      ],
    },
  ],
] satisfies LocNavigationItem[][];

/** Flattened navigation items for easy lookup */
export const locNavigationItems = locNavigationSections.flat();
`;export{e as default};