var e=`# 非同期データの loading / empty / error 表示

API から取得したデータを表示する画面で、\`loading\` / \`empty\` / \`error\` の 3 状態を網羅するレシピ。
1 つでも欠けると「読み込み中に空に見える」「エラーで画面が真っ白」「0 件なのか壊れているのか分からない」といった UX 破綻が起きます。

## 使うコンポーネント

- \`Skeleton\`, \`Skeleton.Table\`, \`Skeleton.Text\`
- \`EmptyState\`, \`Text\`
- \`Banner\`
- \`Button\`
- \`@legalforce/aegis-illustrations/react\` のビジュアル

## スニペット

\`\`\`tsx
const ListSection = () => {
  const { data, isLoading, error, refetch } = useQuery(...);

  if (isLoading) {
    return <Skeleton.Table rows={5} />;
  }

  if (error) {
    return (
      <EmptyState
        title="データを取得できませんでした"
        visual={<ErrorCat />}
        action={
          <Button variant="solid" onClick={() => refetch()}>
            再試行
          </Button>
        }
      >
        <Text>時間をおいてもう一度お試しください。</Text>
      </EmptyState>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState title="該当する項目はありません" visual={<Box />}>
        <Text>条件を変えて再検索してください。</Text>
      </EmptyState>
    );
  }

  return (
    <DataTable
      columns={columns}
      rows={data}
      getRowId={(row) => row.id}
      stickyHeader
    />
  );
};
\`\`\`

部分的な失敗（保存エラーなど）を画面上部で伝えたいケースは \`Banner\` を併用します:

\`\`\`tsx
{saveError ? (
  <Banner color="danger" closeButton onClose={() => setSaveError(null)}>
    <Text>保存に失敗しました。もう一度お試しください。</Text>
  </Banner>
) : null}
\`\`\`

## ポイント

- 3 状態を必ず実装する。\`loading\` のみ、\`error\` だけ抜けている、は UX を壊す
- \`loading\` は \`Skeleton\` 系を使い、レイアウトの土台を維持する（中央 spinner だけにしない）
- \`empty\` と \`error\` はメッセージとアクションを分ける。\`error\` には再試行手段を必ず用意する
- \`EmptyState\` には \`title\` を必ず付け、補足は \`children\` に書く（AP-EMPTYSTATE-001）
- ページ全体ではなく、データ表示領域（カード内、ドロワー内など）にスコープすると一覧の他要素を操作できる

## NG例

- \`data && data.length > 0\` の三項演算だけで \`loading\` を握りつぶさない
- \`error\` をコンソールに流して画面では何も表示しない、は不可
- \`loading\` を独自スピナー実装で代替しない（\`Skeleton\` を使う）
- \`error\` を \`Snackbar\` だけで表示しない（流れて消える情報になる、AP-SNACKBAR-001）

## 関連ルール

- AP-STATES-001: 非同期データには loading / empty / error の 3 状態を実装すべき
- AP-EMPTYSTATE-001: \`EmptyState\` に title を設定すべき
- AP-SNACKBAR-001: \`Snackbar\` を重要な情報の表示に使用してはいけない
`;export{e as default};