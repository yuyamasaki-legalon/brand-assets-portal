import { Banner, Card, CardBody, SegmentedControl, StatusLabel, Text } from "@legalforce/aegis-react";
import { useState } from "react";
import styles from "./index.module.css";
import {
  type AlertItem,
  type AlertLevel,
  alertFilterOptions,
  alertItems,
  alertSummary,
  levelColorMap,
  levelLabelMap,
  levelVariantMap,
} from "./mock";

/** アラート 1 件分のカード。レベル・カテゴリのラベルと説明文を表示する。 */
function ConcernCard({ item }: { item: AlertItem }) {
  return (
    <Card variant="outline" size="medium">
      <CardBody>
        <div className={styles.cardContent}>
          <div className={styles.cardLabels}>
            <StatusLabel variant={levelVariantMap[item.level]} color={levelColorMap[item.level]}>
              {levelLabelMap[item.level]}
            </StatusLabel>
            <StatusLabel variant="outline" color="neutral">
              {item.category}
            </StatusLabel>
          </div>
          <Text variant="body.medium.bold">{item.title}</Text>
          <Text variant="body.medium" color="subtle">
            {item.description}
          </Text>
        </div>
      </CardBody>
    </Card>
  );
}

/**
 * 「アラート」タブのコンテンツ。
 * 案件に紐づくアラート一覧をレベル別フィルター付きで表示する。
 */
export function AlertsTabContent() {
  const [filterIndex, setFilterIndex] = useState(0);

  const selectedLevel = alertFilterOptions[filterIndex].level;
  const filteredItems = selectedLevel === "all" ? alertItems : alertItems.filter((a) => a.level === selectedLevel);

  const countByLevel = (level: AlertLevel | "all") =>
    level === "all" ? alertItems.length : alertItems.filter((a) => a.level === level).length;

  return (
    <div className={styles.wrapper}>
      <Banner color="warning" closeButton={false}>
        <Text variant="body.medium" whiteSpace="pre-wrap">
          {alertSummary}
        </Text>
      </Banner>

      <div className={styles.filterSection}>
        <SegmentedControl size="small" variant="plain" index={filterIndex} onChange={setFilterIndex}>
          {alertFilterOptions.map((opt) => (
            <SegmentedControl.Button key={opt.level}>
              {opt.label}（{countByLevel(opt.level)}）
            </SegmentedControl.Button>
          ))}
        </SegmentedControl>

        <div className={styles.cardList}>
          {filteredItems.map((item) => (
            <ConcernCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
