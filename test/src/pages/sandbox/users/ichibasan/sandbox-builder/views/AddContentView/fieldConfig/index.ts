import type { ComponentKey } from "../types";
import { AccordionConfig } from "./Accordion";
import { ActionListConfig } from "./ActionList";
import { AvatarConfig } from "./Avatar";
import { AvatarGroupConfig } from "./AvatarGroup";
import { BannerConfig } from "./Banner";
import { BlockquoteConfig } from "./Blockquote";
import { BreadcrumbConfig } from "./Breadcrumb";
import { ButtonConfig } from "./Button";
import { ButtonGroupConfig } from "./ButtonGroup";
import type { FieldConfig } from "./base";
import { CalendarConfig } from "./Calendar";
import { CardConfig } from "./Card";
import { CheckboxConfig } from "./Checkbox";
import { CheckboxCardConfig } from "./CheckboxCard";
import { CheckboxGroupConfig } from "./CheckboxGroup";
import { CodeConfig } from "./Code";
import { CodeBlockConfig } from "./CodeBlock";
import { ComboboxConfig } from "./Combobox";
import { ContentHeaderConfig } from "./ContentHeader";
import { DataTableConfig } from "./DataTable";
import { DateFieldConfig } from "./DateField";
import { DatePickerConfig } from "./DatePicker";
import { DescriptionListConfig } from "./DescriptionList";
import { EmptyStateConfig } from "./EmptyState";
import { FileDropConfig } from "./FileDrop";
import { FormConfig } from "./Form";
import { FormControlConfig } from "./FormControl";
import { IconButtonConfig } from "./IconButton";
import { LinkConfig } from "./Link";
import { MarkConfig } from "./Mark";
import { NavListConfig } from "./NavList";
import { OrderedListConfig } from "./OrderedList";
import { RadioCardConfig } from "./RadioCard";
import { RadioGroupConfig } from "./RadioGroup";
import { RangeCalendarConfig } from "./RangeCalendar";
import { RangeDateFieldConfig } from "./RangeDateField";
import { RangeDatePickerConfig } from "./RangeDatePicker";
import { RangeTimeFieldConfig } from "./RangeTimeField";
import { RangeTimePickerConfig } from "./RangeTimePicker";
import { SearchConfig } from "./Search";
import { SegmentedControlConfig } from "./SegmentedControl";
import { SelectConfig } from "./Select";
import { SideNavigationConfig } from "./SideNavigation";
import { StatusLabelConfig } from "./StatusLabel";
import { StepperConfig } from "./Stepper";
import { SwitchConfig } from "./Switch";
import { TabsConfig } from "./Tabs";
import { TagConfig } from "./Tag";
import { TagGroupConfig } from "./TagGroup";
import { TagInputConfig } from "./TagInput";
import { TagPickerConfig } from "./TagPicker";
import { TextConfig } from "./Text";
import { TextareaConfig } from "./Textarea";
import { TextFieldConfig } from "./TextField";
import { TimeFieldConfig } from "./TimeField";
import { TimelineConfig } from "./Timeline";
import { TimePickerConfig } from "./TimePicker";
import { ToolbarConfig } from "./Toolbar";
import { TreeConfig } from "./Tree";
import { UnorderedListConfig } from "./UnorderedList";

export { STORYBOOK_URLS } from "./storybook";

export type { FieldConfig };

/**
 * Popover の幅をコンポーネントごとに上書き。
 * 未指定のコンポーネントは ItemSettingsPopover がデフォルト ("auto") を使用。
 * 利用可能なトークン例:
 *   var(--aegis-layout-width-x4Small) = 320px
 *   var(--aegis-layout-width-x3Small) = 400px
 */
