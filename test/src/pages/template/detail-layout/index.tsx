import {
  LfAngleLeftLarge,
  LfCloseLarge,
  LfEllipsisDot,
  LfFile,
  LfHistory,
  LfInformationCircle,
  LfLink,
  LfMenu,
  LfPen,
} from "@legalforce/aegis-icons";
import {
  Avatar,
  Button,
  ButtonGroup,
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
  Divider,
  Header,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  PageLayoutSidebar,
  SideNavigation,
  StatusLabel,
  Tag,
  TagGroup,
  Text,
  Timeline,
  Tooltip,
} from "@legalforce/aegis-react";
import type { CSSProperties } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Recipes: docs/aegis-recipes/detail-header.md, status-and-tags.md

// =============================================================================
// Types
// =============================================================================

type PaneType = "properties" | "related" | "history" | "attachments";

// =============================================================================
// Mock Data
// =============================================================================

const mockDocument = {
  id: "DOC-2024-001",
  title: "業務委託契約書",
  status: "inReview" as const,
  category: "契約書",
  description:
    "株式会社サンプルとの業務委託契約書です。システム開発業務に関する委託内容、報酬、期間などを定めています。",
  assignee: "山田 太郎",
  department: "法務部",
  createdAt: "2024/12/01",
  updatedAt: "2024/12/18",
  dueDate: "2024/12/25",
  tags: ["重要", "外部契約", "システム開発"],
};

const mockRelatedItems = [
  { id: "DOC-2024-002", title: "秘密保持契約書", status: "approved" as const },
  { id: "DOC-2024-003", title: "基本契約書", status: "draft" as const },
  { id: "DOC-2024-004", title: "サービス利用規約", status: "inReview" as const },
];

const mockHistory = [
  { id: "h1", date: "2024/12/18 14:30", user: "山田 太郎", action: "レビュー依頼を送信しました" },
  { id: "h2", date: "2024/12/15 10:00", user: "佐藤 花子", action: "コメントを追加しました" },
  { id: "h3", date: "2024/12/10 16:45", user: "山田 太郎", action: "ドキュメントを更新しました" },
  { id: "h4", date: "2024/12/01 09:00", user: "山田 太郎", action: "ドキュメントを作成しました" },
];

const mockAttachments = [
  { id: "a1", name: "業務委託契約書_v2.docx", size: "245 KB", updatedAt: "2024/12/18" },
  { id: "a2", name: "見積書.pdf", size: "128 KB", updatedAt: "2024/12/15" },
  { id: "a3", name: "参考資料.xlsx", size: "512 KB", updatedAt: "2024/12/10" },
];

// =============================================================================
// Status Configuration
// =============================================================================

const statusLabels: Record<string, string> = {
  draft: "下書き",
  inReview: "レビュー中",
  approved: "承認済み",
  rejected: "差戻し",
};

const statusColors: Record<string, "neutral" | "yellow" | "teal" | "red"> = {
  draft: "neutral",
  inReview: "yellow",
  approved: "teal",
  rejected: "red",
};

// =============================================================================
// Styles
// =============================================================================

const styles: Record<string, CSSProperties> = {
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-large)",
  },
  sectionContent: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-medium)",
  },
  propertyList: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-medium)",
  },
  propertyItem: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xxSmall)",
  },
  assigneeRow: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-xSmall)",
  },
  relatedItem: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xSmall)",
    padding: "var(--aegis-space-small)",
    border: "1px solid var(--aegis-color-border-default)",
    borderRadius: "var(--aegis-radius-medium)",
  },
  relatedItemHeader: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-xSmall)",
  },
  attachmentItem: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xxSmall)",
    padding: "var(--aegis-space-small)",
    border: "1px solid var(--aegis-color-border-default)",
    borderRadius: "var(--aegis-radius-medium)",
  },
  attachmentItemHeader: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-xSmall)",
  },
  attachmentItemMeta: {
    display: "flex",
    gap: "var(--aegis-space-small)",
  },
  historyItem: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xxSmall)",
  },
};

// =============================================================================
// Property Item Component
// =============================================================================

const PropertyItem = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={styles.propertyItem}>
    <Text variant="label.medium" color="subtle">
      {label}
    </Text>
    {children}
  </div>
);

