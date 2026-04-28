import {
  Link as AegisLink,
  Banner,
  ContentHeader,
  DescriptionList,
  DescriptionListDetail,
  DescriptionListItem,
  DescriptionListTerm,
  Divider,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

export const DescriptionListBorderedDemo = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>DescriptionList bordered デモ</ContentHeader.Title>
            <ContentHeader.Description>v2.40.0: DescriptionList bordered オプション検証</ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Banner color="warning" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            <code>bordered</code> prop は現在の Aegis
            バージョンから削除されています。このページは参考として残しています。
          </Banner>

          <Divider style={{ marginBottom: "var(--aegis-space-large)" }} />

          {/* Vertical (default) */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            Vertical（デフォルト）
          </Text>
          <div style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
            <DescriptionList>
              <DescriptionListItem>
                <DescriptionListTerm>契約書名</DescriptionListTerm>
                <DescriptionListDetail>業務委託基本契約書</DescriptionListDetail>
              </DescriptionListItem>
              <DescriptionListItem>
                <DescriptionListTerm>契約相手方</DescriptionListTerm>
                <DescriptionListDetail>株式会社サンプル</DescriptionListDetail>
              </DescriptionListItem>
              <DescriptionListItem>
                <DescriptionListTerm>契約開始日</DescriptionListTerm>
                <DescriptionListDetail>2026-01-01</DescriptionListDetail>
              </DescriptionListItem>
              <DescriptionListItem>
                <DescriptionListTerm>契約終了日</DescriptionListTerm>
                <DescriptionListDetail>2027-12-31</DescriptionListDetail>
              </DescriptionListItem>
            </DescriptionList>
          </div>

          {/* Horizontal */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            Horizontal
          </Text>
          <div style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
            <DescriptionList>
              <DescriptionListItem orientation="horizontal">
                <DescriptionListTerm>契約書名</DescriptionListTerm>
                <DescriptionListDetail>業務委託基本契約書</DescriptionListDetail>
              </DescriptionListItem>
              <DescriptionListItem orientation="horizontal">
                <DescriptionListTerm>契約相手方</DescriptionListTerm>
                <DescriptionListDetail>株式会社サンプル</DescriptionListDetail>
              </DescriptionListItem>
              <DescriptionListItem orientation="horizontal">
                <DescriptionListTerm>契約開始日</DescriptionListTerm>
                <DescriptionListDetail>2026-01-01</DescriptionListDetail>
              </DescriptionListItem>
              <DescriptionListItem orientation="horizontal">
                <DescriptionListTerm>契約終了日</DescriptionListTerm>
                <DescriptionListDetail>2027-12-31</DescriptionListDetail>
              </DescriptionListItem>
            </DescriptionList>
          </div>

          {/* Size comparison */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            Size: small
          </Text>
          <div style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
            <DescriptionList size="small">
              <DescriptionListItem orientation="horizontal">
                <DescriptionListTerm>ステータス</DescriptionListTerm>
                <DescriptionListDetail>レビュー中</DescriptionListDetail>
              </DescriptionListItem>
              <DescriptionListItem orientation="horizontal">
                <DescriptionListTerm>担当者</DescriptionListTerm>
                <DescriptionListDetail>田中太郎</DescriptionListDetail>
              </DescriptionListItem>
              <DescriptionListItem orientation="horizontal">
                <DescriptionListTerm>更新日</DescriptionListTerm>
                <DescriptionListDetail>2026-02-24</DescriptionListDetail>
              </DescriptionListItem>
            </DescriptionList>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-40-0">← Back to v2.40.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
