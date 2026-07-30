var e=`---
id: AP-DIALOG-002
component: Dialog
category: composition
severity: error
---
# Dialog の DialogBody に Banner を配置してはいけない

## Bad

\`\`\`tsx
<DialogContent>
  <DialogHeader>...</DialogHeader>
  <DialogBody>
    <Banner color="danger">エラーがあります</Banner>
    <p>内容</p>
  </DialogBody>
</DialogContent>
\`\`\`

## Good

\`\`\`tsx
<DialogContent>
  <DialogHeader>...</DialogHeader>
  <DialogBody>
    <p>内容</p>
    <DialogStickyContainer position="bottom">
      <Banner color="danger">エラーがあります</Banner>
    </DialogStickyContainer>
  </DialogBody>
</DialogContent>
\`\`\`

## Why

Banner を DialogBody の通常コンテンツとして配置するとスクロール時に隠れる。\`DialogStickyContainer\`（top または bottom）を DialogBody 内で使用することで常時表示される（sticky は body のスクロールコンテキスト内で効くため、StickyContainer は必ず DialogBody の子要素として配置する）。フォーム送信エラーのように Footer のアクション直前で目に入れたい場合は bottom、ヘッダー直下で常に意識させたい場合は top を選ぶ。
`;export{e as default};