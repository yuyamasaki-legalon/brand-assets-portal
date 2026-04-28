import {
  LfAiSparkles,
  LfBook,
  LfEllipsisDot,
  LfFileLines,
  LfFileSigned,
  LfFilesLine,
  LfHome,
  LfMagnifyingGlass,
  LfMail,
  LfProofreading,
  LfWriting,
} from "@legalforce/aegis-icons";
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
  | "concluded-contracts"
  | "templates"
  | "review-criteria"
  | "others";

export type LocNavigationItem = {
  id: LocNavigationId;
  icon: ComponentType;
  labelKey: NavigationTranslationKey;
  href: string;
};

const basePath = "/sandbox/loc/wataryooou/template-loc-i18n";

/** Navigation sections grouped by separators */
export const locNavigationSections = [
  [
    { id: "home", icon: LfHome, labelKey: "nav.home", href: `${basePath}/dashboard` },
    { id: "search", icon: LfMagnifyingGlass, labelKey: "nav.search", href: `${basePath}/search` },
    { id: "assistant", icon: LfAiSparkles, labelKey: "nav.assistant", href: `${basePath}/loa` },
  ],
  [
    { id: "cases", icon: LfMail, labelKey: "nav.cases", href: `${basePath}/case` },
    { id: "review", icon: LfProofreading, labelKey: "nav.review", href: `${basePath}/review` },
    { id: "contracts", icon: LfFileLines, labelKey: "nav.contracts", href: `${basePath}/contracts` },
    { id: "esign", icon: LfWriting, labelKey: "nav.esign", href: `${basePath}/esign` },
    {
      id: "concluded-contracts",
      icon: LfFileSigned,
      labelKey: "nav.concludedContracts",
      href: `${basePath}/concluded-contracts`,
    },
  ],
  [
    { id: "templates", icon: LfFilesLine, labelKey: "nav.templates", href: `${basePath}/legalon-template` },
    { id: "review-criteria", icon: LfBook, labelKey: "nav.reviewCriteria", href: `${basePath}/review-console` },
  ],
  [{ id: "others", icon: LfEllipsisDot, labelKey: "nav.others", href: `${basePath}/others` }],
] satisfies LocNavigationItem[][];

/** Flattened navigation items for easy lookup */
export const locNavigationItems = locNavigationSections.flat();
