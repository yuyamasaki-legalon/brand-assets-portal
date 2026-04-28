/** Filter state types for each search tab */

export type ArticleFilterState = {
  latestVersionOnly: boolean;
  contractForm: string;
  fileNameOrTitle: string;
  companyName: string;
  counterPartyName: string;
  contractStatus: string;
  createdAt: string;
  createdByContract: string;
  createdByLegalonTemplate: string;
};

export const ARTICLE_FILTER_DEFAULT: ArticleFilterState = {
  latestVersionOnly: false,
  contractForm: "all",
  fileNameOrTitle: "",
  companyName: "",
  counterPartyName: "",
  contractStatus: "all",
  createdAt: "all",
  createdByContract: "all",
  createdByLegalonTemplate: "all",
};

export type CaseFilterState = {
  assignee: string;
  department: string;
  caseStatus: string;
  storageLocation: string;
};

export const CASE_FILTER_DEFAULT: CaseFilterState = {
  assignee: "all",
  department: "all",
  caseStatus: "all",
  storageLocation: "all",
};

export type ContractFilterState = {
  versionFrom: string;
  includeOrAbove: boolean;
  governingLaw: string;
  contractType: string;
  contractSubType: string;
  createdBy: string;
  companyName: string;
  counterPartyName: string;
  contractStatus: string;
  language: string;
  storageLocation: string;
};

export const CONTRACT_FILTER_DEFAULT: ContractFilterState = {
  versionFrom: "",
  includeOrAbove: false,
  governingLaw: "all",
  contractType: "all",
  contractSubType: "all",
  createdBy: "all",
  companyName: "",
  counterPartyName: "",
  contractStatus: "all",
  language: "all",
  storageLocation: "all",
};

export type CustomerTemplateFilterState = {
  versionFrom: string;
  includeOrAbove: boolean;
  governingLaw: string;
  contractType: string;
  contractSubType: string;
  createdBy: string;
  customerTemplateStatus: string;
  language: string;
  storageLocation: string;
};

export const CUSTOMER_TEMPLATE_FILTER_DEFAULT: CustomerTemplateFilterState = {
  versionFrom: "",
  includeOrAbove: false,
  governingLaw: "all",
  contractType: "all",
  contractSubType: "all",
  createdBy: "all",
  customerTemplateStatus: "all",
  language: "all",
  storageLocation: "all",
};

export type LegalonTemplateFilterState = {
  category: string;
  subCategory: string;
  language: string;
  createdBy: string;
};

export const LEGALON_TEMPLATE_FILTER_DEFAULT: LegalonTemplateFilterState = {
  category: "all",
  subCategory: "all",
  language: "all",
  createdBy: "all",
};

export type OtherFileFilterState = {
  storageLocation: string;
  createdBy: string;
};

export const OTHER_FILE_FILTER_DEFAULT: OtherFileFilterState = {
  storageLocation: "all",
  createdBy: "all",
};
