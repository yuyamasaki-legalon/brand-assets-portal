import {
  LfAngleDownMiddle,
  LfAngleLeftMiddle,
  LfArrowUpRightFromSquare,
  LfCheckCircle,
  LfHourglass,
  LfInformationCircle,
  LfTable,
  LfWarningRhombus,
  LfWarningTriangleFill,
} from "@legalforce/aegis-icons";
import {
  Book,
  Box,
  Contract,
  ErrorCat1,
  ErrorCat2,
  ErrorCat3,
  MagnifyingGlass,
} from "@legalforce/aegis-illustrations/react";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  ActionList,
  ActionListBody,
  ActionListDescription,
  ActionListGroup,
  ActionListItem,
  Avatar,
  AvatarGroup,
  Badge,
  Banner,
  Blockquote,
  Breadcrumb,
  Button,
  ButtonGroup,
  Calendar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardLink,
  Checkbox,
  CheckboxCard,
  CheckboxGroup,
  Code,
  CodeBlock,
  Combobox,
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
  DataTable,
  DataTableCell,
  DataTableDescription,
  DataTableHeader,
  DateField,
  DatePicker,
  DescriptionList,
  DescriptionListDetail,
  DescriptionListItem,
  DescriptionListTerm,
  Divider,
  EmptyState,
  FileDrop,
  Form,
  FormControl,
  FormGroup,
  Icon,
  IconButton,
  InformationCard,
  InformationCardDescription,
  InformationCardGroup,
  Link,
  Mark,
  MenuItem,
  NavList,
  OrderedList,
  Pagination,
  Radio,
  RadioCard,
  RadioGroup,
  RangeCalendar,
  RangeDateField,
  RangeDatePicker,
  RangeTimeField,
  RangeTimePicker,
  Search,
  SegmentedControl,
  Select,
  SideNavigation,
  Skeleton,
  StatusLabel,
  Stepper,
  Switch,
  Tab,
  Table,
  Tag,
  TagGroup,
  TagGroupLabel,
  TagInput,
  TagLink,
  TagPicker,
  Text,
  Textarea,
  TextField,
  TimeField,
  Timeline,
  TimelineContent,
  TimelineItem,
  TimelinePoint,
  TimePicker,
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  Tooltip,
  Tree,
  TreeItem,
  UnorderedList,
} from "@legalforce/aegis-react";
import React from "react";
import type { ContentArea } from "../../types";
import { parseMultiValues } from "./fieldConfig/base";
import { getAegisIconComponent, renderAegisIcon } from "./fieldConfig/icons";
import { TREE_LABEL_DEFAULT } from "./fieldConfig/Tree";
import type { ComponentKey } from "./types";

const COMBOBOX_OPTIONS = [
  { value: "1", label: "Option Alpha" },
  { value: "2", label: "Option Beta" },
  { value: "3", label: "Option Gamma" },
];

const getPreviewInputAriaLabel = (component: string, label?: string): string =>
  label && label !== "Label" ? `${label} (${component})` : `${component} preview`;

const renderPreviewGroupInput = (type: string): React.ReactElement => {
  switch (type) {
    case "TextField":
      return <TextField aria-label={getPreviewInputAriaLabel("TextField")} />;
    case "Combobox":
      return (
        <Combobox aria-label={getPreviewInputAriaLabel("Combobox")} options={[{ value: "1", label: "Option A" }]} />
      );
    case "DatePicker":
      return <DatePicker aria-label={getPreviewInputAriaLabel("DatePicker")} />;
    case "DateField":
      return <DateField aria-label={getPreviewInputAriaLabel("DateField")} />;
    case "TagPicker":
      return (
        <TagPicker aria-label={getPreviewInputAriaLabel("TagPicker")} options={[{ value: "1", label: "Tag A" }]} />
      );
    case "TagInput":
      return <TagInput aria-label={getPreviewInputAriaLabel("TagInput")} />;
    case "RangeDatePicker":
      return <RangeDatePicker aria-label={getPreviewInputAriaLabel("RangeDatePicker")} />;
    case "TimePicker":
      return <TimePicker aria-label={getPreviewInputAriaLabel("TimePicker")} />;
    case "TimeField":
      return <TimeField aria-label={getPreviewInputAriaLabel("TimeField")} />;
    default:
      return (
        <Select
          aria-label={getPreviewInputAriaLabel("Select")}
          value="1"
          options={[
            { value: "1", label: "Option A" },
            { value: "2", label: "Option B" },
          ]}
        />
      );
  }
};

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

type TreeNode = {
  name: string;
  children?: string[];
};

const normalizeTreeLabel = (value: string): string => value.replace(/,\s*$/, "").trim();

const buildNestedTreeItems = (
  raw: string,
): { items: Record<string, TreeNode>; rootId: string; defaultExpandedItems: string[] } => {
  const rootId = "root";
  const items: Record<string, TreeNode> = {
    [rootId]: { name: "Root", children: [] },
  };
  const stack: Array<{ id: string; depth: number }> = [{ id: rootId, depth: -1 }];

  const lines = raw
    .split("\n")
    .map((line) => ({ indent: line.match(/^\s*/)?.[0].length ?? 0, name: normalizeTreeLabel(line) }))
    .filter((line) => line.name.length > 0);

  if (lines.length === 0) {
    return buildNestedTreeItems(TREE_LABEL_DEFAULT);
  }

  lines.forEach((line, index) => {
    while (stack.length > 1 && line.indent <= stack[stack.length - 1].depth) {
      stack.pop();
    }

    const parent = stack[stack.length - 1] ?? { id: rootId, depth: -1 };
    const id = `node-${index}`;
    items[id] = { name: line.name };
    const parentChildren = items[parent.id]?.children ?? [];
    items[parent.id] = { ...items[parent.id], children: [...parentChildren, id] };
    stack.push({ id, depth: line.indent });
  });

  const defaultExpandedItems = Object.entries(items)
    .filter(([, value]) => (value.children?.length ?? 0) > 0)
    .map(([id]) => id);

  return { items, rootId, defaultExpandedItems };
};

const TreeRenderer = ({ itemProps }: { itemProps?: Record<string, string> }): React.ReactElement => {
  const labelSource = itemProps?.label ?? TREE_LABEL_DEFAULT;
  const selectionType =
    itemProps?.selection === "true"
      ? (itemProps?.selectionType ?? "Multiple") === "Single"
        ? "single"
        : "multiple"
      : undefined;
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const treeData = React.useMemo(() => buildNestedTreeItems(labelSource), [labelSource]);

  return (
    <Tree
      items={treeData.items}
      rootItemId={treeData.rootId}
      defaultExpandedItems={treeData.defaultExpandedItems}
      selectionType={selectionType as "single" | "multiple" | undefined}
      selectedItems={selectionType ? selectedItems : undefined}
      onSelectedItemsChange={selectionType ? setSelectedItems : undefined}
      propagateSelection={selectionType === "multiple" && itemProps?.propagateSelection === "true"}
      reorderable={itemProps?.reorderable === "true"}
    >
      {(itemId) => {
        const node = treeData.items[itemId];
        if (!node) return null;
        return (
          <TreeItem>
            <Text variant="body.medium">{node.name}</Text>
          </TreeItem>
        );
      }}
    </Tree>
  );
};

// ---
// Typography ユーティリティ（Card 以外のコンポーネントでも使用可）

/**
 * sub-props と fallback から Text の variant 文字列を解決する。
 *
 * textType の解決ルール:
 *   1. p が空（ユーザー未操作）→ fallback をそのまま返す（初期表示）
 *   2. p にキーがあるが textType が未保存 → "body" を使う
 *      （SubItemPopover は textType.defaultValue="body" を表示するため、
 *       ユーザーが size 等を変更すると sizeBody が保存される）
 *   3. p.textType が保存済み → その値を使う
 */
const resolveTypoVariant = (p: Record<string, string>, fallback: string): string => {
  if (Object.keys(p).length === 0) return fallback;
  const tt = p.textType ?? "body";
  const sizeKey: Record<string, string> = {
    title: "sizeTitle",
    "document title": "sizeDocTitle",
    label: "sizeLabel",
    body: "sizeBody",
    "document body": "sizeDocBody",
    caption: "sizeCaption",
    data: "sizeData",
    component: "sizeComponent",
  };
  const fallbackSz = fallback.startsWith("document.body.")
    ? (fallback.split(".")[3] ?? "medium")
    : fallback.startsWith("document.title.")
      ? (fallback.split(".")[2] ?? "medium")
      : (fallback.split(".")[1] ?? "medium");
  const sz = p[sizeKey[tt] ?? "sizeBody"] ?? (tt === "caption" ? "small" : fallbackSz);
  const fn = p.font ?? "sans";
  const ws = p.weight === "bold" ? ".bold" : "";
  switch (tt) {
    case "title":
      return `title.${sz}`;
    case "document title":
      return `document.title.${sz}`;
    case "label":
      return `label.${sz}${ws}`;
    case "document body":
      return `document.body.${fn}.${sz}${ws}`;
    case "caption":
      return `caption.${sz}`;
    case "data":
      return `data.${sz}${ws}`;
    case "component":
      return `component.${sz}${ws}`;
    default:
      return `body.${sz}${ws}`;
  }
};

/**
 * sub-props と fallback から Text の color を解決する。
 * resolveTypoVariant と同じルールで textType を解決する。
 */
const resolveTypoColor = (p: Record<string, string>, _fallback: string): string | undefined => {
  if (Object.keys(p).length === 0) return undefined;
  const tt = p.textType ?? "body";
  if (tt === "title") {
    const sz = p.sizeTitle ?? "medium";
    return sz === "x3Small" ? (p.colorTitleX3Small ?? "bold") : "bold";
  }
  if (tt === "caption") return p.colorCaption;
  return p.color;
};

// ---

const CardRenderer = ({ itemProps }: { itemProps?: Record<string, string> }): React.ReactElement => {
  const [isTogglePressed, setIsTogglePressed] = React.useState(false);

  const cardSize = (itemProps?.size ?? "medium") as "medium" | "small" | "xSmall";
  const cardVariant = (itemProps?.variant ?? "outline") as "outline" | "fill" | "plain";
  const showHeader = itemProps?.header !== "false";
  const withLeading = itemProps?.withHeaderLeading === "true";
  const withTrailing = itemProps?.withHeaderTrailing === "true";
  const showFooter = itemProps?.footer === "true";
  const showBody = itemProps?.body !== "false";
  const clickAction = itemProps?.clickAction === "true";
  const actionType = itemProps?.actionType ?? "With Link";
  const linkAsToggle = itemProps?.linkAsToggleButton === "true";
  const nestedCard = itemProps?.nestedCard === "true";
  const withinGrid = itemProps?.withinGrid === "true";

  const ext = (prefix: string): Record<string, string> =>
    Object.fromEntries(
      Object.entries(itemProps ?? {})
        .filter(([k]) => k.startsWith(prefix))
        .map(([k, v]) => [k.slice(prefix.length), v]),
    );

  const buildSlot = (side: "leading" | "trailing"): React.ReactNode => {
    const hasSlot = side === "leading" ? withLeading : withTrailing;
    if (!hasSlot) return undefined;
    const type = itemProps?.[side === "leading" ? "leadingType" : "trailingType"] ?? "Icon";
    if (type === "Icon") {
      const iconKey = itemProps?.[side === "leading" ? "leadingIcon" : "trailingIcon"] || "LfPlusLarge";
      const SlotIcon = getAegisIconComponent(iconKey);
      return (
        <Icon>
          <SlotIcon />
        </Icon>
      );
    }
    if (type === "IconButton") {
      const sp = ext(side === "leading" ? "leadingIBtn_" : "trailingIBtn_");
      return ComponentRenderer({ component: "IconButton", itemProps: { ...sp, size: "small" } });
    }
    if (type === "StatusLabel") {
      const sp = ext(side === "leading" ? "leadingStatus_" : "trailingStatus_");
      // biome-ignore lint/suspicious/noExplicitAny: dynamic color/variant string from config cannot be narrowed to union type
      const slColor = (sp.color as any) ?? "neutral";
      // biome-ignore lint/suspicious/noExplicitAny: dynamic color/variant string from config cannot be narrowed to union type
      const slVariant = (sp.variant as any) ?? "outline";
      return (
        <StatusLabel color={slColor} variant={slVariant}>
          {sp.label || "Status"}
        </StatusLabel>
      );
    }
    if (type === "Tag") {
      const sp = ext(side === "leading" ? "leadingTag_" : "trailingTag_");
      // biome-ignore lint/suspicious/noExplicitAny: dynamic color/variant string from config cannot be narrowed to union type
      const tagColor = (sp.color as any) ?? "neutral";
      // biome-ignore lint/suspicious/noExplicitAny: dynamic color/variant string from config cannot be narrowed to union type
      const tagVariant = (sp.variant as any) ?? "outline";
      return (
        <Tag color={tagColor} variant={tagVariant}>
          {sp.label || "Tag"}
        </Tag>
      );
    }
    return undefined;
  };

  const headerText = itemProps?.headerText || "Card Title";
  const headerTypoP = ext("headerTypo_");
  // biome-ignore lint/suspicious/noExplicitAny: dynamic typography variant/color strings cannot be narrowed to the strict Text union types
  const headerVariant = resolveTypoVariant(headerTypoP, "title.small") as any;
  // biome-ignore lint/suspicious/noExplicitAny: dynamic typography variant/color strings cannot be narrowed to the strict Text union types
  const headerColor = resolveTypoColor(headerTypoP, "title.small") as any;
  const titleContent = (
    <Text variant={headerVariant} color={headerColor}>
      {headerText}
    </Text>
  );

  const titleEl = clickAction ? (
    actionType === "Link As Button" ? (
      <CardLink asChild>
        <button
          type="button"
          {...(linkAsToggle
            ? {
                // biome-ignore lint/suspicious/noExplicitAny: aria-pressed accepts boolean but prop type is stricter
                "aria-pressed": isTogglePressed as any,
                onClick: () => setIsTogglePressed((p) => !p),
              }
            : {})}
        >
          {titleContent}
        </button>
      </CardLink>
    ) : (
      <CardLink href="#">{titleContent}</CardLink>
    )
  ) : (
    titleContent
  );

  const bodyTypoP = ext("bodyTypo_");
  // biome-ignore lint/suspicious/noExplicitAny: dynamic typography variant/color strings cannot be narrowed to the strict Text union types
  const bodyVariant = resolveTypoVariant(bodyTypoP, "body.medium") as any;
  // biome-ignore lint/suspicious/noExplicitAny: dynamic typography variant/color strings cannot be narrowed to the strict Text union types
  const bodyColor = resolveTypoColor(bodyTypoP, "body.medium") as any;
  const bodyText = itemProps?.bodyText || "Card content goes here.";

  const contentType = itemProps?.contentType ?? "Button";
  const footerDefaultSize = cardSize === "medium" ? "small" : "xSmall";
  let footerContentEl: React.ReactElement | null = null;
  if (showFooter) {
    const prefix =
      contentType === "Button"
        ? "footerContentBtn_"
        : contentType === "IconButton"
          ? "footerContentIBtn_"
          : "footerContentBtnGrp_";
    footerContentEl = ComponentRenderer({
      component: contentType as ComponentKey,
      itemProps: { size: footerDefaultSize, ...ext(prefix) },
    });
  }

  const cardEl = (
    <Card size={cardSize} variant={cardVariant}>
      {showHeader && (
        <CardHeader
          {...(withLeading ? { leading: buildSlot("leading") } : {})}
          {...(withTrailing ? { trailing: buildSlot("trailing") } : {})}
        >
          {titleEl}
        </CardHeader>
      )}
      {showBody && (
        <CardBody>
          <Text variant={bodyVariant} color={bodyColor} whiteSpace="pre-line">
            {bodyText}
          </Text>
          {nestedCard && (
            <Card variant="fill" size="small">
              <CardHeader>
                <CardLink asChild>
                  <button type="button">
                    <Text variant="title.xSmall">Nested Card Title</Text>
                  </button>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">Nested card content.</Text>
              </CardBody>
            </Card>
          )}
        </CardBody>
      )}
      {showFooter && (
        <CardFooter>
          {footerContentEl ?? (
            <Text variant="body.small" color="subtle">
              Footer
            </Text>
          )}
        </CardFooter>
      )}
    </Card>
  );

  if (withinGrid) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "var(--aegis-space-medium)",
          width: "100%",
        }}
      >
        {[0, 1, 2].map((i) => React.cloneElement(cardEl, { key: i }))}
      </div>
    );
  }
  return cardEl;
};

// ---

const SelectRenderer = ({ itemProps }: { itemProps?: Record<string, string> }): React.ReactElement => {
  const size = (itemProps?.size ?? "medium") as "large" | "medium" | "small";
  const variant = (itemProps?.variant ?? "outline") as "outline" | "gutterless";
  const withLeading = itemProps?.leading === "true";
  const withTrailing = itemProps?.trailing === "true";
  const withinFC = itemProps?.withinFormControl !== "false";
  const showFcTitle = itemProps?.fcTitle !== "false";
  const showFcCaption = itemProps?.fcCaption === "true";
  const required = withinFC && itemProps?.required === "true";
  const orientation = (itemProps?.orientation ?? "vertical") as "vertical" | "horizontal";
  const labelWidthRaw = itemProps?.labelWidth ?? "Off";
  const labelWidth =
    withinFC && orientation === "horizontal" && labelWidthRaw !== "Off"
      ? (labelWidthRaw as "medium" | "small" | "xSmall" | "auto")
      : undefined;
  const labelWeight =
    withinFC && orientation === "horizontal" ? ((itemProps?.labelWeight ?? "bold") as "bold" | "normal") : "bold";
  const labelTrailing = withinFC && orientation === "horizontal" && itemProps?.labelTrailing === "true";
  const withToolbar = withinFC && itemProps?.withToolbar === "true";
  const ghostToolbar = withinFC && itemProps?.withGhostToolbar === "true";
  const withFcGroup = withinFC && itemProps?.fcGroup === "true";

  const leadingIconKey = itemProps?.leadingIcon || "LfPlusLarge";
  const trailingIconKey = itemProps?.trailingIcon || "LfPlusLarge";
  const LeadingIcon = withLeading ? getAegisIconComponent(leadingIconKey) : undefined;
  const TrailingIcon = withTrailing ? getAegisIconComponent(trailingIconKey) : undefined;

  const labelText = itemProps?.fcLabel || "Label";
  const captionText = itemProps?.fcCaptionText || "Caption text";

  const toolbarCount = withToolbar ? Math.min(Math.max(parseInt(itemProps?.toolbarItems ?? "2", 10), 1), 3) : 0;
  const getToolbarLabel = (n: number) =>
    toolbarCount === 1 ? itemProps?.btnLabel || "Action" : itemProps?.[`btnLabel${n}`] || `Action ${n}`;

  const buildOptions = (raw: string) =>
    raw
      .split(",")
      .map((s, i) => ({ value: String(i), label: s.trim() }))
      .filter((o) => o.label);

  const options = buildOptions(itemProps?.menuItems ?? "Option A,Option B,Option C");

  const subInput = withFcGroup ? renderPreviewGroupInput(itemProps?.fcGroupInputType ?? "TextField") : undefined;

  const select = (
    <Select
      aria-label={getPreviewInputAriaLabel("Select", labelText)}
      options={options}
      size={size}
      variant={variant}
      leading={
        LeadingIcon ? (
          <Icon>
            <LeadingIcon />
          </Icon>
        ) : undefined
      }
      trailing={
        TrailingIcon ? (
          <Icon>
            <TrailingIcon />
          </Icon>
        ) : undefined
      }
      placeholder={itemProps?.placeholder || "Placeholder"}
      clearable={itemProps?.clearable === "true"}
    />
  );

  if (!withinFC) return select;

  return (
    <FormControl required={required} orientation={orientation}>
      {showFcTitle && (
        <FormControl.Label
          weight={labelWeight}
          width={labelWidth}
          trailing={
            labelTrailing ? (
              <Text variant="caption.small" color="subtle">
                (任意)
              </Text>
            ) : undefined
          }
        >
          {labelText}
        </FormControl.Label>
      )}
      {withToolbar && (
        <FormControl.Toolbar ghost={ghostToolbar}>
          {Array.from({ length: toolbarCount }, (_, i) => i).map((i) => (
            <React.Fragment key={i}>
              {i > 0 && <Divider />}
              <Button variant="gutterless">{getToolbarLabel(i + 1)}</Button>
            </React.Fragment>
          ))}
        </FormControl.Toolbar>
      )}
      {withFcGroup ? (
        <FormControl.Group>
          {select}
          {subInput}
        </FormControl.Group>
      ) : (
        select
      )}
      {showFcCaption && <FormControl.Caption>{captionText}</FormControl.Caption>}
    </FormControl>
  );
};

// ---

const ComboboxRenderer = ({ itemProps }: { itemProps?: Record<string, string> }): React.ReactElement => {
  const size = (itemProps?.size ?? "medium") as "large" | "medium";
  const withLeading = itemProps?.leading === "true";
  const creatable = itemProps?.creatable === "true";
  const withGroup = itemProps?.withGroup === "true";
  const withinFC = itemProps?.withinFormControl !== "false";
  const showFcTitle = itemProps?.fcTitle !== "false";
  const showFcCaption = itemProps?.fcCaption === "true";
  const required = withinFC && itemProps?.required === "true";
  const orientation = (itemProps?.orientation ?? "vertical") as "vertical" | "horizontal";
  const labelWidthRaw = itemProps?.labelWidth ?? "Off";
  const labelWidth =
    withinFC && orientation === "horizontal" && labelWidthRaw !== "Off"
      ? (labelWidthRaw as "medium" | "small" | "xSmall" | "auto")
      : undefined;
  const labelWeight =
    withinFC && orientation === "horizontal" ? ((itemProps?.labelWeight ?? "bold") as "bold" | "normal") : "bold";
  const labelTrailing = withinFC && orientation === "horizontal" && itemProps?.labelTrailing === "true";
  const withToolbar = withinFC && itemProps?.withToolbar === "true";
  const ghostToolbar = withinFC && itemProps?.withGhostToolbar === "true";
  const withFcGroup = withinFC && itemProps?.fcGroup === "true";

  const leadingIconKey = itemProps?.leadingIcon || "LfPlusLarge";
  const LeadingIcon = withLeading ? getAegisIconComponent(leadingIconKey) : undefined;

  const buildOptions = (raw: string) =>
    raw
      .split(",")
      .map((s, i) => ({ value: String(i), label: s.trim() }))
      .filter((o) => o.label);

  const options = withGroup
    ? [
        ...buildOptions(itemProps?.menuItems1 ?? "AAA,BBB"),
        ...buildOptions(itemProps?.menuItems2 ?? "CCC,DDD"),
        ...buildOptions(itemProps?.menuItems3 ?? "EEE,FFF"),
      ]
    : buildOptions(itemProps?.menuItems ?? "AAA,BBB,CCC");

  const labelText = itemProps?.fcLabel || "Label";
  const captionText = itemProps?.fcCaptionText || "Caption text";

  const toolbarCount = withToolbar ? Math.min(Math.max(parseInt(itemProps?.toolbarItems ?? "2", 10), 1), 3) : 0;
  const getToolbarLabel = (n: number) =>
    toolbarCount === 1 ? itemProps?.btnLabel || "Action" : itemProps?.[`btnLabel${n}`] || `Action ${n}`;

  const combobox = (
    <Combobox
      aria-label={getPreviewInputAriaLabel("Combobox", labelText)}
      options={options}
      size={size}
      creatable={creatable}
      leading={
        LeadingIcon ? (
          <Icon>
            <LeadingIcon />
          </Icon>
        ) : undefined
      }
      placeholder={itemProps?.placeholder || undefined}
    />
  );

  if (!withinFC) return combobox;

  const subInput = withFcGroup ? renderPreviewGroupInput(itemProps?.fcGroupInputType ?? "Select") : undefined;

  return (
    <FormControl required={required} orientation={orientation}>
      {showFcTitle && (
        <FormControl.Label
          weight={labelWeight}
          width={labelWidth}
          trailing={
            labelTrailing ? (
              <Text variant="caption.small" color="subtle">
                (任意)
              </Text>
            ) : undefined
          }
        >
          {labelText}
        </FormControl.Label>
      )}
      {withToolbar && (
        <FormControl.Toolbar ghost={ghostToolbar}>
          {Array.from({ length: toolbarCount }, (_, i) => i).map((i) => (
            <React.Fragment key={i}>
              {i > 0 && <Divider />}
              <Button variant="gutterless">{getToolbarLabel(i + 1)}</Button>
            </React.Fragment>
          ))}
        </FormControl.Toolbar>
      )}
      {withFcGroup ? (
        <FormControl.Group>
          {combobox}
          {subInput}
        </FormControl.Group>
      ) : (
        combobox
      )}
      {showFcCaption && <FormControl.Caption>{captionText}</FormControl.Caption>}
    </FormControl>
  );
};

const TextFieldRenderer = ({ itemProps }: { itemProps?: Record<string, string> }): React.ReactElement => {
  const size = (itemProps?.size ?? "medium") as "large" | "medium" | "small";
  const variant = (itemProps?.variant ?? "outline") as "outline" | "underline";
  const withLeading = itemProps?.leading === "true";
  const withTrailing = itemProps?.trailing === "true";
  const withinFC = itemProps?.withinFormControl !== "false";
  const showFcTitle = itemProps?.fcTitle !== "false";
  const showFcCaption = itemProps?.fcCaption === "true";
  const required = withinFC && itemProps?.required === "true";
  const orientation = (itemProps?.orientation ?? "vertical") as "vertical" | "horizontal";
  const labelWidthRaw = itemProps?.labelWidth ?? "Off";
  const labelWidth =
    withinFC && orientation === "horizontal" && labelWidthRaw !== "Off"
      ? (labelWidthRaw as "medium" | "small" | "xSmall" | "auto")
      : undefined;
  const labelWeight =
    withinFC && orientation === "horizontal" ? ((itemProps?.labelWeight ?? "bold") as "bold" | "normal") : "bold";
  const labelTrailing = withinFC && orientation === "horizontal" && itemProps?.labelTrailing === "true";
  const withToolbar = withinFC && itemProps?.withToolbar === "true";
  const ghostToolbar = withinFC && itemProps?.withGhostToolbar === "true";
  const withFcGroup = withinFC && itemProps?.fcGroup === "true";

  const leadingIconKey = itemProps?.leadingIcon || "LfPlusLarge";
  const trailingIconKey = itemProps?.trailingIcon || "LfPlusLarge";
  const LeadingIcon = withLeading ? getAegisIconComponent(leadingIconKey) : undefined;
  const TrailingIcon = withTrailing ? getAegisIconComponent(trailingIconKey) : undefined;

  const labelText = itemProps?.fcLabel || "Label";
  const captionText = itemProps?.fcCaptionText || "Caption text";

  const toolbarCount = withToolbar ? Math.min(Math.max(parseInt(itemProps?.toolbarItems ?? "2", 10), 1), 3) : 0;
  const getToolbarLabel = (n: number) =>
    toolbarCount === 1 ? itemProps?.btnLabel || "Action" : itemProps?.[`btnLabel${n}`] || `Action ${n}`;

  const subInput = withFcGroup ? renderPreviewGroupInput(itemProps?.fcGroupInputType ?? "Select") : undefined;

  const inputType = (itemProps?.inputType ?? "text") as
    | "date"
    | "datetime-local"
    | "email"
    | "month"
    | "number"
    | "password"
    | "search"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week";

  const textfield = (
    <TextField
      aria-label={getPreviewInputAriaLabel("TextField", labelText)}
      size={size}
      variant={variant}
      type={inputType !== "text" ? inputType : undefined}
      leading={
        LeadingIcon ? (
          <Icon>
            <LeadingIcon />
          </Icon>
        ) : undefined
      }
      trailing={
        TrailingIcon ? (
          <Icon>
            <TrailingIcon />
          </Icon>
        ) : undefined
      }
      placeholder={itemProps?.placeholder || "Placeholder"}
      clearable={itemProps?.clearable === "true"}
    />
  );

  if (!withinFC) return textfield;

  return (
    <FormControl required={required} orientation={orientation}>
      {showFcTitle && (
        <FormControl.Label
          weight={labelWeight}
          width={labelWidth}
          trailing={
            labelTrailing ? (
              <Text variant="caption.small" color="subtle">
                (任意)
              </Text>
            ) : undefined
          }
        >
          {labelText}
        </FormControl.Label>
      )}
      {withToolbar && (
        <FormControl.Toolbar ghost={ghostToolbar}>
          {Array.from({ length: toolbarCount }, (_, i) => i).map((i) => (
            <React.Fragment key={i}>
              {i > 0 && <Divider />}
              <Button variant="gutterless">{getToolbarLabel(i + 1)}</Button>
            </React.Fragment>
          ))}
        </FormControl.Toolbar>
      )}
      {withFcGroup ? (
        <FormControl.Group>
          {textfield}
          {subInput}
        </FormControl.Group>
      ) : (
        textfield
      )}
      {showFcCaption && <FormControl.Caption>{captionText}</FormControl.Caption>}
    </FormControl>
  );
};

