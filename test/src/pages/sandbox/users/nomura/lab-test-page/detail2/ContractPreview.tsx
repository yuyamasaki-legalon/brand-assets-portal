import { Text } from "@legalforce/aegis-react";
import type { CSSProperties } from "react";

// A4サイズの比率（210mm x 297mm）をピクセルで表現（縮尺適用）
const A4_WIDTH = 595; // 72dpi基準
const A4_HEIGHT = 842;
const SCALE = 0.85; // プレビュー用縮尺

const pageStyle: CSSProperties = {
  width: A4_WIDTH * SCALE,
  minHeight: A4_HEIGHT * SCALE,
  backgroundColor: "white",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)",
  padding: `${40 * SCALE}px ${50 * SCALE}px`,
  fontFamily: "'Yu Mincho', 'Hiragino Mincho ProN', serif",
  fontSize: 11 * SCALE,
  lineHeight: 1.8,
  color: "#1a1a1a",
  position: "relative",
  boxSizing: "border-box",
};

const titleStyle: CSSProperties = {
  textAlign: "center",
  fontSize: 18 * SCALE,
  fontWeight: "bold",
  marginBottom: 30 * SCALE,
  letterSpacing: 4,
};

const sectionTitleStyle: CSSProperties = {
  fontWeight: "bold",
  marginTop: 20 * SCALE,
  marginBottom: 8 * SCALE,
};

const paragraphStyle: CSSProperties = {
  marginBottom: 12 * SCALE,
  textIndent: "1em",
  textAlign: "justify",
};

const pageNumberStyle: CSSProperties = {
  position: "absolute",
  bottom: 20 * SCALE,
  left: 0,
  right: 0,
  textAlign: "center",
  fontSize: 10 * SCALE,
  color: "#666",
};

const signatureAreaStyle: CSSProperties = {
  marginTop: 40 * SCALE,
  display: "flex",
  justifyContent: "space-between",
  gap: 40 * SCALE,
};

const signatureBoxStyle: CSSProperties = {
  flex: 1,
  padding: 16 * SCALE,
  border: "1px solid #ccc",
  minHeight: 120 * SCALE,
};

interface ContractPageProps {
  pageNumber: number;
  totalPages: number;
  children: React.ReactNode;
}

function ContractPage({ pageNumber, totalPages, children }: ContractPageProps) {
  return (
    <div style={pageStyle}>
      {children}
      <div style={pageNumberStyle}>
        {pageNumber} / {totalPages}
      </div>
    </div>
  );
}

