var e=`import {
  Link as AegisLink,
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

export const LinkFitContentDemo = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Link fit-content in flex/grid</ContentHeader.Title>
            <ContentHeader.Description>
              v2.52.0: Link が flex / grid コンテナ内でリンク全幅に広がらないよう <code>inline-size: fit-content</code>{" "}
              が適用された
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            v2.51.1 までは flex / grid 配下に Link を置くと、コンテナの主軸方向にリンクが伸びてしまい、テキスト幅以上の
            領域がクリック可能になる挙動がありました。v2.52.0 では Link に <code>inline-size: fit-content</code>{" "}
            が追加され、Link は常に内容に応じた幅になります。下記の枠は flex / grid コンテナの実際の幅を示しています。
            ホバー時の hit area が Link 文字幅に収まっていることが確認できます。
          </Text>

          <div style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
            <Text as="h3" variant="title.xSmall" style={{ marginBottom: "var(--aegis-space-small)" }}>
              flex column (column 方向)
            </Text>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-small)",
                padding: "var(--aegis-space-medium)",
                backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
                borderRadius: "var(--aegis-radius-medium)",
              }}
            >
              <AegisLink href="#">ドキュメントを参照する</AegisLink>
              <AegisLink href="#">ヘルプセンターを開く</AegisLink>
              <AegisLink href="#">サポートに問い合わせ</AegisLink>
            </div>
            <Text
              as="p"
              variant="body.small"
              style={{ color: "var(--aegis-color-text-subtle)", marginTop: "var(--aegis-space-xSmall)" }}
            >
              flex column 内でも Link はテキスト幅のままで、行全体には広がりません。
            </Text>
          </div>

          <div style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
            <Text as="h3" variant="title.xSmall" style={{ marginBottom: "var(--aegis-space-small)" }}>
              grid (1 column)
            </Text>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "var(--aegis-space-small)",
                padding: "var(--aegis-space-medium)",
                backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
                borderRadius: "var(--aegis-radius-medium)",
              }}
            >
              <AegisLink href="#">使い方ガイド</AegisLink>
              <AegisLink href="#">よくある質問</AegisLink>
              <AegisLink href="#">リリースノート</AegisLink>
            </div>
            <Text
              as="p"
              variant="body.small"
              style={{ color: "var(--aegis-color-text-subtle)", marginTop: "var(--aegis-space-xSmall)" }}
            >
              grid セル幅に Link が広がらず、テキスト幅でクリック領域が収まります。
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
              CSS 変更点
            </Text>
            <Text as="p" variant="body.small">
              Link 要素にデフォルトで <code>inline-size: fit-content</code> が当たるようになりました。flex / grid
              コンテナの伸長挙動を抑止します。
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