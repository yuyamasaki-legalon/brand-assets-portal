import { LfArrowUpRightFromSquare, LfFile, LfLink } from "@legalforce/aegis-icons";
import { Button, ContentHeader, Icon, StatusLabel, Text } from "@legalforce/aegis-react";
import type { LinkedFile, StatusConfig } from "../types";

interface PrimaryContractFileCardProps {
  file: LinkedFile;
  statusConfig: Record<string, StatusConfig>;
  onOpenLinkedFiles: () => void;
}

export function PrimaryContractFileCard({ file, statusConfig, onOpenLinkedFiles }: PrimaryContractFileCardProps) {
  const handleOpenPrimaryFile = () => {
    window.open(file.url, "_blank", "noopener");
  };

  return (
    <div
      style={{
        padding: "var(--aegis-space-large)",
        borderRadius: "var(--aegis-radius-large)",
        border: "1px solid var(--aegis-color-border-strong)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--aegis-space-medium)",
      }}
    >
      <ContentHeader
        size="small"
        trailing={
          <Button leading={LfLink} variant="subtle" size="small" onClick={onOpenLinkedFiles}>
            リンク済みファイルを開く
          </Button>
        }
      >
        <ContentHeader.Title>契約書本体</ContentHeader.Title>
        <ContentHeader.Description>頻繁に参照するファイルをページ上部にピン留めしました</ContentHeader.Description>
      </ContentHeader>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--aegis-space-medium)",
          padding: "var(--aegis-space-medium)",
          backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
          borderRadius: "var(--aegis-radius-medium)",
        }}
      >
        <Icon size="large">
          <LfFile />
        </Icon>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)", flex: 1 }}>
          <Text variant="body.large.bold">{file.name}</Text>
          <Text variant="body.small" color="subtle">
            最終更新 {file.updatedAt}
          </Text>
        </div>
        <StatusLabel color={statusConfig[file.status].color}>{statusConfig[file.status].label}</StatusLabel>
        <Button trailing={LfArrowUpRightFromSquare} onClick={handleOpenPrimaryFile}>
          開く
        </Button>
      </div>
    </div>
  );
}
