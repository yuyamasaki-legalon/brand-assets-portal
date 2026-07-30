var e=`import {
  LfAngleDown,
  LfAngleRight,
  LfArrowBendLeft,
  LfArrowBendRight,
  LfCloseLarge,
  LfPaint,
} from "@legalforce/aegis-icons";
import { Button, FormControl, Icon, IconButton, Select, Text, TextField, Tooltip } from "@legalforce/aegis-react";
import { useMemo, useState } from "react";
import { getSpacingOptions, getVariantOptions } from "./constants";
import styles from "./floatingSourceCodeViewer.module.css";
import type { EditableProp, EditableVariantTarget } from "./types";

interface QuickEditorProps {
  selectedTarget: EditableVariantTarget;
  quickTargetOptions: Array<{ label: string; value: string }>;
  selectedTargetProps: EditableProp[];
  selectedEditableProp: EditableProp | null;
  iconOptions: Array<{ label: string; value: string }>;
  quickEditorRect: DOMRect | null;
  applyingTargetId: string | null;
  variantFeedback: string | null;

  quickEditorVariant: string;
  quickEditorText: string;
  quickEditorGap: string;
  quickEditorMargin: string;
  quickEditorPadding: string;
  quickEditorPropPath: string;
  quickEditorPropValue: string;
  quickEditorIconName: string;

  setSelectedTargetId: (id: string) => void;
  setQuickEditorVariant: (value: string) => void;
  setQuickEditorText: (value: string) => void;
  setQuickEditorGap: (value: string) => void;
  setQuickEditorMargin: (value: string) => void;
  setQuickEditorPadding: (value: string) => void;
  setQuickEditorPropPath: (value: string) => void;
  setQuickEditorPropValue: (value: string) => void;
  setQuickEditorIconName: (value: string) => void;

  updateSpacing: (target: EditableVariantTarget, kind: "gap" | "margin" | "padding", value: string) => Promise<boolean>;

  onClose: () => void;
  onApply: (continuePicking: boolean) => Promise<void>;
  onPickAgain: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

const PANEL_WIDTH = 340;
const PANEL_HEIGHT_ESTIMATE = 480;
const GAP = 10;

const computePosition = (rect: DOMRect | null) => {
  if (!rect) return { left: 16, top: 16 };

  let left = rect.right + GAP;
  let top = rect.top;

  if (left + PANEL_WIDTH > window.innerWidth - 8) {
    left = rect.left - PANEL_WIDTH - GAP;
  }
  if (left < 8) left = 8;

  if (top + PANEL_HEIGHT_ESTIMATE > window.innerHeight - 8) {
    top = window.innerHeight - PANEL_HEIGHT_ESTIMATE - 8;
  }
  if (top < 8) top = 8;

  return { left, top };
};

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  badge?: string;
  children: React.ReactNode;
}

const CollapsibleSection = ({ title, defaultOpen = false, badge, children }: CollapsibleSectionProps) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={styles.quickEditorSection}>
      <button
        type="button"
        className={styles.quickEditorSectionToggle}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--aegis-space-xxSmall)" }}>
          <Icon size="xSmall">{open ? <LfAngleDown /> : <LfAngleRight />}</Icon>
          {title}
          {badge ? (
            <Text as="span" variant="body.xSmall" color="subtle">
              {badge}
            </Text>
          ) : null}
        </span>
      </button>
      {open ? <div className={styles.quickEditorSectionBody}>{children}</div> : null}
    </div>
  );
};

const DirtyDot = ({ dirty }: { dirty: boolean }) =>
  dirty ? <span className={styles.quickEditorDirtyDot} role="img" aria-label="変更あり" /> : null;

export const QuickEditor = ({
  selectedTarget,
  quickTargetOptions,
  selectedTargetProps,
  selectedEditableProp,
  iconOptions,
  quickEditorRect,
  applyingTargetId,
  variantFeedback,
  quickEditorVariant,
  quickEditorText,
  quickEditorGap,
  quickEditorMargin,
  quickEditorPadding,
  quickEditorPropPath,
  quickEditorPropValue,
  quickEditorIconName,
  setSelectedTargetId,
  setQuickEditorVariant,
  setQuickEditorText,
  setQuickEditorGap,
  setQuickEditorMargin,
  setQuickEditorPadding,
  setQuickEditorPropPath,
  setQuickEditorPropValue,
  setQuickEditorIconName,
  updateSpacing,
  onClose,
  onApply,
  onPickAgain,
  onUndo,
  onRedo,
}: QuickEditorProps) => {
  const position = computePosition(quickEditorRect);
  const maxHeight = \`calc(100vh - \${Math.max(position.top + 8, 24)}px)\`;

  const selectedTargetPropOptions = selectedTargetProps.map((prop) => ({
    label: \`\${prop.label} (\${prop.valueType})\`,
    value: prop.path,
  }));

  const isVariantDirty = !!selectedTarget.supportsVariant && quickEditorVariant !== selectedTarget.currentVariant;
  const isTextDirty = quickEditorText !== (selectedTarget.textValue ?? "");
  const isGapDirty = quickEditorGap !== (selectedTarget.gapValue ?? "");
  const isMarginDirty = quickEditorMargin !== (selectedTarget.marginValue ?? "");
  const isPaddingDirty = quickEditorPadding !== (selectedTarget.paddingValue ?? "");
  const isPropDirty = !!selectedEditableProp && quickEditorPropValue !== selectedEditableProp.value;
  const isIconDirty = !!selectedTarget.currentIconName && quickEditorIconName !== selectedTarget.currentIconName;

  const showTargetSelector = quickTargetOptions.length > 1;
  const showIconSection = !!selectedTarget.currentIconName || selectedTarget.componentName === "IconButton";
  const showPropSection = selectedTargetProps.length > 0;
  const hasSpacingValue = !!(selectedTarget.gapValue || selectedTarget.marginValue || selectedTarget.paddingValue);

  const dirtyCount = useMemo(
    () =>
      [isVariantDirty, isTextDirty, isGapDirty, isMarginDirty, isPaddingDirty, isPropDirty, isIconDirty].filter(Boolean)
        .length,
    [isVariantDirty, isTextDirty, isGapDirty, isMarginDirty, isPaddingDirty, isPropDirty, isIconDirty],
  );

  const isApplying = applyingTargetId === selectedTarget.id;
  const componentHeading = selectedTarget.labelHint
    ? \`\${selectedTarget.componentName} · \${selectedTarget.labelHint}\`
    : selectedTarget.componentName;

  return (
    <div
      data-aegis-editor-ui="true"
      className={styles.quickEditor}
      style={{ left: position.left, top: position.top, maxHeight }}
      role="dialog"
      aria-label="Quick Variant Editor"
    >
      <div className={styles.quickEditorHeader}>
        <div className={styles.quickEditorHeaderTitle}>
          <Text variant="label.medium.bold">{componentHeading}</Text>
          <Text variant="body.xSmall" color="subtle">
            {selectedTarget.line}:{selectedTarget.column}
            {dirtyCount > 0 ? \` · \${dirtyCount} 件変更\` : ""}
          </Text>
        </div>
        <div className={styles.quickEditorHeaderActions}>
          <Tooltip title="別の要素をピック (Shift+Alt+E)">
            <IconButton aria-label="別の要素をピック" variant="plain" size="small" onClick={onPickAgain}>
              <Icon size="small">
                <LfPaint />
              </Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="閉じる (Esc)">
            <IconButton aria-label="閉じる" variant="plain" size="small" onClick={onClose}>
              <Icon size="small">
                <LfCloseLarge />
              </Icon>
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {showTargetSelector && (
        <FormControl>
          <FormControl.Label>候補ターゲット</FormControl.Label>
          <Select
            options={quickTargetOptions}
            value={selectedTarget.id}
            onChange={(value) => {
              if (value) setSelectedTargetId(value);
            }}
          />
          <FormControl.Caption>[ ] で前後の候補に切替できます</FormControl.Caption>
        </FormControl>
      )}

      {selectedTarget.supportsVariant && (
        <FormControl>
          <FormControl.Label>
            <span className={styles.quickEditorFieldLabel}>
              Variant
              <DirtyDot dirty={isVariantDirty} />
            </span>
          </FormControl.Label>
          <Select
            options={getVariantOptions(selectedTarget.currentVariant)}
            value={quickEditorVariant}
            onChange={(value) => {
              if (value) setQuickEditorVariant(value);
            }}
          />
          {isVariantDirty ? (
            <FormControl.Caption>
              {selectedTarget.currentVariant} → {quickEditorVariant}
            </FormControl.Caption>
          ) : null}
        </FormControl>
      )}

      <FormControl>
        <FormControl.Label>
          <span className={styles.quickEditorFieldLabel}>
            Text
            <DirtyDot dirty={isTextDirty} />
          </span>
        </FormControl.Label>
        <TextField
          value={quickEditorText}
          onChange={(event) => setQuickEditorText(event.currentTarget.value)}
          placeholder={selectedTarget.textValue ?? "テキスト要素なし"}
        />
      </FormControl>

      <CollapsibleSection
        title="Spacing"
        defaultOpen={hasSpacingValue || isGapDirty || isMarginDirty || isPaddingDirty}
        badge={isGapDirty || isMarginDirty || isPaddingDirty ? "変更あり · 即時反映" : "即時反映"}
      >
        <div className={styles.quickEditorSpacingGrid}>
          <FormControl>
            <FormControl.Label>
              <span className={styles.quickEditorFieldLabel}>
                Gap
                <DirtyDot dirty={isGapDirty} />
              </span>
            </FormControl.Label>
            <Select
              size="small"
              options={getSpacingOptions(selectedTarget.gapValue ?? "")}
              value={quickEditorGap || undefined}
              onChange={(value) => {
                if (value) {
                  setQuickEditorGap(value);
                  void updateSpacing(selectedTarget, "gap", value);
                }
              }}
              placeholder="token"
              clearable
              onClear={() => {
                setQuickEditorGap("");
                void updateSpacing(selectedTarget, "gap", "");
              }}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>
              <span className={styles.quickEditorFieldLabel}>
                Margin
                <DirtyDot dirty={isMarginDirty} />
              </span>
            </FormControl.Label>
            <Select
              size="small"
              options={getSpacingOptions(selectedTarget.marginValue ?? "")}
              value={quickEditorMargin || undefined}
              onChange={(value) => {
                if (value) {
                  setQuickEditorMargin(value);
                  void updateSpacing(selectedTarget, "margin", value);
                }
              }}
              placeholder="token"
              clearable
              onClear={() => {
                setQuickEditorMargin("");
                void updateSpacing(selectedTarget, "margin", "");
              }}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>
              <span className={styles.quickEditorFieldLabel}>
                Padding
                <DirtyDot dirty={isPaddingDirty} />
              </span>
            </FormControl.Label>
            <Select
              size="small"
              options={getSpacingOptions(selectedTarget.paddingValue ?? "")}
              value={quickEditorPadding || undefined}
              onChange={(value) => {
                if (value) {
                  setQuickEditorPadding(value);
                  void updateSpacing(selectedTarget, "padding", value);
                }
              }}
              placeholder="token"
              clearable
              onClear={() => {
                setQuickEditorPadding("");
                void updateSpacing(selectedTarget, "padding", "");
              }}
            />
          </FormControl>
        </div>
      </CollapsibleSection>

      {(showPropSection || showIconSection) && (
        <CollapsibleSection
          title="Advanced"
          defaultOpen={isPropDirty || isIconDirty}
          badge={isPropDirty || isIconDirty ? "変更あり" : undefined}
        >
          {showPropSection && (
            <FormControl>
              <FormControl.Label>
                <span className={styles.quickEditorFieldLabel}>
                  Any Prop
                  <DirtyDot dirty={isPropDirty} />
                </span>
              </FormControl.Label>
              <Select
                options={selectedTargetPropOptions}
                value={quickEditorPropPath || undefined}
                onChange={(value) => {
                  if (value) setQuickEditorPropPath(value);
                }}
              />
              <TextField
                value={quickEditorPropValue}
                onChange={(event) => setQuickEditorPropValue(event.currentTarget.value)}
                placeholder={selectedEditableProp?.value ?? "prop value"}
              />
            </FormControl>
          )}
          {showIconSection && (
            <FormControl>
              <FormControl.Label>
                <span className={styles.quickEditorFieldLabel}>
                  Icon
                  <DirtyDot dirty={isIconDirty} />
                </span>
              </FormControl.Label>
              <Select
                options={iconOptions}
                value={quickEditorIconName || undefined}
                onChange={(value) => {
                  if (value) setQuickEditorIconName(value);
                }}
              />
              {isIconDirty ? (
                <FormControl.Caption>
                  {selectedTarget.currentIconName} → {quickEditorIconName}
                </FormControl.Caption>
              ) : null}
            </FormControl>
          )}
        </CollapsibleSection>
      )}

      {variantFeedback && (
        <Text as="p" variant="body.xSmall" color="subtle">
          {variantFeedback}
        </Text>
      )}

      <div className={styles.quickEditorShortcutHint}>
        <kbd className={styles.pickerKbd}>⌘</kbd>
        <kbd className={styles.pickerKbd}>↵</kbd>
        <Text as="span" variant="body.xSmall" color="subtle">
          Apply
        </Text>
        <kbd className={styles.pickerKbd}>⌘⇧</kbd>
        <kbd className={styles.pickerKbd}>↵</kbd>
        <Text as="span" variant="body.xSmall" color="subtle">
          Apply &amp; Next
        </Text>
        <kbd className={styles.pickerKbd}>Esc</kbd>
        <Text as="span" variant="body.xSmall" color="subtle">
          Close
        </Text>
      </div>

      <div className={styles.quickEditorActions}>
        <div className={styles.quickEditorActionsLeft}>
          <Tooltip title="Undo (⌘Z)">
            <IconButton aria-label="Undo" variant="plain" size="small" onClick={onUndo}>
              <Icon size="small">
                <LfArrowBendLeft />
              </Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Redo (⌘⇧Z)">
            <IconButton aria-label="Redo" variant="plain" size="small" onClick={onRedo}>
              <Icon size="small">
                <LfArrowBendRight />
              </Icon>
            </IconButton>
          </Tooltip>
        </div>
        <div className={styles.quickEditorActionSpacer} />
        <Button size="small" variant="subtle" disabled={isApplying} onClick={() => void onApply(true)}>
          Apply &amp; Next
        </Button>
        <Button size="small" variant="solid" disabled={isApplying} onClick={() => void onApply(false)}>
          Apply
        </Button>
      </div>
    </div>
  );
};
`;export{e as default};