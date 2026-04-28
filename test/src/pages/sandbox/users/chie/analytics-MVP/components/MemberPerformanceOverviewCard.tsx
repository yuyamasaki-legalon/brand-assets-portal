import { LfChartBar, LfCheck, LfFilter, LfQuestionCircle, LfSort19, LfSort91, LfTable } from "@legalforce/aegis-icons";
import {
  ActionList,
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  DataTable,
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
import { usePerformanceData } from "../hooks/usePerformanceData";
import { useTranslation } from "../hooks/useTranslation";
import { reportTranslations } from "../reportTranslations";
import type {
  AssigneeFilterMode,
  DueDateFilter,
  MemberPerformanceByCaseTypeData,
  MemberPerformanceData,
} from "../types";
import {
  BadgeLabel,
  CASE_TYPE_CATEGORY_STYLES,
  COMPLETED_DUE_DATE_STYLES,
  CustomChartTooltip,
  CustomYAxisTick,
  HorizontalBarWithDivider,
  type LabelListContentProps,
  RightLabel,
  renderCustomLegend,
} from "./chart-components";

export interface MemberPerformanceOverviewCardProps {
  // State
  performanceOverviewCaseTypeFilter: string;
  performanceOverviewAssigneeFilterMode: AssigneeFilterMode;
  performanceOverviewViewMode: "graph" | "table";
  isPerformanceOverviewFilterOpen: boolean;
  performanceOverviewBreakdownView: "dueDate" | "caseType" | "department";
  leadTimePerformanceSortType: "caseCount" | "name";
  leadTimePerformanceSortOrder: "asc" | "desc";
  performanceOverviewDueDateFilter: DueDateFilter;
  performanceOverviewDateRange: { start: Date | null; end: Date | null };
  memberPerformanceData: MemberPerformanceData[];
  memberPerformanceByCaseTypeData: MemberPerformanceByCaseTypeData[];
  performanceDateRange: { start: Date | null; end: Date | null };
  // Handlers
  onPerformanceOverviewBreakdownViewChange: (view: "dueDate" | "caseType" | "department") => void;
  onPerformanceOverviewCaseTypeFilterChange: (filter: string) => void;
  onPerformanceOverviewAssigneeFilterModeChange: (mode: AssigneeFilterMode) => void;
  onPerformanceOverviewViewModeChange: (mode: "graph" | "table") => void;
  onIsPerformanceOverviewFilterOpenChange: (open: boolean) => void;
  onLeadTimePerformanceSortTypeChange: (type: "caseCount" | "name") => void;
  onLeadTimePerformanceSortOrderChange: (order: "asc" | "desc") => void;
  onPerformanceOverviewDueDateFilterChange: (filter: DueDateFilter) => void;
  onPerformanceOverviewDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
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

export function MemberPerformanceOverviewCard(props: MemberPerformanceOverviewCardProps) {
  const [isPerformanceOverviewInfoPopoverOpen, setIsPerformanceOverviewInfoPopoverOpen] = useState(false);
  const [isPerformanceOverviewInfoPopoverPinned, setIsPerformanceOverviewInfoPopoverPinned] = useState(false);
  const [isPerformanceOverviewSortMenuOpen, setIsPerformanceOverviewSortMenuOpen] = useState(false);
  const [isPerformanceOverviewViewModeMenuOpen, setIsPerformanceOverviewViewModeMenuOpen] = useState(false);
  const {
    performanceOverviewCaseTypeFilter,
    performanceOverviewAssigneeFilterMode,
    performanceOverviewViewMode,
    isPerformanceOverviewFilterOpen,
    performanceOverviewBreakdownView,
    leadTimePerformanceSortType,
    leadTimePerformanceSortOrder,
    performanceOverviewDueDateFilter,
    performanceOverviewDateRange,
    memberPerformanceData,
    memberPerformanceByCaseTypeData,
    performanceDateRange,
    onPerformanceOverviewBreakdownViewChange,
    onPerformanceOverviewCaseTypeFilterChange,
    onPerformanceOverviewAssigneeFilterModeChange,
    onPerformanceOverviewViewModeChange,
    onIsPerformanceOverviewFilterOpenChange,
    onLeadTimePerformanceSortTypeChange,
    onLeadTimePerformanceSortOrderChange,
    onPerformanceOverviewDueDateFilterChange,
    onPerformanceOverviewDateRangeChange,
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

  // 集計期間をフォーマットする関数（performanceOverviewDateRangeが設定されている場合はそれを使用、なければperformanceDateRangeを使用）
  const effectiveDateRange =
    performanceOverviewDateRange.start || performanceOverviewDateRange.end
      ? performanceOverviewDateRange
      : performanceDateRange;
  const formatDateRange = useMemo(() => {
    if (!effectiveDateRange.start || !effectiveDateRange.end) return "";
    const startYear = effectiveDateRange.start.getFullYear();
    const startMonth = effectiveDateRange.start.getMonth() + 1;
    const endYear = effectiveDateRange.end.getFullYear();
    const endMonth = effectiveDateRange.end.getMonth() + 1;
    if (locale === "ja-JP") {
      return `${startYear}/${startMonth} - ${endYear}/${endMonth}`;
    }
    const startMonthName = effectiveDateRange.start.toLocaleString(locale, { month: "short" });
    const endMonthName = effectiveDateRange.end.toLocaleString(locale, { month: "short" });
    return `${startMonthName} ${startYear} - ${endMonthName} ${endYear}`;
  }, [effectiveDateRange, locale]);

  // フィルターがアクティブかどうかを判定（表示項目は除外）
  const isFiltering =
    performanceOverviewCaseTypeFilter !== "すべて" ||
    performanceOverviewDueDateFilter !== "すべて" ||
    performanceOverviewDateRange.start ||
    performanceOverviewDateRange.end;

  // usePerformanceDataフックを使用
  const { memberPerformanceTableColumns, memberPerformanceByCaseTypeTableColumns } = usePerformanceData({
    assigneeFilterMode: performanceOverviewAssigneeFilterMode,
    caseTypeFilter: performanceOverviewCaseTypeFilter,
    memberPerformanceData,
    memberPerformanceByCaseTypeData,
    onPaneOpenChange,
    onSelectedMemberChange,
    onPaneTabIndexChange,
  });

  // 最大値を保持するためのref（assigneeFilterModeが変わった時のみ更新）
  const maxCompletionCountRef = useRef<number | null>(null);
  const assigneeFilterModeRef = useRef<AssigneeFilterMode>(performanceOverviewAssigneeFilterMode);

  // assigneeFilterModeが変わった時のみ最大値を再計算
  useEffect(() => {
    // 初期値が設定されていない場合、またはassigneeFilterModeが変わった場合に再計算
    if (
      maxCompletionCountRef.current === null ||
      assigneeFilterModeRef.current !== performanceOverviewAssigneeFilterMode
    ) {
      assigneeFilterModeRef.current = performanceOverviewAssigneeFilterMode;

      // データが空の場合は0を設定
      if (!memberPerformanceData || memberPerformanceData.length === 0) {
        maxCompletionCountRef.current = 0;
        return;
      }

      // 納期別ビューと案件タイプ別ビューの両方で最大値を計算
      const calculateMaxForData = (
        data: typeof memberPerformanceData | typeof memberPerformanceByCaseTypeData,
        isDueDateView: boolean,
      ): number => {
        const calculateTotalDueDate = (payload: Record<string, number>, mode: "main" | "sub"): number => {
          if (performanceOverviewAssigneeFilterMode === "both") {
            if (mode === "main") {
              return (
                (payload.onTimeCompletionCount_main || 0) +
                (payload.overdueCompletionCount_main || 0) +
                (payload.noDueDateCompletionCount_main || 0)
              );
            }
            return (
              (payload.onTimeCompletionCount_sub || 0) +
              (payload.overdueCompletionCount_sub || 0) +
              (payload.noDueDateCompletionCount_sub || 0)
            );
          }
          return (
            (payload.onTimeCompletionCount || 0) +
            (payload.overdueCompletionCount || 0) +
            (payload.noDueDateCompletionCount || 0)
          );
        };

        const calculateTotalCaseType = (payload: Record<string, number>, mode: "main" | "sub"): number => {
          if (performanceOverviewAssigneeFilterMode === "both") {
            if (mode === "main") {
              return (
                ((payload.契約書審査_main as number) || 0) +
                ((payload.契約書起案_main as number) || 0) +
                ((payload.法務相談_main as number) || 0) +
                ((payload.その他_main as number) || 0)
              );
            }
            return (
              ((payload.契約書審査_sub as number) || 0) +
              ((payload.契約書起案_sub as number) || 0) +
              ((payload.法務相談_sub as number) || 0) +
              ((payload.その他_sub as number) || 0)
            );
          }
          return (
            ((payload.契約書審査 as number) || 0) +
            ((payload.契約書起案 as number) || 0) +
            ((payload.法務相談 as number) || 0) +
            ((payload.その他 as number) || 0)
          );
        };

        const calculateTotal = isDueDateView ? calculateTotalDueDate : calculateTotalCaseType;

        let maxValue = 0;
        data?.forEach((row) => {
          if (performanceOverviewAssigneeFilterMode === "main" || performanceOverviewAssigneeFilterMode === "both") {
            const mainTotal = calculateTotal(row as unknown as Record<string, number>, "main");
            maxValue = Math.max(maxValue, mainTotal);
          }
          if (performanceOverviewAssigneeFilterMode === "sub" || performanceOverviewAssigneeFilterMode === "both") {
            const subTotal = calculateTotal(row as unknown as Record<string, number>, "sub");
            maxValue = Math.max(maxValue, subTotal);
          }
        });

        return maxValue;
      };

      const maxDueDate = calculateMaxForData(memberPerformanceData, true);
      const maxCaseType = calculateMaxForData(memberPerformanceByCaseTypeData, false);
      const maxValue = Math.max(maxDueDate, maxCaseType);

      // 数値ラベルの表示スペースを考慮（最大3桁の数値 + offset 8px を考慮）
      // 実際の最大値に約15%の余裕を追加（数値ラベルの幅分）
      // ただし、最小値は実際の最大値 + 1（数値ラベルが切れないように）
      const adjustedMax = Math.max(Math.ceil(maxValue * 1.15), maxValue + 1);
      maxCompletionCountRef.current = adjustedMax;
    }
  }, [performanceOverviewAssigneeFilterMode, memberPerformanceData, memberPerformanceByCaseTypeData]);

  return (
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
            <div style={{ display: "flex", gap: "var(--aegis-space-medium)", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)", alignItems: "center" }}>
                  <Text variant="body.medium.bold">{t("caseCountAndFirstResponse")}</Text>
                  <Popover
                    open={isPerformanceOverviewInfoPopoverOpen}
                    onOpenChange={(open) => {
                      setIsPerformanceOverviewInfoPopoverOpen(open);
                      if (!open) {
                        setIsPerformanceOverviewInfoPopoverPinned(false);
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
                        aria-label={t("caseCountAndFirstResponse")}
                        icon={LfQuestionCircle}
                        onMouseEnter={() => {
                          if (!isPerformanceOverviewInfoPopoverPinned) {
                            setIsPerformanceOverviewInfoPopoverOpen(true);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isPerformanceOverviewInfoPopoverPinned) {
                            setIsPerformanceOverviewInfoPopoverOpen(false);
                          }
                        }}
                        onClickCapture={(e) => {
                          e.stopPropagation();
                          setIsPerformanceOverviewInfoPopoverOpen(true);
                          setIsPerformanceOverviewInfoPopoverPinned(true);
                        }}
                      />
                    </Popover.Anchor>
                    <Popover.Content width="small">
                      <Popover.Body>
                        <Text variant="body.small" style={{ whiteSpace: "pre-line" }}>
                          <span style={{ fontWeight: "bold" }}>{t("completedCaseCountCardDescriptionTitle")}</span>
                          {"\n"}
                          {t("completedCaseCountCardDescriptionBody")}
                        </Text>
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
              <Select
                variant="outline"
                size="medium"
                value={performanceOverviewBreakdownView}
                onChange={(value) => {
                  if (value === "dueDate" || value === "caseType" || value === "department") {
                    onPerformanceOverviewBreakdownViewChange(value);
                  }
                }}
                options={[
                  { label: t("caseTypeView"), value: "caseType" },
                  { label: t("dueDateComplianceView"), value: "dueDate" },
                  { label: t("departmentView"), value: "department" },
                ]}
                placement="bottom-start"
              />
            </div>
            <div style={{ display: "flex", gap: "var(--aegis-space-small)", alignItems: "center" }}>
              <ButtonGroup variant="plain" size="medium">
                <Menu
                  open={isPerformanceOverviewSortMenuOpen}
                  onOpenChange={setIsPerformanceOverviewSortMenuOpen}
                  placement="bottom-end"
                >
                  <Menu.Anchor>
                    <Button
                      size="medium"
                      leading={<Icon>{leadTimePerformanceSortOrder === "asc" ? <LfSort19 /> : <LfSort91 />}</Icon>}
                    >
                      {leadTimePerformanceSortType === "caseCount" ? t("caseCount") : t("userName")}
                    </Button>
                  </Menu.Anchor>
                  <Menu.Box width="auto">
                    <ActionList size="large">
                      <ActionList.Item
                        selected={leadTimePerformanceSortType === "caseCount" && leadTimePerformanceSortOrder === "asc"}
                        onClick={() => {
                          onLeadTimePerformanceSortTypeChange("caseCount");
                          onLeadTimePerformanceSortOrderChange("asc");
                          setIsPerformanceOverviewSortMenuOpen(false);
                        }}
                      >
                        <ActionList.Body
                          leading={
                            <Icon>
                              <LfSort19 />
                            </Icon>
                          }
                          trailing={
                            leadTimePerformanceSortType === "caseCount" && leadTimePerformanceSortOrder === "asc" ? (
                              <Icon>
                                <LfCheck />
                              </Icon>
                            ) : undefined
                          }
                        >
                          {t("caseCountAsc")}
                        </ActionList.Body>
                      </ActionList.Item>
                      <ActionList.Item
                        selected={
                          leadTimePerformanceSortType === "caseCount" && leadTimePerformanceSortOrder === "desc"
                        }
                        onClick={() => {
                          onLeadTimePerformanceSortTypeChange("caseCount");
                          onLeadTimePerformanceSortOrderChange("desc");
                          setIsPerformanceOverviewSortMenuOpen(false);
                        }}
                      >
                        <ActionList.Body
                          leading={
                            <Icon>
                              <LfSort91 />
                            </Icon>
                          }
                          trailing={
                            leadTimePerformanceSortType === "caseCount" && leadTimePerformanceSortOrder === "desc" ? (
                              <Icon>
                                <LfCheck />
                              </Icon>
                            ) : undefined
                          }
                        >
                          {t("caseCountDesc")}
                        </ActionList.Body>
                      </ActionList.Item>
                      <ActionList.Item
                        selected={leadTimePerformanceSortType === "name" && leadTimePerformanceSortOrder === "asc"}
                        onClick={() => {
                          onLeadTimePerformanceSortTypeChange("name");
                          onLeadTimePerformanceSortOrderChange("asc");
                          setIsPerformanceOverviewSortMenuOpen(false);
                        }}
                      >
                        <ActionList.Body
                          leading={
                            <Icon>
                              <LfSort19 />
                            </Icon>
                          }
                          trailing={
                            leadTimePerformanceSortType === "name" && leadTimePerformanceSortOrder === "asc" ? (
                              <Icon>
                                <LfCheck />
                              </Icon>
                            ) : undefined
                          }
                        >
                          {t("userNameAsc")}
                        </ActionList.Body>
                      </ActionList.Item>
                      <ActionList.Item
                        selected={leadTimePerformanceSortType === "name" && leadTimePerformanceSortOrder === "desc"}
                        onClick={() => {
                          onLeadTimePerformanceSortTypeChange("name");
                          onLeadTimePerformanceSortOrderChange("desc");
                          setIsPerformanceOverviewSortMenuOpen(false);
                        }}
                      >
                        <ActionList.Body
                          leading={
                            <Icon>
                              <LfSort91 />
                            </Icon>
                          }
                          trailing={
                            leadTimePerformanceSortType === "name" && leadTimePerformanceSortOrder === "desc" ? (
                              <Icon>
                                <LfCheck />
                              </Icon>
                            ) : undefined
                          }
                        >
                          {t("userNameDesc")}
                        </ActionList.Body>
                      </ActionList.Item>
                    </ActionList>
                  </Menu.Box>
                </Menu>
                <Popover
                  open={isPerformanceOverviewFilterOpen}
                  onOpenChange={onIsPerformanceOverviewFilterOpenChange}
                  placement="bottom-end"
                >
                  <Popover.Anchor>
                    <Tooltip title={t("filter")}>
                      <IconButton
                        variant={isFiltering ? "subtle" : "plain"}
                        color={isFiltering ? "information" : undefined}
                        size="medium"
                        aria-label={t("filter")}
                      >
                        <Badge color="information" invisible={!isFiltering}>
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
                            value={performanceOverviewCaseTypeFilter}
                            onChange={onPerformanceOverviewCaseTypeFilterChange}
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
                          <FormControl.Label>{t("dueDate")}</FormControl.Label>
                          <Select
                            size="medium"
                            value={performanceOverviewDueDateFilter}
                            onChange={(value) => onPerformanceOverviewDueDateFilterChange(value as DueDateFilter)}
                            options={[
                              { label: t("all"), value: "すべて" },
                              { label: t("onTimeCompletion"), value: "納期内完了" },
                              { label: t("overdueCompletion"), value: "納期超過" },
                              { label: t("noDueDateCompletion"), value: "納期未入力" },
                            ]}
                          />
                        </FormControl>
                        <FormControl style={{ width: "var(--aegis-layout-width-x5Small)" }}>
                          <FormControl.Label>{t("aggregationPeriod")}</FormControl.Label>
                          <FormGroup>
                            <FormControl>
                              <Select
                                size="medium"
                                placeholder={t("startMonth")}
                                value={
                                  performanceOverviewDateRange.start
                                    ? locale === "ja-JP"
                                      ? `${performanceOverviewDateRange.start.getFullYear()}/${performanceOverviewDateRange.start.getMonth() + 1}`
                                      : `${performanceOverviewDateRange.start.toLocaleString(locale, { month: "short" })} ${performanceOverviewDateRange.start.getFullYear()}`
                                    : undefined
                                }
                                onChange={(value) => {
                                  if (value) {
                                    let year: number;
                                    let month: number;
                                    if (locale === "ja-JP") {
                                      [year, month] = value.split("/").map((s) => parseInt(s, 10));
                                    } else {
                                      [year, month] = value.split("/").map((s) => parseInt(s, 10));
                                    }
                                    const newStart = new Date(year, month - 1, 1);

                                    // 終了月が既に選択されている場合、1年以内かチェック
                                    if (performanceOverviewDateRange.end) {
                                      const monthsDiff =
                                        (performanceOverviewDateRange.end.getFullYear() - newStart.getFullYear()) * 12 +
                                        (performanceOverviewDateRange.end.getMonth() - newStart.getMonth());
                                      if (monthsDiff > 12) {
                                        // 1年を超える場合は、終了月を開始月から1年後の月末に設定
                                        const maxEnd = new Date(newStart.getFullYear() + 1, newStart.getMonth() + 1, 0);
                                        onPerformanceOverviewDateRangeChange({ start: newStart, end: maxEnd });
                                        return;
                                      }
                                    }

                                    onPerformanceOverviewDateRangeChange({
                                      ...performanceOverviewDateRange,
                                      start: newStart,
                                    });
                                  } else {
                                    onPerformanceOverviewDateRangeChange({
                                      ...performanceOverviewDateRange,
                                      start: null,
                                    });
                                  }
                                }}
                                options={(() => {
                                  const options: Array<{ label: string; value: string; disabled?: boolean }> = [];
                                  const today = new Date();
                                  // 終了月が選択されている場合、開始月から1年以内の範囲のみ選択可能
                                  const maxStart = performanceOverviewDateRange.end
                                    ? new Date(
                                        performanceOverviewDateRange.end.getFullYear(),
                                        performanceOverviewDateRange.end.getMonth() - 12,
                                        1,
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
                                  performanceOverviewDateRange.end
                                    ? locale === "ja-JP"
                                      ? `${performanceOverviewDateRange.end.getFullYear()}/${performanceOverviewDateRange.end.getMonth() + 1}`
                                      : `${performanceOverviewDateRange.end.toLocaleString(locale, { month: "short" })} ${performanceOverviewDateRange.end.getFullYear()}`
                                    : undefined
                                }
                                onChange={(value) => {
                                  if (value) {
                                    let year: number;
                                    let month: number;
                                    if (locale === "ja-JP") {
                                      [year, month] = value.split("/").map((s) => parseInt(s, 10));
                                    } else {
                                      [year, month] = value.split("/").map((s) => parseInt(s, 10));
                                    }
                                    const newEnd = new Date(year, month, 0); // 月末

                                    // 開始月が既に選択されている場合、1年以内かチェック
                                    if (performanceOverviewDateRange.start) {
                                      const monthsDiff =
                                        (newEnd.getFullYear() - performanceOverviewDateRange.start.getFullYear()) * 12 +
                                        (newEnd.getMonth() - performanceOverviewDateRange.start.getMonth());
                                      if (monthsDiff > 12) {
                                        // 1年を超える場合は、開始月から1年後の月末に設定
                                        const maxEnd = new Date(
                                          performanceOverviewDateRange.start.getFullYear() + 1,
                                          performanceOverviewDateRange.start.getMonth() + 1,
                                          0,
                                        );
                                        onPerformanceOverviewDateRangeChange({
                                          ...performanceOverviewDateRange,
                                          end: maxEnd,
                                        });
                                        return;
                                      }
                                    }

                                    onPerformanceOverviewDateRangeChange({
                                      ...performanceOverviewDateRange,
                                      end: newEnd,
                                    });
                                  } else {
                                    onPerformanceOverviewDateRangeChange({
                                      ...performanceOverviewDateRange,
                                      end: null,
                                    });
                                  }
                                }}
                                options={(() => {
                                  const options: Array<{ label: string; value: string; disabled?: boolean }> = [];
                                  const today = new Date();
                                  // 開始月が選択されている場合、開始月から1年以内の範囲のみ選択可能
                                  const minEnd = performanceOverviewDateRange.start
                                    ? new Date(
                                        performanceOverviewDateRange.start.getFullYear(),
                                        performanceOverviewDateRange.start.getMonth(),
                                        1,
                                      )
                                    : null;
                                  const maxEnd = performanceOverviewDateRange.start
                                    ? new Date(
                                        performanceOverviewDateRange.start.getFullYear() + 1,
                                        performanceOverviewDateRange.start.getMonth() + 1,
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
                      </Form>
                    </Popover.Body>
                  </Popover.Content>
                </Popover>
                {isFiltering && (
                  <Button
                    variant="subtle"
                    size="medium"
                    onClick={() => {
                      onPerformanceOverviewCaseTypeFilterChange("すべて");
                      onPerformanceOverviewDueDateFilterChange("すべて");
                      onPerformanceOverviewDateRangeChange({ start: null, end: null });
                    }}
                  >
                    {t("reset")}
                  </Button>
                )}
                <Menu
                  open={isPerformanceOverviewViewModeMenuOpen}
                  onOpenChange={setIsPerformanceOverviewViewModeMenuOpen}
                  placement="bottom-end"
                >
                  <Menu.Anchor>
                    <Tooltip title={performanceOverviewViewMode === "graph" ? t("table") : t("graph")}>
                      <IconButton
                        variant="plain"
                        size="medium"
                        aria-label={performanceOverviewViewMode === "graph" ? t("graph") : t("table")}
                        icon={performanceOverviewViewMode === "graph" ? LfChartBar : LfTable}
                      />
                    </Tooltip>
                  </Menu.Anchor>
                  <Menu.Box width="auto">
                    <ActionList size="large">
                      <ActionList.Item
                        selected={performanceOverviewViewMode === "graph"}
                        onClick={() => {
                          onPerformanceOverviewViewModeChange("graph");
                          setIsPerformanceOverviewViewModeMenuOpen(false);
                        }}
                      >
                        <ActionList.Body
                          leading={
                            <Icon>
                              <LfChartBar />
                            </Icon>
                          }
                          trailing={
                            performanceOverviewViewMode === "graph" ? (
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
                        selected={performanceOverviewViewMode === "table"}
                        onClick={() => {
                          onPerformanceOverviewViewModeChange("table");
                          setIsPerformanceOverviewViewModeMenuOpen(false);
                        }}
                      >
                        <ActionList.Body
                          leading={
                            <Icon>
                              <LfTable />
                            </Icon>
                          }
                          trailing={
                            performanceOverviewViewMode === "table" ? (
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
                value={performanceOverviewAssigneeFilterMode}
                onChange={(value) => onPerformanceOverviewAssigneeFilterModeChange(value as AssigneeFilterMode)}
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

          {performanceOverviewViewMode === "graph" && performanceOverviewBreakdownView !== "department" ? (
            (() => {
              // 納期別ビューと案件タイプ別ビューで使用するデータと計算関数を決定
              const isDueDateView = performanceOverviewBreakdownView === "dueDate";
              const dataSource = isDueDateView ? memberPerformanceData : memberPerformanceByCaseTypeData;

              // 納期別ビュー用の合計数計算関数
              const calculateTotalDueDate = (
                payload: Record<string, number>,
                filterMode: typeof performanceOverviewAssigneeFilterMode,
              ): number => {
                if (filterMode === "main") {
                  if (performanceOverviewAssigneeFilterMode === "both") {
                    return (
                      (payload.onTimeCompletionCount_main || 0) +
                      (payload.overdueCompletionCount_main || 0) +
                      (payload.noDueDateCompletionCount_main || 0)
                    );
                  }
                  return (
                    (payload.onTimeCompletionCount || 0) +
                    (payload.overdueCompletionCount || 0) +
                    (payload.noDueDateCompletionCount || 0)
                  );
                }
                if (filterMode === "sub") {
                  if (performanceOverviewAssigneeFilterMode === "both") {
                    return (
                      (payload.onTimeCompletionCount_sub || 0) +
                      (payload.overdueCompletionCount_sub || 0) +
                      (payload.noDueDateCompletionCount_sub || 0)
                    );
                  }
                  return (
                    (payload.onTimeCompletionCount || 0) +
                    (payload.overdueCompletionCount || 0) +
                    (payload.noDueDateCompletionCount || 0)
                  );
                }
                return (
                  (payload.onTimeCompletionCount_main || 0) +
                  (payload.overdueCompletionCount_main || 0) +
                  (payload.noDueDateCompletionCount_main || 0) +
                  (payload.onTimeCompletionCount_sub || 0) +
                  (payload.overdueCompletionCount_sub || 0) +
                  (payload.noDueDateCompletionCount_sub || 0)
                );
              };

              // 案件タイプ別ビュー用の合計数計算関数
              const calculateTotalCaseType = (
                payload: Record<string, number>,
                filterMode: typeof performanceOverviewAssigneeFilterMode,
              ): number => {
                if (filterMode === "main") {
                  if (performanceOverviewAssigneeFilterMode === "both") {
                    return (
                      (payload.契約書審査_main || 0) +
                      (payload.契約書起案_main || 0) +
                      (payload.法務相談_main || 0) +
                      (payload.その他_main || 0)
                    );
                  }
                  return (
                    (payload.契約書審査 || 0) +
                    (payload.契約書起案 || 0) +
                    (payload.法務相談 || 0) +
                    (payload.その他 || 0)
                  );
                }
                if (filterMode === "sub") {
                  if (performanceOverviewAssigneeFilterMode === "both") {
                    return (
                      (payload.契約書審査_sub || 0) +
                      (payload.契約書起案_sub || 0) +
                      (payload.法務相談_sub || 0) +
                      (payload.その他_sub || 0)
                    );
                  }
                  return (
                    (payload.契約書審査 || 0) +
                    (payload.契約書起案 || 0) +
                    (payload.法務相談 || 0) +
                    (payload.その他 || 0)
                  );
                }
                return (
                  (payload.契約書審査_main || 0) +
                  (payload.契約書起案_main || 0) +
                  (payload.法務相談_main || 0) +
                  (payload.その他_main || 0) +
                  (payload.契約書審査_sub || 0) +
                  (payload.契約書起案_sub || 0) +
                  (payload.法務相談_sub || 0) +
                  (payload.その他_sub || 0)
                );
              };

              const calculateTotal = isDueDateView ? calculateTotalDueDate : calculateTotalCaseType;

              // グラフの高さを計算（進行中の案件状況と同じロジック）
              const barCategoryGap = 16; // カテゴリ間のギャップ（px）
              const barSegmentGap = 1; // 積み上げバーのセグメント間の白い余白（px）
              const barSize = 32;
              const barGap = 4; // 主担当と副担当の間のギャップ
              const baseRowHeight = performanceOverviewAssigneeFilterMode === "both" ? barSize * 2 + barGap : barSize; // 主担当+副担当: 32 + 4 + 32 = 68px, 主担当のみ: 32px
              const gapHeight = barCategoryGap; // 固定値（px）
              const marginHeight = 24 + 24; // top + bottom
              const xAxisHeight = 22; // tickMargin + tick height
              const legendHeight = 25; // 凡例の高さ（推定）
              const fixedElementsHeight = marginHeight + xAxisHeight + legendHeight;
              const rowCount = dataSource?.length ?? 0;
              const calculatedHeight =
                rowCount * baseRowHeight + Math.max(0, rowCount - 1) * gapHeight + fixedElementsHeight;

              // 完了案件数の最大値（refから取得、assigneeFilterModeが変わった時のみ更新される）
              const maxCompletionCount = maxCompletionCountRef.current ?? 0;

              return (
                <div
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
                      data={dataSource}
                      layout="vertical"
                      margin={{ right: 16 }}
                      accessibilityLayer
                      barCategoryGap={barCategoryGap}
                      barSize={32}
                      barGap={4}
                    >
                      <CartesianGrid horizontal={false} vertical={false} stroke="#e2e8f0" />
                      <XAxis type="number" xAxisId="count" domain={[0, maxCompletionCount]} hide />
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
                            assigneeFilterMode={performanceOverviewAssigneeFilterMode}
                            showOverdueAlert={false}
                            targetPaneTabIndex={0}
                            locale={locale}
                          />
                        )}
                      />
                      <RechartsTooltip
                        content={
                          <CustomChartTooltip
                            locale={locale}
                            caseStatusView={
                              performanceOverviewBreakdownView === "caseType"
                                ? "type"
                                : performanceOverviewBreakdownView === "dueDate"
                                  ? "dueDate"
                                  : undefined
                            }
                            assigneeFilterMode={performanceOverviewAssigneeFilterMode}
                          />
                        }
                        shared={true}
                        cursor={{ fill: "#f1f5f9" }}
                        wrapperStyle={{ outline: "none", transition: "none" }}
                        animationDuration={0}
                      />
                      <Legend
                        content={renderCustomLegend({
                          locale,
                          caseStatusView:
                            performanceOverviewBreakdownView === "caseType"
                              ? "type"
                              : performanceOverviewBreakdownView === "dueDate"
                                ? "dueDate"
                                : undefined,
                        })}
                      />
                      {isDueDateView ? (
                        <>
                          {/* 納期別ビュー */}
                          {(performanceOverviewAssigneeFilterMode === "main" ||
                            performanceOverviewAssigneeFilterMode === "both") &&
                            (performanceOverviewAssigneeFilterMode === "both"
                              ? [
                                  {
                                    key: "onTimeCompletionCount_main",
                                    name: t("onTimeCompletionMain"),
                                    style: COMPLETED_DUE_DATE_STYLES.納期内,
                                  },
                                  {
                                    key: "overdueCompletionCount_main",
                                    name: t("overdueCompletionMain"),
                                    style: COMPLETED_DUE_DATE_STYLES.納期超過,
                                  },
                                  {
                                    key: "noDueDateCompletionCount_main",
                                    name: t("noDueDateCompletionMain"),
                                    style: COMPLETED_DUE_DATE_STYLES.納期未入力,
                                  },
                                ]
                              : [
                                  {
                                    key: "onTimeCompletionCount",
                                    name: t("onTimeCompletion"),
                                    style: COMPLETED_DUE_DATE_STYLES.納期内,
                                  },
                                  {
                                    key: "overdueCompletionCount",
                                    name: t("overdueCompletion"),
                                    style: COMPLETED_DUE_DATE_STYLES.納期超過,
                                  },
                                  {
                                    key: "noDueDateCompletionCount",
                                    name: t("noDueDateCompletion"),
                                    style: COMPLETED_DUE_DATE_STYLES.納期未入力,
                                  },
                                ]
                            ).map((item, index, array) => {
                              const isLast = index === array.length - 1;
                              const fill = item.style.svgPattern ? "transparent" : item.style.backgroundColor;
                              return (
                                <Bar
                                  key={item.key}
                                  dataKey={item.key}
                                  name={item.name}
                                  stackId="main"
                                  xAxisId="count"
                                  fill={fill}
                                  // biome-ignore lint/suspicious/noExplicitAny: Recharts Bar shape prop type
                                  shape={(barProps: any) => {
                                    const { payload, dataKey } = barProps;
                                    const currentIndex = array.findIndex((it) => it.key === dataKey);
                                    const hasValueAfter = array
                                      .slice(currentIndex + 1)
                                      .some((it) => ((payload?.[it.key] as number) || 0) > 0);
                                    const hasValueBefore = array
                                      .slice(0, currentIndex)
                                      .some((it) => ((payload?.[it.key] as number) || 0) > 0);
                                    return (
                                      <HorizontalBarWithDivider
                                        {...barProps}
                                        hideDivider={!hasValueAfter}
                                        gap={barSegmentGap}
                                        radius={[
                                          !hasValueBefore ? 4 : 0,
                                          !hasValueAfter ? 4 : 0,
                                          !hasValueAfter ? 4 : 0,
                                          !hasValueBefore ? 4 : 0,
                                        ]}
                                        barBorder={item.style.barBorder}
                                        svgPattern={item.style.svgPattern}
                                        hasValueBefore={hasValueBefore}
                                        hasValueAfter={hasValueAfter}
                                      />
                                    );
                                  }}
                                >
                                  <LabelList
                                    dataKey={item.key}
                                    content={(props: LabelListContentProps) => (
                                      <BadgeLabel
                                        {...props}
                                        dataKey={item.key}
                                        badgeVariant={item.style.badgeVariant}
                                      />
                                    )}
                                  />
                                  {isLast && (
                                    <LabelList
                                      content={(props: LabelListContentProps) => {
                                        if (props.index === undefined) return null;
                                        const rowData = dataSource?.[props.index];
                                        if (!rowData) return null;
                                        const total = calculateTotal(
                                          rowData as unknown as Record<string, number>,
                                          "main",
                                        );
                                        if (total === 0) return null;
                                        return <RightLabel {...props} value={total} dataKey="案件数" offset={8} />;
                                      }}
                                    />
                                  )}
                                </Bar>
                              );
                            })}
                          {(performanceOverviewAssigneeFilterMode === "sub" ||
                            performanceOverviewAssigneeFilterMode === "both") &&
                            (performanceOverviewAssigneeFilterMode === "both"
                              ? [
                                  {
                                    key: "onTimeCompletionCount_sub",
                                    name: t("onTimeCompletionSub"),
                                    style: COMPLETED_DUE_DATE_STYLES.納期内,
                                  },
                                  {
                                    key: "overdueCompletionCount_sub",
                                    name: t("overdueCompletionSub"),
                                    style: COMPLETED_DUE_DATE_STYLES.納期超過,
                                  },
                                  {
                                    key: "noDueDateCompletionCount_sub",
                                    name: t("noDueDateCompletionSub"),
                                    style: COMPLETED_DUE_DATE_STYLES.納期未入力,
                                  },
                                ]
                              : [
                                  {
                                    key: "onTimeCompletionCount",
                                    name: t("onTimeCompletion"),
                                    style: COMPLETED_DUE_DATE_STYLES.納期内,
                                  },
                                  {
                                    key: "overdueCompletionCount",
                                    name: t("overdueCompletion"),
                                    style: COMPLETED_DUE_DATE_STYLES.納期超過,
                                  },
                                  {
                                    key: "noDueDateCompletionCount",
                                    name: t("noDueDateCompletion"),
                                    style: COMPLETED_DUE_DATE_STYLES.納期未入力,
                                  },
                                ]
                            ).map((item, index, array) => {
                              const isLast = index === array.length - 1;
                              const fill = item.style.svgPattern ? "transparent" : item.style.backgroundColor;
                              return (
                                <Bar
                                  key={item.key}
                                  dataKey={item.key}
                                  name={item.name}
                                  stackId="sub"
                                  xAxisId="count"
                                  fill={fill}
                                  opacity={0.6}
                                  // biome-ignore lint/suspicious/noExplicitAny: Recharts Bar shape prop type
                                  shape={(barProps: any) => {
                                    const { payload, dataKey } = barProps;
                                    const currentIndex = array.findIndex((it) => it.key === dataKey);
                                    const hasValueAfter = array
                                      .slice(currentIndex + 1)
                                      .some((it) => ((payload?.[it.key] as number) || 0) > 0);
                                    const hasValueBefore = array
                                      .slice(0, currentIndex)
                                      .some((it) => ((payload?.[it.key] as number) || 0) > 0);
                                    return (
                                      <HorizontalBarWithDivider
                                        {...barProps}
                                        hideDivider={!hasValueAfter}
                                        gap={barSegmentGap}
                                        radius={[
                                          !hasValueBefore ? 4 : 0,
                                          !hasValueAfter ? 4 : 0,
                                          !hasValueAfter ? 4 : 0,
                                          !hasValueBefore ? 4 : 0,
                                        ]}
                                        barBorder={item.style.barBorder}
                                        svgPattern={item.style.svgPattern}
                                        hasValueBefore={hasValueBefore}
                                        hasValueAfter={hasValueAfter}
                                      />
                                    );
                                  }}
                                >
                                  <LabelList
                                    dataKey={item.key}
                                    content={(props: LabelListContentProps) => (
                                      <BadgeLabel
                                        {...props}
                                        dataKey={item.key}
                                        badgeVariant={item.style.badgeVariant}
                                      />
                                    )}
                                  />
                                  {isLast &&
                                    (performanceOverviewAssigneeFilterMode === "sub" ||
                                      performanceOverviewAssigneeFilterMode === "both") && (
                                      <LabelList
                                        content={(props: LabelListContentProps) => {
                                          if (props.index === undefined) return null;
                                          const rowData = dataSource?.[props.index];
                                          if (!rowData) return null;
                                          const total = calculateTotal(
                                            rowData as unknown as Record<string, number>,
                                            "sub",
                                          );
                                          if (total === 0) return null;
                                          return <RightLabel {...props} value={total} dataKey="案件数" offset={8} />;
                                        }}
                                      />
                                    )}
                                </Bar>
                              );
                            })}
                        </>
                      ) : (
                        <>
                          {/* 案件タイプ別ビュー */}
                          {(() => {
                            const filteredCaseTypes =
                              performanceOverviewCaseTypeFilter === "すべて"
                                ? CASE_TYPE_ORDER
                                : [performanceOverviewCaseTypeFilter];
                            return (
                              <>
                                {(performanceOverviewAssigneeFilterMode === "main" ||
                                  performanceOverviewAssigneeFilterMode === "both") &&
                                  filteredCaseTypes.map((caseType, index, array) => {
                                    const localizedCaseType =
                                      (CASE_TYPE_MAPPING[locale]?.[caseType] as string) || caseType;
                                    const isLast = index === array.length - 1;
                                    const dataKey =
                                      performanceOverviewAssigneeFilterMode === "both" ? `${caseType}_main` : caseType;
                                    const style = CASE_TYPE_CATEGORY_STYLES[caseType];
                                    const fill = style?.svgPattern
                                      ? "transparent"
                                      : (style?.backgroundColor ?? "#6366f1");
                                    return (
                                      <Bar
                                        key={dataKey}
                                        dataKey={dataKey}
                                        name={localizedCaseType}
                                        stackId="main"
                                        xAxisId="count"
                                        fill={fill}
                                        // biome-ignore lint/suspicious/noExplicitAny: Recharts Bar shape prop type
                                        shape={(barProps: any) => {
                                          const { payload } = barProps;
                                          const hasValueAfter = filteredCaseTypes
                                            .slice(index + 1)
                                            .some(
                                              (ct) =>
                                                ((payload?.[
                                                  performanceOverviewAssigneeFilterMode === "both" ? `${ct}_main` : ct
                                                ] as number) || 0) > 0,
                                            );
                                          const hasValueBefore = filteredCaseTypes
                                            .slice(0, index)
                                            .some(
                                              (ct) =>
                                                ((payload?.[
                                                  performanceOverviewAssigneeFilterMode === "both" ? `${ct}_main` : ct
                                                ] as number) || 0) > 0,
                                            );
                                          return (
                                            <HorizontalBarWithDivider
                                              {...barProps}
                                              hideDivider={!hasValueAfter}
                                              gap={barSegmentGap}
                                              radius={[
                                                !hasValueBefore ? 4 : 0,
                                                !hasValueAfter ? 4 : 0,
                                                !hasValueAfter ? 4 : 0,
                                                !hasValueBefore ? 4 : 0,
                                              ]}
                                              barBorder={style?.barBorder}
                                              svgPattern={style?.svgPattern}
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
                                              badgeVariant={style?.badgeVariant}
                                            />
                                          )}
                                        />
                                        {isLast && (
                                          <LabelList
                                            content={(props: LabelListContentProps) => {
                                              if (props.index === undefined) return null;
                                              const rowData = dataSource?.[props.index];
                                              if (!rowData) return null;
                                              const total = calculateTotal(
                                                rowData as unknown as Record<string, number>,
                                                "main",
                                              );
                                              if (total === 0) return null;
                                              return (
                                                <RightLabel {...props} value={total} dataKey="案件数" offset={8} />
                                              );
                                            }}
                                          />
                                        )}
                                      </Bar>
                                    );
                                  })}
                                {(performanceOverviewAssigneeFilterMode === "sub" ||
                                  performanceOverviewAssigneeFilterMode === "both") &&
                                  filteredCaseTypes.map((caseType, index, array) => {
                                    const localizedCaseType =
                                      (CASE_TYPE_MAPPING[locale]?.[caseType] as string) || caseType;
                                    const isLast = index === array.length - 1;
                                    const dataKey =
                                      performanceOverviewAssigneeFilterMode === "both" ? `${caseType}_sub` : caseType;
                                    const style = CASE_TYPE_CATEGORY_STYLES[caseType];
                                    const fill = style?.svgPattern
                                      ? "transparent"
                                      : (style?.backgroundColor ?? "#6366f1");
                                    return (
                                      <Bar
                                        key={dataKey}
                                        dataKey={dataKey}
                                        name={localizedCaseType}
                                        stackId="sub"
                                        xAxisId="count"
                                        fill={fill}
                                        opacity={0.6}
                                        // biome-ignore lint/suspicious/noExplicitAny: Recharts Bar shape prop type
                                        shape={(barProps: any) => {
                                          const { payload } = barProps;
                                          const hasValueAfter = filteredCaseTypes
                                            .slice(index + 1)
                                            .some(
                                              (ct) =>
                                                ((payload?.[
                                                  performanceOverviewAssigneeFilterMode === "both" ? `${ct}_sub` : ct
                                                ] as number) || 0) > 0,
                                            );
                                          const hasValueBefore = filteredCaseTypes
                                            .slice(0, index)
                                            .some(
                                              (ct) =>
                                                ((payload?.[
                                                  performanceOverviewAssigneeFilterMode === "both" ? `${ct}_sub` : ct
                                                ] as number) || 0) > 0,
                                            );
                                          return (
                                            <HorizontalBarWithDivider
                                              {...barProps}
                                              hideDivider={!hasValueAfter}
                                              gap={barSegmentGap}
                                              radius={[
                                                !hasValueBefore ? 4 : 0,
                                                !hasValueAfter ? 4 : 0,
                                                !hasValueAfter ? 4 : 0,
                                                !hasValueBefore ? 4 : 0,
                                              ]}
                                              barBorder={style?.barBorder}
                                              svgPattern={style?.svgPattern}
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
                                              badgeVariant={style?.badgeVariant}
                                            />
                                          )}
                                        />
                                        {isLast &&
                                          (performanceOverviewAssigneeFilterMode === "sub" ||
                                            performanceOverviewAssigneeFilterMode === "both") && (
                                            <LabelList
                                              content={(props: LabelListContentProps) => {
                                                if (props.index === undefined) return null;
                                                const rowData = dataSource?.[props.index];
                                                if (!rowData) return null;
                                                const total = calculateTotal(
                                                  rowData as unknown as Record<string, number>,
                                                  "sub",
                                                );
                                                if (total === 0) return null;
                                                return (
                                                  <RightLabel {...props} value={total} dataKey="案件数" offset={8} />
                                                );
                                              }}
                                            />
                                          )}
                                      </Bar>
                                    );
                                  })}
                              </>
                            );
                          })()}
                        </>
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              );
            })()
          ) : performanceOverviewBreakdownView === "dueDate" ? (
            <div
              style={{
                background: "var(--aegis-color-background-default)",
                padding: "var(--aegis-space-medium)",
                borderRadius: "var(--aegis-radius-large)",
              }}
            >
              <DataTable
                columns={memberPerformanceTableColumns}
                rows={memberPerformanceData}
                size="small"
                defaultColumnPinning={{ start: ["name"] }}
                highlightRowOnHover={false}
              />
            </div>
          ) : performanceOverviewBreakdownView === "caseType" ? (
            <div
              style={{
                background: "var(--aegis-color-background-default)",
                padding: "var(--aegis-space-medium)",
                borderRadius: "var(--aegis-radius-large)",
              }}
            >
              <DataTable
                columns={memberPerformanceByCaseTypeTableColumns}
                rows={memberPerformanceByCaseTypeData}
                size="small"
                defaultColumnPinning={{ start: ["name"] }}
                highlightRowOnHover={false}
              />
            </div>
          ) : null}
        </div>
      </CardBody>
    </Card>
  );
}
