import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import type { Plugin } from "vite";
import { type Catalog, defaultProducts } from "../src/pages/sandbox/brand-asset-portal/catalog-types";
import { getDriveDownloadLink, getDriveFileId } from "../src/pages/sandbox/brand-asset-portal/drive-file";
import { publishedCatalog } from "./brand-asset-catalog-view";

// Development API is deliberately loopback-only. Production must install employee SSO
// middleware and a shared persistent store before mounting the same contract.
type CatalogApiOptions = {
  dataDir?: string;
  seedPath?: string;
  importsPath?: string;
  publicOrigin?: string;
  authorize?: (req: IncomingMessage, res: ServerResponse) => string | null;
  authorizeRead?: (req: IncomingMessage, res: ServerResponse) => string | null;
  publicSearch?: boolean;
};

export function createCatalogMiddleware(root: string, options: CatalogApiOptions = {}) {
  const dir = options.dataDir || path.join(root, ".brand-asset-cms");
  const file = path.join(dir, "catalog.json");
  let queue = Promise.resolve();
  let initialization: Promise<void> | undefined;
  const seedUpdate = "truston-drive-2026-10-09";
  const templateUpdate = "truston-potx-template-2026-11-16";
  const templateDriveId = "1ycsMOAX4bNwisqDO4DrKcJpzYiGbfFz7";
  async function readSeed() {
    return JSON.parse(
      await fs.readFile(
        options.seedPath || path.join(root, "src/pages/sandbox/brand-asset-portal/assets-index.json"),
        "utf8",
      ),
    ) as Catalog["assets"];
  }
  async function importTrustOn(update = seedUpdate, templateOnly = false) {
    let current: Catalog;
    try {
      current = JSON.parse(await fs.readFile(file, "utf8"));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
      throw error;
    }
    if (current.appliedSeedUpdates?.includes(update)) return;
    const incoming = (await readSeed()).filter(
      (asset) =>
        asset.brand === "TrustOn" &&
        (templateOnly ? asset.driveId === templateDriveId : asset.driveId !== templateDriveId),
    );
    if (!incoming.length) return;
    const ids = new Set(current.assets.map((asset) => asset.id));
    const driveIds = new Set(current.assets.map((asset) => asset.driveId).filter(Boolean));
    const product = defaultProducts.find((item) => item.id === "TrustOn");
    if (!product) throw new Error("TrustOn product is missing");
    const next: Catalog = {
      ...current,
      revision: current.revision + 1,
      products: current.products.some((item) => item.id === product.id)
        ? current.products
        : [...current.products, { ...product, order: Math.max(-1, ...current.products.map((p) => p.order)) + 1 }],
      assets: [...current.assets, ...incoming.filter((asset) => !ids.has(asset.id) && !driveIds.has(asset.driveId))],
      appliedSeedUpdates: [...(current.appliedSeedUpdates || []), update],
      lastChange: {
        actorId: templateOnly ? "system:truston-template-import" : "system:truston-seed-import",
        at: new Date().toISOString(),
      },
    };
    // Preserve access to the last valid catalogue if an editor must first free
    // capacity or resolve an existing label. Retry after the next read/save.
    if (
      next.products.length > 100 ||
      next.assets.length > 10000 ||
      new Set(next.products.map((p) => p.label.trim().toLowerCase())).size !== next.products.length
    )
      return false;
    validate(next);
    await fs.mkdir(path.join(dir, "history"), { recursive: true, mode: 0o700 });
    await fs.writeFile(path.join(dir, "history", `${current.revision}-${randomUUID()}.json`), JSON.stringify(current), {
      mode: 0o600,
    });
    const temp = `${file}.${randomUUID()}.tmp`;
    await fs.writeFile(temp, JSON.stringify(next), { mode: 0o600 });
    await fs.rename(temp, file);
  }
  async function load(): Promise<Catalog> {
    initialization ||= (async () => {
      // Persist the initial seed once. Subsequent releases never replace /data.
      try {
        await fs.access(file);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
        const assets = await readSeed();
        const initial: Catalog = {
          revision: 0,
          products: defaultProducts,
          assets,
          appliedSeedUpdates: [
            ...(assets.some((a) => a.brand === "TrustOn" && a.driveId !== templateDriveId) ? [seedUpdate] : []),
            ...(assets.some((a) => a.driveId === templateDriveId) ? [templateUpdate] : []),
          ],
        };
        validate(initial);
        await fs.mkdir(dir, { recursive: true, mode: 0o700 });
        const temp = `${file}.${randomUUID()}.tmp`;
        await fs.writeFile(temp, JSON.stringify(initial), { mode: 0o600 });
        await fs.rename(temp, file);
      }
      let pending = false;
      for (const templateOnly of [false, true]) {
        try {
          const result = await importTrustOn(templateOnly ? templateUpdate : seedUpdate, templateOnly);
          if (result === false) pending = true;
        } catch {
          // Retry pending batches without blocking the other import or existing data.
          pending = true;
        }
      }
      // Chat/repository additions must be explicit, immutable import batches,
      // not an automatic merge of every missing seed record (which resurrects deletions).
      if (options.importsPath) {
        const batches: { id: string; assets: Catalog["assets"] }[] = JSON.parse(
          await fs.readFile(options.importsPath, "utf8"),
        );
        if (!Array.isArray(batches) || new Set(batches.map((batch) => batch.id)).size !== batches.length)
          throw new Error("Invalid catalogue imports");
        for (const batch of batches) {
          if (!/^[a-z0-9-]{1,100}$/.test(batch.id) || !Array.isArray(batch.assets))
            throw new Error("Invalid catalogue import");
          const current: Catalog = JSON.parse(await fs.readFile(file, "utf8"));
          if (current.appliedSeedUpdates?.includes(batch.id)) continue;
          const ids = new Set(current.assets.map((asset) => asset.id));
          const driveIds = new Set(
            current.assets.map((asset) => getDriveFileId(asset.driveUrl) || asset.driveId).filter(Boolean),
          );
          const incoming = batch.assets.filter((asset) => {
            const driveId = getDriveFileId(asset.driveUrl);
            if (!driveId) throw new Error("Imported assets require a Drive file URL");
            if (ids.has(asset.id) || driveIds.has(driveId)) return false;
            ids.add(asset.id);
            driveIds.add(driveId);
            asset.driveId = driveId;
            asset.downloadUrl = getDriveDownloadLink(driveId);
            return true;
          });
          const next: Catalog = {
            ...current,
            revision: current.revision + 1,
            assets: [...current.assets, ...incoming],
            appliedSeedUpdates: [...(current.appliedSeedUpdates || []), batch.id],
            lastChange: { actorId: "system:catalog-import", at: new Date().toISOString() },
          };
          validate(next);
          await fs.mkdir(path.join(dir, "history"), { recursive: true, mode: 0o700 });
          await fs.writeFile(
            path.join(dir, "history", `${current.revision}-${randomUUID()}.json`),
            JSON.stringify(current),
            { mode: 0o600 },
          );
          const temp = `${file}.${randomUUID()}.tmp`;
          await fs.writeFile(temp, JSON.stringify(next), { mode: 0o600 });
          await fs.rename(temp, file);
          await pruneHistory();
        }
      }
      if (pending) initialization = undefined;
    })().catch((error) => {
      initialization = undefined;
      throw error;
    });
    await initialization;
    return JSON.parse(await fs.readFile(file, "utf8"));
  }
  async function pruneHistory() {
    try {
      const historyDir = path.join(dir, "history");
      const histories = (await fs.readdir(historyDir))
        .filter((name) => /^\d+-[\da-f-]+\.json$/.test(name))
        .sort((a, b) => Number.parseInt(b, 10) - Number.parseInt(a, 10));
      await Promise.all(histories.slice(20).map((name) => fs.unlink(path.join(historyDir, name))));
    } catch {
      /* The rename already committed. Cleanup is best-effort. */
    }
  }
  function reply(res: ServerResponse, status: number, body: unknown) {
    res.writeHead(status, {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-CMS-Mode": options.authorize ? "production" : "local",
    });
    res.end(JSON.stringify(body));
  }
  async function read(req: IncomingMessage) {
    const parts: Buffer[] = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 8 * 1024 * 1024) throw new Error("登録データは8MB以内にしてください。");
      parts.push(Buffer.from(chunk));
    }
    return JSON.parse(Buffer.concat(parts).toString("utf8"));
  }
  function validate(data: Catalog) {
    if (
      !Number.isInteger(data.revision) ||
      !Array.isArray(data.products) ||
      !Array.isArray(data.assets) ||
      data.products.length > 100 ||
      data.assets.length > 10000
    )
      throw new Error("データ形式が正しくありません。");
    const ids = new Set<string>();
    const labels = new Set<string>();
    for (const p of data.products) {
      if (
        !p ||
        typeof p.id !== "string" ||
        !/^[\p{L}\p{N} _-]{1,80}$/u.test(p.id) ||
        typeof p.label !== "string" ||
        !p.label.trim() ||
        p.label.length > 80 ||
        ids.has(p.id) ||
        labels.has(p.label.trim().toLowerCase()) ||
        !["active", "ended"].includes(p.state) ||
        !Number.isFinite(p.order)
      )
        throw new Error("プロダクト名の重複、空欄、状態を確認してください。");
      ids.add(p.id);
      labels.add(p.label.trim().toLowerCase());
    }
    const assetIds = new Set<string>();
    for (const a of data.assets) {
      if (
        !a ||
        typeof a.id !== "string" ||
        !a.id ||
        assetIds.has(a.id) ||
        typeof a.title !== "string" ||
        !a.title.trim() ||
        a.title.length > 300 ||
        !ids.has(a.brand) ||
        !["current", "deprecated", "archived"].includes(a.status) ||
        !["PNG", "SVG", "PDF", "AI", "PSD", "PPT", "MP4", "JPG"].includes(a.fileFormat) ||
        typeof a.assetType !== "string" ||
        !a.assetType ||
        !Number.isFinite(Date.parse(a.updatedAt))
      )
        throw new Error("アセットの必須項目または参照プロダクトが正しくありません。");
      assetIds.add(a.id);
      for (const key of [
        "description",
        "owner",
        "usageRights",
        "driveId",
        "expiresAt",
        "publication",
        "assetDomain",
      ] as const) {
        if (a[key] !== undefined && (typeof a[key] !== "string" || a[key].length > 10000))
          throw new Error("入力項目は10000文字以内の文字列にしてください。");
      }
      if (a.publication && !["draft", "published"].includes(a.publication))
        throw new Error("公開状態が正しくありません。");
      if (a.assetDomain && !["brand", "corporate"].includes(a.assetDomain)) throw new Error("領域が正しくありません。");
      if (
        a.expiresAt &&
        (!/^\d{4}-\d{2}-\d{2}$/.test(a.expiresAt) ||
          !Number.isFinite(Date.parse(a.expiresAt)) ||
          new Date(a.expiresAt).toISOString().slice(0, 10) !== a.expiresAt)
      )
        throw new Error("利用期限が正しくありません。");
      for (const key of ["usage", "tags"] as const) {
        if (a[key] !== undefined && (!Array.isArray(a[key]) || a[key].some((value) => typeof value !== "string")))
          throw new Error("タグと用途は文字列の一覧にしてください。");
      }
      for (const key of ["driveUrl", "downloadUrl", "thumbnailUrl"] as const) {
        const url = a[key];
        if (url !== undefined && typeof url !== "string") throw new Error("リンクは文字列にしてください。");
        if (
          key === "thumbnailUrl" &&
          url?.startsWith("data:") &&
          Buffer.byteLength(url.split(",")[1] || "", "base64") > 512 * 1024
        )
          throw new Error("サムネイルは512KB以内にしてください。");
        if (url && !(key === "thumbnailUrl" && /^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(url))) {
          if (!url.startsWith("https://") || new URL(url).username || new URL(url).password)
            throw new Error("リンクにはHTTPSのURLを指定してください。");
        }
      }
    }
  }
  return (req: IncomingMessage, res: ServerResponse, next: () => void = () => {}) => {
    const route = req.url?.split("?")[0];
    const search = route === "/api/brand-assets/search";
    const localSession = !options.authorize && route === "/api/auth/session";
    if (route !== "/api/brand-assets/catalog" && !search && !localSession) return next();
    const host = req.headers.host || "";
    const address = req.socket.remoteAddress || "";
    if (
      !options.authorize &&
      (!/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host) ||
        !["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(address))
    )
      return reply(res, 403, { error: "ローカル管理APIはlocalhostからのみ利用できます。" });
    const expectedOrigin = options.publicOrigin || `http://${host}`;
    if (
      (req.headers.origin && req.headers.origin !== expectedOrigin) ||
      (options.authorize && req.method === "PUT" && req.headers.origin !== expectedOrigin)
    )
      return reply(res, 403, { error: "アクセス元が一致しません。" });
    if (localSession) return reply(res, req.method === "GET" ? 200 : 405, { mode: "local", authenticated: false });
    // Only the sanitized, read-only projection can opt into anonymous access.
    // Never use this policy for the full catalogue or any write.
    if (search && req.method !== "GET") return reply(res, 405, { error: "閲覧専用APIです。" });
    const publicRead = search && options.publicSearch === true;
    const authorize = publicRead ? undefined : search ? options.authorizeRead || options.authorize : options.authorize;
    const actorId = authorize?.(req, res);
    if (options.authorize && !publicRead && !actorId) return;
    if (req.method === "GET") {
      queue = queue.then(() =>
        load()
          .then((data) => reply(res, 200, search ? publishedCatalog(data) : data))
          .catch(() => reply(res, 500, { error: "保存データを読み込めません。" })),
      );
      return;
    }
    if (req.method !== "PUT") return reply(res, 405, { error: "対応していない操作です。" });
    if (!req.headers["content-type"]?.startsWith("application/json"))
      return reply(res, 415, { error: "JSON形式が必要です。" });
    queue = queue
      .then(async () => {
        try {
          const data = (await read(req)) as Catalog & { deletedAssetIds?: string[] };
          const deletedAssetIds = data.deletedAssetIds ?? [];
          delete data.deletedAssetIds;
          if (
            !Array.isArray(deletedAssetIds) ||
            deletedAssetIds.some((id) => typeof id !== "string") ||
            new Set(deletedAssetIds).size !== deletedAssetIds.length
          )
            throw new Error("削除対象が正しくありません。");
          validate(data);
          const current = await load();
          // Import markers are server-owned, including when older clients omit them.
          data.appliedSeedUpdates = current.appliedSeedUpdates;
          if (current.revision !== data.revision)
            return reply(res, 409, { error: "他の利用者が更新しました。再読み込みしてから保存してください。" });
          if (current.products.some((p) => !data.products.some((n) => n.id === p.id)))
            throw new Error("プロダクトは削除せず終了状態に変更してください。");
          const removedIds = current.assets.filter((a) => !data.assets.some((n) => n.id === a.id)).map((a) => a.id);
          if (removedIds.length !== deletedAssetIds.length || removedIds.some((id) => !deletedAssetIds.includes(id)))
            throw new Error("削除対象を明示してください。再読み込みしてから削除してください。");
          const existingAssets = new Map(current.assets.map((a) => [a.id, a]));
          for (const asset of data.assets) {
            // Keep untouched legacy folder-only entries compatible with product updates.
            if (isDeepStrictEqual(existingAssets.get(asset.id), asset)) continue;
            const driveId = getDriveFileId(asset.driveUrl);
            if (!driveId)
              throw new Error("Google Driveのファイルリンクが必須です。フォルダーや他サイトのリンクは登録できません。");
            asset.driveUrl = asset.driveUrl?.trim();
            asset.driveId = driveId;
            asset.downloadUrl = getDriveDownloadLink(driveId);
          }
          data.revision += 1;
          if (actorId) data.lastChange = { actorId, at: new Date().toISOString() };
          else delete data.lastChange;
          await fs.mkdir(path.join(dir, "history"), { recursive: true, mode: 0o700 });
          await fs.writeFile(
            path.join(dir, "history", `${current.revision}-${randomUUID()}.json`),
            JSON.stringify(current),
            { mode: 0o600 },
          );
          const temp = `${file}.${randomUUID()}.tmp`;
          await fs.writeFile(temp, JSON.stringify(data), { mode: 0o600 });
          await fs.rename(temp, file);
          // Keep only the last 20 snapshots; never mirror original Drive files.
          // Rename commits the catalogue. Maintenance must not turn that success into a failure.
          try {
            const historyDir = path.join(dir, "history");
            const histories = (await fs.readdir(historyDir))
              .filter((name) => /^\d+-[\da-f-]+\.json$/.test(name))
              .sort((a, b) => Number.parseInt(b, 10) - Number.parseInt(a, 10));
            await Promise.all(histories.slice(20).map((name) => fs.unlink(path.join(historyDir, name))));
          } catch {
            // Best-effort history retention; the committed catalogue remains authoritative.
          }
          reply(res, 200, data);
        } catch (error) {
          reply(res, 400, { error: error instanceof Error ? error.message : "保存できません。" });
        }
      })
      .catch(() => reply(res, 500, { error: "保存に失敗しました。" }));
  };
}

export function createBrandAssetCmsPlugin(root: string): Plugin {
  return {
    name: "brand-asset-cms",
    configureServer(server) {
      server.middlewares.use(createCatalogMiddleware(root));
    },
  };
}
