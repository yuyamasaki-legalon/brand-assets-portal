import {
  Link as AegisLink,
  Button,
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  FormControl,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutFooter,
  PageLayoutHeader,
  Text,
  TextField,
} from "@legalforce/aegis-react";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { findMatchingPattern } from "./data";
import type { ActionButtonsData, ChatState, FormData, InfoCardData, ListData, Message, Widget } from "./types";

/**
 * LangGraph-inspired state management
 *
 * このデモは LangGraph (@langchain/langgraph) の概念を使用しています。
 * LangGraph は、状態ベースのワークフローを構築するためのフレームワークです。
 *
 * 主な概念:
 * - State: ワークフロー全体で共有される状態
 * - Nodes: 状態を変換する関数
 * - Edges: ノード間の遷移を定義
 *
 * このデモでは、フロントエンドで完結するため、シンプルな実装にしていますが、
 * 実際の LangGraph では、複数のノード間で状態を遷移させ、
 * 条件分岐やループを含む複雑なワークフローを構築できます。
 */

// ユーザー入力を処理するノード
function processInput(state: ChatState, userInput: string): ChatState {
  // ユーザーメッセージを追加
  const userMessage: Message = {
    id: `msg-${Date.now()}-user`,
    role: "user",
    content: userInput,
    timestamp: Date.now(),
  };

  // パターンマッチングで応答を決定
  const matchedPattern = findMatchingPattern(userInput);

  // アシスタントメッセージを追加
  const assistantMessage: Message = {
    id: `msg-${Date.now() + 1}-assistant`,
    role: "assistant",
    content: matchedPattern.response,
    timestamp: Date.now() + 1,
  };

  return {
    messages: [...state.messages, userMessage, assistantMessage],
    currentWidget: matchedPattern.widget || null,
    conversationStep: state.conversationStep + 1,
    userInput: "",
  };
}

/**
 * Widget rendering components
 */

function InfoCardWidget({ data }: { data: InfoCardData }) {
  return (
    <Card>
      <CardHeader>
        <Text variant="title.xSmall">{data.title}</Text>
      </CardHeader>
      <CardBody>
        <Text variant="body.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
          {data.description}
        </Text>
        {data.items && data.items.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
            {data.items.map((item) => (
              <div key={item.label} style={{ display: "flex", gap: "var(--aegis-space-small)" }}>
                <Text variant="label.small" style={{ minWidth: "120px" }}>
                  {item.label}:
                </Text>
                <Text variant="body.small">{item.value}</Text>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function FormWidget({ data }: { data: FormData }) {
  return (
    <Card>
      <CardHeader>
        <Text variant="title.xSmall">{data.title}</Text>
      </CardHeader>
      <CardBody>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
          {data.fields.map((field) => (
            <FormControl key={field.label}>
              <FormControl.Label>{field.label}</FormControl.Label>
              <TextField placeholder={field.placeholder} type={field.type} />
            </FormControl>
          ))}
          <Button variant="solid" color="information">
            送信
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

function ListWidget({ data }: { data: ListData }) {
  return (
    <Card>
      <CardHeader>
        <Text variant="title.xSmall">{data.title}</Text>
      </CardHeader>
      <CardBody>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
          {data.items.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "var(--aegis-space-small)",
                borderBottom: "1px solid var(--aegis-color-border-default)",
              }}
            >
              <Text variant="label.small" style={{ display: "block", marginBottom: "2px" }}>
                {item.label}
              </Text>
              {item.description && (
                <Text variant="body.xSmall" style={{ color: "var(--aegis-color-text-subtle)" }}>
                  {item.description}
                </Text>
              )}
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function ActionButtonsWidget({ data }: { data: ActionButtonsData }) {
  return (
    <Card>
      <CardHeader>
        <Text variant="title.xSmall">{data.title}</Text>
      </CardHeader>
      <CardBody>
        <div style={{ display: "flex", flexDirection: "row", gap: "var(--aegis-space-small)", flexWrap: "wrap" }}>
          {data.buttons.map((button) => (
            <Button key={button.action} variant={button.variant || "subtle"} color={button.color || "neutral"}>
              {button.label}
            </Button>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function WidgetRenderer({ widget }: { widget: Widget }) {
  switch (widget.type) {
    case "info-card":
      return <InfoCardWidget data={widget.data as InfoCardData} />;
    case "form":
      return <FormWidget data={widget.data as FormData} />;
    case "list":
      return <ListWidget data={widget.data as ListData} />;
    case "action-buttons":
      return <ActionButtonsWidget data={widget.data as ActionButtonsData} />;
    default:
      return null;
  }
}

/**
 * Main component
 */
export const LangGraphChatWidget = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    currentWidget: null,
    conversationStep: 0,
    userInput: "",
  });
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!inputValue.trim()) return;

      // LangGraph-inspired node execution
      // 実際の LangGraph では、グラフのコンパイルと invoke を通じて実行されます
      const newState = processInput(state, inputValue);
      setState(newState);
      setInputValue("");
    },
    [inputValue, state],
  );

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>LangGraph Chat Widget Demo</ContentHeader.Title>
            <ContentHeader.Description>
              LangGraph を使った会話型デモ。入力に応じて widget が表示されます。 内部で LangGraph
              は使っていませんが、入出力をそれっぽくして実装しています。あくまで参考程度に。
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
            {/* 説明カード */}
            <Card>
              <CardBody>
                <Text variant="body.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
                  試してみてください:
                </Text>
                <ul style={{ marginLeft: "var(--aegis-space-medium)" }}>
                  <li>
                    <Text variant="body.small">「こんにちは」- 挨拶とアクションボタン</Text>
                  </li>
                  <li>
                    <Text variant="body.small">「情報を見せて」- 契約書情報カード</Text>
                  </li>
                  <li>
                    <Text variant="body.small">「登録したい」- フォーム表示</Text>
                  </li>
                  <li>
                    <Text variant="body.small">「一覧を表示」- リスト表示</Text>
                  </li>
                </ul>
              </CardBody>
            </Card>

            {/* チャット履歴 */}
            {state.messages.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                {state.messages.map((message) => (
                  <Card
                    key={message.id}
                    style={{
                      backgroundColor:
                        message.role === "user"
                          ? "var(--aegis-color-surface-secondary)"
                          : "var(--aegis-color-surface-default)",
                    }}
                  >
                    <CardBody>
                      <Text
                        variant="label.small"
                        style={{
                          display: "block",
                          marginBottom: "var(--aegis-space-xSmall)",
                          color: "var(--aegis-color-text-subtle)",
                        }}
                      >
                        {message.role === "user" ? "あなた" : "アシスタント"}
                      </Text>
                      <Text variant="body.small">{message.content}</Text>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}

            {/* Widget表示 */}
            {state.currentWidget && (
              <div style={{ marginTop: "var(--aegis-space-small)" }}>
                <WidgetRenderer widget={state.currentWidget} />
              </div>
            )}

            {/* 入力フォーム */}
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "row", gap: "var(--aegis-space-small)" }}>
                <div style={{ flex: 1 }}>
                  <FormControl>
                    <TextField
                      placeholder="メッセージを入力してください"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                  </FormControl>
                </div>
                <Button type="submit" variant="solid" color="information" disabled={!inputValue.trim()}>
                  送信
                </Button>
              </div>
            </form>
          </div>
        </PageLayoutBody>
        <PageLayoutFooter>
          <AegisLink asChild>
            <Link to="/sandbox">← Back to Sandbox</Link>
          </AegisLink>
        </PageLayoutFooter>
      </PageLayoutContent>
    </PageLayout>
  );
};
