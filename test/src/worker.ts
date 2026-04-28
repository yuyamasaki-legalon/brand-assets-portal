import {
  isCommentDebugRequest,
  isLocalCommentDebugEnabled,
  isLocalCommentHost,
} from "./features/comment-threads/runtime";
import { sortThreads } from "./features/comment-threads/threadDerivations";
import type {
  CommentAnchor,
  CommentMessageDeleteResult,
  CommentMessageUpdateResult,
  CommentReplyResult,
  CommentThread,
  CommentThreadStateResult,
  CommentThreadsPage,
} from "./features/comment-threads/types";
import {
  buildThreadsFromRows,
  cloneThreads,
  normalizeText,
  parseAnchor,
  type ThreadRow,
} from "./features/comment-threads/workerUtils";

interface AssetBinding {
  fetch(request: Request): Promise<Response>;
}

interface D1QueryResult<T> {
  results?: T[];
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<unknown>;
  all<T>(): Promise<D1QueryResult<T>>;
  first<T>(): Promise<T | null>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch?(statements: D1PreparedStatement[]): Promise<unknown[]>;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

interface Env {
  ASSETS?: AssetBinding;
  COMMENTS_DB?: D1Database;
  CF_PAGES_BRANCH?: string;
  SLACK_WEBHOOK_URL?: string;
  GITHUB_REPO_URL?: string;
}

interface AnchorFields {
  anchorKind: string | null;
  anchorId: string | null;
  anchorLabel: string | null;
  anchorTargetKind: string | null;
  anchorContextLabel: string | null;
  anchorXPercent: number | null;
  anchorYPercent: number | null;
}

interface ThreadSummaryRow {
  id: string;
  updated_at: string;
}

interface ThreadStateRow {
  updated_at: string;
  resolved_at: string | null;
}

interface MessageMutationRow {
  message_id: string;
  body?: string;
  edited_at?: string | null;
}

const memoryStore = new Map<string, CommentThread[]>();

export const DEFAULT_THREAD_PAGE_SIZE = 50;
export const MAX_THREAD_PAGE_SIZE = 100;

const escapeSlackText = (text: string): string => {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

const sanitizeSlackLinkUrl = (url: string): string => {
  return url.replace(/[>|\n\r]/g, "");
};

const extractPrNumber = (origin: string): string | null => {
  const match = new URL(origin).hostname.match(/^pr-(\d+)-/);
  return match ? match[1] : null;
};

const sendSlackNotification = async (params: {
  webhookUrl: string;
  origin: string;
  pageRoute: string;
  authorName: string;
  body: string;
  isReply: boolean;
  githubRepoUrl?: string;
}): Promise<void> => {
  const pageUrl = sanitizeSlackLinkUrl(`${params.origin}${params.pageRoute}`);
  const label = params.isReply ? "返信" : "コメント";
  const rawBody = params.body.length > 300 ? `${params.body.slice(0, 300)}...` : params.body;
  const escapedBody = escapeSlackText(rawBody);
  const escapedAuthor = escapeSlackText(params.authorName);

  const prNumber = extractPrNumber(params.origin);
  const prLine =
    prNumber && params.githubRepoUrl
      ? `\nPR: <${params.githubRepoUrl}/pull/${prNumber}|#${prNumber}>`
      : prNumber
        ? `\nPR: #${prNumber}`
        : "";

  const message = `:speech_balloon: *プレビューに${label}がありました*${prLine}
Page: <${pageUrl}|${escapeSlackText(params.pageRoute)}>
User: ${escapedAuthor}

> ${escapedBody}`;

  const response = await fetch(params.webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: message }),
  });

  if (!response.ok) {
    throw new Error(`Slack webhook failed: ${response.status}`);
  }
};

const warnMemoryFallback = (): void => {
  console.warn("[comments] COMMENTS_DB binding not found — using ephemeral in-memory store");
};

const jsonResponse = (data: unknown, status = 200): Response => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json",
    },
  });
};

const errorResponse = (message: string, status = 400): Response => {
  return jsonResponse({ error: message }, status);
};

const isHtmlNavigationRequest = (request: Request): boolean => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return false;
  }

  const secFetchMode = request.headers.get("sec-fetch-mode");
  if (secFetchMode === "navigate") {
    return true;
  }

  const accept = request.headers.get("accept");
  return accept?.includes("text/html") ?? false;
};

