var e=`# フォームダイアログ（作成・編集）

レコード作成・編集をモーダルで完結させるレシピ。
\`Dialog\` のヘッダー・ボディ・フッターを 3 段で組み、フォーム送信をフッターの \`ButtonGroup\` に集約します。

## 使うコンポーネント

- \`Dialog\`, \`DialogContent\`, \`DialogHeader\`, \`DialogBody\`, \`DialogFooter\`
- \`ContentHeader\`, \`ContentHeader.Title\`
- \`Form\`
- \`FormControl\`, \`FormControl.Label\`, \`FormControl.Caption\`
- \`TextField\`, \`Select\`, \`Textarea\`
- \`Button\`, \`ButtonGroup\`

## スニペット

\`\`\`tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <ContentHeader>
        <ContentHeader.Title>休暇を付与する</ContentHeader.Title>
      </ContentHeader>
    </DialogHeader>
    <DialogBody>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
          <FormControl required error={Boolean(errors.name)}>
            <FormControl.Label>休暇名</FormControl.Label>
            <TextField {...register("name")} />
            {errors.name ? (
              <FormControl.Caption color="danger">
                {errors.name.message}
              </FormControl.Caption>
            ) : null}
          </FormControl>

          <FormControl required>
            <FormControl.Label>付与日数</FormControl.Label>
            <TextField type="number" {...register("days")} />
          </FormControl>

          <FormControl>
            <FormControl.Label>備考</FormControl.Label>
            <Textarea {...register("note")} />
          </FormControl>
        </div>
      </Form>
    </DialogBody>
    <DialogFooter>
      <ButtonGroup>
        <Button variant="plain" onClick={() => setOpen(false)}>
          キャンセル
        </Button>
        <Button variant="solid" onClick={handleSubmit(onSubmit)} loading={isSubmitting}>
          付与する
        </Button>
      </ButtonGroup>
    </DialogFooter>
  </DialogContent>
</Dialog>
\`\`\`

## ポイント

- ヘッダーは \`ContentHeader.Title\` だけにし、保存ボタンは必ず \`DialogFooter\` に置く
- フッターの \`ButtonGroup\` は「キャンセル（plain）→ 主アクション（solid）」の順で、\`solid\` は 1 つだけ
- バリデーションエラーは \`FormControl.Caption color="danger"\` でフィールド直下に出す
- 通信中は主ボタンに \`loading\` を付け、二重送信を防ぐ

## NG例

- \`DialogHeader\` の \`trailing\` に保存ボタンを置かない（AP-CONTENTHEADER-001）
- \`DialogBody\` 内に確認 \`Banner\` を貼り付けない（AP-DIALOG-002）
- 主アクションを \`variant="solid"\` で複数並べない（AP-DIALOG-003）
- 閉じる \`IconButton\` を \`Drawer.Header\` / \`DialogHeader\` 内に手動で置かない（自動で提供される）
`;export{e as default};