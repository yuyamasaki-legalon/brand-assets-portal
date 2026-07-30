var e=`import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../types/routes";

const UpdatesPage = lazy(() => import("./index").then((module) => ({ default: module.UpdatesPage })));
const AegisUpdateV2380 = lazy(() =>
  import("./aegis-releases/v2-38-0/index").then((module) => ({ default: module.AegisUpdateV2380 })),
);
const DataTableColSpan = lazy(() =>
  import("./aegis-releases/v2-38-0/datatable-colspan/index").then((module) => ({ default: module.DataTableColSpan })),
);
const DrawerMaxWidthNone = lazy(() =>
  import("./aegis-releases/v2-38-0/drawer-maxwidth-none/index").then((module) => ({
    default: module.DrawerMaxWidthNone,
  })),
);
const TreeFlickerFix = lazy(() =>
  import("./aegis-releases/v2-38-0/tree-flicker-fix/index").then((module) => ({ default: module.TreeFlickerFix })),
);
const PopoverMaxWidth = lazy(() =>
  import("./aegis-releases/v2-38-0/popover-max-width/index").then((module) => ({ default: module.PopoverMaxWidth })),
);
const NewIcons = lazy(() =>
  import("./aegis-releases/v2-38-0/new-icons/index").then((module) => ({ default: module.NewIcons })),
);
const AegisUpdateV2381 = lazy(() =>
  import("./aegis-releases/v2-38-1/index").then((module) => ({ default: module.AegisUpdateV2381 })),
);
const SnackbarSmallScale = lazy(() =>
  import("./aegis-releases/v2-38-1/snackbar-small-scale/index").then((module) => ({
    default: module.SnackbarSmallScale,
  })),
);
const AegisUpdateV2390 = lazy(() =>
  import("./aegis-releases/v2-39-0/index").then((module) => ({ default: module.AegisUpdateV2390 })),
);
const PageLayoutBleedDemo = lazy(() =>
  import("./aegis-releases/v2-39-0/pagelayout-bleed/index").then((module) => ({
    default: module.PageLayoutBleedDemo,
  })),
);
const DataTableUnpinFix = lazy(() =>
  import("./aegis-releases/v2-39-0/datatable-unpin-fix/index").then((module) => ({
    default: module.DataTableUnpinFix,
  })),
);
const AegisUpdateV2400 = lazy(() =>
  import("./aegis-releases/v2-40-0/index").then((module) => ({ default: module.AegisUpdateV2400 })),
);
const DescriptionListBorderedDemo = lazy(() =>
  import("./aegis-releases/v2-40-0/description-list-bordered/index").then((module) => ({
    default: module.DescriptionListBorderedDemo,
  })),
);
const DataTableCheckboxFix = lazy(() =>
  import("./aegis-releases/v2-40-0/datatable-checkbox-fix/index").then((module) => ({
    default: module.DataTableCheckboxFix,
  })),
);
const AegisUpdateV2410 = lazy(() =>
  import("./aegis-releases/v2-41-0/index").then((module) => ({ default: module.AegisUpdateV2410 })),
);
const StatusLabelNewColors = lazy(() =>
  import("./aegis-releases/v2-41-0/statuslabel-new-colors/index").then((module) => ({
    default: module.StatusLabelNewColors,
  })),
);
const TagActionApi = lazy(() =>
  import("./aegis-releases/v2-41-0/tag-action-api/index").then((module) => ({ default: module.TagActionApi })),
);
const DescriptionListXLargeDemo = lazy(() =>
  import("./aegis-releases/v2-41-0/description-list-xlarge/index").then((module) => ({
    default: module.DescriptionListXLargeDemo,
  })),
);
const InformationCardCenteringFix = lazy(() =>
  import("./aegis-releases/v2-41-0/informationcard-centering-fix/index").then((module) => ({
    default: module.InformationCardCenteringFix,
  })),
);
const AegisUpdateV2420 = lazy(() =>
  import("./aegis-releases/v2-42-0/index").then((module) => ({ default: module.AegisUpdateV2420 })),
);
const DataTableGlobalFilter = lazy(() =>
  import("./aegis-releases/v2-42-0/datatable-global-filter/index").then((module) => ({
    default: module.DataTableGlobalFilter,
  })),
);
const DialogWidthFull = lazy(() =>
  import("./aegis-releases/v2-42-0/dialog-width-full/index").then((module) => ({ default: module.DialogWidthFull })),
);
const DataTableRowVirtualization = lazy(() =>
  import("./aegis-releases/v2-42-0/datatable-row-virtualization/index").then((module) => ({
    default: module.DataTableRowVirtualization,
  })),
);
const DialogWidthAutoFix = lazy(() =>
  import("./aegis-releases/v2-42-0/dialog-width-auto-fix/index").then((module) => ({
    default: module.DialogWidthAutoFix,
  })),
);
const AegisUpdateV2430 = lazy(() =>
  import("./aegis-releases/v2-43-0/index").then((module) => ({ default: module.AegisUpdateV2430 })),
);
const DataTableBordered = lazy(() =>
  import("./aegis-releases/v2-43-0/datatable-bordered/index").then((module) => ({
    default: module.DataTableBordered,
  })),
);
const ButtonFill = lazy(() =>
  import("./aegis-releases/v2-43-0/button-fill/index").then((module) => ({ default: module.ButtonFill })),
);
const StepperStatus = lazy(() =>
  import("./aegis-releases/v2-43-0/stepper-status/index").then((module) => ({ default: module.StepperStatus })),
);
const ButtonGroupOrientation = lazy(() =>
  import("./aegis-releases/v2-43-0/buttongroup-orientation/index").then((module) => ({
    default: module.ButtonGroupOrientation,
  })),
);
const DataTableBadgePinFix = lazy(() =>
  import("./aegis-releases/v2-43-0/datatable-badge-pin-fix/index").then((module) => ({
    default: module.DataTableBadgePinFix,
  })),
);
const AegisUpdateV2432 = lazy(() =>
  import("./aegis-releases/v2-43-2/index").then((module) => ({ default: module.AegisUpdateV2432 })),
);
const DataTableBorderedFix = lazy(() =>
  import("./aegis-releases/v2-43-2/datatable-bordered-fix/index").then((module) => ({
    default: module.DataTableBorderedFix,
  })),
);
const AegisUpdateV2440 = lazy(() =>
  import("./aegis-releases/v2-44-0/index").then((module) => ({ default: module.AegisUpdateV2440 })),
);
const DataTableEmpty = lazy(() =>
  import("./aegis-releases/v2-44-0/datatable-empty/index").then((module) => ({ default: module.DataTableEmpty })),
);
const ButtonYellow = lazy(() =>
  import("./aegis-releases/v2-44-0/button-yellow/index").then((module) => ({ default: module.ButtonYellow })),
);
const AegisUpdateV2450 = lazy(() =>
  import("./aegis-releases/v2-45-0/index").then((module) => ({ default: module.AegisUpdateV2450 })),
);
const DrawerBottom = lazy(() =>
  import("./aegis-releases/v2-45-0/drawer-bottom/index").then((module) => ({ default: module.DrawerBottom })),
);
const TextareaImprovements = lazy(() =>
  import("./aegis-releases/v2-45-0/textarea-improvements/index").then((module) => ({
    default: module.TextareaImprovements,
  })),
);
const DataTableBadgePin = lazy(() =>
  import("./aegis-releases/v2-45-0/datatable-badge-pin/index").then((module) => ({
    default: module.DataTableBadgePin,
  })),
);
const AegisUpdateV2451 = lazy(() =>
  import("./aegis-releases/v2-45-1/index").then((module) => ({ default: module.AegisUpdateV2451 })),
);
const PortalEventBubblingFix = lazy(() =>
  import("./aegis-releases/v2-45-1/portal-event-bubbling-fix/index").then((module) => ({
    default: module.PortalEventBubblingFix,
  })),
);
const AegisUpdateV2460 = lazy(() =>
  import("./aegis-releases/v2-46-0/index").then((module) => ({ default: module.AegisUpdateV2460 })),
);
const BottomNavigationDemo = lazy(() =>
  import("./aegis-releases/v2-46-0/bottom-navigation/index").then((module) => ({
    default: module.BottomNavigationDemo,
  })),
);
const NewIconsV2460 = lazy(() =>
  import("./aegis-releases/v2-46-0/new-icons/index").then((module) => ({ default: module.NewIconsV2460 })),
);
const ActionListBordered = lazy(() =>
  import("./aegis-releases/v2-46-0/actionlist-bordered/index").then((module) => ({
    default: module.ActionListBordered,
  })),
);
const CalendarSmallScale = lazy(() =>
  import("./aegis-releases/v2-46-0/calendar-small-scale/index").then((module) => ({
    default: module.CalendarSmallScale,
  })),
);
const AegisUpdateV2470 = lazy(() =>
  import("./aegis-releases/v2-47-0/index").then((module) => ({ default: module.AegisUpdateV2470 })),
);
const TabsBaseUiDemo = lazy(() =>
  import("./aegis-releases/v2-47-0/tabs-base-ui/index").then((module) => ({
    default: module.TabsBaseUiDemo,
  })),
);
const DataTableHighlightScope = lazy(() =>
  import("./aegis-releases/v2-47-0/datatable-highlight-scope/index").then((module) => ({
    default: module.DataTableHighlightScope,
  })),
);
const TagPickerSelectionBehavior = lazy(() =>
  import("./aegis-releases/v2-47-0/tagpicker-selection-behavior/index").then((module) => ({
    default: module.TagPickerSelectionBehavior,
  })),
);
const AegisUpdateV2480 = lazy(() =>
  import("./aegis-releases/v2-48-0/index").then((module) => ({ default: module.AegisUpdateV2480 })),
);
const BannerIconDemo = lazy(() =>
  import("./aegis-releases/v2-48-0/banner-icon/index").then((module) => ({
    default: module.BannerIconDemo,
  })),
);
const SidebarResizableDemo = lazy(() =>
  import("./aegis-releases/v2-48-0/sidebar-resizable/index").then((module) => ({
    default: module.SidebarResizableDemo,
  })),
);
const NewIconsV2480 = lazy(() =>
  import("./aegis-releases/v2-48-0/new-icons/index").then((module) => ({
    default: module.NewIconsV2480,
  })),
);
const AegisUpdateV2483 = lazy(() =>
  import("./aegis-releases/v2-48-3/index").then((module) => ({ default: module.AegisUpdateV2483 })),
);
const AegisUpdateV2490 = lazy(() =>
  import("./aegis-releases/v2-49-0/index").then((module) => ({ default: module.AegisUpdateV2490 })),
);
const AegisUpdateV2500 = lazy(() =>
  import("./aegis-releases/v2-50-0/index").then((module) => ({ default: module.AegisUpdateV2500 })),
);
const AegisUpdateV2510 = lazy(() =>
  import("./aegis-releases/v2-51-0/index").then((module) => ({ default: module.AegisUpdateV2510 })),
);
const AegisUpdateV2511 = lazy(() =>
  import("./aegis-releases/v2-51-1/index").then((module) => ({ default: module.AegisUpdateV2511 })),
);
const FilterGuidanceCaptionDemo = lazy(() =>
  import("./aegis-releases/v2-51-1/filter-guidance-caption/index").then((module) => ({
    default: module.FilterGuidanceCaptionDemo,
  })),
);
const BreadcrumbIconButtonSizeDemo = lazy(() =>
  import("./aegis-releases/v2-51-1/breadcrumb-iconbutton-size/index").then((module) => ({
    default: module.BreadcrumbIconButtonSizeDemo,
  })),
);
const DataTableColumnVirtualizationDemo = lazy(() =>
  import("./aegis-releases/v2-51-0/datatable-column-virtualization/index").then((module) => ({
    default: module.DataTableColumnVirtualizationDemo,
  })),
);
const CardLinkDisabledDemo = lazy(() =>
  import("./aegis-releases/v2-51-0/cardlink-disabled/index").then((module) => ({
    default: module.CardLinkDisabledDemo,
  })),
);
const CardOutlineOpaqueDemo = lazy(() =>
  import("./aegis-releases/v2-51-0/card-outline-opaque/index").then((module) => ({
    default: module.CardOutlineOpaqueDemo,
  })),
);
const TagDashDemo = lazy(() =>
  import("./aegis-releases/v2-50-0/tag-dash/index").then((module) => ({ default: module.TagDashDemo })),
);
const CloudIconsDemo = lazy(() =>
  import("./aegis-releases/v2-50-0/cloud-icons/index").then((module) => ({ default: module.CloudIconsDemo })),
);
const SidebarSemiSmallDemo = lazy(() =>
  import("./aegis-releases/v2-49-0/sidebar-semi-small/index").then((module) => ({
    default: module.SidebarSemiSmallDemo,
  })),
);
const ShimmerTextDemo = lazy(() =>
  import("./aegis-releases/v2-49-0/shimmer-text/index").then((module) => ({
    default: module.ShimmerTextDemo,
  })),
);
const SidebarDataSlotDemo = lazy(() =>
  import("./aegis-releases/v2-48-3/sidebar-data-slot/index").then((module) => ({
    default: module.SidebarDataSlotDemo,
  })),
);
const AegisUpdateV2520 = lazy(() =>
  import("./aegis-releases/v2-52-0/index").then((module) => ({ default: module.AegisUpdateV2520 })),
);
const TextareaGhostDemo = lazy(() =>
  import("./aegis-releases/v2-52-0/textarea-ghost/index").then((module) => ({
    default: module.TextareaGhostDemo,
  })),
);
const RadioGroupPreviewDemo = lazy(() =>
  import("./aegis-releases/v2-52-0/radio-group-preview/index").then((module) => ({
    default: module.RadioGroupPreviewDemo,
  })),
);
const LinkFitContentDemo = lazy(() =>
  import("./aegis-releases/v2-52-0/link-fit-content/index").then((module) => ({
    default: module.LinkFitContentDemo,
  })),
);
const DataTableManageColumnsHideDemo = lazy(() =>
  import("./aegis-releases/v2-52-0/datatable-manage-columns-hide/index").then((module) => ({
    default: module.DataTableManageColumnsHideDemo,
  })),
);
export const routes: RouteConfig[] = [
  {
    path: "/updates",
    element: <UpdatesPage />,
  },
  {
    path: "/updates/aegis-releases/v2-38-0",
    element: <AegisUpdateV2380 />,
  },
  {
    path: "/updates/aegis-releases/v2-38-0/datatable-colspan",
    element: <DataTableColSpan />,
  },
  {
    path: "/updates/aegis-releases/v2-38-0/drawer-maxwidth-none",
    element: <DrawerMaxWidthNone />,
  },
  {
    path: "/updates/aegis-releases/v2-38-0/tree-flicker-fix",
    element: <TreeFlickerFix />,
  },
  {
    path: "/updates/aegis-releases/v2-38-0/popover-max-width",
    element: <PopoverMaxWidth />,
  },
  {
    path: "/updates/aegis-releases/v2-38-0/new-icons",
    element: <NewIcons />,
  },
  {
    path: "/updates/aegis-releases/v2-38-1",
    element: <AegisUpdateV2381 />,
  },
  {
    path: "/updates/aegis-releases/v2-38-1/snackbar-small-scale",
    element: <SnackbarSmallScale />,
  },
  {
    path: "/updates/aegis-releases/v2-39-0",
    element: <AegisUpdateV2390 />,
  },
  {
    path: "/updates/aegis-releases/v2-39-0/pagelayout-bleed",
    element: <PageLayoutBleedDemo />,
  },
  {
    path: "/updates/aegis-releases/v2-39-0/datatable-unpin-fix",
    element: <DataTableUnpinFix />,
  },
  {
    path: "/updates/aegis-releases/v2-40-0",
    element: <AegisUpdateV2400 />,
  },
  {
    path: "/updates/aegis-releases/v2-40-0/description-list-bordered",
    element: <DescriptionListBorderedDemo />,
  },
  {
    path: "/updates/aegis-releases/v2-40-0/datatable-checkbox-fix",
    element: <DataTableCheckboxFix />,
  },
  {
    path: "/updates/aegis-releases/v2-41-0",
    element: <AegisUpdateV2410 />,
  },
  {
    path: "/updates/aegis-releases/v2-41-0/statuslabel-new-colors",
    element: <StatusLabelNewColors />,
  },
  {
    path: "/updates/aegis-releases/v2-41-0/tag-action-api",
    element: <TagActionApi />,
  },
  {
    path: "/updates/aegis-releases/v2-41-0/description-list-xlarge",
    element: <DescriptionListXLargeDemo />,
  },
  {
    path: "/updates/aegis-releases/v2-41-0/informationcard-centering-fix",
    element: <InformationCardCenteringFix />,
  },
  {
    path: "/updates/aegis-releases/v2-42-0",
    element: <AegisUpdateV2420 />,
  },
  {
    path: "/updates/aegis-releases/v2-42-0/datatable-global-filter",
    element: <DataTableGlobalFilter />,
  },
  {
    path: "/updates/aegis-releases/v2-42-0/dialog-width-full",
    element: <DialogWidthFull />,
  },
  {
    path: "/updates/aegis-releases/v2-42-0/datatable-row-virtualization",
    element: <DataTableRowVirtualization />,
  },
  {
    path: "/updates/aegis-releases/v2-42-0/dialog-width-auto-fix",
    element: <DialogWidthAutoFix />,
  },
  {
    path: "/updates/aegis-releases/v2-43-0",
    element: <AegisUpdateV2430 />,
  },
  {
    path: "/updates/aegis-releases/v2-43-0/datatable-bordered",
    element: <DataTableBordered />,
  },
  {
    path: "/updates/aegis-releases/v2-43-0/button-fill",
    element: <ButtonFill />,
  },
  {
    path: "/updates/aegis-releases/v2-43-0/stepper-status",
    element: <StepperStatus />,
  },
  {
    path: "/updates/aegis-releases/v2-43-0/buttongroup-orientation",
    element: <ButtonGroupOrientation />,
  },
  {
    path: "/updates/aegis-releases/v2-43-0/datatable-badge-pin-fix",
    element: <DataTableBadgePinFix />,
  },
  {
    path: "/updates/aegis-releases/v2-43-2",
    element: <AegisUpdateV2432 />,
  },
  {
    path: "/updates/aegis-releases/v2-43-2/datatable-bordered-fix",
    element: <DataTableBorderedFix />,
  },
  {
    path: "/updates/aegis-releases/v2-44-0",
    element: <AegisUpdateV2440 />,
  },
  {
    path: "/updates/aegis-releases/v2-44-0/datatable-empty",
    element: <DataTableEmpty />,
  },
  {
    path: "/updates/aegis-releases/v2-44-0/button-yellow",
    element: <ButtonYellow />,
  },
  {
    path: "/updates/aegis-releases/v2-45-0",
    element: <AegisUpdateV2450 />,
  },
  {
    path: "/updates/aegis-releases/v2-45-0/drawer-bottom",
    element: <DrawerBottom />,
  },
  {
    path: "/updates/aegis-releases/v2-45-0/textarea-improvements",
    element: <TextareaImprovements />,
  },
  {
    path: "/updates/aegis-releases/v2-45-0/datatable-badge-pin",
    element: <DataTableBadgePin />,
  },
  {
    path: "/updates/aegis-releases/v2-45-1",
    element: <AegisUpdateV2451 />,
  },
  {
    path: "/updates/aegis-releases/v2-45-1/portal-event-bubbling-fix",
    element: <PortalEventBubblingFix />,
  },
  {
    path: "/updates/aegis-releases/v2-46-0",
    element: <AegisUpdateV2460 />,
  },
  {
    path: "/updates/aegis-releases/v2-46-0/bottom-navigation",
    element: <BottomNavigationDemo />,
  },
  {
    path: "/updates/aegis-releases/v2-46-0/new-icons",
    element: <NewIconsV2460 />,
  },
  {
    path: "/updates/aegis-releases/v2-46-0/actionlist-bordered",
    element: <ActionListBordered />,
  },
  {
    path: "/updates/aegis-releases/v2-46-0/calendar-small-scale",
    element: <CalendarSmallScale />,
  },
  {
    path: "/updates/aegis-releases/v2-47-0",
    element: <AegisUpdateV2470 />,
  },
  {
    path: "/updates/aegis-releases/v2-47-0/tabs-base-ui",
    element: <TabsBaseUiDemo />,
  },
  {
    path: "/updates/aegis-releases/v2-47-0/datatable-highlight-scope",
    element: <DataTableHighlightScope />,
  },
  {
    path: "/updates/aegis-releases/v2-47-0/tagpicker-selection-behavior",
    element: <TagPickerSelectionBehavior />,
  },
  {
    path: "/updates/aegis-releases/v2-48-0",
    element: <AegisUpdateV2480 />,
  },
  {
    path: "/updates/aegis-releases/v2-48-0/banner-icon",
    element: <BannerIconDemo />,
  },
  {
    path: "/updates/aegis-releases/v2-48-0/sidebar-resizable",
    element: <SidebarResizableDemo />,
  },
  {
    path: "/updates/aegis-releases/v2-48-0/new-icons",
    element: <NewIconsV2480 />,
  },
  {
    path: "/updates/aegis-releases/v2-49-0",
    element: <AegisUpdateV2490 />,
  },
  {
    path: "/updates/aegis-releases/v2-50-0",
    element: <AegisUpdateV2500 />,
  },
  {
    path: "/updates/aegis-releases/v2-51-0",
    element: <AegisUpdateV2510 />,
  },
  {
    path: "/updates/aegis-releases/v2-51-0/datatable-column-virtualization",
    element: <DataTableColumnVirtualizationDemo />,
  },
  {
    path: "/updates/aegis-releases/v2-51-0/cardlink-disabled",
    element: <CardLinkDisabledDemo />,
  },
  {
    path: "/updates/aegis-releases/v2-51-0/card-outline-opaque",
    element: <CardOutlineOpaqueDemo />,
  },
  {
    path: "/updates/aegis-releases/v2-51-1",
    element: <AegisUpdateV2511 />,
  },
  {
    path: "/updates/aegis-releases/v2-51-1/filter-guidance-caption",
    element: <FilterGuidanceCaptionDemo />,
  },
  {
    path: "/updates/aegis-releases/v2-51-1/breadcrumb-iconbutton-size",
    element: <BreadcrumbIconButtonSizeDemo />,
  },
  {
    path: "/updates/aegis-releases/v2-50-0/tag-dash",
    element: <TagDashDemo />,
  },
  {
    path: "/updates/aegis-releases/v2-50-0/cloud-icons",
    element: <CloudIconsDemo />,
  },
  {
    path: "/updates/aegis-releases/v2-49-0/sidebar-semi-small",
    element: <SidebarSemiSmallDemo />,
  },
  {
    path: "/updates/aegis-releases/v2-49-0/shimmer-text",
    element: <ShimmerTextDemo />,
  },
  {
    path: "/updates/aegis-releases/v2-48-3",
    element: <AegisUpdateV2483 />,
  },
  {
    path: "/updates/aegis-releases/v2-48-3/sidebar-data-slot",
    element: <SidebarDataSlotDemo />,
  },
  {
    path: "/updates/aegis-releases/v2-52-0",
    element: <AegisUpdateV2520 />,
  },
  {
    path: "/updates/aegis-releases/v2-52-0/textarea-ghost",
    element: <TextareaGhostDemo />,
  },
  {
    path: "/updates/aegis-releases/v2-52-0/radio-group-preview",
    element: <RadioGroupPreviewDemo />,
  },
  {
    path: "/updates/aegis-releases/v2-52-0/link-fit-content",
    element: <LinkFitContentDemo />,
  },
  {
    path: "/updates/aegis-releases/v2-52-0/datatable-manage-columns-hide",
    element: <DataTableManageColumnsHideDemo />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/updates": "src/pages/updates/index.tsx",
  "/updates/aegis-releases/v2-38-0": "src/pages/updates/aegis-releases/v2-38-0/index.tsx",
  "/updates/aegis-releases/v2-38-0/datatable-colspan":
    "src/pages/updates/aegis-releases/v2-38-0/datatable-colspan/index.tsx",
  "/updates/aegis-releases/v2-38-0/drawer-maxwidth-none":
    "src/pages/updates/aegis-releases/v2-38-0/drawer-maxwidth-none/index.tsx",
  "/updates/aegis-releases/v2-38-0/tree-flicker-fix":
    "src/pages/updates/aegis-releases/v2-38-0/tree-flicker-fix/index.tsx",
  "/updates/aegis-releases/v2-38-0/popover-max-width":
    "src/pages/updates/aegis-releases/v2-38-0/popover-max-width/index.tsx",
  "/updates/aegis-releases/v2-38-0/new-icons": "src/pages/updates/aegis-releases/v2-38-0/new-icons/index.tsx",
  "/updates/aegis-releases/v2-38-1": "src/pages/updates/aegis-releases/v2-38-1/index.tsx",
  "/updates/aegis-releases/v2-38-1/snackbar-small-scale":
    "src/pages/updates/aegis-releases/v2-38-1/snackbar-small-scale/index.tsx",
  "/updates/aegis-releases/v2-39-0": "src/pages/updates/aegis-releases/v2-39-0/index.tsx",
  "/updates/aegis-releases/v2-39-0/pagelayout-bleed":
    "src/pages/updates/aegis-releases/v2-39-0/pagelayout-bleed/index.tsx",
  "/updates/aegis-releases/v2-39-0/datatable-unpin-fix":
    "src/pages/updates/aegis-releases/v2-39-0/datatable-unpin-fix/index.tsx",
  "/updates/aegis-releases/v2-40-0": "src/pages/updates/aegis-releases/v2-40-0/index.tsx",
  "/updates/aegis-releases/v2-40-0/description-list-bordered":
    "src/pages/updates/aegis-releases/v2-40-0/description-list-bordered/index.tsx",
  "/updates/aegis-releases/v2-40-0/datatable-checkbox-fix":
    "src/pages/updates/aegis-releases/v2-40-0/datatable-checkbox-fix/index.tsx",
  "/updates/aegis-releases/v2-41-0": "src/pages/updates/aegis-releases/v2-41-0/index.tsx",
  "/updates/aegis-releases/v2-41-0/statuslabel-new-colors":
    "src/pages/updates/aegis-releases/v2-41-0/statuslabel-new-colors/index.tsx",
  "/updates/aegis-releases/v2-41-0/tag-action-api": "src/pages/updates/aegis-releases/v2-41-0/tag-action-api/index.tsx",
  "/updates/aegis-releases/v2-41-0/description-list-xlarge":
    "src/pages/updates/aegis-releases/v2-41-0/description-list-xlarge/index.tsx",
  "/updates/aegis-releases/v2-41-0/informationcard-centering-fix":
    "src/pages/updates/aegis-releases/v2-41-0/informationcard-centering-fix/index.tsx",
  "/updates/aegis-releases/v2-42-0": "src/pages/updates/aegis-releases/v2-42-0/index.tsx",
  "/updates/aegis-releases/v2-42-0/datatable-global-filter":
    "src/pages/updates/aegis-releases/v2-42-0/datatable-global-filter/index.tsx",
  "/updates/aegis-releases/v2-42-0/dialog-width-full":
    "src/pages/updates/aegis-releases/v2-42-0/dialog-width-full/index.tsx",
  "/updates/aegis-releases/v2-42-0/datatable-row-virtualization":
    "src/pages/updates/aegis-releases/v2-42-0/datatable-row-virtualization/index.tsx",
  "/updates/aegis-releases/v2-42-0/dialog-width-auto-fix":
    "src/pages/updates/aegis-releases/v2-42-0/dialog-width-auto-fix/index.tsx",
  "/updates/aegis-releases/v2-43-0": "src/pages/updates/aegis-releases/v2-43-0/index.tsx",
  "/updates/aegis-releases/v2-43-0/datatable-bordered":
    "src/pages/updates/aegis-releases/v2-43-0/datatable-bordered/index.tsx",
  "/updates/aegis-releases/v2-43-0/button-fill": "src/pages/updates/aegis-releases/v2-43-0/button-fill/index.tsx",
  "/updates/aegis-releases/v2-43-0/stepper-status": "src/pages/updates/aegis-releases/v2-43-0/stepper-status/index.tsx",
  "/updates/aegis-releases/v2-43-0/buttongroup-orientation":
    "src/pages/updates/aegis-releases/v2-43-0/buttongroup-orientation/index.tsx",
  "/updates/aegis-releases/v2-43-0/datatable-badge-pin-fix":
    "src/pages/updates/aegis-releases/v2-43-0/datatable-badge-pin-fix/index.tsx",
  "/updates/aegis-releases/v2-43-2": "src/pages/updates/aegis-releases/v2-43-2/index.tsx",
  "/updates/aegis-releases/v2-43-2/datatable-bordered-fix":
    "src/pages/updates/aegis-releases/v2-43-2/datatable-bordered-fix/index.tsx",
  "/updates/aegis-releases/v2-44-0": "src/pages/updates/aegis-releases/v2-44-0/index.tsx",
  "/updates/aegis-releases/v2-44-0/datatable-empty":
    "src/pages/updates/aegis-releases/v2-44-0/datatable-empty/index.tsx",
  "/updates/aegis-releases/v2-44-0/button-yellow": "src/pages/updates/aegis-releases/v2-44-0/button-yellow/index.tsx",
  "/updates/aegis-releases/v2-45-0": "src/pages/updates/aegis-releases/v2-45-0/index.tsx",
  "/updates/aegis-releases/v2-45-0/drawer-bottom": "src/pages/updates/aegis-releases/v2-45-0/drawer-bottom/index.tsx",
  "/updates/aegis-releases/v2-45-0/textarea-improvements":
    "src/pages/updates/aegis-releases/v2-45-0/textarea-improvements/index.tsx",
  "/updates/aegis-releases/v2-45-0/datatable-badge-pin":
    "src/pages/updates/aegis-releases/v2-45-0/datatable-badge-pin/index.tsx",
  "/updates/aegis-releases/v2-45-1": "src/pages/updates/aegis-releases/v2-45-1/index.tsx",
  "/updates/aegis-releases/v2-45-1/portal-event-bubbling-fix":
    "src/pages/updates/aegis-releases/v2-45-1/portal-event-bubbling-fix/index.tsx",
  "/updates/aegis-releases/v2-46-0": "src/pages/updates/aegis-releases/v2-46-0/index.tsx",
  "/updates/aegis-releases/v2-46-0/bottom-navigation":
    "src/pages/updates/aegis-releases/v2-46-0/bottom-navigation/index.tsx",
  "/updates/aegis-releases/v2-46-0/new-icons": "src/pages/updates/aegis-releases/v2-46-0/new-icons/index.tsx",
  "/updates/aegis-releases/v2-46-0/actionlist-bordered":
    "src/pages/updates/aegis-releases/v2-46-0/actionlist-bordered/index.tsx",
  "/updates/aegis-releases/v2-46-0/calendar-small-scale":
    "src/pages/updates/aegis-releases/v2-46-0/calendar-small-scale/index.tsx",
  "/updates/aegis-releases/v2-47-0": "src/pages/updates/aegis-releases/v2-47-0/index.tsx",
  "/updates/aegis-releases/v2-47-0/tabs-base-ui": "src/pages/updates/aegis-releases/v2-47-0/tabs-base-ui/index.tsx",
  "/updates/aegis-releases/v2-47-0/datatable-highlight-scope":
    "src/pages/updates/aegis-releases/v2-47-0/datatable-highlight-scope/index.tsx",
  "/updates/aegis-releases/v2-47-0/tagpicker-selection-behavior":
    "src/pages/updates/aegis-releases/v2-47-0/tagpicker-selection-behavior/index.tsx",
  "/updates/aegis-releases/v2-48-0": "src/pages/updates/aegis-releases/v2-48-0/index.tsx",
  "/updates/aegis-releases/v2-48-0/banner-icon": "src/pages/updates/aegis-releases/v2-48-0/banner-icon/index.tsx",
  "/updates/aegis-releases/v2-48-0/sidebar-resizable":
    "src/pages/updates/aegis-releases/v2-48-0/sidebar-resizable/index.tsx",
  "/updates/aegis-releases/v2-48-0/new-icons": "src/pages/updates/aegis-releases/v2-48-0/new-icons/index.tsx",
  "/updates/aegis-releases/v2-51-0": "src/pages/updates/aegis-releases/v2-51-0/index.tsx",
  "/updates/aegis-releases/v2-51-0/datatable-column-virtualization":
    "src/pages/updates/aegis-releases/v2-51-0/datatable-column-virtualization/index.tsx",
  "/updates/aegis-releases/v2-51-0/cardlink-disabled":
    "src/pages/updates/aegis-releases/v2-51-0/cardlink-disabled/index.tsx",
  "/updates/aegis-releases/v2-51-0/card-outline-opaque":
    "src/pages/updates/aegis-releases/v2-51-0/card-outline-opaque/index.tsx",
  "/updates/aegis-releases/v2-51-1": "src/pages/updates/aegis-releases/v2-51-1/index.tsx",
  "/updates/aegis-releases/v2-51-1/filter-guidance-caption":
    "src/pages/updates/aegis-releases/v2-51-1/filter-guidance-caption/index.tsx",
  "/updates/aegis-releases/v2-51-1/breadcrumb-iconbutton-size":
    "src/pages/updates/aegis-releases/v2-51-1/breadcrumb-iconbutton-size/index.tsx",
  "/updates/aegis-releases/v2-50-0": "src/pages/updates/aegis-releases/v2-50-0/index.tsx",
  "/updates/aegis-releases/v2-50-0/tag-dash": "src/pages/updates/aegis-releases/v2-50-0/tag-dash/index.tsx",
  "/updates/aegis-releases/v2-50-0/cloud-icons": "src/pages/updates/aegis-releases/v2-50-0/cloud-icons/index.tsx",
  "/updates/aegis-releases/v2-48-3": "src/pages/updates/aegis-releases/v2-48-3/index.tsx",
  "/updates/aegis-releases/v2-48-3/sidebar-data-slot":
    "src/pages/updates/aegis-releases/v2-48-3/sidebar-data-slot/index.tsx",
  "/updates/aegis-releases/v2-52-0": "src/pages/updates/aegis-releases/v2-52-0/index.tsx",
  "/updates/aegis-releases/v2-52-0/textarea-ghost": "src/pages/updates/aegis-releases/v2-52-0/textarea-ghost/index.tsx",
  "/updates/aegis-releases/v2-52-0/radio-group-preview":
    "src/pages/updates/aegis-releases/v2-52-0/radio-group-preview/index.tsx",
  "/updates/aegis-releases/v2-52-0/link-fit-content":
    "src/pages/updates/aegis-releases/v2-52-0/link-fit-content/index.tsx",
  "/updates/aegis-releases/v2-52-0/datatable-manage-columns-hide":
    "src/pages/updates/aegis-releases/v2-52-0/datatable-manage-columns-hide/index.tsx",
};
`;export{e as default};