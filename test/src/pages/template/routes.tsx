import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../types/routes";

// Template pages
const Template = lazy(() => import("./index"));
const ChatTemplate = lazy(() => import("./ChatTemplate"));
const DialogTemplate = lazy(() => import("./dialog/index"));
const DashboardTemplate = lazy(() => import("./loc/dashboard/index"));
const CaseReceptionFormTemplate = lazy(() => import("./loc/case-reception-form/index"));
const ESignTemplate = lazy(() => import("./loc/esign/index"));
const EnvelopeListTemplate = lazy(() => import("./loc/esign/envelope-list"));
const RootTemplate = lazy(() => import("./loc/root/index"));
const RootNotFoundTemplate = lazy(() => import("./loc/root/NotFound"));
const RootServerErrorTemplate = lazy(() => import("./loc/root/ServerError"));
const RootMaintenanceTemplate = lazy(() => import("./loc/root/Maintenance"));

// PageLayout templates
const PageLayoutTemplate = lazy(() => import("./pagelayout/index"));
const BasicLayout = lazy(() => import("./pagelayout/BasicLayout"));
const WithSidebar = lazy(() => import("./pagelayout/WithSidebar"));
const WithPane = lazy(() => import("./pagelayout/WithPane"));
const WithResizablePane = lazy(() => import("./pagelayout/WithResizablePane"));
const ScrollInsideLayout = lazy(() => import("./pagelayout/ScrollInsideLayout"));
const WithStickyContainer = lazy(() => import("./pagelayout/WithStickyContainer"));
const WithSidebarAndPane = lazy(() => import("./pagelayout/WithSidebarAndPane"));
const WithSidebarAndPaneStart = lazy(() => import("./pagelayout/WithSidebarAndPaneStart"));

// LOC templates
const CaseListTemplate = lazy(() => import("./loc/case/index"));
const CaseDetailTemplate = lazy(() => import("./loc/case/detail/index"));
const ApplicationConsoleTemplate = lazy(() => import("./loc/application-console/index"));
const ApplicationConsoleCaseCustomAttributeTemplate = lazy(
  () => import("./loc/application-console/case-custom-attribute/index"),
);
const ApplicationConsoleCaseAutomationTemplate = lazy(() => import("./loc/application-console/case-automation/index"));
const ApplicationConsoleCaseNotificationConfigTemplate = lazy(
  () => import("./loc/application-console/case-notification-config/index"),
);
const ApplicationConsoleCaseReceptionFormTemplate = lazy(
  () => import("./loc/application-console/case-reception-form/index"),
);
const ApplicationConsoleCaseReceptionFormEditTemplate = lazy(
  () => import("./loc/application-console/case-reception-form/edit/index"),
);
const ApplicationConsoleReceptionMailAddressTemplate = lazy(
  () => import("./loc/application-console/reception-mail-address/index"),
);
const ApplicationConsoleCaseReceptionSpaceTemplate = lazy(
  () => import("./loc/application-console/case-reception-space/index"),
);
const ApplicationConsoleCaseReceptionFormAllowedIPAddressTemplate = lazy(
  () => import("./loc/application-console/case-reception-form-allowed-ip-address/index"),
);
const ApplicationConsoleCaseMailAllowedDomainTemplate = lazy(
  () => import("./loc/application-console/case-mail-allowed-domain/index"),
);
const ApplicationConsoleContractManagementEsignIntegrationTemplate = lazy(
  () => import("./loc/application-console/contract-management/esign-integration/index"),
);
const ApplicationConsoleContractManagementCustomAttributeDefinitionTemplate = lazy(
  () => import("./loc/application-console/contract-management/custom-attribute-definition/index"),
);
const ApplicationConsoleContractManagementInhouseIdAutoNumberingTemplate = lazy(
  () => import("./loc/application-console/contract-management/inhouse-id-auto-numbering/index"),
);
const ApplicationConsoleContractManagementNotificationTemplate = lazy(
  () => import("./loc/application-console/contract-management/notification/index"),
);
const ApplicationConsoleSignSenderNameTemplate = lazy(() => import("./loc/application-console/sign/sender-name/index"));
const ApplicationConsoleSignDefaultSpaceTemplate = lazy(
  () => import("./loc/application-console/sign/default-space/index"),
);
const ApplicationConsoleSignWorkflowFormTemplate = lazy(
  () => import("./loc/application-console/sign/sign-workflow-form/index"),
);
const WordAddinTemplate = lazy(() => import("./loc/word-addin/index"));
const WordAddinStandalone = lazy(() => import("./loc/word-addin-standalone/index"));
const ReviewTemplate = lazy(() => import("./loc/review/index"));
const ContractReviewUploadTemplate = lazy(() => import("./loc/dashboard/contract-review/index"));