export const POPOVER_WIDTHS: Partial<Record<ComponentKey, string>> = {
  ActionList: "var(--aegis-layout-width-x4Small)",
  Button: "var(--aegis-layout-width-x4Small)",
  Calendar: "var(--aegis-layout-width-x4Small)",
  Card: "var(--aegis-layout-width-x4Small)",
  Checkbox: "var(--aegis-layout-width-x4Small)",
  CheckboxCard: "var(--aegis-layout-width-x4Small)",
  CheckboxGroup: "var(--aegis-layout-width-x4Small)",
  RadioCard: "var(--aegis-layout-width-x4Small)",
  RadioGroup: "var(--aegis-layout-width-x4Small)",
  Code: "var(--aegis-layout-width-x5Small)",
  CodeBlock: "var(--aegis-layout-width-x5Small)",
  Combobox: "var(--aegis-layout-width-x4Small)",
  ContentHeader: "var(--aegis-layout-width-x4Small)",
  DateField: "var(--aegis-layout-width-x4Small)",
  DatePicker: "var(--aegis-layout-width-x4Small)",
  RangeCalendar: "var(--aegis-layout-width-x4Small)",
  RangeDateField: "var(--aegis-layout-width-x4Small)",
  RangeDatePicker: "var(--aegis-layout-width-x4Small)",
  RangeTimeField: "var(--aegis-layout-width-x4Small)",
  RangeTimePicker: "var(--aegis-layout-width-x4Small)",
  Search: "var(--aegis-layout-width-x4Small)",
  SegmentedControl: "var(--aegis-layout-width-x4Small)",
  TagInput: "var(--aegis-layout-width-x4Small)",
  TagPicker: "var(--aegis-layout-width-x4Small)",
  DataTable: "var(--aegis-layout-width-x4Small)",
  DescriptionList: "var(--aegis-layout-width-x4Small)",
  EmptyState: "var(--aegis-layout-width-x5Small)",
  FileDrop: "var(--aegis-layout-width-x4Small)",
  Form: "var(--aegis-layout-width-x4Small)",
  FormControl: "var(--aegis-layout-width-x4Small)",
  Link: "var(--aegis-layout-width-x5Small)",
  Mark: "var(--aegis-layout-width-x4Small)",
  OrderedList: "var(--aegis-layout-width-x4Small)",
  Select: "var(--aegis-layout-width-x4Small)",
  Stepper: "var(--aegis-layout-width-x5Small)",
  Switch: "var(--aegis-layout-width-x4Small)",
  Tabs: "var(--aegis-layout-width-x4Small)",
  TagGroup: "var(--aegis-layout-width-x4Small)",
  Text: "var(--aegis-layout-width-x4Small)",
  Textarea: "var(--aegis-layout-width-x4Small)",
  TextField: "var(--aegis-layout-width-x4Small)",
  TimeField: "var(--aegis-layout-width-x4Small)",
  TimePicker: "var(--aegis-layout-width-x4Small)",
  NavList: "var(--aegis-layout-width-x4Small)",
  SideNavigation: "var(--aegis-layout-width-x4Small)",
  Toolbar: "var(--aegis-layout-width-x4Small)",
  Tree: "var(--aegis-layout-width-x4Small)",
};

/**
 * Popover.Body の min-height をコンポーネントごとに上書き。
 * 未指定のコンポーネントはデフォルト var(--aegis-layout-width-x4Small) = 320px を使用。
 * false を指定すると min-height なし。
 *
 * 利用可能なトークン:
 *   var(--aegis-layout-width-x3Small) = 400px
 *   var(--aegis-layout-width-x4Small) = 320px
 *   var(--aegis-layout-width-x5Small) = 240px
 *   false                             = min-height なし
 */
export const POPOVER_MIN_HEIGHTS: Partial<Record<ComponentKey, string | false>> = {
  ActionList: "var(--aegis-layout-width-x3Small)",
  Avatar: "var(--aegis-layout-width-x5Small)",
  AvatarGroup: false,
  Blockquote: "var(--aegis-layout-width-x5Small)",
  Button: "var(--aegis-layout-width-x4Small)",
  ButtonGroup: false,
  Calendar: "var(--aegis-layout-width-x5Small)",
  Card: "var(--aegis-layout-width-x4Small)",
  Checkbox: "var(--aegis-layout-width-x4Small)",
  CheckboxCard: "var(--aegis-layout-width-x5Small)",
  CheckboxGroup: "var(--aegis-layout-width-x4Small)",
  RadioCard: "var(--aegis-layout-width-x5Small)",
  RadioGroup: "var(--aegis-layout-width-x4Small)",
  Code: "var(--aegis-layout-width-x5Small)",
  CodeBlock: "var(--aegis-layout-width-x5Small)",
  Combobox: "var(--aegis-layout-width-x3Small)",
  ContentHeader: "var(--aegis-layout-width-x4Small)",
  DateField: "var(--aegis-layout-width-x3Small)",
  DatePicker: "var(--aegis-layout-width-x3Small)",
  RangeCalendar: "var(--aegis-layout-width-x5Small)",
  RangeDateField: "var(--aegis-layout-width-x3Small)",
  RangeDatePicker: "var(--aegis-layout-width-x3Small)",
  RangeTimeField: "var(--aegis-layout-width-x3Small)",
  RangeTimePicker: "var(--aegis-layout-width-x3Small)",
  Search: "var(--aegis-layout-width-x3Small)",
  SegmentedControl: "var(--aegis-layout-width-x5Small)",
  TagInput: "var(--aegis-layout-width-x3Small)",
  TagPicker: "var(--aegis-layout-width-x3Small)",
  DataTable: "var(--aegis-layout-width-x3Small)",
  DescriptionList: "var(--aegis-layout-width-x4Small)",
  EmptyState: "var(--aegis-layout-width-x4Small)",
  FileDrop: "var(--aegis-layout-width-x5Small)",
  Form: "var(--aegis-layout-width-x3Small)",
  FormControl: "var(--aegis-layout-width-x3Small)",
  Link: "var(--aegis-layout-width-x4Small)",
  Mark: "var(--aegis-layout-width-x4Small)",
  OrderedList: "var(--aegis-layout-width-x4Small)",
  IconButton: false,
  StatusLabel: false,
  Tag: false,
  Select: "var(--aegis-layout-width-x3Small)",
  Stepper: "var(--aegis-layout-width-x4Small)",
  Switch: "var(--aegis-layout-width-x5Small)",
  Tabs: "var(--aegis-layout-width-x4Small)",
  TagGroup: "var(--aegis-layout-width-x4Small)",
  Text: "var(--aegis-layout-width-x4Small)",
  Textarea: "var(--aegis-layout-width-x3Small)",
  TextField: "var(--aegis-layout-width-x3Small)",
  TimeField: "var(--aegis-layout-width-x3Small)",
  TimePicker: "var(--aegis-layout-width-x3Small)",
  NavList: "var(--aegis-layout-width-x5Small)",
  SideNavigation: "var(--aegis-layout-width-x4Small)",
  Toolbar: "var(--aegis-layout-width-x3Small)",
  Tree: "var(--aegis-layout-width-x4Small)",
};

