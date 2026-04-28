/// <reference types="node" />

import { readFileSync } from "node:fs";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import { describe, expect, it } from "vitest";
import { COMMENT_DEBUG_HEADER_NAME } from "./features/comment-threads/runtime";
import worker from "./worker";

class TrackingD1PreparedStatement {
  private values: unknown[] = [];
  private readonly db: DatabaseSync;
  private readonly sql: string;
  private readonly executions: string[];

  constructor(db: DatabaseSync, sql: string, executions: string[]) {
    this.db = db;
    this.sql = sql;
    this.executions = executions;
  }

  bind(...values: unknown[]): TrackingD1PreparedStatement {
    this.values = values;
    return this;
  }

  async run(): Promise<unknown> {
    this.executions.push(this.sql);
    return this.db.prepare(this.sql).run(...(this.values as SQLInputValue[]));
  }

  async all<T>(): Promise<{ results: T[] }> {
    this.executions.push(this.sql);
    return { results: this.db.prepare(this.sql).all(...(this.values as SQLInputValue[])) as T[] };
  }

  async first<T>(): Promise<T | null> {
    this.executions.push(this.sql);
    return (this.db.prepare(this.sql).get(...(this.values as SQLInputValue[])) as T | undefined) ?? null;
  }

  getSql(): string {
    return this.sql;
  }

  getValues(): unknown[] {
    return [...this.values];
  }
}

class TrackingD1Database {
  readonly executions: string[] = [];
  private readonly db: DatabaseSync;

  constructor(db: DatabaseSync) {
    this.db = db;
  }

  prepare(query: string): TrackingD1PreparedStatement {
    return new TrackingD1PreparedStatement(this.db, query, this.executions);
  }

