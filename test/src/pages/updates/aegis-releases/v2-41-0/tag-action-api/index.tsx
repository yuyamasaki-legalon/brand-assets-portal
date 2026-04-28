import { LfLink, LfTag, LfUser } from "@legalforce/aegis-icons";
import {
  Link as AegisLink,
  ContentHeader,
  Divider,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Tag,
  TagGroup,
  Text,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const TagActionApi = () => {
  const [tags, setTags] = useState(["契約書", "NDA", "業務委託", "秘密保持"]);

  const handleRemove = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const resetTags = () => {
    setTags(["契約書", "NDA", "業務委託", "秘密保持"]);
  };

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Tag API デモ</ContentHeader.Title>
            <ContentHeader.Description>現行Aegis APIでの Tag 操作パターン</ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            Tag の削除操作、リンク化、TagGroup でのグルーピングを確認するデモです。
          </Text>

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            removable / onRemove
          </Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--aegis-space-small)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            {tags.map((tag) => (
              <Tag key={tag} removable onRemove={() => handleRemove(tag)}>
                {tag}
              </Tag>
            ))}
            {tags.length === 0 && (
              <Tag color="neutral" onClick={resetTags}>
                リセット
              </Tag>
            )}
          </div>

          <Divider style={{ marginBottom: "var(--aegis-space-large)" }} />

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            クリック可能な Tag
          </Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--aegis-space-small)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            <Tag color="blue" leading={LfLink} asChild>
              <a href="https://example.com" target="_blank" rel="noopener noreferrer">
                外部リンク
              </a>
            </Tag>
            <Tag color="teal" leading={LfUser} asChild>
              <Link to="/updates/aegis-releases/v2-41-0">v2.41.0 トップ</Link>
            </Tag>
            <Tag color="neutral" leading={LfTag} asChild>
              <Link to="/updates">リリース一覧</Link>
            </Tag>
          </div>

          <Divider style={{ marginBottom: "var(--aegis-space-large)" }} />

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            TagGroup
          </Text>
          <div style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
            <TagGroup>
              <Text variant="label.medium" style={{ paddingRight: "var(--aegis-space-xxSmall)" }}>
                カテゴリ
              </Text>
              <Tag color="blue">契約書</Tag>
              <Tag color="teal">NDA</Tag>
              <Tag color="neutral">覚書</Tag>
            </TagGroup>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-41-0">← Back to v2.41.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
