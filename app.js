const formatLabels = {
  PNG: "PNG",
  SVG: "SVG",
  PDF: "PDF",
  AI: "AI",
  PPT: "PPT",
  MP4: "MP4",
  JPG: "JPG",
};

const statusMeta = {
  recommended: {
    label: "Recommended",
    tone: "recommended",
    description: "推奨アセット。おすすめセクションで優先表示します。",
  },
  current: {
    label: "Current",
    tone: "current",
    description: "通常利用してよい最新版です。",
  },
  deprecated: {
    label: "Deprecated",
    tone: "deprecated",
    description: "非推奨アセットです。代替を優先してください。",
  },
  archived: {
    label: "Archived",
    tone: "archived",
    description: "保管用です。通常一覧には出しません。",
  },
};

const brandMeta = {
  LegalOn: { label: "LegalOn", color: "#d34638" },
  GovernOn: { label: "GovernOn", color: "#039373" },
  WorkOn: { label: "WorkOn", color: "#7b6bd0" },
  DealOn: { label: "DealOn", color: "#c15d1e" },
  CXOn: { label: "CXOn", color: "#3f7ecf" },
};

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
};

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
};

const illustrationCategoryMeta = {
  people: {
    display: "ひとイラスト",
    thumbnail: "PEOPLE",
    matchers: [
      "ひとイラスト",
      "people illustrations",
      "people illustration",
      "people",
      "human",
      "person",
      "character",
    ],
    tags: [
      "ひとイラスト",
      "人物",
      "人",
      "ひと",
      "people",
      "person",
      "human",
      "worker",
      "user",
      "persona",
      "キャラクター",
      "担当者",
      "利用者",
    ],
  },
  object: {
    display: "ものイラスト",
    thumbnail: "OBJECT",
    matchers: [
      "ものイラスト",
      "object illustrations",
      "object illustration",
      "object",
      "tool",
      "device",
      "symbol",
    ],
    tags: [
      "ものイラスト",
      "モノ",
      "もの",
      "物",
      "object",
      "device",
      "tool",
      "symbol",
      "document",
      "ui",
      "書類",
      "デバイス",
      "道具",
      "記号",
      "シンボル",
    ],
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
      "文脈",
      "ストーリー",
    ],
  },
};

const filterGroups = {
  product: ["LegalOn", "GovernOn", "WorkOn", "DealOn", "CXOn"],
  fileFormat: ["PNG", "SVG", "PDF", "AI", "PPT", "MP4", "JPG"],
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

const searchAliases = {
  professionalai: ["professionalai", "professional ai", "プロフェッショナルai"],
  ProfessionalAI: ["professionalai", "professional ai", "プロフェッショナルai"],
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
  motion: ["motion", "モーション"],
  モーション: ["モーション", "motion"],
  "3d": ["3d", "3d visual", "3dvisual", "3dビジュアル", "3d visuals"],
  "3D": ["3d", "3d visual", "3dvisual", "3dビジュアル", "3d visuals"],
  "3d visual": ["3d visual", "3d", "3dvisual", "3dビジュアル"],
  "3D Visual": ["3d visual", "3d", "3dvisual", "3dビジュアル"],
  material: ["material", "営業資料素材"],
  "営業資料素材": ["営業資料素材", "material"],
  banner: ["banner", "バナー"],
  バナー: ["バナー", "banner"],
  icon: ["icon", "アイコン"],
  アイコン: ["アイコン", "icon"],
  people: ["people", "person", "human", "worker", "user", "人物", "人", "ひと", "担当者", "利用者"],
  人物: ["人物", "人", "ひと", "people", "person", "human", "worker", "user", "担当者", "利用者"],
  object: ["object", "device", "tool", "symbol", "document", "もの", "モノ", "物", "デバイス", "道具", "記号", "シンボル", "書類"],
  もの: ["もの", "モノ", "物", "object", "device", "tool", "symbol", "document", "デバイス", "道具", "記号", "シンボル", "書類"],
  scene: ["scene", "situation", "workflow", "context", "story", "こと", "シーン", "状況", "業務フロー", "利用シーン", "ストーリー"],
  シーン: ["シーン", "scene", "situation", "workflow", "context", "story", "状況", "業務フロー", "利用シーン", "ストーリー"],
  裁判所: ["裁判所", "court"],
  court: ["court", "裁判所"],
  black: ["black", "黒", "ブラック"],
  white: ["white", "白", "ホワイト"],
};

let assets = [];
const API_ASSETS_ENDPOINT = "/api/assets";
const API_THUMBNAIL_ENDPOINT = "/api/thumbnail";
const API_DOWNLOAD_ENDPOINT = "/api/download";

const state = {
  query: "",
  sort: "recommended",
  showDeprecated: false,
  showArchived: false,
  filters: {
    product: new Set(),
    fileFormat: new Set(),
  },
  modalAssetId: null,
};

const assetClickStorageKey = "brand-asset-portal.click-counts.v1";
const assetClickCounts = loadAssetClickCounts();

const nodes = {
  appShell: document.querySelector(".app-shell"),
  totalCount: document.getElementById("totalCount"),
  recommendedCount: document.getElementById("recommendedCount"),
  matchCount: document.getElementById("matchCount"),
  searchInput: document.getElementById("searchInput"),
  sortSelect: document.getElementById("sortSelect"),
  clearBtn: document.getElementById("clearBtn"),
  resetEmptyBtn: document.getElementById("resetEmptyBtn"),
  showDeprecated: document.getElementById("showDeprecated"),
  showArchived: document.getElementById("showArchived"),
  productFilters: document.getElementById("productFilters"),
  fileFormatFilters: document.getElementById("fileFormatFilters"),
  popularSearches: document.getElementById("popularSearches"),
  recommendationGrid: document.getElementById("recommendationGrid"),
  grid: document.getElementById("grid"),
  resultsSection: document.getElementById("resultsSection"),
  summaryText: document.getElementById("summaryText"),
  activeChips: document.getElementById("activeChips"),
  emptyState: document.getElementById("emptyState"),
  modal: document.getElementById("modal"),
  modalPreview: document.getElementById("modalPreview"),
  modalPath: document.getElementById("modalPath"),
  modalTitle: document.getElementById("modalTitle"),
  modalStatus: document.getElementById("modalStatus"),
  modalMetaGrid: document.getElementById("modalMetaGrid"),
  modalDescription: document.getElementById("modalDescription"),
  modalNoticeWrap: document.getElementById("modalNoticeWrap"),
  formatSelect: document.getElementById("formatSelect"),
  downloadLink: document.getElementById("downloadLink"),
  driveLink: document.getElementById("driveLink"),
  variantList: document.getElementById("variantList"),
  versionList: document.getElementById("versionList"),
};

const chipTemplate = document.getElementById("chipTemplate");

init();

async function init() {
  assets = await loadAssetsIndex();
  nodes.totalCount.textContent = String(assets.length);
  nodes.recommendedCount.textContent = String(
    assets.filter((asset) => asset.recommended && asset.status === "current").length,
  );

  buildFilterChips();
  buildPopularSearches();
  bindEvents();
  render();
}

async function loadAssetsIndex() {
  try {
    const response = await fetch(API_ASSETS_ENDPOINT, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("assets-index.json must be an array");
    }
    return data.map(makeAsset).filter((asset) => Boolean(getAssetDriveId(asset)));
  } catch (error) {
    console.warn("Falling back to embedded assets because the index could not be loaded.", error);
    return buildFallbackAssets().filter((asset) => Boolean(getAssetDriveId(asset)));
  }
}

function loadAssetClickCounts() {
  try {
    const raw = window.localStorage.getItem(assetClickStorageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    return {};
  }
}

function saveAssetClickCounts() {
  try {
    window.localStorage.setItem(assetClickStorageKey, JSON.stringify(assetClickCounts));
  } catch (error) {
    // Ignore storage failures in private browsing or restricted environments.
  }
}

function recordAssetClick(assetId) {
  if (!assetId) return;
  assetClickCounts[assetId] = (assetClickCounts[assetId] ?? 0) + 1;
  saveAssetClickCounts();
}

function getAssetClickCount(asset) {
  return Number(assetClickCounts[asset.id] ?? 0);
}

function bindEvents() {
  const defaultSearchPlaceholder = nodes.searchInput.dataset.placeholder || nodes.searchInput.placeholder;

  nodes.searchInput.addEventListener("focus", () => {
    nodes.searchInput.placeholder = "";
  });

  nodes.searchInput.addEventListener("blur", () => {
    if (!nodes.searchInput.value.trim()) {
      nodes.searchInput.placeholder = defaultSearchPlaceholder;
    }
  });

  nodes.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value.trim();
    render();
  });

  nodes.sortSelect.addEventListener("change", (event) => {
    state.sort = event.target.value;
    render();
  });

  nodes.showDeprecated.addEventListener("change", (event) => {
    state.showDeprecated = event.target.checked;
    render();
  });

  nodes.showArchived.addEventListener("change", (event) => {
    state.showArchived = event.target.checked;
    render();
  });

  nodes.clearBtn.addEventListener("click", resetAll);
  nodes.resetEmptyBtn.addEventListener("click", resetAll);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  nodes.modal.addEventListener("click", (event) => {
    if (event.target?.dataset?.close === "true") {
      closeModal();
    }
  });

  nodes.formatSelect.addEventListener("change", (event) => {
    setModalAsset(event.target.value);
  });

  nodes.downloadLink.addEventListener("click", async (event) => {
    const asset = getAssetById(state.modalAssetId);
    if (!asset?.driveId) return;

    event.preventDefault();
    await downloadAsset(asset);
  });
}

function buildFilterChips() {
  renderFilterGroup(nodes.productFilters, "product");
  renderFilterGroup(nodes.fileFormatFilters, "fileFormat");
}

function renderFilterGroup(container, groupName) {
  container.innerHTML = "";
  filterGroups[groupName].forEach((value) => {
    const chip = chipTemplate.content.firstElementChild.cloneNode(true);
    chip.textContent = value;
    chip.dataset.group = groupName;
    chip.dataset.value = value;
    chip.style.color = getGroupColor(groupName, value);
    chip.addEventListener("click", () => toggleFilter(groupName, value));
    container.appendChild(chip);
  });
}

function buildPopularSearches() {
  nodes.popularSearches.innerHTML = "";
  popularSearches.forEach((keyword) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "popular-chip";
    chip.textContent = keyword;
    chip.addEventListener("click", () => {
      nodes.searchInput.value = keyword;
      state.query = keyword;
      render();
      nodes.searchInput.focus();
    });
    nodes.popularSearches.appendChild(chip);
  });
}

function toggleFilter(groupName, value) {
  const bucket = state.filters[groupName];
  if (bucket.has(value)) {
    bucket.delete(value);
  } else {
    bucket.add(value);
  }
  render();
}

function resetAll() {
  state.query = "";
  state.sort = "recommended";
  state.showDeprecated = false;
  state.showArchived = false;
  Object.values(state.filters).forEach((bucket) => bucket.clear());

  nodes.searchInput.value = "";
  nodes.searchInput.placeholder = nodes.searchInput.dataset.placeholder || nodes.searchInput.placeholder;
  nodes.sortSelect.value = "recommended";
  nodes.showDeprecated.checked = false;
  nodes.showArchived.checked = false;

  render();
}

function render() {
  syncFilterChipStates();
  syncLayoutState();

  const filtered = getFilteredAssets();
  const visible = buildDisplayGroups(sortAssets(filtered));
  const recommendations = buildDisplayGroups(getRecommendationAssets(filtered)).slice(0, 8);

  nodes.matchCount.textContent = String(visible.length);
  nodes.summaryText.textContent = buildSummaryText(visible.length);
  renderActiveChips();
  renderRecommendationGrid(recommendations);
  renderAssetGrid(visible);
  nodes.emptyState.classList.toggle("hidden", visible.length > 0);
}

function syncLayoutState() {
  const hasActiveFilters = Object.values(state.filters).some((bucket) => bucket.size > 0);
  nodes.appShell.classList.toggle("is-searching", Boolean(state.query || hasActiveFilters));
}

function syncFilterChipStates() {
  document.querySelectorAll(".chip").forEach((chip) => {
    const groupName = chip.dataset.group;
    const value = chip.dataset.value;
    if (!groupName || !value) return;
    chip.classList.toggle("is-active", state.filters[groupName].has(value));
    chip.setAttribute("aria-pressed", String(state.filters[groupName].has(value)));
  });
}

function renderActiveChips() {
  const active = [];
  const groupLabels = {
    product: "プロダクト",
    fileFormat: "ファイル形式",
  };
  Object.entries(state.filters).forEach(([groupName, bucket]) => {
    bucket.forEach((value) => {
      active.push({
        label: `${groupLabels[groupName] ?? groupName}: ${value}`,
        clear: () => bucket.delete(value),
      });
    });
  });

  if (state.query) {
    active.push({
      label: `検索: ${state.query}`,
      clear: () => {
        state.query = "";
        nodes.searchInput.value = "";
      },
    });
  }

  if (state.showDeprecated) {
    active.push({
      label: "Deprecated表示",
      clear: () => {
        state.showDeprecated = false;
        nodes.showDeprecated.checked = false;
      },
    });
  }

  if (state.showArchived) {
    active.push({
      label: "Archived表示",
      clear: () => {
        state.showArchived = false;
        nodes.showArchived.checked = false;
      },
    });
  }

  nodes.activeChips.innerHTML = active
    .map(
      (item, index) => `
        <span class="active-chip">
          ${escapeHtml(item.label)}
          <button type="button" data-index="${index}" aria-label="${escapeHtml(item.label)} を解除">×</button>
        </span>
      `,
    )
    .join("");

  nodes.activeChips.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = active[Number(button.dataset.index)];
      if (item) {
        item.clear();
        render();
      }
    });
  });
}

function getFilteredAssets() {
  return assets.filter((asset) => {
    if (!state.showArchived && asset.status === "archived") {
      return false;
    }

    if (!state.showDeprecated && asset.status === "deprecated") {
      return false;
    }

    if (!matchesBuckets(asset)) {
      return false;
    }

    if (!state.query) {
      return true;
    }

    return matchesQuery(asset, state.query);
  });
}

function matchesBuckets(asset) {
  for (const [groupName, bucket] of Object.entries(state.filters)) {
    if (bucket.size === 0) continue;

    if (groupName === "product") {
      if (!bucket.has(asset.brand)) {
        return false;
      }
      continue;
    }

    if (groupName === "fileFormat") {
      if (!bucket.has(asset.fileFormat)) {
        return false;
      }
      continue;
    }
  }

  return true;
}

function matchesQuery(asset, query) {
  const normalized = normalize(query);
  const tokens = normalized.split(/\s+/).filter(Boolean);
  const haystack = normalizeSearchText([
    asset.title,
    asset.brand,
    asset.fileFormat,
    asset.assetType,
    asset.locale,
    asset.status,
    asset.description,
    asset.recommended ? "recommended" : "",
    asset.usage.join(" "),
    (asset.tags || []).join(" "),
  ].join(" "));

  return tokens.every((token) => {
    const variants = expandSearchToken(token);
    return variants.some((variant) => haystack.includes(variant));
  });
}

function getIllustrationCategoryInfo(assetType) {
  const normalizedType = normalize(String(assetType || ""));
  if (!normalizedType) return null;

  return Object.values(illustrationCategoryMeta).find((category) =>
    category.matchers.some((matcher) => normalizedType.includes(normalize(matcher))),
  ) ?? null;
}

function sortAssets(list) {
  const sorted = [...list];
  const comparator = {
    recommended: (a, b) => {
      const aScore = Number(a.recommended && a.status === "current");
      const bScore = Number(b.recommended && b.status === "current");
      if (aScore !== bScore) return bScore - aScore;
      return dateValue(b.updatedAt) - dateValue(a.updatedAt);
    },
    updatedDesc: (a, b) => dateValue(b.updatedAt) - dateValue(a.updatedAt),
    nameAsc: (a, b) => a.title.localeCompare(b.title, "ja"),
  }[state.sort];

  sorted.sort((a, b) => {
    const result = comparator(a, b);
    if (result !== 0) return result;
    return a.title.localeCompare(b.title, "ja");
  });

  return sorted;
}

function getRecommendationAssets(filtered) {
  return [...filtered]
    .filter((asset) => asset.recommended && asset.status === "current")
    .sort((a, b) => {
      const clickDiff = getAssetClickCount(b) - getAssetClickCount(a);
      if (clickDiff !== 0) return clickDiff;
      const updatedDiff = dateValue(b.updatedAt) - dateValue(a.updatedAt);
      if (updatedDiff !== 0) return updatedDiff;
      return a.title.localeCompare(b.title, "ja");
    });
}

function renderRecommendationGrid(list) {
  nodes.recommendationGrid.innerHTML = "";
  if (list.length === 0) {
    nodes.recommendationGrid.innerHTML = `
      <div class="empty-inline">
        <h3>おすすめ候補がありません</h3>
        <p>表示条件を少し広げると、推奨アセットが出てきます。</p>
      </div>
    `;
    return;
  }

  list.forEach((group) => {
    const card = createCard(group, true);
    nodes.recommendationGrid.appendChild(card);
  });
}

function renderAssetGrid(list) {
  nodes.grid.innerHTML = "";
  list.forEach((group) => {
    const card = createCard(group, false);
    nodes.grid.appendChild(card);
  });
}