export function ContractPreview() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        alignItems: "center",
        padding: "var(--aegis-space-large)",
        backgroundColor: "var(--aegis-color-background-neutral-subtle)",
        borderRadius: "var(--aegis-radius-medium)",
      }}
    >
      <Text variant="body.small" color="subtle" style={{ alignSelf: "flex-start" }}>
        ドキュメントプレビュー（A4 × 3ページ）
      </Text>

      {/* 1ページ目: 契約書タイトル・前文・第1条〜第3条 */}
      <ContractPage pageNumber={1} totalPages={3}>
        <div style={titleStyle}>業 務 委 託 契 約 書</div>

        <div style={paragraphStyle}>
          株式会社●●（以下「甲」という。）と株式会社△△（以下「乙」という。）は、甲乙間において、次のとおり業務委託契約（以下「本契約」という。）を締結する。
        </div>

        <div style={sectionTitleStyle}>第1条（目的）</div>
        <div style={paragraphStyle}>
          甲は乙に対し、別紙に定める業務（以下「本業務」という。）を委託し、乙はこれを受託する。
        </div>

        <div style={sectionTitleStyle}>第2条（委託料）</div>
        <div style={paragraphStyle}>1. 甲は乙に対し、本業務の対価として、別紙に定める委託料を支払う。</div>
        <div style={paragraphStyle}>
          2.
          前項の委託料には、本業務の遂行に必要な一切の費用（交通費、通信費その他の経費を含む。）が含まれるものとする。ただし、甲が事前に書面で承認した費用については、この限りでない。
        </div>

        <div style={sectionTitleStyle}>第3条（支払条件）</div>
        <div style={paragraphStyle}>
          1.
          甲は、乙からの請求書を受領した月の翌月末日までに、前条に定める委託料を乙の指定する銀行口座に振り込む方法により支払う。なお、振込手数料は甲の負担とする。
        </div>
        <div style={paragraphStyle}>
          2. 甲は、本業務の成果物に瑕疵がある場合、乙が当該瑕疵を修補するまで委託料の支払いを拒むことができる。
        </div>

        <div style={sectionTitleStyle}>第4条（業務の遂行）</div>
        <div style={paragraphStyle}>
          1. 乙は、本契約に定める条件に従い、善良な管理者の注意をもって本業務を遂行するものとする。
        </div>
        <div style={paragraphStyle}>
          2.
          乙は、本業務の全部又は一部を第三者に再委託してはならない。ただし、甲の事前の書面による承諾を得た場合はこの限りでない。
        </div>
      </ContractPage>

      {/* 2ページ目: 第5条〜第9条 */}
      <ContractPage pageNumber={2} totalPages={3}>
        <div style={sectionTitleStyle}>第5条（秘密保持）</div>
        <div style={paragraphStyle}>
          1.
          甲及び乙は、本契約に関連して相手方から開示された技術上又は営業上の情報であって、秘密である旨明示されたもの（以下「秘密情報」という。）を、相手方の事前の書面による承諾なく、第三者に開示又は漏洩してはならない。
        </div>
        <div style={paragraphStyle}>
          2. 前項の規定にかかわらず、次の各号のいずれかに該当する情報は、秘密情報に含まれない。
        </div>
        <div style={{ ...paragraphStyle, paddingLeft: 20 * SCALE }}>
          (1) 開示を受けた時点で既に公知であった情報
          <br />
          (2) 開示を受けた後、自己の責めに帰すべき事由によらず公知となった情報
          <br />
          (3) 開示を受けた時点で既に自己が保有していた情報
          <br />
          (4) 正当な権限を有する第三者から秘密保持義務を負うことなく取得した情報
          <br />
          (5) 相手方の秘密情報によらず独自に開発した情報
        </div>

        <div style={sectionTitleStyle}>第6条（知的財産権）</div>
        <div style={paragraphStyle}>
          1.
          本業務の遂行により生じた成果物に係る著作権（著作権法第27条及び第28条に定める権利を含む。）その他の知的財産権は、委託料の完済をもって乙から甲に移転する。
        </div>
        <div style={paragraphStyle}>2. 乙は、甲に対し、前項の成果物について著作者人格権を行使しないものとする。</div>

        <div style={sectionTitleStyle}>第7条（損害賠償）</div>
        <div style={paragraphStyle}>
          1.
          甲及び乙は、本契約に違反して相手方に損害を与えた場合、相手方に対し、当該違反に起因する直接かつ現実に生じた通常の損害を賠償する責任を負う。
        </div>
        <div style={paragraphStyle}>
          2.
          前項の損害賠償の累計総額は、債務不履行、不法行為その他請求原因の如何にかかわらず、本契約に基づき甲が乙に支払った委託料の総額を上限とする。
        </div>

        <div style={sectionTitleStyle}>第8条（契約期間）</div>
        <div style={paragraphStyle}>
          本契約の有効期間は、本契約締結日から1年間とする。ただし、期間満了の1ヶ月前までに甲乙いずれからも書面による解約の申し出がない場合、本契約は同一条件でさらに1年間更新されるものとし、以後も同様とする。
        </div>

        <div style={sectionTitleStyle}>第9条（解除）</div>
        <div style={paragraphStyle}>
          1.
          甲及び乙は、相手方が次の各号のいずれかに該当する場合、何らの催告を要せず、直ちに本契約を解除することができる。
        </div>
      </ContractPage>

      {/* 3ページ目: 第9条続き〜署名欄 */}
      <ContractPage pageNumber={3} totalPages={3}>
        <div style={{ ...paragraphStyle, paddingLeft: 20 * SCALE }}>
          (1) 本契約に違反し、相当期間を定めた催告にもかかわらず当該違反が是正されないとき
          <br />
          (2) 支払停止若しくは支払不能となったとき、又は手形若しくは小切手が不渡りとなったとき
          <br />
          (3) 破産手続開始、民事再生手続開始、会社更生手続開始又は特別清算開始の申立てがあったとき
          <br />
          (4) 差押え、仮差押え、仮処分又は競売の申立てを受けたとき
          <br />
          (5) 租税公課を滞納し、督促を受けたとき
          <br />
          (6) その他信用状態に重大な変化が生じたとき
        </div>

        <div style={sectionTitleStyle}>第10条（反社会的勢力の排除）</div>
        <div style={paragraphStyle}>
          甲及び乙は、自己又は自己の役員若しくは従業員が、暴力団、暴力団員、暴力団関係企業、総会屋、社会運動標榜ゴロ、政治活動標榜ゴロ、特殊知能暴力集団その他の反社会的勢力に該当しないことを表明し、保証する。
        </div>

        <div style={sectionTitleStyle}>第11条（存続条項）</div>
        <div style={paragraphStyle}>
          第5条（秘密保持）、第6条（知的財産権）、第7条（損害賠償）及び本条の規定は、本契約終了後もなお有効に存続する。
        </div>

        <div style={sectionTitleStyle}>第12条（管轄裁判所）</div>
        <div style={paragraphStyle}>
          本契約に関する一切の紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とする。
        </div>

        <div style={sectionTitleStyle}>第13条（協議事項）</div>
        <div style={paragraphStyle}>
          本契約に定めのない事項又は本契約の解釈に疑義が生じた事項については、甲乙誠意をもって協議の上、解決するものとする。
        </div>

        <div style={{ ...paragraphStyle, marginTop: 30 * SCALE }}>
          本契約の成立を証するため、本書2通を作成し、甲乙記名押印の上、各1通を保有する。
        </div>

        <div style={{ textAlign: "right", marginTop: 20 * SCALE }}>令和6年10月22日</div>

        <div style={signatureAreaStyle}>
          <div style={signatureBoxStyle}>
            <div style={{ marginBottom: 8 * SCALE }}>（甲）</div>
            <div>東京都千代田区丸の内一丁目1番1号</div>
            <div style={{ marginTop: 8 * SCALE }}>株式会社●●</div>
            <div style={{ marginTop: 8 * SCALE }}>代表取締役　山田 太郎　㊞</div>
          </div>
          <div style={signatureBoxStyle}>
            <div style={{ marginBottom: 8 * SCALE }}>（乙）</div>
            <div>東京都港区六本木二丁目2番2号</div>
            <div style={{ marginTop: 8 * SCALE }}>株式会社△△</div>
            <div style={{ marginTop: 8 * SCALE }}>代表取締役　佐藤 花子　㊞</div>
          </div>
        </div>
      </ContractPage>
    </div>
  );
}
