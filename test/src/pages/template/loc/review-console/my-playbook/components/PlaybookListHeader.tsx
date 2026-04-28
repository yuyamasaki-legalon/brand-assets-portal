import {
  LfAngleDownMiddle,
  LfAngleUpMiddle,
  LfArrowDownFromLine,
  LfArrowUpRightFromSquare,
  LfPlusLarge,
  LfQuestionCircle,
} from "@legalforce/aegis-icons";
import { ActionList, Button, ButtonGroup, IconButton, Link, Menu, Tooltip } from "@legalforce/aegis-react";

interface Props {
  isListOpen: boolean;
  onToggleList: () => void;
  onOpenAddDialog: () => void;
  showAddButton?: boolean;
}

export const PlaybookListHeader = ({ isListOpen, onToggleList, onOpenAddDialog, showAddButton = true }: Props) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--aegis-space-small)",
        padding: "var(--aegis-space-small) 0",
      }}
    >
      {/* Left side: Help link */}
      <Link href="#" leading={LfQuestionCircle} trailing={LfArrowUpRightFromSquare}>
        プレイブックの使用方法
      </Link>

      {/* Right side: Buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--aegis-space-small)",
        }}
      >
        <Button
          variant="subtle"
          size="small"
          leading={isListOpen ? LfAngleUpMiddle : LfAngleDownMiddle}
          onClick={onToggleList}
        >
          {isListOpen ? "すべて閉じる" : "すべて開く"}
        </Button>

        <Tooltip title="エクスポート">
          <IconButton aria-label="エクスポート" icon={LfArrowDownFromLine} variant="subtle" size="small" />
        </Tooltip>

        {showAddButton && (
          <ButtonGroup size="small">
            <Menu placement="bottom-end">
              <Menu.Anchor>
                <Button variant="solid" leading={LfPlusLarge} trailing={LfAngleDownMiddle}>
                  プレイブックを追加
                </Button>
              </Menu.Anchor>
              <Menu.Box>
                <ActionList size="large">
                  <ActionList.Group>
                    <ActionList.Item onClick={onOpenAddDialog}>
                      <ActionList.Body>新規作成</ActionList.Body>
                    </ActionList.Item>
                    <ActionList.Item>
                      <ActionList.Body>Excelからインポート</ActionList.Body>
                    </ActionList.Item>
                  </ActionList.Group>
                </ActionList>
              </Menu.Box>
            </Menu>
          </ButtonGroup>
        )}
      </div>
    </div>
  );
};
