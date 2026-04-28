import { LfArrowUpRightFromSquare, LfLayoutHorizonRight, LfWarningTriangle } from "@legalforce/aegis-icons";
import {
  Button,
  ButtonGroup,
  ContentHeader,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  FormControl,
  Icon,
  Popover,
  Select,
  Text,
} from "@legalforce/aegis-react";
import { type ReactNode, useEffect, useId, useState } from "react";
import type { LegendPayload } from "recharts";
import type { LocaleCode } from "../../../../../../contexts/LocaleContext";
import chartPalette from "../ChartParette.json";
import { CASE_TYPE_MAPPING, CASE_TYPE_ORDER } from "../constants";
import { useTranslation } from "../hooks/useTranslation";
import { reportTranslations } from "../reportTranslations";
import type { AssigneeFilterMode, DueDateFilter, LeadTimeCategories, LeadTimeCompositionData } from "../types";
import { STATUS_ORDER } from "../types";

/**
 * SVGパターン設定の型定義
 */
export interface SvgPatternConfig {
  svgPath: string; // SVGのpathデータ（d属性の値）
  scale?: number; // 倍率（デフォルト: 0.25、つまり25%）
  color?: string; // SVGの色（デフォルト: chartPalette.neutral["600(base)"]）
  patternSize?: number; // パターンのサイズ（デフォルト: scale * 48）
  backgroundColor?: string; // 背景色（SVGパターンで型抜きする際の背景色）
}

/**
 * SVG pathデータの定数
 */
export const SVG_PATHS = {
  texA27: "M24,0L0,24v-12L12,0h12ZM36,0L0,36v12L48,0h-12ZM12,48h12l24-24v-12L12,48ZM36,48h12v-12l-12,12Z",
  texA01:
    "M0,0h48v48H0V0ZM12,8c2.21,0,4,1.79,4,4s-1.79,4-4,4-4-1.79-4-4,1.79-4,4-4M12,4c-4.42,0-8,3.58-8,8s3.58,8,8,8,8-3.58,8-8-3.58-8-8-8h0ZM36,8c2.21,0,4,1.79,4,4s-1.79,4-4,4-4-1.79-4-4,1.79-4,4-4M36,4c-4.42,0-8,3.58-8,8s3.58,8,8,8,8-3.58,8-8-3.58-8-8-8h0ZM24,32c2.21,0,4,1.79,4,4s-1.79,4-4,4-4-1.79-4-4,1.79-4,4-4M24,28c-4.42,0-8,3.58-8,8s3.58,8,8,8,8-3.58,8-8-3.58-8-8-8h0ZM0,28v4c2.21,0,4,1.79,4,4s-1.79,4-4,4v4c4.42,0,8-3.58,8-8S4.42,28,0,28ZM48,32v-4c-4.42,0-8,3.58-8,8s3.58,8,8,8v-4c-2.21,0-4-1.79-4-4s1.79-4,4-4Z",
} as const;

/**
 * 納期カテゴリのスタイル設定の型定義
 */
export interface DueDateCategoryStyle {
  backgroundColor: string; // バーの背景色
  badgeVariant: "white-bg-black-text" | "no-bg-white-text" | "no-bg-black-text";
  barBorder?: {
    // オプショナル：バーのボーダー
    color: string;
    width: number;
  };
  svgPattern?: SvgPatternConfig; // オプショナル：SVGパターン（未入力の場合など）
}

/**
 * 納期カテゴリのスタイル設定の定数
 */
export const DUE_DATE_CATEGORY_STYLES: Record<string, DueDateCategoryStyle> = {
  超過: {
    backgroundColor: chartPalette.orange["600(base)"],
    badgeVariant: "no-bg-white-text",
    barBorder: {
      color: chartPalette.orange["600(base)"],
      width: 1,
    },
  },
  今日: {
    backgroundColor: chartPalette.azure["900"],
    badgeVariant: "no-bg-white-text",
    barBorder: {
      color: chartPalette.azure["900"],
      width: 1,
    },
  },
  "2日以内": {
    backgroundColor: chartPalette.azure["700"],
    badgeVariant: "no-bg-white-text",
    barBorder: {
      color: chartPalette.azure["700"],
      width: 1,
    },
  },
  "3-6日以内": {
    backgroundColor: chartPalette.neutral["400"],
    badgeVariant: "no-bg-black-text",
    barBorder: {
      color: chartPalette.neutral["500(border only)"],
      width: 1,
    },
  },
  "7日以降": {
    backgroundColor: chartPalette.neutral["200"],
    badgeVariant: "no-bg-black-text",
    barBorder: {
      color: chartPalette.neutral["500(border only)"],
      width: 1,
    },
  },
  未入力: {
    backgroundColor: "transparent",
    badgeVariant: "white-bg-black-text",
    svgPattern: {
      svgPath: SVG_PATHS.texA27,
      scale: 0.2,
      color: chartPalette.neutral["600(base)"],
    },
    barBorder: {
      color: chartPalette.neutral["500(border only)"],
      width: 1,
    },
  },
} as const;

/**
 * 完了案件カードの納期別スタイル（進行中の案件状況の納期別に合わせたマッピング）
 * 納期内 → 2日以内（azure）, 納期超過 → 超過（orange）, 納期未入力 → 未入力
 */
export const COMPLETED_DUE_DATE_STYLES: Record<string, DueDateCategoryStyle> = {
  納期内: DUE_DATE_CATEGORY_STYLES["2日以内"],
  納期超過: DUE_DATE_CATEGORY_STYLES.超過,
  納期未入力: DUE_DATE_CATEGORY_STYLES.未入力,
};

/**
 * 依頼部署別グラフ用のスタイル取得（進行中の案件状況と同じパターン）
 * blue-600 → blue-400 → azure-600 → azure-400 → ... の順
 */
export function getDepartmentStyle(
  index: number,
  isOther: boolean,
): {
  backgroundColor: string;
  badgeVariant: "no-bg-white-text" | "no-bg-black-text";
  barBorder: { color: string; width: number };
  svgPattern: SvgPatternConfig | undefined;
} {
  if (isOther) {
    return {
      backgroundColor: chartPalette.neutral["400"],
      badgeVariant: "no-bg-black-text",
      barBorder: {
        color: chartPalette.neutral["500(border only)"],
        width: 1,
      },
      svgPattern: undefined,
    };
  }

  const colorKeys = [
    "blue",
    "azure",
    "teal",
    "grass",
    "lime",
    "yellow",
    "amber",
    "orange",
    "red",
    "magenta",
    "purple",
    "indigo",
  ] as const;

  const colorIndex = Math.floor(index / 2);
  const colorKey = colorKeys[colorIndex % colorKeys.length];
  const shadeIndex = index % 2;

  const colorPalette = chartPalette[colorKey as keyof typeof chartPalette] as Record<string, string> | undefined;

  let colorValue: string;
  let borderColor: string;

  if (shadeIndex === 0) {
    const colorKey600 = "600(base)" as const;
    colorValue = colorPalette?.[colorKey600] ?? colorPalette?.["600"] ?? chartPalette.azure["600(base)"];
    borderColor = colorValue;
  } else {
    colorValue = colorPalette?.["400"] ?? chartPalette.azure["400"];
    borderColor = colorPalette?.["500(border only)"] ?? chartPalette.azure["500(border only)"];
  }

  const badgeVariant = shadeIndex === 0 ? "no-bg-white-text" : "no-bg-black-text";

  return {
    backgroundColor: colorValue,
    badgeVariant,
    barBorder: { color: borderColor, width: 1 },
    svgPattern: undefined,
  };
}

/**
 * ステータスカテゴリのスタイル設定の型定義
 */
export interface StatusCategoryStyle {
  backgroundColor?: string; // バーの背景色（SVGパターンを使わない場合）
  badgeVariant?: "white-bg-black-text" | "no-bg-white-text" | "no-bg-black-text";
  barBorder?: {
    // オプショナル：バーのボーダー
    color: string;
    width: number;
  };
  svgPattern?: SvgPatternConfig; // オプショナル：SVGパターン
}

/**
 * ステータスカテゴリのスタイル設定の定数
 */
export const STATUS_CATEGORY_STYLES: Record<string, StatusCategoryStyle> = {
  // 未着手: neutral-400
  未着手: {
    backgroundColor: chartPalette.neutral["400"],
    badgeVariant: "no-bg-black-text",
    barBorder: {
      color: chartPalette.neutral["500(border only)"],
      width: 1,
    },
  },
  // 確認中以降のスタイル定義は削除し、動的に色を割り当てるように変更
} as const;

/**
 * 案件タイプカテゴリのスタイル設定の型定義
 */
export interface CaseTypeCategoryStyle {
  backgroundColor?: string; // バーの背景色（SVGパターンを使わない場合）
  badgeVariant?: "white-bg-black-text" | "no-bg-white-text" | "no-bg-black-text";
  barBorder?: {
    // オプショナル：バーのボーダー
    color: string;
    width: number;
  };
  svgPattern?: SvgPatternConfig; // オプショナル：SVGパターン
}

/**
 * 案件タイプカテゴリのスタイル設定の定数
 */
export const CASE_TYPE_CATEGORY_STYLES: Record<string, CaseTypeCategoryStyle> = {
  契約書審査: {
    backgroundColor: chartPalette.indigo["900"],
    badgeVariant: "no-bg-white-text",
    barBorder: {
      color: chartPalette.indigo["900"],
      width: 1,
    },
  },
  契約書起案: {
    backgroundColor: chartPalette.purple["300"],
    badgeVariant: "no-bg-black-text",
    barBorder: {
      color: chartPalette.purple["500(border only)"],
      width: 1,
    },
  },
  法務相談: {
    backgroundColor: chartPalette.red["600(base)"],
    badgeVariant: "no-bg-white-text",
    barBorder: {
      color: chartPalette.red["600(base)"],
      width: 1,
    },
  },
  その他: {
    backgroundColor: chartPalette.neutral["200"],
    badgeVariant: "no-bg-black-text",
    barBorder: {
      color: chartPalette.neutral["500(border only)"],
      width: 1,
    },
  },
} as const;

/**
 * LabelListのcontentプロップに渡されるpropsの型定義
 */
export interface LabelListContentProps {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  value?: string | number | null | false | true;
  index?: number;
  payload?: Record<string, unknown>;
  dataKey?: string;
}

/**
 * 縦方向の積み上げ棒グラフ用（layout="horizontal"）のカスタム形状
 * セグメント間に1pxの白い余白を確保するため、上側に隣接するセグメントがある場合のみ高さを減らします。
 * TOTAL_REDUCTION = VISUAL_GAP + strokeWidth により、余白と枠線が重ならず表示されます。
 * サンプルと同様、白線は描かず余白（TOTAL_REDUCTION）のみで区切りを表現する。
 */
export const VerticalBarWithDivider = (props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  hideDivider?: boolean;
  radius?: number | [number, number, number, number];
  barBorder?: {
    color: string;
    width: number;
  };
  svgPattern?: SvgPatternConfig;
  gap?: number; // セグメント間の白い余白の幅（デフォルト: 1px）
  hasValueBefore?: boolean; // 前のセグメントがあるかどうか（上側にセグメントがあるか）
  hasValueAfter?: boolean; // 後のセグメントがあるかどうか
}) => {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    fill,
    radius = 0,
    barBorder,
    svgPattern,
    gap = 1,
    hasValueBefore = false,
  } = props;

  // 視覚的に「1pxの白い隙間」を確保するための計算（サンプルコードに準拠）
  const VISUAL_GAP = gap;
  const isSameColor = !svgPattern && fill === barBorder?.color;
  const strokeColor = isSameColor || !barBorder ? "transparent" : (barBorder?.color ?? "#000");
  const strokeWidth = strokeColor === "transparent" ? 0 : (barBorder?.width ?? 1);

  const TOTAL_REDUCTION = hasValueBefore ? VISUAL_GAP : 0;

  const adjustedX = x + strokeWidth / 2;
  const adjustedY = y + strokeWidth / 2;
  const adjustedWidth = Math.max(0, width - strokeWidth);
  const adjustedHeight = Math.max(0, height - TOTAL_REDUCTION - strokeWidth);

  const patternId = useId();

  if (adjustedHeight <= 0) return null;

  const [tl, tr, br, bl] = Array.isArray(radius) ? radius : [radius, radius, radius, radius];
  const path = `M${adjustedX},${adjustedY + tl}
                 a${tl},${tl} 0 0 1 ${tl},-${tl}
                 h${adjustedWidth - tl - tr}
                 a${tr},${tr} 0 0 1 ${tr},${tr}
                 v${adjustedHeight - tr - br}
                 a${br},${br} 0 0 1 -${br},${br}
                 h-${adjustedWidth - br - bl}
                 a${bl},${bl} 0 0 1 -${bl},-${bl}
                 z`;

  if (svgPattern) {
    const scale = svgPattern?.scale ?? 0.25;
    const patternSize = svgPattern?.patternSize ?? scale * 48;
    const svgColor = svgPattern?.color ?? chartPalette.neutral["600(base)"];
    return (
      <g>
        <defs>
          <pattern id={patternId} x="0" y="0" width={patternSize} height={patternSize} patternUnits="userSpaceOnUse">
            <rect width={patternSize} height={patternSize} fill="transparent" />
            <svg
              x="0"
              y="0"
              width={patternSize}
              height={patternSize}
              viewBox="0 0 48 48"
              role="img"
              aria-label="Pattern"
            >
              <title>Pattern</title>
              <path d={svgPattern.svgPath} fill={svgColor} />
            </svg>
          </pattern>
        </defs>
        <path
          d={path}
          fill={`url(#${patternId})`}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          shapeRendering="crispEdges"
        />
      </g>
    );
  }

  return (
    <g>
      <path d={path} fill={fill} stroke={strokeColor} strokeWidth={strokeWidth} shapeRendering="crispEdges" />
    </g>
  );
};

/**
 * ひし形のドットを表示するコンポーネント（Lineグラフ用）
 */
export const CustomDiamondDot = (props: { cx?: number; cy?: number; stroke?: string; fill?: string }) => {
  const { cx = 0, cy = 0, stroke, fill } = props;
  const size = 5;
  const points = `${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}`;
  return <polygon points={points} fill={fill || "#fff"} stroke={stroke} strokeWidth={2} />;
};

export const CustomSquareDot = (props: { cx?: number; cy?: number; stroke?: string; fill?: string }) => {
  const { cx = 0, cy = 0, stroke, fill } = props;
  const size = 5;
  return (
    <rect
      x={cx - size}
      y={cy - size}
      width={size * 2}
      height={size * 2}
      fill={fill || "#fff"}
      stroke={stroke}
      strokeWidth={2}
    />
  );
};

/**
 * 横方向の積み上げ棒グラフ用（layout="vertical"）のカスタム形状
 * セグメント間に1pxの白い余白を確保するため、2番目以降のセグメントは開始位置を右にずらします。
 * 枠線の太さ分を含めたオフセットにより、余白と枠線が重ならず表示されます。
 * サンプルと同様、白い線は描かず余白（OFFSET）のみで区切りを表現する。
 */
