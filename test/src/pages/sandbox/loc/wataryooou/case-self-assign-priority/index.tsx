import {
  Banner,
  Button,
  Card,
  CardBody,
  PageLayoutStickyContainer,
  Search,
  Select,
  Text,
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

export function CaseSelfAssignPriority() {
  const [cases, setCases] = useState<MatterCase[]>(sampleCases);
  const [query, setQuery] = useState("");
  const [ownership, setOwnership] = useState<OwnershipFilter>("other");
  const [sortKey, setSortKey] = useState<SortKey>("priority");
  const [highlightedRows, setHighlightedRows] = useState<string[]>([]);
  const [lastAssignedTitle, setLastAssignedTitle] = useState<string | null>(null);

  const visibleCases = useMemo(
    () => sortCases(getVisibleCases(cases, query, ownership), sortKey),
    [cases, ownership, query, sortKey],
  );

  const recommendedCases = useMemo(
    () =>
      [...visibleCases]
        .filter((caseItem) => caseItem.assigneeState !== "assigned-to-me")
        .sort((left, right) => right.priorityScore - left.priorityScore)
        .slice(0, 3),
    [visibleCases],
  );

  const assignCase = (caseId: string) => {
    const targetCase = cases.find((caseItem) => caseItem.id === caseId);

    if (!targetCase) {
      return;
    }

    setCases((currentCases) => assignCasesToCurrentUser(currentCases, [caseId]));
    setHighlightedRows([caseId]);
    setLastAssignedTitle(targetCase.title);
  };

  const columns = createCaseColumns({
    actionLabel: "担当する",
    onAction: assignCase,
    isActionDisabled: (caseItem) => caseItem.assigneeState === "assigned-to-me",
    showRecommendation: true,
  });

  return (
    <PrototypePageFrame
      title="案件一覧プロトタイプ B"
      description="一覧を全部見なくても、今取るべき案件を上部の候補カードからそのまま担当できる案。迷う時間を減らすことを優先しています。"
      cases={cases}
      emphasis={
        <div style={{ display: "grid", gap: "var(--aegis-space-small)" }}>
          {lastAssignedTitle ? (
            <Banner color="success" title="おすすめ候補から担当化しました" closeButton={false}>
              「{lastAssignedTitle}」を自分の担当案件に追加しました。
            </Banner>
          ) : (
            <Banner color="information" title="優先度で候補を先出し" closeButton={false}>
              期限、最新更新、工数をもとに、今すぐ引き受けやすい案件を上から提案します。
            </Banner>
          )}

          <div
            style={{
              display: "grid",
              gap: "var(--aegis-space-small)",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            {recommendedCases.map((caseItem) => (
              <Card key={caseItem.id}>
                <CardBody>
                  <div style={{ display: "grid", gap: "var(--aegis-space-small)" }}>
                    <div style={{ display: "grid", gap: "2px" }}>
                      <Text variant="body.small" color="subtle">
                        優先度 {caseItem.priorityScore} / {caseItem.department}
                      </Text>
                      <Text variant="title.xSmall">{caseItem.title}</Text>
                      <Text variant="body.small" color="subtle">
                        {caseItem.recommendationReasons.join(" / ")}
                      </Text>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--aegis-space-small)" }}>
                      <Text variant="body.small" color="subtle">
                        期限 {caseItem.dueDate} ・ 想定 {caseItem.estimatedHours}h
                      </Text>
                      <Button size="small" onClick={() => assignCase(caseItem.id)}>
                        担当する
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
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
          <Text variant="body.small" color="subtle">
            おすすめ候補は一覧にもハイライトされます。
          </Text>
        </Toolbar>
      </PageLayoutStickyContainer>

      <CaseTable cases={visibleCases} columns={columns} highlightedRows={highlightedRows} />
    </PrototypePageFrame>
  );
}