/**
 * 内側タブ（Properties / Content など）を props の状態に応じて disabled にする。
 * 戻り値は disabled にするタブ名の配列。
 *
 * [仕様]
 * - disabled になったタブが選択中の場合、ItemSettingsPopover が自動的に最初の非 disabled タブに戻す。
 * - 新規コンポーネントでタブを条件付き disabled にしたい場合はここに追加する。
 *
 * @example
 * Checkbox: (p) => p.noLabel === "true" ? ["Content"] : []
 */
export const DISABLED_INNER_TABS: Partial<Record<ComponentKey, (props: Record<string, string>) => string[]>> = {
  Checkbox: (p) => (p.noLabel === "true" ? ["Content"] : []),
  Code: () => ["Properties"],
  CodeBlock: () => ["Properties"],
};

export const COMPONENT_FIELD_CONFIG: Partial<Record<ComponentKey, FieldConfig[]>> = {
  Accordion: AccordionConfig,
  ActionList: ActionListConfig,
  Avatar: AvatarConfig,
  AvatarGroup: AvatarGroupConfig,
  Banner: BannerConfig,
  Blockquote: BlockquoteConfig,
  Breadcrumb: BreadcrumbConfig,
  Button: ButtonConfig,
  ButtonGroup: ButtonGroupConfig,
  Calendar: CalendarConfig,
  Card: CardConfig,
  Checkbox: CheckboxConfig,
  CheckboxCard: CheckboxCardConfig,
  RadioCard: RadioCardConfig,
  RadioGroup: RadioGroupConfig,
  CheckboxGroup: CheckboxGroupConfig,
  Code: CodeConfig,
  CodeBlock: CodeBlockConfig,
  Combobox: ComboboxConfig,
  ContentHeader: ContentHeaderConfig,
  DateField: DateFieldConfig,
  DatePicker: DatePickerConfig,
  RangeCalendar: RangeCalendarConfig,
  RangeDateField: RangeDateFieldConfig,
  RangeDatePicker: RangeDatePickerConfig,
  RangeTimeField: RangeTimeFieldConfig,
  RangeTimePicker: RangeTimePickerConfig,
  Search: SearchConfig,
  TagInput: TagInputConfig,
  TagPicker: TagPickerConfig,
  DataTable: DataTableConfig,
  DescriptionList: DescriptionListConfig,
  EmptyState: EmptyStateConfig,
  FileDrop: FileDropConfig,
  Form: FormConfig,
  FormControl: FormControlConfig,
  IconButton: IconButtonConfig,
  Link: LinkConfig,
  NavList: NavListConfig,
  Mark: MarkConfig,
  OrderedList: OrderedListConfig,
  UnorderedList: UnorderedListConfig,
  SegmentedControl: SegmentedControlConfig,
  Select: SelectConfig,
  StatusLabel: StatusLabelConfig,
  Stepper: StepperConfig,
  Switch: SwitchConfig,
  Tabs: TabsConfig,
  Tag: TagConfig,
  TagGroup: TagGroupConfig,
  SideNavigation: SideNavigationConfig,
  Timeline: TimelineConfig,
  Toolbar: ToolbarConfig,
  Text: TextConfig,
  Textarea: TextareaConfig,
  TextField: TextFieldConfig,
  TimeField: TimeFieldConfig,
  TimePicker: TimePickerConfig,
  Tree: TreeConfig,
};
