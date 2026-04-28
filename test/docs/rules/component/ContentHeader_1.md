---
paths: src/**/*.{ts,tsx}
notion_page_id: "24631669-5712-806f-b039-f0553b7abb2b"
category: "Layout"
---
# ContentHeader (1)

💡 **ContentHeaderは、ページ内のタイトルと主要操作の表示を行うコンポーネントです。<br>タイトルの主要操作の配置やGapのばらつきを抑制することが主な目的です。**

---
▶# 👉Examples
	

---

# 使用時の注意点
### 使用回数について
<columns>
	<column>
		なるべくPageLayoutのMainやPaneの最上部に、それぞれ１度だけの使用にとどめてください。

	</column>
	<column>
		
	</column>
</columns>
---

### サブテキストについて
<columns>
	<column>
		ContentHeaderにはTitleの上下にサブテキストを表示できます。<br>

	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		<synced_block url="https://www.notion.so/246316695712806fb039f0553b7abb2b#2463166957128013adc8ccd0430aceee">
			**⚠️**<span color="red">**文章や説明を入れることは禁止です。<br>オブジェクトの補足情報を入れるために使用してください。**</span>
		</synced_block>

	</column>
	<column>
		
	</column>
</columns>

---

### 併用できるコンポーネントについて
⚠️<span color="red">**併用するコンポーネントがない場合、ContentHeaderではなく、Titleを使用してください。**</span>
<columns>
	<column>
		右側に使用できるのはButton,IconButton, ButtonGroup, Link<br>の4つのみです。
	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		左側に使用できるのはIconButtonのみで、戻るを意味する\[\\<\]のみが使用できます。
	</column>
	<column>
		
	</column>
</columns>
<br>
---

### Titleが不要な場合について
<columns>
	<column>
		ContentHeaderはTitleとButton類を同時に使用するためのコンポーネントです。
		Titleが不要な場合はそれらのコンポーネントを単体で使用してください。

	</column>
	<column>
		
	</column>
</columns>

---

# Q&A
Q: \{内容を書く\}
A: \{内容を書く\}
