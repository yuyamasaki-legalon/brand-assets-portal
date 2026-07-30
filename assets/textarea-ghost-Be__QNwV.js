var e=`import {
  Link as AegisLink,
  ContentHeader,
  FormControl,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
  Textarea,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const TextareaGhostDemo = () => {
  const [normalValue, setNormalValue] = useState("");
  const [subtleValue, setSubtleValue] = useState("");
  const [inlineValue, setInlineValue] = useState(
    "ここをクリックすると編集できます。境界線は無く、本文と同じ見た目のままインライン編集ができます。",
  );

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Textarea ghost option</ContentHeader.Title>
            <ContentHeader.Description>
              現行パッケージでは \`ghost\` prop 未搭載のため、近い見た目をレイアウト側で再現
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            このリポジトリに入っている \`@legalforce/aegis-react@2.48.2\` では Textarea の \`ghost\` prop はまだ使えません。
            そのため、背景や配置を調整して近い雰囲気の入力体験を確認できるサンプルにしています。
          </Text>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--aegis-space-large)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <div>
              <Text as="h3" variant="title.xSmall" style={{ marginBottom: "var(--aegis-space-small)" }}>
                Default (枠線あり)
              </Text>
              <FormControl>
                <FormControl.Label>コメント</FormControl.Label>
                <Textarea
                  placeholder="コメントを入力"
                  value={normalValue}
                  onChange={(event) => setNormalValue(event.target.value)}
                  minRows={3}
                />
                <FormControl.Caption>従来どおりの border 付き Textarea</FormControl.Caption>
              </FormControl>
            </div>

            <div>
              <Text as="h3" variant="title.xSmall" style={{ marginBottom: "var(--aegis-space-small)" }}>
                subtle surface (近い見た目)
              </Text>
              <FormControl>
                <FormControl.Label>コメント</FormControl.Label>
                <div
                  style={{
                    padding: "var(--aegis-space-small)",
                    backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
                    borderRadius: "var(--aegis-radius-medium)",
                  }}
                >
                  <Textarea
                    placeholder="コメントを入力"
                    value={subtleValue}
                    onChange={(event) => setSubtleValue(event.target.value)}
                    minRows={3}
                  />
                </div>
                <FormControl.Caption>現行版では wrapper 側の背景調整で軽い見た目を再現</FormControl.Caption>
              </FormControl>
            </div>
          </div>

          <div style={{ marginBottom: "var(--aegis-space-large)" }}>
            <Text as="h3" variant="title.xSmall" style={{ marginBottom: "var(--aegis-space-small)" }}>
              使用例: 本文に馴染ませたインライン編集
            </Text>
            <div
              style={{
                padding: "var(--aegis-space-medium)",
                backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
                borderRadius: "var(--aegis-radius-medium)",
              }}
            >
              <Text as="p" variant="label.medium.bold" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
                契約書のメモ
              </Text>
              <Textarea value={inlineValue} onChange={(event) => setInlineValue(event.target.value)} minRows={2} />
            </div>
            <Text
              as="p"
              variant="body.small"
              style={{ color: "var(--aegis-color-text-subtle)", marginTop: "var(--aegis-space-xSmall)" }}
            >
              タイトルと同じカードに溶け込みつつ、フォーカス時のみアウトラインが表示される挙動を確認できます。
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
              API
            </Text>
            <Text as="p" variant="body.small">
              現行版では \`&lt;Textarea /&gt;\` を背景コンテナと組み合わせて利用
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