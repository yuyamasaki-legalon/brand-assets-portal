import type { DataTableColumnDef } from "@legalforce/aegis-react";
import {
  Link as AegisLink,
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  DataTable,
  DataTableCell,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  ProgressBar,
  Tag,
  Text,
} from "@legalforce/aegis-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import type {
  Insight,
  IterationHotspot,
  OverviewCategory,
  PrStatus,
  ServiceDistribution,
  TemplateRanking,
  TimelinePhase,
} from "./data";
import {
  insightsData,
  iterationHotspots,
  overviewData,
  prStatusData,
  serviceDistributionData,
  templateRankingData,
  timelineData,
  unusedTemplates,
} from "./data";

const overviewColumns: DataTableColumnDef<OverviewCategory, string | number>[] = [
  {
    id: "category",
    name: "分類",
    getValue: (row) => row.category,
  },
  {
    id: "count",
    name: "件数",
    getValue: (row) => row.count,
  },
  {
    id: "percentage",
    name: "割合",
    getValue: (row) => row.percentage,
    renderCell: (info) => (
      <DataTableCell>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
          <div style={{ flex: 1 }}>
            <ProgressBar value={info.row.percentage} size="small" />
          </div>
          <Text variant="data.small" style={{ minWidth: 40, textAlign: "right" }}>
            {info.row.percentage}%
          </Text>
        </div>
      </DataTableCell>
    ),
  },
];

const prStatusColumns: DataTableColumnDef<PrStatus, string | number>[] = [
  {
    id: "status",
    name: "ステータス",
    getValue: (row) => row.status,
  },
  {
    id: "count",
    name: "件数",
    getValue: (row) => row.count,
  },
  {
    id: "percentage",
    name: "割合",
    getValue: (row) => row.percentage,
    renderCell: (info) => (
      <DataTableCell>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
          <div style={{ flex: 1 }}>
            <ProgressBar value={info.row.percentage} size="small" color={info.row.color} />
          </div>
          <Text variant="data.small" style={{ minWidth: 48, textAlign: "right" }}>
            {info.row.percentage}%
          </Text>
        </div>
      </DataTableCell>
    ),
  },
];

const rankingColumns: DataTableColumnDef<TemplateRanking, string | number>[] = [
  {
    id: "rank",
    name: "#",
    getValue: (row) => row.rank,
  },
  {
    id: "template",
    name: "テンプレート",
    getValue: (row) => row.template,
  },
  {
    id: "count",
    name: "件数",
    getValue: (row) => row.count,
    sortable: true,
  },
  {
    id: "percentage",
    name: "割合",
    getValue: (row) => row.percentage,
    renderCell: (info) => (
      <DataTableCell>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
          <div style={{ flex: 1 }}>
            <ProgressBar value={info.row.percentage} size="small" />
          </div>
          <Text variant="data.small" style={{ minWidth: 48, textAlign: "right" }}>
            {info.row.percentage}%
          </Text>
        </div>
      </DataTableCell>
    ),
  },
  {
    id: "representativePRs",
    name: "代表PR",
    getValue: (row) => row.representativePRs,
    renderCell: (info) => (
      <DataTableCell>
        <Text variant="body.xSmall" color="subtle">
          {info.row.representativePRs}
        </Text>
      </DataTableCell>
    ),
  },
];

const serviceColumns: DataTableColumnDef<ServiceDistribution, string | number>[] = [
  {
    id: "service",
    name: "サービス",
    getValue: (row) => row.service,
  },
  {
    id: "count",
    name: "件数",
    getValue: (row) => row.count,
  },
  {
    id: "percentage",
    name: "割合",
    getValue: (row) => row.percentage,
    renderCell: (info) => (
      <DataTableCell>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
          <div style={{ flex: 1 }}>
            <ProgressBar
              value={info.row.percentage}
              size="small"
              color={info.row.count === 0 ? "disabled" : "information"}
            />
          </div>
          <Text variant="data.small" style={{ minWidth: 48, textAlign: "right" }}>
            {info.row.percentage}%
          </Text>
        </div>
      </DataTableCell>
    ),
  },
];

const timelineColumns: DataTableColumnDef<TimelinePhase, string | number>[] = [
  {
    id: "phase",
    name: "フェーズ",
    getValue: (row) => row.phase,
    renderCell: (info) => (
      <DataTableCell>
        <Text variant="label.small">{info.row.phase}</Text>
      </DataTableCell>
    ),
  },
  {
    id: "prRange",
    name: "PR範囲",
    getValue: (row) => row.prRange,
  },
  {
    id: "sandboxCount",
    name: "Sandbox数",
    getValue: (row) => row.sandboxCount,
  },
  {
    id: "infraCount",
    name: "Infra数",
    getValue: (row) => row.infraCount,
  },
  {
    id: "topFeature",
    name: "トップ機能",
    getValue: (row) => row.topFeature,
    renderCell: (info) => (
      <DataTableCell>
        <Text variant="body.xSmall">{info.row.topFeature}</Text>
      </DataTableCell>
    ),
  },
  {
    id: "theme",
    name: "テーマ",
    getValue: (row) => row.theme,
    renderCell: (info) => (
      <DataTableCell>
        <Text variant="body.xSmall" color="subtle">
          {info.row.theme}
        </Text>
      </DataTableCell>
    ),
  },
];

