import {
  LfApps,
  LfCheckCircle,
  LfHome,
  LfList,
  LfSend,
  LfSetting,
  LfUserGroup,
  LfWriting,
} from "@legalforce/aegis-icons";
import {
  Avatar,
  ContentHeader,
  ContentHeaderTitle,
  Icon,
  IconButton,
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
  SidebarNavigationSeparator,
  SidebarProvider,
  Tooltip,
} from "@legalforce/aegis-react";
import { ProfileNavList } from "./ProfileNavList";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Avatar name="WorkOn" />
        </SidebarHeader>
        <SidebarBody>
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "var(--aegis-space-xLarge)",
            }}
          >
            <SidebarNavigation>
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  leading={
                    <Icon>
                      <LfList />
                    </Icon>
                  }
                >
                  TODO
                </SidebarNavigationLink>
              </SidebarNavigationItem>
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
                      <LfWriting />
                    </Icon>
                  }
                >
                  手続き
                </SidebarNavigationLink>
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  aria-current="page"
                  leading={
                    <Icon>
                      <LfUserGroup />
                    </Icon>
                  }
                >
                  組織図
                </SidebarNavigationLink>
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  leading={
                    <Icon>
                      <LfCheckCircle />
                    </Icon>
                  }
                >
                  承認
                </SidebarNavigationLink>
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  leading={
                    <Icon>
                      <LfSend />
                    </Icon>
                  }
                >
                  申請
                </SidebarNavigationLink>
              </SidebarNavigationItem>
              <SidebarNavigationSeparator />
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  leading={
                    <Icon>
                      <LfApps />
                    </Icon>
                  }
                >
                  アプリ
                </SidebarNavigationLink>
              </SidebarNavigationItem>
            </SidebarNavigation>
            <SidebarNavigation
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--aegis-space-small)",
              }}
            >
              <Tooltip title="設定">
                <IconButton variant="plain" aria-label="設定">
                  <Icon>
                    <LfSetting />
                  </Icon>
                </IconButton>
              </Tooltip>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Avatar name="山田" size="small" color="teal" />
              </div>
            </SidebarNavigation>
          </div>
        </SidebarBody>
      </Sidebar>

      <SidebarInset>
        <PageLayout>
          <PageLayoutPane>
            <PageLayoutHeader>
              <ContentHeader>
                <ContentHeaderTitle>山田 太郎</ContentHeaderTitle>
              </ContentHeader>
            </PageLayoutHeader>
            <PageLayoutBody>
              <ProfileNavList />
            </PageLayoutBody>
          </PageLayoutPane>
          {children}
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  );
}
