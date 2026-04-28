import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const User{{USERNAME_PASCAL}}Sandbox = lazy(() =>
  import("./index").then((module) => ({ default: module.User{{USERNAME_PASCAL}}Sandbox })),
);

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/{{username}}",
    element: <User{{USERNAME_PASCAL}}Sandbox />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/{{username}}": "src/pages/sandbox/users/{{username}}/index.tsx",
};