export const HorizontalBarWithDivider = (props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  hideDivider?: boolean;
  radius?: number | [number, number, number, number];
  svgPattern?: SvgPatternConfig;
  barBorder?: {
    color: string;
    width: number;
  };
  gap?: number; // セグメント間の白い余白の幅（デフォルト: 1px）
  hasValueBefore?: boolean; // 前のセグメントがあるかどうか（左側にセグメントがあるか）
  hasValueAfter?: boolean; // 後のセグメントがあるかどうか
}) => {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    fill,
    radius = 0,
    svgPattern,
    barBorder,
    gap = 1,
    hasValueBefore = false,
  } = props;

  // 視覚的に「1pxの白い隙間」を確保するための計算（サンプルコードに準拠）
  // 枠線の太さが1pxの場合、外側に0.5pxはみ出すため、
  // 隙間1px + 枠線1px = 合計2pxのオフセットが必要になる。
  // 2番目以降のセグメントは開始位置を右にずらすことで隙間を作る。
  const VISUAL_GAP = gap;
  // borderのロジック: fillと同じ色ならtransparentにする (SVGパターンの場合は除外)
  const isSameColor = !svgPattern && fill === barBorder?.color;
  const borderColor = isSameColor || !barBorder ? "transparent" : (barBorder?.color ?? "#000");
  const borderWidth = borderColor === "transparent" ? 0 : (barBorder?.width ?? 1);

  // strokeWidthはinner borderとして描画するため、OFFSETには含めない
  const OFFSET = hasValueBefore ? VISUAL_GAP : 0;

  const patternId = useId();

  const adjustedX = x + OFFSET + borderWidth / 2;
  const adjustedWidth = Math.max(0, width - OFFSET - borderWidth);
  const adjustedY = y + borderWidth / 2;
  const adjustedHeight = Math.max(0, height - borderWidth);

  if (adjustedWidth <= 0) return null;
  const [tl, tr, br, bl] = Array.isArray(radius) ? radius : [radius, radius, radius, radius];

  // 塗りつぶし用のpath（白い余白を考慮）
  const fillPath = `M${adjustedX},${adjustedY + tl}
                 a${tl},${tl} 0 0 1 ${tl},-${tl}
                 h${adjustedWidth - tl - tr}
                 a${tr},${tr} 0 0 1 ${tr},${tr}
                 v${adjustedHeight - tr - br}
                 a${br},${br} 0 0 1 -${br},${br}
                 h-${adjustedWidth - br - bl}
                 a${bl},${bl} 0 0 1 -${bl},-${bl}
                 z`;

  // SVGパターンの設定値を計算
  const scale = svgPattern?.scale ?? 0.25;
  const patternSize = svgPattern?.patternSize ?? scale * 48;
  const svgColor = svgPattern?.color ?? chartPalette.neutral["600(base)"];

  return (
    <g>
      {svgPattern ? (
        <>
          <defs>
            <pattern id={patternId} x="0" y="0" width={patternSize} height={patternSize} patternUnits="userSpaceOnUse">
              <rect width={patternSize} height={patternSize} fill="transparent" />
              <svg
                x="0"
                y="0"
                width={patternSize}
                height={patternSize}
                viewBox="0 0 48 48"
                role="img"
                aria-label="Pattern"
              >
                <title>Pattern</title>
                <path d={svgPattern.svgPath} fill={svgColor} />
              </svg>
            </pattern>
          </defs>
          <path
            d={fillPath}
            fill={`url(#${patternId})`}
            stroke={borderColor}
            strokeWidth={borderWidth}
            shapeRendering="crispEdges"
          />
        </>
      ) : (
        <path d={fillPath} fill={fill} stroke={borderColor} strokeWidth={borderWidth} shapeRendering="crispEdges" />
      )}
    </g>
  );
};

/**
 * 数字を白文字で表示するカスタムラベル
 */
export const BadgeLabel = (props: {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  value?: string | number | null | false | true;
  isPercentage?: boolean;
  dataKey?: string;
  badgeVariant?: "white-bg-black-text" | "no-bg-white-text" | "no-bg-black-text";
}) => {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    value,
    isPercentage,
    dataKey,
    badgeVariant = "no-bg-white-text",
  } = props;
  const numX = typeof x === "string" ? parseFloat(x) || 0 : x;
  const numY = typeof y === "string" ? parseFloat(y) || 0 : y;
  const numWidth = typeof width === "string" ? parseFloat(width) || 0 : width;
  const numHeight = typeof height === "string" ? parseFloat(height) || 0 : height;
  if (value == null || value === 0 || value === "0") return null;

  // booleanの場合は数値に変換できないので除外
  if (typeof value === "boolean") return null;

  const numericValue = typeof value === "string" ? parseFloat(value) : Number(value);
  if (Number.isNaN(numericValue) || numericValue <= 0) return null;

  // 案件数の場合は整数表示
  const isCompletionCount =
    dataKey?.includes("CompletionCount") ||
    dataKey?.includes("新規案件数") ||
    dataKey?.includes("完了案件数") ||
    dataKey?.includes("案件数") ||
    dataKey?.includes("_main") || // 進行中の案件状況の主担当
    dataKey?.includes("_sub") || // 進行中の案件状況の副担当
    CASE_TYPE_ORDER.some((caseType) => dataKey === caseType) || // 案件タイプ名のみの場合も案件数として判定
    dataKey === "超過" ||
    dataKey === "今日" ||
    dataKey === "2日以内" ||
    dataKey === "3-6日以内" ||
    dataKey === "7日以降" ||
    dataKey === "未入力";
  const decimalPlaces = isCompletionCount ? 0 : 1;

  let displayValue: string | number;
  if (isPercentage) {
    displayValue = `${Math.round(numericValue * 100)}%`;
  } else if (isCompletionCount) {
    // 案件数の場合は整数に変換（四捨五入）
    displayValue = Math.round(numericValue).toString();
  } else if (typeof value === "number") {
    const formatted = numericValue.toFixed(decimalPlaces);
    displayValue = formatted;
  } else {
    // 文字列の場合は数値部分を抽出してフォーマット
    // isCompletionCountがtrueの場合は整数表示
    const formatted = isCompletionCount ? Math.round(numericValue).toString() : numericValue.toFixed(decimalPlaces);
    displayValue = formatted;
  }

  const centerX = numX + numWidth / 2;
  const centerY = numY + numHeight / 2;

  // バリアントに基づいて背景とテキスト色を決定
  const shouldShowBackground = badgeVariant === "white-bg-black-text";
  const textColor =
    badgeVariant === "white-bg-black-text" || badgeVariant === "no-bg-black-text" ? "#2E2E2E" : "#ffffff";

  // テキストのサイズを測定するための仮の値（実際のフォントサイズに基づく）
  const fontSize = 11;
  const textWidth = displayValue.toString().length * fontSize * 0.6; // 大まかな幅の推定
  const textHeight = fontSize;
  const paddingX = 4;
  const paddingY = 2;
  const backgroundWidth = textWidth + paddingX * 2;
  const backgroundHeight = textHeight + paddingY * 2;
  const backgroundX = centerX - backgroundWidth / 2;
  const backgroundY = centerY - backgroundHeight / 2;
  const borderRadius = 4;

  return (
    <g pointerEvents="none">
      {shouldShowBackground && (
        <rect
          x={backgroundX}
          y={backgroundY}
          width={backgroundWidth}
          height={backgroundHeight}
          rx={borderRadius}
          ry={borderRadius}
          fill="white"
          opacity={1}
        />
      )}
      <text
        x={centerX}
        y={centerY}
        fill={textColor}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={fontSize}
        fontWeight="bold"
        pointerEvents="none"
      >
        {displayValue}
      </text>
    </g>
  );
};

/**
 * バーの右横に合計数を表示するカスタムラベル
 */
export const RightLabel = (props: {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  value?: string | number;
  offset?: number;
  dataKey?: string;
  firstReplyTime?: number; // 後方互換性のため残す（使用しない）
}) => {
  const { x = 0, y = 0, width = 0, height = 0, value, offset = 8, dataKey } = props;
  const numX = typeof x === "string" ? parseFloat(x) || 0 : x;
  const numY = typeof y === "string" ? parseFloat(y) || 0 : y;
  const numWidth = typeof width === "string" ? parseFloat(width) || 0 : width;
  const numHeight = typeof height === "string" ? parseFloat(height) || 0 : height;
  if (value == null || value === 0 || value === "0") return null;

  // 案件数の場合は整数表示
  const isCompletionCount =
    dataKey?.includes("CompletionCount") ||
    dataKey?.includes("新規案件数") ||
    dataKey?.includes("案件数") ||
    dataKey?.includes("_main") || // 進行中の案件状況の主担当
    dataKey?.includes("_sub") || // 進行中の案件状況の副担当
    dataKey === "超過" ||
    dataKey === "今日" ||
    dataKey === "2日以内" ||
    dataKey === "3-6日以内" ||
    dataKey === "7日以降" ||
    dataKey === "未入力";
  const decimalPlaces = isCompletionCount ? 0 : 1;

  // 文字列の場合は数値部分と単位部分を分離
  let displayValue: string;
  if (typeof value === "string") {
    // 数値部分を抽出（例: "15.0日" → "15.0" と "日"）
    const match = value.match(/^([\d.]+)(.*)$/);
    if (match) {
      const numericPart = parseFloat(match[1]);
      const unitPart = match[2];
      if (!Number.isNaN(numericPart) && numericPart > 0) {
        if (isCompletionCount) {
          // 案件数の場合は整数に変換（四捨五入）
          displayValue = `${Math.round(numericPart)}${unitPart}`;
        } else {
          const formatted = numericPart.toFixed(decimalPlaces);
          displayValue = `${formatted}${unitPart}`;
        }
      } else {
        return null;
      }
    } else {
      // 数値部分が見つからない場合はそのまま表示
      displayValue = value;
    }
  } else if (typeof value === "number") {
    // 数値の場合はフォーマット
    if (isCompletionCount) {
      // 案件数の場合は整数に変換（四捨五入）
      displayValue = Math.round(value).toString();
    } else {
      const formatted = value.toFixed(decimalPlaces);
      displayValue = formatted;
    }
  } else {
    // booleanやその他の型の場合はnullを返す
    return null;
  }

  const rightX = numX + numWidth + offset; // offsetを追加
  const centerY = numY + numHeight / 2;

  return (
    <g pointerEvents="none">
      <text
        x={rightX}
        y={centerY}
        fill="var(--aegis-color-font-default)"
        textAnchor="start"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
        pointerEvents="none"
      >
        {displayValue}
      </text>
    </g>
  );
};

/**
 * 縦棒グラフのバーの上に合計数を表示するカスタムラベル
 */
export const TopLabel = (props: {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  value?: number | string;
  dataKey?: string;
}) => {
  const { x = 0, y = 0, width = 0, value, dataKey } = props;
  const numX = typeof x === "string" ? parseFloat(x) || 0 : x;
  const numY = typeof y === "string" ? parseFloat(y) || 0 : y;
  const numWidth = typeof width === "string" ? parseFloat(width) || 0 : width;
  if (value == null || value === 0 || value === "0") return null;

  const numericValue = typeof value === "string" ? parseFloat(value) : Number(value);
  if (Number.isNaN(numericValue) || numericValue <= 0) return null;

  const isCaseCount =
    dataKey?.includes("CompletionCount") ||
    dataKey?.includes("新規案件数") ||
    dataKey?.includes("完了案件数") ||
    dataKey?.includes("案件数");
  const displayValue = isCaseCount ? numericValue.toFixed(0) : numericValue.toFixed(1);

  const centerX = numX + numWidth / 2;
  const topY = numY - 8;

  return (
    <g pointerEvents="none">
      <text
        x={centerX}
        y={topY}
        fill="var(--aegis-color-font-default)"
        textAnchor="middle"
        dominantBaseline="auto"
        fontSize={12}
        fontWeight="bold"
        pointerEvents="none"
      >
        {displayValue}
      </text>
    </g>
  );
};

/**
 * 凡例をカスタムレンダリングする関数
 * ひし形や円、四角形を歪みのない正確な比率で描画します。
 */
