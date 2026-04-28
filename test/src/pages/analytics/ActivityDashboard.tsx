import { LfArrowDown, LfArrowUp } from "@legalforce/aegis-icons";
import { Card, CardBody, CardHeader, Icon, Text } from "@legalforce/aegis-react";
import type { CSSProperties, FC } from "react";
import { Bar, BarChart, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis, YAxis } from "recharts";
import activityData from "./activity-data.json";

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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
  sectionWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-medium)",
  },
  twoColumnGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "var(--aegis-space-medium)",
    alignItems: "start",
  },
  chartContainer: {
    minBlockSize: 240,
  },
};

// =============================================================================
// Colors
// =============================================================================

const CHART_COLORS = {
  primary: "#3B82F6", // --aegis-color-background-information
  secondary: "#22C55E", // --aegis-color-background-success
  tertiary: "#8B5CF6", // --aegis-color-background-accent
};

// =============================================================================
// KPI Cards
// =============================================================================

function computeWeeklyChange(
  data: { commits: number }[],
  windowSize: number,
): { direction: "up" | "down"; value: string } | undefined {
  if (data.length < windowSize * 2) return undefined;
  const recent = data.slice(-windowSize).reduce((sum, w) => sum + w.commits, 0);
  const previous = data.slice(-windowSize * 2, -windowSize).reduce((sum, w) => sum + w.commits, 0);
  if (previous === 0) return undefined;
  const pct = Math.round(((recent - previous) / previous) * 100);
  if (pct === 0) return undefined;
  return { direction: pct > 0 ? "up" : "down", value: `${Math.abs(pct)}%` };
}

const commitsChange = computeWeeklyChange(activityData.weeklyCommits, 4);

type KpiItem = {
  label: string;
  value: number;
  change?: { direction: "up" | "down"; value: string };
  note?: string;
};

const kpiItems: KpiItem[] = [
  { label: "Sandbox Pages", value: activityData.kpis.totalPages },
  { label: "Commits (This Month)", value: activityData.kpis.commitsThisMonth, change: commitsChange },
  { label: "Active Contributors", value: activityData.kpis.activeContributors },
  { label: "Total PRs", value: activityData.kpis.totalPrs },
  {
    label: "Preview Deploys",
    value: activityData.kpis.previewDeploys,
    note: activityData.previewDeploys.source === "pr-based" ? "PR based est." : undefined,
  },
];

const KpiCards: FC = () => (
  <div style={styles.kpiGrid}>
    {kpiItems.map((item) => (
      <Card key={item.label}>
        <CardBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
            <Text variant="label.medium" color="subtle">
              {item.label}
            </Text>
            <div style={styles.kpiValue}>
              <Text variant="title.small">{item.value}</Text>
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
            {item.note ? (
              <Text variant="body.xSmall" color="subtle">
                {item.note}
              </Text>
            ) : null}
          </div>
        </CardBody>
      </Card>
    ))}
  </div>
);

// =============================================================================
// Weekly Commit Chart
// =============================================================================

