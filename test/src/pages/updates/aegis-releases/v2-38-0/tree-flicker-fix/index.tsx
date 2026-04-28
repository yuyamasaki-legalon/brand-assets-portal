import {
  Link as AegisLink,
  Button,
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
  Tree,
  TreeItem,
} from "@legalforce/aegis-react";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

type TreeNode = {
  name: string;
  children?: string[];
};

const initialItems: Record<string, TreeNode> = {
  root: { name: "Root", children: ["folder-1", "folder-2"] },
  "folder-1": { name: "フォルダ 1", children: ["file-1-1", "file-1-2"] },
  "folder-2": { name: "フォルダ 2", children: ["file-2-1"] },
  "file-1-1": { name: "ファイル 1-1" },
  "file-1-2": { name: "ファイル 1-2" },
  "file-2-1": { name: "ファイル 2-1" },
};

const updatedItems: Record<string, TreeNode> = {
  root: { name: "Root", children: ["folder-1", "folder-2", "folder-3"] },
  "folder-1": { name: "フォルダ 1（更新済み）", children: ["file-1-1", "file-1-2", "file-1-3"] },
  "folder-2": { name: "フォルダ 2", children: ["file-2-1", "file-2-2"] },
  "folder-3": { name: "フォルダ 3（新規）", children: ["file-3-1"] },
  "file-1-1": { name: "ファイル 1-1" },
  "file-1-2": { name: "ファイル 1-2" },
  "file-1-3": { name: "ファイル 1-3（新規）" },
  "file-2-1": { name: "ファイル 2-1" },
  "file-2-2": { name: "ファイル 2-2（新規）" },
  "file-3-1": { name: "ファイル 3-1（新規）" },
};

export const TreeFlickerFix = () => {
  const [items, setItems] = useState<Record<string, TreeNode>>(initialItems);
  const [isUpdated, setIsUpdated] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);

  const handleToggle = useCallback(() => {
    const next = !isUpdated;
    setItems(next ? updatedItems : initialItems);
    setIsUpdated(next);
    setUpdateCount((c) => c + 1);
  }, [isUpdated]);

  const handleDelayedUpdate = useCallback(() => {
    setTimeout(() => {
      setItems(isUpdated ? initialItems : updatedItems);
      setIsUpdated((prev) => !prev);
      setUpdateCount((c) => c + 1);
    }, 500);
  }, [isUpdated]);

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Tree フリッカー修正デモ</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            v2.38.0 で Tree コンポーネントの items を動的に変更した際のフリッカー（ちらつき）が修正されました。
            下のボタンで items を切り替えて、ちらつきが発生しないことを確認してください。
          </Text>

          <div style={{ display: "flex", gap: "var(--aegis-space-small)", marginBottom: "var(--aegis-space-medium)" }}>
            <Button onClick={handleToggle}>{isUpdated ? "初期状態に戻す" : "items を更新"}</Button>
            <Button variant="subtle" onClick={handleDelayedUpdate}>
              500ms 後に更新
            </Button>
          </div>

          <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
            更新回数: {updateCount} / 現在: {isUpdated ? "更新済み" : "初期状態"}
          </Text>

          <div
            style={{
              border: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
              borderRadius: "var(--aegis-radius-medium)",
              padding: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <Tree items={items} rootItemId="root" defaultExpandedItems={["folder-1", "folder-2", "folder-3"]}>
              {(itemId) => <TreeItem>{items[itemId]?.name ?? itemId}</TreeItem>}
            </Tree>
          </div>

          <div
            style={{
              padding: "var(--aegis-space-medium)",
              backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
              borderRadius: "var(--aegis-radius-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              修正内容
            </Text>
            <Text as="p" variant="body.small">
              - v2.37.x 以前: items の参照が変わると Tree が再マウントされフリッカーが発生
            </Text>
            <Text as="p" variant="body.small">
              - v2.38.0: items の変更を内部で差分検知し、不要な再マウントを回避
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-38-0">← Back to v2.38.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