const getDeploymentScope = (request: Request, env: Env): string => {
  const url = new URL(request.url);
  return env.CF_PAGES_BRANCH ?? url.hostname ?? "local";
};

const getCommentStoreEnv = (request: Request, env: Env): Env => {
  const hostname = new URL(request.url).hostname;
  if (!env.COMMENTS_DB || !isLocalCommentHost(hostname)) {
    return env;
  }

  return {
    ...env,
    COMMENTS_DB: undefined,
    SLACK_WEBHOOK_URL: undefined,
  };
};

const areCommentsEnabledForRequest = (request: Request): boolean => {
  const hostname = new URL(request.url).hostname;
  if (!isLocalCommentHost(hostname)) {
    return true;
  }

  return isLocalCommentDebugEnabled() && isCommentDebugRequest(request);
};

const pageKey = (scope: string, pageRoute: string): string => {
  return `${scope}::${pageRoute}`;
};

const normalizePageSize = (value: string | null): number => {
  if (!value) {
    return DEFAULT_THREAD_PAGE_SIZE;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_THREAD_PAGE_SIZE;
  }

  return Math.min(MAX_THREAD_PAGE_SIZE, parsed);
};

export const serializeThreadCursor = (updatedAt: string, threadId: string): string => {
  return `${updatedAt}::${threadId}`;
};

export const parseThreadCursor = (value: string | null): { updatedAt: string; threadId: string } | null => {
  if (!value) {
    return null;
  }

  const [updatedAt, threadId] = value.split("::");
  if (!updatedAt || !threadId) {
    return null;
  }

  return { updatedAt, threadId };
};

const anchorFieldsFromAnchor = (anchor?: CommentAnchor): AnchorFields => {
  return {
    anchorKind: anchor?.kind ?? null,
    anchorId: anchor?.kind === "component" ? anchor.anchorId : anchor?.kind === "surface" ? anchor.surfaceId : null,
    anchorLabel: anchor?.kind === "component" ? anchor.label : anchor?.kind === "surface" ? anchor.surfaceLabel : null,
    anchorTargetKind:
      anchor?.kind === "component" ? anchor.targetKind : anchor?.kind === "surface" ? anchor.surfaceKind : null,
    anchorContextLabel: anchor?.kind === "component" ? (anchor.contextLabel ?? null) : null,
    anchorXPercent: anchor?.kind === "canvas" || anchor?.kind === "surface" ? anchor.xPercent : null,
    anchorYPercent: anchor?.kind === "canvas" || anchor?.kind === "surface" ? anchor.yPercent : null,
  };
};

const runStatements = async (db: D1Database, statements: D1PreparedStatement[]): Promise<void> => {
  if (statements.length === 0) {
    return;
  }

  if (db.batch) {
    await db.batch(statements);
    return;
  }

  for (const statement of statements) {
    await statement.run();
  }
};

const listThreadsFromMemory = (
  scope: string,
  pageRoute: string,
  limit: number,
  cursor: { updatedAt: string; threadId: string } | null,
): CommentThreadsPage => {
  const threads = sortThreads(cloneThreads(memoryStore.get(pageKey(scope, pageRoute)) ?? []));
  const startIndex = cursor
    ? threads.findIndex((thread) => thread.updatedAt === cursor.updatedAt && thread.id === cursor.threadId) + 1
    : 0;
  const boundedStartIndex = startIndex > 0 ? startIndex : 0;
  const window = threads.slice(boundedStartIndex, boundedStartIndex + limit + 1);
  const pageThreads = window.slice(0, limit);
  const lastThread = pageThreads[pageThreads.length - 1];

  return {
    threads: pageThreads,
    nextCursor: window.length > limit && lastThread ? serializeThreadCursor(lastThread.updatedAt, lastThread.id) : null,
  };
};

