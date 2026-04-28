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
import type { Playbook, PlaybookAlert } from "../mock/data";
import { SEVERITY_LABEL_MAP } from "../mock/data";

interface Props {
  playbook: Playbook;
  alert: PlaybookAlert;
  onClose: () => void;
  onEdit: () => void;
}

export const ThirdPartyAlertDetailPane = ({ playbook, alert, onClose, onEdit }: Props) => {
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

          <Section label="チェックポイント">
            <Text>{alert.playbookInstruction}</Text>
          </Section>

          <Section label="重要度">
            <Text>{SEVERITY_LABEL_MAP[alert.severity]}</Text>
          </Section>

          {alert.modelLanguage && (
            <Section label="推奨条文">
              <Text>{alert.modelLanguage}</Text>
            </Section>
          )}

          {alert.fallbackPosition && (
            <Section label="その他方針">
              <Text>{alert.fallbackPosition}</Text>
            </Section>
          )}

          {alert.acceptableFallbackLanguage && (
            <Section label="その他条文">
              <Text>{alert.acceptableFallbackLanguage}</Text>
            </Section>
          )}

          {alert.escalationsOrApprovals && (
            <Section label="エスカレーションまたは承認">
              <Text>{alert.escalationsOrApprovals}</Text>
            </Section>
          )}

          {alert.other && (
            <Section label="その他">
              <Text>{alert.other}</Text>
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
