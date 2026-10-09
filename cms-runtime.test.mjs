import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { createProductionServer } from "./server.mjs";

test("TrustOn import preserves saved edits and does not resurrect deletions on restart", async () => {
	const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), "cms-truston-test-"));
	const seed = JSON.parse(await fs.readFile("cms-seed.json", "utf8"));
	const trust = seed.filter((a) => a.brand === "TrustOn");
	assert.equal(trust.length, 12);
	assert.equal(new Set(trust.map((a) => a.driveId)).size, 12);
	const previous = {
		revision: 7,
		products: [
			{ id: "TrustOn", label: "Edited TrustOn", state: "ended", order: 0 },
		],
		assets: [{ ...trust[0], title: "Edited logo" }],
	};
	await fs.writeFile(
		path.join(dataDir, "catalog.json"),
		JSON.stringify(previous),
	);
	const config = {
		origin: "https://portal.example.test",
		clientId: "test-client",
		clientSecret: "not-a-real-credential",
		domains: ["example.test"],
		dataDir,
	};
	let server;
	let nonce;
	const provider = {
		authorizationUrl(state, value) {
			nonce = value;
			return `https://accounts.google.com/test?state=${state}`;
		},
		async exchangeAndVerify() {
			return {
				iss: "https://accounts.google.com",
				aud: config.clientId,
				sub: "test-employee",
				email: "staff@example.test",
				email_verified: true,
				hd: "example.test",
				nonce,
				exp: Math.floor(Date.now() / 1000) + 3600,
			};
		},
	};
	async function session() {
		server = createProductionServer(
			config,
			path.resolve("public"),
			path.resolve("cms-seed.json"),
			provider,
		);
		await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
		const base = `http://127.0.0.1:${server.address().port}`;
		const start = await fetch(`${base}/api/auth/google/start`, {
			redirect: "manual",
		});
		const state = new URL(start.headers.get("location")).searchParams.get(
			"state",
		);
		const callback = await fetch(
			`${base}/api/auth/google/callback?code=test-code&state=${state}`,
			{
				redirect: "manual",
				headers: { Cookie: start.headers.getSetCookie()[0].split(";")[0] },
			},
		);
		assert.equal(callback.status, 302);
		const cookie = callback.headers
			.getSetCookie()
			.find((s) => s.startsWith("__Host-brand_cms_session="))
			.split(";")[0];
		const auth = await (
			await fetch(`${base}/api/auth/session`, { headers: { Cookie: cookie } })
		).json();
		return { endpoint: `${base}/api/brand-assets/catalog`, cookie, auth };
	}
	try {
		const first = await session();
		const catalog = await (
			await fetch(first.endpoint, { headers: { Cookie: first.cookie } })
		).json();
		assert.equal(catalog.revision, 8);
		assert.deepEqual(catalog.products, previous.products);
		assert.equal(catalog.assets.length, 12);
		assert.equal(catalog.assets[0].title, "Edited logo");
		const id = catalog.assets[0].id;
		const saved = await fetch(first.endpoint, {
			method: "PUT",
			headers: {
				Cookie: first.cookie,
				Origin: config.origin,
				"X-CSRF-Token": first.auth.csrfToken,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				...catalog,
				assets: catalog.assets.slice(1),
				deletedAssetIds: [id],
			}),
		});
		assert.equal(saved.status, 200);
		await new Promise((resolve) => server.close(resolve));
		const second = await session();
		const restarted = await (
			await fetch(second.endpoint, { headers: { Cookie: second.cookie } })
		).json();
		assert.equal(restarted.revision, 9);
		assert.equal(restarted.assets.length, 11);
		assert.equal(
			restarted.assets.some((a) => a.id === id),
			false,
		);
	} finally {
		if (server?.listening)
			await new Promise((resolve) => server.close(resolve));
		await fs.rm(dataDir, { recursive: true, force: true });
	}
});

test("release runtime serves health and packaged assets but protects catalogue and secrets", async () => {
	const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), "cms-release-test-"));
	const config = {
		origin: "https://portal.example.test",
		clientId: "test-client",
		clientSecret: "not-a-real-credential",
		domains: ["example.test"],
		dataDir,
	};
	const server = createProductionServer(
		config,
		path.resolve("public"),
		path.resolve("cms-seed.json"),
	);
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
		assert.equal(
			(await fetch(new URL(bundle[1], `${base}/brand-asset-portal/index.html`)))
				.status,
			200,
		);
		assert.equal((await fetch(`${base}/api/brand-assets/catalog`)).status, 401);
		assert.equal(
			(
				await fetch(`${base}/api/brand-assets/catalog`, {
					method: "PUT",
					headers: { Origin: config.origin },
				})
			).status,
			401,
		);
		for (const route of [
			"/.env",
			"/server.mjs",
			"/cms-seed.json",
			"/package.json",
			"/api/unknown",
		])
			assert.equal((await fetch(`${base}${route}`)).status, 404);
		const session = await (await fetch(`${base}/api/auth/session`)).json();
		assert.equal(session.authenticated, false);
		const start = await fetch(`${base}/api/auth/google/start`, {
			redirect: "manual",
		});
		assert.equal(start.status, 302);
		assert.equal(
			new URL(start.headers.get("location")).hostname,
			"accounts.google.com",
		);
		assert.match(
			start.headers.get("set-cookie"),
			/HttpOnly; Secure; SameSite=Lax/,
		);
	} finally {
		if (server.listening) await new Promise((resolve) => server.close(resolve));
		await fs.rm(dataDir, { recursive: true, force: true });
	}
});

