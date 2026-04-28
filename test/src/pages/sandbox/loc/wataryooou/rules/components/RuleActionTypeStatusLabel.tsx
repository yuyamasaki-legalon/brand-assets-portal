import { StatusLabel } from "@legalforce/aegis-react";
import type { RuleActionType } from "../mock/data";
import { ACTION_TYPE_LABEL_MAP } from "../mock/data";

interface Props {
  type: RuleActionType;
}

export const RuleActionTypeStatusLabel = ({ type }: Props) => {
  return (
    <StatusLabel size="small" variant="outline">
      {ACTION_TYPE_LABEL_MAP[type]}
    </StatusLabel>
  );
};
