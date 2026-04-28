import {
  LfAiSparkles,
  LfApps,
  LfArrowRightLong,
  LfCamera,
  LfCode,
  LfCommentLines,
  LfEye,
  LfLayout,
  LfLink,
  LfSetting,
  LfSparkles,
  LfUserGroup,
  LfWand,
} from "@legalforce/aegis-icons";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  Divider,
  Icon,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Stepper,
  Tag,
  Text,
} from "@legalforce/aegis-react";
import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";

const styles = {
  hero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "var(--aegis-space-x3Large) var(--aegis-space-large)",
    gap: "var(--aegis-space-medium)",
    background: "var(--aegis-color-background-subtle)",
    borderRadius: "var(--aegis-radius-large)",
    marginBottom: "var(--aegis-space-xLarge)",
  } satisfies CSSProperties,
  heroTagGroup: {
    display: "flex",
    gap: "var(--aegis-space-xSmall)",
    flexWrap: "wrap",
    justifyContent: "center",
  } satisfies CSSProperties,
  heroDescription: {
    maxWidth: "var(--aegis-layout-width-large)",
  } satisfies CSSProperties,
  section: {
    marginBottom: "var(--aegis-space-xLarge)",
  } satisfies CSSProperties,
  sectionTitle: {
    marginBottom: "var(--aegis-space-medium)",
  } satisfies CSSProperties,
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(var(--aegis-layout-width-x4Small), 1fr))",
    gap: "var(--aegis-space-medium)",
  } satisfies CSSProperties,
  featureIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "var(--aegis-size-x3Large)",
    height: "var(--aegis-size-x3Large)",
    borderRadius: "var(--aegis-radius-large)",
    background: "var(--aegis-color-background-information-xSubtle)",
    marginBottom: "var(--aegis-space-small)",
  } satisfies CSSProperties,
  stepperCard: {
    padding: "var(--aegis-space-large)",
  } satisfies CSSProperties,
  ctaSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "var(--aegis-space-xLarge) var(--aegis-space-large)",
    gap: "var(--aegis-space-medium)",
    background: "var(--aegis-color-background-subtle)",
    borderRadius: "var(--aegis-radius-large)",
  } satisfies CSSProperties,
} as const;

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card>
      <CardHeader>
        <div style={styles.featureIcon}>{icon}</div>
        <Text variant="title.xSmall">{title}</Text>
      </CardHeader>
      <CardBody>
        <Text variant="body.small" color="subtle">
          {description}
        </Text>
      </CardBody>
    </Card>
  );
}

const features: FeatureCardProps[] = [
  {
    icon: (
      <Icon size="large" color="information">
        <LfApps />
      </Icon>
    ),
    title: "本物の Aegis コンポーネント",
    description:
      "モックアップではなく、プロダクションで使われる実際の Aegis デザインシステムコンポーネントを使用。色、余白、振る舞いまで本番と同じ。",
  },
  {
    icon: (
      <Icon size="large" color="information">
        <LfAiSparkles />
      </Icon>
    ),
    title: "AI 駆動の開発",
    description:
      "言葉で画面を作る。AI アシスタントと対話しながらプロトタイプを高速に構築。要件の整理から実装まで一気通貫。",
  },
  {
    icon: (
      <Icon size="large" color="information">
        <LfLayout />
      </Icon>
    ),
    title: "豊富なテンプレート",
    description: "一覧、詳細、設定、チャット、ダッシュボードなど、実績のあるレイアウトパターンを即座に活用。",
  },
  {
    icon: (
      <Icon size="large" color="information">
        <LfCode />
      </Icon>
    ),
    title: "そのまま本番へ",
    description: "プロトタイプで書いたコードをプロダクション開発にそのまま活用。作り直しゼロのスムーズな移行。",
  },
  {
    icon: (
      <Icon size="large" color="information">
        <LfUserGroup />
      </Icon>
    ),
    title: "誰でも使える",
    description: "エンジニア、デザイナー、PM、ステークホルダーなど、全員が同じプラットフォームでプロトタイプを確認。",
  },
  {
    icon: (
      <Icon size="large" color="information">
        <LfEye />
      </Icon>
    ),
    title: "Preview URL で共有",
    description: "PR ごとに自動生成されるプレビュー URL でチームとすぐに共有。固定 URL で安定した導線も確保。",
  },
];

