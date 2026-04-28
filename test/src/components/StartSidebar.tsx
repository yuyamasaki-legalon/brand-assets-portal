import {
  LfAt,
  LfBuilding,
  LfCalendar,
  LfChart,
  LfChartBar,
  LfComment,
  LfForumLogo,
  LfLogo,
  LfProfile,
  LfSetting,
  LfSupport,
} from "@legalforce/aegis-icons";
import { Badge, Icon, PageLayoutSidebar, SideNavigation } from "@legalforce/aegis-react";
import type { FC } from "react";

export const StartSidebar: FC = () => (
  <PageLayoutSidebar>
    <SideNavigation aria-label="Start Navigation">
      <SideNavigation.Group>
        <SideNavigation.Item icon={LfLogo} href="#">
          Home
        </SideNavigation.Item>
        <SideNavigation.Item icon={LfChart} href="#">
          Chart
        </SideNavigation.Item>
        <SideNavigation.Item
          icon={
            <Badge position="top-start" color="danger">
              <Icon>
                <LfCalendar />
              </Icon>
            </Badge>
          }
          href="#"
        >
          Schedule
        </SideNavigation.Item>
        <SideNavigation.Item icon={LfComment} href="#">
          Chat
        </SideNavigation.Item>
        <SideNavigation.Item icon={LfChartBar} href="#">
          Task
        </SideNavigation.Item>
        <SideNavigation.Item icon={LfAt} href="#">
          Mention
        </SideNavigation.Item>
      </SideNavigation.Group>
      <SideNavigation.Group>
        <SideNavigation.Item icon={LfBuilding} href="#">
          Organization
        </SideNavigation.Item>
        <SideNavigation.Item icon={LfProfile} href="#">
          Profile
        </SideNavigation.Item>
        <SideNavigation.Item icon={LfSetting} href="#" aria-current="page">
          Settings
        </SideNavigation.Item>
      </SideNavigation.Group>
      <SideNavigation.Group>
        <SideNavigation.Item icon={LfForumLogo} href="#">
          Forum
        </SideNavigation.Item>
        <SideNavigation.Item icon={LfSupport} href="#">
          Support
        </SideNavigation.Item>
      </SideNavigation.Group>
    </SideNavigation>
  </PageLayoutSidebar>
);
