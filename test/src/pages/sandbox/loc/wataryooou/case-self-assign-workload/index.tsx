import {
  Banner,
  Button,
  Card,
  CardBody,
  CheckboxCard,
  ContentHeader,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
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

export function CaseSelfAssignWorkload() {
  const [cases, setCases] = useState<MatterCase[]>(sampleCases);
  const [query, setQuery] = useState("");
  const [ownership, setOwnership] = useState<OwnershipFilter>("other");
  const [sortKey, setSortKey] = useState<SortKey>("priority");
  const [candidateIds, setCandidateIds] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lastCommittedCount, setLastCommittedCount] = useState(0);

  const visibleCases = useMemo(
    () => sortCases(getVisibleCases(cases, query, ownership), sortKey),
    [cases, ownership, query, sortKey],
  );

  const candidateCases = useMemo(
    () => cases.filter((caseItem) => candidateIds.includes(caseItem.id)),
    [candidateIds, cases],
  );

  const totalHours = candidateCases.reduce((sum, caseItem) => sum + caseItem.estimatedHours, 0);
  const dueSoonCount = candidateCases.filter((caseItem) => caseItem.dueInDays <= 3).length;
  const highRiskCount = candidateCases.filter((caseItem) => caseItem.takeoverRisk === "high").length;

  const toggleCandidate = (caseId: string) => {
    setCandidateIds((currentIds) =>
      currentIds.includes(caseId) ? currentIds.filter((id) => id !== caseId) : [...currentIds, caseId],
    );
  };

  const commitCandidates = () => {
    if (candidateIds.length === 0) {
      return;
    }

    setCases((currentCases) => assignCasesToCurrentUser(currentCases, candidateIds));
    setLastCommittedCount(candidateIds.length);
    setCandidateIds([]);
    setDialogOpen(false);
  };

  const columns = createCaseColumns({
    actionLabel: "候補に追加",
    onAction: toggleCandidate,
    isActionDisabled: (caseItem) => caseItem.assigneeState === "assigned-to-me" || candidateIds.includes(caseItem.id),
    showWorkload: true,
  });

  return (
    <PrototypePageFrame
      title="案件一覧プロトタイプ C"
      description="担当する前に候補案件をいったん貯めて、負荷と引継ぎリスクを見てから確定する案。慎重に受け持ちたいケース向けです。"
      cases={cases}
      emphasis={
        <div style={{ display: "grid", gap: "var(--aegis-space-small)" }}>
          {lastCommittedCount > 0 && (
            <Banner color="success" title={`${lastCommittedCount}件を担当案件にしました`} closeButton={false}>
              負荷確認ダイアログを通した上で確定しています。
            </Banner>
          )}

          <Card>
            <CardBody>
              <div style={{ display: "grid", gap: "var(--aegis-space-small)" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "var(--aegis-space-small)",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "grid", gap: "2px" }}>
                    <Text variant="title.xSmall">担当候補キュー</Text>
                    <Text variant="body.small" color="subtle">
                      追加した案件だけを見て、まとめて確定します。
                    </Text>
                  </div>
                  <Button size="small" onClick={() => setDialogOpen(true)} disabled={candidateCases.length === 0}>
                    この内容で担当する
                  </Button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: "var(--aegis-space-small)",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  }}
                >
                  <Card>
                    <CardBody>
                      <Text variant="body.small" color="subtle">
                        候補件数
                      </Text>
                      <Text variant="body.xxLarge.bold">{candidateCases.length}</Text>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <Text variant="body.small" color="subtle">
                        想定工数
                      </Text>
                      <Text variant="body.xxLarge.bold">{totalHours}h</Text>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <Text variant="body.small" color="subtle">
                        期限3日以内
                      </Text>
                      <Text variant="body.xxLarge.bold">{dueSoonCount}</Text>
                    </CardBody>
                  </Card>
                </div>

                {candidateCases.length > 0 ? (
                  <div style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
                    {candidateCases.map((caseItem) => (
                      <CheckboxCard key={caseItem.id} checked onChange={() => toggleCandidate(caseItem.id)}>
                        <div
                          style={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "space-between",
                            gap: "var(--aegis-space-small)",
                            alignItems: "center",
                          }}
                        >
                          <div style={{ display: "grid", gap: "2px" }}>
                            <Text variant="body.medium">{caseItem.title}</Text>
                            <Text variant="body.small" color="subtle">
                              期限 {caseItem.dueDate} ・ {caseItem.estimatedHours}h ・ リスク {caseItem.takeoverRisk}
                            </Text>
                          </div>
                          <Button size="small" variant="plain" onClick={() => toggleCandidate(caseItem.id)}>
                            外す
                          </Button>
                        </div>
                      </CheckboxCard>
                    ))}
                  </div>
                ) : (
                  <Banner color="information" title="候補をまだ追加していません" closeButton={false}>
                    一覧の「候補に追加」から担当候補を貯めてください。
                  </Banner>
                )}
              </div>
            </CardBody>
          </Card>
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
            onClick={() => setDialogOpen(true)}
            disabled={candidateCases.length === 0}
          >
            負荷を確認して確定
          </Button>
        </Toolbar>
      </PageLayoutStickyContainer>

      <CaseTable cases={visibleCases} columns={columns} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent style={{ width: "560px" }}>
          <DialogHeader>
            <ContentHeader>
              <ContentHeader.Title>担当前の確認</ContentHeader.Title>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
              <Banner color="information" title="現在の候補で担当化する想定です" closeButton={false}>
                工数と引継ぎリスクを見て、問題なければそのまま確定します。
              </Banner>

              <div
                style={{
                  display: "grid",
                  gap: "var(--aegis-space-small)",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                }}
              >
                <Card>
                  <CardBody>
                    <Text variant="body.small" color="subtle">
                      候補件数
                    </Text>
                    <Text variant="body.xxLarge.bold">{candidateCases.length}</Text>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <Text variant="body.small" color="subtle">
                      総工数
                    </Text>
                    <Text variant="body.xxLarge.bold">{totalHours}h</Text>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <Text variant="body.small" color="subtle">
                      高リスク
                    </Text>
                    <Text variant="body.xxLarge.bold">{highRiskCount}</Text>
                  </CardBody>
                </Card>
              </div>

              <div style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
                {candidateCases.map((caseItem) => (
                  <Card key={caseItem.id}>
                    <CardBody>
                      <div style={{ display: "grid", gap: "2px" }}>
                        <Text variant="body.medium">{caseItem.title}</Text>
                        <Text variant="body.small" color="subtle">
                          期限 {caseItem.dueDate} ・ {caseItem.estimatedHours}h ・ リスク {caseItem.takeoverRisk}
                        </Text>
                        <Text variant="body.small" color="subtle">
                          {caseItem.note}
                        </Text>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--aegis-space-xSmall)" }}>
              <Button variant="plain" onClick={() => setDialogOpen(false)}>
                戻る
              </Button>
              <Button onClick={commitCandidates} disabled={candidateCases.length === 0}>
                この内容で担当する
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PrototypePageFrame>
  );
}
