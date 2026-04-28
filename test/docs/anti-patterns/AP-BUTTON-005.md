---
id: AP-BUTTON-005
component: Button
category: styling
severity: error
---
# Button のスタイル（色、アウトライン、シャドウ）をオーバーライドしてはいけない

## Bad

```tsx
<Button style={{ backgroundColor: "#007bff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
  Submit
</Button>
```

## Good

```tsx
<Button variant="solid" color="neutral">Submit</Button>
```

## Why

Button のスタイル（色、アウトライン、シャドウ等）はデザインシステムの承認なくオーバーライドしてはいけない。Aegis の `variant` と `color` prop を使って外観を制御する。
