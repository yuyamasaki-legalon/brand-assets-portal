import {
  Banner,
  Button,
  PageLayoutStickyContainer,
  Search,
  Select,
  Toolbar,
  ToolbarSpacer,
} from "@legalforce/aegis-react";
import { useMemo, useState } from "react";
import {
  assignCasesToCurrentUser,
  getVisibleCases,
  type MatterCase,
  type OwnershipFilter,
  ownershipOptions,
  type SortKey,
  sampleCases,
  sortCases,
  sortOptions,
} from "../_case-self-assign/mockData";
import { CaseTable, createCaseColumns, PrototypePageFrame } from "../_case-self-assign/ui";

export function CaseSelfAssignBulk() {
  const [cases, setCases] = useState<MatterCase[]>(sampleCases);
  const [query, setQuery] = useState("");
  const [ownership, setOwnership] = useState<OwnershipFilter>("other");
  const [sortKey, setSortKey] = useState<SortKey>("priority");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [lastAssignedCount, setLastAssignedCount] = useState(0);

  const visibleCases = useMemo(
    () => sortCases(getVisibleCases(cases, query, ownership), sortKey),
    [cases, ownership, query, sortKey],
  );

  const assignCaseIds = (caseIds: string[]) => {
    if (caseIds.length === 0) {
      return;
    }

    setCases((currentCases) => assignCasesToCurrentUser(currentCases, caseIds));
    setSelectedRows((currentRows) => currentRows.filter((caseId) => !caseIds.includes(caseId)));
    setLastAssignedCount(caseIds.length);
  };

  const columns = createCaseColumns({
    actionLabel: "この案件を担当",
    onAction: (caseId) => assignCaseIds([caseId]),
    isActionDisabled: (caseItem) => caseItem.assigneeState === "assigned-to-me",
  });

  return (
    <PrototypePageFrame
      title="案件一覧プロトタイプ A"
      description="複数案件を選択して、そのまま自分の担当案件にまとめて切り替える案。案件を見比べながら一括で拾いたい人向けです。"
      cases={cases}
      emphasis={
        <div style={{ display: "grid", gap: "var(--aegis-space-small)" }}>
          {lastAssignedCount > 0 && (
            <Banner color="success" title={`${lastAssignedCount}件を自分の担当案件にしました`} closeButton={false}>
              朝会やトリアージの直後に、担当案件をまとめて確定する使い方を想定しています。
            </Banner>
          )}

          {selectedRows.length > 0 ? (
            <Banner
              color="information"
              title={`${selectedRows.length}件を選択中`}
              action={
                <Button size="small" onClick={() => assignCaseIds(selectedRows)}>
                  選択した案件を担当する
                </Button>
              }
              closeButton={false}
            >
              一覧の複数行をまたいでまとめて引き受けられます。
            </Banner>
          ) : (
            <Banner color="information" title="複数選択で一括担当化" closeButton={false}>
              チェックボックスで案件を選ぶと、上部に一括実行バーが出ます。
            </Banner>
          )}
        </div>
      }
    >
      <PageLayoutStickyContainer>
        <Toolbar>
          <Search
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="案件番号、案件名、依頼者で検索"
          />
          <Select
            options={ownershipOptions}
            value={ownership}
            onChange={(value) => setOwnership(value as OwnershipFilter)}
          />
          <Select options={sortOptions} value={sortKey} onChange={(value) => setSortKey(value as SortKey)} />
          <ToolbarSpacer />
          <Button
            size="small"
            variant="subtle"
            onClick={() => assignCaseIds(selectedRows)}
            disabled={selectedRows.length === 0}
          >
            まとめて担当する
          </Button>
        </Toolbar>
      </PageLayoutStickyContainer>

      <CaseTable
        cases={visibleCases}
        columns={columns}
        rowSelectionType="multiple"
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        canSelectRow={(caseItem) => caseItem.assigneeState !== "assigned-to-me"}
      />
    </PrototypePageFrame>
  );
}
