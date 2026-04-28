import {
  ActionList,
  ActionListItem,
  Link as AegisLink,
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  SegmentedControl,
  Text,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const ActionListBordered = () => {
  const [borderedIndex, setBorderedIndex] = useState(1);
  const bordered = borderedIndex === 1;

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>ActionList bordered</ContentHeaderTitle>
            <ContentHeaderDescription>v2.46.0: ActionList に bordered オプションを追加</ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            ActionList に bordered prop が追加され、各アイテム間にボーダーを表示できるようになりました。
          </Text>

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            bordered を切り替え
          </Text>
          <div style={{ marginBottom: "var(--aegis-space-large)" }}>
            <SegmentedControl index={borderedIndex} onChange={setBorderedIndex}>
              <SegmentedControl.Button>なし</SegmentedControl.Button>
              <SegmentedControl.Button>bordered</SegmentedControl.Button>
            </SegmentedControl>
          </div>

          <div
            style={{
              maxWidth: "var(--aegis-layout-width-x3Small)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            <ActionList bordered={bordered}>
              <ActionListItem>プロジェクト一覧</ActionListItem>
              <ActionListItem>ドキュメント</ActionListItem>
              <ActionListItem>メンバー管理</ActionListItem>
              <ActionListItem>設定</ActionListItem>
            </ActionList>
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
              ポイント
            </Text>
            <Text as="p" variant="body.small">
              - bordered={"{true}"} で各アイテム間にセパレーターラインを表示
            </Text>
            <Text as="p" variant="body.small">
              - デフォルトは false（従来の動作と同じ）
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-46-0">← Back to v2.46.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