const DateFieldRenderer = ({ itemProps }: { itemProps?: Record<string, string> }): React.ReactElement => {
  const size = (itemProps?.size ?? "medium") as "large" | "medium";
  const granularity = itemProps?.granularity === "true" ? ("minute" as const) : ("day" as const);
  const withLeading = itemProps?.leading === "true";
  const withTrailing = itemProps?.trailing === "true";
  const withinFC = itemProps?.withinFormControl !== "false";
  const showFcTitle = itemProps?.fcTitle !== "false";
  const showFcCaption = itemProps?.fcCaption === "true";
  const required = withinFC && itemProps?.required === "true";
  const orientation = (itemProps?.orientation ?? "vertical") as "vertical" | "horizontal";
  const labelWidthRaw = itemProps?.labelWidth ?? "Off";
  const labelWidth =
    withinFC && orientation === "horizontal" && labelWidthRaw !== "Off"
      ? (labelWidthRaw as "medium" | "small" | "xSmall" | "auto")
      : undefined;
  const labelWeight =
    withinFC && orientation === "horizontal" ? ((itemProps?.labelWeight ?? "bold") as "bold" | "normal") : "bold";
  const labelTrailing = withinFC && orientation === "horizontal" && itemProps?.labelTrailing === "true";
  const withToolbar = withinFC && itemProps?.withToolbar === "true";
  const ghostToolbar = withinFC && itemProps?.withGhostToolbar === "true";
  const withFcGroup = withinFC && itemProps?.fcGroup === "true";

  const leadingIconKey = itemProps?.leadingIcon || "LfPlusLarge";
  const trailingIconKey = itemProps?.trailingIcon || "LfPlusLarge";
  const LeadingIcon = withLeading ? getAegisIconComponent(leadingIconKey) : undefined;
  const TrailingIcon = withTrailing ? getAegisIconComponent(trailingIconKey) : undefined;

  const labelText = itemProps?.fcLabel || "Label";
  const captionText = itemProps?.fcCaptionText || "Caption text";

  const toolbarCount = withToolbar ? Math.min(Math.max(parseInt(itemProps?.toolbarItems ?? "2", 10), 1), 3) : 0;
  const getToolbarLabel = (n: number) =>
    toolbarCount === 1 ? itemProps?.btnLabel || "Action" : itemProps?.[`btnLabel${n}`] || `Action ${n}`;

  const datefield = (
    <DateField
      aria-label={getPreviewInputAriaLabel("DateField", labelText)}
      size={size}
      granularity={granularity}
      leading={
        LeadingIcon ? (
          <Icon>
            <LeadingIcon />
          </Icon>
        ) : undefined
      }
      trailing={
        TrailingIcon ? (
          <Icon>
            <TrailingIcon />
          </Icon>
        ) : undefined
      }
    />
  );

  if (!withinFC) return datefield;

  const subInput = withFcGroup ? renderPreviewGroupInput(itemProps?.fcGroupInputType ?? "Select") : undefined;

  return (
    <FormControl required={required} orientation={orientation}>
      {showFcTitle && (
        <FormControl.Label
          weight={labelWeight}
          width={labelWidth}
          trailing={
            labelTrailing ? (
              <Text variant="caption.small" color="subtle">
                (任意)
              </Text>
            ) : undefined
          }
        >
          {labelText}
        </FormControl.Label>
      )}
      {withToolbar && (
        <FormControl.Toolbar ghost={ghostToolbar}>
          {Array.from({ length: toolbarCount }, (_, i) => i).map((i) => (
            <React.Fragment key={i}>
              {i > 0 && <Divider />}
              <Button variant="gutterless">{getToolbarLabel(i + 1)}</Button>
            </React.Fragment>
          ))}
        </FormControl.Toolbar>
      )}
      {withFcGroup ? (
        <FormControl.Group>
          {datefield}
          {subInput}
        </FormControl.Group>
      ) : (
        datefield
      )}
      {showFcCaption && <FormControl.Caption>{captionText}</FormControl.Caption>}
    </FormControl>
  );
};

const RangeDateFieldRenderer = ({ itemProps }: { itemProps?: Record<string, string> }): React.ReactElement => {
  const size = (itemProps?.size ?? "medium") as "large" | "medium";
  const granularity = itemProps?.granularity === "true" ? ("minute" as const) : ("day" as const);
  const withLeading = itemProps?.leading === "true";
  const withTrailing = itemProps?.trailing === "true";
  const withinFC = itemProps?.withinFormControl !== "false";
  const showFcTitle = itemProps?.fcTitle !== "false";
  const showFcCaption = itemProps?.fcCaption === "true";
  const required = withinFC && itemProps?.required === "true";
  const orientation = (itemProps?.orientation ?? "vertical") as "vertical" | "horizontal";
  const labelWidthRaw = itemProps?.labelWidth ?? "Off";
  const labelWidth =
    withinFC && orientation === "horizontal" && labelWidthRaw !== "Off"
      ? (labelWidthRaw as "medium" | "small" | "xSmall" | "auto")
      : undefined;
  const labelWeight =
    withinFC && orientation === "horizontal" ? ((itemProps?.labelWeight ?? "bold") as "bold" | "normal") : "bold";
  const labelTrailing = withinFC && orientation === "horizontal" && itemProps?.labelTrailing === "true";
  const withToolbar = withinFC && itemProps?.withToolbar === "true";
  const ghostToolbar = withinFC && itemProps?.withGhostToolbar === "true";
  const withFcGroup = withinFC && itemProps?.fcGroup === "true";

  const leadingIconKey = itemProps?.leadingIcon || "LfPlusLarge";
  const trailingIconKey = itemProps?.trailingIcon || "LfPlusLarge";
  const LeadingIcon = withLeading ? getAegisIconComponent(leadingIconKey) : undefined;
  const TrailingIcon = withTrailing ? getAegisIconComponent(trailingIconKey) : undefined;

  const labelText = itemProps?.fcLabel || "Label";
  const captionText = itemProps?.fcCaptionText || "Caption text";
  const toolbarCount = withToolbar ? Math.min(Math.max(parseInt(itemProps?.toolbarItems ?? "2", 10), 1), 3) : 0;
  const getToolbarLabel = (n: number) =>
    toolbarCount === 1 ? itemProps?.btnLabel || "Action" : itemProps?.[`btnLabel${n}`] || `Action ${n}`;

  const rangeDateField = (
    <RangeDateField
      aria-label={getPreviewInputAriaLabel("RangeDateField", labelText)}
      size={size}
      granularity={granularity}
      leading={
        LeadingIcon ? (
          <Icon>
            <LeadingIcon />
          </Icon>
        ) : undefined
      }
      trailing={
        TrailingIcon ? (
          <Icon>
            <TrailingIcon />
          </Icon>
        ) : undefined
      }
    />
  );

  if (!withinFC) return rangeDateField;

  const subInput = withFcGroup ? renderPreviewGroupInput(itemProps?.fcGroupInputType ?? "Select") : undefined;

  return (
    <FormControl required={required} orientation={orientation}>
      {showFcTitle && (
        <FormControl.Label
          weight={labelWeight}
          width={labelWidth}
          trailing={
            labelTrailing ? (
              <Text variant="caption.small" color="subtle">
                (任意)
              </Text>
            ) : undefined
          }
        >
          {labelText}
        </FormControl.Label>
      )}
      {withToolbar && (
        <FormControl.Toolbar ghost={ghostToolbar}>
          {Array.from({ length: toolbarCount }, (_, i) => i).map((i) => (
            <React.Fragment key={i}>
              {i > 0 && <Divider />}
              <Button variant="gutterless">{getToolbarLabel(i + 1)}</Button>
            </React.Fragment>
          ))}
        </FormControl.Toolbar>
      )}
      {withFcGroup ? (
        <FormControl.Group>
          {rangeDateField}
          {subInput}
        </FormControl.Group>
      ) : (
        rangeDateField
      )}
      {showFcCaption && <FormControl.Caption>{captionText}</FormControl.Caption>}
    </FormControl>
  );
};

const TimeFieldRenderer = ({ itemProps }: { itemProps?: Record<string, string> }): React.ReactElement => {
  const size = (itemProps?.size ?? "medium") as "large" | "medium";
  const withLeading = itemProps?.leading === "true";
  const withTrailing = itemProps?.trailing === "true";
  const withinFC = itemProps?.withinFormControl !== "false";
  const showFcTitle = itemProps?.fcTitle !== "false";
  const showFcCaption = itemProps?.fcCaption === "true";
  const required = withinFC && itemProps?.required === "true";
  const orientation = (itemProps?.orientation ?? "vertical") as "vertical" | "horizontal";
  const labelWidthRaw = itemProps?.labelWidth ?? "Off";
  const labelWidth =
    withinFC && orientation === "horizontal" && labelWidthRaw !== "Off"
      ? (labelWidthRaw as "medium" | "small" | "xSmall" | "auto")
      : undefined;
  const labelWeight =
    withinFC && orientation === "horizontal" ? ((itemProps?.labelWeight ?? "bold") as "bold" | "normal") : "bold";
  const labelTrailing = withinFC && orientation === "horizontal" && itemProps?.labelTrailing === "true";
  const withToolbar = withinFC && itemProps?.withToolbar === "true";
  const ghostToolbar = withinFC && itemProps?.withGhostToolbar === "true";
  const withFcGroup = withinFC && itemProps?.fcGroup === "true";

  const leadingIconKey = itemProps?.leadingIcon || "LfPlusLarge";
  const trailingIconKey = itemProps?.trailingIcon || "LfPlusLarge";
  const LeadingIcon = withLeading ? getAegisIconComponent(leadingIconKey) : undefined;
  const TrailingIcon = withTrailing ? getAegisIconComponent(trailingIconKey) : undefined;

  const labelText = itemProps?.fcLabel || "Label";
  const captionText = itemProps?.fcCaptionText || "Caption text";

  const toolbarCount = withToolbar ? Math.min(Math.max(parseInt(itemProps?.toolbarItems ?? "2", 10), 1), 3) : 0;
  const getToolbarLabel = (n: number) =>
    toolbarCount === 1 ? itemProps?.btnLabel || "Action" : itemProps?.[`btnLabel${n}`] || `Action ${n}`;

  const parseTime = (raw: string | undefined) => {
    if (!raw) return undefined;
    const [h, m] = raw.split(":").map(Number);
    return !Number.isNaN(h) && !Number.isNaN(m) ? { hours: h, minutes: m } : undefined;
  };

  const minValue = itemProps?.hasMinValue === "true" ? parseTime(itemProps?.minValue) : undefined;
  const maxValue = itemProps?.hasMaxValue === "true" ? parseTime(itemProps?.maxValue) : undefined;

  const timefield = (
    <TimeField
      aria-label={getPreviewInputAriaLabel("TimeField", labelText)}
      size={size}
      leading={
        LeadingIcon ? (
          <Icon>
            <LeadingIcon />
          </Icon>
        ) : undefined
      }
      trailing={
        TrailingIcon ? (
          <Icon>
            <TrailingIcon />
          </Icon>
        ) : undefined
      }
      minValue={minValue}
      maxValue={maxValue}
    />
  );

  if (!withinFC) return timefield;

  const subInput = withFcGroup ? renderPreviewGroupInput(itemProps?.fcGroupInputType ?? "Select") : undefined;

  return (
    <FormControl required={required} orientation={orientation}>
      {showFcTitle && (
        <FormControl.Label
          weight={labelWeight}
          width={labelWidth}
          trailing={
            labelTrailing ? (
              <Text variant="caption.small" color="subtle">
                (任意)
              </Text>
            ) : undefined
          }
        >
          {labelText}
        </FormControl.Label>
      )}
      {withToolbar && (
        <FormControl.Toolbar ghost={ghostToolbar}>
          {Array.from({ length: toolbarCount }, (_, i) => i).map((i) => (
            <React.Fragment key={i}>
              {i > 0 && <Divider />}
              <Button variant="gutterless">{getToolbarLabel(i + 1)}</Button>
            </React.Fragment>
          ))}
        </FormControl.Toolbar>
      )}
      {withFcGroup ? (
        <FormControl.Group>
          {timefield}
          {subInput}
        </FormControl.Group>
      ) : (
        timefield
      )}
      {showFcCaption && <FormControl.Caption>{captionText}</FormControl.Caption>}
    </FormControl>
  );
};

const TimePickerRenderer = ({ itemProps }: { itemProps?: Record<string, string> }): React.ReactElement => {
  const size = (itemProps?.size ?? "medium") as "large" | "medium";
  const withLeading = itemProps?.leading === "true";
  const withTrailing = itemProps?.trailing === "true";
  const withinFC = itemProps?.withinFormControl !== "false";
  const showFcTitle = itemProps?.fcTitle !== "false";
  const showFcCaption = itemProps?.fcCaption === "true";
  const required = withinFC && itemProps?.required === "true";
  const orientation = (itemProps?.orientation ?? "vertical") as "vertical" | "horizontal";
  const labelWidthRaw = itemProps?.labelWidth ?? "Off";
  const labelWidth =
    withinFC && orientation === "horizontal" && labelWidthRaw !== "Off"
      ? (labelWidthRaw as "medium" | "small" | "xSmall" | "auto")
      : undefined;
  const labelWeight =
    withinFC && orientation === "horizontal" ? ((itemProps?.labelWeight ?? "bold") as "bold" | "normal") : "bold";
  const labelTrailing = withinFC && orientation === "horizontal" && itemProps?.labelTrailing === "true";
  const withToolbar = withinFC && itemProps?.withToolbar === "true";
  const ghostToolbar = withinFC && itemProps?.withGhostToolbar === "true";
  const withFcGroup = withinFC && itemProps?.fcGroup === "true";

  const leadingIconKey = itemProps?.leadingIcon || "LfPlusLarge";
  const trailingIconKey = itemProps?.trailingIcon || "LfPlusLarge";
  const LeadingIcon = withLeading ? getAegisIconComponent(leadingIconKey) : undefined;
  const TrailingIcon = withTrailing ? getAegisIconComponent(trailingIconKey) : undefined;

  const labelText = itemProps?.fcLabel || "Label";
  const captionText = itemProps?.fcCaptionText || "Caption text";

  const toolbarCount = withToolbar ? Math.min(Math.max(parseInt(itemProps?.toolbarItems ?? "2", 10), 1), 3) : 0;
  const getToolbarLabel = (n: number) =>
    toolbarCount === 1 ? itemProps?.btnLabel || "Action" : itemProps?.[`btnLabel${n}`] || `Action ${n}`;

  const parseTime = (raw: string | undefined) => {
    if (!raw) return undefined;
    const [h, m] = raw.split(":").map(Number);
    return !Number.isNaN(h) && !Number.isNaN(m) ? { hours: h, minutes: m } : undefined;
  };

  const minuteStep = Math.max(1, parseInt(itemProps?.minuteStep ?? "5", 10));
  const minValue = itemProps?.hasMinValue === "true" ? parseTime(itemProps?.minValue) : undefined;
  const maxValue = itemProps?.hasMaxValue === "true" ? parseTime(itemProps?.maxValue) : undefined;

  const timepicker = (
    <TimePicker
      aria-label={getPreviewInputAriaLabel("TimePicker", labelText)}
      size={size}
      leading={
        LeadingIcon ? (
          <Icon>
            <LeadingIcon />
          </Icon>
        ) : undefined
      }
      trailing={
        TrailingIcon ? (
          <Icon>
            <TrailingIcon />
          </Icon>
        ) : undefined
      }
      minuteStep={minuteStep}
      minValue={minValue}
      maxValue={maxValue}
    />
  );

  if (!withinFC) return timepicker;

  const subInput = withFcGroup ? renderPreviewGroupInput(itemProps?.fcGroupInputType ?? "Select") : undefined;

  return (
    <FormControl required={required} orientation={orientation}>
      {showFcTitle && (
        <FormControl.Label
          weight={labelWeight}
          width={labelWidth}
          trailing={
            labelTrailing ? (
              <Text variant="caption.small" color="subtle">
                (任意)
              </Text>
            ) : undefined
          }
        >
          {labelText}
        </FormControl.Label>
      )}
      {withToolbar && (
        <FormControl.Toolbar ghost={ghostToolbar}>
          {Array.from({ length: toolbarCount }, (_, i) => i).map((i) => (
            <React.Fragment key={i}>
              {i > 0 && <Divider />}
              <Button variant="gutterless">{getToolbarLabel(i + 1)}</Button>
            </React.Fragment>
          ))}
        </FormControl.Toolbar>
      )}
      {withFcGroup ? (
        <FormControl.Group>
          {timepicker}
          {subInput}
        </FormControl.Group>
      ) : (
        timepicker
      )}
      {showFcCaption && <FormControl.Caption>{captionText}</FormControl.Caption>}
    </FormControl>
  );
};

const RangeTimeFieldRenderer = ({ itemProps }: { itemProps?: Record<string, string> }): React.ReactElement => {
  const size = (itemProps?.size ?? "medium") as "large" | "medium";
  const withLeading = itemProps?.leading === "true";
  const withTrailing = itemProps?.trailing === "true";
  const withinFC = itemProps?.withinFormControl !== "false";
  const showFcTitle = itemProps?.fcTitle !== "false";
  const showFcCaption = itemProps?.fcCaption === "true";
  const required = withinFC && itemProps?.required === "true";
  const orientation = (itemProps?.orientation ?? "vertical") as "vertical" | "horizontal";
  const labelWidthRaw = itemProps?.labelWidth ?? "Off";
  const labelWidth =
    withinFC && orientation === "horizontal" && labelWidthRaw !== "Off"
      ? (labelWidthRaw as "medium" | "small" | "xSmall" | "auto")
      : undefined;
  const labelWeight =
    withinFC && orientation === "horizontal" ? ((itemProps?.labelWeight ?? "bold") as "bold" | "normal") : "bold";
  const labelTrailing = withinFC && orientation === "horizontal" && itemProps?.labelTrailing === "true";
  const withToolbar = withinFC && itemProps?.withToolbar === "true";
  const ghostToolbar = withinFC && itemProps?.withGhostToolbar === "true";
  const withFcGroup = withinFC && itemProps?.fcGroup === "true";

  const leadingIconKey = itemProps?.leadingIcon || "LfPlusLarge";
  const trailingIconKey = itemProps?.trailingIcon || "LfPlusLarge";
  const LeadingIcon = withLeading ? getAegisIconComponent(leadingIconKey) : undefined;
  const TrailingIcon = withTrailing ? getAegisIconComponent(trailingIconKey) : undefined;

  const labelText = itemProps?.fcLabel || "Label";
  const captionText = itemProps?.fcCaptionText || "Caption text";

  const toolbarCount = withToolbar ? Math.min(Math.max(parseInt(itemProps?.toolbarItems ?? "2", 10), 1), 3) : 0;
  const getToolbarLabel = (n: number) =>
    toolbarCount === 1 ? itemProps?.btnLabel || "Action" : itemProps?.[`btnLabel${n}`] || `Action ${n}`;

  const parseTime = (raw: string | undefined) => {
    if (!raw) return undefined;
    const [h, m] = raw.split(":").map(Number);
    return !Number.isNaN(h) && !Number.isNaN(m) ? { hours: h, minutes: m } : undefined;
  };

  const minValue = itemProps?.hasMinValue === "true" ? parseTime(itemProps?.minValue) : undefined;
  const maxValue = itemProps?.hasMaxValue === "true" ? parseTime(itemProps?.maxValue) : undefined;

  const rangetimefield = (
    <RangeTimeField
      aria-label={getPreviewInputAriaLabel("RangeTimeField", labelText)}
      size={size}
      leading={
        LeadingIcon ? (
          <Icon>
            <LeadingIcon />
          </Icon>
        ) : undefined
      }
      trailing={
        TrailingIcon ? (
          <Icon>
            <TrailingIcon />
          </Icon>
        ) : undefined
      }
      minValue={minValue}
      maxValue={maxValue}
    />
  );

  if (!withinFC) return rangetimefield;

  const subInput = withFcGroup ? renderPreviewGroupInput(itemProps?.fcGroupInputType ?? "Select") : undefined;

  return (
    <FormControl required={required} orientation={orientation}>
      {showFcTitle && (
        <FormControl.Label
          weight={labelWeight}
          width={labelWidth}
          trailing={
            labelTrailing ? (
              <Text variant="caption.small" color="subtle">
                (任意)
              </Text>
            ) : undefined
          }
        >
          {labelText}
        </FormControl.Label>
      )}
      {withToolbar && (
        <FormControl.Toolbar ghost={ghostToolbar}>
          {Array.from({ length: toolbarCount }, (_, i) => i).map((i) => (
            <React.Fragment key={i}>
              {i > 0 && <Divider />}
              <Button variant="gutterless">{getToolbarLabel(i + 1)}</Button>
            </React.Fragment>
          ))}
        </FormControl.Toolbar>
      )}
      {withFcGroup ? (
        <FormControl.Group>
          {rangetimefield}
          {subInput}
        </FormControl.Group>
      ) : (
        rangetimefield
      )}
      {showFcCaption && <FormControl.Caption>{captionText}</FormControl.Caption>}
    </FormControl>
  );
};

const RangeTimePickerRenderer = ({ itemProps }: { itemProps?: Record<string, string> }): React.ReactElement => {
  const size = (itemProps?.size ?? "medium") as "large" | "medium";
  const withLeading = itemProps?.leading === "true";
  const withTrailing = itemProps?.trailing === "true";
  const withinFC = itemProps?.withinFormControl !== "false";
  const showFcTitle = itemProps?.fcTitle !== "false";
  const showFcCaption = itemProps?.fcCaption === "true";
  const required = withinFC && itemProps?.required === "true";
  const orientation = (itemProps?.orientation ?? "vertical") as "vertical" | "horizontal";
  const labelWidthRaw = itemProps?.labelWidth ?? "Off";
  const labelWidth =
    withinFC && orientation === "horizontal" && labelWidthRaw !== "Off"
      ? (labelWidthRaw as "medium" | "small" | "xSmall" | "auto")
      : undefined;
  const labelWeight =
    withinFC && orientation === "horizontal" ? ((itemProps?.labelWeight ?? "bold") as "bold" | "normal") : "bold";
  const labelTrailing = withinFC && orientation === "horizontal" && itemProps?.labelTrailing === "true";
  const withToolbar = withinFC && itemProps?.withToolbar === "true";
  const ghostToolbar = withinFC && itemProps?.withGhostToolbar === "true";
  const withFcGroup = withinFC && itemProps?.fcGroup === "true";

  const leadingIconKey = itemProps?.leadingIcon || "LfPlusLarge";
  const trailingIconKey = itemProps?.trailingIcon || "LfPlusLarge";
  const LeadingIcon = withLeading ? getAegisIconComponent(leadingIconKey) : undefined;
  const TrailingIcon = withTrailing ? getAegisIconComponent(trailingIconKey) : undefined;

  const labelText = itemProps?.fcLabel || "Label";
  const captionText = itemProps?.fcCaptionText || "Caption text";

  const toolbarCount = withToolbar ? Math.min(Math.max(parseInt(itemProps?.toolbarItems ?? "2", 10), 1), 3) : 0;
  const getToolbarLabel = (n: number) =>
    toolbarCount === 1 ? itemProps?.btnLabel || "Action" : itemProps?.[`btnLabel${n}`] || `Action ${n}`;

  const parseTime = (raw: string | undefined) => {
    if (!raw) return undefined;
    const [h, m] = raw.split(":").map(Number);
    return !Number.isNaN(h) && !Number.isNaN(m) ? { hours: h, minutes: m } : undefined;
  };

  const minuteStep = Math.max(1, parseInt(itemProps?.minuteStep ?? "5", 10));
  const minValue = itemProps?.hasMinValue === "true" ? parseTime(itemProps?.minValue) : undefined;
  const maxValue = itemProps?.hasMaxValue === "true" ? parseTime(itemProps?.maxValue) : undefined;

  const rangetimepicker = (
    <RangeTimePicker
      aria-label={getPreviewInputAriaLabel("RangeTimePicker", labelText)}
      size={size}
      leading={
        LeadingIcon ? (
          <Icon>
            <LeadingIcon />
          </Icon>
        ) : undefined
      }
      trailing={
        TrailingIcon ? (
          <Icon>
            <TrailingIcon />
          </Icon>
        ) : undefined
      }
      minuteStep={minuteStep}
      minValue={minValue}
      maxValue={maxValue}
    />
  );

  if (!withinFC) return rangetimepicker;

  const subInput = withFcGroup ? renderPreviewGroupInput(itemProps?.fcGroupInputType ?? "Select") : undefined;

  return (
    <FormControl required={required} orientation={orientation}>
      {showFcTitle && (
        <FormControl.Label
          weight={labelWeight}
          width={labelWidth}
          trailing={
            labelTrailing ? (
              <Text variant="caption.small" color="subtle">
                (任意)
              </Text>
            ) : undefined
          }
        >
          {labelText}
        </FormControl.Label>
      )}
      {withToolbar && (
        <FormControl.Toolbar ghost={ghostToolbar}>
          {Array.from({ length: toolbarCount }, (_, i) => i).map((i) => (
            <React.Fragment key={i}>
              {i > 0 && <Divider />}
              <Button variant="gutterless">{getToolbarLabel(i + 1)}</Button>
            </React.Fragment>
          ))}
        </FormControl.Toolbar>
      )}
      {withFcGroup ? (
        <FormControl.Group>
          {rangetimepicker}
          {subInput}
        </FormControl.Group>
      ) : (
        rangetimepicker
      )}
      {showFcCaption && <FormControl.Caption>{captionText}</FormControl.Caption>}
    </FormControl>
  );
};

const parseDateProp = (str: string | undefined): Date | undefined => {
  if (!str) return undefined;
  const d = new Date(str);
  return Number.isNaN(d.getTime()) ? undefined : d;
};

const DatePickerRenderer = ({ itemProps }: { itemProps?: Record<string, string> }): React.ReactElement => {
  const size = (itemProps?.size ?? "medium") as "large" | "medium";
  const granularity = itemProps?.granularity === "true" ? ("minute" as const) : ("day" as const);
  const withLeading = itemProps?.leading === "true";
  const withTrailing = itemProps?.trailing === "true";
  const withinFC = itemProps?.withinFormControl !== "false";
  const showFcTitle = itemProps?.fcTitle !== "false";
  const showFcCaption = itemProps?.fcCaption === "true";
  const required = withinFC && itemProps?.required === "true";
  const orientation = (itemProps?.orientation ?? "vertical") as "vertical" | "horizontal";
  const labelWidthRaw = itemProps?.labelWidth ?? "Off";
  const labelWidth =
    withinFC && orientation === "horizontal" && labelWidthRaw !== "Off"
      ? (labelWidthRaw as "medium" | "small" | "xSmall" | "auto")
      : undefined;
  const labelWeight =
    withinFC && orientation === "horizontal" ? ((itemProps?.labelWeight ?? "bold") as "bold" | "normal") : "bold";
  const labelTrailing = withinFC && orientation === "horizontal" && itemProps?.labelTrailing === "true";
  const withToolbar = withinFC && itemProps?.withToolbar === "true";
  const ghostToolbar = withinFC && itemProps?.withGhostToolbar === "true";
  const withFcGroup = withinFC && itemProps?.fcGroup === "true";

  const leadingIconKey = itemProps?.leadingIcon || "LfPlusLarge";
  const trailingIconKey = itemProps?.trailingIcon || "LfPlusLarge";
  const LeadingIcon = withLeading ? getAegisIconComponent(leadingIconKey) : undefined;
  const TrailingIcon = withTrailing ? getAegisIconComponent(trailingIconKey) : undefined;

  const labelText = itemProps?.fcLabel || "Label";
  const captionText = itemProps?.fcCaptionText || "Caption text";

  const toolbarCount = withToolbar ? Math.min(Math.max(parseInt(itemProps?.toolbarItems ?? "2", 10), 1), 3) : 0;
  const getToolbarLabel = (n: number) =>
    toolbarCount === 1 ? itemProps?.btnLabel || "Action" : itemProps?.[`btnLabel${n}`] || `Action ${n}`;

  const datepicker = (
    <DatePicker
      key={itemProps?.defaultValue}
      aria-label={getPreviewInputAriaLabel("DatePicker", labelText)}
      size={size}
      granularity={granularity}
      leading={
        LeadingIcon ? (
          <Icon>
            <LeadingIcon />
          </Icon>
        ) : undefined
      }
      trailing={
        TrailingIcon ? (
          <Icon>
            <TrailingIcon />
          </Icon>
        ) : undefined
      }
      minValue={itemProps?.hasMinValue === "true" ? parseDateProp(itemProps?.minValue) : undefined}
      maxValue={itemProps?.hasMaxValue === "true" ? parseDateProp(itemProps?.maxValue) : undefined}
      defaultValue={parseDateProp(itemProps?.defaultValue)}
    />
  );

  if (!withinFC) return datepicker;

  const subInput = withFcGroup ? renderPreviewGroupInput(itemProps?.fcGroupInputType ?? "Select") : undefined;

  return (
    <FormControl required={required} orientation={orientation}>
      {showFcTitle && (
        <FormControl.Label
          weight={labelWeight}
          width={labelWidth}
          trailing={
            labelTrailing ? (
              <Text variant="caption.small" color="subtle">
                (任意)
              </Text>
            ) : undefined
          }
        >
          {labelText}
        </FormControl.Label>
      )}
      {withToolbar && (
        <FormControl.Toolbar ghost={ghostToolbar}>
          {Array.from({ length: toolbarCount }, (_, i) => i).map((i) => (
            <React.Fragment key={i}>
              {i > 0 && <Divider />}
              <Button variant="gutterless">{getToolbarLabel(i + 1)}</Button>
            </React.Fragment>
          ))}
        </FormControl.Toolbar>
      )}
      {withFcGroup ? (
        <FormControl.Group>
          {datepicker}
          {subInput}
        </FormControl.Group>
      ) : (
        datepicker
      )}
      {showFcCaption && <FormControl.Caption>{captionText}</FormControl.Caption>}
    </FormControl>
  );
};

