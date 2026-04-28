import { LfEllipsisDot, LfFolderPlus, LfPen, LfTrash } from "@legalforce/aegis-icons";
import {
  Button,
  ButtonGroup,
  ContentHeader,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  FormControl,
  Icon,
  IconButton,
  Menu,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Popover,
  Text,
  TextField,
  Tooltip,
} from "@legalforce/aegis-react";
import { useEffect, useRef, useState } from "react";

const SAVE_DESTINATIONS = [
  "Calbert",
  "DI-test-folder",
  "LanguageTest",
  "QATest",
  "ishibashi test",
  "osanai test",
  "ri-test",
  "taizo_test",
];

export const PopoverDialog = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"edit" | "addFolder">("edit");
  const [currentDestination] = useState("Calbert");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [shouldRestoreFocus, setShouldRestoreFocus] = useState(false);

  const handleOpenDialog = (type: "edit" | "addFolder") => {
    setDialogType(type);
    setPopoverOpen(false);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setShouldRestoreFocus(true);
    setPopoverOpen(true);
  };

  useEffect(() => {
    if (shouldRestoreFocus && popoverOpen && !dialogOpen) {
      const id = requestAnimationFrame(() => setShouldRestoreFocus(false));
      return () => cancelAnimationFrame(id);
    }
  }, [shouldRestoreFocus, popoverOpen, dialogOpen]);

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Popover + Dialog</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            Popover 内のメニューから Dialog を開くデモです。Dialog を閉じると Popover が再度開きます。
          </Text>

          <Popover open={popoverOpen} onOpenChange={setPopoverOpen} placement="bottom-start">
            <Popover.Anchor>
              <Button variant="subtle" onClick={() => setPopoverOpen(true)}>
                {currentDestination} を表示中
              </Button>
            </Popover.Anchor>
            <Popover.Content width="large" initialFocus={shouldRestoreFocus ? menuButtonRef : undefined}>
              <Popover.Header>
                <Text variant="title.xSmall">保存先</Text>
              </Popover.Header>
              <Popover.Body>
                {/* 表示中の保存先 */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "var(--aegis-space-small) var(--aegis-space-medium)",
                    border: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
                    borderRadius: "var(--aegis-radius-medium)",
                    marginBottom: "var(--aegis-space-medium)",
                  }}
                >
                  <div>
                    <Text as="p" variant="body.small" color="subtle">
                      表示中の保存先
                    </Text>
                    <Text as="p" variant="body.medium">
                      {currentDestination}
                    </Text>
                  </div>
                  <Menu>
                    <MenuTrigger>
                      <Tooltip title="メニュー">
                        <IconButton ref={menuButtonRef} aria-label="メニュー" variant="plain" size="small">
                          <Icon>
                            <LfEllipsisDot />
                          </Icon>
                        </IconButton>
                      </Tooltip>
                    </MenuTrigger>
                    <MenuContent>
                      <MenuGroup>
                        <MenuItem
                          leading={
                            <Icon>
                              <LfPen />
                            </Icon>
                          }
                          onClick={() => handleOpenDialog("edit")}
                        >
                          保存先を編集
                        </MenuItem>
                        <MenuItem
                          leading={
                            <Icon>
                              <LfFolderPlus />
                            </Icon>
                          }
                          onClick={() => handleOpenDialog("addFolder")}
                        >
                          フォルダを追加
                        </MenuItem>
                      </MenuGroup>
                      <MenuSeparator />
                      <MenuItem
                        color="danger"
                        disabled
                        leading={
                          <Icon>
                            <LfTrash />
                          </Icon>
                        }
                      >
                        削除
                      </MenuItem>
                    </MenuContent>
                  </Menu>
                </div>

                {/* すべての保存先 */}
                <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
                  すべての保存先
                </Text>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: "240px",
                    overflowY: "auto",
                  }}
                >
                  {SAVE_DESTINATIONS.map((name) => (
                    <div
                      key={name}
                      style={{
                        padding: "var(--aegis-space-xSmall) var(--aegis-space-small)",
                        borderRadius: "var(--aegis-radius-medium)",
                        backgroundColor:
                          name === currentDestination ? "var(--aegis-color-background-neutral-subtle)" : undefined,
                        cursor: "pointer",
                      }}
                    >
                      <Text variant="body.small">{name}</Text>
                    </div>
                  ))}
                </div>
              </Popover.Body>
            </Popover.Content>
          </Popover>

          {/* Dialog */}
          <Dialog open={dialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
            <DialogContent>
              <DialogHeader>
                <ContentHeader>
                  <ContentHeader.Title>{dialogType === "edit" ? "保存先を編集" : "フォルダを追加"}</ContentHeader.Title>
                </ContentHeader>
              </DialogHeader>
              <DialogBody>
                <FormControl>
                  <FormControl.Label>{dialogType === "edit" ? "保存先名" : "フォルダ名"}</FormControl.Label>
                  <TextField
                    defaultValue={dialogType === "edit" ? currentDestination : ""}
                    placeholder={dialogType === "edit" ? "保存先名を入力" : "フォルダ名を入力"}
                  />
                </FormControl>
              </DialogBody>
              <DialogFooter>
                <ButtonGroup>
                  <Button variant="plain" onClick={handleCloseDialog}>
                    キャンセル
                  </Button>
                  <Button variant="solid" onClick={handleCloseDialog}>
                    {dialogType === "edit" ? "保存" : "追加"}
                  </Button>
                </ButtonGroup>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