const listThreadsFromD1 = async (
  db: D1Database,
  scope: string,
  pageRoute: string,
  limit: number,
  cursor: { updatedAt: string; threadId: string } | null,
): Promise<CommentThreadsPage> => {
  const summaryQuery = cursor
    ? `
        SELECT id, updated_at
        FROM comment_threads
        WHERE deployment_scope = ?1
          AND page_route = ?2
          AND (updated_at < ?3 OR (updated_at = ?3 AND id < ?4))
        ORDER BY updated_at DESC, id DESC
        LIMIT ?5
      `
    : `
        SELECT id, updated_at
        FROM comment_threads
        WHERE deployment_scope = ?1
          AND page_route = ?2
        ORDER BY updated_at DESC, id DESC
        LIMIT ?3
      `;

  const summaryStatement = db.prepare(summaryQuery);
  const summaryResult = cursor
    ? await summaryStatement
        .bind(scope, pageRoute, cursor.updatedAt, cursor.threadId, limit + 1)
        .all<ThreadSummaryRow>()
    : await summaryStatement.bind(scope, pageRoute, limit + 1).all<ThreadSummaryRow>();
  const summaries = summaryResult.results ?? [];
  const pageSummaries = summaries.slice(0, limit);

  if (pageSummaries.length === 0) {
    return {
      threads: [],
      nextCursor: null,
    };
  }

  const placeholders = pageSummaries.map((_, index) => `?${index + 1}`).join(", ");
  const rows = await db
    .prepare(
      `
        SELECT
          threads.id AS thread_id,
          threads.page_route AS page_route,
          threads.created_at AS thread_created_at,
          threads.updated_at AS thread_updated_at,
          threads.resolved_at AS thread_resolved_at,
          threads.anchor_kind AS anchor_kind,
          threads.anchor_id AS anchor_id,
          threads.anchor_label AS anchor_label,
          threads.anchor_target_kind AS anchor_target_kind,
          threads.anchor_context_label AS anchor_context_label,
          threads.anchor_x_percent AS anchor_x_percent,
          threads.anchor_y_percent AS anchor_y_percent,
          messages.id AS message_id,
          messages.author_name AS author_name,
          messages.body AS body,
          messages.created_at AS message_created_at,
          messages.edited_at AS message_edited_at
        FROM comment_threads AS threads
        INNER JOIN comment_messages AS messages
          ON messages.thread_id = threads.id
        WHERE threads.id IN (${placeholders})
        ORDER BY threads.updated_at DESC, threads.id DESC, messages.created_at ASC
      `,
    )
    .bind(...pageSummaries.map((summary) => summary.id))
    .all<ThreadRow>();
  const lastSummary = pageSummaries[pageSummaries.length - 1];

  return {
    threads: buildThreadsFromRows(rows.results ?? []),
    nextCursor: summaries.length > limit ? serializeThreadCursor(lastSummary.updated_at, lastSummary.id) : null,
  };
};

const listThreads = async (
  env: Env,
  scope: string,
  pageRoute: string,
  limit: number,
  cursor: { updatedAt: string; threadId: string } | null,
): Promise<CommentThreadsPage> => {
  if (env.COMMENTS_DB) {
    return listThreadsFromD1(env.COMMENTS_DB, scope, pageRoute, limit, cursor);
  }

  warnMemoryFallback();
  return listThreadsFromMemory(scope, pageRoute, limit, cursor);
};