test("committed saves survive history-listing failure; pre-commit failure preserves data", async (t) => {
	const dataDir = await fs.mkdtemp(
		path.join(os.tmpdir(), "cms-release-save-test-"),
	);
	const config = {
		origin: "https://portal.example.test",
		clientId: "test-client",
		clientSecret: "not-a-real-credential",
		domains: ["example.test"],
		dataDir,
	};
	let nonce;
	// Trusted test fixture only: production always verifies tokens using Google's library.
	const provider = {
		authorizationUrl(state, nextNonce) {
			nonce = nextNonce;
			return `https://accounts.google.com/test?state=${state}`;
		},
		async exchangeAndVerify() {
			return {
				iss: "https://accounts.google.com",
				aud: config.clientId,
				sub: "test-employee",
				email: "staff@example.test",
				email_verified: true,
				hd: "example.test",
				nonce,
				exp: Math.floor(Date.now() / 1000) + 3600,
			};
		},
	};
	const server = createProductionServer(
		config,
		path.resolve("public"),
		path.resolve("cms-seed.json"),
		provider,
	);
	try {
		await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
		const base = `http://127.0.0.1:${server.address().port}`;
		const start = await fetch(`${base}/api/auth/google/start`, {
			redirect: "manual",
		});
		const state = new URL(start.headers.get("location")).searchParams.get(
			"state",
		);
		const loggedIn = await fetch(
			`${base}/api/auth/google/callback?code=test-code&state=${state}`,
			{
				redirect: "manual",
				headers: { Cookie: start.headers.getSetCookie()[0].split(";")[0] },
			},
		);
		assert.equal(loggedIn.status, 302);
		const cookie = loggedIn.headers
			.getSetCookie()
			.find((value) => value.startsWith("__Host-brand_cms_session="))
			.split(";")[0];
		const auth = await (
			await fetch(`${base}/api/auth/session`, { headers: { Cookie: cookie } })
		).json();
		const endpoint = `${base}/api/brand-assets/catalog`;
		const load = async () =>
			(await fetch(endpoint, { headers: { Cookie: cookie } })).json();
		const save = (data) =>
			fetch(endpoint, {
				method: "PUT",
				body: JSON.stringify(data),
				headers: {
					Cookie: cookie,
					Origin: config.origin,
					"X-CSRF-Token": auth.csrfToken,
					"Content-Type": "application/json",
				},
			});
		const initial = await load();
		initial.products[0].label = "Edited product";
		const listing = t.mock.method(fs, "readdir", async () => {
			throw new Error("History unavailable");
		});
		const saved = await save(initial);
		assert.equal(saved.status, 200);
		const committed = await saved.json();
		assert.equal(committed.revision, 1);
		assert.equal((await load()).products[0].label, "Edited product");
		listing.mock.restore();
		assert.equal((await save(committed)).status, 200);
		const beforeDelete = await load();
		const target = beforeDelete.assets[0];
		const deletion = {
			...beforeDelete,
			assets: beforeDelete.assets.slice(1),
			deletedAssetIds: [target.id],
		};
		assert.equal(
			(await save({ ...deletion, deletedAssetIds: [] })).status,
			400,
		);
		const noCsrf = await fetch(endpoint, {
			method: "PUT",
			body: JSON.stringify(deletion),
			headers: {
				Cookie: cookie,
				Origin: config.origin,
				"Content-Type": "application/json",
			},
		});
		assert.equal(noCsrf.status, 403);
		assert.equal((await save(deletion)).status, 200);
		assert.equal(
			(await load()).assets.some((a) => a.id === target.id),
			false,
		);
		assert.equal((await load()).lastChange.actorId, "test-employee");
		assert.equal((await save(deletion)).status, 409);
		const beforeFailure = await fs.readFile(
			path.join(dataDir, "catalog.json"),
			"utf8",
		);
		const current = await load();
		current.products[0].label = "Uncommitted product";
		t.mock.method(fs, "rename", async () => {
			throw new Error("Rename unavailable");
		});
		assert.equal((await save(current)).status, 400);
		assert.equal(
			await fs.readFile(path.join(dataDir, "catalog.json"), "utf8"),
			beforeFailure,
		);
	} finally {
		t.mock.restoreAll();
		if (server.listening) await new Promise((resolve) => server.close(resolve));
		await fs.rm(dataDir, { recursive: true, force: true });
	}
});
