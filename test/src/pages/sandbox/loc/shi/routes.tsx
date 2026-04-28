import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const UserShiSandbox = lazy(() => import("./index").then((module) => ({ default: module.UserShiSandbox })));

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/loc/shi",
    element: <UserShiSandbox />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/loc/shi": "src/pages/sandbox/loc/shi/index.tsx",
};
