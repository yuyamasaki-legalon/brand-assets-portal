import { LfChartBar, LfCheck, LfFilter, LfQuestionCircle, LfSort19, LfSort91, LfTable } from "@legalforce/aegis-icons";
import {
  ActionList,
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  DataTable,
  type DataTableColumnDef,
  Form,
  FormControl,
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
import { CASE_TYPE_COLORS, CASE_TYPE_MAPPING, CASE_TYPE_ORDER } from "../constants";
import { useLocale } from "../hooks/useLocale";
import { useTranslation } from "../hooks/useTranslation";
import { reportTranslations } from "../reportTranslations";
import type { AssigneeFilterMode, DueDateFilter } from "../types";
import {
  BadgeLabel,
  CASE_TYPE_CATEGORY_STYLES,
  CustomChartTooltip,
  CustomYAxisTick,
  chartPalette,
  DUE_DATE_CATEGORY_STYLES,
  getDepartmentStyle,
  HorizontalBarWithDivider,
  type LabelListContentProps,
  RightLabel,
  renderCustomLegend,
  STATUS_CATEGORY_STYLES,
} from "./chart-components";

export interface OngoingCasesStatusCardProps {
  // State
  sortOrder: "asc" | "desc";
  teamCaseSortType: "caseCount" | "name";
  onTeamCaseSortTypeChange: (type: "caseCount" | "name") => void;
  activeDueDateFilter: DueDateFilter;
  activeCaseTypeFilter: string;
  activeStatusFilter: string;
  caseStatusView: "status" | "type" | "dueDate" | "department";
  assigneeFilterMode: AssigneeFilterMode;
  isFilterOpen: boolean;
  teamCaseViewMode: "graph" | "table";
  // Data
  tenantStatusSeriesForTeamBreakdown: Array<{
    key: string;
    name: string;
    color: string;
    badgeVariant?: "no-bg-white-text" | "no-bg-black-text";
    borderColor?: string;
  }>;
  chartData: Array<
    {
      name: string;
      caseNames: Record<string, string[]>;
    } & Record<string, number | string | Record<string, string[]>>
  >;
  teamStatusColumns: (
    | DataTableColumnDef<Record<string, number | string | Record<string, string[]>>, string>
    | DataTableColumnDef<Record<string, number | string | Record<string, string[]>>, number>
  )[];
  maxCaseCount: number;
  membersWithOverdueCases: string[];
  // Handlers
  onSortOrderChange: (order: "asc" | "desc") => void;
  onActiveDueDateFilterChange: (filter: DueDateFilter) => void;
  onActiveCaseTypeFilterChange: (filter: string) => void;
  onActiveStatusFilterChange: (filter: string) => void;
  onCaseStatusViewChange: (view: "status" | "type" | "dueDate" | "department") => void;
  onAssigneeFilterModeChange: (mode: AssigneeFilterMode) => void;
  onIsFilterOpenChange: (open: boolean) => void;
  onTeamCaseViewModeChange: (mode: "graph" | "table") => void;
  onHandleBarClickBase: (
    data: { name?: string },
    filterType: "status" | "caseType" | "dueDate",
    filterValue: string,
  ) => void;
  // For CustomYAxisTick
  onPaneOpenChange: (open: boolean) => void;
  onSelectedMemberChange: (member: string | null) => void;
  onPaneTabIndexChange: (index: number) => void;
  onPaneCaseTypeFilterChange: (filter: string) => void;
  onPaneDueDateFilterChange: (filter: DueDateFilter) => void;
  onPaneStatusFilterChange: (filter: string) => void;
}

export function OngoingCasesStatusCard(props: OngoingCasesStatusCardProps) {
  const [isInfoPopoverOpen, setIsInfoPopoverOpen] = useState(false);
  const [isInfoPopoverPinned, setIsInfoPopoverPinned] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isTeamCaseViewModeMenuOpen, setIsTeamCaseViewModeMenuOpen] = useState(false);
  const [legendHeight, setLegendHeight] = useState(25); // 凡例の高さ（初期値25px）
  const legendContainerRef = useRef<HTMLDivElement>(null);
  const {
    sortOrder,
    teamCaseSortType,
    onTeamCaseSortTypeChange,
    activeDueDateFilter,
    activeCaseTypeFilter,
    activeStatusFilter,
    caseStatusView,
    assigneeFilterMode,
    isFilterOpen,
    teamCaseViewMode,
    tenantStatusSeriesForTeamBreakdown,
    chartData,
    teamStatusColumns,
    maxCaseCount,
    membersWithOverdueCases,
    onSortOrderChange,
    onActiveDueDateFilterChange,
    onActiveCaseTypeFilterChange,
    onActiveStatusFilterChange,
    onCaseStatusViewChange,
    onIsFilterOpenChange,
    onTeamCaseViewModeChange,
    onHandleBarClickBase,
    onPaneOpenChange,
    onSelectedMemberChange,
    onPaneTabIndexChange,
    onPaneCaseTypeFilterChange,
    onPaneDueDateFilterChange,
    onPaneStatusFilterChange,
  } = props;

  const { locale } = useLocale();
  const { t } = useTranslation(reportTranslations);

  // フィルターがアクティブかどうかを判定（主担当・副担当の切り替えは除外）
  const isFiltering =
    activeCaseTypeFilter !== "すべて" || activeStatusFilter !== "すべて" || activeDueDateFilter !== "すべて";

  // 最大値を保持するためのref（assigneeFilterModeが変わった時のみ更新）
  const maxCaseCountRef = useRef<number | null>(null);
  const assigneeFilterModeRef = useRef<AssigneeFilterMode>(assigneeFilterMode);

  // assigneeFilterModeが変わった時のみ最大値を再計算
  useEffect(() => {
    // 初期値が設定されていない場合、またはassigneeFilterModeが変わった場合に再計算
    if (maxCaseCountRef.current === null || assigneeFilterModeRef.current !== assigneeFilterMode) {
      assigneeFilterModeRef.current = assigneeFilterMode;

      if (!chartData || chartData.length === 0) {
        maxCaseCountRef.current = maxCaseCount;
        return;
      }

      const maxValue = Math.max(
        ...chartData.map((row) => {
          // calculateTotalと同じロジックを直接実装
          if (assigneeFilterMode === "main") {
            return Object.keys(row)
              .filter((key) => key.endsWith("_main"))
              .reduce((sum, key) => sum + ((row[key] as number) || 0), 0);
          }
          if (assigneeFilterMode === "sub") {
            return Object.keys(row)
              .filter((key) => key.endsWith("_sub"))
              .reduce((sum, key) => sum + ((row[key] as number) || 0), 0);
          }
          // both: 主担当の合計と副担当の合計を比較し、大きい方を取る
          const mainTotal = Object.keys(row)
            .filter((key) => key.endsWith("_main"))
            .reduce((sum, key) => sum + ((row[key] as number) || 0), 0);
          const subTotal = Object.keys(row)
            .filter((key) => key.endsWith("_sub"))
            .reduce((sum, key) => sum + ((row[key] as number) || 0), 0);
          return Math.max(mainTotal, subTotal);
        }),
      );

      // 数値ラベルの表示スペースを考慮（最大3桁の数値 + offset 8px を考慮）
      // 実際の最大値に約15%の余裕を追加（数値ラベルの幅分）
      // ただし、最小値は実際の最大値 + 1（数値ラベルが切れないように）
      const adjustedMax = Math.max(Math.ceil(maxValue * 1.15), maxValue + 1);
      maxCaseCountRef.current = adjustedMax;
    }
  }, [assigneeFilterMode, chartData, maxCaseCount]);

  // 凡例の高さを動的に測定
  useEffect(() => {
    if (!legendContainerRef.current || teamCaseViewMode !== "graph") return;

    const updateLegendHeight = () => {
      // RechartsのLegend要素を探す（.recharts-legend-wrapperクラス）
      const legendElement = legendContainerRef.current?.querySelector(".recharts-legend-wrapper");
      if (legendElement) {
        const height = legendElement.getBoundingClientRect().height;
        if (height > 0) {
          setLegendHeight(height);
        }
      }
    };

    // 初回測定（Rechartsのレンダリング完了を待つため、少し遅延）
    const timeoutId = setTimeout(() => {
      updateLegendHeight();
    }, 100);

    // ResizeObserverで凡例の高さを監視
    const resizeObserver = new ResizeObserver(() => {
      updateLegendHeight();
    });

    // グラフエリアのdiv要素を監視（横幅変更を検知）
    resizeObserver.observe(legendContainerRef.current);

    // 凡例要素も監視（凡例要素自体のサイズ変更を検知）
    const legendElement = legendContainerRef.current?.querySelector(".recharts-legend-wrapper");
    if (legendElement) {
      resizeObserver.observe(legendElement);
    }

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [teamCaseViewMode]);

  // 合計数を計算する関数
  // 修正: ステータスキー（tenantStatusSeriesForTeamBreakdown）のみを集計対象とする
  const calculateTotal = (payload: Record<string, number>, filterMode: AssigneeFilterMode): number => {
    // 集計対象のステータスキー（_main, _subを除く）
    const statusKeys = tenantStatusSeriesForTeamBreakdown.map((s) => s.key);

    if (filterMode === "main") {
      return statusKeys.reduce((sum, key) => sum + ((payload[`${key}_main`] as number) || 0), 0);
    }
    if (filterMode === "sub") {
      return statusKeys.reduce((sum, key) => sum + ((payload[`${key}_sub`] as number) || 0), 0);
    }
    // both
    return statusKeys.reduce((sum, key) => {
      const main = (payload[`${key}_main`] as number) || 0;
      const sub = (payload[`${key}_sub`] as number) || 0;
      return sum + main + sub;
    }, 0);
  };

  // 依頼部署データの生成（ダミー）
  // 依存配列を空にして、コンポーネントのマウント時に一度だけ生成されるようにする
  const departmentData = useMemo(() => {
    // 部署リスト（22部署）
    const departments = [
      "営業部",
      "マーケティング部",
      "人事部",
      "開発部",
      "経理部",
      "事業開発部",
      "法務部",
      "総務部",
      "広報部",
      "情報システム部",
      "購買部",
      "カスタマーサポート部",
      "品質保証部",
      "製造部",
      "物流部",
      "研究開発部",
      "デザイン部",
      "海外事業部",
      "コンプライアンス室",
      "経営企画室",
      "秘書室",
      "監査室",
    ];

    // ランダムな値を生成
    const data = departments.map((dept) => {
      const count = Math.floor(Math.random() * 50) + 1;
      return { name: dept, count };
    });

    // カウント順にソート
    data.sort((a, b) => b.count - a.count);

    return data;
  }, []);

  // 表示用データ
  const displayDepartmentData = useMemo(() => {
    // 上位10件とその他に分類
    const top10Departments = departmentData.slice(0, 10);
    const otherDepartments = departmentData.slice(10);
    const otherCount = otherDepartments.reduce((sum, d) => sum + d.count, 0);

    // 11件以上の場合、「その他」を確実に追加（otherCountが0でも追加）
    return [...top10Departments, ...(departmentData.length > 10 ? [{ name: "その他", count: otherCount }] : [])];
  }, [departmentData]);

  // 最初のメンバー用の拡張部署データ（追加の8部署を含む、「その他」は最後に配置）
  const extendedDepartmentDataForFirstMember = useMemo(() => {
    const displayDeptNames = new Set(displayDepartmentData.map((d) => d.name));
    const additionalDepts = departmentData
      .filter((d) => !displayDeptNames.has(d.name))
      .slice(0, 8)
      .map((d) => ({ name: d.name, count: 0 }));

    // 「その他」を除いた部署と追加の8部署を結合し、最後に「その他」を追加
    const otherDept = displayDepartmentData.find((d) => d.name === "その他");
    const otherDepts = displayDepartmentData.filter((d) => d.name !== "その他");

    return [...otherDepts, ...additionalDepts, ...(otherDept ? [otherDept] : [])];
  }, [displayDepartmentData, departmentData]);

  // 部署ごとのスタイル情報のマップ（凡例表示用）
  const departmentStyleMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof getDepartmentStyle>>();
    displayDepartmentData.forEach((dept, index) => {
      const isOther = dept.name === "その他";
      map.set(dept.name, getDepartmentStyle(index, isOther));
    });
    return map;
  }, [displayDepartmentData]);

  // 最初のメンバー用の拡張部署スタイルマップ
  const extendedDepartmentStyleMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof getDepartmentStyle>>();
    extendedDepartmentDataForFirstMember.forEach((dept, index) => {
      const isOther = dept.name === "その他";
      map.set(dept.name, getDepartmentStyle(index, isOther));
    });
    return map;
  }, [extendedDepartmentDataForFirstMember]);

  // 依頼部署別の合計を計算（ダミーデータを注入）
  const processedChartData = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];

    // 1. 全メンバーの案件数を合計
    const statusKeys = tenantStatusSeriesForTeamBreakdown.map((s) => s.key);
    const totalAllMain = chartData.reduce((sum, row) => {
      return sum + statusKeys.reduce((s, key) => s + ((row[`${key}_main`] as number) || 0), 0);
    }, 0);
    const totalAllSub = chartData.reduce((sum, row) => {
      return sum + statusKeys.reduce((s, key) => s + ((row[`${key}_sub`] as number) || 0), 0);
    }, 0);

    return chartData.map((row, index) => {
      // 既存のデータをコピー
      const newRow = { ...row };

      const statusKeys = tenantStatusSeriesForTeamBreakdown.map((s) => s.key);

      if (index === 0) {
        // 2. 最初のメンバーに全案件を割り当て、全部署に分配（追加の8部署も含める）
        const distributeTotal = (total: number, suffix: string) => {
          if (total === 0) return;

          const otherDept = displayDepartmentData.find((d) => d.name === "その他");
          const otherDepts = displayDepartmentData.filter((d) => d.name !== "その他");

          // 追加の8部署を取得（displayDepartmentDataに含まれていない部署から選択）
          const displayDeptNames = new Set(displayDepartmentData.map((d) => d.name));
          const additionalDepts = departmentData
            .filter((d) => !displayDeptNames.has(d.name))
            .slice(0, 8)
            .map((d) => d.name);

          // 全部署（既存 + 追加8部署）を結合
          const allDepts = [...otherDepts.map((d) => d.name), ...additionalDepts];
          const totalDeptCount = allDepts.length + (otherDept ? 1 : 0);

          let remaining = total;

          // 各部署に少なくとも1件以上割り当てる
          for (let i = 0; i < allDepts.length; i++) {
            const deptName = allDepts[i];
            const minAllocation = 1;
            const maxAllocation = Math.max(minAllocation, Math.floor(remaining / (totalDeptCount - i)));
            const allocation = Math.min(maxAllocation, remaining - (totalDeptCount - i - 1));

            newRow[`${deptName}_${suffix}`] = allocation;
            remaining -= allocation;
          }

          if (otherDept) {
            newRow[`${otherDept.name}_${suffix}`] = remaining;
          }
        };

        distributeTotal(totalAllMain, "main");
        distributeTotal(totalAllSub, "sub");
      } else {
        // 3. 他のメンバーは元のロジック通りに処理
        const totalMain = statusKeys.reduce((sum, key) => sum + ((row[`${key}_main`] as number) || 0), 0);
        const totalSub = statusKeys.reduce((sum, key) => sum + ((row[`${key}_sub`] as number) || 0), 0);

        // 上位10部署 + その他 に合計値を分配（ダミーロジック）
        // ランダムに分配するが、合計値は必ず一致させる
        const distributeTotal = (total: number, suffix: string) => {
          if (total === 0) return;

          // 「その他」を明示的に識別
          const otherDept = displayDepartmentData.find((d) => d.name === "その他");
          const otherDepts = displayDepartmentData.filter((d) => d.name !== "その他");

          let remaining = total;

          // 「その他」以外の部署にランダムに分配
          for (let i = 0; i < otherDepts.length; i++) {
            const dept = otherDepts[i];
            // 残りの件数に対してランダムな割合（0〜30%程度）を割り当て
            // ただし、「その他」に残す分を考慮（最低1以上を残す）
            const maxAllocation = Math.min(remaining - (otherDept ? 1 : 0), Math.ceil(total * 0.3));
            const allocation = Math.floor(Math.random() * (maxAllocation + 1));

            newRow[`${dept.name}_${suffix}`] = allocation;
            remaining -= allocation;
          }

          // 「その他」に残りを全て割り当て（確実に値が入るようにする）
          if (otherDept) {
            newRow[`${otherDept.name}_${suffix}`] = remaining;
          }
        };

        distributeTotal(totalMain, "main");
        distributeTotal(totalSub, "sub");
      }

      return newRow;
    });
  }, [chartData, displayDepartmentData, tenantStatusSeriesForTeamBreakdown, departmentData]);

  // グラフの高さを計算
  const barCategoryGap = 16; // カテゴリ間のギャップ（px）
  const barSize = 32;
  const barGap = 4; // 主担当と副担当の間のギャップ
  const barSegmentGap = 1; // 積み上げバーのセグメント間の白い余白（px）
  const baseRowHeight = assigneeFilterMode === "both" ? barSize * 2 + barGap : barSize; // 主担当+副担当: 32 + 4 + 32 = 68px, 主担当のみ: 32px
  const gapHeight = barCategoryGap; // 固定値（px）
  const marginHeight = 24 + 24; // top + bottom
  const xAxisHeight = 22; // tickMargin + tick height
  // legendHeightはuseStateで動的に管理
  const fixedElementsHeight = marginHeight + xAxisHeight + legendHeight;
  const rowCount = chartData?.length ?? 0;
  // 最後の行の後のギャップを除外: 行数 × baseRowHeight + (行数 - 1) × gapHeight
  const calculatedHeight = rowCount * baseRowHeight + Math.max(0, rowCount - 1) * gapHeight + fixedElementsHeight;

  // 実際に表示されるデータの最大値（assigneeFilterModeが変わった時のみ再計算、フィルター時は保持した値を使用）
  const actualMaxCaseCount = maxCaseCountRef.current ?? maxCaseCount;

  return (
    <Card variant="fill">
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
              <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)", alignItems: "center" }}>
                <Text variant="body.medium.bold">{t("teamCaseStatus")}</Text>
                <Popover
                  open={isInfoPopoverOpen}
                  onOpenChange={(open) => {
                    setIsInfoPopoverOpen(open);
                    if (!open) {
                      setIsInfoPopoverPinned(false);
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
                      aria-label={t("teamCaseStatus")}
                      icon={LfQuestionCircle}
                      onMouseEnter={() => {
                        if (!isInfoPopoverPinned) {
                          setIsInfoPopoverOpen(true);
                        }
                      }}
                      onMouseLeave={() => {
                        if (!isInfoPopoverPinned) {
                          setIsInfoPopoverOpen(false);
                        }
                      }}
                      onClickCapture={(e) => {
                        e.stopPropagation();
                        setIsInfoPopoverOpen(true);
                        setIsInfoPopoverPinned(true);
                      }}
                    />
                  </Popover.Anchor>
                  <Popover.Content width="small">
                    <Popover.Body>
                      <Text variant="body.small" style={{ whiteSpace: "pre-line" }}>
                        <span style={{ fontWeight: "bold" }}>{t("teamCaseStatusDescriptionTitle")}</span>
                        {"\n"}
                        {t("teamCaseStatusDescriptionBody")}
                      </Text>
                    </Popover.Body>
                  </Popover.Content>
                </Popover>
              </div>
              <Select
                variant="outline"
                size="medium"
                value={caseStatusView}
                onChange={(value) => {
                  if (value === "dueDate" || value === "status" || value === "type" || value === "department") {
                    onCaseStatusViewChange(value);
                  }
                }}
                options={[
                  { label: t("dueDateView"), value: "dueDate" },
                  { label: t("statusView"), value: "status" },
                  { label: t("caseTypeView"), value: "type" },
                  { label: t("departmentView"), value: "department" },
                ]}
                style={{ width: "auto" }}
                placement="bottom-start"
              />
            </div>
            <div style={{ display: "flex", gap: "var(--aegis-space-small)", alignItems: "center" }}>
              <ButtonGroup variant="plain" size="medium">
                <Menu open={isSortMenuOpen} onOpenChange={setIsSortMenuOpen} placement="bottom-end">
                  <Menu.Anchor>
                    <Button size="medium" leading={<Icon>{sortOrder === "asc" ? <LfSort19 /> : <LfSort91 />}</Icon>}>
                      {teamCaseSortType === "caseCount" ? t("caseCount") : t("userName")}
                    </Button>
                  </Menu.Anchor>
                  <Menu.Box width="auto">
                    <ActionList size="large">
                      <ActionList.Item
                        selected={teamCaseSortType === "caseCount" && sortOrder === "asc"}
                        onClick={() => {
                          onTeamCaseSortTypeChange("caseCount");
                          onSortOrderChange("asc");
                          setIsSortMenuOpen(false);
                        }}
                      >
                        <ActionList.Body
                          leading={
                            <Icon>
                              <LfSort19 />
                            </Icon>
                          }
                          trailing={
                            teamCaseSortType === "caseCount" && sortOrder === "asc" ? (
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
                        selected={teamCaseSortType === "caseCount" && sortOrder === "desc"}
                        onClick={() => {
                          onTeamCaseSortTypeChange("caseCount");
                          onSortOrderChange("desc");
                          setIsSortMenuOpen(false);
                        }}
                      >
                        <ActionList.Body
                          leading={
                            <Icon>
                              <LfSort91 />
                            </Icon>
                          }
                          trailing={
                            teamCaseSortType === "caseCount" && sortOrder === "desc" ? (
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
                        selected={teamCaseSortType === "name" && sortOrder === "asc"}
                        onClick={() => {
                          onTeamCaseSortTypeChange("name");
                          onSortOrderChange("asc");
                          setIsSortMenuOpen(false);
                        }}
                      >
                        <ActionList.Body
                          leading={
                            <Icon>
                              <LfSort19 />
                            </Icon>
                          }
                          trailing={
                            teamCaseSortType === "name" && sortOrder === "asc" ? (
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
                        selected={teamCaseSortType === "name" && sortOrder === "desc"}
                        onClick={() => {
                          onTeamCaseSortTypeChange("name");
                          onSortOrderChange("desc");
                          setIsSortMenuOpen(false);
                        }}
                      >
                        <ActionList.Body
                          leading={
                            <Icon>
                              <LfSort91 />
                            </Icon>
                          }
                          trailing={
                            teamCaseSortType === "name" && sortOrder === "desc" ? (
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
                <Popover open={isFilterOpen} onOpenChange={onIsFilterOpenChange} placement="bottom-end">
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
                          <FormControl.Label>{t("dueDate")}</FormControl.Label>
                          <Select
                            size="medium"
                            value={activeDueDateFilter}
                            onChange={(value) => onActiveDueDateFilterChange(value as DueDateFilter)}
                            options={[
                              { label: t("dueDateFilterAll"), value: "すべて" },
                              { label: t("dueDateFilterNoDueDate"), value: "納期未入力" },
                              { label: t("dueDateFilterOverdue"), value: "納期超過" },
                              { label: t("dueDateFilterToday"), value: "今日まで" },
                              { label: t("dueDateFilter1to3Days"), value: "今日含め3日以内" },
                              { label: t("dueDateFilter4to7Days"), value: "今日含め7日以内" },
                              { label: t("dueDateFilter8DaysPlus"), value: "1週間後〜" },
                            ]}
                          />
                        </FormControl>
                        <FormControl orientation="vertical">
                          <FormControl.Label>{t("status")}</FormControl.Label>
                          <Select
                            size="medium"
                            value={activeStatusFilter}
                            onChange={onActiveStatusFilterChange}
                            options={[
                              { label: t("allStatus"), value: "すべて" },
                              ...tenantStatusSeriesForTeamBreakdown.map((s) => ({
                                label: s.name,
                                value: s.key,
                              })),
                            ]}
                          />
                        </FormControl>
                        <FormControl orientation="vertical">
                          <FormControl.Label>{t("caseType")}</FormControl.Label>
                          <Select
                            size="medium"
                            value={activeCaseTypeFilter}
                            onChange={onActiveCaseTypeFilterChange}
                            options={[
                              { label: t("all"), value: "すべて" },
                              ...CASE_TYPE_ORDER.map((type) => ({
                                label: CASE_TYPE_MAPPING[locale][type] || type,
                                value: type,
                              })),
                            ]}
                          />
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
                      onActiveCaseTypeFilterChange("すべて");
                      onActiveStatusFilterChange("すべて");
                      onActiveDueDateFilterChange("すべて");
                    }}
                  >
                    {t("reset")}
                  </Button>
                )}
                <Menu
                  open={isTeamCaseViewModeMenuOpen}
                  onOpenChange={setIsTeamCaseViewModeMenuOpen}
                  placement="bottom-end"
                >
                  <Menu.Anchor>
                    <Tooltip title={teamCaseViewMode === "graph" ? t("graph") : t("table")}>
                      <IconButton
                        variant="plain"
                        size="medium"
                        aria-label={teamCaseViewMode === "graph" ? t("graph") : t("table")}
                        icon={teamCaseViewMode === "graph" ? LfChartBar : LfTable}
                      />
                    </Tooltip>
                  </Menu.Anchor>
                  <Menu.Box width="auto">
                    <ActionList size="large">
                      <ActionList.Item
                        selected={teamCaseViewMode === "graph"}
                        onClick={() => {
                          onTeamCaseViewModeChange("graph");
                          setIsTeamCaseViewModeMenuOpen(false);
                        }}
                      >
                        <ActionList.Body
                          leading={
                            <Icon>
                              <LfChartBar />
                            </Icon>
                          }
                          trailing={
                            teamCaseViewMode === "graph" ? (
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
                        selected={teamCaseViewMode === "table"}
                        onClick={() => {
                          onTeamCaseViewModeChange("table");
                          setIsTeamCaseViewModeMenuOpen(false);
                        }}
                      >
                        <ActionList.Body
                          leading={
                            <Icon>
                              <LfTable />
                            </Icon>
                          }
                          trailing={
                            teamCaseViewMode === "table" ? (
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
            </div>
          </div>

          {teamCaseViewMode === "graph" ? (
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
              {(caseStatusView === "status" ||
                caseStatusView === "type" ||
                caseStatusView === "dueDate" ||
                caseStatusView === "department") && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={caseStatusView === "department" ? processedChartData : chartData}
                    layout="vertical"
                    margin={{ right: 16 }}
                    accessibilityLayer
                    barCategoryGap={barCategoryGap}
                    barSize={32}
                    barGap={4}
                  >
                    <CartesianGrid horizontal={false} vertical={false} stroke="#e2e8f0" />
                    <XAxis type="number" domain={[0, actualMaxCaseCount]} hide />
                    <YAxis
                      type="category"
                      dataKey="name"
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
                          assigneeFilterMode={assigneeFilterMode}
                          targetPaneTabIndex={1}
                          locale={locale}
                        />
                      )}
                      width={160}
                      interval={0}
                      axisLine={false}
                      tickLine={false}
                      tickMargin={0}
                    />
                    <RechartsTooltip
                      content={
                        <CustomChartTooltip
                          caseStatusView={caseStatusView}
                          locale={locale}
                          tenantStatusSeriesForTeamBreakdown={tenantStatusSeriesForTeamBreakdown}
                        />
                      }
                      shared={false}
                      cursor={{ fill: "#f1f5f9" }}
                      wrapperStyle={{
                        outline: "none",
                        transition: "none",
                      }}
                      animationDuration={0}
                    />
                    <Legend
                      content={renderCustomLegend({
                        caseStatusView,
                        tenantStatusSeriesForTeamBreakdown,
                        locale,
                        displayDepartmentData:
                          caseStatusView === "department"
                            ? processedChartData?.[0]
                              ? extendedDepartmentDataForFirstMember
                              : displayDepartmentData
                            : undefined,
                        departmentStyleMap:
                          caseStatusView === "department"
                            ? processedChartData?.[0]
                              ? extendedDepartmentStyleMap
                              : departmentStyleMap
                            : undefined,
                      })}
                    />
                    {caseStatusView === "status" ? (
                      <>
                        {(assigneeFilterMode === "main" || assigneeFilterMode === "both") &&
                          tenantStatusSeriesForTeamBreakdown.map((status, _index, array) => {
                            const isLast = _index === array.length - 1;
                            return (
                              <Bar
                                key={`${status.key}_main`}
                                dataKey={`${status.key}_main`}
                                name={status.name}
                                stackId="0"
                                fill={
                                  STATUS_CATEGORY_STYLES[status.key]?.svgPattern
                                    ? "transparent"
                                    : (STATUS_CATEGORY_STYLES[status.key]?.backgroundColor ?? status.color)
                                }
                                onClick={(data) => onHandleBarClickBase(data, "status", status.key)}
                                // biome-ignore lint/suspicious/noExplicitAny: Recharts Bar shape prop type
                                shape={(barProps: any) => {
                                  const { payload, dataKey } = barProps;
                                  const currentIndex = array.findIndex((s) => `${s.key}_main` === dataKey);
                                  const hasValueAfter = array
                                    .slice(currentIndex + 1)
                                    .some((s) => ((payload?.[`${s.key}_main`] as number) || 0) > 0);
                                  const hasValueBefore = array
                                    .slice(0, currentIndex)
                                    .some((s) => ((payload?.[`${s.key}_main`] as number) || 0) > 0);
                                  const statusStyle = STATUS_CATEGORY_STYLES[status.key];
                                  const barBorder = statusStyle?.barBorder ?? {
                                    color: status.borderColor ?? statusStyle?.backgroundColor ?? status.color,
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
                                  dataKey={`${status.key}_main`}
                                  content={(props: LabelListContentProps) => (
                                    <BadgeLabel
                                      {...props}
                                      dataKey={`${status.key}_main`}
                                      badgeVariant={
                                        STATUS_CATEGORY_STYLES[status.key]?.badgeVariant ??
                                        status.badgeVariant ??
                                        "no-bg-black-text"
                                      }
                                    />
                                  )}
                                />
                                {isLast && (
                                  <LabelList
                                    content={(props: LabelListContentProps) => {
                                      // props.indexを使ってchartDataから現在の行のデータを取得
                                      if (props.index === undefined) return null;
                                      const rowData = chartData?.[props.index];
                                      if (!rowData) return null;
                                      // 主担当の合計のみを計算
                                      const total = calculateTotal(rowData as Record<string, number>, "main");
                                      if (total === 0) return null;
                                      return <RightLabel {...props} value={total} dataKey="案件数" offset={8} />;
                                    }}
                                  />
                                )}
                              </Bar>
                            );
                          })}
                        {(assigneeFilterMode === "sub" || assigneeFilterMode === "both") &&
                          tenantStatusSeriesForTeamBreakdown.map((status, _index, array) => {
                            const isLast = _index === array.length - 1;
                            return (
                              <Bar
                                key={`${status.key}_sub`}
                                dataKey={`${status.key}_sub`}
                                name={status.name}
                                stackId="1"
                                fill={
                                  STATUS_CATEGORY_STYLES[status.key]?.svgPattern
                                    ? "transparent"
                                    : (STATUS_CATEGORY_STYLES[status.key]?.backgroundColor ?? status.color)
                                }
                                opacity={0.6}
                                onClick={(data) => onHandleBarClickBase(data, "status", status.key)}
                                // biome-ignore lint/suspicious/noExplicitAny: Recharts Bar shape prop type
                                shape={(barProps: any) => {
                                  const { payload, dataKey } = barProps;
                                  const currentIndex = array.findIndex((s) => `${s.key}_sub` === dataKey);
                                  const hasValueAfter = array
                                    .slice(currentIndex + 1)
                                    .some((s) => ((payload?.[`${s.key}_sub`] as number) || 0) > 0);
                                  const hasValueBefore = array
                                    .slice(0, currentIndex)
                                    .some((s) => ((payload?.[`${s.key}_sub`] as number) || 0) > 0);
                                  const statusStyle = STATUS_CATEGORY_STYLES[status.key];
                                  const barBorder = statusStyle?.barBorder ?? {
                                    color: status.borderColor ?? statusStyle?.backgroundColor ?? status.color,
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
                                  dataKey={`${status.key}_sub`}
                                  content={(props: LabelListContentProps) => (
                                    <BadgeLabel
                                      {...props}
                                      dataKey={`${status.key}_sub`}
                                      badgeVariant={
                                        STATUS_CATEGORY_STYLES[status.key]?.badgeVariant ??
                                        status.badgeVariant ??
                                        "no-bg-black-text"
                                      }
                                    />
                                  )}
                                />
                                {isLast && (assigneeFilterMode === "sub" || assigneeFilterMode === "both") && (
                                  <LabelList
                                    dataKey={`${status.key}_sub`}
                                    content={(props: LabelListContentProps) => {
                                      if (props.index === undefined) return null;
                                      const rowData = chartData?.[props.index];
                                      if (!rowData) return null;
                                      // 副担当の合計のみを計算
                                      const total = calculateTotal(rowData as Record<string, number>, "sub");
                                      if (total === 0) return null;
                                      return <RightLabel {...props} value={total} dataKey="案件数" offset={8} />;
                                    }}
                                  />
                                )}
                              </Bar>
                            );
                          })}
                      </>
                    ) : caseStatusView === "type" ? (
                      <>
                        {(assigneeFilterMode === "main" || assigneeFilterMode === "both") &&
                          CASE_TYPE_ORDER.map((caseType, index, array) => {
                            const localizedCaseType = (CASE_TYPE_MAPPING[locale]?.[caseType] as string) || caseType;
                            const isLast = index === array.length - 1;
                            return (
                              <Bar
                                key={`${caseType}_main`}
                                dataKey={`${caseType}_main`}
                                name={localizedCaseType}
                                stackId="0"
                                fill={
                                  CASE_TYPE_CATEGORY_STYLES[caseType]?.svgPattern
                                    ? "transparent"
                                    : (CASE_TYPE_CATEGORY_STYLES[caseType]?.backgroundColor ??
                                      CASE_TYPE_COLORS[caseType])
                                }
                                onClick={(data) => onHandleBarClickBase(data, "caseType", caseType)}
                                // biome-ignore lint/suspicious/noExplicitAny: Recharts Bar shape prop type
                                shape={(barProps: any) => {
                                  const { payload } = barProps;
                                  const hasValueAfter = array
                                    .slice(index + 1)
                                    .some((it) => ((payload?.[`${it}_main`] as number) || 0) > 0);
                                  const hasValueBefore = array
                                    .slice(0, index)
                                    .some((it) => ((payload?.[`${it}_main`] as number) || 0) > 0);
                                  const caseTypeStyle = CASE_TYPE_CATEGORY_STYLES[caseType];
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
                                      svgPattern={caseTypeStyle?.svgPattern}
                                      barBorder={caseTypeStyle?.barBorder}
                                      gap={barSegmentGap}
                                      hasValueBefore={hasValueBefore}
                                      hasValueAfter={hasValueAfter}
                                    />
                                  );
                                }}
                              >
                                <LabelList
                                  dataKey={`${caseType}_main`}
                                  content={(props: LabelListContentProps) => (
                                    <BadgeLabel
                                      {...props}
                                      dataKey={`${caseType}_main`}
                                      badgeVariant={CASE_TYPE_CATEGORY_STYLES[caseType]?.badgeVariant}
                                    />
                                  )}
                                />
                                {isLast && (
                                  <LabelList
                                    content={(props: LabelListContentProps) => {
                                      if (props.index === undefined) return null;
                                      const rowData = chartData?.[props.index];
                                      if (!rowData) return null;
                                      // 主担当の合計のみを計算
                                      const total = calculateTotal(rowData as Record<string, number>, "main");
                                      if (total === 0) return null;
                                      return <RightLabel {...props} value={total} dataKey="案件数" offset={8} />;
                                    }}
                                  />
                                )}
                              </Bar>
                            );
                          })}
                        {(assigneeFilterMode === "sub" || assigneeFilterMode === "both") &&
                          CASE_TYPE_ORDER.map((caseType, index, array) => {
                            const localizedCaseType = (CASE_TYPE_MAPPING[locale]?.[caseType] as string) || caseType;
                            const isLast = index === array.length - 1;
                            return (
                              <Bar
                                key={`${caseType}_sub`}
                                dataKey={`${caseType}_sub`}
                                name={localizedCaseType}
                                stackId="1"
                                fill={
                                  CASE_TYPE_CATEGORY_STYLES[caseType]?.svgPattern
                                    ? "transparent"
                                    : (CASE_TYPE_CATEGORY_STYLES[caseType]?.backgroundColor ??
                                      CASE_TYPE_COLORS[caseType])
                                }
                                opacity={0.6}
                                onClick={(data) => onHandleBarClickBase(data, "caseType", caseType)}
                                // biome-ignore lint/suspicious/noExplicitAny: Recharts Bar shape prop type
                                shape={(barProps: any) => {
                                  const { payload } = barProps;
                                  const hasValueAfter = array
                                    .slice(index + 1)
                                    .some((it) => ((payload?.[`${it}_sub`] as number) || 0) > 0);
                                  const hasValueBefore = array
                                    .slice(0, index)
                                    .some((it) => ((payload?.[`${it}_sub`] as number) || 0) > 0);
                                  const caseTypeStyle = CASE_TYPE_CATEGORY_STYLES[caseType];
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
                                      svgPattern={caseTypeStyle?.svgPattern}
                                      barBorder={caseTypeStyle?.barBorder}
                                      gap={barSegmentGap}
                                      hasValueBefore={hasValueBefore}
                                      hasValueAfter={hasValueAfter}
                                    />
                                  );
                                }}
                              >
                                <LabelList
                                  dataKey={`${caseType}_sub`}
                                  content={(props: LabelListContentProps) => (
                                    <BadgeLabel
                                      {...props}
                                      dataKey={`${caseType}_sub`}
                                      badgeVariant={CASE_TYPE_CATEGORY_STYLES[caseType]?.badgeVariant}
                                    />
                                  )}
                                />
                                {isLast && (assigneeFilterMode === "sub" || assigneeFilterMode === "both") && (
                                  <LabelList
                                    dataKey={`${caseType}_sub`}
                                    content={(props: LabelListContentProps) => {
                                      if (props.index === undefined) return null;
                                      const rowData = chartData?.[props.index];
                                      if (!rowData) return null;
                                      // 副担当の合計のみを計算
                                      const total = calculateTotal(rowData as Record<string, number>, "sub");
                                      if (total === 0) return null;
                                      return <RightLabel {...props} value={total} dataKey="案件数" offset={8} />;
                                    }}
                                  />
                                )}
                              </Bar>
                            );
                          })}
                      </>
                    ) : caseStatusView === "dueDate" ? (
                      <>
                        {(assigneeFilterMode === "main" || assigneeFilterMode === "both") &&
                          (() => {
                            // 納期フィルターと同じ順番: 未入力→超過→今日→2日以内→3-6日以内→7日以降
                            const dueDateCategoryKeys = [
                              "未入力",
                              "超過",
                              "今日",
                              "2日以内",
                              "3-6日以内",
                              "7日以降",
                            ] as const;
                            const dueDateCategories = dueDateCategoryKeys.map((key) => ({
                              key,
                              style: DUE_DATE_CATEGORY_STYLES[key],
                            }));
                            const dueDateKeyToLegendLabel: Record<string, string> = {
                              超過: t("dueDateFilterOverdue"),
                              今日: t("dueDateFilterToday"),
                              "2日以内": t("dueDateLegend3Days"),
                              "3-6日以内": t("dueDateLegend1Week"),
                              "7日以降": t("dueDateFilter8DaysPlus"),
                              未入力: t("dueDateFilterNoDueDate"),
                            };
                            return dueDateCategories.map((category, _index, array) => {
                              const localizedName = dueDateKeyToLegendLabel[category.key] ?? category.key;
                              const isLast = _index === array.length - 1;
                              return (
                                <Bar
                                  key={`${category.key}_main`}
                                  dataKey={`${category.key}_main`}
                                  name={localizedName}
                                  stackId="0"
                                  fill={category.style.backgroundColor}
                                  onClick={(data) => onHandleBarClickBase(data, "dueDate", category.key)}
                                  // biome-ignore lint/suspicious/noExplicitAny: Recharts Bar shape prop type
                                  shape={(barProps: any) => {
                                    const { payload, dataKey } = barProps;
                                    const currentIndex = array.findIndex((c) => `${c.key}_main` === dataKey);
                                    const hasValueAfter = array
                                      .slice(currentIndex + 1)
                                      .some((c) => ((payload?.[`${c.key}_main`] as number) || 0) > 0);
                                    const hasValueBefore = array
                                      .slice(0, currentIndex)
                                      .some((c) => ((payload?.[`${c.key}_main`] as number) || 0) > 0);
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
                                        svgPattern={category.style.svgPattern}
                                        barBorder={category.style.barBorder}
                                        gap={barSegmentGap}
                                        hasValueBefore={hasValueBefore}
                                        hasValueAfter={hasValueAfter}
                                      />
                                    );
                                  }}
                                >
                                  <LabelList
                                    dataKey={`${category.key}_main`}
                                    content={(props: LabelListContentProps) => (
                                      <BadgeLabel
                                        {...props}
                                        dataKey={`${category.key}_main`}
                                        badgeVariant={category.style.badgeVariant}
                                      />
                                    )}
                                  />
                                  {isLast && (
                                    <LabelList
                                      content={(props: LabelListContentProps) => {
                                        if (props.index === undefined) return null;
                                        const rowData = chartData?.[props.index];
                                        if (!rowData) return null;
                                        // 主担当の合計のみを計算
                                        const total = calculateTotal(rowData as Record<string, number>, "main");
                                        if (total === 0) return null;
                                        return <RightLabel {...props} value={total} dataKey="案件数" offset={8} />;
                                      }}
                                    />
                                  )}
                                </Bar>
                              );
                            });
                          })()}
                        {(assigneeFilterMode === "sub" || assigneeFilterMode === "both") &&
                          (() => {
                            // 納期フィルターと同じ順番: 未入力→超過→今日→2日以内→3-6日以内→7日以降
                            const dueDateCategoryKeys = [
                              "未入力",
                              "超過",
                              "今日",
                              "2日以内",
                              "3-6日以内",
                              "7日以降",
                            ] as const;
                            const dueDateCategories = dueDateCategoryKeys.map((key) => ({
                              key,
                              style: DUE_DATE_CATEGORY_STYLES[key],
                            }));
                            const dueDateKeyToLegendLabel: Record<string, string> = {
                              超過: t("dueDateFilterOverdue"),
                              今日: t("dueDateFilterToday"),
                              "2日以内": t("dueDateLegend3Days"),
                              "3-6日以内": t("dueDateLegend1Week"),
                              "7日以降": t("dueDateFilter8DaysPlus"),
                              未入力: t("dueDateFilterNoDueDate"),
                            };
                            return dueDateCategories.map((category, _index, array) => {
                              const localizedName = dueDateKeyToLegendLabel[category.key] ?? category.key;
                              const isLast = _index === array.length - 1;
                              return (
                                <Bar
                                  key={`${category.key}_sub`}
                                  dataKey={`${category.key}_sub`}
                                  name={localizedName}
                                  stackId="1"
                                  fill={category.style.backgroundColor}
                                  opacity={0.6}
                                  onClick={(data) => onHandleBarClickBase(data, "dueDate", category.key)}
                                  // biome-ignore lint/suspicious/noExplicitAny: Recharts Bar shape prop type
                                  shape={(barProps: any) => {
                                    const { payload, dataKey } = barProps;
                                    const currentIndex = array.findIndex((c) => `${c.key}_sub` === dataKey);
                                    const hasValueAfter = array
                                      .slice(currentIndex + 1)
                                      .some((c) => ((payload?.[`${c.key}_sub`] as number) || 0) > 0);
                                    const hasValueBefore = array
                                      .slice(0, currentIndex)
                                      .some((c) => ((payload?.[`${c.key}_sub`] as number) || 0) > 0);
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
                                        svgPattern={category.style.svgPattern}
                                        barBorder={category.style.barBorder}
                                        gap={barSegmentGap}
                                        hasValueBefore={hasValueBefore}
                                        hasValueAfter={hasValueAfter}
                                      />
                                    );
                                  }}
                                >
                                  <LabelList
                                    dataKey={`${category.key}_sub`}
                                    content={(props: LabelListContentProps) => (
                                      <BadgeLabel
                                        {...props}
                                        dataKey={`${category.key}_sub`}
                                        badgeVariant={category.style.badgeVariant}
                                      />
                                    )}
                                  />
                                  {isLast && (assigneeFilterMode === "sub" || assigneeFilterMode === "both") && (
                                    <LabelList
                                      dataKey={`${category.key}_sub`}
                                      content={(props: LabelListContentProps) => {
                                        if (props.index === undefined) return null;
                                        const rowData = chartData?.[props.index];
                                        if (!rowData) return null;
                                        // 副担当の合計のみを計算
                                        const total = calculateTotal(rowData as Record<string, number>, "sub");
                                        if (total === 0) return null;
                                        return <RightLabel {...props} value={total} dataKey="案件数" offset={8} />;
                                      }}
                                    />
                                  )}
                                </Bar>
                              );
                            });
                          })()}
                      </>
                    ) : caseStatusView === "department" ? (
                      <>
                        {(assigneeFilterMode === "main" || assigneeFilterMode === "both") &&
                          (() => {
                            // 最初のメンバーの場合のみ拡張された部署データを使用
                            const deptDataToUse = processedChartData?.[0]
                              ? extendedDepartmentDataForFirstMember
                              : displayDepartmentData;
                            return deptDataToUse.map((dept, index, array) => {
                              const isOther = dept.name === "その他";
                              const deptStyle = getDepartmentStyle(index, isOther);
                              const isLast = index === array.length - 1;

                              return (
                                <Bar
                                  key={`${dept.name}_main`}
                                  dataKey={`${dept.name}_main`}
                                  name={dept.name}
                                  stackId="0"
                                  fill={
                                    deptStyle.svgPattern
                                      ? "transparent"
                                      : (deptStyle.backgroundColor ?? chartPalette.neutral["400"])
                                  }
                                  // biome-ignore lint/suspicious/noExplicitAny: Recharts Bar shape prop type
                                  shape={(barProps: any) => {
                                    const { payload, dataKey } = barProps;
                                    const currentIndex = array.findIndex((d) => `${d.name}_main` === dataKey);
                                    const hasValueAfter = array
                                      .slice(currentIndex + 1)
                                      .some((d) => ((payload?.[`${d.name}_main`] as number) || 0) > 0);
                                    const hasValueBefore = array
                                      .slice(0, currentIndex)
                                      .some((d) => ((payload?.[`${d.name}_main`] as number) || 0) > 0);

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
                                        svgPattern={deptStyle.svgPattern}
                                        barBorder={deptStyle.barBorder}
                                        gap={barSegmentGap}
                                        hasValueBefore={hasValueBefore}
                                        hasValueAfter={hasValueAfter}
                                      />
                                    );
                                  }}
                                >
                                  <LabelList
                                    dataKey={`${dept.name}_main`}
                                    content={(props: LabelListContentProps) => (
                                      <BadgeLabel
                                        {...props}
                                        dataKey={`${dept.name}_main`}
                                        badgeVariant={deptStyle.badgeVariant}
                                      />
                                    )}
                                  />
                                  {isLast && (
                                    <LabelList
                                      content={(props: LabelListContentProps) => {
                                        if (props.index === undefined) return null;
                                        const rowData = processedChartData?.[props.index];
                                        if (!rowData) return null;
                                        const total = calculateTotal(rowData as Record<string, number>, "main");
                                        if (total === 0) return null;

                                        // bar全体の右端に表示するため、最後のセグメントのx + widthを使用
                                        // Rechartsの積み上げバーでは、最後のセグメントのx + widthがbar全体の右端になる
                                        const numX =
                                          typeof props.x === "string" ? parseFloat(props.x) || 0 : (props.x ?? 0);
                                        const numWidth =
                                          typeof props.width === "string"
                                            ? parseFloat(props.width) || 0
                                            : (props.width ?? 0);

                                        return (
                                          <RightLabel
                                            {...props}
                                            x={numX}
                                            width={numWidth}
                                            value={total}
                                            dataKey="案件数"
                                            offset={8}
                                          />
                                        );
                                      }}
                                    />
                                  )}
                                </Bar>
                              );
                            });
                          })()}
                        {(assigneeFilterMode === "sub" || assigneeFilterMode === "both") &&
                          (() => {
                            // 最初のメンバーの場合のみ拡張された部署データを使用
                            const deptDataToUse = processedChartData?.[0]
                              ? extendedDepartmentDataForFirstMember
                              : displayDepartmentData;
                            return deptDataToUse.map((dept, index, array) => {
                              const isOther = dept.name === "その他";
                              const deptStyle = getDepartmentStyle(index, isOther);
                              const isLast = index === array.length - 1;

                              return (
                                <Bar
                                  key={`${dept.name}_sub`}
                                  dataKey={`${dept.name}_sub`}
                                  name={dept.name}
                                  stackId="1"
                                  fill={
                                    deptStyle.svgPattern
                                      ? "transparent"
                                      : (deptStyle.backgroundColor ?? chartPalette.neutral["400"])
                                  }
                                  opacity={0.6}
                                  // biome-ignore lint/suspicious/noExplicitAny: Recharts Bar shape prop type
                                  shape={(barProps: any) => {
                                    const { payload, dataKey } = barProps;
                                    const currentIndex = array.findIndex((d) => `${d.name}_sub` === dataKey);
                                    const hasValueAfter = array
                                      .slice(currentIndex + 1)
                                      .some((d) => ((payload?.[`${d.name}_sub`] as number) || 0) > 0);
                                    const hasValueBefore = array
                                      .slice(0, currentIndex)
                                      .some((d) => ((payload?.[`${d.name}_sub`] as number) || 0) > 0);

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
                                        svgPattern={deptStyle.svgPattern}
                                        barBorder={deptStyle.barBorder}
                                        gap={barSegmentGap}
                                        hasValueBefore={hasValueBefore}
                                        hasValueAfter={hasValueAfter}
                                      />
                                    );
                                  }}
                                >
                                  <LabelList
                                    dataKey={`${dept.name}_sub`}
                                    content={(props: LabelListContentProps) => (
                                      <BadgeLabel
                                        {...props}
                                        dataKey={`${dept.name}_sub`}
                                        badgeVariant={deptStyle.badgeVariant}
                                      />
                                    )}
                                  />
                                  {isLast && (assigneeFilterMode === "sub" || assigneeFilterMode === "both") && (
                                    <LabelList
                                      dataKey={`${dept.name}_sub`}
                                      content={(props: LabelListContentProps) => {
                                        if (props.index === undefined) return null;
                                        const rowData = processedChartData?.[props.index];
                                        if (!rowData) return null;
                                        const total = calculateTotal(rowData as Record<string, number>, "sub");
                                        if (total === 0) return null;

                                        // bar全体の右端に表示するため、最後のセグメントのx + widthを使用
                                        // Rechartsの積み上げバーでは、最後のセグメントのx + widthがbar全体の右端になる
                                        const numX =
                                          typeof props.x === "string" ? parseFloat(props.x) || 0 : (props.x ?? 0);
                                        const numWidth =
                                          typeof props.width === "string"
                                            ? parseFloat(props.width) || 0
                                            : (props.width ?? 0);

                                        return (
                                          <RightLabel
                                            {...props}
                                            x={numX}
                                            width={numWidth}
                                            value={total}
                                            dataKey="案件数"
                                            offset={8}
                                          />
                                        );
                                      }}
                                    />
                                  )}
                                </Bar>
                              );
                            });
                          })()}
                      </>
                    ) : null}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          ) : caseStatusView !== "department" ? (
            <div
              style={{
                background: "var(--aegis-color-background-default)",
                padding: "var(--aegis-space-xLarge)",
                borderRadius: "var(--aegis-radius-large)",
              }}
            >
              <DataTable
                key={`teamCasesTable-base-${caseStatusView}-${activeDueDateFilter}-${activeStatusFilter}-${activeCaseTypeFilter}-${assigneeFilterMode}-${sortOrder}`}
                columns={teamStatusColumns}
                rows={chartData}
                highlightRowOnHover={false}
                defaultColumnPinning={{
                  start: ["name"],
                }}
              />
            </div>
          ) : null}
        </div>
      </CardBody>
    </Card>
  );
}
