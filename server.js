const fs = require("fs");
const path = require("path");
const express = require("express");
const { google } = require("googleapis");

loadEnvFile(path.join(__dirname, ".env"));

const app = express();
const PORT = Number(process.env.PORT || 3000);
const ROOT_DIR = __dirname;
const INDEX_PATH = path.join(ROOT_DIR, "assets-index.json");
const DYNAMIC_LOGO_FOLDER_IDS = {
  LegalOn: [process.env.LEGALON_LOGO_FOLDER_ID || "1Z67ygGzOb47j1FzI4iIvVnWwlZS8zOeB"].filter(Boolean),
  GovernOn: [process.env.GOVERNON_LOGO_FOLDER_ID || "1LNLqhFX8iEmoDkl5tLHZ9X44i5gX2RIF"].filter(Boolean),
  WorkOn: [process.env.WORKON_LOGO_FOLDER_ID || "1fZQnusoKYO5414IuHRwrfVG14CdSVD1A"].filter(Boolean),
  DealOn: dedupeFolderIds([
    "1dQpCg63IAaaSWR0y9VDoEmh6aSoNCnYV",
    "1K5B_MLeqjPitAB6_mIgg3l5QgmGhigvD",
    "1bKMtbX1fjbc-r1819v5E_fc-ih2I2yFN",
    process.env.DEALON_LOGO_FOLDER_ID,
    process.env.DEALON_LOGO_PNG_FOLDER_ID,
    process.env.DEALON_LOGO_JPG_FOLDER_ID,
  ]),
  CXOn: [process.env.CXON_LOGO_FOLDER_ID || "1dAKtf7uvtpHvT0q2GnF17SUrhHBjLFbx"].filter(Boolean),
};

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) return;
    const key = trimmed.slice(0, separatorIndex).trim();
    if (!key || process.env[key] !== undefined) return;
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
  });
}

app.use(express.static(ROOT_DIR));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    hasDriveAuth: hasDriveCredentials(),
  });
});

app.get("/api/assets", async (_req, res) => {
  try {
    const staticAssets = readAssetsIndex();
    const dynamicLogoAssets = hasDriveCredentials()
      ? await buildDynamicLogoAssets()
      : [];
    const assets = mergeAssets(staticAssets, dynamicLogoAssets).map(enrichAsset);
    res.setHeader("Cache-Control", "no-store");
    res.json(assets);
  } catch (error) {
    res.status(500).json({
      error: "assets_index_unavailable",
      message: error.message,
    });
  }
});

app.get("/api/thumbnail/:fileId", async (req, res) => {
  try {
    const drive = await getDriveClient();
    const metadata = await drive.files.get({
      fileId: req.params.fileId,
      fields: "id,name,mimeType,thumbnailLink,hasThumbnail",
      supportsAllDrives: true,
    });

    const file = metadata.data;
    if (!file?.id) {
      res.status(404).json({ error: "file_not_found" });
      return;
    }

    if (isDirectImageMime(file.mimeType)) {
      const mediaResponse = await drive.files.get(
        {
          fileId: file.id,
          alt: "media",
          supportsAllDrives: true,
        },
        {
          responseType: "stream",
        },
      );

      res.setHeader("Cache-Control", "private, max-age=3600");
      res.setHeader("Content-Type", file.mimeType || "application/octet-stream");
      mediaResponse.data.pipe(res);
      return;
    }

    if (file.thumbnailLink) {
      const token = await getAccessToken();
      const thumbnailResponse = await fetch(file.thumbnailLink, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!thumbnailResponse.ok || !thumbnailResponse.body) {
        throw new Error(`Thumbnail request failed with ${thumbnailResponse.status}`);
      }

      res.setHeader("Cache-Control", "private, max-age=3600");
      res.setHeader(
        "Content-Type",
        thumbnailResponse.headers.get("content-type") || "image/jpeg",
      );
      streamWebBodyToNodeResponse(thumbnailResponse.body, res);
      return;
    }

    res.status(404).json({ error: "thumbnail_unavailable" });
  } catch (error) {
    const statusCode =
      error.code === 403 || error.code === 404 ? Number(error.code) : 500;
    res.status(statusCode).json({
      error: "thumbnail_proxy_failed",
      message: error.message,
    });
  }
});

