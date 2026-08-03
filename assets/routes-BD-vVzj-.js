var e=`import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const UserYuYamasakiSandbox = lazy(() => import("./index"));
const BrandAssetPortal = lazy(() => import("../../brand-asset-portal/index"));

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/yu.yamasaki",
    element: <UserYuYamasakiSandbox />,
  },
  {
    path: "/sandbox/yu.yamasaki/brand-asset-portal",
    element: <BrandAssetPortal />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/yu.yamasaki": "src/pages/sandbox/users/yu-yamasaki/index.tsx",
  "/sandbox/yu.yamasaki/brand-asset-portal": "src/pages/sandbox/brand-asset-portal/index.tsx",
};
`;export{e as default};