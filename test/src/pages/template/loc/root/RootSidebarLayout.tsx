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

type NavigationItem = {
  icon: ComponentType;
  label: string;
};

const navigationSections: NavigationItem[][] = [
  [
    { icon: LfHome, label: "ダッシュボード" },
    { icon: LfMagnifyingGlass, label: "検索" },
    { icon: LfAiSparkles, label: "アシスタント" },
  ],
  [
    { icon: LfMail, label: "案件" },
    { icon: LfFileLines, label: "契約" },
    { icon: LfWriting, label: "電子契約" },
    { icon: LfPen, label: "締結版契約書" },
  ],
  [
    { icon: LfFilesLine, label: "ひな形" },
    { icon: LfBook, label: "契約書審査基準" },
  ],
  [{ icon: LfEllipsisDot, label: "その他" }],
];

const sidebarStyle = {
  width: 78,
  minWidth: 78,
} as const;

export const RootSidebarLayout = ({ children }: PropsWithChildren) => {
  return (
    <SidebarProvider>
      <Sidebar style={sidebarStyle}>
        <SidebarHeader />
        <SidebarBody>
          <SidebarNavigation>
            {navigationSections.map((section, sectionIndex) => (
              <Fragment key={section.map(({ label }) => label).join("-")}>
                {section.map(({ icon: IconComponent, label }) => (
                  <SidebarNavigationItem key={label}>
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
                      {label}
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
