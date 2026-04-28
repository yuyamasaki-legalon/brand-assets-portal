import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";
import {
  routeFileMap as templateLocI18nRouteFileMap,
  routes as templateLocI18nRoutes,
} from "./template-loc-i18n/routes";

// LOC wataryooou pages
const LocWataryooou = lazy(() => import("./index").then((module) => ({ default: module.LocWataryooou })));
const ApplicationConsole = lazy(() =>
  import("./application-console/index").then((module) => ({ default: module.ApplicationConsole })),
);
const CaseDetail = lazy(() => import("./case-detail/index").then((module) => ({ default: module.LocCaseDetail })));
const CaseDetailStamp = lazy(() =>
  import("./case-detail-stamp/index").then((module) => ({ default: module.CaseDetail })),
);
const CaseDetailTest = lazy(() =>
  import("./case-detail-test/index").then((module) => ({ default: module.CaseDetailTest })),
);
const CaseClaude = lazy(() => import("./case-claude/index").then((module) => ({ default: module.LocCaseClaude })));
const CaseCodex = lazy(() => import("./case-codex/index").then((module) => ({ default: module.LocCaseCodex })));
const CaseCodexSlack = lazy(() =>
  import("./case-codex-slack/index").then((module) => ({ default: module.LocCaseCodexSlack })),
);
const CaseDevin = lazy(() => import("./case-devin/index").then((module) => ({ default: module.LocCaseDevin })));
const MenuWidthTest = lazy(() =>
  import("./menu-width-test/index").then((module) => ({ default: module.MenuWidthTest })),
);
const Rules = lazy(() => import("./rules/index"));
const DataTableSimple = lazy(() =>
  import("./datatable-simple/index").then((module) => ({ default: module.DataTableSimple })),
);
const WordAddin = lazy(() => import("./word-addin/index").then((module) => ({ default: module.WordAddin })));
const AiRoleplayHub = lazy(() =>
  import("./ai-roleplay-hub/index").then((module) => ({ default: module.AiRoleplayHub })),
);
const EmailTemplate = lazy(() =>
  import("./email-template/index").then((module) => ({ default: module.EmailTemplatePage })),
);
const MatterBallStatus = lazy(() =>
  import("./matter-ball-status/index").then((module) => ({ default: module.MatterBallStatus })),
);
const DataTableDragPerf = lazy(() =>
  import("./datatable-drag-perf/index").then((module) => ({ default: module.DataTableDragPerf })),
);
const DataTableIconButton = lazy(() =>
  import("./datatable-iconbutton/index").then((module) => ({ default: module.DataTableIconButton })),
);
const CaseSelfAssignBulk = lazy(() =>
  import("./case-self-assign-bulk/index").then((module) => ({ default: module.CaseSelfAssignBulk })),
);
const CaseSelfAssignPriority = lazy(() =>
  import("./case-self-assign-priority/index").then((module) => ({ default: module.CaseSelfAssignPriority })),
);
const CaseSelfAssignWorkload = lazy(() =>
  import("./case-self-assign-workload/index").then((module) => ({ default: module.CaseSelfAssignWorkload })),
);
const SidebarDrawer = lazy(() =>
  import("./sidebar-drawer/index").then((module) => ({ default: module.SidebarDrawer })),
);

export const routes: RouteConfig[] = [
  ...templateLocI18nRoutes,
  {
    path: "/sandbox/loc/wataryooou",
    element: <LocWataryooou />,
  },
  {
    path: "/sandbox/loc/wataryooou/application-console",
    element: <ApplicationConsole />,
  },
  {
    path: "/sandbox/loc/wataryooou/case-detail",
    element: <CaseDetail />,
  },
  {
    path: "/sandbox/loc/wataryooou/case-detail-stamp",
    element: <CaseDetailStamp />,
  },
  {
    path: "/sandbox/loc/wataryooou/case-detail-test",
    element: <CaseDetailTest />,
  },
  {
    path: "/sandbox/loc/wataryooou/case-claude",
    element: <CaseClaude />,
  },
  {
    path: "/sandbox/loc/wataryooou/case-codex",
    element: <CaseCodex />,
  },
  {
    path: "/sandbox/loc/wataryooou/case-codex-slack",
    element: <CaseCodexSlack />,
  },
  {
    path: "/sandbox/loc/wataryooou/case-devin",
    element: <CaseDevin />,
  },
  {
    path: "/sandbox/loc/wataryooou/menu-width-test",
    element: <MenuWidthTest />,
  },
  {
    path: "/sandbox/loc/wataryooou/rules",
    element: <Rules />,
  },
  {
    path: "/sandbox/loc/wataryooou/datatable-simple",
    element: <DataTableSimple />,
  },
  {
    path: "/sandbox/loc/wataryooou/word-addin",
    element: <WordAddin />,
  },
  {
    path: "/sandbox/loc/wataryooou/ai-roleplay",
    element: <AiRoleplayHub />,
  },
  {
    path: "/sandbox/loc/wataryooou/email-template",
    element: <EmailTemplate />,
  },
  {
    path: "/sandbox/loc/wataryooou/matter-ball-status",
    element: <MatterBallStatus />,
  },
  {
    path: "/sandbox/loc/wataryooou/datatable-drag-perf",
    element: <DataTableDragPerf />,
  },
  {
    path: "/sandbox/loc/wataryooou/datatable-iconbutton",
    element: <DataTableIconButton />,
  },
  {
    path: "/sandbox/loc/wataryooou/case-self-assign-bulk",
    element: <CaseSelfAssignBulk />,
  },
  {
    path: "/sandbox/loc/wataryooou/case-self-assign-priority",
    element: <CaseSelfAssignPriority />,
  },
  {
    path: "/sandbox/loc/wataryooou/case-self-assign-workload",
    element: <CaseSelfAssignWorkload />,
  },
  {
    path: "/sandbox/loc/wataryooou/sidebar-drawer",
    element: <SidebarDrawer />,
  },
];

