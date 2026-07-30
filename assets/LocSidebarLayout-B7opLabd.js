var e=`import { LfArrowUpRightFromSquare } from "@legalforce/aegis-icons";
import {
  ActionList,
  Icon,
  Popover,
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarInset,
  SidebarNavigation,
  SidebarNavigationItem,
  SidebarNavigationLink,
  SidebarNavigationSeparator,
  SidebarNavigationSubTrigger,
  SidebarProvider,
  SidebarTrigger,
} from "@legalforce/aegis-react";
import type { PropsWithChildren } from "react";
import { Fragment, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "../../../../hooks";
import { type NavigationTranslationKey, navigationTranslations } from "./data/translations";
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
  const { t } = useTranslation<NavigationTranslationKey>(navigationTranslations);
  // Track open state externally so we can mirror loc-app's dual-mode:
  // expanded → "その他" の中身を inline 展開、collapsed → 既存の popover 表示。
  const [open, setOpen] = useState(defaultOpen);

  const getIsActive = (itemHref: string, itemId: LocNavigationId): boolean => {
    if (activeId) {
      return itemId === activeId;
    }
    if (autoDetectActive) {
      return location.pathname.startsWith(itemHref);
    }
    return false;
  };

  const renderInlineMenuItem = (menuItem: NonNullable<LocNavigationItem["menuItems"]>[number]) => {
    const ItemIcon = menuItem.icon;
    const leading = ItemIcon ? (
      <Icon>
        <ItemIcon />
      </Icon>
    ) : undefined;
    const trailing = menuItem.external ? (
      <Icon>
        <LfArrowUpRightFromSquare />
      </Icon>
    ) : undefined;
    return (
      <SidebarNavigationItem key={menuItem.label}>
        <SidebarNavigationLink asChild leading={leading} trailing={trailing}>
          {menuItem.href && menuItem.href !== "#" ? (
            <Link to={menuItem.href}>{menuItem.label}</Link>
          ) : (
            <button type="button">{menuItem.label}</button>
          )}
        </SidebarNavigationLink>
      </SidebarNavigationItem>
    );
  };

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar>
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarBody>
          <SidebarNavigation>
            {locNavigationSections.map((section, sectionIndex) => (
              <Fragment key={section.map(({ id }) => id).join("-")}>
                {(section as readonly LocNavigationItem[]).map(
                  ({ id, icon: IconComponent, labelKey, href, menuItems }) => {
                    // Special case: "others" は expanded のとき中身を flatten して描画する（dev parity）。
                    if (id === "others" && open && menuItems) {
                      return <Fragment key={id}>{menuItems.map(renderInlineMenuItem)}</Fragment>;
                    }
                    return (
                      <SidebarNavigationItem key={id}>
                        {menuItems ? (
                          <Popover trigger="hover" placement="right-start" strategy="absolute">
                            <Popover.Anchor>
                              <SidebarNavigationSubTrigger
                                aria-current={getIsActive(href, id) ? "page" : undefined}
                                leading={
                                  <Icon>
                                    <IconComponent />
                                  </Icon>
                                }
                                onClick={() => navigate(href)}
                              >
                                {t(labelKey)}
                              </SidebarNavigationSubTrigger>
                            </Popover.Anchor>
                            <Popover.Content width="small">
                              <Popover.Body>
                                <ActionList role="menu">
                                  {menuItems.map((menuItem: NonNullable<LocNavigationItem["menuItems"]>[number]) => (
                                    <ActionList.Item
                                      role="menuitem"
                                      as="div"
                                      key={menuItem.label}
                                      disabled={menuItem.disabled}
                                      onClick={() => {
                                        if (menuItem.href && menuItem.href !== "#") {
                                          navigate(menuItem.href);
                                        }
                                      }}
                                    >
                                      <ActionList.Body
                                        trailing={
                                          menuItem.external ? (
                                            <Icon>
                                              <LfArrowUpRightFromSquare />
                                            </Icon>
                                          ) : undefined
                                        }
                                      >
                                        {menuItem.label}
                                      </ActionList.Body>
                                    </ActionList.Item>
                                  ))}
                                </ActionList>
                              </Popover.Body>
                            </Popover.Content>
                          </Popover>
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
                            <Link to={href}>{t(labelKey)}</Link>
                          </SidebarNavigationLink>
                        )}
                      </SidebarNavigationItem>
                    );
                  },
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
`;export{e as default};