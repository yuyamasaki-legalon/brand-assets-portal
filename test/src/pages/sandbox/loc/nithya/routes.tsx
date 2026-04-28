import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const UserNithyaSandbox = lazy(() => import("./index").then((module) => ({ default: module.UserNithyaSandbox })));

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/loc/nithya",
    element: <UserNithyaSandbox />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/loc/nithya": "src/pages/sandbox/loc/nithya/index.tsx",
};
