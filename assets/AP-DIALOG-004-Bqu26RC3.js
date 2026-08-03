var e=`---
id: AP-DIALOG-004
component: Dialog
category: usage
severity: warning
---
# DialogContent の width="full" を複雑な操作に使用してはいけない

## Bad

\`\`\`tsx
// 複雑なフォームをフルスクリーン Dialog で表示
<Dialog>
  <DialogContent width="full">
    <DialogBody>
      <ComplexForm />  {/* 多数の入力フィールド */}
    </DialogBody>
  </DialogContent>
</Dialog>
\`\`\`

## Good

\`\`\`tsx
// 複雑な操作は専用ページへ遷移
<Link href="/items/new">新規作成</Link>

// フルスクリーンは情報量が多い閲覧のみ
<Dialog>
  <DialogContent width="full">
    <DialogBody>
      <DetailView />  {/* 大量のデータ表示 */}
    </DialogBody>
  </DialogContent>
</Dialog>
\`\`\`

## Why

\`width="full"\` は高い情報量の表示にのみ使用する。複雑な操作（多数の入力フィールドを含むフォーム等）にはフルスクリーン Dialog ではなく専用ページを使用する。
`;export{e as default};