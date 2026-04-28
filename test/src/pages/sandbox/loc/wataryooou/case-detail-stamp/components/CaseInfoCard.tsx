import { LfPen } from "@legalforce/aegis-icons";
import { Button, ContentHeader, Link, Text } from "@legalforce/aegis-react";
import type { CaseData } from "../types";

interface CaseInfoCardProps {
  caseData: CaseData;
}

export function CaseInfoCard({ caseData }: CaseInfoCardProps) {
  return (
    <div
      style={{
        padding: "var(--aegis-space-large)",
        borderRadius: "var(--aegis-radius-large)",
        backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
      }}
    >
      <ContentHeader
        size="small"
        trailing={
          <Button leading={LfPen} variant="subtle" size="small">
            編集
          </Button>
        }
      >
        <ContentHeader.Description>{caseData.id}</ContentHeader.Description>
        <ContentHeader.Title>{caseData.title}</ContentHeader.Title>
      </ContentHeader>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--aegis-space-xSmall)",
          marginTop: "var(--aegis-space-small)",
        }}
      >
        <Text variant="body.small" color="subtle">
          依頼内容
        </Text>
        <Text style={{ whiteSpace: "pre-wrap" }}>{caseData.content}</Text>
        <Link href={caseData.url} target="_blank">
          {caseData.url}
        </Link>
      </div>
    </div>
  );
}