const ManualCorrectionListTemplate = lazy(() => import("./loc/manual-correction/index"));
const ManualCorrectionDetailTemplate = lazy(() => import("./loc/manual-correction/detail/index"));
const ReviewConsoleTemplate = lazy(() => import("./loc/review-console/index"));
const ReviewConsoleRulesTemplate = lazy(() => import("./loc/review-console/rules/index"));
const ReviewConsoleMyPlaybookTemplate = lazy(() => import("./loc/review-console/my-playbook/index"));
const LoaConversationTemplate = lazy(() =>
  import("./loc/loa/index").then((module) => ({
    default: module.LoaTemplate,
  })),
);
const LoaHistoryTemplate = lazy(() => import("./loc/loa/history/index"));
const LoaPromptLibraryTemplate = lazy(() => import("./loc/loa/prompt-library/index"));
const LoaPlaybookTemplate = lazy(() =>
  import("./loc/loa/playbook/index").then((module) => ({
    default: module.LoaPlaybookTemplate,
  })),
);

// Search template
const SearchTemplate = lazy(() => import("./loc/search/index"));

// File management templates
const FileManagementTemplate = lazy(() => import("./loc/file-management/index"));
const FileManagementDetail = lazy(() => import("./loc/file-management/detail/index"));
const FileManagementCustomerTemplate = lazy(() => import("./loc/file-management/customer-template/index"));

// Legalon templates - these use named exports, so we need to handle them differently
const LegalonTemplateIndex = lazy(() =>
  import("./loc/legalon-template/index").then((module) => ({
    default: module.LegalonTemplateIndex,
  })),
);
const LegalonTemplateCategory = lazy(() =>
  import("./loc/legalon-template/category").then((module) => ({
    default: module.LegalonTemplateCategory,
  })),
);
const LegalonTemplateDetail = lazy(() =>
  import("./loc/legalon-template/detail").then((module) => ({
    default: module.LegalonTemplateDetail,
  })),
);

// Management Console templates - these use named exports, so we need to handle them differently
const ManagementConsoleIndex = lazy(() =>
  import("./loc/management-console/index").then((module) => ({
    default: module.ManagementConsoleIndex,
  })),
);
const ManagementConsoleMfa = lazy(() =>
  import("./loc/management-console/mfa").then((module) => ({
    default: module.ManagementConsoleMfa,
  })),
);
const ManagementConsoleSlack = lazy(() =>
  import("./loc/management-console/slack").then((module) => ({
    default: module.ManagementConsoleSlack,
  })),
);
const ManagementConsoleTeams = lazy(() =>
  import("./loc/management-console/teams").then((module) => ({
    default: module.ManagementConsoleTeams,
  })),
);
const ManagementConsoleSso = lazy(() =>
  import("./loc/management-console/sso").then((module) => ({
    default: module.ManagementConsoleSso,
  })),
);
const ManagementConsoleCompanyInfo = lazy(() =>
  import("./loc/management-console/company-info").then((module) => ({
    default: module.ManagementConsoleCompanyInfo,
  })),
);
const ManagementConsoleDepartments = lazy(() =>
  import("./loc/management-console/departments").then((module) => ({
    default: module.ManagementConsoleDepartments,
  })),
);
const ManagementConsoleUsers = lazy(() =>
  import("./loc/management-console/users").then((module) => ({
    default: module.ManagementConsoleUsers,
  })),
);
const ManagementConsoleUserGroups = lazy(() =>
  import("./loc/management-console/user-groups").then((module) => ({
    default: module.ManagementConsoleUserGroups,
  })),
);
const ManagementConsoleSpaces = lazy(() =>
  import("./loc/management-console/spaces").then((module) => ({
    default: module.ManagementConsoleSpaces,
  })),
);
const ManagementConsoleAuditLogs = lazy(() =>
  import("./loc/management-console/audit-logs").then((module) => ({
    default: module.ManagementConsoleAuditLogs,
  })),
);

// Personal Setting templates - these use named exports, so we need to handle them differently
const PersonalSettingIndex = lazy(() =>
  import("./loc/personal-setting/index").then((module) => ({
    default: module.PersonalSettingIndex,
  })),
);
const ProfilePage = lazy(() =>
  import("./loc/personal-setting/profile").then((module) => ({
    default: module.ProfilePage,
  })),
);
const ContractNotificationPage = lazy(() =>
  import("./loc/personal-setting/contract-notification").then((module) => ({
    default: module.ContractNotificationPage,
  })),
);
const LegalNotificationPage = lazy(() =>
  import("./loc/personal-setting/legal-notification").then((module) => ({
    default: module.LegalNotificationPage,
  })),
);
const LegalscapePage = lazy(() =>
  import("./loc/personal-setting/legalscape").then((module) => ({
    default: module.LegalscapePage,
  })),
);

// Setting Page template
const SettingPageTemplate = lazy(() => import("./loc/setting-page/index"));

// Fill Layout template
const FillLayout = lazy(() => import("./fill-layout/index"));

// Form Layout template
const FormLayoutTemplate = lazy(() => import("./form-layout/index"));

// Form Template (Basic: Form Layout を使った具体実装)
const FormTemplate = lazy(() => import("./form-template/index"));

