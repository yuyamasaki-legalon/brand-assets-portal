# サービスレベルレイアウトルール

サービスレベル集約モード（`--service`）で生成するマップのレイアウトルール。

## 基本方針

- ハブ画面（dashboard）を左端に配置
- 主要フローを左→右に展開
- ディレクトリ構造からグループを推定し、`GroupNode` コンテナを自動生成

## レイアウト定数

```
CARD_WIDTH  = 280
CARD_HEIGHT = 480
H_GAP       = 220  (水平方向の間隔)
V_GAP       = 170  (垂直方向の間隔、グループ間余白含む)
GROUP_PAD   = 120  (GroupNode の内側余白)
```

## 配置アルゴリズム

### 1. ハブ画面の配置

ダッシュボード / ホーム画面を `(0, 中央Y)` に配置する。

識別条件:
- ノード ID が `dashboard` または `home`
- badges に `Hub` を含む
- エッジのソースとして最も多く参照されている

### 2. 列ベース配置

ハブからの最短距離（ホップ数）で列を決定する:

| ホップ数 | X 位置 |
|---------|--------|
| 0 (ハブ) | `0` |
| 1 | `CARD_WIDTH + H_GAP` |
| 2 | `(CARD_WIDTH + H_GAP) * 2` |
| N | `(CARD_WIDTH + H_GAP) * N` |

同じ列内のノードは Y 方向に `CARD_HEIGHT + V_GAP` 間隔で配置する。

### 3. グループの推定

ディレクトリ構造からグループを推定する:

| ディレクトリパターン | グループ名 |
|--------------------|-----------|
| `case/`, `case-*` | Core Workflow |
| `contract*`, `file-*`, `review*`, `esign*` | Core Workflow |
| `search*`, `template*`, `review-console*` | Knowledge & Tools |
| `loa*`, `ai-*` | AI & Assistant |
| `setting*`, `admin*` | Settings |

推定できないノードは「Other」グループに分類する。

### 4. GroupNode の生成

各グループに対して `GroupNode` を生成する:

```typescript
{
  id: `group-${groupName}`,
  type: "group",
  position: { x: groupMinX - GROUP_PAD, y: groupMinY - GROUP_PAD },
  data: {
    label: groupDisplayName,
    width: groupMaxX - groupMinX + CARD_WIDTH + GROUP_PAD * 2,
    height: groupMaxY - groupMinY + CARD_HEIGHT + GROUP_PAD * 2,
  },
  style: { zIndex: -1 },
  selectable: false,
  draggable: false,
}
```

## エッジのルーティング

- 同グループ内: `smoothstep` タイプ
- グループ間: `smoothstep` タイプ（同じだが、将来的にスタイル分離可能）
- すべて `type: "animated"` を使用