function createCard(group, compact) {
  const asset = group.representative;
  const button = document.createElement("button");
  button.type = "button";
  button.className = compact ? "asset-card asset-card--compact" : "asset-card";
  button.addEventListener("click", () => openModal(getPreferredModalAsset(group).id));

  const thumb = document.createElement("div");
  thumb.className = "asset-thumb";
  thumb.style.setProperty("--brand-color", brandMeta[asset.brand].color);
  thumb.style.setProperty("--format-color", getFormatColor(asset.fileFormat));

  const badgeRow = document.createElement("div");
  badgeRow.className = "badge-row";
  badgeRow.append(
    makeBadge(asset.recommended ? "Recommended" : statusMeta[asset.status].label, asset.status),
    makeBadge(buildFormatBadgeLabel(group.fileFormats), "format"),
  );

  const visual = document.createElement("div");
  visual.className = "thumb-visual";
  visual.appendChild(buildCardVisual(group));

  const thumbInner = document.createElement("div");
  thumbInner.className = "thumb-inner";
  thumbInner.innerHTML =
    group.variantCount > 1
      ? `
        <div class="thumb-format-row">${group.fileFormats.map((format) => `<span>${escapeHtml(format)}</span>`).join("")}</div>
        <div class="thumb-caption">
          <span>${escapeHtml(group.colorLabels.join(" / "))}</span>
          <span>${escapeHtml(`${group.variantCount} variants`)}</span>
        </div>
      `
      : `
        <div class="thumb-caption">
          <span>${escapeHtml(asset.assetType)}</span>
          <span>${escapeHtml(asset.locale)}</span>
        </div>
      `;

  thumb.append(badgeRow, visual, thumbInner);

  const body = document.createElement("div");
  body.className = "asset-body";

  const header = document.createElement("div");
  header.className = "asset-header";

  const titleWrap = document.createElement("div");
  titleWrap.className = "asset-title-wrap";

  const eyebrow = document.createElement("div");
  eyebrow.className = "asset-eyebrow";
  eyebrow.innerHTML = `
    <span class="asset-brand">${escapeHtml(asset.brand)}</span>
    <span class="asset-type">${escapeHtml(asset.assetType)}</span>
  `;

  const title = document.createElement("div");
  title.className = "asset-title";
  title.textContent = group.title;

  titleWrap.append(eyebrow, title);

  const summary = document.createElement("div");
  summary.className = "asset-summary";
  summary.textContent = getCardSummary(group);

  const status = document.createElement("div");
  status.className = "asset-status";
  status.appendChild(makeStatusBadge(asset.status));

  header.append(titleWrap, status);

  const detailList = document.createElement("div");
  detailList.className = "asset-detail-list";
  detailList.innerHTML = `
    <div class="asset-detail-item">
      <span>Formats</span>
      <strong>${escapeHtml(group.fileFormats.join(" / "))}</strong>
    </div>
    <div class="asset-detail-item">
      <span>Colors</span>
      <strong>${escapeHtml(group.colorLabels.join(" / "))}</strong>
    </div>
    <div class="asset-detail-item">
      <span>Updated</span>
      <strong>${escapeHtml(formatDate(group.updatedAt))}</strong>
    </div>
  `;

  const footer = document.createElement("div");
  footer.className = "asset-footer";

  const meta = document.createElement("div");
  meta.className = "asset-meta";
  meta.textContent = `${group.localeLabel} · ${group.variantCount} variants`;

  const usage = makePillList(asset.usage, "pill");
  usage.classList.add("asset-usage");

  footer.append(meta, usage);
  body.append(header, summary, detailList, footer);
  button.append(thumb, body);
  return button;
}

function makeBadge(label, type) {
  const span = document.createElement("span");
  span.className = `badge badge--${type}`;
  span.textContent = label;
  return span;
}

function makeStatusBadge(status) {
  const span = document.createElement("span");
  span.className = `status-pill status-pill--${statusMeta[status].tone}`;
  span.textContent = statusMeta[status].label;
  return span;
}

function makePillList(values, className) {
  const wrap = document.createElement("div");
  wrap.className = "pill-list";
  values.slice(0, 3).forEach((value) => {
    const pill = document.createElement("span");
    pill.className = className;
    pill.textContent = value;
    wrap.appendChild(pill);
  });
  if (values.length > 3) {
    const more = document.createElement("span");
    more.className = className;
    more.textContent = `+${values.length - 3}`;
    wrap.appendChild(more);
  }
  return wrap;
}

function openModal(assetId) {
  recordAssetClick(assetId);
  state.modalAssetId = assetId;
  nodes.modal.classList.remove("hidden");
  renderModal();
}

function closeModal() {
  state.modalAssetId = null;
  nodes.modal.classList.add("hidden");
}

function renderModal() {
  const asset = getAssetById(state.modalAssetId);
  if (!asset) return;

  const groupAssets = getGroupAssets(asset);
  const currentVariant = groupAssets.find((item) => item.id === asset.id) ?? asset;
  const versionChain = getVersionChain(currentVariant);

  nodes.modalPath.textContent = `${asset.brand} / ${asset.assetType} / ${asset.locale}`;
  nodes.modalTitle.textContent = asset.title;
  nodes.modalStatus.className = `status-pill status-pill--${statusMeta[asset.status].tone}`;
  nodes.modalStatus.textContent = statusMeta[asset.status].label;
  nodes.modalMetaGrid.innerHTML = buildModalMeta(asset);
  nodes.modalDescription.textContent = asset.description;
  nodes.modalNoticeWrap.innerHTML = "";

  const selectedDownloadAsset = groupAssets.find((item) => item.id === currentVariant.id) ?? currentVariant;
  renderPreview(selectedDownloadAsset);
  renderFormatSelect(groupAssets, selectedDownloadAsset.id);
  renderVariantList(groupAssets, selectedDownloadAsset.id);
  renderVersionList(versionChain);

  nodes.downloadLink.href = getDownloadUrl(selectedDownloadAsset);
  nodes.downloadLink.download = sanitizeFilename(selectedDownloadAsset.title, selectedDownloadAsset.fileFormat);
  nodes.driveLink.href = getDriveOpenUrl(selectedDownloadAsset);

  if (asset.status === "deprecated") {
    const warning = document.createElement("div");
    warning.className = "modal-warning";
    warning.innerHTML = `
      <strong>Deprecated / 使用非推奨</strong>
      <p>このアセットは現在の利用を推奨していません。${asset.replacedBy ? `代わりに ${escapeHtml(getAssetById(asset.replacedBy)?.title ?? "推奨アセット")} を使用してください。` : "誤使用を避けるため、代替アセットを選んでください。"}</p>
    `;
    nodes.modalNoticeWrap.appendChild(warning);
  }
}

function renderPreview(asset) {
  nodes.modalPreview.innerHTML = "";
  const preview = document.createElement("div");
  preview.className = "preview-card";
  preview.style.setProperty("--brand-color", brandMeta[asset.brand].color);
  preview.style.setProperty("--format-color", getFormatColor(asset.fileFormat));

  const visual = document.createElement("div");
  visual.className = "preview-visual";
  visual.appendChild(buildAssetVisual(asset, "preview"));

  const body = document.createElement("div");
  body.className = "preview-body";
  body.innerHTML = `
    <div class="preview-header">
      <div class="preview-badges">
        <span>${escapeHtml(asset.brand)}</span>
        <span>${escapeHtml(asset.fileFormat)}</span>
        <span>${escapeHtml(statusMeta[asset.status].label)}</span>
      </div>
      <div class="preview-kicker">${escapeHtml(asset.assetType)} · ${escapeHtml(asset.locale)}</div>
    </div>
    <div class="preview-main">
      <div class="preview-title">${escapeHtml(asset.title)}</div>
      <div class="preview-copy">${escapeHtml(asset.description)}</div>
      <div class="preview-footer">
        <span>Variant: ${escapeHtml(getVariantLabel(asset))}</span>
        <span>${escapeHtml(formatDate(asset.updatedAt))}更新</span>
      </div>
    </div>
  `;
  preview.append(visual, body);
  nodes.modalPreview.appendChild(preview);
}

function renderFormatSelect(groupAssets, selectedId) {
  nodes.formatSelect.innerHTML = "";
  groupAssets.forEach((asset) => {
    const option = document.createElement("option");
    option.value = asset.id;
    option.textContent = `${asset.fileFormat} · ${getVariantLabel(asset)}${asset.status === "deprecated" ? " (deprecated)" : ""}`;
    if (asset.id === selectedId) {
      option.selected = true;
    }
    nodes.formatSelect.appendChild(option);
  });
}

function renderVariantList(groupAssets, selectedId) {
  nodes.variantList.innerHTML = "";
  groupAssets.forEach((asset) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `variant-card ${asset.id === selectedId ? "is-active" : ""}`;
    button.addEventListener("click", () => setModalAsset(asset.id));
    button.innerHTML = `
      <strong>${escapeHtml(asset.fileFormat)} · ${escapeHtml(getVariantLabel(asset))}</strong>
      <span>${escapeHtml(asset.title)}</span>
      <em>${escapeHtml(statusMeta[asset.status].label)} / ${escapeHtml(asset.locale)}</em>
    `;
    nodes.variantList.appendChild(button);
  });
}

function renderVersionList(versionChain) {
  nodes.versionList.innerHTML = "";
  if (versionChain.length === 0) {
    nodes.versionList.innerHTML = `
      <div class="empty-inline empty-inline--tight">
        <p>このアセットにはバージョン履歴がありません。</p>
      </div>
    `;
    return;
  }

  versionChain.forEach((asset, index) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "version-card";
    item.addEventListener("click", () => setModalAsset(asset.id));
    item.innerHTML = `
      <span class="version-index">#${versionChain.length - index}</span>
      <div>
        <strong>${escapeHtml(asset.title)}</strong>
        <p>${escapeHtml(asset.fileFormat)} · ${escapeHtml(statusMeta[asset.status].label)} · ${formatDate(asset.updatedAt)}</p>
      </div>
    `;
    nodes.versionList.appendChild(item);
  });
}

function buildModalMeta(asset) {
  const rows = [
    ["Brand", asset.brand],
    ["Format", asset.fileFormat],
    ["Variant", getVariantLabel(asset)],
    ["Asset type", asset.assetType],
    ["Usage", asset.usage.join(" / ")],
    ["Tags", (asset.tags || []).join(" / ") || "—"],
    ["Locale", asset.locale],
    ["Updated", `${formatDate(asset.updatedAt)}`],
  ];
  return rows
    .map(
      ([label, value]) => `
        <div class="meta-item">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
        </div>
      `,
    )
    .join("");
}

function getCardSummary(group) {
  if (group.variantCount > 1) {
    return `${group.fileFormats.join(" / ")} · ${group.colorLabels.join(" / ")} · ${group.variantCount} variants`;
  }

  const summaryParts = [];
  if (group.representative.description) {
    summaryParts.push(group.representative.description);
  }
  if (summaryParts.length === 0 && group.representative.usage.length > 0) {
    summaryParts.push(group.representative.usage.join(" / "));
  }
  return truncateText(summaryParts.join(" "), 120);
}

function truncateText(value, maxLength) {
  if (!value) return "詳細情報はモーダルで確認できます";
  return value.length > maxLength ? `${value.slice(0, maxLength - 1).trimEnd()}…` : value;
}

function buildDisplayGroups(list) {
  const grouped = new Map();
  list.forEach((asset) => {
    const key = getAssetFamilyKey(asset) || asset.id;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key).push(asset);
  });

  return [...grouped.values()].map((variants) => makeDisplayGroup(variants));
}

function makeDisplayGroup(variants) {
  const representative = variants[0];
  const fileFormats = uniqueValues(variants.map((asset) => asset.fileFormat));
  const colorLabels = uniqueValues(variants.map((asset) => getVariantLabel(asset)));
  const locales = uniqueValues(variants.map((asset) => asset.locale));
  const updatedAt = variants.reduce((latest, asset) => {
    return dateValue(asset.updatedAt) > dateValue(latest) ? asset.updatedAt : latest;
  }, representative.updatedAt);

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

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}

function buildFormatBadgeLabel(formats) {
  if (formats.length <= 2) return formats.join(" / ");
  return `${formats.slice(0, 2).join(" / ")} +${formats.length - 2}`;
}

function getPreferredModalAsset(group) {
  return group.variants.find((asset) => asset.fileFormat === "PNG") ?? group.representative;
}

function buildCardVisual(group) {
  const asset = group.representative;
  if (group.fileFormats.length <= 1) {
    return buildAssetVisual(asset, "thumb");
  }

  const wrapper = document.createElement("div");
  wrapper.className = "thumb-visual__stack";

  const marks = document.createElement("div");
  marks.className = "thumb-visual__marks";
  group.fileFormats.forEach((format) => {
    const item = document.createElement("span");
    item.className = "thumb-visual__mark thumb-visual__mark--multi";
    item.textContent = format;
    item.style.background = getFormatColor(format);
    marks.appendChild(item);
  });

  const kind = document.createElement("div");
  kind.className = "thumb-visual__kind";
  kind.textContent = getThumbnailKindLabel(asset.assetType);

  const brand = document.createElement("div");
  brand.className = "thumb-visual__brand";
  brand.textContent = asset.brand;

  wrapper.append(marks, kind, brand);
  return wrapper;
}

function setModalAsset(assetId) {
  state.modalAssetId = assetId;
  renderModal();
}

function getAssetById(id) {
  return assets.find((asset) => asset.id === id) ?? null;
}

