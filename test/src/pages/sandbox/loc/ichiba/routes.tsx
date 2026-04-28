import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const UserIchibaSandbox = lazy(() => import("./index").then((module) => ({ default: module.UserIchibaSandbox })));

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/loc/ichiba",
    element: <UserIchibaSandbox />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/loc/ichiba": "src/pages/sandbox/loc/ichiba/index.tsx",
};
