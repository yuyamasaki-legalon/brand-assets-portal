---
id: AP-CARD-001
component: Card
category: composition
severity: warning
---
# Card 内に過度なインタラクティブ要素をネストすべきではない

## Bad

```tsx
<Card onClick={handleCardClick}>
  <Button onClick={handleButtonClick}>アクション</Button>
  <Link href="/detail">詳細</Link>
</Card>
```

## Good

```tsx
<Card>
  <Card.Header>タイトル</Card.Header>
  <Card.Body>内容</Card.Body>
  <Card.Footer>
    <ButtonGroup>
      <Button variant="plain" onClick={handleAction}>アクション</Button>
    </ButtonGroup>
  </Card.Footer>
</Card>
```

## Why

Card に onClick がある場合（クリック可能カード）、内部にさらにインタラクティブ要素をネストするとフォーカス管理が複雑になる。Card の構造化されたサブコンポーネントを使用する。
