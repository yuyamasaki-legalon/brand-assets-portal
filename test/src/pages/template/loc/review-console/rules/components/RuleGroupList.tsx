import { ActionList, Text } from "@legalforce/aegis-react";
import type { AppliedSeverityType, Rule, RuleGroup } from "../mock/data";
import { RuleActionTypeStatusLabel } from "./RuleActionTypeStatusLabel";
import { SeverityStatusLabel } from "./SeverityStatusLabel";

interface Props {
  ruleGroups: RuleGroup[];
  selectedRuleId: number | null;
  appliedSeverityType: AppliedSeverityType;
  onSelectRule: (ruleId: number) => void;
}

export const RuleGroupList = ({ ruleGroups, selectedRuleId, appliedSeverityType, onSelectRule }: Props) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--aegis-space-large)",
        marginTop: "var(--aegis-space-medium)",
      }}
    >
      {ruleGroups.map((ruleGroup) => (
        <RuleGroupSection
          key={ruleGroup.ruleGroupId}
          ruleGroup={ruleGroup}
          selectedRuleId={selectedRuleId}
          appliedSeverityType={appliedSeverityType}
          onSelectRule={onSelectRule}
        />
      ))}
    </div>
  );
};

interface RuleGroupSectionProps {
  ruleGroup: RuleGroup;
  selectedRuleId: number | null;
  appliedSeverityType: AppliedSeverityType;
  onSelectRule: (ruleId: number) => void;
}

const RuleGroupSection = ({ ruleGroup, selectedRuleId, appliedSeverityType, onSelectRule }: RuleGroupSectionProps) => {
  const ruleGroupId = `rule-group-${ruleGroup.ruleGroupId}`;

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--aegis-space-small)",
      }}
    >
      <Text as="h2" variant="title.xxSmall" id={ruleGroupId}>
        {ruleGroup.name}
      </Text>
      <ActionList size="large" aria-labelledby={ruleGroupId}>
        {ruleGroup.rules.map((rule) => (
          <ActionList.Item
            key={rule.ruleId}
            onClick={() => onSelectRule(rule.ruleId)}
            selected={rule.ruleId === selectedRuleId}
          >
            <ActionList.Body>
              <RuleItem rule={rule} appliedSeverityType={appliedSeverityType} />
            </ActionList.Body>
          </ActionList.Item>
        ))}
      </ActionList>
    </section>
  );
};

interface RuleItemProps {
  rule: Rule;
  appliedSeverityType: AppliedSeverityType;
}

const RuleItem = ({ rule, appliedSeverityType }: RuleItemProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--aegis-space-xSmall)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--aegis-space-xSmall)",
        }}
      >
        <SeverityStatusLabel
          tenantSeverity={rule.tenantSeverity}
          userSeverity={rule.userSeverity}
          recommendedSeverity={rule.recommendedSeverity}
          appliedSeverityType={appliedSeverityType}
        />
        <RuleActionTypeStatusLabel type={rule.actionType} />
      </div>
      <Text numberOfLines={1}>{rule.ruleSummary}</Text>
    </div>
  );
};
