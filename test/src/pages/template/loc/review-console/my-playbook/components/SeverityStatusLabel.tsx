import { StatusLabel } from "@legalforce/aegis-react";
import type { Severity } from "../mock/data";
import { SEVERITY_COLOR_MAP, SEVERITY_LABEL_MAP } from "../mock/data";

interface Props {
  severity: Severity;
}

export const SeverityStatusLabel = ({ severity }: Props) => {
  return (
    <StatusLabel size="small" variant="fill" color={SEVERITY_COLOR_MAP[severity]}>
      {SEVERITY_LABEL_MAP[severity]}
    </StatusLabel>
  );
};
