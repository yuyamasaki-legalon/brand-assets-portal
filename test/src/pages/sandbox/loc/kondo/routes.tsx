import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const UserKondoSandbox = lazy(() => import("./index").then((module) => ({ default: module.UserKondoSandbox })));

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/loc/kondo",
    element: <UserKondoSandbox />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/loc/kondo": "src/pages/sandbox/loc/kondo/index.tsx",
};
