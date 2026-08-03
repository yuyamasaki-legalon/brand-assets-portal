var e=`import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const UserSyujiHigaSandbox = lazy(() => import("./index").then((module) => ({ default: module.UserSyujiHigaSandbox })));
const Sandbox20260520 = lazy(() => import("./sandbox/index").then((module) => ({ default: module.Sandbox20260520 })));

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/syuji-higa",
    element: <UserSyujiHigaSandbox />,
  },
  {
    path: "/sandbox/syuji-higa/sandbox",
    element: <Sandbox20260520 />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/syuji-higa": "src/pages/sandbox/users/syuji-higa/index.tsx",
  "/sandbox/syuji-higa/sandbox": "src/pages/sandbox/users/syuji-higa/sandbox/index.tsx",
};
`;export{e as default};