import { promises as fs } from "node:fs";
import type { Server } from "node:http";
import os from "node:os";
import path from "node:path";
import type { TokenPayload } from "google-auth-library";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { Catalog } from "../src/pages/sandbox/brand-asset-portal/catalog-types";
import { type GoogleProvider, requireCompanyAccount } from "./brand-asset-google-auth";
import { readProductionConfig } from "./brand-asset-production-config";
import { createProductionServer } from "./brand-asset-production-server";

const config = {
  origin: "https://portal.example.test",
  clientId: "test-client",
  clientSecret: "not-a-real-credential",
  domains: ["example.test"],
  editorEmails: ["staff@example.test"],
  dataDir: "",
};
function claims(nonce: string): TokenPayload & { nonce: string } {
  return {
    iss: "https://accounts.google.com",
    aud: config.clientId,
    sub: "test-employee",
    email: "staff@example.test",
    email_verified: true,
    hd: "example.test",
    nonce,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  };
}

describe("production company Google auth", () => {
  let root: string, base: string, nonce: string, server: Server;
  let payload: (TokenPayload & { nonce?: string }) | undefined;
  let exchanges: number;
  let employeeEmail: string;
  const provider: GoogleProvider = {
    authorizationUrl: (state, nextNonce, challenge) => {
      nonce = nextNonce;
      return `https://accounts.google.com/test?state=${state}&code_challenge=${challenge}`;
    },
    exchangeAndVerify: async () => {
      exchanges++;
      return payload || { ...claims(nonce), email: employeeEmail };
    },
  };
  beforeEach(async () => {
    exchanges = 0;
    payload = undefined;
    employeeEmail = "staff@example.test";
    root = await fs.mkdtemp(path.join(os.tmpdir(), "brand-auth-test-"));
    const publicDir = path.join(root, "public");
    await fs.mkdir(path.join(publicDir, "brand-asset-portal"), { recursive: true });
    await fs.writeFile(path.join(publicDir, "brand-asset-portal/index.html"), "Test portal");
    await fs.writeFile(path.join(publicDir, "brand-asset-portal/login.html"), "Test login");
    await fs.writeFile(path.join(publicDir, ".env"), "must never be served");
    const seed = path.join(root, "seed.json");
    await fs.writeFile(path.join(root, "cms-imports.json"), "[]");
    await fs.copyFile(path.resolve("src/pages/sandbox/brand-asset-portal/assets-index.json"), seed);
    server = createProductionServer({ ...config, dataDir: path.join(root, "private") }, publicDir, seed, provider);
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Missing server port");
    base = `http://127.0.0.1:${address.port}`;
  });
  afterEach(async () => {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
    await fs.rm(root, { recursive: true, force: true });
  });
  async function start() {
    const response = await fetch(`${base}/api/auth/google/start`, { redirect: "manual" });
    expect(response.status).toBe(302);
    const location = new URL(response.headers.get("location") || "");
    return { state: location.searchParams.get("state"), cookie: response.headers.getSetCookie()[0].split(";")[0] };
  }
  async function login() {
    const flow = await start();
    const response = await fetch(`${base}/api/auth/google/callback?code=test-code&state=${flow.state}`, {
      redirect: "manual",
      headers: { Cookie: flow.cookie },
    });
    expect(response.status).toBe(302);
    const sessionCookie = response.headers.getSetCookie().find((c) => c.startsWith("__Host-brand_cms_session="));
    if (!sessionCookie) throw new Error("Missing session cookie");
    expect(sessionCookie).toContain("HttpOnly; Secure; SameSite=Lax");
    const cookie = sessionCookie.split(";")[0];
    const session = await (await fetch(`${base}/api/auth/session`, { headers: { Cookie: cookie } })).json();
    return { cookie, csrfToken: session.csrfToken as string };
  }
  it("requires login, binds the callback to the browser and prevents replay", async () => {
    expect((await fetch(`${base}/api/brand-assets/catalog`)).status).toBe(401);
    expect((await fetch(`${base}/api/brand-assets/thumbnail/test-file-123`)).status).toBe(401);
    const flow = await start();
    const callback = `${base}/api/auth/google/callback?code=test-code&state=${flow.state}`;
    expect((await fetch(callback, { redirect: "manual" })).status).toBe(400);
    expect(exchanges).toBe(0);
    expect((await fetch(callback, { redirect: "manual", headers: { Cookie: flow.cookie } })).status).toBe(302);
    expect((await fetch(callback, { redirect: "manual", headers: { Cookie: flow.cookie } })).status).toBe(400);
    expect(exchanges).toBe(1);
  });
  it("rejects consumer/unverified accounts and invalid domain, nonce, audience or expiry", async () => {
    for (const invalid of [
      { hd: undefined },
      { hd: "other.test" },
      { email_verified: false },
      { email: "staff@other.test" },
      { aud: "another-client" },
      { nonce: "wrong" },
      { exp: 1 },
    ]) {
      const flow = await start();
      payload = { ...claims(nonce), ...invalid };
      const response = await fetch(`${base}/api/auth/google/callback?code=test-code&state=${flow.state}`, {
        redirect: "manual",
        headers: { Cookie: flow.cookie },
      });
      expect(response.status).toBe(403);
      expect(response.headers.getSetCookie().some((c) => c.startsWith("__Host-brand_cms_session="))).toBe(false);
    }
  });
  it("enforces origin and CSRF, records the verified actor, persists data and invalidates logout", async () => {
    const user = await login();
    const catalog: Catalog = await (
      await fetch(`${base}/api/brand-assets/catalog`, { headers: { Cookie: user.cookie } })
    ).json();
    const body = JSON.stringify({ ...catalog, lastChange: { actorId: "forged", at: "forged" } });
    const request = (origin?: string, csrfToken?: string) =>
      fetch(`${base}/api/brand-assets/catalog`, {
        method: "PUT",
        headers: {
          Cookie: user.cookie,
          "Content-Type": "application/json",
          ...(origin ? { Origin: origin } : {}),
          ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
        },
        body,
      });
    expect((await request()).status).toBe(403);
    expect((await request("https://attacker.test", user.csrfToken)).status).toBe(403);
    expect((await request(config.origin)).status).toBe(403);
    const saved = await request(config.origin, user.csrfToken);
    expect(saved.status).toBe(200);
    expect((await saved.json()).lastChange.actorId).toBe("test-employee");
    expect(JSON.parse(await fs.readFile(path.join(root, "private/catalog.json"), "utf8")).revision).toBe(1);
    const logout = await fetch(`${base}/api/auth/logout`, {
      method: "POST",
      headers: { Cookie: user.cookie, Origin: config.origin, "X-CSRF-Token": user.csrfToken },
    });
    expect(logout.status).toBe(200);
    expect((await fetch(`${base}/api/brand-assets/catalog`, { headers: { Cookie: user.cookie } })).status).toBe(401);
    expect((await fetch(`${base}/.env`)).status).toBe(404);
    expect((await fetch(`${base}/server.mjs`)).status).toBe(404);
    expect((await fetch(`${base}/api/unknown`)).status).toBe(404);
    expect((await fetch(`${base}/brand-asset-portal/index.html`)).status).toBe(200);
  });
  it("allows unlisted employees to read and logout but rejects every catalogue change", async () => {
    employeeEmail = "viewer@example.test";
    const user = await login();
    const session = await (await fetch(`${base}/api/auth/session`, { headers: { Cookie: user.cookie } })).json();
    expect(session.canEdit).toBe(false);
    const endpoint = `${base}/api/brand-assets/catalog`;
    expect((await fetch(endpoint, { headers: { Cookie: user.cookie } })).status).toBe(403);
    const read = await fetch(`${base}/api/brand-assets/search`, { headers: { Cookie: user.cookie } });
    expect(read.status).toBe(200);
    const catalog: Catalog = await read.json();
    for (const body of [
      catalog,
      { ...catalog, assets: catalog.assets.slice(1), deletedAssetIds: [catalog.assets[0].id] },
    ]) {
      expect(
        (
          await fetch(endpoint, {
            method: "PUT",
            headers: {
              Cookie: user.cookie,
              Origin: config.origin,
              "X-CSRF-Token": user.csrfToken,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          })
        ).status,
      ).toBe(403);
    }
    expect(
      (
        await fetch(`${base}/api/auth/logout`, {
          method: "POST",
          headers: { Cookie: user.cookie, Origin: config.origin, "X-CSRF-Token": user.csrfToken },
        })
      ).status,
    ).toBe(200);
    await fs.access(path.join(root, "private/catalog.json"));
  });
});

it("fails closed without OAuth or persistent storage configuration", () => {
  expect(() => readProductionConfig({})).toThrow();
  expect(() => requireCompanyAccount(claims("expected"), config, "wrong")).toThrow();
});

it("requires a matching persistent Railway volume and defaults to the company domain", () => {
  const env = {
    GOOGLE_OAUTH_CLIENT_ID: "test-client",
    GOOGLE_OAUTH_CLIENT_SECRET: "not-a-real-credential",
    CMS_DATA_DIR: "/data",
    RAILWAY_ENVIRONMENT_ID: "test-environment",
  };
  expect(() => readProductionConfig(env)).toThrow("persistent volume");
  expect(() => readProductionConfig({ ...env, RAILWAY_VOLUME_MOUNT_PATH: "/different" })).toThrow();
  expect(readProductionConfig({ ...env, RAILWAY_VOLUME_MOUNT_PATH: "/data" }).domains).toEqual(["legalontech.jp"]);
  expect(readProductionConfig({ ...env, RAILWAY_VOLUME_MOUNT_PATH: "/data" }).editorEmails).toEqual([]);
  expect(
    readProductionConfig({
      ...env,
      RAILWAY_VOLUME_MOUNT_PATH: "/data",
      CMS_EDITOR_EMAILS: " STAFF@LEGALONTECH.JP ,staff@legalontech.jp ",
    }).editorEmails,
  ).toEqual(["staff@legalontech.jp"]);
  expect(() =>
    readProductionConfig({ ...env, RAILWAY_VOLUME_MOUNT_PATH: "/data", CMS_EDITOR_EMAILS: "staff@other.test" }),
  ).toThrow("company email");
  expect(() =>
    readProductionConfig({ ...env, CMS_DATA_DIR: "/database", RAILWAY_VOLUME_MOUNT_PATH: "/data" }),
  ).toThrow();
});
