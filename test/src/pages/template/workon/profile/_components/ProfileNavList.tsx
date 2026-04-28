import { LfAngleRightMiddle } from "@legalforce/aegis-icons";
import { Icon, NavList, Text } from "@legalforce/aegis-react";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = {
  main: [
    { label: "従業員情報", path: "/template/workon/profile/employee" },
    { label: "個人情報", path: "/template/workon/profile/personal-info" },
    { label: "付加情報", path: "/template/workon/profile/additional-info" },
    { label: "税・保険", path: "/template/workon/profile/tax-insurance" },
    { label: "配偶者・家族", path: "/template/workon/profile/family-info" },
    { label: "支給・控除", path: "/template/workon/profile/payment-deduction" },
    { label: "給与・賞与明細", path: "/template/workon/profile/salary-bonus-detail" },
  ],
  middle: [
    { label: "休職歴", path: "/template/workon/profile/leave-of-absence" },
    { label: "異動歴", path: "/template/workon/profile/department-assignment" },
  ],
  bottom: [{ label: "カスタム項目", path: "/template/workon/profile/custom" }],
};

interface NavItemProps {
  label: string;
  path: string;
  isActive: boolean;
  onClick: () => void;
}

function NavItem({ label, isActive, onClick }: NavItemProps) {
  return (
    <NavList.Item onClick={onClick} aria-current={isActive ? "page" : undefined}>
      <Text
        as="span"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {label}
        <Icon size="small">
          <LfAngleRightMiddle />
        </Icon>
      </Text>
    </NavList.Item>
  );
}

export function ProfileNavList() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <NavList size="medium">
      <NavList.Group>
        {navItems.main.map((item) => (
          <NavItem
            key={item.path}
            label={item.label}
            path={item.path}
            isActive={location.pathname === item.path}
            onClick={() => handleNavigate(item.path)}
          />
        ))}
      </NavList.Group>
      <NavList.Group>
        {navItems.middle.map((item) => (
          <NavItem
            key={item.path}
            label={item.label}
            path={item.path}
            isActive={location.pathname === item.path}
            onClick={() => handleNavigate(item.path)}
          />
        ))}
      </NavList.Group>
      <NavList.Group>
        {navItems.bottom.map((item) => (
          <NavItem
            key={item.path}
            label={item.label}
            path={item.path}
            isActive={location.pathname === item.path}
            onClick={() => handleNavigate(item.path)}
          />
        ))}
      </NavList.Group>
    </NavList>
  );
}
