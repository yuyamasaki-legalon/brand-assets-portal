import { editableRouteCatalog } from "../../routeCatalog";
import type { InspectorPanel } from "./types";

export const DEFAULT_ROUTE =
  editableRouteCatalog.find((entry) => entry.path === "/template/loc/case/detail")?.path ?? "/template";
export const DEFAULT_INSTRUCTION = "選択範囲だけ整えて。周辺レイアウトは維持し、Aegis コンポーネントで自然に直して。";

export const ACTIVE_PANEL_META: Record<InspectorPanel, { description: string; title: string }> = {
  help: {
    title: "How to use",
    description: "Visual Editor の基本フローを確認します。",
  },
  prompt: {
    title: "Edit Prompt",
    description: "選択内容を確認して、短い指示を書いたらそのまま実行します。",
  },
  utility: {
    title: "Utilities",
    description: "CLI 向けの補助設定と generated prompt を必要なときだけ確認します。",
  },
};