const hotspotColumns: DataTableColumnDef<IterationHotspot, string | number>[] = [
  {
    id: "feature",
    name: "機能",
    getValue: (row) => row.feature,
    renderCell: (info) => (
      <DataTableCell>
        <Text variant="label.small">{info.row.feature}</Text>
      </DataTableCell>
    ),
  },
  {
    id: "prCount",
    name: "PR数",
    getValue: (row) => row.prCount,
    sortable: true,
  },
  {
    id: "prRange",
    name: "PR範囲",
    getValue: (row) => row.prRange,
  },
  {
    id: "note",
    name: "備考",
    getValue: (row) => row.note,
    renderCell: (info) => (
      <DataTableCell>
        <Text variant="body.xSmall" color="subtle">
          {info.row.note}
        </Text>
      </DataTableCell>
    ),
  },
];

const insightTagColor: Record<Insight["type"], "teal" | "orange" | "blue"> = {
  highlight: "teal",
  warning: "orange",
  info: "blue",
};

const insightTagLabel: Record<Insight["type"], string> = {
  highlight: "注目",
  warning: "注意",
  info: "情報",
};

export const PrTemplateTrends = () => {
  const insightColumns = useMemo<DataTableColumnDef<Insight, string | number>[]>(
    () => [
      {
        id: "type",
        name: "種別",
        getValue: (row) => row.type,
        renderCell: (info) => (
          <DataTableCell>
            <Tag size="small" color={insightTagColor[info.row.type]} variant="fill">
              {insightTagLabel[info.row.type]}
            </Tag>
          </DataTableCell>
        ),
      },
      {
        id: "title",
        name: "タイトル",
        getValue: (row) => row.title,
        renderCell: (info) => (
          <DataTableCell>
            <Text variant="label.small">{info.row.title}</Text>
          </DataTableCell>
        ),
      },
      {
        id: "description",
        name: "詳細",
        getValue: (row) => row.description,
        renderCell: (info) => (
          <DataTableCell>
            <Text variant="body.xSmall">{info.row.description}</Text>
          </DataTableCell>
        ),
      },
    ],
    [],
  );

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>PR テンプレート利用傾向分析</ContentHeader.Title>
            <ContentHeader.Description>全PR: #1 ~ #219（219件）</ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
            {/* Overview */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">全体概要（219件）</Text>
              </CardHeader>
              <CardBody>
                <DataTable
                  columns={overviewColumns}
                  rows={overviewData}
                  getRowId={(row) => row.category}
                  size="small"
                  highlightRowOnHover={false}
                />
              </CardBody>
            </Card>

            {/* PR Status Distribution */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">PRステータス分布</Text>
              </CardHeader>
              <CardBody>
                <DataTable
                  columns={prStatusColumns}
                  rows={prStatusData}
                  getRowId={(row) => row.status}
                  size="small"
                  highlightRowOnHover={false}
                />
              </CardBody>
            </Card>

            {/* Template Ranking */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">テンプレート利用ランキング（Sandbox PR 174件中）</Text>
              </CardHeader>
              <CardBody>
                <DataTable
                  columns={rankingColumns}
                  rows={templateRankingData}
                  getRowId={(row) => String(row.rank)}
                  size="small"
                  highlightRowOnHover={false}
                />
              </CardBody>
            </Card>

            {/* Service Distribution */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">サービス別分布</Text>
              </CardHeader>
              <CardBody>
                <DataTable
                  columns={serviceColumns}
                  rows={serviceDistributionData}
                  getRowId={(row) => row.service}
                  size="small"
                  highlightRowOnHover={false}
                />
              </CardBody>
            </Card>

            {/* Project Evolution Timeline */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">プロジェクト進化タイムライン</Text>
              </CardHeader>
              <CardBody>
                <DataTable
                  columns={timelineColumns}
                  rows={timelineData}
                  getRowId={(row) => row.phase}
                  size="small"
                  highlightRowOnHover={false}
                />
              </CardBody>
            </Card>

            {/* Iteration Hotspots */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">反復ホットスポット</Text>
              </CardHeader>
              <CardBody>
                <DataTable
                  columns={hotspotColumns}
                  rows={iterationHotspots}
                  getRowId={(row) => row.feature}
                  size="small"
                  highlightRowOnHover={false}
                />
              </CardBody>
            </Card>

            {/* Insights */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">主要インサイト（10件）</Text>
              </CardHeader>
              <CardBody>
                <DataTable
                  columns={insightColumns}
                  rows={insightsData}
                  getRowId={(row) => String(row.id)}
                  size="small"
                  highlightRowOnHover={false}
                />
              </CardBody>
            </Card>

            {/* Unused Templates */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">未使用テンプレート（全期間でSandbox PRなし）</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--aegis-space-xSmall)" }}>
                  {unusedTemplates.map((name) => (
                    <Tag key={name} size="small" color="neutral">
                      {name}
                    </Tag>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          <div style={{ marginTop: "var(--aegis-space-large)" }}>
            <AegisLink asChild>
              <Link to="/sandbox/wataryooou">← Back to wataryooou</Link>
            </AegisLink>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