export const renderCustomLegend = (options?: {
  caseStatusView?: "status" | "type" | "dueDate" | "department";
  tenantStatusSeriesForTeamBreakdown?: Array<{ key: string; name: string; color: string; borderColor?: string }>;
  locale?: LocaleCode;
  isNewCaseCountCard?: boolean;
  excludePreviousYear?: boolean;
  displayDepartmentData?: Array<{ name: string; count: number }>;
  departmentStyleMap?: Map<string, { svgPattern?: SvgPatternConfig; backgroundColor?: string }>;
}) => {
  return (props: { payload?: readonly LegendPayload[] }) => {
    const { t: tDefault, locale: defaultLocale } = useTranslation(reportTranslations);
    const {
      caseStatusView,
      tenantStatusSeriesForTeamBreakdown,
      locale: optionsLocale,
      isNewCaseCountCard,
      excludePreviousYear,
      displayDepartmentData,
      departmentStyleMap,
    } = options || {};
    // options.localeが存在する場合はそれを優先、なければuseTranslationから取得したlocaleを使用
    const locale = optionsLocale || defaultLocale;
    // options.localeが存在する場合、そのlocaleを使用して翻訳を行う関数を作成
    const t = optionsLocale
      ? (key: keyof (typeof reportTranslations)["ja-JP"]) => reportTranslations[optionsLocale]?.[key] || key
      : tDefault;
    const payload = props.payload as Array<{
      value: string;
      color?: string;
      type?: string;
      legendType?: string;
      payload?: { fill?: string; stroke?: string };
      dataKey?: string;
    }>;
    if (!payload) return null;

    // legendType="none"のエントリとdataKey="dummy"のエントリを除外
    let filteredPayload = payload.filter(
      (entry) => entry.legendType !== "none" && entry.dataKey !== "dummy" && entry.value !== "dummy",
    );

    // 新規案件cardまたはexcludePreviousYearがtrueの場合、昨年のデータを除外
    if (isNewCaseCountCard || excludePreviousYear) {
      filteredPayload = filteredPayload.filter((entry) => {
        const dataKey = entry.dataKey || "";
        // 昨年のデータを除外
        if (dataKey.includes("_昨年") || dataKey.includes("_previous")) {
          return false;
        }
        // 新規案件cardの場合は案件タイプのみを表示（CASE_TYPE_ORDERに含まれるもののみ）
        if (isNewCaseCountCard) {
          return CASE_TYPE_ORDER.some((caseType) => dataKey.includes(caseType));
        }
        return true;
      });
    }

    // パフォーマンス分析用の順番（データキーで制御してlocaleに依存しない）
    const performanceDataKeyOrder = [
      "新規案件数",
      "onTimeCompletionCount",
      "overdueCompletionCount",
      "noDueDateCompletionCount",
      "初回返信速度中央値",
      "リードタイム中央値",
    ];

    // 凡例の順番を制御
    const sortedPayload = [...filteredPayload].sort((a, b) => {
      const aValue = a.value;
      const bValue = b.value;
      const aDataKey = a.dataKey || "";
      const bDataKey = b.dataKey || "";

      // 新規案件cardの場合、CASE_TYPE_ORDERの順番を優先的に使用
      if (isNewCaseCountCard) {
        const getCaseTypeIndex = (dataKey: string) => {
          return CASE_TYPE_ORDER.findIndex((caseType) => dataKey.includes(caseType));
        };

        const aCaseTypeIndex = getCaseTypeIndex(aDataKey);
        const bCaseTypeIndex = getCaseTypeIndex(bDataKey);

        if (aCaseTypeIndex !== -1 && bCaseTypeIndex !== -1) {
          return aCaseTypeIndex - bCaseTypeIndex;
        }
        if (aCaseTypeIndex !== -1) return -1;
        if (bCaseTypeIndex !== -1) return 1;
      }

      // パフォーマンス分析用の順番（データキーで判定してlocaleに依存しない）
      const aPerformanceIndex = performanceDataKeyOrder.findIndex((p) => aDataKey.includes(p));
      const bPerformanceIndex = performanceDataKeyOrder.findIndex((p) => bDataKey.includes(p));

      if (aPerformanceIndex !== -1 && bPerformanceIndex !== -1) {
        return aPerformanceIndex - bPerformanceIndex;
      }
      if (aPerformanceIndex !== -1) return -1;
      if (bPerformanceIndex !== -1) return 1;

      // 進行中の案件状況の凡例の場合
      if (caseStatusView && tenantStatusSeriesForTeamBreakdown && locale) {
        if (caseStatusView === "status") {
          // ステータス別の場合: tenantStatusSeriesForTeamBreakdownの順番を使用
          const getStatusIndex = (dataKey: string) => {
            // dataKeyからステータスkeyを抽出（例: "未着手_main" → "未着手"）
            const statusKey = dataKey.replace(/_(main|sub)$/, "");
            return tenantStatusSeriesForTeamBreakdown.findIndex((s) => s.key === statusKey);
          };

          const aStatusIndex = getStatusIndex(aDataKey);
          const bStatusIndex = getStatusIndex(bDataKey);

          if (aStatusIndex !== -1 && bStatusIndex !== -1) {
            if (aStatusIndex !== bStatusIndex) {
              return aStatusIndex - bStatusIndex;
            }
            // 同じステータスの場合、主担当を先に
            if (aDataKey.includes("_main") && bDataKey.includes("_sub")) return -1;
            if (aDataKey.includes("_sub") && bDataKey.includes("_main")) return 1;
            return 0;
          }
        } else if (caseStatusView === "dueDate") {
          // 納期別の場合: フィルターの順番を使用
          // グラフのkeyとフィルターの値のマッピング
          const dueDateKeyToFilterValue: Record<string, string> = {
            超過: "納期超過",
            今日: "今日まで",
            "2日以内": "今日含め3日以内",
            "3-6日以内": "今日含め7日以内",
            "7日以降": "1週間後〜",
            未入力: "納期未入力",
          };
          const dueDateOrder = [
            "納期未入力",
            "納期超過",
            "今日まで",
            "今日含め3日以内",
            "今日含め7日以内",
            "1週間後〜",
          ];

          const getDueDateIndex = (dataKey: string) => {
            // dataKeyから納期keyを抽出（例: "超過_main" → "超過"）
            const dueDateKey = dataKey.replace(/_(main|sub)$/, "");
            const filterValue = dueDateKeyToFilterValue[dueDateKey];
            if (!filterValue) return -1;
            return dueDateOrder.indexOf(filterValue);
          };

          const aDueDateIndex = getDueDateIndex(aDataKey);
          const bDueDateIndex = getDueDateIndex(bDataKey);

          if (aDueDateIndex !== -1 && bDueDateIndex !== -1) {
            if (aDueDateIndex !== bDueDateIndex) {
              return aDueDateIndex - bDueDateIndex;
            }
            // 同じ納期カテゴリの場合、主担当を先に
            if (aDataKey.includes("_main") && bDataKey.includes("_sub")) return -1;
            if (aDataKey.includes("_sub") && bDataKey.includes("_main")) return 1;
            return 0;
          }
        } else if (caseStatusView === "type") {
          // 案件タイプ別の場合: CASE_TYPE_ORDERの順番を使用
          const getCaseTypeIndex = (dataKey: string) => {
            // dataKeyから案件タイプkeyを抽出（例: "契約書審査_main" → "契約書審査"）
            const caseTypeKey = dataKey.replace(/_(main|sub)$/, "");
            return CASE_TYPE_ORDER.indexOf(caseTypeKey as (typeof CASE_TYPE_ORDER)[number]);
          };

          const aCaseTypeIndex = getCaseTypeIndex(aDataKey);
          const bCaseTypeIndex = getCaseTypeIndex(bDataKey);

          if (aCaseTypeIndex !== -1 && bCaseTypeIndex !== -1) {
            if (aCaseTypeIndex !== bCaseTypeIndex) {
              return aCaseTypeIndex - bCaseTypeIndex;
            }
            // 同じ案件タイプの場合、主担当を先に
            if (aDataKey.includes("_main") && bDataKey.includes("_sub")) return -1;
            if (aDataKey.includes("_sub") && bDataKey.includes("_main")) return 1;
            return 0;
          }
        } else if (caseStatusView === "department") {
          // 部署別の場合: displayDepartmentDataの順序に基づいてソート
          // 同じ部署名の場合は主担当・副担当の順序のみ考慮
          const aDeptName = aDataKey.replace(/_(main|sub)$/, "");
          const bDeptName = bDataKey.replace(/_(main|sub)$/, "");

          if (aDeptName === bDeptName) {
            if (aDataKey.includes("_main") && bDataKey.includes("_sub")) return -1;
            if (aDataKey.includes("_sub") && bDataKey.includes("_main")) return 1;
            return 0;
          }

          // displayDepartmentDataの順序に基づいてソート
          if (displayDepartmentData && displayDepartmentData.length > 0) {
            const indexA = displayDepartmentData.findIndex((d) => d.name === aDeptName);
            const indexB = displayDepartmentData.findIndex((d) => d.name === bDeptName);

            // displayDepartmentDataに含まれている場合はその順序を使用
            if (indexA !== -1 && indexB !== -1) {
              return indexA - indexB;
            }
            // 片方だけ含まれている場合は、含まれている方を先に
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
          }

          // displayDepartmentDataが提供されていない場合は、filteredPayloadの順序を使用（フォールバック）
          const indexA = filteredPayload.indexOf(a);
          const indexB = filteredPayload.indexOf(b);
          return indexA - indexB;
        }
      }

      // 既存のフォールバックロジック（他のグラフ用）
      // ステータス名のマッピング（英語→日本語）
      const statusReverseMapping: Record<string, string> = {
        "Not started": "未着手",
        "In review": "確認中",
        "Secondary review": "2次確認中",
        "External review": "自部門外確認中",
        Completed: "完了",
      };

      // ステータス別の場合（フォールバック）
      const statusOrderForMatching = ["自部門外確認中", "2次確認中", "確認中", "未着手"];
      const statusOrderForSorting = ["未着手", "確認中", "2次確認中", "自部門外確認中"];

      const getStatusIndex = (value: string) => {
        const normalizedValue = statusReverseMapping[value] || value;
        const exactMatch = statusOrderForSorting.indexOf(normalizedValue);
        if (exactMatch !== -1) return exactMatch;
        for (const status of statusOrderForMatching) {
          if (normalizedValue.includes(status)) {
            return statusOrderForSorting.indexOf(status);
          }
        }
        return -1;
      };

      const aStatusIndex = getStatusIndex(aValue);
      const bStatusIndex = getStatusIndex(bValue);

      if (aStatusIndex !== -1 && bStatusIndex !== -1) {
        if (aStatusIndex !== bStatusIndex) {
          return aStatusIndex - bStatusIndex;
        }
        if (aValue.includes("(主)") && bValue.includes("(副)")) return -1;
        if (aValue.includes("(副)") && bValue.includes("(主)")) return 1;
        return 0;
      }

      // 納期別の場合（フォールバック）
      const dueDateOrder = ["超過", "今日", "2日以内", "3-6日以内", "7日以降", "未入力"];
      const aDueDateIndex = dueDateOrder.findIndex((d) => aValue.includes(d));
      const bDueDateIndex = dueDateOrder.findIndex((d) => bValue.includes(d));

      if (aDueDateIndex !== -1 && bDueDateIndex !== -1) {
        if (aDueDateIndex !== bDueDateIndex) {
          return aDueDateIndex - bDueDateIndex;
        }
        if (aValue.includes("(主)") && bValue.includes("(副)")) return -1;
        if (aValue.includes("(副)") && bValue.includes("(主)")) return 1;
        return 0;
      }

      // 案件タイプ別の場合（フォールバック）
      const caseTypeOrder = ["契約書審査", "契約書起案", "法務相談", "その他"];
      const aCaseTypeIndex = caseTypeOrder.findIndex((c) => aValue.includes(c));
      const bCaseTypeIndex = caseTypeOrder.findIndex((c) => bValue.includes(c));

      if (aCaseTypeIndex !== -1 && bCaseTypeIndex !== -1) {
        if (aCaseTypeIndex !== bCaseTypeIndex) {
          return aCaseTypeIndex - bCaseTypeIndex;
        }
        if (aValue.includes("(主)") && bValue.includes("(副)")) return -1;
        if (aValue.includes("(副)") && bValue.includes("(主)")) return 1;
        return 0;
      }

      return 0;
    });

    // 同じステータス名（「(主)」「(副)」を除いた部分）を持つエントリを重複排除
    const deduplicatedPayload = sortedPayload.reduce<Array<(typeof sortedPayload)[0] & { displayText?: string }>>(
      (acc, entry) => {
        // 進行中の案件状況のグラフの場合、dataKeyから正しいテキストを取得
        let displayText: string | undefined;
        const dataKey = entry.dataKey || "";

        // 新規案件cardの場合、案件タイプの表示名を取得
        if (isNewCaseCountCard && locale) {
          const caseTypeKey = CASE_TYPE_ORDER.find((caseType) => dataKey.includes(caseType));
          if (caseTypeKey) {
            displayText = (CASE_TYPE_MAPPING[locale]?.[caseTypeKey] as string) || caseTypeKey;
          }
        }

        // 進行中の案件状況のグラフかどうかを判定（dataKeyに_mainまたは_subが含まれているか）
        const isOngoingCasesGraph = dataKey.includes("_main") || dataKey.includes("_sub");

        if (isOngoingCasesGraph && caseStatusView && locale && !displayText) {
          if (caseStatusView === "status" && tenantStatusSeriesForTeamBreakdown) {
            // ステータス別の場合: tenantStatusSeriesForTeamBreakdownのnameを使用
            const statusKey = dataKey.replace(/_(main|sub)$/, "");
            const statusItem = tenantStatusSeriesForTeamBreakdown.find((s) => s.key === statusKey);
            if (statusItem) {
              displayText = statusItem.name;
            }
          } else if (caseStatusView === "dueDate") {
            // 納期別の場合: フィルターのラベルを使用
            const dueDateKeyToFilterLabel: Record<string, string> = {
              超過: t("dueDateFilterOverdue"),
              今日: t("dueDateFilterToday"),
              "2日以内": t("dueDateLegend3Days"),
              "3-6日以内": t("dueDateLegend1Week"),
              "7日以降": t("dueDateFilter8DaysPlus"),
              未入力: t("dueDateFilterNoDueDate"),
            };
            const dueDateKey = dataKey.replace(/_(main|sub)$/, "");
            displayText = dueDateKeyToFilterLabel[dueDateKey];
          } else if (caseStatusView === "type") {
            // 案件タイプ別の場合: CASE_TYPE_MAPPINGのラベルを使用
            const caseTypeKey = dataKey.replace(/_(main|sub)$/, "");
            if (caseTypeKey) {
              displayText = (CASE_TYPE_MAPPING[locale]?.[caseTypeKey] as string) || caseTypeKey;
            }
          } else if (caseStatusView === "department") {
            // 部署別の場合: dataKeyから部署名を取得
            const deptName = dataKey.replace(/_(main|sub)$/, "");
            displayText = deptName;
          }
        }

        // 「(主)」「(副)」を除いたステータス名を取得（フォールバック用）
        const statusName =
          displayText ||
          entry.value
            .replace(/\s*\(主\)\s*$/, "")
            .replace(/\s*\(副\)\s*$/, "")
            .replace(/\s*\(Main\)\s*$/, "")
            .replace(/\s*\(Sub\)\s*$/, "");

        // 既に同じステータス名のエントリが存在するかチェック
        const existingIndex = acc.findIndex((e) => {
          const eDisplayText =
            e.displayText ||
            e.value
              .replace(/\s*\(主\)\s*$/, "")
              .replace(/\s*\(副\)\s*$/, "")
              .replace(/\s*\(Main\)\s*$/, "")
              .replace(/\s*\(Sub\)\s*$/, "");
          return eDisplayText === statusName;
        });

        if (existingIndex === -1) {
          // 新しいステータス名の場合は追加（表示用テキストを設定）
          acc.push({
            ...entry,
            value: statusName,
            displayText,
          });
        }
        // 既に存在する場合はスキップ（最初に見つかったエントリを使用）

        return acc;
      },
      [],
    );

    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: "var(--aegis-space-medium)",
          rowGap: "var(--aegis-space-xSmall)",
          paddingTop: "16px",
        }}
      >
        {deduplicatedPayload.map((entry, index) => {
          let icon: ReactNode = null;
          const color = entry.color || entry.payload?.fill || entry.payload?.stroke || "#000";

          // 昨年のデータかどうかを判定
          const isPreviousYear =
            entry.value?.includes("_昨年") ||
            entry.value?.includes("_previous") ||
            entry.value?.includes(t("previousYearLabel"));

          // 納期未入力かどうかを判定
          const isNoDueDate =
            caseStatusView === "dueDate" &&
            (entry.dataKey?.includes("未入力") || entry.value?.includes(t("dueDateFilterNoDueDate")));

          // dataKeyやvalueからアイコンの形状を判定（entry.typeが正しく設定されていない場合のフォールバック）
          const isDiamond =
            entry.type === "diamond" ||
            (entry.value && (entry.value.includes("リードタイム") || entry.value.includes("Lead time")));
          const isCircle =
            entry.type === "circle" ||
            entry.type === "line" ||
            (entry.value && (entry.value.includes("初回返信速度") || entry.value.includes("First response")));

          // 部署別ビューでSVGパターンがある場合
          const deptName =
            caseStatusView === "department" && entry.dataKey ? entry.dataKey.replace(/_(main|sub)$/, "") : undefined;
          const deptStyle = deptName && departmentStyleMap ? departmentStyleMap.get(deptName) : undefined;
          const hasSvgPattern = deptStyle?.svgPattern !== undefined;

          // 納期未入力の場合はSVGパターンを適用
          if (isNoDueDate && !isPreviousYear) {
            const patternId = `legend-pattern-${index}`;
            icon = (
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                style={{ marginRight: "6px", flexShrink: 0 }}
                aria-hidden="true"
              >
                <defs>
                  <pattern id={patternId} x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                    <rect width="12" height="12" fill="transparent" />
                    <svg x="0" y="0" width="12" height="12" viewBox="0 0 48 48" role="img" aria-label="Pattern">
                      <title>Pattern</title>
                      <path
                        d="M24,0L0,24v-12L12,0h12ZM36,0L0,36v12L48,0h-12ZM12,48h12l24-24v-12L12,48ZM36,48h12v-12l-12,12Z"
                        fill={chartPalette.neutral["600(base)"]}
                      />
                    </svg>
                  </pattern>
                </defs>
                <rect width="10" height="10" rx="2" fill={`url(#${patternId})`} />
              </svg>
            );
          } else if (hasSvgPattern && deptStyle?.svgPattern) {
            // 部署別ビューでSVGパターンがある場合
            const patternId = `legend-pattern-dept-${index}`;
            const svgPattern = deptStyle.svgPattern;
            const scale = svgPattern.scale ?? 0.25;
            const patternSize = svgPattern.patternSize ?? scale * 48;
            const svgColor = svgPattern.color ?? chartPalette.neutral["600(base)"];
            icon = (
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                style={{ marginRight: "6px", flexShrink: 0 }}
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id={patternId}
                    x="0"
                    y="0"
                    width={patternSize}
                    height={patternSize}
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width={patternSize} height={patternSize} fill="transparent" />
                    <svg
                      x="0"
                      y="0"
                      width={patternSize}
                      height={patternSize}
                      viewBox="0 0 48 48"
                      role="img"
                      aria-label="Pattern"
                    >
                      <title>Pattern</title>
                      <path d={svgPattern.svgPath} fill={svgColor} />
                    </svg>
                  </pattern>
                </defs>
                <rect width="10" height="10" rx="2" fill={`url(#${patternId})`} />
              </svg>
            );
          } else if (isPreviousYear) {
            icon = (
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "2px",
                  backgroundColor: color,
                  marginRight: "6px",
                  flexShrink: 0,
                }}
              />
            );
          } else if (isDiamond) {
            icon = (
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                style={{ marginRight: "6px", flexShrink: 0 }}
                aria-hidden="true"
              >
                <title>{entry.value}</title>
                <path d="M 5 0 L 10 5 L 5 10 L 0 5 Z" fill={color} />
              </svg>
            );
          } else if (isCircle) {
            icon = (
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  marginRight: "6px",
                  flexShrink: 0,
                }}
              />
            );
          } else {
            icon = (
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "2px",
                  backgroundColor: color,
                  marginRight: "6px",
                  flexShrink: 0,
                }}
              />
            );
          }

          // 昨年データが存在するかチェック
          const hasPreviousYearData = filteredPayload.some(
            (entry) => entry.dataKey?.includes("_昨年") || entry.dataKey?.includes("_previous"),
          );

          // 凡例の値を翻訳する関数
          const translateLegendValue = (value: string, displayText?: string, dataKey?: string): string => {
            // displayTextが設定されている場合はそれを使用（進行中の案件状況のグラフ用）
            if (displayText) {
              return displayText;
            }

            // 昨年のデータの場合
            if (
              value.includes("_昨年") ||
              value.includes("_previous") ||
              dataKey?.includes("_昨年") ||
              dataKey?.includes("_previous")
            ) {
              if (
                dataKey?.includes("リードタイム") ||
                dataKey?.includes("Lead time") ||
                value.includes("リードタイム") ||
                value.includes("Lead time")
              ) {
                return `${t("leadTimeMedianShort")} (${t("previousYearLabel")})`;
              }
              if (
                dataKey?.includes("初回返信速度") ||
                dataKey?.includes("First response") ||
                value.includes("初回返信速度") ||
                value.includes("First response")
              ) {
                return `${t("firstResponseMedianShort")} (${t("previousYearLabel")})`;
              }
            }

            // 今年のデータで、昨年データが存在する場合に「（今年）」を追加
            if (
              hasPreviousYearData &&
              !value.includes("_昨年") &&
              !value.includes("_previous") &&
              !dataKey?.includes("_昨年") &&
              !dataKey?.includes("_previous")
            ) {
              // dataKeyで判定するように修正
              if (
                dataKey === "リードタイム中央値" ||
                dataKey?.includes("リードタイム中央値") ||
                value === "リードタイム中央値" ||
                value === "リードタイム(中央値)" ||
                value === "Lead time (median)" ||
                value.includes("Lead time")
              ) {
                return `${t("leadTimeMedianShort")} (${t("currentYear")})`;
              }
              if (
                dataKey === "初回返信速度中央値" ||
                dataKey?.includes("初回返信速度中央値") ||
                value === "初回返信速度中央値" ||
                value === "初回返信速度(中央値)" ||
                value === "First response time (median)" ||
                value.includes("First response")
              ) {
                return `${t("firstResponseMedianShort")} (${t("currentYear")})`;
              }
            }

            // 翻訳キーと値のマッピング
            const translationMap: Record<string, string> = {
              "リードタイム(中央値)": t("leadTimeMedianShort"),
              リードタイム中央値: t("leadTimeMedianShort"),
              リードタイム中央値_昨年: `${t("leadTimeMedianShort")} (${t("previousYearLabel")})`,
              "Lead time (median)": t("leadTimeMedianShort"),
              "初回返信速度(中央値)": t("firstResponseMedianShort"),
              初回返信速度中央値: t("firstResponseMedianShort"),
              初回返信速度中央値_昨年: `${t("firstResponseMedianShort")} (${t("previousYearLabel")})`,
              "First response time (median)": t("firstResponseMedianShort"),
              新規案件数: t("newCaseCount"),
              "New matter count": t("newCaseCount"),
              納期内完了: t("onTimeCompletion"),
              納期内: t("onTimeCompletion"),
              "On-time completion": t("onTimeCompletion"),
              納期超過完了: t("overdueCompletion"),
              納期超過: t("overdueCompletion"),
              "Overdue completion": t("overdueCompletion"),
              納期未入力: t("noDueDateCompletion"),
              "No due date": t("noDueDateCompletion"),
            };

            // マッピングに存在する場合は翻訳、存在しない場合はそのまま返す
            const translatedValue = translationMap[value] || value;

            // 今年のデータで、昨年データが存在する場合に「（今年）」を追加（translationMapで翻訳された値にも適用）
            if (
              hasPreviousYearData &&
              !value.includes("_昨年") &&
              !value.includes("_previous") &&
              !dataKey?.includes("_昨年") &&
              !dataKey?.includes("_previous")
            ) {
              // リードタイムまたは初回返信速度の場合、翻訳後の値に「（今年）」を追加
              if (translatedValue === t("leadTimeMedianShort") && !translatedValue.includes(t("currentYear"))) {
                return `${translatedValue} (${t("currentYear")})`;
              }
              if (translatedValue === t("firstResponseMedianShort") && !translatedValue.includes(t("currentYear"))) {
                return `${translatedValue} (${t("currentYear")})`;
              }
            }

            return translatedValue;
          };

          return (
            <div key={`item-${entry.value}`} style={{ display: "flex", alignItems: "center" }}>
              {icon}
              <Text variant="body.small" style={{ color: "#000" }}>
                {translateLegendValue(entry.value, entry.displayText, entry.dataKey)}
              </Text>
            </div>
          );
        })}
      </div>
    );
  };
};