// Chat Layout template
const ChatLayoutTemplate = lazy(() =>
  import("./chat-layout/index").then((module) => ({
    default: module.ChatLayoutTemplate,
  })),
);

// Dashboard Layout template
const DashboardLayoutTemplate = lazy(() =>
  import("./dashboard-layout/index").then((module) => ({
    default: module.DashboardLayoutTemplate,
  })),
);

// Settings Layout template
const SettingsLayout = lazy(() => import("./settings-layout/index"));

// List Layout template
const ListLayout = lazy(() => import("./list-layout/index"));

// Detail Layout template
const DetailLayout = lazy(() => import("./detail-layout/index"));

// WorkOn templates
const WorkOnEmployeeRegistration = lazy(() => import("./workon/employee-registration/index"));
const WorkOnProcedure = lazy(() => import("./workon/procedure/index"));
const WorkOnSetting = lazy(() => import("./workon/setting/index"));
const WorkOnSettingInvite = lazy(() => import("./workon/setting/invite/index"));
const WorkOnSettingAccount = lazy(() => import("./workon/setting/account/index"));
const WorkOnSettingPermissionManagement = lazy(() => import("./workon/setting/permission-management/index"));
const WorkOnProfile = lazy(() => import("./workon/profile/index"));
const WorkOnProfileEmployee = lazy(() => import("./workon/profile/employee/index"));
const WorkOnProfilePersonalInfo = lazy(() => import("./workon/profile/personal-info/index"));
const WorkOnProfileAdditionalInfo = lazy(() => import("./workon/profile/additional-info/index"));
const WorkOnProfileFamilyInfo = lazy(() => import("./workon/profile/family-info/index"));
const WorkOnProfileTaxInsurance = lazy(() => import("./workon/profile/tax-insurance/index"));
const WorkOnProfilePaymentDeduction = lazy(() => import("./workon/profile/payment-deduction/index"));
const WorkOnProfileSalaryBonusDetail = lazy(() => import("./workon/profile/salary-bonus-detail/index"));
const WorkOnProfileLeaveOfAbsence = lazy(() => import("./workon/profile/leave-of-absence/index"));
const WorkOnProfileDepartmentAssignment = lazy(() => import("./workon/profile/department-assignment/index"));
const WorkOnProfileCustom = lazy(() => import("./workon/profile/custom/index"));

// States & Feedback templates
const StatesIndex = lazy(() => import("./states/index"));
const StatesLoadingIndex = lazy(() => import("./states/loading/index"));
const StatesLoadingSkeleton = lazy(() => import("./states/loading/SkeletonPatterns"));
const StatesLoadingProgress = lazy(() => import("./states/loading/ProgressIndicators"));
const StatesLoadingComponent = lazy(() => import("./states/loading/ButtonAndComboboxLoading"));
const StatesErrorIndex = lazy(() => import("./states/error/index"));
const StatesErrorFetch = lazy(() => import("./states/error/FetchError"));
const StatesErrorValidation = lazy(() => import("./states/error/FormValidation"));
const StatesErrorSubmission = lazy(() => import("./states/error/FormSubmission"));
const StatesErrorDialog = lazy(() => import("./states/error/DialogError"));
const StatesErrorBoundary = lazy(() => import("./states/error/ErrorBoundaryDemo"));
const StatesEmptyIndex = lazy(() => import("./states/empty/index"));
const StatesEmptyPatterns = lazy(() => import("./states/empty/EmptyStatePatterns"));
const StatesFeedbackIndex = lazy(() => import("./states/feedback/index"));
const StatesFeedbackSnackbar = lazy(() => import("./states/feedback/SnackbarPatterns"));
const StatesFeedbackDisabled = lazy(() => import("./states/feedback/DisabledWithPopover"));

// DealOn templates
const DealOnLayout = lazy(() => import("./dealon/layout/index"));
const DealOnDealList = lazy(() => import("./dealon/deal-list/index"));
const DealOnDealDetail = lazy(() => import("./dealon/deal-detail/index"));
const DealOnSettingsProfile = lazy(() => import("./dealon/settings-profile/index"));
const DealOnSettingsUsers = lazy(() => import("./dealon/settings-users/index"));

