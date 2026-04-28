import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const UserIchibasanSandbox = lazy(() => import("./index").then((module) => ({ default: module.UserIchibasanSandbox })));
const SandboxBuilder = lazy(() =>
  import("./sandbox-builder/index").then((module) => ({ default: module.SandboxBuilder })),
);
const ShimmerTest = lazy(() => import("./shimmer-test/index").then((module) => ({ default: module.ShimmerTest })));

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/ichibasan",
    element: <UserIchibasanSandbox />,
  },
  {
    path: "/sandbox/ichibasan/sandbox-builder",
    element: <SandboxBuilder />,
  },
  {
    path: "/sandbox/ichibasan/shimmer-test",
    element: <ShimmerTest />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/ichibasan": "src/pages/sandbox/users/ichibasan/index.tsx",
  "/sandbox/ichibasan/shimmer-test": "src/pages/sandbox/users/ichibasan/shimmer-test/index.tsx",
};
