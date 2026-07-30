var e=`import * as AegisIcons from "@legalforce/aegis-icons";
import { LfArrowUpRightFromSquare, LfDownload } from "@legalforce/aegis-icons";
import { LegalOnLogoLight } from "@legalforce/aegis-logos/react";
import {
  Banner,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardLink,
  Checkbox,
  CheckboxGroup,
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
  DescriptionList,
  DescriptionListDetail,
  DescriptionListItem,
  DescriptionListTerm,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  EmptyState,
  FormControl,
  Header,
  Logo,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutPane,
  PageLayoutStickyContainer,
  Search,
  Select,
  Tag,
  TagGroup,
  TagLink,
  Text,
  Toolbar,
  ToolbarSpacer,
} from "@legalforce/aegis-react";
import {
  type ComponentType,
  type CSSProperties,
  type Dispatch,
  type SetStateAction,
  type SVGProps,
  useEffect,
  useMemo,
  useState,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import rawAssetPopularity from "./asset-popularity.json";
import rawAssetIndex from "./assets-index.json";
import styles from "./index.module.css";
import rawLocalMirrorManifest from "./local-mirror-manifest.json";

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
type Brand = "LegalOn" | "GovernOn" | "WorkOn" | "DealOn" | "LearningOn" | "DocumentOn" | "On Technologies" | "Shared";

const sharedIconExclusionTitles = new Set([
  "Academy01",
  "Academy02",
  "Assistant",
  "Beginer",
  "Checklists",
  "DataBase",
  "Ellipsis",
  "English",
  "ErrorPrevention",
  "Factory",
  "FilePP",
  "Finance",
  "FolderControl",
  "FolderDL",
  "FolderUP",
  "Japanese_01",
  "Japanese_02",
  "Lightbulb",
  "LinkContracts",
  "Lists01",
  "Lists02",
  "Management",
  "NodeCircleSparkle",
  "PCAnalizing",
  "PCnote",
  "RelatedContracts",
  "Seminar",
  "Settings",
  "StampedContracts",
  "Technology",
  "UserComment",
  "Utilization",
  "Value",
  "Version",
  "Vision",
  "Warehouse",
  "WorkIP",
  "WorkPatent",
]);

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

type LocalMirrorManifestEntry = {
  mirrored: boolean;
  sourceDriveId: string;
  downloadPath: string;
  thumbnailPath: string;
  fileName: string;
  fileFormat: string;
};

type GoogleTokenResponse = {
  access_token: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
  scope?: string;
};

type GoogleTokenClient = {
  callback: ((response: GoogleTokenResponse) => void) | null;
  requestAccessToken: (overrideConfig?: { prompt?: string; scope?: string }) => void;
};

type GoogleIdentityServices = {
  accounts: {
    oauth2: {
      initTokenClient: (config: {
        client_id: string;
        scope: string;
        callback: (response: GoogleTokenResponse) => void;
      }) => GoogleTokenClient;
    };
  };
};

const localMirrorManifest = rawLocalMirrorManifest as Record<string, LocalMirrorManifestEntry>;
const assetPopularity = rawAssetPopularity as Record<string, number>;

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
  deprecated: { label: "非推奨" },
  archived: { label: "アーカイブ済み" },
};

const brandMeta: Record<Brand, { label: Brand; color: string; summary: string }> = {
  LegalOn: { label: "LegalOn", color: "#d34638", summary: "コアブランドのロゴ、ガイドライン、テンプレート群" },
  GovernOn: { label: "GovernOn", color: "#039373", summary: "GovernOn向けブランドアセット" },
  WorkOn: { label: "WorkOn", color: "#7b6bd0", summary: "WorkOn の運用・採用・営業向け素材" },
  DealOn: { label: "DealOn", color: "#c15d1e", summary: "DealOn の案件訴求・提案用素材" },
  LearningOn: { label: "LearningOn", color: "#0b8db8", summary: "LearningOn 向けブランドアセット" },
  DocumentOn: { label: "DocumentOn", color: "#0f766e", summary: "DocumentOn 向けブランドアセット" },
  "On Technologies": {
    label: "On Technologies",
    color: "#101828",
    summary: "On Technologies 向けコーポレートロゴ素材",
  },
  Shared: { label: "Shared", color: "#667085", summary: "共有アセットとして扱う横断アイコン群" },
};

const filterGroups = {
  product: [
    "LegalOn",
    "GovernOn",
    "WorkOn",
    "DealOn",
    "LearningOn",
    "DocumentOn",
    "On Technologies",
    "Shared",
  ] as Brand[],
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
  "motion",
  "pptx",
  "デフォルメUI",
  "イラスト",
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
  LearningOn: {
    global: "https://drive.google.com/drive/folders/17fyHlXC9_VEmy2f5Kwe4K9qfA6qhGaXO",
  },
  DocumentOn: {
    global: "https://drive.google.com/drive/folders/13u94A6zQ86R2cKmpY8YFAWLlnjwUmoLm",
  },
  "On Technologies": {
    global: "https://drive.google.com/drive/folders/1ZNnSvajnG5jjmDkAPDIuuUDWTvM98G1b",
  },
  Shared: {
    global: "https://drive.google.com/drive/folders/1_nMlrRo_7NEza-pZauFtObagTwOmQD_B",
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
  LearningOn: {
    default: "https://drive.google.com/drive/folders/17fyHlXC9_VEmy2f5Kwe4K9qfA6qhGaXO",
    logo: "https://drive.google.com/drive/folders/1dAKtf7uvtpHvT0q2GnF17SUrhHBjLFbx",
  },
  DocumentOn: {
    default: "https://drive.google.com/drive/folders/13u94A6zQ86R2cKmpY8YFAWLlnjwUmoLm",
    logo: "https://drive.google.com/drive/folders/1L1f28GW6T0B_o_J_-GF9VLZ9AvodCi6g",
  },
  "On Technologies": {
    default: "https://drive.google.com/drive/folders/1ZNnSvajnG5jjmDkAPDIuuUDWTvM98G1b",
    logo: "https://drive.google.com/drive/folders/1ZNnSvajnG5jjmDkAPDIuuUDWTvM98G1b",
  },
  Shared: {
    default: "https://drive.google.com/drive/folders/1_nMlrRo_7NEza-pZauFtObagTwOmQD_B",
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

const relatedTagTerms: Record<string, string[]> = {
  書籍: ["本", "book", "books", "資料"],
  本: ["書籍", "book", "books"],
  book: ["書籍", "本", "books"],
  books: ["書籍", "本", "book"],
  チャート: ["グラフ", "chart", "charts", "graph", "graphs"],
  グラフ: ["チャート", "chart", "charts", "graph", "graphs"],
  chart: ["チャート", "グラフ", "charts", "graph", "graphs"],
  charts: ["チャート", "グラフ", "chart", "graph", "graphs"],
  資料: ["document", "documents", "ドキュメント"],
  ドキュメント: ["document", "documents", "資料"],
  guideline: ["ガイドライン", "規定", "ルール"],
  ガイドライン: ["guideline", "規定", "ルール"],
};

const searchAliases: Record<string, string[]> = {
  デフォルメui: ["デフォルメui", "デフォルメ ui", "deformed ui"],
  デフォルメ: ["デフォルメ"],
  検索機能: ["検索機能", "検索機能 png"],
  検索画面: ["検索画面"],
  法令: ["法令"],
  書籍: ["書籍", "本", "book", "books", "資料"],
  本: ["本", "書籍", "book", "books", "資料"],
  book: ["book", "books", "書籍", "本", "資料"],
  books: ["books", "book", "書籍", "本", "資料"],
  チャート: ["チャート", "グラフ", "chart", "charts", "graph", "graphs"],
  グラフ: ["グラフ", "チャート", "chart", "charts", "graph", "graphs"],
  chart: ["chart", "charts", "graph", "graphs", "チャート", "グラフ"],
  charts: ["charts", "chart", "graph", "graphs", "チャート", "グラフ"],
  graph: ["graph", "graphs", "chart", "charts", "グラフ", "チャート"],
  graphs: ["graphs", "graph", "chart", "charts", "グラフ", "チャート"],
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
  { label: "おすすめ順", value: "recommended" },
  { label: "更新日順", value: "updatedDesc" },
  { label: "名前順", value: "nameAsc" },
];

const assetClickStorageKey = "brand-asset-portal.click-counts.v1";
const rawAssets = rawAssetIndex as RawAsset[];
const googleDriveClientId = import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID?.trim() ?? "";
const googleDriveReadonlyScope = "https://www.googleapis.com/auth/drive.readonly";
const googleIdentityServicesScriptUrl = "https://accounts.google.com/gsi/client";
let googleIdentityServicesPromise: Promise<GoogleIdentityServices> | null = null;
let googleDriveTokenClientPromise: Promise<GoogleTokenClient> | null = null;
let googleDriveTokenResponse: GoogleTokenResponse | null = null;
let googleDriveTokenExpiresAt = 0;

const BrandAssetPortal = () => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recommended");
  const [showDeprecated, setShowDeprecated] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Brand[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<FileFormat[]>([]);
  const [modalAssetId, setModalAssetId] = useState<string | null>(null);
  const [assetClickCounts, setAssetClickCounts] = useState<Record<string, number>>({});
  const [bulkDownloading, setBulkDownloading] = useState(false);
  const [pendingBulkPlan, setPendingBulkPlan] = useState<BulkDownloadPlan | null>(null);
  const [bulkDownloadNotice, setBulkDownloadNotice] = useState<BulkDownloadNotice | null>(null);

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

  useEffect(() => {
    void loadGoogleIdentityServices();
  }, []);

  const assets = useMemo(() => rawAssets.map(makeAsset).filter(isDisplayableAsset), []);

  const assetGroups = useMemo(() => buildDisplayGroups(assets), [assets]);
  const visibleGroups = useMemo(
    () =>
      sortDisplayGroups(
        assetGroups.filter((group) =>
          matchesGroupFilters(group, {
            query,
            selectedFormats,
            selectedProducts,
            showArchived,
            showDeprecated,
          }),
        ),
        sort,
        assetClickCounts,
      ),
    [assetGroups, query, selectedFormats, selectedProducts, showArchived, showDeprecated, sort, assetClickCounts],
  );
  const recommendationGroups = useMemo(
    () => getRecommendationGroups(visibleGroups, assetClickCounts).slice(0, 8),
    [assetClickCounts, visibleGroups],
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
  const modalDeprecatedFallbackAsset = useMemo(
    () => (modalSelectedAsset ? getDeprecatedDismissTarget(assets, modalSelectedAsset) : null),
    [assets, modalSelectedAsset],
  );
  const modalVersionChain = modalSelectedAsset ? getVersionChain(assets, modalSelectedAsset) : [];

  const isSearching = Boolean(query.trim()) || selectedProducts.length > 0 || selectedFormats.length > 0;
  const brandAssetCounts = useMemo(
    () =>
      Object.fromEntries(
        filterGroups.product.map((brand) => [brand, assets.filter((asset) => asset.brand === brand).length]),
      ) as Record<Brand, number>,
    [assets],
  );

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

  const handleDownload = async (asset: Asset | null) => {
    if (!asset) return;
    recordAssetClick(asset.id, assetClickCounts, setAssetClickCounts);

    if (canGenerateSharedIconDownload(asset)) {
      await downloadGeneratedSharedIcon(asset);
      return;
    }

    if (!asset.driveId) return;
    triggerFileDownload(getDownloadUrl(asset), getAssetDownloadName(asset));
  };

  const handleBulkDownload = async () => {
    if (visibleGroups.length === 0) return;

    setBulkDownloading(true);
    try {
      setBulkDownloadNotice(null);
      const accessToken = await requestGoogleDriveAccessToken();
      const plan = await buildBulkDownloadPlan(visibleGroups, accessToken);
      if (plan.candidates.length === 0) {
        setBulkDownloadNotice({
          color: plan.failedDriveAssetCount > 0 ? "danger" : "warning",
          title:
            plan.failedDriveAssetCount > 0
              ? "Google Drive からアセットを取得できません"
              : "ZIP にまとめられるファイルがありません",
          body:
            plan.failedDriveAssetCount > 0
              ? \`現在の検索結果では \${plan.attemptedAssetCount} 件の Drive アセットを確認しましたが、すべて取得できませんでした。Google Drive 連携に使用したアカウントのアクセス権と共有設定を確認してください。\`
              : "現在の検索結果には、Google Drive から取得可能な current アセットがありません。",
        });
        return;
      }
      if (plan.requiresConfirmation) {
        setPendingBulkPlan(plan);
        return;
      }
      await executeBulkDownloadPlan(plan, accessToken, setBulkDownloadNotice);
    } catch (error) {
      setBulkDownloadNotice({
        color: "danger",
        title: "一括ダウンロードの準備に失敗しました",
        body: error instanceof Error ? error.message : "Google Drive との接続に失敗しました。",
      });
    } finally {
      setBulkDownloading(false);
    }
  };

  const handleConfirmBulkDownload = async () => {
    if (!pendingBulkPlan) return;
    setPendingBulkPlan(null);
    setBulkDownloading(true);
    try {
      const accessToken = await requestGoogleDriveAccessToken();
      await executeBulkDownloadPlan(pendingBulkPlan, accessToken, setBulkDownloadNotice);
    } catch (error) {
      setBulkDownloadNotice({
        color: "danger",
        title: "ZIP を作成できませんでした",
        body: error instanceof Error ? error.message : "Google Drive からの取得に失敗しました。",
      });
    } finally {
      setBulkDownloading(false);
    }
  };

  const handleOpenDrive = (asset: Asset | null) => {
    if (!asset) return;
    recordAssetClick(asset.id, assetClickCounts, setAssetClickCounts);
    window.open(getDriveOpenUrl(asset), "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Header className={styles.globalHeader}>
        <ContentHeader
          size="small"
          leading={
            <Logo size="medium" aria-hidden="true">
              <LegalOnLogoLight />
            </Logo>
          }
        >
          <ContentHeaderTitle as="h1">
            <Text as="span" variant="title.medium">
              Brand Asset Portal
            </Text>
          </ContentHeaderTitle>
          <ContentHeaderDescription>
            ロゴ、ガイドライン、テンプレート、3D、モーションまで、プロダクト横断で探せる社内向けブランド ポータルです。
          </ContentHeaderDescription>
        </ContentHeader>
      </Header>

      <PageLayout className={styles.pageShell}>
        <PageLayoutPane position="start" width="medium" open>
          <PageLayoutBody className={styles.paneBody}>
            <ContentHeader
              size="small"
              trailing={
                <Button size="small" variant="subtle" onClick={resetAll}>
                  条件をクリア
                </Button>
              }
            >
              <ContentHeaderTitle>フィルター</ContentHeaderTitle>
            </ContentHeader>
            <FormControl>
              <FormControl.Label>プロダクト / ブランド</FormControl.Label>
              <CheckboxGroup>
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
                    <DescriptionList size="small">
                      <DescriptionListItem orientation="horizontal">
                        <DescriptionListTerm width="medium">
                          <Text as="span" variant="body.medium">
                            {brand === "Shared" ? "プロダクト共通" : brand}
                          </Text>
                        </DescriptionListTerm>
                        <DescriptionListDetail>
                          <Text as="span" variant="body.small" color="subtle">
                            {brandAssetCounts[brand]}件
                          </Text>
                        </DescriptionListDetail>
                      </DescriptionListItem>
                    </DescriptionList>
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </FormControl>

            <FormControl>
              <FormControl.Label>ファイル形式</FormControl.Label>
              <CheckboxGroup>
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
                    <Text as="span" variant="body.medium">
                      {format}
                    </Text>
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </FormControl>

            <FormControl>
              <FormControl.Label>公開状態</FormControl.Label>
              <CheckboxGroup>
                <Checkbox checked={showDeprecated} onChange={(event) => setShowDeprecated(event.target.checked)}>
                  <Text as="span" variant="body.medium">
                    非推奨を表示
                  </Text>
                </Checkbox>
                <Checkbox checked={showArchived} onChange={(event) => setShowArchived(event.target.checked)}>
                  <Text as="span" variant="body.medium">
                    アーカイブ済みを表示
                  </Text>
                </Checkbox>
              </CheckboxGroup>
            </FormControl>
          </PageLayoutBody>
        </PageLayoutPane>

        <PageLayoutContent>
          <PageLayoutBody className={styles.pageBody}>
            <PageLayoutStickyContainer className={styles.searchSticky}>
              <Toolbar className={styles.searchRow}>
                <Search
                  className={styles.searchField}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="例：ロゴ / ガイドライン / ProfessionalAI / 3D"
                />
                <Select options={sortOptions} value={sort} onChange={setSort} aria-label="並び順" />
              </Toolbar>
            </PageLayoutStickyContainer>

            <Toolbar>
              <Text variant="label.medium" color="subtle" whiteSpace="nowrap">
                キーワード
              </Text>
              <TagGroup>
                {popularSearches.map((keyword) => (
                  <Tag
                    key={keyword}
                    size="small"
                    variant={query === keyword ? "fill" : "outline"}
                    color={query === keyword ? "blue" : "neutral"}
                  >
                    <TagLink asChild>
                      <button type="button" aria-pressed={query === keyword} onClick={() => setQuery(keyword)}>
                        {keyword}
                      </button>
                    </TagLink>
                  </Tag>
                ))}
              </TagGroup>
            </Toolbar>

            {!isSearching && recommendationGroups.length > 0 && (
              <section className={styles.assetSection}>
                <ContentHeader
                  size="small"
                  trailing={<Text variant="label.small">{recommendationGroups.length}件の結果</Text>}
                >
                  <ContentHeaderTitle as="h2">
                    <Text as="span" variant="title.medium">
                      おすすめ
                    </Text>
                  </ContentHeaderTitle>
                </ContentHeader>
                <div className={styles.assetGrid}>
                  {recommendationGroups.map((group) => (
                    <AssetCard
                      key={group.id}
                      group={group}
                      onOpen={() => openGroup(group)}
                      onDirectDownload={(asset) => void handleDownload(asset)}
                    />
                  ))}
                </div>
              </section>
            )}

            <section className={styles.assetSection}>
              <ContentHeader
                size="small"
                trailing={
                  <Toolbar>
                    <Text variant="label.small">{visibleGroups.length}件の結果</Text>
                    <Button
                      size="small"
                      leading={LfDownload}
                      disabled={visibleGroups.length === 0 || bulkDownloading}
                      onClick={() => void handleBulkDownload()}
                    >
                      一括ダウンロード
                    </Button>
                  </Toolbar>
                }
              >
                <ContentHeaderTitle as="h2">
                  <Text as="span" variant="title.medium">
                    {isSearching ? "検索結果" : "All assets"}
                  </Text>
                </ContentHeaderTitle>
              </ContentHeader>

              {bulkDownloadNotice && (
                <Banner
                  color={bulkDownloadNotice.color}
                  title={bulkDownloadNotice.title}
                  onClose={() => setBulkDownloadNotice(null)}
                >
                  <Text variant="body.small">{bulkDownloadNotice.body}</Text>
                </Banner>
              )}

              {visibleGroups.length > 0 ? (
                <div className={styles.assetGrid}>
                  {visibleGroups.map((group) => (
                    <AssetCard
                      key={group.id}
                      group={group}
                      onOpen={() => openGroup(group)}
                      onDirectDownload={(asset) => void handleDownload(asset)}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardBody>
                    <EmptyState title="条件に一致するアセットが見つかりません">
                      <Text>検索語やフィルター条件を少し広げると候補が見つかる可能性があります。</Text>
                      <Button variant="subtle" onClick={resetAll}>
                        条件をクリア
                      </Button>
                    </EmptyState>
                  </CardBody>
                </Card>
              )}
            </section>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>

      <Dialog
        open={Boolean(modalSelectedAsset)}
        closeOnOutsidePress
        onOpenChange={(open) => !open && setModalAssetId(null)}
      >
        <DialogContent width="xLarge">
          {modalSelectedAsset && (
            <>
              <DialogHeader>
                <ContentHeader>
                  <ContentHeaderTitle>{modalSelectedAsset.title}</ContentHeaderTitle>
                </ContentHeader>

                <FormControl>
                  <FormControl.Label>ファイル形式 / カラー</FormControl.Label>
                  <Select
                    options={modalGroupAssets.map((asset) => ({
                      label: \`\${asset.fileFormat} · \${getVariantLabel(asset)}\${asset.status === "deprecated" ? " (deprecated)" : ""}\`,
                      value: asset.id,
                    }))}
                    value={modalSelectedAsset.id}
                    onChange={setModalAssetId}
                    aria-label="Select asset format"
                  />
                </FormControl>
              </DialogHeader>

              <DialogBody>
                <div className={styles.dialogLayout}>
                  <Card size="small">
                    <CardBody className={styles.previewCardBody}>
                      <div
                        className={styles.previewVisual}
                        style={{
                          ["--brand-color" as string]: brandMeta[modalSelectedAsset.brand].color,
                          ...getVisualSurfaceStyle(modalSelectedAsset),
                        }}
                      >
                        {renderVisual(modalSelectedAsset, "preview")}
                      </div>
                      <div className={styles.previewBody}>
                        <TagGroup>
                          <Tag size="small">{modalSelectedAsset.brand}</Tag>
                          <Tag size="small" variant="outline">
                            {modalSelectedAsset.fileFormat}
                          </Tag>
                          <Tag size="small" variant="outline">
                            {statusMeta[modalSelectedAsset.status].label}
                          </Tag>
                        </TagGroup>

                        <Text as="p" variant="body.medium">
                          {modalSelectedAsset.description || "詳細情報はこのアセットのメタデータから確認できます。"}
                        </Text>

                        <DescriptionList size="small">
                          {buildModalMeta(modalSelectedAsset).map(({ label, value }) => (
                            <DescriptionListItem key={label} orientation="horizontal">
                              <DescriptionListTerm width="medium">
                                <Text variant="title.xxSmall">{label}</Text>
                              </DescriptionListTerm>
                              <DescriptionListDetail>{renderModalMetaValue(value)}</DescriptionListDetail>
                            </DescriptionListItem>
                          ))}
                        </DescriptionList>
                      </div>
                    </CardBody>
                  </Card>

                  {modalSelectedAsset.status === "deprecated" && (
                    <Banner
                      color="warning"
                      title="非推奨 / 使用非推奨"
                      onClose={() => {
                        if (modalDeprecatedFallbackAsset) {
                          setModalAssetId(modalDeprecatedFallbackAsset.id);
                        }
                      }}
                    >
                      {modalSelectedAsset.replacedBy
                        ? \`代替候補: \${assets.find((asset) => asset.id === modalSelectedAsset.replacedBy)?.title ?? "推奨アセット"}\`
                        : "誤使用を避けるため、代替アセットがある場合はそちらを優先してください。"}
                    </Banner>
                  )}

                  <Card size="small">
                    <CardHeader>
                      <Text variant="title.xSmall">Version history</Text>
                    </CardHeader>
                    <CardBody>
                      {modalVersionChain.length > 1 ? (
                        modalVersionChain.map((asset, index) => (
                          <Button
                            key={asset.id}
                            variant="subtle"
                            width="full"
                            className={styles.variantButton}
                            onClick={() => setModalAssetId(asset.id)}
                          >
                            <DescriptionList size="small" bordered>
                              <DescriptionListItem orientation="horizontal">
                                <DescriptionListTerm width="small">Version</DescriptionListTerm>
                                <DescriptionListDetail>#{modalVersionChain.length - index}</DescriptionListDetail>
                              </DescriptionListItem>
                              <DescriptionListItem orientation="horizontal">
                                <DescriptionListTerm width="small">Title</DescriptionListTerm>
                                <DescriptionListDetail>{asset.title}</DescriptionListDetail>
                              </DescriptionListItem>
                              <DescriptionListItem orientation="horizontal">
                                <DescriptionListTerm width="small">Info</DescriptionListTerm>
                                <DescriptionListDetail>
                                  {asset.fileFormat} · {statusMeta[asset.status].label} · {formatDate(asset.updatedAt)}
                                </DescriptionListDetail>
                              </DescriptionListItem>
                            </DescriptionList>
                          </Button>
                        ))
                      ) : (
                        <Text variant="body.small" color="subtle">
                          このアセットにはバージョン履歴がありません。
                        </Text>
                      )}
                    </CardBody>
                  </Card>
                </div>
              </DialogBody>

              <DialogFooter>
                <Toolbar>
                  <ButtonGroup>
                    <Button
                      variant="subtle"
                      leading={LfDownload}
                      disabled={!canDownloadAsset(modalSelectedAsset)}
                      onClick={() => void handleDownload(modalSelectedAsset)}
                    >
                      Direct download
                    </Button>
                    <Button
                      variant="subtle"
                      leading={LfArrowUpRightFromSquare}
                      onClick={() => handleOpenDrive(modalSelectedAsset)}
                    >
                      Open in Google Drive
                    </Button>
                  </ButtonGroup>
                  <ToolbarSpacer />
                  <ButtonGroup>
                    <Button variant="plain" onClick={() => setModalAssetId(null)}>
                      閉じる
                    </Button>
                  </ButtonGroup>
                </Toolbar>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(pendingBulkPlan)} onOpenChange={(open) => !open && setPendingBulkPlan(null)}>
        <DialogContent width="large">
          {pendingBulkPlan && (
            <>
              <DialogHeader>
                <ContentHeader>
                  <ContentHeaderTitle>一括ダウンロードの確認</ContentHeaderTitle>
                  <ContentHeaderDescription>
                    検索結果の代表カードに紐づく current アセットを、Google Drive から取得して ZIP にまとめます。
                  </ContentHeaderDescription>
                </ContentHeader>
              </DialogHeader>
              <DialogBody>
                <DescriptionList size="small">
                  <DescriptionListItem orientation="horizontal">
                    <DescriptionListTerm width="medium">対象カード</DescriptionListTerm>
                    <DescriptionListDetail>{pendingBulkPlan.eligibleGroups}件</DescriptionListDetail>
                  </DescriptionListItem>
                  <DescriptionListItem orientation="horizontal">
                    <DescriptionListTerm width="medium">ZIP 対象ファイル</DescriptionListTerm>
                    <DescriptionListDetail>{pendingBulkPlan.candidates.length}件</DescriptionListDetail>
                  </DescriptionListItem>
                  <DescriptionListItem orientation="horizontal">
                    <DescriptionListTerm width="medium">推定サイズ</DescriptionListTerm>
                    <DescriptionListDetail>{formatFileSize(pendingBulkPlan.totalBytes)}</DescriptionListDetail>
                  </DescriptionListItem>
                  <DescriptionListItem orientation="horizontal">
                    <DescriptionListTerm width="medium">除外カード</DescriptionListTerm>
                    <DescriptionListDetail>{pendingBulkPlan.skippedGroups}件</DescriptionListDetail>
                  </DescriptionListItem>
                </DescriptionList>

                <Banner color="warning" closeButton={false}>
                  <Text variant="body.small">
                    {[
                      pendingBulkPlan.exceedsGroupLimit
                        ? \`対象カード数が上限の \${bulkDownloadGroupLimit} 件を超えています。\`
                        : null,
                      pendingBulkPlan.exceedsSizeLimit
                        ? \`推定サイズが上限の \${formatFileSize(bulkDownloadSizeLimitBytes)} を超えています。\`
                        : null,
                      "このまま続行すると、処理に時間がかかる場合があります。",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  </Text>
                </Banner>
              </DialogBody>
              <DialogFooter>
                <Toolbar>
                  <ToolbarSpacer />
                  <ButtonGroup>
                    <Button variant="plain" onClick={() => setPendingBulkPlan(null)}>
                      キャンセル
                    </Button>
                    <Button leading={LfDownload} onClick={() => void handleConfirmBulkDownload()}>
                      続行して ZIP を作成
                    </Button>
                  </ButtonGroup>
                </Toolbar>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

function AssetCard({
  group,
  onOpen,
  onDirectDownload,
}: {
  group: DisplayGroup;
  onOpen: () => void;
  onDirectDownload: (asset: Asset) => void;
}) {
  const asset = group.representative;
  const previewAsset = getPreferredThumbnailAsset(group);
  const directDownloadAsset = getPreferredModalAsset(group);
  const showDirectDownload =
    asset.brand === "Shared" && asset.assetType === "アイコン" && canDownloadAsset(directDownloadAsset);

  return (
    <Card size="small" variant="plain" className={styles.assetCard}>
      <CardLink asChild>
        <button type="button" className={styles.assetCardLink} onClick={onOpen}>
          <div className={styles.thumb} style={{ ["--brand-color" as string]: brandMeta[asset.brand].color }}>
            <div className={styles.thumbVisual} style={getVisualSurfaceStyle(previewAsset)}>
              {renderGroupVisual(group)}
            </div>
          </div>

          <CardHeader className={styles.assetCardHeader}>
            <ContentHeader size="small">
              <ContentHeaderTitle>
                <Text as="span" variant="title.xSmall">
                  {group.title}
                </Text>
              </ContentHeaderTitle>
            </ContentHeader>
          </CardHeader>

          <CardBody className={styles.assetCardBody}>
            <DescriptionList size="small">
              <DescriptionListItem orientation="horizontal">
                <DescriptionListTerm width="small">Formats</DescriptionListTerm>
                <DescriptionListDetail>
                  <TagGroup>
                    {group.fileFormats.map((format) => (
                      <Tag key={format} size="small" variant="fill">
                        {format}
                      </Tag>
                    ))}
                  </TagGroup>
                </DescriptionListDetail>
              </DescriptionListItem>
              <DescriptionListItem orientation="horizontal">
                <DescriptionListTerm width="small">Colors</DescriptionListTerm>
                <DescriptionListDetail>{group.colorLabels.join(" / ")}</DescriptionListDetail>
              </DescriptionListItem>
              <DescriptionListItem orientation="horizontal">
                <DescriptionListTerm width="small">Updated</DescriptionListTerm>
                <DescriptionListDetail>{formatDate(group.updatedAt)}</DescriptionListDetail>
              </DescriptionListItem>
            </DescriptionList>

            <TagGroup>
              {asset.usage.slice(0, 3).map((usage) => (
                <Tag key={usage} size="small" variant="fill">
                  {usage}
                </Tag>
              ))}
            </TagGroup>
          </CardBody>
        </button>
      </CardLink>

      {showDirectDownload ? (
        <CardFooter className={styles.assetCardFooter}>
          <Toolbar>
            <ToolbarSpacer />
            <Button
              size="small"
              leading={LfDownload}
              onClick={(event) => {
                event.stopPropagation();
                onDirectDownload(directDownloadAsset);
              }}
            >
              Download
            </Button>
          </Toolbar>
        </CardFooter>
      ) : null}
    </Card>
  );
}

function renderGroupVisual(group: DisplayGroup) {
  const previewAsset = getPreferredThumbnailAsset(group);
  const fallbackLabel =
    group.representative.assetType === "アイコン" ? group.representative.title : group.representative.brand;
  const SharedIcon = getSharedIconComponent(previewAsset);
  const isIcon = group.representative.assetType === "アイコン";

  if (getThumbnailUrl(previewAsset)) {
    return renderVisual(previewAsset, "thumb");
  }

  if (isIcon && SharedIcon) {
    return (
      <div className={styles.thumbFallback}>
        <div className={styles.thumbFallbackInner}>
          <div className={styles.sharedIconWrap}>
            <SharedIcon className={styles.sharedIconGlyph} />
          </div>
          {!isIcon ? <Text variant="title.small">{fallbackLabel}</Text> : null}
        </div>
      </div>
    );
  }

  if (isIcon) {
    return renderVisual(previewAsset, "thumb");
  }

  if (group.fileFormats.length <= 1) {
    return renderVisual(previewAsset, "thumb");
  }

  return (
    <div className={styles.thumbMulti}>
      <div className={styles.thumbMultiInner}>
        <Toolbar size="small">
          {group.fileFormats.map((format) => (
            <Tag key={format} size="small">
              {format}
            </Tag>
          ))}
        </Toolbar>
        <Text as="span" variant="label.small" color="subtle" className={styles.thumbKind}>
          {getThumbnailKindLabel(group.representative.assetType)}
        </Text>
        <Text variant="title.small">{fallbackLabel}</Text>
      </div>
    </div>
  );
}

function renderVisual(asset: Asset, mode: "thumb" | "preview") {
  const thumbnailUrl = getThumbnailUrl(asset);
  if (thumbnailUrl) {
    return <AssetImage asset={asset} mode={mode} thumbnailUrl={thumbnailUrl} />;
  }

  return renderVisualFallback(asset, mode);
}

function AssetImage({ asset, mode, thumbnailUrl }: { asset: Asset; mode: "thumb" | "preview"; thumbnailUrl: string }) {
  const [failed, setFailed] = useState(false);
  const isSharedIcon = asset.brand === "Shared" && asset.assetType === "アイコン";

  useEffect(() => {
    let disposed = false;
    const image = new Image();

    image.referrerPolicy = "no-referrer";
    image.onload = () => {
      if (!disposed) {
        setFailed(image.naturalWidth === 0);
      }
    };
    image.onerror = () => {
      if (!disposed) {
        setFailed(true);
      }
    };
    image.src = thumbnailUrl;

    return () => {
      disposed = true;
    };
  }, [thumbnailUrl]);

  if (failed) {
    return renderVisualFallback(asset, mode);
  }

  return (
    <img
      className={[
        mode === "preview" ? styles.previewImage : styles.thumbImage,
        isSharedIcon ? (mode === "preview" ? styles.sharedIconImagePreview : styles.sharedIconImage) : "",
      ]
        .filter(Boolean)
        .join(" ")}
      src={thumbnailUrl}
      alt={asset.title}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
}

function renderVisualFallback(asset: Asset, mode: "thumb" | "preview") {
  const fallbackLabel = mode === "preview" || asset.assetType === "アイコン" ? asset.title : asset.brand;
  const SharedIcon = getSharedIconComponent(asset);
  const hideThumbLabel = mode === "thumb" && asset.assetType === "アイコン";

  if (SharedIcon) {
    return (
      <div className={styles.thumbFallback}>
        <div className={styles.thumbFallbackInner}>
          <div className={styles.sharedIconWrap}>
            <SharedIcon className={mode === "preview" ? styles.sharedIconGlyphPreview : styles.sharedIconGlyph} />
          </div>
          {!hideThumbLabel ? <Text variant="title.small">{fallbackLabel}</Text> : null}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.thumbFallback}>
      <div className={styles.thumbFallbackInner}>
        {asset.assetType !== "アイコン" ? (
          <Toolbar size="small">
            <Tag size="small">{asset.fileFormat}</Tag>
          </Toolbar>
        ) : null}
        <Text as="span" variant="label.small" color="subtle" className={styles.thumbKind}>
          {getThumbnailKindLabel(asset.assetType)}
        </Text>
        {!hideThumbLabel ? <Text variant="title.small">{fallbackLabel}</Text> : null}
      </div>
    </div>
  );
}

function getSharedIconComponent(asset: Asset): ComponentType<SVGProps<SVGSVGElement>> | null {
  if (!(asset.brand === "Shared" && asset.assetType === "アイコン")) return null;
  const iconMap = AegisIcons as Record<string, ComponentType<SVGProps<SVGSVGElement>>>;

  const overrides: Record<string, keyof typeof AegisIcons> = {
    "AI Revise": "LfAiSparkles",
    ArrowsRotateAnimated: "LfArrowsRotate",
    ArchiveSparkle: "LfArchive",
    CalenderCheck: "LfCalenderCheck",
    Comparison: "LfComparison",
    Download: "LfDownload",
    FilePP: "LfFilePowerPointColored",
    Mail02: "LfMail",
    Mirge: "LfCombine",
    PCDownload: "LfDownload",
    Prohibited: "LfBan",
    UserNG: "LfUserQuestion",
    UserOK: "LfUserCheck",
    "Writing Sparkles": "LfAiSparkles",
  };

  const directKey = overrides[asset.title] ?? \`Lf\${asset.title.replace(/[^A-Za-z0-9]+/g, "")}\`;
  const exactMatch = iconMap[directKey];
  if (exactMatch) return exactMatch as ComponentType<SVGProps<SVGSVGElement>>;

  const titleWithoutDigits = asset.title.replace(/\\d+/g, "");
  const simplifiedKey = \`Lf\${titleWithoutDigits.replace(/[^A-Za-z0-9]+/g, "")}\`;
  const simplifiedMatch = iconMap[simplifiedKey];
  if (simplifiedMatch) return simplifiedMatch as ComponentType<SVGProps<SVGSVGElement>>;

  return null;
}

function canGenerateSharedIconDownload(asset: Asset) {
  return Boolean(asset.brand === "Shared" && asset.assetType === "アイコン" && getSharedIconComponent(asset));
}

function makeAsset(data: RawAsset): Asset {
  const driveId = data.driveId || extractDriveIdFromUrl(data.driveUrl || "") || "";
  const localMirror = localMirrorManifest[data.id];
  const illustrationCategory = getIllustrationCategoryInfo(data.assetType);
  const assetType = illustrationCategory?.display || data.assetType;
  const isSharedIllustration =
    data.brand === "LegalOn" && (Boolean(illustrationCategory) || data.assetType === "イラスト");
  const brand = isSharedIllustration ? "Shared" : data.brand;
  const browseUrl = getBrandBrowseUrl(data.brand, assetType, data.locale || "Global");
  const driveUrl = data.driveUrl && !isDriveSearchUrl(data.driveUrl) ? data.driveUrl : browseUrl;
  const colorVariant = data.colorVariant || inferColorVariant(data.title);
  const tags = uniqueValues(expandRelatedTagTerms([...(data.tags || []), ...(illustrationCategory?.tags || [])]));
  const mirroredThumbnailUrl =
    localMirror?.mirrored && localMirror.thumbnailPath ? toLocalMirrorUrl(localMirror.thumbnailPath) : "";
  const mirroredDownloadUrl =
    localMirror?.mirrored && localMirror.downloadPath ? toLocalMirrorUrl(localMirror.downloadPath) : "";

  return {
    ...data,
    brand,
    usage: data.usage || [],
    tags,
    locale: data.locale || "Global",
    assetType,
    driveId,
    driveUrl: driveId ? \`https://drive.google.com/file/d/\${driveId}/view?usp=drivesdk\` : driveUrl,
    allowBrowseOnly: Boolean(data.allowBrowseOnly),
    thumbnailUrl: mirroredThumbnailUrl || data.thumbnailUrl || (driveId ? getDriveThumbnailUrl(driveId) : ""),
    downloadUrl: mirroredDownloadUrl || data.downloadUrl || (driveId ? getDownloadUrlFromId(driveId) : ""),
    colorVariant,
  };
}

function expandRelatedTagTerms(tags: string[]) {
  const expanded = new Set(tags.filter(Boolean));

  tags.forEach((tag) => {
    const normalizedTag = normalize(String(tag || ""));
    Object.entries(relatedTagTerms).forEach(([key, aliases]) => {
      if (normalizedTag.includes(normalize(key))) {
        aliases.forEach((alias) => {
          expanded.add(alias);
        });
      }
    });
  });

  return [...expanded];
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
  if (asset.brand === "Shared" && sharedIconExclusionTitles.has(asset.title)) {
    return false;
  }
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
  if (asset.assetType === "イラスト") {
    return asset.id;
  }
  if (getIllustrationCategoryInfo(asset.assetType)) {
    return asset.id;
  }
  if (asset.brand === "LegalOn" && asset.assetType === "3D Visual") {
    return asset.id;
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

function matchesGroupFilters(
  group: DisplayGroup,
  {
    query,
    selectedFormats,
    selectedProducts,
    showArchived,
    showDeprecated,
  }: {
    query: string;
    selectedFormats: FileFormat[];
    selectedProducts: Brand[];
    showArchived: boolean;
    showDeprecated: boolean;
  },
) {
  if (selectedProducts.length > 0 && !selectedProducts.includes(group.representative.brand)) return false;
  if (selectedFormats.length > 0 && !group.variants.some((asset) => selectedFormats.includes(asset.fileFormat))) {
    return false;
  }
  if (
    !group.variants.some((asset) => {
      if (!showArchived && asset.status === "archived") return false;
      if (!showDeprecated && asset.status === "deprecated") return false;
      return true;
    })
  ) {
    return false;
  }
  if (!query.trim()) return true;
  return group.variants.some((asset) => matchesQuery(asset, query));
}

function sortDisplayGroups(groups: DisplayGroup[], sort: string, clickCounts: Record<string, number>) {
  const sorted = [...groups];
  const comparator = {
    recommended: (a: DisplayGroup, b: DisplayGroup) => {
      const aScore = Number(a.variants.some((asset) => asset.recommended && asset.status === "current"));
      const bScore = Number(b.variants.some((asset) => asset.recommended && asset.status === "current"));
      if (aScore !== bScore) return bScore - aScore;
      const popularityDiff = getGroupPopularityScore(b) - getGroupPopularityScore(a);
      if (popularityDiff !== 0) return popularityDiff;
      const clickDiff =
        Number(clickCounts[getPreferredModalAsset(b).id] ?? 0) - Number(clickCounts[getPreferredModalAsset(a).id] ?? 0);
      if (clickDiff !== 0) return clickDiff;
      return dateValue(b.updatedAt) - dateValue(a.updatedAt);
    },
    updatedDesc: (a: DisplayGroup, b: DisplayGroup) => dateValue(b.updatedAt) - dateValue(a.updatedAt),
    nameAsc: (a: DisplayGroup, b: DisplayGroup) => a.title.localeCompare(b.title, "ja"),
  }[sort] as (a: DisplayGroup, b: DisplayGroup) => number;

  sorted.sort((a, b) => {
    const result = comparator(a, b);
    if (result !== 0) return result;
    return a.title.localeCompare(b.title, "ja");
  });

  return sorted;
}

function getRecommendationGroups(groups: DisplayGroup[], clickCounts: Record<string, number>) {
  return [...groups]
    .filter((group) => group.variants.some((asset) => asset.recommended && asset.status === "current"))
    .sort((a, b) => {
      const popularityDiff = getGroupPopularityScore(b) - getGroupPopularityScore(a);
      if (popularityDiff !== 0) return popularityDiff;
      const clickDiff =
        Number(clickCounts[getPreferredModalAsset(b).id] ?? 0) - Number(clickCounts[getPreferredModalAsset(a).id] ?? 0);
      if (clickDiff !== 0) return clickDiff;
      const updatedDiff = dateValue(b.updatedAt) - dateValue(a.updatedAt);
      if (updatedDiff !== 0) return updatedDiff;
      return a.title.localeCompare(b.title, "ja");
    });
}

function getGroupPopularityScore(group: DisplayGroup) {
  return Math.max(...group.variants.map((asset) => Number(assetPopularity[asset.id] ?? 0)), 0);
}

function matchesQuery(asset: Asset, query: string) {
  const normalized = normalize(query);
  const tokens = normalized.split(/\\s+/).filter(Boolean);
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
    .replace(/[^\\p{L}\\p{N}\\s]/gu, " ")
    .replace(/\\s+/g, " ")
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
    .replace(/\\(v[0-9]+\\)/g, " ")
    .replace(/\\b(color|black|white|bk|bgink|rgb|green|main|bgblack|bgcolor|background|light|dark)\\b/g, " ")
    .replace(/\\b(png|jpg|jpeg|svg|ai|pdf)\\b/g, " ")
    .replace(/\\s+/g, " ")
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

function getDeprecatedDismissTarget(assets: Asset[], selectedAsset: Asset) {
  if (selectedAsset.replacedBy) {
    const explicitReplacement = assets.find((asset) => asset.id === selectedAsset.replacedBy);
    if (explicitReplacement) return explicitReplacement;
  }

  const variants = getGroupAssets(assets, selectedAsset);
  const preferredCurrentAsset =
    variants.find((asset) => asset.status === "current" && asset.fileFormat === "PNG") ??
    variants.find((asset) => asset.status === "current" && asset.fileFormat === "SVG") ??
    variants.find((asset) => asset.status === "current" && asset.fileFormat === "JPG") ??
    variants.find((asset) => asset.status === "current");

  return preferredCurrentAsset ?? selectedAsset;
}

function getPreferredThumbnailAsset(group: DisplayGroup) {
  if (group.representative.brand === "Shared" && group.title === "ArrowsRotateAnimated") {
    return (
      group.variants.find((asset) => asset.fileFormat === "PNG" && getThumbnailUrl(asset)) ??
      group.variants.find((asset) => getThumbnailUrl(asset)) ??
      getPreferredModalAsset(group)
    );
  }

  const prioritizedFormats = ["SVG", "PNG", "JPG", "JPEG"];
  const prioritizedColors = ["color", "black", "white"];

  for (const format of prioritizedFormats) {
    for (const color of prioritizedColors) {
      const matched = group.variants.find(
        (asset) =>
          asset.fileFormat === format &&
          String(asset.colorVariant || inferColorVariant(asset.title)).toLowerCase() === color &&
          getThumbnailUrl(asset),
      );
      if (matched) return matched;
    }
  }

  for (const color of prioritizedColors) {
    const matched = group.variants.find(
      (asset) =>
        String(asset.colorVariant || inferColorVariant(asset.title)).toLowerCase() === color && getThumbnailUrl(asset),
    );
    if (matched) return matched;
  }

  return group.variants.find((asset) => getThumbnailUrl(asset)) ?? getPreferredModalAsset(group);
}

function getThumbnailKindLabel(assetType: string) {
  const illustrationCategory = getIllustrationCategoryInfo(assetType);
  if (illustrationCategory) return illustrationCategory.thumbnail;
  const labels: Record<string, string> = {
    アイコン: "ICON",
    ロゴ: "LOGO",
    ガイドライン: "GUIDE",
    営業資料素材: "MATERIAL",
    モーション: "MOTION",
    テンプレート: "TEMPLATE",
    "3D Visual": "3D VISUAL",
  };
  return labels[assetType] ?? "ASSET";
}

function extractDriveIdFromUrl(url: string) {
  if (!url) return "";
  const fileMatch = url.match(/\\/file\\/d\\/([^/]+)\\//);
  if (fileMatch) return fileMatch[1];
  const queryMatch = url.match(/[?&]id=([^&]+)/);
  if (queryMatch) return decodeURIComponent(queryMatch[1]);
  return "";
}

function getDriveThumbnailUrl(driveId: string) {
  return \`https://drive.google.com/thumbnail?id=\${encodeURIComponent(driveId)}&sz=w1000\`;
}

function getDownloadUrlFromId(driveId: string) {
  return \`https://drive.usercontent.google.com/u/0/uc?id=\${encodeURIComponent(driveId)}&export=download\`;
}

function getDownloadUrl(asset: Asset) {
  return asset.downloadUrl || (asset.driveId ? getDownloadUrlFromId(asset.driveId) : "");
}

function canDownloadAsset(asset: Asset | null) {
  if (!asset) return false;
  return Boolean(asset.downloadUrl || asset.driveId || canGenerateSharedIconDownload(asset));
}

function getThumbnailUrl(asset: Asset) {
  return asset.thumbnailUrl;
}

function getVisualSurfaceStyle(asset: Asset): CSSProperties {
  if (String(asset.colorVariant).toLowerCase() === "white") {
    return {
      ["--visual-surface" as string]: "rgba(0, 0, 0, 0.2)",
    };
  }

  return {};
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
  if (asset.driveId) return \`https://drive.google.com/file/d/\${encodeURIComponent(asset.driveId)}/view?usp=drivesdk\`;
  if (asset.driveUrl && !isDriveSearchUrl(asset.driveUrl)) return asset.driveUrl;
  return getBrandBrowseUrl(asset.brand, asset.assetType, asset.locale);
}

function toLocalMirrorUrl(relativePath: string) {
  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : \`\${base}/\`;
  return \`\${normalizedBase}\${relativePath.replace(/^\\/+/, "")}\`;
}

function isDriveSearchUrl(url: string) {
  return typeof url === "string" && url.includes("drive.google.com/drive/search");
}

function getGoogleIdentityServicesGlobal() {
  return (window as Window & { google?: GoogleIdentityServices }).google ?? null;
}

async function loadGoogleIdentityServices() {
  if (getGoogleIdentityServicesGlobal()) {
    return getGoogleIdentityServicesGlobal() as GoogleIdentityServices;
  }

  if (googleIdentityServicesPromise) return googleIdentityServicesPromise;

  googleIdentityServicesPromise = new Promise<GoogleIdentityServices>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      \`script[src="\${googleIdentityServicesScriptUrl}"]\`,
    );

    const handleReady = () => {
      const google = getGoogleIdentityServicesGlobal();
      if (!google) {
        reject(new Error("Google Identity Services の読み込みに失敗しました。"));
        return;
      }
      resolve(google);
    };

    if (existingScript) {
      if (getGoogleIdentityServicesGlobal()) {
        handleReady();
        return;
      }
      existingScript.addEventListener("load", handleReady, { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Google Identity Services のスクリプトを読み込めませんでした。")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = googleIdentityServicesScriptUrl;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", handleReady, { once: true });
    script.addEventListener(
      "error",
      () => reject(new Error("Google Identity Services のスクリプトを読み込めませんでした。")),
      { once: true },
    );
    document.head.appendChild(script);
  });

  return googleIdentityServicesPromise;
}

async function getGoogleDriveTokenClient() {
  if (!googleDriveClientId) {
    throw new Error("Google Drive 連携の Client ID が未設定です。VITE_GOOGLE_DRIVE_CLIENT_ID を設定してください。");
  }

  if (googleDriveTokenClientPromise) return googleDriveTokenClientPromise;

  googleDriveTokenClientPromise = loadGoogleIdentityServices().then((google) =>
    google.accounts.oauth2.initTokenClient({
      client_id: googleDriveClientId,
      scope: googleDriveReadonlyScope,
      callback: () => {
        // callback is assigned per request.
      },
    }),
  );

  return googleDriveTokenClientPromise;
}

function hasValidGoogleDriveToken() {
  return Boolean(googleDriveTokenResponse?.access_token) && googleDriveTokenExpiresAt > Date.now();
}

async function requestGoogleDriveAccessToken() {
  if (hasValidGoogleDriveToken() && googleDriveTokenResponse?.access_token) {
    return googleDriveTokenResponse.access_token;
  }

  const tokenClient = await getGoogleDriveTokenClient();
  return new Promise<string>((resolve, reject) => {
    tokenClient.callback = (response) => {
      if (!response || !response.access_token) {
        reject(new Error("Google Drive のアクセストークンを取得できませんでした。"));
        return;
      }
      if (response.error) {
        reject(new Error(response.error_description || response.error));
        return;
      }

      googleDriveTokenResponse = response;
      googleDriveTokenExpiresAt = Date.now() + Math.max((response.expires_in ?? 0) - 30, 0) * 1000;
      resolve(response.access_token);
    };

    tokenClient.requestAccessToken({
      prompt: googleDriveTokenResponse?.access_token ? "" : "consent",
    });
  });
}

async function fetchGoogleDriveMetadata(accessToken: string, driveId: string) {
  const response = await fetch(
    \`https://www.googleapis.com/drive/v3/files/\${encodeURIComponent(driveId)}?fields=id,name,size,mimeType&supportsAllDrives=true\`,
    {
      headers: { Authorization: \`Bearer \${accessToken}\` },
    },
  );

  if (!response.ok) {
    throw new Error(\`metadata:\${response.status}\`);
  }

  return (await response.json()) as {
    id: string;
    name?: string;
    size?: string;
    mimeType?: string;
  };
}

async function fetchGoogleDriveFileResponse(accessToken: string, driveId: string) {
  return fetch(
    \`https://www.googleapis.com/drive/v3/files/\${encodeURIComponent(driveId)}?alt=media&supportsAllDrives=true\`,
    {
      headers: { Authorization: \`Bearer \${accessToken}\` },
    },
  );
}

function buildModalMeta(asset: Asset) {
  return [
    { label: "プロダクト", value: asset.brand },
    { label: "ファイル名", value: getAssetDownloadName(asset) },
    { label: "ファイル形式", value: asset.fileFormat },
    { label: "バリエーション", value: getVariantLabel(asset) },
    { label: "アセットタイプ", value: asset.assetType },
    { label: "用途", value: asset.usage },
    { label: "タグ", value: asset.tags },
    { label: "地域", value: asset.locale },
    { label: "最終更新日", value: formatDate(asset.updatedAt) },
  ];
}

function renderModalMetaValue(value: string | string[]) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <Text variant="body.small">—</Text>;
    }

    return (
      <TagGroup>
        {value.map((item) => (
          <Tag key={item} size="small">
            {item}
          </Tag>
        ))}
      </TagGroup>
    );
  }

  return <Text variant="body.small">{value || "—"}</Text>;
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
  return \`\${title.replace(/[\\\\/:*?"<>|]+/g, "_")}.\${format.toLowerCase()}\`;
}

function getSharedIconSequence(asset: Asset) {
  const sequence = asset.assetGroupId?.match(/shared-icon-([0-9]+)-/i)?.[1];
  return sequence || asset.id.match(/shared-icon-([0-9]+)-/i)?.[1] || "";
}

function getSharedIconSourceBaseName(asset: Asset) {
  const sequence = getSharedIconSequence(asset);
  if (!sequence) return asset.title;
  return \`\${sequence}_icon_\${asset.title}\`;
}

function getAssetDownloadName(asset: Asset) {
  if (canGenerateSharedIconDownload(asset)) {
    return sanitizeFilename(getSharedIconSourceBaseName(asset), asset.fileFormat);
  }
  return sanitizeFilename(asset.title, asset.fileFormat);
}

function triggerFileDownload(url: string, fileName: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = "noopener noreferrer";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function triggerBlobDownload(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob);
  triggerFileDownload(objectUrl, fileName);
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

type ZipEntry = {
  name: string;
  blob: Blob;
};

type BulkDownloadCandidate = {
  asset: Asset;
  zipPath: string;
  sizeBytes: number;
};

type BulkDownloadPlanApiCandidate = {
  assetId: string;
  driveId: string;
  sizeBytes: number;
};

type BulkDownloadPlan = {
  candidates: BulkDownloadCandidate[];
  totalGroups: number;
  eligibleGroups: number;
  skippedGroups: number;
  totalBytes: number;
  attemptedAssetCount: number;
  failedDriveAssetCount: number;
  requiresConfirmation: boolean;
  exceedsGroupLimit: boolean;
  exceedsSizeLimit: boolean;
};

type BulkDownloadNotice = {
  color: "success" | "warning" | "danger";
  title: string;
  body: string;
};

const bulkDownloadGroupLimit = 100;
const bulkDownloadSizeLimitBytes = 500 * 1024 * 1024;

function getUniqueAssets(assets: Asset[]) {
  const seen = new Set<string>();
  return assets.filter((asset) => {
    if (seen.has(asset.id)) return false;
    seen.add(asset.id);
    return true;
  });
}

function formatZipDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return \`\${year}\${month}\${day}\`;
}

async function buildBulkDownloadPlan(groups: DisplayGroup[], accessToken: string): Promise<BulkDownloadPlan> {
  const eligibleAssetsByGroup = groups.map(getBulkDownloadAssetsForGroup).filter((assets) => assets.length > 0);
  const flattenedAssets = getUniqueAssets(eligibleAssetsByGroup.flat());
  const { candidates: preparedCandidates, failedAssetIds } = await requestBulkDownloadCandidates(
    flattenedAssets,
    accessToken,
  );
  const preparedByAssetId = new Map(preparedCandidates.map((candidate) => [candidate.assetId, candidate] as const));
  const candidates = flattenedAssets.flatMap((asset) => {
    const preparedCandidate = preparedByAssetId.get(asset.id);
    if (!preparedCandidate) return [];
    return [
      {
        asset,
        zipPath: buildBulkZipPath(asset, getAssetDownloadName(asset)),
        sizeBytes: preparedCandidate.sizeBytes,
      },
    ];
  });
  const totalBytes = candidates.reduce((sum, candidate) => sum + candidate.sizeBytes, 0);
  const totalGroups = groups.length;
  const eligibleGroupCount = eligibleAssetsByGroup.filter((assets) =>
    assets.some((asset) => preparedByAssetId.has(asset.id)),
  ).length;

  return {
    candidates,
    totalGroups,
    eligibleGroups: eligibleGroupCount,
    skippedGroups: totalGroups - eligibleGroupCount,
    totalBytes,
    attemptedAssetCount: flattenedAssets.length,
    failedDriveAssetCount: failedAssetIds.length,
    exceedsGroupLimit: eligibleGroupCount > bulkDownloadGroupLimit,
    exceedsSizeLimit: totalBytes > bulkDownloadSizeLimitBytes,
    requiresConfirmation: eligibleGroupCount > bulkDownloadGroupLimit || totalBytes > bulkDownloadSizeLimitBytes,
  };
}

function getBulkDownloadAssetsForGroup(group: DisplayGroup) {
  return getUniqueAssets(
    group.variants.filter(
      (asset) => asset.status === "current" && !asset.allowBrowseOnly && isBulkDownloadEligible(asset),
    ),
  );
}

function isBulkDownloadEligible(asset: Asset) {
  return Boolean(asset.driveId);
}

async function createBulkDownloadEntryWithAccessToken(
  candidate: BulkDownloadCandidate,
  accessToken: string,
): Promise<ZipEntry | null> {
  if (!accessToken || !candidate.asset.driveId) return null;

  const response = await fetchGoogleDriveFileResponse(accessToken, candidate.asset.driveId);
  const blob = await getValidDownloadBlob(response);
  return blob ? { name: candidate.zipPath, blob } : null;
}

async function executeBulkDownloadPlan(
  plan: BulkDownloadPlan,
  accessToken: string,
  setNotice: Dispatch<SetStateAction<BulkDownloadNotice | null>>,
) {
  const settled = await Promise.allSettled(
    plan.candidates.map((candidate) => createBulkDownloadEntryWithAccessToken(candidate, accessToken)),
  );
  const entries = settled
    .flatMap((result) => {
      if (result.status !== "fulfilled" || !result.value) return [];
      return [result.value];
    })
    .filter((entry): entry is ZipEntry => Boolean(entry));
  const failedCount = settled.length - entries.length;

  if (entries.length === 0) {
    setNotice({
      color: "danger",
      title: "ZIP を作成できませんでした",
      body: "対象ファイルを取得できなかったため、一括ダウンロードを完了できませんでした。",
    });
    return;
  }

  const zipBlob = await createZipBlob(dedupeZipEntryNames(entries));
  triggerBlobDownload(zipBlob, \`brand-assets-\${formatZipDate(new Date())}.zip\`);
  setNotice(
    failedCount > 0
      ? {
          color: "warning",
          title: "一括ダウンロードを完了しました",
          body: \`\${entries.length}件を ZIP に追加しました。\${failedCount}件は取得できなかったため除外しています。\`,
        }
      : {
          color: "success",
          title: "一括ダウンロードを完了しました",
          body: \`\${entries.length}件を ZIP にまとめてダウンロードしました。\`,
        },
  );
}

async function getValidDownloadBlob(response: Response) {
  if (!response.ok) return null;

  const contentType = response.headers.get("content-type") ?? "";
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (isHtmlResponse(contentType, bytes)) return null;

  return new Blob([toBlobPart(bytes)], { type: contentType || "application/octet-stream" });
}

function isHtmlResponse(contentType: string, bytes: Uint8Array) {
  if (contentType.toLowerCase().includes("text/html")) {
    return true;
  }

  const prefix = new TextDecoder().decode(bytes.slice(0, 128)).trimStart().toLowerCase();
  return prefix.startsWith("<!doctype html") || prefix.startsWith("<html");
}

function dedupeZipEntryNames(entries: ZipEntry[]) {
  const counts = new Map<string, number>();

  return entries.map((entry) => {
    const count = counts.get(entry.name) ?? 0;
    counts.set(entry.name, count + 1);
    if (count === 0) return entry;

    const extensionIndex = entry.name.lastIndexOf(".");
    const baseName = extensionIndex > 0 ? entry.name.slice(0, extensionIndex) : entry.name;
    const extension = extensionIndex > 0 ? entry.name.slice(extensionIndex) : "";
    return {
      ...entry,
      name: \`\${baseName}-\${count + 1}\${extension}\`,
    };
  });
}

function buildBulkZipPath(asset: Asset, fileName: string) {
  return [
    sanitizeZipPathSegment(asset.brand),
    sanitizeZipPathSegment(asset.assetType),
    sanitizeZipPathSegment(fileName),
  ].join("/");
}

function sanitizeZipPathSegment(value: string) {
  return String(value || "")
    .replace(/[\\\\/:*?"<>|]+/g, "_")
    .replace(/^\\.+$/, "_")
    .trim();
}

function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024 * 1024) return \`\${(bytes / (1024 * 1024 * 1024)).toFixed(1)}GB\`;
  if (bytes >= 1024 * 1024) return \`\${(bytes / (1024 * 1024)).toFixed(1)}MB\`;
  if (bytes >= 1024) return \`\${(bytes / 1024).toFixed(1)}KB\`;
  return \`\${bytes}B\`;
}

async function requestBulkDownloadCandidates(assets: Asset[], accessToken: string) {
  if (assets.length === 0) {
    return {
      candidates: [],
      failedAssetIds: [],
    };
  }

  const settled = await Promise.allSettled(
    assets.map(async (asset): Promise<BulkDownloadPlanApiCandidate> => {
      const metadata = await fetchGoogleDriveMetadata(accessToken, asset.driveId);
      const sizeBytes = Number(metadata.size ?? "");
      return {
        assetId: asset.id,
        driveId: asset.driveId,
        sizeBytes: Number.isFinite(sizeBytes) ? sizeBytes : 0,
      };
    }),
  );

  return {
    candidates: settled.flatMap((result) => (result.status === "fulfilled" ? [result.value] : [])),
    failedAssetIds: settled.flatMap((result, index) =>
      result.status === "rejected" ? [assets[index]?.id].filter((value): value is string => Boolean(value)) : [],
    ),
  };
}

async function createZipBlob(entries: ZipEntry[]) {
  const encoder = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.name);
    const sourceBytes = new Uint8Array(await entry.blob.arrayBuffer());
    const payload = sourceBytes;
    const method = 0;
    const crc = crc32(sourceBytes);
    const dateTime = getDosDateTime(new Date());

    const localHeader = new Uint8Array(30 + nameBytes.length);
    const localView = new DataView(localHeader.buffer);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0, true);
    localView.setUint16(8, method, true);
    localView.setUint16(10, dateTime.time, true);
    localView.setUint16(12, dateTime.date, true);
    localView.setUint32(14, crc, true);
    localView.setUint32(18, payload.length, true);
    localView.setUint32(22, sourceBytes.length, true);
    localView.setUint16(26, nameBytes.length, true);
    localView.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);
    localParts.push(localHeader, payload);

    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(centralHeader.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0, true);
    centralView.setUint16(10, method, true);
    centralView.setUint16(12, dateTime.time, true);
    centralView.setUint16(14, dateTime.date, true);
    centralView.setUint32(16, crc, true);
    centralView.setUint32(20, payload.length, true);
    centralView.setUint32(24, sourceBytes.length, true);
    centralView.setUint16(28, nameBytes.length, true);
    centralView.setUint16(30, 0, true);
    centralView.setUint16(32, 0, true);
    centralView.setUint16(34, 0, true);
    centralView.setUint16(36, 0, true);
    centralView.setUint32(38, 0, true);
    centralView.setUint32(42, offset, true);
    centralHeader.set(nameBytes, 46);
    centralParts.push(centralHeader);

    offset += localHeader.length + payload.length;
  }

  const centralOffset = offset;
  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const endRecord = new Uint8Array(22);
  const endView = new DataView(endRecord.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(4, 0, true);
  endView.setUint16(6, 0, true);
  endView.setUint16(8, entries.length, true);
  endView.setUint16(10, entries.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, centralOffset, true);
  endView.setUint16(20, 0, true);

  return new Blob([...localParts, ...centralParts, endRecord].map(toBlobPart), { type: "application/zip" });
}

function toBlobPart(bytes: Uint8Array) {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function getDosDateTime(date: Date) {
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    date: ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
  };
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;

  for (const byte of bytes) {
    crc ^= byte;
    for (let index = 0; index < 8; index += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function buildSharedIconSvgMarkup(asset: Asset) {
  const SharedIcon = getSharedIconComponent(asset);
  if (!SharedIcon) return null;
  const markup = renderToStaticMarkup(
    <SharedIcon width="512" height="512" style={{ color: "#101828" }} aria-hidden="true" focusable="false" />,
  );
  return markup.includes("xmlns=") ? markup : markup.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
}

function loadImageFromUrl(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("PNG generation failed"));
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }
      reject(new Error("Blob export failed"));
    }, type);
  });
}

async function downloadGeneratedSharedIcon(asset: Asset) {
  const blob = await createGeneratedSharedIconBlob(asset);
  if (!blob) return;
  const fileName = getAssetDownloadName(asset);
  triggerBlobDownload(blob, fileName);
}

async function createGeneratedSharedIconBlob(asset: Asset) {
  const svgMarkup = buildSharedIconSvgMarkup(asset);
  if (!svgMarkup) return null;

  if (asset.fileFormat === "SVG") {
    return new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
  }

  if (asset.fileFormat === "PNG") {
    const svgBlob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    try {
      const image = await loadImageFromUrl(svgUrl);
      const canvas = document.createElement("canvas");
      const size = 512;
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.clearRect(0, 0, size, size);
      context.drawImage(image, 0, 0, size, size);
      return canvasToBlob(canvas, "image/png");
    } finally {
      URL.revokeObjectURL(svgUrl);
    }
  }

  return null;
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

export default BrandAssetPortal;
`;export{e as default};