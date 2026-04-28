import type { TranslationDictionary } from "../../../../../../../hooks";

export type TranslationKey =
  | "pageTitle"
  | "createCase"
  | "assigneeUnset"
  | "statusLegalReview"
  | "statusRequesterWaiting"
  | "statusNotStarted"
  | "statusInProgress"
  | "statusCompleted"
  | "statusReturned"
  | "statusChecking"
  | "statusSecondaryChecking"
  | "statusOutsideOwnDeptChecking"
  | "caseId"
  | "caseName"
  | "caseStatus"
  | "dueDate"
  | "updatedAt"
  | "requester"
  | "requesterDepartment"
  | "all"
  | "inCharge"
  | "unnamed"
  | "filter"
  | "search"
  | "moreOptions"
  | "customizeDisplay"
  | "downloadCsv"
  | "caseIdName"
  | "caseType"
  | "caseTypeContractDrafting"
  | "caseTypeContractReview"
  | "caseTypeLegalRequest"
  | "caseTypeOther"
  | "clear"
  | "excludeClosed"
  | "mainAssignee"
  | "subAssignee"
  | "createdAt"
  | "resetFilter"
  | "relativeDate";

export const translations: TranslationDictionary<TranslationKey> = {
  "en-US": {
    // legal-management-f: documentTitle, headerTitle
    pageTitle: "Matters",
    // legal-management-f: createCaseDialogButtonLabel
    createCase: "Create matter",
    // legal-management-f: caseSegmentCounterBaseUnassignedCaseCountsLabel
    assigneeUnset: "Unassigned",
    statusLegalReview: "Legal Review",
    statusRequesterWaiting: "Requester Waiting",
    // legal-management-f: statusFilterBuiltinNotStartedTitle
    statusNotStarted: "Not yet started",
    // legal-management-f: statusFilterCustomTitle
    statusInProgress: "In progress",
    // legal-management-f: statusFilterBuiltinClosedTitle
    statusCompleted: "Completed",
    statusReturned: "Returned",
    // lib/loc-app: case_status.default_name_checking
    statusChecking: "In review",
    // lib/loc-app: case_status.default_name_secondary_checking
    statusSecondaryChecking: "In secondary review",
    // lib/loc-app: case_status.default_name_outside_own_department_checking
    statusOutsideOwnDeptChecking: "In other dept review",
    // legal-management-f: customizeDrawerCaseKeyLabel
    caseId: "ID",
    // legal-management-f: customizeDrawerCaseTitleLabel
    caseName: "Matter name",
    // legal-management-f: customizeDrawerCaseStatusLabel
    caseStatus: "Status",
    // legal-management-f: customizeDrawerCaseDueDateLabel
    dueDate: "Due date",
    // legal-management-f: customizeDrawerCaseLastMessageTimeLabel
    updatedAt: "Last updated",
    // legal-management-f: customizeDrawerCaseClientLabel
    requester: "Requester",
    // legal-management-f: customizeDrawerCaseClientDepartmentLabel
    requesterDepartment: "Requesting department",
    // legal-management-f: statusFilterFormControlTagPickerPlaceholder
    all: "All",
    // lib/loc-app: case_search_condition_definition.preset_assigned
    inCharge: "Assigned",
    // legal-management-f: addCustomCaseSearchConditionDefinitionButtonDefaultTabName
    unnamed: "Untitled tab",
    // legal-management-f: filterButtonWithDrawerButtonLabel
    filter: "Filter",
    // legal-management-f: caseFilterSearchPlaceholder
    search: "Search",
    moreOptions: "More Options",
    // legal-management-f: iconButtonWithMenuCustomizeIndexPageAriaLabel
    customizeDisplay: "Customize display items",
    // legal-management-f: iconButtonWithMenuCsvDownloadAriaLabel
    downloadCsv: "Export matter",
    caseIdName: "Case ID / Name",
    // legal-management-f: customizeDrawerCaseClassificationLabel
    caseType: "Matter type",
    // lib/loc-app: case_classification.name.contract_drafting
    caseTypeContractDrafting: "Contract Drafting",
    // lib/loc-app: case_classification.name.contract_review
    caseTypeContractReview: "Contract Review",
    // lib/loc-app: case_classification.name.legal_request
    caseTypeLegalRequest: "Legal Consultation",
    // lib/loc-app: case_classification.name.other
    caseTypeOther: "Other",
    // legal-management-f: statusFilterFormControlToolbarButtonLabel
    clear: "Clear",
    // legal-management-f: statusFilterFormControlCheckboxLabel
    excludeClosed: "Excluding completed matters",
    // legal-management-f: customizeDrawerCaseMainAssigneeLabel
    mainAssignee: "Assignee",
    // legal-management-f: customizeDrawerCaseSubAssigneesLabel
    subAssignee: "Secondary assignee",
    // legal-management-f: customizeDrawerCaseCreateTimeLabel
    createdAt: "Created",
    // legal-management-f: filterDrawerResetButtonLabel
    resetFilter: "Reset",
    relativeDate: "Relative to today",
  },
  "ja-JP": {
    // legal-management-f: documentTitle, headerTitle
    pageTitle: "案件",
    // legal-management-f: createCaseDialogButtonLabel
    createCase: "案件を作成",
    // legal-management-f: caseSegmentCounterBaseUnassignedCaseCountsLabel
    assigneeUnset: "案件担当者が未入力",
    statusLegalReview: "法務確認中",
    statusRequesterWaiting: "依頼者確認待ち",
    // legal-management-f: statusFilterBuiltinNotStartedTitle
    statusNotStarted: "未着手",
    // legal-management-f: statusFilterCustomTitle
    statusInProgress: "進行中",
    // legal-management-f: statusFilterBuiltinClosedTitle
    statusCompleted: "完了",
    statusReturned: "差戻し",
    // lib/loc-app: case_status.default_name_checking
    statusChecking: "確認中",
    // lib/loc-app: case_status.default_name_secondary_checking
    statusSecondaryChecking: "2次確認中",
    // lib/loc-app: case_status.default_name_outside_own_department_checking
    statusOutsideOwnDeptChecking: "自部門外確認中",
    // legal-management-f: customizeDrawerCaseKeyLabel
    caseId: "案件番号",
    // legal-management-f: customizeDrawerCaseTitleLabel
    caseName: "案件名",
    // legal-management-f: customizeDrawerCaseStatusLabel
    caseStatus: "案件ステータス",
    // legal-management-f: customizeDrawerCaseDueDateLabel
    dueDate: "納期",
    // legal-management-f: customizeDrawerCaseLastMessageTimeLabel
    updatedAt: "更新日時",
    // legal-management-f: customizeDrawerCaseClientLabel
    requester: "依頼者",
    // legal-management-f: customizeDrawerCaseClientDepartmentLabel
    requesterDepartment: "依頼部署",
    // legal-management-f: statusFilterFormControlTagPickerPlaceholder
    all: "すべて",
    // lib/loc-app: case_search_condition_definition.preset_assigned
    inCharge: "担当中",
    // legal-management-f: addCustomCaseSearchConditionDefinitionButtonDefaultTabName
    unnamed: "無題のタブ",
    // legal-management-f: filterButtonWithDrawerButtonLabel
    filter: "フィルター",
    // legal-management-f: caseFilterSearchPlaceholder
    search: "キーワードで検索",
    moreOptions: "その他のオプション",
    // legal-management-f: iconButtonWithMenuCustomizeIndexPageAriaLabel
    customizeDisplay: "表示項目をカスタマイズ",
    // legal-management-f: iconButtonWithMenuCsvDownloadAriaLabel
    downloadCsv: "案件をエクスポート",
    caseIdName: "案件番号/案件名",
    // legal-management-f: customizeDrawerCaseClassificationLabel
    caseType: "案件タイプ",
    // lib/loc-app: case_classification.name.contract_drafting
    caseTypeContractDrafting: "契約書の起案",
    // lib/loc-app: case_classification.name.contract_review
    caseTypeContractReview: "契約書審査",
    // lib/loc-app: case_classification.name.legal_request
    caseTypeLegalRequest: "法務相談",
    // lib/loc-app: case_classification.name.other
    caseTypeOther: "その他",
    // legal-management-f: statusFilterFormControlToolbarButtonLabel
    clear: "クリア",
    // legal-management-f: statusFilterFormControlCheckboxLabel
    excludeClosed: "完了した案件を除く",
    // legal-management-f: customizeDrawerCaseMainAssigneeLabel
    mainAssignee: "案件担当者",
    // legal-management-f: customizeDrawerCaseSubAssigneesLabel
    subAssignee: "副担当者",
    // legal-management-f: customizeDrawerCaseCreateTimeLabel
    createdAt: "作成日時",
    // legal-management-f: filterDrawerResetButtonLabel
    resetFilter: "リセット",
    relativeDate: "今日を起点に相対指定",
  },
};
