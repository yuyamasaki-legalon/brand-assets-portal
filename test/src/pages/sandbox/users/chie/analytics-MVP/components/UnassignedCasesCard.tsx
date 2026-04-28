import { LfArrowUpRightFromSquare } from "@legalforce/aegis-icons";
import { Button, Card, CardBody, Divider, Icon, Text } from "@legalforce/aegis-react";
import { useTranslation } from "../hooks/useTranslation";
import { reportTranslations } from "../reportTranslations";
import type { AssigneeFilterMode } from "../types";

export interface UnassignedCasesCardProps {
  unassignedCasesCount: number;
  unassignedSubAssigneeCasesCount: number;
  assigneeFilterMode: AssigneeFilterMode;
  onUnassignedCasesDrawerOpen: () => void;
}

export function UnassignedCasesCard(props: UnassignedCasesCardProps) {
  const { unassignedCasesCount, unassignedSubAssigneeCasesCount, assigneeFilterMode } = props;
  const { t } = useTranslation(reportTranslations);

  if (
    unassignedCasesCount === 0 &&
    (assigneeFilterMode === "main" || (assigneeFilterMode === "sub" && unassignedSubAssigneeCasesCount === 0))
  ) {
    return null;
  }

  return (
    <Card variant="fill">
      <CardBody>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "var(--aegis-space-small)", alignItems: "center" }}>
            {unassignedCasesCount > 0 && (
              <div style={{ display: "flex", gap: "var(--aegis-space-small)", alignItems: "center" }}>
                <Text variant="body.semiSmall.bold" color="subtle">
                  {t("mainAssigneeEmpty")}
                </Text>
                <Text variant="body.xxLarge.bold">{unassignedCasesCount}</Text>
              </div>
            )}
            {(assigneeFilterMode === "sub" || assigneeFilterMode === "both") && unassignedSubAssigneeCasesCount > 0 && (
              <>
                {unassignedCasesCount > 0 && <Divider orientation="vertical" />}
                <div style={{ display: "flex", gap: "var(--aegis-space-small)", alignItems: "center" }}>
                  <Text variant="body.semiSmall.bold" color="subtle">
                    {t("subAssigneeEmpty")}
                  </Text>
                  <Text variant="body.xxLarge.bold">{unassignedSubAssigneeCasesCount}</Text>
                </div>
              </>
            )}
          </div>
          <Button
            variant="subtle"
            trailing={
              <Icon>
                <LfArrowUpRightFromSquare />
              </Icon>
            }
            onClick={() => {
              if (assigneeFilterMode === "main") {
                // 主担当が未設定の一覧に遷移（別タブで開く）
                window.open(
                  "https://app.legalon-cloud.com/case?case-search-condition-definition-type=unassigned&case-search-condition-definition-id=01990991-f52d-706c-a03f-e9887f2138ef&page=1&main-assignee-ids%5B%5D=unassigned&logical-operators%5B%5D=%7B%22fields%22%3A%5B%22main-assignee-ids%22%2C%22sub-assignee-ids%22%5D%2C%22logical-operator%22%3A%22and%22%7D&case-status-ids%5B%5D=018e9c8f-aac5-7c58-b797-4d35f1c1cf08&case-status-ids%5B%5D=018ecce3-510b-7182-9b1c-a408a585720b&case-status-ids%5B%5D=018ecce3-c113-7182-bbf6-7604b4cc108e&case-status-ids%5B%5D=0193afaf-78ed-75c1-8c48-bc4d7b214dd1&case-status-ids%5B%5D=01926b9e-bcce-76c5-9b82-6b65f06c2bab&case-status-ids%5B%5D=0193afae-7457-7131-8d27-026945210ceb&case-status-ids%5B%5D=018f093c-5a31-729f-9883-d19609163a97&case-status-ids%5B%5D=019365e5-c582-71b1-9e3d-097531316033&case-status-ids%5B%5D=0193afaf-0643-7131-a923-cd919240ae6e&case-status-ids%5B%5D=018f0ede-25d9-7973-9460-da7f2ee7b8c1&search-sort-condition=last-message-time-desc&excluding-closed-case=true",
                  "_blank",
                );
              } else {
                // 副担当者が未設定の案件を含む一覧に遷移（別タブで開く）
                window.open(
                  "https://app.legalon-cloud.com/case?case-search-condition-definition-type=unassigned&case-search-condition-definition-id=01990991-f52d-706c-a03f-e9887f2138ef&page=1&main-assignee-ids%5B%5D=unassigned&sub-assignee-ids%5B%5D=unassigned&logical-operators%5B%5D=%7B%22fields%22%3A%5B%22main-assignee-ids%22%2C%22sub-assignee-ids%22%5D%2C%22logical-operator%22%3A%22or%22%7D&due-date-relative=next%2C1%2Cweeks&case-create-time-relative=past%2C3%2Cmonths&last-message-time-relative=past%2C1%2Cweeks&case-status-ids%5B%5D=018e9c8f-aac5-7c58-b797-4d35f1c1cf08&case-status-ids%5B%5D=018ecce3-510b-7182-9b1c-a408a585720b&case-status-ids%5B%5D=018ecce3-c113-7182-bbf6-7604b4cc108e&case-status-ids%5B%5D=0193afaf-78ed-75c1-8c48-bc4d7b214dd1&case-status-ids%5B%5D=01926b9e-bcce-76c5-9b82-6b65f06c2bab&case-status-ids%5B%5D=0193afae-7457-7131-8d27-026945210ceb&case-status-ids%5B%5D=018f093c-5a31-729f-9883-d19609163a97&case-status-ids%5B%5D=019365e5-c582-71b1-9e3d-097531316033&case-status-ids%5B%5D=0193afaf-0643-7131-a923-cd919240ae6e&case-status-ids%5B%5D=018f0ede-25d9-7973-9460-da7f2ee7b8c1&search-sort-condition=last-message-time-desc&excluding-closed-case=true",
                  "_blank",
                );
              }
            }}
          >
            {t("viewCases")}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
