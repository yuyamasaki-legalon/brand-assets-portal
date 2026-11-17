import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { CodeChallengeMethod, OAuth2Client, type TokenPayload } from "google-auth-library";

export type AuthConfig = {
  origin: string;
  clientId: string;
  clientSecret: string;
  domains: string[];
  editorEmails?: string[];
};
type Employee = { actorId: string; email: string };
type Session = Employee & { csrfToken: string; expires: number };
type Flow = { nonce: string; verifier: string; expires: number };
export type GoogleProvider = {
  authorizationUrl: (state: string, nonce: string, challenge: string) => string;
  exchangeAndVerify: (code: string, verifier: string) => Promise<TokenPayload & { nonce?: string }>;
};
const sessionName = "__Host-brand_cms_session";
const flowName = "__Host-brand_cms_flow";
const fresh = () => randomBytes(32).toString("base64url");
const digest = (value: string) => createHash("sha256").update(value).digest("base64url");
function equal(a: string | undefined, b: string | undefined) {
  if (!a || !b || a.length > 256 || b.length > 256) return false;
  const left = Buffer.from(a),
    right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
function cookie(req: IncomingMessage, name: string) {
  return req.headers.cookie
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}
function setCookie(res: ServerResponse, name: string, value: string, age: number) {
  const existing = res.getHeader("Set-Cookie");
  const all = Array.isArray(existing) ? existing : existing ? [String(existing)] : [];
  res.setHeader("Set-Cookie", [...all, `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`]);
}
function json(res: ServerResponse, status: number, data: unknown) {
  res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  res.end(JSON.stringify(data));
}

// Signature, audience, issuer and expiry are verified by the Google library FIRST.
export function requireCompanyAccount(
  payload: TokenPayload & { nonce?: string },
  config: AuthConfig,
  nonce: string,
): Employee {
  if (
    !payload.sub ||
    !payload.email ||
    payload.email_verified !== true ||
    !payload.hd ||
    !config.domains.includes(payload.hd.toLowerCase()) ||
    !config.domains.includes(payload.email.split("@")[1]?.toLowerCase()) ||
    !equal(payload.nonce, nonce) ||
    payload.aud !== config.clientId ||
    !["accounts.google.com", "https://accounts.google.com"].includes(payload.iss) ||
    !Number.isFinite(payload.exp) ||
    payload.exp * 1000 <= Date.now()
  )
    throw new Error("Company account verification failed");
  return { actorId: payload.sub, email: payload.email };
}

function googleProvider(config: AuthConfig): GoogleProvider {
  const client = new OAuth2Client({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    redirectUri: `${config.origin}/api/auth/google/callback`,
  });
  return {
    authorizationUrl: (state, nonce, challenge) =>
      client.generateAuthUrl({
        scope: ["openid", "email"],
        access_type: "online",
        prompt: "select_account",
        hd: config.domains[0],
        state,
        nonce,
        code_challenge: challenge,
        code_challenge_method: CodeChallengeMethod.S256,
      }),
    async exchangeAndVerify(code, verifier) {
      const { tokens } = await client.getToken({ code, codeVerifier: verifier });
      if (!tokens.id_token) throw new Error("No ID token");
      const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: config.clientId });
      const payload = ticket.getPayload();
      if (!payload) throw new Error("No verified identity");
      return payload;
    },
  };
}

export function createGoogleAuth(config: AuthConfig, provider: GoogleProvider = googleProvider(config)) {
  const flows = new Map<string, Flow>();
  const sessions = new Map<string, Session>();
  function clean() {
    for (const [id, flow] of flows) if (flow.expires < Date.now()) flows.delete(id);
    for (const [id, session] of sessions) if (session.expires < Date.now()) sessions.delete(id);
  }
  function session(req: IncomingMessage) {
    clean();
    const id = cookie(req, sessionName);
    return id && id.length < 128 ? sessions.get(digest(id)) : undefined;
  }
  function authorize(req: IncomingMessage, res: ServerResponse): string | null {
    const user = session(req);
    if (!user) {
      json(res, 401, { error: "会社のGoogleアカウントでログインしてください。" });
      return null;
    }
    if (
      req.method !== "GET" &&
      (req.headers.origin !== config.origin ||
        !equal(req.headers["x-csrf-token"] as string | undefined, user.csrfToken))
    ) {
      json(res, 403, { error: "ログイン状態を更新してから操作してください。" });
      return null;
    }
    return user.actorId;
  }
  function canEdit(user: Employee | undefined) {
    return Boolean(
      user && config.editorEmails?.some((email) => email.trim().toLowerCase() === user.email.toLowerCase()),
    );
  }
  function authorizeCatalog(req: IncomingMessage, res: ServerResponse): string | null {
    const actorId = authorize(req, res);
    if (!actorId) return null;
    if (!canEdit(session(req))) {
      json(res, 403, { error: "CMSの変更権限がありません。管理担当者に連絡してください。" });
      return null;
    }
    return actorId;
  }
  async function handle(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
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
        canEdit: canEdit(user),
        email: user?.email,
        csrfToken: user?.csrfToken,
      });
      return true;
    }
    if (url.pathname === "/api/auth/google/start" && req.method === "GET") {
      if (flows.size >= 1000 || sessions.size >= 10000) {
        json(res, 429, { error: "しばらく待って再試行してください。" });
        return true;
      }
      const old = cookie(req, flowName);
      if (old) flows.delete(old);
      const state = fresh(),
        nonce = fresh(),
        verifier = fresh();
      flows.set(state, { nonce, verifier, expires: Date.now() + 10 * 60 * 1000 });
      setCookie(res, flowName, state, 600);
      res.writeHead(302, { Location: provider.authorizationUrl(state, nonce, digest(verifier)) });
      res.end();
      return true;
    }
    if (url.pathname === "/api/auth/google/callback" && req.method === "GET") {
      const state = url.searchParams.get("state") || "";
      const browserState = cookie(req, flowName);
      const flow = flows.get(state);
      // Do not consume another browser's flow on an invalid callback.
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
          expires: Math.min(verifiedPayload.exp * 1000, Date.now() + 60 * 60 * 1000),
        });
        setCookie(res, sessionName, id, 3600);
        res.writeHead(302, { Location: "/brand-asset-portal/index.html" });
        res.end();
      } catch {
        // OAuth responses can contain tokens; never return or log raw errors.
        json(res, 403, {
          error: "会社アカウントを確認できませんでした。会社のGoogleアカウントで再度ログインしてください。",
        });
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
  return { handle, authorize: authorizeCatalog, authorizeEmployee: authorize };
}
