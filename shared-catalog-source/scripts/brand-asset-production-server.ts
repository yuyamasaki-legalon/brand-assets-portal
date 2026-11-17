import { createHash } from "node:crypto";
import { createReadStream, promises as fs } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createCatalogMiddleware } from "./brand-asset-cms-api";
import { createDriveThumbnailHandler } from "./brand-asset-drive-thumbnail";
import { createGoogleAuth, type GoogleProvider } from "./brand-asset-google-auth";
import { readProductionConfig } from "./brand-asset-production-config";

export { readProductionConfig } from "./brand-asset-production-config";

const types: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};
export function createProductionServer(
  config: ReturnType<typeof readProductionConfig>,
  staticDir: string,
  seedPath: string,
  provider?: GoogleProvider,
) {
  let tomoniPolicy: Promise<string> | undefined;
  let portalScripts: Promise<Set<string>> | undefined;
  function currentPortalScripts() {
    portalScripts ||= fs
      .readFile(path.join(staticDir, "brand-asset-portal/index.html"), "utf8")
      .then(
        (html) =>
          new Set(
            [...html.matchAll(/<script\b[^>]*\bsrc="((?:\.\.\/|\/)assets\/[^"?]+\.js)"/g)].map(
              (match) => new URL(match[1], "https://portal.invalid/brand-asset-portal/index.html").pathname,
            ),
          ),
      );
    return portalScripts;
  }
  function getTomoniPolicy() {
    tomoniPolicy ||= fs.readFile(path.join(staticDir, "tomoni-ai-html/index.html"), "utf8").then((html) => {
      const hashes = [...html.replace(/\r\n?/g, "\n").matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)].map(
        (match) =>
          `'sha256-${createHash("sha256")
            .update(match[1] || "")
            .digest("base64")}'`,
      );
      return `default-src 'none'; script-src ${hashes.join(" ")}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'`;
    });
    return tomoniPolicy;
  }
  if (
    path.resolve(config.dataDir).startsWith(`${path.resolve(staticDir)}${path.sep}`) ||
    path.resolve(config.dataDir) === path.resolve(staticDir)
  )
    throw new Error("CMS data must be outside the public directory");
  const auth = createGoogleAuth(config, provider);
  const thumbnail = createDriveThumbnailHandler(auth.authorizeEmployee);
  const catalog = createCatalogMiddleware(staticDir, {
    dataDir: config.dataDir,
    seedPath,
    importsPath: path.join(path.dirname(seedPath), "cms-imports.json"),
    publicOrigin: config.origin,
    authorize: auth.authorize,
    authorizeRead: auth.authorizeEmployee,
  });
  return createServer((req, res) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' https://accounts.google.com https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://accounts.google.com https://www.googleapis.com https://oauth2.googleapis.com; frame-src https://accounts.google.com https://drive.google.com https://docs.google.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
    );
    void (async () => {
      const pathname = new URL(req.url || "/", config.origin).pathname;
      if (pathname === "/health" && req.method === "GET") {
        res.writeHead(200);
        res.end("ok");
        return;
      }
      if (await auth.handle(req, res)) return;
      if (pathname.startsWith("/api/brand-assets/thumbnail/")) {
        await thumbnail(req, res, pathname.slice("/api/brand-assets/thumbnail/".length));
        return;
      }
      if (pathname === "/api/brand-assets/catalog" || pathname === "/api/brand-assets/search") {
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
      const route = decodeURIComponent(
        pathname === "/" || pathname === "/index.html"
          ? "/brand-asset-portal/index.html"
          : pathname === "/tomoni-ai-html/" || pathname === "/tomoni-ai-html"
            ? "/tomoni-ai-html/index.html"
            : pathname,
      );
      const tomoniPage = route === "/tomoni-ai-html/index.html";
      // Retain historical artifacts on disk, but never serve stale bundles
      // containing the former anonymous catalogue or their source maps/JSON.
      if (/^\/assets\/.*\.(?:js|mjs|json|map)$/i.test(route) && !(await currentPortalScripts()).has(route)) {
        res.writeHead(404, { "Cache-Control": "no-store" });
        res.end();
        return;
      }
      const tomoniLicense = /^\/tomoni-ai-html\/licenses\/(?:BebasNeue-OFL\.txt|MPLUS1p-OFL\.txt|README\.md)$/.test(
        route,
      );
      const allowed =
        tomoniPage ||
        tomoniLicense ||
        route === "/brand-asset-portal/index.html" ||
        route === "/index.html" ||
        /^\/(assets|brand-asset-portal-media)\//.test(route);
      if (!allowed || route.split("/").some((part) => part.startsWith(".") || part.includes("\\"))) {
        res.writeHead(404);
        res.end();
        return;
      }
      const file = path.resolve(staticDir, `.${route}`);
      const realFile = await fs.realpath(file);
      const realRoot = await fs.realpath(staticDir);
      if (!realFile.startsWith(`${realRoot}${path.sep}`)) {
        res.writeHead(404);
        res.end();
        return;
      }
      const stat = await fs.stat(realFile);
      if (!stat.isFile()) {
        res.writeHead(404);
        res.end();
        return;
      }
      const ext = path.extname(file);
      if (tomoniPage) res.setHeader("Content-Security-Policy", await getTomoniPolicy());
      res.writeHead(200, {
        "Content-Type": tomoniLicense ? "text/plain; charset=utf-8" : types[ext] || "application/octet-stream",
        "Content-Length": stat.size,
        "Cache-Control": ext === ".html" ? "no-store" : "public, max-age=3600",
      });
      if (req.method === "HEAD") {
        res.end();
        return;
      }
      createReadStream(realFile)
        .on("error", () => res.destroy())
        .pipe(res);
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
  await fs.mkdir(config.dataDir, { recursive: true, mode: 0o700 });
  await fs.access(config.dataDir, fs.constants.W_OK);
  await fs.access(seedPath);
  createProductionServer(config, staticDir, seedPath).listen(Number(process.env.PORT || 3000), "0.0.0.0");
}
