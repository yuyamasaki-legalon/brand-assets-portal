import { lazy, type ReactElement } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../../types/routes";

const InvitePage = lazy(() => import("./index").then((module) => ({ default: module.InvitePage })));

type SandboxPageRoute = {
  path: string;
  element: ReactElement;
  filePath: string;
};

const sandboxPageRoutes: SandboxPageRoute[] = [
  {
    path: "/sandbox/wataryooou/invite",
    element: <InvitePage />,
    filePath: "src/pages/sandbox/users/wataryooou/invite/index.tsx",
  },
];

export const routes: RouteConfig[] = sandboxPageRoutes.map(({ path, element }) => ({
  path,
  element,
}));

export const routeFileMap: RouteFileMap = sandboxPageRoutes.reduce<RouteFileMap>((map, { path, filePath }) => {
  map[path] = filePath;
  return map;
}, {});
