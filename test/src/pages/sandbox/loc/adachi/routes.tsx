import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const UserAdachiSandbox = lazy(() => import("./index").then((module) => ({ default: module.UserAdachiSandbox })));

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/loc/adachi",
    element: <UserAdachiSandbox />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/loc/adachi": "src/pages/sandbox/loc/adachi/index.tsx",
};
