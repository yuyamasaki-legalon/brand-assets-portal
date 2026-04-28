import type { Edge, Node } from "@xyflow/react";
import type { ScreenNodeData } from "../../../../../components/prototype/types";
import {
  CaseDetailPreview,
  CaseListPreview,
  ContractListPreview,
  DashboardPreview,
  EsignPreview,
  FileDetailPreview,
  LoaPreview,
  ReviewConsolePreview,
  ReviewPreview,
  SearchPreview,
  TemplatesPreview,
} from "./previews";

// ─── Panel Detail Map ──────────────────────────────────
// Full data for NodeDetailPanel (badges, stateCount, variantCount, patternGroups).
// Kept separate from node data to avoid rendering tiny badge/text garbage at overview zoom.

export const nodeDetailMap: Record<string, ScreenNodeData> = {
  dashboard: {
    label: "ダッシュボード",
    path: "/template/loc/dashboard",
    stateCount: 2,
    badges: [{ label: "Hub", color: "information" }],
    preview: <DashboardPreview />,
  },
  "case-list": {
    label: "案件一覧",
    path: "/template/loc/case",
    stateCount: 3,
    variantCount: 2,
    badges: [{ label: "list", color: "neutral" }],
    preview: <CaseListPreview />,
    patternGroups: [
      {
        name: "タブ切替",
        patterns: [
          { name: "すべて", preview: <CaseListPreview /> },
          { name: "担当者未入力", preview: <CaseListPreview /> },
          { name: "担当中", preview: <CaseListPreview /> },
        ],
      },
      {
        name: "状態",
        patterns: [
          { name: "データあり", preview: <CaseListPreview /> },
          { name: "フィルター適用", preview: <CaseListPreview /> },
        ],
      },
    ],
  },
  "case-detail": {
    label: "案件詳細",
    path: "/template/loc/case/detail",
    stateCount: 2,
    variantCount: 2,
    badges: [{ label: "detail", color: "neutral" }],
    preview: <CaseDetailPreview />,
    patternGroups: [
      {
        name: "ペイン表示",
        patterns: [
          { name: "全ペイン展開", preview: <CaseDetailPreview /> },
          { name: "ペイン折畳", preview: <CaseDetailPreview /> },
        ],
      },
      {
        name: "タイムライン",
        patterns: [
          { name: "メッセージあり", preview: <CaseDetailPreview /> },
          { name: "受付フォームのみ", preview: <CaseDetailPreview /> },
        ],
      },
    ],
  },
  "contract-list": {
    label: "契約書管理",
    path: "/template/loc/contracts",
    stateCount: 2,
    variantCount: 2,
    badges: [{ label: "list", color: "neutral" }],
    preview: <ContractListPreview />,
  },
  "file-detail": {
    label: "ファイル詳細",
    path: "/template/loc/file-management/detail",
    stateCount: 2,
    variantCount: 1,
    badges: [{ label: "detail", color: "neutral" }],
    preview: <FileDetailPreview />,
  },
  review: {
    label: "レビュー",
    path: "/template/loc/review",
    stateCount: 2,
    variantCount: 2,
    badges: [{ label: "fill", color: "neutral" }],
    preview: <ReviewPreview />,
    patternGroups: [
      {
        name: "分析タブ",
        patterns: [
          { name: "契約リスク", preview: <ReviewPreview /> },
          { name: "法令遵守", preview: <ReviewPreview /> },
        ],
      },
      {
        name: "分析状態",
        patterns: [
          { name: "分析中", preview: <ReviewPreview /> },
          { name: "完了", preview: <ReviewPreview /> },
        ],
      },
    ],
  },
  esign: {
    label: "電子契約",
    path: "/template/loc/esign",
    stateCount: 4,
    badges: [{ label: "form", color: "neutral" }],
    preview: <EsignPreview />,
  },
  search: {
    label: "検索",
    path: "/template/loc/search",
    stateCount: 2,
    badges: [{ label: "fill", color: "neutral" }],
    preview: <SearchPreview />,
  },
  templates: {
    label: "ひな形",
    path: "/template/loc/legalon-template",
    stateCount: 2,
    badges: [{ label: "list", color: "neutral" }],
    preview: <TemplatesPreview />,
  },
  "review-console": {
    label: "審査基準",
    path: "/template/loc/review-console",
    stateCount: 2,
    badges: [{ label: "settings", color: "neutral" }],
    preview: <ReviewConsolePreview />,
  },
  loa: {
    label: "LOA",
    path: "/template/loc/loa",
    stateCount: 2,
    badges: [{ label: "AI", color: "information" }],
    preview: <LoaPreview />,
  },
};

// ─── Screen Nodes ──────────────────────────────────────
// Display-only data: label + preview + path. No badges/stateCount/variantCount
// to avoid rendering tiny text garbage at overview zoom (~0.2x).

