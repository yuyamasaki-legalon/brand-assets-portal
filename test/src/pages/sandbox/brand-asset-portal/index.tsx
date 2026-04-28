import {
  LfArrowUpRightFromSquare,
  LfCloseLarge,
  LfDownload,
  LfFilter,
  LfFolder,
  LfMagnifyingGlass,
} from "@legalforce/aegis-icons";
import {
  Banner,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  EmptyState,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  PageLayoutSidebar,
  Select,
  SideNavigation,
  Tag,
  Text,
  TextField,
  Tooltip,
} from "@legalforce/aegis-react";
import { type Dispatch, type SetStateAction, useEffect, useMemo, useState } from "react";
import rawAssetIndex from "./assets-index.json";
import styles from "./index.module.css";

type RawAsset = {
  id: string;
  assetGroupId?: string;
  title: string;
  brand: Brand;
  fileFormat: FileFormat;
  status: AssetStatus;
  assetType: string;
  description?: string;
  usage?: string[];
  locale?: string;
  updatedAt: string;
  tags?: string[];
  variantLabel?: string;
  colorVariant?: string;
  recommended?: boolean;
  replacedBy?: string | null;
  previousVersionId?: string | null;
  driveId?: string;
  driveUrl?: string;
  thumbnailUrl?: string;
  downloadUrl?: string;
  allowBrowseOnly?: boolean;
};

type AssetStatus = "current" | "deprecated" | "archived";
type FileFormat = "PNG" | "SVG" | "PDF" | "AI" | "PSD" | "PPT" | "MP4" | "JPG";
type Brand = "LegalOn" | "GovernOn" | "WorkOn" | "DealOn" | "CXOn";
type PaneType = "discover" | "filters" | "collections";

type Asset = Omit<RawAsset, "usage" | "tags" | "locale"> & {
  usage: string[];
  tags: string[];
  locale: string;
  allowBrowseOnly: boolean;
  colorVariant: string;
  driveId: string;
  driveUrl: string;
  thumbnailUrl: string;
  downloadUrl: string;
};

type DisplayGroup = {
  id: string;
  representative: Asset;
  variants: Asset[];
  title: string;
  fileFormats: string[];
  colorLabels: string[];
  variantCount: number;
  localeLabel: string;
  updatedAt: string;
};

const statusMeta: Record<AssetStatus, { label: string }> = {
  current: { label: "Current" },
  deprecated: { label: "Deprecated" },
  archived: { label: "Archived" },
};

const brandMeta: Record<Brand, { label: Brand; color: string; summary: string }> = {
  LegalOn: { label: "LegalOn", color: "#d34638", summary: "コアブランドのロゴ、ガイドライン、テンプレート群" },
  GovernOn: { label: "GovernOn", color: "#039373", summary: "GovernOn向けブランドアセット" },
  WorkOn: { label: "WorkOn", color: "#7b6bd0", summary: "WorkOn の運用・採用・営業向け素材" },
  DealOn: { label: "DealOn", color: "#c15d1e", summary: "DealOn の案件訴求・提案用素材" },
  CXOn: { label: "CXOn", color: "#3f7ecf", summary: "CXOn キャンペーン・製品紹介用素材" },
};

const filterGroups = {
  product: ["LegalOn", "GovernOn", "WorkOn", "DealOn", "CXOn"] as Brand[],
  fileFormat: ["PNG", "SVG", "PDF", "AI", "PSD", "PPT", "MP4", "JPG"] as FileFormat[],
};

const popularSearches = [
  "logo",
  "icon",
  "guideline",
  "3D",
  "ProfessionalAI",
  "white",
  "black",
  "deprecated",
  "LegalOn",
  "GovernOn",
  "WorkOn",
  "DealOn",
  "CXOn",
  "JP",
  "US",
  "EU",
  "template",
  "motion",
  "pptx",
  "UI",
];

const brandDriveRoots = {
  LegalOn: {
    global: "https://drive.google.com/drive/folders/1xWOLldat36hYShVwSACI88jVQtkKbymh",
    jp: "https://drive.google.com/drive/folders/1p_dXrzTW_o4thbyc_54TO330DztaAIGY",
    us: "https://drive.google.com/drive/folders/102kORh76hgVFkr5hQvXqnQbAJz09GxHq",
  },
  GovernOn: {
    global: "https://drive.google.com/drive/folders/1LKIzIpV6oWKUhOjLii1Zsz5lCKgtEezw",
    jp: "https://drive.google.com/drive/folders/1Xtp3eWvfQHvh7T6-8r49ug2t6-1WXFpJ",
  },
  WorkOn: {
    global: "https://drive.google.com/drive/folders/1YvBn1Zri8A797l8qh9nTyQC3BYF-f_ag",
    jp: "https://drive.google.com/drive/folders/1AmvSZEBqZY2izfRdr0EooacWKIgpYMcN",
    us: "https://drive.google.com/drive/folders/1_AIRPUH9_xXJFvyKHQqIE9yZjtj0BE_C",
  },
  DealOn: {
    global: "https://drive.google.com/drive/folders/11ORZneYLHwFuvzTuNsVk1atD3A1CbjNN",
    jp: "https://drive.google.com/drive/folders/1sPAkTP5DjOMqDtVvCaQHfaHsq9tfxEOb",
    us: "https://drive.google.com/drive/folders/1e8rmbIxDXgkIs1N-Y72brLN-wfZqp14G",
  },
  CXOn: {
    global: "https://drive.google.com/drive/folders/17fyHlXC9_VEmy2f5Kwe4K9qfA6qhGaXO",
    jp: "https://drive.google.com/drive/folders/1_AIRPUH9_xXJFvyKHQqIE9yZjtj0BE_C",
  },
} as const;

