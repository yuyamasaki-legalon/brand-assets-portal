import {
  LfAngleDownSmall,
  LfAngleLeftLarge,
  LfAngleRightMiddle,
  LfArchive,
  LfArrowRightArrowLeft,
  LfArrowUpArrowDown,
  LfArrowUpRightFromSquare,
  LfCloseLarge,
  LfComment,
  LfComparison,
  LfCopy,
  LfDownload,
  LfEarth,
  LfEllipsisDot,
  LfFile,
  LfFileArrowsRotate,
  LfFileClip,
  LfFiles,
  LfFilter,
  LfInformationCircle,
  LfLink,
  LfMagnifyingGlass,
  LfMenu,
  LfPen,
  LfPlusLarge,
  LfPlusSmall,
  LfQuestionCircle,
  LfReplyAlt,
  LfSticky,
  LfTimeline,
  LfTrash,
  LfUserPlus,
  LfWriting,
} from "@legalforce/aegis-icons";
import {
  ActionList,
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  ContentHeader,
  ContentHeaderTitle,
  Divider,
  EmptyState,
  Header,
  Icon,
  IconButton,
  InformationCard,
  InformationCardDescription,
  InformationCardGroup,
  InformationCardLink,
  Link,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  PageLayoutSidebar,
  Popover,
  SideNavigation,
  StatusLabel,
  Tab,
  Tag,
  TagGroup,
  Text,
  Timeline,
  TimelineContent,
  TimelineItem,
  TimelinePoint,
  Tooltip,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { StatusLabelInfo } from "../mock";
import {
  contractDocumentStatusLabelStyleMap,
  mockDetailAttributes,
  mockDetailCases,
  mockDetailInternalComments,
  mockDetailRelatedFiles,
  mockDetailSimilarContracts,
  mockDetailSpecialNotices,
  mockDetailVersions,
  mockFileDetail,
} from "../mock";

// =============================================================================
// Types
// =============================================================================

type PaneType =
  | "attributes"
  | "relatedFiles"
  | "specialNotices"
  | "internalComments"
  | "cases"
  | "versions"
  | "similarContracts";

// =============================================================================
// Status Label Display Component
// =============================================================================

/**
 * ファイル種別・ステータスに適したStatusLabelを返却する。
 * ソース: Header/LeftContent/StatusLabelDisplay
 */
const StatusLabelDisplay = ({ statusLabel }: { statusLabel: Exclude<StatusLabelInfo, "none"> }) => {
  switch (statusLabel.displayType) {
    // 自社ひな形、その他ファイル
    case "defaultStatusLabel": {
      return (
        <StatusLabel size="small" variant="outline" color="neutral">
          {statusLabel.text}
        </StatusLabel>
      );
    }
    // 契約書ファイル
    case "contractDocumentStatusLabel": {
      const style = contractDocumentStatusLabelStyleMap[statusLabel.documentStatusId];
      // 契約書ステータスが「なし」（マップに未定義）の場合
      if (style === undefined) {
        return <Text variant="body.small">{statusLabel.text}</Text>;
      }
      return (
        <StatusLabel size="small" variant={style.variant} color={style.color}>
          {statusLabel.text}
        </StatusLabel>
      );
    }
  }
};

// =============================================================================
// Property Item Component
// =============================================================================

const PropertyItem = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}>
    <Text variant="title.xxSmall">{label}</Text>
    {children}
  </div>
);

// =============================================================================
// Pane Header Component
// =============================================================================

const PaneHeader = ({ title, onClose }: { title: string; onClose: () => void }) => (
  <PageLayoutHeader>
    <ContentHeader
      size="medium"
      trailing={
        <Tooltip title="閉じる">
          <IconButton icon={LfCloseLarge} variant="plain" size="small" aria-label="閉じる" onClick={onClose} />
        </Tooltip>
      }
    >
      <ContentHeaderTitle>{title}</ContentHeaderTitle>
    </ContentHeader>
  </PageLayoutHeader>
);

// =============================================================================
// Pane Content Components
// =============================================================================

const SectionHeader = ({ title }: { title: string }) => (
  <ContentHeader
    size="small"
    trailing={
      <Button variant="plain" size="small" leading={LfPen}>
        編集
      </Button>
    }
  >
    <ContentHeaderTitle>{title}</ContentHeaderTitle>
  </ContentHeader>
);

const sectionBodyStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--aegis-space-medium)",
  padding: "var(--aegis-space-medium) 0",
};

