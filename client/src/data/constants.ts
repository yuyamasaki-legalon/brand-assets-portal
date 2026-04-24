export const FORMAT_LABELS: Record<string, string> = {
  PNG: "PNG", SVG: "SVG", PDF: "PDF", AI: "AI",
  PSD: "PSD", PPT: "PPT", MP4: "MP4", JPG: "JPG",
};

export const STATUS_META: Record<string, { label: string; tone: string; description: string }> = {
  recommended: { label: "Recommended", tone: "recommended", description: "推奨アセット。おすすめセクションで優先表示します。" },
  current: { label: "Current", tone: "current", description: "通常利用してよい最新版です。" },
  deprecated: { label: "Deprecated", tone: "deprecated", description: "非推奨アセットです。代替を優先してください。" },
  archived: { label: "Archived", tone: "archived", description: "保管用です。通常一覧には出しません。" },
};

export const BRAND_META: Record<string, { label: string; color: string }> = {
  LegalOn: { label: "LegalOn", color: "#d34638" },
  GovernOn: { label: "GovernOn", color: "#039373" },
  WorkOn: { label: "WorkOn", color: "#7b6bd0" },
  DealOn: { label: "DealOn", color: "#c15d1e" },
  CXOn: { label: "CXOn", color: "#3f7ecf" },
};

export const BRAND_DRIVE_ROOTS: Record<string, Record<string, string>> = {
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
};

export const BRAND_BROWSE_FOLDERS: Record<string, Record<string, string>> = {
  LegalOn: { default: "https://drive.google.com/drive/folders/1Z67ygGzOb47j1FzI4iIvVnWwlZS8zOeB" },
  GovernOn: { default: "https://drive.google.com/drive/folders/1O7esmFsX-3OOAbIJrYkjwMGuxjjEe_Yv" },
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
};

export const ILLUSTRATION_CATEGORY_META: Record<string, {
  display: string; thumbnail: string; matchers: string[]; tags: string[];
}> = {
  people: {
    display: "ひとイラスト", thumbnail: "PEOPLE",
    matchers: ["ひとイラスト", "people illustrations", "people illustration", "people", "human", "person", "character"],
    tags: ["ひとイラスト", "人物", "人", "ひと", "people", "person", "human", "worker", "user", "persona", "キャラクター", "担当者", "利用者"],
  },
  object: {
    display: "ものイラスト", thumbnail: "OBJECT",
    matchers: ["ものイラスト", "object illustrations", "object illustration", "object", "tool", "device", "symbol"],
    tags: ["ものイラスト", "モノ", "もの", "物", "object", "device", "tool", "symbol", "document", "ui", "書類", "デバイス", "道具", "記号", "シンボル"],
  },
  scene: {
    display: "ことイラスト", thumbnail: "SCENE",
    matchers: ["ことイラスト", "scene illustrations", "scene illustration", "scene", "situation", "workflow", "narrative"],
    tags: ["ことイラスト", "scene", "situation", "workflow", "context", "story", "業務フロー", "利用シーン", "状況", "シーン", "文脈", "ストーリー"],
  },
};

export const FILTER_GROUPS = {
  product: ["LegalOn", "GovernOn", "WorkOn", "DealOn", "CXOn"],
  fileFormat: ["PNG", "SVG", "PDF", "AI", "PSD", "PPT", "MP4", "JPG"],
};

export const POPULAR_SEARCHES = [
  "logo", "icon", "guideline", "3D", "ProfessionalAI",
  "white", "black", "deprecated",
  "LegalOn", "GovernOn", "WorkOn", "DealOn", "CXOn",
  "JP", "US", "EU", "template", "motion", "pptx", "UI",
];

export const SEARCH_ALIASES: Record<string, string[]> = {
  professionalai: ["professionalai", "professional ai", "プロフェッショナルai"],
  logo: ["logo", "ロゴ"],
  "ロゴ": ["ロゴ", "logo"],
  guideline: ["guideline", "ガイドライン"],
  "ガイドライン": ["ガイドライン", "guideline"],
  template: ["template", "テンプレート"],
  "テンプレート": ["テンプレート", "template"],
  ppt: ["ppt", "pptx", "potx", "powerpoint", "パワーポイント", "パワポ"],
  pptx: ["pptx", "ppt", "potx", "powerpoint", "パワーポイント", "パワポ"],
  potx: ["potx", "pptx", "ppt", "powerpoint", "パワーポイント", "パワポ"],
  powerpoint: ["powerpoint", "ppt", "pptx", "potx", "パワーポイント", "パワポ"],
  "パワーポイント": ["パワーポイント", "パワポ", "powerpoint", "ppt", "pptx", "potx"],
  "パワポ": ["パワポ", "パワーポイント", "powerpoint", "ppt", "pptx", "potx"],
  psd: ["psd", "photoshop", "フォトショップ", "編集用"],
  motion: ["motion", "モーション"],
  "モーション": ["モーション", "motion"],
  "3d": ["3d", "3d visual", "3dvisual", "3dビジュアル", "3d visuals"],
  "3D": ["3d", "3d visual", "3dvisual", "3dビジュアル", "3d visuals"],
  "3d visual": ["3d visual", "3d", "3dvisual", "3dビジュアル"],
  material: ["material", "営業資料素材"],
  "営業資料素材": ["営業資料素材", "material"],
  banner: ["banner", "バナー"],
  "バナー": ["バナー", "banner"],
  icon: ["icon", "アイコン"],
  "アイコン": ["アイコン", "icon"],
  people: ["people", "person", "human", "worker", "user", "人物", "人", "ひと", "担当者", "利用者"],
  "人物": ["人物", "人", "ひと", "people", "person", "human", "worker", "user", "担当者", "利用者"],
  object: ["object", "device", "tool", "symbol", "document", "もの", "モノ", "物", "デバイス", "道具", "記号", "シンボル", "書類"],
  "もの": ["もの", "モノ", "物", "object", "device", "tool", "symbol", "document", "デバイス", "道具", "記号", "シンボル", "書類"],
  scene: ["scene", "situation", "workflow", "context", "story", "こと", "シーン", "状況", "業務フロー", "利用シーン", "ストーリー"],
  "シーン": ["シーン", "scene", "situation", "workflow", "context", "story", "状況", "業務フロー", "利用シーン", "ストーリー"],
  "裁判所": ["裁判所", "court"],
  court: ["court", "裁判所"],
  black: ["black", "黒", "ブラック"],
  white: ["white", "白", "ホワイト"],
};

export const FORMAT_COLORS: Record<string, string> = {
  PNG: "#3f7ecf", SVG: "#039373", PDF: "#d34638", AI: "#9a5fc0",
  PSD: "#c44d7b", PPT: "#8f6329", MP4: "#c15d1e", JPG: "#7b6bd0",
};

export const API_ASSETS_ENDPOINT = "/api/assets";
export const API_THUMBNAIL_ENDPOINT = "/api/thumbnail";
export const API_DOWNLOAD_ENDPOINT = "/api/download";
