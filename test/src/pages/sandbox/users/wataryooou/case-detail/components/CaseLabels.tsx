import { LfInformationCircle } from "@legalforce/aegis-icons";
import { Icon, IconButton, Link, Tag, Text, Tooltip } from "@legalforce/aegis-react";

interface CaseLabelsProps {
  labels: string[];
}

export function CaseLabels({ labels }: CaseLabelsProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "var(--aegis-space-small)",
        paddingBlock: "var(--aegis-space-small)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--aegis-space-xxSmall)",
        }}
      >
        <Text variant="body.medium">案件ラベル（β）</Text>
        <Tooltip title="案件ラベルの説明" placement="top">
          <IconButton variant="plain" size="xSmall" aria-label="ヘルプ">
            <Icon size="small">
              <LfInformationCircle />
            </Icon>
          </IconButton>
        </Tooltip>
      </div>
      <div style={{ display: "flex", gap: "var(--aegis-space-xxSmall)" }}>
        {labels.map((label) => (
          <Tag key={label} variant="outline">
            {label}
          </Tag>
        ))}
      </div>
      <div style={{ marginLeft: "auto" }}>
        <Link href="#">案件ラベルから法令・ガイドラインを探す →</Link>
      </div>
    </div>
  );
}