const WeeklyCommitChart: FC = () => (
  <Card>
    <CardHeader>
      <Text variant="title.xSmall">Commit Count (Weekly Trend)</Text>
    </CardHeader>
    <CardBody>
      <div style={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={activityData.weeklyCommits} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <RechartsTooltip
              contentStyle={{ borderRadius: 4, fontSize: 12 }}
              formatter={(value?: number) => [`${value ?? 0} commits`, "Commits"]}
            />
            <Bar dataKey="commits" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardBody>
  </Card>
);

// =============================================================================
// Contributor Chart
// =============================================================================

const sortedContributors = [...activityData.contributors].sort((a, b) => b.commits + b.prs - (a.commits + a.prs));
const contributorChartHeight = Math.max(240, sortedContributors.length * 28);

const ContributorChart: FC = () => (
  <Card>
    <CardHeader>
      <Text variant="title.xSmall">Contributor Activity (12-Week Total)</Text>
    </CardHeader>
    <CardBody>
      <div style={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={contributorChartHeight}>
          <BarChart data={sortedContributors} layout="vertical" margin={{ top: 8, right: 8, bottom: 0, left: 80 }}>
            <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={88} />
            <RechartsTooltip contentStyle={{ borderRadius: 4, fontSize: 12 }} />
            <Bar dataKey="commits" stackId="activity" fill={CHART_COLORS.primary} name="Commits" />
            <Bar dataKey="prs" stackId="activity" fill={CHART_COLORS.secondary} name="PRs" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardBody>
  </Card>
);

// =============================================================================
// Weekly Deploys Chart
// =============================================================================

const hasDeployData = activityData.previewDeploys.weekly.length > 0;

const WeeklyDeploysChart: FC = () => (
  <Card>
    <CardHeader>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
        <Text variant="title.xSmall">Deploy Count (Weekly Trend)</Text>
        {activityData.previewDeploys.source !== "pr-based" ? (
          <Text variant="body.xSmall" color="subtle">
            (via {activityData.previewDeploys.source === "cloudflare-workers" ? "Workers" : "Pages"})
          </Text>
        ) : null}
      </div>
    </CardHeader>
    <CardBody>
      {hasDeployData ? (
        <div style={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={activityData.previewDeploys.weekly} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <RechartsTooltip
                contentStyle={{ borderRadius: 4, fontSize: 12 }}
                formatter={(value?: number) => [`${value ?? 0} deploys`, "Deploys"]}
              />
              <Bar dataKey="count" fill={CHART_COLORS.tertiary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div
          style={{
            ...styles.chartContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text variant="body.small" color="subtle">
            CF_ACCOUNT_ID / CLOUDFLARE_API_TOKEN を設定すると表示されます
          </Text>
        </div>
      )}
    </CardBody>
  </Card>
);

// =============================================================================
// Sandbox Area Chart
// =============================================================================

const areaChartData = [
  ...activityData.sandboxPages.byArea.map((a) => ({ name: a.area, pages: a.count })),
  ...activityData.sandboxPages.byUser
    .filter((u) => u.count > 0)
    .slice(0, 8)
    .map((u) => ({ name: u.user, pages: u.count })),
].sort((a, b) => b.pages - a.pages);

const SandboxAreaChart: FC = () => (
  <Card>
    <CardHeader>
      <Text variant="title.xSmall">Sandbox Pages by Category</Text>
    </CardHeader>
    <CardBody>
      <div style={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={areaChartData} layout="vertical" margin={{ top: 8, right: 8, bottom: 0, left: 72 }}>
            <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
            <RechartsTooltip
              contentStyle={{ borderRadius: 4, fontSize: 12 }}
              formatter={(value?: number) => [`${value ?? 0} pages`, "Pages"]}
            />
            <Bar dataKey="pages" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardBody>
  </Card>
);

// =============================================================================
// Main Component
// =============================================================================

const generatedDate = new Date(activityData.generatedAt).toLocaleDateString("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export const ActivityDashboard: FC = () => (
  <div style={styles.contentWrapper}>
    <div style={styles.header}>
      <Text as="h2" variant="title.medium">
        Activity Dashboard
      </Text>
      <Text variant="body.xSmall" color="subtle">
        Last updated: {generatedDate}
      </Text>
    </div>

    <section>
      <KpiCards />
    </section>

    <section style={styles.sectionWrapper}>
      <Text variant="title.xSmall">Activity Trends</Text>
      <div style={styles.twoColumnGrid}>
        <WeeklyCommitChart />
        <WeeklyDeploysChart />
      </div>
    </section>

    <section style={styles.sectionWrapper}>
      <Text variant="title.xSmall">Breakdown</Text>
      <div style={styles.twoColumnGrid}>
        <ContributorChart />
        <SandboxAreaChart />
      </div>
    </section>
  </div>
);
