import { Card, CardBody, CardHeader, ContentHeader, StatusLabel, Text } from "@legalforce/aegis-react";
import { alertReports } from "../mock/data";

export function AlertReportSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
        <ContentHeader size="small">
          <ContentHeader.Title>アラートレポート</ContentHeader.Title>
        </ContentHeader>
        <Text variant="body.small" color="subtle">
          最新のアラートレポートです。速やかにチェックしてください
        </Text>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "var(--aegis-space-medium)",
        }}
      >
        {alertReports.map((report) => (
          <Card key={report.title}>
            <CardHeader
              trailing={
                <StatusLabel variant="fill" color={report.badge.color === "danger" ? "red" : "neutral"}>
                  {report.badge.label}
                </StatusLabel>
              }
            >
              <Text variant="label.medium.bold">{report.title}</Text>
            </CardHeader>
            <CardBody>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "var(--aegis-space-xxSmall)" }}>
                  <Text variant="title.large" color={report.count > 0 ? "danger" : undefined}>
                    {report.count}
                  </Text>
                  <Text variant="body.small" color={report.count > 0 ? "danger" : undefined}>
                    件
                  </Text>
                </div>
                <Text variant="body.xSmall">{report.description}</Text>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
