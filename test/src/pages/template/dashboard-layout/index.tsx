import {
  LfAngleRightMiddle,
  LfArrowDown,
  LfArrowUp,
  LfBarSparkles,
  LfCheckCircle,
  LfClock,
  LfFilter,
  LfInformationCircle,
  LfWarningTriangle,
} from "@legalforce/aegis-icons";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardLink,
  ContentHeader,
  ContentHeaderTitle,
  EmptyState,
  Icon,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Select,
  Tab,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import type { CSSProperties, FC, ReactNode } from "react";
import { useState } from "react";
import { StartSidebar } from "../../../components/StartSidebar";

// =============================================================================
// Types
// =============================================================================

type KpiItem = {
  label: string;
  value: string;
  change?: { direction: "up" | "down"; value: string };
  accent?: "danger" | "success";
};

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: ReactNode;
};

// =============================================================================
// Mock Data
// =============================================================================

const kpiItems: KpiItem[] = [
  { label: "対応中", value: "42", change: { direction: "up", value: "12%" } },
  { label: "完了", value: "156", change: { direction: "up", value: "8%" }, accent: "success" },
  { label: "期限超過", value: "7", change: { direction: "down", value: "3%" }, accent: "danger" },
  { label: "未割り当て", value: "15" },
];

const recentActivities: ActivityItem[] = [
  {
    id: "1",
    title: "秘密保持契約書のレビューが完了",
    description: "山田太郎が承認しました",
    time: "10分前",
    icon: <LfCheckCircle />,
  },
  {
    id: "2",
    title: "業務委託契約書に新しいコメント",
    description: "佐藤花子: 第3条の修正案を確認してください",
    time: "30分前",
    icon: <LfBarSparkles />,
  },
  {
    id: "3",
    title: "売買基本契約の期限が迫っています",
    description: "更新期限: 2026/03/31",
    time: "1時間前",
    icon: <LfWarningTriangle />,
  },
  {
    id: "4",
    title: "新しい案件が受付されました",
    description: "案件番号: CTR-2026-042",
    time: "2時間前",
    icon: <LfClock />,
  },
];

const periodOptions = [
  { label: "今週", value: "week" },
  { label: "今月", value: "month" },
  { label: "四半期", value: "quarter" },
];

// =============================================================================
// Styles
// =============================================================================

const styles: Record<string, CSSProperties> = {
  contentWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xLarge)",
    inlineSize: "100%",
    maxInlineSize: "var(--aegis-layout-width-x5Large)",
    marginInline: "auto",
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "var(--aegis-space-medium)",
  },
  kpiValue: {
    display: "flex",
    alignItems: "baseline",
    gap: "var(--aegis-space-xSmall)",
  },
  changeIndicator: {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--aegis-space-x3Small)",
  },
  twoColumnGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "var(--aegis-space-medium)",
  },
  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-small)",
  },
  activityItem: {
    display: "flex",
    gap: "var(--aegis-space-small)",
    alignItems: "flex-start",
    padding: "var(--aegis-space-small)",
    borderRadius: "var(--aegis-radius-medium)",
  },
  activityContent: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-x3Small)",
    flex: 1,
  },
  chartPlaceholder: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minBlockSize: 240,
    backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
    borderRadius: "var(--aegis-radius-large)",
  },
  shortcutGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "var(--aegis-space-small)",
  },
};

// =============================================================================
// Sub-components
// =============================================================================

const KpiCard: FC<{ item: KpiItem }> = ({ item }) => (
  <Card>
    <CardBody>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
        <Text variant="label.medium" color="subtle">
          {item.label}
        </Text>
        <div style={styles.kpiValue}>
          <Text variant="title.small" color={item.accent === "danger" ? "danger" : "default"}>
            {item.value}
          </Text>
          {item.change ? (
            <div style={styles.changeIndicator}>
              <Icon size="xSmall" color={item.change.direction === "up" ? "success" : "danger"}>
                {item.change.direction === "up" ? <LfArrowUp /> : <LfArrowDown />}
              </Icon>
              <Text variant="body.xSmall" color={item.change.direction === "up" ? "success" : "danger"}>
                {item.change.value}
              </Text>
            </div>
          ) : null}
        </div>
      </div>
    </CardBody>
  </Card>
);

