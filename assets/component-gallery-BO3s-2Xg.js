var e=`import { LfCheck, LfMagnifyingGlass, LfPlusLarge, LfTrash, LfUser } from "@legalforce/aegis-icons";
import {
  Accordion,
  Link as AegisLink,
  Avatar,
  AvatarGroup,
  Badge,
  Banner,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
  DescriptionList,
  DescriptionListDetail,
  DescriptionListItem,
  DescriptionListTerm,
  Divider,
  EmptyState,
  FormControl,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutFooter,
  PageLayoutHeader,
  ProgressBar,
  ProgressCircle,
  Radio,
  RadioGroup,
  Search,
  Skeleton,
  StatusLabel,
  Switch,
  Table,
  TableContainer,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tag,
  TagGroup,
  Text,
  Textarea,
  TextField,
  Tooltip,
} from "@legalforce/aegis-react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";

const styles = {
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-medium)",
    marginBottom: "var(--aegis-space-xLarge)",
  } satisfies CSSProperties,
  sectionTitle: {
    paddingBottom: "var(--aegis-space-xSmall)",
    borderBottom: "1px solid var(--aegis-color-border-default)",
  } satisfies CSSProperties,
  row: {
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--aegis-space-small)",
    alignItems: "center",
  } satisfies CSSProperties,
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-small)",
  } satisfies CSSProperties,
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "var(--aegis-space-medium)",
  } satisfies CSSProperties,
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "var(--aegis-space-medium)",
  } satisfies CSSProperties,
  panel: {
    padding: "var(--aegis-space-medium)",
    background: "var(--aegis-color-background-subtle)",
    borderRadius: "var(--aegis-radius-medium)",
  } satisfies CSSProperties,
} as const;

export const ComponentGallery = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Component Gallery</ContentHeaderTitle>
            <ContentHeaderDescription>
              FloatingSourceCodeViewer のピッカー機能テスト用に、Aegis の代表的なコンポーネントを並べたページ。
            </ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>

        <PageLayoutBody>
          <section style={styles.section}>
            <Text as="h2" variant="title.medium" style={styles.sectionTitle}>
              Typography
            </Text>
            <div style={styles.column}>
              <Text variant="title.large">Title Large</Text>
              <Text variant="title.medium">Title Medium</Text>
              <Text variant="title.small">Title Small</Text>
              <Text variant="body.large">Body Large - 通常の文章テキスト</Text>
              <Text variant="body.medium">Body Medium - 通常の文章テキスト</Text>
              <Text variant="body.small" color="subtle">
                Body Small / subtle - 補足説明など
              </Text>
              <Text variant="label.medium" color="information">
                Label Medium / information
              </Text>
            </div>
          </section>

          <section style={styles.section}>
            <Text as="h2" variant="title.medium" style={styles.sectionTitle}>
              Buttons
            </Text>
            <div style={styles.row}>
              <Button variant="solid">Solid</Button>
              <Button variant="subtle">Subtle</Button>
              <Button variant="plain">Plain</Button>
              <Button variant="gutterless">Gutterless</Button>
              <Button variant="solid" color="danger">
                Danger
              </Button>
              <Button variant="solid" disabled>
                Disabled
              </Button>
              <Button variant="solid" loading>
                Loading
              </Button>
              <Button variant="solid" leading={LfPlusLarge}>
                With Icon
              </Button>
            </div>
            <ButtonGroup>
              <Button variant="subtle">Cancel</Button>
              <Button variant="solid">Confirm</Button>
            </ButtonGroup>
            <div style={styles.row}>
              <Tooltip title="削除">
                <IconButton aria-label="削除">
                  <Icon>
                    <LfTrash />
                  </Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title="追加">
                <IconButton aria-label="追加" variant="solid">
                  <Icon>
                    <LfPlusLarge />
                  </Icon>
                </IconButton>
              </Tooltip>
            </div>
          </section>

          <section style={styles.section}>
            <Text as="h2" variant="title.medium" style={styles.sectionTitle}>
              Form Inputs
            </Text>
            <div style={styles.grid2}>
              <FormControl>
                <FormControl.Label>TextField</FormControl.Label>
                <TextField defaultValue="Sample input" />
                <FormControl.Caption>補足テキスト</FormControl.Caption>
              </FormControl>
              <FormControl>
                <FormControl.Label>Textarea</FormControl.Label>
                <Textarea defaultValue="Multi-line text" minRows={3} />
              </FormControl>
              <FormControl>
                <FormControl.Label>Search</FormControl.Label>
                <Search defaultValue="" placeholder="検索..." />
              </FormControl>
              <FormControl>
                <FormControl.Label>Email</FormControl.Label>
                <TextField type="email" defaultValue="user@example.com" />
              </FormControl>
            </div>
            <div style={styles.row}>
              <Checkbox defaultChecked>Checkbox checked</Checkbox>
              <Checkbox>Checkbox unchecked</Checkbox>
              <Switch defaultChecked>Switch on</Switch>
              <Switch>Switch off</Switch>
            </div>
            <RadioGroup defaultValue="a">
              <Radio value="a">Option A</Radio>
              <Radio value="b">Option B</Radio>
              <Radio value="c">Option C</Radio>
            </RadioGroup>
          </section>

          <section style={styles.section}>
            <Text as="h2" variant="title.medium" style={styles.sectionTitle}>
              Tags, Badges & Status
            </Text>
            <div style={styles.row}>
              <Tag>Default</Tag>
              <Tag color="blue">Blue</Tag>
              <Tag color="red">Red</Tag>
              <Tag color="teal">Teal</Tag>
              <Tag color="yellow">Yellow</Tag>
              <Tag color="purple">Purple</Tag>
              <Tag color="blue" variant="fill">
                Fill
              </Tag>
              <Tag color="blue" variant="outline">
                Outline
              </Tag>
            </div>
            <TagGroup>
              <Tag color="indigo">React</Tag>
              <Tag color="indigo">TypeScript</Tag>
              <Tag color="indigo">Aegis</Tag>
            </TagGroup>
            <div style={styles.row}>
              <Badge>1</Badge>
              <Badge>99+</Badge>
              <Badge>New</Badge>
            </div>
            <div style={styles.row}>
              <StatusLabel color="teal">承認済み</StatusLabel>
              <StatusLabel color="yellow">レビュー中</StatusLabel>
              <StatusLabel color="red">却下</StatusLabel>
              <StatusLabel color="neutral">下書き</StatusLabel>
            </div>
          </section>

          <section style={styles.section}>
            <Text as="h2" variant="title.medium" style={styles.sectionTitle}>
              Avatars & Icons
            </Text>
            <div style={styles.row}>
              <Avatar size="small" name="田中" />
              <Avatar size="medium" name="山田" />
              <Avatar size="large" name="佐藤" />
              <Avatar size="large" name="ユーザー">
                <Icon>
                  <LfUser />
                </Icon>
              </Avatar>
            </div>
            <AvatarGroup>
              <Avatar name="A" />
              <Avatar name="B" />
              <Avatar name="C" />
              <Avatar name="D" />
            </AvatarGroup>
            <div style={styles.row}>
              <Icon size="xSmall">
                <LfCheck />
              </Icon>
              <Icon size="small">
                <LfCheck />
              </Icon>
              <Icon size="medium">
                <LfCheck />
              </Icon>
              <Icon size="large">
                <LfCheck />
              </Icon>
              <Icon size="large" color="success">
                <LfCheck />
              </Icon>
              <Icon size="large" color="danger">
                <LfTrash />
              </Icon>
              <Icon size="large" color="information">
                <LfMagnifyingGlass />
              </Icon>
            </div>
          </section>

          <section style={styles.section}>
            <Text as="h2" variant="title.medium" style={styles.sectionTitle}>
              Banners & Alerts
            </Text>
            <Banner>情報メッセージ: 通常の通知です。</Banner>
            <Banner color="success">成功: 操作が完了しました。</Banner>
            <Banner color="warning">警告: 設定を確認してください。</Banner>
            <Banner color="danger">エラー: 接続に失敗しました。</Banner>
          </section>

          <section style={styles.section}>
            <Text as="h2" variant="title.medium" style={styles.sectionTitle}>
              Progress & Skeleton
            </Text>
            <ProgressBar value={65} />
            <ProgressBar />
            <div style={styles.row}>
              <ProgressCircle value={45} />
              <ProgressCircle />
            </div>
            <Skeleton height="20px" width="80%" />
            <Skeleton height="20px" width="60%" />
          </section>

          <section style={styles.section}>
            <Text as="h2" variant="title.medium" style={styles.sectionTitle}>
              Cards
            </Text>
            <div style={styles.grid3}>
              <Card>
                <CardHeader>
                  <Text variant="title.xSmall">基本的なカード</Text>
                </CardHeader>
                <CardBody>
                  <Text variant="body.small" color="subtle">
                    シンプルなカードレイアウトの例です。
                  </Text>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <Text variant="title.xSmall">統計</Text>
                </CardHeader>
                <CardBody>
                  <Text variant="title.large">1,234</Text>
                  <Text variant="body.small" color="subtle">
                    今月の利用件数
                  </Text>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <Text variant="title.xSmall">アクション</Text>
                </CardHeader>
                <CardBody>
                  <Button variant="solid" size="small">
                    詳細
                  </Button>
                </CardBody>
              </Card>
            </div>
          </section>

          <section style={styles.section}>
            <Text as="h2" variant="title.medium" style={styles.sectionTitle}>
              Tabs
            </Text>
            <Tabs defaultValue="tab1">
              <TabsList>
                <TabsTrigger value="tab1">概要</TabsTrigger>
                <TabsTrigger value="tab2">詳細</TabsTrigger>
                <TabsTrigger value="tab3">設定</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <Text variant="body.medium">概要タブの内容です。</Text>
              </TabsContent>
              <TabsContent value="tab2">
                <Text variant="body.medium">詳細タブの内容です。</Text>
              </TabsContent>
              <TabsContent value="tab3">
                <Text variant="body.medium">設定タブの内容です。</Text>
              </TabsContent>
            </Tabs>
          </section>

          <section style={styles.section}>
            <Text as="h2" variant="title.medium" style={styles.sectionTitle}>
              Accordion
            </Text>
            <Accordion multiple>
              <Accordion.Item>
                <Accordion.Button>セクション 1</Accordion.Button>
                <Accordion.Panel>セクション 1 の内容です。</Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Button>セクション 2</Accordion.Button>
                <Accordion.Panel>セクション 2 の内容です。</Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </section>

          <section style={styles.section}>
            <Text as="h2" variant="title.medium" style={styles.sectionTitle}>
              Breadcrumb & Links
            </Text>
            <Breadcrumb>
              <BreadcrumbItem>
                <AegisLink href="#">ホーム</AegisLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <AegisLink href="#">プロジェクト</AegisLink>
              </BreadcrumbItem>
              <BreadcrumbItem>現在のページ</BreadcrumbItem>
            </Breadcrumb>
            <div style={styles.row}>
              <AegisLink href="#">通常のリンク</AegisLink>
              <AegisLink href="#">もう一つのリンク</AegisLink>
            </div>
          </section>

          <section style={styles.section}>
            <Text as="h2" variant="title.medium" style={styles.sectionTitle}>
              Table
            </Text>
            <TableContainer>
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Cell>名前</Table.Cell>
                    <Table.Cell>ステータス</Table.Cell>
                    <Table.Cell>更新日</Table.Cell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>契約書 A</Table.Cell>
                    <Table.Cell>
                      <StatusLabel color="teal">承認済み</StatusLabel>
                    </Table.Cell>
                    <Table.Cell>2026-06-01</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>契約書 B</Table.Cell>
                    <Table.Cell>
                      <StatusLabel color="yellow">レビュー中</StatusLabel>
                    </Table.Cell>
                    <Table.Cell>2026-06-05</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </TableContainer>
          </section>

          <section style={styles.section}>
            <Text as="h2" variant="title.medium" style={styles.sectionTitle}>
              Description List
            </Text>
            <DescriptionList>
              <DescriptionListItem>
                <DescriptionListTerm>名前</DescriptionListTerm>
                <DescriptionListDetail>山田太郎</DescriptionListDetail>
              </DescriptionListItem>
              <DescriptionListItem>
                <DescriptionListTerm>所属</DescriptionListTerm>
                <DescriptionListDetail>法務部</DescriptionListDetail>
              </DescriptionListItem>
              <DescriptionListItem>
                <DescriptionListTerm>メール</DescriptionListTerm>
                <DescriptionListDetail>yamada@example.com</DescriptionListDetail>
              </DescriptionListItem>
            </DescriptionList>
          </section>

          <section style={styles.section}>
            <Text as="h2" variant="title.medium" style={styles.sectionTitle}>
              Empty State
            </Text>
            <div style={styles.panel}>
              <EmptyState
                size="medium"
                visual={
                  <Icon size="large">
                    <LfMagnifyingGlass />
                  </Icon>
                }
                title="データがありません"
                action={<Button variant="solid">追加</Button>}
              >
                <Text variant="body.small">新しい項目を追加すると、ここに表示されます。</Text>
              </EmptyState>
            </div>
          </section>

          <Divider />

          <Text variant="body.small" color="subtle">
            このページは FloatingSourceCodeViewer のピッカー機能のテスト用です。 右下のランチャーから "Pick"
            を起動し、各コンポーネントをホバーしてラベル表示やコントラスト・編集機能を確認できます。
          </Text>
        </PageLayoutBody>

        <PageLayoutFooter>
          <AegisLink asChild>
            <Link to="/sandbox">← Back to Sandbox</Link>
          </AegisLink>
        </PageLayoutFooter>
      </PageLayoutContent>
    </PageLayout>
  );
};
`;export{e as default};