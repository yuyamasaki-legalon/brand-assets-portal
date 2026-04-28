---
name: react-useeffect
description: "React useEffect のベストプラクティス・代替パターン・アンチパターンを提供。WHEN: useEffect を書こうとしているとき、useEffect の依存配列やクリーンアップで問題が起きたとき、派生状態の計算に useEffect を使っているコードを見つけたとき。NOT WHEN: useEffect を含まない一般的な React 実装。"
---

# React useEffect Best Practices

Effects は React からの「脱出ハッチ」です。外部システムとの同期に使用します。

## 核心的な原則

**Effects を使わない場面:**
- 派生状態の計算 → レンダー中に計算
- ユーザーイベントへの応答 → イベントハンドラ
- prop 変更時の状態リセット → `key` prop
- データ変換 → トップレベルで実行

**Effects が適切な場面:**
- 外部システムとの同期（非 React ウィジェット、ブラウザ API）
- 外部ストアへのサブスクリプション

## 判断フローチャート

1. ユーザー操作への応答か？ → **イベントハンドラ**
2. props/state から派生する値か？ → **レンダー中に計算**
3. 外部システムとの同期か？ → **useEffect**

## 詳細ドキュメント

実装時は以下を参照:

- [代替パターン](./alternatives.md) - useEffect の代わりに使うべきパターン
- [アンチパターン](./anti-patterns.md) - 避けるべき useEffect の使い方

## クイックリファレンス

| 必要なこと | 解決策 |
|------------|--------|
| props/state からの値 | レンダー中に計算 |
| 高コストな計算 | `useMemo` |
| prop 変更時に全状態リセット | `key` prop |
| ユーザー操作への応答 | イベントハンドラ |
| 外部システムとの同期 | `useEffect` + クリーンアップ |
| 外部ストアのサブスクリプション | `useSyncExternalStore` |
| コンポーネント間の状態共有 | 状態のリフトアップ |
| データフェッチ | カスタムフック / フレームワーク |

## 使用方法

```
/react-useeffect
```

useEffect を書こうとしている場面で、より適切な代替手段がないか確認するために使用。
