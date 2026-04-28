import { LfSetting, LfTrash } from "@legalforce/aegis-icons";
import { Draggable, Icon, IconButton, Popover, Tooltip } from "@legalforce/aegis-react";
import type React from "react";
import type { ContentItem } from "./types";

interface Props {
  items: ContentItem[];
  onRemove: (id: string) => void;
  onReorder: (items: ContentItem[]) => void;
  placement?: "bottom-start" | "bottom-end" | "right-start" | "left-start";
}

export const ContentManagerPopover = ({
  items,
  onRemove,
  onReorder,
  placement = "bottom-start",
}: Props): React.ReactElement => {
  return (
    <Popover placement={placement}>
      <Popover.Anchor>
        <Tooltip title="Manage content" placement="top">
          <IconButton variant="subtle" size="xSmall" aria-label="Manage content">
            <Icon>
              <LfSetting />
            </Icon>
          </IconButton>
        </Tooltip>
      </Popover.Anchor>
      <Popover.Content style={{ width: "var(--aegis-layout-width-x4Small)" }}>
        <Popover.Body>
          <Draggable values={items} onReorder={onReorder}>
            {items.map((item) => (
              <Draggable.Item
                key={item.id}
                id={item.id}
                trailing={
                  <Tooltip title="Delete" placement="top">
                    <IconButton variant="plain" size="xSmall" aria-label="Delete" onClick={() => onRemove(item.id)}>
                      <Icon>
                        <LfTrash />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                }
              >
                {item.component}
              </Draggable.Item>
            ))}
          </Draggable>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
};