// =============================================================================
// Pane Content Components
// =============================================================================

const PropertiesPane = () => (
  <div style={styles.propertyList}>
    <PropertyItem label="カテゴリ">
      <Text variant="body.medium">{mockDocument.category}</Text>
    </PropertyItem>
    <PropertyItem label="担当者">
      <div style={styles.assigneeRow}>
        <Avatar size="xSmall" name={mockDocument.assignee} />
        <Text variant="body.medium">{mockDocument.assignee}</Text>
      </div>
    </PropertyItem>
    <PropertyItem label="部署">
      <Text variant="body.medium">{mockDocument.department}</Text>
    </PropertyItem>
    <PropertyItem label="作成日">
      <Text variant="body.medium">{mockDocument.createdAt}</Text>
    </PropertyItem>
    <PropertyItem label="更新日">
      <Text variant="body.medium">{mockDocument.updatedAt}</Text>
    </PropertyItem>
    <PropertyItem label="期限">
      <Text variant="body.medium">{mockDocument.dueDate}</Text>
    </PropertyItem>
  </div>
);

const RelatedPane = () => (
  <div style={{ display: "grid", gap: "var(--aegis-space-small)" }}>
    {mockRelatedItems.map((item) => (
      <div key={item.id} style={styles.relatedItem}>
        <div style={styles.relatedItemHeader}>
          <StatusLabel color={statusColors[item.status]}>{statusLabels[item.status]}</StatusLabel>
          <Text variant="body.small" color="subtle">
            {item.id}
          </Text>
        </div>
        <Text variant="body.medium">{item.title}</Text>
      </div>
    ))}
  </div>
);

const HistoryPane = () => (
  <Timeline>
    {mockHistory.map((event) => (
      <Timeline.Item key={event.id}>
        <div style={styles.historyItem}>
          <Text variant="body.small" color="subtle">
            {event.date}
          </Text>
          <Text variant="body.medium">{event.action}</Text>
          <Text variant="body.small" color="subtle">
            {event.user}
          </Text>
        </div>
      </Timeline.Item>
    ))}
  </Timeline>
);

const AttachmentsPane = () => (
  <div style={{ display: "grid", gap: "var(--aegis-space-small)" }}>
    {mockAttachments.map((file) => (
      <div key={file.id} style={styles.attachmentItem}>
        <div style={styles.attachmentItemHeader}>
          <Icon size="small" color="subtle">
            <LfFile />
          </Icon>
          <Text variant="body.medium">{file.name}</Text>
        </div>
        <div style={styles.attachmentItemMeta}>
          <Text variant="body.small" color="subtle">
            {file.size}
          </Text>
          <Text variant="body.small" color="subtle">
            {file.updatedAt}
          </Text>
        </div>
      </div>
    ))}
  </div>
);

const paneContents: Record<PaneType, { title: string; component: React.ReactNode }> = {
  properties: { title: "プロパティ", component: <PropertiesPane /> },
  related: { title: "関連アイテム", component: <RelatedPane /> },
  history: { title: "履歴", component: <HistoryPane /> },
  attachments: { title: "添付ファイル", component: <AttachmentsPane /> },
};

// =============================================================================
// Component
// =============================================================================

