var e=`import { LfContrast } from "@legalforce/aegis-icons";
import {
  Button,
  ButtonGroup,
  Combobox,
  ContentHeader,
  ContentHeaderTitle,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Form,
  FormControl,
  Icon,
  IconButton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  TextField,
} from "@legalforce/aegis-react";
import type { ChangeEvent, CSSProperties, KeyboardEvent } from "react";
import { useMemo, useState } from "react";
import { wcagContrastRatio } from "../../color/contrast";
import type { RGB } from "../../color/contrast/specs";
import { oklchToRgb, toneToRgb } from "../../color/oklch";
import { usePaletteLabContext } from "../../store/context";
import type { ColorFamily } from "../../store/types";
import { isDisplayTone, toneLabel } from "../../store/types";
import { PrimaryTab } from "../PrimaryTab";
import type { BaseSwatchRole } from "../SwatchRow";
import { SwatchRow } from "../SwatchRow";
import { TransparentTab } from "../TransparentTab";

// ─── Pane background ref ──────────────────────────────────────────────────────
// Format: "default" | "\${familyId}:\${toneValue}"

export type PaneBackgroundRef = string;

const parsePaneBackground = (ref: PaneBackgroundRef, families: ColorFamily[], appBgRgb: RGB): RGB => {
  if (ref === "default") return appBgRgb;
  const colonIdx = ref.indexOf(":");
  if (colonIdx === -1) return appBgRgb;
  const familyId = ref.slice(0, colonIdx);
  const toneValue = Number(ref.slice(colonIdx + 1));
  const family = families.find((f) => f.id === familyId);
  const tone = family?.tones.find((t) => t.value === toneValue);
  return tone ? toneToRgb(tone) : appBgRgb;
};

const computeContrastRatios = (family: ColorFamily, bgRgb: RGB): Map<number, number | null> => {
  const ratios = new Map<number, number | null>();
  for (const tone of family.tones) {
    if (!isDisplayTone(tone.value)) continue;
    const toneRgb = toneToRgb(tone);
    ratios.set(tone.value, wcagContrastRatio(toneRgb, bgRgb));
  }
  return ratios;
};

const rgbToCss = ([r, g, b]: RGB): string => \`rgb(\${r},\${g},\${b})\`;

// ─── Family row ───────────────────────────────────────────────────────────────

type FamilyRowProps = {
  family: ColorFamily;
  isActiveFamily?: boolean;
  selectedToneValue?: number | null;
  role: BaseSwatchRole;
  showContrastRatio: boolean;
  contrastRatios: Map<number, number | null>;
  paneBgCss: string;
  onEditClick: () => void;
  onSwatchClick: (toneValue: number) => void;
};

const FamilyRow = ({
  family,
  isActiveFamily,
  selectedToneValue,
  role,
  showContrastRatio,
  contrastRatios,
  paneBgCss,
  onEditClick,
  onSwatchClick,
}: FamilyRowProps) => (
  <div
    style={
      {
        "--swatch-strip-bg": paneBgCss,
        borderRadius: "var(--aegis-radius-medium)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--aegis-space-x3Small)",
        padding: "var(--aegis-space-xxSmall)",
      } as CSSProperties
    }
  >
    <Button
      size="small"
      style={{ justifyContent: "flex-start", minWidth: 0 }}
      variant="gutterless"
      onClick={onEditClick}
    >
      <Text style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} variant="body.medium.bold">
        {family.name}
      </Text>
    </Button>
    <SwatchRow
      contrastRatios={contrastRatios}
      isActiveFamily={isActiveFamily}
      role={role}
      selectedToneValue={selectedToneValue}
      showContrastRatio={showContrastRatio}
      tones={family.tones}
      onSwatchClick={onSwatchClick}
    />
  </div>
);

// ─── Base tab ─────────────────────────────────────────────────────────────────

type FamilyListBaseTabProps = {
  appBgRgb: RGB;
  paneBackgroundRef: PaneBackgroundRef;
  role: BaseSwatchRole;
  showContrastRatio: boolean;
};

const FamilyListBaseTab = ({ appBgRgb, paneBackgroundRef, role, showContrastRatio }: FamilyListBaseTabProps) => {
  const { state, dispatch } = usePaletteLabContext();
  const [editFamilyId, setEditFamilyId] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");

  const activeProject = state.projects.find((p) => p.id === state.activeProjectId);
  const families = activeProject?.colorFamilies ?? [];
  const sortedFamilies = [...families].sort((a, b) => (b.isBuiltIn ? 1 : 0) - (a.isBuiltIn ? 1 : 0));
  const editFamily = families.find((f) => f.id === editFamilyId) ?? null;
  const { activeFamilyId, activeToneValue } = state;

  const bgRgb = useMemo(
    () => parsePaneBackground(paneBackgroundRef, families, appBgRgb),
    [paneBackgroundRef, families, appBgRgb],
  );

  const handleEditOpen = (family: ColorFamily) => {
    setEditFamilyId(family.id);
    setNameInput(family.name);
  };

  const handleSwatchClick = (family: ColorFamily, toneValue: number) => {
    dispatch({ type: "SELECT_FAMILY", payload: { familyId: family.id } });
    dispatch({ type: "SELECT_TONE", payload: { toneValue } });
  };

  const handleConfirm = () => {
    if (!editFamilyId || !nameInput.trim()) return;
    dispatch({ type: "RENAME_FAMILY", payload: { familyId: editFamilyId, name: nameInput.trim() } });
    setEditFamilyId(null);
  };

  const handleDelete = () => {
    if (!editFamilyId) return;
    dispatch({ type: "DELETE_FAMILY", payload: { familyId: editFamilyId } });
    setEditFamilyId(null);
  };

  const handleDuplicate = () => {
    if (!editFamilyId) return;
    dispatch({ type: "DUPLICATE_FAMILY", payload: { familyId: editFamilyId } });
    setEditFamilyId(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleConfirm();
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}>
        {sortedFamilies.map((family) => (
          <FamilyRow
            contrastRatios={computeContrastRatios(family, bgRgb)}
            family={family}
            isActiveFamily={family.id === activeFamilyId}
            key={family.id}
            paneBgCss={rgbToCss(bgRgb)}
            role={role}
            selectedToneValue={activeToneValue}
            showContrastRatio={showContrastRatio}
            onEditClick={() => handleEditOpen(family)}
            onSwatchClick={(toneValue) => handleSwatchClick(family, toneValue)}
          />
        ))}
      </div>

      <Dialog
        open={editFamilyId !== null}
        onOpenChange={(open) => {
          if (!open) setEditFamilyId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>{editFamily?.name}</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <FormControl>
              <FormControl.Label>Family name</FormControl.Label>
              <TextField
                value={nameInput}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNameInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </FormControl>
          </DialogBody>
          <DialogFooter>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              {!editFamily?.isBuiltIn ? (
                <ButtonGroup>
                  <Button color="danger" variant="subtle" onClick={handleDelete}>
                    Delete
                  </Button>
                  <Button variant="subtle" onClick={handleDuplicate}>
                    Duplicate
                  </Button>
                </ButtonGroup>
              ) : (
                <div />
              )}
              <ButtonGroup>
                <Button variant="plain" onClick={() => setEditFamilyId(null)}>
                  Cancel
                </Button>
                <Button disabled={!nameInput.trim()} onClick={handleConfirm}>
                  Confirm
                </Button>
              </ButtonGroup>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// ─── FamilyList ───────────────────────────────────────────────────────────────

type FamilyListProps = {
  appBgLightnessInput: string;
  paneBackgroundRef: PaneBackgroundRef;
  onAppBgLightnessBlur: () => void;
  onAppBgLightnessChange: (value: string) => void;
  onPaneBackgroundRefChange: (ref: PaneBackgroundRef) => void;
};

export const FamilyList = ({
  appBgLightnessInput,
  paneBackgroundRef,
  onAppBgLightnessBlur,
  onAppBgLightnessChange,
  onPaneBackgroundRefChange,
}: FamilyListProps) => {
  const { state } = usePaletteLabContext();
  const [activeTab, setActiveTab] = useState<"base" | "primary" | "transparent">("base");
  const [role, setRole] = useState<BaseSwatchRole>("background");
  const [showContrastRatio, setShowContrastRatio] = useState(false);

  const activeProject = state.projects.find((p) => p.id === state.activeProjectId);
  const families = activeProject?.colorFamilies ?? [];
  const sortedFamilies = useMemo(
    () => [...families].sort((a, b) => (b.isBuiltIn ? 1 : 0) - (a.isBuiltIn ? 1 : 0)),
    [families],
  );

  const comboboxOptions = useMemo(
    () => [
      { value: "default", label: "None" },
      ...sortedFamilies.flatMap((family) =>
        family.tones
          .filter((t) => isDisplayTone(t.value))
          .sort((a, b) => b.value - a.value)
          .map((t) => ({
            value: \`\${family.id}:\${t.value}\`,
            label: \`\${family.name}-\${toneLabel(t.value)}\`,
          })),
      ),
    ],
    [sortedFamilies],
  );
  const appBgRgb = useMemo((): RGB => {
    const L = Number(appBgLightnessInput);
    const lightness = Number.isFinite(L) ? Math.max(0, Math.min(100, L)) : 100;
    return oklchToRgb(lightness, 0, 0);
  }, [appBgLightnessInput]);

  const paneBackgroundRgb = useMemo(
    () => parsePaneBackground(paneBackgroundRef, families, appBgRgb),
    [paneBackgroundRef, families, appBgRgb],
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value as "base" | "primary" | "transparent");
  };

  const ROLE_OPTIONS: Array<{ value: BaseSwatchRole; label: string }> = [
    { value: "background", label: "Background" },
    { value: "foreground", label: "Foreground" },
    { value: "border", label: "Border" },
  ];

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <Form
        size="small"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FormControl orientation="horizontal">
          <FormControl.Label width="small">App BG</FormControl.Label>
          <TextField
            aria-label="App BG lightness"
            leading="L:"
            max={100}
            min={0}
            size="medium"
            step="0.01"
            style={{ width: "100%" }}
            type="number"
            value={appBgLightnessInput}
            onBlur={onAppBgLightnessBlur}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onAppBgLightnessChange(e.target.value)}
          />
        </FormControl>

        <FormControl orientation="horizontal">
          <FormControl.Label width="small">Background-Color</FormControl.Label>
          <Combobox
            clearable={paneBackgroundRef !== "default"}
            options={comboboxOptions}
            size="medium"
            value={paneBackgroundRef}
            width="full"
            onChange={(value) => {
              onPaneBackgroundRefChange(value ?? "default");
            }}
          />
        </FormControl>
      </Form>

      <div
        style={{
          alignItems: "center",
          alignSelf: "stretch",
          borderBlockEnd: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
          display: "flex",
          gap: "var(--aegis-space-xSmall)",
          justifyContent: "space-between",
        }}
      >
        <TabsList bordered={false}>
          <TabsTrigger value="base">Base</TabsTrigger>
          <TabsTrigger value="primary">Primary</TabsTrigger>
          <TabsTrigger value="transparent">Transparent</TabsTrigger>
        </TabsList>
        <IconButton
          aria-label={showContrastRatio ? "Hide contrast ratio" : "Show contrast ratio"}
          size="xSmall"
          variant={showContrastRatio ? "solid" : "subtle"}
          onClick={() => setShowContrastRatio((v) => !v)}
        >
          <Icon size="xSmall">
            <LfContrast />
          </Icon>
        </IconButton>
      </div>

      <TabsContent value="base">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
          <div style={{ display: "flex", gap: "var(--aegis-space-xxSmall)" }}>
            {ROLE_OPTIONS.map(({ value, label }) => (
              <Button
                key={value}
                size="xSmall"
                variant={role === value ? "solid" : "subtle"}
                onClick={() => setRole(value)}
              >
                {label}
              </Button>
            ))}
          </div>
          <FamilyListBaseTab
            appBgRgb={appBgRgb}
            paneBackgroundRef={paneBackgroundRef}
            role={role}
            showContrastRatio={showContrastRatio}
          />
        </div>
      </TabsContent>
      <TabsContent value="primary">
        <PrimaryTab
          paneBackgroundRgb={paneBackgroundRgb}
          showContrastRatio={showContrastRatio}
          showTexture={paneBackgroundRef === "default"}
        />
      </TabsContent>
      <TabsContent value="transparent">
        <TransparentTab
          paneBackgroundRgb={paneBackgroundRgb}
          showContrastRatio={showContrastRatio}
          showTexture={paneBackgroundRef === "default"}
        />
      </TabsContent>
    </Tabs>
  );
};
`;export{e as default};