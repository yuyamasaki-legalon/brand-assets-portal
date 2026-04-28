import { LfSend } from "@legalforce/aegis-icons";
import { Button, Icon, Text, Textarea } from "@legalforce/aegis-react";
import type { ChangeEvent, KeyboardEvent } from "react";

interface ThreadComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  compact?: boolean;
  placeholder?: string;
  submitLabel?: string;
  helperText?: string;
}

export const ThreadComposer = ({
  value,
  onChange,
  onSubmit,
  disabled,
  compact = false,
  placeholder = "コメントを入力",
  submitLabel = "投稿",
  helperText,
}: ThreadComposerProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
      {helperText ? (
        <Text variant="body.xSmall" color="subtle">
          {helperText}
        </Text>
      ) : null}
      <Textarea
        value={value}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
        placeholder={`${placeholder}\n機密情報（顧客データ等）は入力しないでください。`}
        minRows={compact ? 2 : 3}
        maxRows={compact ? 4 : 6}
        onKeyDown={(event: KeyboardEvent<HTMLTextAreaElement>) => {
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            onSubmit();
          }
        }}
      />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          color="information"
          size={compact ? "small" : "medium"}
          disabled={disabled || !value.trim()}
          onClick={onSubmit}
          leading={
            <Icon>
              <LfSend />
            </Icon>
          }
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
};
