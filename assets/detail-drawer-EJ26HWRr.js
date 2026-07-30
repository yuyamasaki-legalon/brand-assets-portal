var e=`# 詳細ドロワー（一覧から開く詳細表示）

一覧でクリックした行の詳細を、画面遷移せずに右側の \`Drawer\` で表示するレシピ。
一覧のコンテキストを保ったまま編集・閲覧したい画面で使います。

## 使うコンポーネント

- \`Drawer\`, \`Drawer.Header\`, \`Drawer.Body\`, \`Drawer.Footer\`
- \`ContentHeader\`, \`ContentHeader.Title\`
- \`StatusLabel\`, \`Text\`, \`Caption\`
- \`Button\`, \`ButtonGroup\`

## スニペット

\`\`\`tsx
<Drawer
  open={Boolean(selectedId)}
  onOpenChange={(open) => !open && setSelectedId(null)}
  position="end"
  size="medium"
>
  <Drawer.Header>
    <ContentHeader>
      <ContentHeader.Title>申請の詳細</ContentHeader.Title>
    </ContentHeader>
  </Drawer.Header>
  <Drawer.Body>
    <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
        <StatusLabel color={statusColors[detail.status]}>
          {statusLabels[detail.status]}
        </StatusLabel>
        <Text variant="body.small" color="subtle">{detail.id}</Text>
      </div>

      <div>
        <Caption>申請者</Caption>
        <Text>{detail.applicant}</Text>
      </div>
      <div>
        <Caption>申請日</Caption>
        <Text>{detail.appliedAt}</Text>
      </div>
      <div>
        <Caption>理由</Caption>
        <Text>{detail.reason}</Text>
      </div>
    </div>
  </Drawer.Body>
  <Drawer.Footer>
    <ButtonGroup>
      <Button variant="plain" onClick={() => setSelectedId(null)}>
        閉じる
      </Button>
      <Button variant="solid" onClick={() => handleApprove(detail.id)}>
        承認する
      </Button>
    </ButtonGroup>
  </Drawer.Footer>
</Drawer>
\`\`\`

## ポイント

- 詳細表示は \`position="end"\`（右側）を基本にする。左側は予約済みのナビゲーション領域
- \`Drawer.Header\` は閉じるボタンを自動提供する。\`ContentHeader.trailing\` に閉じるボタンを足さない
- 主アクション（承認・編集など）は \`Drawer.Footer\` に集約し、\`ButtonGroup\` で「キャンセル系（plain）→ 主アクション（solid）」の順
- 開閉は \`open\` / \`onOpenChange\` を選択 ID で制御する（URL に同期させる場合は parallel route や querystring を併用）

## NG例

- \`position="start"\` で詳細を出さない（サイドナビと競合する）
- \`Drawer.Header\` 内に手動で閉じる \`IconButton\` を置かない（AP-DRAWER-002）
- 編集フォームを \`Drawer.Body\` 直書きにしてバリデーションを省略しない（複雑な編集は別の \`Dialog\` フォームに分離する）
- 詳細を \`Dialog\` で出さない（一覧コンテキストが見えなくなる）
`;export{e as default};