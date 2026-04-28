# 一覧ツールバー + 検索/フィルター

一覧画面の上部に「タブ + 検索 + フィルター」を並べるレシピ。
`Toolbar` と `Tab` の組み合わせで、スクロールしても操作系が残る構成にします。

## 使うコンポーネント

- `PageLayoutStickyContainer`
- `Toolbar`, `ToolbarSpacer`
- `Tab`, `Badge`, `Text`
- `Button`, `ButtonGroup`, `Icon`
- `PageLayoutBody`
- `Search`

## スニペット

```tsx
<PageLayoutBody>
  <Tab.Group index={tabIndex} onChange={handleTabChange}>
    <PageLayoutStickyContainer>
      <Toolbar>
        <div style={{ overflow: "hidden" }}>
          <Tab.List>
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                trailing={tab.badgeCount ? <Badge color="danger" count={tab.badgeCount} /> : undefined}
              >
                <Text whiteSpace="nowrap">{tab.label}</Text>
              </Tab>
            ))}
          </Tab.List>
        </div>
        <ToolbarSpacer />
        <ButtonGroup>
          <Button
            variant={isFilterActive ? "subtle" : "plain"}
            leading={
              <Icon>
                <LfFilter />
              </Icon>
            }
            onClick={() => setFilterOpen((prev) => !prev)}
          >
            フィルター
          </Button>
          <Search
            placeholder="ID・タイトル・担当者で検索"
            shrinkOnBlur
            value={searchValue}
            onChange={handleSearchChange}
          />
        </ButtonGroup>
      </Toolbar>
    </PageLayoutStickyContainer>

    <Tab.Panels>
      {tabs.map((tab) => (
        <Tab.Panel key={tab.value}>{/* DataTable など */}</Tab.Panel>
      ))}
    </Tab.Panels>
  </Tab.Group>
</PageLayoutBody>
```

## ポイント

- `PageLayoutStickyContainer` で操作系を固定する
- `ToolbarSpacer` でタブと検索を分離する
- `Search` は `shrinkOnBlur` で省スペース化

## NG例

- `input` を手作りして検索 UI を再実装しない
- タブと検索を別行に分断して視線移動を増やさない
