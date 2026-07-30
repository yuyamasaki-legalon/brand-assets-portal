var e=`import type { TranslationDictionary } from "../../../../../hooks";

/**
 * 案件一覧 (/template/loc/case) の翻訳辞書。
 *
 * SSOT は loc-app のテキスト: \`lib/loc-app/text-management/legal-management-f/translate.csv\`。
 * 各キーの出典コメント \`// {service}: {messageKey}\` が SSOT との紐づけを表す。
 * 値のずれは \`pnpm i18n:drift\` で検知・取込できる。
 * \`// mock-only\` は loc-app に対応の無いプロトタイプ専用文言（drift 対象外）。
 *
 * 編集ガイド: 文言修正は原則 loc-app 側 CSV(SSOT) で行い、\`pnpm i18n:drift --fix\` で同期する。
 */
export type TranslationKey =
  | "pageTitle"
  | "createCase"
  | "copyReceptionMail"
  | "assigneeUnset"
  | "viewWorkload"
  | "statusLegalReview"
  | "statusRequesterWaiting"
  | "statusNotStarted"
  | "statusInProgress"
  | "statusReturned"
  | "statusCompleted"
  | "tabAll"
  | "tabInCharge"
  | "addTab"
  | "filter"
  | "searchPlaceholder"
  | "displayMenu"
  | "customizeDisplay"
  | "exportCases"
  | "consolidateCases"
  | "selectedCount"
  | "cancel"
  | "clear"
  | "all"
  | "caseId"
  | "caseName"
  | "mainAssignee"
  | "caseStatus"
  | "requester"
  | "subAssignee"
  | "caseType"
  | "space"
  | "dueDate"
  | "updatedAt"
  | "createdAt"
  | "requesterDepartment"
  | "caseTypeContractReview"
  | "caseTypeContractDrafting"
  | "caseTypeLegalConsultation"
  | "caseTypeOther"
  | "deptUnassigned"
  | "caseNumberSearchPlaceholder"
  | "excludeClosed"
  | "selectStatus"
  | "assignees"
  | "assigneesHelp"
  | "assigneesHelperText"
  | "andSearch"
  | "orSearch"
  | "selectMainAssignee"
  | "selectSubAssignee"
  | "relativeToToday"
  | "caseCreatedDate"
  | "updatedDate"
  | "reset"
  | "emptyTitle"
  | "emptyDescription";

export const translations: TranslationDictionary<TranslationKey> = {
  "en-US": {
    // legal-management-f: headerTitle @ /parts/index/ProUserMainContent/Header
    pageTitle: "Matters",
    // legal-management-f: createCaseDialogButtonLabel
    createCase: "Create matter",
    // legal-management-f: receptionMailAddressCopyButtonAriaLabel
    copyReceptionMail: "Copy matter intake email address",
    // legal-management-f: caseSegmentCounterBaseUnassignedCaseCountsLabel
    assigneeUnset: "Unassigned",
    // legal-management-f: viewWorkload
    viewWorkload: "View Workload",
    // mock-only (案件ステータスはマスタデータ。CSV 非掲載)
    statusLegalReview: "Legal Review",
    // mock-only
    statusRequesterWaiting: "Requester Waiting",
    // legal-management-f: statusFilterBuiltinNotStartedTitle
    statusNotStarted: "Not yet started",
    // mock-only (template ラベルは「対応中」。statusFilterCustomTitle は「進行中」)
    statusInProgress: "In progress",
    // mock-only
    statusReturned: "Returned",
    // legal-management-f: statusFilterBuiltinClosedTitle
    statusCompleted: "Completed",
    // legal-management-f: caseTabListBaseAllTabDisplayName
    tabAll: "All",
    // lib/loc-app: case_search_condition_definition.preset_assigned
    tabInCharge: "Assigned",
    // legal-management-f: addCustomCaseSearchConditionDefinitionButtonLabel
    addTab: "Add tab",
    // legal-management-f: filterButtonWithDrawerButtonLabel
    filter: "Filter",
    // legal-management-f: caseFilterSearchPlaceholder
    searchPlaceholder: "Search",
    // legal-management-f: iconButtonWithMenuAriaLabel
    displayMenu: "Display menu",
    // legal-management-f: iconButtonWithMenuCustomizeIndexPageAriaLabel
    customizeDisplay: "Customize display items",
    // legal-management-f: iconButtonWithMenuCsvDownloadAriaLabel
    exportCases: "Export matter",
    // mock-only (案件統合は feature flag。CSV 非掲載)
    consolidateCases: "Group matters",
    // mock-only
    selectedCount: "{count} selected",
    // legal-management-f: dialogContentInnerCancelButtonLabel
    cancel: "Cancel",
    // legal-management-f: keyFilterClearButton
    clear: "Clear",
    // legal-management-f: classificationFilterSelectPlaceholder
    all: "All",
    // legal-management-f: caseTableCellCaseKeyLabel
    caseId: "ID",
    // legal-management-f: caseTableCellCaseTitleLabel
    caseName: "Matter name",
    // legal-management-f: caseTableCellCaseMainAssigneeLabel
    mainAssignee: "Assignee",
    // legal-management-f: caseTableCellCaseStatusLabel
    caseStatus: "Status",
    // legal-management-f: caseTableCellCaseClientLabel
    requester: "Requester",
    // legal-management-f: caseTableCellCaseSubAssigneesLabel
    subAssignee: "Secondary assignee",
    // legal-management-f: caseTableCellCaseClassificationLabel
    caseType: "Matter type",
    // legal-management-f: caseTableCellCaseSpaceLabel
    space: "Locations",
    // legal-management-f: caseTableCellCaseDueDateLabel
    dueDate: "Due date",
    // legal-management-f: caseTableCellCaseLastMessageTimeLabel
    updatedAt: "Last updated",
    // legal-management-f: caseTableCellCaseCreateTimeLabel
    createdAt: "Created",
    // legal-management-f: caseTableCellCaseClientDepartmentLabel
    requesterDepartment: "Requesting department",
    // legal-management-f: filterButtonWithDrawerClassificationContractReviewLabel
    caseTypeContractReview: "Contract review",
    // legal-management-f: filterButtonWithDrawerClassificationContractDraftingLabel
    caseTypeContractDrafting: "Contract drafting",
    // legal-management-f: filterButtonWithDrawerClassificationLegalRequestLabel
    caseTypeLegalConsultation: "Legal consultation",
    // legal-management-f: filterButtonWithDrawerClassificationOtherLabel
    caseTypeOther: "Other",
    // legal-management-f: mainAssigneeFilterUserOptionsLabel
    deptUnassigned: "-",
    // legal-management-f: keyFilterSelectPlaceholder
    caseNumberSearchPlaceholder: "Search by ID",
    // legal-management-f: statusFilterFormControlCheckboxLabel
    excludeClosed: "Excluding completed matters",
    // legal-management-f: statusFilterFormControlTagPickerAriaLabel
    selectStatus: "Select Status",
    // legal-management-f: assigneesFilterLabel
    assignees: "Assignee",
    // legal-management-f: assigneesFilterHelp
    assigneesHelp: "Help",
    // legal-management-f: assigneesFilterHelperText
    assigneesHelperText:
      "AND search：Shows cases that meet both conditions: the case manager and the deputy manager.\\nOR search：Shows cases that meet either condition: the case manager or the deputy manager. (Example: Display cases where you are either the main manager or the deputy manager)",
    // legal-management-f: assigneesFilterRadioLabelAnd
    andSearch: "AND search",
    // legal-management-f: assigneesFilterRadioLabelOr
    orSearch: "OR search",
    // legal-management-f: assigneeFilterHooksMainAssigneeCaseFormTagPickerAriaLabel
    selectMainAssignee: "Select Assignee",
    // legal-management-f: assigneeFilterHooksSubAssigneeCaseFormTagPickerAriaLabel
    selectSubAssignee: "Select Secondary assignee",
    // legal-management-f: relativeSelectorLabel
    relativeToToday: "Relative to today",
    // legal-management-f: filterButtonWithDrawerDateFilterCaseCreateTimeDueDateFormLabel
    caseCreatedDate: "Matter created on",
    // legal-management-f: filterButtonWithDrawerDateFilterLastMessageTimeFormLabel
    updatedDate: "Last updated",
    // legal-management-f: filterButtonWithDrawerResetButtonLabel
    reset: "Reset",
    // mock-only (EmptyState は template 独自文言)
    emptyTitle: "No matters yet",
    // mock-only
    emptyDescription: "Create a matter to start a legal consultation.",
  },
  "ja-JP": {
    // legal-management-f: headerTitle @ /parts/index/ProUserMainContent/Header
    pageTitle: "案件",
    // legal-management-f: createCaseDialogButtonLabel
    createCase: "案件を作成",
    // legal-management-f: receptionMailAddressCopyButtonAriaLabel
    copyReceptionMail: "案件受付メールアドレスをコピー",
    // legal-management-f: caseSegmentCounterBaseUnassignedCaseCountsLabel
    assigneeUnset: "案件担当者が未入力",
    // legal-management-f: viewWorkload
    viewWorkload: "現在の業務状況を見る",
    // mock-only
    statusLegalReview: "法務確認中",
    // mock-only
    statusRequesterWaiting: "依頼者確認待ち",
    // legal-management-f: statusFilterBuiltinNotStartedTitle
    statusNotStarted: "未着手",
    // mock-only
    statusInProgress: "対応中",
    // mock-only
    statusReturned: "差戻し",
    // legal-management-f: statusFilterBuiltinClosedTitle
    statusCompleted: "完了",
    // legal-management-f: caseTabListBaseAllTabDisplayName
    tabAll: "すべて",
    // lib/loc-app: case_search_condition_definition.preset_assigned
    tabInCharge: "担当中",
    // legal-management-f: addCustomCaseSearchConditionDefinitionButtonLabel
    addTab: "タブを追加",
    // legal-management-f: filterButtonWithDrawerButtonLabel
    filter: "フィルター",
    // legal-management-f: caseFilterSearchPlaceholder
    searchPlaceholder: "キーワードで検索",
    // legal-management-f: iconButtonWithMenuAriaLabel
    displayMenu: "メニューを表示",
    // legal-management-f: iconButtonWithMenuCustomizeIndexPageAriaLabel
    customizeDisplay: "表示項目をカスタマイズ",
    // legal-management-f: iconButtonWithMenuCsvDownloadAriaLabel
    exportCases: "案件をエクスポート",
    // mock-only
    consolidateCases: "案件をまとめる",
    // mock-only
    selectedCount: "{count}件選択中",
    // legal-management-f: dialogContentInnerCancelButtonLabel
    cancel: "キャンセル",
    // legal-management-f: keyFilterClearButton
    clear: "クリア",
    // legal-management-f: classificationFilterSelectPlaceholder
    all: "すべて",
    // legal-management-f: caseTableCellCaseKeyLabel
    caseId: "案件番号",
    // legal-management-f: caseTableCellCaseTitleLabel
    caseName: "案件名",
    // legal-management-f: caseTableCellCaseMainAssigneeLabel
    mainAssignee: "案件担当者",
    // legal-management-f: caseTableCellCaseStatusLabel
    caseStatus: "案件ステータス",
    // legal-management-f: caseTableCellCaseClientLabel
    requester: "依頼者",
    // legal-management-f: caseTableCellCaseSubAssigneesLabel
    subAssignee: "副担当者",
    // legal-management-f: caseTableCellCaseClassificationLabel
    caseType: "案件タイプ",
    // legal-management-f: caseTableCellCaseSpaceLabel
    space: "保存先",
    // legal-management-f: caseTableCellCaseDueDateLabel
    dueDate: "納期",
    // legal-management-f: caseTableCellCaseLastMessageTimeLabel
    updatedAt: "更新日時",
    // legal-management-f: caseTableCellCaseCreateTimeLabel
    createdAt: "作成日時",
    // legal-management-f: caseTableCellCaseClientDepartmentLabel
    requesterDepartment: "依頼部署",
    // legal-management-f: filterButtonWithDrawerClassificationContractReviewLabel
    caseTypeContractReview: "契約書審査",
    // legal-management-f: filterButtonWithDrawerClassificationContractDraftingLabel
    caseTypeContractDrafting: "契約書の起案",
    // legal-management-f: filterButtonWithDrawerClassificationLegalRequestLabel
    caseTypeLegalConsultation: "法務相談",
    // legal-management-f: filterButtonWithDrawerClassificationOtherLabel
    caseTypeOther: "その他",
    // legal-management-f: mainAssigneeFilterUserOptionsLabel
    deptUnassigned: "未入力",
    // legal-management-f: keyFilterSelectPlaceholder
    caseNumberSearchPlaceholder: "案件番号で検索",
    // legal-management-f: statusFilterFormControlCheckboxLabel
    excludeClosed: "完了した案件を除く",
    // legal-management-f: statusFilterFormControlTagPickerAriaLabel
    selectStatus: "ステータスを選択",
    // legal-management-f: assigneesFilterLabel
    assignees: "担当者",
    // legal-management-f: assigneesFilterHelp
    assigneesHelp: "ヘルプ",
    // legal-management-f: assigneesFilterHelperText
    assigneesHelperText:
      "AND検索：案件担当者と副担当者の両方の条件を満たす案件を表示します。\\nOR検索：案件担当者か副担当者、どちらか一方の条件を満たす案件を表示します。（例：自分が主担当または副担当の案件を表示します）",
    // legal-management-f: assigneesFilterRadioLabelAnd
    andSearch: "AND検索",
    // legal-management-f: assigneesFilterRadioLabelOr
    orSearch: "OR検索",
    // legal-management-f: assigneeFilterHooksMainAssigneeCaseFormTagPickerAriaLabel
    selectMainAssignee: "案件担当者を選択",
    // legal-management-f: assigneeFilterHooksSubAssigneeCaseFormTagPickerAriaLabel
    selectSubAssignee: "副担当者を選択",
    // legal-management-f: relativeSelectorLabel
    relativeToToday: "今日を起点に相対指定",
    // legal-management-f: filterButtonWithDrawerDateFilterCaseCreateTimeDueDateFormLabel
    caseCreatedDate: "案件作成日",
    // legal-management-f: filterButtonWithDrawerDateFilterLastMessageTimeFormLabel
    updatedDate: "更新日",
    // legal-management-f: filterButtonWithDrawerResetButtonLabel
    reset: "リセット",
    // mock-only
    emptyTitle: "案件がまだありません",
    // mock-only
    emptyDescription: "案件を作成して法務相談を始めましょう",
  },
};
`;export{e as default};