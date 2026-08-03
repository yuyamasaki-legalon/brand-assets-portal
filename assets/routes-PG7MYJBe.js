var e=`import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../types/routes";

const PatternsPage = lazy(() => import("./index").then((module) => ({ default: module.PatternsPage })));
const SidebarLayoutRecipePage = lazy(() =>
  import("./recipes/sidebar-layout-page").then((module) => ({ default: module.SidebarLayoutRecipePage })),
);

export const routes: RouteConfig[] = [
  {
    path: "/patterns",
    element: <PatternsPage />,
  },
  {
    path: "/patterns/recipes/sidebar-layout",
    element: <SidebarLayoutRecipePage />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/patterns": "src/pages/patterns/index.tsx",
  "/patterns/recipes/sidebar-layout": "src/pages/patterns/recipes/sidebar-layout-page.tsx",
};
`;export{e as default};