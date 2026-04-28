import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const UserTeradaSandbox = lazy(() => import("./index").then((module) => ({ default: module.UserTeradaSandbox })));
const FileManagementList = lazy(() =>
  import("./file-management/index").then((module) => ({ default: module.default })),
);
const FileManagementDetail = lazy(() =>
  import("./file-management/detail/index").then((module) => ({ default: module.default })),
);
const ApiExample = lazy(() => import("./api-example/index").then((module) => ({ default: module.ApiExample })));
const DashboardEnglish = lazy(() =>
  import("./dashboard-english/index").then((module) => ({ default: module.default })),
);

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/loc/terada",
    element: <UserTeradaSandbox />,
  },
  {
    path: "/sandbox/loc/terada/file-management",
    element: <FileManagementList />,
  },
  {
    path: "/sandbox/loc/terada/file-management/detail/:id",
    element: <FileManagementDetail />,
  },
  {
    path: "/sandbox/loc/terada/api-example",
    element: <ApiExample />,
  },
  {
    path: "/sandbox/loc/terada/dashboard-english",
    element: <DashboardEnglish />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/loc/terada": "src/pages/sandbox/loc/terada/index.tsx",
  "/sandbox/loc/terada/file-management": "src/pages/sandbox/loc/terada/file-management/index.tsx",
  "/sandbox/loc/terada/file-management/detail/:id": "src/pages/sandbox/loc/terada/file-management/detail/index.tsx",
  "/sandbox/loc/terada/api-example": "src/pages/sandbox/loc/terada/api-example/index.tsx",
  "/sandbox/loc/terada/dashboard-english": "src/pages/sandbox/loc/terada/dashboard-english/index.tsx",
};
