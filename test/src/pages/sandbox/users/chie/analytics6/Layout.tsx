import {
  LfArchive,
  LfChart,
  LfCheckBook,
  LfEllipsisDot,
  LfFileLines,
  LfFileSigned,
  LfFilesLine,
  LfHome,
  LfMagnifyingGlass,
  LfWriting,
} from "@legalforce/aegis-icons";
import {
  ContentHeader,
  Icon,
  NavList,
  PageLayout,
  PageLayoutBody,
  PageLayoutHeader,
  PageLayoutPane,
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
import { Outlet, useLocation } from "react-router-dom";

export function Layout() {
  const { pathname } = useLocation();
  const basePath = "/sandbox/chie/analytics6";

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarBody>
          <SidebarNavigation>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfHome />
                  </Icon>
                }
              >
                ホーム
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfMagnifyingGlass />
                  </Icon>
                }
              >
                検索
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfMagnifyingGlass />
                  </Icon>
                }
              >
                アシスタント
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfArchive />
                  </Icon>
                }
              >
                案件
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfFileLines />
                  </Icon>
                }
              >
                契約書
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfWriting />
                  </Icon>
                }
              >
                電子契約
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfFileSigned />
                  </Icon>
                }
              >
                締結済契約書
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfFilesLine />
                  </Icon>
                }
              >
                ひな形
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfCheckBook />
                  </Icon>
                }
              >
                契約審査基準
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                aria-current="page"
                leading={
                  <Icon>
                    <LfChart />
                  </Icon>
                }
              >
                分析
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfEllipsisDot />
                  </Icon>
                }
              >
                その他
              </SidebarNavigationLink>
            </SidebarNavigationItem>
          </SidebarNavigation>
        </SidebarBody>
      </Sidebar>
      <SidebarInset>
        <PageLayout>
          <PageLayoutPane position="start" aria-label="Start Pane" width="small">
            <PageLayoutHeader>
              <ContentHeader>
                <ContentHeader.Title>分析</ContentHeader.Title>
              </ContentHeader>
            </PageLayoutHeader>
            <PageLayoutBody>
              <NavList>
                <NavList.Item
                  href={`${basePath}`}
                  aria-current={pathname === basePath || pathname === `${basePath}/` ? "page" : undefined}
                >
                  チーム・メンバー
                </NavList.Item>
                <NavList.Item
                  href={`${basePath}/departments`}
                  aria-current={pathname === `${basePath}/departments` ? "page" : undefined}
                >
                  部署
                </NavList.Item>
                <NavList.Item
                  href={`${basePath}/workstreams`}
                  aria-current={pathname === `${basePath}/workstreams` ? "page" : undefined}
                >
                  契約書
                </NavList.Item>
                <NavList.Item
                  href={`${basePath}/legal-advice`}
                  aria-current={pathname === `${basePath}/legal-advice` ? "page" : undefined}
                >
                  案件
                </NavList.Item>
                <NavList.Item
                  href={`${basePath}/templates`}
                  aria-current={pathname === `${basePath}/templates` ? "page" : undefined}
                >
                  テンプレート
                </NavList.Item>
                <NavList.Item
                  href={`${basePath}/design-adjustments`}
                  aria-current={pathname === `${basePath}/design-adjustments` ? "page" : undefined}
                >
                  デザイン調整
                </NavList.Item>
              </NavList>
            </PageLayoutBody>
          </PageLayoutPane>
          <Outlet />
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  );
}
