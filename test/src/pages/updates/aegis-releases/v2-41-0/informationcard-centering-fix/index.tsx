import { LfCheckCircle, LfDocumentCheck, LfInformation, LfWarningTriangle } from "@legalforce/aegis-icons";
import {
  Link as AegisLink,
  ContentHeader,
  Divider,
  InformationCard,
  InformationCardDescription,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

export const InformationCardCenteringFix = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>InformationCard 中央揃え修正 デモ</ContentHeader.Title>
            <ContentHeader.Description>
              v2.41.0: leading アイコンに対するテキスト垂直中央揃えを修正
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            v2.41.0 以前は、InformationCard の leading にアイコンを指定した場合、テキストが垂直方向に正しく
            中央揃えされないケースがありました。本修正により、1行・複数行いずれの場合もアイコンとテキストが
            正しく揃うようになりました。
          </Text>

          {/* Single line text */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            1行テキスト
          </Text>
          <div
            style={{
              display: "grid",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            <InformationCard leading={<LfDocumentCheck />}>契約書レビュー完了</InformationCard>

            <InformationCard leading={<LfCheckCircle />}>承認済み</InformationCard>
          </div>

          <Divider style={{ marginBottom: "var(--aegis-space-large)" }} />

          {/* Multi-line text */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            複数行テキスト（アイコンとの揃え確認）
          </Text>
          <div
            style={{
              display: "grid",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            <InformationCard leading={<LfInformation />}>
              契約書の自動レビューが完了しました
              <InformationCardDescription>
                業務委託基本契約書のレビュー結果を確認してください。3件の指摘事項があります。
              </InformationCardDescription>
            </InformationCard>

            <InformationCard leading={<LfWarningTriangle />}>
              契約期限が近づいています
              <InformationCardDescription>
                以下の契約書の更新期限が30日以内です。更新手続きを進めてください。 対象:
                業務委託基本契約書、秘密保持契約書、ソフトウェアライセンス契約書
              </InformationCardDescription>
            </InformationCard>
          </div>

          <Divider style={{ marginBottom: "var(--aegis-space-large)" }} />

          {/* Info box */}
          <div
            style={{
              padding: "var(--aegis-space-medium)",
              backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
              borderRadius: "var(--aegis-radius-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              修正内容
            </Text>
            <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              - leading アイコンとテキストの垂直方向の中央揃えが正しく適用されるように修正
            </Text>
            <Text as="p" variant="body.small">
              - iconPosition prop は deprecated に（自動的に適切な位置が決定される）
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-41-0">← Back to v2.41.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
