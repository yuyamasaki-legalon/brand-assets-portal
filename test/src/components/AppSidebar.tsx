import { LfBook, LfChartBar, LfCode, LfFileLines, LfGraphNode, LfHome, LfMegaphone } from "@legalforce/aegis-icons";
import {
  Icon,
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarInset,
  SidebarNavigation,
  SidebarNavigationItem,
  SidebarNavigationLink,
  SidebarProvider,
  SidebarTrigger,
} from "@legalforce/aegis-react";
import type { ComponentType, FC, PropsWithChildren } from "react";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

const ENABLE_VISUAL_EDITOR = import.meta.env.VITE_ENABLE_VISUAL_EDITOR === "true";

const navItems: Array<{ icon: ComponentType; label: string; path: string }> = [
  { icon: LfHome, label: "Home", path: "/" },
  ...(ENABLE_VISUAL_EDITOR
    ? [{ icon: LfGraphNode as ComponentType, label: "Visual Editor", path: "/visual-editor" }]
    : []),
  { icon: LfBook, label: "Templates", path: "/template" },
  { icon: LfCode, label: "Sandbox", path: "/sandbox" },
  { icon: LfChartBar, label: "Analytics", path: "/analytics" },
  { icon: LfFileLines, label: "Markdown", path: "/markdown-viewer" },
  { icon: LfMegaphone, label: "Updates", path: "/updates" },
];

/**
 * Sidebar を表示するパス一覧
 * ここにマッチするパスでのみ Sidebar が表示される
 * それ以外（テンプレート実装、プロトタイプ詳細）では非表示
 */
const SIDEBAR_PATHS = [
  "/", // Home
  ...(ENABLE_VISUAL_EDITOR ? ["/visual-editor"] : []),
  "/template", // Template index
  "/template/pagelayout", // PageLayout patterns index
  "/template/states", // States index pages
  "/sandbox", // Sandbox index
  "/sandbox/loc", // LOC index
  "/sandbox/dealon", // DealOn index
  "/sandbox/workon", // WorkOn index
  "/analytics", // Analytics
  "/updates", // Updates
  "/markdown-viewer", // Markdown viewer
  "/sandbox/workon/wataryooou/mobile", // Mobile index
];

/**
 * Sidebar を表示するインデックスページのパターン
 * - /sandbox/{user} (e.g. /sandbox/wataryooou)
 * - /sandbox/{service}/{user} (e.g. /sandbox/loc/wataryooou)
 * - /template/{category} (e.g. /template/pagelayout) — ただし SIDEBAR_PATHS で個別指定
 */
const SIDEBAR_INDEX_PATTERNS = [
  /^\/sandbox\/[^/]+$/, // /sandbox/{user}
  /^\/sandbox\/(loc|dealon|workon)\/[^/]+$/, // /sandbox/{service}/{user}
  /^\/updates\/aegis-releases\/.+$/, // /updates/aegis-releases/{version}/**
];

function shouldShowSidebar(pathname: string): boolean {
  if (SIDEBAR_PATHS.includes(pathname)) return true;
  return SIDEBAR_INDEX_PATTERNS.some((pattern) => pattern.test(pathname));
}

export const AppSidebarLayout: FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const showSidebar = shouldShowSidebar(location.pathname);
  const isEmbeddedPreview = useMemo(() => new URLSearchParams(window.location.search).has("embedded-preview"), []);

  const getIsActive = (path: string): boolean => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // Hide /visual-editor in embedded preview to prevent recursive nesting
  const visibleNavItems = isEmbeddedPreview ? navItems.filter((item) => item.path !== "/visual-editor") : navItems;

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar>
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarBody>
          <SidebarNavigation>
            {visibleNavItems.map(({ icon: IconComponent, label, path }) => (
              <SidebarNavigationItem key={path}>
                <SidebarNavigationLink
                  asChild
                  aria-current={getIsActive(path) ? "page" : undefined}
                  leading={
                    <Icon>
                      <IconComponent />
                    </Icon>
                  }
                >
                  <Link to={path}>{label}</Link>
                </SidebarNavigationLink>
              </SidebarNavigationItem>
            ))}
          </SidebarNavigation>
        </SidebarBody>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};