const RangeDatePickerRenderer = ({ itemProps }: { itemProps?: Record<string, string> }): React.ReactElement => {
  const size = (itemProps?.size ?? "medium") as "large" | "medium";
  const withLeading = itemProps?.leading === "true";
  const withTrailing = itemProps?.trailing === "true";
  const withinFC = itemProps?.withinFormControl !== "false";
  const showFcTitle = itemProps?.fcTitle !== "false";
  const showFcCaption = itemProps?.fcCaption === "true";
  const required = withinFC && itemProps?.required === "true";
  const orientation = (itemProps?.orientation ?? "vertical") as "vertical" | "horizontal";
  const labelWidthRaw = itemProps?.labelWidth ?? "Off";
  const labelWidth =
    withinFC && orientation === "horizontal" && labelWidthRaw !== "Off"
      ? (labelWidthRaw as "medium" | "small" | "xSmall" | "auto")
      : undefined;
  const labelWeight =
    withinFC && orientation === "horizontal" ? ((itemProps?.labelWeight ?? "bold") as "bold" | "normal") : "bold";
  const labelTrailing = withinFC && orientation === "horizontal" && itemProps?.labelTrailing === "true";
  const withToolbar = withinFC && itemProps?.withToolbar === "true";
  const ghostToolbar = withinFC && itemProps?.withGhostToolbar === "true";
  const withFcGroup = withinFC && itemProps?.fcGroup === "true";

  const leadingIconKey = itemProps?.leadingIcon || "LfPlusLarge";
  const trailingIconKey = itemProps?.trailingIcon || "LfPlusLarge";
  const LeadingIcon = withLeading ? getAegisIconComponent(leadingIconKey) : undefined;
  const TrailingIcon = withTrailing ? getAegisIconComponent(trailingIconKey) : undefined;

  const labelText = itemProps?.fcLabel || "Label";
  const captionText = itemProps?.fcCaptionText || "Caption text";

  const toolbarCount = withToolbar ? Math.min(Math.max(parseInt(itemProps?.toolbarItems ?? "2", 10), 1), 3) : 0;
  const getToolbarLabel = (n: number) =>
    toolbarCount === 1 ? itemProps?.btnLabel || "Action" : itemProps?.[`btnLabel${n}`] || `Action ${n}`;

  const rangepicker = (
    <RangeDatePicker
      key={`${itemProps?.defaultStartValue ?? ""}-${itemProps?.defaultEndValue ?? ""}`}
      aria-label={getPreviewInputAriaLabel("RangeDatePicker", labelText)}
      size={size}
      leading={
        LeadingIcon ? (
          <Icon>
            <LeadingIcon />
          </Icon>
        ) : undefined
      }
      trailing={
        TrailingIcon ? (
          <Icon>
            <TrailingIcon />
          </Icon>
        ) : undefined
      }
      defaultStartValue={parseDateProp(itemProps?.defaultStartValue)}
      defaultEndValue={parseDateProp(itemProps?.defaultEndValue)}
      minValue={itemProps?.hasMinValue === "true" ? parseDateProp(itemProps?.minValue) : undefined}
      maxValue={itemProps?.hasMaxValue === "true" ? parseDateProp(itemProps?.maxValue) : undefined}
    />
  );

  if (!withinFC) return rangepicker;

  const subInput = withFcGroup ? renderPreviewGroupInput(itemProps?.fcGroupInputType ?? "Select") : undefined;

  return (
    <FormControl required={required} orientation={orientation}>
      {showFcTitle && (
        <FormControl.Label
          weight={labelWeight}
          width={labelWidth}
          trailing={
            labelTrailing ? (
              <Text variant="caption.small" color="subtle">
                (任意)
              </Text>
            ) : undefined
          }
        >
          {labelText}
        </FormControl.Label>
      )}
      {withToolbar && (
        <FormControl.Toolbar ghost={ghostToolbar}>
          {Array.from({ length: toolbarCount }, (_, i) => i).map((i) => (
            <React.Fragment key={i}>
              {i > 0 && <Divider />}
              <Button variant="gutterless">{getToolbarLabel(i + 1)}</Button>
            </React.Fragment>
          ))}
        </FormControl.Toolbar>
      )}
      {withFcGroup ? (
        <FormControl.Group>
          {rangepicker}
          {subInput}
        </FormControl.Group>
      ) : (
        rangepicker
      )}
      {showFcCaption && <FormControl.Caption>{captionText}</FormControl.Caption>}
    </FormControl>
  );
};

const SearchRenderer = ({ itemProps }: { itemProps?: Record<string, string> }): React.ReactElement => {
  const size = (itemProps?.size ?? "medium") as "large" | "medium" | "small";
  const variant = (itemProps?.variant ?? "outline") as "outline" | "underline";
  const withTrailing = itemProps?.trailing === "true";
  const shrinkOnBlur = itemProps?.shrinkOnBlur === "true";
  const withinFC = !shrinkOnBlur && itemProps?.withinFormControl !== "false";
  const showFcTitle = itemProps?.fcTitle !== "false";
  const showFcCaption = itemProps?.fcCaption === "true";
  const required = withinFC && itemProps?.required === "true";
  const orientation = (itemProps?.orientation ?? "vertical") as "vertical" | "horizontal";
  const labelWidthRaw = itemProps?.labelWidth ?? "Off";
  const labelWidth =
    withinFC && orientation === "horizontal" && labelWidthRaw !== "Off"
      ? (labelWidthRaw as "medium" | "small" | "xSmall" | "auto")
      : undefined;
  const labelWeight =
    withinFC && orientation === "horizontal" ? ((itemProps?.labelWeight ?? "bold") as "bold" | "normal") : "bold";
  const labelTrailing = withinFC && orientation === "horizontal" && itemProps?.labelTrailing === "true";
  const withToolbar = withinFC && itemProps?.withToolbar === "true";
  const ghostToolbar = withinFC && itemProps?.withGhostToolbar === "true";
  const withFcGroup = withinFC && itemProps?.fcGroup === "true";

  const trailingIconKey = itemProps?.trailingIcon || "LfPlusLarge";
  const TrailingIcon = withTrailing ? getAegisIconComponent(trailingIconKey) : undefined;

  const labelText = itemProps?.fcLabel || "Label";
  const captionText = itemProps?.fcCaptionText || "Caption text";

  const toolbarCount = withToolbar ? Math.min(Math.max(parseInt(itemProps?.toolbarItems ?? "2", 10), 1), 3) : 0;
  const getToolbarLabel = (n: number) =>
    toolbarCount === 1 ? itemProps?.btnLabel || "Action" : itemProps?.[`btnLabel${n}`] || `Action ${n}`;

  const subInput = withFcGroup ? renderPreviewGroupInput(itemProps?.fcGroupInputType ?? "Select") : undefined;

  const search = (
    <Search
      aria-label={getPreviewInputAriaLabel("Search", labelText)}
      size={size}
      variant={variant}
      trailing={
        TrailingIcon ? (
          <Icon>
            <TrailingIcon />
          </Icon>
        ) : undefined
      }
      shrinkOnBlur={shrinkOnBlur}
      placeholder={itemProps?.placeholder || undefined}
      clearable={itemProps?.clearable === "true"}
    />
  );

  if (!withinFC) return search;

  return (
    <FormControl required={required} orientation={orientation}>
      {showFcTitle && (
        <FormControl.Label
          weight={labelWeight}
          width={labelWidth}
          trailing={
            labelTrailing ? (
              <Text variant="caption.small" color="subtle">
                (任意)
              </Text>
            ) : undefined
          }
        >
          {labelText}
        </FormControl.Label>
      )}
      {withToolbar && (
        <FormControl.Toolbar ghost={ghostToolbar}>
          {Array.from({ length: toolbarCount }, (_, i) => i).map((i) => (
            <React.Fragment key={i}>
              {i > 0 && <Divider />}
              <Button variant="gutterless">{getToolbarLabel(i + 1)}</Button>
            </React.Fragment>
          ))}
        </FormControl.Toolbar>
      )}
      {withFcGroup ? (
        <FormControl.Group>
          {search}
          {subInput}
        </FormControl.Group>
      ) : (
        search
      )}
      {showFcCaption && <FormControl.Caption>{captionText}</FormControl.Caption>}
    </FormControl>
  );
};

