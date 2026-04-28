import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const UserUser2Sandbox = lazy(() => import("./index").then((module) => ({ default: module.UserUser2Sandbox })));
const Test = lazy(() => import("./test/index").then((module) => ({ default: module.Test })));

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/user2",
    element: <UserUser2Sandbox />,
  },
  {
    path: "/sandbox/user2/test",
    element: <Test />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/user2": "src/pages/sandbox/users/user2/index.tsx",
};