export const screenNodes: Node<ScreenNodeData>[] = [
  {
    id: "dashboard",
    type: "screen",
    position: { x: 0, y: 350 },
    data: {
      label: "ダッシュボード",
      path: "/template/loc/dashboard",
      preview: <DashboardPreview />,
    },
  },
  {
    id: "case-list",
    type: "screen",
    position: { x: 500, y: 80 },
    data: {
      label: "案件一覧",
      path: "/template/loc/case",
      preview: <CaseListPreview />,
    },
  },
  {
    id: "case-detail",
    type: "screen",
    position: { x: 900, y: 80 },
    data: {
      label: "案件詳細",
      path: "/template/loc/case/detail",
      preview: <CaseDetailPreview />,
    },
  },
  {
    id: "contract-list",
    type: "screen",
    position: { x: 500, y: 650 },
    data: {
      label: "契約書管理",
      path: "/template/loc/contracts",
      preview: <ContractListPreview />,
    },
  },
  {
    id: "file-detail",
    type: "screen",
    position: { x: 900, y: 650 },
    data: {
      label: "ファイル詳細",
      path: "/template/loc/file-management/detail",
      preview: <FileDetailPreview />,
    },
  },
  {
    id: "review",
    type: "screen",
    position: { x: 1300, y: 80 },
    data: {
      label: "レビュー",
      path: "/template/loc/review",
      preview: <ReviewPreview />,
    },
  },
  {
    id: "esign",
    type: "screen",
    position: { x: 900, y: 1200 },
    data: {
      label: "電子契約",
      path: "/template/loc/esign",
      preview: <EsignPreview />,
    },
  },
  {
    id: "search",
    type: "screen",
    position: { x: 500, y: 1750 },
    data: {
      label: "検索",
      path: "/template/loc/search",
      preview: <SearchPreview />,
    },
  },
  {
    id: "templates",
    type: "screen",
    position: { x: 900, y: 1750 },
    data: {
      label: "ひな形",
      path: "/template/loc/legalon-template",
      preview: <TemplatesPreview />,
    },
  },
  {
    id: "review-console",
    type: "screen",
    position: { x: 1300, y: 1750 },
    data: {
      label: "審査基準",
      path: "/template/loc/review-console",
      preview: <ReviewConsolePreview />,
    },
  },
  {
    id: "loa",
    type: "screen",
    position: { x: 500, y: 2300 },
    data: {
      label: "LOA",
      path: "/template/loc/loa",
      preview: <LoaPreview />,
    },
  },
];

// ─── Group Nodes ───────────────────────────────────────

export const groupNodes: Node[] = [
  {
    id: "group-core",
    type: "group",
    position: { x: 380, y: -40 },
    data: { label: "Core Workflow", width: 1320, height: 1420 },
    style: { zIndex: -1 },
    selectable: false,
    draggable: false,
  },
  {
    id: "group-knowledge",
    type: "group",
    position: { x: 380, y: 1630 },
    data: { label: "Knowledge & Tools", width: 1320, height: 850 },
    style: { zIndex: -1 },
    selectable: false,
    draggable: false,
  },
];

// ─── All Nodes ─────────────────────────────────────────

export const initialNodes: Node[] = [...groupNodes, ...screenNodes];

// ─── Edges ─────────────────────────────────────────────

export const initialEdges: Edge[] = [
  {
    id: "e-dashboard-caselist",
    source: "dashboard",
    target: "case-list",
    type: "animated",
    data: { label: "案件管理へ" },
  },
  {
    id: "e-dashboard-contractlist",
    source: "dashboard",
    target: "contract-list",
    type: "animated",
    data: { label: "契約書管理へ" },
  },
  {
    id: "e-dashboard-search",
    source: "dashboard",
    target: "search",
    type: "animated",
    data: { label: "検索" },
  },
  {
    id: "e-dashboard-loa",
    source: "dashboard",
    target: "loa",
    type: "animated",
    data: { label: "AI アシスタント" },
  },
  {
    id: "e-caselist-casedetail",
    source: "case-list",
    target: "case-detail",
    type: "animated",
    data: { label: "行クリック" },
  },
  {
    id: "e-casedetail-review",
    source: "case-detail",
    target: "review",
    type: "animated",
    data: { label: "レビュー開始" },
  },
  {
    id: "e-casedetail-filedetail",
    source: "case-detail",
    target: "file-detail",
    type: "animated",
    data: { label: "ファイル表示" },
  },
  {
    id: "e-contractlist-filedetail",
    source: "contract-list",
    target: "file-detail",
    type: "animated",
    data: { label: "行クリック" },
  },
  {
    id: "e-filedetail-review",
    source: "file-detail",
    target: "review",
    type: "animated",
    data: { label: "レビュー開始" },
  },
  {
    id: "e-filedetail-esign",
    source: "file-detail",
    target: "esign",
    type: "animated",
    data: { label: "電子契約へ" },
  },
  {
    id: "e-templates-reviewconsole",
    source: "templates",
    target: "review-console",
    type: "animated",
    data: { label: "ルール/ひな形参照" },
  },
  {
    id: "e-reviewconsole-templates",
    source: "review-console",
    target: "templates",
    type: "animated",
    data: { label: "ひな形参照" },
  },
];