const AttributesPane = ({ onClose }: { onClose: () => void }) => (
  <>
    <PaneHeader title="契約書情報" onClose={onClose} />
    <PageLayoutBody>
      <Tab.Group>
        <Tab.List>
          <Tab>基本情報</Tab>
          <Tab>管理情報</Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            {/* セクション1: 契約書概要 */}
            <section>
              <SectionHeader title="契約書概要" />
              <dl style={sectionBodyStyle}>
                <PropertyItem label="取引先名">
                  <TagGroup>
                    {mockDetailAttributes.basic.counterPartyNames.map((name) => (
                      <Tag key={name} color="neutral" variant="fill">
                        {name}
                      </Tag>
                    ))}
                  </TagGroup>
                </PropertyItem>
                <PropertyItem label="自社名">
                  <TagGroup>
                    {mockDetailAttributes.basic.ownPartyNames.map((name) => (
                      <Tag key={name} color="neutral" variant="fill">
                        {name}
                      </Tag>
                    ))}
                  </TagGroup>
                </PropertyItem>
                <PropertyItem label="契約書タイトル">
                  <Text>{mockDetailAttributes.basic.title}</Text>
                </PropertyItem>
                <PropertyItem label="準拠法・契約類型・立場">
                  <Text>{mockDetailAttributes.basic.contractKind}</Text>
                </PropertyItem>
              </dl>
            </section>
            <Divider />
            {/* セクション2: ステータス */}
            <section>
              <SectionHeader title="ステータス" />
              <div style={{ padding: "var(--aegis-space-medium) 0" }}>
                <Text>{mockDetailAttributes.basic.documentStatus}</Text>
              </div>
            </section>
            <Divider />
            {/* セクション3: 期間 */}
            <section>
              <SectionHeader title="期間" />
              <dl style={sectionBodyStyle}>
                <PropertyItem label="契約開始日">
                  <Text>{mockDetailAttributes.basic.startDate}</Text>
                </PropertyItem>
                <PropertyItem label="契約終了日">
                  <Text>{mockDetailAttributes.basic.endDate}</Text>
                </PropertyItem>
                <PropertyItem label="自動更新">
                  <Text>{mockDetailAttributes.basic.autoRenewal}</Text>
                </PropertyItem>
              </dl>
            </section>
            <Divider />
            {/* セクション4: 言語 */}
            <section>
              <SectionHeader title="言語" />
              <div style={{ padding: "var(--aegis-space-medium) 0" }}>
                <Text>{mockDetailAttributes.basic.language}</Text>
              </div>
            </section>
          </Tab.Panel>
          <Tab.Panel>
            {/* セクション1: 保存先 */}
            <section>
              <SectionHeader title="保存先" />
              <div style={{ padding: "var(--aegis-space-medium) 0" }}>
                <Text>{mockDetailAttributes.management.space}</Text>
              </div>
            </section>
            <Divider />
            {/* セクション2: 基本項目 */}
            <section>
              <SectionHeader title="基本項目" />
              <dl style={sectionBodyStyle}>
                <PropertyItem label="契約担当者">
                  <Text>{mockDetailAttributes.management.contractAssignee}</Text>
                </PropertyItem>
                <PropertyItem label="管理番号">
                  <Text>{mockDetailAttributes.management.inhouseId}</Text>
                </PropertyItem>
                <PropertyItem label="伝票番号">
                  <Text>
                    {mockDetailAttributes.management.voucherIds.length > 0
                      ? mockDetailAttributes.management.voucherIds.join(", ")
                      : "未入力"}
                  </Text>
                </PropertyItem>
              </dl>
            </section>
            <Divider />
            {/* セクション3: 契約カスタム項目 */}
            <section>
              <SectionHeader title="契約カスタム項目" />
              <dl style={sectionBodyStyle}>
                {mockDetailAttributes.management.customFields.map((field) => (
                  <PropertyItem key={field.label} label={field.label}>
                    <Text>{field.value}</Text>
                  </PropertyItem>
                ))}
              </dl>
            </section>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </PageLayoutBody>
  </>
);

