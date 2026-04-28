import {
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
  LfWriting,
} from "@legalforce/aegis-icons";
import { LoaLogoLight } from "@legalforce/aegis-logos/react";
import type { ComponentType } from "react";

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
  label: string;
  href: string;
  menuItems?: {
    label: string;
    href?: string;
    icon?: ComponentType;
    disabled?: boolean;
  }[];
};

/** Navigation sections grouped by separators */
export const locNavigationSections = [
  [
    { id: "home", icon: LfHome, label: "ホーム", href: "/template/loc/dashboard" },
    { id: "search", icon: LfMagnifyingGlass, label: "検索", href: "/template/loc/search" },
    {
      id: "assistant",
      icon: LoaLogoLight,
      label: "アシスタント",
      href: "/template/loc/loa",
      menuItems: [
        { label: "新しい会話", href: "/template/loc/loa" },
        { label: "履歴", href: "/template/loc/loa/history" },
        { label: "プロンプトライブラリー", icon: LfAngleRight, href: "/template/loc/loa/prompt-library" },
        { label: "プレイブックエージェント", icon: LfAngleRight, disabled: true },
      ],
    },
  ],
  [
    {
      id: "cases",
      icon: LfArchive,
      label: "案件",
      href: "/template/loc/case",
      menuItems: [
        { label: "案件一覧", href: "/template/loc/case" },
        { label: "案件を作成", href: "/template/loc/case" },
      ],
    },
    { id: "review", icon: LfCheckCircle, label: "レビュー", href: "/template/loc/review" },
    {
      id: "contracts",
      icon: LfFileLines,
      label: "契約書",
      href: "/template/loc/contracts",
      menuItems: [
        { label: "契約書一覧", href: "/template/loc/contracts" },
        { label: "受領契約書", href: "/template/loc/contracts" },
      ],
    },
    {
      id: "esign",
      icon: LfWriting,
      label: "電子契約",
      href: "/template/loc/esign",
      menuItems: [
        { label: "電子契約一覧", href: "/template/loc/esign" },
        { label: "押印承認", href: "/template/loc/esign" },
      ],
    },
  ],
  [
    {
      id: "templates",
      icon: LfFilesLine,
      label: "ひな形",
      href: "/template/loc/legalon-template",
      menuItems: [
        { label: "自社ひな形", href: "/template/loc/legalon-template" },
        { label: "LegalOnテンプレート", href: "/template/loc/legalon-template" },
      ],
    },
    {
      id: "review-criteria",
      icon: LfCheckBook,
      label: "契約審査基準",
      href: "/template/loc/review-console",
      menuItems: [
        { label: "マイプレイブック", href: "/template/loc/review-console" },
        { label: "テナントのプレイブック", href: "/template/loc/review-console" },
      ],
    },
  ],
  [
    { id: "report", icon: LfChart, label: "レポート", href: "/template/loc/analytics" },
    {
      id: "others",
      icon: LfEllipsisDot,
      label: "その他",
      href: "/template/loc/others",
      menuItems: [
        { label: "個人設定", href: "/template/loc/personal-setting" },
        { label: "管理コンソール", href: "/template/loc/management-console" },
      ],
    },
  ],
] satisfies LocNavigationItem[][];

/** Flattened navigation items for easy lookup */
export const locNavigationItems = locNavigationSections.flat();
