import {
  Card,
  CardBody,
  CardHeader,
  CardLink,
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

export const AiRoleplayHub = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>AIロープレ面接システム</ContentHeader.Title>
            <ContentHeader.Description>ロープレの一覧・実施・結果・設定にアクセスできます。</ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "var(--aegis-space-medium)",
            }}
          >
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/ai-roleplay-results">
                    <Text variant="title.xSmall">ロープレ結果一覧</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">実施済みロープレの一覧とフィルタリング</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/ai-roleplay-result-detail">
                    <Text variant="title.xSmall">ロープレ結果詳細</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">評価内訳・会話ハイライト</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/ai-roleplay-session">
                    <Text variant="title.xSmall">ロープレ実施</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">チャット形式のロープレ面接</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/ai-roleplay-result-view">
                    <Text variant="title.xSmall">ロープレ結果表示</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">候補者・評価者向けまとめビュー</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/ai-roleplay-settings">
                    <Text variant="title.xSmall">ロープレ設定</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">評価基準・シナリオの設定</Text>
              </CardBody>
            </Card>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};

export default AiRoleplayHub;
