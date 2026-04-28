import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const UserCodexSandbox = lazy(() => import("./index").then((module) => ({ default: module.UserCodexSandbox })));

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/loc/codex",
    element: <UserCodexSandbox />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/loc/codex": "src/pages/sandbox/loc/codex/index.tsx",
};