const createThread = async (params: {
  env: Env;
  scope: string;
  pageRoute: string;
  authorName: string;
  body: string;
  anchor?: CommentAnchor;
}): Promise<CommentThread> => {
  const now = new Date().toISOString();
  const threadId = crypto.randomUUID();
  const messageId = crypto.randomUUID();

  if (params.env.COMMENTS_DB) {
    const anchorFields = anchorFieldsFromAnchor(params.anchor);
    const insertThread = params.env.COMMENTS_DB.prepare(
      `
        INSERT INTO comment_threads (
          id,
          deployment_scope,
          page_route,
          resolved_at,
          anchor_kind,
          anchor_id,
          anchor_label,
          anchor_target_kind,
          anchor_context_label,
          anchor_x_percent,
          anchor_y_percent,
          created_at,
          updated_at
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)
      `,
    ).bind(
      threadId,
      params.scope,
      params.pageRoute,
      null,
      anchorFields.anchorKind,
      anchorFields.anchorId,
      anchorFields.anchorLabel,
      anchorFields.anchorTargetKind,
      anchorFields.anchorContextLabel,
      anchorFields.anchorXPercent,
      anchorFields.anchorYPercent,
      now,
      now,
    );
    const insertMessage = params.env.COMMENTS_DB.prepare(
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
    ).bind(messageId, threadId, params.authorName, params.body, now, null);

    try {
      await runStatements(params.env.COMMENTS_DB, [insertThread, insertMessage]);
    } catch (error) {
      if (!params.env.COMMENTS_DB.batch) {
        await params.env.COMMENTS_DB.prepare(
          `
              DELETE FROM comment_threads
              WHERE id = ?1
            `,
        )
          .bind(threadId)
          .run()
          .catch(() => undefined);
      }

      throw error;
    }
  } else {
    warnMemoryFallback();
    const key = pageKey(params.scope, params.pageRoute);
    const nextThread: CommentThread = {
      id: threadId,
      pageRoute: params.pageRoute,
      createdAt: now,
      updatedAt: now,
      anchor: params.anchor,
      messages: [
        {
          id: messageId,
          authorName: params.authorName,
          body: params.body,
          createdAt: now,
          editedAt: null,
        },
      ],
    };
    const nextThreads = sortThreads([nextThread, ...(memoryStore.get(key) ?? [])]);
    memoryStore.set(key, nextThreads);
  }

  return {
    id: threadId,
    pageRoute: params.pageRoute,
    createdAt: now,
    updatedAt: now,
    resolvedAt: null,
    anchor: params.anchor,
    messages: [
      {
        id: messageId,
        authorName: params.authorName,
        body: params.body,
        createdAt: now,
        editedAt: null,
      },
    ],
  };
};

const addReply = async (params: {
  env: Env;
  scope: string;
  pageRoute: string;
  threadId: string;
  authorName: string;
  body: string;
}): Promise<CommentReplyResult | null> => {
  const now = new Date().toISOString();
  const messageId = crypto.randomUUID();

  if (params.env.COMMENTS_DB) {
    const insertedMessage = await params.env.COMMENTS_DB.prepare(
      `
          INSERT INTO comment_messages (
            id,
            thread_id,
            author_name,
            body,
            created_at,
            edited_at
          )
          SELECT
            ?1,
            threads.id,
            ?2,
            ?3,
            ?4,
            ?5
          FROM comment_threads AS threads
          WHERE threads.id = ?6
            AND threads.deployment_scope = ?7
            AND threads.page_route = ?8
          RETURNING id AS message_id
        `,
    )
      .bind(messageId, params.authorName, params.body, now, null, params.threadId, params.scope, params.pageRoute)
      .first<MessageMutationRow>();

    if (!insertedMessage) {
      return null;
    }

    const updatedThread = await params.env.COMMENTS_DB.prepare(
      `
          UPDATE comment_threads
          SET updated_at = ?1
          WHERE id = ?2
            AND deployment_scope = ?3
            AND page_route = ?4
          RETURNING updated_at AS updated_at, resolved_at AS resolved_at
        `,
    )
      .bind(now, params.threadId, params.scope, params.pageRoute)
      .first<ThreadStateRow>();

    if (!updatedThread) {
      return null;
    }

    return {
      threadId: params.threadId,
      pageRoute: params.pageRoute,
      updatedAt: updatedThread.updated_at,
      resolvedAt: updatedThread.resolved_at,
      message: {
        id: insertedMessage.message_id,
        authorName: params.authorName,
        body: params.body,
        createdAt: now,
        editedAt: null,
      },
    };
  }

  warnMemoryFallback();
  const key = pageKey(params.scope, params.pageRoute);
  const currentThreads = memoryStore.get(key) ?? [];
  const targetThread = currentThreads.find((thread) => thread.id === params.threadId);

  if (!targetThread) {
    return null;
  }

  targetThread.messages.push({
    id: messageId,
    authorName: params.authorName,
    body: params.body,
    createdAt: now,
    editedAt: null,
  });
  targetThread.updatedAt = now;

  const nextThreads = sortThreads(currentThreads);
  memoryStore.set(key, nextThreads);

  return {
    threadId: params.threadId,
    pageRoute: params.pageRoute,
    updatedAt: now,
    resolvedAt: targetThread.resolvedAt ?? null,
    message: {
      id: messageId,
      authorName: params.authorName,
      body: params.body,
      createdAt: now,
      editedAt: null,
    },
  };
};

