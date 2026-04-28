# メンテナンス/エラーページの EmptyState

メンテナンスやエラーページで `EmptyState` を使うレシピ。
`PageLayout` の中に配置し、説明文で次の行動を示します。

## 使うコンポーネント

- `PageLayout`, `PageLayoutContent`, `PageLayoutBody`
- `EmptyState`
- `Link`
- `@legalforce/aegis-illustrations/react` のビジュアル

## スニペット

```tsx
<PageLayout>
  <PageLayoutContent>
    <PageLayoutBody>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <EmptyState size="large" title="現在メンテナンス中です" visual={<ErrorCat2 />}>
          <span>
            詳細は
            <Link href="/status" target="_blank" rel="noopener noreferrer">
              ステータスページ
            </Link>
            をご確認ください。
          </span>
        </EmptyState>
      </div>
    </PageLayoutBody>
  </PageLayoutContent>
</PageLayout>
```

## ポイント

- エラー/メンテナンスは `EmptyState` に集約する
- 説明文に `Link` を入れて次の行動を示す

## NG例

- 独自のエラーカードを作らない
- 画像だけで状況を説明しない（タイトルと説明文を必ず出す）
