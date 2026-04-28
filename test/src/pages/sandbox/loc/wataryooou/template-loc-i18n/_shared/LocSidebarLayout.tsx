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
  SidebarTrigger,
} from "@legalforce/aegis-react";
import type { PropsWithChildren } from "react";
import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "../../../../../../hooks";
import { type NavigationTranslationKey, navigationTranslations } from "./data/translations";
import { type LocNavigationId, locNavigationSections } from "./locNavigation";

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
  const { t } = useTranslation<NavigationTranslationKey>(navigationTranslations);

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
                {section.map(({ id, icon: IconComponent, labelKey, href }) => (
                  <SidebarNavigationItem key={id}>
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
                  </SidebarNavigationItem>
                ))}
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