const deleteThread = async (params: {
  env: Env;
  scope: string;
  pageRoute: string;
  threadId: string;
}): Promise<boolean> => {
  if (params.env.COMMENTS_DB) {
    const deleted = await params.env.COMMENTS_DB.prepare(
      `
          DELETE FROM comment_threads
          WHERE id = ?1
            AND deployment_scope = ?2
            AND page_route = ?3
          RETURNING id
        `,
    )
      .bind(params.threadId, params.scope, params.pageRoute)
      .first<{ id: string }>();

    return Boolean(deleted);
  }

  warnMemoryFallback();
  const key = pageKey(params.scope, params.pageRoute);
  const currentThreads = memoryStore.get(key) ?? [];
  const nextThreads = currentThreads.filter((thread) => thread.id !== params.threadId);

  if (nextThreads.length === currentThreads.length) {
    return false;
  }

  memoryStore.set(key, nextThreads);
  return true;
};

const updateThreadResolvedState = async (params: {
  env: Env;
  scope: string;
  pageRoute: string;
  threadId: string;
  resolved: boolean;
}): Promise<CommentThreadStateResult | null> => {
  const now = new Date().toISOString();

  if (params.env.COMMENTS_DB) {
    const updated = await params.env.COMMENTS_DB.prepare(
      `
          UPDATE comment_threads
          SET updated_at = ?1,
              resolved_at = ?2
          WHERE id = ?3
            AND deployment_scope = ?4
            AND page_route = ?5
          RETURNING updated_at AS updated_at, resolved_at AS resolved_at
        `,
    )
      .bind(now, params.resolved ? now : null, params.threadId, params.scope, params.pageRoute)
      .first<ThreadStateRow>();

    if (!updated) {
      return null;
    }

    return {
      threadId: params.threadId,
      updatedAt: updated.updated_at,
      resolvedAt: updated.resolved_at,
    };
  }

  warnMemoryFallback();
  const key = pageKey(params.scope, params.pageRoute);
  const currentThreads = memoryStore.get(key) ?? [];
  const nextThreads = sortThreads(
    currentThreads.map((thread) =>
      thread.id === params.threadId ? { ...thread, updatedAt: now, resolvedAt: params.resolved ? now : null } : thread,
    ),
  );
  const updatedThread = nextThreads.find((thread) => thread.id === params.threadId) ?? null;

  if (!updatedThread) {
    return null;
  }

  memoryStore.set(key, nextThreads);
  return {
    threadId: params.threadId,
    updatedAt: updatedThread.updatedAt,
    resolvedAt: updatedThread.resolvedAt ?? null,
  };
};

const updateMessage = async (params: {
  env: Env;
  scope: string;
  pageRoute: string;
  threadId: string;
  messageId: string;
  body: string;
}): Promise<CommentMessageUpdateResult | null> => {
  const now = new Date().toISOString();

  if (params.env.COMMENTS_DB) {
    const updatedMessage = await params.env.COMMENTS_DB.prepare(
      `
          UPDATE comment_messages AS messages
          SET body = ?1,
              edited_at = ?2
          WHERE messages.id = ?3
            AND messages.thread_id = ?4
            AND EXISTS (
              SELECT 1
              FROM comment_threads AS threads
              WHERE threads.id = messages.thread_id
                AND threads.deployment_scope = ?5
                AND threads.page_route = ?6
            )
          RETURNING id AS message_id, body AS body, edited_at AS edited_at
        `,
    )
      .bind(params.body, now, params.messageId, params.threadId, params.scope, params.pageRoute)
      .first<MessageMutationRow>();

    if (!updatedMessage) {
      return null;
    }

    const updatedThread = await params.env.COMMENTS_DB.prepare(
      `
          UPDATE comment_threads
          SET updated_at = ?1
          WHERE id = ?2
            AND deployment_scope = ?3
            AND page_route = ?4
          RETURNING updated_at AS updated_at
        `,
    )
      .bind(now, params.threadId, params.scope, params.pageRoute)
      .first<Pick<ThreadStateRow, "updated_at">>();

    if (!updatedThread) {
      return null;
    }

    return {
      threadId: params.threadId,
      updatedAt: updatedThread.updated_at,
      messageId: updatedMessage.message_id,
      body: updatedMessage.body ?? params.body,
      editedAt: updatedMessage.edited_at ?? now,
    };
  }

  warnMemoryFallback();
  const key = pageKey(params.scope, params.pageRoute);
  const currentThreads = memoryStore.get(key) ?? [];
  const nextThreads = sortThreads(
    currentThreads.map((thread) => {
      if (thread.id !== params.threadId) {
        return thread;
      }

      return {
        ...thread,
        updatedAt: now,
        messages: thread.messages.map((message) =>
          message.id === params.messageId ? { ...message, body: params.body, editedAt: now } : message,
        ),
      };
    }),
  );
  const updatedThread = nextThreads.find((thread) => thread.id === params.threadId) ?? null;

  if (!updatedThread || !updatedThread.messages.some((message) => message.id === params.messageId)) {
    return null;
  }

  memoryStore.set(key, nextThreads);
  return {
    threadId: params.threadId,
    updatedAt: now,
    messageId: params.messageId,
    body: params.body,
    editedAt: now,
  };
};

