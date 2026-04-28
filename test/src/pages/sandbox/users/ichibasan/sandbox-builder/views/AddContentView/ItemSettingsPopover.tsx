import { LfMinusLarge, LfPlusLarge, LfSetting, LfTrash } from "@legalforce/aegis-icons";
import {
  ActionList,
  Badge,
  Button,
  Checkbox,
  Combobox,
  DateField,
  Divider,
  Draggable,
  Icon,
  IconButton,
  Link,
  Popover,
  SegmentedControl,
  Select,
  Tab,
  TagPicker,
  Text,
  Textarea,
  TextField,
  TimeField,
  Tooltip,
} from "@legalforce/aegis-react";
import React, { useRef, useState } from "react";
import type { ContentArea } from "../../types";
import {
  COMPONENT_FIELD_CONFIG,
  DISABLED_INNER_TABS,
  POPOVER_MIN_HEIGHTS,
  POPOVER_WIDTHS,
  STORYBOOK_URLS,
} from "./componentConfig";
import { COMPONENT_REGISTRY } from "./componentRegistry";
import { ICON_OPTIONS } from "./fieldConfig/icons";
import type { ComponentKey, ContentItem } from "./types";

const getLabel = (key: ComponentKey): string => COMPONENT_REGISTRY.find((r) => r.key === key)?.label ?? key;

const renderTooltipIconButton = (
  title: string,
  icon: React.ReactNode,
  props: React.ComponentProps<typeof IconButton>,
): React.ReactElement => (
  <Tooltip title={title} placement="top">
    <IconButton {...props} aria-label={props["aria-label"] ?? title}>
      {icon}
    </IconButton>
  </Tooltip>
);

type ColOrderItem = { id: string; label: string };

function ColumnOrderEditorField({
  isIndented,
  itemProps,
  onUpdate,
}: {
  isIndented: boolean;
  itemProps: Record<string, string>;
  onUpdate: (props: Record<string, string>) => void;
}) {
  const colCount = Math.min(Math.max(parseInt(itemProps.colItems ?? "5", 10), 2), 20);
  const getColLabel = (idx: number) => itemProps[`col${idx}_colTitle`] ?? `Col ${idx + 1}`;

  const defaultOrder = (): ColOrderItem[] =>
    Array.from({ length: colCount }, (_, i) => ({ id: `col${i}`, label: getColLabel(i) }));

  const order = (): ColOrderItem[] => {
    const stored = itemProps.columnOrderList;
    if (stored) {
      const ids = stored
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (ids.length === colCount) {
        return ids.map((id) => {
          const idx = parseInt(id.replace("col", ""), 10);
          return { id, label: getColLabel(idx) };
        });
      }
    }
    return defaultOrder();
  };

  const items = order();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--aegis-space-xSmall)",
      }}
    >
      <div style={{ flex: "1 1 0%", minWidth: 0 }}>
        <div style={{ paddingLeft: isIndented ? "var(--aegis-space-medium)" : undefined }}>
          <Text variant="label.small" color="subtle">
            Column Order
          </Text>
        </div>
      </div>
      <div style={{ flex: "1 1 0%", minWidth: 0, display: "flex", alignItems: "center" }}>
        <Popover placement="right" closeButton={false}>
          <Popover.Anchor>
            <Button size="small" variant="subtle" width="full">
              Edit
            </Button>
          </Popover.Anchor>
          <Popover.Content style={{ width: "var(--aegis-layout-width-x4Small)" }}>
            <Popover.Body>
              <Draggable
                values={items}
                onReorder={(values) => {
                  onUpdate({ ...itemProps, columnOrderList: (values as ColOrderItem[]).map((v) => v.id).join(",") });
                }}
              >
                {items.map((item) => (
                  <Draggable.Item key={item.id} id={item.id}>
                    {item.label}
                  </Draggable.Item>
                ))}
              </Draggable>
            </Popover.Body>
          </Popover.Content>
        </Popover>
      </div>
    </div>
  );
}

/** aegis-react の Time と同一シェイプのローカルクラス（deep import 回避） */
class AegisTime {
  readonly hours: number;
  readonly minutes: number;
  constructor(hours: number = 0, minutes: number = 0) {
    this.hours = hours;
    this.minutes = minutes;
  }
}

/** "HH:MM" → AegisTime。不正値の場合は null */
const strToTime = (raw: string | undefined): AegisTime | null => {
  if (!raw) return null;
  const [h, m] = raw.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return new AegisTime(h, m);
};
/** AegisTime → "HH:MM" */
const timeToStr = (time: AegisTime | null | undefined): string =>
  time ? `${String(time.hours).padStart(2, "0")}:${String(time.minutes).padStart(2, "0")}` : "";

/** "YYYY-MM-DD" / "today" → Date。null の場合は null を返す */
const strToDate = (raw: string | undefined): Date | null => {
  if (!raw || raw === "today") return new Date();
  const [y, m, d] = raw.split("-").map(Number);
  return new Date(y, m - 1, d);
};
/** Date → "YYYY-MM-DD" */
const dateToStr = (date: Date | null | undefined): string =>
  date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    : "";

// サブコンポーネント設定 Popover（"button" タイプフィールド用）
// ※ "size" は footer sub-popover では表示したいため除外しない。
//   Leading/Trailing IconButton のサイズ固定は excludedSubKeys で個別に制御。
const EXCLUDED_SUB = new Set(["loading", "minWidth", "withoutContent"]);

// サブポップオーバーが開いたとき親ポップオーバーに通知するコンテキスト
const SubPopoverContext = React.createContext<((key: string, open: boolean) => void) | null>(null);

interface SubItemPopoverProps {
  fieldKey: string;
  fieldLabel: string;
  isIndented: boolean;
  subComp: ComponentKey;
  itemProps: Record<string, string>;
  onUpdate: (props: Record<string, string>) => void;
  /** typography-select 時: textType の選択肢をこの配列に絞り込む */
  allowedTextTypes?: string[];
  /** 指定すると、そのタブのフィールドのみ表示（タブバー自体も非表示）*/
  onlyTab?: string;
  /** サブポップオーバー内でこのキーのフィールドを非表示にする（例: ["size"]）*/
  excludedSubKeys?: string[];
}

