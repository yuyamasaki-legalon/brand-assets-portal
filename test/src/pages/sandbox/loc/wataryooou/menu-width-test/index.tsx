import { LfCopy, LfEllipsisDot, LfPen, LfTrash } from "@legalforce/aegis-icons";
import {
  ActionList,
  ActionListBody,
  ActionListItem,
  Link as AegisLink,
  ContentHeader,
  Divider,
  Icon,
  IconButton,
  Menu,
  MenuAnchor,
  MenuBox,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import type React from "react";
import { Link } from "react-router-dom";

// ── Old API (MenuAnchor + MenuBox + ActionList) ──

const MENU_BOX_WIDTHS = ["auto", "xSmall", "small", "medium", "large", "match-to-anchor"] as const;

type MenuBoxWidth = (typeof MENU_BOX_WIDTHS)[number];

function OldApiMenuCard({ width, defaultOpen }: { width: MenuBoxWidth; defaultOpen?: boolean }) {
  return (
    <div
      style={{
        display: "grid",
        gap: "var(--aegis-space-xSmall)",
        justifyItems: "start",
      }}
    >
      <Text variant="label.medium">
        width=&quot;{width}&quot;{defaultOpen ? " (defaultOpen)" : ""}
      </Text>
      <Menu defaultOpen={defaultOpen}>
        <MenuAnchor>
          <IconButton aria-label={`Menu (${width})`} variant="subtle">
            <Icon>
              <LfEllipsisDot />
            </Icon>
          </IconButton>
        </MenuAnchor>
        <MenuBox width={width}>
          <ActionList>
            <ActionListItem>
              <ActionListBody leading={LfPen}>編集</ActionListBody>
            </ActionListItem>
            <ActionListItem>
              <ActionListBody leading={LfCopy}>複製</ActionListBody>
            </ActionListItem>
            <ActionListItem color="danger">
              <ActionListBody leading={LfTrash}>削除</ActionListBody>
            </ActionListItem>
          </ActionList>
        </MenuBox>
      </Menu>
    </div>
  );
}

// ── New API (MenuTrigger + MenuContent + MenuItem) ──

const NEW_API_VARIANTS: { label: string; style?: React.CSSProperties }[] = [
  { label: "default (no width)" },
  { label: 'style width="160px"', style: { width: "160px" } },
  { label: 'style width="200px"', style: { width: "200px" } },
  { label: 'style width="240px"', style: { width: "240px" } },
  { label: 'style width="320px"', style: { width: "320px" } },
  { label: 'style width="400px"', style: { width: "400px" } },
];

function NewApiMenuCard({
  label,
  contentStyle,
  defaultOpen,
}: {
  label: string;
  contentStyle?: React.CSSProperties;
  defaultOpen?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: "var(--aegis-space-xSmall)",
        justifyItems: "start",
      }}
    >
      <Text variant="label.medium">
        {label}
        {defaultOpen ? " (defaultOpen)" : ""}
      </Text>
      <Menu defaultOpen={defaultOpen}>
        <MenuTrigger>
          <IconButton aria-label={`Menu (${label})`} variant="subtle">
            <Icon>
              <LfEllipsisDot />
            </Icon>
          </IconButton>
        </MenuTrigger>
        <MenuContent style={contentStyle}>
          <MenuItem
            leading={
              <Icon>
                <LfPen />
              </Icon>
            }
          >
            編集
          </MenuItem>
          <MenuItem
            leading={
              <Icon>
                <LfCopy />
              </Icon>
            }
          >
            複製
          </MenuItem>
          <MenuSeparator />
          <MenuItem
            color="danger"
            leading={
              <Icon>
                <LfTrash />
              </Icon>
            }
          >
            削除
          </MenuItem>
        </MenuContent>
      </Menu>
    </div>
  );
}

export function MenuWidthTest() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Menu width 検証</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          {/* ── Old API Section ── */}
          <Text as="h2" variant="title.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
            旧 API: MenuAnchor + MenuBox + ActionList
          </Text>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            MenuBox の width prop が各値で正しく動作するかを検証します。
          </Text>
          <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-large)" }}>
            width が内部で破棄されている場合、すべてのメニューが同じ幅で表示されます。
          </Text>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(var(--aegis-layout-width-x5Small), 1fr))",
              gap: "var(--aegis-space-large)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            {MENU_BOX_WIDTHS.map((width, index) => (
              <OldApiMenuCard key={width} width={width} defaultOpen={index === 0} />
            ))}
          </div>

          <Divider />

          {/* ── New API Section ── */}
          <Text
            as="h2"
            variant="title.small"
            style={{ marginTop: "var(--aegis-space-xLarge)", marginBottom: "var(--aegis-space-small)" }}
          >
            新 API: MenuTrigger + MenuContent + MenuItem
          </Text>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            MenuContent には width prop がないため、style 経由で幅を指定して動作を確認します。
          </Text>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(var(--aegis-layout-width-x5Small), 1fr))",
              gap: "var(--aegis-space-large)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            {NEW_API_VARIANTS.map((variant, index) => (
              <NewApiMenuCard
                key={variant.label}
                label={variant.label}
                contentStyle={variant.style}
                defaultOpen={index === 0}
              />
            ))}
          </div>

          <AegisLink asChild>
            <Link to="/sandbox/loc/wataryooou">← Back to wataryooou</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
