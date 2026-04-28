import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const UserAkahiraSandbox = lazy(() => import("./index").then((module) => ({ default: module.UserAkahiraSandbox })));

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/loc/akahira",
    element: <UserAkahiraSandbox />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/loc/akahira": "src/pages/sandbox/loc/akahira/index.tsx",
};