const ActivityCard: FC = () => (
  <Card>
    <CardHeader>
      <Text variant="title.xSmall">最近のアクティビティ</Text>
    </CardHeader>
    <CardBody>
      <div style={styles.activityList}>
        {recentActivities.map((activity) => (
          <div key={activity.id} style={styles.activityItem}>
            <Icon color="subtle">{activity.icon}</Icon>
            <div style={styles.activityContent}>
              <Text variant="label.medium">{activity.title}</Text>
              <Text variant="body.small" color="subtle">
                {activity.description}
              </Text>
            </div>
            <Text variant="body.xSmall" color="subtle" whiteSpace="nowrap">
              {activity.time}
            </Text>
          </div>
        ))}
      </div>
    </CardBody>
  </Card>
);

const ChartCard: FC<{ title: string; description: string }> = ({ title, description }) => (
  <Card>
    <CardHeader>
      <Text variant="title.xSmall">{title}</Text>
    </CardHeader>
    <CardBody>
      <div style={styles.chartPlaceholder}>
        <div style={{ textAlign: "center" }}>
          <Text variant="body.medium" color="subtle">
            {description}
          </Text>
        </div>
      </div>
    </CardBody>
  </Card>
);

const ShortcutCard: FC<{ title: string; description: string; icon: ReactNode }> = ({ title, description, icon }) => (
  <Card size="small">
    <CardHeader
      leading={
        <div
          style={{
            display: "inline-flex",
            padding: "var(--aegis-space-xxSmall)",
            borderRadius: "var(--aegis-radius-medium)",
            backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
          }}
        >
          <Icon>{icon}</Icon>
        </div>
      }
    >
      <CardLink href="#">
        <Text as="span" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Text variant="label.medium">{title}</Text>
          <Text variant="body.xSmall" color="subtle">
            {description}
          </Text>
        </Text>
      </CardLink>
    </CardHeader>
  </Card>
);

// =============================================================================
// Main Component
// =============================================================================

/**
 * Dashboard Layout Template
 *
 * A generic dashboard pattern featuring:
 * - KPI summary cards with change indicators
 * - Chart/graph placeholder areas
 * - Recent activity feed
 * - Quick action shortcuts
 * - Period filter
 * - Tab-based view switching
 */
export const DashboardLayoutTemplate: FC = () => {
  const [period, setPeriod] = useState("month");

  return (
    <PageLayout>
      <StartSidebar />
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader
            trailing={
              <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
                <Select aria-label="表示期間" options={periodOptions} value={period} onChange={setPeriod} />
                <Tooltip title="フィルター">
                  <Button
                    variant="plain"
                    leading={
                      <Icon>
                        <LfFilter />
                      </Icon>
                    }
                  >
                    フィルター
                  </Button>
                </Tooltip>
              </div>
            }
          >
            <ContentHeaderTitle>ダッシュボード</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>

        <PageLayoutBody>
          <div style={styles.contentWrapper}>
            {/* KPI Summary */}
            <section>
              <div style={styles.kpiGrid}>
                {kpiItems.map((item) => (
                  <KpiCard key={item.label} item={item} />
                ))}
              </div>
            </section>

            {/* Charts & Activity */}
            <Tab.Group>
              <Tab.List bordered={false}>
                <Tab>概要</Tab>
                <Tab>分析</Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
                    <div style={styles.twoColumnGrid}>
                      <ChartCard title="ステータス分布" description="チャートエリア（円グラフ）" />
                      <ChartCard title="月別推移" description="チャートエリア（棒グラフ）" />
                    </div>
                    <ActivityCard />
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
                    <ChartCard title="処理時間の推移" description="チャートエリア（折れ線グラフ）" />
                    <div style={styles.twoColumnGrid}>
                      <ChartCard title="担当者別パフォーマンス" description="チャートエリア（横棒グラフ）" />
                      <ChartCard title="カテゴリー別件数" description="チャートエリア（ドーナツグラフ）" />
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>

            {/* Quick Actions */}
            <section>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                <Text variant="title.xSmall">ショートカット</Text>
                <div style={styles.shortcutGrid}>
                  <ShortcutCard title="新規案件を作成" description="案件受付フォームを開く" icon={<LfBarSparkles />} />
                  <ShortcutCard title="契約書を検索" description="締結済み契約書を検索" icon={<LfFilter />} />
                  <ShortcutCard title="レポートを確認" description="月次レポートを表示" icon={<LfAngleRightMiddle />} />
                </div>
              </div>
            </section>

            {/* Empty state example for no-data scenario */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">通知</Text>
              </CardHeader>
              <CardBody>
                <EmptyState
                  size="small"
                  title="新しい通知はありません"
                  visual={
                    <Icon color="subtle">
                      <LfInformationCircle />
                    </Icon>
                  }
                />
              </CardBody>
            </Card>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};

export default DashboardLayoutTemplate;