const deleteMessage = async (params: {
  env: Env;
  scope: string;
  pageRoute: string;
  threadId: string;
  messageId: string;
}): Promise<CommentMessageDeleteResult | null> => {
  const now = new Date().toISOString();

  if (params.env.COMMENTS_DB) {
    const db = params.env.COMMENTS_DB;

    const deletedMessage = await db
      .prepare(
        `
          DELETE FROM comment_messages AS messages
          WHERE messages.id = ?1
            AND messages.thread_id = ?2
            AND EXISTS (
              SELECT 1
              FROM comment_threads AS threads
              WHERE threads.id = messages.thread_id
                AND threads.deployment_scope = ?3
                AND threads.page_route = ?4
            )
          RETURNING id AS message_id
        `,
      )
      .bind(params.messageId, params.threadId, params.scope, params.pageRoute)
      .first<MessageMutationRow>();

    if (!deletedMessage) {
      return null;
    }

    // Batch the thread cleanup and updated_at update into a single round-trip.
    // The two statements are mutually exclusive: at most one will have effect.
    const deleteThreadStmt = db
      .prepare(
        `
          DELETE FROM comment_threads
          WHERE id = ?1
            AND deployment_scope = ?2
            AND page_route = ?3
            AND NOT EXISTS (
              SELECT 1
              FROM comment_messages
              WHERE thread_id = ?1
            )
        `,
      )
      .bind(params.threadId, params.scope, params.pageRoute);

    const updateThreadStmt = db
      .prepare(
        `
          UPDATE comment_threads
          SET updated_at = ?1
          WHERE id = ?2
            AND deployment_scope = ?3
            AND page_route = ?4
            AND EXISTS (
              SELECT 1
              FROM comment_messages
              WHERE thread_id = ?2
            )
        `,
      )
      .bind(now, params.threadId, params.scope, params.pageRoute);

    await runStatements(db, [deleteThreadStmt, updateThreadStmt]);

    // Derive the outcome from actual DB state rather than batch return values,
    // because db.batch() may return run() metadata instead of RETURNING rows.
    const remainingThread = await db
      .prepare(
        `
          SELECT updated_at AS updated_at
          FROM comment_threads
          WHERE id = ?1
            AND deployment_scope = ?2
            AND page_route = ?3
        `,
      )
      .bind(params.threadId, params.scope, params.pageRoute)
      .first<Pick<ThreadStateRow, "updated_at">>();

    return {
      threadId: params.threadId,
      messageId: params.messageId,
      updatedAt: remainingThread?.updated_at ?? null,
      deletedThread: remainingThread == null,
    };
  }

  warnMemoryFallback();
  const key = pageKey(params.scope, params.pageRoute);
  const currentThreads = memoryStore.get(key) ?? [];
  const nextThreads = sortThreads(
    currentThreads
      .map((thread) => {
        if (thread.id !== params.threadId) {
          return thread;
        }

        const nextMessages = thread.messages.filter((message) => message.id !== params.messageId);
        if (nextMessages.length === 0) {
          return null;
        }

        return {
          ...thread,
          updatedAt: now,
          messages: nextMessages,
        };
      })
      .filter((thread): thread is CommentThread => thread !== null),
  );
  const updatedThread = nextThreads.find((thread) => thread.id === params.threadId) ?? null;

  if (
    !currentThreads.some(
      (thread) => thread.id === params.threadId && thread.messages.some((message) => message.id === params.messageId),
    )
  ) {
    return null;
  }

  memoryStore.set(key, nextThreads);
  return {
    threadId: params.threadId,
    messageId: params.messageId,
    updatedAt: updatedThread?.updatedAt ?? null,
    deletedThread: updatedThread == null,
  };
};

