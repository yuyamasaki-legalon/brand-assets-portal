import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const UserDevinSandbox = lazy(() => import("./index").then((module) => ({ default: module.UserDevinSandbox })));

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/loc/devin",
    element: <UserDevinSandbox />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/loc/devin": "src/pages/sandbox/loc/devin/index.tsx",
};
