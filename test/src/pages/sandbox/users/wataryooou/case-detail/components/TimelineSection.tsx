import { LfArrowsRotate, LfComments, LfMail } from "@legalforce/aegis-icons";
import { Icon, IconButton, Switch, Tab, Text, Tooltip } from "@legalforce/aegis-react";
import type { TimelineMessage } from "../types";
import { MessageInput } from "./MessageInput";
import { MessageItem } from "./MessageItem";

interface TimelineSectionProps {
  messages: TimelineMessage[];
  showHistory: boolean;
  currentUser: string;
  onShowHistoryChange: (show: boolean) => void;
  onStampClick: (messageId: string, stampId: string) => void;
}

// Slackアイコン（SVG）
function SlackIcon() {
  return (
    <div
      style={{
        width: 20,
        height: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" role="img" aria-label="Slack icon">
        <title>Slack</title>
        <path
          fill="currentColor"
          d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.124 2.521a2.528 2.528 0 0 1 2.52-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.52V8.834zm-1.271 0a2.528 2.528 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.166 0a2.528 2.528 0 0 1 2.521 2.522v6.312zm-2.521 10.124a2.528 2.528 0 0 1 2.521 2.52A2.528 2.528 0 0 1 15.166 24a2.528 2.528 0 0 1-2.521-2.522v-2.52h2.521zm0-1.271a2.528 2.528 0 0 1-2.521-2.521 2.528 2.528 0 0 1 2.521-2.521h6.312A2.528 2.528 0 0 1 24 15.166a2.528 2.528 0 0 1-2.522 2.521h-6.312z"
        />
      </svg>
    </div>
  );
}

export function TimelineSection({
  messages,
  showHistory,
  currentUser,
  onShowHistoryChange,
  onStampClick,
}: TimelineSectionProps) {
  return (
    <Tab.Group size="large">
      <Tab.List>
        <Tab
          leading={
            <Icon size="medium">
              <LfComments />
            </Icon>
          }
        >
          タイムライン
        </Tab>
        <Tab leading={<SlackIcon />}>Slack</Tab>
        <Tab
          leading={
            <Icon size="medium">
              <LfMail />
            </Icon>
          }
        >
          メール
        </Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>
          {/* メッセージ入力エリア */}
          <MessageInput />

          {/* 履歴表示 / 更新 */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "var(--aegis-space-small)",
              paddingBlock: "var(--aegis-space-small)",
            }}
          >
            <Text variant="body.small">履歴を表示</Text>
            <Switch checked={showHistory} onChange={(e) => onShowHistoryChange(e.target.checked)} />
            <Tooltip title="更新">
              <IconButton variant="plain" size="small" aria-label="更新">
                <Icon>
                  <LfArrowsRotate />
                </Icon>
              </IconButton>
            </Tooltip>
          </div>

          {/* メッセージ履歴 */}
          {messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} currentUser={currentUser} onStampClick={onStampClick} />
          ))}
        </Tab.Panel>
        <Tab.Panel>
          <Text>Slackタブの内容</Text>
        </Tab.Panel>
        <Tab.Panel>
          <Text>メールタブの内容</Text>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}
