import { LfAngleRightMiddle, LfPlusLarge, LfTrash } from "@legalforce/aegis-icons";
import {
  ActionList,
  ActionListBody,
  ActionListDescription,
  ActionListItem,
  Button,
  ButtonGroup,
  Draggable,
  Icon,
  IconButton,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  Popover,
  Search,
  SegmentedControl,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import type React from "react";
import { useRef, useState } from "react";
import type { ContentArea } from "../../types";
import { getAreaRegistry } from "./componentRegistry";
import { ItemSettingsPopover } from "./ItemSettingsPopover";
import type { ComponentKey, ContentItem } from "./types";

const FOOTER_SLOT_AREAS: ContentArea[] = [
  "globalFooter",
  "contentFooter",
  "paneStartFooter",
  "paneEndFooter",
  "outerSidebarStartFooter",
  "outerSidebarEndFooter",
];

interface Props {
  area: ContentArea;
  onAdd: (component: ComponentKey, slot?: "start" | "end") => void;
  items: ContentItem[];
  onRemove: (id: string) => void;
  onReorder: (items: ContentItem[]) => void;
  onUpdate: (id: string, props: Record<string, string>) => void;
  variant?: "solid" | "subtle" | "outline" | "plain" | "gutterless";
  size?: "xSmall" | "small" | "medium" | "large";
  iconOnly?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  placement?:
    | "bottom-start"
    | "bottom-end"
    | "top-start"
    | "top-end"
    | "right-start"
    | "right-end"
    | "left-start"
    | "left-end";
  /** right/left 配置時の縦方向オフセット (px)。正値で下、負値で上 */
  crossOffset?: number;
  /** トリガーボタンに適用する style（CSS 変数の上書き等に使用） */
  triggerStyle?: React.CSSProperties;
}

export const AddContentPopover = ({
  area,
  onAdd,
  items,
  onRemove,
  onReorder,
  onUpdate,
  variant,
  size,
  iconOnly,
  onOpenChange,
  open,
  placement = "bottom-start",
  crossOffset,
  triggerStyle,
}: Props): React.ReactElement => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const getListItems = () =>
    Array.from(listRef.current?.querySelectorAll<HTMLElement>("button, [role='option']") ?? []);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown") return;
    e.preventDefault();
    getListItems()[0]?.focus();
  };

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const items = getListItems();
    const idx = items.indexOf(document.activeElement as HTMLElement);
    e.preventDefault();
    if (e.key === "ArrowDown") {
      items[idx + 1]?.focus();
    } else {
      if (idx <= 0) {
        searchContainerRef.current?.querySelector<HTMLElement>("input")?.focus();
      } else {
        items[idx - 1]?.focus();
      }
    }
  };

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

  const translateX = placement.startsWith("left")
    ? -4
    : placement.startsWith("right")
      ? 4
      : placement.startsWith("bottom")
        ? -4
        : 0;
  const contentStyle: React.CSSProperties = {
    width: "var(--aegis-layout-width-x4Small)",
    maxHeight: "400px",
    ...(crossOffset !== undefined ? { marginTop: `${crossOffset}px` } : {}),
    ...(translateX !== 0 ? { transform: `translateX(${translateX}px)` } : {}),
  };
  const triggerIconColor = variant === "solid" ? "inverse" : undefined;

  const areaRegistry = getAreaRegistry(area);
  const filteredItems = areaRegistry.filter(({ label }) => label.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSearchQuery("");
      setTabIndex(0);
    }
    onOpenChange?.(isOpen);
  };

  const startItems = items.filter((item) => (item.slot ?? "start") === "start");
  const endItems = items.filter((item) => item.slot === "end");

  const handleStartReorder = (newStart: ContentItem[]) => onReorder([...newStart, ...endItems]);
  const handleEndReorder = (newEnd: ContentItem[]) => onReorder([...startItems, ...newEnd]);

  return (
    <Popover
      placement={placement}
      onOpenChange={handleOpenChange}
      closeButton={false}
      {...(open !== undefined ? { open } : {})}
    >
      <Popover.Anchor>
        {iconOnly ? (
          <Tooltip title="Add content" placement="top">
            <IconButton
              variant={variant === "outline" || variant === "gutterless" ? "subtle" : variant}
              size={size}
              aria-label="Add content"
              style={triggerStyle}
            >
              <Icon color={triggerIconColor}>
                <LfPlusLarge />
              </Icon>
            </IconButton>
          </Tooltip>
        ) : (
          <Button variant={variant === "outline" ? "subtle" : variant} size={size}>
            Content
          </Button>
        )}
      </Popover.Anchor>
      <Popover.Content style={contentStyle}>
        {/* biome-ignore lint/a11y/noStaticElementInteractions: focus trap keyboard handler for managing tab order within the popover */}
        <div role="presentation" ref={contentRef} onKeyDown={handleKeyDown} style={{ display: "contents" }}>
          <Popover.Header>
            <SegmentedControl
              index={tabIndex}
              onChange={setTabIndex}
              variant="solid"
              size="xSmall"
              style={{ width: "100%" }}
            >
              <SegmentedControl.Button>Browse</SegmentedControl.Button>
              <SegmentedControl.Button disabled={items.length === 0}>In Use</SegmentedControl.Button>
            </SegmentedControl>
            {tabIndex === 0 && (
              <div ref={searchContainerRef} style={{ marginTop: "var(--aegis-space-medium)" }}>
                <Search
                  size="small"
                  aria-label="Search components"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>
            )}
          </Popover.Header>
          <Popover.Body>
            {tabIndex === 0 ? (
              filteredItems.length > 0 ? (
                // biome-ignore lint/a11y/noNoninteractiveElementInteractions: keyboard arrow-key navigation for list items
                // biome-ignore lint/a11y/noStaticElementInteractions: keyboard arrow-key navigation for list items
                <div ref={listRef} onKeyDown={handleListKeyDown}>
                  <ActionList>
                    {filteredItems.map(({ key, label, description }) =>
                      area === "globalHeader" || FOOTER_SLOT_AREAS.includes(area) ? (
                        <Menu
                          key={key}
                          placement="right-start"
                          onOpenChange={(isOpen) => setOpenMenuKey(isOpen ? key : null)}
                        >
                          <MenuTrigger>
                            <ActionListItem
                              style={
                                openMenuKey === key
                                  ? { backgroundColor: "var(--aegis-action-list-item-background-color-hovered)" }
                                  : undefined
                              }
                            >
                              <ActionListBody
                                alignItems="start"
                                trailing={
                                  <Icon>
                                    <LfAngleRightMiddle />
                                  </Icon>
                                }
                              >
                                {label}
                                {description && <ActionListDescription>{description}</ActionListDescription>}
                              </ActionListBody>
                            </ActionListItem>
                          </MenuTrigger>
                          <MenuContent>
                            <MenuItem onClick={() => onAdd(key, "start")} {...({ size: "medium" } as object)}>
                              Start
                            </MenuItem>
                            <MenuItem onClick={() => onAdd(key, "end")} {...({ size: "medium" } as object)}>
                              End
                            </MenuItem>
                          </MenuContent>
                        </Menu>
                      ) : (
                        <ActionListItem key={key} onClick={() => onAdd(key)}>
                          <ActionListBody alignItems="start">
                            {label}
                            {description && <ActionListDescription>{description}</ActionListDescription>}
                          </ActionListBody>
                        </ActionListItem>
                      ),
                    )}
                  </ActionList>
                </div>
              ) : (
                <div style={{ padding: "var(--aegis-space-small)", textAlign: "center" }}>
                  <Text variant="body.small" color="subtle">
                    No results
                  </Text>
                </div>
              )
            ) : items.length > 0 ? (
              area === "globalHeader" || FOOTER_SLOT_AREAS.includes(area) ? (
                <>
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
                        {startItems.map((item) => (
                          <Draggable.Item
                            key={item.id}
                            id={item.id}
                            trailing={
                              <ButtonGroup>
                                <ItemSettingsPopover
                                  component={item.component}
                                  itemProps={item.props}
                                  onUpdate={(props) => onUpdate(item.id, props)}
                                />
                                <Tooltip title="Delete" placement="top">
                                  <IconButton
                                    variant="plain"
                                    size="xSmall"
                                    aria-label="Delete"
                                    onClick={() => onRemove(item.id)}
                                  >
                                    <Icon>
                                      <LfTrash />
                                    </Icon>
                                  </IconButton>
                                </Tooltip>
                              </ButtonGroup>
                            }
                          >
                            <Text variant="body.medium">{item.component}</Text>
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
                        {endItems.map((item) => (
                          <Draggable.Item
                            key={item.id}
                            id={item.id}
                            trailing={
                              <ButtonGroup>
                                <ItemSettingsPopover
                                  component={item.component}
                                  itemProps={item.props}
                                  onUpdate={(props) => onUpdate(item.id, props)}
                                />
                                <Tooltip title="Delete" placement="top">
                                  <IconButton
                                    variant="plain"
                                    size="xSmall"
                                    aria-label="Delete"
                                    onClick={() => onRemove(item.id)}
                                  >
                                    <Icon>
                                      <LfTrash />
                                    </Icon>
                                  </IconButton>
                                </Tooltip>
                              </ButtonGroup>
                            }
                          >
                            <Text variant="body.medium">{item.component}</Text>
                          </Draggable.Item>
                        ))}
                      </Draggable>
                    </>
                  )}
                </>
              ) : (
                <Draggable values={items} onReorder={onReorder}>
                  {items.map((item) => (
                    <Draggable.Item
                      key={item.id}
                      id={item.id}
                      trailing={
                        <ButtonGroup>
                          <ItemSettingsPopover
                            component={item.component}
                            itemProps={item.props}
                            onUpdate={(props) => onUpdate(item.id, props)}
                          />
                          <Tooltip title="Delete" placement="top">
                            <IconButton
                              variant="plain"
                              size="xSmall"
                              aria-label="Delete"
                              onClick={() => onRemove(item.id)}
                            >
                              <Icon>
                                <LfTrash />
                              </Icon>
                            </IconButton>
                          </Tooltip>
                        </ButtonGroup>
                      }
                    >
                      <Text variant="body.medium">{item.component}</Text>
                    </Draggable.Item>
                  ))}
                </Draggable>
              )
            ) : (
              <div style={{ padding: "var(--aegis-space-small)", textAlign: "center" }}>
                <Text variant="body.small" color="subtle">
                  No items added yet
                </Text>
              </div>
            )}
          </Popover.Body>
        </div>
      </Popover.Content>
    </Popover>
  );
};
