var e=`import type { CSSProperties } from "react";
import { toneToRgb } from "../../color/oklch";
import { contrastTextColor } from "../../color/swatchTextColor";
import type { ToneEntry } from "../../store/types";
import { isDisplayTone, toneLabel } from "../../store/types";
import styles from "./index.module.css";

export type BaseSwatchRole = "background" | "foreground" | "border";

type SwatchRowProps = {
  tones: ToneEntry[];
  isActiveFamily?: boolean;
  selectedToneValue?: number | null;
  onSwatchClick?: (toneValue: number) => void;
  role?: BaseSwatchRole;
  showContrastRatio?: boolean;
  contrastRatios?: Map<number, number | null>;
};

export const SwatchRow = ({
  tones,
  isActiveFamily = false,
  selectedToneValue = null,
  onSwatchClick,
  role = "background",
  showContrastRatio = false,
  contrastRatios,
}: SwatchRowProps) => {
  const displayTones = tones.filter((t) => isDisplayTone(t.value));
  if (displayTones.length === 0) return null;

  const isInteractive = onSwatchClick !== undefined;
  const selectedIndex = selectedToneValue === null ? -1 : displayTones.findIndex((t) => t.value === selectedToneValue);
  const hasSelection = selectedIndex >= 0;
  const hasActiveSelection = isActiveFamily && hasSelection;
  const isEdgeSelected = selectedIndex === 0 || selectedIndex === displayTones.length - 1;
  const stripRadius = hasActiveSelection || isEdgeSelected ? "6px" : "var(--aegis-radius-medium)";
  const swatchRadius = "var(--aegis-radius-medium)";

  const isBackground = role === "background";
  const isForeground = role === "foreground";
  const isBorder = role === "border";

  const stripStyle = {
    boxSizing: "border-box",
    borderRadius: isBackground ? stripRadius : undefined,
    display: "flex",
    height: "var(--aegis-size-x3Large)",
    overflow: "visible",
    width: "100%",
    "--swatch-row-radius": stripRadius,
  } as CSSProperties;

  const getDisplayText = (tone: ToneEntry): string => {
    if (showContrastRatio) {
      const ratio = contrastRatios?.get(tone.value);
      return ratio != null ? ratio.toFixed(1) : "—";
    }
    return toneLabel(tone.value);
  };

  return (
    <div
      className={isBackground ? \`\${styles.strip} \${hasActiveSelection ? styles.stripActive : ""}\` : ""}
      style={stripStyle}
    >
      {displayTones.map((tone, index) => {
        const label = getDisplayText(tone);
        const isSelected = hasSelection && tone.value === selectedToneValue;
        const isFirstSwatch = index === 0;
        const isLastSwatch = index === displayTones.length - 1;
        const oklchCss = \`oklch(\${tone.lightness}% \${tone.chroma} \${tone.hue})\`;

        const wrapperStyle: CSSProperties = {
          alignSelf: "stretch",
          boxSizing: "border-box",
          display: "flex",
          flex: "1 1 0",
          minWidth: 0,
          position: "relative",
          zIndex: isSelected ? 2 : 1,
        };

        const isRightNeighbor = selectedIndex >= 0 && index === selectedIndex + 1;
        const isLeftNeighbor = selectedIndex >= 0 && index === selectedIndex - 1;
        const isValueSelected = isSelected && !isBackground;

        let swatchStyle: CSSProperties;

        if (isBackground) {
          swatchStyle = {
            alignItems: "center",
            alignSelf: "stretch",
            appearance: "none",
            backgroundColor: "transparent",
            borderBottom: "0 solid transparent",
            borderLeft: "0 solid transparent",
            borderRight: "0 solid transparent",
            borderTop: "0 solid transparent",
            boxSizing: "border-box",
            color: contrastTextColor(toneToRgb(tone)),
            display: "flex",
            flex: "1 1 0",
            fontFamily: "Inter, var(--aegis-font-family-sans-serif, sans-serif)",
            fontSize: "12px",
            fontWeight: 400,
            height: "100%",
            justifyContent: "center",
            lineHeight: 1,
            margin: 0,
            minWidth: 0,
            outline: "none",
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 0,
            textAlign: "center",
            userSelect: "none",
            "--swatch-bg": oklchCss,
            ...(isSelected ? { borderRadius: swatchRadius } : {}),
            ...(!isSelected && isFirstSwatch
              ? { borderTopLeftRadius: swatchRadius, borderBottomLeftRadius: swatchRadius }
              : {}),
            ...(!isSelected && isLastSwatch
              ? { borderTopRightRadius: swatchRadius, borderBottomRightRadius: swatchRadius }
              : {}),
            ...(isRightNeighbor ? { borderTopLeftRadius: swatchRadius, borderBottomLeftRadius: swatchRadius } : {}),
            ...(isLeftNeighbor ? { borderTopRightRadius: swatchRadius, borderBottomRightRadius: swatchRadius } : {}),
          } as CSSProperties;
        } else {
          swatchStyle = {
            alignItems: "center",
            alignSelf: "stretch",
            appearance: "none",
            backgroundColor: "transparent",
            border: "0 solid transparent",
            borderRadius: swatchRadius,
            boxSizing: "border-box",
            color: isForeground || isBorder ? oklchCss : "var(--aegis-color-foreground-subtle)",
            cursor: isInteractive ? "pointer" : undefined,
            display: "flex",
            flexDirection: isBorder ? "column" : undefined,
            flex: "1 1 0",
            fontFamily: "Inter, var(--aegis-font-family-sans-serif, sans-serif)",
            fontSize: "12px",
            fontWeight: 400,
            gap: isBorder ? "var(--aegis-space-xxSmall)" : undefined,
            height: "100%",
            justifyContent: "center",
            lineHeight: 1,
            margin: 0,
            minWidth: 0,
            outline: "none",
            overflow: isBorder ? "hidden" : undefined,
            paddingBlock: 0,
            paddingInline: isBorder ? "var(--aegis-space-xxSmall)" : 0,
            position: "relative",
            textAlign: "center",
            transition: "border-radius var(--aegis-motion-duration-fast) var(--aegis-motion-easing-default)",
            userSelect: "none",
            "--swatch-selection-color": oklchCss,
            "--swatch-selection-opacity": isValueSelected ? 1 : 0,
            "--swatch-selection-target-opacity": isValueSelected && isActiveFamily ? 1 : 0,
          } as CSSProperties;
        }

        const swatchClassName = isBackground
          ? [
              styles.swatch,
              isSelected ? styles.swatchSelected : "",
              isSelected && isFirstSwatch ? styles.swatchSelectedStart : "",
              isSelected && isLastSwatch ? styles.swatchSelectedEnd : "",
            ]
              .filter(Boolean)
              .join(" ")
          : styles.valueSwatch;

        const content = isBorder ? (
          <>
            <span style={{ alignSelf: "stretch", textAlign: "center" }}>{label}</span>
            <span
              aria-hidden
              style={{
                alignSelf: "stretch",
                backgroundColor: oklchCss,
                height: "var(--aegis-border-width-thin)",
              }}
            />
          </>
        ) : (
          label
        );

        const inner = isInteractive ? (
          <button
            aria-label={\`tone \${toneLabel(tone.value)}\`}
            className={swatchClassName}
            onClick={() => onSwatchClick(tone.value)}
            style={{ ...swatchStyle, cursor: "pointer" }}
            type="button"
          >
            {content}
          </button>
        ) : (
          <div className={swatchClassName} style={swatchStyle}>
            {content}
          </div>
        );

        return (
          <div key={tone.value} style={wrapperStyle}>
            {inner}
          </div>
        );
      })}
    </div>
  );
};
`;export{e as default};