const TagInputRenderer = ({ itemProps }: { itemProps?: Record<string, string> }): React.ReactElement => {
  const size = (itemProps?.size ?? "medium") as "large" | "medium" | "small";
  const variant = (itemProps?.variant ?? "outline") as "outline" | "underline";
  const withLeading = itemProps?.leading === "true";
  const withTrailing = itemProps?.trailing === "true";
  const shrinkOnBlur = itemProps?.shrinkOnBlur === "true";
  const withinFC = itemProps?.withinFormControl !== "false";
  const showFcTitle = itemProps?.fcTitle !== "false";
  const showFcCaption = itemProps?.fcCaption === "true";
  const required = withinFC && itemProps?.required === "true";
  const orientation = (itemProps?.orientation ?? "vertical") as "vertical" | "horizontal";
  const labelWidthRaw = itemProps?.labelWidth ?? "Off";
  const labelWidth =
    withinFC && orientation === "horizontal" && labelWidthRaw !== "Off"
      ? (labelWidthRaw as "medium" | "small" | "xSmall" | "auto")
      : undefined;
  const labelWeight =
    withinFC && orientation === "horizontal" ? ((itemProps?.labelWeight ?? "bold") as "bold" | "normal") : "bold";
  const labelTrailing = withinFC && orientation === "horizontal" && itemProps?.labelTrailing === "true";
  const withToolbar = withinFC && itemProps?.withToolbar === "true";
  const ghostToolbar = withinFC && itemProps?.withGhostToolbar === "true";
  const withFcGroup = withinFC && itemProps?.fcGroup === "true";

  const leadingType = itemProps?.leadingType ?? "text";
  const leadingIconKey = itemProps?.leadingIcon || "LfPlusLarge";
  const trailingIconKey = itemProps?.trailingIcon || "LfPlusLarge";
  const LeadingIcon = withLeading && leadingType === "icon" ? getAegisIconComponent(leadingIconKey) : undefined;
  const TrailingIcon = withTrailing ? getAegisIconComponent(trailingIconKey) : undefined;
  const leadingNode = withLeading ? (
    leadingType === "icon" ? (
      LeadingIcon ? (
        <Icon>
          <LeadingIcon />
        </Icon>
      ) : undefined
    ) : (
      itemProps?.leadingText || "From:"
    )
  ) : undefined;

  const labelText = itemProps?.fcLabel || "Label";
  const captionText = itemProps?.fcCaptionText || "Caption text";

  const toolbarCount = withToolbar ? Math.min(Math.max(parseInt(itemProps?.toolbarItems ?? "2", 10), 1), 3) : 0;
  const getToolbarLabel = (n: number) =>
    toolbarCount === 1 ? itemProps?.btnLabel || "Action" : itemProps?.[`btnLabel${n}`] || `Action ${n}`;

  const maxSelection =
    itemProps?.hasMaxSelection === "true" ? Math.max(1, parseInt(itemProps?.maxSelection ?? "3", 10)) : undefined;
  const defaultTags = (() => {
    const tags = (itemProps?.defaultTags ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return maxSelection !== undefined ? tags.slice(0, maxSelection) : tags;
  })();

  const subInput = withFcGroup ? renderPreviewGroupInput(itemProps?.fcGroupInputType ?? "Select") : undefined;

  const taginput = (
    <TagInput
      aria-label={getPreviewInputAriaLabel("TagInput", labelText)}
      key={`${itemProps?.defaultTags ?? ""}-${itemProps?.hasMaxSelection ?? ""}-${itemProps?.maxSelection ?? ""}`}
      size={size}
      variant={variant}
      leading={leadingNode}
      trailing={
        TrailingIcon ? (
          <Icon>
            <TrailingIcon />
          </Icon>
        ) : undefined
      }
      shrinkOnBlur={shrinkOnBlur}
      defaultValue={defaultTags.length > 0 ? defaultTags : undefined}
      placeholder={itemProps?.placeholder || undefined}
      addCaption={itemProps?.addCaption !== "false"}
      maxSelection={maxSelection}
    />
  );

  if (!withinFC) return taginput;

  return (
    <FormControl required={required} orientation={orientation}>
      {showFcTitle && (
        <FormControl.Label
          weight={labelWeight}
          width={labelWidth}
          trailing={
            labelTrailing ? (
              <Text variant="caption.small" color="subtle">
                (任意)
              </Text>
            ) : undefined
          }
        >
          {labelText}
        </FormControl.Label>
      )}
      {withToolbar && (
        <FormControl.Toolbar ghost={ghostToolbar}>
          {Array.from({ length: toolbarCount }, (_, i) => i).map((i) => (
            <React.Fragment key={i}>
              {i > 0 && <Divider />}
              <Button variant="gutterless">{getToolbarLabel(i + 1)}</Button>
            </React.Fragment>
          ))}
        </FormControl.Toolbar>
      )}
      {withFcGroup ? (
        <FormControl.Group>
          {taginput}
          {subInput}
        </FormControl.Group>
      ) : (
        taginput
      )}
      {showFcCaption && <FormControl.Caption>{captionText}</FormControl.Caption>}
    </FormControl>
  );
};

const TagPickerRenderer = ({ itemProps }: { itemProps?: Record<string, string> }): React.ReactElement => {
  const size = (itemProps?.size ?? "medium") as "large" | "medium" | "small";
  const variant = (itemProps?.variant ?? "outline") as "outline" | "underline";
  const withLeading = itemProps?.leading === "true";
  const withTrailing = itemProps?.trailing === "true";
  const shrinkOnBlur = itemProps?.shrinkOnBlur === "true";
  const withinFC = itemProps?.withinFormControl !== "false";
  const showFcTitle = itemProps?.fcTitle !== "false";
  const showFcCaption = itemProps?.fcCaption === "true";
  const required = withinFC && itemProps?.required === "true";
  const orientation = (itemProps?.orientation ?? "vertical") as "vertical" | "horizontal";
  const labelWidthRaw = itemProps?.labelWidth ?? "Off";
  const labelWidth =
    withinFC && orientation === "horizontal" && labelWidthRaw !== "Off"
      ? (labelWidthRaw as "medium" | "small" | "xSmall" | "auto")
      : undefined;
  const labelWeight =
    withinFC && orientation === "horizontal" ? ((itemProps?.labelWeight ?? "bold") as "bold" | "normal") : "bold";
  const labelTrailing = withinFC && orientation === "horizontal" && itemProps?.labelTrailing === "true";
  const withToolbar = withinFC && itemProps?.withToolbar === "true";
  const ghostToolbar = withinFC && itemProps?.withGhostToolbar === "true";
  const withFcGroup = withinFC && itemProps?.fcGroup === "true";

  const leadingType = itemProps?.leadingType ?? "text";
  const leadingIconKey = itemProps?.leadingIcon || "LfPlusLarge";
  const trailingIconKey = itemProps?.trailingIcon || "LfPlusLarge";
  const LeadingIcon = withLeading && leadingType === "icon" ? getAegisIconComponent(leadingIconKey) : undefined;
  const TrailingIcon = withTrailing ? getAegisIconComponent(trailingIconKey) : undefined;
  const leadingNode = withLeading ? (
    leadingType === "icon" ? (
      LeadingIcon ? (
        <Icon>
          <LeadingIcon />
        </Icon>
      ) : undefined
    ) : (
      itemProps?.leadingText || "From:"
    )
  ) : undefined;

  const labelText = itemProps?.fcLabel || "Label";
  const captionText = itemProps?.fcCaptionText || "Caption text";

  const toolbarCount = withToolbar ? Math.min(Math.max(parseInt(itemProps?.toolbarItems ?? "2", 10), 1), 3) : 0;
  const getToolbarLabel = (n: number) =>
    toolbarCount === 1 ? itemProps?.btnLabel || "Action" : itemProps?.[`btnLabel${n}`] || `Action ${n}`;

  const optionsRaw = (itemProps?.options ?? "Tag A,Tag B,Tag C,Tag D,Tag E")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const options = optionsRaw.map((v) => ({ value: v, label: v }));

  const maxSelection =
    itemProps?.hasMaxSelection === "true" ? Math.max(1, parseInt(itemProps?.maxSelection ?? "3", 10)) : undefined;

  const subInput = withFcGroup ? renderPreviewGroupInput(itemProps?.fcGroupInputType ?? "Select") : undefined;

  const tagpicker = (
    <TagPicker
      aria-label={getPreviewInputAriaLabel("TagPicker", labelText)}
      key={`${itemProps?.options ?? ""}-${itemProps?.hasMaxSelection ?? ""}-${itemProps?.maxSelection ?? ""}`}
      size={size}
      variant={variant}
      leading={leadingNode}
      trailing={
        TrailingIcon ? (
          <Icon>
            <TrailingIcon />
          </Icon>
        ) : undefined
      }
      options={options}
      shrinkOnBlur={shrinkOnBlur}
      placeholder={itemProps?.placeholder || undefined}
      maxSelection={maxSelection}
    />
  );

  if (!withinFC) return tagpicker;

  return (
    <FormControl required={required} orientation={orientation}>
      {showFcTitle && (
        <FormControl.Label
          weight={labelWeight}
          width={labelWidth}
          trailing={
            labelTrailing ? (
              <Text variant="caption.small" color="subtle">
                (任意)
              </Text>
            ) : undefined
          }
        >
          {labelText}
        </FormControl.Label>
      )}
      {withToolbar && (
        <FormControl.Toolbar ghost={ghostToolbar}>
          {Array.from({ length: toolbarCount }, (_, i) => i).map((i) => (
            <React.Fragment key={i}>
              {i > 0 && <Divider />}
              <Button variant="gutterless">{getToolbarLabel(i + 1)}</Button>
            </React.Fragment>
          ))}
        </FormControl.Toolbar>
      )}
      {withFcGroup ? (
        <FormControl.Group>
          {tagpicker}
          {subInput}
        </FormControl.Group>
      ) : (
        tagpicker
      )}
      {showFcCaption && <FormControl.Caption>{captionText}</FormControl.Caption>}
    </FormControl>
  );
};

const TextareaRenderer = ({ itemProps }: { itemProps?: Record<string, string> }): React.ReactElement => {
  const withCountLabel = itemProps?.withCountLabel === "true";
  const withinFC = itemProps?.withinFormControl !== "false";

  const [countValue, setCountValue] = React.useState("");
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset countValue when withCountLabel changes; setCountValue is stable
  React.useEffect(() => {
    setCountValue("");
  }, [withCountLabel]);
  const showFcTitle = itemProps?.fcTitle !== "false";
  const showFcCaption = itemProps?.fcCaption === "true";
  const required = withinFC && itemProps?.required === "true";
  const orientation = (itemProps?.orientation ?? "vertical") as "vertical" | "horizontal";
  const labelWidthRaw = itemProps?.labelWidth ?? "Off";
  const labelWidth =
    withinFC && orientation === "horizontal" && labelWidthRaw !== "Off"
      ? (labelWidthRaw as "medium" | "small" | "xSmall" | "auto")
      : undefined;
  const labelWeight =
    withinFC && orientation === "horizontal" ? ((itemProps?.labelWeight ?? "bold") as "bold" | "normal") : "bold";
  const labelTrailing = withinFC && orientation === "horizontal" && itemProps?.labelTrailing === "true";
  const withToolbar = withinFC && itemProps?.withToolbar === "true";
  const ghostToolbar = withinFC && itemProps?.withGhostToolbar === "true";

  const labelText = itemProps?.fcLabel || "Label";
  const captionText = itemProps?.fcCaptionText || "Caption text";

  const toolbarCount = withToolbar ? Math.min(Math.max(parseInt(itemProps?.toolbarItems ?? "2", 10), 1), 3) : 0;
  const getToolbarLabel = (n: number) =>
    toolbarCount === 1 ? itemProps?.btnLabel || "Action" : itemProps?.[`btnLabel${n}`] || `Action ${n}`;

  const minRows = Math.max(1, parseInt(itemProps?.minRows ?? "3", 10));
  const maxRows =
    itemProps?.hasMaxRows === "true" ? Math.max(minRows, parseInt(itemProps?.maxRows ?? "6", 10)) : undefined;
  const maxCount = withCountLabel ? Math.max(1, parseInt(itemProps?.maxCount ?? "100", 10)) : undefined;

  const trailingNode =
    withCountLabel && maxCount !== undefined ? (
      <Textarea.CountLabel count={countValue.length} max={maxCount} />
    ) : undefined;

  const textarea = (
    <Textarea
      aria-label={getPreviewInputAriaLabel("Textarea", labelText)}
      key={`${itemProps?.minRows ?? ""}-${itemProps?.hasMaxRows ?? ""}-${itemProps?.maxRows ?? ""}-${itemProps?.withCountLabel ?? ""}-${itemProps?.maxCount ?? ""}`}
      trailing={trailingNode}
      placeholder={itemProps?.placeholder || "Placeholder"}
      minRows={minRows}
      maxRows={maxRows}
      error={itemProps?.error === "true"}
      {...(withCountLabel
        ? { value: countValue, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setCountValue(e.target.value) }
        : {})}
    />
  );

  if (!withinFC) return textarea;

  return (
    <FormControl required={required} orientation={orientation}>
      {showFcTitle && (
        <FormControl.Label
          weight={labelWeight}
          width={labelWidth}
          trailing={
            labelTrailing ? (
              <Text variant="caption.small" color="subtle">
                (任意)
              </Text>
            ) : undefined
          }
        >
          {labelText}
        </FormControl.Label>
      )}
      {withToolbar && (
        <FormControl.Toolbar ghost={ghostToolbar}>
          {Array.from({ length: toolbarCount }, (_, i) => i).map((i) => (
            <React.Fragment key={i}>
              {i > 0 && <Divider />}
              <Button variant="gutterless">{getToolbarLabel(i + 1)}</Button>
            </React.Fragment>
          ))}
        </FormControl.Toolbar>
      )}
      {textarea}
      {showFcCaption && <FormControl.Caption>{captionText}</FormControl.Caption>}
    </FormControl>
  );
};

const EMPTYSTATE_ICON_COLORS: Record<string, string> = {
  LfHourglass: "var(--aegis-color-foreground-default)",
  LfWarningRhombus: "var(--aegis-color-foreground-warning)",
  LfWarningTriangleFill: "var(--aegis-color-foreground-danger)",
  LfInformationCircle: "var(--aegis-color-foreground-information)",
  LfCheckCircle: "var(--aegis-color-foreground-success)",
};

const EMPTYSTATE_ICON_COMPONENTS: Record<string, React.ComponentType> = {
  LfHourglass: LfHourglass,
  LfWarningRhombus: LfWarningRhombus,
  LfWarningTriangleFill: LfWarningTriangleFill,
  LfInformationCircle: LfInformationCircle,
  LfCheckCircle: LfCheckCircle,
};

const EMPTYSTATE_ILLUST_COMPONENTS: Record<string, React.ComponentType> = {
  book: Book,
  box: Box,
  contract: Contract,
  "error-cat-1": ErrorCat1,
  "error-cat-2": ErrorCat2,
  "error-cat-3": ErrorCat3,
  "magnifying-glass": MagnifyingGlass,
};

const RadioGroupRenderer = ({ itemProps }: { itemProps?: Record<string, string> }): React.ReactElement => {
  const rgIsCard = itemProps?.withRadioCard === "true";
  // biome-ignore lint/suspicious/noExplicitAny: RadioGroup size prop accepts values not fully typed
  const rgSize = (rgIsCard ? (itemProps?.sizeCard ?? "medium") : (itemProps?.size ?? "medium")) as any;
  // biome-ignore lint/suspicious/noExplicitAny: RadioGroup orientation prop accepts values not fully typed
  const rgOrientation = (itemProps?.orientation ?? "vertical") as any;
  const rgTitle = itemProps?.title === "true" ? itemProps?.titleText || "Title" : undefined;
  const COUNT = Math.min(Math.max(parseInt(itemProps?.items ?? "3", 10) || 2, 2), 10);

  if (rgIsCard) {
    // biome-ignore lint/suspicious/noExplicitAny: RadioCard variant prop accepts values not fully typed
    const rgVariant = (itemProps?.variant ?? "plain") as any;
    const LABEL_COUNT = Math.min(Math.max(parseInt(itemProps?.labelItems ?? "1", 10) || 1, 1), 5);
    const FALLBACKS = ["label.medium", "body.small", "caption.small", "data.small", "body.small"];

    const rowStyleProps = (rowN: number): Record<string, string> => {
      const prefix = `cardLabelStyle${rowN}_`;
      return Object.fromEntries(
        Object.entries(itemProps ?? {})
          .filter(([k]) => k.startsWith(prefix))
          .map(([k, v]) => [k.slice(prefix.length), v]),
      );
    };

    const rowValues = Array.from({ length: LABEL_COUNT }, (_, rowIdx) => {
      const rowN = rowIdx + 1;
      const allRowsVals = parseMultiValues(itemProps?.[`cardLabel${rowN}`], COUNT, `Label ${rowN}`);
      return Array.from({ length: COUNT }, (_, cardIdx) => {
        const perRowKey = `cardLabel${rowN}_row${cardIdx + 1}`;
        return itemProps?.[perRowKey] || allRowsVals[cardIdx];
      });
    });

    return (
      <RadioGroup size={rgSize} title={rgTitle} defaultValue="a">
        {Array.from({ length: COUNT }, (_, i) => {
          const val = String.fromCharCode(97 + i);
          return (
            <RadioCard key={val} value={val} variant={rgVariant} size={rgSize}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {Array.from({ length: LABEL_COUNT }, (_, rowIdx) => rowIdx).map((rowIdx) => {
                  const rowN = rowIdx + 1;
                  const label = rowValues[rowIdx][i] || `Label ${rowN}`;
                  const styleP = rowStyleProps(rowN);
                  // biome-ignore lint/suspicious/noExplicitAny: Text variant prop accepts dynamic values not fully typed
                  const typedVariant = resolveTypoVariant(styleP, FALLBACKS[rowIdx] ?? "body.small") as any;
                  const rawColor =
                    Object.keys(styleP).length === 0 && rowIdx > 0
                      ? "subtle"
                      : resolveTypoColor(styleP, FALLBACKS[rowIdx] ?? "body.small");
                  // biome-ignore lint/suspicious/noExplicitAny: Text color prop accepts dynamic values not fully typed
                  const typedColor = rawColor as any;
                  return (
                    <Text key={`row-${rowIdx}`} variant={typedVariant} color={typedColor}>
                      {label}
                    </Text>
                  );
                })}
              </div>
            </RadioCard>
          );
        })}
      </RadioGroup>
    );
  }

  const optLabels = parseMultiValues(itemProps?.text, COUNT, "");
  return (
    <RadioGroup size={rgSize} orientation={rgOrientation} title={rgTitle} defaultValue="a">
      {Array.from({ length: COUNT }, (_, i) => {
        const val = String.fromCharCode(97 + i);
        const label = optLabels[i] || `Option ${String.fromCharCode(65 + i)}`;
        return (
          <Radio key={val} value={val}>
            {label}
          </Radio>
        );
      })}
    </RadioGroup>
  );
};

const EmptyStateRenderer = ({
  itemProps,
  area,
}: {
  itemProps?: Record<string, string>;
  area?: ContentArea;
}): React.ReactElement => {
  const size = area === "contentBody" ? ("medium" as const) : ("small" as const);
  const withVisual = itemProps?.visual === "true";
  const visualType = size === "small" ? "Icon" : (itemProps?.visualType ?? "Icon");
  const iconKey = itemProps?.icon ?? "LfHourglass";
  const illustKey = itemProps?.illust ?? "box";
  const showTitle = itemProps?.title !== "false";
  const showBtns = itemProps?.buttonGroup !== "false";
  const titleText = itemProps?.titleText || "No Items Found";
  const bodyText = itemProps?.text || "There are no items to display at this time.";
  const btnCount = showBtns ? Math.min(Math.max(parseInt(itemProps?.btnItems ?? "1", 10), 1), 3) : 0;
  const getBtnLabel = (n: number) => itemProps?.[`btnLabel${n}`] || (n === 1 ? "Action" : `Action ${n}`);

  const visual = (() => {
    if (!withVisual) return undefined;
    if (visualType === "Illust") {
      const IllustComp = EMPTYSTATE_ILLUST_COMPONENTS[illustKey] ?? Box;
      return <IllustComp />;
    }
    const IconComp = EMPTYSTATE_ICON_COMPONENTS[iconKey] ?? LfHourglass;
    const color = EMPTYSTATE_ICON_COLORS[iconKey] ?? "var(--aegis-color-foreground-default)";
    return (
      <Icon size="xxLarge" style={{ color }}>
        <IconComp />
      </Icon>
    );
  })();

  const action = showBtns ? (
    <ButtonGroup>
      {Array.from({ length: btnCount }, (_, i) => i).map((i) => (
        <Button key={`btn-${i}`}>{getBtnLabel(i + 1)}</Button>
      ))}
    </ButtonGroup>
  ) : undefined;

  return (
    <EmptyState size={size} visual={visual} title={showTitle ? titleText : undefined} action={action}>
      {bodyText}
    </EmptyState>
  );
};

// ---

interface Props {
  component: ComponentKey;
  itemProps?: Record<string, string>;
  area?: ContentArea;
  onUpdate?: (props: Record<string, string>) => void;
}

export const ComponentRenderer = ({ component, itemProps, area, onUpdate }: Props): React.ReactElement | null => {
  switch (component) {
    case "Accordion": {
      const multiple = itemProps?.expandMultiple === "true";
      const buttonWidth = itemProps?.buttonWidth === "true" ? ("auto" as const) : ("full" as const);
      const hasIcon = itemProps?.buttonIcon === "true";
      const iconKey = itemProps?.icon || "LfPlusLarge";
      const iconPosition = (itemProps?.iconPosition as "start" | "end") ?? "end";
      const variant = (itemProps?.buttonVariant as "solid" | "subtle" | "plain") ?? "plain";
      const closeButton = itemProps?.withPanelCloseButton === "true";
      const itemsCount = Math.min(Math.max(parseInt(itemProps?.items ?? "3", 10) || 1, 1), 10);
      const labelValues = parseMultiValues(itemProps?.label, itemsCount, "Section");
      const contentValues = parseMultiValues(itemProps?.content, itemsCount, "Content goes here.");
      const IconComp = hasIcon ? getAegisIconComponent(iconKey) : undefined;
      // biome-ignore lint/suspicious/noExplicitAny: Accordion size prop accepts dynamic string values not fully typed
      const accordionSize = itemProps?.size as any;
      return (
        <Accordion defaultIndex={[]} multiple={multiple} size={accordionSize} bordered={itemProps?.bordered === "true"}>
          {Array.from({ length: itemsCount }, (_, i) => i).map((i) => (
            <AccordionItem key={`item-${i}`}>
              <AccordionButton
                width={buttonWidth}
                iconPosition={iconPosition}
                variant={variant}
                icon={
                  IconComp ? (
                    <Icon>
                      <IconComp />
                    </Icon>
                  ) : undefined
                }
              >
                {labelValues[i]}
              </AccordionButton>
              <AccordionPanel closeButton={closeButton}>{contentValues[i]}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      );
    }

    case "ActionList": {
      const size = (itemProps?.size as "small" | "medium" | "large") ?? "medium";
      const selectionType = itemProps?.selectionType === "true" ? ("multiple" as const) : undefined;
      const hasAvatar = itemProps?.avatar === "true";
      const withGroup = itemProps?.withGroup === "true";
      const withGroupTitle = itemProps?.withGroupTitle === "true";
      const withDescription = itemProps?.withDescription === "true";
      const hasTrailingButton = itemProps?.trailingButton === "true";

      // multi-value textarea: カンマ区切り入力を最大アイテム数分展開 (parseMultiValues は base に定義)
      const MAX_ITEMS = 100;
      const listLabelValues = parseMultiValues(itemProps?.listLabel, MAX_ITEMS, "ActionList");
      const descValues = parseMultiValues(itemProps?.description, MAX_ITEMS, "ActionList");
      const getItemLabel = (idx: number) => listLabelValues[idx];
      const getItemDesc = (idx: number) => descValues[idx];

      // スロット名 + itemProps + アイテムインデックスからひとつの leading/trailing 要素を生成。
      // Tag/StatusLabel の label は multiValue (カンマ区切り) に対応するためインデックスを受け取る。
      const buildLTElement = (
        slot: string,
        props: Record<string, string> | undefined,
        slotKey: string,
        itemIdx: number,
      ): React.ReactNode | undefined => {
        if (props?.[slot] !== "true") return undefined;
        const type = props[`${slot}Type`] ?? "Icon";

        if (type === "Icon") {
          const IconComp = getAegisIconComponent(props[`${slot}Icon`] || "LfPlusLarge");
          return (
            <Icon key={slotKey}>
              <IconComp />
            </Icon>
          );
        }
        if (type === "Badge") {
          const isCount = props[`${slot}BadgeType`] === "Count";
          let countValue: number | undefined;
          if (isCount) {
            const raw = props[`${slot}BadgeCountLabel`] || "1,2,3,4,5,6,7,8,9,10,+99";
            const labels = raw
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean);
            const label = labels[itemIdx % labels.length];
            const parsed = parseInt(label, 10);
            countValue = Number.isNaN(parsed) ? 99 : parsed;
          }
          // biome-ignore lint/suspicious/noExplicitAny: dynamic color string cannot be narrowed to Badge color union type
          const badgeColor = props[`${slot}BadgeColor`] as any;
          return <Badge key={slotKey} color={badgeColor} count={countValue} />;
        }
        if (type === "Tag") {
          const tagLabel = parseMultiValues(props[`${slot}TagLabel`], itemIdx + 1, "Tag")[itemIdx];
          // biome-ignore lint/suspicious/noExplicitAny: dynamic color string cannot be narrowed to Tag color union type
          const listTagColor = props[`${slot}TagColor`] as any;
          return (
            <Tag
              key={slotKey}
              variant={(props[`${slot}TagStyle`] as "outline" | "fill") ?? "outline"}
              color={listTagColor}
            >
              {tagLabel}
            </Tag>
          );
        }
        if (type === "StatusLabel") {
          const slLabel = parseMultiValues(props[`${slot}StatusLabel`], itemIdx + 1, "Status")[itemIdx];
          // biome-ignore lint/suspicious/noExplicitAny: dynamic color string cannot be narrowed to StatusLabel color union type
          const listSlColor = props[`${slot}StatusColor`] as any;
          return (
            <StatusLabel
              key={slotKey}
              variant={(props[`${slot}StatusStyle`] as "outline" | "fill") ?? "outline"}
              color={listSlColor}
            >
              {slLabel}
            </StatusLabel>
          );
        }
        return undefined;
      };

      // leading/trailing はアイテムごとに組み立てる（Tag/StatusLabel ラベルが per-item のため）
      const renderItem = (globalIdx: number) => {
        const leadingParts: React.ReactNode[] = [];
        if (hasAvatar) leadingParts.push(<Avatar key="av" name="User Name" />);
        const l1 = buildLTElement("leading1", itemProps, "l1", globalIdx);
        const l2 = buildLTElement("leading2", itemProps, "l2", globalIdx);
        if (l1) leadingParts.push(l1);
        if (l2) leadingParts.push(l2);
        const leadingEl = leadingParts.length > 0 ? leadingParts : undefined;

        const trailingParts: React.ReactNode[] = [];
        const t1 = buildLTElement("trailing1", itemProps, "t1", globalIdx);
        const t2 = buildLTElement("trailing2", itemProps, "t2", globalIdx);
        if (t1) trailingParts.push(t1);
        if (t2) trailingParts.push(t2);
        if (hasTrailingButton) {
          const btnLabel = parseMultiValues(itemProps?.buttonLabel, globalIdx + 1, "Button")[globalIdx];
          const btnVariant = (itemProps?.buttonColor as "solid" | "subtle" | "plain") ?? "plain";
          trailingParts.push(
            <Button key="btn" variant={btnVariant} size="small">
              {btnLabel}
            </Button>,
          );
        }
        const trailingEl = trailingParts.length > 0 ? trailingParts : undefined;

        return (
          <ActionListItem key={globalIdx} selected={selectionType !== undefined && globalIdx === 0}>
            <ActionListBody leading={leadingEl} trailing={trailingEl}>
              {getItemLabel(globalIdx)}
              {withDescription && <ActionListDescription>{getItemDesc(globalIdx)}</ActionListDescription>}
            </ActionListBody>
          </ActionListItem>
        );
      };

      if (!withGroup) {
        const itemsCount = Math.min(Math.max(parseInt(itemProps?.items ?? "3", 10) || 1, 1), 20);
        return (
          <ActionList size={size} selectionType={selectionType}>
            {Array.from({ length: itemsCount }, (_, i) => renderItem(i))}
          </ActionList>
        );
      }

      const groupsCount = Math.min(Math.max(parseInt(itemProps?.groups ?? "2", 10) || 2, 2), 5);
      const itemCounts = [1, 2, 3, 4, 5].map((n) =>
        Math.min(Math.max(parseInt(itemProps?.[`items${n}`] ?? "3", 10) || 1, 1), 20),
      );
      let globalIdx = 0;
      return (
        <ActionList size={size} selectionType={selectionType}>
          {Array.from({ length: groupsCount }, (_, g) => g).map((g) => {
            const groupCount = itemCounts[g];
            const startIdx = globalIdx;
            globalIdx += groupCount;
            return (
              <ActionListGroup key={`group-${g}`} title={withGroupTitle ? `Group Title ${g + 1}` : undefined}>
                {Array.from({ length: groupCount }, (__, i) => renderItem(startIdx + i))}
              </ActionListGroup>
            );
          })}
        </ActionList>
      );
    }

    case "Avatar": {
      const withIcon = itemProps?.withIcon === "true";
      const withinDisabled = itemProps?.withinDisabledElement === "true";
      const IconComp = withIcon ? getAegisIconComponent(itemProps?.icon || "LfPlusLarge") : undefined;
      // biome-ignore lint/suspicious/noExplicitAny: Avatar size prop accepts dynamic string values not fully typed
      const avatarSize = (itemProps?.size as any) ?? "medium";
      // biome-ignore lint/suspicious/noExplicitAny: Avatar color prop accepts dynamic string values not fully typed
      const avatarColor = (itemProps?.color as any) ?? "subtle";
      const avatar = <Avatar name="Keita Ichiba" size={avatarSize} color={avatarColor} src={IconComp} />;
      return withinDisabled ? (
        <button
          type="button"
          disabled
          style={{ display: "inline-flex", padding: 0, background: "none", border: "none" }}
        >
          {avatar}
        </button>
      ) : (
        avatar
      );
    }

    case "AvatarGroup": {
      const avatarGroupCount = Math.min(Math.max(parseInt(itemProps?.items ?? "3", 10) || 1, 1), 20);
      const AVATAR_NAMES = [
        "Alice",
        "Bob",
        "Charlie",
        "David",
        "Eva",
        "Frank",
        "Grace",
        "Henry",
        "Iris",
        "Jack",
        "Kate",
        "Leo",
        "Mia",
        "Noah",
        "Olivia",
        "Paul",
        "Quinn",
        "Rose",
        "Sam",
        "Tina",
      ];
      // biome-ignore lint/suspicious/noExplicitAny: AvatarGroup size prop accepts dynamic string values not fully typed
      const avatarGroupSize = itemProps?.size as any;
      return (
        <AvatarGroup size={avatarGroupSize}>
          {Array.from({ length: avatarGroupCount }, (_, i) => i).map((i) => (
            <Avatar key={`avatar-${i}`} name={AVATAR_NAMES[i]} />
          ))}
        </AvatarGroup>
      );
    }

    case "Badge":
      return (
        <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
          <Text variant="body.medium" as="span">
            Notifications
          </Text>
          <Badge>5</Badge>
        </div>
      );

    case "Banner": {
      const hasAction = itemProps?.action === "true";
      const hasTitle = itemProps?.title === "true";
      const withActionLabel = itemProps?.withActionLabel === "true";
      const showCloseButton = itemProps?.closeButton !== "false";
      const color = itemProps?.color ?? "information";
      const titleText = itemProps?.titleText || "Information Title";
      const bodyText = itemProps?.text || 'This is a "Information" banner.';
      const linkLabel = itemProps?.linkLabel || "Link";
      const buttonLabel = itemProps?.buttonLabel || "Action";
      // biome-ignore lint/suspicious/noExplicitAny: Banner color prop accepts dynamic string values not fully typed
      const bannerColor = color as any;
      // biome-ignore lint/suspicious/noExplicitAny: Banner size prop accepts dynamic string values not fully typed
      const bannerSize = (itemProps?.size as any) ?? "medium";
      return (
        <Banner
          color={bannerColor}
          size={bannerSize}
          inline={itemProps?.inline === "true" || undefined}
          closeButton={showCloseButton ? undefined : false}
          action={hasAction ? <Button size="small">{buttonLabel}</Button> : undefined}
          title={hasTitle ? titleText : undefined}
        >
          {withActionLabel ? (
            <Banner.ActionLabel action={<Link href="#">{linkLabel}</Link>}>{bodyText}</Banner.ActionLabel>
          ) : (
            bodyText
          )}
        </Banner>
      );
    }

    case "Blockquote": {
      const blockquoteText = itemProps?.text || '"Innovation distinguishes between a leader and a follower."';
      return itemProps?.withCodeBlock === "true" ? (
        <Blockquote>
          <CodeBlock>{`function hello() {\n  console.log("Hello, world!");\n}`}</CodeBlock>
        </Blockquote>
      ) : (
        <Blockquote>{blockquoteText}</Blockquote>
      );
    }

    case "Breadcrumb": {
      const count = Math.min(Math.max(parseInt(itemProps?.items ?? "3", 10), 2), 10);
      const withButton = itemProps?.withButton === "true";
      const withItemTrailing = itemProps?.withItemTrailing === "true";
      const tabbable = itemProps?.tabbable === "true";
      const DEFAULT_LABELS = [
        "Home",
        "Section",
        "Category",
        "Sub-Category",
        "Detail",
        "Level 6",
        "Level 7",
        "Level 8",
        "Level 9",
        "Current Page",
      ];
      const labels = itemProps?.label
        ? parseMultiValues(itemProps.label, count, "Item").slice(0, count)
        : DEFAULT_LABELS.slice(0, count);
      const trailingIcon = withItemTrailing
        ? renderTooltipIconButton(
            "More information",
            <Icon>
              <LfInformationCircle />
            </Icon>,
            { "aria-label": "More information" },
          )
        : undefined;
      const crumbs = labels.map((label, index) => {
        const isLast = index === labels.length - 1;
        const iconKey = itemProps?.[`icon${index + 1}`];
        const ItemIcon = iconKey ? getAegisIconComponent(iconKey) : undefined;
        const leading = ItemIcon ? (
          <Icon>
            <ItemIcon />
          </Icon>
        ) : undefined;
        const crumbKey = `crumb-${index}`;
        if (isLast && withButton) {
          return (
            <Breadcrumb.Button aria-current="location" trailing={LfAngleDownMiddle} key={crumbKey}>
              {label}
            </Breadcrumb.Button>
          );
        }
        return (
          <Breadcrumb.Item
            href={isLast ? undefined : "#"}
            key={crumbKey}
            aria-current={isLast ? "location" : undefined}
            leading={leading}
            trailing={trailingIcon}
            {...(isLast && tabbable ? { tabIndex: 0 } : {})}
          >
            {label}
          </Breadcrumb.Item>
        );
      });
      return <Breadcrumb>{crumbs}</Breadcrumb>;
    }

    case "Button": {
      const btnVariantRaw = itemProps?.variant ?? "subtle";
      const isWeightGutterless = btnVariantRaw === "Weight(gutterless)";
      // biome-ignore lint/suspicious/noExplicitAny: Button variant prop accepts dynamic string values not fully typed
      const btnVariant = (isWeightGutterless ? "gutterless" : btnVariantRaw) as any;
      // biome-ignore lint/suspicious/noExplicitAny: Button size prop accepts dynamic string values not fully typed
      const btnSize = (itemProps?.size as any) ?? "medium";
      // biome-ignore lint/suspicious/noExplicitAny: Button color prop accepts dynamic string values not fully typed
      const btnColor = (itemProps?.color as any) ?? "neutral";
      const btnLoading = itemProps?.loading === "true";
      const btnWithout = itemProps?.withoutContent === "true";
      const btnHasLeading = btnWithout || (!btnLoading && itemProps?.leading === "true");
      const btnHasTrailing = btnWithout || (!btnLoading && itemProps?.trailing === "true");
      const btnLeadingType = itemProps?.leadingType ?? "Icon";
      const btnTrailingType = itemProps?.trailingType ?? "Icon";
      const btnLabel = itemProps?.label || "Button";

      const MIN_WIDTH_MAP: Record<string, string> = {
        "x8Large(80px)": "var(--aegis-size-x8Large)",
        "x9Large(88px)": "var(--aegis-size-x9Large)",
        "x10Large(96px)": "var(--aegis-size-x10Large)",
        "x11Large(104px)": "var(--aegis-size-x11Large)",
        "x12Large(112px)": "var(--aegis-size-x12Large)",
        "x13Large(120px)": "var(--aegis-size-x13Large)",
        "x14Large(160px)": "var(--aegis-size-x14Large)",
        "x15Large(200px)": "var(--aegis-size-x15Large)",
        "x16Large(240px)": "var(--aegis-size-x16Large)",
      };
      const btnMinWidthKey = itemProps?.minWidth ?? "none";
      const btnMinWidthStyle = MIN_WIDTH_MAP[btnMinWidthKey] ? { minWidth: MIN_WIDTH_MAP[btnMinWidthKey] } : {};
      const btnWidthProp = btnMinWidthKey === "Width" ? "full" : undefined;

      const buildBtnSlot = (side: "leading" | "trailing"): React.ReactNode => {
        const isLeading = side === "leading";
        const hasSlot = isLeading ? btnHasLeading : btnHasTrailing;
        const slotType = isLeading ? btnLeadingType : btnTrailingType;
        if (!hasSlot) return undefined;
        // Without Content=On 時、trailing は LfAngleDownMiddle に固定
        if (!isLeading && btnWithout) {
          return (
            <Icon>
              <LfAngleDownMiddle />
            </Icon>
          );
        }
        if (slotType === "Icon") {
          const iconKey = itemProps?.[isLeading ? "leadingIcon" : "trailingIcon"] || "LfPlusLarge";
          const SlotIcon = getAegisIconComponent(iconKey);
          return (
            <Icon>
              <SlotIcon />
            </Icon>
          );
        }
        const badgeType = itemProps?.[isLeading ? "leadingBadge" : "trailingBadge"] ?? "normal";
        const badgeColorRaw = itemProps?.[isLeading ? "leadingBadgeColor" : "trailingBadgeColor"] ?? "information";
        // biome-ignore lint/suspicious/noExplicitAny: Badge color prop accepts dynamic string values not fully typed
        const badgeColor = badgeColorRaw as any;
        let count: number | undefined;
        if (badgeType === "count") {
          const parsed = parseInt(itemProps?.[isLeading ? "leadingBadgeCount" : "trailingBadgeCount"] ?? "3", 10);
          count = Number.isNaN(parsed) ? 3 : parsed;
        }
        return <Badge color={badgeColor} count={count} />;
      };

      // biome-ignore lint/suspicious/noExplicitAny: Button weight prop accepts dynamic string values not fully typed
      const btnWeightProps = isWeightGutterless ? { weight: "normal" as any } : {};
      // biome-ignore lint/suspicious/noExplicitAny: Button width prop accepts dynamic string values not fully typed
      const btnWidthProps = btnWidthProp ? { width: btnWidthProp as any } : {};
      return (
        <Button
          variant={btnVariant}
          {...btnWeightProps}
          size={btnSize}
          color={btnColor}
          {...(btnLoading ? { loading: true } : {})}
          {...btnWidthProps}
          style={btnMinWidthStyle}
          leading={buildBtnSlot("leading")}
          trailing={buildBtnSlot("trailing")}
        >
          {!btnWithout && btnLabel}
        </Button>
      );
    }

    case "ButtonGroup": {
      // biome-ignore lint/suspicious/noExplicitAny: ButtonGroup size prop accepts dynamic string values not fully typed
      const bgSize = (itemProps?.size as any) ?? "medium";
      const bgAttached = itemProps?.attached === "true";
      // biome-ignore lint/suspicious/noExplicitAny: ButtonGroup attachedColor prop accepts dynamic string values not fully typed
      const bgAttachedVar = (itemProps?.attachedColor as any) ?? "solid";
      const btnCount = Math.min(Math.max(parseInt(itemProps?.btnItems ?? "3", 10), 0), 5);
      const iconCount = Math.min(Math.max(parseInt(itemProps?.iconItems ?? "1", 10), 0), 5);
      const bgButtons = Array.from({ length: btnCount }, (_, i) => i).map((i) => {
        const prefix = `btn${i + 1}_`;
        const sp = Object.fromEntries(
          Object.entries(itemProps ?? {})
            .filter(([k]) => k.startsWith(prefix))
            .map(([k, v]) => [k.slice(prefix.length), v]),
        );
        const rawVar = bgAttached ? bgAttachedVar : (sp.variant ?? "subtle");
        const isWGL = rawVar === "Weight(gutterless)";
        // biome-ignore lint/suspicious/noExplicitAny: Button variant prop accepts dynamic string values not fully typed
        const spVar = (isWGL ? "gutterless" : rawVar) as any;
        // biome-ignore lint/suspicious/noExplicitAny: Button color prop accepts dynamic string values not fully typed
        const spColor = (sp.color as any) ?? "neutral";
        const spLabel = sp.label || "Button";
        const spWithout = sp.withoutContent === "true";
        const spHasL = spWithout || sp.leading === "true";
        const spHasT = spWithout || sp.trailing === "true";
        const spLT = sp.leadingType ?? "Icon";
        const spTT = sp.trailingType ?? "Icon";
        const buildBgSlot = (side: "leading" | "trailing"): React.ReactNode => {
          const isL = side === "leading";
          if (!(isL ? spHasL : spHasT)) return undefined;
          if (!isL && spWithout)
            return (
              <Icon>
                <LfAngleDownMiddle />
              </Icon>
            );
          const slotType = isL ? spLT : spTT;
          if (slotType === "Icon") {
            const SlotIcon = getAegisIconComponent(sp[isL ? "leadingIcon" : "trailingIcon"] || "LfPlusLarge");
            return (
              <Icon>
                <SlotIcon />
              </Icon>
            );
          }
          const bt = sp[isL ? "leadingBadge" : "trailingBadge"] ?? "normal";
          // biome-ignore lint/suspicious/noExplicitAny: Badge color prop accepts dynamic string values not fully typed
          const bc = (sp[isL ? "leadingBadgeColor" : "trailingBadgeColor"] ?? "information") as any;
          let cnt: number | undefined;
          if (bt === "count") {
            const p = parseInt(sp[isL ? "leadingBadgeCount" : "trailingBadgeCount"] ?? "3", 10);
            cnt = Number.isNaN(p) ? 3 : p;
          }
          return <Badge color={bc} count={cnt} />;
        };
        // biome-ignore lint/suspicious/noExplicitAny: Button weight prop accepts dynamic string values not fully typed
        const bgBtnWeightProps = isWGL ? { weight: "normal" as any } : {};
        return (
          <Button
            key={`btn${i}`}
            variant={spVar}
            {...bgBtnWeightProps}
            size={bgSize}
            color={spColor}
            leading={buildBgSlot("leading")}
            trailing={buildBgSlot("trailing")}
          >
            {!spWithout && spLabel}
          </Button>
        );
      });

      const bgIcons = Array.from({ length: iconCount }, (_, i) => i).map((i) => {
        const prefix = `icon${i + 1}_`;
        const sp = Object.fromEntries(
          Object.entries(itemProps ?? {})
            .filter(([k]) => k.startsWith(prefix))
            .map(([k, v]) => [k.slice(prefix.length), v]),
        );
        // biome-ignore lint/suspicious/noExplicitAny: IconButton variant prop accepts dynamic string values not fully typed
        const ibVar = (bgAttached ? bgAttachedVar : (sp.variant ?? "subtle")) as any;
        // biome-ignore lint/suspicious/noExplicitAny: IconButton color prop accepts dynamic string values not fully typed
        const ibColor = (sp.color as any) ?? "neutral";
        const IbIcon = getAegisIconComponent(sp.icon || "LfPlusLarge");
        return renderTooltipIconButton(
          `Action ${i + 1}`,
          <Icon>
            <IbIcon />
          </Icon>,
          { key: `icon${i}`, variant: ibVar, size: bgSize, color: ibColor, "aria-label": `Action ${i + 1}` },
        );
      });

      return (
        <ButtonGroup {...(bgAttached ? { attached: true } : {})}>
          {bgButtons}
          {bgIcons}
        </ButtonGroup>
      );
    }

    case "Calendar": {
      const resolveDate = (raw: string | undefined): Date | undefined => {
        if (!raw) return undefined;
        return raw === "today" ? new Date() : new Date(raw);
      };
      const calMinValue = itemProps?.minValue === "true" ? resolveDate(itemProps?.minValueDate) : undefined;
      const calMaxValue = itemProps?.maxValue === "true" ? resolveDate(itemProps?.maxValueDate) : undefined;
      const calGranularity = itemProps?.granularity === "true" ? ("minute" as const) : ("day" as const);
      const calPosition = (itemProps?.position ?? "start") as "start" | "center" | "end";
      const calEl = (
        <Calendar
          defaultValue={new Date()}
          {...(calMinValue ? { minValue: calMinValue } : {})}
          {...(calMaxValue ? { maxValue: calMaxValue } : {})}
          granularity={calGranularity}
        />
      );
      if (calPosition === "start") return calEl;
      return <div style={{ display: "flex", justifyContent: calPosition }}>{calEl}</div>;
    }

    case "Card":
      return <CardRenderer itemProps={itemProps} />;

    case "Checkbox": {
      // biome-ignore lint/suspicious/noExplicitAny: Checkbox size prop accepts dynamic string values not fully typed
      const cbSize = (itemProps?.size ?? "medium") as any;
      // biome-ignore lint/suspicious/noExplicitAny: Checkbox color prop accepts dynamic string values not fully typed
      const cbColor = (itemProps?.color ?? "neutral") as any;
      const cbIndet = itemProps?.indeterminate === "true";
      const cbNoLabel = itemProps?.noLabel === "true";
      const cbInputType = itemProps?.inputType ?? "Single-line";
      const cbLabelText =
        cbInputType === "Multi-line"
          ? itemProps?.labelArea || "Sample checkbox option"
          : itemProps?.label || "Sample checkbox option";
      const cbIsMultiLine = cbInputType === "Multi-line";
      const cbDisplayLabelText = cbIsMultiLine
        ? cbLabelText.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n")
        : cbLabelText;
      return (
        <Checkbox
          size={cbSize}
          color={cbColor}
          indeterminate={cbIndet}
          defaultChecked
          {...(cbNoLabel ? { "aria-label": cbLabelText } : {})}
        >
          {cbNoLabel ? undefined : cbIsMultiLine ? (
            <Text as="span" variant="body.medium" whiteSpace="pre">
              {cbDisplayLabelText}
            </Text>
          ) : (
            cbLabelText
          )}
        </Checkbox>
      );
    }

    case "CheckboxCard": {
      const ccIsCard = itemProps?.withCheckboxCard === "true";
      const COUNT = Math.min(Math.max(parseInt(itemProps?.items ?? "3", 10) || 2, 2), 10);
      const ccTitle = itemProps?.title === "true" ? itemProps?.titleText || "Title" : undefined;

      if (ccIsCard) {
        // biome-ignore lint/suspicious/noExplicitAny: CheckboxCard color prop accepts dynamic string values not fully typed
        const ccColor = (itemProps?.color ?? "neutral") as any;
        // biome-ignore lint/suspicious/noExplicitAny: CheckboxCard variant prop accepts dynamic string values not fully typed
        const ccVariant = (itemProps?.variant ?? "plain") as any;
        // biome-ignore lint/suspicious/noExplicitAny: CheckboxCard size prop accepts dynamic string values not fully typed
        const ccSize = (itemProps?.sizeCard ?? "large") as any;
        const LABEL_COUNT = Math.min(Math.max(parseInt(itemProps?.labelItems ?? "1", 10) || 1, 1), 5);
        const FALLBACKS = ["label.medium", "body.medium", "caption.small", "data.medium", "label.small"];

        const rowStyleProps = (rowN: number): Record<string, string> => {
          const prefix = `label${rowN}Style_`;
          return Object.fromEntries(
            Object.entries(itemProps ?? {})
              .filter(([k]) => k.startsWith(prefix))
              .map(([k, v]) => [k.slice(prefix.length), v]),
          );
        };

        const rowValues = Array.from({ length: LABEL_COUNT }, (_, rowIdx) => {
          const rowN = rowIdx + 1;
          const allRowsVals = parseMultiValues(itemProps?.[`label${rowN}`], COUNT, `Label ${rowN}`);
          return Array.from({ length: COUNT }, (_, cardIdx) => {
            const perRowKey = `label${rowN}_row${cardIdx + 1}`;
            return itemProps?.[perRowKey] || allRowsVals[cardIdx];
          });
        });

        return (
          <CheckboxGroup title={ccTitle} defaultValue={["a"]}>
            {Array.from({ length: COUNT }, (_, i) => {
              const val = String.fromCharCode(97 + i);
              return (
                <CheckboxCard key={val} value={val} color={ccColor} variant={ccVariant} size={ccSize}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {Array.from({ length: LABEL_COUNT }, (_, rowIdx) => rowIdx).map((rowIdx) => {
                      const rowN = rowIdx + 1;
                      const label = rowValues[rowIdx][i] || `Label ${rowN}`;
                      const styleP = rowStyleProps(rowN);
                      // biome-ignore lint/suspicious/noExplicitAny: Text variant prop accepts dynamic values not fully typed
                      const ccCardVariant = resolveTypoVariant(styleP, FALLBACKS[rowIdx] ?? "body.medium") as any;
                      const ccCardRawColor =
                        Object.keys(styleP).length === 0 && rowIdx > 0
                          ? "subtle"
                          : resolveTypoColor(styleP, FALLBACKS[rowIdx] ?? "body.medium");
                      // biome-ignore lint/suspicious/noExplicitAny: Text color prop accepts dynamic values not fully typed
                      const ccCardColor = ccCardRawColor as any;
                      return (
                        <Text key={`row-${rowIdx}`} variant={ccCardVariant} color={ccCardColor}>
                          {label}
                        </Text>
                      );
                    })}
                  </div>
                </CheckboxCard>
              );
            })}
          </CheckboxGroup>
        );
      }

      // biome-ignore lint/suspicious/noExplicitAny: CheckboxGroup size prop accepts dynamic string values not fully typed
      const ccNormalSize = (itemProps?.size ?? "medium") as any;
      // biome-ignore lint/suspicious/noExplicitAny: CheckboxGroup orientation prop accepts dynamic string values not fully typed
      const ccOrientation = (itemProps?.orientation ?? "vertical") as any;
      const optLabels = parseMultiValues(itemProps?.text, COUNT, "");
      return (
        <CheckboxGroup size={ccNormalSize} orientation={ccOrientation} title={ccTitle} defaultValue={["a", "b"]}>
          {Array.from({ length: COUNT }, (_, i) => {
            const val = String.fromCharCode(97 + i);
            const label = optLabels[i] || `Option ${String.fromCharCode(65 + i)}`;
            return (
              <Checkbox key={val} value={val}>
                {label}
              </Checkbox>
            );
          })}
        </CheckboxGroup>
      );
    }

    case "CheckboxGroup": {
      const cgIsCard = itemProps?.withCheckboxCard === "true";
      // biome-ignore lint/suspicious/noExplicitAny: CheckboxGroup size prop accepts dynamic string values not fully typed
      const cgSize = (cgIsCard ? (itemProps?.sizeCard ?? "medium") : (itemProps?.size ?? "medium")) as any;
      // biome-ignore lint/suspicious/noExplicitAny: CheckboxGroup orientation prop accepts dynamic string values not fully typed
      const cgOrientation = (itemProps?.orientation ?? "vertical") as any;
      const cgTitle = itemProps?.title === "true" ? itemProps?.titleText || "Title" : undefined;
      const COUNT = Math.min(Math.max(parseInt(itemProps?.items ?? "3", 10) || 2, 2), 10);

      if (cgIsCard) {
        // biome-ignore lint/suspicious/noExplicitAny: CheckboxCard variant prop accepts dynamic string values not fully typed
        const cgVariant = (itemProps?.variant ?? "plain") as any;
        const cgDivider = itemProps?.withDivider === "true";
        const LABEL_COUNT = Math.min(Math.max(parseInt(itemProps?.labelItems ?? "1", 10) || 1, 1), 5);
        const FALLBACKS = ["label.medium", "body.small", "caption.small", "data.small", "body.small"];

        // row N の typography sub-props を取得
        const rowStyleProps = (rowN: number): Record<string, string> => {
          const prefix = `cardLabelStyle${rowN}_`;
          return Object.fromEntries(
            Object.entries(itemProps ?? {})
              .filter(([k]) => k.startsWith(prefix))
              .map(([k, v]) => [k.slice(prefix.length), v]),
          );
        };

        // row N の値を展開（All Rows: カンマ区切り、Row-X: per-card textfield 優先）
        const rowValues = Array.from({ length: LABEL_COUNT }, (_, rowIdx) => {
          const rowN = rowIdx + 1;
          const allRowsVals = parseMultiValues(itemProps?.[`cardLabel${rowN}`], COUNT, `Label ${rowN}`);
          return Array.from({ length: COUNT }, (_, cardIdx) => {
            const perRowKey = `cardLabel${rowN}_row${cardIdx + 1}`;
            return itemProps?.[perRowKey] || allRowsVals[cardIdx];
          });
        });

        return (
          <CheckboxGroup size={cgSize} title={cgTitle} defaultValue={["a"]}>
            {Array.from({ length: COUNT }, (_, i) => {
              const n = i + 1;
              const val = String.fromCharCode(97 + i);
              const colorRaw =
                itemProps?.[`cardStyle1_row${n}`] || itemProps?.[`cardStyle${n}`] || itemProps?.cardStyle1 || "neutral";
              // biome-ignore lint/suspicious/noExplicitAny: CheckboxCard color prop accepts dynamic string values not fully typed
              const color = colorRaw as any;
              return (
                <CheckboxCard key={val} value={val} color={color} variant={cgVariant} size={cgSize}>
                  {cgDivider && <Divider orientation="vertical" />}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {Array.from({ length: LABEL_COUNT }, (_, rowIdx) => rowIdx).map((rowIdx) => {
                      const rowN = rowIdx + 1;
                      const label = rowValues[rowIdx][i] || `Label ${rowN}`;
                      const styleP = rowStyleProps(rowN);
                      // biome-ignore lint/suspicious/noExplicitAny: Text variant prop accepts dynamic values not fully typed
                      const cgCardVariant = resolveTypoVariant(styleP, FALLBACKS[rowIdx] ?? "body.small") as any;
                      const cgCardRawColor =
                        Object.keys(styleP).length === 0 && rowIdx > 0
                          ? "subtle"
                          : resolveTypoColor(styleP, FALLBACKS[rowIdx] ?? "body.small");
                      // biome-ignore lint/suspicious/noExplicitAny: Text color prop accepts dynamic values not fully typed
                      const cgCardColor = cgCardRawColor as any;
                      return (
                        <Text key={`cgcard-row-${rowIdx}`} variant={cgCardVariant} color={cgCardColor}>
                          {label}
                        </Text>
                      );
                    })}
                  </div>
                </CheckboxCard>
              );
            })}
          </CheckboxGroup>
        );
      }

      const optLabels = parseMultiValues(itemProps?.text, COUNT, "");
      return (
        <CheckboxGroup size={cgSize} orientation={cgOrientation} title={cgTitle} defaultValue={["a", "b"]}>
          {Array.from({ length: COUNT }, (_, i) => {
            const val = String.fromCharCode(97 + i);
            const label = optLabels[i] || `Option ${String.fromCharCode(65 + i)}`;
            return (
              <Checkbox key={val} value={val}>
                {label}
              </Checkbox>
            );
          })}
        </CheckboxGroup>
      );
    }

    case "Code":
      return <Code>{itemProps?.text ?? "const x = 42;"}</Code>;

    case "CodeBlock":
      return (
        <CodeBlock>
          {itemProps?.text ?? `function greet(name) {\n  return "Hello, " + name + "!";\n}\n\ngreet("World");`}
        </CodeBlock>
      );

    case "Combobox":
      return <ComboboxRenderer itemProps={itemProps} />;

    case "ContentHeader": {
      const chSize = (itemProps?.size ?? "xLarge") as "xLarge" | "large" | "medium" | "small" | "xSmall";
      const showDescTop = itemProps?.descriptionTop === "true";
      const showDescBot = itemProps?.descriptionBottom === "true";
      const showLeading = itemProps?.leading === "true";
      const showTrailing = itemProps?.trailing === "true";
      const showAction = itemProps?.action === "true";
      const trailingType = itemProps?.trailingContent ?? "ButtonGroup";
      const chTitle = itemProps?.titleText || "Page Title";
      const chDescTop = itemProps?.descriptionTopText || "Description";
      const chDescBot = itemProps?.descriptionBottomText || "Description";

      const extractSubProps = (prefix: string): Record<string, string> =>
        Object.fromEntries(
          Object.entries(itemProps ?? {})
            .filter(([k]) => k.startsWith(prefix))
            .map(([k, v]) => [k.slice(prefix.length), v]),
        );

      const trailingEl = showTrailing
        ? (() => {
            if (trailingType === "Button")
              return <ComponentRenderer component="Button" itemProps={extractSubProps("trailingButton_")} />;
            if (trailingType === "IconButton")
              return <ComponentRenderer component="IconButton" itemProps={extractSubProps("trailingIconButton_")} />;
            return <ComponentRenderer component="ButtonGroup" itemProps={extractSubProps("trailingButtonGroup_")} />;
          })()
        : undefined;

      return (
        <ContentHeader
          size={chSize}
          leading={
            showLeading
              ? renderTooltipIconButton(
                  "Go back",
                  <Icon>
                    <LfAngleLeftMiddle />
                  </Icon>,
                  { "aria-label": "Go back" },
                )
              : undefined
          }
          trailing={trailingEl}
          action={showAction ? <Link href="#">Link</Link> : undefined}
        >
          {showDescTop && <ContentHeaderDescription>{chDescTop}</ContentHeaderDescription>}
          <ContentHeaderTitle>{chTitle}</ContentHeaderTitle>
          {showDescBot && <ContentHeaderDescription>{chDescBot}</ContentHeaderDescription>}
        </ContentHeader>
      );
    }

    case "DataTable": {
      const dtColCount = Math.min(Math.max(parseInt(itemProps?.colItems ?? "5", 10), 2), 20);
      const dtRowCount = Math.min(Math.max(parseInt(itemProps?.rowItems ?? "10", 10), 2), 50);

      // Properties
      const dtSize = (itemProps?.size ?? "medium") as "small" | "medium";
      const dtSticky = itemProps?.stickyHeader !== "false";
      const dtColumnBordered = itemProps?.columnBordered === "true";
      const dtOuterBordered = itemProps?.outerBordered === "true";
      const dtHighlight = itemProps?.highlightRowOnHover !== "false";
      const dtHighlightedRows = itemProps?.highlightedRows === "true";
      const dtHighlightedRowsSelect = itemProps?.highlightedRowsSelect ?? "Item-2";
      const dtBadgedRows = itemProps?.badgedRows === "true";
      const dtBadgedRowsSelect = itemProps?.badgedRowsSelect ?? "Item-2";
      const dtMultiSel = itemProps?.multipleRowSelection === "true";
      const dtSortable = itemProps?.sorting !== "false";
      const dtManualSorting = itemProps?.manualSorting === "true";
      const dtPinning = itemProps?.columnPinning === "true";
      const dtPinningCols = dtPinning
        ? itemProps?.pinningCols
          ? itemProps.pinningCols
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : ["col0"]
        : [];
      const dtPinPosition = (itemProps?.pinPosition ?? "start") as "start" | "end";
      const dtColumnOrder = itemProps?.columnOrder === "true";
      const dtColumnVisibility = itemProps?.columnVisibility !== "false";
      const dtResizable = itemProps?.columnSizing !== "false";
      const dtColReorderable = itemProps?.columnReorderable !== "false";
      const dtReorder = itemProps?.rowReorderable === "true";
      const dtExtraHeaderMenuItems = itemProps?.extraHeaderMenuItems === "true";

      type DtRow = { id: string };
      const dtRows: DtRow[] = Array.from({ length: dtRowCount }, (_, i) => ({ id: String(i) }));

      const resolveRowIds = (select: string): string[] => {
        return select
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .flatMap((item) => {
            const n = parseInt(item.replace("Item-", ""), 10);
            return !Number.isNaN(n) && n >= 1 && n <= dtRowCount ? [String(n - 1)] : [];
          });
      };
      const dtHighlightedRowIds = dtHighlightedRows ? resolveRowIds(dtHighlightedRowsSelect) : undefined;
      const dtBadgedRowIds = dtBadgedRows ? resolveRowIds(dtBadgedRowsSelect) : undefined;
      const dtDefaultColumnOrder =
        dtColumnOrder && itemProps?.columnOrderList
          ? itemProps.columnOrderList
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined;

      const dtColumns = Array.from({ length: dtColCount }, (_, colIdx) => {
        const colPrefix = `col${colIdx}_`;
        const cp: Record<string, string> = Object.fromEntries(
          Object.entries(itemProps ?? {})
            .filter(([k]) => k.startsWith(colPrefix))
            .map(([k, v]) => [k.slice(colPrefix.length), v]),
        );
        const colContent = cp.colContent ?? "Text";

        // sub-props helper: reads cp["prefix_key"] entries
        const sub = (prefix: string) =>
          Object.fromEntries(
            Object.entries(cp)
              .filter(([k]) => k.startsWith(`${prefix}_`))
              .map(([k, v]) => [k.slice(prefix.length + 1), v]),
          );

        return {
          id: `col${colIdx}`,
          name: cp.colTitle ?? `Col ${colIdx + 1}`,
          ...(dtColumnVisibility && colIdx > 0 && { hideable: true }),
          ...(dtSortable && { sortable: true, getValue: (row: DtRow) => row.id }),
          resizable: dtResizable,
          reorderable: dtColReorderable,
          ...(dtExtraHeaderMenuItems && {
            renderHeader: ({ name }: { name: string | null }) => (
              <DataTableHeader
                extraMenuItems={
                  <>
                    <MenuItem onClick={() => {}}>Action A</MenuItem>
                    <MenuItem onClick={() => {}}>Action B</MenuItem>
                  </>
                }
              >
                {name}
              </DataTableHeader>
            ),
          }),
          renderCell: ({ index }: { row: DtRow; index: number; value: unknown }) => {
            // Leading / Trailing は colContent === "Text" のときのみ有効
            const colContentIsText = colContent === "Text";

            const AVATAR_INITIALS = ["Ab", "Cd", "Ef", "Gh", "Ij", "Kl", "Mn", "Op"];
            const AVATAR_COLORS = ["red", "orange", "teal", "indigo", "blue", "purple", "magenta"] as const;

            // Leading
            let leadingNode: React.ReactNode = null;
            if (cp.leading === "true") {
              const lt = cp.leadingContent ?? "Icon";
              if (lt === "Icon") {
                leadingNode = <Icon>{renderAegisIcon(cp.leadingIcon ?? "LfPlusLarge")}</Icon>;
              } else if (lt === "Avatar") {
                leadingNode = (
                  <Avatar
                    size="small"
                    color={AVATAR_COLORS[index % AVATAR_COLORS.length]}
                    name={AVATAR_INITIALS[index % AVATAR_INITIALS.length] ?? ""}
                  />
                );
              } else if (lt === "IconButton") {
                const sp = sub("leadingIconButton");
                const iconName = cp.leadingIconButtonIcon ?? sp.icon ?? "LfPlusLarge";
                // biome-ignore lint/suspicious/noExplicitAny: IconButton variant/size props accept dynamic string values not fully typed
                const ibVariant = (sp.variant ?? "subtle") as any;
                // biome-ignore lint/suspicious/noExplicitAny: IconButton size prop accepts dynamic string values not fully typed
                const ibSize = (sp.size ?? "xSmall") as any;
                leadingNode = renderTooltipIconButton("action", <Icon>{renderAegisIcon(iconName)}</Icon>, {
                  variant: ibVariant,
                  size: ibSize,
                  "aria-label": "action",
                });
              } else if (lt === "Button") {
                const sp = sub("leadingButton");
                const lbl = parseMultiValues(cp.leadingButtonLabel, dtRowCount, "Button")[index] ?? "Button";
                // biome-ignore lint/suspicious/noExplicitAny: Button variant prop accepts dynamic string values not fully typed
                const lbVariant = (sp.variant ?? "subtle") as any;
                // biome-ignore lint/suspicious/noExplicitAny: Button size prop accepts dynamic string values not fully typed
                const lbSize = (sp.size ?? "small") as any;
                leadingNode = (
                  <Button variant={lbVariant} size={lbSize}>
                    {lbl}
                  </Button>
                );
              } else if (lt === "StatusLabel") {
                const sp = sub("leadingStatusLabel");
                const lbl = parseMultiValues(cp.leadingStatusLabelText, dtRowCount, "Label")[index] ?? "Label";
                // biome-ignore lint/suspicious/noExplicitAny: StatusLabel size prop accepts dynamic string values not fully typed
                const lslSize = (sp.size ?? "medium") as any;
                // biome-ignore lint/suspicious/noExplicitAny: StatusLabel color prop accepts dynamic string values not fully typed
                const lslColor = (sp.color ?? "neutral") as any;
                leadingNode = (
                  <StatusLabel size={lslSize} color={lslColor}>
                    {lbl}
                  </StatusLabel>
                );
              } else if (lt === "Tag") {
                const sp = sub("leadingTag");
                const lbl = parseMultiValues(cp.leadingTagText, dtRowCount, "Tag")[index] ?? "Tag";
                // biome-ignore lint/suspicious/noExplicitAny: Tag size/variant/color props accept dynamic string values not fully typed
                const ltSize = (sp.size ?? "small") as any;
                // biome-ignore lint/suspicious/noExplicitAny: Tag variant prop accepts dynamic string values not fully typed
                const ltVariant = (sp.variant ?? "outline") as any;
                // biome-ignore lint/suspicious/noExplicitAny: Tag color prop accepts dynamic string values not fully typed
                const ltColor = (sp.color ?? "blue") as any;
                leadingNode = (
                  <Tag size={ltSize} variant={ltVariant} color={ltColor}>
                    {lbl}
                  </Tag>
                );
              }
            }

            // Trailing
            let trailingNode: React.ReactNode = null;
            if (cp.trailing === "true") {
              const tt = cp.trailingContent ?? "Icon";
              if (tt === "Text") {
                trailingNode = (
                  <Text as="span" variant="body.medium">
                    {cp.trailingText ?? ""}
                  </Text>
                );
              } else if (tt === "Icon") {
                trailingNode = <Icon>{renderAegisIcon(cp.trailingIcon ?? "LfPlusLarge")}</Icon>;
              } else if (tt === "IconButton") {
                const sp = sub("trailingIconButton");
                const iconName = cp.trailingIconButtonIcon ?? sp.icon ?? "LfPlusLarge";
                // biome-ignore lint/suspicious/noExplicitAny: IconButton variant/size props accept dynamic string values not fully typed
                const tibVariant = (sp.variant ?? "subtle") as any;
                // biome-ignore lint/suspicious/noExplicitAny: IconButton size prop accepts dynamic string values not fully typed
                const tibSize = (sp.size ?? "xSmall") as any;
                trailingNode = renderTooltipIconButton("action", <Icon>{renderAegisIcon(iconName)}</Icon>, {
                  variant: tibVariant,
                  size: tibSize,
                  "aria-label": "action",
                });
              } else if (tt === "Button") {
                const sp = sub("trailingButton");
                const lbl = parseMultiValues(cp.trailingButtonLabel, dtRowCount, "Button")[index] ?? "Button";
                // biome-ignore lint/suspicious/noExplicitAny: Button variant prop accepts dynamic string values not fully typed
                const tbVariant = (sp.variant ?? "subtle") as any;
                // biome-ignore lint/suspicious/noExplicitAny: Button size prop accepts dynamic string values not fully typed
                const tbSize = (sp.size ?? "small") as any;
                trailingNode = (
                  <Button variant={tbVariant} size={tbSize}>
                    {lbl}
                  </Button>
                );
              } else if (tt === "StatusLabel") {
                const sp = sub("trailingStatusLabel");
                const lbl = parseMultiValues(cp.trailingStatusLabelText, dtRowCount, "Label")[index] ?? "Label";
                // biome-ignore lint/suspicious/noExplicitAny: StatusLabel size prop accepts dynamic string values not fully typed
                const tslSize = (sp.size ?? "medium") as any;
                // biome-ignore lint/suspicious/noExplicitAny: StatusLabel color prop accepts dynamic string values not fully typed
                const tslColor = (sp.color ?? "neutral") as any;
                trailingNode = (
                  <StatusLabel size={tslSize} color={tslColor}>
                    {lbl}
                  </StatusLabel>
                );
              } else if (tt === "Tag") {
                const sp = sub("trailingTag");
                const lbl = parseMultiValues(cp.trailingTagText, dtRowCount, "Tag")[index] ?? "Tag";
                // biome-ignore lint/suspicious/noExplicitAny: Tag size prop accepts dynamic string values not fully typed
                const ttSize = (sp.size ?? "small") as any;
                // biome-ignore lint/suspicious/noExplicitAny: Tag variant prop accepts dynamic string values not fully typed
                const ttVariant = (sp.variant ?? "outline") as any;
                // biome-ignore lint/suspicious/noExplicitAny: Tag color prop accepts dynamic string values not fully typed
                const ttColor = (sp.color ?? "blue") as any;
                trailingNode = (
                  <Tag size={ttSize} variant={ttVariant} color={ttColor}>
                    {lbl}
                  </Tag>
                );
              }
            }

            // Cell content
            const textValues = parseMultiValues(cp.text, dtRowCount, `Text ${index + 1}`);
            const textValue = textValues[index] ?? `Text ${index + 1}`;
            const hasDesc = colContentIsText && cp.withDescription === "true";
            const descValues = hasDesc ? parseMultiValues(cp.textDescription, dtRowCount, "this is dummy") : [];
            const descValue = hasDesc ? (descValues[index] ?? "this is dummy") : "";

            let cellContent: React.ReactNode = textValue;
            if (colContent === "Button") {
              const rowNum = index + 1;
              const spAll = sub("buttonContent");
              const spRow = sub(`btnRow${rowNum}Content`);
              const sp = Object.keys(spRow).length > 0 ? spRow : spAll;
              const perRowLabel = cp[`btnRow${rowNum}Label`];
              const labels = parseMultiValues(cp.buttonLabel, dtRowCount, "Button");
              const label = perRowLabel !== undefined ? perRowLabel : labels[index];
              const spLoading = sp.loading === "true";
              const buildSpBtnSlot = (side: "leading" | "trailing"): React.ReactNode => {
                if (sp[side] !== "true" || spLoading) return undefined;
                const slotType = sp[`${side}Type`] ?? "Icon";
                if (slotType === "Icon") {
                  const SlotIcon = getAegisIconComponent(sp[`${side}Icon`] || "LfPlusLarge");
                  return (
                    <Icon>
                      <SlotIcon />
                    </Icon>
                  );
                }
                const badgeType = sp[`${side}Badge`] ?? "normal";
                // biome-ignore lint/suspicious/noExplicitAny: Badge color prop accepts dynamic string values not fully typed
                const badgeColor = (sp[`${side}BadgeColor`] ?? "information") as any;
                const count = badgeType === "count" ? parseInt(sp[`${side}BadgeCount`] ?? "3", 10) || 3 : undefined;
                return <Badge color={badgeColor} count={count} />;
              };
              // biome-ignore lint/suspicious/noExplicitAny: Button variant prop accepts dynamic string values not fully typed
              const cellBtnVariant = (sp.variant ?? "subtle") as any;
              // biome-ignore lint/suspicious/noExplicitAny: Button size prop accepts dynamic string values not fully typed
              const cellBtnSize = (cp.buttonSize ?? "small") as any;
              // biome-ignore lint/suspicious/noExplicitAny: Button color prop accepts dynamic string values not fully typed
              const cellBtnColor = (sp.color ?? "neutral") as any;
              cellContent = (
                <Button
                  variant={cellBtnVariant}
                  size={cellBtnSize}
                  color={cellBtnColor}
                  loading={spLoading || undefined}
                  leading={buildSpBtnSlot("leading")}
                  trailing={buildSpBtnSlot("trailing")}
                >
                  {label}
                </Button>
              );
            } else if (colContent === "IconButton") {
              const rowNum = index + 1;
              const spAll = sub("iconButtonContent");
              const spRow = sub(`ibRow${rowNum}Content`);
              const sp = Object.keys(spRow).length > 0 ? spRow : spAll;
              // biome-ignore lint/suspicious/noExplicitAny: IconButton variant prop accepts dynamic string values not fully typed
              const cellIbVariant = (sp.variant ?? "subtle") as any;
              // biome-ignore lint/suspicious/noExplicitAny: IconButton size prop accepts dynamic string values not fully typed
              const cellIbSize = (cp.iconButtonSize ?? "small") as any;
              // biome-ignore lint/suspicious/noExplicitAny: IconButton color prop accepts dynamic string values not fully typed
              const cellIbColor = (sp.color ?? "neutral") as any;
              cellContent = renderTooltipIconButton(
                "action",
                <Icon>{renderAegisIcon(sp.icon ?? "LfPlusLarge")}</Icon>,
                {
                  variant: cellIbVariant,
                  size: cellIbSize,
                  color: cellIbColor,
                  loading: sp.loading === "true" || undefined,
                  "aria-label": "action",
                },
              );
            } else if (colContent === "ButtonGroup") {
              const rowNum = index + 1;
              // biome-ignore lint/suspicious/noExplicitAny: ButtonGroup size prop accepts dynamic string values not fully typed
              const bgSize = (cp.bgSize as any) ?? "medium";
              const bgBtnCount = Math.min(
                Math.max(parseInt(cp[`bgRow${rowNum}BtnItems`] ?? cp.bgBtnItems ?? "3", 10), 0),
                5,
              );
              const bgIconCount = Math.min(
                Math.max(parseInt(cp[`bgRow${rowNum}IconItems`] ?? cp.bgIconItems ?? "1", 10), 0),
                5,
              );
              const BG_DEFAULT_LABELS = ["First", "Second", "Third", "Fourth", "Fifth"];
              const bgButtons = Array.from({ length: bgBtnCount }, (_, i) => i).map((i) => {
                const bsp = { ...sub(`bgBtn${i + 1}`), ...sub(`bgRow${rowNum}Btn${i + 1}`) };
                const rawVar = bsp.variant ?? "subtle";
                const isWGL = rawVar === "Weight(gutterless)";
                // biome-ignore lint/suspicious/noExplicitAny: Button variant prop accepts dynamic string values not fully typed
                const bspVar = (isWGL ? "gutterless" : rawVar) as any;
                // biome-ignore lint/suspicious/noExplicitAny: Button color prop accepts dynamic string values not fully typed
                const bspColor = (bsp.color as any) ?? "neutral";
                const bspLabel = bsp.label || BG_DEFAULT_LABELS[i] || `Item ${i + 1}`;
                const bspWithout = bsp.withoutContent === "true";
                const bspHasL = bspWithout || bsp.leading === "true";
                const bspHasT = bspWithout || bsp.trailing === "true";
                const bspLT = bsp.leadingType ?? "Icon";
                const bspTT = bsp.trailingType ?? "Icon";
                const buildBgSlot = (side: "leading" | "trailing"): React.ReactNode => {
                  const isL = side === "leading";
                  if (!(isL ? bspHasL : bspHasT)) return undefined;
                  if (!isL && bspWithout)
                    return (
                      <Icon>
                        <LfAngleDownMiddle />
                      </Icon>
                    );
                  const st = isL ? bspLT : bspTT;
                  if (st === "Icon") {
                    const SI = getAegisIconComponent(bsp[isL ? "leadingIcon" : "trailingIcon"] || "LfPlusLarge");
                    return (
                      <Icon>
                        <SI />
                      </Icon>
                    );
                  }
                  const bt = bsp[isL ? "leadingBadge" : "trailingBadge"] ?? "normal";
                  // biome-ignore lint/suspicious/noExplicitAny: Badge color prop accepts dynamic string values not fully typed
                  const bc = (bsp[isL ? "leadingBadgeColor" : "trailingBadgeColor"] ?? "information") as any;
                  let cnt: number | undefined;
                  if (bt === "count") {
                    const pv = parseInt(bsp[isL ? "leadingBadgeCount" : "trailingBadgeCount"] ?? "3", 10);
                    cnt = Number.isNaN(pv) ? 3 : pv;
                  }
                  return <Badge color={bc} count={cnt} />;
                };
                // biome-ignore lint/suspicious/noExplicitAny: Button weight prop accepts dynamic string values not fully typed
                const bgBtnWeightP = isWGL ? { weight: "normal" as any } : {};
                return (
                  <Button
                    key={`btn${i}`}
                    variant={bspVar}
                    {...bgBtnWeightP}
                    size={bgSize}
                    color={bspColor}
                    leading={buildBgSlot("leading")}
                    trailing={buildBgSlot("trailing")}
                  >
                    {!bspWithout && bspLabel}
                  </Button>
                );
              });
              const bgIcons = Array.from({ length: bgIconCount }, (_, i) => i).map((i) => {
                const isp = { ...sub(`bgIcon${i + 1}`), ...sub(`bgRow${rowNum}Icon${i + 1}`) };
                const IbIcon = getAegisIconComponent(isp.icon || "LfPlusLarge");
                // biome-ignore lint/suspicious/noExplicitAny: IconButton variant prop accepts dynamic string values not fully typed
                const bgIbVariant = (isp.variant ?? "subtle") as any;
                // biome-ignore lint/suspicious/noExplicitAny: IconButton color prop accepts dynamic string values not fully typed
                const bgIbColor = (isp.color as any) ?? "neutral";
                return renderTooltipIconButton(
                  `Action ${i + 1}`,
                  <Icon>
                    <IbIcon />
                  </Icon>,
                  {
                    key: `icon${i}`,
                    variant: bgIbVariant,
                    size: bgSize,
                    color: bgIbColor,
                    "aria-label": `Action ${i + 1}`,
                  },
                );
              });
              cellContent = (
                <ButtonGroup>
                  {bgButtons}
                  {bgIcons}
                </ButtonGroup>
              );
            } else if (colContent === "Tag") {
              const rowNum = index + 1;
              const spAll = sub("tagContent");
              const spRow = sub(`tagRow${rowNum}Content`);
              const sp = Object.keys(spRow).length > 0 ? spRow : spAll;
              const perRowLabel = cp[`tagRow${rowNum}Label`];
              const labels = parseMultiValues(cp.tagLabel, dtRowCount, "Tag");
              const label = perRowLabel !== undefined ? perRowLabel : labels[index];
              // biome-ignore lint/suspicious/noExplicitAny: Tag size prop accepts dynamic string values not fully typed
              const cellTagSize = (cp.tagSize ?? "small") as any;
              // biome-ignore lint/suspicious/noExplicitAny: Tag color prop accepts dynamic string values not fully typed
              const cellTagColor = (sp.color ?? "neutral") as any;
              // biome-ignore lint/suspicious/noExplicitAny: Tag variant prop accepts dynamic string values not fully typed
              const cellTagVariant = (sp.variant ?? "outline") as any;
              cellContent = (
                <Tag size={cellTagSize} color={cellTagColor} variant={cellTagVariant}>
                  {label}
                </Tag>
              );
            } else if (colContent === "TagGroup") {
              const rowNum = index + 1;
              // Items: per-row 設定 → All Rows 共通設定 の順でフォールバック
              const tgItems = Math.min(Math.max(parseInt(cp[`tgRow${rowNum}Items`] ?? cp.tgItems ?? "3", 10), 1), 10);
              // biome-ignore lint/suspicious/noExplicitAny: Tag size prop accepts dynamic string values not fully typed
              const tgSize = (cp.tgSize ?? "medium") as any;
              // biome-ignore lint/suspicious/noExplicitAny: Tag variant prop accepts dynamic string values not fully typed
              const tgVariant = (cp.tgVariant ?? "fill") as any;
              // ラベル: per-row 設定 → All Rows 共通設定 の順でフォールバック
              const rawLabels = cp[`tgTagLabels${rowNum}`] ?? cp.tgTagLabels;
              const tgLabels = parseMultiValues(rawLabels, tgItems, "Tag");
              // カラー: per-row 設定 → All Rows 共通設定 の順でフォールバック
              const getTgColorRaw = (n: number) =>
                cp[`tgRow${rowNum}TagColor${n}`] ?? cp[`tgTagColor${n}`] ?? "neutral";
              // biome-ignore lint/suspicious/noExplicitAny: Tag color prop accepts dynamic string values not fully typed
              const getTgColor = (n: number) => getTgColorRaw(n) as any;
              cellContent = (
                <TagGroup>
                  {Array.from({ length: tgItems }, (_, i) => i).map((i) => (
                    <Tag key={`tag-${i}`} size={tgSize} variant={tgVariant} color={getTgColor(i + 1)}>
                      {tgLabels[i]}
                    </Tag>
                  ))}
                </TagGroup>
              );
            } else if (colContent === "StatusLabel") {
              const rowNum = index + 1;
              const spAll = sub("statusLabelContent");
              const spRow = sub(`slRow${rowNum}Content`);
              const sp = Object.keys(spRow).length > 0 ? spRow : spAll;
              const perRowLabel = cp[`slRow${rowNum}Label`];
              const labels = parseMultiValues(cp.statusLabelLabel, dtRowCount, "Label");
              const label = perRowLabel !== undefined ? perRowLabel : labels[index];
              // biome-ignore lint/suspicious/noExplicitAny: StatusLabel size prop accepts dynamic string values not fully typed
              const cellSlSize = (cp.slSize ?? "medium") as any;
              // biome-ignore lint/suspicious/noExplicitAny: StatusLabel color prop accepts dynamic string values not fully typed
              const cellSlColor = (sp.color ?? "neutral") as any;
              // biome-ignore lint/suspicious/noExplicitAny: StatusLabel variant prop accepts dynamic string values not fully typed
              const cellSlVariant = (sp.variant ?? "outline") as any;
              cellContent = (
                <StatusLabel size={cellSlSize} color={cellSlColor} variant={cellSlVariant}>
                  {label}
                </StatusLabel>
              );
            } else if (colContent === "Link") {
              const labels = parseMultiValues(cp.linkLabel, dtRowCount, "Link");
              const label = labels[index];
              cellContent = <Link href="#">{label}</Link>;
            } else if (colContent === "AvatarGroup") {
              const AG_COUNT = 3;
              cellContent = (
                <AvatarGroup>
                  {Array.from({ length: AG_COUNT }, (_, i) => i).map((i) => (
                    <Avatar
                      key={`avatar-${i}`}
                      size="small"
                      color={AVATAR_COLORS[(index + i) % AVATAR_COLORS.length]}
                      name={AVATAR_INITIALS[(index + i) % AVATAR_INITIALS.length] ?? ""}
                    />
                  ))}
                </AvatarGroup>
              );
            } else if (colContent === "TextField") {
              const DT_TF_DEFAULT =
                "wasabi lover,ecliptic advocate,entrepreneur,ravioli enthusiast,foodie,photographer,pleasure devotee,activist,commodity fan,artist and activist";
              const showPlaceholder = cp.textfieldPlaceholder === "true";
              const tfValues = parseMultiValues(cp.textfieldValue ?? DT_TF_DEFAULT, dtRowCount, "");
              const tfValue = tfValues[index] ?? "";
              const tfPlaceholder = cp.textfieldPlaceholderText ?? "This is Placeholder";
              cellContent = showPlaceholder ? (
                <TextField
                  key={`ph-${tfPlaceholder}`}
                  aria-label={getPreviewInputAriaLabel("TextField")}
                  size="medium"
                  placeholder={tfPlaceholder}
                />
              ) : (
                <TextField
                  key={`dv-${index}-${tfValue}`}
                  aria-label={getPreviewInputAriaLabel("TextField")}
                  size="medium"
                  defaultValue={tfValue}
                />
              );
            } else if (colContent === "Select") {
              const DT_SEL_DEFAULT =
                "Vanuatu,Colombia,Uzbekistan,Gibraltar,Angola,Republic of Korea,Armenia,Christmas Island,Bolivia,Greece";
              const showPlaceholder = cp.selectPlaceholder === "true";
              const optRaw = (cp.selectOptions ?? DT_SEL_DEFAULT)
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
              const opts = optRaw.map((v) => ({ label: v, value: v }));
              const selVals = parseMultiValues(cp.selectValue ?? DT_SEL_DEFAULT, dtRowCount, optRaw[0] ?? "");
              const selVal = selVals[index] ?? optRaw[index % Math.max(optRaw.length, 1)] ?? "";
              const selPlaceholder = cp.selectPlaceholderText ?? "Select...";
              const selGhost = cp.selectGhost !== "false";
              cellContent = showPlaceholder ? (
                <Select
                  key={`sel-ph-${selPlaceholder}`}
                  aria-label={getPreviewInputAriaLabel("Select")}
                  size="small"
                  options={opts}
                  placeholder={selPlaceholder}
                  ghost={selGhost}
                />
              ) : (
                <Select
                  key={`sel-${index}-${selVal}`}
                  aria-label={getPreviewInputAriaLabel("Select")}
                  size="small"
                  options={opts}
                  defaultValue={selVal}
                  ghost={selGhost}
                />
              );
            } else if (colContent === "Combobox") {
              const DT_CB_DEFAULT = "Sushi,Ramen,Tempura,Udon,Soba,Tonkatsu,Yakitori,Takoyaki,Okonomiyaki,Miso";
              const showPlaceholder = cp.comboboxPlaceholder === "true";
              const optRaw = (cp.comboboxOptions ?? DT_CB_DEFAULT)
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
              const opts = optRaw.map((v) => ({ label: v, value: v }));
              const cbVals = parseMultiValues(cp.comboboxValue ?? DT_CB_DEFAULT, dtRowCount, optRaw[0] ?? "");
              const cbVal = cbVals[index] ?? optRaw[index % Math.max(optRaw.length, 1)] ?? "";
              const cbPlaceholder = cp.comboboxPlaceholderText ?? "Search...";
              cellContent = showPlaceholder ? (
                <Combobox
                  key={`cb-ph-${cbPlaceholder}`}
                  aria-label={getPreviewInputAriaLabel("Combobox")}
                  size="medium"
                  options={opts}
                  placeholder={cbPlaceholder}
                />
              ) : (
                <Combobox
                  key={`cb-${index}-${cbVal}`}
                  aria-label={getPreviewInputAriaLabel("Combobox")}
                  size="medium"
                  options={opts}
                  defaultValue={cbVal}
                />
              );
            } else if (colContent === "TagPicker") {
              const DT_TP_OPTS = "Tokyo,New York,London,Paris,Berlin,Sydney,Toronto,Dubai,Singapore,Seoul";
              const DT_TP_VAL = "Tokyo,New York,London,Paris,Berlin,Sydney,Toronto,Dubai,Singapore,Seoul";
              const showPlaceholder = cp.tagPickerPlaceholder === "true";
              const optRaw = (cp.tagPickerOptions ?? DT_TP_OPTS)
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
              const opts = optRaw.map((v) => ({ label: v, value: v }));
              const tpVals = parseMultiValues(cp.tagPickerValue ?? DT_TP_VAL, dtRowCount, optRaw[0] ?? "");
              const tpVal = tpVals[index] ?? optRaw[index % Math.max(optRaw.length, 1)] ?? "";
              const tpPlaceholder = cp.tagPickerPlaceholderText ?? "Add tags...";
              cellContent = showPlaceholder ? (
                <TagPicker
                  key={`tp-ph-${tpPlaceholder}`}
                  aria-label={getPreviewInputAriaLabel("TagPicker")}
                  options={opts}
                  placeholder={tpPlaceholder}
                  defaultValue={[]}
                />
              ) : (
                <TagPicker
                  key={`tp-${index}-${tpVal}`}
                  aria-label={getPreviewInputAriaLabel("TagPicker")}
                  options={opts}
                  defaultValue={tpVal ? [tpVal] : []}
                />
              );
            } else if (colContent === "TagInput") {
              const DT_TI_DEFAULT =
                "Kertzmann and Sons,O'Reilly - Conn,Pouros Reinger and Kuvalis,Schimmel - Fadel,Effertz - Leannon,Cormier and Sons,Donnelly Inc,Hermiston and Armstrong,Zemlak - Franey,King - Braun";
              const showPlaceholder = cp.tagInputPlaceholder === "true";
              const tiVals = parseMultiValues(cp.tagInputValue ?? DT_TI_DEFAULT, dtRowCount, "");
              const tiVal = tiVals[index]?.trim() ?? "";
              const tiPlaceholder = cp.tagInputPlaceholderText ?? "Add tags...";
              cellContent = showPlaceholder ? (
                <TagInput
                  key={`ti-ph-${tiPlaceholder}`}
                  aria-label={getPreviewInputAriaLabel("TagInput")}
                  placeholder={tiPlaceholder}
                  defaultValue={[]}
                />
              ) : (
                <TagInput
                  key={`ti-${index}-${tiVal}`}
                  aria-label={getPreviewInputAriaLabel("TagInput")}
                  defaultValue={tiVal ? [tiVal] : []}
                />
              );
            } else if (colContent === "DatePicker") {
              const DT_DP_DEFAULT =
                "2024-01-15,2024-02-20,2024-03-10,2024-04-05,2024-05-22,2024-06-18,2024-07-30,2024-08-12,2024-09-25,2024-10-08";
              const showPlaceholder = cp.datePickerPlaceholder === "true";
              const dpVals = parseMultiValues(cp.datePickerValue ?? DT_DP_DEFAULT, dtRowCount, "");
              const dpStr = dpVals[index]?.trim() ?? "";
              const dpDate = dpStr ? new Date(dpStr) : undefined;
              cellContent = showPlaceholder ? (
                <DatePicker key="dp-ph" aria-label={getPreviewInputAriaLabel("DatePicker")} />
              ) : (
                <DatePicker
                  key={`dp-${index}-${dpStr}`}
                  aria-label={getPreviewInputAriaLabel("DatePicker")}
                  {...(dpDate ? { defaultValue: dpDate } : {})}
                />
              );
            }

            return (
              <DataTableCell leading={leadingNode} trailing={trailingNode}>
                {cellContent}
                {descValue && <DataTableDescription>{descValue}</DataTableDescription>}
              </DataTableCell>
            );
          },
        };
      });

      const dtDataProps = {
        "data-column-bordered": String(dtColumnBordered),
        "data-outer-bordered": String(dtOuterBordered),
      } as unknown as Record<string, never>;
      return (
        <DataTable
          key={`${String(dtMultiSel)}-${String(!!dtBadgedRowIds)}-${String(dtReorder)}-${String(dtColumnOrder)}-${itemProps?.columnOrderList ?? ""}`}
          columns={dtColumns}
          rows={dtRows}
          getRowId={(row) => (row as Record<string, unknown>).id as string}
          size={dtSize}
          stickyHeader={dtSticky}
          columnBordered={dtColumnBordered}
          outerBordered={dtOuterBordered}
          {...dtDataProps}
          highlightRowOnHover={dtHighlight}
          {...(dtHighlightedRowIds && { highlightedRows: dtHighlightedRowIds })}
          {...(dtBadgedRowIds && { badgedRows: dtBadgedRowIds })}
          rowSelectionType={dtMultiSel ? "multiple" : "none"}
          {...(dtSortable && dtManualSorting && { manualSorting: true })}
          rowReorderable={dtReorder}
          {...(dtDefaultColumnOrder && { defaultColumnOrder: dtDefaultColumnOrder })}
          {...(dtPinning && {
            columnPinning:
              dtPinPosition === "start" ? { start: dtPinningCols, end: [] } : { start: [], end: dtPinningCols },
          })}
        />
      );
    }

    case "DateField":
      return <DateFieldRenderer itemProps={itemProps} />;

    case "DatePicker":
      return <DatePickerRenderer itemProps={itemProps} />;

    case "DescriptionList": {
      const DL_ITEM_MAX = 20;
      const DL_DEFAULT_TERMS =
        "Name,Status,Created At,Updated At,Email,Phone,Company,Department,Location,Role,Description,Category,Type,Owner,Priority,Due Date,Budget,Progress,Rating,Notes";
      const DL_DEFAULT_DD: Record<string, string> = {
        Text: "John Doe,Active,2024-01-15,2024-03-20,john@example.com,+1-555-0123,Acme Corp,Engineering,Tokyo,Admin,Product manager,Software,Bug,Alice,High,2024-04-30,$50000,75%,4.5,No issues",
        Link: "View details,See more,Download,Upload,Share,Contact,Settings,Dashboard,Profile,Reports,Documentation,Archive,Create,Assign,Update,Schedule,Budget,Progress,Review,Notes",
        TagGroup:
          "Nicolas Little,Dominick Frami,Rita Thompson,Clifford Becker,Conrad Emard,Edward Mosciski,Donnie McGlynn,Jeannette Stanton,Grace Yost,Pete Walsh",
        StatusLabel:
          "Completed,Active,Pending,Archived,Draft,Active,Completed,Pending,Active,Draft,Completed,Active,Pending,Archived,Draft,Active,Completed,Pending,Active,Draft",
      };
      const dlExt = (prefix: string): Record<string, string> =>
        Object.fromEntries(
          Object.entries(itemProps ?? {})
            .filter(([k]) => k.startsWith(prefix))
            .map(([k, v]) => [k.slice(prefix.length), v]),
        );

      // biome-ignore lint/suspicious/noExplicitAny: DescriptionList size prop accepts dynamic string values not fully typed
      const dlSize = (itemProps?.size ?? "large") as any;
      const dlBordered = itemProps?.bordered === "true";
      // biome-ignore lint/suspicious/noExplicitAny: DescriptionList orientation prop accepts dynamic string values not fully typed
      const dlOrientation = (itemProps?.itemOrientation ?? "vertical") as any;
      // biome-ignore lint/suspicious/noExplicitAny: DescriptionList termWidth prop accepts dynamic string values not fully typed
      const dlTermWidth = itemProps?.termWidth === "true" ? ((itemProps?.termWidthType ?? "medium") as any) : undefined;
      const dlTermTrailing = itemProps?.termTrailing === "true";
      const dlDetailLeading = itemProps?.detailLeading === "true";
      const dlDetailLeadingType = itemProps?.detailLeadingType ?? "Avatar";
      const dlDetailTrailing = itemProps?.detailTrailing === "true";
      const dlDetailTrailingType = itemProps?.detailTrailingType ?? "IconButton";
      const dlDdContent = itemProps?.ddContent ?? "Text";
      const COUNT = Math.min(Math.max(parseInt(itemProps?.items ?? "3", 10) || 1, 1), DL_ITEM_MAX);

      const TermTrailingIcon = getAegisIconComponent("LfQuestionCircle");
      const trailingTextLabels = parseMultiValues(itemProps?.trailingText, COUNT, "Label");

      const ddDefault = DL_DEFAULT_DD[dlDdContent] ?? DL_DEFAULT_DD.StatusLabel;
      const termLabels = parseMultiValues(itemProps?.dtLabels ?? DL_DEFAULT_TERMS, COUNT, "Term");
      const ddLabels = parseMultiValues(itemProps?.ddLabels ?? ddDefault, COUNT, "Value");

      return (
        <DescriptionList size={dlSize} bordered={dlBordered}>
          {Array.from({ length: COUNT }, (_, i) => {
            const n = i + 1;
            const ip = itemProps ?? {};
            const termLabel = ip[`dlTerm${n}`] || termLabels[i] || `Term ${n}`;
            const ddRaw = ip[`dlDetail${n}`] || ddLabels[i] || `Value ${n}`;

            // Per-item leading/trailing override resolution
            const iLeadingOn =
              ip[`detailLeading${n}`] !== undefined ? ip[`detailLeading${n}`] === "true" : dlDetailLeading;
            const iLeadingType = ip[`detailLeadingType${n}`] ?? dlDetailLeadingType;
            const iTrailingOn =
              ip[`detailTrailing${n}`] !== undefined ? ip[`detailTrailing${n}`] === "true" : dlDetailTrailing;
            const iTrailingType = ip[`detailTrailingType${n}`] ?? dlDetailTrailingType;

            // Leading slot
            let leadingSlot: React.ReactNode;
            if (iLeadingOn) {
              switch (iLeadingType) {
                case "Avatar":
                  leadingSlot = <Avatar size="xSmall" name={ddRaw.replace(/[^a-zA-Z\s]/g, "").trim() || "User"} />;
                  break;
                case "Icon":
                  leadingSlot = (
                    <Icon>
                      <LfInformationCircle />
                    </Icon>
                  );
                  break;
              }
            }

            // Trailing icon key (per-item first, then global)
            const iTrailingIconKey = (() => {
              switch (iTrailingType) {
                case "Icon":
                  return ip[`trailingIcon${n}`] ?? itemProps?.trailingIcon ?? "LfPlusLarge";
                case "IconButton":
                  return ip[`trailingIconButton${n}`] ?? itemProps?.trailingIconButton ?? "LfQuestionCircle";
                default:
                  return "LfPlusLarge";
              }
            })();
            const ITrailingIconComp = getAegisIconComponent(iTrailingIconKey);

            // Trailing slot
            let trailingSlot: React.ReactNode;
            if (iTrailingOn) {
              switch (iTrailingType) {
                case "Icon":
                  trailingSlot = (
                    <Icon>
                      <ITrailingIconComp />
                    </Icon>
                  );
                  break;
                case "Text": {
                  const text = ip[`trailingText${n}`] || trailingTextLabels[i] || "Label";
                  trailingSlot = (
                    <Text variant="body.small" color="subtle" as="span">
                      {text}
                    </Text>
                  );
                  break;
                }
                case "IconButton":
                  trailingSlot = renderTooltipIconButton(
                    "Help",
                    <Icon>
                      <ITrailingIconComp />
                    </Icon>,
                    { size: "small", "aria-label": "Help" },
                  );
                  break;
                case "Tag": {
                  const spN = dlExt(`trailingTag${n}_`);
                  const sp = Object.keys(spN).length > 0 ? spN : dlExt("trailingTag_");
                  // biome-ignore lint/suspicious/noExplicitAny: Tag size prop accepts dynamic string values not fully typed
                  const dlTagSize = (sp.size as any) ?? "small";
                  // biome-ignore lint/suspicious/noExplicitAny: Tag color prop accepts dynamic string values not fully typed
                  const dlTagColor = (sp.color as any) ?? "blue";
                  // biome-ignore lint/suspicious/noExplicitAny: Tag variant prop accepts dynamic string values not fully typed
                  const dlTagVariant = (sp.variant as any) ?? "outline";
                  trailingSlot = (
                    <Tag size={dlTagSize} color={dlTagColor} variant={dlTagVariant}>
                      {sp.label || "Tag"}
                    </Tag>
                  );
                  break;
                }
                case "StatusLabel": {
                  const spN = dlExt(`trailingStatusLabel${n}_`);
                  const isPerItem = Object.keys(spN).length > 0;
                  const sp = isPerItem ? spN : dlExt("trailingStatusLabel_");
                  const labelIdx = isPerItem ? 0 : i;
                  const slLabel = parseMultiValues(sp.label, labelIdx + 1, "Status")[labelIdx] || "Status";
                  // biome-ignore lint/suspicious/noExplicitAny: StatusLabel size prop accepts dynamic string values not fully typed
                  const dlSlSize = (sp.size as any) ?? "medium";
                  // biome-ignore lint/suspicious/noExplicitAny: StatusLabel color prop accepts dynamic string values not fully typed
                  const dlSlColor = (sp.color as any) ?? "neutral";
                  // biome-ignore lint/suspicious/noExplicitAny: StatusLabel variant prop accepts dynamic string values not fully typed
                  const dlSlVariant = (sp.variant as any) ?? "outline";
                  trailingSlot = (
                    <StatusLabel size={dlSlSize} color={dlSlColor} variant={dlSlVariant}>
                      {slLabel}
                    </StatusLabel>
                  );
                  break;
                }
              }
            }

            let detailContent: React.ReactNode;
            switch (dlDdContent) {
              case "Text":
                detailContent = ddRaw;
                break;
              case "Link":
                detailContent = (
                  <Link
                    href="#"
                    target="_blank"
                    trailing={
                      <Icon>
                        <LfArrowUpRightFromSquare />
                      </Icon>
                    }
                  >
                    {ddRaw}
                  </Link>
                );
                break;
              case "TagGroup": {
                const tgSpN = dlExt(`ddTagGroup${n}_`);
                const isPerItemTg = Object.keys(tgSpN).length > 0;
                const tgSp = isPerItemTg ? tgSpN : dlExt("ddTagGroup_");
                const hasTgSp = Object.keys(tgSp).length > 0;
                const tgCount = Math.min(
                  Math.max(parseInt((hasTgSp ? tgSp.tgItems : undefined) ?? "3", 10) || 1, 1),
                  30,
                );
                // biome-ignore lint/suspicious/noExplicitAny: Tag size prop accepts dynamic string values not fully typed
                const tgSize = ((hasTgSp ? tgSp.size : undefined) as any) ?? "small";
                // biome-ignore lint/suspicious/noExplicitAny: Tag variant prop accepts dynamic string values not fully typed
                const tgVariant = ((hasTgSp ? tgSp.tagVariant : undefined) as any) ?? "fill";
                const tgWithLabel = hasTgSp && tgSp.withLabel === "true";
                const rawTgLabels = hasTgSp && tgSp.tagLabels ? tgSp.tagLabels : (itemProps?.ddLabels ?? ddDefault);
                const allTagLabels = rawTgLabels
                  .split(",")
                  .map((s: string) => s.trim())
                  .filter(Boolean);
                detailContent = (
                  <TagGroup>
                    {tgWithLabel && <TagGroupLabel>{tgSp.groupLabel || "Label"}</TagGroupLabel>}
                    {Array.from({ length: tgCount }, (_, ti) => ti).map((ti) => (
                      <Tag
                        key={`detail-tag-${ti}`}
                        size={tgSize}
                        variant={tgVariant}
                        // biome-ignore lint/suspicious/noExplicitAny: Tag color prop accepts dynamic string values not fully typed
                        color={((hasTgSp ? tgSp[`tagColor${ti + 1}`] : undefined) as any) ?? "neutral"}
                      >
                        {allTagLabels[ti] ?? `Tag ${ti + 1}`}
                      </Tag>
                    ))}
                  </TagGroup>
                );
                break;
              }
              case "StatusLabel":
                detailContent = <StatusLabel color="gray">{ddRaw}</StatusLabel>;
                break;
              default:
                detailContent = ddRaw;
            }

            return (
              <DescriptionListItem key={n} orientation={dlOrientation}>
                <DescriptionListTerm
                  width={dlTermWidth}
                  trailing={
                    dlTermTrailing
                      ? renderTooltipIconButton(
                          "Help",
                          <Icon>
                            <TermTrailingIcon />
                          </Icon>,
                          { size: "small", "aria-label": "Help" },
                        )
                      : undefined
                  }
                >
                  {termLabel}
                </DescriptionListTerm>
                <DescriptionListDetail leading={leadingSlot} trailing={trailingSlot}>
                  {detailContent}
                </DescriptionListDetail>
              </DescriptionListItem>
            );
          })}
        </DescriptionList>
      );
    }

    case "Divider":
      return <Divider />;

    case "DividerVertical":
      return <Divider orientation="vertical" />;

    case "EmptyState":
      return <EmptyStateRenderer itemProps={itemProps} area={area} />;

    case "FileDrop": {
      const fdText = itemProps?.text || "Drag and drop your files\nto upload them to the space";
      return (
        <FileDrop
          uploadButtonTitle={itemProps?.buttonLabel || "Select File"}
          multiple={itemProps?.multiple === "true"}
          icon={itemProps?.icon !== "false" ? undefined : false}
          sub={
            itemProps?.sub === "true" ? (
              <div
                style={{
                  padding: "var(--aegis-space-small)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
                  border: "1px dashed var(--aegis-color-border-neutral-default)",
                  borderRadius: "var(--aegis-radius-medium)",
                  color: "var(--aegis-color-text-neutral-default)",
                  height: "100%",
                }}
              >
                Dummy Content
              </div>
            ) : undefined
          }
        >
          <Text whiteSpace="pre">{fdText}</Text>
        </FileDrop>
      );
    }

    case "Form": {
      const fcItemCount = Math.min(Math.max(parseInt(itemProps?.items ?? "3", 10), 1), 20);
      const isHorizontal = (itemProps?.fcOrientation ?? "Vertical") === "Horizontal";
      const fcOrientation = isHorizontal ? ("horizontal" as const) : ("vertical" as const);
      const fcLabelWidthRaw =
        isHorizontal && (itemProps?.labelWidth ?? "Off") !== "Off" ? itemProps?.labelWidth : undefined;
      // biome-ignore lint/suspicious/noExplicitAny: Form labelWidth prop accepts dynamic string values not fully typed
      const fcLabelWidth = fcLabelWidthRaw as any;

      const getEditSubProps = (editKey: string): Record<string, string> =>
        Object.fromEntries(
          Object.entries(itemProps ?? {})
            .filter(([k]) => k.startsWith(`${editKey}_`))
            .map(([k, v]) => [k.slice(`${editKey}_`.length), v]),
        );

      const renderFormInput = (inputType: string, sp: Record<string, string>): React.ReactElement => {
        // biome-ignore lint/suspicious/noExplicitAny: form input size prop accepts dynamic string values not fully typed
        const sz = (sp.size as any) || undefined;
        // biome-ignore lint/suspicious/noExplicitAny: form input variant prop accepts dynamic string values not fully typed
        const vr = (sp.variant as any) || undefined;
        const ph = sp.placeholder || undefined;
        const withLeading = sp.leading === "true";
        const withTrailing = sp.trailing === "true";
        const LeadingIconComp = withLeading ? getAegisIconComponent(sp.leadingIcon || "LfPlusLarge") : undefined;
        const TrailingIconComp = withTrailing ? getAegisIconComponent(sp.trailingIcon || "LfPlusLarge") : undefined;
        const leadingEl = LeadingIconComp ? (
          <Icon>
            <LeadingIconComp />
          </Icon>
        ) : undefined;
        const trailingEl = TrailingIconComp ? (
          <Icon>
            <TrailingIconComp />
          </Icon>
        ) : undefined;
        switch (inputType) {
          case "Combobox":
            return (
              <Combobox
                aria-label={getPreviewInputAriaLabel("Combobox")}
                options={COMBOBOX_OPTIONS}
                {...(sz && { size: sz })}
                {...(vr && { variant: vr })}
                {...(ph && { placeholder: ph })}
                {...(leadingEl && { leading: leadingEl })}
              />
            );
          case "DateField": {
            const granularity = sp.granularity === "true" ? ("minute" as const) : ("day" as const);
            return (
              <DateField
                aria-label={getPreviewInputAriaLabel("DateField")}
                {...(sz && { size: sz })}
                {...(vr && { variant: vr })}
                granularity={granularity}
                {...(leadingEl && { leading: leadingEl })}
                {...(trailingEl && { trailing: trailingEl })}
              />
            );
          }
          case "DatePicker": {
            const granularity = sp.granularity === "true" ? ("minute" as const) : ("day" as const);
            return (
              <DatePicker
                aria-label={getPreviewInputAriaLabel("DatePicker")}
                {...(sz && { size: sz })}
                granularity={granularity}
                {...(leadingEl && { leading: leadingEl })}
                {...(trailingEl && { trailing: trailingEl })}
              />
            );
          }
          case "RangeDatePicker":
            return (
              <RangeDatePicker
                aria-label={getPreviewInputAriaLabel("RangeDatePicker")}
                {...(sz && { size: sz })}
                {...(leadingEl && { leading: leadingEl })}
                {...(trailingEl && { trailing: trailingEl })}
              />
            );
          case "ReadOnly":
            return (
              <TextField
                aria-label={getPreviewInputAriaLabel("TextField")}
                readOnly
                defaultValue="Read only value"
                {...(sz && { size: sz })}
                {...(vr && { variant: vr })}
              />
            );
          case "Search":
            return (
              <Search
                aria-label={getPreviewInputAriaLabel("Search")}
                {...(sz && { size: sz })}
                {...(ph && { placeholder: ph })}
                {...(trailingEl && { trailing: trailingEl })}
              />
            );
          case "TagInput":
            return (
              <TagInput
                aria-label={getPreviewInputAriaLabel("TagInput")}
                {...(sz && { size: sz })}
                {...(ph && { placeholder: ph })}
                {...(leadingEl && { leading: leadingEl })}
                {...(trailingEl && { trailing: trailingEl })}
              />
            );
          case "TagPicker":
            return (
              <TagPicker
                aria-label={getPreviewInputAriaLabel("TagPicker")}
                options={COMBOBOX_OPTIONS}
                {...(sz && { size: sz })}
                {...(ph && { placeholder: ph })}
                {...(leadingEl && { leading: leadingEl })}
                {...(trailingEl && { trailing: trailingEl })}
              />
            );
          case "TextArea":
            return <TextareaRenderer itemProps={{ ...sp, withinFormControl: "false" }} />;
          case "TextField":
            return (
              <TextField
                aria-label={getPreviewInputAriaLabel("TextField")}
                {...(sz && { size: sz })}
                {...(vr && { variant: vr })}
                {...(ph && { placeholder: ph })}
                {...(leadingEl && { leading: leadingEl })}
                {...(trailingEl && { trailing: trailingEl })}
              />
            );
          case "TimeField":
            return (
              <TimeField
                aria-label={getPreviewInputAriaLabel("TimeField")}
                {...(sz && { size: sz })}
                {...(vr && { variant: vr })}
                {...(leadingEl && { leading: leadingEl })}
                {...(trailingEl && { trailing: trailingEl })}
              />
            );
          case "TimePicker": {
            const minuteStep = sp.minuteStep ? Math.min(60, Math.max(1, parseInt(sp.minuteStep, 10))) : 5;
            return (
              <TimePicker
                aria-label={getPreviewInputAriaLabel("TimePicker")}
                {...(sz && { size: sz })}
                minuteStep={minuteStep}
                {...(leadingEl && { leading: leadingEl })}
                {...(trailingEl && { trailing: trailingEl })}
              />
            );
          }
          case "CheckboxGroup":
            return ComponentRenderer({ component: "CheckboxGroup", itemProps: sp }) as React.ReactElement;
          case "RadioGroup":
            return ComponentRenderer({ component: "RadioGroup", itemProps: sp }) as React.ReactElement;
          default: {
            const rawItems = sp.menuItems;
            const opts = rawItems
              ? parseMultiValues(rawItems, 10, "")
                  .filter(Boolean)
                  .map((v) => ({ value: v, label: v }))
              : [
                  { value: "1", label: "Option Alpha" },
                  { value: "2", label: "Option Beta" },
                  { value: "3", label: "Option Gamma" },
                ];
            const clearable = sp.clearable === "true";
            return (
              <Select
                aria-label={getPreviewInputAriaLabel("Select")}
                options={opts}
                {...(sz && { size: sz })}
                {...(vr && { variant: vr })}
                {...(ph && { placeholder: ph })}
                {...(clearable && { clearable: true })}
                {...(leadingEl && { leading: leadingEl })}
                {...(trailingEl && { trailing: trailingEl })}
              />
            );
          }
        }
      };

      const makeFc = (
        key: string | number,
        editKey: string,
        fallbackLabel: string,
        inputType: string,
      ): React.ReactElement => {
        const sp = getEditSubProps(editKey);
        const labelText = sp.fcLabel ?? fallbackLabel;
        const isRequired = sp.required === "true";
        const showCaption = (sp.fcCaption ?? "false") !== "false";
        const captionText = sp.fcCaptionText ?? "Caption text";
        const withFcGroup = sp.fcGroup === "true";
        const fcGroupInputType = sp.fcGroupInputType ?? "TextField";
        const withToolbar = sp.withToolbar === "true";
        const ghostToolbar = sp.withGhostToolbar === "true";
        const toolbarCount = Math.min(Math.max(parseInt(sp.toolbarItems ?? "2", 10), 1), 3);
        const mainInput = renderFormInput(inputType, sp);
        return (
          <FormControl key={key} orientation={fcOrientation} required={isRequired}>
            <FormControl.Label {...(fcLabelWidth ? { width: fcLabelWidth } : {})}>{labelText}</FormControl.Label>
            {withToolbar && (
              <FormControl.Toolbar ghost={ghostToolbar}>
                {Array.from({ length: toolbarCount }, (_, i) => i).map((i) => {
                  const btnLabel =
                    toolbarCount === 1 ? (sp.btnLabel ?? "Action") : (sp[`btnLabel${i + 1}`] ?? `Action ${i + 1}`);
                  return (
                    <React.Fragment key={`fc-toolbar-${i}`}>
                      {i > 0 && <Divider />}
                      <Button variant="gutterless">{btnLabel}</Button>
                    </React.Fragment>
                  );
                })}
              </FormControl.Toolbar>
            )}
            {withFcGroup ? (
              <FormControl.Group>
                {mainInput}
                {renderFormInput(fcGroupInputType, {})}
              </FormControl.Group>
            ) : (
              mainInput
            )}
            {showCaption && <FormControl.Caption>{captionText}</FormControl.Caption>}
          </FormControl>
        );
      };

      const formItems = Array.from({ length: fcItemCount }, (_, i) => {
        const n = i + 1;
        const formLayout = isHorizontal ? "default" : (itemProps?.[`item${n}FormLayout`] ?? "default");
        const fc1 = makeFc(`${n}-1`, `itemEdit${n}`, `Field ${n}`, itemProps?.[`inputType${n}`] ?? "Select");
        if (formLayout === "with group") {
          return (
            <FormGroup key={n}>
              <div style={{ flex: 1, minWidth: 0 }}>{fc1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {makeFc(`${n}-2`, `itemEdit${n}_2`, `Field ${n}-2`, itemProps?.[`inputType${n}_2`] ?? "Select")}
              </div>
            </FormGroup>
          );
        }
        if (formLayout === "nested") {
          const nestedCount = Math.min(Math.max(parseInt(itemProps?.[`nestedItems${n}`] ?? "3", 10), 1), 10);
          return (
            <FormGroup
              key={n}
              sub={Array.from({ length: nestedCount }, (_, j) => {
                const m = j + 1;
                return makeFc(
                  m,
                  `nestedItemEdit${n}_${m}`,
                  `Sub Field ${m}`,
                  itemProps?.[`nestedInputType${n}_${m}`] ?? "Select",
                );
              })}
            >
              {fc1}
            </FormGroup>
          );
        }
        return fc1;
      });

      return <Form>{formItems}</Form>;
    }

    case "FormControl": {
      const ip = itemProps ?? {};
      const isHorizontal = (ip.fcOrientation ?? "Vertical") === "Horizontal";
      const fcOrientation = isHorizontal ? ("horizontal" as const) : ("vertical" as const);
      const inputType = ip.inputType1 ?? "Select";

      const buildFcInput = (type: string, p: Record<string, string>): React.ReactElement => {
        // biome-ignore lint/suspicious/noExplicitAny: form input size prop accepts dynamic string values not fully typed
        const sz = (p.size as any) || undefined;
        // biome-ignore lint/suspicious/noExplicitAny: form input variant prop accepts dynamic string values not fully typed
        const vr = (p.variant as any) || undefined;
        const ph = p.placeholder || undefined;
        const withL = p.leading === "true";
        const withT = p.trailing === "true";
        const LIcon = withL ? getAegisIconComponent(p.leadingIcon || "LfPlusLarge") : undefined;
        const TIcon = withT ? getAegisIconComponent(p.trailingIcon || "LfPlusLarge") : undefined;
        const lEl = LIcon ? (
          <Icon>
            <LIcon />
          </Icon>
        ) : undefined;
        const tEl = TIcon ? (
          <Icon>
            <TIcon />
          </Icon>
        ) : undefined;
        switch (type) {
          case "Combobox": {
            const rawItems = p.menuItems;
            const opts = rawItems
              ? parseMultiValues(rawItems, 10, "")
                  .filter(Boolean)
                  .map((v) => ({ value: v, label: v }))
              : COMBOBOX_OPTIONS;
            return (
              <Combobox
                aria-label={getPreviewInputAriaLabel("Combobox")}
                options={opts}
                {...(sz && { size: sz })}
                {...(vr && { variant: vr })}
                {...(ph && { placeholder: ph })}
                {...(lEl && { leading: lEl })}
              />
            );
          }
          case "DateField": {
            const gran = p.granularity === "true" ? ("minute" as const) : ("day" as const);
            return (
              <DateField
                aria-label={getPreviewInputAriaLabel("DateField")}
                {...(sz && { size: sz })}
                {...(vr && { variant: vr })}
                granularity={gran}
                {...(lEl && { leading: lEl })}
                {...(tEl && { trailing: tEl })}
              />
            );
          }
          case "DatePicker": {
            const gran = p.granularity === "true" ? ("minute" as const) : ("day" as const);
            return (
              <DatePicker
                aria-label={getPreviewInputAriaLabel("DatePicker")}
                {...(sz && { size: sz })}
                granularity={gran}
                {...(lEl && { leading: lEl })}
                {...(tEl && { trailing: tEl })}
              />
            );
          }
          case "RangeDatePicker":
            return (
              <RangeDatePicker
                aria-label={getPreviewInputAriaLabel("RangeDatePicker")}
                {...(sz && { size: sz })}
                {...(lEl && { leading: lEl })}
                {...(tEl && { trailing: tEl })}
              />
            );
          case "Search":
            return (
              <Search
                aria-label={getPreviewInputAriaLabel("Search")}
                {...(sz && { size: sz })}
                {...(ph && { placeholder: ph })}
                {...(tEl && { trailing: tEl })}
              />
            );
          case "TagInput":
            return (
              <TagInput
                aria-label={getPreviewInputAriaLabel("TagInput")}
                {...(sz && { size: sz })}
                {...(ph && { placeholder: ph })}
                {...(lEl && { leading: lEl })}
                {...(tEl && { trailing: tEl })}
              />
            );
          case "TagPicker":
            return (
              <TagPicker
                aria-label={getPreviewInputAriaLabel("TagPicker")}
                options={COMBOBOX_OPTIONS}
                {...(sz && { size: sz })}
                {...(ph && { placeholder: ph })}
                {...(lEl && { leading: lEl })}
                {...(tEl && { trailing: tEl })}
              />
            );
          case "TextArea":
            return <TextareaRenderer itemProps={{ ...p, withinFormControl: "false" }} />;
          case "TimeField":
            return (
              <TimeField
                aria-label={getPreviewInputAriaLabel("TimeField")}
                {...(sz && { size: sz })}
                {...(vr && { variant: vr })}
                {...(lEl && { leading: lEl })}
                {...(tEl && { trailing: tEl })}
              />
            );
          case "TimePicker": {
            const ms = p.minuteStep ? Math.min(60, Math.max(1, parseInt(p.minuteStep, 10))) : 5;
            return (
              <TimePicker
                aria-label={getPreviewInputAriaLabel("TimePicker")}
                {...(sz && { size: sz })}
                minuteStep={ms}
                {...(lEl && { leading: lEl })}
                {...(tEl && { trailing: tEl })}
              />
            );
          }
          case "CheckboxGroup":
            return ComponentRenderer({ component: "CheckboxGroup", itemProps: p }) as React.ReactElement;
          case "RadioGroup":
            return ComponentRenderer({ component: "RadioGroup", itemProps: p }) as React.ReactElement;
          default: {
            const rawItems = p.menuItems;
            const opts = rawItems
              ? parseMultiValues(rawItems, 10, "")
                  .filter(Boolean)
                  .map((v) => ({ value: v, label: v }))
              : [
                  { value: "1", label: "Option Alpha" },
                  { value: "2", label: "Option Beta" },
                  { value: "3", label: "Option Gamma" },
                ];
            return (
              <Select
                aria-label={getPreviewInputAriaLabel("Select")}
                options={opts}
                {...(sz && { size: sz })}
                {...(vr && { variant: vr })}
                {...(ph && { placeholder: ph })}
                {...(ip.clearable === "true" && { clearable: true })}
                {...(lEl && { leading: lEl })}
                {...(tEl && { trailing: tEl })}
              />
            );
          }
        }
      };

      const labelText = ip.fcLabel ?? "Label";
      const isRequired = ip.required === "true";
      const showCaption = (ip.fcCaption ?? "false") !== "false";
      const captionText = ip.fcCaptionText ?? "Caption text";
      const withFcGroup = ip.fcGroup === "true";
      const fcGroupType = ip.fcGroupInputType ?? "Select";
      const withToolbar = ip.withToolbar === "true";
      const ghostToolbar = ip.withGhostToolbar === "true";
      const toolbarCount = Math.min(Math.max(parseInt(ip.toolbarItems ?? "2", 10), 1), 3);
      const mainInput = buildFcInput(inputType, ip);

      return (
        <FormControl orientation={fcOrientation} required={isRequired}>
          <FormControl.Label>{labelText}</FormControl.Label>
          {withToolbar && (
            <FormControl.Toolbar ghost={ghostToolbar}>
              {Array.from({ length: toolbarCount }, (_, i) => i).map((i) => {
                const btnLabel =
                  toolbarCount === 1 ? (ip.btnLabel ?? "Action") : (ip[`btnLabel${i + 1}`] ?? `Action ${i + 1}`);
                return (
                  <React.Fragment key={`fc2-toolbar-${i}`}>
                    {i > 0 && <Divider />}
                    <Button variant="gutterless">{btnLabel}</Button>
                  </React.Fragment>
                );
              })}
            </FormControl.Toolbar>
          )}
          {withFcGroup ? (
            <FormControl.Group>
              {mainInput}
              {buildFcInput(fcGroupType, {})}
            </FormControl.Group>
          ) : (
            mainInput
          )}
          {showCaption && <FormControl.Caption>{captionText}</FormControl.Caption>}
        </FormControl>
      );
    }

    case "IconButton": {
      const IbIcon = getAegisIconComponent(itemProps?.icon || "LfPlusLarge");
      // biome-ignore lint/suspicious/noExplicitAny: IconButton variant prop accepts dynamic string values not fully typed
      const ibBtnVariant = (itemProps?.variant as any) ?? "subtle";
      // biome-ignore lint/suspicious/noExplicitAny: IconButton size prop accepts dynamic string values not fully typed
      const ibBtnSize = (itemProps?.size as any) ?? "medium";
      // biome-ignore lint/suspicious/noExplicitAny: IconButton color prop accepts dynamic string values not fully typed
      const ibBtnColor = (itemProps?.color as any) ?? "neutral";
      return renderTooltipIconButton(
        "Action",
        <Icon>
          <IbIcon />
        </Icon>,
        {
          variant: ibBtnVariant,
          size: ibBtnSize,
          color: ibBtnColor,
          ...(itemProps?.loading === "true" ? { loading: true } : {}),
          "aria-label": "Action",
        },
      );
    }

    case "InformationCard":
      return (
        <InformationCard
          leading={
            <Icon>
              <LfTable />
            </Icon>
          }
        >
          <InformationCardDescription>
            Sample information card with key details and descriptive content.
          </InformationCardDescription>
        </InformationCard>
      );

    case "InformationCardGroup":
      return (
        <InformationCardGroup>
          <InformationCard
            leading={
              <Icon>
                <LfTable />
              </Icon>
            }
          >
            <InformationCardDescription>Card one description.</InformationCardDescription>
          </InformationCard>
          <InformationCard
            leading={
              <Icon>
                <LfTable />
              </Icon>
            }
          >
            <InformationCardDescription>Card two description.</InformationCardDescription>
          </InformationCard>
          <InformationCard
            leading={
              <Icon>
                <LfTable />
              </Icon>
            }
          >
            <InformationCardDescription>Card three description.</InformationCardDescription>
          </InformationCard>
        </InformationCardGroup>
      );

    case "Link": {
      const resolveLinkColor = (): string => {
        const t = itemProps?.textType ?? "default";
        if (t === "default") return itemProps?.color ?? "information";
        if (t === "title" || t === "document title" || t === "label") return "default";
        const w = itemProps?.weight ?? "normal";
        if (w === "bold") return "default";
        if (t === "body")
          return ["medium", "small", "xSmall"].includes(itemProps?.sizeBody ?? "medium") ? "information" : "default";
        if (t === "document body") return (itemProps?.sizeDocBody ?? "medium") === "large" ? "default" : "information";
        if (t === "caption") return "information";
        if (t === "data") return "information";
        if (t === "component")
          return ["large", "xxSmall"].includes(itemProps?.sizeComponent ?? "medium") ? "default" : "information";
        return "information";
      };
      // biome-ignore lint/suspicious/noExplicitAny: Link color prop accepts dynamic string values not fully typed
      const linkColor = resolveLinkColor() as any;
      const linkUnderline = itemProps?.underline === "true";
      const withLeading = itemProps?.leading === "true";
      const withTrailing = itemProps?.trailing === "true";
      const LeadingIcon = withLeading ? getAegisIconComponent(itemProps?.leadingIcon || "LfQuestionCircle") : undefined;
      const TrailingIcon = withTrailing
        ? getAegisIconComponent(itemProps?.trailingIcon || "LfArrowUpRightFromSquare")
        : undefined;
      const linkText = itemProps?.text || "Link";
      const linkEl = (
        <Link
          href="#"
          color={linkColor}
          {...(linkUnderline ? { underline: true } : {})}
          {...(LeadingIcon
            ? {
                leading: (
                  <Icon>
                    <LeadingIcon />
                  </Icon>
                ),
              }
            : {})}
          {...(TrailingIcon
            ? {
                trailing: (
                  <Icon>
                    <TrailingIcon />
                  </Icon>
                ),
              }
            : {})}
        >
          {linkText}
        </Link>
      );
      const textType = itemProps?.textType ?? "default";
      if (textType === "default") return linkEl;
      // biome-ignore lint/suspicious/noExplicitAny: Text variant prop accepts dynamic string values not fully typed
      const textVariant = resolveTypoVariant(itemProps ?? {}, "body.medium") as any;
      return <Text variant={textVariant}>{linkEl}</Text>;
    }

    case "Mark": {
      // biome-ignore lint/suspicious/noExplicitAny: Mark color prop accepts dynamic string values not fully typed
      const markColor = (itemProps?.color ?? "red") as any;
      const markUnderline = itemProps?.underline === "true";
      const withText = itemProps?.withText === "true";
      const textBefore = itemProps?.textBefore ?? "This text contains a ";
      const markText = itemProps?.markText ?? "important part";
      const textAfter = itemProps?.textAfter ?? " for emphasis.";
      return (
        <Text variant="body.medium">
          {textBefore}
          <Mark color={markColor} {...(markUnderline ? { underline: true } : {})}>
            {withText ? (
              // biome-ignore lint/suspicious/noExplicitAny: Text color prop accepts dynamic template literal not fully typed
              <Text color={`accent.${markColor}.subtle` as any}>{markText}</Text>
            ) : (
              markText
            )}
          </Mark>
          {textAfter}
        </Text>
      );
    }

    case "NavList": {
      // biome-ignore lint/suspicious/noExplicitAny: NavList size prop accepts dynamic string values not fully typed
      const nlSize = (itemProps?.size as any) ?? "medium";
      const nlWithGroup = itemProps?.withGroup === "true";
      const nlWithTitle = nlWithGroup && itemProps?.withGroupTitle === "true";
      const nlGroups = Math.min(Math.max(parseInt(itemProps?.groups ?? "2", 10), 2), 5);

      if (!nlWithGroup) {
        const nlItemTexts = parseMultiValues(itemProps?.itemTexts, 3, "Item");
        return (
          <NavList size={nlSize} aria-label="Nav">
            {nlItemTexts.map((text) => (
              <NavList.Item key={text} href="#">
                {text}
              </NavList.Item>
            ))}
          </NavList>
        );
      }

      const nlTitles = parseMultiValues(itemProps?.titles, nlGroups, "Group");
      // Calculate total items across all groups for parseMultiValues
      const groupItemCounts = Array.from({ length: nlGroups }, (_, gi) =>
        Math.min(Math.max(parseInt(itemProps?.[`group${gi}_items`] ?? "2", 10), 1), 5),
      );
      const totalItems = groupItemCounts.reduce((a, b) => a + b, 0);
      const nlItemTexts = parseMultiValues(itemProps?.itemTexts, totalItems, "Item");

      let itemOffset = 0;
      return (
        <NavList size={nlSize} aria-label="Nav">
          {groupItemCounts.map((gCount, gi) => {
            const groupStart = itemOffset;
            itemOffset += gCount;
            const groupKey = nlTitles[gi] ? `nl-group-${nlTitles[gi]}` : `nl-group-pos-${groupStart}`;
            return (
              <NavList.Group key={groupKey} {...(nlWithTitle ? { title: nlTitles[gi] } : {})}>
                {Array.from({ length: gCount }, (_, ii) => ii).map((ii) => {
                  const idx = groupStart + ii;
                  return (
                    <NavList.Item key={`nl-item-${idx}`} href="#">
                      {nlItemTexts[idx] || `Item ${idx + 1}`}
                    </NavList.Item>
                  );
                })}
              </NavList.Group>
            );
          })}
        </NavList>
      );
    }

    case "SideNavigation": {
      const snWithGroup = itemProps?.withGroup === "true";
      const snWithTitle = snWithGroup && itemProps?.withGroupTitle === "true";
      const snGroups = Math.min(Math.max(parseInt(itemProps?.groups ?? "2", 10), 2), 5);

      if (!snWithGroup) {
        const snLabels = parseMultiValues(itemProps?.labels, 3, "Item");
        const sideNavigationLabelCounts = new Map<string, number>();
        return (
          <SideNavigation aria-label="Side Navigation">
            <SideNavigation.Group>
              {snLabels.map((label) => {
                const IconCompRaw = getAegisIconComponent("LfPlusLarge");
                if (!IconCompRaw) return null;
                const IconComp = IconCompRaw;
                const occurrence = sideNavigationLabelCounts.get(label) ?? 0;
                sideNavigationLabelCounts.set(label, occurrence + 1);
                return (
                  <SideNavigation.Item key={`sn-item-${label}-${occurrence}`} icon={IconComp} href="#">
                    {label}
                  </SideNavigation.Item>
                );
              })}
            </SideNavigation.Group>
          </SideNavigation>
        );
      }

      const snTitles = parseMultiValues(itemProps?.titles, snGroups, "Group");
      const groupItemCounts = Array.from({ length: snGroups }, (_, gi) =>
        Math.min(Math.max(parseInt(itemProps?.[`group${gi}_items`] ?? "1", 10), 1), 5),
      );

      return (
        <SideNavigation aria-label="Side Navigation">
          {groupItemCounts.map((gCount, gi) => {
            const gLabels = parseMultiValues(itemProps?.[`group${gi}_labels`], gCount, "Item");
            const snGroupKey = snTitles[gi] ? `sn-group-${snTitles[gi]}` : `sn-group-cfg-${gi}-${gCount}`;
            return (
              <SideNavigation.Group key={snGroupKey} {...(snWithTitle ? { title: snTitles[gi] } : {})}>
                {Array.from({ length: gCount }, (_, ii) => ii).map((ii) => {
                  const iconName = itemProps?.[`group${gi}_icon${ii}`] ?? "LfPlusLarge";
                  const IconComp =
                    getAegisIconComponent(iconName) ?? getAegisIconComponent("LfPlusLarge") ?? (() => null);
                  return (
                    <SideNavigation.Item key={`${snGroupKey}-item-${ii}-${gLabels[ii]}`} icon={IconComp} href="#">
                      {gLabels[ii]}
                    </SideNavigation.Item>
                  );
                })}
              </SideNavigation.Group>
            );
          })}
        </SideNavigation>
      );
    }

    case "OrderedList": {
      const toArr = (raw: string) => parseMultiValues(raw, raw.split(",").length, "Item");
      const d1 = itemProps?.depth1 === "true";
      const d2 = itemProps?.depth2 === "true";
      const d3 = itemProps?.depth3 === "true";
      const d4 = itemProps?.depth4 === "true";
      const l0 = toArr(itemProps?.items ?? "AAA,BBB,CCC");
      const l1 = d1 ? toArr(itemProps?.items1 ?? "AAA,BBB,CCC") : [];
      const l2 = d2 ? toArr(itemProps?.items2 ?? "AAA,BBB,CCC") : [];
      const l3 = d3 ? toArr(itemProps?.items3 ?? "AAA,BBB,CCC") : [];
      const l4 = d4 ? toArr(itemProps?.items4 ?? "AAA,BBB,CCC") : [];

      // Build from deepest level outward; sub-list goes inside the last item of parent
      const wrapOL = (items: string[], child: React.ReactNode): React.ReactNode => (
        <OrderedList>
          {items.slice(0, -1).map((t) => (
            <OrderedList.Item key={t}>{t}</OrderedList.Item>
          ))}
          {items.length > 0 && (
            <OrderedList.Item key={items[items.length - 1]}>
              {items[items.length - 1]}
              {child}
            </OrderedList.Item>
          )}
        </OrderedList>
      );

      let inner: React.ReactNode = d4 ? (
        <OrderedList>
          {l4.map((t) => (
            <OrderedList.Item key={t}>{t}</OrderedList.Item>
          ))}
        </OrderedList>
      ) : null;
      if (d3) inner = wrapOL(l3, inner);
      if (d2) inner = wrapOL(l2, inner);
      if (d1) inner = wrapOL(l1, inner);
      return wrapOL(l0, inner) as React.ReactElement;
    }

    case "UnorderedList": {
      const toArr = (raw: string) => parseMultiValues(raw, raw.split(",").length, "Item");
      const d1 = itemProps?.depth1 === "true";
      const d2 = itemProps?.depth2 === "true";
      const d3 = itemProps?.depth3 === "true";
      const d4 = itemProps?.depth4 === "true";
      const l0 = toArr(itemProps?.items ?? "AAA,BBB,CCC");
      const l1 = d1 ? toArr(itemProps?.items1 ?? "AAA,BBB,CCC") : [];
      const l2 = d2 ? toArr(itemProps?.items2 ?? "AAA,BBB,CCC") : [];
      const l3 = d3 ? toArr(itemProps?.items3 ?? "AAA,BBB,CCC") : [];
      const l4 = d4 ? toArr(itemProps?.items4 ?? "AAA,BBB,CCC") : [];

      const wrapUL = (items: string[], child: React.ReactNode): React.ReactNode => (
        <UnorderedList>
          {items.slice(0, -1).map((t) => (
            <UnorderedList.Item key={t}>{t}</UnorderedList.Item>
          ))}
          {items.length > 0 && (
            <UnorderedList.Item key={items[items.length - 1]}>
              {items[items.length - 1]}
              {child}
            </UnorderedList.Item>
          )}
        </UnorderedList>
      );

      let inner: React.ReactNode = d4 ? (
        <UnorderedList>
          {l4.map((t) => (
            <UnorderedList.Item key={t}>{t}</UnorderedList.Item>
          ))}
        </UnorderedList>
      ) : null;
      if (d3) inner = wrapUL(l3, inner);
      if (d2) inner = wrapUL(l2, inner);
      if (d1) inner = wrapUL(l1, inner);
      return wrapUL(l0, inner) as React.ReactElement;
    }

    case "Pagination":
      return <Pagination totalCount={100} defaultPage={3} />;

    case "Radio":
      return (
        <RadioGroup defaultValue="1">
          <Radio value="1">Sample radio option</Radio>
        </RadioGroup>
      );

    case "RadioCard": {
      const rcIsCard = (itemProps?.withRadioCard ?? "true") === "true";
      const COUNT = Math.min(Math.max(parseInt(itemProps?.items ?? "3", 10) || 2, 2), 10);
      const rcTitle = itemProps?.title === "true" ? itemProps?.titleText || "Title" : undefined;

      if (rcIsCard) {
        // biome-ignore lint/suspicious/noExplicitAny: RadioCard variant prop accepts dynamic string values not fully typed
        const rcVariant = (itemProps?.variant ?? "plain") as any;
        // biome-ignore lint/suspicious/noExplicitAny: RadioCard size prop accepts dynamic string values not fully typed
        const rcSize = (itemProps?.sizeCard ?? "large") as any;
        const LABEL_COUNT = Math.min(Math.max(parseInt(itemProps?.labelItems ?? "1", 10) || 1, 1), 5);
        const FALLBACKS = ["label.medium", "body.medium", "caption.small", "data.medium", "label.small"];

        const rowStyleProps = (rowN: number): Record<string, string> => {
          const prefix = `label${rowN}Style_`;
          return Object.fromEntries(
            Object.entries(itemProps ?? {})
              .filter(([k]) => k.startsWith(prefix))
              .map(([k, v]) => [k.slice(prefix.length), v]),
          );
        };

        const rowValues = Array.from({ length: LABEL_COUNT }, (_, rowIdx) => {
          const rowN = rowIdx + 1;
          const allRowsVals = parseMultiValues(itemProps?.[`label${rowN}`], COUNT, `Label ${rowN}`);
          return Array.from({ length: COUNT }, (_, cardIdx) => {
            const perRowKey = `label${rowN}_row${cardIdx + 1}`;
            return itemProps?.[perRowKey] || allRowsVals[cardIdx];
          });
        });

        return (
          <RadioGroup title={rcTitle} defaultValue="a">
            {Array.from({ length: COUNT }, (_, i) => {
              const val = String.fromCharCode(97 + i);
              return (
                <RadioCard key={val} value={val} variant={rcVariant} size={rcSize}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {Array.from({ length: LABEL_COUNT }, (_, rowIdx) => rowIdx).map((rowIdx) => {
                      const rowN = rowIdx + 1;
                      const label = rowValues[rowIdx][i] || `Label ${rowN}`;
                      const styleP = rowStyleProps(rowN);
                      // biome-ignore lint/suspicious/noExplicitAny: Text variant prop accepts dynamic values not fully typed
                      const rcCardVariant = resolveTypoVariant(styleP, FALLBACKS[rowIdx] ?? "body.medium") as any;
                      const rcCardRawColor =
                        Object.keys(styleP).length === 0 && rowIdx > 0
                          ? "subtle"
                          : resolveTypoColor(styleP, FALLBACKS[rowIdx] ?? "body.medium");
                      // biome-ignore lint/suspicious/noExplicitAny: Text color prop accepts dynamic values not fully typed
                      const rcCardColor = rcCardRawColor as any;
                      return (
                        <Text key={`rccard-row-${rowIdx}`} variant={rcCardVariant} color={rcCardColor}>
                          {label}
                        </Text>
                      );
                    })}
                  </div>
                </RadioCard>
              );
            })}
          </RadioGroup>
        );
      }

      // biome-ignore lint/suspicious/noExplicitAny: RadioGroup size prop accepts dynamic string values not fully typed
      const rcNormalSize = (itemProps?.size ?? "medium") as any;
      // biome-ignore lint/suspicious/noExplicitAny: RadioGroup orientation prop accepts dynamic string values not fully typed
      const rcOrientation = (itemProps?.orientation ?? "vertical") as any;
      const optLabels = parseMultiValues(itemProps?.text, COUNT, "");
      return (
        <RadioGroup size={rcNormalSize} orientation={rcOrientation} title={rcTitle} defaultValue="a">
          {Array.from({ length: COUNT }, (_, i) => {
            const val = String.fromCharCode(97 + i);
            const label = optLabels[i] || `Option ${String.fromCharCode(65 + i)}`;
            return (
              <Radio key={val} value={val}>
                {label}
              </Radio>
            );
          })}
        </RadioGroup>
      );
    }

    case "RadioGroup":
      return <RadioGroupRenderer itemProps={itemProps} />;

    case "RangeCalendar": {
      const resolveDate = (raw: string | undefined): Date | undefined => {
        if (!raw) return undefined;
        return raw === "today" ? new Date() : new Date(raw);
      };
      const rcMinValue = itemProps?.minValue === "true" ? resolveDate(itemProps?.minValueDate) : undefined;
      const rcMaxValue = itemProps?.maxValue === "true" ? resolveDate(itemProps?.maxValueDate) : undefined;
      return (
        <RangeCalendar
          {...(rcMinValue ? { minValue: rcMinValue } : {})}
          {...(rcMaxValue ? { maxValue: rcMaxValue } : {})}
        />
      );
    }

    case "RangeDateField":
      return <RangeDateFieldRenderer itemProps={itemProps} />;

    case "RangeDatePicker":
      return <RangeDatePickerRenderer itemProps={itemProps} />;

    case "RangeTimeField":
      return <RangeTimeFieldRenderer itemProps={itemProps} />;

    case "RangeTimePicker":
      return <RangeTimePickerRenderer itemProps={itemProps} />;

    case "Search":
      return <SearchRenderer itemProps={itemProps} />;

    case "SegmentedControl": {
      const scCount = Math.min(Math.max(parseInt(itemProps?.items ?? "3", 10), 2), 10);
      const scLabels = parseMultiValues(itemProps?.label ?? "", scCount);
      const scVariant = (itemProps?.variant ?? "plain") as "plain" | "solid";
      const scSize = (itemProps?.size ?? "medium") as "medium" | "small" | "xSmall";
      const scWeight = (itemProps?.weight ?? "normal") as "normal" | "bold";
      return (
        <SegmentedControl defaultIndex={0} variant={scVariant} size={scSize} weight={scWeight}>
          {Array.from({ length: scCount }, (_, i) => i).map((i) => (
            <SegmentedControl.Button key={`sc-btn-${i}`}>
              {scLabels[i] || `Option ${String.fromCharCode(65 + i)}`}
            </SegmentedControl.Button>
          ))}
        </SegmentedControl>
      );
    }

    case "Select":
      return <SelectRenderer itemProps={itemProps} />;

    case "Skeleton":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      );

    case "StatusLabel": {
      // biome-ignore lint/suspicious/noExplicitAny: StatusLabel size prop accepts dynamic string values not fully typed
      const slSize = (itemProps?.size as any) ?? "medium";
      // biome-ignore lint/suspicious/noExplicitAny: StatusLabel color prop accepts dynamic string values not fully typed
      const slColor = (itemProps?.color as any) ?? "neutral";
      // biome-ignore lint/suspicious/noExplicitAny: StatusLabel variant prop accepts dynamic string values not fully typed
      const slVariant = (itemProps?.variant as any) ?? "outline";
      return (
        <StatusLabel size={slSize} color={slColor} variant={slVariant}>
          {itemProps?.label || "Status"}
        </StatusLabel>
      );
    }

    case "Stepper": {
      const stCount = Math.min(Math.max(parseInt(itemProps?.items ?? "3", 10), 2), 10);
      const stLabels = parseMultiValues(itemProps?.label ?? "", stCount);
      const stOrientation = (itemProps?.orientation ?? "horizontal") as "horizontal" | "vertical";
      const stSize = (itemProps?.size ?? "medium") as "medium" | "small";
      const stReadOnly = itemProps?.readOnly === "true";
      const stSubContent = itemProps?.subContent === "true";
      return (
        <Stepper defaultIndex={0} orientation={stOrientation} size={stSize} readOnly={stReadOnly}>
          {Array.from({ length: stCount }, (_, i) => i).map((i) => (
            <Stepper.Item key={`step-${i}`} title={stLabels[i] || `Step ${i + 1}`}>
              {stSubContent ? `Content ${i + 1}` : undefined}
            </Stepper.Item>
          ))}
        </Stepper>
      );
    }

    case "Switch": {
      const swSize = (itemProps?.size ?? "small") as "small" | "medium";
      const swColor = (itemProps?.color ?? "information") as "neutral" | "information";
      const swLabelPosition = (itemProps?.labelPosition ?? "end") as "start" | "end";
      const swLabel = itemProps?.label ?? "Toggle Option";
      return (
        <Switch defaultChecked size={swSize} color={swColor} labelPosition={swLabelPosition}>
          {swLabel}
        </Switch>
      );
    }

    case "Table":
      return (
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell as="th">Name</Table.Cell>
              <Table.Cell as="th">Value</Table.Cell>
              <Table.Cell as="th">Status</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Sample A</Table.Cell>
              <Table.Cell>¥10,000</Table.Cell>
              <Table.Cell>Active</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Sample B</Table.Cell>
              <Table.Cell>¥20,000</Table.Cell>
              <Table.Cell>Inactive</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Sample C</Table.Cell>
              <Table.Cell>¥30,000</Table.Cell>
              <Table.Cell>Active</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      );

    case "Tabs": {
      const tabCount = Math.min(Math.max(parseInt(itemProps?.items ?? "3", 10), 2), 10);
      const actualCount = tabCount;
      const tabSize = (itemProps?.size ?? "large") as "large" | "medium" | "small";
      const tabPosition = (itemProps?.position ?? "top") as "top" | "start" | "end";
      // biome-ignore lint/suspicious/noExplicitAny: Tab.List width prop accepts dynamic string values not fully typed
      const listWidth = (itemProps?.listWidth ?? "medium") as any;
      const bordered = itemProps?.listBordered === "true";
      const tabWidthFull = itemProps?.tabWidth === "true";
      const withLeading = itemProps?.withTabLeading === "true";
      const withTrailing = itemProps?.withTabTrailing === "true";
      const tabLabels = parseMultiValues(itemProps?.label ?? "", actualCount, "Tab");

      const getTabLeading = (i: number): React.ReactNode => {
        if (!withLeading) return undefined;
        const idx = i + 1;
        const type = itemProps?.[`leadingType_row${idx}`] ?? itemProps?.leadingType ?? "Icon";
        if (type === "Icon") {
          const iconKey = itemProps?.[`leadingIcon_row${idx}`] ?? itemProps?.leadingIcon ?? "LfPlusLarge";
          const LeadingIcon = getAegisIconComponent(iconKey);
          return (
            <Icon>
              <LeadingIcon />
            </Icon>
          );
        }
        if (type === "Badge") {
          const colorRaw = itemProps?.[`leadingBadgeColor_row${idx}`] ?? itemProps?.leadingBadgeColor ?? "information";
          // biome-ignore lint/suspicious/noExplicitAny: Badge color prop accepts dynamic string values not fully typed
          const color = colorRaw as any;
          return <Badge color={color} />;
        }
        return undefined;
      };

      const getTabTrailing = (i: number): React.ReactNode => {
        if (!withTrailing) return undefined;
        const idx = i + 1;
        const type = itemProps?.[`trailingType_row${idx}`] ?? itemProps?.trailingType ?? "Badge";
        if (type === "Badge") {
          const trailingColorRaw =
            itemProps?.[`trailingBadgeColor_row${idx}`] ?? itemProps?.trailingBadgeColor ?? "information";
          // biome-ignore lint/suspicious/noExplicitAny: Badge color prop accepts dynamic string values not fully typed
          const color = trailingColorRaw as any;
          return <Badge color={color} />;
        }
        if (type === "Text") {
          const text = itemProps?.[`trailingText_row${idx}`] ?? itemProps?.trailingText ?? "New";
          return (
            <Text variant="component.small" color="subtle">
              {text}
            </Text>
          );
        }
        return undefined;
      };

      return (
        <Tab.Group defaultIndex={0} size={tabSize} position={tabPosition}>
          <Tab.List {...(tabPosition !== "top" ? { width: listWidth } : {})} bordered={bordered}>
            {Array.from({ length: actualCount }, (_, i) => i).map((i) => {
              const label = itemProps?.[`label_row${i + 1}`] ?? tabLabels[i] ?? `Tab ${i + 1}`;
              const leading = getTabLeading(i);
              const trailing = getTabTrailing(i);
              return (
                <Tab
                  key={`tab-${i}`}
                  data-tab-index={i}
                  {...(tabWidthFull ? { width: "full" } : {})}
                  {...(leading ? { leading } : {})}
                  {...(trailing ? { trailing } : {})}
                >
                  {label}
                </Tab>
              );
            })}
          </Tab.List>
          <Tab.Panels>
            {Array.from({ length: actualCount }, (_, i) => i).map((i) => {
              return <Tab.Panel key={`tab-panel-${i}`}></Tab.Panel>;
            })}
          </Tab.Panels>
        </Tab.Group>
      );
    }

    case "Tag": {
      // biome-ignore lint/suspicious/noExplicitAny: Tag color prop accepts dynamic string values not fully typed
      const tagCaseColor = (itemProps?.color as any) ?? "neutral";
      // biome-ignore lint/suspicious/noExplicitAny: Tag variant prop accepts dynamic string values not fully typed
      const tagCaseVariant = (itemProps?.variant as any) ?? "outline";
      return (
        <Tag color={tagCaseColor} variant={tagCaseVariant}>
          {itemProps?.label || "Tag"}
        </Tag>
      );
    }

    case "TagGroup": {
      const tgCount = Math.min(Math.max(parseInt(itemProps?.tgItems ?? "3", 10) || 1, 1), 30);
      // biome-ignore lint/suspicious/noExplicitAny: Tag size prop accepts dynamic string values not fully typed
      const tgSize = (itemProps?.size ?? "small") as any;
      // biome-ignore lint/suspicious/noExplicitAny: Tag variant prop accepts dynamic string values not fully typed
      const tgVariant = (itemProps?.tagVariant ?? "fill") as any;
      const tgWithLabel = itemProps?.withLabel === "true";
      const tgLabels = parseMultiValues(itemProps?.tagLabels, tgCount, "Tag");
      // biome-ignore lint/suspicious/noExplicitAny: Tag color prop accepts dynamic string values not fully typed
      const getTagColor = (n: number) => (itemProps?.[`tagColor${n}`] ?? "neutral") as any;

      return (
        <TagGroup>
          {tgWithLabel && <TagGroupLabel>{itemProps?.groupLabel || "Label"}</TagGroupLabel>}
          {Array.from({ length: tgCount }, (_, i) => i).map((i) => {
            const n = i + 1;
            return (
              <Tag key={`tg-${i}`} size={tgSize} variant={tgVariant} color={getTagColor(n)}>
                {tgWithLabel ? (
                  <TagLink asChild>
                    <button type="button">{tgLabels[i]}</button>
                  </TagLink>
                ) : (
                  tgLabels[i]
                )}
              </Tag>
            );
          })}
        </TagGroup>
      );
    }

    case "TagInput":
      return <TagInputRenderer itemProps={itemProps} />;

    case "TagPicker":
      return <TagPickerRenderer itemProps={itemProps} />;

    case "Text": {
      const textType = itemProps?.textType ?? "body";

      // Resolve size from the per-textType key
      const sizeKeyMap: Record<string, string> = {
        title: "sizeTitle",
        "document title": "sizeDocTitle",
        label: "sizeLabel",
        body: "sizeBody",
        "document body": "sizeDocBody",
        caption: "sizeCaption",
        data: "sizeData",
      };
      const sizeDefaults: Record<string, string> = { caption: "small" };
      const size = itemProps?.[sizeKeyMap[textType] ?? "sizeBody"] ?? sizeDefaults[textType] ?? "medium";
      const font = itemProps?.font ?? "sans";
      const weight = itemProps?.weight ?? "normal";
      const weightSuffix = weight === "bold" ? ".bold" : "";

      let variant: string;
      switch (textType) {
        case "title":
          variant = `title.${size}`;
          break;
        case "document title":
          variant = `document.title.${size}`;
          break;
        case "label":
          variant = `label.${size}${weightSuffix}`;
          break;
        case "document body":
          variant = `document.body.${font}.${size}${weightSuffix}`;
          break;
        case "caption":
          variant = `caption.${size}`;
          break;
        case "data":
          variant = `data.${size}${weightSuffix}`;
          break;
        default:
          variant = `body.${size}${weightSuffix}`;
      }

      // Color — title is always "bold" except sizeTitle=x3Small which may be "subtle"
      let color: string;
      if (textType === "title") {
        color = size === "x3Small" ? (itemProps?.colorTitleX3Small ?? "bold") : "bold";
      } else if (textType === "caption") {
        color = itemProps?.colorCaption ?? "default";
      } else {
        color = itemProps?.color ?? "default";
      }

      const inputType = textType === "title" ? "Single-line" : (itemProps?.inputType ?? "Single-line");
      const content =
        inputType === "Multi-line"
          ? itemProps?.textArea || "Sample text content. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          : itemProps?.text || "Sample text content.";
      const asEl =
        textType === "title" ? ("h2" as const) : inputType === "Multi-line" ? ("p" as const) : ("span" as const);

      // biome-ignore lint/suspicious/noExplicitAny: Text variant prop accepts dynamic string values not fully typed
      const textVariantAny = variant as any;
      // biome-ignore lint/suspicious/noExplicitAny: Text color prop accepts dynamic string values not fully typed
      const textColorAny = color as any;
      return (
        <Text
          variant={textVariantAny}
          as={asEl}
          color={textColorAny}
          {...(inputType === "Multi-line" ? { whiteSpace: "pre-line" } : {})}
        >
          {content}
        </Text>
      );
    }

    case "TextField":
      return <TextFieldRenderer itemProps={itemProps} />;

    case "Textarea":
      return <TextareaRenderer itemProps={itemProps} />;

    case "TimeField":
      return <TimeFieldRenderer itemProps={itemProps} />;

    case "TimePicker":
      return <TimePickerRenderer itemProps={itemProps} />;

    case "Timeline": {
      const itemCount = Math.min(Math.max(parseInt(itemProps?.items ?? "4", 10), 2), 10);
      const activeItem = Math.min(Math.max(parseInt(itemProps?.activeItem ?? "3", 10), 1), itemCount);
      const defaultTagLabelMap = ["V0", "V1", "V1.2", "V2"];
      const tagLabels = itemProps?.tagLabels
        ? parseMultiValues(itemProps.tagLabels, itemCount, "V")
        : Array.from({ length: itemCount }, (_, i) => defaultTagLabelMap[i] ?? `V${i}`);
      return (
        <Timeline>
          {Array.from({ length: itemCount }, (_, index) => index).map((index) => (
            <TimelineItem
              key={`timeline-${index}`}
              {...(index + 1 === activeItem ? { "aria-current": "step" as const } : {})}
              onClick={() => onUpdate?.({ ...itemProps, activeItem: String(index + 1) })}
              style={{ cursor: "pointer" }}
            >
              <TimelinePoint>
                <Tag>{tagLabels[index] || `V${index}`}</Tag>
              </TimelinePoint>
              <TimelineContent>
                <Text variant="body.small" color="subtle">
                  Content can be anything
                </Text>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      );
    }

    case "Toolbar": {
      const tbOrientation = (itemProps?.orientation ?? "horizontal") as "horizontal" | "vertical";
      const tbGroups = Math.min(Math.max(parseInt(itemProps?.groups ?? "2", 10), 1), 5);

      return (
        <Toolbar orientation={tbOrientation}>
          {Array.from({ length: tbGroups }, (_, gi) => gi).map((gi) => {
            const groupPrefix = `group${gi}_`;

            return (
              <React.Fragment key={`tb-group-${gi}`}>
                {gi > 0 && <ToolbarSeparator />}
                <ToolbarGroup>
                  {Array.from(
                    { length: Math.min(Math.max(parseInt(itemProps?.[`${groupPrefix}items`] ?? "3", 10), 1), 5) },
                    (_, ii) => ii,
                  ).map((ii) => {
                    const itemPrefix = `${groupPrefix}item${ii}_`;
                    const itemType = itemProps?.[`${itemPrefix}type`] ?? "IconButton";
                    const cfgPrefix = `${itemPrefix}cfg_`;
                    const sp = Object.fromEntries(
                      Object.entries(itemProps ?? {})
                        .filter(([k]) => k.startsWith(cfgPrefix))
                        .map(([k, v]) => [k.slice(cfgPrefix.length), v]),
                    );

                    if (itemType === "Button") {
                      const btnVariantRaw = sp.variant ?? "plain";
                      const isWGL = btnVariantRaw === "Weight(gutterless)";
                      // biome-ignore lint/suspicious/noExplicitAny: Button variant prop accepts dynamic string values not fully typed
                      const btnVariant = (isWGL ? "gutterless" : btnVariantRaw) as any;
                      // biome-ignore lint/suspicious/noExplicitAny: Button size prop accepts dynamic string values not fully typed
                      const btnSize = (sp.size as any) ?? "medium";
                      // biome-ignore lint/suspicious/noExplicitAny: Button color prop accepts dynamic string values not fully typed
                      const btnColor = (sp.color as any) ?? "neutral";
                      const btnLoading = sp.loading === "true";
                      const btnLabel = sp.label || "Button";
                      const btnHasLeading = !btnLoading && sp.leading === "true";
                      const btnHasTrailing = !btnLoading && sp.trailing === "true";

                      const buildSlot = (side: "leading" | "trailing"): React.ReactNode => {
                        const isL = side === "leading";
                        if (!(isL ? btnHasLeading : btnHasTrailing)) return undefined;
                        const slotType = (isL ? sp.leadingType : sp.trailingType) ?? "Icon";
                        if (slotType === "Icon") {
                          const SlotIcon = getAegisIconComponent(
                            sp[isL ? "leadingIcon" : "trailingIcon"] || "LfPlusLarge",
                          );
                          return (
                            <Icon>
                              <SlotIcon />
                            </Icon>
                          );
                        }
                        const badgeColorRawStr = sp[isL ? "leadingBadgeColor" : "trailingBadgeColor"] ?? "information";
                        // biome-ignore lint/suspicious/noExplicitAny: Badge color prop accepts dynamic string values not fully typed
                        const badgeColor = badgeColorRawStr as any;
                        const badgeType = sp[isL ? "leadingBadge" : "trailingBadge"] ?? "normal";
                        let count: number | undefined;
                        if (badgeType === "count") {
                          const parsed = parseInt(sp[isL ? "leadingBadgeCount" : "trailingBadgeCount"] ?? "3", 10);
                          count = Number.isNaN(parsed) ? 3 : parsed;
                        }
                        return <Badge color={badgeColor} count={count} />;
                      };

                      // biome-ignore lint/suspicious/noExplicitAny: Button weight prop accepts dynamic string values not fully typed
                      const btnWeightPropFc = isWGL ? { weight: "normal" as any } : {};
                      return (
                        <Button
                          key={`tb-btn-${gi}-${ii}`}
                          variant={btnVariant}
                          {...btnWeightPropFc}
                          size={btnSize}
                          color={btnColor}
                          {...(btnLoading ? { loading: true } : {})}
                          leading={buildSlot("leading")}
                          trailing={buildSlot("trailing")}
                        >
                          {btnLabel}
                        </Button>
                      );
                    }

                    // IconButton (default)
                    // biome-ignore lint/suspicious/noExplicitAny: IconButton variant prop accepts dynamic string values not fully typed
                    const ibVariant = (sp.variant as any) ?? "plain";
                    // biome-ignore lint/suspicious/noExplicitAny: IconButton size prop accepts dynamic string values not fully typed
                    const ibSize = (sp.size as any) ?? "medium";
                    // biome-ignore lint/suspicious/noExplicitAny: IconButton color prop accepts dynamic string values not fully typed
                    const ibColor = (sp.color as any) ?? "neutral";
                    const ibLoading = sp.loading === "true";
                    const IbIcon = getAegisIconComponent(sp.icon || "LfPlusLarge");
                    return renderTooltipIconButton(
                      `Button ${gi * 10 + ii + 1}`,
                      <Icon>
                        <IbIcon />
                      </Icon>,
                      {
                        key: `tb-icon-${gi}-${ii}`,
                        variant: ibVariant,
                        size: ibSize,
                        color: ibColor,
                        ...(ibLoading ? { loading: true } : {}),
                        "aria-label": `Button ${gi * 10 + ii + 1}`,
                      },
                    );
                  })}
                </ToolbarGroup>
              </React.Fragment>
            );
          })}
        </Toolbar>
      );
    }

    case "Tree":
      return <TreeRenderer itemProps={itemProps} />;

    default:
      return null;
  }
};
