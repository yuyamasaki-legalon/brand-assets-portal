import { createReadStream, promises } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { CodeChallengeMethod, OAuth2Client } from "google-auth-library";
//#region src/pages/sandbox/brand-asset-portal/catalog-types.ts
var defaultProducts = [
	"LegalOn",
	"GovernOn",
	"WorkOn",
	"DealOn",
	"LearningOn",
	"DocumentOn",
	"TrustOn",
	"On Technologies",
	"Shared"
].map((id, order) => ({
	id,
	label: id === "Shared" ? "全社共通" : id,
	state: "active",
	order
}));
//#endregion
//#region src/pages/sandbox/brand-asset-portal/drive-file.ts
function getDriveFileId(link) {
	if (!link) return "";
	try {
		const url = new URL(link.trim());
		if (url.protocol !== "https:" || url.hostname !== "drive.google.com" || url.port || url.username || url.password) return "";
		const pathId = url.pathname.match(/^\/file\/d\/([\w-]+)(?:\/|$)/)?.[1];
		const queryId = /^\/(open|uc)$/.test(url.pathname) ? url.searchParams.get("id") : null;
		const id = pathId || queryId || "";
		return /^[\w-]+$/.test(id) ? id : "";
	} catch {
		return "";
	}
}
function getDriveDownloadLink(id) {
	return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`;
}
//#endregion
//#region scripts/brand-asset-cms-api.ts
function createCatalogMiddleware(root, options = {}) {
	const dir = options.dataDir || path.join(root, ".brand-asset-cms");
	const file = path.join(dir, "catalog.json");
	let queue = Promise.resolve();
	let initialization;
	const seedUpdate = "truston-drive-2026-10-09";
	async function readSeed() {
		return JSON.parse(await promises.readFile(options.seedPath || path.join(root, "src/pages/sandbox/brand-asset-portal/assets-index.json"), "utf8"));
	}
	async function importTrustOn() {
		let current;
		try {
			current = JSON.parse(await promises.readFile(file, "utf8"));
		} catch (error) {
			if (error.code === "ENOENT") return;
			throw error;
		}
		if (current.appliedSeedUpdates?.includes(seedUpdate)) return;
		const incoming = (await readSeed()).filter((asset) => asset.brand === "TrustOn");
		if (!incoming.length) return;
		const ids = new Set(current.assets.map((asset) => asset.id));
		const driveIds = new Set(current.assets.map((asset) => asset.driveId).filter(Boolean));
		const product = defaultProducts.find((item) => item.id === "TrustOn");
		if (!product) throw new Error("TrustOn product is missing");
		const next = {
			...current,
			revision: current.revision + 1,
			products: current.products.some((item) => item.id === product.id) ? current.products : [...current.products, {
				...product,
				order: Math.max(-1, ...current.products.map((p) => p.order)) + 1
			}],
			assets: [...current.assets, ...incoming.filter((asset) => !ids.has(asset.id) && !driveIds.has(asset.driveId))],
			appliedSeedUpdates: [...current.appliedSeedUpdates || [], seedUpdate],
			lastChange: {
				actorId: "system:truston-seed-import",
				at: (/* @__PURE__ */ new Date()).toISOString()
			}
		};
		validate(next);
		await promises.mkdir(path.join(dir, "history"), {
			recursive: true,
			mode: 448
		});
		await promises.writeFile(path.join(dir, "history", `${current.revision}-${randomUUID()}.json`), JSON.stringify(current), { mode: 384 });
		const temp = `${file}.${randomUUID()}.tmp`;
		await promises.writeFile(temp, JSON.stringify(next), { mode: 384 });
		await promises.rename(temp, file);
	}
	async function load() {
		initialization ||= importTrustOn().catch((error) => {
			initialization = void 0;
			throw error;
		});
		await initialization;
		try {
			return JSON.parse(await promises.readFile(file, "utf8"));
		} catch (error) {
			if (error.code !== "ENOENT") throw error;
			const assets = await readSeed();
			return {
				revision: 0,
				products: defaultProducts,
				assets,
				appliedSeedUpdates: assets.some((a) => a.brand === "TrustOn") ? [seedUpdate] : []
			};
		}
	}
	function reply(res, status, body) {
		res.writeHead(status, {
			"Content-Type": "application/json",
			"Cache-Control": "no-store",
			"X-CMS-Mode": options.authorize ? "production" : "local"
		});
		res.end(JSON.stringify(body));
	}
	async function read(req) {
		const parts = [];
		let size = 0;
		for await (const chunk of req) {
			size += chunk.length;
			if (size > 8 * 1024 * 1024) throw new Error("登録データは8MB以内にしてください。");
			parts.push(Buffer.from(chunk));
		}
		return JSON.parse(Buffer.concat(parts).toString("utf8"));
	}
	function validate(data) {
		if (!Number.isInteger(data.revision) || !Array.isArray(data.products) || !Array.isArray(data.assets) || data.products.length > 100 || data.assets.length > 1e4) throw new Error("データ形式が正しくありません。");
		const ids = /* @__PURE__ */ new Set();
		const labels = /* @__PURE__ */ new Set();
		for (const p of data.products) {
			if (!p || typeof p.id !== "string" || !/^[\p{L}\p{N} _-]{1,80}$/u.test(p.id) || typeof p.label !== "string" || !p.label.trim() || p.label.length > 80 || ids.has(p.id) || labels.has(p.label.trim().toLowerCase()) || !["active", "ended"].includes(p.state) || !Number.isFinite(p.order)) throw new Error("プロダクト名の重複、空欄、状態を確認してください。");
			ids.add(p.id);
			labels.add(p.label.trim().toLowerCase());
		}
		const assetIds = /* @__PURE__ */ new Set();
		for (const a of data.assets) {
			if (!a || typeof a.id !== "string" || !a.id || assetIds.has(a.id) || typeof a.title !== "string" || !a.title.trim() || a.title.length > 300 || !ids.has(a.brand) || ![
				"current",
				"deprecated",
				"archived"
			].includes(a.status) || ![
				"PNG",
				"SVG",
				"PDF",
				"AI",
				"PSD",
				"PPT",
				"MP4",
				"JPG"
			].includes(a.fileFormat) || typeof a.assetType !== "string" || !a.assetType || !Number.isFinite(Date.parse(a.updatedAt))) throw new Error("アセットの必須項目または参照プロダクトが正しくありません。");
			assetIds.add(a.id);
			for (const key of [
				"description",
				"owner",
				"usageRights",
				"driveId",
				"expiresAt",
				"publication",
				"assetDomain"
			]) if (a[key] !== void 0 && (typeof a[key] !== "string" || a[key].length > 1e4)) throw new Error("入力項目は10000文字以内の文字列にしてください。");
			if (a.publication && !["draft", "published"].includes(a.publication)) throw new Error("公開状態が正しくありません。");
			if (a.assetDomain && !["brand", "corporate"].includes(a.assetDomain)) throw new Error("領域が正しくありません。");
			if (a.expiresAt && (!/^\d{4}-\d{2}-\d{2}$/.test(a.expiresAt) || !Number.isFinite(Date.parse(a.expiresAt)) || new Date(a.expiresAt).toISOString().slice(0, 10) !== a.expiresAt)) throw new Error("利用期限が正しくありません。");
			for (const key of ["usage", "tags"]) if (a[key] !== void 0 && (!Array.isArray(a[key]) || a[key].some((value) => typeof value !== "string"))) throw new Error("タグと用途は文字列の一覧にしてください。");
			for (const key of [
				"driveUrl",
				"downloadUrl",
				"thumbnailUrl"
			]) {
				const url = a[key];
				if (url !== void 0 && typeof url !== "string") throw new Error("リンクは文字列にしてください。");
				if (key === "thumbnailUrl" && url?.startsWith("data:") && Buffer.byteLength(url.split(",")[1] || "", "base64") > 512 * 1024) throw new Error("サムネイルは512KB以内にしてください。");
				if (url && !(key === "thumbnailUrl" && /^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(url))) {
					if (!url.startsWith("https://") || new URL(url).username || new URL(url).password) throw new Error("リンクにはHTTPSのURLを指定してください。");
				}
			}
		}
	}
	return (req, res, next = () => {}) => {
		const route = req.url?.split("?")[0];
		const localSession = !options.authorize && route === "/api/auth/session";
		if (route !== "/api/brand-assets/catalog" && !localSession) return next();
		const host = req.headers.host || "";
		const address = req.socket.remoteAddress || "";
		if (!options.authorize && (!/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host) || ![
			"127.0.0.1",
			"::1",
			"::ffff:127.0.0.1"
		].includes(address))) return reply(res, 403, { error: "ローカル管理APIはlocalhostからのみ利用できます。" });
		const expectedOrigin = options.publicOrigin || `http://${host}`;
		if (req.headers.origin && req.headers.origin !== expectedOrigin || options.authorize && req.method === "PUT" && req.headers.origin !== expectedOrigin) return reply(res, 403, { error: "アクセス元が一致しません。" });
		if (localSession) return reply(res, req.method === "GET" ? 200 : 405, {
			mode: "local",
			authenticated: false
		});
		const actorId = options.authorize?.(req, res);
		if (options.authorize && !actorId) return;
		if (req.method === "GET") {
			load().then((data) => reply(res, 200, data)).catch(() => reply(res, 500, { error: "保存データを読み込めません。" }));
			return;
		}
		if (req.method !== "PUT") return reply(res, 405, { error: "対応していない操作です。" });
		if (!req.headers["content-type"]?.startsWith("application/json")) return reply(res, 415, { error: "JSON形式が必要です。" });
		queue = queue.then(async () => {
			try {
				const data = await read(req);
				const deletedAssetIds = data.deletedAssetIds ?? [];
				delete data.deletedAssetIds;
				if (!Array.isArray(deletedAssetIds) || deletedAssetIds.some((id) => typeof id !== "string") || new Set(deletedAssetIds).size !== deletedAssetIds.length) throw new Error("削除対象が正しくありません。");
				validate(data);
				const current = await load();
				data.appliedSeedUpdates = current.appliedSeedUpdates;
				if (current.revision !== data.revision) return reply(res, 409, { error: "他の利用者が更新しました。再読み込みしてから保存してください。" });
				if (current.products.some((p) => !data.products.some((n) => n.id === p.id))) throw new Error("プロダクトは削除せず終了状態に変更してください。");
				const removedIds = current.assets.filter((a) => !data.assets.some((n) => n.id === a.id)).map((a) => a.id);
				if (removedIds.length !== deletedAssetIds.length || removedIds.some((id) => !deletedAssetIds.includes(id))) throw new Error("削除対象を明示してください。再読み込みしてから削除してください。");
				const existingAssets = new Map(current.assets.map((a) => [a.id, a]));
				for (const asset of data.assets) {
					if (isDeepStrictEqual(existingAssets.get(asset.id), asset)) continue;
					const driveId = getDriveFileId(asset.driveUrl);
					if (!driveId) throw new Error("Google Driveのファイルリンクが必須です。フォルダーや他サイトのリンクは登録できません。");
					asset.driveUrl = asset.driveUrl?.trim();
					asset.driveId = driveId;
					asset.downloadUrl = getDriveDownloadLink(driveId);
				}
				data.revision += 1;
				if (actorId) data.lastChange = {
					actorId,
					at: (/* @__PURE__ */ new Date()).toISOString()
				};
				else delete data.lastChange;
				await promises.mkdir(path.join(dir, "history"), {
					recursive: true,
					mode: 448
				});
				await promises.writeFile(path.join(dir, "history", `${current.revision}-${randomUUID()}.json`), JSON.stringify(current), { mode: 384 });
				const temp = `${file}.${randomUUID()}.tmp`;
				await promises.writeFile(temp, JSON.stringify(data), { mode: 384 });
				await promises.rename(temp, file);
				try {
					const historyDir = path.join(dir, "history");
					const histories = (await promises.readdir(historyDir)).filter((name) => /^\d+-[\da-f-]+\.json$/.test(name)).sort((a, b) => Number.parseInt(b, 10) - Number.parseInt(a, 10));
					await Promise.all(histories.slice(20).map((name) => promises.unlink(path.join(historyDir, name))));
				} catch {}
				reply(res, 200, data);
			} catch (error) {
				reply(res, 400, { error: error instanceof Error ? error.message : "保存できません。" });
			}
		}).catch(() => reply(res, 500, { error: "保存に失敗しました。" }));
	};
}
//#endregion
//#region scripts/brand-asset-google-auth.ts
var sessionName = "__Host-brand_cms_session";
var flowName = "__Host-brand_cms_flow";
var fresh = () => randomBytes(32).toString("base64url");
var digest = (value) => createHash("sha256").update(value).digest("base64url");
function equal(a, b) {
	if (!a || !b || a.length > 256 || b.length > 256) return false;
	const left = Buffer.from(a), right = Buffer.from(b);
	return left.length === right.length && timingSafeEqual(left, right);
}
function cookie(req, name) {
	return req.headers.cookie?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);
}
function setCookie(res, name, value, age) {
	const existing = res.getHeader("Set-Cookie");
	const all = Array.isArray(existing) ? existing : existing ? [String(existing)] : [];
	res.setHeader("Set-Cookie", [...all, `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`]);
}
function json(res, status, data) {
	res.writeHead(status, {
		"Content-Type": "application/json",
		"Cache-Control": "no-store"
	});
	res.end(JSON.stringify(data));
}
function requireCompanyAccount(payload, config, nonce) {
	if (!payload.sub || !payload.email || payload.email_verified !== true || !payload.hd || !config.domains.includes(payload.hd.toLowerCase()) || !config.domains.includes(payload.email.split("@")[1]?.toLowerCase()) || !equal(payload.nonce, nonce) || payload.aud !== config.clientId || !["accounts.google.com", "https://accounts.google.com"].includes(payload.iss) || !Number.isFinite(payload.exp) || payload.exp * 1e3 <= Date.now()) throw new Error("Company account verification failed");
	return {
		actorId: payload.sub,
		email: payload.email
	};
}
function googleProvider(config) {
	const client = new OAuth2Client({
		clientId: config.clientId,
		clientSecret: config.clientSecret,
		redirectUri: `${config.origin}/api/auth/google/callback`
	});
	return {
		authorizationUrl: (state, nonce, challenge) => client.generateAuthUrl({
			scope: ["openid", "email"],
			access_type: "online",
			prompt: "select_account",
			hd: config.domains[0],
			state,
			nonce,
			code_challenge: challenge,
			code_challenge_method: CodeChallengeMethod.S256
		}),
		async exchangeAndVerify(code, verifier) {
			const { tokens } = await client.getToken({
				code,
				codeVerifier: verifier
			});
			if (!tokens.id_token) throw new Error("No ID token");
			const payload = (await client.verifyIdToken({
				idToken: tokens.id_token,
				audience: config.clientId
			})).getPayload();
			if (!payload) throw new Error("No verified identity");
			return payload;
		}
	};
}
function createGoogleAuth(config, provider = googleProvider(config)) {
	const flows = /* @__PURE__ */ new Map();
	const sessions = /* @__PURE__ */ new Map();
	function clean() {
		for (const [id, flow] of flows) if (flow.expires < Date.now()) flows.delete(id);
		for (const [id, session] of sessions) if (session.expires < Date.now()) sessions.delete(id);
	}
	function session(req) {
		clean();
		const id = cookie(req, sessionName);
		return id && id.length < 128 ? sessions.get(digest(id)) : void 0;
	}
	function authorize(req, res) {
		const user = session(req);
		if (!user) {
			json(res, 401, { error: "会社のGoogleアカウントでログインしてください。" });
			return null;
		}
		if (req.method !== "GET" && (req.headers.origin !== config.origin || !equal(req.headers["x-csrf-token"], user.csrfToken))) {
			json(res, 403, { error: "ログイン状態を更新してから操作してください。" });
			return null;
		}
		return user.actorId;
	}
	async function handle(req, res) {
		const url = new URL(req.url || "/", config.origin);
		if (!url.pathname.startsWith("/api/auth/")) return false;
		res.setHeader("Cache-Control", "no-store");
		res.setHeader("Referrer-Policy", "no-referrer");
		clean();
		if (url.pathname === "/api/auth/session" && req.method === "GET") {
			const user = session(req);
			json(res, 200, {
				mode: "production",
				authenticated: Boolean(user),
				email: user?.email,
				csrfToken: user?.csrfToken
			});
			return true;
		}
		if (url.pathname === "/api/auth/google/start" && req.method === "GET") {
			if (flows.size >= 1e3 || sessions.size >= 1e4) {
				json(res, 429, { error: "しばらく待って再試行してください。" });
				return true;
			}
			const old = cookie(req, flowName);
			if (old) flows.delete(old);
			const state = fresh(), nonce = fresh(), verifier = fresh();
			flows.set(state, {
				nonce,
				verifier,
				expires: Date.now() + 600 * 1e3
			});
			setCookie(res, flowName, state, 600);
			res.writeHead(302, { Location: provider.authorizationUrl(state, nonce, digest(verifier)) });
			res.end();
			return true;
		}
		if (url.pathname === "/api/auth/google/callback" && req.method === "GET") {
			const state = url.searchParams.get("state") || "";
			const browserState = cookie(req, flowName);
			const flow = flows.get(state);
			if (!flow || !equal(browserState, state) || flow.expires <= Date.now()) {
				json(res, 400, { error: "ログイン確認が期限切れです。もう一度ログインしてください。" });
				return true;
			}
			flows.delete(state);
			setCookie(res, flowName, "", 0);
			try {
				const code = url.searchParams.get("code");
				if (!code || code.length > 4096 || url.searchParams.has("error")) throw new Error("No authorization code");
				const verifiedPayload = await provider.exchangeAndVerify(code, flow.verifier);
				const employee = requireCompanyAccount(verifiedPayload, config, flow.nonce);
				const oldId = cookie(req, sessionName);
				if (oldId) sessions.delete(digest(oldId));
				const id = fresh();
				sessions.set(digest(id), {
					...employee,
					csrfToken: fresh(),
					expires: Math.min(verifiedPayload.exp * 1e3, Date.now() + 3600 * 1e3)
				});
				setCookie(res, sessionName, id, 3600);
				res.writeHead(302, { Location: "/brand-asset-portal/index.html" });
				res.end();
			} catch {
				json(res, 403, { error: "会社アカウントを確認できませんでした。会社のGoogleアカウントで再度ログインしてください。" });
			}
			return true;
		}
		if (url.pathname === "/api/auth/logout" && req.method === "POST") {
			if (!authorize(req, res)) return true;
			const id = cookie(req, sessionName);
			if (id) sessions.delete(digest(id));
			setCookie(res, sessionName, "", 0);
			json(res, 200, { ok: true });
			return true;
		}
		json(res, 404, { error: "認証操作が見つかりません。" });
		return true;
	}
	return {
		handle,
		authorize
	};
}
//#endregion
//#region scripts/brand-asset-production-config.ts
function readProductionConfig(env) {
	const origin = new URL(env.CMS_PUBLIC_ORIGIN || "https://brand-assets-portal.ontechnologies.tech");
	if (origin.protocol !== "https:" || origin.pathname !== "/" || origin.username || origin.password || origin.search || origin.hash) throw new Error("CMS_PUBLIC_ORIGIN must be an HTTPS origin");
	const clientId = env.GOOGLE_OAUTH_CLIENT_ID;
	const clientSecret = env.GOOGLE_OAUTH_CLIENT_SECRET;
	const domains = (env.GOOGLE_ALLOWED_DOMAINS || "legalontech.jp").split(",").map((d) => d.trim().toLowerCase());
	if (!clientId || !clientSecret || !env.CMS_DATA_DIR) throw new Error("Configure Google OAuth and a persistent CMS_DATA_DIR before startup");
	if (!path.isAbsolute(env.CMS_DATA_DIR) || domains.some((d) => !/^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/.test(d))) throw new Error("Invalid CMS data directory or company domains");
	if (env.RAILWAY_ENVIRONMENT_ID && (!env.RAILWAY_VOLUME_MOUNT_PATH || !(path.resolve(env.CMS_DATA_DIR) === path.resolve(env.RAILWAY_VOLUME_MOUNT_PATH) || path.resolve(env.CMS_DATA_DIR).startsWith(`${path.resolve(env.RAILWAY_VOLUME_MOUNT_PATH)}${path.sep}`)))) throw new Error("Railway requires a persistent volume for CMS_DATA_DIR");
	return {
		origin: origin.origin,
		clientId,
		clientSecret,
		domains,
		dataDir: env.CMS_DATA_DIR
	};
}
//#endregion
//#region scripts/brand-asset-production-server.ts
var types = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript",
	".css": "text/css",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".woff": "font/woff",
	".woff2": "font/woff2",
	".ico": "image/x-icon"
};
function createProductionServer(config, staticDir, seedPath, provider) {
	if (path.resolve(config.dataDir).startsWith(`${path.resolve(staticDir)}${path.sep}`) || path.resolve(config.dataDir) === path.resolve(staticDir)) throw new Error("CMS data must be outside the public directory");
	const auth = createGoogleAuth(config, provider);
	const catalog = createCatalogMiddleware(staticDir, {
		dataDir: config.dataDir,
		seedPath,
		publicOrigin: config.origin,
		authorize: auth.authorize
	});
	return createServer((req, res) => {
		res.setHeader("X-Content-Type-Options", "nosniff");
		res.setHeader("Referrer-Policy", "no-referrer");
		res.setHeader("X-Frame-Options", "DENY");
		res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' https://accounts.google.com https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://accounts.google.com https://www.googleapis.com https://oauth2.googleapis.com; frame-src https://accounts.google.com https://drive.google.com https://docs.google.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
		(async () => {
			const pathname = new URL(req.url || "/", config.origin).pathname;
			if (pathname === "/health" && req.method === "GET") {
				res.writeHead(200);
				res.end("ok");
				return;
			}
			if (await auth.handle(req, res)) return;
			if (pathname === "/api/brand-assets/catalog") {
				catalog(req, res);
				return;
			}
			if (pathname.startsWith("/api/")) {
				res.writeHead(404);
				res.end();
				return;
			}
			if (req.method !== "GET" && req.method !== "HEAD") {
				res.writeHead(405);
				res.end();
				return;
			}
			const route = decodeURIComponent(pathname === "/" || pathname === "/index.html" ? "/brand-asset-portal/index.html" : pathname);
			if (!(route === "/brand-asset-portal/index.html" || route === "/index.html" || /^\/(assets|brand-asset-portal-media)\//.test(route)) || route.split("/").some((part) => part.startsWith(".") || part.includes("\\"))) {
				res.writeHead(404);
				res.end();
				return;
			}
			const file = path.resolve(staticDir, `.${route}`);
			const realFile = await promises.realpath(file);
			const realRoot = await promises.realpath(staticDir);
			if (!realFile.startsWith(`${realRoot}${path.sep}`)) {
				res.writeHead(404);
				res.end();
				return;
			}
			const stat = await promises.stat(realFile);
			if (!stat.isFile()) {
				res.writeHead(404);
				res.end();
				return;
			}
			const ext = path.extname(file);
			res.writeHead(200, {
				"Content-Type": types[ext] || "application/octet-stream",
				"Content-Length": stat.size,
				"Cache-Control": ext === ".html" ? "no-store" : "public, max-age=3600"
			});
			if (req.method === "HEAD") {
				res.end();
				return;
			}
			createReadStream(realFile).on("error", () => res.destroy()).pipe(res);
		})().catch(() => {
			if (!res.headersSent) res.writeHead(404);
			res.end();
		});
	});
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	const config = readProductionConfig(process.env);
	const staticDir = process.env.CMS_STATIC_DIR || path.resolve("public");
	const seedPath = process.env.CMS_SEED_PATH || path.resolve("cms-seed.json");
	await promises.mkdir(config.dataDir, {
		recursive: true,
		mode: 448
	});
	await promises.access(config.dataDir, promises.constants.W_OK);
	await promises.access(seedPath);
	createProductionServer(config, staticDir, seedPath).listen(Number(process.env.PORT || 3e3), "0.0.0.0");
}
//#endregion
export { createProductionServer };