const handleGetThreads = async (request: Request, env: Env): Promise<Response> => {
  const commentStoreEnv = getCommentStoreEnv(request, env);
  const url = new URL(request.url);
  const pageRoute = normalizeText(url.searchParams.get("page"), 300);

  if (!pageRoute) {
    return errorResponse("page parameter is required", 400);
  }

  const cursor = parseThreadCursor(url.searchParams.get("cursor"));
  const limit = normalizePageSize(url.searchParams.get("limit"));
  const threadsPage = await listThreads(commentStoreEnv, getDeploymentScope(request, env), pageRoute, limit, cursor);
  return jsonResponse(threadsPage);
};

const handleCreateThread = async (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> => {
  const commentStoreEnv = getCommentStoreEnv(request, env);
  const payload = (await request.json()) as {
    pageRoute?: unknown;
    authorName?: unknown;
    body?: unknown;
    anchor?: unknown;
  };

  const pageRoute = normalizeText(payload.pageRoute, 300);
  const authorName = normalizeText(payload.authorName, 40);
  const body = normalizeText(payload.body, 4000);

  if (!pageRoute || !authorName || !body) {
    return errorResponse("pageRoute, authorName, and body are required", 400);
  }

  const thread = await createThread({
    env: commentStoreEnv,
    scope: getDeploymentScope(request, env),
    pageRoute,
    authorName,
    body,
    anchor: parseAnchor(payload.anchor),
  });

  if (commentStoreEnv.SLACK_WEBHOOK_URL) {
    ctx.waitUntil(
      sendSlackNotification({
        webhookUrl: commentStoreEnv.SLACK_WEBHOOK_URL,
        origin: new URL(request.url).origin,
        pageRoute,
        authorName,
        body,
        isReply: false,
        githubRepoUrl: env.GITHUB_REPO_URL,
      }).catch(() => {}),
    );
  }

  return jsonResponse(thread, 201);
};

const handleReply = async (request: Request, env: Env, ctx: ExecutionContext, threadId: string): Promise<Response> => {
  const commentStoreEnv = getCommentStoreEnv(request, env);
  const payload = (await request.json()) as {
    pageRoute?: unknown;
    authorName?: unknown;
    body?: unknown;
  };

  const pageRoute = normalizeText(payload.pageRoute, 300);
  const authorName = normalizeText(payload.authorName, 40);
  const body = normalizeText(payload.body, 4000);

  if (!pageRoute || !authorName || !body) {
    return errorResponse("pageRoute, authorName, and body are required", 400);
  }

  const result = await addReply({
    env: commentStoreEnv,
    scope: getDeploymentScope(request, env),
    pageRoute,
    threadId,
    authorName,
    body,
  });

  if (!result) {
    return errorResponse("thread not found", 404);
  }

  if (commentStoreEnv.SLACK_WEBHOOK_URL) {
    ctx.waitUntil(
      sendSlackNotification({
        webhookUrl: commentStoreEnv.SLACK_WEBHOOK_URL,
        origin: new URL(request.url).origin,
        pageRoute,
        authorName,
        body,
        isReply: true,
        githubRepoUrl: env.GITHUB_REPO_URL,
      }).catch(() => {}),
    );
  }

  return jsonResponse(result, 201);
};

const handleDeleteThread = async (request: Request, env: Env, threadId: string): Promise<Response> => {
  const commentStoreEnv = getCommentStoreEnv(request, env);
  const url = new URL(request.url);
  const pageRoute = normalizeText(url.searchParams.get("page"), 300);

  if (!pageRoute) {
    return errorResponse("page parameter is required", 400);
  }

  const deleted = await deleteThread({
    env: commentStoreEnv,
    scope: getDeploymentScope(request, env),
    pageRoute,
    threadId,
  });

  if (!deleted) {
    return errorResponse("thread not found", 404);
  }

  return new Response(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store",
    },
  });
};

