import { LfLayoutHorizonRight } from "@legalforce/aegis-icons";
import { Button, DataTableCell, type DataTableColumnDef, Icon, Text } from "@legalforce/aegis-react";
import { useMemo } from "react";
import { CASE_TYPE_MAPPING, CASE_TYPE_ORDER } from "../constants";
import { reportTranslations } from "../reportTranslations";
import type { AssigneeFilterMode, MemberPerformanceByCaseTypeData, MemberPerformanceData } from "../types";
import { useTranslation } from "./useTranslation";

export interface UsePerformanceDataParams {
  assigneeFilterMode: AssigneeFilterMode;
  caseTypeFilter?: string;
  memberPerformanceData: MemberPerformanceData[];
  memberPerformanceByCaseTypeData: MemberPerformanceByCaseTypeData[];
  onPaneOpenChange: (open: boolean) => void;
  onSelectedMemberChange: (member: string | null) => void;
  onPaneTabIndexChange: (index: number) => void;
}

export function usePerformanceData(params: UsePerformanceDataParams) {
  const { t, locale } = useTranslation(reportTranslations);
  const { assigneeFilterMode, caseTypeFilter, onPaneOpenChange, onSelectedMemberChange, onPaneTabIndexChange } = params;

  // メンバー別テーブルビュー用の列定義
  const memberPerformanceTableColumns = useMemo(() => {
    const columns: DataTableColumnDef<MemberPerformanceData, string | number>[] = [
      {
        id: "name",
        name: t("member"),
        getValue: (row) => row.name,
        renderCell: (info) => (
          <DataTableCell
            trailing={
              <Button
                size="small"
                variant="subtle"
                leading={
                  <Icon>
                    <LfLayoutHorizonRight />
                  </Icon>
                }
                onClick={() => {
                  onPaneTabIndexChange(0); // パフォーマンスタブを開く
                  onSelectedMemberChange(info.row.name);
                  onPaneOpenChange(true);
                }}
              >
                {t("open")}
              </Button>
            }
          >
            <Text variant="body.medium">{info.row.name}</Text>
          </DataTableCell>
        ),
      },
    ];

    // 合計数を計算する関数
    const calculateTotal = (row: MemberPerformanceData, mode: "main" | "sub"): number => {
      if (assigneeFilterMode === "both") {
        if (mode === "main") {
          return (
            (row.onTimeCompletionCount_main ?? 0) +
            (row.overdueCompletionCount_main ?? 0) +
            (row.noDueDateCompletionCount_main ?? 0)
          );
        }
        return (
          (row.onTimeCompletionCount_sub ?? 0) +
          (row.overdueCompletionCount_sub ?? 0) +
          (row.noDueDateCompletionCount_sub ?? 0)
        );
      }
      // assigneeFilterMode === "main" または "sub" の時
      return (row.onTimeCompletionCount ?? 0) + (row.overdueCompletionCount ?? 0) + (row.noDueDateCompletionCount ?? 0);
    };

    // 合計数カラム（常に主担当のみ）
    const totalCol: DataTableColumnDef<MemberPerformanceData, string | number> = {
      id: "total",
      name: assigneeFilterMode === "both" ? `${t("total")}(${t("mainRole")})` : t("total"),
      getValue: (row) => calculateTotal(row, "main"),
      renderCell: (info) => (
        <DataTableCell>
          <Text variant="body.medium">{info.value}</Text>
        </DataTableCell>
      ),
    };

    // 副担当案件数カラム（assigneeFilterMode === "both"の時のみ表示）
    const subAssigneeCaseCountCol: DataTableColumnDef<MemberPerformanceData, string | number> | null =
      assigneeFilterMode === "both"
        ? {
            id: "subAssigneeCaseCount",
            name: `${t("total")}(${t("subRole")})`,
            getValue: (row) => calculateTotal(row, "sub"),
            renderCell: (info) => (
              <DataTableCell>
                <Text variant="body.medium">{info.value}</Text>
              </DataTableCell>
            ),
          }
        : null;

    if (assigneeFilterMode === "both") {
      // 主担当と副担当を別々に表示
      columns.push(totalCol);
      if (subAssigneeCaseCountCol) {
        columns.push(subAssigneeCaseCountCol);
      }
      columns.push(
        {
          id: "onTimeCompletionCount_main",
          name: t("onTimeCompletionMain"),
          getValue: (row) => row.onTimeCompletionCount_main ?? 0,
          renderCell: (info) => (
            <DataTableCell>
              <Text variant="body.medium">{info.value}</Text>
            </DataTableCell>
          ),
        },
        {
          id: "overdueCompletionCount_main",
          name: t("overdueCompletionMain"),
          getValue: (row) => row.overdueCompletionCount_main ?? 0,
          renderCell: (info) => (
            <DataTableCell>
              <Text variant="body.medium">{info.value}</Text>
            </DataTableCell>
          ),
        },
        {
          id: "noDueDateCompletionCount_main",
          name: t("noDueDateCompletionMain"),
          getValue: (row) => row.noDueDateCompletionCount_main ?? 0,
          renderCell: (info) => (
            <DataTableCell>
              <Text variant="body.medium">{info.value}</Text>
            </DataTableCell>
          ),
        },
        {
          id: "onTimeCompletionCount_sub",
          name: t("onTimeCompletionSub"),
          getValue: (row) => row.onTimeCompletionCount_sub ?? 0,
          renderCell: (info) => (
            <DataTableCell>
              <Text variant="body.medium">{info.value}</Text>
            </DataTableCell>
          ),
        },
        {
          id: "overdueCompletionCount_sub",
          name: t("overdueCompletionSub"),
          getValue: (row) => row.overdueCompletionCount_sub ?? 0,
          renderCell: (info) => (
            <DataTableCell>
              <Text variant="body.medium">{info.value}</Text>
            </DataTableCell>
          ),
        },
        {
          id: "noDueDateCompletionCount_sub",
          name: t("noDueDateCompletionSub"),
          getValue: (row) => row.noDueDateCompletionCount_sub ?? 0,
          renderCell: (info) => (
            <DataTableCell>
              <Text variant="body.medium">{info.value}</Text>
            </DataTableCell>
          ),
        },
      );
    } else {
      // 主担当のみまたは副担当のみの場合
      if (assigneeFilterMode === "sub") {
        // 副担当のみの場合、「（副）」を付ける
        columns.push({
          id: "total",
          name: `${t("total")}(${t("subRole")})`,
          getValue: (row) => calculateTotal(row, "sub"),
          renderCell: (info) => (
            <DataTableCell>
              <Text variant="body.medium">{info.value}</Text>
            </DataTableCell>
          ),
        });
        columns.push(
          {
            id: "onTimeCompletionCount",
            name: `${t("onTimeCompletion")}(${t("subRole")})`,
            getValue: (row) => row.onTimeCompletionCount,
            renderCell: (info) => (
              <DataTableCell>
                <Text variant="body.medium">{info.value}</Text>
              </DataTableCell>
            ),
          },
          {
            id: "overdueCompletionCount",
            name: `${t("overdueCompletion")}(${t("subRole")})`,
            getValue: (row) => row.overdueCompletionCount,
            renderCell: (info) => (
              <DataTableCell>
                <Text variant="body.medium">{info.value}</Text>
              </DataTableCell>
            ),
          },
          {
            id: "noDueDateCompletionCount",
            name: `${t("noDueDateCompletion")}(${t("subRole")})`,
            getValue: (row) => row.noDueDateCompletionCount,
            renderCell: (info) => (
              <DataTableCell>
                <Text variant="body.medium">{info.value}</Text>
              </DataTableCell>
            ),
          },
        );
      } else {
        // 主担当のみの場合
        columns.push(totalCol);
        columns.push(
          {
            id: "onTimeCompletionCount",
            name: t("onTimeCompletion"),
            getValue: (row) => row.onTimeCompletionCount,
            renderCell: (info) => (
              <DataTableCell>
                <Text variant="body.medium">{info.value}</Text>
              </DataTableCell>
            ),
          },
          {
            id: "overdueCompletionCount",
            name: t("overdueCompletion"),
            getValue: (row) => row.overdueCompletionCount,
            renderCell: (info) => (
              <DataTableCell>
                <Text variant="body.medium">{info.value}</Text>
              </DataTableCell>
            ),
          },
          {
            id: "noDueDateCompletionCount",
            name: t("noDueDateCompletion"),
            getValue: (row) => row.noDueDateCompletionCount,
            renderCell: (info) => (
              <DataTableCell>
                <Text variant="body.medium">{info.value}</Text>
              </DataTableCell>
            ),
          },
        );
      }
    }

    // 初回返信速度中央値カラムを削除（計画に従って）

    return columns;
  }, [assigneeFilterMode, t, onPaneOpenChange, onSelectedMemberChange, onPaneTabIndexChange]);

  // 案件タイプ別ビュー用のテーブル列定義
  const memberPerformanceByCaseTypeTableColumns = useMemo(() => {
    const columns: DataTableColumnDef<MemberPerformanceByCaseTypeData, string | number>[] = [
      {
        id: "name",
        name: t("member"),
        getValue: (row) => row.name,
        renderCell: (info) => (
          <DataTableCell
            trailing={
              <Button
                size="small"
                variant="subtle"
                leading={
                  <Icon>
                    <LfLayoutHorizonRight />
                  </Icon>
                }
                onClick={() => {
                  onPaneTabIndexChange(0); // パフォーマンスタブを開く
                  onSelectedMemberChange(info.row.name);
                  onPaneOpenChange(true);
                }}
              >
                {t("open")}
              </Button>
            }
          >
            <Text variant="body.medium">{info.row.name}</Text>
          </DataTableCell>
        ),
      },
    ];

    // 合計数を計算する関数
    const calculateTotal = (row: MemberPerformanceByCaseTypeData): number => {
      const filteredCaseTypes = caseTypeFilter && caseTypeFilter !== "すべて" ? [caseTypeFilter] : CASE_TYPE_ORDER;

      if (assigneeFilterMode === "both") {
        return filteredCaseTypes.reduce((sum, caseType) => {
          return (
            sum +
            ((row[`${caseType}_main` as keyof MemberPerformanceByCaseTypeData] as number) || 0) +
            ((row[`${caseType}_sub` as keyof MemberPerformanceByCaseTypeData] as number) || 0)
          );
        }, 0);
      }
      return filteredCaseTypes.reduce((sum, caseType) => {
        return sum + ((row[caseType as keyof MemberPerformanceByCaseTypeData] as number) || 0);
      }, 0);
    };

    // 合計数カラムをメンバー名の次に追加
    columns.push({
      id: "total",
      name:
        assigneeFilterMode === "both"
          ? `${t("total")}(${t("mainRole")})`
          : assigneeFilterMode === "sub"
            ? `${t("total")}(${t("subRole")})`
            : t("total"),
      getValue: (row) => calculateTotal(row),
      renderCell: (info) => (
        <DataTableCell>
          <Text variant="body.medium">{info.value}</Text>
        </DataTableCell>
      ),
    });

    // 副担当案件数カラム（assigneeFilterMode === "both"の時のみ表示、メンバー名の次に追加）
    if (assigneeFilterMode === "both") {
      const calculateSubTotal = (row: MemberPerformanceByCaseTypeData): number => {
        const filteredCaseTypes = caseTypeFilter && caseTypeFilter !== "すべて" ? [caseTypeFilter] : CASE_TYPE_ORDER;
        return filteredCaseTypes.reduce((sum, caseType) => {
          return sum + ((row[`${caseType}_sub` as keyof MemberPerformanceByCaseTypeData] as number) || 0);
        }, 0);
      };

      columns.push({
        id: "subAssigneeCaseCount",
        name: `${t("total")}(${t("subRole")})`,
        getValue: (row) => calculateSubTotal(row),
        renderCell: (info) => (
          <DataTableCell>
            <Text variant="body.medium">{info.value}</Text>
          </DataTableCell>
        ),
      });
    }

    const filteredCaseTypes = caseTypeFilter && caseTypeFilter !== "すべて" ? [caseTypeFilter] : CASE_TYPE_ORDER;

    filteredCaseTypes.forEach((caseType) => {
      const localizedName = CASE_TYPE_MAPPING[locale][caseType] || caseType;
      if (assigneeFilterMode === "both") {
        columns.push(
          {
            id: `${caseType}_main`,
            name: `${localizedName} (${t("mainRole")})`,
            getValue: (row) => (row[`${caseType}_main` as keyof MemberPerformanceByCaseTypeData] as number) || 0,
            renderCell: (info) => (
              <DataTableCell>
                <Text variant="body.medium">{info.value}</Text>
              </DataTableCell>
            ),
          },
          {
            id: `${caseType}_sub`,
            name: `${localizedName} (${t("subRole")})`,
            getValue: (row) => (row[`${caseType}_sub` as keyof MemberPerformanceByCaseTypeData] as number) || 0,
            renderCell: (info) => (
              <DataTableCell>
                <Text variant="body.medium">{info.value}</Text>
              </DataTableCell>
            ),
          },
        );
      } else {
        // 主担当のみまたは副担当のみの場合
        const columnName = assigneeFilterMode === "sub" ? `${localizedName} (${t("subRole")})` : localizedName;
        columns.push({
          id: caseType,
          name: columnName,
          getValue: (row) => (row[caseType as keyof MemberPerformanceByCaseTypeData] as number) || 0,
          renderCell: (info) => (
            <DataTableCell>
              <Text variant="body.medium">{info.value}</Text>
            </DataTableCell>
          ),
        });
      }
    });

    // 初回返信速度中央値カラムを削除（計画に従って）

    return columns;
  }, [assigneeFilterMode, caseTypeFilter, t, locale, onPaneOpenChange, onSelectedMemberChange, onPaneTabIndexChange]);

  return {
    memberPerformanceTableColumns,
    memberPerformanceByCaseTypeTableColumns,
  };
}
