import type { IncomingMessage, ServerResponse } from "node:http";

const maxImageBytes = 2 * 1024 * 1024;
const imageTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

async function readBounded(response: Response, limit: number) {
  if (Number(response.headers.get("content-length")) > limit) throw new Error("Too large");
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Empty response");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > limit) throw new Error("Too large");
      chunks.push(value);
    }
    return Buffer.concat(chunks, size);
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

// No service account, shared cache, disk writes or token logging. Each request
// checks both the portal session and the requesting user's Drive permissions.
export function createDriveThumbnailHandler(
  authorize: (req: IncomingMessage, res: ServerResponse) => string | null,
  fetchGoogle: typeof fetch = fetch,
) {
  let active = 0;
  return async (req: IncomingMessage, res: ServerResponse, fileId: string) => {
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("Content-Type", "application/json");
    const reply = (status: number, body: object = {}) => {
      res.writeHead(status);
      res.end(JSON.stringify(body));
    };
    if (req.method !== "GET") return reply(405);
    if (!authorize(req, res)) return;
    if (!/^[\w-]{10,200}$/.test(fileId)) return reply(400);
    const bearer = req.headers.authorization;
    if (!bearer || !/^Bearer [A-Za-z0-9._~+/-]{1,4096}={0,2}$/.test(bearer)) return reply(401);
    if (active >= 8) return reply(429);
    active++;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    const abort = () => controller.abort();
    res.on("close", abort);
    try {
      const options: RequestInit = {
        headers: { Authorization: bearer },
        signal: controller.signal,
        redirect: "error",
      };
      const metadata = await fetchGoogle(
        `https://www.googleapis.com/drive/v3/files/${fileId}?fields=thumbnailLink&supportsAllDrives=true`,
        options,
      );
      if (!metadata.ok) return reply(metadata.status === 401 ? 401 : 404);
      const data = JSON.parse((await readBounded(metadata, 16384)).toString("utf8"));
      if (typeof data.thumbnailLink !== "string") return reply(404);
      const url = new URL(data.thumbnailLink);
      // Only URLs returned by Google metadata, on Google's image CDN. Never
      // forward credentials to arbitrary hosts or follow an upstream redirect.
      if (
        url.protocol !== "https:" ||
        !url.hostname.endsWith(".googleusercontent.com") ||
        url.username ||
        url.password ||
        url.port
      )
        return reply(404);
      const image = await fetchGoogle(url.href, options);
      const mime = image.headers.get("content-type")?.split(";")[0].trim().toLowerCase() || "";
      if (!image.ok || !imageTypes.has(mime)) return reply(404);
      const bytes = await readBounded(image, maxImageBytes);
      if (!bytes.length) return reply(404);
      reply(200, { dataUrl: `data:${mime};base64,${bytes.toString("base64")}` });
    } catch {
      // Never include upstream errors/URLs/tokens in responses or logs.
      if (!res.destroyed) reply(502);
    } finally {
      clearTimeout(timer);
      res.off("close", abort);
      active--;
    }
  };
}
