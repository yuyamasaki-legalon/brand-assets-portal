import {
  Link as AegisLink,
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

export default function NewSandbox() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>メッセージ公開・非公開設定 Message visibility control</ContentHeader.Title>
            <ContentHeader.Description>
              メッセージの公開・非公開設定の実験用サンドボックスです。
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            ここにコンテンツを追加できます。
          </Text>
          <AegisLink asChild>
            <Link to="/sandbox/juna-kondo">← Back to juna-kondo Sandbox</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
