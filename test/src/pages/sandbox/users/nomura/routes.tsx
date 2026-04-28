import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const UserNomuraSandbox = lazy(() => import("./index").then((module) => ({ default: module.UserNomuraSandbox })));
const LabTestPage = lazy(() => import("./lab-test-page/index").then((module) => ({ default: module.LabTestPage })));
const LabTestPageDetail = lazy(() =>
  import("./lab-test-page/detail/index").then((module) => ({ default: module.LabTestPageDetail })),
);
const LabTestPageDetail2 = lazy(() =>
  import("./lab-test-page/detail2/index").then((module) => ({ default: module.LabTestPageDetail2 })),
);

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/nomura",
    element: <UserNomuraSandbox />,
  },
  {
    path: "/sandbox/nomura/lab-test-page",
    element: <LabTestPage />,
  },
  {
    path: "/sandbox/nomura/lab-test-page/detail",
    element: <LabTestPageDetail />,
  },
  {
    path: "/sandbox/nomura/lab-test-page/detail2",
    element: <LabTestPageDetail2 />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/nomura": "src/pages/sandbox/users/nomura/index.tsx",
  "/sandbox/nomura/lab-test-page": "src/pages/sandbox/users/nomura/lab-test-page/index.tsx",
  "/sandbox/nomura/lab-test-page/detail": "src/pages/sandbox/users/nomura/lab-test-page/detail/index.tsx",
  "/sandbox/nomura/lab-test-page/detail2": "src/pages/sandbox/users/nomura/lab-test-page/detail2/index.tsx",
};