const SubItemPopover = ({
  fieldKey,
  fieldLabel,
  isIndented,
  subComp,
  itemProps,
  onUpdate,
  allowedTextTypes,
  onlyTab,
  excludedSubKeys,
}: SubItemPopoverProps): React.ReactElement => {
  const rawSubFields = (COMPONENT_FIELD_CONFIG[subComp] ?? []).filter(
    (sf) => !EXCLUDED_SUB.has(sf.key) && !excludedSubKeys?.includes(sf.key),
  );

  // textType 選択肢を絞り込む（typography-select 用）
  // allowedTextTypes が1種類のみの場合は textType select 自体を非表示にし、
  // インデントフィールドのインデントも解除する（textType が親として存在しないため）
  const singleType = allowedTextTypes?.length === 1;
  const restrictedFields =
    allowedTextTypes && subComp === "Text"
      ? rawSubFields
          .filter((sf) => !(sf.key === "textType" && singleType))
          .map((sf) => {
            if (sf.key === "textType")
              return {
                ...sf,
                options: (sf as { options?: string[] }).options?.filter((o) => allowedTextTypes.includes(o)),
              };
            if (singleType && sf.indent) return { ...sf, indent: false };
            return sf;
          })
      : rawSubFields;

  // 特定タブのみ表示する（typography-select は Properties のみ）
  const subFields = onlyTab ? restrictedFields.filter((sf) => !sf.tab || sf.tab === onlyTab) : restrictedFields;

  const subInnerTabs = [...new Set(subFields.filter((f) => f.tab).map((f) => f.tab as string))];
  // onlyTab 指定時やタブが1種類しかない場合はタブバーを非表示
  const hasSubInnerTabs = subInnerTabs.length > 1;
  const [subInnerTabIndex, setSubInnerTabIndex] = useState(0);
  const activeSubInnerTab = hasSubInnerTabs ? subInnerTabs[subInnerTabIndex] : null;
  const visibleSubFields = hasSubInnerTabs ? subFields.filter((sf) => sf.tab === activeSubInnerTab) : subFields;

  const prefix = `${fieldKey}_`;
  const subProps = Object.fromEntries(
    Object.entries(itemProps)
      .filter(([k]) => k.startsWith(prefix))
      .map(([k, v]) => [k.slice(prefix.length), v]),
  );

  // 常に最新の itemProps にアクセスできるよう ref に保持（stale closure 防止）
  const itemPropsRef = useRef(itemProps);
  itemPropsRef.current = itemProps;

  // デフォルトから変更があるかを判定（badge インジケーター用）
  const hasSubChanges = Object.keys(subProps).some((k) => {
    const field = rawSubFields.find((sf) => sf.key === k);
    const def = field?.defaultValue ?? (field?.type === "checkbox" ? "false" : "");
    return subProps[k] !== def;
  });

  const parentNotify = React.useContext(SubPopoverContext);
  const [openChildKeys, setOpenChildKeys] = useState<Set<string>>(new Set());
  const hasOpenChild = openChildKeys.size > 0;
  const handleChildOpenChange = (key: string, open: boolean) => {
    setOpenChildKeys((prev) => {
      const next = new Set(prev);
      open ? next.add(key) : next.delete(key);
      return next;
    });
  };

  const handleSubUpdate = (newSub: Record<string, string>) => {
    const latestItemProps = itemPropsRef.current;
    const next = { ...latestItemProps };
    Object.keys(next)
      .filter((k) => k.startsWith(prefix))
      .forEach((k) => {
        delete next[k];
      });
    if (Object.keys(newSub).length > 0) {
      // 最新の sub-props と newSub をマージして、stale closure による変更欠損を防ぐ
      const latestSub = Object.fromEntries(
        Object.entries(latestItemProps)
          .filter(([k]) => k.startsWith(prefix))
          .map(([k, v]) => [k.slice(prefix.length), v]),
      );
      Object.entries({ ...latestSub, ...newSub }).forEach(([k, v]) => {
        next[`${prefix}${k}`] = v;
      });
    }
    // newSub が空（Reset）の場合はプレフィックスキーを削除したままにする
    onUpdate(next);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
      <div style={{ flex: "1 1 0%", minWidth: 0 }}>
        <div style={{ paddingLeft: isIndented ? "var(--aegis-space-medium)" : undefined }}>
          <Text variant="label.small" color={isIndented ? "subtle" : undefined}>
            {fieldLabel}
          </Text>
        </div>
      </div>
      <div style={{ flex: "1 1 0%", minWidth: 0, display: "flex", alignItems: "center" }}>
        <Popover
          placement="right"
          closeButton={false}
          onOpenChange={(open) => {
            if (!open) setOpenChildKeys(new Set());
            parentNotify?.(fieldKey, open);
          }}
        >
          <Popover.Anchor>
            <Button
              size="small"
              variant="subtle"
              width="full"
              leading={hasSubChanges ? <Badge color="information" /> : undefined}
            >
              Edit
            </Button>
          </Popover.Anchor>
          <Popover.Content style={{ width: "var(--aegis-layout-width-x4Small)" }}>
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                flexBasis: "auto",
                minHeight: 0,
              }}
            >
              {hasOpenChild && <div style={{ position: "absolute", inset: 0, zIndex: 9999 }} />}
              {hasSubInnerTabs && (
                <Popover.Header>
                  <div>
                    <div style={{ paddingBlock: "var(--aegis-space-xxSmall)" }}>
                      <SegmentedControl
                        index={subInnerTabIndex}
                        onChange={setSubInnerTabIndex}
                        variant="solid"
                        size="xSmall"
                        style={{ width: "100%" }}
                      >
                        {subInnerTabs.map((tab) => (
                          <SegmentedControl.Button key={tab}>{tab}</SegmentedControl.Button>
                        ))}
                      </SegmentedControl>
                    </div>
                  </div>
                </Popover.Header>
              )}
              {hasSubInnerTabs && <Divider />}
              <Popover.Body
                style={{
                  maxHeight: "var(--aegis-layout-width-x3Small)",
                  minHeight: "var(--aegis-layout-width-x5Small)",
                  overflowY: "auto",
                }}
              >
                <SubPopoverContext.Provider value={handleChildOpenChange}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-medium)",
                      width: "100%",
                      paddingBlock: "var(--aegis-space-x3Small)",
                    }}
                  >
                    {visibleSubFields.map((sf) => {
                      if (sf.visibleWhen && !sf.visibleWhen(subProps)) return null;
                      const sfType = sf.type ?? "select";
                      const sfValue = subProps[sf.key] ?? sf.defaultValue;
                      const sfDisabled = sf.disabledWhen?.(subProps) ?? false;
                      const sfLabel = sf.labelWhen?.(subProps) ?? sf.label;
                      const sfParentKeyExcluded =
                        sf.indentParentKey != null && excludedSubKeys?.includes(sf.indentParentKey);
                      const sfIndented = sf.indent === true && !sfParentKeyExcluded;
                      const sfLabelEl = (
                        <div style={{ flex: "1 1 0%", minWidth: 0 }}>
                          <div style={{ paddingLeft: sfIndented ? "var(--aegis-space-medium)" : undefined }}>
                            <Text
                              variant="label.small"
                              color={sfDisabled ? "disabled" : sfIndented ? "subtle" : undefined}
                            >
                              {sfLabel}
                            </Text>
                          </div>
                        </div>
                      );
                      if (sfType === "divider") {
                        return <Divider key={sf.key} />;
                      }
                      if (sfType === "stepper") {
                        const sfStep = Math.min(Math.max(parseInt(sfValue ?? "3", 10) || 1, sf.min ?? 1), sf.max ?? 20);
                        return (
                          <div
                            key={sf.key}
                            style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}
                          >
                            {sfLabelEl}
                            <div
                              style={{
                                flex: "1 1 0%",
                                minWidth: 0,
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--aegis-space-xSmall)",
                              }}
                            >
                              {renderTooltipIconButton(
                                "減らす",
                                <Icon>
                                  <LfMinusLarge />
                                </Icon>,
                                {
                                  variant: "subtle",
                                  size: "xSmall",
                                  "aria-label": "減らす",
                                  disabled: sfStep <= (sf.min ?? 1),
                                  onClick: () => handleSubUpdate({ ...subProps, [sf.key]: String(sfStep - 1) }),
                                },
                              )}
                              <Text variant="data.medium" style={{ minWidth: "2em", textAlign: "center" }}>
                                {sfStep}
                              </Text>
                              {renderTooltipIconButton(
                                "増やす",
                                <Icon>
                                  <LfPlusLarge />
                                </Icon>,
                                {
                                  variant: "subtle",
                                  size: "xSmall",
                                  "aria-label": "増やす",
                                  disabled: sfStep >= (sf.max ?? 20),
                                  onClick: () => handleSubUpdate({ ...subProps, [sf.key]: String(sfStep + 1) }),
                                },
                              )}
                            </div>
                          </div>
                        );
                      }
                      if (sfType === "button" || sfType === "typography-select") {
                        const innerSubComp = (sf.subComponentGetter?.(subProps) ?? sf.subComponent) as
                          | ComponentKey
                          | undefined;
                        if (!innerSubComp) return null;
                        return (
                          <SubItemPopover
                            key={sf.key}
                            fieldKey={sf.key}
                            fieldLabel={sfLabel}
                            isIndented={sfIndented}
                            subComp={innerSubComp}
                            itemProps={subProps}
                            onUpdate={handleSubUpdate}
                            allowedTextTypes={sf.allowedTextTypes}
                            onlyTab={sf.onlyTab ?? (sfType === "typography-select" ? "Properties" : undefined)}
                            excludedSubKeys={sf.excludedSubKeys}
                          />
                        );
                      }
                      return (
                        <div
                          key={sf.key}
                          style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}
                        >
                          {sfLabelEl}
                          <div style={{ flex: "1 1 0%", minWidth: 0, display: "flex", alignItems: "center" }}>
                            {sfType === "checkbox" ? (
                              <Checkbox
                                size="small"
                                checked={sfValue === "true"}
                                disabled={sfDisabled}
                                onChange={(e) =>
                                  handleSubUpdate({
                                    ...subProps,
                                    [sf.key]: String((e.target as HTMLInputElement).checked),
                                  })
                                }
                              />
                            ) : sfType === "textfield" ? (
                              <TextField
                                aria-label={sf.label}
                                size="small"
                                placeholder={sf.placeholder ?? ""}
                                value={sfValue ?? ""}
                                disabled={sfDisabled}
                                onChange={(e) =>
                                  handleSubUpdate({ ...subProps, [sf.key]: (e.target as HTMLInputElement).value })
                                }
                                style={{ width: "100%" }}
                              />
                            ) : sfType === "textarea" ? (
                              <Textarea
                                aria-label={sf.label}
                                placeholder={sf.placeholder ?? ""}
                                value={sfValue ?? ""}
                                disabled={sfDisabled}
                                onChange={(e) =>
                                  handleSubUpdate({ ...subProps, [sf.key]: (e.target as HTMLTextAreaElement).value })
                                }
                                style={{ width: "100%" }}
                              />
                            ) : sfType === "combobox" ? (
                              <Combobox
                                aria-label={sf.label}
                                // biome-ignore lint/suspicious/noExplicitAny: "small" is not in the type but renders correctly for compact UI
                                size={"small" as any}
                                placeholder={sf.placeholder ?? "Select"}
                                value={sfValue ?? ""}
                                disabled={sfDisabled}
                                onChange={(value) => handleSubUpdate({ ...subProps, [sf.key]: value as string })}
                                options={
                                  (sf as { options?: string[] }).options?.map((o) => ({ label: o, value: o })) ?? []
                                }
                                style={{ width: "100%" }}
                              />
                            ) : sfType === "icon-combobox" ? (
                              <Combobox
                                aria-label={sf.label}
                                // biome-ignore lint/suspicious/noExplicitAny: "small" is not in the type but renders correctly for compact UI
                                size={"small" as any}
                                placeholder="Select Icon"
                                // biome-ignore lint/suspicious/noExplicitAny: icon name union is too strict for dynamic values
                                value={(sfValue ?? "LfPlusLarge") as any}
                                disabled={sfDisabled}
                                onChange={(value) => handleSubUpdate({ ...subProps, [sf.key]: value as string })}
                                options={ICON_OPTIONS}
                                style={{ width: "100%" }}
                              />
                            ) : sfType === "icon" ? (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "var(--aegis-space-small)",
                                  width: "100%",
                                }}
                              >
                                <Checkbox
                                  size="small"
                                  checked={!!sfValue && !sfDisabled}
                                  disabled={sfDisabled}
                                  onChange={(e) => {
                                    const en = (e.target as HTMLInputElement).checked;
                                    handleSubUpdate({ ...subProps, [sf.key]: en ? "LfPlusLarge" : "" });
                                  }}
                                />
                                <Combobox
                                  aria-label={sf.label}
                                  // biome-ignore lint/suspicious/noExplicitAny: "small" is not in the type but renders correctly for compact UI
                                  size={"small" as any}
                                  placeholder="Select Icon"
                                  // biome-ignore lint/suspicious/noExplicitAny: icon name union is too strict for dynamic values
                                  value={(sfValue || "LfPlusLarge") as any}
                                  disabled={sfDisabled}
                                  onChange={(value) => handleSubUpdate({ ...subProps, [sf.key]: value as string })}
                                  options={ICON_OPTIONS}
                                  style={{ flex: 1, minWidth: 0 }}
                                />
                              </div>
                            ) : sfType === "datefield" ? (
                              <DateField
                                aria-label={sf.label}
                                value={strToDate(sfValue)}
                                disabled={sfDisabled}
                                onChange={(date) => handleSubUpdate({ ...subProps, [sf.key]: dateToStr(date) })}
                                style={{ width: "100%" }}
                              />
                            ) : sfType === "timefield" ? (
                              <TimeField
                                aria-label={sf.label}
                                value={strToTime(sfValue)}
                                disabled={sfDisabled}
                                onChange={(time) => handleSubUpdate({ ...subProps, [sf.key]: timeToStr(time) })}
                                style={{ width: "100%" }}
                              />
                            ) : (
                              <Select
                                aria-label={sf.label}
                                // biome-ignore lint/suspicious/noExplicitAny: "small" is not in the type but renders correctly for compact UI
                                size={"small" as any}
                                placeholder="Select"
                                value={sfValue}
                                onChange={(value) => handleSubUpdate({ ...subProps, [sf.key]: value as string })}
                                options={
                                  (sf as { options?: string[] }).options?.map((o) => ({ label: o, value: o })) ?? []
                                }
                                style={{ width: "100%" }}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </SubPopoverContext.Provider>
              </Popover.Body>
              <Divider />
              <Popover.Footer>
                <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                  <Button size="xSmall" variant="gutterless" weight="normal" onClick={() => handleSubUpdate({})}>
                    Reset
                  </Button>
                </div>
              </Popover.Footer>
            </div>
          </Popover.Content>
        </Popover>
      </div>
    </div>
  );
};

