---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80ad-a5e6-e89de90e4121"
category: "Typography"
---
# Label

<synced_block url="https://www.notion.so/15831669571280ada5e6e89de90e4121#17c316695712805a90bce726872309aa">
💡 **Labelは、formの見出しとして使用するテキストコンポーネントです。<br>htmlでいうところの`label`タグに該当します。**
</synced_block>

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/15831669571280ada5e6e89de90e4121#1683166957128044abe2cab4b61c2e89"/>

---

# 使用時の注意点
<synced_block url="https://www.notion.so/15831669571280ada5e6e89de90e4121#17c31669571280cdaa95eeaf5662e36b">
デザイン作業時に単体で使用する機会はありません。<br>Aegisが提供するコンポーネントに含まれています。
</synced_block>

---

# Q&A
Q: 以下のような情報UIの作成時にLabelは使用するか？
	▶ 画像
		<img src="https://prod-files-secure.s3.us-west-2.amazonaws.com/803260f9-e001-4840-b333-c9883e56eaf6/3e302a20-576e-4e2f-8d68-08567d7c9d17/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-01-07_16.09.39.png"/>
A: ~~実装上はdd・dt・dlを使って作成する。デザイン上はlabelでなくbodyを使用する。~~
デザイン、実装両方において<mention-database url="https://www.notion.so/15831669571280028950ccda24da1fa4"/>の使用を推奨します。
```html
<dl>
	<dt>作成日時</dt>
	<dd>2024/12/13 18:42</dd>
	<dt>自社名</dt>
	<dd>未入力</dd>
	<dt>取引先名</dt>
	<dd>未入力</dd>
</dl>
```
[https://developer.mozilla.org/ja/docs/Web/HTML/Element/dl](https://developer.mozilla.org/ja/docs/Web/HTML/Element/dl)

<notion-embed url="https://www.notion.so/15831669571280ada5e6e89de90e4121#1683166957128077995cd2d00cefd23e"/>