function getGroupAssets(asset) {
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

function getAssetFamilyKey(asset) {
  if (asset.assetType === "ロゴ") {
    return [
      asset.brand,
      asset.assetType,
      normalizeLogoFamily(asset.title, asset.brand),
    ].join("::");
  }
  return asset.assetGroupId;
}

function getVersionChain(asset) {
  const chain = [asset];
  const seen = new Set([asset.id]);
  let cursor = asset.previousVersionId ? getAssetById(asset.previousVersionId) : null;
  while (cursor && !seen.has(cursor.id)) {
    chain.push(cursor);
    seen.add(cursor.id);
    cursor = cursor.previousVersionId ? getAssetById(cursor.previousVersionId) : null;
  }
  return chain;
}

function statusRank(status) {
  return {
    current: 0,
    recommended: 0,
    deprecated: 1,
    archived: 2,
  }[status] ?? 3;
}

function getDownloadUrl(asset) {
  const driveId = getAssetDriveId(asset);
  if (driveId) {
    return getDirectDriveDownloadUrl(driveId);
  }
  return `data:text/plain;charset=utf-8,${encodeURIComponent(
    `${asset.title}\n${asset.brand}\n${asset.fileFormat}\n${asset.assetType}\n${asset.locale}\n${asset.status}`,
  )}`;
}

async function downloadAsset(asset) {
  const filename = sanitizeFilename(asset.title, asset.fileFormat);
  const driveId = getAssetDriveId(asset);

  if (!driveId) {
    return;
  }

  const url = getDownloadUrl(asset);
  recordAssetClick(asset.id);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener noreferrer";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function getGroupColor(groupName, value) {
  if (groupName === "product") {
    return brandMeta[value].color;
  }
  const palette = {
    ロゴ: "#3f7ecf",
    ガイドライン: "#7b6bd0",
    営業資料素材: "#039373",
    モーション: "#c44d7b",
    テンプレート: "#c15d1e",
    ひとイラスト: "#d34638",
    ものイラスト: "#039373",
    ことイラスト: "#7b6bd0",
    PNG: "#3f7ecf",
    SVG: "#039373",
    PDF: "#d34638",
    AI: "#9a5fc0",
    PPT: "#8f6329",
    MP4: "#c15d1e",
    Webサイト: "#039373",
    印刷: "#9a5fc0",
    SNS: "#c44d7b",
    イベント: "#c15d1e",
    社内資料: "#7d7d7d",
    営業提案: "#7b6bd0",
    Global: "#5d5d5d",
    JP: "#3f7ecf",
    US: "#039373",
    EU: "#9a5fc0",
  };
  return palette[value] ?? "#5d5d5d";
}

function getThumbnailKindLabel(assetType) {
  const illustrationCategory = getIllustrationCategoryInfo(assetType);
  if (illustrationCategory) {
    return illustrationCategory.thumbnail;
  }

  const labels = {
    ロゴ: "LOGO",
    ガイドライン: "GUIDE",
    営業資料素材: "MATERIAL",
    モーション: "MOTION",
    テンプレート: "TEMPLATE",
    "3D Visual": "3D VISUAL",
  };
  return labels[assetType] ?? "ASSET";
}

function getFormatColor(fileFormat) {
  return {
    PNG: "#3f7ecf",
    SVG: "#039373",
    PDF: "#d34638",
    AI: "#9a5fc0",
    PPT: "#8f6329",
    MP4: "#c15d1e",
    JPG: "#7b6bd0",
  }[fileFormat] ?? "#3f7ecf";
}
function extractDriveIdFromUrl(url) {
  if (!url) return "";
  const fileMatch = url.match(/\/file\/d\/([^/]+)\//);
  if (fileMatch) return fileMatch[1];
  const queryMatch = url.match(/[?&]id=([^&]+)/);
  if (queryMatch) return decodeURIComponent(queryMatch[1]);
  return "";
}

function getAssetDriveId(asset) {
  return asset.driveId || extractDriveIdFromUrl(asset.driveUrl);
}

function getDirectDriveDownloadUrl(driveId) {
  return `https://drive.usercontent.google.com/u/0/uc?id=${encodeURIComponent(driveId)}&export=download`;
}

function colorVariantRank(colorVariant) {
  return {
    color: 0,
    black: 1,
    white: 2,
  }[String(colorVariant || "").toLowerCase()] ?? 3;
}

function makeAsset(data) {
  const driveId = data.driveId || extractDriveIdFromUrl(data.driveUrl) || "";
  const illustrationCategory = getIllustrationCategoryInfo(data.assetType);
  const normalizedAssetType = illustrationCategory?.display || data.assetType;
  const browseUrl = getBrandBrowseUrl(data.brand, normalizedAssetType, data.locale);
  const driveUrl = data.driveUrl && !isDriveSearchUrl(data.driveUrl) ? data.driveUrl : browseUrl;
  const colorVariant = data.colorVariant || inferColorVariant(data.title);
  const tags = uniqueValues([
    ...(Array.isArray(data.tags) ? data.tags : []),
    ...(illustrationCategory?.tags || []),
  ]);
  return {
    ...data,
    assetType: normalizedAssetType,
    driveUrl: driveId ? `https://drive.google.com/file/d/${driveId}/view?usp=drivesdk` : driveUrl,
    driveId,
    thumbnailUrl: data.thumbnailUrl || (driveId ? `${API_THUMBNAIL_ENDPOINT}/${encodeURIComponent(driveId)}` : ""),
    downloadUrl: data.downloadUrl || (driveId ? `${API_DOWNLOAD_ENDPOINT}/${encodeURIComponent(driveId)}` : ""),
    colorVariant,
    tags,
  };
}

function inferColorVariant(title) {
  const normalized = normalize(String(title || ""));
  if (/(^| )(white|wh)( |$)/.test(normalized)) return "white";
  if (/(^| )(black|bk|bgink)( |$)/.test(normalized)) return "black";
  return "color";
}

function getColorVariantLabel(asset) {
  return {
    color: "Color",
    black: "Black",
    white: "White",
  }[String(asset.colorVariant || inferColorVariant(asset.title)).toLowerCase()] ?? "Color";
}

function getVariantLabel(asset) {
  return asset.variantLabel || getColorVariantLabel(asset);
}

function normalizeLogoFamily(title, brand) {
  return normalize(String(title || ""))
    .replace(new RegExp(normalize(brand), "g"), " ")
    .replace(/\(v[0-9]+\)/g, " ")
    .replace(/\b(color|black|white|bk|bgink|rgb|green|main|bgblack|bgcolor|background|light|dark)\b/g, " ")
    .replace(/\b(png|jpg|jpeg|svg|ai|pdf)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildAssetVisual(asset, mode) {
  const thumbnailUrl = getThumbnailUrl(asset);
  if (thumbnailUrl) {
    const image = document.createElement("img");
    image.className =
      mode === "preview" ? "preview-visual__image" : "thumb-visual__image";
    image.src = thumbnailUrl;
    image.alt = asset.title;
    image.loading = "lazy";
    image.referrerPolicy = "no-referrer";

    image.addEventListener("error", () => {
      const container = image.parentElement;
      if (!container) return;
      container.innerHTML = getFallbackVisualMarkup(asset, mode);
    });

    return image;
  }

  const fallback = document.createElement("div");
  fallback.innerHTML = getFallbackVisualMarkup(asset, mode);
  return fallback;
}

function getFallbackVisualMarkup(asset, mode) {
  if (mode === "preview") {
    return `
      <div class="preview-visual__badge">${escapeHtml(asset.brand)}</div>
      <div class="preview-visual__mark">${escapeHtml(asset.fileFormat)}</div>
      <div class="preview-visual__kind">${escapeHtml(getThumbnailKindLabel(asset.assetType))}</div>
      <div class="preview-visual__meta">${escapeHtml(asset.assetType)} · ${escapeHtml(asset.locale)}</div>
    `;
  }

  return `
    <div class="thumb-visual__mark">${escapeHtml(asset.fileFormat)}</div>
    <div class="thumb-visual__kind">${escapeHtml(getThumbnailKindLabel(asset.assetType))}</div>
    <div class="thumb-visual__brand">${escapeHtml(asset.brand)}</div>
  `;
}

function getThumbnailUrl(asset) {
  if (asset.thumbnailUrl) return asset.thumbnailUrl;
  const driveId = getAssetDriveId(asset);
  if (!driveId) return "";
  return `${API_THUMBNAIL_ENDPOINT}/${encodeURIComponent(driveId)}`;
}

function getBrandDriveUrl(brand, locale) {
  const roots = brandDriveRoots[brand] ?? {};
  if (locale === "JP" && roots.jp) return roots.jp;
  if ((locale === "US" || locale === "EU") && roots.us) return roots.us;
  return roots.global ?? "";
}

function getDriveOpenUrl(asset) {
  if (asset.driveId) {
    return `https://drive.google.com/file/d/${encodeURIComponent(asset.driveId)}/view?usp=drivesdk`;
  }
  if (asset.driveUrl && !isDriveSearchUrl(asset.driveUrl)) {
    return asset.driveUrl;
  }
  return getBrandBrowseUrl(asset.brand, asset.assetType, asset.locale);
}

function isDriveSearchUrl(url) {
  return typeof url === "string" && url.includes("drive.google.com/drive/search");
}

function getBrandBrowseUrl(brand, assetType, locale) {
  const routes = brandBrowseFolders[brand] ?? {};
  if (assetType === "ロゴ" && routes.logo) return routes.logo;
  if (locale === "JP" && routes.jp) return routes.jp;
  if ((locale === "US" || locale === "EU") && routes.us) return routes.us;
  return routes.default ?? getBrandDriveUrl(brand, locale);
}

function buildFallbackAssets() {
  return [
    // LegalOn
    makeAsset({
      id: "legalon-logo-horizontal-black-png",
      assetGroupId: "legalon-logo-horizontal-black",
      title: "LegalOn Logo Horizontal Black",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "current",
      recommended: true,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト", "印刷"],
      updatedAt: "2026-04-09T10:10:00Z",
      previousVersionId: "legalon-logo-horizontal-black-v1-png",
      replacedBy: null,
      thumbnailColor: "light",
      description: "白背景/黒文字の横組みロゴ。最も汎用的で、ブランド基本運用の基準となるアセットです。",
      driveId: "1Gaye2RQTUw1tZe7NQwFzEIS983p-k7ZC",
    }),
    makeAsset({
      id: "legalon-logo-horizontal-black-svg",
      assetGroupId: "legalon-logo-horizontal-black",
      title: "LegalOn Logo Horizontal Black",
      brand: "LegalOn",
      fileFormat: "SVG",
      status: "current",
      recommended: true,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト", "印刷"],
      updatedAt: "2026-04-09T10:10:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "ベクター版の横組みロゴ。拡大利用や印刷用途で最も扱いやすい形式です。",
      driveId: "1bvrb0gwyjBG78wTqwcAyPA3TLuF7bDfp",
    }),
    makeAsset({
      id: "legalon-logo-horizontal-white-png",
      assetGroupId: "legalon-logo-horizontal-white",
      title: "LegalOn Logo Horizontal White",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "current",
      recommended: true,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト", "SNS"],
      updatedAt: "2026-04-09T10:02:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "暗色背景向けの白版横組みロゴ。SNS やヒーロー領域での使用を想定しています。",
      driveId: "1G6nNI1Tgalweo6Ba6FemcV-oqOlokicF",
    }),
    makeAsset({
      id: "legalon-logo-horizontal-white-svg",
      assetGroupId: "legalon-logo-horizontal-white",
      title: "LegalOn Logo Horizontal White",
      brand: "LegalOn",
      fileFormat: "SVG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T10:02:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "白版のベクター版。Web 実装や拡大用途向けの基準ファイルです。",
      driveId: "1KfKiNILEoQgvfuGdhv3HOZVsk6WJaKCX",
    }),
    makeAsset({
      id: "legalon-icon-svg",
      assetGroupId: "legalon-icon",
      title: "LegalOn Icon",
      brand: "LegalOn",
      fileFormat: "SVG",
      status: "current",
      recommended: true,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト", "SNS"],
      updatedAt: "2026-04-08T15:30:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "アイコン単体版。アプリアイコン、SNS のアバター、狭い表示領域に適しています。",
      driveId: "1oc4VeuWcDbXcbMCN81Nz2NAPOEV5PvJF",
    }),
    makeAsset({
      id: "legalon-icon-png",
      assetGroupId: "legalon-icon",
      title: "LegalOn Icon",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["SNS"],
      updatedAt: "2026-04-08T15:30:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "アイコン単体版のPNG。SNS 投稿や小サイズでの配布に向いた版です。",
      driveId: "1uuJ5NtlaFDO4Mxm67mJ7SkZqYUBQ_XqT",
    }),
    makeAsset({
      id: "legalon-professionalai-logo-01-black-ai",
      assetGroupId: "legalon-professionalai-logo-01",
      title: "ProfessionalAI Logo LegalOn 01",
      brand: "LegalOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:13:27Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の LegalOn ロゴ 01 黒版 AI データです。",
      driveId: "1B5c8Um9KlyxemBEbUjPaU35FKkAMd-dk",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "legalon-professionalai-logo-01-white-ai",
      assetGroupId: "legalon-professionalai-logo-01",
      title: "ProfessionalAI Logo LegalOn 01",
      brand: "LegalOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:13:56Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の LegalOn ロゴ 01 白版 AI データです。",
      driveId: "1ulxUdV8hJjmBUBdirtTS2R0Uvk-9fvAE",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "legalon-professionalai-logo-01-black-png",
      assetGroupId: "legalon-professionalai-logo-01",
      title: "ProfessionalAI Logo LegalOn 01",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:31:32Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の LegalOn ロゴ 01 黒版です。",
      driveId: "12tVcF-sYWtcTVvCenPNdQcCXjDaxtE-6",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "legalon-professionalai-logo-01-white-png",
      assetGroupId: "legalon-professionalai-logo-01",
      title: "ProfessionalAI Logo LegalOn 01",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:55:28Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の LegalOn ロゴ 01 白版です。",
      driveId: "17SgMEzk6N1Dl51Iy7xnNmxaYNTKmhVc_",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "legalon-professionalai-logo-02-black-ai",
      assetGroupId: "legalon-professionalai-logo-02",
      title: "ProfessionalAI Logo LegalOn 02",
      brand: "LegalOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:13:08Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の LegalOn ロゴ 02 黒版 AI データです。",
      driveId: "1qycZngxUS8eTPl1h7PnSbbv5XWEFs7hZ",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "legalon-professionalai-logo-02-white-ai",
      assetGroupId: "legalon-professionalai-logo-02",
      title: "ProfessionalAI Logo LegalOn 02",
      brand: "LegalOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:14:20Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の LegalOn ロゴ 02 白版 AI データです。",
      driveId: "1y0slTvbIxfoQwLkJajWk21c6edTMaTU5",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "legalon-professionalai-logo-02-black-png",
      assetGroupId: "legalon-professionalai-logo-02",
      title: "ProfessionalAI Logo LegalOn 02",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:31:30Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の LegalOn ロゴ 02 黒版です。",
      driveId: "1N08DOTrl1elONnCYz3aycDvQGtvGEuKA",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "legalon-professionalai-logo-02-white-png",
      assetGroupId: "legalon-professionalai-logo-02",
      title: "ProfessionalAI Logo LegalOn 02",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:55:28Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の LegalOn ロゴ 02 白版です。",
      driveId: "1BjnHd6kiQCj1ZNKrksShHzCIpZ-D7szw",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "legalon-professionalai-logo-03-black-ai",
      assetGroupId: "legalon-professionalai-logo-03",
      title: "ProfessionalAI Logo LegalOn 03",
      brand: "LegalOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:12:47Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の LegalOn ロゴ 03 黒版 AI データです。",
      driveId: "1Q2gopa_XfvSGwJjzx-E7X7Nz_ucLjMQ2",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "legalon-professionalai-logo-03-white-ai",
      assetGroupId: "legalon-professionalai-logo-03",
      title: "ProfessionalAI Logo LegalOn 03",
      brand: "LegalOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:14:51Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の LegalOn ロゴ 03 白版 AI データです。",
      driveId: "1B-y9v7YJogrqLcmM9fWcF1I85zdIlM8a",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "legalon-professionalai-logo-03-black-png",
      assetGroupId: "legalon-professionalai-logo-03",
      title: "ProfessionalAI Logo LegalOn 03",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:31:30Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の LegalOn ロゴ 03 黒版です。",
      driveId: "1W5_qUI-qQrp5nBz1igcLkvHzM-56CTdq",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "legalon-professionalai-logo-03-white-png",
      assetGroupId: "legalon-professionalai-logo-03",
      title: "ProfessionalAI Logo LegalOn 03",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:55:28Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の LegalOn ロゴ 03 白版です。",
      driveId: "1BoQnwFv8AdHx2YdfuSMa1bBTIZHpD-X0",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "legalon-professionalai-logo-04-black-ai",
      assetGroupId: "legalon-professionalai-logo-04",
      title: "ProfessionalAI Logo LegalOn 04",
      brand: "LegalOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:12:08Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の LegalOn ロゴ 04 黒版 AI データです。",
      driveId: "1bad4yJvhgPJ_utNDudqj9UOiV-q6L27w",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "legalon-professionalai-logo-04-white-ai",
      assetGroupId: "legalon-professionalai-logo-04",
      title: "ProfessionalAI Logo LegalOn 04",
      brand: "LegalOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:18:52Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の LegalOn ロゴ 04 白版 AI データです。",
      driveId: "1HZSLcLFKXYrrmgeFD6yAXai4LYf98N5s",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "legalon-professionalai-logo-04-black-png",
      assetGroupId: "legalon-professionalai-logo-04",
      title: "ProfessionalAI Logo LegalOn 04",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:31:32Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の LegalOn ロゴ 04 黒版です。",
      driveId: "1ac7y-fmZt6crSgu6KNi8QImafH5u_l9K",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "legalon-professionalai-logo-04-white-png",
      assetGroupId: "legalon-professionalai-logo-04",
      title: "ProfessionalAI Logo LegalOn 04",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:55:28Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の LegalOn ロゴ 04 白版です。",
      driveId: "11cEpcv585teAXtkM-wXCQAAKlNCulVaL",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "legalon-logo-horizontal-black-v1-png",
      assetGroupId: "legalon-logo-horizontal-black",
      title: "LegalOn Logo Horizontal Black (v1)",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "deprecated",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["—"],
      updatedAt: "2025-11-20T09:00:00Z",
      previousVersionId: null,
      replacedBy: "legalon-logo-horizontal-black-png",
      thumbnailColor: "light",
      description: "旧版の黒横組みロゴ。新しい current 版へ置き換え済みです。",
      driveId: "1QbJ8JJ4aMbFxHinpF6f5Yyuly4uo7XVg",
    }),
    makeAsset({
      id: "legalon-jp-event-booth-reference",
      assetGroupId: "legalon-jp-event-booth-reference",
      title: "LegalOn JP Event Booth Reference",
      brand: "LegalOn",
      fileFormat: "PDF",
      status: "archived",
      recommended: false,
      locale: "JP",
      assetType: "営業資料素材",
      usage: ["イベント"],
      updatedAt: "2025-10-19T08:00:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "イベントブース参考資料のアーカイブ版。検索でのみ参照する想定です。",
      driveUrl: "https://drive.google.com/drive/search?q=LegalOn%20JP%20Event%20Booth%20Reference",
    }),
    makeAsset({
      id: "legalon-jp-sales-deck-template",
      assetGroupId: "legalon-jp-sales-deck-template",
      title: "LegalOn JP Sales Deck Template",
      brand: "LegalOn",
      fileFormat: "PDF",
      status: "current",
      recommended: true,
      locale: "JP",
      assetType: "テンプレート",
      usage: ["営業提案"],
      updatedAt: "2026-03-28T08:00:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "日本向け営業提案テンプレート。社内説明や提案のたたき台として使いやすい版です。",
      driveUrl: "https://drive.google.com/drive/search?q=LegalOn%20JP%20Sales%20Deck%20Template",
    }),
    makeAsset({
      id: "legalon-presentation-template-ppt",
      assetGroupId: "legalon-presentation-template",
      title: "LegalOn Presentation Template",
      brand: "LegalOn",
      fileFormat: "PPT",
      status: "current",
      recommended: true,
      locale: "Global",
      assetType: "テンプレート",
      usage: ["営業提案", "社内資料"],
      updatedAt: "2026-04-22T09:00:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "LegalOn の PowerPoint テンプレートです。提案資料や社内説明資料の下敷きとして使いやすい版です。",
      driveId: "1fLx5Q6x-2mqNKrazPtgIv7S2L9EeEcNP",
    }),
    makeAsset({
      id: "governon-presentation-template-ppt",
      assetGroupId: "governon-presentation-template",
      title: "GovernOn Presentation Template",
      brand: "GovernOn",
      fileFormat: "PPT",
      status: "current",
      recommended: true,
      locale: "Global",
      assetType: "テンプレート",
      usage: ["営業提案", "社内資料"],
      updatedAt: "2026-04-22T09:00:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "GovernOn の PowerPoint テンプレートです。営業提案や社内向け説明資料に展開しやすい版です。",
      driveId: "1ljlEaFQN1s1SbqZaoDwMPtJSW49hqjC4",
    }),
    makeAsset({
      id: "workon-presentation-template-ppt",
      assetGroupId: "workon-presentation-template",
      title: "WorkOn Presentation Template",
      brand: "WorkOn",
      fileFormat: "PPT",
      status: "current",
      recommended: true,
      locale: "Global",
      assetType: "テンプレート",
      usage: ["営業提案", "社内資料"],
      updatedAt: "2026-04-22T09:00:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "WorkOn の PowerPoint テンプレートです。提案資料やプロダクト紹介資料のたたき台として使えます。",
      driveId: "11KLR5hrpC6viSTtFi_bUmxgL7UoniaCu",
    }),
    makeAsset({
      id: "dealon-presentation-template-ppt",
      assetGroupId: "dealon-presentation-template",
      title: "DealOn Presentation Template",
      brand: "DealOn",
      fileFormat: "PPT",
      status: "current",
      recommended: true,
      locale: "Global",
      assetType: "テンプレート",
      usage: ["営業提案", "社内資料"],
      updatedAt: "2026-04-22T09:00:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "DealOn の PowerPoint テンプレートです。社内説明や提案書作成のベースとして扱いやすい版です。",
      driveId: "1zIBUTllNz0iZBbnYsls6SZ6nHJBtroUS",
    }),
    makeAsset({
      id: "cxon-presentation-template-ppt",
      assetGroupId: "cxon-presentation-template",
      title: "CXOn Presentation Template",
      brand: "CXOn",
      fileFormat: "PPT",
      status: "current",
      recommended: true,
      locale: "Global",
      assetType: "テンプレート",
      usage: ["営業提案", "社内資料"],
      updatedAt: "2026-04-22T09:00:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "CXOn の PowerPoint テンプレートです。説明資料や営業用デッキをすばやく組み立てる用途に向いています。",
      driveId: "1LU26R6liH8h-Hz0uICeBhU5ILo3poCdA",
    }),
    makeAsset({
      id: "legalon-brand-guidelines-pdf",
      assetGroupId: "legalon-brand-guidelines",
      title: "LegalOn Brand Guidelines",
      brand: "LegalOn",
      fileFormat: "PDF",
      status: "current",
      recommended: true,
      locale: "Global",
      assetType: "ガイドライン",
      usage: ["社内資料"],
      updatedAt: "2026-04-01T09:20:00Z",
      previousVersionId: "legalon-brand-guidelines-v1-pdf",
      replacedBy: null,
      thumbnailColor: "light",
      description: "ブランド運用の基準となる最新版ガイドラインです。社内配布の中心アセットとして想定しています。",
      driveUrl: "https://drive.google.com/drive/search?q=LegalOn%20Brand%20Guidelines",
    }),
    makeAsset({
      id: "legalon-brand-guidelines-v1-pdf",
      assetGroupId: "legalon-brand-guidelines",
      title: "LegalOn Brand Guidelines (v1)",
      brand: "LegalOn",
      fileFormat: "PDF",
      status: "deprecated",
      recommended: false,
      locale: "Global",
      assetType: "ガイドライン",
      usage: ["—"],
      updatedAt: "2025-10-28T09:20:00Z",
      previousVersionId: null,
      replacedBy: "legalon-brand-guidelines-pdf",
      thumbnailColor: "dark",
      description: "旧版ガイドラインです。最新版への案内を明示する想定です。",
      driveUrl: "https://drive.google.com/drive/search?q=LegalOn%20Brand%20Guidelines%20v1",
    }),
    makeAsset({
      id: "legalon-sns-banner-kit-png",
      assetGroupId: "legalon-sns-banner-kit",
      title: "LegalOn SNS Banner Kit",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "JP",
      assetType: "営業資料素材",
      usage: ["SNS"],
      updatedAt: "2026-03-12T09:00:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "SNS バナー配布用の素材セット。告知やキャンペーンでの利用を想定しています。",
      driveUrl: "https://drive.google.com/drive/search?q=LegalOn%20SNS%20Banner%20Kit",
    }),
    makeAsset({
      id: "legalon-3d-visual-f-png",
      assetGroupId: "legalon-3d-visual",
      title: "LegalOn_3D_F",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "3D Visual",
      usage: ["社内資料", "Webサイト"],
      updatedAt: "2026-04-03T12:35:18Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "LegalOn の3D Visual素材です。",
      driveId: "1cMFZQyN21f8SJBLRWJ0l4q37gdYDt6gG",
      driveUrl: "https://drive.google.com/file/d/1cMFZQyN21f8SJBLRWJ0l4q37gdYDt6gG/view?usp=drivesdk",
    }),
    makeAsset({
      id: "legalon-3d-visual-b-png",
      assetGroupId: "legalon-3d-visual",
      title: "LegalOn_3D_B",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "3D Visual",
      usage: ["社内資料", "Webサイト"],
      updatedAt: "2026-04-03T12:35:21Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "LegalOn の3D Visual素材です。",
      driveId: "1RqqZBg-9oQGEvRdMrXYhhm1G-QemhowY",
      driveUrl: "https://drive.google.com/file/d/1RqqZBg-9oQGEvRdMrXYhhm1G-QemhowY/view?usp=drivesdk",
    }),
    makeAsset({
      id: "legalon-3d-visual-c-png",
      assetGroupId: "legalon-3d-visual",
      title: "LegalOn_3D_C",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "3D Visual",
      usage: ["社内資料", "Webサイト"],
      updatedAt: "2026-04-03T12:35:27Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "LegalOn の3D Visual素材です。",
      driveId: "1CXiZtB2mPXibSN8VEeRQzkciwkaq2m5D",
      driveUrl: "https://drive.google.com/file/d/1CXiZtB2mPXibSN8VEeRQzkciwkaq2m5D/view?usp=drivesdk",
    }),
    makeAsset({
      id: "legalon-3d-visual-a-png",
      assetGroupId: "legalon-3d-visual",
      title: "LegalOn_3D_A",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "3D Visual",
      usage: ["社内資料", "Webサイト"],
      updatedAt: "2026-04-03T12:35:36Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "LegalOn の3D Visual素材です。",
      driveId: "1EMFwBvfIYoatODPfZo5nZvyROpb1NvNt",
      driveUrl: "https://drive.google.com/file/d/1EMFwBvfIYoatODPfZo5nZvyROpb1NvNt/view?usp=drivesdk",
    }),
    makeAsset({
      id: "legalon-3d-visual-d-png",
      assetGroupId: "legalon-3d-visual",
      title: "LegalOn_3D_D",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "3D Visual",
      usage: ["社内資料", "Webサイト"],
      updatedAt: "2026-04-03T12:35:39Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "LegalOn の3D Visual素材です。",
      driveId: "16n8GTOg83U0TwjSIfvlfaxBd2ZE9T4Vy",
      driveUrl: "https://drive.google.com/file/d/16n8GTOg83U0TwjSIfvlfaxBd2ZE9T4Vy/view?usp=drivesdk",
    }),
    makeAsset({
      id: "legalon-3d-visual-e-png",
      assetGroupId: "legalon-3d-visual",
      title: "LegalOn_3D_E",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "3D Visual",
      usage: ["社内資料", "Webサイト"],
      updatedAt: "2026-04-03T12:35:45Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "LegalOn の3D Visual素材です。",
      driveId: "1GflCCZ2Cz7ff8Oz1bIma3MAbVjhMN4Zi",
      driveUrl: "https://drive.google.com/file/d/1GflCCZ2Cz7ff8Oz1bIma3MAbVjhMN4Zi/view?usp=drivesdk",
    }),
    makeAsset({
      id: "legalon-3d-visual-screen-20251210-191628-png",
      assetGroupId: "legalon-3d-visual-trimming",
      title: "スクリーンショット 2025-12-10 19.16.28",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "3D Visual",
      usage: ["社内資料"],
      updatedAt: "2026-04-03T12:35:53Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "LegalOn 3D Visual のトリミング例です。",
      driveId: "13WC9HegM_Nv7jXW-HdSwTIt2G1cblN8e",
      driveUrl: "https://drive.google.com/file/d/13WC9HegM_Nv7jXW-HdSwTIt2G1cblN8e/view?usp=drivesdk",
    }),
    makeAsset({
      id: "legalon-3d-visual-screen-20251210-191637-png",
      assetGroupId: "legalon-3d-visual-trimming",
      title: "スクリーンショット 2025-12-10 19.16.37",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "3D Visual",
      usage: ["社内資料"],
      updatedAt: "2026-04-03T12:35:50Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "LegalOn 3D Visual のトリミング例です。",
      driveId: "13A59ARRsmdVlhEA-7YYuDcDjZ1Dt3MIh",
      driveUrl: "https://drive.google.com/file/d/13A59ARRsmdVlhEA-7YYuDcDjZ1Dt3MIh/view?usp=drivesdk",
    }),
    makeAsset({
      id: "legalon-square-icon-svg",
      assetGroupId: "legalon-square-icon",
      title: "LegalOn_square-icon",
      brand: "LegalOn",
      fileFormat: "SVG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-02-15T18:14:36Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "LegalOn のスクエアアイコンです。",
      driveId: "1WoWNS1jTndaMWnuIGSBiSarUs9lITYIJ",
      driveUrl: "https://drive.google.com/file/d/1WoWNS1jTndaMWnuIGSBiSarUs9lITYIJ/view?usp=drivesdk",
    }),
    makeAsset({
      id: "legalon-square-icon-bgink-svg",
      assetGroupId: "legalon-square-icon",
      title: "LegalOn_square-icon_bgink",
      brand: "LegalOn",
      fileFormat: "SVG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-02-15T18:14:36Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "LegalOn のスクエアアイコン背景付き版です。",
      driveId: "1VnztB8b6XvRGPxE8OYiEgIR0ci4Ke-5v",
      driveUrl: "https://drive.google.com/file/d/1VnztB8b6XvRGPxE8OYiEgIR0ci4Ke-5v/view?usp=drivesdk",
    }),
    makeAsset({
      id: "legalon-square-icon-ai",
      assetGroupId: "legalon-square-icon",
      title: "LegalOn_square-icon",
      brand: "LegalOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "印刷"],
      updatedAt: "2026-02-15T18:34:42Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "LegalOn のスクエアアイコン AI 版です。",
      driveId: "1--F5zqOnmVKINGt-BdiAuCjJdiz2RGw0",
      driveUrl: "https://drive.google.com/file/d/1--F5zqOnmVKINGt-BdiAuCjJdiz2RGw0/view?usp=drivesdk",
    }),
    makeAsset({
      id: "legalon-square-icon-png",
      assetGroupId: "legalon-square-icon",
      title: "LegalOn_square-icon",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-02-15T18:14:36Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "LegalOn のスクエアアイコン PNG 版です。",
      driveId: "13lTL4T8B88Thk142JJLZOEvY1z-gF39j",
      driveUrl: "https://drive.google.com/file/d/13lTL4T8B88Thk142JJLZOEvY1z-gF39j/view?usp=drivesdk",
    }),
    makeAsset({
      id: "legalon-square-icon-bgink-png",
      assetGroupId: "legalon-square-icon",
      title: "LegalOn_square-icon_bgink",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-02-15T18:14:36Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "LegalOn のスクエアアイコン背景付き PNG 版です。",
      driveId: "1vuQ7lJhqzlFL6pkQZXV4vT6FjrLulfFI",
      driveUrl: "https://drive.google.com/file/d/1vuQ7lJhqzlFL6pkQZXV4vT6FjrLulfFI/view?usp=drivesdk",
    }),
    makeAsset({
      id: "legalon-square-icon-jpg",
      assetGroupId: "legalon-square-icon",
      title: "LegalOn_square-icon",
      brand: "LegalOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-02-15T18:14:36Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "LegalOn のスクエアアイコン JPG 版です。",
      driveId: "1tZudP9dso_XZY1EETBTqAsvxtian4Sas",
      driveUrl: "https://drive.google.com/file/d/1tZudP9dso_XZY1EETBTqAsvxtian4Sas/view?usp=drivesdk",
    }),
    makeAsset({
      id: "legalon-square-icon-bgink-jpg",
      assetGroupId: "legalon-square-icon",
      title: "LegalOn_square-icon_bgink",
      brand: "LegalOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-02-15T18:17:48Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "LegalOn のスクエアアイコン背景付き JPG 版です。",
      driveId: "1dPnsgCQwbXS_5PyjqwfaztFjWvwqplpJ",
      driveUrl: "https://drive.google.com/file/d/1dPnsgCQwbXS_5PyjqwfaztFjWvwqplpJ/view?usp=drivesdk",
    }),
    makeAsset({
      id: "legalon-square-icon-compact-svg",
      assetGroupId: "legalon-square-icon-compact",
      title: "LegalOn_square-icon_compact",
      brand: "LegalOn",
      fileFormat: "SVG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-02-15T18:14:36Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "LegalOn のスクエアアイコン compact 版です。",
      driveId: "1CVD51Av2XCUffmd0qwkNpKDSOaJDAza8",
      driveUrl: "https://drive.google.com/file/d/1CVD51Av2XCUffmd0qwkNpKDSOaJDAza8/view?usp=drivesdk",
    }),
    makeAsset({
      id: "legalon-square-icon-compact-bgink-svg",
      assetGroupId: "legalon-square-icon-compact",
      title: "LegalOn_square-icon_compact_bgink",
      brand: "LegalOn",
      fileFormat: "SVG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-02-15T18:14:36Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "LegalOn のスクエアアイコン compact 背景付き SVG 版です。",
      driveId: "1RIHDESPFGd7D5FhDtYk8bzX35WR9IZ9c",
      driveUrl: "https://drive.google.com/file/d/1RIHDESPFGd7D5FhDtYk8bzX35WR9IZ9c/view?usp=drivesdk",
    }),
    makeAsset({
      id: "legalon-square-icon-compact-png",
      assetGroupId: "legalon-square-icon-compact",
      title: "LegalOn_square-icon_compact",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-02-15T18:14:36Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "LegalOn のスクエアアイコン compact PNG 版です。",
      driveId: "1KZQT4bhrFWlboogyYxPi6HV2Rc6Fe4Ij",
      driveUrl: "https://drive.google.com/file/d/1KZQT4bhrFWlboogyYxPi6HV2Rc6Fe4Ij/view?usp=drivesdk",
    }),
    makeAsset({
      id: "legalon-square-icon-compact-bgink-png",
      assetGroupId: "legalon-square-icon-compact",
      title: "LegalOn_square-icon_compact_bgink",
      brand: "LegalOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-02-15T18:14:36Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "LegalOn のスクエアアイコン compact 背景付き PNG 版です。",
      driveId: "124_tSHI5tXuAeB4_M6iEFKj-Fnvj-hhK",
      driveUrl: "https://drive.google.com/file/d/124_tSHI5tXuAeB4_M6iEFKj-Fnvj-hhK/view?usp=drivesdk",
    }),
    makeAsset({
      id: "legalon-square-icon-compact-jpg",
      assetGroupId: "legalon-square-icon-compact",
      title: "LegalOn_square-icon_compact",
      brand: "LegalOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-02-15T18:14:36Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "LegalOn のスクエアアイコン compact JPG 版です。",
      driveId: "1ayGsFp5ah91b9HWlRovcGfeDL2RqJOkK",
      driveUrl: "https://drive.google.com/file/d/1ayGsFp5ah91b9HWlRovcGfeDL2RqJOkK/view?usp=drivesdk",
    }),
    makeAsset({
      id: "legalon-square-icon-compact-bgink-jpg",
      assetGroupId: "legalon-square-icon-compact",
      title: "LegalOn_square-icon_compact_bgink",
      brand: "LegalOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-02-15T18:17:48Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "LegalOn のスクエアアイコン compact 背景付き JPG 版です。",
      driveId: "1dPnsgCQwbXS_5PyjqwfaztFjWvwqplpJ",
      driveUrl: "https://drive.google.com/file/d/1dPnsgCQwbXS_5PyjqwfaztFjWvwqplpJ/view?usp=drivesdk",
    }),
    makeAsset({
      id: "governon-square-icon-svg",
      assetGroupId: "governon-square-icon",
      title: "GovernOn_square-icon",
      brand: "GovernOn",
      fileFormat: "SVG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-02-15T18:10:48Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "GovernOn のスクエアアイコンです。",
      driveId: "18M1-dyjvSk4hUDB3TyaKSEA-dXuHzOdE",
      driveUrl: "https://drive.google.com/file/d/18M1-dyjvSk4hUDB3TyaKSEA-dXuHzOdE/view?usp=drivesdk",
    }),
    makeAsset({
      id: "governon-square-icon-bgink-svg",
      assetGroupId: "governon-square-icon",
      title: "GovernOn_square-icon_bk",
      brand: "GovernOn",
      fileFormat: "SVG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-02-15T18:10:48Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "GovernOn のスクエアアイコン背景付き版です。",
      driveId: "1lF-I615F46UnNQJHNA4T7cPj3JtP-Fbk",
      driveUrl: "https://drive.google.com/file/d/1lF-I615F46UnNQJHNA4T7cPj3JtP-Fbk/view?usp=drivesdk",
    }),
    makeAsset({
      id: "governon-square-icon-ai",
      assetGroupId: "governon-square-icon",
      title: "GovernOn_square-icon",
      brand: "GovernOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "印刷"],
      updatedAt: "2026-02-15T18:08:16Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "GovernOn のスクエアアイコン AI 版です。",
      driveId: "1sKUm7YG_uMQKfH-54sQ915YOBjmcKYrH",
      driveUrl: "https://drive.google.com/file/d/1sKUm7YG_uMQKfH-54sQ915YOBjmcKYrH/view?usp=drivesdk",
    }),
    makeAsset({
      id: "governon-square-icon-png",
      assetGroupId: "governon-square-icon",
      title: "GovernOn_square-icon",
      brand: "GovernOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-01-14T00:12:24Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "GovernOn のスクエアアイコン PNG 版です。",
      driveId: "1x65FK418XNFLh8dKWHtZQ7XYW5djW3cK",
      driveUrl: "https://drive.google.com/file/d/1x65FK418XNFLh8dKWHtZQ7XYW5djW3cK/view?usp=drivesdk",
    }),
    makeAsset({
      id: "governon-square-icon-bgink-png",
      assetGroupId: "governon-square-icon",
      title: "GovernOn_square-icon_bk",
      brand: "GovernOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-01-14T00:12:34Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "GovernOn のスクエアアイコン背景付き PNG 版です。",
      driveId: "1ikartHfYwlSlKYFjSbtRO1FRoHNtrLZK",
      driveUrl: "https://drive.google.com/file/d/1ikartHfYwlSlKYFjSbtRO1FRoHNtrLZK/view?usp=drivesdk",
    }),
    makeAsset({
      id: "governon-square-icon-jpg",
      assetGroupId: "governon-square-icon",
      title: "GovernOn_square-icon",
      brand: "GovernOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-01-14T00:12:46Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "GovernOn のスクエアアイコン JPG 版です。",
      driveId: "1fE0cI-Vb38tP07yBLKCaWecjqco2_kPW",
      driveUrl: "https://drive.google.com/file/d/1fE0cI-Vb38tP07yBLKCaWecjqco2_kPW/view?usp=drivesdk",
    }),
    makeAsset({
      id: "governon-square-icon-bgink-jpg",
      assetGroupId: "governon-square-icon",
      title: "GovernOn_square-icon_bk",
      brand: "GovernOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-01-14T00:13:02Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "GovernOn のスクエアアイコン背景付き JPG 版です。",
      driveId: "1nXV1b7ynGf13lV9c8f8EP1amgo1Hpu94",
      driveUrl: "https://drive.google.com/file/d/1nXV1b7ynGf13lV9c8f8EP1amgo1Hpu94/view?usp=drivesdk",
    }),
    makeAsset({
      id: "governon-square-icon-compact-svg",
      assetGroupId: "governon-square-icon-compact",
      title: "GovernOn_square-icon_compact",
      brand: "GovernOn",
      fileFormat: "SVG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-02-15T18:08:40Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "GovernOn のスクエアアイコン compact 版です。",
      driveId: "183GVvxphqJGFxPTgT5HZ3t2LiE6bGsc9",
      driveUrl: "https://drive.google.com/file/d/183GVvxphqJGFxPTgT5HZ3t2LiE6bGsc9/view?usp=drivesdk",
    }),
    makeAsset({
      id: "governon-square-icon-compact-bgink-svg",
      assetGroupId: "governon-square-icon-compact",
      title: "GovernOn_square-icon_compact_bk",
      brand: "GovernOn",
      fileFormat: "SVG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-02-15T18:08:40Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "GovernOn のスクエアアイコン compact 背景付き SVG 版です。",
      driveId: "1vQDxibkXBPzn4Kw1qxdq4Z7jK5spvkAr",
      driveUrl: "https://drive.google.com/file/d/1vQDxibkXBPzn4Kw1qxdq4Z7jK5spvkAr/view?usp=drivesdk",
    }),
    makeAsset({
      id: "governon-square-icon-compact-png",
      assetGroupId: "governon-square-icon-compact",
      title: "GovernOn_square-icon_compact",
      brand: "GovernOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-02-15T18:08:40Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "GovernOn のスクエアアイコン compact PNG 版です。",
      driveId: "1142Vzwx-nxR4dA6LQ5aBk1ED4tUKquFl",
      driveUrl: "https://drive.google.com/file/d/1142Vzwx-nxR4dA6LQ5aBk1ED4tUKquFl/view?usp=drivesdk",
    }),
    makeAsset({
      id: "governon-square-icon-compact-bgink-png",
      assetGroupId: "governon-square-icon-compact",
      title: "GovernOn_square-icon_compact_bk",
      brand: "GovernOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-02-15T18:08:40Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "GovernOn のスクエアアイコン compact 背景付き PNG 版です。",
      driveId: "1dBXhwahWdyOu7V5kzJxROhHxZdzOJV7B",
      driveUrl: "https://drive.google.com/file/d/1dBXhwahWdyOu7V5kzJxROhHxZdzOJV7B/view?usp=drivesdk",
    }),
    makeAsset({
      id: "governon-square-icon-compact-jpg",
      assetGroupId: "governon-square-icon-compact",
      title: "GovernOn_square-icon_compact",
      brand: "GovernOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-02-15T18:08:40Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "GovernOn のスクエアアイコン compact JPG 版です。",
      driveId: "1USTiGuTZ4_HPBA6Foi_BPdPBDnI47qgJ",
      driveUrl: "https://drive.google.com/file/d/1USTiGuTZ4_HPBA6Foi_BPdPBDnI47qgJ/view?usp=drivesdk",
    }),
    makeAsset({
      id: "governon-square-icon-compact-bgink-jpg",
      assetGroupId: "governon-square-icon-compact",
      title: "GovernOn_square-icon_compact_bk",
      brand: "GovernOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-02-15T18:09:52Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "GovernOn のスクエアアイコン compact 背景付き JPG 版です。",
      driveId: "1X6v77HEbTDKiXANIUz2FuGIefZVBCuY9",
      driveUrl: "https://drive.google.com/file/d/1X6v77HEbTDKiXANIUz2FuGIefZVBCuY9/view?usp=drivesdk",
    }),
    makeAsset({
      id: "workon-square-icon-svg",
      assetGroupId: "workon-square-icon",
      title: "WorkOn_square-icon",
      brand: "WorkOn",
      fileFormat: "SVG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T08:47:04Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "WorkOn のスクエアアイコンです。",
      driveId: "1_k6Gx11mEX6AH4_8CBYw4WUDhKf7FR0r",
      driveUrl: "https://drive.google.com/file/d/1_k6Gx11mEX6AH4_8CBYw4WUDhKf7FR0r/view?usp=drivesdk",
    }),
    makeAsset({
      id: "workon-square-icon-bgink-svg",
      assetGroupId: "workon-square-icon",
      title: "WorkOn_square-icon_bk",
      brand: "WorkOn",
      fileFormat: "SVG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T08:47:03Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "WorkOn のスクエアアイコン背景付き版です。",
      driveId: "1ReTR_RSh9MbVU5dc6NKwnoc5nk9RqlvR",
      driveUrl: "https://drive.google.com/file/d/1ReTR_RSh9MbVU5dc6NKwnoc5nk9RqlvR/view?usp=drivesdk",
    }),
    makeAsset({
      id: "workon-square-icon-ai",
      assetGroupId: "workon-square-icon",
      title: "WorkOn_square-icon",
      brand: "WorkOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "印刷"],
      updatedAt: "2026-04-09T08:46:51Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "WorkOn のスクエアアイコン AI 版です。",
      driveId: "1_6G1642Id2u7Ntv9vRgec8DKX-IyiZmD",
      driveUrl: "https://drive.google.com/file/d/1_6G1642Id2u7Ntv9vRgec8DKX-IyiZmD/view?usp=drivesdk",
    }),
    makeAsset({
      id: "workon-square-icon-png",
      assetGroupId: "workon-square-icon",
      title: "WorkOn_square-icon",
      brand: "WorkOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T08:46:56Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "WorkOn のスクエアアイコン PNG 版です。",
      driveId: "1HpjYNEHcyO8R0WgytIovVPV8yKIQOmLj",
      driveUrl: "https://drive.google.com/file/d/1HpjYNEHcyO8R0WgytIovVPV8yKIQOmLj/view?usp=drivesdk",
    }),
    makeAsset({
      id: "workon-square-icon-bgink-png",
      assetGroupId: "workon-square-icon",
      title: "WorkOn_square-icon_bk",
      brand: "WorkOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T08:46:54Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "WorkOn のスクエアアイコン背景付き PNG 版です。",
      driveId: "1l75HdOS8tMI04xX8m1sdAVJsKUOdlDf_",
      driveUrl: "https://drive.google.com/file/d/1l75HdOS8tMI04xX8m1sdAVJsKUOdlDf_/view?usp=drivesdk",
    }),
    makeAsset({
      id: "workon-square-icon-jpg",
      assetGroupId: "workon-square-icon",
      title: "WorkOn_square-icon",
      brand: "WorkOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T08:47:14Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "WorkOn のスクエアアイコン JPG 版です。",
      driveId: "1zm4hEynVExRVFIx4D13ICwl_u-EnF9jw",
      driveUrl: "https://drive.google.com/file/d/1zm4hEynVExRVFIx4D13ICwl_u-EnF9jw/view?usp=drivesdk",
    }),
    makeAsset({
      id: "workon-square-icon-bgink-jpg",
      assetGroupId: "workon-square-icon",
      title: "WorkOn_square-icon_bk",
      brand: "WorkOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T08:47:12Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "WorkOn のスクエアアイコン背景付き JPG 版です。",
      driveId: "1kh2R7tW7bSiH8-YpwncPS8mgC9WYEsyd",
      driveUrl: "https://drive.google.com/file/d/1kh2R7tW7bSiH8-YpwncPS8mgC9WYEsyd/view?usp=drivesdk",
    }),
    makeAsset({
      id: "workon-square-icon-compact-svg",
      assetGroupId: "workon-square-icon-compact",
      title: "WorkOn_square-icon_compact",
      brand: "WorkOn",
      fileFormat: "SVG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T08:47:07Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "WorkOn のスクエアアイコン compact 版です。",
      driveId: "15THhvomvuRNA0B7pDLNZv4dmf_SZXN7-",
      driveUrl: "https://drive.google.com/file/d/15THhvomvuRNA0B7pDLNZv4dmf_SZXN7-/view?usp=drivesdk",
    }),
    makeAsset({
      id: "workon-square-icon-compact-bgink-svg",
      assetGroupId: "workon-square-icon-compact",
      title: "WorkOn_square-icon_compact_bk",
      brand: "WorkOn",
      fileFormat: "SVG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T08:47:09Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "WorkOn のスクエアアイコン compact 背景付き SVG 版です。",
      driveId: "1WNJ8t9tAz2wWUE9ZjLGOEBnQ3y8GoVSi",
      driveUrl: "https://drive.google.com/file/d/1WNJ8t9tAz2wWUE9ZjLGOEBnQ3y8GoVSi/view?usp=drivesdk",
    }),
    makeAsset({
      id: "workon-square-icon-compact-png",
      assetGroupId: "workon-square-icon-compact",
      title: "WorkOn_square-icon_compact",
      brand: "WorkOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T08:46:59Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "WorkOn のスクエアアイコン compact PNG 版です。",
      driveId: "1HBupmE4hjlpos6TooGwfR1bSzbxYTgkX",
      driveUrl: "https://drive.google.com/file/d/1HBupmE4hjlpos6TooGwfR1bSzbxYTgkX/view?usp=drivesdk",
    }),
    makeAsset({
      id: "workon-square-icon-compact-bgink-png",
      assetGroupId: "workon-square-icon-compact",
      title: "WorkOn_square-icon_compact_bk",
      brand: "WorkOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T08:47:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "WorkOn のスクエアアイコン compact 背景付き PNG 版です。",
      driveId: "17ah4jvlOxj6jxOscipGPNtzNN2Gu4Fy8",
      driveUrl: "https://drive.google.com/file/d/17ah4jvlOxj6jxOscipGPNtzNN2Gu4Fy8/view?usp=drivesdk",
    }),
    makeAsset({
      id: "workon-square-icon-compact-jpg",
      assetGroupId: "workon-square-icon-compact",
      title: "WorkOn_square-icon_compact",
      brand: "WorkOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T08:47:18Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "WorkOn のスクエアアイコン compact JPG 版です。",
      driveId: "1fSirUE8QjS04Yii1eZKbsZ1Xwlc6BK8d",
      driveUrl: "https://drive.google.com/file/d/1fSirUE8QjS04Yii1eZKbsZ1Xwlc6BK8d/view?usp=drivesdk",
    }),
    makeAsset({
      id: "workon-square-icon-compact-bgink-jpg",
      assetGroupId: "workon-square-icon-compact",
      title: "WorkOn_square-icon_compact_bk",
      brand: "WorkOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T08:47:17Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "WorkOn のスクエアアイコン compact 背景付き JPG 版です。",
      driveId: "1KQ5ob1T7nCHs7L0qr8P3PGS0wBaxSqe1",
      driveUrl: "https://drive.google.com/file/d/1KQ5ob1T7nCHs7L0qr8P3PGS0wBaxSqe1/view?usp=drivesdk",
    }),
    makeAsset({
      id: "dealon-square-icon-svg",
      assetGroupId: "dealon-square-icon",
      title: "DealOn_square-icon",
      brand: "DealOn",
      fileFormat: "SVG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T06:02:57Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "DealOn のスクエアアイコンです。",
      driveId: "1S52Y56Yh1WR_tcSL0xHt3sIMgghyXA2x",
      driveUrl: "https://drive.google.com/file/d/1S52Y56Yh1WR_tcSL0xHt3sIMgghyXA2x/view?usp=drivesdk",
    }),
    makeAsset({
      id: "dealon-square-icon-bgink-svg",
      assetGroupId: "dealon-square-icon",
      title: "DealOn_square-icon_bk",
      brand: "DealOn",
      fileFormat: "SVG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T06:02:56Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "DealOn のスクエアアイコン背景付き版です。",
      driveId: "10bzL8Wl_A8NtEmmMvn5tDsV__IHjCLVZ",
      driveUrl: "https://drive.google.com/file/d/10bzL8Wl_A8NtEmmMvn5tDsV__IHjCLVZ/view?usp=drivesdk",
    }),
    makeAsset({
      id: "dealon-square-icon-ai",
      assetGroupId: "dealon-square-icon",
      title: "DealOn_square-icon",
      brand: "DealOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "印刷"],
      updatedAt: "2026-04-09T06:02:51Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "DealOn のスクエアアイコン AI 版です。",
      driveId: "1gEsysh5CA8WRs3z091ZpDLWzROSxqMm7",
      driveUrl: "https://drive.google.com/file/d/1gEsysh5CA8WRs3z091ZpDLWzROSxqMm7/view?usp=drivesdk",
    }),
    makeAsset({
      id: "dealon-square-icon-png",
      assetGroupId: "dealon-square-icon",
      title: "DealOn_square-icon",
      brand: "DealOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T06:02:33Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "DealOn のスクエアアイコン PNG 版です。",
      driveId: "191Q3KzcF5h16Xxcl2B5v7JlV_xxP8CBL",
      driveUrl: "https://drive.google.com/file/d/191Q3KzcF5h16Xxcl2B5v7JlV_xxP8CBL/view?usp=drivesdk",
    }),
    makeAsset({
      id: "dealon-square-icon-bgink-png",
      assetGroupId: "dealon-square-icon",
      title: "DealOn_square-icon_bk",
      brand: "DealOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T06:02:32Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "DealOn のスクエアアイコン背景付き PNG 版です。",
      driveId: "1UD38LI3kiybJT09EwlzJXGfoTKmYVfyi",
      driveUrl: "https://drive.google.com/file/d/1UD38LI3kiybJT09EwlzJXGfoTKmYVfyi/view?usp=drivesdk",
    }),
    makeAsset({
      id: "dealon-square-icon-jpg",
      assetGroupId: "dealon-square-icon",
      title: "DealOn_square-icon",
      brand: "DealOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T06:02:44Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "DealOn のスクエアアイコン JPG 版です。",
      driveId: "19O0B88NiWO4rqgDyfSm_TkQPW_Sp3Mqm",
      driveUrl: "https://drive.google.com/file/d/19O0B88NiWO4rqgDyfSm_TkQPW_Sp3Mqm/view?usp=drivesdk",
    }),
    makeAsset({
      id: "dealon-square-icon-bgink-jpg",
      assetGroupId: "dealon-square-icon",
      title: "DealOn_square-icon_bk",
      brand: "DealOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T06:02:42Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "DealOn のスクエアアイコン背景付き JPG 版です。",
      driveId: "1fh642IwWBx_00d79HKFlWeFe5oNaVSuw",
      driveUrl: "https://drive.google.com/file/d/1fh642IwWBx_00d79HKFlWeFe5oNaVSuw/view?usp=drivesdk",
    }),
    makeAsset({
      id: "dealon-square-icon-compact-svg",
      assetGroupId: "dealon-square-icon-compact",
      title: "DealOn_square-icon_compact",
      brand: "DealOn",
      fileFormat: "SVG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T06:03:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "DealOn のスクエアアイコン compact 版です。",
      driveId: "18Jt9E-uBr1ep1W8FW_UOTJchkfO5zKt8",
      driveUrl: "https://drive.google.com/file/d/18Jt9E-uBr1ep1W8FW_UOTJchkfO5zKt8/view?usp=drivesdk",
    }),
    makeAsset({
      id: "dealon-square-icon-compact-bgink-svg",
      assetGroupId: "dealon-square-icon-compact",
      title: "DealOn_square-icon_compact_bk",
      brand: "DealOn",
      fileFormat: "SVG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T06:03:01Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "DealOn のスクエアアイコン compact 背景付き SVG 版です。",
      driveId: "11_QqMtf74PcsF2kzOYdKuHi_HLnJMi-d",
      driveUrl: "https://drive.google.com/file/d/11_QqMtf74PcsF2kzOYdKuHi_HLnJMi-d/view?usp=drivesdk",
    }),
    makeAsset({
      id: "dealon-square-icon-compact-png",
      assetGroupId: "dealon-square-icon-compact",
      title: "DealOn_square-icon_compact_color",
      brand: "DealOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T06:02:38Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "DealOn のスクエアアイコン compact PNG 版です。",
      driveId: "1_E6SD_fwzzTxDBM-QOfWnMnd6Bqs8QdF",
      driveUrl: "https://drive.google.com/file/d/1_E6SD_fwzzTxDBM-QOfWnMnd6Bqs8QdF/view?usp=drivesdk",
    }),
    makeAsset({
      id: "dealon-square-icon-compact-bgink-png",
      assetGroupId: "dealon-square-icon-compact",
      title: "DealOn_square-icon_compact_bk",
      brand: "DealOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T06:02:37Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "DealOn のスクエアアイコン compact 背景付き PNG 版です。",
      driveId: "1ySQVgTbWt_RzlEaO2-h67b_7DI334GoB",
      driveUrl: "https://drive.google.com/file/d/1ySQVgTbWt_RzlEaO2-h67b_7DI334GoB/view?usp=drivesdk",
    }),
    makeAsset({
      id: "dealon-square-icon-compact-jpg",
      assetGroupId: "dealon-square-icon-compact",
      title: "DealOn_square-icon_compact",
      brand: "DealOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T06:02:48Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "DealOn のスクエアアイコン compact JPG 版です。",
      driveId: "1dBbCfiNvxqDYhrc5e00S3TyOERXzyaLU",
      driveUrl: "https://drive.google.com/file/d/1dBbCfiNvxqDYhrc5e00S3TyOERXzyaLU/view?usp=drivesdk",
    }),
    makeAsset({
      id: "dealon-square-icon-compact-bgink-jpg",
      assetGroupId: "dealon-square-icon-compact",
      title: "DealOn_square-icon_compact_bk",
      brand: "DealOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T06:02:46Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "DealOn のスクエアアイコン compact 背景付き JPG 版です。",
      driveId: "12q0Sf8sJjNRRsbup3S1nrh6hBkfF_jQB",
      driveUrl: "https://drive.google.com/file/d/12q0Sf8sJjNRRsbup3S1nrh6hBkfF_jQB/view?usp=drivesdk",
    }),
    makeAsset({
      id: "cxon-square-icon-svg",
      assetGroupId: "cxon-square-icon",
      title: "CXOn_square-icon",
      brand: "CXOn",
      fileFormat: "SVG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T06:15:36Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "CXOn のスクエアアイコンです。",
      driveId: "1TQ-8FsPX83LqQpFPQwrkJJOP7LiQ2gFW",
      driveUrl: "https://drive.google.com/file/d/1TQ-8FsPX83LqQpFPQwrkJJOP7LiQ2gFW/view?usp=drivesdk",
    }),
    makeAsset({
      id: "cxon-square-icon-bgink-svg",
      assetGroupId: "cxon-square-icon",
      title: "CXOn_square-icon_bk",
      brand: "CXOn",
      fileFormat: "SVG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T06:15:37Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "CXOn のスクエアアイコン背景付き版です。",
      driveId: "1fTUzT9c3-cIkCpaEneNlmJXniLfqhb5c",
      driveUrl: "https://drive.google.com/file/d/1fTUzT9c3-cIkCpaEneNlmJXniLfqhb5c/view?usp=drivesdk",
    }),
    makeAsset({
      id: "cxon-square-icon-ai",
      assetGroupId: "cxon-square-icon",
      title: "CXOn_square-icon",
      brand: "CXOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "印刷"],
      updatedAt: "2026-04-09T06:15:54Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "CXOn のスクエアアイコン AI 版です。",
      driveId: "1im-nEqoNFM-hB1vODh4fu4ADLh_6Es6Q",
      driveUrl: "https://drive.google.com/file/d/1im-nEqoNFM-hB1vODh4fu4ADLh_6Es6Q/view?usp=drivesdk",
    }),
    makeAsset({
      id: "cxon-square-icon-png",
      assetGroupId: "cxon-square-icon",
      title: "CXOn_square-icon",
      brand: "CXOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T06:15:48Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "CXOn のスクエアアイコン PNG 版です。",
      driveId: "1tvRi0SDy3rgprxC8QbyMYB2x_Coo4fXY",
      driveUrl: "https://drive.google.com/file/d/1tvRi0SDy3rgprxC8QbyMYB2x_Coo4fXY/view?usp=drivesdk",
    }),
    makeAsset({
      id: "cxon-square-icon-bgink-png",
      assetGroupId: "cxon-square-icon",
      title: "CXOn_square-icon_bk",
      brand: "CXOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T06:15:46Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "CXOn のスクエアアイコン背景付き PNG 版です。",
      driveId: "1eRlU1v_s_Vm-x-WZyJfGjKBTEiUJnB4q",
      driveUrl: "https://drive.google.com/file/d/1eRlU1v_s_Vm-x-WZyJfGjKBTEiUJnB4q/view?usp=drivesdk",
    }),
    makeAsset({
      id: "cxon-square-icon-jpg",
      assetGroupId: "cxon-square-icon",
      title: "CXOn_square-icon",
      brand: "CXOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T06:16:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "CXOn のスクエアアイコン JPG 版です。",
      driveId: "1dfnW2eQZ6Frzeo4cB-K2dqWTnANuT4gl",
      driveUrl: "https://drive.google.com/file/d/1dfnW2eQZ6Frzeo4cB-K2dqWTnANuT4gl/view?usp=drivesdk",
    }),
    makeAsset({
      id: "cxon-square-icon-bgink-jpg",
      assetGroupId: "cxon-square-icon",
      title: "CXOn_square-icon_bk",
      brand: "CXOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T06:15:59Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "CXOn のスクエアアイコン背景付き JPG 版です。",
      driveId: "13BmEdzed7M3o_pLvfJIQ_QNGYEWGTPbF",
      driveUrl: "https://drive.google.com/file/d/13BmEdzed7M3o_pLvfJIQ_QNGYEWGTPbF/view?usp=drivesdk",
    }),
    makeAsset({
      id: "cxon-square-icon-compact-svg",
      assetGroupId: "cxon-square-icon-compact",
      title: "CXOn_square-icon_compact",
      brand: "CXOn",
      fileFormat: "SVG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T06:15:41Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "CXOn のスクエアアイコン compact 版です。",
      driveId: "11hBAOpOUXP3FCz2fKIiZ6BI7qtbyRroc",
      driveUrl: "https://drive.google.com/file/d/11hBAOpOUXP3FCz2fKIiZ6BI7qtbyRroc/view?usp=drivesdk",
    }),
    makeAsset({
      id: "cxon-square-icon-compact-bgink-svg",
      assetGroupId: "cxon-square-icon-compact",
      title: "CXOn_square-icon_compact_bk",
      brand: "CXOn",
      fileFormat: "SVG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T06:15:42Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "CXOn のスクエアアイコン compact 背景付き SVG 版です。",
      driveId: "1PFyiq279fgzz7AAmeObTbMXwHTEHRxO9",
      driveUrl: "https://drive.google.com/file/d/1PFyiq279fgzz7AAmeObTbMXwHTEHRxO9/view?usp=drivesdk",
    }),
    makeAsset({
      id: "cxon-square-icon-compact-png",
      assetGroupId: "cxon-square-icon-compact",
      title: "CXOn_square-icon_compact",
      brand: "CXOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T06:15:51Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "CXOn のスクエアアイコン compact PNG 版です。",
      driveId: "1QkBqWx2jx9BUtyY6ZK2zM4Vct8-Yr8kZ",
      driveUrl: "https://drive.google.com/file/d/1QkBqWx2jx9BUtyY6ZK2zM4Vct8-Yr8kZ/view?usp=drivesdk",
    }),
    makeAsset({
      id: "cxon-square-icon-compact-bgink-png",
      assetGroupId: "cxon-square-icon-compact",
      title: "CXOn_square-icon_compact_bk",
      brand: "CXOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T06:15:52Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "CXOn のスクエアアイコン compact 背景付き PNG 版です。",
      driveId: "1MqO1wveT-GL6CXVi7kjDvksJpIQrI09n",
      driveUrl: "https://drive.google.com/file/d/1MqO1wveT-GL6CXVi7kjDvksJpIQrI09n/view?usp=drivesdk",
    }),
    makeAsset({
      id: "cxon-square-icon-compact-jpg",
      assetGroupId: "cxon-square-icon-compact",
      title: "CXOn_square-icon_compact",
      brand: "CXOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T06:16:05Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "CXOn のスクエアアイコン compact JPG 版です。",
      driveId: "1HP8h6ap2fDlYbS7KDoOKqVKnYeVzPHq-",
      driveUrl: "https://drive.google.com/file/d/1HP8h6ap2fDlYbS7KDoOKqVKnYeVzPHq-/view?usp=drivesdk",
    }),
    makeAsset({
      id: "cxon-square-icon-compact-bgink-jpg",
      assetGroupId: "cxon-square-icon-compact",
      title: "CXOn_square-icon_compact_bk",
      brand: "CXOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "スクエアアイコン",
      usage: ["Webサイト", "ファビコン"],
      updatedAt: "2026-04-09T06:16:03Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "transparent",
      description: "CXOn のスクエアアイコン compact 背景付き JPG 版です。",
      driveId: "1x5VkTWa8EHjqb8r3MeFeFlosqc4VRJMl",
      driveUrl: "https://drive.google.com/file/d/1x5VkTWa8EHjqb8r3MeFeFlosqc4VRJMl/view?usp=drivesdk",
    }),

    // WorkOn
    makeAsset({
      id: "workon-logo-primary-ai",
      assetGroupId: "workon-logo-primary",
      title: "WorkOn Logo Primary",
      brand: "WorkOn",
      fileFormat: "AI",
      status: "current",
      recommended: true,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト", "印刷"],
      updatedAt: "2026-04-03T07:10:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "WorkOn の基準ロゴ。印刷・Web どちらでも使いやすいベクター版です。",
      driveId: "10GqYluADhJ7dZMBQR_RQtT4JY5GNHTk0",
      driveUrl: "https://drive.google.com/file/d/10GqYluADhJ7dZMBQR_RQtT4JY5GNHTk0/view?usp=drivesdk",
      colorVariant: "color",
      variantLabel: "Color",
    }),
    makeAsset({
      id: "workon-logo-primary-color-png",
      assetGroupId: "workon-logo-primary",
      title: "WorkOn Logo Primary",
      brand: "WorkOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-03T07:10:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "WorkOn のPNG版ロゴ。Web 実装での使い分けに向いた版です。",
      driveId: "1PlHYleoA7Q27OlrbiY9uVla-a2SJvNTu",
      driveUrl: "https://drive.google.com/file/d/1PlHYleoA7Q27OlrbiY9uVla-a2SJvNTu/view?usp=drivesdk",
      colorVariant: "color",
      variantLabel: "Color",
    }),
    makeAsset({
      id: "workon-logo-primary-black-png",
      assetGroupId: "workon-logo-primary",
      title: "WorkOn Logo Primary",
      brand: "WorkOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T05:54:38Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "WorkOn の黒版 PNG ロゴです。",
      driveId: "1zKj5mN-0wIlecKkskxRpczQ9pS169B7v",
      driveUrl: "https://drive.google.com/file/d/1zKj5mN-0wIlecKkskxRpczQ9pS169B7v/view?usp=drivesdk",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "workon-logo-primary-white-png",
      assetGroupId: "workon-logo-primary",
      title: "WorkOn Logo Primary",
      brand: "WorkOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T05:54:36Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "WorkOn の白版 PNG ロゴです。",
      driveId: "1WZr633pqm0Iu4_FJR9j8q8fX4rQguJI8",
      driveUrl: "https://drive.google.com/file/d/1WZr633pqm0Iu4_FJR9j8q8fX4rQguJI8/view?usp=drivesdk",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "workon-logo-primary-color-jpg",
      assetGroupId: "workon-logo-primary",
      title: "WorkOn Logo Primary",
      brand: "WorkOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T05:54:30Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "WorkOn のカラー JPG ロゴです。",
      driveId: "1n9IfpiIh6XAu3gGC73J7PbFVpdyek6kg",
      driveUrl: "https://drive.google.com/file/d/1n9IfpiIh6XAu3gGC73J7PbFVpdyek6kg/view?usp=drivesdk",
      colorVariant: "color",
      variantLabel: "Color",
    }),
    makeAsset({
      id: "workon-logo-primary-black-jpg",
      assetGroupId: "workon-logo-primary",
      title: "WorkOn Logo Primary",
      brand: "WorkOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T05:54:28Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "WorkOn の黒版 JPG ロゴです。",
      driveId: "1XpSCLhcRyHU4AiqPVXFfVDN8JBDtZAoK",
      driveUrl: "https://drive.google.com/file/d/1XpSCLhcRyHU4AiqPVXFfVDN8JBDtZAoK/view?usp=drivesdk",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "workon-logo-primary-white-light-jpg",
      assetGroupId: "workon-logo-primary",
      title: "WorkOn Logo Primary",
      brand: "WorkOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T05:54:26Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "WorkOn の白版 JPG ロゴです。明るい背景での確認用です。",
      driveId: "1XLroKYXPGxYfS4I_ICtvt_Nz6C2-Vw7W",
      driveUrl: "https://drive.google.com/file/d/1XLroKYXPGxYfS4I_ICtvt_Nz6C2-Vw7W/view?usp=drivesdk",
      colorVariant: "white",
      variantLabel: "White on Light",
    }),
    makeAsset({
      id: "workon-logo-primary-white-dark-jpg",
      assetGroupId: "workon-logo-primary",
      title: "WorkOn Logo Primary",
      brand: "WorkOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T05:54:24Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "WorkOn の白版 JPG ロゴです。暗い背景での確認用です。",
      driveId: "1-wae0eq2dFIUMeZa7HX_bQgmOraDRnLm",
      driveUrl: "https://drive.google.com/file/d/1-wae0eq2dFIUMeZa7HX_bQgmOraDRnLm/view?usp=drivesdk",
      colorVariant: "white",
      variantLabel: "White on Dark",
    }),
    makeAsset({
      id: "workon-sales-deck-logo-pack-png",
      assetGroupId: "workon-sales-deck-logo-pack",
      title: "WorkOn Sales Deck Logo Pack",
      brand: "WorkOn",
      fileFormat: "PNG",
      status: "current",
      recommended: true,
      locale: "Global",
      assetType: "営業資料素材",
      usage: ["営業提案"],
      updatedAt: "2026-03-30T11:15:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "営業提案資料用のロゴパック。営業現場でそのまま使いやすい構成です。",
      driveUrl: "https://drive.google.com/drive/search?q=WorkOn%20Sales%20Deck%20Logo%20Pack",
    }),
    makeAsset({
      id: "workon-brand-guidelines-pdf",
      assetGroupId: "workon-brand-guidelines",
      title: "WorkOn Brand Guidelines",
      brand: "WorkOn",
      fileFormat: "PDF",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ガイドライン",
      usage: ["社内資料"],
      updatedAt: "2026-03-15T09:30:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "WorkOn の運用ガイドライン。社内利用のための基準文書です。",
      driveId: "1MZk7t70TduO4fN63DyZejmB7OQt6T0Nr",
      driveUrl: "https://drive.google.com/file/d/1MZk7t70TduO4fN63DyZejmB7OQt6T0Nr/view?usp=drivesdk",
    }),
    makeAsset({
      id: "workon-professionalai-logo-01-black-ai",
      assetGroupId: "workon-professionalai-logo-01",
      title: "ProfessionalAI Logo WorkOn 01",
      brand: "WorkOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:25:42Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の WorkOn ロゴ 01 黒版 AI データです。",
      driveId: "1nYlEIb0oF0VWsFtEMPGjGiahc1bl93d0",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "workon-professionalai-logo-01-white-ai",
      assetGroupId: "workon-professionalai-logo-01",
      title: "ProfessionalAI Logo WorkOn 01",
      brand: "WorkOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:19:54Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の WorkOn ロゴ 01 白版 AI データです。",
      driveId: "1aiDVLFIwiMXdNnXLPjHIFaNiJRM8ZK_C",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "workon-professionalai-logo-01-black-png",
      assetGroupId: "workon-professionalai-logo-01",
      title: "ProfessionalAI Logo WorkOn 01",
      brand: "WorkOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:31:30Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の WorkOn ロゴ 01 黒版です。",
      driveId: "1O-s8kIiiBQpe7kuceqVu9923VlswHDxv",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "workon-professionalai-logo-01-white-png",
      assetGroupId: "workon-professionalai-logo-01",
      title: "ProfessionalAI Logo WorkOn 01",
      brand: "WorkOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:55:28Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の WorkOn ロゴ 01 白版です。",
      driveId: "1KIDVUsfe2yWryzXTas_4iHoSxj4zSuQ0",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "workon-professionalai-logo-02-black-ai",
      assetGroupId: "workon-professionalai-logo-02",
      title: "ProfessionalAI Logo WorkOn 02",
      brand: "WorkOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:26:06Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の WorkOn ロゴ 02 黒版 AI データです。",
      driveId: "16B_i6mpg7j_Lgu0ljmMYlgZNYiUv8rP3",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "workon-professionalai-logo-02-white-ai",
      assetGroupId: "workon-professionalai-logo-02",
      title: "ProfessionalAI Logo WorkOn 02",
      brand: "WorkOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:20:25Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の WorkOn ロゴ 02 白版 AI データです。",
      driveId: "1OHTZ_dxSCra5HeMnJkUH9ISQm3QkG2Kn",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "workon-professionalai-logo-02-black-png",
      assetGroupId: "workon-professionalai-logo-02",
      title: "ProfessionalAI Logo WorkOn 02",
      brand: "WorkOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:31:30Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の WorkOn ロゴ 02 黒版です。",
      driveId: "1OCeDGv5HeFy-rX9KJAxPYvO9vSFZFrOs",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "workon-professionalai-logo-02-white-png",
      assetGroupId: "workon-professionalai-logo-02",
      title: "ProfessionalAI Logo WorkOn 02",
      brand: "WorkOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:55:28Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の WorkOn ロゴ 02 白版です。",
      driveId: "1o5Vqlk5UmkashuxOdfBsSr635sBy72cR",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "workon-professionalai-logo-03-black-ai",
      assetGroupId: "workon-professionalai-logo-03",
      title: "ProfessionalAI Logo WorkOn 03",
      brand: "WorkOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:26:31Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の WorkOn ロゴ 03 黒版 AI データです。",
      driveId: "1wWqYc377kkhB9kWkUx_Z5QwKDW5kf4TG",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "workon-professionalai-logo-03-white-ai",
      assetGroupId: "workon-professionalai-logo-03",
      title: "ProfessionalAI Logo WorkOn 03",
      brand: "WorkOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:23:40Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の WorkOn ロゴ 03 白版 AI データです。",
      driveId: "1LybrxV1pj88l6CGYv7CoeoNdh5BEi6XY",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "workon-professionalai-logo-03-black-png",
      assetGroupId: "workon-professionalai-logo-03",
      title: "ProfessionalAI Logo WorkOn 03",
      brand: "WorkOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:31:30Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の WorkOn ロゴ 03 黒版です。",
      driveId: "1M5Xo1GZcgbDEz971gjqcooDPqVS3M82a",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "workon-professionalai-logo-03-white-png",
      assetGroupId: "workon-professionalai-logo-03",
      title: "ProfessionalAI Logo WorkOn 03",
      brand: "WorkOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:55:28Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の WorkOn ロゴ 03 白版です。",
      driveId: "1WbViAMBQdwblUUP_2Pf6PKr6N69TZbP-",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "workon-professionalai-logo-04-black-ai",
      assetGroupId: "workon-professionalai-logo-04",
      title: "ProfessionalAI Logo WorkOn 04",
      brand: "WorkOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:27:01Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の WorkOn ロゴ 04 黒版 AI データです。",
      driveId: "1G0Gkuk_qf2yQCiZdFI7_8skAJkvMS28-",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "workon-professionalai-logo-04-white-ai",
      assetGroupId: "workon-professionalai-logo-04",
      title: "ProfessionalAI Logo WorkOn 04",
      brand: "WorkOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:24:19Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の WorkOn ロゴ 04 白版 AI データです。",
      driveId: "1yuNPRP-3fkw0liODKBoxCUNNvi2IVaVl",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "workon-professionalai-logo-04-black-png",
      assetGroupId: "workon-professionalai-logo-04",
      title: "ProfessionalAI Logo WorkOn 04",
      brand: "WorkOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:31:30Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の WorkOn ロゴ 04 黒版です。",
      driveId: "1YK6BcBm2JIGxxl1_EGI0R4inqnr54eKh",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "workon-professionalai-logo-04-white-png",
      assetGroupId: "workon-professionalai-logo-04",
      title: "ProfessionalAI Logo WorkOn 04",
      brand: "WorkOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:55:28Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の WorkOn ロゴ 04 白版です。",
      driveId: "1ppCXhKxrpc0boqY7NFjK-vCGkMpUyA1F",
      colorVariant: "white",
      variantLabel: "White",
    }),

    // DealOn
    makeAsset({
      id: "dealon-logo-primary-ai",
      assetGroupId: "dealon-logo-primary",
      title: "DealOn Logo Primary",
      brand: "DealOn",
      fileFormat: "AI",
      status: "current",
      recommended: true,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト", "印刷"],
      updatedAt: "2026-04-02T09:00:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "DealOn の標準ロゴ。ベクターソースとして扱う元データです。",
      driveId: "1okXeEOo3UJSXsTwc2tOLWlUrj1Lrkgdi",
      driveUrl: "https://drive.google.com/file/d/1okXeEOo3UJSXsTwc2tOLWlUrj1Lrkgdi/view?usp=drivesdk",
      colorVariant: "color",
      variantLabel: "Color",
    }),
    makeAsset({
      id: "dealon-logo-primary-color-png",
      assetGroupId: "dealon-logo-primary",
      title: "DealOn Logo Primary",
      brand: "DealOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-02T09:00:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "DealOn のPNG版ロゴ。Web 用の運用に向いた画像版です。",
      driveId: "1fD7fQXkd7BlVdak-az9aKFGh1ieb7I8z",
      driveUrl: "https://drive.google.com/file/d/1fD7fQXkd7BlVdak-az9aKFGh1ieb7I8z/view?usp=drivesdk",
      colorVariant: "color",
      variantLabel: "Color",
    }),
    makeAsset({
      id: "dealon-logo-primary-black-png",
      assetGroupId: "dealon-logo-primary",
      title: "DealOn Logo Primary",
      brand: "DealOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T06:02:23Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "DealOn の黒版 PNG ロゴです。",
      driveId: "1uoajx3s5s9auvNXgq1Ka6hsOOnXdw12d",
      driveUrl: "https://drive.google.com/file/d/1uoajx3s5s9auvNXgq1Ka6hsOOnXdw12d/view?usp=drivesdk",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "dealon-logo-primary-white-png",
      assetGroupId: "dealon-logo-primary",
      title: "DealOn Logo Primary",
      brand: "DealOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T06:02:25Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "DealOn の白版 PNG ロゴです。",
      driveId: "1AIUBIryX4JLdYdCZ5LQyLGlEJdrBMAqO",
      driveUrl: "https://drive.google.com/file/d/1AIUBIryX4JLdYdCZ5LQyLGlEJdrBMAqO/view?usp=drivesdk",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "dealon-logo-primary-color-jpg",
      assetGroupId: "dealon-logo-primary",
      title: "DealOn Logo Primary",
      brand: "DealOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T06:02:18Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "DealOn のカラー JPG ロゴです。",
      driveId: "1U_AR4NLdVCUx_Cs-65MQQb-G2_3MD7Jl",
      driveUrl: "https://drive.google.com/file/d/1U_AR4NLdVCUx_Cs-65MQQb-G2_3MD7Jl/view?usp=drivesdk",
      colorVariant: "color",
      variantLabel: "Color",
    }),
    makeAsset({
      id: "dealon-logo-primary-black-jpg",
      assetGroupId: "dealon-logo-primary",
      title: "DealOn Logo Primary",
      brand: "DealOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T06:02:16Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "DealOn の黒版 JPG ロゴです。",
      driveId: "1gzr1A-mcFttBJXtv4J-TvPSa4GHI0RNS",
      driveUrl: "https://drive.google.com/file/d/1gzr1A-mcFttBJXtv4J-TvPSa4GHI0RNS/view?usp=drivesdk",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "dealon-logo-primary-white-light-jpg",
      assetGroupId: "dealon-logo-primary",
      title: "DealOn Logo Primary",
      brand: "DealOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T06:02:14Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "DealOn の白版 JPG ロゴです。明るい背景での確認用です。",
      driveId: "1NrzQY3FAsy-V_jPW-UXK3nd9iqVK0Rd3",
      driveUrl: "https://drive.google.com/file/d/1NrzQY3FAsy-V_jPW-UXK3nd9iqVK0Rd3/view?usp=drivesdk",
      colorVariant: "white",
      variantLabel: "White on Light",
    }),
    makeAsset({
      id: "dealon-logo-primary-white-dark-jpg",
      assetGroupId: "dealon-logo-primary",
      title: "DealOn Logo Primary",
      brand: "DealOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T06:02:12Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "DealOn の白版 JPG ロゴです。暗い背景での確認用です。",
      driveId: "1HS0rayMSMKXe5ShKhs-8R9acFTl8qjPP",
      driveUrl: "https://drive.google.com/file/d/1HS0rayMSMKXe5ShKhs-8R9acFTl8qjPP/view?usp=drivesdk",
      colorVariant: "white",
      variantLabel: "White on Dark",
    }),
    makeAsset({
      id: "dealon-professionalai-logo-01-black-ai",
      assetGroupId: "dealon-professionalai-logo-01",
      title: "ProfessionalAI Logo DealOn 01",
      brand: "DealOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:37:57Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の DealOn ロゴ 01 黒版 AI データです。",
      driveId: "1YZSC0NpcRmyDpVTN1HlgRM2w0KjCaenN",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "dealon-professionalai-logo-01-white-ai",
      assetGroupId: "dealon-professionalai-logo-01",
      title: "ProfessionalAI Logo DealOn 01",
      brand: "DealOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:42:04Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の DealOn ロゴ 01 白版 AI データです。",
      driveId: "183b-dHXFC-_Ft1gZJCQa98jkXlWqFLbB",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "dealon-professionalai-logo-01-black-png",
      assetGroupId: "dealon-professionalai-logo-01",
      title: "ProfessionalAI Logo DealOn 01",
      brand: "DealOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:31:30Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の DealOn ロゴ 01 黒版です。",
      driveId: "1pyQyI2N6ucELYDIBpjm14g0FQ8gy7bT7",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "dealon-professionalai-logo-01-white-png",
      assetGroupId: "dealon-professionalai-logo-01",
      title: "ProfessionalAI Logo DealOn 01",
      brand: "DealOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:55:28Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の DealOn ロゴ 01 白版です。",
      driveId: "1PjUbiWgpfroLSZyvl73z3meFB0QtuFD8",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "dealon-professionalai-logo-02-black-ai",
      assetGroupId: "dealon-professionalai-logo-02",
      title: "ProfessionalAI Logo DealOn 02",
      brand: "DealOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:38:20Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の DealOn ロゴ 02 黒版 AI データです。",
      driveId: "1RDUNT6yltnPnJlM5z-76K3eq4prPt54q",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "dealon-professionalai-logo-02-white-ai",
      assetGroupId: "dealon-professionalai-logo-02",
      title: "ProfessionalAI Logo DealOn 02",
      brand: "DealOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:42:36Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の DealOn ロゴ 02 白版 AI データです。",
      driveId: "1odvZKDtbFnkojPHoqoOc2mnrM2lVQoWV",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "dealon-professionalai-logo-02-black-png",
      assetGroupId: "dealon-professionalai-logo-02",
      title: "ProfessionalAI Logo DealOn 02",
      brand: "DealOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:31:30Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の DealOn ロゴ 02 黒版です。",
      driveId: "1DHaid4T87aQgdvR_NZbnJvEuYofC4Xqo",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "dealon-professionalai-logo-02-white-png",
      assetGroupId: "dealon-professionalai-logo-02",
      title: "ProfessionalAI Logo DealOn 02",
      brand: "DealOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:55:28Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の DealOn ロゴ 02 白版です。",
      driveId: "1CoBUyFmvZgNeTVVWgCHFvzdwUtYixcDZ",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "dealon-professionalai-logo-03-black-ai",
      assetGroupId: "dealon-professionalai-logo-03",
      title: "ProfessionalAI Logo DealOn 03",
      brand: "DealOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:38:40Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の DealOn ロゴ 03 黒版 AI データです。",
      driveId: "1h1VbXwZPGmTOtkge_nLsgYOI1jL8Kues",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "dealon-professionalai-logo-03-white-ai",
      assetGroupId: "dealon-professionalai-logo-03",
      title: "ProfessionalAI Logo DealOn 03",
      brand: "DealOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:42:57Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の DealOn ロゴ 03 白版 AI データです。",
      driveId: "1ATuoLhsFLVL9Drnbqz2a6sQ60Al4p3e5",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "dealon-professionalai-logo-03-black-png",
      assetGroupId: "dealon-professionalai-logo-03",
      title: "ProfessionalAI Logo DealOn 03",
      brand: "DealOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:31:30Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の DealOn ロゴ 03 黒版です。",
      driveId: "1-qtQ4dqNzwSCIk8zT_4MjJFN__GLcNKG",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "dealon-professionalai-logo-03-white-png",
      assetGroupId: "dealon-professionalai-logo-03",
      title: "ProfessionalAI Logo DealOn 03",
      brand: "DealOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:55:28Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の DealOn ロゴ 03 白版です。",
      driveId: "1geVBE-s-MThP64navCLcwzEgi-NpC4LO",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "dealon-professionalai-logo-04-black-ai",
      assetGroupId: "dealon-professionalai-logo-04",
      title: "ProfessionalAI Logo DealOn 04",
      brand: "DealOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:40:11Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の DealOn ロゴ 04 黒版 AI データです。",
      driveId: "1HAUimGtDVxEWB99PBuHkbQTmGnl6mSJM",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "dealon-professionalai-logo-04-white-ai",
      assetGroupId: "dealon-professionalai-logo-04",
      title: "ProfessionalAI Logo DealOn 04",
      brand: "DealOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:43:24Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の DealOn ロゴ 04 白版 AI データです。",
      driveId: "1pttWiDSD-0QguW7pV8d5ikgBpph6XydM",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "dealon-professionalai-logo-04-black-png",
      assetGroupId: "dealon-professionalai-logo-04",
      title: "ProfessionalAI Logo DealOn 04",
      brand: "DealOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:31:30Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の DealOn ロゴ 04 黒版です。",
      driveId: "1pRxkMlDktwyzdbi1UTEVxFKbKVE4BEQF",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "dealon-professionalai-logo-04-white-png",
      assetGroupId: "dealon-professionalai-logo-04",
      title: "ProfessionalAI Logo DealOn 04",
      brand: "DealOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:55:28Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の DealOn ロゴ 04 白版です。",
      driveId: "1ZTxC2HmvW3P-57PXl3SYas5Ls6FjjGSh",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "dealon-motion-assets-2026-mp4",
      assetGroupId: "dealon-motion-assets-2026",
      title: "DealOn Motion Assets 2026",
      brand: "DealOn",
      fileFormat: "MP4",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "モーション",
      usage: ["Webサイト", "SNS"],
      updatedAt: "2026-03-25T12:10:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "DealOn のモーション素材。SNS と Web の動きのある表現向けです。",
      driveUrl: "https://drive.google.com/drive/search?q=DealOn%20Motion%20Assets%202026",
    }),
    makeAsset({
      id: "dealon-us-launch-kit-pdf",
      assetGroupId: "dealon-us-launch-kit",
      title: "DealOn US Launch Kit",
      brand: "DealOn",
      fileFormat: "PDF",
      status: "current",
      recommended: true,
      locale: "US",
      assetType: "営業資料素材",
      usage: ["イベント", "営業提案"],
      updatedAt: "2026-03-27T06:30:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "US 展開向けの配布キット。イベントや提案資料に使いやすい構成です。",
      driveUrl: "https://drive.google.com/drive/search?q=DealOn%20US%20Launch%20Kit",
    }),
    makeAsset({
      id: "dealon-brand-guidelines-pdf",
      assetGroupId: "dealon-brand-guidelines",
      title: "DealOn Brand Guidelines",
      brand: "DealOn",
      fileFormat: "PDF",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ガイドライン",
      usage: ["社内資料"],
      updatedAt: "2026-02-12T00:00:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "DealOn のブランドガイドライン。社内配布の中心資料です。",
      driveId: "1E88n0rdWTQYKYHFg4ioWq9X1lcFYquHx",
      driveUrl: "https://drive.google.com/file/d/1E88n0rdWTQYKYHFg4ioWq9X1lcFYquHx/view?usp=drivesdk",
    }),

    // GovernOn / CXOn
    makeAsset({
      id: "governon-logo-primary-svg",
      assetGroupId: "governon-logo-primary",
      title: "GovernOn Logo Primary",
      brand: "GovernOn",
      fileFormat: "SVG",
      status: "current",
      recommended: true,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト", "印刷"],
      updatedAt: "2026-04-01T11:00:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "GovernOn 向けの標準ロゴ。最新版のベクター版です。",
      driveId: "1BWR76eBIoD8Pi47qko9ymTUDDQ2GDZSa",
      driveUrl: "https://drive.google.com/file/d/1BWR76eBIoD8Pi47qko9ymTUDDQ2GDZSa/view?usp=drivesdk",
      colorVariant: "color",
      variantLabel: "Color",
    }),
    makeAsset({
      id: "governon-logo-primary-black-svg",
      assetGroupId: "governon-logo-primary",
      title: "GovernOn Logo Primary",
      brand: "GovernOn",
      fileFormat: "SVG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト", "印刷"],
      updatedAt: "2026-04-09T05:48:55Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "GovernOn の黒版 SVG ロゴです。",
      driveId: "1CquJqqkNw6kTgNp47YBzydVtYXqRs6bP",
      driveUrl: "https://drive.google.com/file/d/1CquJqqkNw6kTgNp47YBzydVtYXqRs6bP/view?usp=drivesdk",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "governon-logo-primary-white-svg",
      assetGroupId: "governon-logo-primary",
      title: "GovernOn Logo Primary",
      brand: "GovernOn",
      fileFormat: "SVG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト", "印刷"],
      updatedAt: "2026-04-09T05:48:54Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "GovernOn の白版 SVG ロゴです。",
      driveId: "1JeD_N_e83UbRelD8VmAmq6KGXtAFcKA_",
      driveUrl: "https://drive.google.com/file/d/1JeD_N_e83UbRelD8VmAmq6KGXtAFcKA_/view?usp=drivesdk",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "governon-logo-primary-png",
      assetGroupId: "governon-logo-primary",
      title: "GovernOn Logo Primary",
      brand: "GovernOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-01T11:00:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "GovernOn 標準ロゴのPNG版。Web 用の画像版として配布します。",
      driveId: "1asqZRJuoShTAlU7zT6RinA4TUDKxsQIM",
      driveUrl: "https://drive.google.com/file/d/1asqZRJuoShTAlU7zT6RinA4TUDKxsQIM/view?usp=drivesdk",
      colorVariant: "color",
      variantLabel: "Color",
    }),
    makeAsset({
      id: "governon-logo-primary-black-png",
      assetGroupId: "governon-logo-primary",
      title: "GovernOn Logo Primary",
      brand: "GovernOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T05:48:52Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "GovernOn の黒版 PNG ロゴです。",
      driveId: "1fI-S1awrkbR-jGiv53Bj1vgPQvJAfCx6",
      driveUrl: "https://drive.google.com/file/d/1fI-S1awrkbR-jGiv53Bj1vgPQvJAfCx6/view?usp=drivesdk",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "governon-logo-primary-white-png",
      assetGroupId: "governon-logo-primary",
      title: "GovernOn Logo Primary",
      brand: "GovernOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T05:48:50Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "GovernOn の白版 PNG ロゴです。",
      driveId: "1Khjy947B8muHzRYKdNNJ4JS8MtpR83Jd",
      driveUrl: "https://drive.google.com/file/d/1Khjy947B8muHzRYKdNNJ4JS8MtpR83Jd/view?usp=drivesdk",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "governon-logo-primary-color-jpg",
      assetGroupId: "governon-logo-primary",
      title: "GovernOn Logo Primary",
      brand: "GovernOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T05:48:48Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "GovernOn のカラー JPG ロゴです。",
      driveId: "1o8cX_ddhMyosfPU0lhn-j5yUQyv7FW6l",
      driveUrl: "https://drive.google.com/file/d/1o8cX_ddhMyosfPU0lhn-j5yUQyv7FW6l/view?usp=drivesdk",
      colorVariant: "color",
      variantLabel: "Color",
    }),
    makeAsset({
      id: "governon-logo-primary-black-jpg",
      assetGroupId: "governon-logo-primary",
      title: "GovernOn Logo Primary",
      brand: "GovernOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T05:48:46Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "GovernOn の黒版 JPG ロゴです。",
      driveId: "1evRHP0P7pjcy71258RE6Zl0Ewpp5EER-",
      driveUrl: "https://drive.google.com/file/d/1evRHP0P7pjcy71258RE6Zl0Ewpp5EER-/view?usp=drivesdk",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "governon-logo-primary-white-jpg",
      assetGroupId: "governon-logo-primary",
      title: "GovernOn Logo Primary",
      brand: "GovernOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T05:48:44Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "GovernOn の白版 JPG ロゴです。",
      driveId: "1IMRXe8A45DgUYZ-cKaLqTQs8Y_7env49",
      driveUrl: "https://drive.google.com/file/d/1IMRXe8A45DgUYZ-cKaLqTQs8Y_7env49/view?usp=drivesdk",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "governon-logo-primary-ai",
      assetGroupId: "governon-logo-primary",
      title: "GovernOn Logo Primary",
      brand: "GovernOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト", "印刷"],
      updatedAt: "2026-04-09T05:48:42Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "GovernOn のベクター元データです。",
      driveId: "1pknB0w1YiUmpSs4Z40wfveJ-2nz8THoH",
      driveUrl: "https://drive.google.com/file/d/1pknB0w1YiUmpSs4Z40wfveJ-2nz8THoH/view?usp=drivesdk",
      colorVariant: "color",
      variantLabel: "Color",
    }),
    makeAsset({
      id: "governon-professionalai-logo-01-black-ai",
      assetGroupId: "governon-professionalai-logo-01",
      title: "ProfessionalAI Logo GovernOn 01",
      brand: "GovernOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:31:07Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の GovernOn ロゴ 01 黒版 AI データです。",
      driveId: "1dIbBwFKpe_QUi7hSX3-2_UWxKZ6QJOBk",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "governon-professionalai-logo-01-white-ai",
      assetGroupId: "governon-professionalai-logo-01",
      title: "ProfessionalAI Logo GovernOn 01",
      brand: "GovernOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:28:31Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の GovernOn ロゴ 01 白版 AI データです。",
      driveId: "1FQQSSae8_pSBPvqhZeIP-vxOopp1mESs",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "governon-professionalai-logo-01-black-png",
      assetGroupId: "governon-professionalai-logo-01",
      title: "ProfessionalAI Logo GovernOn 01",
      brand: "GovernOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:31:30Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の GovernOn ロゴ 01 黒版です。",
      driveId: "1d9KD96OOXUfc0zWrKiuL1isyq9kbcn1e",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "governon-professionalai-logo-01-white-png",
      assetGroupId: "governon-professionalai-logo-01",
      title: "ProfessionalAI Logo GovernOn 01",
      brand: "GovernOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:55:28Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の GovernOn ロゴ 01 白版です。",
      driveId: "1WIRFFsvn8t6y9VBYAG-Qt2ABKAHwihWB",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "governon-professionalai-logo-02-black-ai",
      assetGroupId: "governon-professionalai-logo-02",
      title: "ProfessionalAI Logo GovernOn 02",
      brand: "GovernOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:31:50Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の GovernOn ロゴ 02 黒版 AI データです。",
      driveId: "1QikKeTr4ovHZC2LoFm6tgejvNQCMV2NR",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "governon-professionalai-logo-02-white-ai",
      assetGroupId: "governon-professionalai-logo-02",
      title: "ProfessionalAI Logo GovernOn 02",
      brand: "GovernOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:29:36Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の GovernOn ロゴ 02 白版 AI データです。",
      driveId: "14Xefl7vB6BZoiMrIk-DeMsW7iYOf2l3n",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "governon-professionalai-logo-02-black-png",
      assetGroupId: "governon-professionalai-logo-02",
      title: "ProfessionalAI Logo GovernOn 02",
      brand: "GovernOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:31:30Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の GovernOn ロゴ 02 黒版です。",
      driveId: "1FwOqMitwv6rnFMkbrHTXNLvoIWzTmyoc",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "governon-professionalai-logo-02-white-png",
      assetGroupId: "governon-professionalai-logo-02",
      title: "ProfessionalAI Logo GovernOn 02",
      brand: "GovernOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:55:28Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の GovernOn ロゴ 02 白版です。",
      driveId: "1pXUZska4UPnLZMHdrX6pRzHQxSwkVCEJ",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "governon-professionalai-logo-03-black-ai",
      assetGroupId: "governon-professionalai-logo-03",
      title: "ProfessionalAI Logo GovernOn 03",
      brand: "GovernOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:32:14Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の GovernOn ロゴ 03 黒版 AI データです。",
      driveId: "12s-6Tn75mP2oxe7bsoHYSCWzyl2rcEO9",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "governon-professionalai-logo-03-white-ai",
      assetGroupId: "governon-professionalai-logo-03",
      title: "ProfessionalAI Logo GovernOn 03",
      brand: "GovernOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:30:01Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の GovernOn ロゴ 03 白版 AI データです。",
      driveId: "1w_GkYskY0ajjdAkHCUzb-d37JuzRHqLz",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "governon-professionalai-logo-03-black-png",
      assetGroupId: "governon-professionalai-logo-03",
      title: "ProfessionalAI Logo GovernOn 03",
      brand: "GovernOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:31:30Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の GovernOn ロゴ 03 黒版です。",
      driveId: "1y7UDWbx9bfdLybpX4gd0PMUwcO6nhNgO",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "governon-professionalai-logo-03-white-png",
      assetGroupId: "governon-professionalai-logo-03",
      title: "ProfessionalAI Logo GovernOn 03",
      brand: "GovernOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:55:28Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の GovernOn ロゴ 03 白版です。",
      driveId: "1Q4y9esYBJnA1zW53aTEBK3Na3Ba218WX",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "governon-professionalai-logo-04-black-ai",
      assetGroupId: "governon-professionalai-logo-04",
      title: "ProfessionalAI Logo GovernOn 04",
      brand: "GovernOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:32:49Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の GovernOn ロゴ 04 黒版 AI データです。",
      driveId: "1Ynebb50J2SeAGYe2CM_lqv0n2FJiWoYd",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "governon-professionalai-logo-04-white-ai",
      assetGroupId: "governon-professionalai-logo-04",
      title: "ProfessionalAI Logo GovernOn 04",
      brand: "GovernOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:30:31Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の GovernOn ロゴ 04 白版 AI データです。",
      driveId: "1_gPF0wapRXgatg6aeb0-bAgnq93I2q5u",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "governon-professionalai-logo-04-black-png",
      assetGroupId: "governon-professionalai-logo-04",
      title: "ProfessionalAI Logo GovernOn 04",
      brand: "GovernOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:31:30Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の GovernOn ロゴ 04 黒版です。",
      driveId: "1ZpF3G-3aYTjaalHrrVx4WxeyMo9zVu2b",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "governon-professionalai-logo-04-white-png",
      assetGroupId: "governon-professionalai-logo-04",
      title: "ProfessionalAI Logo GovernOn 04",
      brand: "GovernOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:55:28Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の GovernOn ロゴ 04 白版です。",
      driveId: "1XCeDVEkkmnNwPAvfbxBp6D1GB7dBqFK8",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "cxon-logo-primary-ai",
      assetGroupId: "cxon-logo-primary",
      title: "CXOn Logo Primary",
      brand: "CXOn",
      fileFormat: "AI",
      status: "current",
      recommended: true,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト", "印刷"],
      updatedAt: "2026-04-09T05:58:36Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "CXOn の基準ロゴ。ベクターソースとして扱う元データです。",
      driveId: "1C6ltXhFpWWNUYKS4yMi76k_8fPH6CIsS",
      driveUrl: "https://drive.google.com/file/d/1C6ltXhFpWWNUYKS4yMi76k_8fPH6CIsS/view?usp=drivesdk",
      colorVariant: "color",
      variantLabel: "Color",
    }),
    makeAsset({
      id: "cxon-logo-primary-color-png",
      assetGroupId: "cxon-logo-primary",
      title: "CXOn Logo Primary",
      brand: "CXOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T05:58:34Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "CXOn のカラー PNG ロゴです。",
      driveId: "1vL6JUcZDfc7pF3BQy2U6RyLMYB0dNb7i",
      driveUrl: "https://drive.google.com/file/d/1vL6JUcZDfc7pF3BQy2U6RyLMYB0dNb7i/view?usp=drivesdk",
      colorVariant: "color",
      variantLabel: "Color",
    }),
    makeAsset({
      id: "cxon-logo-primary-black-png",
      assetGroupId: "cxon-logo-primary",
      title: "CXOn Logo Primary",
      brand: "CXOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T05:58:32Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "CXOn の黒版 PNG ロゴです。",
      driveId: "1ofVnEgvqS5jijgC1bnxgJP6NaIoFitG0",
      driveUrl: "https://drive.google.com/file/d/1ofVnEgvqS5jijgC1bnxgJP6NaIoFitG0/view?usp=drivesdk",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "cxon-logo-primary-white-png",
      assetGroupId: "cxon-logo-primary",
      title: "CXOn Logo Primary",
      brand: "CXOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T05:58:30Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "CXOn の白版 PNG ロゴです。",
      driveId: "1ytYtLVwhTWYgk4910vuU3IiOMKBHcPJq",
      driveUrl: "https://drive.google.com/file/d/1ytYtLVwhTWYgk4910vuU3IiOMKBHcPJq/view?usp=drivesdk",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "cxon-professionalai-logo-01-black-ai",
      assetGroupId: "cxon-professionalai-logo-01",
      title: "ProfessionalAI Logo CXOn 01",
      brand: "CXOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:44:18Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の CXOn ロゴ 01 黒版 AI データです。",
      driveId: "1-tO422Q5BSP-gHUdT3ze9vDp4YU8pyZ9",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "cxon-professionalai-logo-01-white-ai",
      assetGroupId: "cxon-professionalai-logo-01",
      title: "ProfessionalAI Logo CXOn 01",
      brand: "CXOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:45:49Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の CXOn ロゴ 01 白版 AI データです。",
      driveId: "1O52I32VnMunzfUFKVtkjU2e55OybtcPo",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "cxon-professionalai-logo-01-black-png",
      assetGroupId: "cxon-professionalai-logo-01",
      title: "ProfessionalAI Logo CXOn 01",
      brand: "CXOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:31:30Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の CXOn ロゴ 01 黒版です。",
      driveId: "11Jp3248t496DUC1l1gkrQW6IRHDre0Bm",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "cxon-professionalai-logo-01-white-png",
      assetGroupId: "cxon-professionalai-logo-01",
      title: "ProfessionalAI Logo CXOn 01",
      brand: "CXOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:55:28Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の CXOn ロゴ 01 白版です。",
      driveId: "1naF1fBPAbqjQ4jiwmeV3jWcHYFWsdPxV",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "cxon-professionalai-logo-02-black-ai",
      assetGroupId: "cxon-professionalai-logo-02",
      title: "ProfessionalAI Logo CXOn 02",
      brand: "CXOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:44:36Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の CXOn ロゴ 02 黒版 AI データです。",
      driveId: "1qi-SNnO1XSLnmL2feQl8lULT8xKkHdi2",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "cxon-professionalai-logo-02-white-ai",
      assetGroupId: "cxon-professionalai-logo-02",
      title: "ProfessionalAI Logo CXOn 02",
      brand: "CXOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:46:13Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の CXOn ロゴ 02 白版 AI データです。",
      driveId: "1ggkHwGeWy8y5OUuBnqvS26GSi19qFWOI",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "cxon-professionalai-logo-02-black-png",
      assetGroupId: "cxon-professionalai-logo-02",
      title: "ProfessionalAI Logo CXOn 02",
      brand: "CXOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:31:30Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の CXOn ロゴ 02 黒版です。",
      driveId: "1-6fiU3o-Be8GQ-50VRIud2RfwjTM6JHC",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "cxon-professionalai-logo-02-white-png",
      assetGroupId: "cxon-professionalai-logo-02",
      title: "ProfessionalAI Logo CXOn 02",
      brand: "CXOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:55:28Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の CXOn ロゴ 02 白版です。",
      driveId: "1BJ4fy6BTv8SP2QVAb8-2KkW_hfkuer0E",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "cxon-professionalai-logo-03-black-ai",
      assetGroupId: "cxon-professionalai-logo-03",
      title: "ProfessionalAI Logo CXOn 03",
      brand: "CXOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:44:55Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の CXOn ロゴ 03 黒版 AI データです。",
      driveId: "1LrxJd6f5wamT9HorZQcGYpEh_iJ3cEC9",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "cxon-professionalai-logo-03-white-ai",
      assetGroupId: "cxon-professionalai-logo-03",
      title: "ProfessionalAI Logo CXOn 03",
      brand: "CXOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:46:31Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の CXOn ロゴ 03 白版 AI データです。",
      driveId: "1FoFTh6Nl2tj2nonH2aOtQA9PLNVrWwHp",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "cxon-professionalai-logo-03-black-png",
      assetGroupId: "cxon-professionalai-logo-03",
      title: "ProfessionalAI Logo CXOn 03",
      brand: "CXOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:31:30Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の CXOn ロゴ 03 黒版です。",
      driveId: "1vQ4tHxEdYeu412C1_Ub8muC2UVoM6JMD",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "cxon-professionalai-logo-03-white-png",
      assetGroupId: "cxon-professionalai-logo-03",
      title: "ProfessionalAI Logo CXOn 03",
      brand: "CXOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:55:28Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の CXOn ロゴ 03 白版です。",
      driveId: "1H7VMynILaP0l08xYmLcSoEp1ER4MwqMD",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "cxon-professionalai-logo-04-black-ai",
      assetGroupId: "cxon-professionalai-logo-04",
      title: "ProfessionalAI Logo CXOn 04",
      brand: "CXOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:45:20Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の CXOn ロゴ 04 黒版 AI データです。",
      driveId: "1I0yj4Yh3LLLgwMarZjmhuowJHmTZi7-3",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "cxon-professionalai-logo-04-white-ai",
      assetGroupId: "cxon-professionalai-logo-04",
      title: "ProfessionalAI Logo CXOn 04",
      brand: "CXOn",
      fileFormat: "AI",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト", "印刷"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-04-16T06:46:52Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の CXOn ロゴ 04 白版 AI データです。",
      driveId: "12Lyyu6Z-PWH5NxnyFl3bmHBnPeS9RFeB",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "cxon-professionalai-logo-04-black-png",
      assetGroupId: "cxon-professionalai-logo-04",
      title: "ProfessionalAI Logo CXOn 04",
      brand: "CXOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:31:30Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "ProfessionalAI キャンペーン用の CXOn ロゴ 04 黒版です。",
      driveId: "1U16wu48L2PQ-kzLDM38vDLmKD1a8ZWd6",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "cxon-professionalai-logo-04-white-png",
      assetGroupId: "cxon-professionalai-logo-04",
      title: "ProfessionalAI Logo CXOn 04",
      brand: "CXOn",
      fileFormat: "PNG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["キャンペーン", "Webサイト"],
      tags: ["ProfessionalAI"],
      updatedAt: "2026-03-24T01:55:28Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "ProfessionalAI キャンペーン用の CXOn ロゴ 04 白版です。",
      driveId: "1SToPnjBu_MCRIj7EKYHWfZuRlyNN4USO",
      colorVariant: "white",
      variantLabel: "White",
    }),
    makeAsset({
      id: "governon-brand-guidelines-pdf",
      assetGroupId: "governon-brand-guidelines",
      title: "GovernOn Brand Guidelines",
      brand: "GovernOn",
      fileFormat: "PDF",
      status: "current",
      recommended: true,
      locale: "Global",
      assetType: "ガイドライン",
      usage: ["社内資料"],
      updatedAt: "2026-03-29T08:40:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "GovernOn 用のブランドガイドライン。社内配布の中心資料です。",
      driveId: "1YX4GAS8BeRke1EzmypBqfz7KfL0Oo_zT",
      driveUrl: "https://drive.google.com/file/d/1YX4GAS8BeRke1EzmypBqfz7KfL0Oo_zT/view?usp=drivesdk",
    }),
    makeAsset({
      id: "cxon-logo-primary-color-jpg",
      assetGroupId: "cxon-logo-primary",
      title: "CXOn Logo Primary",
      brand: "CXOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T05:58:28Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "CXOn のカラー JPG ロゴです。",
      driveId: "1NBD0Sroe0_YICUkDZ8kFQRL0V0okbouS",
      driveUrl: "https://drive.google.com/file/d/1NBD0Sroe0_YICUkDZ8kFQRL0V0okbouS/view?usp=drivesdk",
      colorVariant: "color",
      variantLabel: "Color",
    }),
    makeAsset({
      id: "cxon-logo-primary-black-jpg",
      assetGroupId: "cxon-logo-primary",
      title: "CXOn Logo Primary",
      brand: "CXOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T05:58:26Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "CXOn の黒版 JPG ロゴです。",
      driveId: "1qKUKQI1DpXbOvx95dydR23NLMmABmD6I",
      driveUrl: "https://drive.google.com/file/d/1qKUKQI1DpXbOvx95dydR23NLMmABmD6I/view?usp=drivesdk",
      colorVariant: "black",
      variantLabel: "Black",
    }),
    makeAsset({
      id: "cxon-logo-primary-white-light-jpg",
      assetGroupId: "cxon-logo-primary",
      title: "CXOn Logo Primary",
      brand: "CXOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T05:58:24Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "CXOn の白版 JPG ロゴです。明るい背景での確認用です。",
      driveId: "1LcpW7EOrs1fLyo0VZa0z3tXVLqgkuAQn",
      driveUrl: "https://drive.google.com/file/d/1LcpW7EOrs1fLyo0VZa0z3tXVLqgkuAQn/view?usp=drivesdk",
      colorVariant: "white",
      variantLabel: "White on Light",
    }),
    makeAsset({
      id: "cxon-logo-primary-white-dark-jpg",
      assetGroupId: "cxon-logo-primary",
      title: "CXOn Logo Primary",
      brand: "CXOn",
      fileFormat: "JPG",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ロゴ",
      usage: ["Webサイト"],
      updatedAt: "2026-04-09T05:58:22Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "dark",
      description: "CXOn の白版 JPG ロゴです。暗い背景での確認用です。",
      driveId: "1dqvAWKp0-oLsWoq9kMMO_ruFHRTLcfnF",
      driveUrl: "https://drive.google.com/file/d/1dqvAWKp0-oLsWoq9kMMO_ruFHRTLcfnF/view?usp=drivesdk",
      colorVariant: "white",
      variantLabel: "White on Dark",
    }),
    makeAsset({
      id: "cxon-brand-guidelines-pdf",
      assetGroupId: "cxon-brand-guidelines",
      title: "CXOn Brand Guidelines",
      brand: "CXOn",
      fileFormat: "PDF",
      status: "current",
      recommended: false,
      locale: "Global",
      assetType: "ガイドライン",
      usage: ["社内資料"],
      updatedAt: "2026-02-12T00:00:00Z",
      previousVersionId: null,
      replacedBy: null,
      thumbnailColor: "light",
      description: "CXOn のブランドガイドライン。社内配布の中心資料です。",
      driveId: "1ygGUE0w4bJqAQv7b8LCLxR3rEtmsLGS0",
      driveUrl: "https://drive.google.com/file/d/1ygGUE0w4bJqAQv7b8LCLxR3rEtmsLGS0/view?usp=drivesdk",
    }),
  ];
}

function buildSummaryText(count) {
  const parts = [];
  if (state.query) parts.push(`検索: ${state.query}`);
  if (state.sort === "recommended") parts.push("推奨優先");
  if (state.sort === "updatedDesc") parts.push("更新日順");
  if (state.sort === "nameAsc") parts.push("名前順");
  const filterCount = Object.values(state.filters).reduce((sum, bucket) => sum + bucket.size, 0);
  const visibility = [
    state.showDeprecated ? "Deprecated表示" : "Deprecated非表示",
    state.showArchived ? "Archived表示" : "Archived非表示",
  ].join(" / ");
  const base = parts.length ? parts.join(" / ") : "全件表示";
  return `${base} · ${filterCount}フィルタ · ${visibility} · ${count}件`;
}

function normalize(value) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSearchText(value) {
  return normalize(value).concat(" ", normalize(buildSearchAliasText(value)));
}

function expandSearchToken(token) {
  const variants = new Set([token]);
  const aliases = searchAliases[token] ?? [];
  aliases.forEach((alias) => variants.add(normalize(alias)));
  return [...variants].filter(Boolean);
}

function buildSearchAliasText(value) {
  const normalized = normalize(value);
  const extraTerms = [];

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

function dateValue(value) {
  return new Date(value).getTime();
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function sanitizeFilename(title, format) {
  return `${title.replace(/[\\/:*?"<>|]/g, "_")}.${format.toLowerCase()}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
