# バナー付きフォーム（エラー/注意）

フォーム送信エラーや注意事項を `Banner` で表示するレシピ。
`Form` の直前に配置してユーザーに伝達します。

## 使うコンポーネント

- `Banner`
- `Form`
- `Button`
- `Text`

## スニペット

```tsx
{submitError ? (
  <Banner color="danger" closeButton={false}>
    <Text>入力内容に誤りがあります。確認してください。</Text>
  </Banner>
) : null}

<Form>
  {/* FormControl 群 */}
  <Button onClick={handleSubmit} disabled={invalidFormState}>
    保存
  </Button>
</Form>
```

## ポイント

- エラーは `Banner` に集約する
- `Form` の直前に配置して視線移動を減らす

## NG例

- 送信エラーを `snackbar` だけで済ませない
- エラーメッセージを `Text` 単体で置かない