const RelatedFilesPane = ({ onClose }: { onClose: () => void }) => (
  <>
    <PaneHeader title="関連ファイル" onClose={onClose} />
    <PageLayoutBody>
      <Tab.Group>
        <Tab.List>
          <Tab trailing={<Badge count={mockDetailRelatedFiles.contracts.length} color="subtle" />}>関連契約書</Tab>
          <Tab trailing={<Badge count={mockDetailRelatedFiles.attachedFiles.length} color="subtle" />}>付随文書</Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <InformationCardGroup>
              {mockDetailRelatedFiles.contracts.map((file) => (
                <ButtonGroup key={file.id} attached variant="subtle">
                  <InformationCard
                    leading={
                      <Icon>
                        <LfFile />
                      </Icon>
                    }
                  >
                    <InformationCardLink href="#">{file.fileName}</InformationCardLink>
                    <InformationCardDescription>
                      <StatusLabel variant="outline">{file.status}</StatusLabel>
                    </InformationCardDescription>
                    <InformationCardDescription>{file.dates}</InformationCardDescription>
                  </InformationCard>
                </ButtonGroup>
              ))}
            </InformationCardGroup>
            <Divider />
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
              <Text variant="title.xxSmall">バージョンの候補</Text>
              <ButtonGroup attached variant="subtle">
                <InformationCard
                  leading={
                    <Icon>
                      <LfFile />
                    </Icon>
                  }
                >
                  <InformationCardLink href="#">秘密保持契約書_候補A.docx</InformationCardLink>
                  <InformationCardDescription>株式会社●●</InformationCardDescription>
                </InformationCard>
                <Tooltip title="追加" placement="top">
                  <IconButton icon={LfPlusSmall} aria-label="追加" />
                </Tooltip>
              </ButtonGroup>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <InformationCardGroup>
              {mockDetailRelatedFiles.attachedFiles.map((file) => (
                <ButtonGroup key={file.id} attached variant="subtle">
                  <InformationCard
                    leading={
                      <Icon>
                        <LfFile />
                      </Icon>
                    }
                  >
                    <InformationCardLink href="#">{file.fileName}</InformationCardLink>
                    <InformationCardDescription>
                      {file.createUserName} | {file.createDateTime}
                    </InformationCardDescription>
                  </InformationCard>
                </ButtonGroup>
              ))}
            </InformationCardGroup>
            <Divider />
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
              <Text variant="title.xxSmall">バージョンの候補</Text>
              <ButtonGroup attached variant="subtle">
                <InformationCard
                  leading={
                    <Icon>
                      <LfFile />
                    </Icon>
                  }
                >
                  <InformationCardLink href="#">添付資料_候補.xlsx</InformationCardLink>
                  <InformationCardDescription>田中花子</InformationCardDescription>
                </InformationCard>
                <Tooltip title="追加" placement="top">
                  <IconButton icon={LfPlusSmall} aria-label="追加" />
                </Tooltip>
              </ButtonGroup>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </PageLayoutBody>
  </>
);

const SpecialNoticesPane = ({ onClose }: { onClose: () => void }) => (
  <>
    <PaneHeader title="特記事項" onClose={onClose} />
    <PageLayoutBody>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link
            href="#"
            leading={LfQuestionCircle}
            trailing={LfArrowUpRightFromSquare}
            target="_blank"
            rel="noopener noreferrer"
          >
            リスクフラグについて
          </Link>
          <Button leading={LfPlusLarge}>追加</Button>
        </div>
        {mockDetailSpecialNotices.map((notice) => (
          <article
            key={notice.id}
            style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}
          >
            <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}>
                <Text variant="body.medium.bold" numberOfLines={1}>
                  {notice.author}
                </Text>
                <Text variant="data.medium" color="subtle">
                  {notice.updatedAt}
                </Text>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <Menu placement="bottom-end">
                  <Menu.Anchor>
                    <Tooltip title="メニュー">
                      <IconButton icon={LfEllipsisDot} aria-label="メニュー" size="xSmall" variant="plain" />
                    </Tooltip>
                  </Menu.Anchor>
                  <Menu.Box>
                    <ActionList>
                      <ActionList.Item>
                        <ActionList.Body leading={LfPen}>編集</ActionList.Body>
                      </ActionList.Item>
                      <ActionList.Item color="danger">
                        <ActionList.Body leading={LfTrash}>削除</ActionList.Body>
                      </ActionList.Item>
                    </ActionList>
                  </Menu.Box>
                </Menu>
              </div>
            </div>
            <Text as="p" variant="component.medium" numberOfLines={4} style={{ overflowWrap: "anywhere" }}>
              {notice.content}
            </Text>
            <footer style={{ marginLeft: "auto" }}>
              <Button variant="gutterless">詳細を表示</Button>
            </footer>
          </article>
        ))}
      </div>
    </PageLayoutBody>
  </>
);

const InternalCommentsPane = ({ onClose }: { onClose: () => void }) => (
  <>
    <PaneHeader title="社内コメント" onClose={onClose} />
    <PageLayoutBody>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
        <Button leading={LfPlusLarge} variant="subtle" width="full">
          コメントを追加
        </Button>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="plain" leading={<Icon source={LfFilter} />}>
            フィルター
          </Button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
          {mockDetailInternalComments.map((comment) => (
            <div
              key={comment.id}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-xSmall)",
                padding:
                  "var(--aegis-space-xSmall) var(--aegis-space-xSmall) var(--aegis-space-xSmall) var(--aegis-space-medium)",
                borderLeft: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-input)",
              }}
            >
              <div style={{ display: "flex", gap: "var(--aegis-space-small)" }}>
                <Avatar size="xSmall" name={comment.author} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                      <Text variant="body.small.bold" numberOfLines={1}>
                        {comment.author}
                      </Text>
                      <Text variant="data.small" color="subtle">
                        {comment.createdAt}
                      </Text>
                    </div>
                    <Menu placement="bottom-end">
                      <Menu.Anchor>
                        <Tooltip title="メニューを開く">
                          <IconButton icon={LfEllipsisDot} aria-label="メニューを開く" size="xSmall" variant="plain" />
                        </Tooltip>
                      </Menu.Anchor>
                      <Menu.Box>
                        <ActionList>
                          <ActionList.Item>
                            <ActionList.Body leading={LfPen}>編集</ActionList.Body>
                          </ActionList.Item>
                          <ActionList.Item color="danger">
                            <ActionList.Body leading={LfTrash}>削除</ActionList.Body>
                          </ActionList.Item>
                        </ActionList>
                      </Menu.Box>
                    </Menu>
                  </div>
                  <Text whiteSpace="pre-wrap">{comment.content}</Text>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="subtle" size="small" leading={LfReplyAlt}>
                  返信
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayoutBody>
  </>
);

