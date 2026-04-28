import {
  LfAiSparkles,
  LfAngleRight,
  LfBook,
  LfEllipsisDot,
  LfFileLines,
  LfFilesLine,
  LfHome,
  LfMagnifyingGlass,
  LfMail,
  LfPen,
  LfWriting,
} from "@legalforce/aegis-icons";
import {
  Icon,
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarInset,
  SidebarNavigation,
  SidebarNavigationItem,
  SidebarNavigationLink,
  SidebarNavigationSeparator,
  SidebarProvider,
} from "@legalforce/aegis-react";
import type { ComponentType, PropsWithChildren } from "react";
import { Fragment } from "react";
import { useTranslation } from "../../../../../../hooks";
import { type TranslationKey, translations } from "./data/translations";

type NavigationItem = {
  icon: ComponentType;
  labelKey: TranslationKey;
};

const navigationSections: NavigationItem[][] = [
  [
    { icon: LfHome, labelKey: "nav.dashboard" },
    { icon: LfMagnifyingGlass, labelKey: "nav.search" },
    { icon: LfAiSparkles, labelKey: "nav.assistant" },
  ],
  [
    { icon: LfMail, labelKey: "nav.cases" },
    { icon: LfFileLines, labelKey: "nav.contracts" },
    { icon: LfWriting, labelKey: "nav.esign" },
    { icon: LfPen, labelKey: "nav.concluded" },
  ],
  [
    { icon: LfFilesLine, labelKey: "nav.templates" },
    { icon: LfBook, labelKey: "nav.criteria" },
  ],
  [{ icon: LfEllipsisDot, labelKey: "nav.others" }],
];

const sidebarStyle = {
  width: 78,
  minWidth: 78,
} as const;

export const RootSidebarLayout = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation<TranslationKey>(translations);

  return (
    <SidebarProvider>
      <Sidebar style={sidebarStyle}>
        <SidebarHeader />
        <SidebarBody>
          <SidebarNavigation>
            {navigationSections.map((section, sectionIndex) => (
              <Fragment key={section.map(({ labelKey }) => labelKey).join("-")}>
                {section.map(({ icon: IconComponent, labelKey }) => (
                  <SidebarNavigationItem key={labelKey}>
                    <SidebarNavigationLink
                      href="#"
                      leading={
                        <Icon>
                          <IconComponent />
                        </Icon>
                      }
                      trailing={
                        <Icon>
                          <LfAngleRight />
                        </Icon>
                      }
                    >
                      {t(labelKey)}
                    </SidebarNavigationLink>
                  </SidebarNavigationItem>
                ))}
                {sectionIndex < navigationSections.length - 1 ? <SidebarNavigationSeparator /> : null}
              </Fragment>
            ))}
          </SidebarNavigation>
        </SidebarBody>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};