const DetailLayout = () => {
  const navigate = useNavigate();
  const [paneType, setPaneType] = useState<PaneType>("properties");
  const [paneOpen, setPaneOpen] = useState(true);

  const currentPane = paneOpen ? paneType : undefined;

  const handleSelectPane = (nextPane: PaneType) => {
    setPaneType(nextPane);
    setPaneOpen(true);
  };

  return (
    <>
      <Header>
        <Header.Item>
          <Tooltip title="メニュー" placement="bottom">
            <IconButton variant="plain" aria-label="メニュー">
              <Icon>
                <LfMenu />
              </Icon>
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" />
          <Tooltip title="戻る" placement="bottom">
            <IconButton variant="plain" aria-label="戻る" onClick={() => navigate("/template")}>
              <Icon>
                <LfAngleLeftLarge />
              </Icon>
            </IconButton>
          </Tooltip>
        </Header.Item>
        <Header.Item>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
              <StatusLabel color={statusColors[mockDocument.status]}>{statusLabels[mockDocument.status]}</StatusLabel>
              <Header.Title>
                <Text variant="title.xxSmall">{mockDocument.title}</Text>
              </Header.Title>
            </div>
            <Text variant="body.small" color="subtle">
              {mockDocument.id}
            </Text>
          </div>
        </Header.Item>
        <Header.Spacer />
        <Header.Item>
          <ButtonGroup>
            <Button variant="plain" leading={LfPen}>
              編集
            </Button>
            <Button variant="solid">保存</Button>
          </ButtonGroup>
          <Tooltip title="その他" placement="bottom">
            <IconButton variant="plain" aria-label="その他">
              <Icon>
                <LfEllipsisDot />
              </Icon>
            </IconButton>
          </Tooltip>
        </Header.Item>
      </Header>

      <PageLayout>
        <PageLayoutContent variant="fill">
          <PageLayoutHeader>
            <ContentHeader>
              <ContentHeaderTitle>ドキュメント詳細</ContentHeaderTitle>
              <ContentHeaderDescription>ドキュメントの詳細情報を表示・編集できます。</ContentHeaderDescription>
            </ContentHeader>
          </PageLayoutHeader>

          <PageLayoutBody>
            <div style={styles.section}>
              <section style={styles.sectionContent}>
                <Text as="h3" variant="title.xxSmall">
                  概要
                </Text>
                <div style={styles.propertyList}>
                  <PropertyItem label="タイトル">
                    <Text variant="body.medium">{mockDocument.title}</Text>
                  </PropertyItem>
                  <PropertyItem label="カテゴリ">
                    <Text variant="body.medium">{mockDocument.category}</Text>
                  </PropertyItem>
                  <PropertyItem label="担当者">
                    <div style={styles.assigneeRow}>
                      <Avatar size="xSmall" name={mockDocument.assignee} />
                      <Text variant="body.medium">{mockDocument.assignee}</Text>
                    </div>
                  </PropertyItem>
                  <PropertyItem label="ステータス">
                    <StatusLabel color={statusColors[mockDocument.status]}>
                      {statusLabels[mockDocument.status]}
                    </StatusLabel>
                  </PropertyItem>
                </div>
              </section>

              <Divider />

              <section style={styles.sectionContent}>
                <Text as="h3" variant="title.xxSmall">
                  説明
                </Text>
                <Text variant="body.medium">{mockDocument.description}</Text>
              </section>

              <Divider />

              <section style={styles.sectionContent}>
                <Text as="h3" variant="title.xxSmall">
                  タグ
                </Text>
                <TagGroup>
                  {mockDocument.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </TagGroup>
              </section>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>

        <PageLayoutPane position="end" resizable minWidth="large" width="large" open={paneOpen}>
          <PageLayoutHeader>
            <ContentHeader
              trailing={
                <Tooltip title="閉じる" placement="top">
                  <IconButton variant="plain" size="small" aria-label="閉じる" onClick={() => setPaneOpen(false)}>
                    <Icon>
                      <LfCloseLarge />
                    </Icon>
                  </IconButton>
                </Tooltip>
              }
            >
              <ContentHeaderTitle>{paneContents[paneType].title}</ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>
          <PageLayoutBody>{paneContents[paneType].component}</PageLayoutBody>
        </PageLayoutPane>

        <PageLayoutSidebar position="end">
          <SideNavigation>
            <SideNavigation.Group>
              <SideNavigation.Item
                icon={LfInformationCircle}
                onClick={() => handleSelectPane("properties")}
                aria-current={currentPane === "properties" ? true : undefined}
              >
                プロパティ
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfLink}
                onClick={() => handleSelectPane("related")}
                aria-current={currentPane === "related" ? true : undefined}
              >
                関連アイテム
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfHistory}
                onClick={() => handleSelectPane("history")}
                aria-current={currentPane === "history" ? true : undefined}
              >
                履歴
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfFile}
                onClick={() => handleSelectPane("attachments")}
                aria-current={currentPane === "attachments" ? true : undefined}
              >
                添付ファイル
              </SideNavigation.Item>
            </SideNavigation.Group>
          </SideNavigation>
        </PageLayoutSidebar>
      </PageLayout>
    </>
  );
};

export default DetailLayout;
