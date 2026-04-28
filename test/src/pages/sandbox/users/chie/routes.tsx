import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";
import { Container } from "./analytics-MVP/Container";
import { Layout } from "./analytics-MVP/Layout";
import Departments6 from "./analytics6/Departments";
import { Layout as Layout6 } from "./analytics6/Layout";
import LegalAdvice6 from "./analytics6/LegalAdvice";
import TeamMembers6 from "./analytics6/TeamMembers";
import Templates6 from "./analytics6/Templates";
import Workstreams6 from "./analytics6/Workstreams";

const UserChieSandbox = lazy(() => import("./index"));
const Analytics3 = lazy(() => import("./analytics3/index"));
const AnalyticsMvp = lazy(() => import("./analytics-MVP/index"));
const Analytics6 = lazy(() => import("./analytics6/index"));

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/chie",
    element: <UserChieSandbox />,
  },
  {
    path: "/sandbox/chie/analytics3",
    element: <Analytics3 />,
  },
  {
    path: "/sandbox/chie/analytics-MVP/*",
    element: <AnalyticsMvp />,
  },
  {
    path: "/sandbox/chie/analytics6/*",
    element: <Analytics6 />,
  },
];

export const chieRoutes: RouteObject[] = [
  {
    path: "/sandbox/users/chie/analytics-MVP",
    Component: Layout,
    children: [
      {
        index: true,
        lazy: () => import("./analytics-MVP").then((module) => ({ Component: module.default })),
      },
      {
        path: "team-members",
        Component: Container,
      },
    ],
  },
  {
    path: "/sandbox/users/chie/analytics6",
    Component: Layout6,
    children: [
      {
        index: true,
        lazy: () => import("./analytics6").then((module) => ({ Component: module.default })),
      },
      {
        path: "team-members",
        Component: TeamMembers6,
      },
      {
        path: "workstreams",
        Component: Workstreams6,
      },
      {
        path: "legal-advice",
        Component: LegalAdvice6,
      },
      {
        path: "departments",
        Component: Departments6,
      },
      {
        path: "templates",
        Component: Templates6,
      },
    ],
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/chie": "src/pages/sandbox/users/chie/index.tsx",
};
