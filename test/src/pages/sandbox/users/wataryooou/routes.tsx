import { lazy, type ReactElement } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const UserWataryooouSandbox = lazy(() =>
  import("./index").then((module) => ({ default: module.UserWataryooouSandbox })),
);
const LangGraphChatWidget = lazy(() =>
  import("./langgraph-chat-widget/index").then((module) => ({ default: module.LangGraphChatWidget })),
);
const CaseDetail = lazy(() => import("./case-detail/index").then((module) => ({ default: module.CaseDetail })));
const CaseDetailTest = lazy(() =>
  import("./case-detail-test/index").then((module) => ({ default: module.CaseDetailTest })),
);
const ApplicationConsole = lazy(() =>
  import("./application-console/index").then((module) => ({ default: module.ApplicationConsole })),
);
const LocCaseDetail = lazy(() =>
  import("./loc-case-detail/index").then((module) => ({ default: module.LocCaseDetail })),
);
const LocCaseClaude = lazy(() =>
  import("./loc-case-claude/index").then((module) => ({ default: module.LocCaseClaude })),
);
const LocCaseCodex = lazy(() => import("./loc-case-codex/index").then((module) => ({ default: module.LocCaseCodex })));
const LocCaseCodexSlack = lazy(() =>
  import("./loc-case-codex-slack/index").then((module) => ({ default: module.LocCaseCodexSlack })),
);
const LocCaseDevin = lazy(() => import("./loc-case-devin/index").then((module) => ({ default: module.LocCaseDevin })));
const LocContractListSticky = lazy(() =>
  import("./loc-contract-list-sticky/index").then((module) => ({ default: module.LocContractListSticky })),
);
const CategorySelection = lazy(() =>
  import("./category-selection/index").then((module) => ({ default: module.CategorySelection })),
);
const SnackbarLintTest = lazy(() =>
  import("./snackbar-lint-test/index").then((module) => ({ default: module.SnackbarLintTest })),
);
const InvitePage = lazy(() => import("./invite/index").then((module) => ({ default: module.InvitePage })));
const ProcedurePage = lazy(() => import("./procedure/index").then((module) => ({ default: module.ProcedurePage })));
const WorkspaceSettings = lazy(() =>
  import("./workspace-settings/index").then((module) => ({ default: module.WorkspaceSettings })),
);
const TextureMaskingChat = lazy(() =>
  import("./texture-masking-chat/index").then((module) => ({ default: module.TextureMaskingChat })),
);
const AiRoleplayIndex = lazy(() =>
  import("./ai-roleplay/index").then((module) => ({ default: module.AiRoleplayIndex })),
);
const AiRoleplayResults = lazy(() =>
  import("./ai-roleplay-results/index").then((module) => ({ default: module.AiRoleplayResults })),
);
const AiRoleplayResultDetail = lazy(() =>
  import("./ai-roleplay-result-detail/index").then((module) => ({ default: module.AiRoleplayResultDetail })),
);
const AiRoleplaySession = lazy(() =>
  import("./ai-roleplay-session/index").then((module) => ({ default: module.AiRoleplaySession })),
);
const AiRoleplayResultView = lazy(() =>
  import("./ai-roleplay-result-view/index").then((module) => ({ default: module.AiRoleplayResultView })),
);
const AiRoleplaySettings = lazy(() =>
  import("./ai-roleplay-settings/index").then((module) => ({ default: module.AiRoleplaySettings })),
);
const PopoverDialog = lazy(() =>
  import("./popover-dialog/index").then((module) => ({ default: module.PopoverDialog })),
);
const TemplateBrowser = lazy(() =>
  import("./template-browser/index").then((module) => ({ default: module.TemplateBrowser })),
);
const SplitButtonBanner = lazy(() =>
  import("./split-button-banner/index").then((module) => ({ default: module.SplitButtonBanner })),
);
const PrTemplateTrends = lazy(() =>
  import("./pr-template-trends/index").then((module) => ({ default: module.PrTemplateTrends })),
);
const LocOverviewMap = lazy(() =>
  import("./loc-overview-map/index").then((module) => ({ default: module.LocOverviewMap })),
);
const CheckInPage = lazy(() => import("./check-in/index").then((module) => ({ default: module.default })));
const PreviewUrlGuide = lazy(() =>
  import("./preview-url-guide/index").then((module) => ({ default: module.PreviewUrlGuide })),
);
const StructuralTokens = lazy(() =>
  import("./structural-tokens/index").then((module) => ({ default: module.StructuralTokens })),
);
const AboutAegisLab = lazy(() =>
  import("./about-aegis-lab/index").then((module) => ({ default: module.AboutAegisLab })),
);
type SandboxPageRoute = {
  path: string;
  element: ReactElement;
  filePath: string;
};