const CasesPane = ({ onClose }: { onClose: () => void }) => (
  <>
    <PaneHeader title="案件" onClose={onClose} />
    <PageLayoutBody>
      <Text variant="title.xxSmall">リンク済みの案件（{mockDetailCases.length}件）</Text>
      <InformationCardGroup>
        {mockDetailCases.map((caseItem) => (
          <InformationCard
            key={caseItem.id}
            leading={
              <Icon>
                <LfArchive />
              </Icon>
            }
          >
            <InformationCardLink href="#">{caseItem.name}</InformationCardLink>
          </InformationCard>
        ))}
      </InformationCardGroup>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button leading={LfPlusLarge} variant="subtle">
          案件を作成
        </Button>
      </div>
    </PageLayoutBody>
  </>
);

const VersionsPane = ({ onClose }: { onClose: () => void }) => (
  <>
    <PaneHeader title="バージョン" onClose={onClose} />
    <PageLayoutBody>
      <Button leading={LfPlusLarge} variant="subtle" size="medium" width="full">
        アップロード
      </Button>

      <ContentHeader
        size="small"
        trailing={
          <ButtonGroup>
            <Button
              leading={
                <Icon>
                  <LfWriting />
                </Icon>
              }
              variant="plain"
              size="small"
            >
              署名依頼
            </Button>
            <Button leading={LfArrowUpArrowDown} variant="plain" size="small">
              並べ替え
            </Button>
          </ButtonGroup>
        }
      />

      <Timeline>
        {mockDetailVersions.map((version, index) => (
          <TimelineItem key={version.version}>
            <TimelinePoint>
              <Tag>{version.version}</Tag>
            </TimelinePoint>
            <TimelineContent>
              <article
                style={{
                  display: "flex",
                  flexDirection: "column",
                  wordBreak: "break-all",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text variant="data.small" color="subtle">
                    {version.date}
                  </Text>
                  <Tooltip title="メニュー" placement="top">
                    <IconButton
                      icon={LfEllipsisDot}
                      aria-label="メニュー"
                      size="xSmall"
                      variant="plain"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Tooltip>
                </div>
                <Text as="h4" variant="data.medium" style={{ marginTop: "var(--aegis-space-xSmall)" }}>
                  {version.fileName}
                </Text>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "var(--aegis-space-xSmall)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                    <StatusLabel variant="outline">{version.status}</StatusLabel>
                    {version.language && (
                      <Tag variant="outline" leading={LfEarth}>
                        {version.language}
                      </Tag>
                    )}
                  </div>
                  {index === 0 && (
                    <Button variant="subtle" size="small">
                      比較
                    </Button>
                  )}
                </div>
              </article>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
        <Text variant="title.xxSmall">バージョンの候補</Text>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
          <Button variant="subtle" width="full" leading={<Badge color="subtle" />}>
            検索
          </Button>
          <InformationCardGroup>
            <Popover trigger="hover" placement="left-start" closeButton={false} arrow>
              <Popover.Anchor>
                <div>
                  <ButtonGroup attached variant="subtle">
                    <InformationCard
                      leading={
                        <Icon>
                          <LfFile />
                        </Icon>
                      }
                    >
                      <InformationCardLink href="#">秘密保持契約</InformationCardLink>
                      <InformationCardDescription>株式会社●●</InformationCardDescription>
                    </InformationCard>
                    <Tooltip title="バージョンを統合" placement="top">
                      <IconButton icon={LfPlusSmall} aria-label="バージョンを統合" />
                    </Tooltip>
                  </ButtonGroup>
                </div>
              </Popover.Anchor>
              <Popover.Content>
                <Popover.Body>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-medium)",
                      minWidth: "var(--aegis-layout-width-x6Small)",
                    }}
                  >
                    <Text variant="body.medium.bold">秘密保持契約</Text>
                    <dl
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--aegis-space-medium)",
                        margin: 0,
                      }}
                    >
                      <div>
                        <Text variant="label.small.bold">保存先</Text>
                        <Text>案件受付スペース</Text>
                      </div>
                      <div>
                        <Text variant="label.small.bold">ステータス</Text>
                        <Text>なし</Text>
                      </div>
                      <div>
                        <Text variant="label.small.bold">作成者</Text>
                        <Text>System User</Text>
                      </div>
                      <div>
                        <Text variant="label.small.bold">作成日時</Text>
                        <Text>2026/02/24 18:22</Text>
                      </div>
                      <div>
                        <Text variant="label.small.bold">自社名</Text>
                        <TagGroup>
                          <Tag>株式会社LegalOn Technologies</Tag>
                        </TagGroup>
                      </div>
                      <div>
                        <Text variant="label.small.bold">取引先名</Text>
                        <TagGroup>
                          <Tag>株式会社●●</Tag>
                        </TagGroup>
                      </div>
                    </dl>
                  </div>
                </Popover.Body>
              </Popover.Content>
            </Popover>
          </InformationCardGroup>
        </div>
      </div>
    </PageLayoutBody>
  </>
);

