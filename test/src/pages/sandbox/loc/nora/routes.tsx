import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const UserNoraSandbox = lazy(() => import("./index").then((module) => ({ default: module.UserNoraSandbox })));

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/loc/nora",
    element: <UserNoraSandbox />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/loc/nora": "src/pages/sandbox/loc/nora/index.tsx",
};
