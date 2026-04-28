import { LfQuestionCircle } from "@legalforce/aegis-icons";
import {
  ContentHeader,
  ContentHeaderDescription,
  Form,
  FormControl,
  IconButton,
  Mark,
  PageLayoutBody,
  PageLayoutHeader,
  Popover,
  Select,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import type { ReactNode } from "react";
import type { Rule, Severity } from "../mock/data";
import { SEVERITY_OPTIONS } from "../mock/data";

interface Props {
  rule: Rule | null;
  onChangeSeverity: (severity: Severity) => void;
}

export const RuleDetailPane = ({ rule, onChangeSeverity }: Props) => {
  if (!rule) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "var(--aegis-space-large)",
        }}
      >
        <Text color="subtle">ルールを選択してください</Text>
      </div>
    );
  }

  const hasExamples = rule.examples.length > 0 && rule.examples.some((e) => e.fragment.trim() !== "");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <PageLayoutHeader>
        <Text as="h1" variant="body.xxLarge.bold">
          {rule.ruleSummary}
        </Text>
      </PageLayoutHeader>
      <PageLayoutBody>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--aegis-space-large)",
          }}
        >
          <Form>
            <FormControl>
              <FormControl.Label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--aegis-space-xxSmall)",
                  }}
                >
                  共通の重要度
                  <TenantSeverityPopover />
                </div>
              </FormControl.Label>
              <Select
                value={rule.tenantSeverity || rule.recommendedSeverity}
                options={SEVERITY_OPTIONS.map((opt) => ({
                  ...opt,
                  label: opt.value === rule.recommendedSeverity ? `${opt.label}（おすすめ）` : opt.label,
                }))}
                onChange={(value) => onChangeSeverity(value as Severity)}
              />
            </FormControl>
          </Form>

          {rule.guidance && <Section heading="修正方針" description={rule.guidance} />}

          {hasExamples && (
            <Section
              heading="修正文例"
              description={rule.examples.map((example, index) =>
                example.highlight ? (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static content order won't change
                  <Mark key={index} color="teal">
                    {example.fragment}
                  </Mark>
                ) : (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static content order won't change
                  <Text key={index}>{example.fragment}</Text>
                ),
              )}
            />
          )}

          <Section heading="解説" description={rule.note} />
        </div>
      </PageLayoutBody>
    </div>
  );
};

const TenantSeverityPopover = () => {
  return (
    <Popover arrow placement="top-start">
      <Popover.Anchor>
        <Tooltip title="共通の重要度の説明">
          <IconButton aria-label="共通の重要度の説明" icon={LfQuestionCircle} variant="plain" size="xSmall" />
        </Tooltip>
      </Popover.Anchor>
      <Popover.Content width="small">
        <Popover.Header>
          <ContentHeader size="xSmall">
            <ContentHeaderDescription>
              共通の重要度は組織全体で共有される設定です。個人の重要度は個人の設定として上書きできます。
            </ContentHeaderDescription>
          </ContentHeader>
        </Popover.Header>
      </Popover.Content>
    </Popover>
  );
};

interface SectionProps {
  heading: string;
  description: ReactNode;
}

const Section = ({ heading, description }: SectionProps) => {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--aegis-space-xSmall)",
      }}
    >
      <Text as="h2" variant="body.medium.bold">
        {heading}
      </Text>
      <Text as="p" variant="body.medium">
        {description}
      </Text>
    </section>
  );
};
