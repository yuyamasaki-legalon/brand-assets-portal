import {
  Link as AegisLink,
  Avatar,
  Button,
  Card,
  CardBody,
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutFooter,
  PageLayoutHeader,
  Text,
  Textarea,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./index.module.css";

type MessagePart = {
  text: string;
  masked?: boolean;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  parts: MessagePart[];
};

const initialMessages: Message[] = [
  {
    id: "1",
    role: "user",
    parts: [{ text: "契約書の当事者情報を教えてください。" }],
  },
  {
    id: "2",
    role: "assistant",
    parts: [
      { text: "契約書の当事者情報は以下の通りです。\n\n甲: " },
      { text: "株式会社リーガルフォース", masked: true },
      { text: "\n代表者: " },
      { text: "山田 太郎", masked: true },
      { text: "\n住所: " },
      { text: "東京都千代田区丸の内1-1-1", masked: true },
      { text: "\n電話番号: " },
      { text: "03-1234-5678", masked: true },
    ],
  },
  {
    id: "3",
    role: "user",
    parts: [{ text: "契約金額と支払い条件は？" }],
  },
  {
    id: "4",
    role: "assistant",
    parts: [
      { text: "契約金額: " },
      { text: "¥12,000,000", masked: true },
      { text: "（税別）\n支払い条件: 毎月末締め翌月末払い\n振込先: " },
      { text: "三菱UFJ銀行 丸の内支店 普通 1234567", masked: true },
    ],
  },
  {
    id: "5",
    role: "user",
    parts: [{ text: "契約期間を確認したいです。" }],
  },
  {
    id: "6",
    role: "assistant",
    parts: [
      { text: "契約期間は " },
      { text: "2025年4月1日", masked: true },
      { text: " から " },
      { text: "2026年3月31日", masked: true },
      { text: " までの1年間です。\n自動更新条項が含まれており、解約通知期限は " },
      { text: "契約終了日の30日前", masked: true },
      { text: " です。" },
    ],
  },
];

export const TextureMaskingChat = () => {
  const [maskEnabled, setMaskEnabled] = useState(true);
  const [messages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>秘匿情報マスキング チャット</ContentHeader.Title>
            <ContentHeader.Description>
              aegis-textures の blocks-outline テクスチャを CSS mask-image
              で適用し、秘匿情報をテクスチャでマスキングするデモ
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div className={styles.container}>
            <div className={styles.controls}>
              <Button variant={maskEnabled ? "solid" : "subtle"} onClick={() => setMaskEnabled(!maskEnabled)}>
                {maskEnabled ? "マスク ON" : "マスク OFF"}
              </Button>
              <Text variant="body.small" color="subtle">
                {maskEnabled ? "秘匿情報がテクスチャでマスキングされています" : "秘匿情報がそのまま表示されています"}
              </Text>
            </div>

            <div className={styles.messageList}>
              {messages.map((message) => (
                <div key={message.id} className={message.role === "user" ? styles.messageRowUser : styles.messageRow}>
                  <Avatar name={message.role === "user" ? "User" : "AI"} size="small" />
                  <Card className={styles.messageCard}>
                    <CardBody>
                      <Text variant="body.small" className={styles.preWrap}>
                        {message.parts.map((part) => (
                          <span
                            key={`${message.id}-${part.text}`}
                            className={maskEnabled && part.masked ? styles.masked : undefined}
                          >
                            {part.text}
                          </span>
                        ))}
                      </Text>
                    </CardBody>
                  </Card>
                </div>
              ))}
            </div>

            <div className={styles.inputArea}>
              <Textarea
                placeholder="メッセージを入力..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={styles.textareaFlex}
              />
              <Button variant="solid" disabled={!inputValue.trim()}>
                送信
              </Button>
            </div>
          </div>
        </PageLayoutBody>
        <PageLayoutFooter>
          <AegisLink asChild>
            <Link to="/sandbox/wataryooou">&larr; Back to wataryooou</Link>
          </AegisLink>
        </PageLayoutFooter>
      </PageLayoutContent>
    </PageLayout>
  );
};