app.get("/api/download/:fileId", async (req, res) => {
  try {
    const drive = await getDriveClient();
    const metadata = await drive.files.get({
      fileId: req.params.fileId,
      fields: "id,name,mimeType",
      supportsAllDrives: true,
    });

    const file = metadata.data;
    if (!file?.id) {
      res.status(404).json({ error: "file_not_found" });
      return;
    }

    const downloadResponse = await drive.files.get(
      {
        fileId: file.id,
        alt: "media",
        supportsAllDrives: true,
      },
      {
        responseType: "stream",
      },
    );

    res.setHeader("Content-Type", file.mimeType || "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${sanitizeHeaderFilename(file.name || file.id)}"`,
    );
    downloadResponse.data.pipe(res);
  } catch (error) {
    const statusCode =
      error.code === 403 || error.code === 404 ? Number(error.code) : 500;
    res.status(statusCode).json({
      error: "download_proxy_failed",
      message: error.message,
    });
  }
});

app.get("/api/drive/:fileId", (req, res) => {
  res.redirect(`https://drive.google.com/file/d/${encodeURIComponent(req.params.fileId)}/view?usp=drivesdk`);
});

app.listen(PORT, () => {
  console.log(`Brand Asset Portal server is running at http://localhost:${PORT}`);
});

function readAssetsIndex() {
  return JSON.parse(fs.readFileSync(INDEX_PATH, "utf8"));
}

async function buildDynamicLogoAssets() {
  const drive = await getDriveClient();
  const assets = [];

  for (const [brand, folderIds] of Object.entries(DYNAMIC_LOGO_FOLDER_IDS)) {
    for (const folderId of folderIds) {
      const files = await walkDriveFolder(drive, folderId);
      const rasterLogos = files.filter(isRasterLogoFile);
      rasterLogos.forEach((file) => {
        assets.push(makeDynamicLogoAsset(brand, file));
      });
    }
  }

  return dedupeByKey(assets, (asset) => asset.driveId || asset.id);
}

async function walkDriveFolder(drive, folderId) {
  const collected = [];
  const queue = [folderId];

  while (queue.length > 0) {
    const currentId = queue.shift();
    let pageToken;

    do {
      const response = await drive.files.list({
        q: `'${currentId}' in parents and trashed = false`,
        fields: "nextPageToken, files(id,name,mimeType,webViewLink,modifiedTime)",
        pageSize: 1000,
        pageToken,
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
      });

      const files = response.data.files || [];
      files.forEach((file) => {
        if (file.mimeType === "application/vnd.google-apps.folder") {
          queue.push(file.id);
          return;
        }
        collected.push(file);
      });

      pageToken = response.data.nextPageToken;
    } while (pageToken);
  }

  return collected;
}

function isRasterLogoFile(file) {
  const filename = String(file?.name || "");
  const mimeType = String(file?.mimeType || "");
  if (!/logo/i.test(filename)) return false;
  return (
    mimeType === "image/png" ||
    mimeType === "image/jpeg" ||
    /\.(png|jpg|jpeg)$/i.test(filename)
  );
}

function makeDynamicLogoAsset(brand, file) {
  const filename = String(file.name || "");
  const baseName = filename.replace(/\.[^.]+$/, "");
  const colorVariant = detectColorVariant(baseName);
  const variantLabel = detectVariantLabel(baseName, colorVariant);
  const normalizedBase = normalizeLogoBaseName(baseName, brand);
  const assetGroupId = `${slugify(brand)}-${slugify(normalizedBase)}`;
  const fileFormat = /\.(jpe?g)$/i.test(filename) || file.mimeType === "image/jpeg" ? "JPG" : "PNG";

  return {
    id: `${assetGroupId}-${colorVariant}-${fileFormat.toLowerCase()}`,
    assetGroupId,
    title: buildLogoTitle(brand, normalizedBase, colorVariant),
    brand,
    fileFormat,
    status: "current",
    recommended: colorVariant === "color",
    locale: "Global",
    assetType: "ロゴ",
    usage: ["Webサイト", "営業資料"],
    updatedAt: file.modifiedTime || new Date().toISOString(),
    previousVersionId: null,
    replacedBy: null,
    thumbnailColor: colorVariant === "white" ? "dark" : "transparent",
    description: `${brand} のロゴ ${capitalize(colorVariant)} バリエーションです。`,
    driveId: file.id,
    driveUrl: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view?usp=drivesdk`,
    colorVariant,
    variantLabel,
  };
}

function mergeAssets(staticAssets, dynamicLogoAssets) {
  const crawledBrands = new Set(dynamicLogoAssets.map((asset) => asset.brand));
  const filteredStaticAssets = staticAssets.filter((asset) => {
    if (!crawledBrands.has(asset.brand)) return true;
    return !isRasterLogoAssetRecord(asset);
  });

  return dedupeByKey([...filteredStaticAssets, ...dynamicLogoAssets], (asset) => asset.id);
}

function isRasterLogoAssetRecord(asset) {
  return (
    asset.assetType === "ロゴ" &&
    (asset.fileFormat === "PNG" || asset.fileFormat === "JPG")
  );
}

function dedupeByKey(items, getKey) {
  const map = new Map();
  items.forEach((item) => {
    map.set(getKey(item), item);
  });
  return [...map.values()];
}

function detectColorVariant(name) {
  const normalized = String(name).toLowerCase();
  if (/(^|[\s_-])(white|wh)([\s_-]|$)/.test(normalized)) return "white";
  if (/(^|[\s_-])(black|bk|bgink)([\s_-]|$)/.test(normalized)) return "black";
  return "color";
}

function normalizeLogoBaseName(name, brand) {
  return String(name)
    .replace(new RegExp(brand, "ig"), "")
    .replace(/\.(png|jpg|jpeg)$/i, "")
    .replace(/(^|[\s_-])(white|wh|black|bk|bgink|color|green|rgb|main|bgblack|bgcolor)([\s_-]|$)/gi, " ")
    .replace(/logo/gi, " Logo ")
    .replace(/\s+/g, " ")
    .replace(/[_-]+/g, " ")
    .trim() || "Logo";
}

function buildLogoTitle(brand, baseName, colorVariant) {
  const cleanBase = baseName.replace(/\s+/g, " ").trim();
  const suffix = capitalize(colorVariant);
  return `${brand} ${cleanBase} ${suffix}`.replace(/\s+/g, " ").trim();
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
}

function dedupeFolderIds(ids) {
  return [...new Set(ids.filter(Boolean))];
}

function detectVariantLabel(name, colorVariant) {
  const normalized = String(name).toLowerCase();
  if (normalized.includes("bgblack") && colorVariant === "white") return "White on Dark";
  if (normalized.includes("bgcolor") && colorVariant === "white") return "White on Light";
  return capitalize(colorVariant);
}

function enrichAsset(asset) {
  if (!asset?.driveId) return asset;
  return {
    ...asset,
    thumbnailUrl: `/api/thumbnail/${encodeURIComponent(asset.driveId)}`,
    downloadUrl: `/api/download/${encodeURIComponent(asset.driveId)}`,
    driveOpenUrl: `/api/drive/${encodeURIComponent(asset.driveId)}`,
  };
}

function hasDriveCredentials() {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_SERVICE_ACCOUNT_JSON_PATH,
  );
}

let driveClientPromise;
async function getDriveClient() {
  if (!driveClientPromise) {
    driveClientPromise = createDriveClient();
  }
  return driveClientPromise;
}

async function createDriveClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: readServiceAccountCredentials(),
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  return google.drive({
    version: "v3",
    auth,
  });
}

async function getAccessToken() {
  const auth = new google.auth.GoogleAuth({
    credentials: readServiceAccountCredentials(),
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  if (!tokenResponse?.token) {
    throw new Error("Failed to obtain Google Drive access token.");
  }
  return tokenResponse.token;
}

function readServiceAccountCredentials() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  }

  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON_PATH) {
    const credentialPath = path.resolve(process.env.GOOGLE_SERVICE_ACCOUNT_JSON_PATH);
    return JSON.parse(fs.readFileSync(credentialPath, "utf8"));
  }

  throw new Error(
    "Google Drive credentials are missing. Set GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_SERVICE_ACCOUNT_JSON_PATH.",
  );
}

function isDirectImageMime(mimeType) {
  return typeof mimeType === "string" && mimeType.startsWith("image/");
}

function sanitizeHeaderFilename(filename) {
  return String(filename).replace(/["\r\n]/g, "_");
}

async function streamWebBodyToNodeResponse(body, res) {
  const reader = body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    res.write(Buffer.from(value));
  }
  res.end();
}
