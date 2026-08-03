var e=`import { LfCheck, LfCopy } from "@legalforce/aegis-icons";
import { Button, Drawer, Icon, Select } from "@legalforce/aegis-react";
import { MarkdownRenderer } from "../../pages/markdown-viewer/components/MarkdownRenderer";
import styles from "./floatingSourceCodeViewer.module.css";

interface DocsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mdFileOptions: Array<{ label: string; value: string }>;
  selectedMdFile: string | null;
  onFileSelect: (file: string | null) => void;
  mdContent: string;
  isMdLoading: boolean;
  copiedTab: string | null;
  onCopy: (text: string, tabName: string) => void;
}

export const DocsDrawer = ({
  open,
  onOpenChange,
  mdFileOptions,
  selectedMdFile,
  onFileSelect,
  mdContent,
  isMdLoading,
  copiedTab,
  onCopy,
}: DocsDrawerProps) => {
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      position="end"
      resizable
      width="xLarge"
      minWidth="small"
      maxWidth="xLarge"
      closeOnOutsidePress={false}
      modal={false}
    >
      <Drawer.Header>
        <div className={styles.drawerHeader}>
          <div className={styles.drawerHeaderSelect}>
            <Select
              options={mdFileOptions}
              value={selectedMdFile || undefined}
              onChange={(value) => {
                if (value) {
                  onFileSelect(value);
                }
              }}
            />
          </div>
          <Button
            size="small"
            variant="subtle"
            onClick={() => onCopy(mdContent, "docs")}
            disabled={!mdContent || isMdLoading}
            leading={<Icon size="small">{copiedTab === "docs" ? <LfCheck /> : <LfCopy />}</Icon>}
          >
            {copiedTab === "docs" ? "Copied!" : "Copy"}
          </Button>
        </div>
      </Drawer.Header>
      <Drawer.Body>
        <div className={styles.drawerBody}>
          {isMdLoading ? (
            <div className={styles.drawerLoading}>Loading...</div>
          ) : (
            <MarkdownRenderer content={mdContent} />
          )}
        </div>
      </Drawer.Body>
      <Drawer.Footer>
        <Button variant="subtle" onClick={() => onOpenChange(false)}>
          閉じる
        </Button>
      </Drawer.Footer>
    </Drawer>
  );
};
`;export{e as default};