/**
 * モダンでクリーンなツールチップコンポーネント
 */
export const CustomChartTooltip = ({
  active,
  payload,
  label,
  caseStatusView,
  locale,
  tenantStatusSeriesForTeamBreakdown,
  assigneeFilterMode,
}: {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number | string;
    unit?: string;
    color?: string;
    fill?: string;
    stroke?: string;
    dataKey?: string;
    payload?: {
      name: string;
      caseNames?: Record<string, string[]>;
      [key: string]: unknown;
    };
  }>;
  label?: string;
  caseStatusView?: "status" | "type" | "dueDate" | "department";
  locale?: LocaleCode;
  tenantStatusSeriesForTeamBreakdown?: Array<{ key: string; name: string; color: string; borderColor?: string }>;
  assigneeFilterMode?: AssigneeFilterMode;
}) => {
  const { t: tDefault } = useTranslation(reportTranslations);
  // localeプロパティが存在する場合、そのlocaleを使用して翻訳を行う関数を作成
  const t = locale
    ? (key: keyof (typeof reportTranslations)["ja-JP"]) => reportTranslations[locale]?.[key] || key
    : tDefault;

  if (active && payload && payload.length > 0) {
    const isShared = payload.length > 1 || !payload[0]?.payload?.caseNames;

    if (isShared) {
      // リードタイムまたは初回返信速度のグラフかどうかを判定（filteredPayloadの前に行う）
      const isLeadTimeGraph = payload.some(
        (entry) =>
          entry.dataKey === "リードタイム中央値" ||
          entry.dataKey === "リードタイム中央値_昨年" ||
          entry.dataKey === "初回返信速度中央値" ||
          entry.dataKey === "初回返信速度中央値_昨年",
      );

      // 案件の完了までの時間の内訳cardのグラフかどうかを判定
      const isLeadTimeCompositionGraph = payload.some(
        (entry) =>
          entry.dataKey?.startsWith("main_") ||
          entry.dataKey?.startsWith("sub_") ||
          entry.dataKey === "medianFirstReplyTime",
      );

      let filteredPayload = payload
        .filter((entry) => {
          // medianFirstReplyTime（Scatter）の場合はfillをチェック
          if (entry.dataKey === "medianFirstReplyTime") {
            return entry.fill !== "#fff";
          }
          // 案件完了までの内訳グラフの場合、main_またはsub_で始まるdataKeyは常に含める
          if (
            isLeadTimeCompositionGraph &&
            entry.dataKey &&
            (entry.dataKey.startsWith("main_") || entry.dataKey.startsWith("sub_"))
          ) {
            return true;
          }
          // リードタイムグラフの場合、strokeのみをチェック（colorやfillはチェックしない）
          if (isLeadTimeGraph) {
            return entry.stroke !== "#fff";
          }
          // 通常のグラフの場合、すべての色をチェック
          return entry.stroke !== "#fff" && entry.color !== "#fff" && entry.fill !== "#fff";
        })
        .filter((entry, index, self) => {
          // 昨年のデータの場合、dataKeyで重複チェック
          if (entry.dataKey?.includes("_昨年")) {
            return index === self.findIndex((t) => t.dataKey === entry.dataKey);
          }
          // リードタイムグラフの場合、dataKeyで重複チェック（nameが空でも含める）
          if (isLeadTimeGraph && entry.dataKey) {
            return index === self.findIndex((t) => t.dataKey === entry.dataKey);
          }
          // 案件完了までの内訳グラフの場合、dataKeyで重複チェック（main_またはsub_で始まるdataKeyは常に含める）
          if (
            isLeadTimeCompositionGraph &&
            entry.dataKey &&
            (entry.dataKey.startsWith("main_") || entry.dataKey.startsWith("sub_"))
          ) {
            return index === self.findIndex((t) => t.dataKey === entry.dataKey);
          }
          // 通常のデータはnameで重複チェック（nameが空の場合はdataKeyでチェック）
          if (!entry.name || entry.name === "") {
            // nameが空の場合はdataKeyでチェック
            if (entry.dataKey) {
              return index === self.findIndex((t) => t.dataKey === entry.dataKey);
            }
            return false; // nameもdataKeyもない場合は除外
          }
          return index === self.findIndex((t) => t.name === entry.name && t.name !== "");
        });

      // 案件タイプ別ビューでassigneeFilterMode === "both"の場合、payloadに含まれていない副担当のデータを追加
      if (caseStatusView === "type" && assigneeFilterMode === "both" && filteredPayload.length > 0) {
        const firstEntry = filteredPayload[0];
        if (firstEntry?.payload) {
          const existingDataKeys = new Set(filteredPayload.map((entry) => entry.dataKey));
          const subEntries: Array<typeof firstEntry> = [];
          const payloadData = firstEntry.payload as Record<string, unknown>;

          CASE_TYPE_ORDER.forEach((caseType) => {
            const subDataKey = `${caseType}_sub`;
            if (!existingDataKeys.has(subDataKey) && payloadData[subDataKey] !== undefined) {
              const subValue = payloadData[subDataKey] as number;
              const localizedCaseType = (CASE_TYPE_MAPPING[locale || "ja-JP"]?.[caseType] as string) || caseType;
              subEntries.push({
                ...firstEntry,
                dataKey: subDataKey,
                value: subValue.toString(),
                name: localizedCaseType,
                fill: firstEntry.fill || firstEntry.color,
                color: firstEntry.color || firstEntry.fill,
              } as typeof firstEntry);
            }
          });

          if (subEntries.length > 0) {
            filteredPayload = [...filteredPayload, ...subEntries];
          }
        }
      }

      // 案件完了までの内訳グラフでassigneeFilterMode === "both"の場合、payloadに含まれていない主担当と副担当のデータを追加
      if (isLeadTimeCompositionGraph && assigneeFilterMode === "both" && filteredPayload.length > 0) {
        const firstEntry = filteredPayload[0];
        if (firstEntry?.payload) {
          const existingDataKeys = new Set(filteredPayload.map((entry) => entry.dataKey));
          const mainEntries: Array<typeof firstEntry> = [];
          const subEntries: Array<typeof firstEntry> = [];
          const payloadData = firstEntry.payload as Record<string, unknown>;

          // STATUS_ORDERから主担当のステータスを取得
          STATUS_ORDER.forEach((status) => {
            const mainDataKey = `main_${status.key}`;
            if (!existingDataKeys.has(mainDataKey) && payloadData[mainDataKey] !== undefined) {
              const mainValue = payloadData[mainDataKey] as number;
              mainEntries.push({
                ...firstEntry,
                dataKey: mainDataKey,
                value: mainValue.toString(),
                name: status.name,
                fill: firstEntry.fill || firstEntry.color,
                color: firstEntry.color || firstEntry.fill,
              } as typeof firstEntry);
            }
          });

          // STATUS_ORDERから副担当のステータスを取得
          STATUS_ORDER.forEach((status) => {
            const subDataKey = `sub_${status.key}`;
            if (!existingDataKeys.has(subDataKey) && payloadData[subDataKey] !== undefined) {
              const subValue = payloadData[subDataKey] as number;
              subEntries.push({
                ...firstEntry,
                dataKey: subDataKey,
                value: subValue.toString(),
                name: status.name,
                fill: firstEntry.fill || firstEntry.color,
                color: firstEntry.color || firstEntry.fill,
              } as typeof firstEntry);
            }
          });

          if (mainEntries.length > 0 || subEntries.length > 0) {
            filteredPayload = [...filteredPayload, ...mainEntries, ...subEntries];
          }
        }
      }

      // 月名を省略表記に変換する関数
      const formatMonthName = (monthName: string | undefined): string => {
        if (!monthName) return "";
        // 日本語: "8月" → "8月" (既に"1月"形式なのでそのまま)
        if (typeof monthName === "string" && monthName.endsWith("月")) {
          return monthName;
        }
        // 英語: "Aug" → "Aug" (既に省略されている)
        return monthName;
      };

      return (
        <div
          style={{
            backgroundColor: "#fff",
            // Aegis token: border/default (--aegis-color-border-default)
            border: "1px solid rgba(0, 0, 0, 0.116)",
            // Aegis token: round-medium
            borderRadius: "4px",
            padding: "12px",
            // Aegis token: shadow-middle
            boxShadow: "inset 0 0 0 1px var(--aegis-color-border-default), var(--aegis-depth-medium)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--aegis-space-xxSmall)",
            minWidth: "140px",
            animation: "fadeIn 0.2s ease-in-out",
          }}
        >
          {/* Aegis token: foreground/default */}
          {label && (
            <Text variant="body.small.bold" style={{ color: "#2E2E2E", fontSize: "12px", marginBottom: "4px" }}>
              {formatMonthName(label)}
            </Text>
          )}
          {filteredPayload.length === 0 && (
            <Text variant="body.small" style={{ color: "#2E2E2E", fontSize: "12px" }}>
              No data
            </Text>
          )}
          {(() => {
            // 昨年のデータがあるかチェック
            const hasPreviousYearData = filteredPayload.some((entry) => entry.dataKey?.includes("_昨年"));

            // 新規案件数の合計を計算（今年と昨年）
            const newCaseCountTotal = filteredPayload.reduce((sum, entry) => {
              if (
                entry.dataKey?.includes("_新規案件数") &&
                !entry.dataKey?.includes("_昨年") &&
                typeof entry.value === "number"
              ) {
                return sum + entry.value;
              }
              return sum;
            }, 0);
            const newCaseCountPreviousYearTotal = filteredPayload.reduce((sum, entry) => {
              if (entry.dataKey?.includes("_新規案件数_昨年") && typeof entry.value === "number") {
                return sum + entry.value;
              }
              return sum;
            }, 0);
            const hasNewCaseCountData = filteredPayload.some(
              (entry) => entry.dataKey?.includes("_新規案件数") && !entry.dataKey?.includes("_昨年"),
            );
            // 完了案件数の合計を計算（今年と昨年）
            const completedCaseCountTotal = filteredPayload.reduce((sum, entry) => {
              if (
                (entry.dataKey?.includes("_完了案件数") ||
                  entry.dataKey?.includes("CompletionCount") ||
                  CASE_TYPE_ORDER.some((caseType) => entry.dataKey === `${caseType}_main`) ||
                  CASE_TYPE_ORDER.some((caseType) => entry.dataKey === `${caseType}_sub`)) &&
                !entry.dataKey?.includes("_昨年") &&
                typeof entry.value === "number"
              ) {
                return sum + entry.value;
              }
              return sum;
            }, 0);
            const completedCaseCountPreviousYearTotal = filteredPayload.reduce((sum, entry) => {
              if (
                (entry.dataKey?.includes("_完了案件数_昨年") || entry.dataKey?.includes("CompletionCount_昨年")) &&
                typeof entry.value === "number"
              ) {
                return sum + entry.value;
              }
              return sum;
            }, 0);
            const hasCompletedCaseCountData = filteredPayload.some(
              (entry) =>
                (entry.dataKey?.includes("_完了案件数") ||
                  entry.dataKey?.includes("CompletionCount") ||
                  CASE_TYPE_ORDER.some((caseType) => entry.dataKey === `${caseType}_main`) ||
                  CASE_TYPE_ORDER.some((caseType) => entry.dataKey === `${caseType}_sub`)) &&
                !entry.dataKey?.includes("_昨年"),
            );

            // 今年と昨年のデータを対応付ける
            const groupedEntries = new Map<
              string,
              { current?: (typeof filteredPayload)[0]; previous?: (typeof filteredPayload)[0] }
            >();

            filteredPayload.forEach((entry) => {
              if (!entry.dataKey) return;

              // 新規案件数または完了案件数のデータキーを処理
              if (
                entry.dataKey.includes("_新規案件数") ||
                entry.dataKey.includes("_完了案件数") ||
                entry.dataKey.includes("CompletionCount")
              ) {
                const isPreviousYear = entry.dataKey.includes("_昨年");
                const baseKey = isPreviousYear ? entry.dataKey.replace("_昨年", "") : entry.dataKey;

                if (!groupedEntries.has(baseKey)) {
                  groupedEntries.set(baseKey, {});
                }
                const group = groupedEntries.get(baseKey);
                if (!group) return;
                if (isPreviousYear) {
                  group.previous = entry;
                } else {
                  group.current = entry;
                }
              }
            });

            // グループ化されたエントリと、グループ化されていないエントリを処理
            const processedEntries: Array<(typeof filteredPayload)[0] & { previousValue?: number; baseKey?: string }> =
              [];
            const processedKeys = new Set<string>();

            filteredPayload.forEach((entry) => {
              if (!entry.dataKey) {
                processedEntries.push(entry);
                return;
              }

              // 新規案件数または完了案件数のデータキーを処理
              if (
                entry.dataKey.includes("_新規案件数") ||
                entry.dataKey.includes("_完了案件数") ||
                entry.dataKey.includes("CompletionCount")
              ) {
                const isPreviousYear = entry.dataKey.includes("_昨年");
                const baseKey = isPreviousYear ? entry.dataKey.replace("_昨年", "") : entry.dataKey;

                // 既に処理済みの場合はスキップ
                if (processedKeys.has(baseKey)) return;
                processedKeys.add(baseKey);

                const group = groupedEntries.get(baseKey);
                if (group?.current) {
                  // 今年のデータがある場合、昨年のデータも含めて処理
                  const processedEntry = { ...group.current };
                  if (group.previous && typeof group.previous.value === "number") {
                    (processedEntry as typeof processedEntry & { previousValue: number }).previousValue =
                      group.previous.value;
                    (processedEntry as typeof processedEntry & { baseKey: string }).baseKey = baseKey;
                  }
                  processedEntries.push(processedEntry);
                } else if (group?.previous && !group.current) {
                  // 昨年のデータのみがある場合（今年のデータがない場合）
                  // 今年のデータを0として作成し、昨年のデータをpreviousValueとして設定
                  const processedEntry = {
                    ...group.previous,
                    value: 0,
                    dataKey: baseKey,
                    name: group.previous.name,
                  };
                  (processedEntry as typeof processedEntry & { previousValue: number }).previousValue =
                    typeof group.previous.value === "number" ? group.previous.value : 0;
                  (processedEntry as typeof processedEntry & { baseKey: string }).baseKey = baseKey;
                  processedEntries.push(processedEntry);
                } else if (!isPreviousYear) {
                  // 今年のデータのみの場合
                  processedEntries.push(entry);
                }
              } else {
                // 新規案件数や完了案件数以外のデータはそのまま処理
                processedEntries.push(entry);
              }
            });

            // 案件の完了までの時間の内訳cardのtooltipに合計数と初回返信速度を追加
            let leadTimeCompositionSummary: {
              mainTotal: number;
              subTotal: number;
              firstReplyTime: number;
            } | null = null;

            if (isLeadTimeCompositionGraph && filteredPayload.length > 0) {
              const firstEntry = filteredPayload[0];
              if (firstEntry?.payload) {
                const payloadData = firstEntry.payload as LeadTimeCompositionData;
                const mainTotal =
                  (payloadData.main_idle || 0) + (payloadData.main_work || 0) + (payloadData.main_wait || 0);
                const subTotal = (payloadData.sub_work || 0) + (payloadData.sub_wait || 0);
                const firstReplyTime = payloadData.medianFirstReplyTime || 0;
                leadTimeCompositionSummary = { mainTotal, subTotal, firstReplyTime };
              }
            }

            return (
              <>
                {leadTimeCompositionSummary && (
                  <div
                    style={{
                      borderBottom: "1px solid rgba(0, 0, 0, 0.116)",
                      paddingBottom: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    {(assigneeFilterMode === "both" &&
                      (leadTimeCompositionSummary.mainTotal !== undefined ||
                        leadTimeCompositionSummary.subTotal !== undefined)) ||
                    (assigneeFilterMode === "main" && leadTimeCompositionSummary.mainTotal !== undefined) ||
                    (assigneeFilterMode === "sub" && leadTimeCompositionSummary.subTotal !== undefined) ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "var(--aegis-space-medium)",
                          marginBottom: "4px",
                        }}
                      >
                        {assigneeFilterMode === "both" ? (
                          <>
                            <Text variant="body.small.bold" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                              {t("total")}
                            </Text>
                            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0 }}>
                              <Text variant="body.small" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                                {t("mainRole")}:
                              </Text>
                              <Text variant="body.small.bold" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                                {(leadTimeCompositionSummary.mainTotal ?? 0).toFixed(1)}
                              </Text>
                              <Text variant="body.small" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                                {" "}
                                {t("subRole")}:
                              </Text>
                              <Text variant="body.small.bold" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                                {(leadTimeCompositionSummary.subTotal ?? 0).toFixed(1)}
                              </Text>
                            </div>
                          </>
                        ) : assigneeFilterMode === "main" ? (
                          <>
                            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                              <Text variant="body.small.bold" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                                {t("total")}
                              </Text>
                              <Text variant="body.small" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                                ({t("mainRole")})
                              </Text>
                            </div>
                            <Text variant="body.small.bold" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                              {leadTimeCompositionSummary.mainTotal.toFixed(1)}
                            </Text>
                          </>
                        ) : (
                          <>
                            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                              <Text variant="body.small.bold" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                                {t("total")}
                              </Text>
                              <Text variant="body.small" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                                ({t("subRole")})
                              </Text>
                            </div>
                            <Text variant="body.small.bold" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                              {leadTimeCompositionSummary.subTotal?.toFixed(1)}
                            </Text>
                          </>
                        )}
                      </div>
                    ) : null}
                    {leadTimeCompositionSummary.firstReplyTime > 0 && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "var(--aegis-space-medium)",
                        }}
                      >
                        <Text variant="body.small" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                          {t("firstResponseMedianShort")}
                        </Text>
                        <Text variant="body.small.bold" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                          {leadTimeCompositionSummary.firstReplyTime.toFixed(1)} {t("days")}
                        </Text>
                      </div>
                    )}
                  </div>
                )}
                {(() => {
                  const filteredEntries = processedEntries.filter((entry) => {
                    // 案件の完了までの時間の内訳cardの場合、assigneeFilterModeに基づいてフィルタリング
                    if (isLeadTimeCompositionGraph && entry.dataKey) {
                      if (entry.dataKey.startsWith("main_")) {
                        // 主担当のデータは、mainまたはbothの時のみ表示
                        return assigneeFilterMode === "main" || assigneeFilterMode === "both";
                      }
                      if (entry.dataKey.startsWith("sub_")) {
                        // 副担当のデータは、subまたはbothの時のみ表示
                        return assigneeFilterMode === "sub" || assigneeFilterMode === "both";
                      }
                    }
                    // その他のデータは表示
                    return true;
                  });
                  return filteredEntries.map((entry) => {
                    // 主・副を1行にまとめる場合、副担当エントリはスキップ（主担当側で「名前 主:X 副:Y」として表示）
                    const isCaseTypeMainSub =
                      caseStatusView === "type" &&
                      assigneeFilterMode === "both" &&
                      entry.dataKey &&
                      (entry.dataKey.endsWith("_main") || entry.dataKey.endsWith("_sub"));
                    const isLeadTimeCompMainSub =
                      isLeadTimeCompositionGraph &&
                      assigneeFilterMode === "both" &&
                      entry.dataKey &&
                      (entry.dataKey.startsWith("main_") || entry.dataKey.startsWith("sub_"));
                    const isCompletionCountMainSub =
                      assigneeFilterMode === "both" &&
                      entry.dataKey &&
                      (entry.dataKey.includes("CompletionCount") || entry.dataKey?.includes("_完了案件数")) &&
                      (entry.dataKey.includes("_main") || entry.dataKey.includes("_sub"));
                    if (isCaseTypeMainSub && entry.dataKey?.endsWith("_sub")) return null;
                    if (isLeadTimeCompMainSub && entry.dataKey?.startsWith("sub_")) return null;
                    if (isCompletionCountMainSub && entry.dataKey?.includes("_sub")) return null;

                    // リードタイムグラフまたはmedianFirstReplyTimeの場合、payloadから実際の値を取得
                    // 案件タイプ別ビューの場合も、payloadから値を取得する
                    let displayValue: number | string | undefined = entry.value;

                    // 案件タイプ別ビューの場合、案件タイプ名_mainや案件タイプ名_subの値をpayloadから取得
                    const isCaseTypeView =
                      caseStatusView === "type" &&
                      entry.dataKey &&
                      CASE_TYPE_ORDER.some(
                        (caseType) => entry.dataKey === `${caseType}_main` || entry.dataKey === `${caseType}_sub`,
                      );

                    if (
                      (isLeadTimeGraph ||
                        isLeadTimeCompositionGraph ||
                        entry.dataKey === "medianFirstReplyTime" ||
                        isCaseTypeView) &&
                      entry.dataKey &&
                      entry.payload
                    ) {
                      // payloadから値を取得（entry.valueが空でも取得できるように）
                      const actualValue = entry.payload[entry.dataKey] as number | undefined;
                      if (actualValue !== undefined && typeof actualValue === "number") {
                        displayValue = actualValue;
                      } else if (displayValue !== undefined && displayValue !== null && displayValue !== "") {
                        // entry.valueが既に設定されている場合はそのまま使用
                        // 文字列の場合は数値に変換を試みる
                        if (typeof displayValue === "string") {
                          const numValue = Number(displayValue);
                          if (!Number.isNaN(numValue)) {
                            displayValue = numValue;
                          }
                        }
                      }
                    }

                    // 値が取得できない場合はスキップ（0は有効な値なので除外しない）
                    // ただし、リードタイムグラフまたはmedianFirstReplyTime、または案件タイプ別ビューの場合は、entry.valueが空でもpayloadから取得を試みる
                    if (displayValue === undefined || displayValue === null || displayValue === "") {
                      // リードタイムグラフまたはmedianFirstReplyTime、または案件タイプ別ビューの場合、もう一度payloadから取得を試みる
                      const isCaseTypeViewForFallback =
                        caseStatusView === "type" &&
                        entry.dataKey &&
                        CASE_TYPE_ORDER.some(
                          (caseType) => entry.dataKey === `${caseType}_main` || entry.dataKey === `${caseType}_sub`,
                        );

                      if (
                        (isLeadTimeGraph ||
                          isLeadTimeCompositionGraph ||
                          entry.dataKey === "medianFirstReplyTime" ||
                          isCaseTypeViewForFallback) &&
                        entry.dataKey &&
                        entry.payload
                      ) {
                        const fallbackValue = entry.payload[entry.dataKey] as number | undefined;
                        if (fallbackValue !== undefined && typeof fallbackValue === "number") {
                          displayValue = fallbackValue;
                        } else {
                          // 案件タイプ別ビューまたは案件完了までの内訳グラフの場合、値が0でも表示する
                          if (isCaseTypeViewForFallback || isLeadTimeCompositionGraph) {
                            displayValue = 0;
                          } else {
                            return null;
                          }
                        }
                      } else {
                        // 案件タイプ別ビューまたは案件完了までの内訳グラフの場合、値が0でも表示する
                        if (isCaseTypeView || isLeadTimeCompositionGraph) {
                          displayValue = 0;
                        } else {
                          return null;
                        }
                      }
                    }

                    // リードタイムまたは初回返信速度の場合、単位を追加
                    const isFirstReplyTime =
                      entry.dataKey === "medianFirstReplyTime" || entry.dataKey?.includes("初回返信速度");
                    const unit =
                      ((isLeadTimeGraph || isLeadTimeCompositionGraph) &&
                        (entry.dataKey?.includes("リードタイム") || isFirstReplyTime)) ||
                      isFirstReplyTime
                        ? "日"
                        : entry.unit || "";

                    // アイコンのスタイルを決定（リードタイムはひし形、初回返信速度は円形）
                    const isDiamond = entry.dataKey?.includes("リードタイム");
                    const iconColor = entry.stroke || entry.color || entry.fill;

                    const tooltipTextStyle = { color: "#2E2E2E", fontSize: "12px" } as const;
                    let displayContent: ReactNode = null;
                    let displayValueContent: ReactNode = null;

                    // 昨年のデータの場合、名前を翻訳
                    let displayName = entry.name;

                    // 進行中の案件状況のグラフの場合、dataKeyから適切な表示名を取得
                    if (
                      caseStatusView &&
                      entry.dataKey &&
                      (entry.dataKey.includes("_main") || entry.dataKey.includes("_sub"))
                    ) {
                      if (caseStatusView === "status" && tenantStatusSeriesForTeamBreakdown) {
                        // ステータス別の場合: tenantStatusSeriesForTeamBreakdownのnameを使用
                        const statusKey = entry.dataKey.replace(/_(main|sub)$/, "");
                        const statusItem = tenantStatusSeriesForTeamBreakdown.find((s) => s.key === statusKey);
                        if (statusItem) {
                          displayName = statusItem.name;
                        }
                      } else if (caseStatusView === "dueDate" && locale) {
                        // 納期別の場合: フィルターのラベルを使用
                        const dueDateKeyToFilterLabel: Record<string, string> = {
                          超過: t("dueDateFilterOverdue"),
                          今日: t("dueDateFilterToday"),
                          "2日以内": t("dueDateLegend3Days"),
                          "3-6日以内": t("dueDateLegend1Week"),
                          "7日以降": t("dueDateFilter8DaysPlus"),
                          未入力: t("dueDateFilterNoDueDate"),
                        };
                        const dueDateKey = entry.dataKey.replace(/_(main|sub)$/, "");
                        displayName = dueDateKeyToFilterLabel[dueDateKey] || entry.name;
                      } else if (caseStatusView === "type" && locale) {
                        // 案件タイプ別の場合: CASE_TYPE_MAPPINGのラベルを使用
                        const caseTypeKey = entry.dataKey.replace(/_(main|sub)$/, "");
                        if (caseTypeKey) {
                          const caseTypeName = (CASE_TYPE_MAPPING[locale]?.[caseTypeKey] as string) || caseTypeKey;
                          if (assigneeFilterMode === "both" && entry.dataKey?.endsWith("_main")) {
                            // 主・副を1行で「契約書審査 主:3 副:4」形式に
                            const mainVal =
                              (typeof entry.payload?.[entry.dataKey] === "number"
                                ? entry.payload[entry.dataKey]
                                : Number(entry.value)) || 0;
                            const subEntry = filteredEntries.find((e) => e.dataKey === `${caseTypeKey}_sub`);
                            const subVal =
                              (subEntry?.dataKey &&
                                (typeof subEntry.payload?.[subEntry.dataKey] === "number"
                                  ? subEntry.payload[subEntry.dataKey]
                                  : Number(subEntry.value))) ||
                              0;
                            displayName = `${caseTypeName} ${t("mainRole")}:${Math.round(Number(mainVal))} ${t("subRole")}:${Math.round(Number(subVal))}`;
                            displayContent = caseTypeName;
                            displayValueContent = (
                              <>
                                <Text variant="body.small" style={tooltipTextStyle}>
                                  {t("mainRole")}:
                                </Text>
                                <Text variant="body.small.bold" style={tooltipTextStyle}>
                                  {Math.round(Number(mainVal))}
                                </Text>
                                <Text variant="body.small" style={tooltipTextStyle}>
                                  {" "}
                                  {t("subRole")}:
                                </Text>
                                <Text variant="body.small.bold" style={tooltipTextStyle}>
                                  {Math.round(Number(subVal))}
                                </Text>
                              </>
                            );
                          } else if (assigneeFilterMode !== "both") {
                            displayName = caseTypeName;
                          } else {
                            displayName = caseTypeName;
                          }
                        }
                      }
                    } else if (
                      (isLeadTimeGraph || isLeadTimeCompositionGraph || entry.dataKey === "medianFirstReplyTime") &&
                      entry.dataKey
                    ) {
                      if (entry.dataKey === "medianFirstReplyTime") {
                        displayName = t("firstResponseMedianShort");
                      } else if (
                        isLeadTimeCompositionGraph &&
                        (entry.dataKey.startsWith("main_") || entry.dataKey.startsWith("sub_"))
                      ) {
                        // 案件完了までの内訳グラフの場合、STATUS_ORDERからステータス名を取得
                        const statusKey = entry.dataKey.replace(/^(main_|sub_)/, "");
                        const statusItem = STATUS_ORDER.find((s) => s.key === statusKey);
                        if (statusItem) {
                          if (assigneeFilterMode === "both" && entry.dataKey.startsWith("main_")) {
                            const mainVal =
                              (typeof entry.payload?.[entry.dataKey] === "number"
                                ? entry.payload[entry.dataKey]
                                : Number(entry.value)) || 0;
                            const subEntry = filteredEntries.find((e) => e.dataKey === `sub_${statusKey}`);
                            const subVal =
                              (subEntry?.dataKey &&
                                (typeof subEntry.payload?.[subEntry.dataKey] === "number"
                                  ? subEntry.payload[subEntry.dataKey]
                                  : Number(subEntry.value))) ||
                              0;
                            displayName = `${statusItem.name} ${t("mainRole")}:${Number(mainVal).toFixed(1)} ${t("subRole")}:${Number(subVal).toFixed(1)}`;
                            displayContent = statusItem.name;
                            displayValueContent = (
                              <>
                                <Text variant="body.small" style={tooltipTextStyle}>
                                  {t("mainRole")}:
                                </Text>
                                <Text variant="body.small.bold" style={tooltipTextStyle}>
                                  {Number(mainVal).toFixed(1)}
                                </Text>
                                <Text variant="body.small" style={tooltipTextStyle}>
                                  {" "}
                                  {t("subRole")}:
                                </Text>
                                <Text variant="body.small.bold" style={tooltipTextStyle}>
                                  {Number(subVal).toFixed(1)}
                                </Text>
                              </>
                            );
                          } else if (assigneeFilterMode !== "both") {
                            displayName = statusItem.name;
                          } else {
                            displayName = statusItem.name;
                          }
                        }
                      } else if (entry.dataKey.includes("_昨年")) {
                        // 昨年のデータの場合、翻訳キーを使用
                        if (entry.dataKey.includes("リードタイム")) {
                          displayName = `${t("leadTimeMedianShort")} (${t("previousYearLabel")})`;
                        } else if (entry.dataKey.includes("初回返信速度")) {
                          displayName = `${t("firstResponseMedianShort")} (${t("previousYearLabel")})`;
                        }
                      } else {
                        // 今年のデータの場合、既に翻訳されているはずだが、念のため確認
                        // entry.nameが日本語のままの場合も翻訳
                        if (entry.dataKey.includes("リードタイム")) {
                          if (!displayName || displayName.includes("リードタイム中央値")) {
                            displayName = hasPreviousYearData
                              ? `${t("leadTimeMedianShort")} (${t("currentYear")})`
                              : t("leadTimeMedianShort");
                          } else if (hasPreviousYearData && !displayName.includes(t("currentYear"))) {
                            displayName = `${displayName} (${t("currentYear")})`;
                          }
                        } else if (entry.dataKey.includes("初回返信速度")) {
                          if (!displayName || displayName.includes("初回返信速度中央値")) {
                            displayName = hasPreviousYearData
                              ? `${t("firstResponseMedianShort")} (${t("currentYear")})`
                              : t("firstResponseMedianShort");
                          } else if (hasPreviousYearData && !displayName.includes(t("currentYear"))) {
                            displayName = `${displayName} (${t("currentYear")})`;
                          }
                        }
                      }
                    } else if (entry.dataKey?.includes("CompletionCount")) {
                      // 完了案件数の場合は翻訳キーをそのまま使用
                      const completionBaseKey = entry.dataKey?.replace(/_(main|sub)$/, "") ?? "";
                      const getCompletionLabel = (key: string) => {
                        if (key.includes("onTimeCompletionCount")) return t("onTimeCompletion");
                        if (key.includes("overdueCompletionCount")) return t("overdueCompletion");
                        if (key.includes("noDueDateCompletionCount")) return t("noDueDateCompletion");
                        return entry.name ?? "";
                      };
                      if (assigneeFilterMode === "both" && entry.dataKey?.endsWith("_main")) {
                        const mainVal =
                          (typeof entry.payload?.[entry.dataKey] === "number"
                            ? entry.payload[entry.dataKey]
                            : Number(entry.value)) || 0;
                        const subEntry = filteredEntries.find((e) => e.dataKey === `${completionBaseKey}_sub`);
                        const subVal =
                          (subEntry?.dataKey &&
                            (typeof subEntry.payload?.[subEntry.dataKey] === "number"
                              ? subEntry.payload[subEntry.dataKey]
                              : Number(subEntry.value))) ||
                          0;
                        displayName = `${getCompletionLabel(completionBaseKey)} ${t("mainRole")}:${Math.round(Number(mainVal))} ${t("subRole")}:${Math.round(Number(subVal))}`;
                        displayContent = getCompletionLabel(completionBaseKey);
                        displayValueContent = (
                          <>
                            <Text variant="body.small" style={tooltipTextStyle}>
                              {t("mainRole")}:
                            </Text>
                            <Text variant="body.small.bold" style={tooltipTextStyle}>
                              {Math.round(Number(mainVal))}
                            </Text>
                            <Text variant="body.small" style={tooltipTextStyle}>
                              {" "}
                              {t("subRole")}:
                            </Text>
                            <Text variant="body.small.bold" style={tooltipTextStyle}>
                              {Math.round(Number(subVal))}
                            </Text>
                          </>
                        );
                      } else {
                        // 主のみ・副のみのときは単一ラベル
                        if (entry.dataKey?.includes("onTimeCompletionCount")) {
                          displayName = entry.dataKey.includes("_main")
                            ? t("onTimeCompletionMain")
                            : t("onTimeCompletionSub");
                        } else if (entry.dataKey?.includes("overdueCompletionCount")) {
                          displayName = entry.dataKey.includes("_main")
                            ? t("overdueCompletionMain")
                            : t("overdueCompletionSub");
                        } else if (entry.dataKey?.includes("noDueDateCompletionCount")) {
                          displayName = entry.dataKey.includes("_main")
                            ? t("noDueDateCompletionMain")
                            : t("noDueDateCompletionSub");
                        } else {
                          displayName = getCompletionLabel(completionBaseKey);
                        }
                      }
                    }

                    // 今年・去年を1行で「名前 今年:X 去年:Y」形式に
                    if (
                      "previousValue" in entry &&
                      typeof entry.previousValue === "number" &&
                      !entry.dataKey?.includes("_昨年") &&
                      (entry.dataKey?.includes("_新規案件数") ||
                        entry.dataKey?.includes("_完了案件数") ||
                        entry.dataKey?.includes("CompletionCount"))
                    ) {
                      const currentVal = typeof displayValue === "number" ? displayValue : 0;
                      const prevVal = entry.previousValue;
                      const isCaseCount =
                        entry.dataKey?.includes("CompletionCount") ||
                        entry.dataKey?.includes("新規案件数") ||
                        entry.dataKey?.includes("完了案件数") ||
                        entry.dataKey?.includes("案件数");
                      const baseLabel = entry.dataKey?.includes("_新規案件数")
                        ? t("newCaseCount")
                        : t("completedCaseCount");
                      const currentStr = isCaseCount
                        ? Math.round(Number(currentVal)).toString()
                        : Number(currentVal).toFixed(1);
                      const previousStr = isCaseCount ? Math.round(prevVal).toString() : prevVal.toFixed(1);
                      displayName = `${baseLabel} ${t("currentYear")}:${currentStr} ${t("lastYear")}:${previousStr}`;
                      displayContent = baseLabel;
                      displayValueContent = (
                        <>
                          <Text variant="body.small" style={tooltipTextStyle}>
                            {t("currentYear")}:
                          </Text>
                          <Text variant="body.small" style={tooltipTextStyle}>
                            {currentStr}
                          </Text>
                          <Text variant="body.small" style={tooltipTextStyle}>
                            {" "}
                            {t("lastYear")}:
                          </Text>
                          <Text variant="body.small" style={tooltipTextStyle}>
                            {previousStr}
                          </Text>
                        </>
                      );
                    }

                    if (displayContent == null) displayContent = displayName;

                    return (
                      <div
                        key={entry.dataKey || entry.name}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "var(--aegis-space-medium)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          {iconColor && (
                            <div
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: isDiamond ? "0" : "2px",
                                backgroundColor: iconColor,
                                transform: isDiamond ? "rotate(45deg)" : "none",
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <Text variant="body.small" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                            {displayContent}
                          </Text>
                        </div>
                        <Text variant="body.small.bold" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                          {displayValueContent != null
                            ? displayValueContent
                            : (() => {
                                // 今年・去年・主・副は displayValueContent で右側に表示するため、ここには来ない
                                // 通常の表示
                                return typeof displayValue === "number"
                                  ? entry.dataKey?.includes("CompletionCount") ||
                                    entry.dataKey?.includes("新規案件数") ||
                                    entry.dataKey?.includes("完了案件数") ||
                                    entry.dataKey?.includes("案件数") ||
                                    CASE_TYPE_ORDER.some((caseType) => entry.dataKey === caseType) || // 案件タイプ名のみの場合も案件数として判定
                                    CASE_TYPE_ORDER.some((caseType) => entry.dataKey === `${caseType}_main`) || // 案件タイプ名_mainの場合も案件数として判定
                                    CASE_TYPE_ORDER.some((caseType) => entry.dataKey === `${caseType}_sub`) // 案件タイプ名_subの場合も案件数として判定
                                    ? Math.round(displayValue).toString()
                                    : displayValue.toFixed(1)
                                  : displayValue;
                              })()}
                          {displayValueContent == null ? unit : ""}
                        </Text>
                      </div>
                    );
                  });
                })()}
                {/* 新規案件数の合計を表示 */}
                {hasNewCaseCountData && newCaseCountTotal > 0 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "var(--aegis-space-medium)",
                      marginTop: "8px",
                      paddingTop: "8px",
                      borderTop: "1px solid rgba(0, 0, 0, 0.116)",
                    }}
                  >
                    <Text variant="body.small.bold" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                      {t("totalCount")}
                    </Text>
                    {hasPreviousYearData && newCaseCountPreviousYearTotal > 0 ? (
                      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0 }}>
                        <Text variant="body.small" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                          {t("currentYear")}:
                        </Text>
                        <Text variant="body.small" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                          {Math.round(newCaseCountTotal).toString()}
                        </Text>
                        <Text variant="body.small" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                          {" "}
                          {t("lastYear")}:
                        </Text>
                        <Text variant="body.small" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                          {Math.round(newCaseCountPreviousYearTotal).toString()}
                        </Text>
                      </div>
                    ) : (
                      <Text variant="body.small.bold" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                        {Math.round(newCaseCountTotal).toString()}
                      </Text>
                    )}
                  </div>
                )}
                {/* 完了案件数の合計を表示 */}
                {(hasCompletedCaseCountData || completedCaseCountPreviousYearTotal > 0) &&
                  (completedCaseCountTotal > 0 || completedCaseCountPreviousYearTotal > 0) && (
                    <>
                      {/* 合計数のみの行は assigneeFilterMode === "both" のときは非表示（合計数 主:x 副:x の行のみ表示） */}
                      {assigneeFilterMode !== "both" && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "var(--aegis-space-medium)",
                            marginTop: hasNewCaseCountData && newCaseCountTotal > 0 ? "4px" : "8px",
                            paddingTop: hasNewCaseCountData && newCaseCountTotal > 0 ? "0px" : "8px",
                            borderTop:
                              hasNewCaseCountData && newCaseCountTotal > 0 ? "none" : "1px solid rgba(0, 0, 0, 0.116)",
                          }}
                        >
                          <Text variant="body.small.bold" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                            {t("totalCount")}
                          </Text>
                          {hasPreviousYearData && completedCaseCountPreviousYearTotal > 0 ? (
                            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0 }}>
                              <Text variant="body.small" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                                {t("currentYear")}:
                              </Text>
                              <Text variant="body.small" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                                {Math.round(completedCaseCountTotal).toString()}
                              </Text>
                              <Text variant="body.small" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                                {" "}
                                {t("lastYear")}:
                              </Text>
                              <Text variant="body.small" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                                {Math.round(completedCaseCountPreviousYearTotal).toString()}
                              </Text>
                            </div>
                          ) : (
                            <Text variant="body.small.bold" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                              {Math.round(completedCaseCountTotal).toString()}
                            </Text>
                          )}
                        </div>
                      )}
                      {/* 主担当と副担当の合計を表示（assigneeFilterMode === "both"の時のみ） */}
                      {assigneeFilterMode === "both" &&
                        filteredPayload.length > 0 &&
                        (() => {
                          const firstEntry = filteredPayload[0];
                          if (!firstEntry?.payload) return null;

                          // 主担当の合計を計算
                          const mainTotal = filteredPayload.reduce((sum, entry) => {
                            if (
                              entry.dataKey?.includes("_main") &&
                              (entry.dataKey?.includes("CompletionCount") ||
                                entry.dataKey?.includes("_完了案件数") ||
                                CASE_TYPE_ORDER.some((caseType) => entry.dataKey === `${caseType}_main`)) &&
                              !entry.dataKey?.includes("_昨年") &&
                              typeof entry.value === "number"
                            ) {
                              return sum + entry.value;
                            }
                            return sum;
                          }, 0);

                          // 副担当の合計を計算
                          const subTotal = filteredPayload.reduce((sum, entry) => {
                            if (
                              entry.dataKey?.includes("_sub") &&
                              (entry.dataKey?.includes("CompletionCount") ||
                                entry.dataKey?.includes("_完了案件数") ||
                                CASE_TYPE_ORDER.some((caseType) => entry.dataKey === `${caseType}_sub`)) &&
                              !entry.dataKey?.includes("_昨年") &&
                              typeof entry.value === "number"
                            ) {
                              return sum + entry.value;
                            }
                            return sum;
                          }, 0);

                          if (mainTotal === 0 && subTotal === 0) return null;

                          const totalTextStyle = { color: "#2E2E2E", fontSize: "12px" } as const;
                          // 合計数のみの行は非表示のため、この行が完了案件数合計の先頭。余白・ボーダーを「合計数」のみの行と同じに
                          return (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "var(--aegis-space-medium)",
                                marginTop: hasNewCaseCountData && newCaseCountTotal > 0 ? "4px" : "8px",
                                paddingTop: hasNewCaseCountData && newCaseCountTotal > 0 ? "0px" : "8px",
                                borderTop:
                                  hasNewCaseCountData && newCaseCountTotal > 0
                                    ? "none"
                                    : "1px solid rgba(0, 0, 0, 0.116)",
                              }}
                            >
                              <Text variant="body.small.bold" style={totalTextStyle}>
                                {t("totalCount")}
                              </Text>
                              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0 }}>
                                <Text variant="body.small" style={totalTextStyle}>
                                  {t("mainRole")}:
                                </Text>
                                <Text variant="body.small.bold" style={totalTextStyle}>
                                  {Math.round(mainTotal)}
                                </Text>
                                <Text variant="body.small" style={totalTextStyle}>
                                  {" "}
                                  {t("subRole")}:
                                </Text>
                                <Text variant="body.small.bold" style={totalTextStyle}>
                                  {Math.round(subTotal)}
                                </Text>
                              </div>
                            </div>
                          );
                        })()}
                    </>
                  )}
              </>
            );
          })()}
        </div>
      );
    } else {
      const entry = payload[0];
      if (!entry) return null;

      const caseNames = entry.payload?.caseNames?.[entry.dataKey || ""] || [];

      return (
        <div
          style={{
            backgroundColor: "#fff",
            // Aegis token: border/default (--aegis-color-border-default)
            border: "1px solid rgba(0, 0, 0, 0.116)",
            // Aegis token: round-medium
            borderRadius: "4px",
            padding: "12px",
            // Aegis token: shadow-middle
            boxShadow: "inset 0 0 0 1px var(--aegis-color-border-default), var(--aegis-depth-medium)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--aegis-space-xSmall)",
            minWidth: "200px",
            maxWidth: "300px",
            animation: "fadeIn 0.2s ease-in-out",
          }}
        >
          {/* Aegis token: foreground/default */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--aegis-space-medium)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "2px",
                  backgroundColor: entry.color || entry.fill,
                  flexShrink: 0,
                }}
              />
              <Text variant="body.small" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                {entry.name}
              </Text>
            </div>
            <Text variant="body.small.bold" style={{ color: "#2E2E2E", fontSize: "12px" }}>
              {entry.value}
              {entry.unit || ""}
            </Text>
          </div>
          {caseNames.length > 0 && (
            <div
              style={{
                borderTop: "1px solid rgba(0, 0, 0, 0.116)",
                paddingTop: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-xxSmall)",
              }}
            >
              <Text variant="body.small" style={{ color: "#2E2E2E", fontSize: "12px", marginBottom: "4px" }}>
                案件
              </Text>
              <div
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-x3Small)",
                }}
              >
                {caseNames.map((caseName) => (
                  <Text key={caseName} variant="body.small" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                    ・{caseName}
                  </Text>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
  }
  return null;
};

export interface CustomYAxisTickProps {
  x?: number | string;
  y?: number | string;
  payload?: {
    value: string;
  };
  onPaneOpenChange: (open: boolean) => void;
  onSelectedMemberChange: (member: string | null) => void;
  onPaneTabIndexChange: (index: number) => void;
  membersWithOverdueCases: string[];
  activeCaseTypeFilter: string;
  onPaneCaseTypeFilterChange: (filter: string) => void;
  onPersonalCaseTypeFilterChange?: (filter: string) => void;
  activeDueDateFilter: DueDateFilter;
  onPaneDueDateFilterChange: (filter: DueDateFilter) => void;
  activeStatusFilter: string;
  onPaneStatusFilterChange: (filter: string) => void;
  assigneeFilterMode: AssigneeFilterMode;
  showOverdueAlert?: boolean;
  targetPaneTabIndex?: number;
  locale?: LocaleCode;
}

export const CustomYAxisTick = (props: CustomYAxisTickProps) => {
  const {
    x,
    y,
    payload,
    onPaneOpenChange,
    onSelectedMemberChange,
    onPaneTabIndexChange,
    membersWithOverdueCases,
    activeCaseTypeFilter,
    onPaneCaseTypeFilterChange,
    onPersonalCaseTypeFilterChange,
    activeDueDateFilter,
    onPaneDueDateFilterChange,
    activeStatusFilter,
    onPaneStatusFilterChange,
    assigneeFilterMode,
    showOverdueAlert = true,
    targetPaneTabIndex = 0, // デフォルトはパフォーマンスタブ（0）
    locale: propsLocale,
  } = props;
  const { t: tDefault } = useTranslation(reportTranslations);
  // props.localeが存在する場合、そのlocaleを使用して翻訳を行う関数を作成
  const t = propsLocale
    ? (key: keyof (typeof reportTranslations)["ja-JP"]) => reportTranslations[propsLocale]?.[key] || key
    : tDefault;
  const tickWidth = 160;
  const tickHeight = 40;
  const [isHovered, setIsHovered] = useState(false);
  const [isOverduePopoverOpen, setIsOverduePopoverOpen] = useState(false);
  const [isOverduePopoverPinned, setIsOverduePopoverPinned] = useState(false);

  if (x === undefined || y === undefined || !payload?.value) {
    return null;
  }
  const xPos = typeof x === "number" ? x : Number(x);
  const yPos = typeof y === "number" ? y : Number(y);

  const memberName = payload.value;
  const hasOverdue = membersWithOverdueCases.includes(memberName);
  const shouldShowAlert = showOverdueAlert && hasOverdue;

  // barSize = 32px, barGap = 4px
  const barSize = 32;
  const barGap = 4;
  // assigneeFilterMode === "both"の場合のみオフセットを適用
  const mainBarCenterOffset = assigneeFilterMode === "both" ? (barSize + barGap) / 2 : 0; // both: 18px, main: 0
  const subBarCenterOffset = assigneeFilterMode === "both" ? (barSize + barGap) / 2 : 0; // both: 18px, sub: 0

  // 参考実装の値を使用
  // 主・副ラベルが表示される時のみスペースを確保
  // ロケールに応じて幅を調整（英語の"Main"/"Sub"は日本語の「主」「副」より幅が広い）
  const slotWidth =
    assigneeFilterMode === "both" || assigneeFilterMode === "sub"
      ? propsLocale === "en-US"
        ? 40 // 英語の場合: "Main"/"Sub"用に広めに設定
        : 30 // 日本語の場合: 「主」「副」用
      : 0;
  const slotMargin = assigneeFilterMode === "both" || assigneeFilterMode === "sub" ? 6 : 0; // メンバー名とラベルの間の余白（12px → 6px）
  // 主・副ラベルが存在しない時のメンバー名とグラフとの間の余白
  const extraMarginWhenNoLabel = assigneeFilterMode === "main" ? 12 : 0; // 主担当のみ表示時は追加の余白を設ける

  // アイコンの幅を考慮（警告アイコン + 右矢印アイコン + 間の余白）
  // アイコンが切れないように、foreignObjectの開始位置を左に移動
  // 警告アイコン: 約16px (small size) + 右矢印アイコン: 約16px (small size) + 余白: 約8px = 約40px
  const iconAreaWidth = shouldShowAlert ? 48 : 28; // 警告アイコンがある場合: 約48px、ない場合: 約28px（余裕を持たせる）
  const foreignObjectX = -iconAreaWidth; // アイコンが切れないように左に移動
  const foreignObjectWidth = tickWidth - slotWidth - slotMargin - extraMarginWhenNoLabel + iconAreaWidth; // 幅を調整

  return (
    <>
      {/* メンバー名のラベル（カテゴリの中心に配置） */}
      <g transform={`translate(${xPos - tickWidth}, ${yPos - tickHeight / 2})`}>
        <foreignObject x={foreignObjectX} y={0} width={foreignObjectWidth} height={tickHeight}>
          <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "flex-end" }}>
            {shouldShowAlert ? (
              <Popover
                open={isOverduePopoverOpen}
                onOpenChange={(open) => {
                  setIsOverduePopoverOpen(open);
                  if (!open) {
                    setIsOverduePopoverPinned(false);
                  }
                }}
                arrow
                placement="top-start"
                closeOnBlur={true}
              >
                <Popover.Anchor>
                  <button
                    type="button"
                    onClickCapture={(e) => {
                      e.stopPropagation();
                      onPaneTabIndexChange(targetPaneTabIndex); // 指定されたタブインデックスを設定
                      onSelectedMemberChange(memberName); // その後メンバーを設定してPaneを開く
                      onPaneOpenChange(true);
                      onPaneCaseTypeFilterChange(activeCaseTypeFilter);
                      onPersonalCaseTypeFilterChange?.(activeCaseTypeFilter);
                      onPaneDueDateFilterChange(activeDueDateFilter);
                      onPaneStatusFilterChange(activeStatusFilter);
                      setIsOverduePopoverOpen(true);
                      setIsOverduePopoverPinned(true);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      margin: 0,
                      font: "inherit",
                      color: shouldShowAlert
                        ? "#AE352A" // foreground-danger
                        : isHovered
                          ? "var(--aegis-color-font-link)"
                          : "#2E2E2E", // foreground-default
                      cursor: "pointer",
                      width: "100%",
                      minWidth: 0,
                      textAlign: "right",
                      lineHeight: "1.2",
                      textDecoration: "underline",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: "var(--aegis-space-xxSmall)",
                      overflow: "hidden",
                    }}
                    onMouseEnter={() => {
                      if (!isOverduePopoverPinned) {
                        setIsOverduePopoverOpen(true);
                      }
                      setIsHovered(true);
                    }}
                    onMouseLeave={() => {
                      if (!isOverduePopoverPinned) {
                        setIsOverduePopoverOpen(false);
                      }
                      setIsHovered(false);
                    }}
                  >
                    <Text
                      variant="body.small"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: "var(--aegis-space-xxSmall)",
                        fontSize: "14px",
                        width: "100%",
                        minWidth: 0,
                        opacity: isHovered ? 0.7 : 1,
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xxSmall)" }}>
                        {shouldShowAlert && (
                          <Icon size="small" style={{ flexShrink: 0 }}>
                            <LfWarningTriangle />
                          </Icon>
                        )}
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          {memberName}
                        </span>
                      </span>
                      <Icon size="small" style={{ flexShrink: 0 }}>
                        <LfLayoutHorizonRight />
                      </Icon>
                    </Text>
                  </button>
                </Popover.Anchor>
                <Popover.Content width="small">
                  <Popover.Body>
                    <Text variant="body.small">{t("hasOverdueCasesAlert")}</Text>
                  </Popover.Body>
                </Popover.Content>
              </Popover>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onPaneTabIndexChange(targetPaneTabIndex); // 指定されたタブインデックスを設定
                  onSelectedMemberChange(memberName); // その後メンバーを設定してPaneを開く
                  onPaneOpenChange(true);
                  onPaneCaseTypeFilterChange(activeCaseTypeFilter);
                  onPersonalCaseTypeFilterChange?.(activeCaseTypeFilter);
                  onPaneDueDateFilterChange(activeDueDateFilter);
                  onPaneStatusFilterChange(activeStatusFilter);
                }}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  font: "inherit",
                  color: shouldShowAlert
                    ? "#AE352A" // foreground-danger
                    : isHovered
                      ? "var(--aegis-color-font-link)"
                      : "#2E2E2E", // foreground-default
                  cursor: "pointer",
                  width: "100%",
                  minWidth: 0,
                  textAlign: "right",
                  lineHeight: "1.2",
                  textDecoration: "underline",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "var(--aegis-space-xxSmall)",
                  overflow: "hidden",
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Text
                  variant="body.small"
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: "var(--aegis-space-xxSmall)",
                    fontSize: "14px",
                    width: "100%",
                    minWidth: 0,
                    opacity: isHovered ? 0.7 : 1,
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xxSmall)" }}>
                    {shouldShowAlert && (
                      <Icon size="small" style={{ flexShrink: 0 }}>
                        <LfWarningTriangle />
                      </Icon>
                    )}
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      {memberName}
                    </span>
                  </span>
                  <Icon size="small" style={{ flexShrink: 0 }}>
                    <LfLayoutHorizonRight />
                  </Icon>
                </Text>
              </button>
            )}
          </div>
        </foreignObject>
      </g>
      {/* 主担当のラベル（主担当のbarの中心に配置） */}
      {assigneeFilterMode === "both" && (
        <g transform={`translate(${xPos - slotWidth - 4}, ${yPos - mainBarCenterOffset})`}>
          <foreignObject x={0} y={-10} width={slotWidth} height={20}>
            <div
              style={{
                display: "flex",
                height: "100%",
                alignItems: "center",
                justifyContent: "flex-end",
                fontSize: "12px",
                color: "var(--aegis-color-font-subtle)",
                textAlign: "right",
                flexShrink: 0,
                minWidth: `${slotWidth}px`,
                width: "fit-content",
              }}
            >
              {t("mainRole")}
            </div>
          </foreignObject>
        </g>
      )}
      {/* 副担当のラベル（副担当のbarの中心に配置） */}
      {(assigneeFilterMode === "sub" || assigneeFilterMode === "both") && (
        <g transform={`translate(${xPos - slotWidth - 4}, ${yPos + subBarCenterOffset})`}>
          <foreignObject x={0} y={-10} width={slotWidth} height={20}>
            <div
              style={{
                display: "flex",
                height: "100%",
                alignItems: "center",
                justifyContent: "flex-end",
                fontSize: "12px",
                color: "var(--aegis-color-font-subtle)",
                textAlign: "right",
                flexShrink: 0,
                minWidth: `${slotWidth}px`,
                width: "fit-content",
              }}
            >
              {t("subRole")}
            </div>
          </foreignObject>
        </g>
      )}
    </>
  );
};

