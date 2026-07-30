var e=`import { LfTrash } from "@legalforce/aegis-icons";
import {
  Button,
  ButtonGroup,
  ContentHeader,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  EmptyState,
  FormControl,
  Icon,
  IconButton,
  Text,
  TextField,
} from "@legalforce/aegis-react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useEffect, useMemo, useState } from "react";

import { hexToOklchChannels } from "../../color/oklch";
import { usePaletteLabContext } from "../../store/context";
import type { ColorFamily, ToneEntry } from "../../store/types";

type ToneRowProps = {
  hexInput: string;
  onBlurHex: (toneValue: number) => void;
  onChangeHex: (toneValue: number, value: string) => void;
  onDelete: (toneValue: number) => void;
  onKeyDownHex: (toneValue: number, event: KeyboardEvent<HTMLInputElement>) => void;
  onUpdateTone: (toneValue: number, patch: Partial<Pick<ToneEntry, "chroma" | "hue" | "lightness">>) => void;
  tone: ToneEntry;
};

const ToneRow = ({ hexInput, onBlurHex, onChangeHex, onDelete, onKeyDownHex, onUpdateTone, tone }: ToneRowProps) => {
  return (
    <div
      style={{
        alignItems: "center",
        columnGap: "var(--aegis-space-small)",
        display: "grid",
        gridTemplateColumns: "48px minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) 100px 40px 36px",
        paddingBlock: "var(--aegis-space-xxSmall)",
      }}
    >
      <Text
        style={{
          textAlign: "right",
        }}
        variant="body.small.bold"
      >
        {tone.value}
      </Text>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-x3Small)" }}>
        <Text color="subtle" variant="label.small">
          L {tone.lightness.toFixed(1)}
        </Text>
        <input
          aria-label={\`\${tone.value} lightness\`}
          max={100}
          min={0}
          onChange={(event) => {
            onUpdateTone(tone.value, { lightness: Number(event.currentTarget.value) });
          }}
          step={0.1}
          style={{ width: "100%" }}
          type="range"
          value={tone.lightness}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-x3Small)" }}>
        <Text color="subtle" variant="label.small">
          C {tone.chroma.toFixed(3)}
        </Text>
        <input
          aria-label={\`\${tone.value} chroma\`}
          max={0.4}
          min={0}
          onChange={(event) => {
            onUpdateTone(tone.value, { chroma: Number(event.currentTarget.value) });
          }}
          step={0.001}
          style={{ width: "100%" }}
          type="range"
          value={tone.chroma}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-x3Small)" }}>
        <Text color="subtle" variant="label.small">
          H {tone.hue.toFixed(0)}
        </Text>
        <input
          aria-label={\`\${tone.value} hue\`}
          max={360}
          min={0}
          onChange={(event) => {
            onUpdateTone(tone.value, { hue: Number(event.currentTarget.value) });
          }}
          step={1}
          style={{ width: "100%" }}
          type="range"
          value={tone.hue}
        />
      </div>

      <TextField
        aria-label={\`\${tone.value} hex\`}
        onBlur={() => {
          onBlurHex(tone.value);
        }}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChangeHex(tone.value, event.target.value);
        }}
        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
          onKeyDownHex(tone.value, event);
        }}
        placeholder="#000000"
        value={hexInput}
      />

      <div
        aria-label={\`\${tone.value} color preview\`}
        role="img"
        style={{
          backgroundColor: tone.hex,
          border: "1px solid var(--aegis-color-border-neutral)",
          borderRadius: "var(--aegis-radius-small)",
          height: "var(--aegis-size-x3Large)",
          width: "var(--aegis-size-x3Large)",
        }}
      />

      <IconButton
        aria-label={\`\${tone.value} tone を削除\`}
        onClick={() => {
          onDelete(tone.value);
        }}
        size="small"
        variant="plain"
      >
        <Icon size="xSmall">
          <LfTrash />
        </Icon>
      </IconButton>
    </div>
  );
};

export const ToneEditor = () => {
  const { state, dispatch } = usePaletteLabContext();
  const activeProject = state.projects.find((project) => project.id === state.activeProjectId);
  const activeFamily = activeProject?.colorFamilies.find((family) => family.id === state.activeFamilyId);

  const [addToneDialogOpen, setAddToneDialogOpen] = useState(false);
  const [newToneValue, setNewToneValue] = useState("");
  const [addToneError, setAddToneError] = useState<string | null>(null);
  const [hexInputs, setHexInputs] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!activeFamily) {
      setHexInputs({});
      return;
    }

    setHexInputs(
      Object.fromEntries(activeFamily.tones.map((tone) => [tone.value, tone.hex])) as Record<number, string>,
    );
  }, [activeFamily]);

  const existingToneValues = useMemo(
    () => new Set(activeFamily?.tones.map((tone) => tone.value) ?? []),
    [activeFamily],
  );

  const handleUpdateTone = (
    familyId: string,
    toneValue: number,
    patch: Partial<Pick<ToneEntry, "chroma" | "hue" | "lightness">>,
  ) => {
    dispatch({
      type: "UPDATE_TONE",
      payload: { familyId, toneValue, patch },
    });
  };

  const commitHexInput = (family: ColorFamily, toneValue: number) => {
    const currentValue = hexInputs[toneValue] ?? "";
    const normalized = currentValue.startsWith("#") ? currentValue : \`#\${currentValue}\`;

    if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) {
      setHexInputs((prev) => ({
        ...prev,
        [toneValue]: family.tones.find((tone) => tone.value === toneValue)?.hex ?? currentValue,
      }));
      return;
    }

    const channels = hexToOklchChannels(normalized);
    dispatch({
      type: "UPDATE_TONE",
      payload: {
        familyId: family.id,
        toneValue,
        patch: {
          lightness: channels.l,
          chroma: channels.c,
          hue: channels.h,
          hex: normalized,
        },
      },
    });
  };

  const handleAddTone = () => {
    if (!activeFamily) {
      return;
    }

    const value = Number(newToneValue);

    if (Number.isNaN(value) || value <= 0) {
      setAddToneError("1以上の数値を入力してください。");
      return;
    }

    if (existingToneValues.has(value)) {
      setAddToneError("同じトーン値は追加できません。");
      return;
    }

    dispatch({ type: "ADD_TONE", payload: { familyId: activeFamily.id, toneValue: value } });
    setAddToneDialogOpen(false);
    setNewToneValue("");
    setAddToneError(null);
  };

  if (!activeFamily) {
    return <EmptyState size="small" title="カラーファミリーを選択してください" />;
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <ContentHeader>
            <ContentHeader.Title>{activeFamily.name}</ContentHeader.Title>
            <ContentHeader.Description>各トーンの OKLCH 値と HEX を調整します。</ContentHeader.Description>
          </ContentHeader>
          <Button
            onClick={() => {
              setAddToneDialogOpen(true);
              setAddToneError(null);
            }}
            variant="subtle"
          >
            Add tone
          </Button>
        </div>

        {activeFamily.tones.length === 0 ? (
          <EmptyState size="small" title="トーンがありません" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-x3Small)" }}>
            <div
              style={{
                alignItems: "center",
                color: "var(--aegis-color-foreground-subtle)",
                columnGap: "var(--aegis-space-small)",
                display: "grid",
                gridTemplateColumns: "48px minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) 100px 40px 36px",
                paddingBlockEnd: "var(--aegis-space-x3Small)",
              }}
            >
              <Text variant="label.small">Tone</Text>
              <Text variant="label.small">Lightness</Text>
              <Text variant="label.small">Chroma</Text>
              <Text variant="label.small">Hue</Text>
              <Text variant="label.small">Hex</Text>
              <Text variant="label.small">Chip</Text>
              <Text variant="label.small">Delete</Text>
            </div>

            {activeFamily.tones.map((tone) => (
              <ToneRow
                hexInput={hexInputs[tone.value] ?? tone.hex}
                key={tone.value}
                onBlurHex={(toneValue) => {
                  commitHexInput(activeFamily, toneValue);
                }}
                onChangeHex={(toneValue, value) => {
                  setHexInputs((prev) => ({
                    ...prev,
                    [toneValue]: value,
                  }));
                }}
                onDelete={(toneValue) => {
                  dispatch({ type: "DELETE_TONE", payload: { familyId: activeFamily.id, toneValue } });
                }}
                onKeyDownHex={(toneValue, event) => {
                  if (event.key === "Enter") {
                    commitHexInput(activeFamily, toneValue);
                  }
                }}
                onUpdateTone={(toneValue, patch) => {
                  handleUpdateTone(activeFamily.id, toneValue, patch);
                }}
                tone={tone}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog
        onOpenChange={(open) => {
          setAddToneDialogOpen(open);
          if (!open) {
            setNewToneValue("");
            setAddToneError(null);
          }
        }}
        open={addToneDialogOpen}
      >
        <DialogContent width="small">
          <DialogHeader>
            <ContentHeader>
              <ContentHeader.Title>トーンを追加</ContentHeader.Title>
              <ContentHeader.Description>追加するトーン値を入力してください。</ContentHeader.Description>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <FormControl error={Boolean(addToneError)}>
              <FormControl.Label>トーン値</FormControl.Label>
              <TextField
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setNewToneValue(event.target.value);
                  if (addToneError) {
                    setAddToneError(null);
                  }
                }}
                onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                  if (event.key === "Enter") {
                    handleAddTone();
                  }
                }}
                placeholder="例: 550"
                value={newToneValue}
              />
              <FormControl.Caption>
                {addToneError ?? "既存の tone value と重複しない数値を指定してください。"}
              </FormControl.Caption>
            </FormControl>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button
                onClick={() => {
                  setAddToneDialogOpen(false);
                  setNewToneValue("");
                  setAddToneError(null);
                }}
                variant="plain"
              >
                キャンセル
              </Button>
              <Button onClick={handleAddTone}>追加</Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
`;export{e as default};