import { LfArrowUpRightFromSquare, LfBook, LfCode, LfFileLines, LfGraphNode } from "@legalforce/aegis-icons";
import {
  Link as AegisLink,
  Banner,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardLink,
  ContentHeader,
  Icon,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Tag,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";
import { useUpdates } from "./updates/hooks/useUpdates";

interface DocLink {
  label: string;
  to: string;
  external?: boolean;
}

const gettingStartedLinks: DocLink[] = [
  { label: "オンボーディングガイド", to: "/markdown-viewer?file=/docs/onboarding-guide.md" },
  { label: "aegis-lab について", to: "/markdown-viewer?file=/docs/about.md" },
  { label: "Mac セットアップ", to: "/markdown-viewer?file=/docs/mac-setup-guide.md" },
  {
    label: "Windows セットアップ",
    to: "https://www.notion.so/legalforce/Windows-Aegis-lab-2fd3166957128051ad63cf6ac1bc3ecd",
    external: true,
  },
  {
    label: "デザインシステムガイドブック",
    to: "https://www.notion.so/legalforce/Aegis-Our-Design-System-Aegis-Guidebook-For-Everyone-Involved-in-Product-Development-1d13166957128030a5dccc556d279c4c",
    external: true,
  },
  {
    label: "Aegis-lab 講習会",
    to: "https://www.notion.so/legalforce/Aegis-lab-2dd316695712807fababdb18f0ca3249",
    external: true,
  },
];

const devGuideLinks: DocLink[] = [
  { label: "開発ワークフロー", to: "/markdown-viewer?file=/docs/workflow-guide.md" },
  { label: "ページ作成", to: "/markdown-viewer?file=/docs/sandbox-guide.md" },
];

const commands = [
  { command: "git pull", description: "最新コードを取得" },
  { command: "pnpm dev", description: "開発サーバー起動" },
  { command: "pnpm build", description: "ビルド（PR前必須）" },
  { command: "pnpm format", description: "リント・フォーマット" },
];

const DocLinkItem = ({ link }: { link: DocLink }) => {
  if (link.external) {
    return (
      <AegisLink href={link.to} target="_blank" trailing={LfArrowUpRightFromSquare}>
        {link.label}
      </AegisLink>
    );
  }
  return (
    <AegisLink asChild>
      <Link to={link.to}>{link.label}</Link>
    </AegisLink>
  );
};

const Home = () => {
  const { allSections, isLoading } = useUpdates();
  const latestSection = allSections[0];

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader
            trailing={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--aegis-space-xSmall)",
                }}
              >
                <Text variant="label.small.bold" color="subtle">
                  aegis-react
                </Text>
                <Tag size="small" color="blue" variant="fill">
                  v{__AEGIS_REACT_VERSION__}
                </Tag>
              </div>
            }
          >
            <ContentHeader.Title>Aegis Lab</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium">
            AI との対話で「言葉」から高精度な画面を生成し、実際に動く UI を爆速で試行錯誤できます。
          </Text>

          <div
            style={{
              marginTop: "var(--aegis-space-large)",
              display: "flex",
              gap: "var(--aegis-space-medium)",
            }}
          >
            <Card variant="outline" size="medium">
              <CardHeader>
                <Icon size="large" color="accent.blue">
                  <LfBook />
                </Icon>
              </CardHeader>
              <CardBody>
                <CardLink asChild>
                  <Link to="/template">
                    <Text variant="title.xSmall">Templates</Text>
                  </Link>
                </CardLink>
                <Text variant="body.small" style={{ marginTop: "var(--aegis-space-xxSmall)" }}>
                  本番品質のリファレンス実装パターン集（36）
                </Text>
              </CardBody>
            </Card>
            <Card variant="outline" size="medium">
              <CardHeader>
                <Icon size="large" color="accent.lime">
                  <LfCode />
                </Icon>
              </CardHeader>
              <CardBody>
                <CardLink asChild>
                  <Link to="/sandbox">
                    <Text variant="title.xSmall">Sandbox</Text>
                  </Link>
                </CardLink>
                <Text variant="body.small" style={{ marginTop: "var(--aegis-space-xxSmall)" }}>
                  実験的な機能やプロトタイプを試す場所
                </Text>
              </CardBody>
            </Card>
            {import.meta.env.VITE_ENABLE_VISUAL_EDITOR === "true" && (
              <Card variant="outline" size="medium">
                <CardHeader>
                  <Icon size="large" color="accent.orange">
                    <LfGraphNode />
                  </Icon>
                </CardHeader>
                <CardBody>
                  <CardLink asChild>
                    <Link to="/visual-editor">
                      <Text variant="title.xSmall">Visual Editor</Text>
                    </Link>
                  </CardLink>
                  <Text variant="body.small" style={{ marginTop: "var(--aegis-space-xxSmall)" }}>
                    preview 上の領域を選んで Codex CLI に局所修正させる編集画面
                  </Text>
                </CardBody>
              </Card>
            )}
            <Card variant="outline" size="medium">
              <CardHeader>
                <Icon size="large" color="accent.gray">
                  <LfFileLines />
                </Icon>
              </CardHeader>
              <CardBody>
                <CardLink asChild>
                  <Link to="/markdown-viewer">
                    <Text variant="title.xSmall">Markdown Viewer</Text>
                  </Link>
                </CardLink>
                <Text variant="body.small" style={{ marginTop: "var(--aegis-space-xxSmall)" }}>
                  Markdown ファイルの閲覧・プレビュー
                </Text>
              </CardBody>
            </Card>
          </div>

          <div
            style={{
              marginTop: "var(--aegis-space-xLarge)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--aegis-space-medium)",
              alignItems: "start",
              maxWidth: "var(--aegis-layout-width-xLarge)",
            }}
          >
            <Card variant="outline" size="medium">
              <CardHeader>
                <Text variant="title.xSmall">はじめに</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                  {gettingStartedLinks.map((link) => (
                    <DocLinkItem key={link.to} link={link} />
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card variant="outline" size="medium">
              <CardHeader>
                <Text variant="title.xSmall">開発ガイド</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                  {devGuideLinks.map((link) => (
                    <DocLinkItem key={link.to} link={link} />
                  ))}
                  <div style={{ marginTop: "var(--aegis-space-xSmall)" }}>
                    <Text variant="label.small.bold" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
                      よく使うコマンド
                    </Text>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}>
                      {commands.map((cmd) => (
                        <Text key={cmd.command} variant="body.medium">
                          <code>{cmd.command}</code> — {cmd.description}
                        </Text>
                      ))}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {!isLoading && latestSection && (
            <div style={{ maxWidth: "var(--aegis-layout-width-xLarge)", marginTop: "var(--aegis-space-xLarge)" }}>
              <Banner
                color="information"
                title={
                  <>
                    What&apos;s New（{latestSection.meta.period}・{latestSection.meta.commitCount} commits）
                  </>
                }
                action={
                  <Button as={Link} to="/updates" variant="subtle" color="neutral" size="small">
                    詳細を見る
                  </Button>
                }
              >
                <Text variant="body.small">最新のアップデート情報をご確認ください。</Text>
              </Banner>
            </div>
          )}
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};

export default Home;
