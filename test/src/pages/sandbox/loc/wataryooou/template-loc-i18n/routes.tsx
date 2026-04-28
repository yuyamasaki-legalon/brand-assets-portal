import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../../types/routes";

// Lazy load all page components
const TemplateLandingPage = lazy(() => import("./index").then((module) => ({ default: module.TemplateLandingPage })));
const DashboardPage = lazy(() => import("./dashboard/index").then((module) => ({ default: module.DashboardPage })));
const CasePage = lazy(() => import("./case/index").then((module) => ({ default: module.CasePage })));
const CaseDetailPage = lazy(() => import("./case/detail/index").then((module) => ({ default: module.CaseDetailPage })));
const CaseReceptionFormPage = lazy(() =>
  import("./case-reception-form/index").then((module) => ({ default: module.CaseReceptionFormPage })),
);
const ReviewPage = lazy(() => import("./review/index").then((module) => ({ default: module.ReviewPage })));
const RootPage = lazy(() => import("./root/index").then((module) => ({ default: module.RootPage })));
const NotFoundPage = lazy(() => import("./root/NotFound").then((module) => ({ default: module.NotFoundPage })));
const MaintenancePage = lazy(() =>
  import("./root/Maintenance").then((module) => ({ default: module.MaintenancePage })),
);
const ServerErrorPage = lazy(() =>
  import("./root/ServerError").then((module) => ({ default: module.ServerErrorPage })),
);

const basePath = "/sandbox/loc/wataryooou/template-loc-i18n";

export const routes: RouteConfig[] = [
  {
    path: basePath,
    element: <TemplateLandingPage />,
  },
  {
    path: `${basePath}/dashboard`,
    element: <DashboardPage />,
  },
  {
    path: `${basePath}/case`,
    element: <CasePage />,
  },
  {
    path: `${basePath}/case/detail`,
    element: <CaseDetailPage />,
  },
  {
    path: `${basePath}/case-reception-form`,
    element: <CaseReceptionFormPage />,
  },
  {
    path: `${basePath}/review`,
    element: <ReviewPage />,
  },
  {
    path: `${basePath}/root`,
    element: <RootPage />,
  },
  {
    path: `${basePath}/root/not-found`,
    element: <NotFoundPage />,
  },
  {
    path: `${basePath}/root/maintenance`,
    element: <MaintenancePage />,
  },
  {
    path: `${basePath}/root/server-error`,
    element: <ServerErrorPage />,
  },
];

export const routeFileMap: RouteFileMap = {
  [basePath]: "src/pages/sandbox/loc/wataryooou/template-loc-i18n/index.tsx",
  [`${basePath}/dashboard`]: "src/pages/sandbox/loc/wataryooou/template-loc-i18n/dashboard/index.tsx",
  [`${basePath}/case`]: "src/pages/sandbox/loc/wataryooou/template-loc-i18n/case/index.tsx",
  [`${basePath}/case/detail`]: "src/pages/sandbox/loc/wataryooou/template-loc-i18n/case/detail/index.tsx",
  [`${basePath}/case-reception-form`]:
    "src/pages/sandbox/loc/wataryooou/template-loc-i18n/case-reception-form/index.tsx",
  [`${basePath}/review`]: "src/pages/sandbox/loc/wataryooou/template-loc-i18n/review/index.tsx",
  [`${basePath}/root`]: "src/pages/sandbox/loc/wataryooou/template-loc-i18n/root/index.tsx",
  [`${basePath}/root/not-found`]: "src/pages/sandbox/loc/wataryooou/template-loc-i18n/root/NotFound.tsx",
  [`${basePath}/root/maintenance`]: "src/pages/sandbox/loc/wataryooou/template-loc-i18n/root/Maintenance.tsx",
  [`${basePath}/root/server-error`]: "src/pages/sandbox/loc/wataryooou/template-loc-i18n/root/ServerError.tsx",
};