export interface CustomXAxisTickProps {
  [key: string]: unknown;
  x?: number | string;
  y?: number | string;
  payload?: {
    value: string;
    payload?: Record<string, unknown>; // 元のデータ行全体
  };
  showPreviousYearComparison: boolean;
  locale?: LocaleCode;
  onPaneOpenChange?: (open: boolean) => void;
  onPaneTabIndexChange?: (index: number) => void;
  caseTypeFilter?: string; // 案件タイプフィルター（オプション）
  filterByCompletionDate?: boolean; // 完了日時でフィルタリングするかどうか（デフォルト: false）
  isBarChart?: boolean; // 棒グラフかどうか（デフォルト: false）
}

export const CustomXAxisTick = (props: CustomXAxisTickProps) => {
  const {
    x,
    y,
    payload,
    showPreviousYearComparison,
    locale: propsLocale,
    caseTypeFilter,
    filterByCompletionDate = false,
    isBarChart = false,
  } = props;
  const { t: tDefault } = useTranslation(reportTranslations);
  // props.localeが存在する場合、そのlocaleを使用して翻訳を行う関数を作成
  const t = propsLocale
    ? (key: keyof (typeof reportTranslations)["ja-JP"]) => reportTranslations[propsLocale]?.[key] || key
    : tDefault;
  const [isHovered, setIsHovered] = useState(false);
  const [isIconHovered, setIsIconHovered] = useState(false);

  if (x === undefined || y === undefined || !payload?.value) {
    return null;
  }
  const xPos = typeof x === "number" ? x : Number(x);
  const yPos = typeof y === "number" ? y : Number(y);

  const labelHeight = 20;
  const slotWidth = 40; // ラベルの幅
  // 横棒グラフの場合、各カテゴリ内で2つのbar（昨年と今年）が表示される
  // RechartsのデフォルトのbarCategoryGapは10%、barGapは4px
  // 実際のbar位置に合わせて、offsetを調整
  const offset = 32; // 月名の中心から左右へのオフセット（barの中心に合わせる）

  // 月名から日付範囲を計算する関数
  const parseMonthToDateRange = (
    monthValue: string,
    originalData?: Record<string, unknown>,
  ): { start: Date; end: Date } | null => {
    try {
      let year: number;
      let month: number;

      // _monthKeyが存在する場合はそれを使用（"YYYY-MM"形式）
      if (originalData?._monthKey && typeof originalData._monthKey === "string") {
        const parts = originalData._monthKey.split("-");
        if (parts.length === 2) {
          year = parseInt(parts[0], 10);
          month = parseInt(parts[1], 10);
          if (!Number.isNaN(year) && !Number.isNaN(month) && month >= 1 && month <= 12) {
            const start = new Date(year, month - 1, 1);
            const end = new Date(year, month, 0);
            return { start, end };
          }
        }
      }

      // 日本語形式: "2024年8月"
      if (monthValue.includes("年") && monthValue.includes("月")) {
        const yearMatch = monthValue.match(/(\d{4})年/);
        const monthMatch = monthValue.match(/(\d{1,2})月/);
        if (yearMatch && monthMatch) {
          year = parseInt(yearMatch[1], 10);
          month = parseInt(monthMatch[1], 10);
        } else {
          return null;
        }
      } else if (monthValue.includes("/")) {
        // フォールバック: "2024/8" 形式
        const parts = monthValue.split("/");
        if (parts.length === 2) {
          year = parseInt(parts[0], 10);
          month = parseInt(parts[1], 10);
        } else {
          return null;
        }
      } else if (monthValue.includes("月") && !monthValue.includes("年")) {
        // 日本語形式（年なし）: "8月"
        const monthMatch = monthValue.match(/(\d{1,2})月/);
        if (monthMatch) {
          month = parseInt(monthMatch[1], 10);
          // 現在の年を使用（またはperformanceDateRangeから取得できる場合はそれを使用）
          const today = new Date();
          year = today.getFullYear();
        } else {
          return null;
        }
      } else {
        // 英語形式: "Aug 2024" または "Aug"
        // 現在の年を取得して使用
        const today = new Date();
        year = today.getFullYear();

        // 月名を数値に変換
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthIndex = monthNames.findIndex((name) => monthValue.toLowerCase().startsWith(name.toLowerCase()));
        if (monthIndex === -1) {
          return null;
        }
        month = monthIndex + 1;

        // "Aug 2024" 形式の場合、年を抽出
        const yearMatch = monthValue.match(/\d{4}/);
        if (yearMatch) {
          year = parseInt(yearMatch[0], 10);
        }
      }

      if (Number.isNaN(year) || Number.isNaN(month) || month < 1 || month > 12) {
        return null;
      }

      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0); // その月の最後の日

      return { start, end };
    } catch {
      return null;
    }
  };

  // 案件一覧URLを生成する関数
  const buildCaseListUrl = (dateRange: { start: Date; end: Date }): string => {
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const params = new URLSearchParams({
      "case-search-condition-definition-type": "all",
      "case-search-condition-definition-id": "01990991-f52d-706d-bb48-3613f7b43da0",
      page: "1",
      "logical-operators[]": '{"fields":["main-assignee-ids","sub-assignee-ids"],"logical-operator":"and"}',
      "search-sort-condition": "last-message-time-desc",
    });

    // 完了日時でフィルタリングする場合
    if (filterByCompletionDate) {
      params.set("case-completion-time-from", formatDate(dateRange.start));
      params.set("case-completion-time-to", formatDate(dateRange.end));
      // 完了案件のみを表示するため、ステータスフィルターを追加（完了ステータスのIDが必要な場合は後で調整）
      // 注: 完了日時でフィルタリングする場合、ステータスが「完了」の案件のみを表示する想定
    } else {
      // 案件作成日時でフィルタリング（既存の動作）
      params.set("due-date-relative", "next,1,weeks");
      params.set("case-create-time-from", formatDate(dateRange.start));
      params.set("case-create-time-to", formatDate(dateRange.end));
      params.set("case-create-time-relative", "past,3,months");
      params.set("last-message-time-relative", "past,1,weeks");
    }

    // 案件タイプフィルターが「すべて」以外の場合、案件タイプのパラメータを追加
    if (
      caseTypeFilter &&
      caseTypeFilter !== "すべて" &&
      CASE_TYPE_ORDER.includes(caseTypeFilter as (typeof CASE_TYPE_ORDER)[number])
    ) {
      // 案件タイプのパラメータ名は実装時に確認が必要（仮でcase-type-idsを使用）
      params.append("case-type-ids[]", caseTypeFilter);
    }

    return `https://app.legalon-cloud.com/case?${params.toString()}`;
  };

  // 別タブで案件一覧を開くURLを生成
  const getCaseListUrl = (): string | null => {
    // payloadから元のデータを取得
    const originalData = payload?.payload as Record<string, unknown> | undefined;
    const dateRange = parseMonthToDateRange(payload.value, originalData);
    if (!dateRange) {
      return null;
    }
    return buildCaseListUrl(dateRange);
  };

  const caseListUrl = getCaseListUrl();

  // 別タブで案件一覧を開くハンドラー
  const handleOpenCaseList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (caseListUrl) {
      window.open(caseListUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      {/* 月名のラベル */}
      <g transform={`translate(${xPos},${yPos})`}>
        {caseListUrl ? (
          <foreignObject x={-50} y={0} width={120} height={labelHeight}>
            <div
              style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", gap: "4px" }}
            >
              <button
                type="button"
                onClick={handleOpenCaseList}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  font: "inherit",
                  color: isHovered ? "var(--aegis-color-font-link)" : "var(--aegis-color-font-default)",
                  cursor: "pointer",
                  textAlign: "center",
                  lineHeight: "1.2",
                  textDecoration: "underline",
                  fontSize: "14px",
                }}
              >
                {payload.value}
              </button>
              <button
                type="button"
                onClick={handleOpenCaseList}
                onMouseEnter={() => setIsIconHovered(true)}
                onMouseLeave={() => setIsIconHovered(false)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isIconHovered ? "var(--aegis-color-font-link)" : "var(--aegis-color-font-subtle)",
                }}
                aria-label={t("openInNewTab")}
                title={t("openInNewTab")}
              >
                <Icon size="small">
                  <LfArrowUpRightFromSquare />
                </Icon>
              </button>
            </div>
          </foreignObject>
        ) : (
          <text x={0} y={0} dy={16} textAnchor="middle" fill="#000" fontSize={14}>
            {payload.value}
          </text>
        )}
      </g>
      {/* 昨年対比を表示している場合のみ、昨年・今年のラベルを表示（棒グラフの場合のみ） */}
      {showPreviousYearComparison && isBarChart && (
        <>
          {/* 昨年のラベル（左側） */}
          <g transform={`translate(${xPos - offset},${yPos - 2})`}>
            <foreignObject x={-slotWidth / 2} y={-labelHeight / 2} width={slotWidth} height={labelHeight}>
              <div
                style={{
                  display: "flex",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  color: "var(--aegis-color-font-subtle)",
                  textAlign: "center",
                }}
              >
                {t("previousYearLabel")}
              </div>
            </foreignObject>
          </g>
          {/* 今年のラベル（右側） */}
          <g transform={`translate(${xPos + offset},${yPos - 2})`}>
            <foreignObject x={-slotWidth / 2} y={-labelHeight / 2} width={slotWidth} height={labelHeight}>
              <div
                style={{
                  display: "flex",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  color: "var(--aegis-color-font-subtle)",
                  textAlign: "center",
                }}
              >
                {t("currentYear")}
              </div>
            </foreignObject>
          </g>
        </>
      )}
    </>
  );
};

