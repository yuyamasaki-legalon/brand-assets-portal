var e=`import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const WorkOnSyujiHiga = lazy(() => import("./index").then((module) => ({ default: module.WorkOnSyujiHiga })));
const Sandbox20260520 = lazy(() => import("./sandbox/index").then((module) => ({ default: module.Sandbox20260520 })));

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/workon/syuji-higa",
    element: <WorkOnSyujiHiga />,
  },
  {
    path: "/sandbox/workon/syuji-higa/sandbox",
    element: <Sandbox20260520 />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/workon/syuji-higa": "src/pages/sandbox/workon/syuji-higa/index.tsx",
  "/sandbox/workon/syuji-higa/sandbox": "src/pages/sandbox/workon/syuji-higa/sandbox/index.tsx",
};
`;export{e as default};