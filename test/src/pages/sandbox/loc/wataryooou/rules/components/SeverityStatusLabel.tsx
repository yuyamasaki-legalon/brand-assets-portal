import { StatusLabel } from "@legalforce/aegis-react";
import type { AppliedSeverityType, Severity } from "../mock/data";
import { SEVERITY_LABEL_MAP } from "../mock/data";

const statusColorMap = {
  low: "gray",
  medium: "yellow",
  high: "red",
} as const;

interface Props {
  tenantSeverity: Severity | undefined;
  userSeverity: Severity | undefined;
  recommendedSeverity: Severity;
  appliedSeverityType: AppliedSeverityType;
}

export const SeverityStatusLabel = ({
  tenantSeverity,
  userSeverity,
  recommendedSeverity,
  appliedSeverityType,
}: Props) => {
  const severity = (() => {
    if (appliedSeverityType === "user" && userSeverity) {
      return userSeverity;
    }
    if (appliedSeverityType === "tenant" && tenantSeverity) {
      return tenantSeverity;
    }
    return recommendedSeverity;
  })();

  return (
    <StatusLabel size="small" variant="fill" color={statusColorMap[severity]}>
      {SEVERITY_LABEL_MAP[severity]}
    </StatusLabel>
  );
};
