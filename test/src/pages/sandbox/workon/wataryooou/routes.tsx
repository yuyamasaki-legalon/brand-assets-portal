import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

// WorkOn wataryooou pages
const WorkOnWataryooou = lazy(() => import("./index").then((module) => ({ default: module.WorkOnWataryooou })));
const InvitePage = lazy(() => import("./invite/index").then((module) => ({ default: module.InvitePage })));
const ProcedurePage = lazy(() => import("./procedure/index").then((module) => ({ default: module.ProcedurePage })));
const MobilePage = lazy(() => import("./mobile/index").then((module) => ({ default: module.MobilePage })));
const LoginPage = lazy(() => import("./mobile/login/index").then((module) => ({ default: module.LoginPage })));
const AttendancePage = lazy(() =>
  import("./mobile/attendance/index").then((module) => ({ default: module.AttendancePage })),
);
const EditAttendancePage = lazy(() =>
  import("./mobile/edit-attendance/index").then((module) => ({ default: module.EditAttendancePage })),
);

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/workon/wataryooou",
    element: <WorkOnWataryooou />,
  },
  {
    path: "/sandbox/workon/wataryooou/invite",
    element: <InvitePage />,
  },
  {
    path: "/sandbox/workon/wataryooou/procedure",
    element: <ProcedurePage />,
  },
  {
    path: "/sandbox/workon/wataryooou/mobile",
    element: <MobilePage />,
  },
  {
    path: "/sandbox/workon/wataryooou/mobile/login",
    element: <LoginPage />,
  },
  {
    path: "/sandbox/workon/wataryooou/mobile/attendance",
    element: <AttendancePage />,
  },
  {
    path: "/sandbox/workon/wataryooou/mobile/edit-attendance",
    element: <EditAttendancePage />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/workon/wataryooou": "src/pages/sandbox/workon/wataryooou/index.tsx",
  "/sandbox/workon/wataryooou/invite": "src/pages/sandbox/workon/wataryooou/invite/index.tsx",
  "/sandbox/workon/wataryooou/procedure": "src/pages/sandbox/workon/wataryooou/procedure/index.tsx",
  "/sandbox/workon/wataryooou/mobile": "src/pages/sandbox/workon/wataryooou/mobile/index.tsx",
  "/sandbox/workon/wataryooou/mobile/login": "src/pages/sandbox/workon/wataryooou/mobile/login/index.tsx",
  "/sandbox/workon/wataryooou/mobile/attendance": "src/pages/sandbox/workon/wataryooou/mobile/attendance/index.tsx",
  "/sandbox/workon/wataryooou/mobile/edit-attendance":
    "src/pages/sandbox/workon/wataryooou/mobile/edit-attendance/index.tsx",
};