export const routes: RouteConfig[] = [
  // Base template pages
  {
    path: "/template",
    element: <Template />,
  },
  {
    path: "/template/chat",
    element: <ChatTemplate />,
  },
  {
    path: "/template/dialog",
    element: <DialogTemplate />,
  },
  {
    path: "/template/dashboard",
    element: <DashboardTemplate />,
  },
  {
    path: "/template/dashboard/contract-review",
    element: <ContractReviewUploadTemplate />,
  },
  {
    path: "/template/case-reception-form",
    element: <CaseReceptionFormTemplate />,
  },
  {
    path: "/template/root",
    element: <RootTemplate />,
  },
  {
    path: "/template/root/not-found",
    element: <RootNotFoundTemplate />,
  },
  {
    path: "/template/root/server-error",
    element: <RootServerErrorTemplate />,
  },
  {
    path: "/template/root/maintenance",
    element: <RootMaintenanceTemplate />,
  },
  {
    path: "/template/esign",
    element: <ESignTemplate />,
  },
  {
    path: "/template/esign/envelope-list",
    element: <EnvelopeListTemplate />,
  },

  // PageLayout templates
  {
    path: "/template/pagelayout",
    element: <PageLayoutTemplate />,
  },
  {
    path: "/template/pagelayout/basic",
    element: <BasicLayout />,
  },
  {
    path: "/template/pagelayout/with-sidebar",
    element: <WithSidebar />,
  },
  {
    path: "/template/pagelayout/with-pane",
    element: <WithPane />,
  },
  {
    path: "/template/pagelayout/with-resizable-pane",
    element: <WithResizablePane />,
  },
  {
    path: "/template/pagelayout/scroll-inside",
    element: <ScrollInsideLayout />,
  },
  {
    path: "/template/pagelayout/with-sticky-container",
    element: <WithStickyContainer />,
  },
  {
    path: "/template/pagelayout/with-sidebar-and-pane",
    element: <WithSidebarAndPane />,
  },
  {
    path: "/template/pagelayout/with-sidebar-and-pane-start",
    element: <WithSidebarAndPaneStart />,
  },

  // LOC templates
  {
    path: "/template/loc/case",
    element: <CaseListTemplate />,
  },
  {
    path: "/template/loc/case/detail",
    element: <CaseDetailTemplate />,
  },
  {
    path: "/template/loc/application-console",
    element: <ApplicationConsoleTemplate />,
  },
  {
    path: "/template/loc/application-console/case-custom-attribute",
    element: <ApplicationConsoleCaseCustomAttributeTemplate />,
  },
  {
    path: "/template/loc/application-console/case-automation",
    element: <ApplicationConsoleCaseAutomationTemplate />,
  },
  {
    path: "/template/loc/application-console/case-notification-config",
    element: <ApplicationConsoleCaseNotificationConfigTemplate />,
  },
  {
    path: "/template/loc/application-console/case-reception-form",
    element: <ApplicationConsoleCaseReceptionFormTemplate />,
  },
  {
    path: "/template/loc/application-console/case-reception-form/edit",
    element: <ApplicationConsoleCaseReceptionFormEditTemplate />,
  },
  {
    path: "/template/loc/application-console/reception-mail-address",
    element: <ApplicationConsoleReceptionMailAddressTemplate />,
  },
  {
    path: "/template/loc/application-console/case-reception-space",
    element: <ApplicationConsoleCaseReceptionSpaceTemplate />,
  },
  {
    path: "/template/loc/application-console/case-reception-form-allowed-ip-address",
    element: <ApplicationConsoleCaseReceptionFormAllowedIPAddressTemplate />,
  },
  {
    path: "/template/loc/application-console/case-mail-allowed-domain",
    element: <ApplicationConsoleCaseMailAllowedDomainTemplate />,
  },
  {
    path: "/template/loc/application-console/contract-management/esign-integration",
    element: <ApplicationConsoleContractManagementEsignIntegrationTemplate />,
  },
  {
    path: "/template/loc/application-console/contract-management/custom-attribute-definition",
    element: <ApplicationConsoleContractManagementCustomAttributeDefinitionTemplate />,
  },
  {
    path: "/template/loc/application-console/contract-management/inhouse-id-auto-numbering",
    element: <ApplicationConsoleContractManagementInhouseIdAutoNumberingTemplate />,
  },
  {
    path: "/template/loc/application-console/contract-management/notification",
    element: <ApplicationConsoleContractManagementNotificationTemplate />,
  },
  {
    path: "/template/loc/application-console/sign/sender-name",
    element: <ApplicationConsoleSignSenderNameTemplate />,
  },
  {
    path: "/template/loc/application-console/sign/default-space",
    element: <ApplicationConsoleSignDefaultSpaceTemplate />,
  },
  {
    path: "/template/loc/application-console/sign/sign-workflow-form",
    element: <ApplicationConsoleSignWorkflowFormTemplate />,
  },
  {
    path: "/template/loc/word-addin",
    element: <WordAddinTemplate />,
  },
  {
    path: "/template/loc/word-addin-standalone",
    element: <WordAddinStandalone />,
  },
  {
    path: "/template/loc/loa",
    element: <LoaConversationTemplate />,
  },
  {
    path: "/template/loc/loa/history",
    element: <LoaHistoryTemplate />,
  },
  {
    path: "/template/loc/loa/prompt-library",
    element: <LoaPromptLibraryTemplate />,
  },
  {
    path: "/template/loc/loa/playbook",
    element: <LoaPlaybookTemplate />,
  },
  {
    path: "/template/loc/review",
    element: <ReviewTemplate />,
  },
  {
    path: "/template/loc/review-console",
    element: <ReviewConsoleTemplate />,
  },
  {
    path: "/template/loc/review-console/rules",
    element: <ReviewConsoleRulesTemplate />,
  },
  {
    path: "/template/loc/review-console/my-playbook",
    element: <ReviewConsoleMyPlaybookTemplate />,
  },

  // Manual Correction templates
  {
    path: "/template/loc/manual-correction",
    element: <ManualCorrectionListTemplate />,
  },
  {
    path: "/template/loc/manual-correction/detail",
    element: <ManualCorrectionDetailTemplate />,
  },

  // Search template
  {
    path: "/template/loc/search",
    element: <SearchTemplate />,
  },

  // File management templates
  {
    path: "/template/file-management",
    element: <FileManagementTemplate />,
  },
  {
    path: "/template/file-management/detail/:id",
    element: <FileManagementDetail />,
  },
  {
    path: "/template/file-management/customer-template",
    element: <FileManagementCustomerTemplate />,
  },

  // Legalon templates
  {
    path: "/template/legalon-template",
    element: <LegalonTemplateIndex />,
  },
  {
    path: "/template/legalon-template/category",
    element: <LegalonTemplateCategory />,
  },
  {
    path: "/template/legalon-template/:id",
    element: <LegalonTemplateDetail />,
  },

  // Management Console templates
  {
    path: "/template/management-console",
    element: <ManagementConsoleIndex />,
  },
  {
    path: "/template/management-console/mfa",
    element: <ManagementConsoleMfa />,
  },
  {
    path: "/template/management-console/slack",
    element: <ManagementConsoleSlack />,
  },
  {
    path: "/template/management-console/teams",
    element: <ManagementConsoleTeams />,
  },
  {
    path: "/template/management-console/sso",
    element: <ManagementConsoleSso />,
  },
  {
    path: "/template/management-console/company-info",
    element: <ManagementConsoleCompanyInfo />,
  },
  {
    path: "/template/management-console/departments",
    element: <ManagementConsoleDepartments />,
  },
  {
    path: "/template/management-console/users",
    element: <ManagementConsoleUsers />,
  },
  {
    path: "/template/management-console/user-groups",
    element: <ManagementConsoleUserGroups />,
  },
  {
    path: "/template/management-console/spaces",
    element: <ManagementConsoleSpaces />,
  },
  {
    path: "/template/management-console/audit-logs",
    element: <ManagementConsoleAuditLogs />,
  },

  // Personal Setting templates
  {
    path: "/template/personal-setting",
    element: <PersonalSettingIndex />,
  },
  {
    path: "/template/personal-setting/profile",
    element: <ProfilePage />,
  },
  {
    path: "/template/personal-setting/contract-notification",
    element: <ContractNotificationPage />,
  },
  {
    path: "/template/personal-setting/legal-notification",
    element: <LegalNotificationPage />,
  },
  {
    path: "/template/personal-setting/legalscape",
    element: <LegalscapePage />,
  },

  // Setting Page template
  {
    path: "/template/setting-page",
    element: <SettingPageTemplate />,
  },

  // Fill Layout template
  {
    path: "/template/fill-layout",
    element: <FillLayout />,
  },

  // Form Layout template
  {
    path: "/template/form-layout",
    element: <FormLayoutTemplate />,
  },

  // Form Template
  {
    path: "/template/form-template",
    element: <FormTemplate />,
  },

  // Chat Layout template
  {
    path: "/template/chat-layout",
    element: <ChatLayoutTemplate />,
  },

  // Dashboard Layout template
  {
    path: "/template/dashboard-layout",
    element: <DashboardLayoutTemplate />,
  },

  // Settings Layout template
  {
    path: "/template/settings-layout",
    element: <SettingsLayout />,
  },

  // List Layout template
  {
    path: "/template/list-layout",
    element: <ListLayout />,
  },

  // Detail Layout template
  {
    path: "/template/detail-layout",
    element: <DetailLayout />,
  },

  // WorkOn templates
  {
    path: "/template/workon/employee-registration",
    element: <WorkOnEmployeeRegistration />,
  },
  {
    path: "/template/workon/procedure",
    element: <WorkOnProcedure />,
  },
  {
    path: "/template/workon/setting",
    element: <WorkOnSetting />,
  },
  {
    path: "/template/workon/setting/invite",
    element: <WorkOnSettingInvite />,
  },
  {
    path: "/template/workon/setting/account",
    element: <WorkOnSettingAccount />,
  },
  {
    path: "/template/workon/setting/permission-management",
    element: <WorkOnSettingPermissionManagement />,
  },
  {
    path: "/template/workon/profile",
    element: <WorkOnProfile />,
  },
  {
    path: "/template/workon/profile/employee",
    element: <WorkOnProfileEmployee />,
  },
  {
    path: "/template/workon/profile/personal-info",
    element: <WorkOnProfilePersonalInfo />,
  },
  {
    path: "/template/workon/profile/additional-info",
    element: <WorkOnProfileAdditionalInfo />,
  },
  {
    path: "/template/workon/profile/family-info",
    element: <WorkOnProfileFamilyInfo />,
  },
  {
    path: "/template/workon/profile/tax-insurance",
    element: <WorkOnProfileTaxInsurance />,
  },
  {
    path: "/template/workon/profile/payment-deduction",
    element: <WorkOnProfilePaymentDeduction />,
  },
  {
    path: "/template/workon/profile/salary-bonus-detail",
    element: <WorkOnProfileSalaryBonusDetail />,
  },
  {
    path: "/template/workon/profile/leave-of-absence",
    element: <WorkOnProfileLeaveOfAbsence />,
  },
  {
    path: "/template/workon/profile/department-assignment",
    element: <WorkOnProfileDepartmentAssignment />,
  },
  {
    path: "/template/workon/profile/custom",
    element: <WorkOnProfileCustom />,
  },

  // States & Feedback templates
  {
    path: "/template/states",
    element: <StatesIndex />,
  },
  {
    path: "/template/states/loading",
    element: <StatesLoadingIndex />,
  },
  {
    path: "/template/states/loading/skeleton",
    element: <StatesLoadingSkeleton />,
  },
  {
    path: "/template/states/loading/progress",
    element: <StatesLoadingProgress />,
  },
  {
    path: "/template/states/loading/component",
    element: <StatesLoadingComponent />,
  },
  {
    path: "/template/states/error",
    element: <StatesErrorIndex />,
  },
  {
    path: "/template/states/error/fetch",
    element: <StatesErrorFetch />,
  },
  {
    path: "/template/states/error/validation",
    element: <StatesErrorValidation />,
  },
  {
    path: "/template/states/error/submission",
    element: <StatesErrorSubmission />,
  },
  {
    path: "/template/states/error/dialog",
    element: <StatesErrorDialog />,
  },
  {
    path: "/template/states/error/boundary",
    element: <StatesErrorBoundary />,
  },
  {
    path: "/template/states/empty",
    element: <StatesEmptyIndex />,
  },
  {
    path: "/template/states/empty/patterns",
    element: <StatesEmptyPatterns />,
  },
  {
    path: "/template/states/feedback",
    element: <StatesFeedbackIndex />,
  },
  {
    path: "/template/states/feedback/snackbar",
    element: <StatesFeedbackSnackbar />,
  },
  {
    path: "/template/states/feedback/disabled",
    element: <StatesFeedbackDisabled />,
  },

  // DealOn templates
  {
    path: "/template/dealon/layout",
    element: <DealOnLayout />,
  },
  {
    path: "/template/dealon/deal-list",
    element: <DealOnDealList />,
  },
  {
    path: "/template/dealon/deal-detail",
    element: <DealOnDealDetail />,
  },
  {
    path: "/template/dealon/settings-profile",
    element: <DealOnSettingsProfile />,
  },
  {
    path: "/template/dealon/settings-users",
    element: <DealOnSettingsUsers />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/template": "src/pages/template/index.tsx",
  "/template/chat": "src/pages/template/ChatTemplate.tsx",
  "/template/dialog": "src/pages/template/dialog/index.tsx",
  "/template/dashboard": "src/pages/template/loc/dashboard/index.tsx",
  "/template/dashboard/contract-review": "src/pages/template/loc/dashboard/contract-review/index.tsx",
  "/template/case-reception-form": "src/pages/template/loc/case-reception-form/index.tsx",
  "/template/root": "src/pages/template/loc/root/index.tsx",
  "/template/root/not-found": "src/pages/template/loc/root/NotFound.tsx",
  "/template/root/server-error": "src/pages/template/loc/root/ServerError.tsx",
  "/template/root/maintenance": "src/pages/template/loc/root/Maintenance.tsx",
  "/template/esign": "src/pages/template/loc/esign/index.tsx",
  "/template/esign/envelope-list": "src/pages/template/loc/esign/envelope-list.tsx",
  "/template/pagelayout": "src/pages/template/pagelayout/index.tsx",
  "/template/pagelayout/basic": "src/pages/template/pagelayout/BasicLayout.tsx",
  "/template/pagelayout/with-sidebar": "src/pages/template/pagelayout/WithSidebar.tsx",
  "/template/pagelayout/with-pane": "src/pages/template/pagelayout/WithPane.tsx",
  "/template/pagelayout/with-resizable-pane": "src/pages/template/pagelayout/WithResizablePane.tsx",
  "/template/pagelayout/scroll-inside": "src/pages/template/pagelayout/ScrollInsideLayout.tsx",
  "/template/pagelayout/with-sticky-container": "src/pages/template/pagelayout/WithStickyContainer.tsx",
  "/template/pagelayout/with-sidebar-and-pane": "src/pages/template/pagelayout/WithSidebarAndPane.tsx",
  "/template/pagelayout/with-sidebar-and-pane-start": "src/pages/template/pagelayout/WithSidebarAndPaneStart.tsx",
  "/template/loc/case": "src/pages/template/loc/case/index.tsx",
  "/template/loc/case/detail": "src/pages/template/loc/case/detail/index.tsx",
  "/template/loc/application-console": "src/pages/template/loc/application-console/index.tsx",
  "/template/loc/application-console/case-custom-attribute":
    "src/pages/template/loc/application-console/case-custom-attribute/index.tsx",
  "/template/loc/application-console/case-automation":
    "src/pages/template/loc/application-console/case-automation/index.tsx",
  "/template/loc/application-console/case-notification-config":
    "src/pages/template/loc/application-console/case-notification-config/index.tsx",
  "/template/loc/application-console/case-reception-form":
    "src/pages/template/loc/application-console/case-reception-form/index.tsx",
  "/template/loc/application-console/case-reception-form/edit":
    "src/pages/template/loc/application-console/case-reception-form/edit/index.tsx",
  "/template/loc/application-console/reception-mail-address":
    "src/pages/template/loc/application-console/reception-mail-address/index.tsx",
  "/template/loc/application-console/case-reception-space":
    "src/pages/template/loc/application-console/case-reception-space/index.tsx",
  "/template/loc/application-console/case-reception-form-allowed-ip-address":
    "src/pages/template/loc/application-console/case-reception-form-allowed-ip-address/index.tsx",
  "/template/loc/application-console/case-mail-allowed-domain":
    "src/pages/template/loc/application-console/case-mail-allowed-domain/index.tsx",
  "/template/loc/application-console/contract-management/esign-integration":
    "src/pages/template/loc/application-console/contract-management/esign-integration/index.tsx",
  "/template/loc/application-console/contract-management/custom-attribute-definition":
    "src/pages/template/loc/application-console/contract-management/custom-attribute-definition/index.tsx",
  "/template/loc/application-console/contract-management/inhouse-id-auto-numbering":
    "src/pages/template/loc/application-console/contract-management/inhouse-id-auto-numbering/index.tsx",
  "/template/loc/application-console/contract-management/notification":
    "src/pages/template/loc/application-console/contract-management/notification/index.tsx",
  "/template/loc/application-console/sign/sender-name":
    "src/pages/template/loc/application-console/sign/sender-name/index.tsx",
  "/template/loc/application-console/sign/default-space":
    "src/pages/template/loc/application-console/sign/default-space/index.tsx",
  "/template/loc/application-console/sign/sign-workflow-form":
    "src/pages/template/loc/application-console/sign/sign-workflow-form/index.tsx",
  "/template/loc/word-addin": "src/pages/template/loc/word-addin/index.tsx",
  "/template/loc/word-addin-standalone": "src/pages/template/loc/word-addin-standalone/index.tsx",
  "/template/loc/loa": "src/pages/template/loc/loa/index.tsx",
  "/template/loc/loa/history": "src/pages/template/loc/loa/history/index.tsx",
  "/template/loc/loa/prompt-library": "src/pages/template/loc/loa/prompt-library/index.tsx",
  "/template/loc/loa/playbook": "src/pages/template/loc/loa/playbook/index.tsx",
  "/template/loc/review": "src/pages/template/loc/review/index.tsx",
  "/template/loc/manual-correction": "src/pages/template/loc/manual-correction/index.tsx",
  "/template/loc/manual-correction/detail": "src/pages/template/loc/manual-correction/detail/index.tsx",
  "/template/loc/review-console": "src/pages/template/loc/review-console/index.tsx",
  "/template/loc/review-console/rules": "src/pages/template/loc/review-console/rules/index.tsx",
  "/template/loc/review-console/my-playbook": "src/pages/template/loc/review-console/my-playbook/index.tsx",
  "/template/loc/search": "src/pages/template/loc/search/index.tsx",
  "/template/file-management": "src/pages/template/loc/file-management/index.tsx",
  "/template/file-management/detail/:id": "src/pages/template/loc/file-management/detail/index.tsx",
  "/template/file-management/customer-template": "src/pages/template/loc/file-management/customer-template/index.tsx",
  "/template/legalon-template": "src/pages/template/loc/legalon-template/index.tsx",
  "/template/legalon-template/category": "src/pages/template/loc/legalon-template/category.tsx",
  "/template/legalon-template/:id": "src/pages/template/loc/legalon-template/detail.tsx",
  "/template/management-console": "src/pages/template/loc/management-console/index.tsx",
  "/template/management-console/mfa": "src/pages/template/loc/management-console/mfa.tsx",
  "/template/management-console/slack": "src/pages/template/loc/management-console/slack.tsx",
  "/template/management-console/teams": "src/pages/template/loc/management-console/teams.tsx",
  "/template/management-console/sso": "src/pages/template/loc/management-console/sso.tsx",
  "/template/management-console/company-info": "src/pages/template/loc/management-console/company-info.tsx",
  "/template/management-console/departments": "src/pages/template/loc/management-console/departments.tsx",
  "/template/management-console/users": "src/pages/template/loc/management-console/users.tsx",
  "/template/management-console/user-groups": "src/pages/template/loc/management-console/user-groups.tsx",
  "/template/management-console/spaces": "src/pages/template/loc/management-console/spaces.tsx",
  "/template/management-console/audit-logs": "src/pages/template/loc/management-console/audit-logs.tsx",
  "/template/personal-setting": "src/pages/template/loc/personal-setting/index.tsx",
  "/template/personal-setting/profile": "src/pages/template/loc/personal-setting/profile.tsx",
  "/template/personal-setting/contract-notification":
    "src/pages/template/loc/personal-setting/contract-notification.tsx",
  "/template/personal-setting/legal-notification": "src/pages/template/loc/personal-setting/legal-notification.tsx",
  "/template/personal-setting/legalscape": "src/pages/template/loc/personal-setting/legalscape.tsx",
  "/template/setting-page": "src/pages/template/loc/setting-page/index.tsx",
  "/template/fill-layout": "src/pages/template/fill-layout/index.tsx",
  "/template/form-layout": "src/pages/template/form-layout/index.tsx",
  "/template/form-template": "src/pages/template/form-template/index.tsx",
  "/template/chat-layout": "src/pages/template/chat-layout/index.tsx",
  "/template/dashboard-layout": "src/pages/template/dashboard-layout/index.tsx",
  "/template/settings-layout": "src/pages/template/settings-layout/index.tsx",
  "/template/list-layout": "src/pages/template/list-layout/index.tsx",
  "/template/detail-layout": "src/pages/template/detail-layout/index.tsx",
  "/template/workon/employee-registration": "src/pages/template/workon/employee-registration/index.tsx",
  "/template/workon/procedure": "src/pages/template/workon/procedure/index.tsx",
  "/template/workon/setting": "src/pages/template/workon/setting/index.tsx",
  "/template/workon/setting/invite": "src/pages/template/workon/setting/invite/index.tsx",
  "/template/workon/setting/account": "src/pages/template/workon/setting/account/index.tsx",
  "/template/workon/setting/permission-management": "src/pages/template/workon/setting/permission-management/index.tsx",
  "/template/workon/profile": "src/pages/template/workon/profile/index.tsx",
  "/template/workon/profile/employee": "src/pages/template/workon/profile/employee/index.tsx",
  "/template/workon/profile/personal-info": "src/pages/template/workon/profile/personal-info/index.tsx",
  "/template/workon/profile/additional-info": "src/pages/template/workon/profile/additional-info/index.tsx",
  "/template/workon/profile/family-info": "src/pages/template/workon/profile/family-info/index.tsx",
  "/template/workon/profile/tax-insurance": "src/pages/template/workon/profile/tax-insurance/index.tsx",
  "/template/workon/profile/payment-deduction": "src/pages/template/workon/profile/payment-deduction/index.tsx",
  "/template/workon/profile/salary-bonus-detail": "src/pages/template/workon/profile/salary-bonus-detail/index.tsx",
  "/template/workon/profile/leave-of-absence": "src/pages/template/workon/profile/leave-of-absence/index.tsx",
  "/template/workon/profile/department-assignment": "src/pages/template/workon/profile/department-assignment/index.tsx",
  "/template/workon/profile/custom": "src/pages/template/workon/profile/custom/index.tsx",
  "/template/states": "src/pages/template/states/index.tsx",
  "/template/states/loading": "src/pages/template/states/loading/index.tsx",
  "/template/states/loading/skeleton": "src/pages/template/states/loading/SkeletonPatterns.tsx",
  "/template/states/loading/progress": "src/pages/template/states/loading/ProgressIndicators.tsx",
  "/template/states/loading/component": "src/pages/template/states/loading/ButtonAndComboboxLoading.tsx",
  "/template/states/error": "src/pages/template/states/error/index.tsx",
  "/template/states/error/fetch": "src/pages/template/states/error/FetchError.tsx",
  "/template/states/error/validation": "src/pages/template/states/error/FormValidation.tsx",
  "/template/states/error/submission": "src/pages/template/states/error/FormSubmission.tsx",
  "/template/states/error/dialog": "src/pages/template/states/error/DialogError.tsx",
  "/template/states/error/boundary": "src/pages/template/states/error/ErrorBoundaryDemo.tsx",
  "/template/states/empty": "src/pages/template/states/empty/index.tsx",
  "/template/states/empty/patterns": "src/pages/template/states/empty/EmptyStatePatterns.tsx",
  "/template/states/feedback": "src/pages/template/states/feedback/index.tsx",
  "/template/states/feedback/snackbar": "src/pages/template/states/feedback/SnackbarPatterns.tsx",
  "/template/states/feedback/disabled": "src/pages/template/states/feedback/DisabledWithPopover.tsx",
  "/template/dealon/layout": "src/pages/template/dealon/layout/index.tsx",
  "/template/dealon/deal-list": "src/pages/template/dealon/deal-list/index.tsx",
  "/template/dealon/deal-detail": "src/pages/template/dealon/deal-detail/index.tsx",
  "/template/dealon/settings-profile": "src/pages/template/dealon/settings-profile/index.tsx",
  "/template/dealon/settings-users": "src/pages/template/dealon/settings-users/index.tsx",
};
