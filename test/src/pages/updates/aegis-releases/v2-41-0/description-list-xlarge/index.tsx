import {
  Link as AegisLink,
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

export const DescriptionListXLargeDemo = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>DescriptionList xLarge デモ</ContentHeader.Title>
            <ContentHeader.Description>v2.41.0: DescriptionList に xLarge サイズを追加</ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            DescriptionList のサイズに xLarge が追加されました。より大きなフォントサイズで情報を表示でき、
            詳細画面のヘッダー部分や重要な情報の強調に適しています。
          </Text>

          {/* xLarge - Vertical */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            xLarge（Vertical）
          </Text>
          <div style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
            <DescriptionList size="large">
              <DescriptionListItem>
                <DescriptionListTerm>契約書名</DescriptionListTerm>
                <DescriptionListDetail>業務委託基本契約書</DescriptionListDetail>
              </DescriptionListItem>
              <DescriptionListItem>
                <DescriptionListTerm>契約相手方</DescriptionListTerm>
                <DescriptionListDetail>株式会社サンプル</DescriptionListDetail>
              </DescriptionListItem>
              <DescriptionListItem>
                <DescriptionListTerm>契約金額</DescriptionListTerm>
                <DescriptionListDetail>¥12,000,000</DescriptionListDetail>
              </DescriptionListItem>
            </DescriptionList>
          </div>

          {/* xLarge - Horizontal */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            xLarge（Horizontal）
          </Text>
          <div style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
            <DescriptionList size="large">
              <DescriptionListItem orientation="horizontal">
                <DescriptionListTerm>契約書名</DescriptionListTerm>
                <DescriptionListDetail>業務委託基本契約書</DescriptionListDetail>
              </DescriptionListItem>
              <DescriptionListItem orientation="horizontal">
                <DescriptionListTerm>契約相手方</DescriptionListTerm>
                <DescriptionListDetail>株式会社サンプル</DescriptionListDetail>
              </DescriptionListItem>
              <DescriptionListItem orientation="horizontal">
                <DescriptionListTerm>契約金額</DescriptionListTerm>
                <DescriptionListDetail>¥12,000,000</DescriptionListDetail>
              </DescriptionListItem>
            </DescriptionList>
          </div>

          <Divider style={{ marginBottom: "var(--aegis-space-large)" }} />

          {/* Size comparison */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            サイズ比較（small / large / xLarge）
          </Text>

          <Text
            as="p"
            variant="body.xSmall"
            style={{ marginBottom: "var(--aegis-space-xSmall)", color: "var(--aegis-color-text-subtle)" }}
          >
            small
          </Text>
          <div style={{ marginBottom: "var(--aegis-space-large)" }}>
            <DescriptionList size="small">
              <DescriptionListItem orientation="horizontal">
                <DescriptionListTerm>契約書名</DescriptionListTerm>
                <DescriptionListDetail>業務委託基本契約書</DescriptionListDetail>
              </DescriptionListItem>
              <DescriptionListItem orientation="horizontal">
                <DescriptionListTerm>契約相手方</DescriptionListTerm>
                <DescriptionListDetail>株式会社サンプル</DescriptionListDetail>
              </DescriptionListItem>
            </DescriptionList>
          </div>

          <Text
            as="p"
            variant="body.xSmall"
            style={{ marginBottom: "var(--aegis-space-xSmall)", color: "var(--aegis-color-text-subtle)" }}
          >
            large（デフォルト）
          </Text>
          <div style={{ marginBottom: "var(--aegis-space-large)" }}>
            <DescriptionList size="large">
              <DescriptionListItem orientation="horizontal">
                <DescriptionListTerm>契約書名</DescriptionListTerm>
                <DescriptionListDetail>業務委託基本契約書</DescriptionListDetail>
              </DescriptionListItem>
              <DescriptionListItem orientation="horizontal">
                <DescriptionListTerm>契約相手方</DescriptionListTerm>
                <DescriptionListDetail>株式会社サンプル</DescriptionListDetail>
              </DescriptionListItem>
            </DescriptionList>
          </div>

          <Text
            as="p"
            variant="body.xSmall"
            style={{ marginBottom: "var(--aegis-space-xSmall)", color: "var(--aegis-color-text-subtle)" }}
          >
            xLarge（v2.41.0 新規）
          </Text>
          <div style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
            <DescriptionList size="large">
              <DescriptionListItem orientation="horizontal">
                <DescriptionListTerm>契約書名</DescriptionListTerm>
                <DescriptionListDetail>業務委託基本契約書</DescriptionListDetail>
              </DescriptionListItem>
              <DescriptionListItem orientation="horizontal">
                <DescriptionListTerm>契約相手方</DescriptionListTerm>
                <DescriptionListDetail>株式会社サンプル</DescriptionListDetail>
              </DescriptionListItem>
            </DescriptionList>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-41-0">← Back to v2.41.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
