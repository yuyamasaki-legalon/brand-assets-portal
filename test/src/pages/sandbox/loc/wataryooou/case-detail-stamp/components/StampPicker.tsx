import { LfFaceMoodSmile } from "@legalforce/aegis-icons";
import { Icon, IconButton, Menu, Text, Tooltip } from "@legalforce/aegis-react";
import { AVAILABLE_STAMPS } from "../constants";

interface StampPickerProps {
  messageId: string;
  onStampClick: (messageId: string, stampId: string) => void;
}

export function StampPicker({ messageId, onStampClick }: StampPickerProps) {
  return (
    <Menu placement="bottom-end">
      <Menu.Anchor>
        <Tooltip title="スタンプを追加" placement="top">
          <IconButton variant="plain" size="xSmall" aria-label="スタンプを追加">
            <Icon size="small">
              <LfFaceMoodSmile />
            </Icon>
          </IconButton>
        </Tooltip>
      </Menu.Anchor>
      <Menu.Box width="small">
        <div
          style={{
            padding: "var(--aegis-space-small)",
          }}
        >
          <Text
            variant="label.small"
            color="subtle"
            style={{ marginBottom: "var(--aegis-space-xSmall)", display: "block" }}
          >
            スタンプを選択
          </Text>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "var(--aegis-space-xxSmall)",
            }}
          >
            {AVAILABLE_STAMPS.map((stamp) => (
              <Tooltip key={stamp.id} title={stamp.label} placement="top">
                <button
                  type="button"
                  onClick={() => onStampClick(messageId, stamp.id)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "var(--aegis-space-xSmall)",
                    borderRadius: "var(--aegis-radius-small)",
                    cursor: "pointer",
                    fontSize: "1.25rem",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--aegis-color-background-neutral-subtle)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {stamp.emoji}
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
      </Menu.Box>
    </Menu>
  );
}
