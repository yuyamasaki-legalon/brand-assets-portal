# 9. Sandboxページの組み方ガイド（実装順序）

Sandboxでページを試作する際は、以下の順序を必ず守り、後戻りを防ぎます。実装例は `src/pages/template/` を参照し、Sandboxの既存コードはサンプルとして使用しません。

1. **【ルール】PageLayoutで外枠を決める**  
   必要なSlot（Header/Sidebar/Paneなど）だけを配置し、枠組みを先に固める。枠が決まるまでコンテンツ部品を増やさない。
2. **【ルール】中身をレイアウトコンポーネントで組む**  
   PageLayout内ではAegisのレイアウト系コンポーネントとデザイントークンでセクションを区切り、余白や整列を決める。独自のmargin/paddingを積み増すのは避ける。
3. **【ルール】variant / size / spacingを当てる**  
   ボタン・フォーム・テキストなどは既存のvariantとサイズを選ぶ。余白はデザイントークン（`--aegis-space-*`など）を使い、独自の値やカスタムCSSを増やさない。

> **AI向けショートプロンプト**  
> 「Sandboxページは PageLayout→内部レイアウト→variant/spacing の順で組む。Aegisコンポーネントとデザイントークンのみ使用し、例は `src/pages/template/` を参照。」