/**
 * 類似契約書ペイン
 * ソース: SimilarContracts/index.tsx → AttachedContracts + RecommendedContracts の2セクション構成
 * RecommendedContractsOld（旧検索フォームUI）は削除済み
 */
const SimilarContractsPane = ({ onClose }: { onClose: () => void }) => (
  <>
    <PaneHeader title="類似契約書" onClose={onClose} />
    <PageLayoutBody>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
        {/* セクション1: 参考にした類似契約書（AttachedContracts） */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
          <Text variant="title.xxSmall">参考にした契約書</Text>
          {mockDetailSimilarContracts.referenced.length === 0 ? (
            <EmptyState size="small">参考にした契約書がありません</EmptyState>
          ) : (
            <InformationCardGroup>
              {mockDetailSimilarContracts.referenced.map((contract) => (
                <InformationCard key={contract.id}>
                  <InformationCard.Body>
                    <InformationCard.Title>{contract.title}</InformationCard.Title>
                    <InformationCard.Description>
                      <Text numberOfLines={1}>{contract.counterPartyNames.join("  ")}</Text>
                    </InformationCard.Description>
                  </InformationCard.Body>
                </InformationCard>
              ))}
            </InformationCardGroup>
          )}
        </div>

        {/* セクション2: 類似契約書の候補（RecommendedContracts） */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
          <Text variant="title.xxSmall">類似契約書の候補</Text>
          <Tab.Group size="large">
            <Tab.List>
              <Tab>契約書</Tab>
              <Tab>自社ひな形</Tab>
              <Tab>LegalOnテンプレート</Tab>
            </Tab.List>
            <Tab.Panels>
              {/* 契約書タブ */}
              <Tab.Panel>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
                  <InformationCardGroup>
                    {mockDetailSimilarContracts.candidates.contracts.map((contract) => (
                      <Popover key={contract.id} trigger="hover" placement="left-start" closeButton={false} arrow>
                        <Popover.Anchor>
                          <div>
                            <ButtonGroup attached variant="subtle">
                              <InformationCard clickable>
                                <InformationCard.Body>
                                  <InformationCard.Title>{contract.title}</InformationCard.Title>
                                  <InformationCard.Description>
                                    <Text whiteSpace="pre-wrap" numberOfLines={1}>
                                      {contract.counterPartyNames.join("  ")}
                                    </Text>
                                  </InformationCard.Description>
                                  <InformationCard.Description>
                                    <Text numberOfLines={1}>{contract.categoryPosition}</Text>
                                  </InformationCard.Description>
                                  {contract.exactMatch && (
                                    <InformationCard.Description>
                                      <Tag color="blue" size="small" variant="fill" weight="bold">
                                        ほぼ一致
                                      </Tag>
                                    </InformationCard.Description>
                                  )}
                                  <ButtonGroup>
                                    <Button leading={LfComparison}>比較</Button>
                                    <Button leading={LfLink}>参考にする</Button>
                                  </ButtonGroup>
                                </InformationCard.Body>
                                <Icon source={LfAngleRightMiddle} />
                              </InformationCard>
                            </ButtonGroup>
                          </div>
                        </Popover.Anchor>
                        <Popover.Content>
                          <Popover.Body>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--aegis-space-medium)",
                                minWidth: "var(--aegis-layout-width-x6Small)",
                              }}
                            >
                              <Text variant="body.medium.bold">{contract.title}</Text>
                              <dl
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "var(--aegis-space-medium)",
                                  margin: 0,
                                }}
                              >
                                {contract.spaceName && (
                                  <div>
                                    <Text variant="label.small.bold">保存先</Text>
                                    <Text>{contract.spaceName}</Text>
                                  </div>
                                )}
                                <div>
                                  <Text variant="label.small.bold">取引先名</Text>
                                  <TagGroup>
                                    {contract.counterPartyNames.map((name) => (
                                      <Tag key={name}>{name}</Tag>
                                    ))}
                                  </TagGroup>
                                </div>
                                {contract.createTime && (
                                  <div>
                                    <Text variant="label.small.bold">作成日時</Text>
                                    <Text>
                                      {new Date(contract.createTime).toLocaleString("ja-JP", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        timeZone: "Asia/Tokyo",
                                      })}
                                    </Text>
                                  </div>
                                )}
                              </dl>
                            </div>
                          </Popover.Body>
                        </Popover.Content>
                      </Popover>
                    ))}
                  </InformationCardGroup>
                </div>
              </Tab.Panel>

              {/* 自社ひな形タブ */}
              <Tab.Panel>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
                  <InformationCardGroup>
                    {mockDetailSimilarContracts.candidates.templates.map((template) => (
                      <ButtonGroup key={template.id} attached variant="subtle">
                        <InformationCard clickable>
                          <InformationCard.Body>
                            <InformationCard.Title>{template.title}</InformationCard.Title>
                            <InformationCard.Description>{template.documentStatus}</InformationCard.Description>
                          </InformationCard.Body>
                          <Icon source={LfAngleRightMiddle} />
                        </InformationCard>
                      </ButtonGroup>
                    ))}
                  </InformationCardGroup>
                </div>
              </Tab.Panel>

              {/* LegalOnテンプレートタブ */}
              <Tab.Panel>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
                  <InformationCardGroup>
                    {mockDetailSimilarContracts.candidates.legalonTemplates.map((template) => (
                      <ButtonGroup key={template.id} attached variant="subtle">
                        <InformationCard clickable>
                          <InformationCard.Body>
                            <InformationCard.Title>{template.title}</InformationCard.Title>
                            <InformationCard.Description>
                              <Text numberOfLines={1}>{template.fileName}</Text>
                            </InformationCard.Description>
                          </InformationCard.Body>
                          <Icon source={LfAngleRightMiddle} />
                        </InformationCard>
                      </ButtonGroup>
                    ))}
                  </InformationCardGroup>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </PageLayoutBody>
  </>
);

