var e=`# Aegis Lab ナレッジ共有会 20260511 — エンジニアハンドオフ

> Auto-generated from sandbox prototype. Last updated: 2026-04-24

## サマリー

2026年5月11日の Aegis Lab ナレッジ共有会に向けた、共有 Sandbox 直下のアジェンダページ。共有一覧カードから遷移でき、各セッションを Aegis の \`Timeline\` で時間順に整理している。タイムライン項目をクリックすると、右側 \`PageLayoutPane\` に選択したセッション詳細を表示する。

- **ベース**: 新規画面（\`src/pages/template/pagelayout/\` の基本 PageLayout を参照）
- **sandbox**: \`src/pages/sandbox/aegis-lab-20260511/\`
- **PRD**: \`auto-generated-prd.md\`

## 変更概要

| カテゴリ | 変更内容 | 影響度 |
|---------|---------|-------|
| レイアウト | \`PageLayout\` の Header / Body / Footer 構成に、右側 \`PageLayoutPane\` を追加 | Low |
| コンポーネント | \`Banner\`, \`ContentHeader\`, \`ContentHeaderTitle\`, \`ContentHeaderDescription\`, \`Timeline\`, \`TimelineLink\`, \`PageLayoutPane\`, \`DescriptionList\`, \`Tag\`, \`TagGroup\`, \`Text\`, \`AegisLink\`, \`Icon\` を利用。アジェンダを囲っていた \`Card\` は削除 | Low |
| スタイル | ページ固有のレイアウト補助スタイルを \`index.module.css\` に分離 | Low |
| インタラクション | タイムライン項目クリックで右側 Pane を開き、閉じるボタンで Pane を閉じる | Low |
| データモデル | アジェンダ項目を \`id\` 付きローカル定数配列で保持。右側 Pane 限定の目的は \`detailPurposes\`、キーワードは \`detailKeywords\`、参考ページは \`detailLinks\`、外部導線は \`links\` に \`term\` / \`label\` / \`href\` を持たせる | Low |

## コード差分

### 共有ページカード（新規追加）

> 共有 Sandbox 一覧からナレッジ共有会ページへ遷移できる Card を追加。

\`\`\`tsx
<Card>
  <CardHeader>
    <CardLink asChild>
      <Link to="/sandbox/aegis-lab-20260511">
        <Text variant="title.xSmall">Aegis Lab ナレッジ共有会 20260511</Text>
      </Link>
    </CardLink>
  </CardHeader>
  <CardBody>
    <Text variant="body.small">Aegis Lab ナレッジ共有会の共有ページ</Text>
  </CardBody>
</Card>
\`\`\`

### アジェンダページ（新規実装）

> Header にイベント名、Body にセッション構成、Footer に Sandbox へ戻る導線、右側 Pane に選択中セッションの詳細を配置。

\`\`\`tsx
<PageLayout>
  <PageLayoutContent>
    <PageLayoutHeader>
      <ContentHeader>
        <ContentHeaderTitle>Aegis Lab ナレッジ共有会 20260511</ContentHeaderTitle>
        <ContentHeaderDescription>Aegis Lab のナレッジシェア大会アジェンダ</ContentHeaderDescription>
      </ContentHeader>
    </PageLayoutHeader>
    <PageLayoutBody>{/* アジェンダタイムライン */}</PageLayoutBody>
    <PageLayoutFooter>{/* Back to Sandbox */}</PageLayoutFooter>
  </PageLayoutContent>
  <PageLayoutPane position="end" open={selectedAgendaItem != null}>
    {/* 選択中セッションの詳細 */}
  </PageLayoutPane>
</PageLayout>
\`\`\`

## コンポーネント使用一覧

| コンポーネント | 用途 | 区分 |
|---------------|------|------|
| \`PageLayout\` | ページ全体の枠組み | 新規 |
| \`PageLayoutContent\` | メインコンテンツ領域 | 新規 |
| \`PageLayoutHeader\` | ページタイトル領域 | 新規 |
| \`PageLayoutBody\` | アジェンダ本文領域 | 新規 |
| \`PageLayoutFooter\` | 戻るリンク領域 | 新規 |
| \`PageLayoutPane\` | 選択したアジェンダ項目の詳細表示 | 新規 |
| \`ContentHeader\` | タイトルと説明文の枠 | 新規 |
| \`ContentHeaderTitle\` | ページと Pane 詳細のタイトル | 新規 |
| \`ContentHeaderDescription\` | ページと Pane 詳細の説明文 | 新規 |
| \`Banner\` | Meet コメント欄利用を促す上部案内 | 新規 |
| \`Timeline\` | アジェンダを時間順に表示 | 新規 |
| \`TimelineItem\` | 各セッションの行 | 新規 |
| \`TimelinePoint\` | セッション時間の表示位置 | 新規 |
| \`TimelineContent\` | 登壇者、タイトル、任意の補足説明 | 新規 |
| \`TimelineLink\` | タイムライン項目のクリック領域 | 新規 |
| \`DescriptionList\` | 右側 Pane 内の詳細項目表示 | 新規 |
| \`Tag\` | セッション時間、右側 Pane のキーワード表示 | 新規 |
| \`TagGroup\` | 右側 Pane のキーワード Tag のグルーピング | 新規 |
| \`Text\` | 見出し、本文、時間表記 | 新規 |
| \`Icon\` | 外部リンクアイコン、右側 Pane の閉じるボタン | 新規 |
| \`IconButton\` / \`Tooltip\` | 右側 Pane の閉じる操作 | 新規 |
| \`AegisLink\` | Sandbox へ戻るリンク、アンケート/プロトタイプ外部リンク | 新規 |

## データモデル

\`\`\`typescript
const agendaItems = [
  {
    id: "opening",
    speaker: "わたりょー",
    duration: "冒頭",
    title: "オープニング",
    note: "会の目的と進め方を共有する",
    detailPurposes: [
      "Aegis Lab のこと、現場で活用されている事例や創意工夫を皆さんに知っていただくこと",
      "今日得た知見を、みなさんがご活躍されている現場で活かせること",
    ],
  },
  {
    speaker: "わたりょー",
    duration: "10分",
    title: "Aegis Lab × Codex App の実践 Demo",
    note: "オープニングを兼ねた実践シェア",
    detailKeywords: [
      "並列で実行",
      "困ったら AI Agent に聞く / 頼む",
      "ビジュアルの情報を提供する",
      "技術的な調査",
      "ブレスト・パターン出し",
      "Codex App と Aegis Lab を使いこなす",
    ],
    detailLinks: [
      {
        term: "参考ページ",
        label: "マネジメントコンソール・ライセンス",
        href: "https://aegis-lab.ontechnologies.tech/template/management-console",
      },
    ],
  },
  {
    speaker: "乾さん・めーらさん",
    duration: "10分",
    title: "PdM とデザイナーでプロトタイプ開発をしている事例",
    note: "新機能でがっつり UI/UX を作り込んだ話、PdM とデザイナーの間にあった待ち時間と認識のずれがなくなった話など",
  },
  {
    id: "nomujun-interaction-simulation",
    speaker: "のむじゅんさん",
    duration: "7分",
    title: "操作性や機能をリアルにシミュレートすることを試した",
    note: "",
    links: [
      {
        term: "プロトタイプ",
        label: "表示タイミングをずらして心地よいインタラクションを目指した例",
        href: "https://pr-185-aegis-lab.on-technologies-technical-dept.workers.dev/sandbox/loc/nomura/case-detail",
      },
      {
        term: "プロトタイプ",
        label: "プロトタイプ内にLLM仕込んでいろいろ試した例",
        href: "https://pr-231-aegis-lab.on-technologies-technical-dept.workers.dev/sandbox/loc/nomura/tabular-review-ideal/analysis",
      },
    ],
  },
  {
    speaker: "二ティアさん",
    duration: "7分",
    title: "Admin & Integrationチームの活用事例",
    note: "",
    links: [
      {
        term: "プロトタイプ",
        label: "プロトタイプを見る",
        href: "https://7bb9a242-aegis-lab.on-technologies-technical-dept.workers.dev/sandbox/loc/nithya/3rd-party-integrations",
      },
    ],
  },
  {
    speaker: "ジヒさん",
    duration: "7分",
    title: "WorkOn での活用/運用事例",
    note: "",
  },
  {
    speaker: "ちえさん",
    duration: "7〜10分",
    title: "CLM ダッシュボードのナレッジシェア",
    note: "CLM ダッシュボードの知見を共有する",
    links: [
      {
        term: "プロトタイプ",
        label: "プロトタイプを見る",
        href: "https://pr-235-aegis-lab.on-technologies-technical-dept.workers.dev/sandbox/chie/analytics-MVP",
      },
      {
        term: "ドキュメント",
        label: "CLM レポート振り返り",
        href: "https://www.notion.so/legalforce/CLM-34131669571281a1ab87e2c1dd71e2c0?source=copy_link",
      },
    ],
  },
  {
    speaker: "わたりょー",
    duration: "最後",
    title: "クロージング",
    note: "",
    links: [
      {
        term: "アンケート",
        label: "アンケートに回答",
        href: "https://forms.gle/uWnaGFreMvGHpLc27",
      },
    ],
  },
  // ...
];

// note が空の場合は補足行を描画しない。
// selectedAgendaItemId で選択状態を保持し、右側 Pane の表示内容を切り替える。
// detailPurposes / detailKeywords / detailLinks は右側 Pane のみに表示し、Timeline 側には表示しない。
// links がある場合はタイムライン上と右側 Pane に外部導線を表示する。
\`\`\`

### 右側 Pane の詳細表示

> 選択中セッションの時間、登壇者、補足、右側 Pane 限定の目的/キーワード/参考ページを DescriptionList で表示。目的は \`ul\` / \`li\` の箇条書き、キーワードは \`TagGroup\` で表示する。note が空の場合は補足項目を出さない。

\`\`\`tsx
<DescriptionList bordered size="large">
  <DescriptionListItem>
    <DescriptionListTerm>時間</DescriptionListTerm>
    <DescriptionListDetail>
      <Tag>{selectedAgendaItem.duration}</Tag>
    </DescriptionListDetail>
  </DescriptionListItem>
  <DescriptionListItem>
    <DescriptionListTerm>登壇者</DescriptionListTerm>
    <DescriptionListDetail>{selectedAgendaItem.speaker}</DescriptionListDetail>
  </DescriptionListItem>
  {selectedAgendaItem.detailPurposes?.length ? (
    <DescriptionListItem>
      <DescriptionListTerm>目的</DescriptionListTerm>
      <DescriptionListDetail>
        <ul className={styles.purposeList}>
          {selectedAgendaItem.detailPurposes.map((purpose) => (
            <li key={purpose}>
              <Text variant="body.medium">{purpose}</Text>
            </li>
          ))}
        </ul>
      </DescriptionListDetail>
    </DescriptionListItem>
  ) : null}
  {selectedAgendaItem.detailKeywords?.length ? (
    <DescriptionListItem>
      <DescriptionListTerm>キーワード</DescriptionListTerm>
      <DescriptionListDetail>
        <TagGroup>
          {selectedAgendaItem.detailKeywords.map((keyword) => (
            <Tag key={keyword}>{keyword}</Tag>
          ))}
        </TagGroup>
      </DescriptionListDetail>
    </DescriptionListItem>
  ) : null}
  {selectedAgendaItem.detailLinks?.map((link) => (
    <DescriptionListItem key={link.href}>
      <DescriptionListTerm>{link.term}</DescriptionListTerm>
      <DescriptionListDetail>
        <div className={styles.agendaLinks}>
          <ExternalAgendaLink link={link} />
        </div>
      </DescriptionListDetail>
    </DescriptionListItem>
  ))}
</DescriptionList>
\`\`\`

### 上部案内 Banner

> アジェンダ見出しの前に、質問・感想の投稿先を案内する情報 Banner を表示。

\`\`\`tsx
<Banner color="information" closeButton={false}>
  <Text>質問・感想があれば、 Meet のコメント欄をご活用ください！</Text>
</Banner>
\`\`\`

### 外部リンク導線

> クロージング項目に Google Forms のアンケートリンク、のむじゅんさん/二ティアさん/ちえさんの項目にプロトタイプリンク、ちえさんの項目に CLM レポート振り返りドキュメントリンクを表示。右側 Pane にも同じ導線を表示する。クリック領域はリンク文字列の幅に留める。

\`\`\`tsx
<div className={styles.agendaLinks}>
  <AegisLink
    href={link.href}
    target="_blank"
    rel="noopener noreferrer"
    trailing={
      <Icon size="small">
        <LfArrowUpRightFromSquare />
      </Icon>
    }
  >
    {link.label}
  </AegisLink>
</div>
\`\`\`

## API コントラクトヒント

API は利用していない。静的ページとして実装しているため、現時点でバックエンド契約は不要。

## 実装ガイダンス

### 新規ファイル作成先の提案

| 項目 | パス |
|------|------|
| Sandbox ページ | \`src/pages/sandbox/aegis-lab-20260511/index.tsx\` |
| Sandbox ページスタイル | \`src/pages/sandbox/aegis-lab-20260511/index.module.css\` |
| 共有一覧 | \`src/pages/sandbox/index.tsx\` |
| ルート定義 | \`src/pages/sandbox/routes.tsx\` |

### 今後の更新ステップ

1. 事前打ち合わせで各登壇者が説明するプロトタイプを決める。
2. 未確定の登壇者について、右側 Pane に担当テーマとプロトタイプリンクを追加する。
3. 当日の開始時刻が決まったら、必要に応じてタイムテーブル形式へ更新する。

## 関連ドキュメント

| ドキュメント | パス |
|-------------|------|
| PRD | \`auto-generated-prd.md\` |
| テンプレート参照 | \`src/pages/template/pagelayout/\` |

## Change Log

| 日付 | 変更内容 |
|------|---------|
| 2026-04-24 | 初回生成 |
| 2026-04-24 | 「レジュメ」表記を「アジェンダ」に修正し、Timeline 表示を追加 |
| 2026-04-24 | LT テーマカードと「LT の進め方」カードを削除 |
| 2026-04-24 | アジェンダタイムラインを Card 外へ移動 |
| 2026-04-24 | わたりょーのオープニング/クロージングを追加 |
| 2026-04-24 | 二ティアさんのタイトルを「Admin & Integrationチームの活用事例」に変更 |
| 2026-04-24 | ジヒさんの表示名とタイトルを変更し、二ティアさん/ジヒさんの note を空白に変更 |
| 2026-04-24 | 乾さん・めーらさんのタイトルと note を PdM/デザイナーのプロトタイプ開発事例に変更 |
| 2026-04-24 | クロージングの note を空白に変更 |
| 2026-04-24 | のむじゅんさんのタイトルと note を変更 |
| 2026-04-24 | タイムライン項目クリックで右側詳細 Pane を表示する interaction を追加 |
| 2026-04-24 | 右側 Pane の詳細表示を DescriptionList に変更 |
| 2026-04-24 | deprecated な ContentHeader サブコンポーネントを廃止し、ページ固有 CSS を module に分離 |
| 2026-04-24 | Meet コメント欄利用を促す上部 Banner を追加 |
| 2026-04-24 | クロージング項目にアンケート導線を追加 |
| 2026-04-24 | 二ティアさんの項目に 3rd party integrations プロトタイプへのリンクを追加 |
| 2026-04-24 | ちえさんの項目に CLM ダッシュボードのプロトタイプと CLM レポート振り返りドキュメントへのリンクを追加 |
| 2026-04-24 | のむじゅんさんのタイトルを更新し、2 つのプロトタイプリンクを追加 |
| 2026-04-24 | わたりょーの 10分枠のタイトルを更新し、右側 Pane 限定のキーワード Tag を追加 |
| 2026-04-24 | わたりょーの 10分枠に右側 Pane 限定の参考ページリンクを追加 |
| 2026-04-24 | オープニングの目的を右側 Pane の箇条書きとして追加 |
| 2026-04-24 | 表示文言を \`Aegis Lab\` 表記に統一 |
`;export{e as default};