const sandboxPageRoutes: SandboxPageRoute[] = [
  {
    path: "/sandbox/wataryooou",
    element: <UserWataryooouSandbox />,
    filePath: "src/pages/sandbox/users/wataryooou/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/langgraph-chat-widget",
    element: <LangGraphChatWidget />,
    filePath: "src/pages/sandbox/users/wataryooou/langgraph-chat-widget/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/case-detail",
    element: <CaseDetail />,
    filePath: "src/pages/sandbox/users/wataryooou/case-detail/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/case-detail-test",
    element: <CaseDetailTest />,
    filePath: "src/pages/sandbox/users/wataryooou/case-detail-test/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/application-console",
    element: <ApplicationConsole />,
    filePath: "src/pages/sandbox/users/wataryooou/application-console/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/loc-case-detail",
    element: <LocCaseDetail />,
    filePath: "src/pages/sandbox/users/wataryooou/loc-case-detail/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/loc-case-claude",
    element: <LocCaseClaude />,
    filePath: "src/pages/sandbox/users/wataryooou/loc-case-claude/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/loc-case-codex",
    element: <LocCaseCodex />,
    filePath: "src/pages/sandbox/users/wataryooou/loc-case-codex/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/loc-case-codex-slack",
    element: <LocCaseCodexSlack />,
    filePath: "src/pages/sandbox/users/wataryooou/loc-case-codex-slack/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/loc-case-devin",
    element: <LocCaseDevin />,
    filePath: "src/pages/sandbox/users/wataryooou/loc-case-devin/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/loc-contract-list-sticky",
    element: <LocContractListSticky />,
    filePath: "src/pages/sandbox/users/wataryooou/loc-contract-list-sticky/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/category-selection",
    element: <CategorySelection />,
    filePath: "src/pages/sandbox/users/wataryooou/category-selection/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/snackbar-lint-test",
    element: <SnackbarLintTest />,
    filePath: "src/pages/sandbox/users/wataryooou/snackbar-lint-test/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/invite",
    element: <InvitePage />,
    filePath: "src/pages/sandbox/users/wataryooou/invite/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/procedure",
    element: <ProcedurePage />,
    filePath: "src/pages/sandbox/users/wataryooou/procedure/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/workspace-settings",
    element: <WorkspaceSettings />,
    filePath: "src/pages/sandbox/users/wataryooou/workspace-settings/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/texture-masking-chat",
    element: <TextureMaskingChat />,
    filePath: "src/pages/sandbox/users/wataryooou/texture-masking-chat/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/ai-roleplay",
    element: <AiRoleplayIndex />,
    filePath: "src/pages/sandbox/users/wataryooou/ai-roleplay/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/ai-roleplay-results",
    element: <AiRoleplayResults />,
    filePath: "src/pages/sandbox/users/wataryooou/ai-roleplay-results/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/ai-roleplay-result-detail",
    element: <AiRoleplayResultDetail />,
    filePath: "src/pages/sandbox/users/wataryooou/ai-roleplay-result-detail/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/ai-roleplay-session",
    element: <AiRoleplaySession />,
    filePath: "src/pages/sandbox/users/wataryooou/ai-roleplay-session/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/ai-roleplay-result-view",
    element: <AiRoleplayResultView />,
    filePath: "src/pages/sandbox/users/wataryooou/ai-roleplay-result-view/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/ai-roleplay-settings",
    element: <AiRoleplaySettings />,
    filePath: "src/pages/sandbox/users/wataryooou/ai-roleplay-settings/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/popover-dialog",
    element: <PopoverDialog />,
    filePath: "src/pages/sandbox/users/wataryooou/popover-dialog/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/template-browser",
    element: <TemplateBrowser />,
    filePath: "src/pages/sandbox/users/wataryooou/template-browser/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/split-button-banner",
    element: <SplitButtonBanner />,
    filePath: "src/pages/sandbox/users/wataryooou/split-button-banner/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/pr-template-trends",
    element: <PrTemplateTrends />,
    filePath: "src/pages/sandbox/users/wataryooou/pr-template-trends/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/loc-overview-map",
    element: <LocOverviewMap />,
    filePath: "src/pages/sandbox/users/wataryooou/loc-overview-map/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/check-in",
    element: <CheckInPage />,
    filePath: "src/pages/sandbox/users/wataryooou/check-in/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/preview-url-guide",
    element: <PreviewUrlGuide />,
    filePath: "src/pages/sandbox/users/wataryooou/preview-url-guide/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/structural-tokens",
    element: <StructuralTokens />,
    filePath: "src/pages/sandbox/users/wataryooou/structural-tokens/index.tsx",
  },
  {
    path: "/sandbox/wataryooou/about-aegis-lab",
    element: <AboutAegisLab />,
    filePath: "src/pages/sandbox/users/wataryooou/about-aegis-lab/index.tsx",
  },
];

export const routes: RouteConfig[] = sandboxPageRoutes.map(({ path, element }) => ({
  path,
  element,
}));

export const routeFileMap: RouteFileMap = sandboxPageRoutes.reduce<RouteFileMap>((map, { path, filePath }) => {
  map[path] = filePath;
  return map;
}, {});
