import { Card, CardBody, CardHeader, ContentHeader, StatusLabel, Text } from "@legalforce/aegis-react";
import { activityCycles } from "../mock/data";

export function ActivityCycleSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
        <ContentHeader size="small">
          <ContentHeader.Title>活動サイクル</ContentHeader.Title>
        </ContentHeader>
        <Text variant="body.small" color="subtle">
          活動サイクルの異常値が見られるレポートです。速やかにネクストアクションを設定してください
        </Text>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "var(--aegis-space-medium)",
        }}
      >
        {activityCycles.map((cycle) => (
          <Card key={cycle.title}>
            <CardHeader
              trailing={
                <StatusLabel variant="fill" color={cycle.badge.color === "danger" ? "red" : "neutral"}>
                  {cycle.badge.label}
                </StatusLabel>
              }
            >
              <Text variant="label.medium.bold">{cycle.title}</Text>
            </CardHeader>
            <CardBody>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                <Text variant="title.large" color={cycle.count > 0 ? "danger" : "subtle"}>
                  {cycle.count}件
                </Text>
                <Text variant="body.xSmall">{cycle.description}</Text>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
