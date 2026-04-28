---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-8077-b816-c7da86181dfe"
category: "Actions"
---
# SplitButton

💡 **SplitButtonは、主要なアクションを実行するボタンと、関連する他のアクションを選択できるドロップダウンメニューを組み合わせたコンポーネントです。**<br>実装上はButtonGroupのVariantである「[Attached](https://www.chromatic.com/component?appId=634618c98b322242afd2ae10&csfId=components-buttongroup--attached&buildNumber=3277&k=67580af56f0662716dbc8957-1200px-interactive-true&h=3&b=-2)」で再現されます。

---
▶# 👉Examples
	

---

# 使用時の注意点
<columns>
	<column>
		ドロップダウンの内容は必ずメインのラベルと同じコンテキストを持った操作を入れるようにしてください。<br>重要な操作や機能はSplitButtonに格納しないでください。

	</column>
	<column>
		
	</column>
</columns>

---

# Q&A
Q: SplitButtonの片側だけをdisabledにすることはできますか？
A: はい、可能です。SplitButtonは内部的にButtonGroup (Attached) で構成されているため、各ボタンのdisabled状態を個別に設定できます。
Q: {内容を書く}
A: {内容を書く}
