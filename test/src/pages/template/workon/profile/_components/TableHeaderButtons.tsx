import { LfHistory, LfPlusLarge } from "@legalforce/aegis-icons";
import { Button } from "@legalforce/aegis-react";

interface TableHeaderButtonsProps {
  showAdd?: boolean;
  showHistory?: boolean;
}

export function TableHeaderButtons({ showAdd = true, showHistory = true }: TableHeaderButtonsProps) {
  return (
    <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)" }}>
      {showHistory && (
        <Button variant="subtle" color="neutral" size="small" leading={LfHistory}>
          変更履歴
        </Button>
      )}
      {showAdd && (
        <Button variant="subtle" color="neutral" size="small" leading={LfPlusLarge}>
          追加
        </Button>
      )}
    </div>
  );
}
