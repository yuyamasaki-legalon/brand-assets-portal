import { LfCheck, LfCloseSmall, LfInformation, LfLink, LfTag } from "@legalforce/aegis-icons";
import {
  Banner,
  Card,
  CardBody,
  CardHeader,
  Code,
  ContentHeader,
  Icon,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  StatusLabel,
  Stepper,
  Table,
  TableContainer,
  Tag,
  Text,
} from "@legalforce/aegis-react";
import styles from "./index.module.css";
import labelCreationDropdownImg from "./label-creation-dropdown.png";
import prLabelsSectionImg from "./pr-labels-section.png";

const SLUG_RULES = [
  { rule: "使える文字", detail: "小文字英数字とハイフン（a-z, 0-9, -）" },
  { rule: "先頭文字", detail: "英数字（ハイフン不可）" },
  { rule: "最大長", detail: "31 文字" },
  { rule: "1 PR あたり", detail: "最大 5 ラベル" },
];

const CLEANUP_RESULTS = [
  { status: "deleted", color: "teal" as const, description: "エイリアスが削除された" },
  {
    status: "still in use",
    color: "blue" as const,
    description: "他のオープン PR が同じラベルを使っているため削除されなかった",
  },
  {
    status: "manual cleanup required",
    color: "orange" as const,
    description: "API エラーで削除失敗。Cloudflare ダッシュボードから手動削除が必要",
  },
  { status: "reserved", color: "purple" as const, description: "予約語のため削除対象外" },
  { status: "invalid slug", color: "red" as const, description: "slug の形式が不正なため削除対象外" },
];

const SLUG_EXAMPLES: { slug: string; valid: boolean; reason?: string }[] = [
  { slug: "preview:clm-report", valid: true },
  { slug: "preview:tabular-review", valid: true },
  { slug: "preview:wata-analytics", valid: true },
  { slug: "preview:pr-42", valid: false, reason: "予約語" },
  { slug: "preview:UPPER-CASE", valid: false, reason: "大文字不可" },
  { slug: "preview:-start-hyphen", valid: false, reason: "先頭ハイフン不可" },
];