interface Props {
  component: ComponentKey;
  itemProps?: Record<string, string>;
  itemId?: string;
  area?: ContentArea;
  onUpdate: (props: Record<string, string>) => void;
  onOpenChange?: (open: boolean) => void;
  /** 配置タブ用（Header エリアのみ使用） */
  allItems?: ContentItem[];
  onReorder?: (items: ContentItem[]) => void;
  onRemove?: (id: string) => void;
  popoverPlacement?:
    | "top"
    | "top-start"
    | "top-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end"
    | "right"
    | "right-start"
    | "right-end";
}

export const ItemSettingsPopover = ({
  component,
  itemProps = {},
  itemId,
  area,
  onUpdate,
  onOpenChange,
  allItems,
  onReorder,
  onRemove,
  popoverPlacement = "right",
}: Props): React.ReactElement => {
  const fields = COMPONENT_FIELD_CONFIG[component];
  const contentRef = useRef<HTMLDivElement>(null);

  // colContent が変わったとき、そのカラムの leading/trailing 設定を cascade clear する
  const handleUpdate = (newProps: Record<string, string>) => {
    // editTarget が変更されたら対応するタブにスクロール
    if (newProps.editTarget && newProps.editTarget !== itemProps.editTarget && component === "Tabs") {
      const match = newProps.editTarget.match(/^Item-(\d+)$/);
      if (match) {
        const tabIndex = parseInt(match[1], 10) - 1;
        // 少し遅延してスクロール（DOM更新を待つ）
        setTimeout(() => {
          const tabElement = document.querySelector(
            `[data-item-id="${itemId}"] [data-tab-index="${tabIndex}"]`,
          ) as HTMLElement;
          if (tabElement) {
            tabElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }, 0);
      }
    }

    const changedColContent = Object.keys(newProps).find(
      (k) => k.endsWith("_colContent") && newProps[k] !== itemProps[k],
    );
    if (changedColContent) {
      const colPrefix = changedColContent.slice(0, changedColContent.lastIndexOf("_colContent") + 1);
      const cleared = Object.fromEntries(
        Object.entries(newProps).filter(
          ([k]) => !k.startsWith(`${colPrefix}leading`) && !k.startsWith(`${colPrefix}trailing`),
        ),
      );
      onUpdate(cleared);
      return;
    }
    onUpdate(newProps);
  };

  const hasSettings = !!(fields && fields.length > 0);
  const hasPosition = !!(allItems && allItems.length > 1 && onReorder);
  const storybookUrl = STORYBOOK_URLS[component];
  const popoverWidth = POPOVER_WIDTHS[component] ?? "var(--aegis-layout-width-x4Small)";
  // コンポーネント指定がなければデフォルト (x4Small = 320px)、false なら min-height なし
  const rawMinHeight =
    component in POPOVER_MIN_HEIGHTS ? POPOVER_MIN_HEIGHTS[component] : "var(--aegis-layout-width-x4Small)";
  const popoverMinHeight = rawMinHeight === false ? undefined : rawMinHeight;
  const [openChildKeys, setOpenChildKeys] = useState<Set<string>>(new Set());
  const hasOpenChild = openChildKeys.size > 0;
  const handleChildOpenChange = (key: string, open: boolean) => {
    console.log(`[ItemSettingsPopover] handleChildOpenChange key=${key} open=${open}`);
    setOpenChildKeys((prev) => {
      const next = new Set(prev);
      open ? next.add(key) : next.delete(key);
      console.log(`[ItemSettingsPopover] openChildKeys size=${next.size}`);
      return next;
    });
  };

  // 統合タブ: フィールドタブ（Properties / Content など） + In Use（2件以上のとき）
  const fieldInnerTabs = fields ? [...new Set(fields.filter((f) => f.tab).map((f) => f.tab as string))] : [];
  const allTabs = hasPosition ? [...fieldInnerTabs, "In Use"] : fieldInnerTabs;
  const hasAnyTabs = allTabs.length > 0;
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // props の状態に応じて disabled にするタブ名を取得（"In Use" タブは対象外）
  const disabledInnerTabs = DISABLED_INNER_TABS[component]?.(itemProps) ?? [];
  // 現在選択中のタブが disabled になった場合、最初の非 disabled タブに自動リセット
  const safeActiveTabIndex = disabledInnerTabs.includes(allTabs[activeTabIndex] ?? "")
    ? allTabs.findIndex((t) => !disabledInnerTabs.includes(t))
    : activeTabIndex;

  const activeTab = hasAnyTabs ? allTabs[safeActiveTabIndex] : null;
  const isInUseTab = activeTab === "In Use";
  const visibleFields =
    fieldInnerTabs.length > 0 && !isInUseTab ? (fields ?? []).filter((f) => f.tab === activeTab) : (fields ?? []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    if (!contentRef.current) return;
    const focusable = Array.from(
      contentRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  if (!hasSettings && !hasPosition && !storybookUrl) {
    return renderTooltipIconButton(
      "Settings",
      <Icon>
        <LfSetting />
      </Icon>,
      { variant: "plain", size: "xSmall", "aria-label": "Settings", disabled: true },
    );
  }

  const startItems = allItems?.filter((i) => (i.slot ?? "start") === "start") ?? [];
  const endItems = allItems?.filter((i) => i.slot === "end") ?? [];
  const handleStartReorder = (newStart: ContentItem[]) => onReorder?.([...newStart, ...endItems]);
  const handleEndReorder = (newEnd: ContentItem[]) => onReorder?.([...startItems, ...newEnd]);

  return (
    <Popover
      placement={popoverPlacement}
      closeButton={false}
      onOpenChange={(open) => {
        if (!open) setOpenChildKeys(new Set());
        onOpenChange?.(open);
      }}
    >
      <Popover.Anchor>
        {renderTooltipIconButton(
          "Settings",
          <Icon>
            <LfSetting />
          </Icon>,
          { variant: "plain", size: "xSmall", "aria-label": "Settings" },
        )}
      </Popover.Anchor>
      <Popover.Content
        // biome-ignore lint/suspicious/noExplicitAny: popoverWidth is dynamically resolved from config as string
        width={popoverWidth as any}
        style={{ minHeight: "var(--aegis-layout-height-x2Small)" }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            flexBasis: "auto",
            minHeight: 0,
          }}
        >
          {hasOpenChild && <div style={{ position: "absolute", inset: 0, zIndex: 9999 }} />}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: focus trap keyboard handler for managing tab order within the popover */}
          <div role="presentation" ref={contentRef} onKeyDown={handleKeyDown} style={{ display: "contents" }}>
            {hasAnyTabs && (
              <Popover.Header>
                <SegmentedControl
                  index={safeActiveTabIndex}
                  onChange={setActiveTabIndex}
                  variant="solid"
                  size="xSmall"
                  style={{ width: "100%" }}
                >
                  {allTabs.map((tab) => (
                    <SegmentedControl.Button key={tab} disabled={tab !== "In Use" && disabledInnerTabs.includes(tab)}>
                      {tab}
                    </SegmentedControl.Button>
                  ))}
                </SegmentedControl>
              </Popover.Header>
            )}
            {hasAnyTabs && <Divider />}
            <Popover.Body
              style={{ maxHeight: "var(--aegis-layout-width-x3Small)", minHeight: popoverMinHeight, overflowY: "auto" }}
            >
              <SubPopoverContext.Provider value={handleChildOpenChange}>
                <div>
                  {!isInUseTab ? (
                    hasSettings ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--aegis-space-medium)",
                          ...(popoverWidth === "auto"
                            ? { minWidth: "calc(var(--aegis-layout-width-x5Small) + var(--aegis-size-medium))" }
                            : { width: popoverWidth }),
                          paddingBlock: "var(--aegis-space-x3Small)",
                          ...(fieldInnerTabs.length > 0 && popoverMinHeight ? { minHeight: popoverMinHeight } : {}),
                        }}
                      >
                        {(() => {
                          // colScoped context（DataTable のカラム別フィールド用）
                          const colItemsCount = Math.min(Math.max(parseInt(itemProps.colItems ?? "5", 10), 2), 20);
                          const activeColIdx = Math.min(parseInt(itemProps._activeCol ?? "0", 10), colItemsCount - 1);
                          const colPrefix = `col${activeColIdx}_`;
                          const colScopedVirtual = {
                            ...Object.fromEntries(
                              Object.entries(itemProps)
                                .filter(([k]) => k.startsWith(colPrefix))
                                .map(([k, v]) => [k.slice(colPrefix.length), v]),
                            ),
                            // DataTable グローバル値を注入（colScoped の visibleWhen / optionsGetter で参照可能にする）
                            rowItems: itemProps.rowItems ?? "10",
                          };

                          // toolbar scope（Toolbar の per-group / per-item フィールド用）
                          const tbGroups = Math.min(Math.max(parseInt(itemProps.groups ?? "2", 10), 1), 5);
                          const tbActiveGroup = Math.min(parseInt(itemProps._activeGroup ?? "0", 10), tbGroups - 1);
                          const tbGroupPrefix = `group${tbActiveGroup}_`;
                          const tbGroupItems = Math.min(
                            Math.max(parseInt(itemProps[`${tbGroupPrefix}items`] ?? "3", 10), 1),
                            10,
                          );
                          const tbActiveItem = Math.min(
                            parseInt(itemProps[`${tbGroupPrefix}activeItem`] ?? "0", 10),
                            tbGroupItems - 1,
                          );
                          const tbItemPrefix = `${tbGroupPrefix}item${tbActiveItem}_`;
                          const groupScopedVirtual = Object.fromEntries(
                            Object.entries(itemProps)
                              .filter(([k]) => k.startsWith(tbGroupPrefix))
                              .map(([k, v]) => [k.slice(tbGroupPrefix.length), v]),
                          );
                          const itemScopedVirtual = Object.fromEntries(
                            Object.entries(itemProps)
                              .filter(([k]) => k.startsWith(tbItemPrefix))
                              .map(([k, v]) => [k.slice(tbItemPrefix.length), v]),
                          );

                          return visibleFields.map((field) => {
                            const isColScoped = field.colScoped === true;
                            const isGroupScoped = field.groupScoped === true;
                            const isItemScoped = field.itemScoped === true;
                            const effectiveProps = isColScoped
                              ? colScopedVirtual
                              : isItemScoped
                                ? itemScopedVirtual
                                : isGroupScoped
                                  ? groupScopedVirtual
                                  : itemProps;
                            const propsForVisibility = area ? { ...effectiveProps, __area: area } : effectiveProps;
                            if (field.visibleWhen && !field.visibleWhen(propsForVisibility)) return null;
                            const fieldType = field.type ?? "select";
                            const resolvedKey = isColScoped
                              ? `${colPrefix}${field.key}`
                              : isItemScoped
                                ? `${tbItemPrefix}${field.key}`
                                : isGroupScoped
                                  ? `${tbGroupPrefix}${field.key}`
                                  : field.key;
                            const controlValue =
                              itemProps[resolvedKey] ?? field.defaultValueGetter?.(itemProps) ?? field.defaultValue;
                            const isDisabled = field.disabledWhen?.(effectiveProps) ?? false;
                            const fieldLabel = field.labelWhen?.(effectiveProps) ?? field.label;
                            const iconValue = fieldType === "icon" ? controlValue || "LfPlusLarge" : undefined;
                            const isIndented = field.indent === true;

                            if (fieldType === "divider") {
                              return <Divider key={field.key} />;
                            }
                            if (fieldType === "col-segmenter") {
                              const segCount = Math.min(Math.max(parseInt(itemProps.colItems ?? "5", 10), 2), 20);
                              const segActive = Math.min(parseInt(itemProps._activeCol ?? "0", 10), segCount - 1);
                              const handleColChange = (i: number) => {
                                handleUpdate({ ...itemProps, _activeCol: String(i) });
                                if (!itemId) return;
                                requestAnimationFrame(() => {
                                  const headers = document.querySelectorAll(
                                    `[data-item-id="${itemId}"] [role="columnheader"]`,
                                  );
                                  headers[i]?.scrollIntoView({
                                    behavior: "smooth",
                                    inline: "nearest",
                                    block: "nearest",
                                  });
                                });
                              };
                              return (
                                <div key={field.key} style={{ paddingTop: "var(--aegis-space-medium)" }}>
                                  <Tab.Group index={segActive} onChange={handleColChange} size="small">
                                    <Tab.List bordered overflowBehavior="scroll">
                                      {Array.from({ length: segCount }, (_, i) => (
                                        // biome-ignore lint/suspicious/noArrayIndexKey: stable sequential column tabs, order never changes
                                        <Tab key={`col-${i}`}>Col {i + 1}</Tab>
                                      ))}
                                    </Tab.List>
                                  </Tab.Group>
                                </div>
                              );
                            }
                            if (fieldType === "toolbar-group-segmenter") {
                              const handleGroupChange = (i: number) => {
                                handleUpdate({ ...itemProps, _activeGroup: String(i) });
                              };
                              return (
                                <div key={field.key} style={{ paddingTop: "var(--aegis-space-medium)" }}>
                                  <Tab.Group index={tbActiveGroup} onChange={handleGroupChange} size="small">
                                    <Tab.List bordered overflowBehavior="scroll">
                                      {Array.from({ length: tbGroups }, (_, i) => (
                                        // biome-ignore lint/suspicious/noArrayIndexKey: stable sequential group tabs, order never changes
                                        <Tab key={`group-${i}`}>Group-{i + 1}</Tab>
                                      ))}
                                    </Tab.List>
                                  </Tab.Group>
                                </div>
                              );
                            }
                            if (fieldType === "toolbar-item-segmenter") {
                              const handleItemChange = (i: number) => {
                                handleUpdate({ ...itemProps, [`${tbGroupPrefix}activeItem`]: String(i) });
                              };
                              return (
                                <div key={field.key} style={{ paddingTop: "var(--aegis-space-medium)" }}>
                                  <Tab.Group index={tbActiveItem} onChange={handleItemChange} size="small">
                                    <Tab.List bordered overflowBehavior="scroll">
                                      {Array.from({ length: tbGroupItems }, (_, i) => (
                                        // biome-ignore lint/suspicious/noArrayIndexKey: stable sequential item tabs, order never changes
                                        <Tab key={`item-${i}`}>Item-{i + 1}</Tab>
                                      ))}
                                    </Tab.List>
                                  </Tab.Group>
                                </div>
                              );
                            }
                            if (fieldType === "toolbar-group-items-editor") {
                              return (
                                <React.Fragment key={field.key}>
                                  {Array.from({ length: tbGroups }, (_, gi) => gi).map((gi) => {
                                    const gItemsKey = `group${gi}_items`;
                                    const gItems = Math.min(Math.max(parseInt(itemProps[gItemsKey] ?? "3", 10), 1), 5);
                                    return (
                                      <div
                                        key={`group-${gi}`}
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "var(--aegis-space-xSmall)",
                                        }}
                                      >
                                        <div style={{ flex: "1 1 0%", minWidth: 0 }}>
                                          <div style={{ paddingLeft: "var(--aegis-space-medium)" }}>
                                            <Text variant="label.small" color="subtle">
                                              Group-{gi + 1}
                                            </Text>
                                          </div>
                                        </div>
                                        <div
                                          style={{
                                            flex: "1 1 0%",
                                            minWidth: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "var(--aegis-space-xSmall)",
                                          }}
                                        >
                                          {renderTooltipIconButton(
                                            "減らす",
                                            <Icon>
                                              <LfMinusLarge />
                                            </Icon>,
                                            {
                                              variant: "subtle",
                                              size: "xSmall",
                                              "aria-label": "減らす",
                                              disabled: gItems <= 1,
                                              onClick: () =>
                                                handleUpdate({ ...itemProps, [gItemsKey]: String(gItems - 1) }),
                                            },
                                          )}
                                          <Text variant="data.medium" style={{ minWidth: "2em", textAlign: "center" }}>
                                            {gItems}
                                          </Text>
                                          {renderTooltipIconButton(
                                            "増やす",
                                            <Icon>
                                              <LfPlusLarge />
                                            </Icon>,
                                            {
                                              variant: "subtle",
                                              size: "xSmall",
                                              "aria-label": "増やす",
                                              disabled: gItems >= 5,
                                              onClick: () =>
                                                handleUpdate({ ...itemProps, [gItemsKey]: String(gItems + 1) }),
                                            },
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </React.Fragment>
                              );
                            }
                            if (fieldType === "navlist-group-items-editor") {
                              const nlGroups = Math.min(Math.max(parseInt(itemProps.groups ?? "2", 10), 2), 5);
                              return (
                                <React.Fragment key={field.key}>
                                  {Array.from({ length: nlGroups }, (_, gi) => gi).map((gi) => {
                                    const gItemsKey = `group${gi}_items`;
                                    const gItems = Math.min(Math.max(parseInt(itemProps[gItemsKey] ?? "2", 10), 1), 5);
                                    return (
                                      <div
                                        key={`group-${gi}`}
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "var(--aegis-space-xSmall)",
                                        }}
                                      >
                                        <div style={{ flex: "1 1 0%", minWidth: 0 }}>
                                          <div style={{ paddingLeft: "var(--aegis-space-medium)" }}>
                                            <Text variant="label.small" color="subtle">
                                              Group-{gi + 1}
                                            </Text>
                                          </div>
                                        </div>
                                        <div
                                          style={{
                                            flex: "1 1 0%",
                                            minWidth: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "var(--aegis-space-xSmall)",
                                          }}
                                        >
                                          {renderTooltipIconButton(
                                            "減らす",
                                            <Icon>
                                              <LfMinusLarge />
                                            </Icon>,
                                            {
                                              variant: "subtle",
                                              size: "xSmall",
                                              "aria-label": "減らす",
                                              disabled: gItems <= 1,
                                              onClick: () =>
                                                handleUpdate({ ...itemProps, [gItemsKey]: String(gItems - 1) }),
                                            },
                                          )}
                                          <Text variant="data.medium" style={{ minWidth: "2em", textAlign: "center" }}>
                                            {gItems}
                                          </Text>
                                          {renderTooltipIconButton(
                                            "増やす",
                                            <Icon>
                                              <LfPlusLarge />
                                            </Icon>,
                                            {
                                              variant: "subtle",
                                              size: "xSmall",
                                              "aria-label": "増やす",
                                              disabled: gItems >= 5,
                                              onClick: () =>
                                                handleUpdate({ ...itemProps, [gItemsKey]: String(gItems + 1) }),
                                            },
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </React.Fragment>
                              );
                            }
                            if (fieldType === "sidenavigation-group-items-editor") {
                              const snGroups = Math.min(Math.max(parseInt(itemProps.groups ?? "2", 10), 2), 5);
                              return (
                                <React.Fragment key={field.key}>
                                  {Array.from({ length: snGroups }, (_, gi) => gi).map((gi) => {
                                    const gItemsKey = `group${gi}_items`;
                                    const gItems = Math.min(Math.max(parseInt(itemProps[gItemsKey] ?? "1", 10), 1), 5);
                                    return (
                                      <div
                                        key={`group-${gi}`}
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "var(--aegis-space-xSmall)",
                                        }}
                                      >
                                        <div style={{ flex: "1 1 0%", minWidth: 0 }}>
                                          <div style={{ paddingLeft: "var(--aegis-space-medium)" }}>
                                            <Text variant="label.small" color="subtle">
                                              Group-{gi + 1}
                                            </Text>
                                          </div>
                                        </div>
                                        <div
                                          style={{
                                            flex: "1 1 0%",
                                            minWidth: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "var(--aegis-space-xSmall)",
                                          }}
                                        >
                                          {renderTooltipIconButton(
                                            "減らす",
                                            <Icon>
                                              <LfMinusLarge />
                                            </Icon>,
                                            {
                                              variant: "subtle",
                                              size: "xSmall",
                                              "aria-label": "減らす",
                                              disabled: gItems <= 1,
                                              onClick: () =>
                                                handleUpdate({ ...itemProps, [gItemsKey]: String(gItems - 1) }),
                                            },
                                          )}
                                          <Text variant="data.medium" style={{ minWidth: "2em", textAlign: "center" }}>
                                            {gItems}
                                          </Text>
                                          {renderTooltipIconButton(
                                            "増やす",
                                            <Icon>
                                              <LfPlusLarge />
                                            </Icon>,
                                            {
                                              variant: "subtle",
                                              size: "xSmall",
                                              "aria-label": "増やす",
                                              disabled: gItems >= 5,
                                              onClick: () =>
                                                handleUpdate({ ...itemProps, [gItemsKey]: String(gItems + 1) }),
                                            },
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </React.Fragment>
                              );
                            }
                            if (fieldType === "sidenavigation-group-content-editor") {
                              const snGroups = Math.min(Math.max(parseInt(itemProps.groups ?? "2", 10), 2), 5);
                              return (
                                <React.Fragment key={field.key}>
                                  {Array.from({ length: snGroups }, (_, gi) => gi).map((gi) => {
                                    const gItemsKey = `group${gi}_items`;
                                    const gItems = Math.min(Math.max(parseInt(itemProps[gItemsKey] ?? "1", 10), 1), 5);
                                    const labelsKey = `group${gi}_labels`;
                                    return (
                                      <React.Fragment key={`group-${gi}`}>
                                        {gi > 0 && <Divider />}
                                        <Text variant="label.small" color="subtle">
                                          Group-{gi + 1}
                                        </Text>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "var(--aegis-space-xSmall)",
                                          }}
                                        >
                                          <div style={{ flex: "1 1 0%", minWidth: 0 }}>
                                            <div style={{ paddingLeft: "var(--aegis-space-medium)" }}>
                                              <Text variant="label.small" color="subtle">
                                                Label
                                              </Text>
                                            </div>
                                          </div>
                                          <div
                                            style={{
                                              flex: "1 1 0%",
                                              minWidth: 0,
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            <Textarea
                                              aria-label="Label"
                                              placeholder="AAA,BBB,CCC"
                                              value={itemProps[labelsKey] ?? ""}
                                              onChange={(e) =>
                                                handleUpdate({
                                                  ...itemProps,
                                                  [labelsKey]: (e.target as HTMLTextAreaElement).value,
                                                })
                                              }
                                              style={{ width: "100%" }}
                                            />
                                          </div>
                                        </div>
                                        {Array.from({ length: gItems }, (_, ii) => ii).map((ii) => {
                                          const iconKey = `group${gi}_icon${ii}`;
                                          return (
                                            <div
                                              key={`item-${ii}`}
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "var(--aegis-space-xSmall)",
                                              }}
                                            >
                                              <div style={{ flex: "1 1 0%", minWidth: 0 }}>
                                                <div style={{ paddingLeft: "var(--aegis-space-medium)" }}>
                                                  <Text variant="label.small" color="subtle">
                                                    Icon-{ii + 1}
                                                  </Text>
                                                </div>
                                              </div>
                                              <div
                                                style={{
                                                  flex: "1 1 0%",
                                                  minWidth: 0,
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <Combobox
                                                  aria-label={`Icon-${ii + 1}`}
                                                  // biome-ignore lint/suspicious/noExplicitAny: "small" is not in the type but renders correctly for compact UI
                                                  size={"small" as any}
                                                  placeholder="Select Icon"
                                                  // biome-ignore lint/suspicious/noExplicitAny: icon name union is too strict for dynamic values
                                                  value={(itemProps[iconKey] ?? "LfPlusLarge") as any}
                                                  onChange={(value) =>
                                                    handleUpdate({ ...itemProps, [iconKey]: value as string })
                                                  }
                                                  options={ICON_OPTIONS}
                                                  style={{ width: "100%" }}
                                                />
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </React.Fragment>
                                    );
                                  })}
                                </React.Fragment>
                              );
                            }
                            if (fieldType === "toolbar-content-editor") {
                              return (
                                <React.Fragment key={field.key}>
                                  {Array.from({ length: tbGroups }, (_, gi) => gi).map((gi) => {
                                    const gPrefix = `group${gi}_`;
                                    const gItems = Math.min(
                                      Math.max(parseInt(itemProps[`${gPrefix}items`] ?? "3", 10), 1),
                                      5,
                                    );
                                    return (
                                      <React.Fragment key={`group-${gi}`}>
                                        {gi > 0 && <Divider />}
                                        {Array.from({ length: gItems }, (_, ii) => ii).map((ii) => {
                                          const iPrefix = `${gPrefix}item${ii}_`;
                                          const itemTypeKey = `${iPrefix}type`;
                                          const itemType = itemProps[itemTypeKey] ?? "IconButton";
                                          const cfgKey = `${iPrefix}cfg`;
                                          const rowLabel = `Group-${gi + 1} Item-${ii + 1}`;
                                          return (
                                            <React.Fragment key={`item-${ii}`}>
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: "var(--aegis-space-xSmall)",
                                                }}
                                              >
                                                <div style={{ flex: "1 1 0%", minWidth: 0 }}>
                                                  <Text variant="label.small" color="subtle">
                                                    {rowLabel}
                                                  </Text>
                                                </div>
                                                <div
                                                  style={{
                                                    flex: "1 1 0%",
                                                    minWidth: 0,
                                                    display: "flex",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  <Select
                                                    aria-label={rowLabel}
                                                    size="small"
                                                    value={itemType}
                                                    onChange={(v) =>
                                                      handleUpdate({ ...itemProps, [itemTypeKey]: v as string })
                                                    }
                                                    options={[
                                                      { label: "IconButton", value: "IconButton" },
                                                      { label: "Button", value: "Button" },
                                                    ]}
                                                    style={{ width: "100%" }}
                                                  />
                                                </div>
                                              </div>
                                              <SubItemPopover
                                                fieldKey={cfgKey}
                                                fieldLabel=""
                                                isIndented={true}
                                                subComp={itemType as ComponentKey}
                                                itemProps={itemProps}
                                                onUpdate={onUpdate}
                                              />
                                            </React.Fragment>
                                          );
                                        })}
                                      </React.Fragment>
                                    );
                                  })}
                                </React.Fragment>
                              );
                            }
                            if (fieldType === "stepper") {
                              const effectiveMin = field.minGetter?.(itemProps) ?? field.min ?? 1;
                              const rawParsed = parseInt(controlValue ?? "3", 10);
                              const stepValue = Math.min(
                                Math.max(Number.isNaN(rawParsed) ? effectiveMin : rawParsed, effectiveMin),
                                field.max ?? 20,
                              );
                              return (
                                <div
                                  key={field.key}
                                  style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}
                                >
                                  <div style={{ flex: "1 1 0%", minWidth: 0 }}>
                                    <div style={{ paddingLeft: isIndented ? "var(--aegis-space-medium)" : undefined }}>
                                      <Text variant="label.small" color={isIndented ? "subtle" : undefined}>
                                        {fieldLabel}
                                      </Text>
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      flex: "1 1 0%",
                                      minWidth: 0,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "var(--aegis-space-xSmall)",
                                    }}
                                  >
                                    {renderTooltipIconButton(
                                      "減らす",
                                      <Icon>
                                        <LfMinusLarge />
                                      </Icon>,
                                      {
                                        variant: "subtle",
                                        size: "xSmall",
                                        "aria-label": "減らす",
                                        disabled: stepValue <= effectiveMin,
                                        onClick: () =>
                                          handleUpdate({ ...itemProps, [resolvedKey]: String(stepValue - 1) }),
                                      },
                                    )}
                                    <Text variant="data.medium" style={{ minWidth: "2em", textAlign: "center" }}>
                                      {stepValue}
                                    </Text>
                                    {renderTooltipIconButton(
                                      "増やす",
                                      <Icon>
                                        <LfPlusLarge />
                                      </Icon>,
                                      {
                                        variant: "subtle",
                                        size: "xSmall",
                                        "aria-label": "増やす",
                                        disabled: stepValue >= (field.max ?? 20),
                                        onClick: () =>
                                          handleUpdate({ ...itemProps, [resolvedKey]: String(stepValue + 1) }),
                                      },
                                    )}
                                  </div>
                                </div>
                              );
                            }
                            if (fieldType === "button" || fieldType === "typography-select") {
                              const subComp = (field.subComponentGetter?.(effectiveProps) ?? field.subComponent) as
                                | ComponentKey
                                | undefined;
                              if (!subComp) {
                                if (!field.onClick) return null;
                                return (
                                  <div
                                    key={field.key}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "var(--aegis-space-xSmall)",
                                    }}
                                  >
                                    {isIndented && <div style={{ flex: "1 1 0%", minWidth: 0 }} />}
                                    <div style={{ flex: "1 1 0%", minWidth: 0, display: "flex", alignItems: "center" }}>
                                      <Button
                                        size="small"
                                        variant="subtle"
                                        width="full"
                                        onClick={() => {
                                          const diff = field.onClick?.(effectiveProps) ?? {};
                                          const updatedProps = { ...itemProps };
                                          for (const [k, v] of Object.entries(diff)) {
                                            const fullKey = isColScoped ? `${colPrefix}${k}` : k;
                                            if (v === undefined) {
                                              delete updatedProps[fullKey];
                                            } else {
                                              updatedProps[fullKey] = v;
                                            }
                                          }
                                          handleUpdate(updatedProps);
                                        }}
                                      >
                                        {fieldLabel}
                                      </Button>
                                    </div>
                                  </div>
                                );
                              }
                              return (
                                <SubItemPopover
                                  key={field.key}
                                  fieldKey={resolvedKey}
                                  fieldLabel={fieldLabel}
                                  isIndented={isIndented}
                                  subComp={subComp}
                                  itemProps={itemProps}
                                  onUpdate={onUpdate}
                                  allowedTextTypes={field.allowedTextTypes}
                                  onlyTab={
                                    field.onlyTab ?? (fieldType === "typography-select" ? "Properties" : undefined)
                                  }
                                  excludedSubKeys={field.excludedSubKeys}
                                />
                              );
                            }
                            if (fieldType === "column-order-editor") {
                              return (
                                <ColumnOrderEditorField
                                  key={field.key}
                                  isIndented={isIndented}
                                  itemProps={itemProps}
                                  onUpdate={onUpdate}
                                />
                              );
                            }
                            return (
                              <div
                                key={field.key}
                                style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}
                              >
                                <div style={{ flex: "1 1 0%", minWidth: 0 }}>
                                  <div style={{ paddingLeft: isIndented ? "var(--aegis-space-medium)" : undefined }}>
                                    <Text
                                      variant="label.small"
                                      color={isDisabled ? "disabled" : isIndented ? "subtle" : undefined}
                                    >
                                      {fieldLabel}
                                    </Text>
                                  </div>
                                </div>
                                <div style={{ flex: "1 1 0%", minWidth: 0, display: "flex", alignItems: "center" }}>
                                  {fieldType === "icon" ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "var(--aegis-space-small)",
                                        width: "100%",
                                      }}
                                    >
                                      <Checkbox
                                        size="small"
                                        checked={!!controlValue && !isDisabled}
                                        disabled={isDisabled}
                                        onChange={(e) => {
                                          const enabled = (e.target as HTMLInputElement).checked;
                                          handleUpdate({ ...itemProps, [resolvedKey]: enabled ? "LfPlusLarge" : "" });
                                        }}
                                      />
                                      <Combobox
                                        aria-label={fieldLabel}
                                        // biome-ignore lint/suspicious/noExplicitAny: "small" is not in the type but renders correctly for compact UI
                                        size={"small" as any}
                                        placeholder="Select Icon"
                                        // biome-ignore lint/suspicious/noExplicitAny: icon name union is too strict for dynamic values
                                        value={iconValue as any}
                                        disabled={isDisabled}
                                        onChange={(value) =>
                                          handleUpdate({ ...itemProps, [resolvedKey]: value as string })
                                        }
                                        options={ICON_OPTIONS}
                                        style={{ flex: 1, minWidth: 0 }}
                                      />
                                    </div>
                                  ) : fieldType === "checkbox" ? (
                                    <Checkbox
                                      size="small"
                                      checked={controlValue === "true"}
                                      disabled={isDisabled}
                                      onChange={(e) =>
                                        handleUpdate({
                                          ...itemProps,
                                          [resolvedKey]: String((e.target as HTMLInputElement).checked),
                                        })
                                      }
                                    />
                                  ) : fieldType === "textfield" ? (
                                    <TextField
                                      aria-label={fieldLabel}
                                      size="small"
                                      placeholder={field.placeholder ?? ""}
                                      value={controlValue ?? ""}
                                      disabled={isDisabled}
                                      onChange={(e) =>
                                        handleUpdate({
                                          ...itemProps,
                                          [resolvedKey]: (e.target as HTMLInputElement).value,
                                        })
                                      }
                                      style={{ width: "100%" }}
                                    />
                                  ) : fieldType === "textarea" ? (
                                    (() => {
                                      const errMsg = field.errorGetter?.(effectiveProps) ?? null;
                                      return (
                                        <div
                                          style={{
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "var(--aegis-space-x3Small)",
                                          }}
                                        >
                                          <Textarea
                                            aria-label={fieldLabel}
                                            placeholder={field.placeholder ?? ""}
                                            value={controlValue ?? ""}
                                            disabled={isDisabled}
                                            error={!!errMsg}
                                            onChange={(e) =>
                                              handleUpdate({
                                                ...itemProps,
                                                [resolvedKey]: (e.target as HTMLTextAreaElement).value,
                                              })
                                            }
                                            style={{ width: "100%" }}
                                          />
                                          {errMsg ? (
                                            <Text variant="body.xSmall" color="danger">
                                              {errMsg}
                                            </Text>
                                          ) : field.caption ? (
                                            <Text variant="body.xSmall" color="subtle">
                                              {field.caption}
                                            </Text>
                                          ) : null}
                                        </div>
                                      );
                                    })()
                                  ) : fieldType === "combobox" ? (
                                    <Combobox
                                      aria-label={fieldLabel}
                                      // biome-ignore lint/suspicious/noExplicitAny: "small" is not in the type but renders correctly for compact UI
                                      size={"small" as any}
                                      placeholder={field.placeholder ?? "Select"}
                                      value={controlValue ?? ""}
                                      disabled={isDisabled}
                                      onChange={(value) =>
                                        handleUpdate({ ...itemProps, [resolvedKey]: value as string })
                                      }
                                      options={
                                        (field as { options?: string[] }).options?.map((opt) => ({
                                          label: opt,
                                          value: opt,
                                        })) ?? []
                                      }
                                      style={{ width: "100%" }}
                                    />
                                  ) : fieldType === "icon-combobox" ? (
                                    <Combobox
                                      aria-label={fieldLabel}
                                      // biome-ignore lint/suspicious/noExplicitAny: "small" is not in the type but renders correctly for compact UI
                                      size={"small" as any}
                                      placeholder="Select Icon"
                                      // biome-ignore lint/suspicious/noExplicitAny: icon name union is too strict for dynamic values
                                      value={(controlValue ?? "LfPlusLarge") as any}
                                      disabled={isDisabled}
                                      onChange={(value) =>
                                        handleUpdate({ ...itemProps, [resolvedKey]: value as string })
                                      }
                                      options={ICON_OPTIONS}
                                      style={{ width: "100%" }}
                                    />
                                  ) : fieldType === "datefield" ? (
                                    <DateField
                                      aria-label={fieldLabel}
                                      value={strToDate(controlValue)}
                                      disabled={isDisabled}
                                      onChange={(date) =>
                                        handleUpdate({ ...itemProps, [resolvedKey]: dateToStr(date) })
                                      }
                                      style={{ width: "100%" }}
                                    />
                                  ) : fieldType === "timefield" ? (
                                    <TimeField
                                      aria-label={fieldLabel}
                                      value={strToTime(controlValue)}
                                      disabled={isDisabled}
                                      onChange={(time) =>
                                        handleUpdate({ ...itemProps, [resolvedKey]: timeToStr(time) })
                                      }
                                      style={{ width: "100%" }}
                                    />
                                  ) : fieldType === "tagpicker" ? (
                                    <TagPicker
                                      size="small"
                                      aria-label={fieldLabel}
                                      value={(controlValue ?? "")
                                        .split(",")
                                        .map((s) => s.trim())
                                        .filter(Boolean)}
                                      disabled={isDisabled}
                                      onChange={(values) =>
                                        handleUpdate({ ...itemProps, [resolvedKey]: (values as string[]).join(",") })
                                      }
                                      options={(field.optionsGetter
                                        ? field.optionsGetter(effectiveProps)
                                        : ((field as { options?: string[] }).options ?? [])
                                      ).map((opt) =>
                                        typeof opt === "string"
                                          ? { label: opt, value: opt }
                                          : { label: opt.label, value: opt.value },
                                      )}
                                      {...(field.max !== undefined && { maxSelection: field.max })}
                                      style={{ width: "100%" }}
                                    />
                                  ) : (
                                    <Select
                                      aria-label={fieldLabel}
                                      // biome-ignore lint/suspicious/noExplicitAny: "small" is not in the type but renders correctly for compact UI
                                      size={"small" as any}
                                      placeholder="Select"
                                      value={controlValue}
                                      onChange={(value) =>
                                        handleUpdate({ ...itemProps, [resolvedKey]: value as string })
                                      }
                                      options={(() => {
                                        const raw = field.optionsGetter
                                          ? field.optionsGetter(effectiveProps)
                                          : ((field as { options?: string[] }).options ?? []);
                                        return raw.map((opt) => {
                                          const o = typeof opt === "string" ? { label: opt, value: opt } : opt;
                                          if (!o.description) return o;
                                          return {
                                            label: o.label,
                                            value: o.value,
                                            body: (
                                              <>
                                                <ActionList.Body>{o.label}</ActionList.Body>
                                                <ActionList.Description>{o.description}</ActionList.Description>
                                              </>
                                            ),
                                          };
                                        });
                                      })()}
                                      style={{ width: "100%" }}
                                    />
                                  )}
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    ) : (
                      <div style={{ padding: "var(--aegis-space-small)", textAlign: "center" }}>
                        <Text variant="body.small" color="subtle">
                          No settings available
                        </Text>
                      </div>
                    )
                  ) : (
                    <div
                      style={{
                        minWidth: "calc(var(--aegis-layout-width-x5Small) + var(--aegis-size-medium))",
                        paddingBlock: "var(--aegis-space-x3Small)",
                      }}
                    >
                      {startItems.length > 0 && (
                        <>
                          <div
                            style={{
                              padding: "var(--aegis-space-xSmall) var(--aegis-space-small) var(--aegis-space-xxSmall)",
                            }}
                          >
                            <Text variant="label.small" color="subtle">
                              Start
                            </Text>
                          </div>
                          <Draggable values={startItems} onReorder={handleStartReorder}>
                            {startItems.map((si) => (
                              <Draggable.Item
                                key={si.id}
                                id={si.id}
                                trailing={
                                  onRemove
                                    ? renderTooltipIconButton(
                                        "Delete",
                                        <Icon>
                                          <LfTrash />
                                        </Icon>,
                                        {
                                          variant: "plain",
                                          size: "xSmall",
                                          "aria-label": "Delete",
                                          onClick: () => onRemove(si.id),
                                        },
                                      )
                                    : undefined
                                }
                              >
                                <Text variant="body.medium">{getLabel(si.component)}</Text>
                              </Draggable.Item>
                            ))}
                          </Draggable>
                        </>
                      )}
                      {endItems.length > 0 && (
                        <>
                          <div
                            style={{
                              padding: "var(--aegis-space-xSmall) var(--aegis-space-small) var(--aegis-space-xxSmall)",
                            }}
                          >
                            <Text variant="label.small" color="subtle">
                              End
                            </Text>
                          </div>
                          <Draggable values={endItems} onReorder={handleEndReorder}>
                            {endItems.map((ei) => (
                              <Draggable.Item
                                key={ei.id}
                                id={ei.id}
                                trailing={
                                  onRemove
                                    ? renderTooltipIconButton(
                                        "Delete",
                                        <Icon>
                                          <LfTrash />
                                        </Icon>,
                                        {
                                          variant: "plain",
                                          size: "xSmall",
                                          "aria-label": "Delete",
                                          onClick: () => onRemove(ei.id),
                                        },
                                      )
                                    : undefined
                                }
                              >
                                <Text variant="body.medium">{getLabel(ei.component)}</Text>
                              </Draggable.Item>
                            ))}
                          </Draggable>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </SubPopoverContext.Provider>
            </Popover.Body>
            {(storybookUrl || hasSettings) && (
              <>
                <Divider />
                <Popover.Footer>
                  <div
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}
                  >
                    <div>
                      {storybookUrl && (
                        <Link href={storybookUrl} target="_blank" rel="noopener noreferrer" size="small">
                          Storybook
                        </Link>
                      )}
                    </div>
                    {hasSettings && (
                      <Button size="xSmall" variant="gutterless" weight="normal" onClick={() => onUpdate({})}>
                        Reset
                      </Button>
                    )}
                  </div>
                </Popover.Footer>
              </>
            )}
          </div>
        </div>
      </Popover.Content>
    </Popover>
  );
};
