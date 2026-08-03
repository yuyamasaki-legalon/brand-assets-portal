var e=`import { LfCode, LfPaint } from "@legalforce/aegis-icons";
import { Icon, IconButton, Tooltip } from "@legalforce/aegis-react";
import styles from "./floatingSourceCodeViewer.module.css";

interface LauncherProps {
  liveEditorEnabled: boolean;
  onPickEditable: () => void;
  onOpenSettings: () => void;
}

export const Launcher = ({ liveEditorEnabled, onPickEditable, onOpenSettings }: LauncherProps) => {
  return (
    <div data-aegis-editor-ui="true" className={styles.launcher}>
      {liveEditorEnabled && (
        <Tooltip title="画面上の要素をピックして編集 (Shift+Alt+E)">
          <IconButton aria-label="画面上の要素をピックして編集" variant="solid" size="small" onClick={onPickEditable}>
            <Icon size="small">
              <LfPaint />
            </Icon>
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="ソースコード・設定を開く">
        <IconButton aria-label="ソースコード・設定を開く" variant="solid" size="medium" onClick={onOpenSettings}>
          <Icon size="small">
            <LfCode />
          </Icon>
        </IconButton>
      </Tooltip>
    </div>
  );
};
`;export{e as default};