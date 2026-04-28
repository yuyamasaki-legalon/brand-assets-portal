import { LfBook, LfCloseLarge, LfPen } from "@legalforce/aegis-icons";
import {
  ButtonGroup,
  ContentHeader,
  Icon,
  IconButton,
  PageLayoutBody,
  PageLayoutHeader,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import type { FirstPartyPlaybook, FirstPartyPlaybookAlert } from "../mock/data";
import { SEVERITY_LABEL_MAP } from "../mock/data";

interface Props {
  playbook: FirstPartyPlaybook;
  alert: FirstPartyPlaybookAlert;
  onClose: () => void;
  onEdit: () => void;
}

export const FirstPartyAlertDetailPane = ({ playbook, alert, onClose, onEdit }: Props) => {
  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <PageLayoutHeader>
        <ContentHeader
          size="medium"
          trailing={
            <ButtonGroup size="medium">
              <Tooltip title="編集">
                <IconButton variant="plain" icon={LfPen} aria-label="編集" onClick={onEdit} />
              </Tooltip>
              <Tooltip title="閉じる">
                <IconButton variant="plain" icon={LfCloseLarge} aria-label="閉じる" onClick={onClose} />
              </Tooltip>
            </ButtonGroup>
          }
        />
      </PageLayoutHeader>
      <PageLayoutBody>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--aegis-space-large)",
          }}
        >
          <Section
            label="プレイブック"
            icon={
              <Icon size="small">
                <LfBook />
              </Icon>
            }
          >
            <Text>{playbook.playbookSummary.playbookName}</Text>
          </Section>

          <Section label="条項タイトル">
            <Text>{alert.articleTitle}</Text>
          </Section>

          <Section label="論点タイトル">
            <Text>{alert.issueTitle}</Text>
          </Section>

          <Section label="重要度">
            <Text>{SEVERITY_LABEL_MAP[alert.severity]}</Text>
          </Section>

          {alert.fallbackPosition && (
            <Section label="譲歩可能な立場">
              <Text>{alert.fallbackPosition}</Text>
            </Section>
          )}

          {alert.nonNegotiablePosition && (
            <Section label="譲歩不可の立場">
              <Text>{alert.nonNegotiablePosition}</Text>
            </Section>
          )}

          {alert.escalationsOrApprovals && (
            <Section label="エスカレーションまたは承認">
              <Text>{alert.escalationsOrApprovals}</Text>
            </Section>
          )}

          {alert.explanatoryComments && (
            <Section label="補足コメント">
              <Text>{alert.explanatoryComments}</Text>
            </Section>
          )}
        </div>
      </PageLayoutBody>
    </article>
  );
};

interface SectionProps {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Section = ({ label, icon, children }: SectionProps) => {
  return (
    <section
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
          gap: "var(--aegis-space-xxSmall)",
        }}
      >
        {icon}
        <Text variant="label.small" color="subtle">
          {label}
        </Text>
      </div>
      {children}
    </section>
  );
};
