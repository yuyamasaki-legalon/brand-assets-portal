import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { createProductionServer } from "./server.mjs";

test("release runtime serves health and packaged assets but protects catalogue and secrets", async () => {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), "cms-release-test-"));
  const config = {
    origin: "https://portal.example.test",
    clientId: "test-client",
    clientSecret: "not-a-real-credential",
    domains: ["example.test"],
    dataDir,
  };
  const server = createProductionServer(config, path.resolve("public"), path.resolve("cms-seed.json"));
  try {
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert.equal(typeof address, "object");
    const base = `http://127.0.0.1:${address.port}`;
    assert.equal((await fetch(`${base}/health`)).status, 200);
    const html = await fetch(`${base}/brand-asset-portal/index.html`);
    assert.equal(html.status, 200);
    const text = await html.text();
    const bundle = text.match(/src="([^"]+\.js)"/);
    assert.ok(bundle);
    assert.equal((await fetch(new URL(bundle[1], `${base}/brand-asset-portal/index.html`))).status, 200);
    assert.equal((await fetch(`${base}/api/brand-assets/catalog`)).status, 401);
    assert.equal((await fetch(`${base}/api/brand-assets/catalog`, {
      method: "PUT", headers: { Origin: config.origin },
    })).status, 401);
    for (const route of ["/.env", "/server.mjs", "/cms-seed.json", "/package.json", "/api/unknown"])
      assert.equal((await fetch(`${base}${route}`)).status, 404);
    const session = await (await fetch(`${base}/api/auth/session`)).json();
    assert.equal(session.authenticated, false);
    const start = await fetch(`${base}/api/auth/google/start`, { redirect: "manual" });
    assert.equal(start.status, 302);
    assert.equal(new URL(start.headers.get("location")).hostname, "accounts.google.com");
    assert.match(start.headers.get("set-cookie"), /HttpOnly; Secure; SameSite=Lax/);
  } finally {
    if (server.listening) await new Promise((resolve) => server.close(resolve));
    await fs.rm(dataDir, { recursive: true, force: true });
  }
});
