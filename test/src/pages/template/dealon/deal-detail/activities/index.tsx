import {
  Avatar,
  Search,
  Select,
  StatusLabel,
  Text,
  Timeline,
  TimelineContent,
  TimelineItem,
  TimelinePoint,
} from "@legalforce/aegis-react";
import { useState } from "react";
import styles from "./index.module.css";
import {
  type ActivityItem,
  activityItems,
  actorOptions,
  eventTypeColorMap,
  eventTypeOptions,
  formatDateTime,
  periodOptions,
} from "./mock";

/**
 * 「アクティビティ」タブのコンテンツ。
 * 案件に紐づくアクティビティ一覧をリスト形式で表示する。
 */
export function ActivitiesTabContent() {
  const [eventTypeFilter, setEventTypeFilter] = useState("");
  const [actorFilter, setActorFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = activityItems.filter((item) => {
    if (eventTypeFilter && item.eventType !== eventTypeFilter) return false;
    if (actorFilter && item.actor !== actorFilter) return false;
    if (searchQuery && !item.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <Select
            value={eventTypeFilter}
            onChange={(value) => setEventTypeFilter(value ?? "")}
            options={eventTypeOptions}
            placeholder="イベント種別"
            placement="bottom-start"
            clearable
            onClear={() => setEventTypeFilter("")}
            aria-label="イベント種別フィルター"
          />
          <Select
            value=""
            options={periodOptions}
            placeholder="全期間"
            placement="bottom-start"
            aria-label="期間フィルター"
          />
          <Select
            value={actorFilter}
            onChange={(value) => setActorFilter(value ?? "")}
            options={actorOptions}
            placeholder="すべて"
            placement="bottom-start"
            clearable
            onClear={() => setActorFilter("")}
            aria-label="実行者フィルター"
          />
        </div>
        <Search
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="キーワード検索"
          aria-label="キーワード検索"
          className={styles.search}
        />
      </div>

      <Timeline>
        {filteredItems.map((item) => (
          <ActivityRow key={item.id} item={item} />
        ))}
      </Timeline>
    </div>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  return (
    <TimelineItem>
      <TimelinePoint>
        <Avatar name={item.actor} size="small" color="auto" />
      </TimelinePoint>
      <TimelineContent>
        <div className={styles.row}>
          <Text variant="body.medium" className={styles.body}>
            {item.description}
          </Text>
          <div className={styles.meta}>
            <StatusLabel variant="fill" size="small" color={eventTypeColorMap[item.eventType]}>
              {item.eventType}
            </StatusLabel>
            <Text variant="body.medium">{formatDateTime(item.occurredAt)}</Text>
          </div>
        </div>
      </TimelineContent>
    </TimelineItem>
  );
}
