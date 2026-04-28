import type { DealPhase } from "./mock";

export const phaseColorMap: Record<DealPhase, "blue" | "teal" | "yellow" | "red"> = {
  案件流入: "blue",
  商談獲得: "blue",
  パイプライン化: "teal",
  正式検討: "teal",
  決裁進行中: "yellow",
  決裁取得: "yellow",
  申込書送付: "teal",
  受注: "teal",
  失注: "red",
};
