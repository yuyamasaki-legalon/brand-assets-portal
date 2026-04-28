import { LfFile } from "@legalforce/aegis-icons";
import { Button, Icon, StatusLabel, Text } from "@legalforce/aegis-react";
import type { LinkedFile, StatusConfig } from "../types";

interface LinkedFileListProps {
  files: LinkedFile[];
  statusConfig: Record<string, StatusConfig>;
}

export function LinkedFileList({ files, statusConfig }: LinkedFileListProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
      {files.map((file) => (
        <div
          key={file.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--aegis-space-small)",
            padding: "var(--aegis-space-small)",
            border: "1px solid var(--aegis-color-border-default)",
            borderRadius: "var(--aegis-radius-medium)",
          }}
        >
          <Icon size="medium">
            <LfFile />
          </Icon>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)", flex: 1 }}>
            <Text variant="body.medium.bold">{file.name}</Text>
            <Text variant="body.small" color="subtle">
              最終更新 {file.updatedAt}
            </Text>
          </div>
          <StatusLabel color={statusConfig[file.status].color}>{statusConfig[file.status].label}</StatusLabel>
          <Button size="small" variant="subtle" onClick={() => window.open(file.url, "_blank", "noopener")}>
            開く
          </Button>
        </div>
      ))}
    </div>
  );
}