  async batch(statements: TrackingD1PreparedStatement[]): Promise<unknown[]> {
    this.db.exec("BEGIN");

    try {
      const results: unknown[] = [];
      for (const statement of statements) {
        this.executions.push(statement.getSql());
        results.push(this.db.prepare(statement.getSql()).run(...(statement.getValues() as SQLInputValue[])));
      }
      this.db.exec("COMMIT");
      return results;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }

  resetExecutions(): void {
    this.executions.length = 0;
  }
}

function buildDatabase(): TrackingD1Database {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec("PRAGMA foreign_keys = ON");

  for (const migration of [
    "../migrations/0001_comment_threads.sql",
    "../migrations/0002_comment_component_anchors.sql",
    "../migrations/0003_comment_messages_edited.sql",
    "../migrations/0004_comment_threads_resolved.sql",
    "../migrations/0005_comment_threads_updated_id_cursor.sql",
  ]) {
    sqlite.exec(readFileSync(new URL(migration, import.meta.url), "utf8"));
  }

  return new TrackingD1Database(sqlite);
}

function jsonRequest(url: string, method = "GET", body?: unknown, headers?: HeadersInit): Request {
  return new Request(url, {
    method,
    headers:
      body || headers
        ? {
            ...(body
              ? {
                  "Content-Type": "application/json",
                }
              : undefined),
            ...headers,
          }
        : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
}

const stubCtx = { waitUntil: () => {}, passThroughOnException: () => {} };

describe("worker comment thread API", () => {
  it("paginates thread listing with a stable cursor", async () => {
    const db = buildDatabase();
    const env = {
      COMMENTS_DB: db,
      CF_PAGES_BRANCH: "feat/pagination",
    };

    for (const [threadId, updatedAt] of [
      ["thread-3", "2026-04-08T03:00:00.000Z"],
      ["thread-2", "2026-04-08T02:00:00.000Z"],
      ["thread-1", "2026-04-08T01:00:00.000Z"],
    ] as const) {
      await db
        .prepare(
          `
            INSERT INTO comment_threads (
              id,
              deployment_scope,
              page_route,
              resolved_at,
              created_at,
              updated_at
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6)
          `,
        )
        .bind(threadId, "feat/pagination", "/sandbox/example", null, updatedAt, updatedAt)
        .run();
      await db
        .prepare(
          `
            INSERT INTO comment_messages (
              id,
              thread_id,
              author_name,
              body,
              created_at,
              edited_at
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6)
          `,
        )
        .bind(`message-${threadId}`, threadId, "Alice", threadId, updatedAt, null)
        .run();
    }

    const firstResponse = await worker.fetch(
      jsonRequest("https://example.com/api/comment-threads?page=%2Fsandbox%2Fexample&limit=2"),
      env,
      stubCtx,
    );
    const firstPage = (await firstResponse.json()) as { threads: Array<{ id: string }>; nextCursor: string | null };

    expect(firstPage.threads.map((thread) => thread.id)).toEqual(["thread-3", "thread-2"]);
    expect(firstPage.nextCursor).toBeTruthy();

    const secondResponse = await worker.fetch(
      jsonRequest(
        `https://example.com/api/comment-threads?page=%2Fsandbox%2Fexample&limit=2&cursor=${encodeURIComponent(
          firstPage.nextCursor ?? "",
        )}`,
      ),
      env,
      stubCtx,
    );
    const secondPage = (await secondResponse.json()) as { threads: Array<{ id: string }>; nextCursor: string | null };

    expect(secondPage.threads.map((thread) => thread.id)).toEqual(["thread-1"]);
    expect(secondPage.nextCursor).toBeNull();
  });

  it("creates threads and replies without re-reading the full thread", async () => {
    const db = buildDatabase();
    const env = {
      COMMENTS_DB: db,
      CF_PAGES_BRANCH: "feat/mutations",
    };

    const createResponse = await worker.fetch(
      jsonRequest("https://example.com/api/comment-threads", "POST", {
        pageRoute: "/sandbox/example",
        authorName: "Alice",
        body: "Initial comment",
        anchor: {
          kind: "canvas",
          xPercent: 20,
          yPercent: 40,
        },
      }),
      env,
      stubCtx,
    );
    const createdThread = (await createResponse.json()) as { id: string; messages: Array<{ body: string }> };

    expect(createResponse.status).toBe(201);
    expect(createdThread.messages).toHaveLength(1);
    expect(db.executions).toHaveLength(2);
    expect(db.executions.every((sql) => !sql.includes("SELECT"))).toBe(true);

    db.resetExecutions();

    const replyResponse = await worker.fetch(
      jsonRequest(`https://example.com/api/comment-threads/${createdThread.id}/replies`, "POST", {
        pageRoute: "/sandbox/example",
        authorName: "Bob",
        body: "Reply",
      }),
      env,
      stubCtx,
    );
    const replyResult = (await replyResponse.json()) as { threadId: string; message: { body: string } };

    expect(replyResponse.status).toBe(201);
    expect(replyResult.threadId).toBe(createdThread.id);
    expect(replyResult.message.body).toBe("Reply");
    expect(db.executions).toHaveLength(2);
    expect(db.executions[0]).toContain("INSERT INTO comment_messages");
    expect(db.executions[1]).toContain("UPDATE comment_threads");
  });

  it("updates and deletes messages with bounded query counts", async () => {
    const db = buildDatabase();
    const env = {
      COMMENTS_DB: db,
      CF_PAGES_BRANCH: "feat/message-mutations",
    };

    const createResponse = await worker.fetch(
      jsonRequest("https://example.com/api/comment-threads", "POST", {
        pageRoute: "/sandbox/example",
        authorName: "Alice",
        body: "First",
      }),
      env,
      stubCtx,
    );
    const createdThread = (await createResponse.json()) as { id: string; messages: Array<{ id: string }> };

    const replyResponse = await worker.fetch(
      jsonRequest(`https://example.com/api/comment-threads/${createdThread.id}/replies`, "POST", {
        pageRoute: "/sandbox/example",
        authorName: "Bob",
        body: "Second",
      }),
      env,
      stubCtx,
    );
    const reply = (await replyResponse.json()) as { message: { id: string } };

    db.resetExecutions();

    const patchResponse = await worker.fetch(
      jsonRequest(`https://example.com/api/comment-threads/${createdThread.id}/messages/${reply.message.id}`, "PATCH", {
        pageRoute: "/sandbox/example",
        body: "Second, edited",
      }),
      env,
      stubCtx,
    );
    const patchResult = (await patchResponse.json()) as { messageId: string; body: string };

    expect(patchResponse.status).toBe(200);
    expect(patchResult.body).toBe("Second, edited");
    expect(db.executions).toHaveLength(2);
    expect(db.executions[0]).toContain("UPDATE comment_messages");
    expect(db.executions[1]).toContain("UPDATE comment_threads");

    db.resetExecutions();

    const deleteOneResponse = await worker.fetch(
      jsonRequest(
        `https://example.com/api/comment-threads/${createdThread.id}/messages/${reply.message.id}?page=%2Fsandbox%2Fexample`,
        "DELETE",
      ),
      env,
      stubCtx,
    );
    const deleteOneResult = (await deleteOneResponse.json()) as { deletedThread: boolean };

    expect(deleteOneResponse.status).toBe(200);
    expect(deleteOneResult.deletedThread).toBe(false);
    expect(db.executions).toHaveLength(4);
    expect(db.executions[0]).toContain("DELETE FROM comment_messages");
    expect(db.executions[1]).toContain("DELETE FROM comment_threads");
    expect(db.executions[2]).toContain("UPDATE comment_threads");
    expect(db.executions[3]).toContain("SELECT updated_at");

    db.resetExecutions();

    const deleteLastResponse = await worker.fetch(
      jsonRequest(
        `https://example.com/api/comment-threads/${createdThread.id}/messages/${createdThread.messages[0]?.id}?page=%2Fsandbox%2Fexample`,
        "DELETE",
      ),
      env,
      stubCtx,
    );
    const deleteLastResult = (await deleteLastResponse.json()) as { deletedThread: boolean };

    expect(deleteLastResponse.status).toBe(200);
    expect(deleteLastResult.deletedThread).toBe(true);
    expect(db.executions).toHaveLength(4);
    expect(db.executions[0]).toContain("DELETE FROM comment_messages");
    expect(db.executions[1]).toContain("DELETE FROM comment_threads");
    expect(db.executions[2]).toContain("UPDATE comment_threads");
    expect(db.executions[3]).toContain("SELECT updated_at");
  });

  it("blocks localhost comment API access unless debug mode is explicitly enabled", async () => {
    const db = buildDatabase();
    const env = {
      COMMENTS_DB: db,
    };
    globalThis.__AEGIS_LOCAL_COMMENT_DEBUG__ = false;

    const response = await worker.fetch(
      jsonRequest("http://localhost:5173/api/comment-threads", "POST", {
        pageRoute: "/sandbox/local-only-comments",
        authorName: "Alice",
        body: "Blocked locally",
      }),
      env,
      stubCtx,
    );

    expect(response.status).toBe(403);
    expect(db.executions).toHaveLength(0);
    globalThis.__AEGIS_LOCAL_COMMENT_DEBUG__ = undefined;
  });

  it("falls back to in-memory comments on localhost even when COMMENTS_DB is bound during debug mode", async () => {
    const db = buildDatabase();
    const env = {
      COMMENTS_DB: db,
    };
    globalThis.__AEGIS_LOCAL_COMMENT_DEBUG__ = true;
    const debugHeaders = {
      [COMMENT_DEBUG_HEADER_NAME]: "1",
    };

    const createResponse = await worker.fetch(
      jsonRequest(
        "http://localhost:5173/api/comment-threads",
        "POST",
        {
          pageRoute: "/sandbox/local-only-comments",
          authorName: "Alice",
          body: "Stored in memory",
        },
        debugHeaders,
      ),
      env,
      stubCtx,
    );
    const createdThread = (await createResponse.json()) as { id: string };

    expect(createResponse.status).toBe(201);
    expect(db.executions).toHaveLength(0);

    const listResponse = await worker.fetch(
      jsonRequest(
        "http://localhost:5173/api/comment-threads?page=%2Fsandbox%2Flocal-only-comments",
        "GET",
        undefined,
        debugHeaders,
      ),
      env,
      stubCtx,
    );
    const page = (await listResponse.json()) as { threads: Array<{ id: string }>; nextCursor: string | null };

    expect(listResponse.status).toBe(200);
    expect(page.threads.map((thread) => thread.id)).toEqual([createdThread.id]);
    expect(page.nextCursor).toBeNull();
    expect(db.executions).toHaveLength(0);
    globalThis.__AEGIS_LOCAL_COMMENT_DEBUG__ = undefined;
  });
});