const brandBrowseFolders = {
  LegalOn: {
    default: "https://drive.google.com/drive/folders/1Z67ygGzOb47j1FzI4iIvVnWwlZS8zOeB",
  },
  GovernOn: {
    default: "https://drive.google.com/drive/folders/1O7esmFsX-3OOAbIJrYkjwMGuxjjEe_Yv",
  },
  WorkOn: {
    default: "https://drive.google.com/drive/folders/1Y7fJQ3QJYVRK2ixm8TPa1zYN5GFOHKrs",
    logo: "https://drive.google.com/drive/folders/1fZQnusoKYO5414IuHRwrfVG14CdSVD1A",
  },
  DealOn: {
    default: "https://drive.google.com/drive/folders/1QtbaWpoz-hf0_gBKj9LdEMLtccphRGT0",
    logo: "https://drive.google.com/drive/folders/1dQpCg63IAaaSWR0y9VDoEmh6aSoNCnYV",
  },
  CXOn: {
    default: "https://drive.google.com/drive/folders/1wffK4A5wLcTQJT4mBCOBd5WBfmdFgxcc",
    logo: "https://drive.google.com/drive/folders/1dAKtf7uvtpHvT0q2GnF17SUrhHBjLFbx",
  },
} as const;

const illustrationCategoryMeta = {
  people: {
    display: "ひとイラスト",
    thumbnail: "PEOPLE",
    matchers: ["ひとイラスト", "people illustrations", "people illustration", "people", "human", "person", "character"],
    tags: ["ひとイラスト", "人物", "人", "ひと", "people", "person", "human", "worker", "user", "persona"],
  },
  object: {
    display: "ものイラスト",
    thumbnail: "OBJECT",
    matchers: ["ものイラスト", "object illustrations", "object illustration", "object", "tool", "device", "symbol"],
    tags: ["ものイラスト", "モノ", "もの", "物", "object", "device", "tool", "symbol", "document", "ui"],
  },
  scene: {
    display: "ことイラスト",
    thumbnail: "SCENE",
    matchers: [
      "ことイラスト",
      "scene illustrations",
      "scene illustration",
      "scene",
      "situation",
      "workflow",
      "narrative",
    ],
    tags: [
      "ことイラスト",
      "scene",
      "situation",
      "workflow",
      "context",
      "story",
      "業務フロー",
      "利用シーン",
      "状況",
      "シーン",
    ],
  },
} as const;

const searchAliases: Record<string, string[]> = {
  professionalai: ["professionalai", "professional ai", "プロフェッショナルai"],
  logo: ["logo", "ロゴ"],
  ロゴ: ["ロゴ", "logo"],
  guideline: ["guideline", "ガイドライン"],
  ガイドライン: ["ガイドライン", "guideline"],
  template: ["template", "テンプレート"],
  テンプレート: ["テンプレート", "template"],
  ppt: ["ppt", "pptx", "potx", "powerpoint", "パワーポイント", "パワポ"],
  pptx: ["pptx", "ppt", "potx", "powerpoint", "パワーポイント", "パワポ"],
  potx: ["potx", "pptx", "ppt", "powerpoint", "パワーポイント", "パワポ"],
  powerpoint: ["powerpoint", "ppt", "pptx", "potx", "パワーポイント", "パワポ"],
  パワーポイント: ["パワーポイント", "パワポ", "powerpoint", "ppt", "pptx", "potx"],
  パワポ: ["パワポ", "パワーポイント", "powerpoint", "ppt", "pptx", "potx"],
  psd: ["psd", "photoshop", "フォトショップ", "編集用"],
  motion: ["motion", "モーション"],
  モーション: ["モーション", "motion"],
  "3d": ["3d", "3d visual", "3dvisual", "3dビジュアル", "3d visuals"],
  "3d visual": ["3d visual", "3d", "3dvisual", "3dビジュアル"],
  material: ["material", "営業資料素材"],
  banner: ["banner", "バナー"],
  icon: ["icon", "アイコン"],
  アイコン: ["アイコン", "icon"],
  people: ["people", "person", "human", "worker", "user", "人物", "人", "ひと", "担当者", "利用者"],
  人物: ["人物", "人", "ひと", "people", "person", "human", "worker", "user"],
  object: [
    "object",
    "device",
    "tool",
    "symbol",
    "document",
    "もの",
    "モノ",
    "物",
    "デバイス",
    "道具",
    "記号",
    "シンボル",
  ],
  もの: ["もの", "モノ", "物", "object", "device", "tool", "symbol", "document"],
  scene: ["scene", "situation", "workflow", "context", "story", "こと", "シーン", "状況", "業務フロー", "利用シーン"],
  シーン: ["シーン", "scene", "situation", "workflow", "context", "story"],
  裁判所: ["裁判所", "court"],
  court: ["court", "裁判所"],
  black: ["black", "黒", "ブラック"],
  white: ["white", "白", "ホワイト"],
};

const sortOptions = [
  { label: "Recommended", value: "recommended" },
  { label: "Updated", value: "updatedDesc" },
  { label: "Name", value: "nameAsc" },
];

const assetClickStorageKey = "brand-asset-portal.click-counts.v1";
const rawAssets = rawAssetIndex as RawAsset[];

