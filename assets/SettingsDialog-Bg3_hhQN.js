var e=`import { LfCheck, LfClipboardList, LfCopy, LfFileLines, LfGraphNode, LfRule } from "@legalforce/aegis-icons";
import {
  ActionList,
  ActionListItem,
  Button,
  ContentHeader,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Form,
  FormControl,
  Icon,
  Select,
  Switch,
  Tab,
  Text,
} from "@legalforce/aegis-react";
import { FLAG_DEFINITIONS, type FlagName, useFeatureFlags } from "../../contexts/FeatureFlagContext";
import { type ThemeName, themeOptions } from "../../themes";
import { getVariantOptions, localeOptions } from "./constants";
import styles from "./floatingSourceCodeViewer.module.css";
import type { ProtoDrawerKind } from "./PrototypeDrawers";
import type { EditableVariantTarget, LocaleCode } from "./types";

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentPath: string;
  locale: LocaleCode;
  onLocaleChange: (locale: LocaleCode) => void;
  theme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
  isThemeAutoDetected: boolean;
  onHideLauncher: () => void;
  adjacentMarkdownFiles: string[];
  onOpenDocs: () => void;
  protoTools: ReturnType<typeof import("../prototype").usePrototypeTools>;
  onOpenProtoDrawer: (kind: ProtoDrawerKind) => void;
  variantEditable: boolean;
  isEditMode: boolean;
  setIsEditMode: (next: boolean | ((prev: boolean) => boolean)) => void;
  onPickOnPage: () => void;
  isVariantLoading: boolean;
  variantTargets: EditableVariantTarget[];
  variantFeedback: string | null;
  loadVariantTargets: () => void;
  updateVariant: (target: EditableVariantTarget, nextVariant: string) => void;
  applyingTargetId: string | null;
  selectedTargetId: string | null;
  filePath: string;
  githubUrl: string;
  aegisComponents: string[];
  copiedTab: string | null;
  onCopy: (text: string, tabName: string) => void;
}

export const SettingsDialog = (props: SettingsDialogProps) => {
  const {
    isOpen,
    onOpenChange,
    currentPath,
    locale,
    onLocaleChange,
    theme,
    onThemeChange,
    isThemeAutoDetected,
    onHideLauncher,
    adjacentMarkdownFiles,
    onOpenDocs,
    protoTools,
    onOpenProtoDrawer,
    variantEditable,
    isEditMode,
    setIsEditMode,
    onPickOnPage,
    isVariantLoading,
    variantTargets,
    variantFeedback,
    loadVariantTargets,
    updateVariant,
    applyingTargetId,
    selectedTargetId,
    filePath,
    githubUrl,
    aegisComponents,
    copiedTab,
    onCopy,
  } = props;

  const { flags, setFlag, resetFlags } = useFeatureFlags();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} closeOnEsc closeOnOutsidePress>
      <DialogContent width="large" data-aegis-editor-ui="true">
        <DialogHeader>
          <ContentHeader>
            <ContentHeader.Title>Aegis Lab Setting</ContentHeader.Title>
          </ContentHeader>
          <Text variant="body.small" color="subtle">
            {currentPath}
          </Text>
        </DialogHeader>
        <DialogBody>
          <div className={styles.stack}>
            <Tab.Group>
              <Tab.List>
                <Tab>Tools</Tab>
                <Tab>Edit</Tab>
                <Tab>File Info</Tab>
                <Tab>Components</Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <Form size="small" className={styles.stack}>
                    <div className={styles.stackTight}>
                      <Text variant="label.medium.bold">Provider Settings</Text>
                      <FormControl>
                        <FormControl.Label>Locale</FormControl.Label>
                        <Select
                          options={localeOptions}
                          value={locale}
                          onChange={(value) => {
                            if (value) onLocaleChange(value as LocaleCode);
                          }}
                        />
                      </FormControl>
                      <FormControl>
                        <FormControl.Label>
                          Theme
                          {isThemeAutoDetected && (
                            <Text as="span" variant="body.xSmall" color="subtle">
                              {" "}
                              (auto-detected from URL)
                            </Text>
                          )}
                        </FormControl.Label>
                        <Select
                          options={themeOptions}
                          value={theme}
                          onChange={(value) => {
                            if (value) onThemeChange(value as ThemeName);
                          }}
                        />
                      </FormControl>
                      <FormControl style={{ marginTop: "var(--aegis-space-medium)" }}>
                        <FormControl.Label>Hide launcher for screenshots</FormControl.Label>
                        <Button variant="subtle" onClick={onHideLauncher}>
                          Hide floating button
                        </Button>
                        <FormControl.Caption>再表示する場合は Alt + L を押してください。</FormControl.Caption>
                      </FormControl>
                    </div>
                    <div className={styles.section}>
                      <Text variant="label.medium.bold">Documentation</Text>
                      <Button
                        variant="subtle"
                        leading={
                          <Icon size="small">
                            <LfFileLines />
                          </Icon>
                        }
                        onClick={onOpenDocs}
                        disabled={adjacentMarkdownFiles.length === 0}
                      >
                        Open Docs ({adjacentMarkdownFiles.length})
                      </Button>
                      {adjacentMarkdownFiles.length === 0 && (
                        <FormControl.Caption>No markdown files found in this directory.</FormControl.Caption>
                      )}
                    </div>

                    {Object.keys(FLAG_DEFINITIONS).length > 0 && (
                      <div className={styles.section}>
                        <Text variant="label.medium.bold">Feature Flags</Text>
                        {(Object.keys(FLAG_DEFINITIONS) as FlagName[]).map((key) => (
                          <FormControl key={key}>
                            <Switch checked={flags[key]} onChange={(e) => setFlag(key, e.target.checked)}>
                              {FLAG_DEFINITIONS[key].description}
                            </Switch>
                          </FormControl>
                        ))}
                        <Button variant="subtle" size="small" onClick={resetFlags}>
                          Reset all to defaults
                        </Button>
                      </div>
                    )}

                    {protoTools && (
                      <div className={styles.section}>
                        <Text variant="label.medium.bold">Prototype Tools</Text>
                        {protoTools.mapData && protoTools.mapData.nodes.length > 0 && (
                          <Button
                            variant="subtle"
                            leading={
                              <Icon size="small">
                                <LfGraphNode />
                              </Icon>
                            }
                            onClick={() => onOpenProtoDrawer("map")}
                          >
                            Map ({protoTools.mapData.nodes.length} screens)
                          </Button>
                        )}
                        {protoTools.specContent && (
                          <Button
                            variant="subtle"
                            leading={
                              <Icon size="small">
                                <LfRule />
                              </Icon>
                            }
                            onClick={() => onOpenProtoDrawer("spec")}
                          >
                            Spec
                          </Button>
                        )}
                        {protoTools.qaContent && (
                          <Button
                            variant="subtle"
                            leading={
                              <Icon size="small">
                                <LfClipboardList />
                              </Icon>
                            }
                            onClick={() => onOpenProtoDrawer("qa")}
                          >
                            QA Checklist
                          </Button>
                        )}
                      </div>
                    )}
                  </Form>
                </Tab.Panel>
                <Tab.Panel>
                  <div className={styles.stack}>
                    <FormControl>
                      <FormControl.Label>編集モード</FormControl.Label>
                      <div className={styles.editModeRow}>
                        <Button
                          variant={isEditMode ? "solid" : "subtle"}
                          onClick={() => setIsEditMode((prev) => !prev)}
                          disabled={!variantEditable}
                        >
                          {isEditMode ? "編集モード ON" : "編集モード OFF"}
                        </Button>
                        <Button variant="subtle" onClick={onPickOnPage} disabled={!variantEditable || isVariantLoading}>
                          Pick on page
                        </Button>
                      </div>
                      <FormControl.Caption>
                        {variantEditable
                          ? "ON の間はこの画面から component の variant を変更し、ファイルへ直接保存できます。"
                          : "開発サーバー起動時のみ有効です。"}
                      </FormControl.Caption>
                    </FormControl>

                    {isEditMode && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--aegis-space-small)",
                        }}
                      >
                        <div className={styles.editModeHeader}>
                          <Text variant="label.medium.bold">Variant Targets ({variantTargets.length})</Text>
                          <Button
                            size="small"
                            variant="subtle"
                            onClick={loadVariantTargets}
                            disabled={isVariantLoading || !variantEditable}
                          >
                            Refresh
                          </Button>
                        </div>

                        {variantFeedback && (
                          <Text as="p" variant="body.small" color="subtle">
                            {variantFeedback}
                          </Text>
                        )}

                        {isVariantLoading ? (
                          <Text as="p" variant="body.small" color="subtle">
                            Loading editable variants...
                          </Text>
                        ) : variantTargets.length > 0 ? (
                          <ActionList>
                            {variantTargets.map((target) => (
                              <ActionListItem key={target.id}>
                                <div
                                  className={\`\${styles.variantTargetItem} \${
                                    selectedTargetId === target.id ? styles.variantTargetItemSelected : ""
                                  }\`}
                                >
                                  <Text as="p" variant="body.small">
                                    {target.componentName} ({target.line}:{target.column})
                                  </Text>
                                  <Select
                                    options={getVariantOptions(target.currentVariant)}
                                    value={target.currentVariant}
                                    disabled={!variantEditable || applyingTargetId === target.id}
                                    onChange={(value) => {
                                      if (value) updateVariant(target, value);
                                    }}
                                  />
                                </div>
                              </ActionListItem>
                            ))}
                          </ActionList>
                        ) : (
                          <Text as="p" variant="body.small" color="subtle">
                            このファイルには文字列リテラルの variant は見つかりませんでした。
                          </Text>
                        )}
                      </div>
                    )}
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <div className={styles.stack}>
                    <div>
                      <div className={styles.headerRow}>
                        <div className={styles.headerLabel}>File Path</div>
                        <Button
                          size="small"
                          variant="subtle"
                          onClick={() => onCopy(filePath, "path")}
                          leading={<Icon size="small">{copiedTab === "path" ? <LfCheck /> : <LfCopy />}</Icon>}
                        >
                          {copiedTab === "path" ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                      <pre className={styles.codeBlock}>
                        <code>{filePath}</code>
                      </pre>
                    </div>

                    <div>
                      <div className={styles.headerRow}>
                        <div className={styles.headerLabel}>GitHub URL</div>
                        <Button
                          size="small"
                          variant="subtle"
                          onClick={() => onCopy(githubUrl, "github")}
                          leading={<Icon size="small">{copiedTab === "github" ? <LfCheck /> : <LfCopy />}</Icon>}
                        >
                          {copiedTab === "github" ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                      <div className={styles.linkBlock}>
                        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={styles.linkAnchor}>
                          {githubUrl}
                        </a>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-small)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div className={styles.headerLabel}>Aegis Components Used ({aegisComponents.length})</div>
                      <Button
                        size="small"
                        variant="subtle"
                        onClick={() => onCopy(aegisComponents.join("\\n"), "components")}
                        leading={<Icon size="small">{copiedTab === "components" ? <LfCheck /> : <LfCopy />}</Icon>}
                      >
                        {copiedTab === "components" ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    {aegisComponents.length > 0 ? (
                      <div className={styles.componentsList}>
                        <ActionList>
                          {aegisComponents.map((component) => (
                            <ActionListItem key={component}>{component}</ActionListItem>
                          ))}
                        </ActionList>
                      </div>
                    ) : (
                      <div className={styles.emptyComponents}>No Aegis components found</div>
                    )}
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="subtle" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
`;export{e as default};