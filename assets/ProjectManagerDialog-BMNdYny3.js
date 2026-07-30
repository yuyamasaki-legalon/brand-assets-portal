var e=`import { LfEllipsisDot, LfPlusLarge } from "@legalforce/aegis-icons";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardLink,
  ContentHeader,
  ContentHeaderTitle,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogStickyContainer,
  Icon,
  IconButton,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  Text,
  TextField,
} from "@legalforce/aegis-react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useState } from "react";

import paletteInitial from "../../assets/palette-initial.json";
import { importFromPaletteJson } from "../../seed/seed";
import { createAegisV3DarkProject, createAegisV3Project } from "../../seed/v3-seed";
import { usePaletteLabContext } from "../../store/context";

type Props = {
  open: boolean;
  onClose: () => void;
};

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return \`\${d.getFullYear()}/\${String(d.getMonth() + 1).padStart(2, "0")}/\${String(d.getDate()).padStart(2, "0")}\`;
};

export const ProjectManagerDialog = ({ open, onClose }: Props) => {
  const { state, dispatch } = usePaletteLabContext();
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState("");

  const handleSelect = (projectId: string) => {
    dispatch({ type: "SELECT_PROJECT", payload: { projectId } });
  };

  const handleNewProject = () => {
    dispatch({ type: "ADD_PROJECT", payload: { name: "Project Name" } });
  };

  const handleImportV2 = () => {
    const project = importFromPaletteJson(paletteInitial as Record<string, Record<string, string>>, "Aegis v2", false);
    dispatch({ type: "IMPORT_PALETTE", payload: { project } });
  };

  const handleImportV3 = () => {
    dispatch({ type: "IMPORT_PALETTE", payload: { project: createAegisV3Project() } });
  };

  const handleImportV3Dark = () => {
    dispatch({ type: "IMPORT_PALETTE", payload: { project: createAegisV3DarkProject() } });
  };

  const handleRenameStart = (projectId: string, currentName: string) => {
    setRenamingId(projectId);
    setRenameInput(currentName);
  };

  const handleRenameSubmit = () => {
    if (!renamingId || !renameInput.trim()) return;
    dispatch({ type: "RENAME_PROJECT", payload: { projectId: renamingId, name: renameInput.trim() } });
    setRenamingId(null);
  };

  const handleRenameKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleRenameSubmit();
    if (e.key === "Escape") setRenamingId(null);
  };

  const handleClose = () => {
    setRenamingId(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <ContentHeader>
            <ContentHeaderTitle>Projects</ContentHeaderTitle>
          </ContentHeader>
        </DialogHeader>
        <DialogBody>
          {/* Sticky "New project" button at the top of the scrollable body */}
          <DialogStickyContainer position="top">
            <Menu>
              <MenuTrigger>
                <Button leading={LfPlusLarge} variant="subtle" width="full">
                  New project
                </Button>
              </MenuTrigger>
              {/* minWidth matches the trigger button width via Radix CSS variable */}
              <MenuContent style={{ minWidth: "var(--radix-dropdown-menu-trigger-width)" }}>
                <MenuItem onClick={handleImportV2}>Aegis v2</MenuItem>
                <MenuItem onClick={handleImportV3}>Aegis v3</MenuItem>
                <MenuItem onClick={handleImportV3Dark}>Aegis v3 Dark</MenuItem>
                <MenuSeparator />
                <MenuItem onClick={handleNewProject}>New project</MenuItem>
              </MenuContent>
            </Menu>
          </DialogStickyContainer>

          {/* Project card list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}>
            {state.projects.map((project) => {
              const isActive = project.id === state.activeProjectId;
              const isRenaming = renamingId === project.id;

              if (isRenaming) {
                return (
                  <div
                    key={project.id}
                    style={{
                      alignItems: "center",
                      display: "flex",
                      gap: "var(--aegis-space-xSmall)",
                      minHeight: "var(--aegis-size-x6Large)",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <TextField
                        autoFocus
                        aria-label={\`Rename: \${project.name}\`}
                        value={renameInput}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setRenameInput(e.target.value)}
                        onKeyDown={handleRenameKeyDown}
                      />
                    </div>
                    <Button disabled={!renameInput.trim()} onClick={handleRenameSubmit}>
                      Confirm
                    </Button>
                  </div>
                );
              }

              return (
                <Card key={project.id} variant="plain" size="small">
                  <CardBody>
                    <div
                      style={{
                        alignItems: "center",
                        display: "flex",
                        gap: "var(--aegis-space-xSmall)",
                        minHeight: "var(--aegis-size-x3Large)",
                      }}
                    >
                      {/* CardLink wraps text area — enables hover/active/selected CSS states on Card */}
                      <CardLink asChild style={{ flex: 1 }}>
                        <button
                          type="button"
                          aria-pressed={isActive}
                          style={{
                            background: "transparent",
                            border: 0,
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--aegis-space-x3Small)",
                            padding: 0,
                            textAlign: "left",
                            width: "100%",
                          }}
                          onClick={() => handleSelect(project.id)}
                        >
                          <Text variant="body.medium">{project.name}</Text>
                          <Text color="subtle" variant="body.small">
                            {formatDate(project.createdAt)}
                          </Text>
                        </button>
                      </CardLink>
                      {/* ... menu — sibling of CardLink, not nested inside */}
                      <Menu>
                        <MenuTrigger>
                          <IconButton aria-label="Project options" size="small" variant="plain">
                            <Icon size="xSmall">
                              <LfEllipsisDot />
                            </Icon>
                          </IconButton>
                        </MenuTrigger>
                        <MenuContent align="end" side="bottom">
                          <MenuItem onClick={() => handleRenameStart(project.id, project.name)}>Rename</MenuItem>
                          <MenuItem
                            onClick={() => dispatch({ type: "DUPLICATE_PROJECT", payload: { projectId: project.id } })}
                          >
                            Duplicate
                          </MenuItem>
                          <MenuSeparator />
                          <MenuItem
                            color="danger"
                            onClick={() => dispatch({ type: "DELETE_PROJECT", payload: { projectId: project.id } })}
                          >
                            Delete
                          </MenuItem>
                        </MenuContent>
                      </Menu>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </DialogBody>
        <DialogFooter>
          <ButtonGroup>
            <Button variant="subtle" onClick={handleClose}>
              Close
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
`;export{e as default};