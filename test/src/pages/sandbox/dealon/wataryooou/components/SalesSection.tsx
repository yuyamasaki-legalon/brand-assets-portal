import { LfWarningCircle } from "@legalforce/aegis-icons";
import { Card, CardBody, CardHeader, ContentHeader, Icon, StatusLabel, Text } from "@legalforce/aegis-react";
import { salesData } from "../mock/data";

function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString()}`;
}

export function SalesSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
      <ContentHeader size="small">
        <ContentHeader.Title>売上</ContentHeader.Title>
      </ContentHeader>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--aegis-space-medium)",
        }}
      >
        {/* Current sales performance */}
        <Card>
          <CardBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
              <Text variant="body.small" color="subtle">
                現状の売上実績
              </Text>
              <Text variant="title.large">{formatCurrency(salesData.current.amount)}</Text>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                <Icon color="danger">
                  <LfWarningCircle />
                </Icon>
                <Text variant="body.small" color="danger">
                  目標達成率 {salesData.current.achievementRate}%
                </Text>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Sales forecast */}
        <Card>
          <CardHeader
            trailing={
              <StatusLabel variant="fill" color="red">
                未達見込み
              </StatusLabel>
            }
          >
            <Text variant="body.small" color="subtle">
              今月の売上予測
            </Text>
          </CardHeader>
          <CardBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
              <Text variant="title.large">{formatCurrency(salesData.forecast.amount)}</Text>
              <Text variant="body.small" color="accent.teal">
                目標達成率 {salesData.forecast.achievementRate}% | {formatCurrency(salesData.forecast.gap)}
              </Text>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
