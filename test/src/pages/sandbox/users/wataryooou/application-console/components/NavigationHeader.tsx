import { LfAngleLeft } from "@legalforce/aegis-icons";
import { IconButton, Text, Tooltip } from "@legalforce/aegis-react";
import type { JSX } from "react";

export const NavigationHeader = (): JSX.Element => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        height: "28.8px",
      }}
    >
      <Tooltip title="戻る">
        <IconButton aria-label="戻る" icon={LfAngleLeft} size="medium" variant="plain" />
      </Tooltip>
      <Text as="h2" variant="title.large">
        マターマネジメント
      </Text>
    </div>
  );
};
