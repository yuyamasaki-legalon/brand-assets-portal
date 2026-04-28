import { Code, Text } from "@legalforce/aegis-react";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "../index.module.css";
import type { FileReferenceMatch } from "../types";
import { parseStreamSegments, tokenizeFileReferences } from "../utils/stream";

const renderRichInlineContent = (
  value: string,
  keyPrefix: string,
  workspaceDir: string,
  onOpenFileReference: (reference: FileReferenceMatch) => void,
) => {
  const inlineCodePattern = /`([^`\n]+)`/g;
  const parts: ReactNode[] = [];
  let cursor = 0;
  let matchIndex = 0;

  for (const match of value.matchAll(inlineCodePattern)) {
    const matchStart = match.index ?? 0;
    if (matchStart > cursor) {
      const plainText = value.slice(cursor, matchStart);
      tokenizeFileReferences(plainText, workspaceDir).forEach((token) => {
        if (token.type === "text") {
          parts.push(token.value);
          return;
        }

        parts.push(
          <button
            key={`${keyPrefix}-${token.key}`}
            type="button"
            className={styles.streamFileLink}
            onClick={() => onOpenFileReference(token.value)}
            title={token.value.absolutePath}
          >
            {token.value.displayText}
          </button>,
        );
      });
    }

    parts.push(
      <Code key={`${keyPrefix}-code-${matchIndex}`} className={styles.streamInlineCode}>
        {match[1]}
      </Code>,
    );

    cursor = matchStart + match[0].length;
    matchIndex += 1;
  }

  if (cursor < value.length) {
    const plainText = value.slice(cursor);
    tokenizeFileReferences(plainText, workspaceDir).forEach((token) => {
      if (token.type === "text") {
        parts.push(token.value);
        return;
      }

      parts.push(
        <button
          key={`${keyPrefix}-${token.key}`}
          type="button"
          className={styles.streamFileLink}
          onClick={() => onOpenFileReference(token.value)}
          title={token.value.absolutePath}
        >
          {token.value.displayText}
        </button>,
      );
    });
  }

  return parts.length > 0 ? parts : [value];
};

export const CodexStreamContent = ({
  content,
  isStreaming,
  onOpenFileReference,
  workspaceDir,
}: {
  content: string;
  isStreaming: boolean;
  onOpenFileReference: (reference: FileReferenceMatch) => void;
  workspaceDir: string;
}) => {
  const segments = useMemo(() => parseStreamSegments(content), [content]);

  return (
    <div className={`${styles.chatLogRich} ${isStreaming ? styles.streamingLog : ""}`}>
      {segments.map((segment) => {
        if (segment.type === "code") {
          return (
            <div key={segment.key} className={styles.streamCodeBlock}>
              {segment.language && (
                <div className={styles.streamCodeHeader}>
                  <Code className={styles.streamLanguageChip}>{segment.language}</Code>
                </div>
              )}
              <SyntaxHighlighter
                style={oneDark}
                language={segment.language || "text"}
                PreTag="div"
                wrapLongLines
                customStyle={{
                  background: "transparent",
                  margin: 0,
                  padding: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {segment.content.replace(/\n$/, "")}
              </SyntaxHighlighter>
              {segment.isOpen && (
                <Text variant="body.small" className={styles.streamOpenFenceHint}>
                  code block streaming...
                </Text>
              )}
            </div>
          );
        }

        const lines = segment.content.split("\n");
        let characterOffset = 0;
        return (
          <div key={segment.key} className={styles.streamTextBlock}>
            {lines.map((line) => {
              const lineKey = `${segment.key}-line-${characterOffset}`;
              characterOffset += line.length + 1;

              if (!line) {
                return <div key={lineKey} className={styles.streamSpacer} />;
              }

              return (
                <div key={lineKey} className={styles.streamLine}>
                  <Text variant="body.small">
                    {renderRichInlineContent(line, lineKey, workspaceDir, onOpenFileReference)}
                  </Text>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