export function AboutAegisLab() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>aegis-lab について</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          {/* Hero Section */}
          <div style={styles.hero}>
            <Icon size="xLarge">
              <LfSparkles />
            </Icon>
            <Text as="h2" variant="title.large">
              aegis-lab
            </Text>
            <div style={styles.heroTagGroup}>
              <Tag color="blue" variant="fill">
                Aegis Design System
              </Tag>
              <Tag color="blue" variant="fill">
                AI Assisted
              </Tag>
            </div>
            <div style={styles.heroDescription}>
              <Text as="p" variant="body.large" color="subtle">
                Aegis デザインシステムの本物のコンポーネントを使って、動くプロトタイプを高速に作成するプラットフォーム。
                AI との対話で「言葉を画面に」変換し、プロダクト開発を加速します。
              </Text>
            </div>
          </div>

          {/* Features Section */}
          <section style={styles.section}>
            <Text as="h3" variant="title.small" style={styles.sectionTitle}>
              主な特徴
            </Text>
            <div style={styles.featureGrid}>
              {features.map((f) => (
                <FeatureCard key={f.title} {...f} />
              ))}
            </div>
          </section>

          <Divider />

          {/* Tools Section */}
          <section style={{ ...styles.section, marginTop: "var(--aegis-space-xLarge)" }}>
            <Text as="h3" variant="title.small" style={styles.sectionTitle}>
              搭載機能
            </Text>
            <div style={styles.featureGrid}>
              <FeatureCard
                icon={
                  <Icon size="large" color="information">
                    <LfLink />
                  </Icon>
                }
                title="Preview URL"
                description="PR を作成すると自動でプレビュー URL が発行。固定スラッグを設定すれば、マージ後も同じ URL でアクセスできる。チームへの共有がリンク1つで完結。"
              />
              <FeatureCard
                icon={
                  <Icon size="large" color="information">
                    <LfCommentLines />
                  </Icon>
                }
                title="コメント機能"
                description="プロトタイプの画面上に直接コメントを残せる。デザインレビューやフィードバックを画面の文脈を保ったまま議論できる。"
              />
              <FeatureCard
                icon={
                  <Icon size="large" color="information">
                    <LfCamera />
                  </Icon>
                }
                title="レコーディング機能"
                description="操作の様子を録画して共有。テキストでは伝えにくいインタラクションやアニメーションの挙動を、そのまま記録して伝えられる。"
              />
              <FeatureCard
                icon={
                  <Icon size="large" color="information">
                    <LfSetting />
                  </Icon>
                }
                title="ローカル開発ツール"
                description="CLI でページ作成を行い、テンプレートを参照して実装を開始。AI アシスタントとの連携で、ローカル環境でも高速にプロトタイプを構築。"
              />
            </div>
          </section>

          <Divider />

          {/* How it works Section */}
          <section style={{ ...styles.section, marginTop: "var(--aegis-space-xLarge)" }}>
            <Text as="h3" variant="title.small" style={styles.sectionTitle}>
              使い方
            </Text>
            <Card>
              <CardBody>
                <div style={styles.stepperCard}>
                  <Stepper orientation="vertical" readOnly index={-1}>
                    <Stepper.Item title="Sandbox ページを作成">
                      <Text variant="body.small" color="subtle">
                        pnpm sandbox:create で新しいページを作成。テンプレートを選択してすぐに開始。
                      </Text>
                    </Stepper.Item>
                    <Stepper.Item title="AI と対話しながら構築">
                      <Text variant="body.small" color="subtle">
                        作りたい画面を言葉で伝えると、AI が Aegis コンポーネントを使って実装。イテレーションも自在。
                      </Text>
                    </Stepper.Item>
                    <Stepper.Item title="Preview URL で共有">
                      <Text variant="body.small" color="subtle">
                        PR を作成すると自動でプレビュー URL が生成。チームメンバーにすぐに共有できる。
                      </Text>
                    </Stepper.Item>
                    <Stepper.Item title="プロダクションへ展開">
                      <Text variant="body.small" color="subtle">
                        プロトタイプのコードを本番プロジェクトに移行。Aegis コンポーネントなのでそのまま使える。
                      </Text>
                    </Stepper.Item>
                  </Stepper>
                </div>
              </CardBody>
            </Card>
          </section>

          {/* CTA Section */}
          <div style={styles.ctaSection}>
            <Icon size="large" color="information">
              <LfWand />
            </Icon>
            <Text as="h3" variant="title.small">
              さっそく始めてみよう
            </Text>
            <Text as="p" variant="body.medium" color="subtle">
              ターミナルで pnpm sandbox:create を実行するだけで、あなたの Sandbox ページが作成されます。
            </Text>
            <Button
              as={Link}
              to="/sandbox"
              variant="solid"
              size="large"
              trailing={
                <Icon>
                  <LfArrowRightLong />
                </Icon>
              }
            >
              Sandbox 一覧へ
            </Button>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
