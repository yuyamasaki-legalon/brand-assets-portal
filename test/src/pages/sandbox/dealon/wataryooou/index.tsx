import { LfApps, LfChartBar, LfMenu } from "@legalforce/aegis-icons";
import {
  Avatar,
  Button,
  EmptyState,
  Header,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  Tab,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { ActivityCycleSection } from "./components/ActivityCycleSection";
import { ActivitySidebar } from "./components/ActivitySidebar";
import { AIChatSidebar } from "./components/AIChatSidebar";
import { AlertReportSection } from "./components/AlertReportSection";
import { SalesSection } from "./components/SalesSection";

export function DealOnWataryooou() {
  return (
    <SidebarProvider defaultOpen>
      <SidebarInset>
        {/* Global header */}
        <Header>
          <Header.Item>
            <Text variant="title.medium" as="span">
              DEALON
            </Text>
          </Header.Item>
          <Header.Spacer />
          <Header.Item>
            <Avatar name="wataryooou" size="small" />
          </Header.Item>
          <Header.Item>
            <SidebarTrigger>
              <Tooltip title="AIチャット">
                <IconButton aria-label="AIチャット" variant="plain">
                  <Icon>
                    <LfMenu />
                  </Icon>
                </IconButton>
              </Tooltip>
            </SidebarTrigger>
          </Header.Item>
        </Header>

        <PageLayout>
          {/* Left sidebar - Activity list */}
          <ActivitySidebar />

          {/* Main content */}
          <PageLayoutContent>
            <PageLayoutBody>
              <Tab.Group>
                <Tab.List bordered={false}>
                  <Tab
                    leading={
                      <Icon>
                        <LfApps />
                      </Icon>
                    }
                  >
                    ダッシュボード
                  </Tab>
                  <Tab
                    leading={
                      <Icon>
                        <LfChartBar />
                      </Icon>
                    }
                  >
                    KPI
                  </Tab>
                </Tab.List>
                <Tab.Panels>
                  {/* Dashboard tab */}
                  <Tab.Panel>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--aegis-space-large)",
                        padding: "var(--aegis-space-medium) 0",
                      }}
                    >
                      <SalesSection />
                      <AlertReportSection />
                      <ActivityCycleSection />
                    </div>
                  </Tab.Panel>

                  {/* KPI tab - Empty state */}
                  <Tab.Panel>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "400px",
                      }}
                    >
                      <EmptyState
                        title="KPI データを準備中です"
                        visual={
                          <Icon color="subtle" size="xLarge">
                            <LfChartBar />
                          </Icon>
                        }
                        action={<Button variant="plain">通知を受け取る</Button>}
                      />
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </PageLayoutBody>
          </PageLayoutContent>
        </PageLayout>
      </SidebarInset>

      {/* Right sidebar - AI Chat */}
      <AIChatSidebar />
    </SidebarProvider>
  );
}
