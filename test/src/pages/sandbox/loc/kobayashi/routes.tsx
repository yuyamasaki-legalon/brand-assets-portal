import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const UserKobayashiSandbox = lazy(() => import("./index").then((module) => ({ default: module.UserKobayashiSandbox })));

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/loc/kobayashi",
    element: <UserKobayashiSandbox />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/loc/kobayashi": "src/pages/sandbox/loc/kobayashi/index.tsx",
};