const handlePatchThread = async (request: Request, env: Env, threadId: string): Promise<Response> => {
  const commentStoreEnv = getCommentStoreEnv(request, env);
  const payload = (await request.json()) as {
    pageRoute?: unknown;
    resolved?: unknown;
  };

  const pageRoute = normalizeText(payload.pageRoute, 300);

  if (!pageRoute || typeof payload.resolved !== "boolean") {
    return errorResponse("pageRoute and resolved are required", 400);
  }

  const result = await updateThreadResolvedState({
    env: commentStoreEnv,
    scope: getDeploymentScope(request, env),
    pageRoute,
    threadId,
    resolved: payload.resolved,
  });

  if (!result) {
    return errorResponse("thread not found", 404);
  }

  return jsonResponse(result, 200);
};

const handlePatchMessage = async (
  request: Request,
  env: Env,
  threadId: string,
  messageId: string,
): Promise<Response> => {
  const commentStoreEnv = getCommentStoreEnv(request, env);
  const payload = (await request.json()) as {
    pageRoute?: unknown;
    body?: unknown;
  };

  const pageRoute = normalizeText(payload.pageRoute, 300);
  const body = normalizeText(payload.body, 4000);

  if (!pageRoute || !body) {
    return errorResponse("pageRoute and body are required", 400);
  }

  const result = await updateMessage({
    env: commentStoreEnv,
    scope: getDeploymentScope(request, env),
    pageRoute,
    threadId,
    messageId,
    body,
  });

  if (!result) {
    return errorResponse("message not found", 404);
  }

  return jsonResponse(result, 200);
};

const handleDeleteMessage = async (
  request: Request,
  env: Env,
  threadId: string,
  messageId: string,
): Promise<Response> => {
  const commentStoreEnv = getCommentStoreEnv(request, env);
  const url = new URL(request.url);
  const pageRoute = normalizeText(url.searchParams.get("page"), 300);

  if (!pageRoute) {
    return errorResponse("page parameter is required", 400);
  }

  const result = await deleteMessage({
    env: commentStoreEnv,
    scope: getDeploymentScope(request, env),
    pageRoute,
    threadId,
    messageId,
  });

  if (!result) {
    return errorResponse("message not found", 404);
  }

  return jsonResponse(result, 200);
};

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const commentApiRequest = url.pathname.startsWith("/api/comment-threads");

    if (commentApiRequest && !areCommentsEnabledForRequest(request)) {
      return errorResponse("Comment API is disabled on local hosts unless debug mode is enabled", 403);
    }

    if (url.pathname === "/api/comment-threads" && request.method === "GET") {
      return handleGetThreads(request, env);
    }

    if (url.pathname === "/api/comment-threads" && request.method === "POST") {
      return handleCreateThread(request, env, ctx);
    }

    const replyMatch = url.pathname.match(/^\/api\/comment-threads\/([^/]+)\/replies$/);
    if (replyMatch && request.method === "POST") {
      return handleReply(request, env, ctx, replyMatch[1]);
    }

    const messageMatch = url.pathname.match(/^\/api\/comment-threads\/([^/]+)\/messages\/([^/]+)$/);
    if (messageMatch && request.method === "PATCH") {
      return handlePatchMessage(request, env, messageMatch[1], messageMatch[2]);
    }
    if (messageMatch && request.method === "DELETE") {
      return handleDeleteMessage(request, env, messageMatch[1], messageMatch[2]);
    }

    const threadMatch = url.pathname.match(/^\/api\/comment-threads\/([^/]+)$/);
    if (threadMatch && request.method === "DELETE") {
      return handleDeleteThread(request, env, threadMatch[1]);
    }
    if (threadMatch && request.method === "PATCH") {
      return handlePatchThread(request, env, threadMatch[1]);
    }

    if (env.ASSETS) {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404 || !isHtmlNavigationRequest(request)) {
        return assetResponse;
      }

      return env.ASSETS.fetch(new Request(new URL("/index.html", request.url), request));
    }

    return new Response("Not Found", { status: 404 });
  },
};

export default worker;
