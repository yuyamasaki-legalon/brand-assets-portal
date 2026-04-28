import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const UserNomuraSandbox = lazy(() => import("./index").then((module) => ({ default: module.UserNomuraSandbox })));

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/loc/nomura",
    element: <UserNomuraSandbox />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/loc/nomura": "src/pages/sandbox/loc/nomura/index.tsx",
};
