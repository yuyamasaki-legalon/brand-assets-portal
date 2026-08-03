# Brand Asset Portal Local Mirror

このディレクトリには、別サーバー移設用にローカル配信する実ファイルを配置します。

- `downloads/`: 実際にダウンロードさせる元ファイル
- `thumbnails/`: 必要に応じて別管理したいサムネイル

現在のマッピング定義は `src/pages/sandbox/brand-asset-portal/local-mirror-manifest.json` にあります。

manifest 再生成:

```bash
pnpm run brand-asset-portal:mirror-manifest
```
