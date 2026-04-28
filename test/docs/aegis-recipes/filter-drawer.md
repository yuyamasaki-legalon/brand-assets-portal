# フィルタードロワー（フォーム）

一覧画面の絞り込み条件を Drawer にまとめるレシピ。
画面幅を圧迫せず、条件が多いケースで有効です。

## 使うコンポーネント

- `Drawer`
- `ContentHeader`, `ContentHeaderTitle`
- `FormControl`, `TextField`, `Select`, `Checkbox`
- `Button`

## スニペット

```tsx
<Drawer
  open={filterOpen}
  onOpenChange={setFilterOpen}
  position="end"
  root={drawerRoot}
  lockScroll={false}
>
  <Drawer.Header>
    <ContentHeader>
      <ContentHeaderTitle>フィルター</ContentHeaderTitle>
    </ContentHeader>
  </Drawer.Header>
  <Drawer.Body>
    <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
      <FormControl>
        <FormControl.Label>ID/タイトル</FormControl.Label>
        <TextField
          value={filters.keyword}
          onChange={(event) => updateFilters((prev) => ({ ...prev, keyword: event.target.value }))}
          placeholder="ID またはタイトルを入力"
        />
      </FormControl>

      <FormControl>
        <FormControl.Label>ステータス</FormControl.Label>
        <div style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
          {statusOptions.map((status) => (
            <Checkbox
              key={status.value}
              checked={filters.statuses.includes(status.value)}
              onChange={(event) => handleToggleStatus(status.value, event.target.checked)}
            >
              {status.label}
            </Checkbox>
          ))}
        </div>
      </FormControl>

      <FormControl>
        <FormControl.Label>部署</FormControl.Label>
        <Select
          placeholder="部署を選択"
          value={filters.department}
          onChange={(value) => updateFilters((prev) => ({ ...prev, department: value }))}
          options={departmentOptions}
        />
      </FormControl>

      <Button variant="solid" onClick={applyFilters}>
        適用
      </Button>
    </div>
  </Drawer.Body>
</Drawer>
```

## ポイント

- Drawer の `root` は `Tab.Panels` の `ref` を指定する
- 条件が多い場合は `FormControl` を縦に積む

## NG例

- モーダルで絞り込みを実装しない（Drawer を優先）
- `FormControl` を使わずにラベルと入力を並べない
