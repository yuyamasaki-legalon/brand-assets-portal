import { LfAt, LfClip } from "@legalforce/aegis-icons";
import { Button, Icon, IconButton, Text, Textarea, Tooltip } from "@legalforce/aegis-react";

export function MessageInput() {
  return (
    <div
      style={{
        padding: "var(--aegis-space-medium)",
        border: "1px solid var(--aegis-color-border-default)",
        borderRadius: "var(--aegis-radius-medium)",
        backgroundColor: "var(--aegis-color-surface-default)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--aegis-space-small)",
        }}
      >
        {/* ツールバー */}
        <div
          style={{
            display: "flex",
            gap: "var(--aegis-space-xxSmall)",
          }}
        >
          <Tooltip title="太字">
            <IconButton variant="plain" size="small" aria-label="太字">
              <Text variant="body.medium.bold">B</Text>
            </IconButton>
          </Tooltip>
          <Tooltip title="取り消し線">
            <IconButton variant="plain" size="small" aria-label="取り消し線">
              <Text variant="body.medium" style={{ textDecoration: "line-through" }}>
                S
              </Text>
            </IconButton>
          </Tooltip>
          <Tooltip title="下線">
            <IconButton variant="plain" size="small" aria-label="下線">
              <Text variant="body.medium" style={{ textDecoration: "underline" }}>
                U
              </Text>
            </IconButton>
          </Tooltip>
        </div>
        <Textarea placeholder="メッセージを入力" />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "var(--aegis-space-xSmall)",
            }}
          >
            <Tooltip title="ファイル添付">
              <IconButton variant="plain" size="small" aria-label="ファイル添付">
                <Icon>
                  <LfClip />
                </Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title="メンション">
              <IconButton variant="plain" size="small" aria-label="メンション">
                <Icon>
                  <LfAt />
                </Icon>
              </IconButton>
            </Tooltip>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--aegis-space-small)",
            }}
          >
            <Text variant="body.small" color="subtle">
              0 / 4000
            </Text>
            <Button variant="solid" disabled>
              投稿
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
