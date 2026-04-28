import {
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { RuleDetailPane } from "./components/RuleDetailPane";
import { RuleGroupList } from "./components/RuleGroupList";
import { RulesCondition } from "./components/RulesCondition";
import { RulesHeader } from "./components/RulesHeader";
import type { AppliedSeverityType, Severity } from "./mock/data";
import { MOCK_RULE_GROUPS } from "./mock/data";

const RulesTemplate = () => {
  const [selectedRuleId, setSelectedRuleId] = useState<number | null>(MOCK_RULE_GROUPS[0]?.rules[0]?.ruleId ?? null);
  const [appliedSeverityType] = useState<AppliedSeverityType>("tenant");

  const selectedRule =
    MOCK_RULE_GROUPS.flatMap((group) => group.rules).find((rule) => rule.ruleId === selectedRuleId) ?? null;

  const handleChangeSeverity = (_severity: Severity) => {
    // ロジックは不要なのでモック実装のみ
  };

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <RulesHeader />
        </PageLayoutHeader>
        <PageLayoutBody>
          <RulesCondition />
          <RuleGroupList
            ruleGroups={MOCK_RULE_GROUPS}
            selectedRuleId={selectedRuleId}
            appliedSeverityType={appliedSeverityType}
            onSelectRule={setSelectedRuleId}
          />
        </PageLayoutBody>
      </PageLayoutContent>
      <PageLayoutPane width="large" position="end" open>
        <RuleDetailPane rule={selectedRule} onChangeSeverity={handleChangeSeverity} />
      </PageLayoutPane>
    </PageLayout>
  );
};

export default RulesTemplate;