const BrandAssetPortal = () => {
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [sort, setSort] = useState("recommended");
  const [showDeprecated, setShowDeprecated] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Brand[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<FileFormat[]>([]);
  const [paneOpen, setPaneOpen] = useState(true);
  const [paneType, setPaneType] = useState<PaneType>("filters");
  const [modalAssetId, setModalAssetId] = useState<string | null>(null);
  const [assetClickCounts, setAssetClickCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(assetClickStorageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        setAssetClickCounts(parsed as Record<string, number>);
      }
    } catch {
      // Ignore localStorage failures.
    }
  }, []);

  const assets = useMemo(() => rawAssets.map(makeAsset).filter(isDisplayableAsset), []);

  const filteredAssets = useMemo(
    () =>
      assets.filter((asset) => {
        if (!showArchived && asset.status === "archived") return false;
        if (!showDeprecated && asset.status === "deprecated") return false;
        if (selectedProducts.length > 0 && !selectedProducts.includes(asset.brand)) return false;
        if (selectedFormats.length > 0 && !selectedFormats.includes(asset.fileFormat)) return false;
        if (!query.trim()) return true;
        return matchesQuery(asset, query);
      }),
    [assets, query, selectedFormats, selectedProducts, showArchived, showDeprecated],
  );

  const visibleGroups = useMemo(() => buildDisplayGroups(sortAssets(filteredAssets, sort)), [filteredAssets, sort]);
  const recommendationGroups = useMemo(
    () => buildDisplayGroups(getRecommendationAssets(filteredAssets, assetClickCounts)).slice(0, 8),
    [assetClickCounts, filteredAssets],
  );

  const selectedAsset = useMemo(
    () => (modalAssetId ? (assets.find((asset) => asset.id === modalAssetId) ?? null) : null),
    [assets, modalAssetId],
  );

  const modalGroupAssets = useMemo(
    () => (selectedAsset ? getGroupAssets(assets, selectedAsset) : []),
    [assets, selectedAsset],
  );
  const modalSelectedAsset = modalGroupAssets.find((asset) => asset.id === modalAssetId) ?? modalGroupAssets[0] ?? null;
  const modalVersionChain = modalSelectedAsset ? getVersionChain(assets, modalSelectedAsset) : [];

  const activeFilterCount =
    selectedProducts.length +
    selectedFormats.length +
    Number(showArchived) +
    Number(showDeprecated) +
    Number(Boolean(query.trim()));
  const isSearching = Boolean(query.trim()) || selectedProducts.length > 0 || selectedFormats.length > 0;
  const featuredAssetCount = assets.filter((asset) => asset.recommended && asset.status === "current").length;

  const activeChips = [
    ...selectedProducts.map((product) => ({
      label: `プロダクト: ${product}`,
      onClear: () => setSelectedProducts((current) => current.filter((value) => value !== product)),
    })),
    ...selectedFormats.map((format) => ({
      label: `ファイル形式: ${format}`,
      onClear: () => setSelectedFormats((current) => current.filter((value) => value !== format)),
    })),
    ...(query.trim()
      ? [
          {
            label: `検索: ${query.trim()}`,
            onClear: () => setQuery(""),
          },
        ]
      : []),
    ...(showDeprecated
      ? [
          {
            label: "Deprecated表示",
            onClear: () => setShowDeprecated(false),
          },
        ]
      : []),
    ...(showArchived
      ? [
          {
            label: "Archived表示",
            onClear: () => setShowArchived(false),
          },
        ]
      : []),
  ];

  const handleSelectPane = (nextPane: PaneType) => {
    if (paneOpen && paneType === nextPane) {
      setPaneOpen(false);
      return;
    }
    setPaneType(nextPane);
    setPaneOpen(true);
  };

  const openGroup = (group: DisplayGroup) => {
    const preferred = getPreferredModalAsset(group);
    recordAssetClick(preferred.id, assetClickCounts, setAssetClickCounts);
    setModalAssetId(preferred.id);
  };

  const resetAll = () => {
    setQuery("");
    setSort("recommended");
    setShowDeprecated(false);
    setShowArchived(false);
    setSelectedProducts([]);
    setSelectedFormats([]);
  };

  const handleDownload = (asset: Asset | null) => {
    if (!asset?.driveId) return;
    recordAssetClick(asset.id, assetClickCounts, setAssetClickCounts);
    const anchor = document.createElement("a");
    anchor.href = getDownloadUrl(asset);
    anchor.download = sanitizeFilename(asset.title, asset.fileFormat);
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const handleOpenDrive = (asset: Asset | null) => {
    if (!asset) return;
    recordAssetClick(asset.id, assetClickCounts, setAssetClickCounts);
    window.open(getDriveOpenUrl(asset), "_blank", "noopener,noreferrer");
  };

  return (
    <PageLayout>
      <PageLayoutSidebar position="start">
        <SideNavigation aria-label="Brand Asset Portal navigation">
          <SideNavigation.Group>
            <SideNavigation.Item
              icon={LfMagnifyingGlass}
              aria-current={paneOpen && paneType === "discover" ? true : undefined}
              onClick={() => handleSelectPane("discover")}
            >
              Discover
            </SideNavigation.Item>
            <SideNavigation.Item
              icon={LfFilter}
              aria-current={paneOpen && paneType === "filters" ? true : undefined}
              onClick={() => handleSelectPane("filters")}
            >
              Filters
            </SideNavigation.Item>
            <SideNavigation.Item
              icon={LfFolder}
              aria-current={paneOpen && paneType === "collections" ? true : undefined}
              onClick={() => handleSelectPane("collections")}
            >
              Collections
            </SideNavigation.Item>
          </SideNavigation.Group>
        </SideNavigation>
      </PageLayoutSidebar>

      <PageLayoutPane position="start" width="medium" resizable open={paneOpen}>
        <PageLayoutHeader>
          <ContentHeader
            size="medium"
            action={
              <Tooltip title="Close">
                <IconButton variant="plain" size="small" aria-label="Close pane" onClick={() => setPaneOpen(false)}>
                  <Icon>
                    <LfCloseLarge />
                  </Icon>
                </IconButton>
              </Tooltip>
            }
          >
            <ContentHeaderTitle>
              {paneType === "discover" ? "Discover" : paneType === "filters" ? "Filters" : "Collections"}
            </ContentHeaderTitle>
            <ContentHeaderDescription>
              {paneType === "discover"
                ? "検索のコツとおすすめの導線をまとめています。"
                : paneType === "filters"
                  ? "プロダクト、形式、公開状態をここで切り替えます。"
                  : "ブランド単位の入口として、主要コレクションへ素早く移動できます。"}
            </ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          {paneType === "discover" && (
            <div className={styles.paneBody}>
              <Card>
                <CardHeader>
                  <Text variant="title.xSmall">人気の入口</Text>
                </CardHeader>
                <CardBody>
                  <div className={styles.chipsRow}>
                    {popularSearches.slice(0, 8).map((keyword) => (
                      <button
                        key={keyword}
                        type="button"
                        className={styles.chipButton}
                        onClick={() => setQuery(keyword)}
                      >
                        {keyword}
                      </button>
                    ))}
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <Text variant="title.xSmall">検索のヒント</Text>
                </CardHeader>
                <CardBody className={styles.paneStatList}>
                  <Text variant="body.small" color="subtle">
                    日本語・英語の同義語検索に対応しています。たとえば `logo` と `ロゴ`、`guideline` と `ガイドライン`
                    は同じように検索できます。
                  </Text>
                  <Text variant="body.small" color="subtle">
                    結果カードはファミリー単位でまとめられ、PNG があればモーダルの初期選択は PNG になります。
                  </Text>
                </CardBody>
              </Card>
            </div>
          )}

          {paneType === "filters" && (
            <div className={styles.paneBody}>
              <div className={styles.filterGroup}>
                <Text variant="label.medium">プロダクト</Text>
                {filterGroups.product.map((brand) => (
                  <Checkbox
                    key={brand}
                    checked={selectedProducts.includes(brand)}
                    onChange={(event) =>
                      setSelectedProducts((current) =>
                        event.target.checked ? [...current, brand] : current.filter((value) => value !== brand),
                      )
                    }
                  >
                    {brand}
                  </Checkbox>
                ))}
              </div>

              <div className={styles.filterGroup}>
                <Text variant="label.medium">ファイル形式</Text>
                {filterGroups.fileFormat.map((format) => (
                  <Checkbox
                    key={format}
                    checked={selectedFormats.includes(format)}
                    onChange={(event) =>
                      setSelectedFormats((current) =>
                        event.target.checked ? [...current, format] : current.filter((value) => value !== format),
                      )
                    }
                  >
                    {format}
                  </Checkbox>
                ))}
              </div>

              <div className={styles.filterGroup}>
                <Text variant="label.medium">公開状態</Text>
                <Checkbox checked={showDeprecated} onChange={(event) => setShowDeprecated(event.target.checked)}>
                  Deprecatedを表示
                </Checkbox>
                <Checkbox checked={showArchived} onChange={(event) => setShowArchived(event.target.checked)}>
                  Archivedを表示
                </Checkbox>
              </div>

              <ButtonGroup>
                <Button variant="plain" onClick={resetAll}>
                  リセット
                </Button>
              </ButtonGroup>
            </div>
          )}

          {paneType === "collections" && (
            <div className={styles.paneBody}>
              <Card>
                <CardHeader>
                  <Text variant="title.xSmall">ブランド別のアセット数</Text>
                </CardHeader>
                <CardBody className={styles.paneStatList}>
                  {filterGroups.product.map((brand) => {
                    const count = assets.filter((asset) => asset.brand === brand).length;
                    return (
                      <div key={brand} className={styles.paneStat}>
                        <Text variant="body.small">{brand}</Text>
                        <Text variant="label.small">{count} assets</Text>
                      </div>
                    );
                  })}
                </CardBody>
              </Card>

              <div className={styles.brandQuickList}>
                {filterGroups.product.map((brand) => (
                  <Button
                    key={brand}
                    variant="subtle"
                    onClick={() => {
                      setSelectedProducts([brand]);
                      setPaneType("filters");
                    }}
                    className={styles.brandQuickButton}
                  >
                    {brand}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </PageLayoutBody>
      </PageLayoutPane>

      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Brand Asset Portal</ContentHeaderTitle>
            <ContentHeaderDescription>
              Aegis の `With Sidebar and Pane (Start)` をベースに再構築した、ブランドアセット検索ポータルです。
            </ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>

        <PageLayoutBody className={styles.pageBody}>
          <Card className={styles.heroCard}>
            <CardBody>
              <Text variant="title.large">Search and retrieve brand-ready assets from one place.</Text>
              <Text as="p" variant="body.medium" color="subtle" style={{ marginTop: "var(--aegis-space-small)" }}>
                ロゴ、ガイドライン、テンプレート、3D、モーションまで、プロダクト横断で探せる社内向けブランド
                ポータルです。
              </Text>

              <div className={styles.heroStats}>
                <div className={styles.heroStat}>
                  <Text variant="label.small" color="subtle">
                    Total assets
                  </Text>
                  <Text variant="title.medium">{assets.length}</Text>
                </div>
                <div className={styles.heroStat}>
                  <Text variant="label.small" color="subtle">
                    Featured assets
                  </Text>
                  <Text variant="title.medium">{featuredAssetCount}</Text>
                </div>
                <div className={styles.heroStat}>
                  <Text variant="label.small" color="subtle">
                    Active filters
                  </Text>
                  <Text variant="title.medium">{activeFilterCount}</Text>
                </div>
              </div>

              <div className={styles.heroActions}>
                <Button onClick={() => handleSelectPane("filters")} leading={LfFilter}>
                  フィルターを開く
                </Button>
                <Button variant="plain" onClick={resetAll}>
                  条件をリセット
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className={styles.searchPanel}>
              <div className={styles.searchRow}>
                <TextField
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={searchFocused ? "" : "例：ロゴ / ガイドライン / ProfessionalAI / 3D"}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  leading={
                    <Icon>
                      <LfMagnifyingGlass />
                    </Icon>
                  }
                />
                <Select options={sortOptions} value={sort} onChange={setSort} aria-label="Sort results" />
                <Button variant="plain" onClick={resetAll}>
                  Clear
                </Button>
              </div>

              <div className={styles.chipsRow}>
                {popularSearches.map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    className={`${styles.chipButton} ${query === keyword ? styles.chipButtonActive : ""}`}
                    onClick={() => setQuery(keyword)}
                  >
                    {keyword}
                  </button>
                ))}
              </div>

              {activeChips.length > 0 && (
                <div className={styles.chipsRow}>
                  {activeChips.map((chip) => (
                    <span key={chip.label} className={styles.activeChip}>
                      {chip.label}
                      <button type="button" onClick={chip.onClear} aria-label={`${chip.label} を解除`}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className={styles.summaryRow}>
                <Text variant="body.small" color="subtle">
                  {buildSummaryText({
                    count: visibleGroups.length,
                    sort,
                    showDeprecated,
                    showArchived,
                    filters: activeFilterCount,
                  })}
                </Text>
                <Text variant="label.small">{visibleGroups.length} grouped results</Text>
              </div>
            </CardBody>
          </Card>

          {!isSearching && recommendationGroups.length > 0 && (
            <section className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <div>
                  <Text variant="title.medium">Recommended assets</Text>
                  <Text variant="body.small" color="subtle">
                    利用履歴と更新日のバランスで表示しています。
                  </Text>
                </div>
              </div>
              <div className={styles.assetGrid}>
                {recommendationGroups.map((group) => (
                  <AssetCard key={group.id} group={group} compact onOpen={() => openGroup(group)} />
                ))}
              </div>
            </section>
          )}

          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div>
                <Text variant="title.medium">{isSearching ? "Search results" : "All assets"}</Text>
                <Text variant="body.small" color="subtle">
                  同一ファミリーの派生ファイルは1枚のカードにまとめています。
                </Text>
              </div>
            </div>

            {visibleGroups.length > 0 ? (
              <div className={styles.assetGrid}>
                {visibleGroups.map((group) => (
                  <AssetCard key={group.id} group={group} onOpen={() => openGroup(group)} />
                ))}
              </div>
            ) : (
              <Card className={styles.emptyPanel}>
                <EmptyState title="条件に一致するアセットが見つかりません">
                  <Text>検索語やフィルター条件を少し広げると候補が見つかる可能性があります。</Text>
                  <div style={{ marginTop: "var(--aegis-space-medium)" }}>
                    <Button variant="plain" onClick={resetAll}>
                      条件をリセット
                    </Button>
                  </div>
                </EmptyState>
              </Card>
            )}
          </section>
        </PageLayoutBody>
      </PageLayoutContent>

      <Dialog open={Boolean(modalSelectedAsset)} onOpenChange={(open) => !open && setModalAssetId(null)}>
        <DialogContent width="large">
          {modalSelectedAsset && (
            <>
              <DialogHeader>
                <ContentHeader>
                  <ContentHeaderTitle>{modalSelectedAsset.title}</ContentHeaderTitle>
                  <ContentHeaderDescription>
                    {modalSelectedAsset.brand} / {modalSelectedAsset.assetType} / {modalSelectedAsset.locale}
                  </ContentHeaderDescription>
                </ContentHeader>
              </DialogHeader>

              <DialogBody>
                <div className={styles.dialogLayout}>
                  <div className={styles.previewCard}>
                    <div
                      className={styles.previewVisual}
                      style={{ ["--brand-color" as string]: brandMeta[modalSelectedAsset.brand].color }}
                    >
                      {renderVisual(modalSelectedAsset, "preview")}
                    </div>
                    <div className={styles.previewBody}>
                      <div className={styles.badgeRow}>
                        <Tag size="small">{modalSelectedAsset.brand}</Tag>
                        <Tag size="small" variant="outline">
                          {modalSelectedAsset.fileFormat}
                        </Tag>
                        <Tag size="small" variant="outline">
                          {statusMeta[modalSelectedAsset.status].label}
                        </Tag>
                      </div>

                      <Text as="p" variant="body.medium">
                        {modalSelectedAsset.description || "詳細情報はこのアセットのメタデータから確認できます。"}
                      </Text>

                      <div className={styles.previewMetaGrid}>
                        {buildModalMeta(modalSelectedAsset).map(([label, value]) => (
                          <div key={label} className={styles.metaCard}>
                            <Text variant="label.small" color="subtle">
                              {label}
                            </Text>
                            <Text variant="body.small">{value}</Text>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {modalSelectedAsset.status === "deprecated" && (
                    <Banner color="warning" title="Deprecated / 使用非推奨">
                      {modalSelectedAsset.replacedBy
                        ? `代替候補: ${assets.find((asset) => asset.id === modalSelectedAsset.replacedBy)?.title ?? "推奨アセット"}`
                        : "誤使用を避けるため、代替アセットがある場合はそちらを優先してください。"}
                    </Banner>
                  )}

                  <div className={styles.bannerActions}>
                    <Button
                      leading={LfDownload}
                      disabled={!modalSelectedAsset.driveId}
                      onClick={() => handleDownload(modalSelectedAsset)}
                    >
                      Direct download
                    </Button>
                    <Button
                      variant="plain"
                      leading={LfArrowUpRightFromSquare}
                      onClick={() => handleOpenDrive(modalSelectedAsset)}
                    >
                      Open in Google Drive
                    </Button>
                  </div>

                  <div className={styles.filterGroup}>
                    <Text variant="label.medium">Format</Text>
                    <Select
                      options={modalGroupAssets.map((asset) => ({
                        label: `${asset.fileFormat} · ${getVariantLabel(asset)}${asset.status === "deprecated" ? " (deprecated)" : ""}`,
                        value: asset.id,
                      }))}
                      value={modalSelectedAsset.id}
                      onChange={setModalAssetId}
                      aria-label="Select asset variant"
                    />
                  </div>

                  <div className={styles.filterGroup}>
                    <Text variant="label.medium">Variants</Text>
                    <div className={styles.variantGrid}>
                      {modalGroupAssets.map((asset) => (
                        <button
                          key={asset.id}
                          type="button"
                          className={`${styles.variantButton} ${asset.id === modalSelectedAsset.id ? styles.variantButtonActive : ""}`}
                          onClick={() => setModalAssetId(asset.id)}
                        >
                          <Text variant="body.small.bold">
                            {asset.fileFormat} · {getVariantLabel(asset)}
                          </Text>
                          <Text as="p" variant="body.small" color="subtle">
                            {asset.title}
                          </Text>
                          <Text as="p" variant="label.small" color="subtle">
                            {statusMeta[asset.status].label} / {asset.locale}
                          </Text>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.filterGroup}>
                    <Text variant="label.medium">Version history</Text>
                    <div className={styles.variantGrid}>
                      {modalVersionChain.length > 1 ? (
                        modalVersionChain.map((asset, index) => (
                          <button
                            key={asset.id}
                            type="button"
                            className={styles.variantButton}
                            onClick={() => setModalAssetId(asset.id)}
                          >
                            <Text variant="label.small" color="subtle">
                              #{modalVersionChain.length - index}
                            </Text>
                            <Text variant="body.small.bold">{asset.title}</Text>
                            <Text as="p" variant="body.small" color="subtle">
                              {asset.fileFormat} · {statusMeta[asset.status].label} · {formatDate(asset.updatedAt)}
                            </Text>
                          </button>
                        ))
                      ) : (
                        <Card>
                          <CardBody>
                            <Text variant="body.small" color="subtle">
                              このアセットにはバージョン履歴がありません。
                            </Text>
                          </CardBody>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              </DialogBody>

              <DialogFooter>
                <ButtonGroup>
                  <Button variant="plain" onClick={() => setModalAssetId(null)}>
                    閉じる
                  </Button>
                </ButtonGroup>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

function AssetCard({ group, compact = false, onOpen }: { group: DisplayGroup; compact?: boolean; onOpen: () => void }) {
  const asset = group.representative;

  return (
    <button type="button" className={`${styles.assetCard} ${compact ? styles.assetCardCompact : ""}`} onClick={onOpen}>
      <div className={styles.thumb} style={{ ["--brand-color" as string]: brandMeta[asset.brand].color }}>
        <div className={styles.badgeRow}>
          <Tag size="small">{asset.recommended ? "Recommended" : statusMeta[asset.status].label}</Tag>
          <Tag size="small" variant="outline">
            {buildFormatBadgeLabel(group.fileFormats)}
          </Tag>
        </div>

        <div className={styles.thumbVisual}>{renderGroupVisual(group)}</div>

        <div className={styles.thumbCaption}>
          <span>{group.colorLabels.join(" / ")}</span>
          <span>{group.variantCount} variants</span>
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardHeader}>
          <div className={styles.titleWrap}>
            <div className={styles.eyebrow}>
              <span>{asset.brand}</span>
              <span>{asset.assetType}</span>
            </div>
            <Text variant="title.xSmall">{group.title}</Text>
          </div>
          <Tag size="small" variant="outline">
            {statusMeta[asset.status].label}
          </Tag>
        </div>

        <Text as="p" variant="body.small" color="subtle">
          {getCardSummary(group)}
        </Text>

        <div className={styles.detailList}>
          <div className={styles.detailItem}>
            <Text variant="label.small" color="subtle">
              Formats
            </Text>
            <Text variant="body.small">{group.fileFormats.join(" / ")}</Text>
          </div>
          <div className={styles.detailItem}>
            <Text variant="label.small" color="subtle">
              Colors
            </Text>
            <Text variant="body.small">{group.colorLabels.join(" / ")}</Text>
          </div>
          <div className={styles.detailItem}>
            <Text variant="label.small" color="subtle">
              Updated
            </Text>
            <Text variant="body.small">{formatDate(group.updatedAt)}</Text>
          </div>
        </div>

        <div className={styles.metaFooter}>
          <Text variant="label.small" color="subtle">
            {group.localeLabel} · {group.variantCount} variants
          </Text>
          <div className={styles.pillList}>
            {asset.usage.slice(0, 3).map((usage) => (
              <Tag key={usage} size="small" variant="outline">
                {usage}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}

function renderGroupVisual(group: DisplayGroup) {
  if (group.fileFormats.length <= 1) {
    return renderVisual(group.representative, "thumb");
  }

  return (
    <div className={styles.thumbMulti}>
      <div className={styles.thumbMultiInner}>
        <div className={styles.thumbMarkRow}>
          {group.fileFormats.map((format) => (
            <span key={format} className={styles.formatMark} style={{ background: getFormatColor(format) }}>
              {format}
            </span>
          ))}
        </div>
        <div className={styles.thumbKind}>{getThumbnailKindLabel(group.representative.assetType)}</div>
        <div className={styles.thumbBrand}>{group.representative.brand}</div>
      </div>
    </div>
  );
}

function renderVisual(asset: Asset, mode: "thumb" | "preview") {
  const thumbnailUrl = getThumbnailUrl(asset);
  if (thumbnailUrl) {
    return (
      <img
        className={styles.thumbImage}
        src={thumbnailUrl}
        alt={asset.title}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div className={styles.thumbFallback}>
      <div className={styles.thumbFallbackInner}>
        <div className={styles.thumbMarkRow}>
          <span className={styles.formatMark} style={{ background: getFormatColor(asset.fileFormat) }}>
            {asset.fileFormat}
          </span>
        </div>
        <div className={styles.thumbKind}>{getThumbnailKindLabel(asset.assetType)}</div>
        <div className={styles.thumbBrand}>{mode === "preview" ? asset.title : asset.brand}</div>
      </div>
    </div>
  );
}

function makeAsset(data: RawAsset): Asset {
  const driveId = data.driveId || extractDriveIdFromUrl(data.driveUrl || "") || "";
  const illustrationCategory = getIllustrationCategoryInfo(data.assetType);
  const assetType = illustrationCategory?.display || data.assetType;
  const browseUrl = getBrandBrowseUrl(data.brand, assetType, data.locale || "Global");
  const driveUrl = data.driveUrl && !isDriveSearchUrl(data.driveUrl) ? data.driveUrl : browseUrl;
  const colorVariant = data.colorVariant || inferColorVariant(data.title);
  const tags = uniqueValues([...(data.tags || []), ...(illustrationCategory?.tags || [])]);

  return {
    ...data,
    usage: data.usage || [],
    tags,
    locale: data.locale || "Global",
    assetType,
    driveId,
    driveUrl: driveId ? `https://drive.google.com/file/d/${driveId}/view?usp=drivesdk` : driveUrl,
    allowBrowseOnly: Boolean(data.allowBrowseOnly),
    thumbnailUrl: data.thumbnailUrl || (driveId ? getDriveThumbnailUrl(driveId) : ""),
    downloadUrl: data.downloadUrl || (driveId ? getDownloadUrlFromId(driveId) : ""),
    colorVariant,
  };
}

function getIllustrationCategoryInfo(assetType: string) {
  const normalizedType = normalize(String(assetType || ""));
  if (!normalizedType) return null;
  return (
    Object.values(illustrationCategoryMeta).find((category) =>
      category.matchers.some((matcher) => normalizedType.includes(normalize(matcher))),
    ) ?? null
  );
}

function isDisplayableAsset(asset: Asset) {
  return Boolean(asset.driveId || (asset.allowBrowseOnly && asset.driveUrl && !isDriveSearchUrl(asset.driveUrl)));
}

function buildDisplayGroups(list: Asset[]) {
  const grouped = new Map<string, Asset[]>();
  list.forEach((asset) => {
    const key = getAssetFamilyKey(asset) || asset.id;
    const current = grouped.get(key);
    if (current) {
      current.push(asset);
    } else {
      grouped.set(key, [asset]);
    }
  });

  return [...grouped.values()].map((variants) => makeDisplayGroup(variants));
}

function makeDisplayGroup(variants: Asset[]): DisplayGroup {
  const representative = variants[0];
  const fileFormats = uniqueValues(variants.map((asset) => asset.fileFormat));
  const colorLabels = uniqueValues(variants.map((asset) => getVariantLabel(asset)));
  const locales = uniqueValues(variants.map((asset) => asset.locale));
  const updatedAt = variants.reduce(
    (latest, asset) => (dateValue(asset.updatedAt) > dateValue(latest) ? asset.updatedAt : latest),
    representative.updatedAt,
  );

  return {
    id: getAssetFamilyKey(representative) || representative.id,
    representative,
    variants,
    title: representative.title,
    fileFormats,
    colorLabels,
    variantCount: variants.length,
    localeLabel: locales.join(" / "),
    updatedAt,
  };
}

function getAssetFamilyKey(asset: Asset) {
  if (asset.assetType === "ロゴ") {
    return [asset.brand, asset.assetType, normalizeLogoFamily(asset.title, asset.brand)].join("::");
  }
  return asset.assetGroupId || asset.id;
}

function getGroupAssets(assets: Asset[], asset: Asset) {
  const familyKey = getAssetFamilyKey(asset);
  return assets
    .filter((item) => getAssetFamilyKey(item) === familyKey)
    .sort((a, b) => {
      const aRank = statusRank(a.status);
      const bRank = statusRank(b.status);
      if (aRank !== bRank) return aRank - bRank;
      if (a.fileFormat !== b.fileFormat) return a.fileFormat.localeCompare(b.fileFormat);
      const aColorRank = colorVariantRank(a.colorVariant);
      const bColorRank = colorVariantRank(b.colorVariant);
      if (aColorRank !== bColorRank) return aColorRank - bColorRank;
      return dateValue(b.updatedAt) - dateValue(a.updatedAt);
    });
}

function getVersionChain(assets: Asset[], asset: Asset) {
  const chain = [asset];
  const seen = new Set([asset.id]);
  let cursor = asset.previousVersionId ? (assets.find((item) => item.id === asset.previousVersionId) ?? null) : null;
  while (cursor && !seen.has(cursor.id)) {
    chain.push(cursor);
    seen.add(cursor.id);
    const previousVersionId = cursor.previousVersionId;
    cursor = previousVersionId ? (assets.find((item) => item.id === previousVersionId) ?? null) : null;
  }
  return chain;
}

function sortAssets(list: Asset[], sort: string) {
  const sorted = [...list];
  const comparator = {
    recommended: (a: Asset, b: Asset) => {
      const aScore = Number(a.recommended && a.status === "current");
      const bScore = Number(b.recommended && b.status === "current");
      if (aScore !== bScore) return bScore - aScore;
      return dateValue(b.updatedAt) - dateValue(a.updatedAt);
    },
    updatedDesc: (a: Asset, b: Asset) => dateValue(b.updatedAt) - dateValue(a.updatedAt),
    nameAsc: (a: Asset, b: Asset) => a.title.localeCompare(b.title, "ja"),
  }[sort] as (a: Asset, b: Asset) => number;

  sorted.sort((a, b) => {
    const result = comparator(a, b);
    if (result !== 0) return result;
    return a.title.localeCompare(b.title, "ja");
  });

  return sorted;
}

function getRecommendationAssets(filtered: Asset[], clickCounts: Record<string, number>) {
  return [...filtered]
    .filter((asset) => asset.recommended && asset.status === "current")
    .sort((a, b) => {
      const clickDiff = Number(clickCounts[b.id] ?? 0) - Number(clickCounts[a.id] ?? 0);
      if (clickDiff !== 0) return clickDiff;
      const updatedDiff = dateValue(b.updatedAt) - dateValue(a.updatedAt);
      if (updatedDiff !== 0) return updatedDiff;
      return a.title.localeCompare(b.title, "ja");
    });
}

function matchesQuery(asset: Asset, query: string) {
  const normalized = normalize(query);
  const tokens = normalized.split(/\s+/).filter(Boolean);
  const haystack = normalizeSearchText(
    [
      asset.title,
      asset.brand,
      asset.fileFormat,
      asset.assetType,
      asset.locale,
      asset.status,
      asset.description || "",
      asset.recommended ? "recommended" : "",
      asset.usage.join(" "),
      asset.tags.join(" "),
    ].join(" "),
  );

  return tokens.every((token) => {
    const variants = expandSearchToken(token);
    return variants.some((variant) => haystack.includes(variant));
  });
}

function normalize(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSearchText(value: string) {
  return normalize(value).concat(" ", normalize(buildSearchAliasText(value)));
}

function buildSearchAliasText(value: string) {
  const normalized = normalize(value);
  const extraTerms: string[] = [];

  Object.entries(searchAliases).forEach(([key, aliases]) => {
    if (normalized.includes(key)) {
      extraTerms.push(...aliases);
    }
    aliases.forEach((alias) => {
      if (normalized.includes(normalize(alias))) {
        extraTerms.push(key);
        extraTerms.push(...aliases);
      }
    });
  });

  return extraTerms.join(" ");
}

function expandSearchToken(token: string) {
  const variants = new Set([token]);
  const aliases = searchAliases[token] ?? [];
  aliases.forEach((alias) => {
    variants.add(normalize(alias));
  });
  return [...variants].filter(Boolean);
}

function normalizeLogoFamily(title: string, brand: string) {
  return normalize(String(title || ""))
    .replace(new RegExp(normalize(brand), "g"), " ")
    .replace(/\(v[0-9]+\)/g, " ")
    .replace(/\b(color|black|white|bk|bgink|rgb|green|main|bgblack|bgcolor|background|light|dark)\b/g, " ")
    .replace(/\b(png|jpg|jpeg|svg|ai|pdf)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueValues<T>(values: T[]) {
  return [...new Set(values.filter(Boolean))];
}

function inferColorVariant(title: string) {
  const normalized = normalize(String(title || ""));
  if (/(^| )(white|wh)( |$)/.test(normalized)) return "white";
  if (/(^| )(black|bk|bgink)( |$)/.test(normalized)) return "black";
  return "color";
}

function getColorVariantLabel(asset: Asset) {
  return (
    {
      color: "Color",
      black: "Black",
      white: "White",
    }[String(asset.colorVariant || inferColorVariant(asset.title)).toLowerCase()] ?? "Color"
  );
}

function getVariantLabel(asset: Asset) {
  return asset.variantLabel || getColorVariantLabel(asset);
}

function getPreferredModalAsset(group: DisplayGroup) {
  return group.variants.find((asset) => asset.fileFormat === "PNG") ?? group.representative;
}

function getCardSummary(group: DisplayGroup) {
  if (group.variantCount > 1) {
    return `${group.fileFormats.join(" / ")} · ${group.colorLabels.join(" / ")} · ${group.variantCount} variants`;
  }
  if (group.representative.description) return truncateText(group.representative.description, 120);
  if (group.representative.usage.length > 0) return truncateText(group.representative.usage.join(" / "), 120);
  return "詳細情報はモーダルで確認できます";
}

function truncateText(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1).trimEnd()}…` : value;
}

function buildFormatBadgeLabel(formats: string[]) {
  if (formats.length <= 2) return formats.join(" / ");
  return `${formats.slice(0, 2).join(" / ")} +${formats.length - 2}`;
}

function getThumbnailKindLabel(assetType: string) {
  const illustrationCategory = getIllustrationCategoryInfo(assetType);
  if (illustrationCategory) return illustrationCategory.thumbnail;
  const labels: Record<string, string> = {
    ロゴ: "LOGO",
    ガイドライン: "GUIDE",
    営業資料素材: "MATERIAL",
    モーション: "MOTION",
    テンプレート: "TEMPLATE",
    "3D Visual": "3D VISUAL",
  };
  return labels[assetType] ?? "ASSET";
}

function getFormatColor(fileFormat: string) {
  return (
    {
      PNG: "#3f7ecf",
      SVG: "#039373",
      PDF: "#d34638",
      AI: "#9a5fc0",
      PSD: "#c44d7b",
      PPT: "#8f6329",
      MP4: "#c15d1e",
      JPG: "#7b6bd0",
    }[fileFormat] ?? "#3f7ecf"
  );
}

function extractDriveIdFromUrl(url: string) {
  if (!url) return "";
  const fileMatch = url.match(/\/file\/d\/([^/]+)\//);
  if (fileMatch) return fileMatch[1];
  const queryMatch = url.match(/[?&]id=([^&]+)/);
  if (queryMatch) return decodeURIComponent(queryMatch[1]);
  return "";
}

function getDriveThumbnailUrl(driveId: string) {
  return `https://drive.google.com/thumbnail?id=${encodeURIComponent(driveId)}&sz=w1000`;
}

function getDownloadUrlFromId(driveId: string) {
  return `https://drive.usercontent.google.com/u/0/uc?id=${encodeURIComponent(driveId)}&export=download`;
}

function getDownloadUrl(asset: Asset) {
  return asset.driveId ? getDownloadUrlFromId(asset.driveId) : asset.downloadUrl;
}

function getThumbnailUrl(asset: Asset) {
  return asset.thumbnailUrl;
}

function getBrandDriveUrl(brand: Brand, locale: string) {
  const roots = brandDriveRoots[brand] as { global: string; jp?: string; us?: string };
  if (locale === "JP" && roots.jp) return roots.jp;
  if ((locale === "US" || locale === "EU") && roots.us) return roots.us;
  return roots.global;
}

function getBrandBrowseUrl(brand: Brand, assetType: string, locale: string) {
  const routes = brandBrowseFolders[brand] as { default: string; logo?: string };
  if (assetType === "ロゴ" && routes.logo) return routes.logo;
  return routes.default ?? getBrandDriveUrl(brand, locale);
}

function getDriveOpenUrl(asset: Asset) {
  if (asset.driveId) return `https://drive.google.com/file/d/${encodeURIComponent(asset.driveId)}/view?usp=drivesdk`;
  if (asset.driveUrl && !isDriveSearchUrl(asset.driveUrl)) return asset.driveUrl;
  return getBrandBrowseUrl(asset.brand, asset.assetType, asset.locale);
}

function isDriveSearchUrl(url: string) {
  return typeof url === "string" && url.includes("drive.google.com/drive/search");
}

function buildModalMeta(asset: Asset) {
  return [
    ["Brand", asset.brand],
    ["Format", asset.fileFormat],
    ["Variant", getVariantLabel(asset)],
    ["Asset type", asset.assetType],
    ["Usage", asset.usage.join(" / ") || "—"],
    ["Tags", asset.tags.join(" / ") || "—"],
    ["Locale", asset.locale],
    ["Updated", formatDate(asset.updatedAt)],
  ];
}

function statusRank(status: AssetStatus) {
  return (
    {
      current: 0,
      deprecated: 1,
      archived: 2,
    }[status] ?? 3
  );
}

function colorVariantRank(colorVariant: string) {
  return (
    {
      color: 0,
      black: 1,
      white: 2,
    }[String(colorVariant || "").toLowerCase()] ?? 3
  );
}

function dateValue(value: string) {
  return new Date(value).getTime();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function sanitizeFilename(title: string, format: string) {
  return `${title.replace(/[\\/:*?"<>|]+/g, "_")}.${format.toLowerCase()}`;
}

function recordAssetClick(
  assetId: string,
  clickCounts: Record<string, number>,
  setClickCounts: Dispatch<SetStateAction<Record<string, number>>>,
) {
  const next = {
    ...clickCounts,
    [assetId]: Number(clickCounts[assetId] ?? 0) + 1,
  };
  setClickCounts(next);
  try {
    window.localStorage.setItem(assetClickStorageKey, JSON.stringify(next));
  } catch {
    // Ignore localStorage failures.
  }
}

function buildSummaryText({
  count,
  sort,
  showDeprecated,
  showArchived,
  filters,
}: {
  count: number;
  sort: string;
  showDeprecated: boolean;
  showArchived: boolean;
  filters: number;
}) {
  const parts: string[] = [];
  if (sort === "recommended") parts.push("推奨優先");
  if (sort === "updatedDesc") parts.push("更新日順");
  if (sort === "nameAsc") parts.push("名前順");
  const base = parts.length > 0 ? parts.join(" / ") : "全件表示";
  const visibility = [
    showDeprecated ? "Deprecated表示" : "Deprecated非表示",
    showArchived ? "Archived表示" : "Archived非表示",
  ].join(" / ");
  return `${base} · ${filters}フィルタ · ${visibility} · ${count}件`;
}

export default BrandAssetPortal;
