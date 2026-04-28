export interface Asset {
  id: string;
  assetGroupId: string;
  title: string;
  brand: string;
  fileFormat: string;
  status: string;
  recommended: boolean;
  locale: string;
  assetType: string;
  usage: string[];
  updatedAt: string;
  previousVersionId: string | null;
  replacedBy: string | null;
  thumbnailColor?: string;
  description: string;
  driveId: string;
  driveUrl: string;
  thumbnailUrl: string;
  downloadUrl: string;
  colorVariant: string;
  variantLabel?: string;
  tags: string[];
  allowBrowseOnly?: boolean;
}

export interface DisplayGroup {
  id: string;
  representative: Asset;
  variants: Asset[];
  title: string;
  fileFormats: string[];
  colorLabels: string[];
  variantCount: number;
  localeLabel: string;
  updatedAt: string;
}

export interface FilterState {
  product: Set<string>;
  fileFormat: Set<string>;
}

export interface AppState {
  query: string;
  sort: string;
  showDeprecated: boolean;
  showArchived: boolean;
  filters: FilterState;
  modalAssetId: string | null;
}
