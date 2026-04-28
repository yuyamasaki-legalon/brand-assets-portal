import {
  LfChartBar,
  LfCheck,
  LfFilter,
  LfLayoutHorizonRight,
  LfQuestionCircle,
  LfTable,
} from "@legalforce/aegis-icons";
import {
  ActionList,
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  Form,
  FormControl,
  FormGroup,
  Icon,
  IconButton,
  Menu,
  Popover,
  Select,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { CASE_TYPE_MAPPING, CASE_TYPE_ORDER } from "../constants";
import { useTranslation } from "../hooks/useTranslation";
import { reportTranslations } from "../reportTranslations";
import type { AssigneeFilterMode, DueDateFilter, LeadTimeCategories, LeadTimeCompositionData } from "../types";
import { STATUS_ORDER } from "../types";
import {
  BadgeLabel,
  CustomChartTooltip,
  CustomYAxisTick,
  HorizontalBarWithDivider,
  type LabelListContentProps,
  RightLabel,
  renderCustomLegend,
  STATUS_CATEGORY_STYLES,
  StatusSettingsDialog,
} from "./chart-components";

export interface LeadTimeCompositionCardProps {
  // State
  leadTimeCompositionCaseTypeFilter: string;
  leadTimeCompositionAssigneeFilterMode: AssigneeFilterMode;
  leadTimeCompositionViewMode: "graph" | "table";
  leadTimeCompositionGraphMode: "grouped" | "detailed";
  isLeadTimeCompositionFilterOpen: boolean;
  leadTimeCompositionSortType: "caseCount" | "name";
  leadTimeCompositionSortOrder: "asc" | "desc";
  leadTimeCategories: LeadTimeCategories;
  isStatusSettingsOpen: boolean;
  leadTimeCompositionData: LeadTimeCompositionData[];
  tenantStatusSeriesForTeamBreakdown: Array<{
    key: string;
    name: string;
    color: string;
    borderColor?: string;
    badgeVariant?: "no-bg-white-text" | "no-bg-black-text";
  }>;
  performanceDateRange: { start: Date | null; end: Date | null };
  timeDateRange: { start: Date | null; end: Date | null };
  // Handlers
  onLeadTimeCompositionCaseTypeFilterChange: (filter: string) => void;
  onLeadTimeCompositionAssigneeFilterModeChange: (mode: AssigneeFilterMode) => void;
  onLeadTimeCompositionViewModeChange: (mode: "graph" | "table") => void;
  onLeadTimeCompositionGraphModeChange: (mode: "grouped" | "detailed") => void;
  onIsLeadTimeCompositionFilterOpenChange: (open: boolean) => void;
  onLeadTimeCompositionSortTypeChange: (type: "caseCount" | "name") => void;
  onLeadTimeCompositionSortOrderChange: (order: "asc" | "desc") => void;
  onIsStatusSettingsOpenChange: (open: boolean) => void;
  onHandleSaveCategories: (categories: LeadTimeCategories) => void;
  onTimeDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
  onTimeDateRangeReset: () => void;
  // For CustomYAxisTick
  onPaneOpenChange: (open: boolean) => void;
  onSelectedMemberChange: (member: string | null) => void;
  onPaneTabIndexChange: (index: number) => void;
  activeCaseTypeFilter: string;
  activeDueDateFilter: DueDateFilter;
  activeStatusFilter: string;
  membersWithOverdueCases: string[];
  onPaneCaseTypeFilterChange: (filter: string) => void;
  onPaneDueDateFilterChange: (filter: DueDateFilter) => void;
  onPaneStatusFilterChange: (filter: string) => void;
}

export function LeadTimeCompositionCard(props: LeadTimeCompositionCardProps) {
  const [isLeadTimeCompositionInfoPopoverOpen, setIsLeadTimeCompositionInfoPopoverOpen] = useState(false);
  const [isLeadTimeCompositionInfoPopoverPinned, setIsLeadTimeCompositionInfoPopoverPinned] = useState(false);
  const [isLeadTimeCompositionViewModeMenuOpen, setIsLeadTimeCompositionViewModeMenuOpen] = useState(false);
  const [legendHeight, setLegendHeight] = useState(25);
  const legendContainerRef = useRef<HTMLDivElement>(null);
  const {
    leadTimeCompositionCaseTypeFilter,
    leadTimeCompositionAssigneeFilterMode,
    leadTimeCompositionViewMode,
    isLeadTimeCompositionFilterOpen,
    leadTimeCategories,
    isStatusSettingsOpen,
    leadTimeCompositionData,
    tenantStatusSeriesForTeamBreakdown,
    performanceDateRange,
    timeDateRange,
    onLeadTimeCompositionCaseTypeFilterChange,
    onLeadTimeCompositionAssigneeFilterModeChange,
    onLeadTimeCompositionViewModeChange,
    onIsLeadTimeCompositionFilterOpenChange,
    onIsStatusSettingsOpenChange,
    onHandleSaveCategories,
    onTimeDateRangeChange,
    onTimeDateRangeReset,
    onPaneOpenChange,
    onSelectedMemberChange,
    onPaneTabIndexChange,
    activeCaseTypeFilter,
    activeDueDateFilter,
    activeStatusFilter,
    membersWithOverdueCases,
    onPaneCaseTypeFilterChange,
    onPaneDueDateFilterChange,
    onPaneStatusFilterChange,
  } = props;

  const { t, locale } = useTranslation(reportTranslations);

  const tenantStatusSeries = tenantStatusSeriesForTeamBreakdown ?? [];
  const tenantStatusMap = useMemo(() => {
    return new Map(tenantStatusSeries.map((status) => [status.key, status]));
  }, [tenantStatusSeries]);

  useEffect(() => {
    if (!legendContainerRef.current || leadTimeCompositionViewMode !== "graph") return;

    const updateLegendHeight = () => {
      const legendElement = legendContainerRef.current?.querySelector(".recharts-legend-wrapper");
      if (legendElement) {
        const height = legendElement.getBoundingClientRect().height;
        if (height > 0) {
          setLegendHeight(height);
        }
      }
    };

    const timeoutId = setTimeout(() => {
      updateLegendHeight();
    }, 100);

    const resizeObserver = new ResizeObserver(() => {
      updateLegendHeight();
    });

    resizeObserver.observe(legendContainerRef.current);

    const legendElement = legendContainerRef.current?.querySelector(".recharts-legend-wrapper");
    if (legendElement) {
      resizeObserver.observe(legendElement);
    }

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [leadTimeCompositionViewMode]);

  // 初期値との比較用の関数
  const getInitialDateRange = useMemo(() => {
    const today = new Date();
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0); // 今月末
    const start = new Date(today.getFullYear(), today.getMonth() - 5, 1); // 6ヶ月前の月初
    return { start, end };
  }, []);

  // 集計期間が初期値と異なるかチェック
  const isDateRangeFiltered = useMemo(() => {
    if (!timeDateRange.start || !timeDateRange.end) return false;
    const initial = getInitialDateRange;
    return (
      timeDateRange.start.getTime() !== initial.start.getTime() || timeDateRange.end.getTime() !== initial.end.getTime()
    );
  }, [timeDateRange, getInitialDateRange]);

  // 集計期間をフォーマットする関数
  const formatDateRange = useMemo(() => {
    if (!performanceDateRange.start || !performanceDateRange.end) return "";
    const startYear = performanceDateRange.start.getFullYear();
    const startMonth = performanceDateRange.start.getMonth() + 1;
    const endYear = performanceDateRange.end.getFullYear();
    const endMonth = performanceDateRange.end.getMonth() + 1;
    if (locale === "ja-JP") {
      return `${startYear}/${startMonth} - ${endYear}/${endMonth}`;
    }
    const startMonthName = performanceDateRange.start.toLocaleString(locale, { month: "short" });
    const endMonthName = performanceDateRange.end.toLocaleString(locale, { month: "short" });
    return `${startMonthName} ${startYear} - ${endMonthName} ${endYear}`;
  }, [performanceDateRange, locale]);

  // リードタイム内訳のテーブル列定義
  const leadTimeCompositionTableColumns = useMemo(() => {
    const columns: DataTableColumnDef<LeadTimeCompositionData, string | number>[] = [
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
                  onSelectedMemberChange(info.row.name);
                  onPaneOpenChange(true);
                  onPaneTabIndexChange(0); // パフォーマンスタブを開く
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
    const calculateTotal = (row: LeadTimeCompositionData, mode: "main" | "sub"): number => {
      if (mode === "main") {
        return (row.main_idle || 0) + (row.main_work || 0) + (row.main_wait || 0);
      }
      return (row.sub_work || 0) + (row.sub_wait || 0);
    };

    // 合計数カラム（常に主担当のみ）
    const totalCol: DataTableColumnDef<LeadTimeCompositionData, string | number> = {
      id: "total",
      name: leadTimeCompositionAssigneeFilterMode === "both" ? `${t("total")}(${t("mainRole")})` : t("total"),
      getValue: (row) => calculateTotal(row, "main"),
      renderCell: (info) => {
        const value = typeof info.value === "number" ? info.value : 0;
        return (
          <DataTableCell>
            <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
          </DataTableCell>
        );
      },
    };

    // 副担当案件数カラム（leadTimeCompositionAssigneeFilterMode === "both"の時のみ表示）
    const subAssigneeCaseCountCol: DataTableColumnDef<LeadTimeCompositionData, string | number> | null =
      leadTimeCompositionAssigneeFilterMode === "both"
        ? {
            id: "subAssigneeCaseCount",
            name: `${t("total")}(${t("subRole")})`,
            getValue: (row) => calculateTotal(row, "sub"),
            renderCell: (info) => {
              const value = typeof info.value === "number" ? info.value : 0;
              return (
                <DataTableCell>
                  <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
                </DataTableCell>
              );
            },
          }
        : null;

    if (leadTimeCompositionAssigneeFilterMode === "both") {
      // 主担当と副担当を別々に表示
      // 合計（主）→ステータス1（主）→…→合計（副）→ステータス1（副）→…の順番
      columns.push(totalCol);
      columns.push(
        {
          id: "main_idle",
          name: t("idleMain"),
          getValue: (row) => row.main_idle,
          renderCell: (info) => {
            const value = typeof info.value === "number" ? info.value : 0;
            return (
              <DataTableCell>
                <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
              </DataTableCell>
            );
          },
        },
        {
          id: "main_work",
          name: t("workMain"),
          getValue: (row) => row.main_work,
          renderCell: (info) => {
            const value = typeof info.value === "number" ? info.value : 0;
            return (
              <DataTableCell>
                <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
              </DataTableCell>
            );
          },
        },
        {
          id: "main_wait",
          name: t("waitMain"),
          getValue: (row) => row.main_wait,
          renderCell: (info) => {
            const value = typeof info.value === "number" ? info.value : 0;
            return (
              <DataTableCell>
                <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
              </DataTableCell>
            );
          },
        },
      );
      // 副担当の合計とステータスを後に追加
      if (subAssigneeCaseCountCol) {
        columns.push(subAssigneeCaseCountCol);
      }
      columns.push(
        {
          id: "sub_work",
          name: t("workSub"),
          getValue: (row) => row.sub_work,
          renderCell: (info) => {
            const value = typeof info.value === "number" ? info.value : 0;
            return (
              <DataTableCell>
                <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
              </DataTableCell>
            );
          },
        },
        {
          id: "sub_wait",
          name: t("waitSub"),
          getValue: (row) => row.sub_wait,
          renderCell: (info) => {
            const value = typeof info.value === "number" ? info.value : 0;
            return (
              <DataTableCell>
                <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
              </DataTableCell>
            );
          },
        },
      );
    } else if (leadTimeCompositionAssigneeFilterMode === "main") {
      // 主担当のみ表示（「（主）」を付けない）
      columns.push(totalCol);
      columns.push(
        {
          id: "main_idle",
          name: t("idle"),
          getValue: (row) => row.main_idle,
          renderCell: (info) => {
            const value = typeof info.value === "number" ? info.value : 0;
            return (
              <DataTableCell>
                <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
              </DataTableCell>
            );
          },
        },
        {
          id: "main_work",
          name: t("work"),
          getValue: (row) => row.main_work,
          renderCell: (info) => {
            const value = typeof info.value === "number" ? info.value : 0;
            return (
              <DataTableCell>
                <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
              </DataTableCell>
            );
          },
        },
        {
          id: "main_wait",
          name: t("wait"),
          getValue: (row) => row.main_wait,
          renderCell: (info) => {
            const value = typeof info.value === "number" ? info.value : 0;
            return (
              <DataTableCell>
                <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
              </DataTableCell>
            );
          },
        },
      );
    } else {
      // 副担当のみ表示
      if (subAssigneeCaseCountCol) {
        columns.push(subAssigneeCaseCountCol);
      }
      columns.push(
        {
          id: "sub_work",
          name: t("workSub"),
          getValue: (row) => row.sub_work,
          renderCell: (info) => {
            const value = typeof info.value === "number" ? info.value : 0;
            return (
              <DataTableCell>
                <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
              </DataTableCell>
            );
          },
        },
        {
          id: "sub_wait",
          name: t("waitSub"),
          getValue: (row) => row.sub_wait,
          renderCell: (info) => {
            const value = typeof info.value === "number" ? info.value : 0;
            return (
              <DataTableCell>
                <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
              </DataTableCell>
            );
          },
        },
      );
    }

    // 初回返信速度中央値
    columns.push({
      id: "medianFirstReplyTime",
      name: t("firstResponseMedianShort"),
      getValue: (row) => row.medianFirstReplyTime,
      renderCell: (info) => {
        const value = typeof info.value === "number" ? info.value : 0;
        return (
          <DataTableCell>
            <Text variant="body.medium">{value > 0 ? `${value.toFixed(1)} ${t("days")}` : "-"}</Text>
          </DataTableCell>
        );
      },
    });

    return columns;
  }, [leadTimeCompositionAssigneeFilterMode, t, onSelectedMemberChange, onPaneOpenChange, onPaneTabIndexChange]);

  return (
    <>
      <Card variant="fill" style={{ flex: "1 0 100%" }}>
        <CardBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)", alignItems: "center" }}>
                  <Text variant="body.medium.bold">{t("leadTime")}</Text>
                  <Popover
                    open={isLeadTimeCompositionInfoPopoverOpen}
                    onOpenChange={(open) => {
                      setIsLeadTimeCompositionInfoPopoverOpen(open);
                      if (!open) {
                        setIsLeadTimeCompositionInfoPopoverPinned(false);
                      }
                    }}
                    arrow
                    placement="bottom-start"
                    closeOnBlur={true}
                  >
                    <Popover.Anchor>
                      <IconButton
                        variant="plain"
                        size="small"
                        aria-label={t("leadTime")}
                        icon={LfQuestionCircle}
                        onMouseEnter={() => {
                          if (!isLeadTimeCompositionInfoPopoverPinned) {
                            setIsLeadTimeCompositionInfoPopoverOpen(true);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isLeadTimeCompositionInfoPopoverPinned) {
                            setIsLeadTimeCompositionInfoPopoverOpen(false);
                          }
                        }}
                        onClickCapture={(e) => {
                          e.stopPropagation();
                          setIsLeadTimeCompositionInfoPopoverOpen(true);
                          setIsLeadTimeCompositionInfoPopoverPinned(true);
                        }}
                      />
                    </Popover.Anchor>
                    <Popover.Content width="small">
                      <Popover.Body>
                        <Text variant="body.small">{t("memberByDescription")}</Text>
                      </Popover.Body>
                    </Popover.Content>
                  </Popover>
                </div>
                {formatDateRange && (
                  <Text variant="body.small" style={{ color: "var(--aegis-color-text-secondary)" }}>
                    {formatDateRange}
                  </Text>
                )}
              </div>
              <div style={{ display: "flex", gap: "var(--aegis-space-small)", alignItems: "center" }}>
                <ButtonGroup variant="plain" size="medium">
                  <Popover
                    open={isLeadTimeCompositionFilterOpen}
                    onOpenChange={onIsLeadTimeCompositionFilterOpenChange}
                    placement="bottom-end"
                  >
                    <Popover.Anchor>
                      <Tooltip title={t("filter")}>
                        <IconButton
                          variant={
                            leadTimeCompositionCaseTypeFilter !== "すべて" || isDateRangeFiltered ? "subtle" : "plain"
                          }
                          color={
                            leadTimeCompositionCaseTypeFilter !== "すべて" || isDateRangeFiltered
                              ? "information"
                              : undefined
                          }
                          size="medium"
                          aria-label={t("filter")}
                        >
                          <Badge
                            color="information"
                            invisible={leadTimeCompositionCaseTypeFilter === "すべて" && !isDateRangeFiltered}
                          >
                            <Icon>
                              <LfFilter />
                            </Icon>
                          </Badge>
                        </IconButton>
                      </Tooltip>
                    </Popover.Anchor>
                    <Popover.Content width="medium">
                      <Popover.Body>
                        <Form>
                          <FormControl orientation="vertical">
                            <FormControl.Label>{t("caseType")}</FormControl.Label>
                            <Select
                              size="medium"
                              value={leadTimeCompositionCaseTypeFilter}
                              onChange={onLeadTimeCompositionCaseTypeFilterChange}
                              options={[
                                { label: t("all"), value: "すべて" },
                                ...CASE_TYPE_ORDER.map((type) => ({
                                  label: CASE_TYPE_MAPPING[locale][type] || type,
                                  value: type,
                                })),
                              ]}
                            />
                          </FormControl>
                          <FormControl orientation="vertical">
                            <FormControl.Label>{t("aggregationPeriod")}</FormControl.Label>
                            <FormGroup>
                              <FormControl>
                                <Select
                                  size="medium"
                                  placeholder={t("startMonth")}
                                  value={
                                    timeDateRange.start
                                      ? locale === "ja-JP"
                                        ? `${timeDateRange.start.getFullYear()}/${timeDateRange.start.getMonth() + 1}`
                                        : `${timeDateRange.start.toLocaleString(locale, { month: "short" })} ${timeDateRange.start.getFullYear()}`
                                      : undefined
                                  }
                                  onChange={(value) => {
                                    if (value) {
                                      let year: number;
                                      let month: number;
                                      if (locale === "ja-JP") {
                                        [year, month] = value.split("/").map((s) => parseInt(s, 10));
                                      } else {
                                        // valueは日本語形式（"2025/1"）を保持
                                        [year, month] = value.split("/").map((s) => parseInt(s, 10));
                                      }
                                      const newStart = new Date(year, month - 1, 1);

                                      // 終了月が既に選択されている場合、1年以内かチェック
                                      if (timeDateRange.end) {
                                        const monthsDiff =
                                          (timeDateRange.end.getFullYear() - newStart.getFullYear()) * 12 +
                                          (timeDateRange.end.getMonth() - newStart.getMonth());
                                        if (monthsDiff > 12) {
                                          // 1年を超える場合は、終了月を開始月から1年後の月末に設定
                                          const maxEnd = new Date(
                                            newStart.getFullYear() + 1,
                                            newStart.getMonth() + 1,
                                            0,
                                          );
                                          onTimeDateRangeChange({ start: newStart, end: maxEnd });
                                          return;
                                        }
                                      }

                                      onTimeDateRangeChange({ ...timeDateRange, start: newStart });
                                    } else {
                                      onTimeDateRangeChange({ ...timeDateRange, start: null });
                                    }
                                  }}
                                  options={(() => {
                                    const options: Array<{ label: string; value: string; disabled?: boolean }> = [];
                                    const today = new Date();
                                    // 終了月が選択されている場合、開始月から1年以内の範囲のみ選択可能
                                    const maxStart = timeDateRange.end
                                      ? new Date(timeDateRange.end.getFullYear(), timeDateRange.end.getMonth() - 12, 1)
                                      : null;
                                    // 過去24ヶ月分のオプションを生成
                                    for (let i = 23; i >= 0; i--) {
                                      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
                                      const year = date.getFullYear();
                                      const month = date.getMonth() + 1;
                                      const value = `${year}/${month}`;
                                      const label =
                                        locale === "ja-JP"
                                          ? value
                                          : `${date.toLocaleString(locale, { month: "short" })} ${year}`;
                                      const disabled = maxStart ? date < maxStart : false;
                                      options.push({ label, value, disabled });
                                    }
                                    return options;
                                  })()}
                                />
                              </FormControl>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Text variant="body.small">-</Text>
                              </div>
                              <FormControl>
                                <Select
                                  size="medium"
                                  placeholder={t("endMonth")}
                                  value={
                                    timeDateRange.end
                                      ? locale === "ja-JP"
                                        ? `${timeDateRange.end.getFullYear()}/${timeDateRange.end.getMonth() + 1}`
                                        : `${timeDateRange.end.toLocaleString(locale, { month: "short" })} ${timeDateRange.end.getFullYear()}`
                                      : undefined
                                  }
                                  onChange={(value) => {
                                    if (value) {
                                      let year: number;
                                      let month: number;
                                      if (locale === "ja-JP") {
                                        [year, month] = value.split("/").map((s) => parseInt(s, 10));
                                      } else {
                                        // valueは日本語形式（"2025/1"）を保持
                                        [year, month] = value.split("/").map((s) => parseInt(s, 10));
                                      }
                                      const newEnd = new Date(year, month, 0); // 月末

                                      // 開始月が既に選択されている場合、1年以内かチェック
                                      if (timeDateRange.start) {
                                        const monthsDiff =
                                          (newEnd.getFullYear() - timeDateRange.start.getFullYear()) * 12 +
                                          (newEnd.getMonth() - timeDateRange.start.getMonth());
                                        if (monthsDiff > 12) {
                                          // 1年を超える場合は、開始月から1年後の月末に設定
                                          const maxEnd = new Date(
                                            timeDateRange.start.getFullYear() + 1,
                                            timeDateRange.start.getMonth() + 1,
                                            0,
                                          );
                                          onTimeDateRangeChange({ ...timeDateRange, end: maxEnd });
                                          return;
                                        }
                                      }

                                      onTimeDateRangeChange({ ...timeDateRange, end: newEnd });
                                    } else {
                                      onTimeDateRangeChange({ ...timeDateRange, end: null });
                                    }
                                  }}
                                  options={(() => {
                                    const options: Array<{ label: string; value: string; disabled?: boolean }> = [];
                                    const today = new Date();
                                    // 開始月が選択されている場合、開始月から1年以内の範囲のみ選択可能
                                    const minEnd = timeDateRange.start
                                      ? new Date(timeDateRange.start.getFullYear(), timeDateRange.start.getMonth(), 1)
                                      : null;
                                    const maxEnd = timeDateRange.start
                                      ? new Date(
                                          timeDateRange.start.getFullYear() + 1,
                                          timeDateRange.start.getMonth() + 1,
                                          0,
                                        )
                                      : null;
                                    // 過去24ヶ月分のオプションを生成
                                    for (let i = 23; i >= 0; i--) {
                                      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
                                      const year = date.getFullYear();
                                      const month = date.getMonth() + 1;
                                      const value = `${year}/${month}`;
                                      const label =
                                        locale === "ja-JP"
                                          ? value
                                          : `${date.toLocaleString(locale, { month: "short" })} ${year}`;
                                      const dateEnd = new Date(year, month, 0); // 月末
                                      const disabled = minEnd && maxEnd ? dateEnd < minEnd || dateEnd > maxEnd : false;
                                      options.push({ label, value, disabled });
                                    }
                                    return options;
                                  })()}
                                />
                              </FormControl>
                            </FormGroup>
                          </FormControl>
                          <div>
                            <Button variant="subtle" size="small" onClick={() => onIsStatusSettingsOpenChange(true)}>
                              {t("statusCategorySettings")}
                            </Button>
                          </div>
                        </Form>
                      </Popover.Body>
                    </Popover.Content>
                  </Popover>
                  {(leadTimeCompositionCaseTypeFilter !== "すべて" || isDateRangeFiltered) && (
                    <Button
                      variant="subtle"
                      size="medium"
                      onClick={() => {
                        onLeadTimeCompositionCaseTypeFilterChange("すべて");
                        onTimeDateRangeReset();
                      }}
                    >
                      {t("reset")}
                    </Button>
                  )}
                  <Menu
                    open={isLeadTimeCompositionViewModeMenuOpen}
                    onOpenChange={setIsLeadTimeCompositionViewModeMenuOpen}
                    placement="bottom-end"
                  >
                    <Menu.Anchor>
                      <Tooltip title={leadTimeCompositionViewMode === "graph" ? t("table") : t("graph")}>
                        <IconButton
                          variant="plain"
                          size="medium"
                          aria-label={leadTimeCompositionViewMode === "graph" ? t("graph") : t("table")}
                          icon={leadTimeCompositionViewMode === "graph" ? LfChartBar : LfTable}
                        />
                      </Tooltip>
                    </Menu.Anchor>
                    <Menu.Box width="auto">
                      <ActionList size="large">
                        <ActionList.Item
                          selected={leadTimeCompositionViewMode === "graph"}
                          onClick={() => {
                            onLeadTimeCompositionViewModeChange("graph");
                            setIsLeadTimeCompositionViewModeMenuOpen(false);
                          }}
                        >
                          <ActionList.Body
                            leading={
                              <Icon>
                                <LfChartBar />
                              </Icon>
                            }
                            trailing={
                              leadTimeCompositionViewMode === "graph" ? (
                                <Icon>
                                  <LfCheck />
                                </Icon>
                              ) : undefined
                            }
                          >
                            {t("graph")}
                          </ActionList.Body>
                        </ActionList.Item>
                        <ActionList.Item
                          selected={leadTimeCompositionViewMode === "table"}
                          onClick={() => {
                            onLeadTimeCompositionViewModeChange("table");
                            setIsLeadTimeCompositionViewModeMenuOpen(false);
                          }}
                        >
                          <ActionList.Body
                            leading={
                              <Icon>
                                <LfTable />
                              </Icon>
                            }
                            trailing={
                              leadTimeCompositionViewMode === "table" ? (
                                <Icon>
                                  <LfCheck />
                                </Icon>
                              ) : undefined
                            }
                          >
                            {t("table")}
                          </ActionList.Body>
                        </ActionList.Item>
                      </ActionList>
                    </Menu.Box>
                  </Menu>
                </ButtonGroup>
                <Select
                  variant="gutterless"
                  size="medium"
                  value={leadTimeCompositionAssigneeFilterMode}
                  onChange={(value) => onLeadTimeCompositionAssigneeFilterModeChange(value as AssigneeFilterMode)}
                  options={[
                    { label: t("mainAssigneeOnly"), value: "main" },
                    { label: t("subAssigneeOnly"), value: "sub" },
                    { label: t("mainAndSubAssignee"), value: "both" },
                  ]}
                  style={{ width: "auto" }}
                  placement="bottom-end"
                />
              </div>
            </div>

            {leadTimeCompositionViewMode === "graph" ? (
              (() => {
                // 進行中の案件状況と同じ高さ計算ロジック
                const barCategoryGap = 16; // カテゴリ間のギャップ（px）
                const barSize = 32;
                const barGap = 4; // 主担当と副担当の間のギャップ
                const barSegmentGap = 1; // 積み上げバーのセグメント間の白い余白（px）
                const baseRowHeight = leadTimeCompositionAssigneeFilterMode === "both" ? barSize * 2 + barGap : barSize;
                const gapHeight = barCategoryGap;
                const marginHeight = 24 + 24; // top + bottom
                const xAxisHeight = 22; // tickMargin + tick height
                const fixedElementsHeight = marginHeight + xAxisHeight + legendHeight;
                const rowCount = leadTimeCompositionData?.length ?? 0;
                const calculatedHeight =
                  rowCount * baseRowHeight + Math.max(0, rowCount - 1) * gapHeight + fixedElementsHeight;

                return (
                  <div
                    ref={legendContainerRef}
                    style={{
                      height: Math.max(240, calculatedHeight),
                      maxHeight: "640px",
                      overflowY: "auto",
                      background: "var(--aegis-color-background-default)",
                      padding: "var(--aegis-space-xLarge)",
                      borderRadius: "var(--aegis-radius-large)",
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={leadTimeCompositionData}
                        layout="vertical"
                        margin={{ right: 16 }}
                        accessibilityLayer
                        barCategoryGap={barCategoryGap}
                        barSize={32}
                        barGap={4}
                      >
                        <CartesianGrid horizontal={false} vertical={false} stroke="#e2e8f0" />
                        <XAxis
                          type="number"
                          allowDecimals={false}
                          axisLine={false}
                          tickLine={false}
                          tickMargin={10}
                          tick={{ fill: "#000", fontSize: 12 }}
                          hide
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={160}
                          interval={0}
                          axisLine={false}
                          tickLine={false}
                          tickMargin={0}
                          tick={(tickProps) => (
                            <CustomYAxisTick
                              {...tickProps}
                              onPaneOpenChange={onPaneOpenChange}
                              onSelectedMemberChange={onSelectedMemberChange}
                              onPaneTabIndexChange={onPaneTabIndexChange}
                              membersWithOverdueCases={membersWithOverdueCases}
                              activeCaseTypeFilter={activeCaseTypeFilter}
                              onPaneCaseTypeFilterChange={onPaneCaseTypeFilterChange}
                              activeDueDateFilter={activeDueDateFilter}
                              onPaneDueDateFilterChange={onPaneDueDateFilterChange}
                              activeStatusFilter={activeStatusFilter}
                              onPaneStatusFilterChange={onPaneStatusFilterChange}
                              assigneeFilterMode={leadTimeCompositionAssigneeFilterMode}
                              showOverdueAlert={false}
                              locale={locale}
                            />
                          )}
                        />
                        <RechartsTooltip
                          content={
                            <CustomChartTooltip
                              locale={locale}
                              assigneeFilterMode={leadTimeCompositionAssigneeFilterMode}
                            />
                          }
                          shared={true}
                          cursor={{ fill: "#f1f5f9" }}
                          wrapperStyle={{ outline: "none", transition: "none" }}
                          animationDuration={0}
                        />
                        <Legend
                          content={renderCustomLegend({
                            caseStatusView: "status",
                            tenantStatusSeriesForTeamBreakdown: tenantStatusSeries,
                            locale,
                          })}
                        />
                        {/* ステータス別ビュー: 副担当のバーを先にレンダリング（bothモードの時、下に表示される） */}
                        {STATUS_ORDER.filter((status) => {
                          // 非表示（IGNORE）に該当するステータスは表示しない
                          return !(leadTimeCategories.SUB.IGNORE as readonly string[]).includes(status.key);
                        })
                          .filter(
                            () =>
                              leadTimeCompositionAssigneeFilterMode === "sub" ||
                              leadTimeCompositionAssigneeFilterMode === "both",
                          )
                          .map((status, index, array) => {
                            const isLast = index === array.length - 1;
                            const dataKey = `sub_${status.key}` as keyof LeadTimeCompositionData;
                            const statusSeries = tenantStatusMap.get(status.key);
                            const statusName = statusSeries?.name ?? status.name;
                            const baseColor = statusSeries?.color ?? status.color;
                            return (
                              <Bar
                                key={dataKey}
                                dataKey={dataKey}
                                name={statusName}
                                stackId="sub"
                                fill={
                                  STATUS_CATEGORY_STYLES[status.key]?.svgPattern
                                    ? "transparent"
                                    : (STATUS_CATEGORY_STYLES[status.key]?.backgroundColor ?? baseColor)
                                }
                                opacity={0.6}
                                // biome-ignore lint/suspicious/noExplicitAny: Recharts Bar shape prop type
                                shape={(barProps: any) => {
                                  const { payload } = barProps;
                                  const hasValueAfter = array.slice(index + 1).some((it) => {
                                    const key = `sub_${it.key}` as keyof LeadTimeCompositionData;
                                    return (payload[key] || 0) > 0;
                                  });
                                  const hasValueBefore = array.slice(0, index).some((it) => {
                                    const key = `sub_${it.key}` as keyof LeadTimeCompositionData;
                                    return (payload[key] || 0) > 0;
                                  });
                                  const statusStyle = STATUS_CATEGORY_STYLES[status.key];
                                  const barBorder = statusStyle?.barBorder ?? {
                                    color: statusSeries?.borderColor ?? statusStyle?.backgroundColor ?? baseColor,
                                    width: 1,
                                  };
                                  return (
                                    <HorizontalBarWithDivider
                                      {...barProps}
                                      hideDivider={!hasValueAfter}
                                      radius={[
                                        !hasValueBefore ? 8 : 0,
                                        !hasValueAfter ? 8 : 0,
                                        !hasValueAfter ? 8 : 0,
                                        !hasValueBefore ? 8 : 0,
                                      ]}
                                      svgPattern={statusStyle?.svgPattern}
                                      barBorder={barBorder}
                                      gap={barSegmentGap}
                                      hasValueBefore={hasValueBefore}
                                      hasValueAfter={hasValueAfter}
                                    />
                                  );
                                }}
                              >
                                <LabelList
                                  dataKey={dataKey}
                                  content={(props: LabelListContentProps) => (
                                    <BadgeLabel
                                      {...props}
                                      dataKey={dataKey}
                                      badgeVariant={
                                        STATUS_CATEGORY_STYLES[status.key]?.badgeVariant ??
                                        statusSeries?.badgeVariant ??
                                        "no-bg-black-text"
                                      }
                                    />
                                  )}
                                />
                                {isLast &&
                                  (leadTimeCompositionAssigneeFilterMode === "sub" ||
                                    leadTimeCompositionAssigneeFilterMode === "both") && (
                                    <LabelList
                                      content={(props: LabelListContentProps) => {
                                        if (props.index === undefined) return null;
                                        const rowData = leadTimeCompositionData?.[props.index];
                                        if (!rowData) return null;
                                        // 副担当の合計を計算
                                        const total = STATUS_ORDER.filter((s) => {
                                          return !(leadTimeCategories.SUB.IGNORE as readonly string[]).includes(s.key);
                                        }).reduce((sum, s) => {
                                          const key = `sub_${s.key}` as keyof LeadTimeCompositionData;
                                          return sum + ((rowData[key] as number) || 0);
                                        }, 0);
                                        if (total === 0) return null;
                                        return (
                                          <RightLabel
                                            {...props}
                                            value={locale === "ja-JP" ? `${total}日` : `${total} ${t("days")}`}
                                            offset={8}
                                          />
                                        );
                                      }}
                                    />
                                  )}
                              </Bar>
                            );
                          })}
                        {/* ステータス別ビュー: 主担当のバーを後にレンダリング（bothモードの時、上に表示される） */}
                        {STATUS_ORDER.filter((status) => {
                          // 非表示（IGNORE）に該当するステータスは表示しない
                          return !(leadTimeCategories.MAIN.IGNORE as readonly string[]).includes(status.key);
                        })
                          .filter(
                            () =>
                              leadTimeCompositionAssigneeFilterMode === "main" ||
                              leadTimeCompositionAssigneeFilterMode === "both",
                          )
                          .map((status, index, array) => {
                            const isLast = index === array.length - 1;
                            const dataKey = `main_${status.key}` as keyof LeadTimeCompositionData;
                            const statusSeries = tenantStatusMap.get(status.key);
                            const statusName = statusSeries?.name ?? status.name;
                            const baseColor = statusSeries?.color ?? status.color;
                            return (
                              <Bar
                                key={dataKey}
                                dataKey={dataKey}
                                name={statusName}
                                stackId="main"
                                fill={
                                  STATUS_CATEGORY_STYLES[status.key]?.svgPattern
                                    ? "transparent"
                                    : (STATUS_CATEGORY_STYLES[status.key]?.backgroundColor ?? baseColor)
                                }
                                // biome-ignore lint/suspicious/noExplicitAny: Recharts Bar shape prop type
                                shape={(barProps: any) => {
                                  const { payload } = barProps;
                                  const hasValueAfter = array.slice(index + 1).some((it) => {
                                    const key = `main_${it.key}` as keyof LeadTimeCompositionData;
                                    return (payload[key] || 0) > 0;
                                  });
                                  const hasValueBefore = array.slice(0, index).some((it) => {
                                    const key = `main_${it.key}` as keyof LeadTimeCompositionData;
                                    return (payload[key] || 0) > 0;
                                  });
                                  const statusStyle = STATUS_CATEGORY_STYLES[status.key];
                                  const barBorder = statusStyle?.barBorder ?? {
                                    color: statusSeries?.borderColor ?? statusStyle?.backgroundColor ?? baseColor,
                                    width: 1,
                                  };
                                  return (
                                    <HorizontalBarWithDivider
                                      {...barProps}
                                      hideDivider={!hasValueAfter}
                                      radius={[
                                        !hasValueBefore ? 8 : 0,
                                        !hasValueAfter ? 8 : 0,
                                        !hasValueAfter ? 8 : 0,
                                        !hasValueBefore ? 8 : 0,
                                      ]}
                                      svgPattern={statusStyle?.svgPattern}
                                      barBorder={barBorder}
                                      gap={barSegmentGap}
                                      hasValueBefore={hasValueBefore}
                                      hasValueAfter={hasValueAfter}
                                    />
                                  );
                                }}
                              >
                                <LabelList
                                  dataKey={dataKey}
                                  content={(props: LabelListContentProps) => (
                                    <BadgeLabel
                                      {...props}
                                      dataKey={dataKey}
                                      badgeVariant={
                                        STATUS_CATEGORY_STYLES[status.key]?.badgeVariant ??
                                        statusSeries?.badgeVariant ??
                                        "no-bg-black-text"
                                      }
                                    />
                                  )}
                                />
                                {isLast && (
                                  <LabelList
                                    content={(props: LabelListContentProps) => {
                                      if (props.index === undefined) return null;
                                      const rowData = leadTimeCompositionData?.[props.index];
                                      if (!rowData) return null;
                                      // 主担当の合計を計算
                                      const total = STATUS_ORDER.filter((s) => {
                                        return !(leadTimeCategories.MAIN.IGNORE as readonly string[]).includes(s.key);
                                      }).reduce((sum, s) => {
                                        const key = `main_${s.key}` as keyof LeadTimeCompositionData;
                                        return sum + ((rowData[key] as number) || 0);
                                      }, 0);
                                      if (total === 0) return null;
                                      return (
                                        <RightLabel
                                          {...props}
                                          value={locale === "ja-JP" ? `${total}日` : `${total} ${t("days")}`}
                                          offset={8}
                                        />
                                      );
                                    }}
                                  />
                                )}
                              </Bar>
                            );
                          })}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                );
              })()
            ) : (
              <div
                style={{
                  background: "var(--aegis-color-background-default)",
                  padding: "var(--aegis-space-xLarge)",
                  borderRadius: "var(--aegis-radius-large)",
                }}
              >
                <DataTable
                  columns={leadTimeCompositionTableColumns}
                  rows={leadTimeCompositionData}
                  size="small"
                  defaultColumnPinning={{ start: ["name"] }}
                  highlightRowOnHover={false}
                />
              </div>
            )}
          </div>
        </CardBody>
      </Card>
      <StatusSettingsDialog
        open={isStatusSettingsOpen}
        onClose={() => onIsStatusSettingsOpenChange(false)}
        categories={leadTimeCategories}
        onSave={onHandleSaveCategories}
      />
    </>
  );
}
