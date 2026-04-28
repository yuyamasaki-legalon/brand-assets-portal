import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const UserJinSandbox = lazy(() => import("./index").then((module) => ({ default: module.UserJinSandbox })));

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/loc/jin",
    element: <UserJinSandbox />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/loc/jin": "src/pages/sandbox/loc/jin/index.tsx",
};
