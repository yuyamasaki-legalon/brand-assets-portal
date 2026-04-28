export interface CanvasCommentAnchor {
  kind: "canvas";
  xPercent: number;
  yPercent: number;
}

export type SurfaceCommentKind = "drawer" | "dialog" | "popover";

const SURFACE_COMMENT_KINDS = ["drawer", "dialog", "popover"] as const satisfies SurfaceCommentKind[];

export interface SurfaceCommentAnchor {
  kind: "surface";
  surfaceId: string;
  surfaceLabel: string;
  surfaceKind: SurfaceCommentKind;
  xPercent: number;
  yPercent: number;
}

export type PinAnchor = CanvasCommentAnchor | SurfaceCommentAnchor;

export type ComponentCommentTargetKind =
  | "component"
  | "button"
  | "field"
  | "input"
  | "select"
  | "textarea"
  | "dialog"
  | "drawer"
  | "popover";

const COMPONENT_COMMENT_TARGET_KINDS = [
  "component",
  "button",
  "field",
  "input",
  "select",
  "textarea",
  "dialog",
  "drawer",
  "popover",
] as const satisfies ComponentCommentTargetKind[];

export interface ComponentCommentAnchor {
  kind: "component";
  anchorId: string;
  label: string;
  targetKind: ComponentCommentTargetKind;
  contextLabel?: string;
}

export type CommentAnchor = CanvasCommentAnchor | SurfaceCommentAnchor | ComponentCommentAnchor;

export interface CommentMessage {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
  editedAt?: string | null;
  pending?: boolean;
}

export interface CommentThread {
  id: string;
  pageRoute: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  anchor?: CommentAnchor;
  messages: CommentMessage[];
  pending?: boolean;
}

export interface CommentThreadsPage {
  threads: CommentThread[];
  nextCursor: string | null;
}

export interface CommentReplyResult {
  threadId: string;
  pageRoute: string;
  updatedAt: string;
  resolvedAt?: string | null;
  message: CommentMessage;
}

export interface CommentThreadStateResult {
  threadId: string;
  updatedAt: string;
  resolvedAt?: string | null;
}

export interface CommentMessageUpdateResult {
  threadId: string;
  updatedAt: string;
  messageId: string;
  body: string;
  editedAt: string;
}

export interface CommentMessageDeleteResult {
  threadId: string;
  messageId: string;
  updatedAt: string | null;
  deletedThread: boolean;
}

export interface PinnedCommentThread extends CommentThread {
  anchor: CanvasCommentAnchor;
  pinIndex: number;
}

export interface SurfacePinnedCommentThread extends CommentThread {
  anchor: SurfaceCommentAnchor;
  pinIndex: number;
}

export interface PositionedCommentThread extends CommentThread {
  anchor: PinAnchor;
  pinIndex: number;
}

export interface ComponentAnchoredCommentThread extends CommentThread {
  anchor: ComponentCommentAnchor;
}

export const isCanvasAnchor = (anchor?: CommentAnchor): anchor is CanvasCommentAnchor => {
  return anchor?.kind === "canvas";
};

export const isSurfaceAnchor = (anchor?: CommentAnchor): anchor is SurfaceCommentAnchor => {
  return anchor?.kind === "surface";
};

export const isComponentAnchor = (anchor?: CommentAnchor): anchor is ComponentCommentAnchor => {
  return anchor?.kind === "component";
};

export const isComponentCommentTargetKind = (value: string): value is ComponentCommentTargetKind => {
  return COMPONENT_COMMENT_TARGET_KINDS.includes(value as ComponentCommentTargetKind);
};

export const isSurfaceCommentKind = (value: string): value is SurfaceCommentKind => {
  return SURFACE_COMMENT_KINDS.includes(value as SurfaceCommentKind);
};
