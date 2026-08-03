var e=`import { LfCheck } from "@legalforce/aegis-icons";
import { Button, Icon, Menu, MenuContent, MenuItem, MenuTrigger, Text } from "@legalforce/aegis-react";
import type { CSSProperties } from "react";
import { useMemo } from "react";

import { wcagContrastRatio } from "../../color/contrast";
import type { RGB } from "../../color/contrast/specs";
import { cssColorToRgb } from "../../color/oklch";
import { buildPrimaryScale, DEFAULT_BASE_TONE } from "../../color/primary";
import { contrastTextColor } from "../../color/swatchTextColor";
import { buildNeutralAlphaMap, getNeutralAlphaOrigin } from "../../color/transparent";
import { usePaletteLabContext } from "../../store/context";
import type { ColorFamily } from "../../store/types";
import { isDisplayTone, toneLabel } from "../../store/types";

type BaseToneSelectorProps = {
  family: ColorFamily;
  onSelect: (toneValue: number) => void;
};

const normalizeToneValue = (value: unknown): number => Number(value);

const BaseToneSelector = ({ family, onSelect }: BaseToneSelectorProps) => {
  const currentBase = normalizeToneValue(family.primaryBaseTone ?? DEFAULT_BASE_TONE);

  return (
    <Menu>
      <MenuTrigger>
        <Button size="small" style={{ justifyContent: "flex-start", minWidth: 0 }} variant="gutterless">
          <Text
            style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            variant="body.medium.bold"
          >
            {family.name} {currentBase}
          </Text>
        </Button>
      </MenuTrigger>
      <MenuContent>
        {family.tones.map((t) => {
          const toneValue = normalizeToneValue(t.value);

          return (
            <MenuItem
              key={toneValue}
              trailing={
                toneValue === currentBase ? (
                  <Icon size="xSmall">
                    <LfCheck />
                  </Icon>
                ) : undefined
              }
              onClick={() => onSelect(toneValue)}
            >
              {toneValue}
            </MenuItem>
          );
        })}
      </MenuContent>
    </Menu>
  );
};

type PrimaryFamilyRowProps = {
  family: ColorFamily;
  alphaMap: Map<number, number>;
  showTexture: boolean;
  showContrastRatio: boolean;
  paneBackgroundRgb: RGB;
};

const PrimaryFamilyRow = ({
  family,
  alphaMap,
  showTexture,
  showContrastRatio,
  paneBackgroundRgb,
}: PrimaryFamilyRowProps) => {
  const { dispatch } = usePaletteLabContext();
  const scaleMap = new Map(buildPrimaryScale(family, alphaMap).map((e) => [e.value, e.oklch]));
  const displayTones = family.tones
    .map((tone) => normalizeToneValue(tone.value))
    .filter((value) => Number.isFinite(value) && isDisplayTone(value))
    .slice()
    .sort((a, b) => a - b);

  return (
    <div
      style={{
        borderRadius: "var(--aegis-radius-medium)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--aegis-space-x3Small)",
        padding: "var(--aegis-space-xxSmall)",
      }}
    >
      <BaseToneSelector
        family={family}
        onSelect={(toneValue) =>
          dispatch({ type: "SET_PRIMARY_BASE_TONE", payload: { familyId: family.id, baseTone: toneValue } })
        }
      />
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
        {displayTones.map((value, index) => {
          const isOutOfScale = !scaleMap.has(value);
          const chipColor = scaleMap.get(value);
          const chipRgb = chipColor ? cssColorToRgb(chipColor, paneBackgroundRgb) : null;
          const label = showContrastRatio
            ? chipRgb
              ? wcagContrastRatio(chipRgb, paneBackgroundRgb).toFixed(1)
              : "—"
            : toneLabel(value);
          const isFirst = index === 0;
          const isLast = index === displayTones.length - 1;

          const chipStyle: CSSProperties = {
            alignItems: "center",
            backgroundColor: isOutOfScale ? undefined : chipColor,
            borderRadius:
              isFirst && isLast
                ? "var(--aegis-radius-medium)"
                : isFirst
                  ? "var(--aegis-radius-medium) 0 0 var(--aegis-radius-medium)"
                  : isLast
                    ? "0 var(--aegis-radius-medium) var(--aegis-radius-medium) 0"
                    : undefined,
            color: !isOutOfScale && chipRgb ? contrastTextColor(chipRgb) : "var(--aegis-color-foreground-default)",
            display: "flex",
            flex: 1,
            fontSize: "12px",
            justifyContent: "center",
            lineHeight: 1,
            position: "relative",
            zIndex: 1,
          };

          return (
            <div key={value} style={chipStyle}>
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

type PrimaryTabProps = {
  paneBackgroundRgb: RGB;
  showContrastRatio?: boolean;
  showTexture: boolean;
};

export const PrimaryTab = ({ showTexture, showContrastRatio = false, paneBackgroundRgb }: PrimaryTabProps) => {
  const { state } = usePaletteLabContext();
  const activeProject = state.projects.find((p) => p.id === state.activeProjectId);
  const neutralFamily = activeProject?.colorFamilies.find((f) => f.name.toLowerCase() === "neutral");
  const origin = getNeutralAlphaOrigin(activeProject?.appBgLightness ?? 100);
  const alphaMap = useMemo(() => buildNeutralAlphaMap(neutralFamily, origin), [neutralFamily, origin]);
  const families = (activeProject?.colorFamilies ?? []).filter((f) => f.name.toLowerCase() !== "neutral");

  if (families.length === 0) {
    return (
      <Text color="subtle" variant="body.small">
        表示するファミリーがありません。
      </Text>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)", overflowY: "auto" }}>
      {families.map((family) => (
        <PrimaryFamilyRow
          alphaMap={alphaMap}
          family={family}
          key={family.id}
          paneBackgroundRgb={paneBackgroundRgb}
          showContrastRatio={showContrastRatio}
          showTexture={showTexture}
        />
      ))}
    </div>
  );
};
`;export{e as default};