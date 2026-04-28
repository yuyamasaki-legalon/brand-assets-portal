import { DataTableCell, type DataTableColumnDef, Text } from "@legalforce/aegis-react";
import { useMemo } from "react";
import { CASE_TYPE_MAPPING, CASE_TYPE_ORDER } from "../constants";
import { reportTranslations } from "../reportTranslations";
import { useTranslation } from "./useTranslation";

export interface UseCaseCountDataParams {
  viewType: "dueDate" | "caseType";
  visibleMetrics: { 新規案件数: boolean };
  showPreviousYear: boolean;
  caseTypeFilter?: string;
  allPeriodByCaseTypeData: Record<
    string,
    {
      新規案件数: number;
      完了案件数: number;
    }
  >;
  allPeriodByCaseTypePreviousYearData: Record<
    string,
    {
      新規案件数: number;
      完了案件数: number;
    }
  >;
  byCaseTypeOverallPerformanceData: Array<Record<string, number | string>>;
  byCaseTypeMergedPerformanceData: Array<Record<string, number | string>>;
}

export function useCaseCountData(params: UseCaseCountDataParams) {
  const { t, locale } = useTranslation(reportTranslations);
  const {
    viewType,
    visibleMetrics,
    showPreviousYear,
    caseTypeFilter,
    allPeriodByCaseTypeData,
    allPeriodByCaseTypePreviousYearData,
  } = params;

  // すべての期間用の円グラフデータ（案件タイプ別ビュー）
  const allPeriodByCaseTypePieData = useMemo(() => {
    if (viewType !== "caseType") return null;

    const filteredCaseTypes = caseTypeFilter && caseTypeFilter !== "すべて" ? [caseTypeFilter] : CASE_TYPE_ORDER;

    const newCaseData = visibleMetrics.新規案件数
      ? filteredCaseTypes
          .map((caseType) => ({
            name: (CASE_TYPE_MAPPING[locale]?.[caseType] as string) || caseType,
            value: allPeriodByCaseTypeData[caseType]?.新規案件数 || 0,
            originalName: caseType,
          }))
          .filter((item) => item.value > 0)
      : [];

    return { newCaseData };
  }, [viewType, visibleMetrics, allPeriodByCaseTypeData, locale, caseTypeFilter]);

  // すべての期間用の昨年円グラフデータ（案件タイプ別ビュー）
  const allPeriodByCaseTypePreviousYearPieData = useMemo(() => {
    if (viewType !== "caseType") return null;

    const filteredCaseTypes = caseTypeFilter && caseTypeFilter !== "すべて" ? [caseTypeFilter] : CASE_TYPE_ORDER;

    const newCaseData = visibleMetrics.新規案件数
      ? filteredCaseTypes
          .map((caseType) => ({
            name: (CASE_TYPE_MAPPING[locale]?.[caseType] as string) || caseType,
            value: allPeriodByCaseTypePreviousYearData[caseType]?.新規案件数 || 0,
            originalName: caseType,
          }))
          .filter((item) => item.value > 0)
      : [];

    return { newCaseData };
  }, [viewType, visibleMetrics, allPeriodByCaseTypePreviousYearData, locale, caseTypeFilter]);

  // 案件タイプ別テーブル列定義
  const byCaseTypeTableColumns = useMemo(() => {
    const columns: DataTableColumnDef<Record<string, number | string>, string | number>[] = [
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

    const filteredCaseTypes = caseTypeFilter && caseTypeFilter !== "すべて" ? [caseTypeFilter] : CASE_TYPE_ORDER;

    // 新規案件数のカラムを追加
    if (visibleMetrics.新規案件数) {
      // 合計（今年）のカラムを追加
      columns.push({
        id: "新規案件数_合計_今年",
        name: showPreviousYear ? `${t("total")}（${t("currentYear")}）` : t("total"),
        getValue: (row) => {
          return filteredCaseTypes.reduce((sum, caseType) => {
            return sum + ((row[`${caseType}_新規案件数`] as number) || 0);
          }, 0);
        },
        renderCell: (info) => (
          <DataTableCell>
            <Text variant="body.medium">{info.value}</Text>
          </DataTableCell>
        ),
      });

      // 合計（去年）のカラムを追加
      if (showPreviousYear) {
        columns.push({
          id: "新規案件数_合計_昨年",
          name: `${t("total")}（${t("previousYearLabel")}）`,
          getValue: (row) => {
            return filteredCaseTypes.reduce((sum, caseType) => {
              return sum + ((row[`${caseType}_新規案件数_昨年`] as number) || 0);
            }, 0);
          },
          renderCell: (info) => (
            <DataTableCell>
              <Text variant="body.medium">{info.value}</Text>
            </DataTableCell>
          ),
        });
      }

      // 各案件タイプのカラムを追加（今年→去年の順）
      filteredCaseTypes.forEach((caseType) => {
        const localizedName = (CASE_TYPE_MAPPING[locale]?.[caseType] as string) || caseType;
        // 今年のカラム
        columns.push({
          id: `${caseType}_新規案件数`,
          name: showPreviousYear ? `${localizedName}（${t("currentYear")}）` : localizedName,
          getValue: (row) => (row[`${caseType}_新規案件数`] as number) || 0,
          renderCell: (info) => (
            <DataTableCell>
              <Text variant="body.medium">{info.value}</Text>
            </DataTableCell>
          ),
        });
        // 昨年のカラム
        if (showPreviousYear) {
          columns.push({
            id: `${caseType}_新規案件数_昨年`,
            name: `${localizedName}（${t("previousYearLabel")}）`,
            getValue: (row) => (row[`${caseType}_新規案件数_昨年`] as number) || 0,
            renderCell: (info) => (
              <DataTableCell>
                <Text variant="body.medium">{info.value}</Text>
              </DataTableCell>
            ),
          });
        }
      });
    }

    return columns;
  }, [visibleMetrics, showPreviousYear, t, locale, caseTypeFilter]);

  return {
    allPeriodByCaseTypePieData,
    allPeriodByCaseTypePreviousYearPieData,
    byCaseTypeTableColumns,
  };
}
