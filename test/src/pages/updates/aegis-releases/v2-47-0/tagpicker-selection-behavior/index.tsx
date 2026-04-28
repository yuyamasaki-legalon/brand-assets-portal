import {
  Link as AegisLink,
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  SegmentedControl,
  TagPicker,
  Text,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const behaviorOptions = ["clear", "preserve"] as const;
type SelectionBehavior = (typeof behaviorOptions)[number];

const memberOptions = [
  { label: "田中 太郎", value: "tanaka" },
  { label: "鈴木 花子", value: "suzuki" },
  { label: "佐藤 一郎", value: "sato" },
  { label: "高橋 美咲", value: "takahashi" },
  { label: "伊藤 健二", value: "ito" },
];

export const TagPickerSelectionBehavior = () => {
  const [behaviorIndex, setBehaviorIndex] = useState(0);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [textValue, setTextValue] = useState("");

  const selectionBehavior: SelectionBehavior = behaviorOptions[behaviorIndex] ?? "clear";

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>TagPicker selectionBehavior</ContentHeader.Title>
            <ContentHeader.Description>
              v2.47.0: 候補選択後の入力文字列を clear / preserve で制御
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            同じ接頭辞で連続選択したい場合は `preserve`、毎回リセットしたい場合は `clear` を使います。
          </Text>

          <div style={{ marginBottom: "var(--aegis-space-large)" }}>
            <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
              selectionBehavior を切り替え
            </Text>
            <SegmentedControl index={behaviorIndex} onChange={setBehaviorIndex}>
              <SegmentedControl.Button>clear</SegmentedControl.Button>
              <SegmentedControl.Button>preserve</SegmentedControl.Button>
            </SegmentedControl>
          </div>

          <div
            style={{
              maxWidth: "var(--aegis-layout-width-x3Small)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <TagPicker
              aria-label="メンバーを選択"
              placeholder="メンバー名で絞り込み"
              options={memberOptions}
              value={selectedMembers}
              onChange={setSelectedMembers}
              textValue={textValue}
              onTextChange={setTextValue}
              selectionBehavior={selectionBehavior}
            />
          </div>

          <div
            style={{
              padding: "var(--aegis-space-medium)",
              backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
              borderRadius: "var(--aegis-radius-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              現在の状態
            </Text>
            <Text as="p" variant="body.small">
              selectionBehavior: <strong>{selectionBehavior}</strong>
            </Text>
            <Text as="p" variant="body.small">
              入力中の文字列: <strong>{textValue || "(空)"}</strong>
            </Text>
            <Text as="p" variant="body.small">
              選択済み: <strong>{selectedMembers.length}</strong>
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
            <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              試し方
            </Text>
            <Text as="p" variant="body.small">
              - `ta` などで候補を絞り込んで 1 件選択
            </Text>
            <Text as="p" variant="body.small">
              - `clear` では入力が空に戻る
            </Text>
            <Text as="p" variant="body.small">
              - `preserve` では絞り込み文字列が残る
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-47-0">← Back to v2.47.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
