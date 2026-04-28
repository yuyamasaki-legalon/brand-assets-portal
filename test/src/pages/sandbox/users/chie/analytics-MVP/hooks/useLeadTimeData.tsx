import { DataTableCell, type DataTableColumnDef, Text } from "@legalforce/aegis-react";
import { useMemo } from "react";
import { reportTranslations } from "../reportTranslations";
import { useTranslation } from "./useTranslation";

export interface LeadTimeDataRow {
  name: string;
  新規案件数?: number;
  新規案件数_昨年?: number;
  onTimeCompletionCount?: number;
  onTimeCompletionCount_昨年?: number;
  overdueCompletionCount?: number;
  overdueCompletionCount_昨年?: number;
  noDueDateCompletionCount?: number;
  noDueDateCompletionCount_昨年?: number;
  リードタイム中央値: number;
  リードタイム中央値_昨年?: number;
  初回返信速度中央値: number;
  初回返信速度中央値_昨年?: number;
}

export interface UseLeadTimeDataParams {
  visibleMetrics: { リードタイム中央値: boolean; 初回返信速度中央値: boolean };
  showPreviousYear: boolean;
  mergedPerformanceData: LeadTimeDataRow[];
  overallPerformanceData: LeadTimeDataRow[];
}

export function useLeadTimeData(params: UseLeadTimeDataParams) {
  const { t } = useTranslation(reportTranslations);
  const { visibleMetrics, showPreviousYear, mergedPerformanceData, overallPerformanceData } = params;

  // リードタイムグラフ用のテーブル列定義
  const tableColumns = useMemo(() => {
    const columns: DataTableColumnDef<LeadTimeDataRow, string | number>[] = [
      {
        id: "name",
        name: t("month"),
        getValue: (row) => row.name,
        renderCell: (info) => (
          <DataTableCell>
            <Text variant="body.medium">{info.row.name}</Text>
          </DataTableCell>
        ),
      },
    ];

    if (visibleMetrics.リードタイム中央値) {
      columns.push({
        id: "リードタイム中央値",
        name: showPreviousYear ? `${t("leadTimeMedianShort")} (${t("currentYear")})` : t("leadTimeMedianShort"),
        getValue: (row) => row.リードタイム中央値,
        renderCell: (info) => {
          const value = typeof info.value === "number" ? info.value : 0;
          return (
            <DataTableCell>
              <Text variant="body.medium">{value > 0 ? `${value.toFixed(1)} ${t("days")}` : "-"}</Text>
            </DataTableCell>
          );
        },
      });
      if (showPreviousYear) {
        columns.push({
          id: "リードタイム中央値_昨年",
          name: `${t("leadTimeMedianShort")} (${t("previousYearLabel")})`,
          getValue: (row) => row.リードタイム中央値_昨年 ?? 0,
          renderCell: (info) => {
            const value = typeof info.value === "number" ? info.value : 0;
            return (
              <DataTableCell>
                <Text variant="body.medium">{value > 0 ? `${value.toFixed(1)} ${t("days")}` : "-"}</Text>
              </DataTableCell>
            );
          },
        });
      }
    }

    if (visibleMetrics.初回返信速度中央値) {
      columns.push({
        id: "初回返信速度中央値",
        name: showPreviousYear
          ? `${t("firstResponseMedianShort")} (${t("currentYear")})`
          : t("firstResponseMedianShort"),
        getValue: (row) => row.初回返信速度中央値,
        renderCell: (info) => {
          const value = typeof info.value === "number" ? info.value : 0;
          return (
            <DataTableCell>
              <Text variant="body.medium">{value > 0 ? `${value.toFixed(1)} ${t("days")}` : "-"}</Text>
            </DataTableCell>
          );
        },
      });
      if (showPreviousYear) {
        columns.push({
          id: "初回返信速度中央値_昨年",
          name: `${t("firstResponseMedianShort")} (${t("previousYearLabel")})`,
          getValue: (row) => row.初回返信速度中央値_昨年 ?? 0,
          renderCell: (info) => {
            const value = typeof info.value === "number" ? info.value : 0;
            return (
              <DataTableCell>
                <Text variant="body.medium">{value > 0 ? `${value.toFixed(1)} ${t("days")}` : "-"}</Text>
              </DataTableCell>
            );
          },
        });
      }
    }

    return columns;
  }, [visibleMetrics, showPreviousYear, t]);

  // リードタイムグラフ用のmax値を計算
  const maxValue = useMemo(() => {
    const data = showPreviousYear ? mergedPerformanceData : overallPerformanceData;
    let max = 0;

    data.forEach((row) => {
      if (visibleMetrics.リードタイム中央値) {
        max = Math.max(max, row.リードタイム中央値 || 0);
        if (showPreviousYear && row.リードタイム中央値_昨年) {
          max = Math.max(max, row.リードタイム中央値_昨年 || 0);
        }
      }
      if (visibleMetrics.初回返信速度中央値) {
        max = Math.max(max, row.初回返信速度中央値 || 0);
        if (showPreviousYear && row.初回返信速度中央値_昨年) {
          max = Math.max(max, row.初回返信速度中央値_昨年 || 0);
        }
      }
    });

    // 最大値に少し余裕を持たせる（10%増し）
    return max > 0 ? Math.ceil(max * 1.1) : 10;
  }, [mergedPerformanceData, overallPerformanceData, showPreviousYear, visibleMetrics]);

  return {
    tableColumns,
    maxValue,
  };
}