export const StatusSettingsDialog = (props: {
  open: boolean;
  onClose: () => void;
  categories: LeadTimeCategories;
  onSave: (categories: LeadTimeCategories) => void;
}) => {
  const { open, onClose, categories, onSave } = props;
  const [tempCategories, setTempCategories] = useState<{
    MAIN: {
      IDLE: string[];
      WORK: string[];
      WAIT: string[];
      IGNORE: string[];
    };
    SUB: {
      WORK: string[];
      WAIT: string[];
      IGNORE: string[];
    };
  }>({
    MAIN: {
      IDLE: [...categories.MAIN.IDLE],
      WORK: [...categories.MAIN.WORK],
      WAIT: [...categories.MAIN.WAIT],
      IGNORE: [...(categories.MAIN.IGNORE || [])],
    },
    SUB: {
      WORK: [...categories.SUB.WORK],
      WAIT: [...categories.SUB.WAIT],
      IGNORE: [...(categories.SUB.IGNORE || [])],
    },
  });

  useEffect(() => {
    if (open) {
      setTempCategories({
        MAIN: {
          IDLE: [...categories.MAIN.IDLE],
          WORK: [...categories.MAIN.WORK],
          WAIT: [...categories.MAIN.WAIT],
          IGNORE: [...(categories.MAIN.IGNORE || [])],
        },
        SUB: {
          WORK: [...categories.SUB.WORK],
          WAIT: [...categories.SUB.WAIT],
          IGNORE: [...(categories.SUB.IGNORE || [])],
        },
      });
    }
  }, [open, categories]);

  const handleMainChange = (status: string, category: "IDLE" | "WORK" | "WAIT" | "IGNORE") => {
    setTempCategories((prev) => {
      const next = {
        ...prev,
        MAIN: {
          ...prev.MAIN,
          IDLE: prev.MAIN.IDLE.filter((s) => s !== status),
          WORK: prev.MAIN.WORK.filter((s) => s !== status),
          WAIT: prev.MAIN.WAIT.filter((s) => s !== status),
          IGNORE: prev.MAIN.IGNORE.filter((s) => s !== status),
        },
      };
      next.MAIN[category] = [...next.MAIN[category], status];
      return next;
    });
  };

  const handleSubChange = (status: string, category: "WORK" | "WAIT" | "IGNORE") => {
    setTempCategories((prev) => {
      const next = {
        ...prev,
        SUB: {
          ...prev.SUB,
          WORK: prev.SUB.WORK.filter((s) => s !== status),
          WAIT: prev.SUB.WAIT.filter((s) => s !== status),
          IGNORE: prev.SUB.IGNORE.filter((s) => s !== status),
        },
      };
      next.SUB[category] = [...next.SUB[category], status];
      return next;
    });
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent width="large">
        <DialogHeader>
          <ContentHeader>
            <ContentHeader.Title>ステータス分類設定</ContentHeader.Title>
          </ContentHeader>
        </DialogHeader>
        <DialogBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xlarge)" }}>
            <div>
              <Text variant="body.medium.bold" style={{ marginBottom: "var(--aegis-space-medium)", display: "block" }}>
                ■ 主担当としての作業分類
              </Text>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                {STATUS_ORDER.map((status) => {
                  const currentCategory: "IDLE" | "WORK" | "WAIT" | "IGNORE" = tempCategories.MAIN.IDLE.includes(
                    status.key,
                  )
                    ? "IDLE"
                    : tempCategories.MAIN.WORK.includes(status.key)
                      ? "WORK"
                      : tempCategories.MAIN.WAIT.includes(status.key)
                        ? "WAIT"
                        : "IGNORE";
                  return (
                    <FormControl orientation="horizontal" key={`main-${status.key}`}>
                      <FormControl.Label style={{ width: "160px" }}>{status.name}</FormControl.Label>
                      <Select
                        value={currentCategory}
                        onChange={(val) => handleMainChange(status.key, val as "IDLE" | "WORK" | "WAIT" | "IGNORE")}
                        options={[
                          { label: "未着手", value: "IDLE" },
                          { label: "作業中", value: "WORK" },
                          { label: "他者待ち", value: "WAIT" },
                          { label: "非表示", value: "IGNORE" },
                        ]}
                      />
                    </FormControl>
                  );
                })}
              </div>
            </div>

            <div>
              <Text variant="body.medium.bold" style={{ marginBottom: "var(--aegis-space-medium)", display: "block" }}>
                ■ 副担当としての作業分類
              </Text>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                {STATUS_ORDER.map((status) => {
                  const currentCategory: "WORK" | "WAIT" | "IGNORE" = tempCategories.SUB.WORK.includes(status.key)
                    ? "WORK"
                    : tempCategories.SUB.WAIT.includes(status.key)
                      ? "WAIT"
                      : "IGNORE";
                  return (
                    <FormControl orientation="horizontal" key={`sub-${status.key}`}>
                      <FormControl.Label style={{ width: "160px" }}>{status.name}</FormControl.Label>
                      <Select
                        value={currentCategory}
                        onChange={(val) => handleSubChange(status.key, val as "WORK" | "WAIT" | "IGNORE")}
                        options={[
                          { label: "作業中", value: "WORK" },
                          { label: "待機中", value: "WAIT" },
                          { label: "非表示", value: "IGNORE" },
                        ]}
                      />
                    </FormControl>
                  );
                })}
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <ButtonGroup>
            <Button variant="plain" onClick={onClose}>
              キャンセル
            </Button>
            <Button
              onClick={() =>
                onSave({
                  MAIN: {
                    IDLE: tempCategories.MAIN.IDLE as unknown as readonly ["未着手"],
                    WORK: tempCategories.MAIN.WORK as unknown as readonly ["確認中"],
                    WAIT: tempCategories.MAIN.WAIT as unknown as readonly ["2次確認中", "自部門外確認中"],
                    IGNORE: tempCategories.MAIN.IGNORE as readonly string[],
                  },
                  SUB: {
                    WORK: tempCategories.SUB.WORK as unknown as readonly ["2次確認中"],
                    WAIT: tempCategories.SUB.WAIT as unknown as readonly ["未着手", "確認中", "自部門外確認中"],
                    IGNORE: tempCategories.SUB.IGNORE as readonly string[],
                  },
                } as LeadTimeCategories)
              }
            >
              保存
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export interface CustomDurationTooltipProps {
  active?: boolean;
  payload?: {
    value: number;
    name: string;
    dataKey?: string;
    fill: string;
    payload: {
      name: string;
      details: Record<string, string[]>;
    };
  }[];
}

export const CustomDurationTooltip = (props: CustomDurationTooltipProps) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    const pld = payload[0];
    if (!pld || pld.value === 0 || !pld.payload) {
      return null;
    }

    const memberData = pld.payload;
    const memberName = memberData.name;
    const seriesKey = pld.dataKey ?? pld.name ?? "";
    const details = memberData.details?.[seriesKey] ?? [];

    if (details.length === 0) {
      return null;
    }

    return (
      <div
        style={{
          backgroundColor: "var(--aegis-color-background-default)",
          // Aegis token: border/default (--aegis-color-border-default)
          border: "1px solid rgba(0, 0, 0, 0.116)",
          // Aegis token: round-medium
          borderRadius: "4px",
          // Aegis token: shadow-middle
          boxShadow: "inset 0 0 0 1px var(--aegis-color-border-default), var(--aegis-depth-medium)",
          padding: "var(--aegis-space-medium)",
          fontSize: "12px",
          zIndex: 999,
          maxWidth: "300px",
        }}
      >
        {/* Aegis token: foreground/default */}
        <Text variant="body.medium.bold" style={{ color: "#2E2E2E", fontSize: "12px" }}>
          {memberName}
        </Text>
        <div style={{ marginTop: "var(--aegis-space-small)" }}>
          <Text variant="body.small.bold" style={{ color: "#2E2E2E", fontSize: "12px" }}>
            {pld.name} (滞留)
          </Text>
          <ul style={{ paddingLeft: "20px", margin: "4px 0 0 0", listStyleType: "disc" }}>
            {details.map((detail: string) => (
              <li key={detail}>
                <Text variant="body.small" style={{ color: "#2E2E2E", fontSize: "12px" }}>
                  {detail}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  return null;
};

// chartPaletteを再エクスポート（他のコンポーネントから使用可能にするため）
export { chartPalette };
