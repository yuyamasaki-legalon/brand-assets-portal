import { LfAngleRight, LfInformationCircle, LfMagnifyingGlass } from "@legalforce/aegis-icons";
import {
  Button,
  Icon,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  Tab,
  Tag,
  Text,
  TextField,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { LocSidebarLayout } from "../_shared";
import {
  ARTICLE_FILTER_DEFAULT,
  ArticleFilter,
  CASE_FILTER_DEFAULT,
  CaseFilter,
  CONTRACT_FILTER_DEFAULT,
  ContractFilter,
  CUSTOMER_TEMPLATE_FILTER_DEFAULT,
  CustomerTemplateFilter,
  LEGALON_TEMPLATE_FILTER_DEFAULT,
  LegalonTemplateFilter,
  OTHER_FILE_FILTER_DEFAULT,
  OtherFileFilter,
} from "./filters";
import styles from "./index.module.css";
import {
  type ArticleResult,
  agreedResults,
  articleResults,
  type CaseResult,
  type CategorySummary,
  type ContractResult,
  caseResults,
  categorySummaries,
  contractResults,
  customerTemplateResults,
  legalonTemplateResults,
  type OtherFileResult,
  otherFileResults,
  type TemplateResult,
  totalCount,
} from "./mock/data";

const TAB_LABELS = [
  "すべて",
  "条文",
  "案件",
  "契約書",
  "締結版契約書",
  "自社ひな形",
  "LegalOnテンプレート",
  "その他ファイル",
];

function ArticleCard({ item }: { item: ArticleResult }) {
  return (
    <div className={styles.resultCard}>
      <Text variant="body.medium.bold">{item.title}</Text>
      <Text variant="body.small" color="subtle">
        {item.body}
      </Text>
      <div className={styles.resultMeta}>
        <div className={styles.metaItem}>
          <Text variant="label.small" color="subtle">
            ファイル名：
          </Text>
          <Link to={item.source.fileHref}>
            <Text variant="label.small" color="information">
              {item.source.fileName}
            </Text>
          </Link>
        </div>
        <div className={styles.metaItem}>
          <Text variant="label.small" color="subtle">
            タイトル：
          </Text>
          <Text variant="label.small">{item.source.title}</Text>
        </div>
        <Tag size="small" variant="outline">
          {item.source.language}
        </Tag>
      </div>
      <div className={styles.resultMeta}>
        <div className={styles.metaItem}>
          <Text variant="label.small" color="subtle">
            作成日：
          </Text>
          <Text variant="label.small">{item.createdAt}</Text>
        </div>
        <div className={styles.metaItem}>
          <Text variant="label.small" color="subtle">
            作成者：
          </Text>
          <Text variant="label.small">{item.createdBy}</Text>
        </div>
      </div>
      {item.relatedCount > 0 && (
        <div>
          <Button variant="subtle" size="small">
            同じ条文を含む契約書（{item.relatedCount}件）
          </Button>
        </div>
      )}
    </div>
  );
}

function CaseCard({ item }: { item: CaseResult }) {
  return (
    <div className={styles.resultCard}>
      <Link to={item.href}>
        <Text variant="body.medium.bold" color="information">
          {item.title}
        </Text>
      </Link>
      <div className={styles.resultMeta}>
        <div className={styles.metaItem}>
          <Text variant="label.small" color="subtle">
            案件タイプ：
          </Text>
          <Text variant="label.small">{item.caseType}</Text>
        </div>
        <div className={styles.metaItem}>
          <Text variant="label.small" color="subtle">
            案件番号：
          </Text>
          <Text variant="label.small">{item.caseNumber}</Text>
        </div>
        <Tag size="small" variant="outline">
          {item.status}
        </Tag>
      </div>
      <div className={styles.resultMeta}>
        <div className={styles.metaItem}>
          <Text variant="label.small" color="subtle">
            作成日：
          </Text>
          <Text variant="label.small">{item.createdAt}</Text>
        </div>
        {item.assignee && (
          <div className={styles.metaItem}>
            <Text variant="label.small" color="subtle">
              担当者：
            </Text>
            <Text variant="label.small">{item.assignee}</Text>
          </div>
        )}
        {item.requester && (
          <div className={styles.metaItem}>
            <Text variant="label.small" color="subtle">
              依頼者：
            </Text>
            <Text variant="label.small">{item.requester}</Text>
          </div>
        )}
      </div>
      <Text variant="body.small" color="subtle">
        {item.snippet}
      </Text>
    </div>
  );
}

function ContractCard({ item }: { item: ContractResult }) {
  return (
    <div className={styles.resultCard}>
      <div className={styles.resultMeta}>
        <Link to={item.href}>
          <Text variant="body.medium.bold" color="information">
            {item.fileName}
          </Text>
        </Link>
        {item.title && (
          <div className={styles.metaItem}>
            <Text variant="label.small" color="subtle">
              タイトル：
            </Text>
            <Text variant="label.small">{item.title}</Text>
          </div>
        )}
        <Tag size="small" variant="outline">
          {item.language}
        </Tag>
        {item.isAgreed && (
          <Tag size="small" variant="outline">
            締結版
          </Tag>
        )}
      </div>
      <div className={styles.resultMeta}>
        <div className={styles.metaItem}>
          <Text variant="label.small" color="subtle">
            作成日：
          </Text>
          <Text variant="label.small">{item.createdAt}</Text>
        </div>
        <div className={styles.metaItem}>
          <Text variant="label.small" color="subtle">
            作成者：
          </Text>
          <Text variant="label.small">{item.createdBy}</Text>
        </div>
        {item.companyName && (
          <div className={styles.metaItem}>
            <Text variant="label.small" color="subtle">
              自社名：
            </Text>
            <Text variant="label.small">{item.companyName}</Text>
          </div>
        )}
        {item.counterPartyName && (
          <div className={styles.metaItem}>
            <Text variant="label.small" color="subtle">
              取引先名：
            </Text>
            <Text variant="label.small">{item.counterPartyName}</Text>
          </div>
        )}
      </div>
      <Text variant="body.small" color="subtle">
        {item.snippet}
      </Text>
    </div>
  );
}

function TemplateCard({ item }: { item: TemplateResult }) {
  return (
    <div className={styles.resultCard}>
      <div>
        <Link to={item.href}>
          <Text variant="body.medium.bold" color="information">
            {item.title}
          </Text>
        </Link>
        {item.subtitle && (
          <Text variant="body.small" color="subtle">
            {" "}
            {item.subtitle}
          </Text>
        )}
      </div>
      <div className={styles.resultMeta}>
        <div className={styles.metaItem}>
          <Text variant="label.small" color="subtle">
            カテゴリー：
          </Text>
          <Text variant="label.small">{item.categories.join(" / ")}</Text>
        </div>
        <Tag size="small" variant="outline">
          {item.language}
        </Tag>
      </div>
      <div className={styles.metaItem}>
        <Text variant="label.small" color="subtle">
          作成者：
        </Text>
        <Text variant="label.small">{item.createdBy}</Text>
      </div>
      <Text variant="body.small" color="subtle">
        {item.snippet}
      </Text>
    </div>
  );
}

function OtherFileCard({ item }: { item: OtherFileResult }) {
  return (
    <div className={styles.resultCard}>
      <Link to={item.href}>
        <Text variant="body.medium.bold" color="information">
          {item.fileName}
        </Text>
      </Link>
      <div className={styles.resultMeta}>
        <div className={styles.metaItem}>
          <Text variant="label.small" color="subtle">
            作成日：
          </Text>
          <Text variant="label.small">{item.createdAt}</Text>
        </div>
        <div className={styles.metaItem}>
          <Text variant="label.small" color="subtle">
            作成者：
          </Text>
          <Text variant="label.small">{item.createdBy}</Text>
        </div>
      </div>
    </div>
  );
}

function CategorySection({ summary, children }: { summary: CategorySummary; children: React.ReactNode }) {
  return (
    <section>
      <div className={styles.sectionHeader}>
        <Text variant="label.medium.bold">{summary.label}</Text>
        <Text variant="label.small" color="subtle">
          {summary.count.toLocaleString()}件
        </Text>
        <Button
          variant="plain"
          size="small"
          trailing={
            <Icon>
              <LfAngleRight />
            </Icon>
          }
        >
          もっと見る
        </Button>
      </div>
      <div className={styles.resultCards}>{children}</div>
    </section>
  );
}

export default function SearchTemplate() {
  const [searchValue, setSearchValue] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  // Per-tab filter states (independent, retained across tab switches)
  const [articleFilter, setArticleFilter] = useState(ARTICLE_FILTER_DEFAULT);
  const [caseFilter, setCaseFilter] = useState(CASE_FILTER_DEFAULT);
  const [contractFilter, setContractFilter] = useState(CONTRACT_FILTER_DEFAULT);
  const [agreedFilter, setAgreedFilter] = useState(CONTRACT_FILTER_DEFAULT);
  const [customerTemplateFilter, setCustomerTemplateFilter] = useState(CUSTOMER_TEMPLATE_FILTER_DEFAULT);
  const [legalonTemplateFilter, setLegalonTemplateFilter] = useState(LEGALON_TEMPLATE_FILTER_DEFAULT);
  const [otherFileFilter, setOtherFileFilter] = useState(OTHER_FILE_FILTER_DEFAULT);

  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };

  return (
    <LocSidebarLayout activeId="search">
      <PageLayout>
        <PageLayoutContent>
          <PageLayoutBody>
            {/* Search header */}
            <div className={styles.searchHeader}>
              <div className={styles.searchInput}>
                <TextField
                  type="search"
                  leading={LfMagnifyingGlass}
                  placeholder="キーワードで検索"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  aria-label="キーワードで検索"
                />
              </div>
              <Button variant="subtle" size="medium" leading={LfInformationCircle}>
                詳細な検索方法
              </Button>
            </div>

            {/* Tabs */}
            <Tab.Group index={tabIndex} onChange={handleTabChange}>
              <Tab.List>
                {TAB_LABELS.map((label) => (
                  <Tab key={label}>
                    <Text whiteSpace="nowrap">{label}</Text>
                  </Tab>
                ))}
              </Tab.List>

              {/* Summary bar */}
              <div className={styles.tabToolbar}>
                <div className={styles.tabSummary}>
                  <Text variant="label.medium.bold">{TAB_LABELS[tabIndex]}</Text>
                  <Text variant="label.small" color="subtle">
                    {tabIndex === 0
                      ? `${totalCount.toLocaleString()}件`
                      : `${categorySummaries[tabIndex - 1]?.count.toLocaleString() ?? 0}件`}
                  </Text>
                </div>
              </div>

              <Tab.Panels>
                {/* "すべて" tab */}
                <Tab.Panel>
                  <div className={styles.resultSections}>
                    <CategorySection summary={categorySummaries[0]}>
                      {articleResults.map((item) => (
                        <ArticleCard key={item.id} item={item} />
                      ))}
                    </CategorySection>

                    <CategorySection summary={categorySummaries[1]}>
                      {caseResults.map((item) => (
                        <CaseCard key={item.id} item={item} />
                      ))}
                    </CategorySection>

                    <CategorySection summary={categorySummaries[2]}>
                      {contractResults.map((item) => (
                        <ContractCard key={item.id} item={item} />
                      ))}
                    </CategorySection>

                    <CategorySection summary={categorySummaries[3]}>
                      {agreedResults.map((item) => (
                        <ContractCard key={item.id} item={item} />
                      ))}
                    </CategorySection>

                    <CategorySection summary={categorySummaries[4]}>
                      {customerTemplateResults.map((item) => (
                        <ContractCard key={item.id} item={item} />
                      ))}
                    </CategorySection>

                    <CategorySection summary={categorySummaries[5]}>
                      {legalonTemplateResults.map((item) => (
                        <TemplateCard key={item.id} item={item} />
                      ))}
                    </CategorySection>

                    <CategorySection summary={categorySummaries[6]}>
                      {otherFileResults.map((item) => (
                        <OtherFileCard key={item.id} item={item} />
                      ))}
                    </CategorySection>
                  </div>
                </Tab.Panel>

                {/* 条文 tab */}
                <Tab.Panel>
                  <div className={styles.splitLayout}>
                    <ArticleFilter value={articleFilter} onChange={setArticleFilter} />
                    <div className={styles.resultCards}>
                      {articleResults.map((item) => (
                        <ArticleCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                </Tab.Panel>

                {/* 案件 tab */}
                <Tab.Panel>
                  <div className={styles.splitLayout}>
                    <CaseFilter value={caseFilter} onChange={setCaseFilter} />
                    <div className={styles.resultCards}>
                      {caseResults.map((item) => (
                        <CaseCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                </Tab.Panel>

                {/* 契約書 tab */}
                <Tab.Panel>
                  <div className={styles.splitLayout}>
                    <ContractFilter value={contractFilter} onChange={setContractFilter} showStatus />
                    <div className={styles.resultCards}>
                      {contractResults.map((item) => (
                        <ContractCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                </Tab.Panel>

                {/* 締結版契約書 tab */}
                <Tab.Panel>
                  <div className={styles.splitLayout}>
                    <ContractFilter value={agreedFilter} onChange={setAgreedFilter} />
                    <div className={styles.resultCards}>
                      {agreedResults.map((item) => (
                        <ContractCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                </Tab.Panel>

                {/* 自社ひな形 tab */}
                <Tab.Panel>
                  <div className={styles.splitLayout}>
                    <CustomerTemplateFilter value={customerTemplateFilter} onChange={setCustomerTemplateFilter} />
                    <div className={styles.resultCards}>
                      {customerTemplateResults.map((item) => (
                        <ContractCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                </Tab.Panel>

                {/* LegalOnテンプレート tab */}
                <Tab.Panel>
                  <div className={styles.splitLayout}>
                    <LegalonTemplateFilter value={legalonTemplateFilter} onChange={setLegalonTemplateFilter} />
                    <div className={styles.resultCards}>
                      {legalonTemplateResults.map((item) => (
                        <TemplateCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                </Tab.Panel>

                {/* その他ファイル tab */}
                <Tab.Panel>
                  <div className={styles.splitLayout}>
                    <OtherFileFilter value={otherFileFilter} onChange={setOtherFileFilter} />
                    <div className={styles.resultCards}>
                      {otherFileResults.map((item) => (
                        <OtherFileCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
}
