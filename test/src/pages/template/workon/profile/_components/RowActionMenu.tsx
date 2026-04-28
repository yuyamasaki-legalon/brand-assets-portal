import { LfEllipsisDot, LfPen, LfTrash } from "@legalforce/aegis-icons";
import { ActionList, Icon, IconButton, Menu, Tooltip } from "@legalforce/aegis-react";

export function RowActionMenu() {
  return (
    <Menu>
      <Menu.Anchor>
        <Tooltip title="メニュー">
          <IconButton
            aria-label="メニュー"
            variant="plain"
            size="small"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <Icon>
              <LfEllipsisDot />
            </Icon>
          </IconButton>
        </Tooltip>
      </Menu.Anchor>
      <Menu.Box width="xSmall">
        <ActionList>
          <ActionList.Group>
            <ActionList.Item
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <ActionList.Body
                leading={
                  <Icon>
                    <LfPen />
                  </Icon>
                }
              >
                編集
              </ActionList.Body>
            </ActionList.Item>
          </ActionList.Group>
          <ActionList.Group>
            <ActionList.Item
              color="danger"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <ActionList.Body
                leading={
                  <Icon>
                    <LfTrash />
                  </Icon>
                }
              >
                削除
              </ActionList.Body>
            </ActionList.Item>
          </ActionList.Group>
        </ActionList>
      </Menu.Box>
    </Menu>
  );
}