// =============================================================================
// Pane Components Record
// =============================================================================

const paneComponents: Record<PaneType, (onClose: () => void) => React.ReactNode> = {
  attributes: (onClose) => <AttributesPane onClose={onClose} />,
  relatedFiles: (onClose) => <RelatedFilesPane onClose={onClose} />,
  specialNotices: (onClose) => <SpecialNoticesPane onClose={onClose} />,
  internalComments: (onClose) => <InternalCommentsPane onClose={onClose} />,
  cases: (onClose) => <CasesPane onClose={onClose} />,
  versions: (onClose) => <VersionsPane onClose={onClose} />,
  similarContracts: (onClose) => <SimilarContractsPane onClose={onClose} />,
};

// =============================================================================
// Component
// =============================================================================

const FileManagementDetail = () => {
  const navigate = useNavigate();
  const zoom = 100;
  const [paneType, setPaneType] = useState<PaneType>("attributes");
  const [paneOpen, setPaneOpen] = useState(true);

  const currentPane = paneOpen ? paneType : undefined;

  const handleSelectPane = (nextPane: PaneType) => {
    setPaneType(nextPane);
    setPaneOpen(true);
  };

  const handleClosePane = () => setPaneOpen(false);

  const { statusLabel, fileName, createUserName, createTime } = mockFileDetail;

  return (
    <>
      <Header>
        <Header.Item>
          <Tooltip title="開く">
            <IconButton icon={LfMenu} aria-label="開く" />
          </Tooltip>
          <Divider orientation="vertical" />
          <Tooltip title="戻る">
            <IconButton
              icon={LfAngleLeftLarge}
              aria-label="戻る"
              onClick={() => navigate("/template/file-management")}
              variant="plain"
            />
          </Tooltip>
          {/* LeftContent: ステータスラベル（色付き）+ ファイル名（上段）、作成者 + 作成日時（下段） */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-xxSmall)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
              {statusLabel !== "none" && (
                <div>
                  <StatusLabelDisplay statusLabel={statusLabel} />
                </div>
              )}
              <Tooltip onlyOnOverflow title={fileName}>
                <Text variant="title.xxSmall" numberOfLines={1}>
                  {fileName}
                </Text>
              </Tooltip>
            </div>
            <Text variant="body.xSmall" color="subtle">
              ファイル追加者：{createUserName}　ファイル追加日時：
              {new Date(createTime).toLocaleString("ja-JP", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Tokyo",
              })}
            </Text>
          </div>
        </Header.Item>

        <Header.Spacer />

        <Header.Item>
          <ButtonGroup>
            <Tooltip title="検索">
              <IconButton icon={LfMagnifyingGlass} aria-label="検索" />
            </Tooltip>
            <Tooltip title="比較">
              <IconButton icon={LfArrowRightArrowLeft} aria-label="比較" />
            </Tooltip>
            <Tooltip title="翻訳を表示">
              <IconButton icon={LfEarth} aria-label="翻訳を表示" />
            </Tooltip>
            <Tooltip title="ダウンロード">
              <IconButton icon={LfDownload} aria-label="ダウンロード" />
            </Tooltip>
            <Menu placement="bottom-end">
              <Menu.Anchor>
                <Tooltip title="その他">
                  <IconButton icon={LfEllipsisDot} aria-label="その他" />
                </Tooltip>
              </Menu.Anchor>
              <Menu.Box>
                <ActionList size="large">
                  <ActionList.Group>
                    <ActionList.Item>
                      <ActionList.Body leading={LfUserPlus}>共有</ActionList.Body>
                    </ActionList.Item>
                    <ActionList.Item>
                      <ActionList.Body leading={LfLink}>URLをコピー</ActionList.Body>
                    </ActionList.Item>
                    <ActionList.Item>
                      <ActionList.Body leading={LfCopy}>複製して契約書を作成</ActionList.Body>
                    </ActionList.Item>
                    <ActionList.Item>
                      <ActionList.Body leading={LfFileArrowsRotate}>ファイル種別を変更</ActionList.Body>
                    </ActionList.Item>
                  </ActionList.Group>
                  <ActionList.Group>
                    <ActionList.Item color="danger">
                      <ActionList.Body leading={LfTrash}>すべてのバージョンを削除</ActionList.Body>
                    </ActionList.Item>
                  </ActionList.Group>
                </ActionList>
              </Menu.Box>
            </Menu>
          </ButtonGroup>
        </Header.Item>
        <Header.Item>
          <ButtonGroup attached variant="solid" color="neutral">
            <Button variant="solid" color="neutral" leading={LfWriting}>
              レビュー
            </Button>
            <Menu placement="bottom-end">
              <Menu.Anchor>
                <Tooltip title="他のオプションを表示">
                  <IconButton
                    icon={LfAngleDownSmall}
                    aria-label="他のオプションを表示"
                    variant="solid"
                    color="neutral"
                  />
                </Tooltip>
              </Menu.Anchor>
              <Menu.Box>
                <ActionList>
                  <ActionList.Item>
                    <ActionList.Body leading={LfComparison}>比較レビュー</ActionList.Body>
                  </ActionList.Item>
                </ActionList>
              </Menu.Box>
            </Menu>
          </ButtonGroup>
        </Header.Item>
      </Header>

      <PageLayout>
        <PageLayoutContent maxWidth="medium">
          <PageLayoutBody>
            <Tab.Group variant="plain" height="full">
              <Tab.List>
                <Tab>プレビュー</Tab>
                <Tab>テキスト</Tab>
              </Tab.List>

              <Tab.Panels>
                <Tab.Panel>
                  <div
                    style={{
                      padding: "var(--aegis-space-medium)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "var(--aegis-space-medium)",
                      }}
                    >
                      <Text variant="body.small" color="subtle">
                        {zoom}%
                      </Text>
                    </div>

                    <div
                      style={{
                        backgroundColor: "white",
                        padding: "var(--aegis-space-xxLarge)",
                        maxHeight: "var(--aegis-layout-width-large)",
                        overflow: "auto",
                      }}
                    >
                      <div style={{ textAlign: "center", marginBottom: "var(--aegis-space-large)" }}>
                        <Text variant="title.large">秘密保持契約</Text>
                      </div>

                      <div style={{ marginBottom: "var(--aegis-space-large)" }}>
                        <Text>
                          株式会社●●（以下「甲」という。）と株式会社 Legal
                          <Text as="span" style={{ color: "var(--aegis-color-text-accent)" }}>
                            On Technologies
                          </Text>
                          <Text as="span" style={{ color: "var(--aegis-color-text-accent)" }}>
                            Force
                          </Text>
                          （以下「乙」という。）は、甲乙間において、次のとおり契約（以下「本契約」という。）を締結する。
                        </Text>
                      </div>

                      <div style={{ marginBottom: "var(--aegis-space-large)" }}>
                        <Text variant="title.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
                          第1条（目的）
                        </Text>
                        <Text>
                          甲および乙は、甲乙間の業務提携（以下「本件取引」という。）の可能性を検討することを目的（以下「本目的」という。）として、本契約を締結する（以下、情報を開示提供した当事者を「開示者」、情報の開示提供を受けた当事者を「受領者」という。）。
                        </Text>
                      </div>

                      <div style={{ marginBottom: "var(--aegis-space-large)" }}>
                        <Text variant="title.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
                          第2条（秘密情報の定義）
                        </Text>
                        <div style={{ marginBottom: "var(--aegis-space-small)" }}>
                          <Text>
                            1.
                            本契約において秘密情報とは、文書、口頭、電磁的記録媒体その他開示の方法および媒体を問わず、甲または乙が開示した技術情報、製品、営業、人事、財産、組織、ノウハウその他の事項に関する一切の情報で、本契約の存在および内容、ならびに本件取引に関する協議・交渉の存在および内容をいう。
                          </Text>
                        </div>
                        <div style={{ marginBottom: "var(--aegis-space-small)" }}>
                          <Text>
                            2.
                            前項の規定にかかわらず、次の各号に定める情報（個人情報を除く。）は秘密情報には含まれない。
                          </Text>
                        </div>
                        <div
                          style={{
                            marginLeft: "var(--aegis-space-large)",
                            marginBottom: "var(--aegis-space-xSmall)",
                          }}
                        >
                          <Text>(1) 開示者から開示を受ける前に、受領者が正当に保有していた情報</Text>
                        </div>
                        <div
                          style={{
                            marginLeft: "var(--aegis-space-large)",
                            marginBottom: "var(--aegis-space-xSmall)",
                          }}
                        >
                          <Text>(2) 開示者から開示を受ける前に、公知となっていた情報</Text>
                        </div>
                        <div
                          style={{
                            marginLeft: "var(--aegis-space-large)",
                            marginBottom: "var(--aegis-space-xSmall)",
                          }}
                        >
                          <Text>
                            (3) 開示者から開示を受けた後に、受領者の責に帰すべきなる事由によより公知となった情報
                          </Text>
                        </div>
                        <div
                          style={{
                            marginLeft: "var(--aegis-space-large)",
                            marginBottom: "var(--aegis-space-xSmall)",
                          }}
                        >
                          <Text>
                            (4) 受領者が、正当な権限を有する第三者から秘密保持義務を負うことなく適法に入手した情報
                          </Text>
                        </div>
                        <div style={{ marginLeft: "var(--aegis-space-large)" }}>
                          <Text>
                            (5) 受領者が、開示された秘密情報によらず独自に開発し、これを客観的に立証できた情報
                          </Text>
                        </div>
                      </div>

                      <div style={{ marginBottom: "var(--aegis-space-large)" }}>
                        <Text variant="title.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
                          第3条（秘密保持）
                        </Text>
                        <div style={{ marginBottom: "var(--aegis-space-small)" }}>
                          <Text>
                            1.
                            受領者は、秘密情報を機密として保持する義務を負うものとし、開示者の事前の書面または電子メールによる承諾なしに開示、秘密情報の取扱いは適切な保護措置を講じまたは対してまたは第三者に対して行ってはならない。
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

                <Tab.Panel>
                  <Text>テキストビュー</Text>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </PageLayoutBody>
        </PageLayoutContent>

        <PageLayoutPane position="end" open={paneOpen} width="large">
          {paneComponents[paneType](handleClosePane)}
        </PageLayoutPane>

        <PageLayoutSidebar position="end">
          <SideNavigation>
            <SideNavigation.Group>
              <SideNavigation.Item
                icon={LfInformationCircle}
                onClick={() => handleSelectPane("attributes")}
                aria-current={currentPane === "attributes" ? true : undefined}
              >
                契約書情報
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfFileClip}
                onClick={() => handleSelectPane("relatedFiles")}
                aria-current={currentPane === "relatedFiles" ? true : undefined}
                trailing={<Badge count={mockDetailRelatedFiles.contracts.length} color="subtle" />}
              >
                関連ファイル
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfSticky}
                onClick={() => handleSelectPane("specialNotices")}
                aria-current={currentPane === "specialNotices" ? true : undefined}
                trailing={<Badge count={mockDetailSpecialNotices.length} color="subtle" />}
              >
                特記事項
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfComment}
                onClick={() => handleSelectPane("internalComments")}
                aria-current={currentPane === "internalComments" ? true : undefined}
              >
                社内コメント
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfArchive}
                onClick={() => handleSelectPane("cases")}
                aria-current={currentPane === "cases" ? true : undefined}
              >
                案件
              </SideNavigation.Item>
            </SideNavigation.Group>
            <SideNavigation.Group>
              <SideNavigation.Item
                icon={LfTimeline}
                onClick={() => handleSelectPane("versions")}
                aria-current={currentPane === "versions" ? true : undefined}
              >
                バージョン
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfFiles}
                onClick={() => handleSelectPane("similarContracts")}
                aria-current={currentPane === "similarContracts" ? true : undefined}
              >
                類似契約書
              </SideNavigation.Item>
            </SideNavigation.Group>
          </SideNavigation>
        </PageLayoutSidebar>
      </PageLayout>
    </>
  );
};

export default FileManagementDetail;
