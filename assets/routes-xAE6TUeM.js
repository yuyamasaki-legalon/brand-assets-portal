var e=`import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const UserIchibasanSandbox = lazy(() => import("./index").then((module) => ({ default: module.UserIchibasanSandbox })));
const SandboxBuilder = lazy(() =>
  import("./sandbox-builder/index").then((module) => ({ default: module.SandboxBuilder })),
);
const ShimmerTest = lazy(() => import("./shimmer-test/index").then((module) => ({ default: module.ShimmerTest })));
const TypographyLab = lazy(() =>
  import("./typography-lab/index").then((module) => ({ default: module.TypographyLab })),
);
const PaletteLab = lazy(() => import("./palette-lab/index").then((module) => ({ default: module.PaletteLab })));

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
  {
    path: "/sandbox/ichibasan/typography-lab",
    element: <TypographyLab />,
  },
  {
    path: "/sandbox/ichibasan/palette-lab",
    element: <PaletteLab />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/ichibasan": "src/pages/sandbox/users/ichibasan/index.tsx",
  "/sandbox/ichibasan/palette-lab": "src/pages/sandbox/users/ichibasan/palette-lab/index.tsx",
  "/sandbox/ichibasan/shimmer-test": "src/pages/sandbox/users/ichibasan/shimmer-test/index.tsx",
  "/sandbox/ichibasan/typography-lab": "src/pages/sandbox/users/ichibasan/typography-lab/index.tsx",
};
`;export{e as default};