var e=`---
id: AP-STATES-001
component: General
category: usage
severity: warning
---
# 非同期データには loading / empty / error の 3 状態を実装すべき

## Bad

\`\`\`tsx
// success の状態しか考慮されていない
const Page = () => {
  const { data } = useQuery(...);
  return (
    <Table>
      <Table.Head>...</Table.Head>
      <Table.Body>
        {data?.map((row) => <Row key={row.id} row={row} />)}
      </Table.Body>
    </Table>
  );
};
\`\`\`

## Good

\`\`\`tsx
const Page = () => {
  const { data, isLoading, error } = useQuery(...);

  if (isLoading) return <Skeleton.Table rows={5} />;
  if (error) return <ErrorState onRetry={refetch} />;
  if (!data || data.length === 0) {
    return <EmptyState title="データがありません" />;
  }

  return (
    <Table>
      <Table.Head>...</Table.Head>
      <Table.Body>
        {data.map((row) => <Row key={row.id} row={row} />)}
      </Table.Body>
    </Table>
  );
};
\`\`\`

## Why

非同期データを扱う画面では loading / empty / error の 3 状態を必ず実装する。1 つでも欠けると、読み込み中に空っぽに見えたり、エラー時に画面が真っ白になったり、データ 0 件が「壊れている」のか「該当なし」なのか区別がつかなくなる。

各状態に使うコンポーネントは以下を基本とする:
- loading → \`Skeleton\` / \`Skeleton.Table\` / \`Skeleton.Text\`
- empty → \`EmptyState\`（必ず title を設定 — AP-EMPTYSTATE-001 参照）
- error → \`EmptyState\` または \`Banner color="danger"\`（再試行可能なら onRetry を提供）
`;export{e as default};