export function PreviewUrlGuide() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader
            size="large"
            leading={
              <Icon size="xLarge">
                <LfLink />
              </Icon>
            }
          >
            <ContentHeader.Title>Preview URL プロジェクト固定 URL</ContentHeader.Title>
            <ContentHeader.Description>
              PR が変わっても同じ URL でプレビューにアクセスできる機能の紹介
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div className={styles.sections}>
            {/* Overview */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">この機能でできること</Text>
              </CardHeader>
              <CardBody>
                <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
                  PR を作成すると自動で PR 固有のプレビュー URL が発行されますが、PR ごとに URL
                  が変わるため長期間の共有には不便です。
                </Text>
                <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
                  <strong>プロジェクト固定 URL</strong> を使うと、PR が変わっても同じ URL
                  でアクセスできます。ステークホルダーへの共有やフィードバック収集に便利です。
                </Text>

                <div className={styles.comparison}>
                  <div className={styles.comparisonItem}>
                    <Text variant="label.medium">従来（PR 固有 URL）</Text>
                    <div className={styles.urlBox}>
                      https://<span className={styles.urlHighlight}>pr-42</span>
                      -aegis-lab.on-technologies-technical-dept.workers.dev
                    </div>
                    <Text variant="body.small" style={{ color: "var(--aegis-color-text-subtle)" }}>
                      PR ごとに URL が変わる
                    </Text>
                  </div>
                  <div className={styles.comparisonItem}>
                    <Text variant="label.medium">新機能（プロジェクト固定 URL）</Text>
                    <div className={styles.urlBox}>
                      https://<span className={styles.urlHighlight}>clm-report</span>
                      -aegis-lab.on-technologies-technical-dept.workers.dev
                    </div>
                    <Text variant="body.small" style={{ color: "var(--aegis-color-text-subtle)" }}>
                      PR が変わっても URL は固定
                    </Text>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Usage Steps */}
            <Card>
              <CardHeader
                leading={
                  <Icon>
                    <LfTag />
                  </Icon>
                }
              >
                <Text variant="title.xSmall">使い方</Text>
              </CardHeader>
              <CardBody>
                <Stepper orientation="vertical" readOnly index={-1}>
                  <Stepper.Item title="PR にラベルを付ける">
                    <div className={styles.stepContent}>
                      <Text variant="body.medium">
                        PR に <Code>preview:slug名</Code> 形式のラベルを付けます。
                      </Text>
                      <Text variant="body.small" style={{ color: "var(--aegis-color-text-subtle)" }}>
                        例: <Code>preview:clm-report</Code>
                      </Text>
                      <div className={styles.screenshotGroup}>
                        <img
                          src={prLabelsSectionImg}
                          alt="PR ページの Labels セクションからラベルを追加する"
                          className={styles.screenshot}
                        />
                        <img
                          src={labelCreationDropdownImg}
                          alt="preview:test-test のようにラベル名を入力して新規作成する"
                          className={styles.screenshotSmall}
                        />
                      </div>
                    </div>
                  </Stepper.Item>
                  <Stepper.Item title="固定 URL が自動発行される">
                    <Text variant="body.medium">
                      CI が自動でビルド・デプロイし、PR コメントに固定 URL が表示されます。
                    </Text>
                  </Stepper.Item>
                  <Stepper.Item title="マージ後もスナップショットとして残る">
                    <Text variant="body.medium">
                      PR をマージしても URL はそのまま。最後にデプロイした内容が保持されます。
                    </Text>
                  </Stepper.Item>
                  <Stepper.Item title="内容を更新するには">
                    <Text variant="body.medium">
                      新しい PR に同じラベルを付けると、push のたびに URL の中身が上書きされます。
                    </Text>
                  </Stepper.Item>
                </Stepper>
              </CardBody>
            </Card>

            {/* Slug Rules */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">slug の命名ルール</Text>
              </CardHeader>
              <CardBody>
                <TableContainer>
                  <Table size="small">
                    <Table.Head>
                      <Table.Row>
                        <Table.Cell as="th">ルール</Table.Cell>
                        <Table.Cell as="th">詳細</Table.Cell>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {SLUG_RULES.map((row) => (
                        <Table.Row key={row.rule}>
                          <Table.Cell>
                            <Text variant="label.small">{row.rule}</Text>
                          </Table.Cell>
                          <Table.Cell>
                            <Text variant="body.small">{row.detail}</Text>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </TableContainer>

                <Text
                  variant="label.small"
                  style={{
                    marginTop: "var(--aegis-space-medium)",
                    marginBottom: "var(--aegis-space-xSmall)",
                    display: "block",
                  }}
                >
                  予約語（使用不可）
                </Text>
                <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)", flexWrap: "wrap" }}>
                  {["main", "preview", "latest", "production", "staging", "pr-{数字}"].map((word) => (
                    <Tag key={word} size="small" color="red" variant="outline">
                      {word}
                    </Tag>
                  ))}
                </div>

                <Text
                  variant="label.small"
                  style={{
                    marginTop: "var(--aegis-space-medium)",
                    marginBottom: "var(--aegis-space-xSmall)",
                    display: "block",
                  }}
                >
                  slug の例
                </Text>
                <div className={styles.slugExamples}>
                  {SLUG_EXAMPLES.map((example) => (
                    <div key={example.slug} className={styles.slugRow}>
                      <Icon size="small" color={example.valid ? "success" : "danger"}>
                        {example.valid ? <LfCheck /> : <LfCloseSmall />}
                      </Icon>
                      <Code>{example.slug}</Code>
                      {example.reason && (
                        <Text variant="body.small" style={{ color: "var(--aegis-color-text-subtle)" }}>
                          ({example.reason})
                        </Text>
                      )}
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Label Removal */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">ラベルを外したとき</Text>
              </CardHeader>
              <CardBody>
                <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
                  ラベルを外すと Cloudflare 上のエイリアスの自動削除が試みられます。結果は PR コメント（Preview Alias
                  Cleanup）で確認できます。
                </Text>
                <TableContainer>
                  <Table size="small">
                    <Table.Head>
                      <Table.Row>
                        <Table.Cell as="th">結果</Table.Cell>
                        <Table.Cell as="th">意味</Table.Cell>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {CLEANUP_RESULTS.map((row) => (
                        <Table.Row key={row.status}>
                          <Table.Cell>
                            <StatusLabel size="small" color={row.color}>
                              {row.status}
                            </StatusLabel>
                          </Table.Cell>
                          <Table.Cell>
                            <Text variant="body.small">{row.description}</Text>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>

            {/* Tips for non-engineers */}
            <Card>
              <CardHeader
                leading={
                  <Icon>
                    <LfInformation />
                  </Icon>
                }
              >
                <Text variant="title.xSmall">エンジニア以外の方へ</Text>
              </CardHeader>
              <CardBody>
                <Text as="p" variant="body.medium">
                  リポジトリ管理者が <strong>Settings &rarr; Labels &rarr; New label</strong> で{" "}
                  <Code>preview:clm-report</Code>{" "}
                  のようなラベルを事前に作成できます。非エンジニアは既存ラベルをドロップダウンから選ぶだけで利用できます。
                </Text>
              </CardBody>
            </Card>

            {/* Caveats */}
            <Banner color="warning" title="注意事項" closeButton={false}>
              <div className={styles.noteList}>
                <div className={styles.noteItem}>
                  <Text variant="body.small">
                    <strong>slug の衝突:</strong> 同じ slug を複数のオープン PR で使うと、最後にデプロイした PR
                    の内容で上書きされます（last deploy wins）
                  </Text>
                </div>
                <div className={styles.noteItem}>
                  <Text variant="body.small">
                    <strong>マージ後の動作:</strong> main デプロイでは自動更新されません。URL
                    の中身を更新するには、同じラベルを付けた新しい PR をマージしてください
                  </Text>
                </div>
                <div className={styles.noteItem}>
                  <Text variant="body.small">
                    <strong>ラベルを外さずにマージ:</strong> スナップショットがそのまま残ります（自動削除されません）
                  </Text>
                </div>
              </div>
            </Banner>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
