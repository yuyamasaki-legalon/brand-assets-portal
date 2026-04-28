import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const UserUser1Sandbox = lazy(() => import("./index").then((module) => ({ default: module.UserUser1Sandbox })));

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/user1",
    element: <UserUser1Sandbox />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/user1": "src/pages/sandbox/users/user1/index.tsx",
};
