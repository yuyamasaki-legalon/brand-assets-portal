var e=`import {
  Link as AegisLink,
  Combobox,
  ContentHeader,
  FormControl,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  TagPicker,
  Text,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const departmentOptions = [
  { value: "legal", label: "法務" },
  { value: "contract", label: "契約管理" },
  { value: "compliance", label: "コンプライアンス" },
  { value: "sales", label: "営業" },
  { value: "hr", label: "人事" },
  { value: "engineering", label: "エンジニアリング" },
  { value: "design", label: "デザイン" },
  { value: "product", label: "プロダクトマネジメント" },
];

const memberOptions = [
  { value: "alice", label: "Alice Anderson" },
  { value: "bob", label: "Bob Bennett" },
  { value: "carol", label: "Carol Carter" },
  { value: "dave", label: "Dave Donovan" },
  { value: "ellen", label: "Ellen Evans" },
  { value: "frank", label: "Frank Foster" },
];

export const FilterGuidanceCaptionDemo = () => {
  const [department, setDepartment] = useState<string | null>(null);
  const [members, setMembers] = useState<string[]>([]);

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Filter guidance caption</ContentHeader.Title>
            <ContentHeader.Description>
              v2.51.1: Combobox / TagPicker のドロップダウンに ActionListCaption が追加
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            Combobox と TagPicker
            のドロップダウンを開くと、オプション一覧の上部に「文字入力で候補を絞り込めます」というキャプションが表示されます。
            キャプション本文は aegis-tokens v2.14.0 のローカライズトークン <code>filterCaptionTitle</code>{" "}
            から供給されます。Select には従来どおりキャプションは表示されません。
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
                Combobox
              </Text>
              <FormControl>
                <FormControl.Label>部署</FormControl.Label>
                <Combobox
                  placeholder="部署を選択"
                  options={departmentOptions}
                  value={department}
                  onChange={setDepartment}
                />
                <FormControl.Caption>クリックしてドロップダウンを開いてください</FormControl.Caption>
              </FormControl>
            </div>

            <div>
              <Text as="h3" variant="title.xSmall" style={{ marginBottom: "var(--aegis-space-small)" }}>
                TagPicker
              </Text>
              <FormControl>
                <FormControl.Label>担当者</FormControl.Label>
                <TagPicker
                  placeholder="担当者を選択"
                  options={memberOptions}
                  value={members}
                  onChange={(value) => setMembers(value as string[])}
                />
                <FormControl.Caption>クリックしてドロップダウンを開いてください</FormControl.Caption>
              </FormControl>
            </div>
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
              i18n token
            </Text>
            <Text as="p" variant="body.small">
              en-US: <code>Start typing to filter options</code>
            </Text>
            <Text as="p" variant="body.small">
              ja-JP: <code>文字入力で候補を絞り込めます</code>
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-51-1">← Back to v2.51.1</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
`;export{e as default};