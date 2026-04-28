import { LfAngleRight } from "@legalforce/aegis-icons";
import {
  ActionList,
  Icon,
  Menu,
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarInset,
  SidebarNavigation,
  SidebarNavigationItem,
  SidebarNavigationLink,
  SidebarNavigationSeparator,
  SidebarProvider,
  SidebarTrigger,
} from "@legalforce/aegis-react";
import type { PropsWithChildren } from "react";
import { Fragment } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { type LocNavigationId, type LocNavigationItem, locNavigationSections } from "./locNavigation";

export type LocSidebarLayoutProps = PropsWithChildren<{
  /** The ID of the currently active navigation item */
  activeId?: LocNavigationId;
  /** Whether to auto-detect active item from current URL (default: true) */
  autoDetectActive?: boolean;
  /** Default open state of the sidebar (default: false) */
  defaultOpen?: boolean;
}>;

export const LocSidebarLayout = ({
  children,
  activeId,
  autoDetectActive = true,
  defaultOpen = false,
}: LocSidebarLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getIsActive = (itemHref: string, itemId: LocNavigationId): boolean => {
    if (activeId) {
      return itemId === activeId;
    }
    if (autoDetectActive) {
      return location.pathname.startsWith(itemHref);
    }
    return false;
  };

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar>
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarBody>
          <SidebarNavigation>
            {locNavigationSections.map((section, sectionIndex) => (
              <Fragment key={section.map(({ id }) => id).join("-")}>
                {(section as readonly LocNavigationItem[]).map(
                  ({ id, icon: IconComponent, label, href, menuItems }) => (
                    <SidebarNavigationItem key={id}>
                      {menuItems ? (
                        <Menu placement="right-start">
                          <Menu.Anchor>
                            <SidebarNavigationLink
                              asChild
                              aria-current={getIsActive(href, id) ? "page" : undefined}
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
                              <button type="button">{label}</button>
                            </SidebarNavigationLink>
                          </Menu.Anchor>
                          <Menu.Box width="auto">
                            <ActionList>
                              {menuItems.map((menuItem: NonNullable<LocNavigationItem["menuItems"]>[number]) => (
                                <ActionList.Item
                                  as="div"
                                  key={menuItem.label}
                                  disabled={menuItem.disabled}
                                  onClick={() => {
                                    if (menuItem.href) {
                                      navigate(menuItem.href);
                                    }
                                  }}
                                >
                                  <ActionList.Body>{menuItem.label}</ActionList.Body>
                                </ActionList.Item>
                              ))}
                            </ActionList>
                          </Menu.Box>
                        </Menu>
                      ) : (
                        <SidebarNavigationLink
                          asChild
                          aria-current={getIsActive(href, id) ? "page" : undefined}
                          leading={
                            <Icon>
                              <IconComponent />
                            </Icon>
                          }
                        >
                          <Link to={href}>{label}</Link>
                        </SidebarNavigationLink>
                      )}
                    </SidebarNavigationItem>
                  ),
                )}
                {sectionIndex < locNavigationSections.length - 1 && <SidebarNavigationSeparator />}
              </Fragment>
            ))}
          </SidebarNavigation>
        </SidebarBody>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};
