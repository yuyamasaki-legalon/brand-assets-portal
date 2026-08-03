var e=`import {
  Link as AegisLink,
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Radio,
  RadioGroup,
  Text,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const planOptions = [
  {
    value: "starter",
    title: "Starter",
    description: "個人 / 小規模チーム向け。月 5 件までの契約書管理に対応します。",
  },
  {
    value: "business",
    title: "Business",
    description: "成長フェーズの企業向け。承認フローと SSO 連携、月 100 件までの契約書管理に対応します。",
  },
  {
    value: "enterprise",
    title: "Enterprise",
    description: "大企業向け。専任サポート、カスタム権限、無制限件数の契約書管理に対応します。",
  },
];

const layoutOptions = [
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
  { value: "dense", label: "Dense" },
];

export const RadioGroupPreviewDemo = () => {
  const [plan, setPlan] = useState("business");
  const [layout, setLayout] = useState("comfortable");
  const [language, setLanguage] = useState("ja");

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>RadioGroup preview components</ContentHeader.Title>
            <ContentHeader.Description>
              現行パッケージでは preview API が未搭載のため、標準 RadioGroup / Radio で近い構成を表示
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            このリポジトリに入っている \`@legalforce/aegis-react@2.48.2\` では
            <code>@legalforce/aegis-react/radio-group/preview</code> はまだ使えません。そのため、標準の \`RadioGroup\` と
            \`Radio\` で同じ選択内容を確認できるサンプルに置き換えています。
          </Text>

          <div style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
            <Text as="h3" variant="title.xSmall" style={{ marginBottom: "var(--aegis-space-small)" }}>
              Card appearance + outline variant
            </Text>
            <Text variant="label.medium.bold" as="p" style={{ marginBottom: "var(--aegis-space-small)" }}>
              プラン
            </Text>
            <RadioGroup value={plan} onChange={(value) => setPlan(value ?? "business")} name="plan">
              {planOptions.map((option) => (
                <div key={option.value} style={{ marginBottom: "var(--aegis-space-small)" }}>
                  <Radio value={option.value}>{option.title}</Radio>
                  <Text as="p" variant="body.small" color="subtle" style={{ marginLeft: "var(--aegis-space-large)" }}>
                    {option.description}
                  </Text>
                </div>
              ))}
            </RadioGroup>
            <Text
              as="p"
              variant="body.small"
              style={{ color: "var(--aegis-color-text-subtle)", marginTop: "var(--aegis-space-xSmall)" }}
            >
              選択中: <code>{plan}</code>
            </Text>
          </div>

          <div style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
            <Text as="h3" variant="title.xSmall" style={{ marginBottom: "var(--aegis-space-small)" }}>
              Horizontal orientation
            </Text>
            <Text variant="label.medium.bold" as="p" style={{ marginBottom: "var(--aegis-space-small)" }}>
              行間隔
            </Text>
            <RadioGroup value={layout} onChange={(value) => setLayout(value ?? "comfortable")} name="layout">
              {layoutOptions.map((option) => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </RadioGroup>
            <Text
              as="p"
              variant="body.small"
              style={{ color: "var(--aegis-color-text-subtle)", marginTop: "var(--aegis-space-xSmall)" }}
            >
              選択中: <code>{layout}</code>
            </Text>
          </div>

          <div style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
            <Text as="h3" variant="title.xSmall" style={{ marginBottom: "var(--aegis-space-small)" }}>
              Size small + plain variant
            </Text>
            <Text variant="label.small.bold" as="p" style={{ marginBottom: "var(--aegis-space-small)" }}>
              表示言語
            </Text>
            <RadioGroup value={language} onChange={(value) => setLanguage(value ?? "ja")} name="language">
              <div style={{ marginBottom: "var(--aegis-space-small)" }}>
                <Radio value="ja">日本語</Radio>
                <Text as="p" variant="body.small" color="subtle" style={{ marginLeft: "var(--aegis-space-large)" }}>
                  UI と通知を日本語で表示します。
                </Text>
              </div>
              <div>
                <Radio value="en">English</Radio>
                <Text as="p" variant="body.small" color="subtle" style={{ marginLeft: "var(--aegis-space-large)" }}>
                  Display UI and notifications in English.
                </Text>
              </div>
            </RadioGroup>
            <Text
              as="p"
              variant="body.small"
              style={{ color: "var(--aegis-color-text-subtle)", marginTop: "var(--aegis-space-xSmall)" }}
            >
              選択中: <code>{language}</code>
            </Text>
          </div>

          <div
            style={{
              padding: "var(--aegis-space-medium)",
              backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
              borderRadius: "var(--aegis-radius-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
              Import path
            </Text>
            <Text as="p" variant="body.small">
              <code>import {\`{ RadioGroup, Radio }\`} from "@legalforce/aegis-react";</code>
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-52-0">← Back to v2.52.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
`;export{e as default};