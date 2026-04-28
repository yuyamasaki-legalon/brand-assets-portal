import { sortThreads } from "./threadDerivations";
import type { CanvasCommentAnchor, CommentAnchor, CommentThread, SurfaceCommentAnchor } from "./types";
import { isComponentCommentTargetKind, isSurfaceCommentKind } from "./types";

export interface ThreadRow {
  thread_id: string;
  page_route: string;
  thread_created_at: string;
  thread_updated_at: string;
  thread_resolved_at: string | null;
  anchor_kind: string | null;
  anchor_id: string | null;
  anchor_label: string | null;
  anchor_target_kind: string | null;
  anchor_context_label: string | null;
  anchor_x_percent: number | null;
  anchor_y_percent: number | null;
  message_id: string;
  author_name: string;
  body: string;
  message_created_at: string;
  message_edited_at: string | null;
}

export const cloneThreads = (threads: CommentThread[]): CommentThread[] => {
  return threads.map((thread) => ({
    ...thread,
    anchor: thread.anchor ? { ...thread.anchor } : undefined,
    messages: thread.messages.map((message) => ({ ...message })),
  }));
};

export const normalizeText = (value: unknown, maxLength: number): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.slice(0, maxLength);
};

export const normalizePercent = (value: unknown): number | null => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  const clamped = Math.min(100, Math.max(0, value));
  return Math.round(clamped * 1000) / 1000;
};

export const parseCanvasAnchor = (value: unknown): CanvasCommentAnchor | undefined => {
  if (value == null || typeof value !== "object") {
    return undefined;
  }

  const record = value as { xPercent?: unknown; yPercent?: unknown };
  const xPercent = normalizePercent(record.xPercent);
  const yPercent = normalizePercent(record.yPercent);

  if (xPercent == null || yPercent == null) {
    return undefined;
  }

  return { kind: "canvas", xPercent, yPercent };
};

export const parseSurfaceAnchor = (value: unknown): SurfaceCommentAnchor | undefined => {
  if (value == null || typeof value !== "object") {
    return undefined;
  }

  const record = value as {
    surfaceId?: unknown;
    surfaceLabel?: unknown;
    surfaceKind?: unknown;
    xPercent?: unknown;
    yPercent?: unknown;
  };

  const surfaceId = normalizeText(record.surfaceId, 400);
  const surfaceLabel = normalizeText(record.surfaceLabel, 200);
  const surfaceKind = normalizeText(record.surfaceKind, 40);
  const xPercent = normalizePercent(record.xPercent);
  const yPercent = normalizePercent(record.yPercent);

  if (
    !surfaceId ||
    !surfaceLabel ||
    (surfaceKind !== "drawer" && surfaceKind !== "dialog" && surfaceKind !== "popover") ||
    xPercent == null ||
    yPercent == null
  ) {
    return undefined;
  }

  return {
    kind: "surface",
    surfaceId,
    surfaceLabel,
    surfaceKind,
    xPercent,
    yPercent,
  };
};

export const parseAnchor = (value: unknown): CommentAnchor | undefined => {
  if (value == null || typeof value !== "object") {
    return undefined;
  }

  const record = value as {
    kind?: unknown;
    surfaceId?: unknown;
    surfaceLabel?: unknown;
    surfaceKind?: unknown;
    anchorId?: unknown;
    label?: unknown;
    targetKind?: unknown;
    contextLabel?: unknown;
  };

  if (record.kind === "surface") {
    return parseSurfaceAnchor(value);
  }

  if (record.kind === "component") {
    const anchorId = normalizeText(record.anchorId, 400);
    const label = normalizeText(record.label, 200);
    const targetKind = normalizeText(record.targetKind, 40);
    const contextLabel = normalizeText(record.contextLabel, 200) ?? undefined;

    if (!anchorId || !label || !targetKind || !isComponentCommentTargetKind(targetKind)) {
      return undefined;
    }

    return {
      kind: "component",
      anchorId,
      label,
      targetKind,
      contextLabel,
    };
  }

  return parseCanvasAnchor(value);
};

export const buildThreadsFromRows = (rows: ThreadRow[]): CommentThread[] => {
  const threadMap = new Map<string, CommentThread>();

  for (const row of rows) {
    const existing = threadMap.get(row.thread_id);
    if (existing) {
      existing.messages.push({
        id: row.message_id,
        authorName: row.author_name,
        body: row.body,
        createdAt: row.message_created_at,
        editedAt: row.message_edited_at,
      });
      continue;
    }

    threadMap.set(row.thread_id, {
      id: row.thread_id,
      pageRoute: row.page_route,
      createdAt: row.thread_created_at,
      updatedAt: row.thread_updated_at,
      resolvedAt: row.thread_resolved_at,
      anchor:
        row.anchor_kind === "surface"
          ? row.anchor_id &&
            row.anchor_label &&
            row.anchor_target_kind &&
            isSurfaceCommentKind(row.anchor_target_kind) &&
            row.anchor_x_percent != null &&
            row.anchor_y_percent != null
            ? {
                kind: "surface",
                surfaceId: row.anchor_id,
                surfaceLabel: row.anchor_label,
                surfaceKind: row.anchor_target_kind,
                xPercent: row.anchor_x_percent,
                yPercent: row.anchor_y_percent,
              }
            : undefined
          : row.anchor_kind === "component"
            ? row.anchor_id &&
              row.anchor_label &&
              row.anchor_target_kind &&
              isComponentCommentTargetKind(row.anchor_target_kind)
              ? {
                  kind: "component",
                  anchorId: row.anchor_id,
                  label: row.anchor_label,
                  targetKind: row.anchor_target_kind,
                  contextLabel: row.anchor_context_label ?? undefined,
                }
              : undefined
            : row.anchor_kind !== "canvas" || row.anchor_x_percent == null || row.anchor_y_percent == null
              ? undefined
              : {
                  kind: "canvas",
                  xPercent: row.anchor_x_percent,
                  yPercent: row.anchor_y_percent,
                },
      messages: [
        {
          id: row.message_id,
          authorName: row.author_name,
          body: row.body,
          createdAt: row.message_created_at,
          editedAt: row.message_edited_at,
        },
      ],
    });
  }

  return sortThreads([...threadMap.values()]);
};
