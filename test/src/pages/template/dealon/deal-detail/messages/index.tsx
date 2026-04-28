import { Avatar, RangeDateField, Search, Select, StatusLabel, Text } from "@legalforce/aegis-react";
import { useState } from "react";
import styles from "./index.module.css";
import { directionColorMap, type MessageItem, messageItems, senderOptions } from "./mock";

/**
 * 「メッセージ」タブのコンテンツ。
 * 案件に紐づくメール / メッセージ一覧をリスト形式で表示する。
 */
export function MessagesTabContent() {
  const [senderFilter, setSenderFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = messageItems.filter((item) => {
    if (senderFilter && item.sender !== senderFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!item.body.toLowerCase().includes(q) && !item.sender.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <Select
            value={senderFilter}
            onChange={(value) => setSenderFilter(value ?? "")}
            options={senderOptions}
            placeholder="送信者を選択"
            placement="bottom-start"
            clearable
            onClear={() => setSenderFilter("")}
            aria-label="送信者フィルター"
          />
          <RangeDateField aria-label="日付範囲" />
        </div>
        <Search
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="メールを検索（件名、送信）"
          aria-label="メールを検索"
          className={styles.search}
        />
      </div>

      <div className={styles.list}>
        {filteredItems.map((item) => (
          <MessageRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function MessageRow({ item }: { item: MessageItem }) {
  return (
    <div className={styles.row}>
      <Avatar name={item.sender} size="xSmall" />
      <Text variant="body.medium.bold" className={styles.sender}>
        {item.sender}
      </Text>
      <Text variant="body.medium" color="subtle" className={styles.body}>
        {item.body}
      </Text>
      <div className={styles.meta}>
        <StatusLabel variant="outline" color={directionColorMap[item.direction]}>
          {item.direction}
        </StatusLabel>
        <Text variant="body.medium">{item.time}</Text>
      </div>
    </div>
  );
}