export const routeFileMap: RouteFileMap = {
  ...templateLocI18nRouteFileMap,
  "/sandbox/loc/wataryooou": "src/pages/sandbox/loc/wataryooou/index.tsx",
  "/sandbox/loc/wataryooou/application-console": "src/pages/sandbox/loc/wataryooou/application-console/index.tsx",
  "/sandbox/loc/wataryooou/case-detail": "src/pages/sandbox/loc/wataryooou/case-detail/index.tsx",
  "/sandbox/loc/wataryooou/case-detail-stamp": "src/pages/sandbox/loc/wataryooou/case-detail-stamp/index.tsx",
  "/sandbox/loc/wataryooou/case-detail-test": "src/pages/sandbox/loc/wataryooou/case-detail-test/index.tsx",
  "/sandbox/loc/wataryooou/case-claude": "src/pages/sandbox/loc/wataryooou/case-claude/index.tsx",
  "/sandbox/loc/wataryooou/case-codex": "src/pages/sandbox/loc/wataryooou/case-codex/index.tsx",
  "/sandbox/loc/wataryooou/case-codex-slack": "src/pages/sandbox/loc/wataryooou/case-codex-slack/index.tsx",
  "/sandbox/loc/wataryooou/case-devin": "src/pages/sandbox/loc/wataryooou/case-devin/index.tsx",
  "/sandbox/loc/wataryooou/menu-width-test": "src/pages/sandbox/loc/wataryooou/menu-width-test/index.tsx",
  "/sandbox/loc/wataryooou/rules": "src/pages/sandbox/loc/wataryooou/rules/index.tsx",
  "/sandbox/loc/wataryooou/datatable-simple": "src/pages/sandbox/loc/wataryooou/datatable-simple/index.tsx",
  "/sandbox/loc/wataryooou/word-addin": "src/pages/sandbox/loc/wataryooou/word-addin/index.tsx",
  "/sandbox/loc/wataryooou/ai-roleplay": "src/pages/sandbox/loc/wataryooou/ai-roleplay-hub/index.tsx",
  "/sandbox/loc/wataryooou/email-template": "src/pages/sandbox/loc/wataryooou/email-template/index.tsx",
  "/sandbox/loc/wataryooou/matter-ball-status": "src/pages/sandbox/loc/wataryooou/matter-ball-status/index.tsx",
  "/sandbox/loc/wataryooou/datatable-drag-perf": "src/pages/sandbox/loc/wataryooou/datatable-drag-perf/index.tsx",
  "/sandbox/loc/wataryooou/datatable-iconbutton": "src/pages/sandbox/loc/wataryooou/datatable-iconbutton/index.tsx",
  "/sandbox/loc/wataryooou/case-self-assign-bulk": "src/pages/sandbox/loc/wataryooou/case-self-assign-bulk/index.tsx",
  "/sandbox/loc/wataryooou/case-self-assign-priority":
    "src/pages/sandbox/loc/wataryooou/case-self-assign-priority/index.tsx",
  "/sandbox/loc/wataryooou/case-self-assign-workload":
    "src/pages/sandbox/loc/wataryooou/case-self-assign-workload/index.tsx",
  "/sandbox/loc/wataryooou/sidebar-drawer": "src/pages/sandbox/loc/wataryooou/sidebar-drawer/index.tsx",
};
