var e=`import { Button, Text } from "@legalforce/aegis-react";
import type { CSSProperties } from "react";
import { useMemo } from "react";

import { wcagContrastRatio } from "../../color/contrast";
import type { RGB } from "../../color/contrast/specs";
import { cssColorToRgb, oklchToHex } from "../../color/oklch";
import { contrastTextColor } from "../../color/swatchTextColor";
import { buildNeutralAlphaMap, getNeutralAlphaOrigin, type NeutralAlphaOrigin } from "../../color/transparent";
import { usePaletteLabContext } from "../../store/context";
import { isDisplayTone, toneLabel } from "../../store/types";

type TransparentRowProps = {
  label: string;
  toneValues: number[];
  alphaMap: Map<number, number>;
  showTexture: boolean;
  showContrastRatio: boolean;
  paneBackgroundRgb: RGB;
  /** true → inverse-transparent (opposite base from neutral-transparent) */
  isInverse?: boolean;
  origin: NeutralAlphaOrigin;
};

const TransparentRow = ({
  label,
  toneValues,
  alphaMap,
  showTexture,
  showContrastRatio,
  paneBackgroundRgb,
  isInverse = false,
  origin,
}: TransparentRowProps) => (
  <div
    style={{
      borderRadius: "var(--aegis-radius-medium)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--aegis-space-x3Small)",
      padding: "var(--aegis-space-xxSmall)",
    }}
  >
    <Button
      size="small"
      style={{ justifyContent: "flex-start", minWidth: 0, pointerEvents: "none" }}
      variant="gutterless"
    >
      <Text style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} variant="body.medium.bold">
        {label}
      </Text>
    </Button>
    <div
      style={{
        borderRadius: "var(--aegis-radius-medium)",
        display: "flex",
        height: "var(--aegis-size-x3Large)",
        overflow: "hidden",
        position: "relative",
        width: "100%",
      }}
    >
      {showTexture && (
        <div
          aria-hidden="true"
          style={{
            background: \`repeating-linear-gradient(-45deg, var(--palette-lab-invalid-zone-texture-color, rgba(0,0,0,0.2)) 0px, var(--palette-lab-invalid-zone-texture-color, rgba(0,0,0,0.2)) 1px, transparent 1px, transparent 4px)\`,
            height: "100%",
            left: 0,
            position: "absolute",
            top: 0,
            width: "100%",
            zIndex: 0,
          }}
        />
      )}
      {toneValues.flatMap((toneValue, index) => {
        const alpha = alphaMap.get(toneValue);
        if (alpha === undefined) return [];
        const isFirst = index === 0;
        const isLast = index === toneValues.length - 1;

        // neutral-transparent: "0%" in black-origin (light), "100%" in white-origin (dark)
        // inverse-transparent: uses the opposite base from neutral-transparent
        const neutralBaseL = origin === "white" ? "100%" : "0%";
        const inverseBaseL = origin === "white" ? "0%" : "100%";
        const baseL = isInverse ? inverseBaseL : neutralBaseL;
        const chipColor = \`oklch(\${baseL} 0 0 / \${alpha})\`;
        const chipRgb = cssColorToRgb(chipColor, paneBackgroundRgb);
        const label =
          showContrastRatio && chipRgb
            ? wcagContrastRatio(chipRgb, paneBackgroundRgb).toFixed(1)
            : toneLabel(toneValue);
        const textColor = chipRgb ? contrastTextColor(chipRgb) : "var(--aegis-color-foreground-default)";

        const chipStyle: CSSProperties = {
          alignItems: "center",
          backgroundColor: chipColor,
          borderRadius:
            isFirst && isLast
              ? "var(--aegis-radius-medium)"
              : isFirst
                ? "var(--aegis-radius-medium) 0 0 var(--aegis-radius-medium)"
                : isLast
                  ? "0 var(--aegis-radius-medium) var(--aegis-radius-medium) 0"
                  : undefined,
          color: textColor,
          display: "flex",
          flex: 1,
          fontSize: "12px",
          justifyContent: "center",
          lineHeight: 1,
          position: "relative",
          zIndex: 1,
        };

        return [
          <div key={toneValue} style={chipStyle}>
            {label}
          </div>,
        ];
      })}
    </div>
  </div>
);

type TransparentTabProps = {
  paneBackgroundRgb: RGB;
  showContrastRatio?: boolean;
  showTexture: boolean;
};

export const TransparentTab = ({ showTexture, showContrastRatio = false, paneBackgroundRgb }: TransparentTabProps) => {
  const { state } = usePaletteLabContext();
  const activeProject = state.projects.find((p) => p.id === state.activeProjectId);
  const neutralFamily = activeProject?.colorFamilies.find((f) => f.name.toLowerCase() === "neutral");
  const appBgLightness = activeProject?.appBgLightness ?? 100;
  const origin = getNeutralAlphaOrigin(appBgLightness);
  const appBgHex = useMemo(() => oklchToHex(appBgLightness, 0, 0), [appBgLightness]);

  const displayTones = useMemo(
    () => (neutralFamily?.tones ?? []).filter((t) => isDisplayTone(t.value)).sort((a, b) => a.value - b.value),
    [neutralFamily],
  );

  const alphaMap = useMemo(
    () => buildNeutralAlphaMap(neutralFamily, origin, appBgHex),
    [neutralFamily, origin, appBgHex],
  );

  const toneValues = displayTones.map((t) => t.value);

  if (toneValues.length === 0) {
    return (
      <Text color="subtle" variant="body.small">
        neutralファミリーが見つかりません。
      </Text>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)", overflowY: "auto" }}>
      <TransparentRow
        alphaMap={alphaMap}
        label="neutral-transparent"
        origin={origin}
        paneBackgroundRgb={paneBackgroundRgb}
        showContrastRatio={showContrastRatio}
        showTexture={showTexture}
        toneValues={toneValues}
      />
      <TransparentRow
        alphaMap={alphaMap}
        isInverse
        label="inverse-transparent"
        origin={origin}
        paneBackgroundRgb={paneBackgroundRgb}
        showContrastRatio={showContrastRatio}
        showTexture={showTexture}
        toneValues={toneValues}
      />
    </div>
  );
};
`;export{e as default};