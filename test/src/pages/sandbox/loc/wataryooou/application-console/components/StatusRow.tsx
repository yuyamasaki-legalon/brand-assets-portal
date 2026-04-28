import { LfEllipsisDot } from "@legalforce/aegis-icons";
import { ActionList, Draggable, Icon, IconButton, Menu, Table, Text, Tooltip } from "@legalforce/aegis-react";
import type { JSX } from "react";
import type { StatusRowProps } from "../types";

export const StatusRow = ({ status, isDraggable }: StatusRowProps): JSX.Element => {
  const rowContent = (
    <>
      <Table.Cell>{isDraggable ? <Draggable.Knob /> : <div style={{ width: "20px" }} />}</Table.Cell>
      <Table.Cell>
        <Text>{status.name}</Text>
      </Table.Cell>
      <Table.Cell>
        {isDraggable && (
          <Menu placement="bottom-end">
            <Menu.Anchor>
              <Tooltip title="オプション" placement="top">
                <IconButton size="small" variant="plain" aria-label="オプション">
                  <Icon>
                    <LfEllipsisDot />
                  </Icon>
                </IconButton>
              </Tooltip>
            </Menu.Anchor>
            <Menu.Box width="xSmall">
              <ActionList size="large">
                <ActionList.Group>
                  <ActionList.Item>
                    <ActionList.Body>編集</ActionList.Body>
                  </ActionList.Item>
                </ActionList.Group>
                <ActionList.Group>
                  <ActionList.Item color="danger">
                    <ActionList.Body>削除</ActionList.Body>
                  </ActionList.Item>
                </ActionList.Group>
              </ActionList>
            </Menu.Box>
          </Menu>
        )}
      </Table.Cell>
    </>
  );

  if (isDraggable) {
    return (
      <Draggable.Item as={Table.Row} id={status.id} hover={false}>
        {rowContent}
      </Draggable.Item>
    );
  }

  return <Table.Row hover={false}>{rowContent}</Table.Row>;
};
