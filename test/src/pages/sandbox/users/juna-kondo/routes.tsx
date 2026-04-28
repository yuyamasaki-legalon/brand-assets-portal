import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const UserJunaKondoSandbox = lazy(() => import("./index"));
const MyFirstPage = lazy(() => import("./my-first-page/index"));
const SignatureRequestDetail = lazy(() => import("./signature-request-detail/index"));
const NewPage = lazy(() => import("./new-page/index"));
const ContractDetail = lazy(() => import("./contract-detail/index"));
const ContractListUIImprovement = lazy(() => import("./contract-list-ui-improvement/index"));
const ContractDetailEnhanced = lazy(() => import("./contract-detail-enhanced/index"));
const CaseDetailRefresh = lazy(() => import("./case-detail-refresh/index"));
const LocCaseDetail = lazy(() => import("./loc-case-detail/index"));
const NewSandbox = lazy(() => import("./new-sandbox/index"));

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/juna-kondo",
    element: <UserJunaKondoSandbox />,
  },
  {
    path: "/sandbox/juna-kondo/my-first-page",
    element: <MyFirstPage />,
  },
  {
    path: "/sandbox/juna-kondo/signature-request-detail",
    element: <SignatureRequestDetail />,
  },
  {
    path: "/sandbox/juna-kondo/new-page",
    element: <NewPage />,
  },
  {
    path: "/sandbox/juna-kondo/contract-detail",
    element: <ContractDetail />,
  },
  {
    path: "/sandbox/juna-kondo/contract-list-ui-improvement",
    element: <ContractListUIImprovement />,
  },
  {
    path: "/sandbox/juna-kondo/contract-detail-enhanced/:id",
    element: <ContractDetailEnhanced />,
  },
  {
    path: "/sandbox/juna-kondo/case-detail-refresh",
    element: <CaseDetailRefresh />,
  },
  {
    path: "/sandbox/juna-kondo/loc-case-detail",
    element: <LocCaseDetail />,
  },
  {
    path: "/sandbox/juna-kondo/new-sandbox",
    element: <NewSandbox />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/juna-kondo": "src/pages/sandbox/users/juna-kondo/index.tsx",
  "/sandbox/juna-kondo/my-first-page": "src/pages/sandbox/users/juna-kondo/my-first-page/index.tsx",
  "/sandbox/juna-kondo/signature-request-detail":
    "src/pages/sandbox/users/juna-kondo/signature-request-detail/index.tsx",
  "/sandbox/juna-kondo/new-page": "src/pages/sandbox/users/juna-kondo/new-page/index.tsx",
  "/sandbox/juna-kondo/contract-detail": "src/pages/sandbox/users/juna-kondo/contract-detail/index.tsx",
  "/sandbox/juna-kondo/contract-list-ui-improvement":
    "src/pages/sandbox/users/juna-kondo/contract-list-ui-improvement/index.tsx",
  "/sandbox/juna-kondo/contract-detail-enhanced/:id":
    "src/pages/sandbox/users/juna-kondo/contract-detail-enhanced/index.tsx",
  "/sandbox/juna-kondo/case-detail-refresh": "src/pages/sandbox/users/juna-kondo/case-detail-refresh/index.tsx",
  "/sandbox/juna-kondo/loc-case-detail": "src/pages/sandbox/users/juna-kondo/loc-case-detail/index.tsx",
  "/sandbox/juna-kondo/new-sandbox": "src/pages/sandbox/users/juna-kondo/new-sandbox/index.tsx",
};
