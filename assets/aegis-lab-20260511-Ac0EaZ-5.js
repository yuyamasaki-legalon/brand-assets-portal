var e=`import { LfArrowUpRightFromSquare, LfCloseLarge } from "@legalforce/aegis-icons";
import {
  Link as AegisLink,
  Banner,
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
  DescriptionList,
  DescriptionListDetail,
  DescriptionListItem,
  DescriptionListTerm,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutFooter,
  PageLayoutHeader,
  PageLayoutPane,
  Tag,
  TagGroup,
  Text,
  Timeline,
  TimelineContent,
  TimelineItem,
  TimelineLink,
  TimelinePoint,
  Tooltip,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./index.module.css";

type AgendaItem = {
  id: string;
  speaker: string;
  duration: string;
  title: string;
  note: string;
  detailPurposes?: string[];
  detailKeywords?: string[];
  detailLinks?: AgendaItemLink[];
  links?: AgendaItemLink[];
};

type AgendaItemLink = {
  term: string;
  label: string;
  href: string;
};

const agendaItems: AgendaItem[] = [
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
    id: "codex-app-share",
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
    id: "pdm-designer-prototype",
    speaker: "乾さん・めーらさん",
    duration: "10分",
    title: "PdM とデザイナーでプロトタイプ開発をしている事例",
    note: "新機能でがっつり UI/UX を作り込んだ話、PdM とデザイナーの間にあった待ち時間と認識のずれがなくなった話など",
    links: [
      {
        term: "資料",
        label: "LT：PdM × デザイナーのAegis-lab活用術",
        href: "https://www.notion.so/legalforce/LT-PdM-Aegis-lab-10-34331669571281bcae7ac033ad17dc29",
      },
    ],
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
    id: "admin-integration",
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
    id: "clm-dashboard",
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
        label: "Aegis labを使ったAI駆動開発の振り返り",
        href: "https://www.notion.so/legalforce/Aegis-lab-AI-35231669571281d7be7fe4eae041347c",
      },
    ],
  },
  {
    id: "closing",
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
];

const ExternalAgendaLink = ({ link }: { link: AgendaItemLink }) => (
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
);

export const AegisLab20260511 = () => {
  const [selectedAgendaItemId, setSelectedAgendaItemId] = useState<string | null>(null);
  const selectedAgendaItem = agendaItems.find((item) => item.id === selectedAgendaItemId);

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Aegis Lab ナレッジ共有会 20260511</ContentHeaderTitle>
            <ContentHeaderDescription>Aegis Lab のナレッジシェア大会アジェンダ</ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div className={styles.agendaContent}>
            <Banner color="information" closeButton={false}>
              <Text>質問・感想があれば、 Meet のコメント欄をご活用ください！</Text>
            </Banner>
            <Text as="h2" variant="title.medium">
              アジェンダ
            </Text>
            <Timeline>
              {agendaItems.map((item) => (
                <TimelineItem key={item.id} aria-current={selectedAgendaItemId === item.id ? "step" : false}>
                  <TimelinePoint>
                    <Tag>{item.duration}</Tag>
                  </TimelinePoint>
                  <TimelineContent>
                    <div className={styles.timelineItemContent}>
                      <TimelineLink asChild>
                        <button
                          type="button"
                          aria-controls="agenda-detail-pane"
                          aria-expanded={selectedAgendaItemId === item.id}
                          onClick={() => setSelectedAgendaItemId(item.id)}
                        >
                          <div className={styles.timelineText}>
                            <Text variant="label.medium" color="subtle">
                              {item.speaker}
                            </Text>
                            <Text variant="body.medium.bold">{item.title}</Text>
                            {item.note ? (
                              <Text as="p" variant="body.small" color="subtle">
                                {item.note}
                              </Text>
                            ) : null}
                          </div>
                        </button>
                      </TimelineLink>
                      {item.links?.length ? (
                        <div className={styles.agendaLinks}>
                          {item.links.map((link) => (
                            <ExternalAgendaLink key={link.href} link={link} />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </div>
        </PageLayoutBody>
        <PageLayoutFooter>
          <AegisLink asChild>
            <Link to="/sandbox">← Back to Sandbox</Link>
          </AegisLink>
        </PageLayoutFooter>
      </PageLayoutContent>
      <PageLayoutPane id="agenda-detail-pane" position="end" width="medium" resizable open={selectedAgendaItem != null}>
        <PageLayoutHeader>
          <ContentHeader
            size="medium"
            action={
              <Tooltip title="閉じる">
                <IconButton
                  variant="plain"
                  size="small"
                  aria-label="詳細を閉じる"
                  onClick={() => setSelectedAgendaItemId(null)}
                >
                  <Icon>
                    <LfCloseLarge />
                  </Icon>
                </IconButton>
              </Tooltip>
            }
          >
            <ContentHeaderTitle>{selectedAgendaItem?.title ?? "セッション詳細"}</ContentHeaderTitle>
            <ContentHeaderDescription>
              {selectedAgendaItem?.speaker ?? "タイムライン項目を選択"}
            </ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          {selectedAgendaItem ? (
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
              {selectedAgendaItem.note ? (
                <DescriptionListItem>
                  <DescriptionListTerm>補足</DescriptionListTerm>
                  <DescriptionListDetail>{selectedAgendaItem.note}</DescriptionListDetail>
                </DescriptionListItem>
              ) : null}
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
              {selectedAgendaItem.links?.map((link) => (
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
          ) : null}
        </PageLayoutBody>
      </PageLayoutPane>
    </PageLayout>
  );
};
`;export{e as default};