import { Divider, NavList } from "@legalforce/aegis-react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./SettingsNavList.module.css";
import type { SettingsNavItem } from "./settingsNavigation";
import { PROFILE_ITEMS, TENANT_ITEMS } from "./settingsNavigation";

function NavItem({ item, isActive }: { item: SettingsNavItem; isActive: boolean }) {
  const navigate = useNavigate();
  const { path } = item;

  return (
    <NavList.Item
      as="button"
      aria-current={isActive ? "page" : undefined}
      onClick={path ? () => navigate(path) : undefined}
    >
      {item.label}
    </NavList.Item>
  );
}

export function SettingsNavList() {
  const location = useLocation();

  return (
    <div className={styles.navList}>
      <NavList size="medium">
        {TENANT_ITEMS.map((item) => (
          <NavItem key={item.label} item={item} isActive={location.pathname === item.path} />
        ))}
      </NavList>
      <Divider className={styles.separator} />
      <NavList size="medium">
        {PROFILE_ITEMS.map((item) => (
          <NavItem key={item.label} item={item} isActive={location.pathname === item.path} />
        ))}
      </NavList>
    </div>
  );
}
