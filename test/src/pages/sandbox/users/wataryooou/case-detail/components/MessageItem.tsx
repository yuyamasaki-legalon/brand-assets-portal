import { LfArrowTurnUpLeft, LfInformationCircle, LfMail } from "@legalforce/aegis-icons";
import { Avatar, Button, Icon, IconButton, Text, Tooltip } from "@legalforce/aegis-react";
import type { TimelineMessage } from "../types";
import { StampPicker } from "./StampPicker";

interface MessageItemProps {
  message: TimelineMessage;
  currentUser: string;
  onStampClick: (messageId: string, stampId: string) => void;
}

export function MessageItem({ message, currentUser, onStampClick }: MessageItemProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "var(--aegis-space-small)",
        paddingBlock: "var(--aegis-space-small)",
        borderTop: "1px solid var(--aegis-color-border-default)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "var(--aegis-space-xxSmall)",
        }}
      >
        {message.type === "mail" && (
          <Icon size="small" color="subtle">
            <LfMail />
          </Icon>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--aegis-space-small)",
          }}
        >
          <Avatar size="small" name={message.sender} />
          <Text variant="body.medium.bold">{message.sender}</Text>
          <Text variant="body.small" color="subtle">
            {message.date}
          </Text>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              gap: "var(--aegis-space-xxSmall)",
            }}
          >
            <StampPicker messageId={message.id} onStampClick={onStampClick} />
            <Tooltip title="詳細">
              <IconButton variant="plain" size="xSmall" aria-label="詳細">
                <Icon size="small">
                  <LfInformationCircle />
                </Icon>
              </IconButton>
            </Tooltip>
            <Button variant="subtle" size="small" leading={LfArrowTurnUpLeft}>
              返信
            </Button>
          </div>
        </div>
        <div style={{ paddingTop: "var(--aegis-space-xSmall)" }}>
          <Text variant="body.medium" style={{ whiteSpace: "pre-wrap" }}>
            {message.content}
          </Text>
        </div>
        {/* スタンプ表示エリア */}
        {message.stamps && message.stamps.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--aegis-space-xSmall)",
              paddingTop: "var(--aegis-space-small)",
            }}
          >
            {message.stamps.map((stamp) => {
              const isCurrentUserStamped = stamp.users.includes(currentUser);
              return (
                <Tooltip key={stamp.id} title={stamp.users.join(", ")} placement="top">
                  <button
                    type="button"
                    onClick={() => onStampClick(message.id, stamp.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--aegis-space-xxSmall)",
                      padding: "var(--aegis-space-xxSmall) var(--aegis-space-xSmall)",
                      borderRadius: "var(--aegis-radius-full)",
                      border: isCurrentUserStamped
                        ? "1px solid var(--aegis-color-border-primary)"
                        : "1px solid var(--aegis-color-border-default)",
                      backgroundColor: isCurrentUserStamped
                        ? "var(--aegis-color-background-primary-xSubtle)"
                        : "var(--aegis-color-background-neutral-xSubtle)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--aegis-color-background-neutral-subtle)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isCurrentUserStamped
                        ? "var(--aegis-color-background-primary-xSubtle)"
                        : "var(--aegis-color-background-neutral-xSubtle)";
                    }}
                  >
                    <Text variant="label.small">{stamp.emoji}</Text>
                    <Text variant="label.small">{stamp.count}</Text>
                  </button>
                </Tooltip>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
