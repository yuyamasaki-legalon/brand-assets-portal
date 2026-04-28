import { LfPen } from "@legalforce/aegis-icons";
import { Icon, IconButton, Tooltip } from "@legalforce/aegis-react";

/**
 * ペンアイコンの編集ボタン。「基本情報」タブ内の各カードヘッダーで使用する。
 */
export function EditButton({ label }: { label: string }) {
  return (
    <Tooltip title={label}>
      <IconButton variant="plain" size="xSmall" aria-label={label}>
        <Icon>
          <LfPen />
        </Icon>
      </IconButton>
    </Tooltip>
  );
}
