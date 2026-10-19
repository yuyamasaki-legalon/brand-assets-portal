(() => {
  'use strict';
  const A = window.TomoniArt;
  const assets = window.TOMONI_ASSETS;
  const sources = window.TOMONI_SOURCE;
  const escape = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const art = (kind='buddy',variant='normal',className='art') => `<div class="${className}" aria-hidden="true">${kind==='buddy'?A.buddy(variant):A[kind]()}</div>`;
  const detail = (page,label='この場面を詳しく') => `<button class="detail-link" type="button" data-source="${page}">${label}</button>`;
  const header = (en,title,lead='') => `<div class="reveal"><p class="eyebrow">${en}</p><h2>${title}</h2>${lead?`<p class="lead">${lead}</p>`:''}</div>`;
  const step = (n,title,text,role='') => `<div class="step"><div class="step-index">${n}</div><h3>${title}</h3><p>${text}</p>${role?`<span class="role">${role}</span>`:''}</div>`;
  const scenes = [];
  const add = (id,title,en,group,theme,source,content,extraClass='') => scenes.push({id,title,en,group,theme,source,content,extraClass});

  add('intro','IPの未来を、ともに。','PROLOGUE','PROLOGUE','mint',1,`
    <div class="cover-copy">
      <p class="eyebrow reveal">PROTECT THE IP. UNLOCK THE POSSIBILITIES.</p>
      <h1 class="reveal delay-1">IPを守る。<br><em>好きを、広げる。</em></h1>
      <p class="lead reveal delay-2">IPを守り、売上を上げる。<br>クリエイターと企業をつなぐ、<br>IP管理・権利処理のAIプラットフォーム。</p>
      <div class="cover-bottom-note reveal delay-3"><span class="dot"></span>事業構想 / 2026.10 <span>CONCEPT PRESENTATION</span></div>
    </div>
    <div class="hero-art" aria-hidden="true"><div class="hero-ip">IP</div><div class="hero-orbit"></div>${art('buddy','guard','hero-buddy')}<div class="hero-card"><i class="mini-art"></i></div><div class="hero-stamp">PROTECT<br>&amp; CREATE<span>好きの、その先へ。</span></div><i class="star hero-spark"></i><div class="dotted hero-dots"></div></div>
  `,'cover');

  add('problem','作品が育つほど、増える負担。','THE PROBLEM','PROLOGUE','paper',2,`
    ${header('01 / THE PROBLEM','作品が育つほど、増える負担。','使いたい人はいる。届けたい作品もある。<br>でも、取引の間に「確認する仕事」が積み重なる。')}
    <div class="problem-grid">
      <div class="problem-item"><span class="problem-number">01</span>${art('creator','normal','problem-icon')}<h3>権利者</h3><p>個別の申請や審査に追われ、<br>小さな案件を拾いきれない。</p></div>
      <div class="problem-item"><span class="problem-number">02</span>${art('company','normal','problem-icon')}<h3>利用する企業</h3><p>使えるIPや相談先が見えず、<br>許諾までの見通しが立たない。</p></div>
      <div class="problem-item"><span class="problem-number">03</span>${art('buddy','search','problem-icon')}<h3>運用担当者</h3><p>無断利用の監視と収益報告が<br>分散し、管理に時間がかかる。</p></div>
    </div>
    <p class="punchline reveal delay-3">その負担は、小さなチームほど大きくなる。</p>
    ${detail(2)}
  `,'problems');

  add('suika','実体験：スイカゲームの急ヒット。','A REAL STORY','CASE STUDY','lavender',3,`
    <div class="split">
      <div>${header('02 / A REAL STORY','大ヒットの、<br class="mobile-break">その裏で。','私はスイカゲームのIP担当をしていました。<br>当時の日本法人は約10人。法務専任者もいませんでした。')}
        <div class="case-events">
          <div class="case-event"><span>01</span><div><strong>デザイナーの私が、版権管理を兼務。</strong><p>本業はプロジェクター。急成長に、管理の体制が追いつかない。</p></div></div>
          <div class="case-event"><span>02</span><div><strong>非公式プライズへの苦情が、公式へ。</strong><p>「品質が低い」「可愛くない」。ブランドの信用が心配になった。</p></div></div>
          <div class="case-event"><span>03</span><div><strong>出所を探し、直接連絡するところから。</strong><p>店舗からメーカーを調べ、差止め・廃棄・補償を要求。<br>自分の名前で相手に連絡する怖さもあった。</p></div></div>
        </div>
        <p class="source-line">体制・対応の内容は、当時担当した本人の経験談。<br><a href="https://x.com/SuikaGame_jp/status/1733426432699986090" target="_blank" rel="noopener noreferrer">公式も類似景品への注意喚起を公表（2023.12.9）↗</a></p>
      </div>
      <div class="case-visual reveal delay-1"><div class="case-halo"></div><img class="suika-logo" src="${assets.suikaLogo}" alt="スイカゲーム"><img class="suika-fruit" src="${assets.suika}" alt="スイカゲームのスイカのキャラクター"><div class="complaint">これ、公式ですか？</div><div class="complaint complaint--second">対応まで、自分ひとりで。</div><span class="case-badge">SUDDEN<br>HIT!</span><div class="case-credit">開発・運営：Aladdin X（XGIMIグループ）<br>© 2021 Aladdin X Inc.</div></div>
    </div>
    ${detail(3,'実体験と公開情報の区分を見る')}
  `,'case');

  add('case-value','担当者一人に、集中させない。','THE OPPORTUNITY','CASE STUDY','paper',4,`
    ${header('03 / THE OPPORTUNITY','ひとりで背負う仕事を、仕組みへ。','スイカゲームの経験に、TOMONI AIを当てはめると。')}
    <div class="comparison"><div class="compare-head"><span>BACK THEN</span><span></span><span>WITH TOMONI AI</span></div>
      <div class="compare-row"><p>模倣品を探し、<br>出所を自分で調べる</p><span aria-hidden="true">→</span><p>AIが候補を検知・記録。<br>運用チームが確認と対応管理を支援。</p></div>
      <div class="compare-row"><p>権利や対応手順が<br>わからない</p><span aria-hidden="true">→</span><p>権利情報と方針を整理。<br>法的判断・交渉は弁護士へ連携。</p></div>
      <div class="compare-row"><p>担当者が実名で、<br>相手へ直接連絡する</p><span aria-hidden="true">→</span><p>運用窓口と専門家との連携で、<br>対外対応を支える。</p></div>
    </div>
    <p class="punchline reveal delay-3">小さな会社や個人にも、専門部署のような支えを。</p>
    <p class="fine-print">構想上の利用イメージです。この事例での導入実績や、差止め・補償の実現を示すものではありません。</p>
    ${detail(4)}
  `,'case-value');

  add('pillars','守る。そして、広げる。','OUR CONCEPT','PRODUCT','mint',5,`
    ${header('04 / OUR CONCEPT','ふたつの価値を、ひとつに。','IPをつくる人が、創作を続けられるように。<br>作品を使いたい企業が、安心して活用できるように。')}
    <div class="pillars-stage"><div class="pillar pillar--left"><span class="pillar-en">01 / PROTECT</span><h3>権利を守る。</h3><p>無断利用の候補を見つけ、<br>記録・確認・対応へつなぐ。</p></div><div class="pillar-center"><div class="mini-orbit"></div>${A.buddy('guard')}</div><div class="pillar pillar--right"><span class="pillar-en">02 / GROW</span><h3>売上を上げる。</h3><p>作品を見つけてもらい、<br>正規の商用利用へつなぐ。</p></div></div>
    ${detail(5,'プラットフォームの全体像を見る')}
  `,'pillars');

  add('platform','IPのまわりに、同じテーブルを。','THE PLATFORM','PRODUCT','paper',5,`
    ${header('05 / THE PLATFORM','IPのまわりに、<br>同じテーブルを。','登録から許諾、契約、収益分配まで。<br>権利者と企業が、同じ基盤でやり取りする。')}
    <div class="platform-flow"><div class="platform-party">${art('creator')}<strong>権利者</strong><p>作品・利用条件を登録<br>利用申請を確認・承認</p></div><div class="platform-core"><span class="core-chip">CONNECT THE POSSIBILITIES</span><div class="core-name">TOMONI AI</div><p>ショーケース・マッチング<br>条件整理・契約・分配の支援</p></div><div class="platform-party">${art('company')}<strong>利用企業</strong><p>目的に合うIPを探す<br>用途・予算を指定して申請</p></div></div>
    <div class="roles-strip reveal delay-3"><span>IP制作会社</span><span>一般企業</span><span>個人クリエイター</span><span>学生</span></div>
    <p class="fine-print">参加できる企業を業種で限定しません。作品の登録時には、権利の範囲と公開・利用の条件を確認します。</p>
    ${detail(5)}
  `,'platform');

  add('licensing','最後に決めるのは、権利者。','HUMAN IN THE LOOP','PRODUCT','lavender',6,`
    ${header('06 / HUMAN IN THE LOOP','最後に決めるのは、<br>権利者。','AIが確認や契約の実務を支え、作品をどう使うかは、本人が判断する。')}
    <div class="step-track">
      ${step('01','探す・申請する','企業が用途・地域・期間・予算を提示。<br>目的に合う作品を探す。','利用企業')}
      ${step('02','条件を整理する','不足情報や条件の違いを整理。<br>確認すべき点を明らかにする。','AI・運用')}
      ${step('03','許諾を判断する','企業・用途・表現を確認。<br>受け入れられる条件で承認する。','権利者')}
      ${step('04','契約・分配する','合意した条件を契約に反映。<br>利用報告と支払履歴を記録する。','AI・運用')}
    </div>
    <p class="fine-print">権利帰属、例外、最終的な許諾は人が確認します。AI学習・生成への利用許諾は、作品登録とは別に合意する方針です。</p>
    ${detail(6)}
  `,'licensing');

  add('protection','見つける。その後まで。','PROTECTION WORKFLOW','PRODUCT','dark',8,`
    ${header('07 / PROTECTION WORKFLOW','見つける。<br>その後まで。','監視だけで終わらせず、権利者と専門家の判断につなぐ。')}
    <div class="protect-stage"><div class="scan-board" aria-label="監視対象から確認が必要な利用候補を見つけるイメージ">${Array.from({length:6},(_,i)=>`<div class="scan-tile ${i===4?'flagged':''}">${A.buddy(i===4?'search':'normal')}</div>`).join('')}<div class="scan-line" aria-hidden="true"></div></div>
      <div class="protection-list"><p><b>01</b><span><strong>発見</strong>　AIが利用候補を検知</span></p><p><b>02</b><span><strong>整理</strong>　記録・契約範囲・利用状況を確認</span></p><p><b>03</b><span><strong>判断</strong>　権利者・専門家が方針を決定</span></p><p><b>04</b><span><strong>対応</strong>　申告・正規利用案内・専門家連携</span></p></div></div>
    <p class="fine-print">AIが見つけるのは「侵害の疑い」です。法的判断・交渉などは、対象国での権限と専門家体制を確認して設計します。</p>
    ${detail(8,'役割と対応範囲を確認する')}
  `,'protection');

  add('free','見つけるところまで、0円。','OPEN TO EVERY CREATOR','BUSINESS','lime',10,`
    <div class="split"><div>${header('08 / OPEN TO EVERY CREATOR','入口も、監視も、0円。','企業も、学生も、個人も。<br>IPを登録し、無断利用の候補を見つけるところまで無料。')}
      <div class="free-labels reveal delay-2"><span>登録 0円</span><span>監視 0円</span><span>侵害候補の発見 0円</span></div>
      <p class="lead reveal delay-3">発見後の対応は、権利者の依頼と承認から。<br>手続き・専門家連携・回収管理を支える。</p>
      <p class="fine-print">有料の対応を自動で始めません。当社の支援範囲と対価を契約で定め、請求・交渉・訴訟等は各国の専門家が担います。</p>${detail(10,'無料の発見から、有料の対応へ')}</div>
      <div class="free-stage"><div class="big-zero" aria-label="登録・監視・発見は0円">0<span>円</span></div>${art('buddy','celebrate')}</div></div>
  `,'free');

  add('business','生まれた価値から、収益を。','THE BUSINESS MODEL','BUSINESS','paper',9,`
    <div class="split"><div>${header('09 / THE BUSINESS MODEL','生まれた価値から、<br>収益を。','登録・監視・発見は無料。<br>発見後の対応支援と、ライセンスの成約で収益をつくる。')}
      <div class="business-lines"><div class="business-line reveal delay-1"><span class="number">01</span><div><strong>侵害対応・回収支援</strong><p>証拠整理・手続き運用・専門家連携・回収管理。<br>実入金に対する当社固有の対価20%を計画。</p></div></div><div class="business-line reveal delay-2"><span class="number">02</span><div><strong>ライセンス成約</strong><p>利用法人が、許諾料とは別に<br>成約手数料20%を支払う計画。</p></div></div></div>${detail(9,'対価と料金設計の前提を見る')}</div>
      <div class="invoice-art"><div class="receipt-title">VALUE RECEIPT <span>↗</span></div><div class="invoice-row"><span>登録・監視・候補の発見</span><b>0円</b></div><div class="invoice-row"><span>対応・回収の支援</span><b>実入金 × 20%</b></div><div class="invoice-row"><span>ライセンスの成約</span><b>許諾料 × 20%</b></div><p class="invoice-note">料率・回収条件は事業計画上の前提です。<br>権利者の回収金、実費、専門家報酬は当社売上に含めません。<br>20%に含まれる支援へ、別の手続料は重ねません。</p><span class="invoice-check" aria-hidden="true">✓</span></div></div>
  `,'business');

  add('market','世界TAM1.4兆円、3年目の年商50億円へ。','THE MARKET OPPORTUNITY','MARKET','mint',11,`
    ${header('10 / THE MARKET OPPORTUNITY','守る・広げる、<br class="mobile-break">その市場へ。','文化・エンタメIPの権利取引と侵害対応を、当社の年間売上機会として捉える。')}
    <div class="market-values">
      <div class="market-value"><span class="abbr">TAM</span><div class="amount"><strong>1.4</strong><span>兆円 / 年</span></div><p>世界の年間売上機会</p><div class="range">権利取引・管理 約4,417億円<br>侵害対応・回収支援 1兆円</div></div>
      <div class="market-value"><span class="abbr">SAM</span><div class="amount"><strong>3,000</strong><span>億円 / 年</span></div><p>長期に提供可能な市場</p><div class="range">長期：2,962.8億円<br>3年目まで：約1,100億円</div></div>
      <div class="market-value"><span class="abbr">SOM</span><div class="amount"><strong>50</strong><span>億円 / 年</span></div><p>3年目の年間売上目標</p><div class="range">回収支援 30億円 ＋ 成約 20億円<br>3年目までのSAMの約4.7%</div></div>
    </div>
    <div class="market-plan reveal delay-3">
      <div class="market-free-note"><span>登録・監視・発見</span><strong>0<span>円</span></strong><small>有料の対応は依頼・承認後に</small></div>
      <div class="market-revenue-plan"><span class="market-plan-label">3年間の年間売上計画 <small>単位：億円</small></span><div class="revenue-sequence"><div><small>1年目</small><strong>0.3</strong></div><i aria-hidden="true">→</i><div><small>2年目</small><strong>7.6</strong></div><i aria-hidden="true">→</i><div class="revenue-goal"><small>3年目</small><strong>50</strong></div></div></div>
    </div>
    <p class="fine-print market-footnote">2026年10月18日算定。公表統計と事業計画上の仮定による試算です。TAM・SAM・SOMは加算せず、回収金・許諾料の取扱高と当社売上を区別します。</p>
    <div class="market-detail-actions">${detail(32,'TAM・SAMの算定を見る')}${detail(40,'3年間の売上計画を見る')}${detail(44,'50億円の獲得条件を見る')}</div>
  `,'market market-current');

  add('gtm','無料で供給を集め、事例で法人を獲る。','GO TO MARKET','GTM','lavender',13,`
    ${header('11 / GO TO MARKET','無料で供給を集め、<br>事例で法人を獲る。','個人・学校・IPを持つ企業・使いたい企業。4カテゴリすべての参加を広げる。')}
    <div class="gtm-category-grid">
      <div class="gtm-category"><span class="category-no">01</span>${art('creator','normal','category-art')}<h3>個人クリエイター</h3><p>すでにファンがいる<br>個人・兼業のつくり手</p><span class="category-action">作品とファンを届ける</span></div>
      <div class="gtm-category"><span class="category-no">02</span>${art('school','normal','category-art')}<h3>専門学校・学生</h3><p>アニメ・漫画・デザイン等<br>創作系学科と学校提携</p><span class="category-action">次の創作を育てる</span></div>
      <div class="gtm-category"><span class="category-no">03</span>${art('buddy','guard','category-art')}<h3>IP保有・制作法人</h3><p>アニメ・出版・ゲームなど<br>商用IPを持つ企業</p><span class="category-action">IPを守り、活用する</span></div>
      <div class="gtm-category"><span class="category-no">04</span>${art('company','normal','category-art')}<h3>IP周辺企業</h3><p>グッズ・広告・イベントなど<br>IPを使いたい企業</p><span class="category-action">IPを使い、企画にする</span></div>
    </div>
    <p class="gtm-free-rule reveal delay-3"><b>ALL FREE</b><span>登録・監視・発見は無料。収益は、対応・回収支援とライセンス成約から。</span></p>
    ${detail(13,'4カテゴリと参考母数を見る')}
  `,'gtm-summary');

  add('gtm-steps','無料登録から、守る実績、売れる実績へ。','BUILD THE FIRST PROOFS','GTM','paper',14,`
    ${header('12 / BUILD THE FIRST PROOFS','無料登録から、<br class="mobile-break">守る・売れる実例へ。','3ステップで実績を積み上げ、次の法人提案につなげる。')}
    <div class="gtm-proof-flow">
      <div class="gtm-proof-step"><span class="proof-no">01</span><div class="proof-art">${A.creator()}</div><h3>無料登録を増やす</h3><p>4カテゴリすべてへ参加を案内。<br>作品・権利・利用条件を整える。</p><span class="proof-result">作品と参加者が集まる</span></div>
      <span class="proof-arrow" aria-hidden="true">→</span>
      <div class="gtm-proof-step"><span class="proof-no">02</span><div class="proof-art">${A.buddy('guard')}</div><h3>権利を守れた<br>事例をつくる</h3><p>侵害候補の確認から対応支援まで。<br>権利者と専門家で実例をつくる。</p><span class="proof-result">守る価値が伝わる</span></div>
      <span class="proof-arrow" aria-hidden="true">→</span>
      <div class="gtm-proof-step"><span class="proof-no">03</span><div class="proof-art">${A.company()}</div><h3>売上・利益の<br>事例をつくる</h3><p>企業とIPのマッチングを成立させ、<br>収益につながる実例を増やす。</p><span class="proof-result">使う価値が伝わる</span></div>
    </div>
    <p class="proof-feedback reveal delay-3"><span aria-hidden="true">↶</span>つくった事例を、次の法人提案へ。</p>
    <p class="fine-print">これから実証する進め方です。権利者の承認を得た事例を提案に活用します。</p>${detail(14,'3ステップの内容を見る')}
  `,'gtm-proofs');

  add('gtm-channels','個人はコミュニティ、法人は事例で。','TURN PROOF INTO REACH','GTM','mint',15,`
    ${header('13 / TURN PROOF INTO REACH','個人はコミュニティ、<br>法人は事例で。','クリエイター同士のつながりと、既存の法人接点。集め方を分けて進める。')}
    <div class="gtm-channel-grid">
      <div class="gtm-channel"><div class="channel-heading">${art('creator','normal','channel-art')}<div><span class="channel-kicker">CREATORS</span><h3>コミュニティで広げる</h3></div></div><p>pixivFANBOX・コミケ参加サークルの<br>コミュニティを入口に、作品登録を広げる。</p><div class="gtm-channel-tags"><span>X</span><span>Facebook</span><span>Instagram</span></div><p class="channel-note">個人アカウントでも拡散。学校とは学科・授業単位でつながる。</p></div>
      <div class="gtm-channel"><div class="channel-heading">${art('company','normal','channel-art')}<div><span class="channel-kicker">BUSINESS</span><h3>事例を軸に開拓する</h3></div></div><p>守れた・収益につながった事例を前面に。<br>LegalOn導入企業への訪問を検討する。</p><div class="visit-candidates"><span>セガ</span><span>ココナラ</span><span>ダイソー</span><span>日本ゼオン</span><span>BuzzFeed Japan</span></div><p class="channel-note">アニメ・出版・ゲーム会社はリスト化して案内。企業名はPDF記載の訪問候補で、IP課題・紹介可否・面談実績は未確認です。</p></div>
    </div>
    <p class="gtm-free-rule reveal delay-3"><b>B TO B</b><span>広告を行う場合は、法人獲得を優先する。</span></p>
    ${detail(15,'集め方と訪問候補の位置付けを見る')}
  `,'gtm-acquisition');

  add('economics','増やす前に、採算を見る。','MAKE THE ECONOMICS WORK','BUSINESS','lime',26,`
    ${header('14 / MAKE THE ECONOMICS WORK','増やす前に、<br>採算を見る。','無料の監視原価と、対応・成約を支える人の時間まで。<br>入金までの期間を含めて、事業の採算を確かめる。')}
    <div class="unit-formulas"><div class="unit-formula reveal delay-1"><strong>回収支援の売上</strong><p>実入金案件数 × 平均実回収額 × 当社対価20%<br>当社固有の支援対価から、証拠・運用・連携費を管理。</p></div><div class="unit-formula reveal delay-2"><strong>成約の売上</strong><p>成約利用法人 × 年間取引数 × 許諾料 × 手数料20%<br>営業・条件調整・契約・分配の工数を引いて粗利を見る。</p></div><div class="unit-formula reveal delay-3"><strong>原価と資金繰り</strong><p>無料監視のAI・保存・確認費用と、受託後の運用費。<br>翌年度の回収入金と、実費立替を分けて管理する。</p></div></div>
    <p class="fine-print">裁判等の実費・専門家報酬・権利者の回収金は当社売上に含めません。同じ権利・期間の対価を二重計上せず、20%内の支援へ別の手続料を重ねません。</p>${detail(26)}
  `,'economics');

  add('network','積み重なるほど、つながる。','COMPOUNDING KNOWLEDGE','PRODUCT','dark',27,`
    ${header('15 / COMPOUNDING KNOWLEDGE','実績が、次の取引を支える。','権利条件、承認の履歴、利用企業との接点。<br>継続する運用の中に、競争力を築く仮説。')}
    <div class="network"><div class="network-node">権利条件の構造化<br><small>地域・期間・媒体・承認基準</small></div><div class="network-node">審査・契約の支援<br><small>繰り返す確認を減らす</small></div><div class="network-node">許諾・取引の履歴<br><small>承認条件・差戻し理由を蓄積</small></div><div class="network-node">利用企業との接点<br><small>需要を権利者へ返す</small></div><svg class="network-lines" viewBox="0 0 700 260" preserveAspectRatio="none" aria-hidden="true"><path d="M130 0H580Q630 0 630 50V210Q630 260 580 260H120Q70 260 70 210V50Q70 0 120 0Z" fill="none" stroke="#d1ff70" stroke-width="2.5"/><path d="M600 0L582 -7M600 0L582 7M630 235L623 218M630 235L637 218M95 260L112 253M95 260L112 267M70 25L63 42M70 25L77 42" stroke="#d1ff70" fill="none" stroke-width="2.5"/></svg>${art('buddy','normal','network-center')}</div>
    <p class="fine-print">登録数だけで競争力が実証されるとは考えません。監視の確認結果を含む運用履歴を、誤検知低減と取引条件の整理に役立てます。</p>${detail(27)}
  `,'network-scene');

  add('roadmap','ひとつの実証から、世界へ。','EARN THE RIGHT TO SCALE','NEXT','mint',28,`
    ${header('16 / EARN THE RIGHT TO SCALE','ひとつの実証から、<br>世界へ。','商用IPと法人取引で運用を整え、専門家と提供できる地域を広げる。')}
    <div class="roadmap"><div class="roadmap-step reveal"><div class="roadmap-en">YEAR 1</div><h3>国内で運用をつくる</h3><p>商用IPの契約・証拠・入金管理。<br>対応受託2,000件、利用法人100社。</p><span class="roadmap-state">年商0.3億円 / 成約300件</span></div><div class="roadmap-step reveal delay-1"><div class="roadmap-en">YEAR 2</div><h3>海外対応を広げる</h3><p>現地専門家のネットワークを拡大。<br>対応受託1.5万件、利用法人400社。</p><span class="roadmap-state">年商7.6億円 / 回収入金400件</span></div><div class="roadmap-step reveal delay-2"><div class="roadmap-en">YEAR 3</div><h3>回収と再発注を増やす</h3><p>先行案件3,000件の回収入金。<br>利用法人1,000社で年1万取引。</p><span class="roadmap-state">年商50億円 / 長期SAM約3,000億円へ</span></div></div>
    <p class="fine-print">事業計画上の目標です。対象国の資格・対価設計、現地費用、実入金率と回収期間を検証して展開します。</p>${detail(40,'3年間の成立条件と売上計画を見る')}
  `,'roadmap-scene');

  add('together','IPの未来を、ともに。','LET’S MAKE THE FIRST PROOF','NEXT','lavender',29,`
    <div class="split"><div><span class="tilt-label reveal">LET’S MAKE THE FIRST PROOF.</span><h2 class="reveal delay-1">IPの未来を、<br>ともに。</h2><p class="lead reveal delay-2">作品を預ける権利者。<br>新しい企画をつくる企業。<br>次の創作を育てる学校。<br>最初の実証を、一緒につくりたい。</p><div class="close-actions reveal delay-3"><button class="primary-button" type="button" data-source="29">共同実証の計画を見る<span aria-hidden="true">↗</span></button><button class="detail-link" type="button" data-goto-id="references">根拠と詳細へ</button></div><small>求める協力：対象IP・法人案件・学校窓口・実証責任者の選定。<br>本資料は事業構想と検証計画です。数値は目標案・仮説を含みます。</small></div><div class="closing-art">${art('buddy','celebrate')}<i class="star closing-star" aria-hidden="true"></i></div></div>
  `,'closing');

  add('references','仮定は、検証で更新する。','THE REFERENCE LIBRARY','REFERENCE','paper',45,`
    ${header('17 / THE REFERENCE LIBRARY','仮定は、<br>検証で更新する。','詳細資料46項目の本文・表・補足・出典を、この資料の中に収録。<br>プレゼンの流れを止めず、必要なときに根拠まで確かめられる。')}
    <div class="source-groups"><div class="source-group reveal delay-1"><span class="source-en">MARKET</span><h3>TAM・SAM・SOM</h3><p>世界TAM約1.4兆円と、<br>長期SAM約3,000億円の算定式。<br>3年目SOM50億円の成立条件。</p>${detail(32,'市場の計算を見る')}</div><div class="source-group reveal delay-2"><span class="source-en">GTM</span><h3>営業・獲得・採算</h3><p>4カテゴリ・3ステップ・集め方。<br>法人訪問の候補と、参考母数。<br>数値計画は補足資料で確認。</p>${detail(13,'GTMの概要を見る')}</div><div class="source-group reveal delay-3"><span class="source-en">SOURCES</span><h3>公開情報と実体験</h3><p>Licensing International、CISAC、<br>文部科学省などの公開資料。<br>スイカ事例の証言と公開情報。</p>${detail(45,'出典の一覧を見る')}</div></div>
    <p class="fine-print">市場・事業計画の算定日：2026年10月18日。市場額は当社の年間サービス売上への換算値です。関連市場の売上・被害額・登録者数を直接加算しません。</p>
    <button class="primary-button" type="button" data-goto="0" style="margin-top:22px">最初のページへ<span aria-hidden="true">↑</span></button>
  `,'references');

  const presentation=document.getElementById('presentation');
  presentation.innerHTML=scenes.map((s,i)=>`<section id="${s.id}" class="scene ${s.extraClass}" data-theme="${s.theme}" data-scene="${i}" aria-labelledby="scene-heading-${i}"><div class="scene-inner">${s.content}</div></section>`).join('');
  document.querySelectorAll('.scene').forEach((s,i)=>{const h=s.querySelector('h1,h2');if(h)h.id=`scene-heading-${i}`;s.style.setProperty('--next',({mint:'#d8f1ed',paper:'#fbf9f4',lavender:'#dfd7fc',lime:'#e6ffb5',dark:'#15262d'})[scenes[i+1]?.theme||'mint']);});
  const sections=[...document.querySelectorAll('.scene')];
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let current=0,moveUntil=0,scrollFrame=0,activeSource=1,navigating=false,navigationFrame=0;
  const indexDialog=document.getElementById('index-dialog');
  const detailsDialog=document.getElementById('details-dialog');
  const currentText=document.getElementById('position-current');
  const totalText=document.getElementById('position-total');
  const titleText=document.getElementById('position-title');
  const nextButton=document.getElementById('next');
  const previousButton=document.getElementById('previous');
  const progress=document.getElementById('reading-progress');
  totalText.textContent=String(scenes.length).padStart(2,'0');

  const groupStarts=scenes.reduce((acc,s,i)=>{if(!acc.some(a=>a.name===s.group))acc.push({name:s.group,index:i});return acc;},[]);
  document.getElementById('chapter-rail').innerHTML=groupStarts.map(g=>`<button type="button" data-goto="${g.index}" data-group="${g.name}" aria-label="${escape(g.name)}の章へ"><span>${g.name}</span><i aria-hidden="true"></i></button>`).join('');
  document.getElementById('index-grid').innerHTML=scenes.map((s,i)=>`<button type="button" class="index-entry" data-goto="${i}"><span>${String(i+1).padStart(2,'0')}</span>${escape(s.title)}</button>`).join('');
  // Fit the narrative composition to shorter desktop screens; mobile remains a flowing page.
  function fitScenes(){
    const desktop=window.innerWidth>900;
    sections.forEach(section=>{
      const inner=section.querySelector('.scene-inner');
      inner.style.removeProperty('--scene-fit');
      if(!desktop)return;
      const style=getComputedStyle(section);
      const available=window.innerHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom)-2;
      inner.style.setProperty('--scene-fit',String(Math.min(1,available/Math.max(1,inner.offsetHeight))));
    });
  }
  fitScenes();
  const legacySceneIds={report:'gtm-steps',creators:'gtm',school:'gtm',buyers:'gtm-channels',ads:'gtm-channels','ninety-days':'gtm-steps',targets:'gtm-steps'};
  const sceneIndex=id=>scenes.findIndex(s=>s.id===(legacySceneIds[id]||id));
  const pageAnnouncement=document.getElementById('page-announcement');
  function setCurrent(i,announce=true){
    if(i===current&&sections[i].classList.contains('is-current'))return;
    sections[current]?.classList.remove('is-current');
    current=i;sections[i].classList.add('is-current');
    const s=scenes[i];
    currentText.textContent=String(i+1).padStart(2,'0');titleText.textContent=s.group;
    progress.style.width=`${((i+1)/scenes.length*100).toFixed(3)}%`;
    previousButton.disabled=i===0;
    document.getElementById('next-label').textContent=i===scenes.length-1?'BACK TO START':'NEXT CHAPTER';
    nextButton.setAttribute('aria-label',i===scenes.length-1?'最初のページへ':'次のページへ');
    nextButton.querySelector('b').textContent=i===scenes.length-1?'↑':'↓';
    document.body.classList.toggle('dark-scene',s.theme==='dark');
    const bg={mint:'#d8f1ed',paper:'#fbf9f4',lavender:'#dfd7fc',lime:'#e6ffb5',dark:'#15262d'}[s.theme];
    document.body.style.setProperty('--bg',bg);document.querySelector('meta[name="theme-color"]').content=bg;
    document.querySelectorAll('.chapter-rail button').forEach(b=>b.classList.toggle('active',b.dataset.group===s.group));
    document.querySelectorAll('.index-entry').forEach(b=>{const active=Number(b.dataset.goto)===i;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
    if(announce)pageAnnouncement.textContent=`${i+1} / ${scenes.length}：${s.title}`;
    try{history.replaceState(null,'',`#${s.id}`);}catch(_){}
  }
  function go(i,behavior){
    i=Math.max(0,Math.min(scenes.length-1,i));
    if(indexDialog.open)indexDialog.close();
    cancelAnimationFrame(navigationFrame);
    const start=window.scrollY,target=sections[i].offsetTop;
    const immediate=behavior==='instant'||reduced.matches||Math.abs(target-start)<2;
    const html=document.documentElement;
    navigating=true;moveUntil=Infinity;
    html.style.scrollSnapType='none';html.style.scrollBehavior='auto';
    setCurrent(i);
    function finish(){
      window.scrollTo({top:target,behavior:'instant'});
      navigating=false;moveUntil=performance.now()+40;
      html.style.scrollSnapType='';html.style.scrollBehavior='';
      setCurrent(i);
    }
    if(immediate){finish();return;}
    const began=performance.now(),duration=560;
    function frame(now){
      const t=Math.min(1,(now-began)/duration);
      const eased=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
      window.scrollTo({top:start+(target-start)*eased,behavior:'instant'});
      if(t<1)navigationFrame=requestAnimationFrame(frame);else finish();
    }
    navigationFrame=requestAnimationFrame(frame);
  }
  nextButton.addEventListener('click',()=>go(current===scenes.length-1?0:current+1));
  previousButton.addEventListener('click',()=>go(current-1));
  document.getElementById('menu-open').addEventListener('click',()=>indexDialog.showModal());
  document.querySelectorAll('[data-close-dialog]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
  [indexDialog,detailsDialog].forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
  document.addEventListener('click',e=>{const byId=e.target.closest('[data-goto-id]');if(byId){const i=sceneIndex(byId.dataset.gotoId);if(i>=0)go(i);return;}const goto=e.target.closest('[data-goto]');if(goto){go(Number(goto.dataset.goto));return;}const source=e.target.closest('[data-source]');if(source){openDetails(Number(source.dataset.source));return;}if(e.target.closest('[data-open-details]'))openDetails(scenes[current].source);});
  document.querySelector('.wordmark').addEventListener('click',e=>{e.preventDefault();go(0);});
  async function toggleFullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();}catch(_){pageAnnouncement.textContent='全画面表示はこのブラウザーでは利用できません。';}}
  document.getElementById('fullscreen').addEventListener('click',toggleFullscreen);
  document.addEventListener('fullscreenchange',()=>document.getElementById('fullscreen').setAttribute('aria-label',document.fullscreenElement?'全画面を終了':'全画面にする'));
  document.addEventListener('keydown',e=>{
    if(indexDialog.open||detailsDialog.open||e.ctrlKey||e.metaKey||e.altKey||e.target.closest('input,textarea,select,[contenteditable="true"]'))return;
    if(e.code==='Space'&&e.target.closest('button,a,[role="button"]'))return;
    if(e.key==='ArrowDown'||e.key==='PageDown'||e.code==='Space'){e.preventDefault();if(!e.repeat&&performance.now()>moveUntil)go(Math.min(current+1,scenes.length-1));}
    else if(e.key==='ArrowUp'||e.key==='PageUp'){e.preventDefault();if(!e.repeat&&performance.now()>moveUntil)go(current-1);}
    else if(e.key==='Home'){e.preventDefault();go(0);}
    else if(e.key==='End'){e.preventDefault();go(scenes.length-1);}
    else if(e.key.toLowerCase()==='m'){e.preventDefault();indexDialog.showModal();}
    else if(e.key.toLowerCase()==='d'){e.preventDefault();openDetails(scenes[current].source);}
    else if(e.key.toLowerCase()==='f'){e.preventDefault();toggleFullscreen();}
  });
  function trackScroll(){
    if(scrollFrame)return;
    scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;if(navigating||performance.now()<moveUntil)return;let closest=0,min=Infinity;sections.forEach((s,i)=>{const d=Math.abs(s.getBoundingClientRect().top);if(d<min){min=d;closest=i;}});setCurrent(closest,false);});
  }
  window.addEventListener('scroll',trackScroll,{passive:true});
  window.addEventListener('scrollend',()=>{if(!navigating){moveUntil=0;trackScroll();}},{passive:true});
  let resizeFrame=0;
  window.addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{fitScenes();if(!indexDialog.open&&!detailsDialog.open)go(current,'instant');});},{passive:true});
  window.addEventListener('load',()=>{fitScenes();if(!indexDialog.open&&!detailsDialog.open)go(current,'instant');},{once:true});
  window.addEventListener('hashchange',()=>{const i=sceneIndex(location.hash.slice(1));if(i>=0)go(i);});
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)entry.target.classList.add('is-seen');},{threshold:.15});sections.forEach(s=>observer.observe(s));

  const sourceSearch=document.getElementById('source-search');
  const sourceList=document.getElementById('library-list');
  const sourceDoc=document.getElementById('library-document');
  function sourceTitle(s){return (s.title.startsWith('参考付録')?s.texts.find(t=>t!==s.title&&t.length>6):s.title)||s.title;}
  function listSources(query=''){
    const q=query.trim().toLowerCase();
    const filtered=sources.filter(s=>!q||[sourceTitle(s),...s.texts,s.notes,JSON.stringify(s.tables)].join('\n').toLowerCase().includes(q));
    document.getElementById('source-count').textContent=`${filtered.length}件`;
    sourceList.innerHTML=filtered.length?filtered.map(s=>`<button type="button" class="library-item ${s.number===activeSource?'active':''}" data-document="${s.number}" ${s.number===activeSource?'aria-current="page"':''}><span>${String(s.number).padStart(2,'0')}</span>${escape(sourceTitle(s))}</button>`).join(''):'<p class="library-empty">該当する資料はありません。</p>';
  }
  function noteHTML(t){return escape(t).replace(/https?:\/\/[^\s<>]+/g,url=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);}
  function showSource(number){
    activeSource=number;const s=sources.find(s=>s.number===number)||sources[0];
    const texts=s.texts.filter(t=>t!==s.title&&!/^\d{2}$/.test(t));
    sourceDoc.innerHTML=`<div class="doc-kicker">REFERENCE ${String(s.number).padStart(2,'0')} / ${sources.length}</div><h3>${escape(sourceTitle(s))}</h3>${texts.map(t=>`<p>${escape(t)}</p>`).join('')}${s.tables.map(table=>`<div class="doc-table"><table><thead><tr>${table[0].map(c=>`<th scope="col">${escape(c)}</th>`).join('')}</tr></thead><tbody>${table.slice(1).map(row=>`<tr>${row.map(c=>`<td>${escape(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`).join('')}${(s.charts||[]).map(c=>`<div class="doc-table"><table><thead><tr><th scope="col">項目</th>${c.series.map(a=>`<th scope="col">${escape(a.name)}</th>`).join('')}</tr></thead><tbody>${c.categories.map((cat,i)=>`<tr><th scope="row">${escape(cat)}</th>${c.series.map(a=>`<td>${escape(a.values[i])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`).join('')}<details open><summary>補足・前提・出典</summary><div class="notes-body">${noteHTML(s.notes)}</div></details>`;
    sourceDoc.scrollTop=0;listSources(sourceSearch.value);
  }
  sourceList.addEventListener('click',e=>{const b=e.target.closest('[data-document]');if(b)showSource(Number(b.dataset.document));});
  sourceSearch.addEventListener('input',()=>listSources(sourceSearch.value));
  function openDetails(number=1){sourceSearch.value='';showSource(number);if(!detailsDialog.open)detailsDialog.showModal();const active=sourceList.querySelector('.active');if(active)active.scrollIntoView({block:'nearest'});}
  listSources();
  const initial=Math.max(0,sceneIndex(location.hash.slice(1)));
  setCurrent(initial,false);
  if(initial>0)requestAnimationFrame(()=>go(initial,'instant'));
  document.fonts.ready.then(()=>{document.documentElement.classList.add('fonts-ready');fitScenes();if(!indexDialog.open&&!detailsDialog.open)go(current,'instant');});
  // A minimal API supports local visual and keyboard verification without a server.
  window.TomoniDeck={get current(){return current;},get count(){return scenes.length;},scenes:scenes.map(({id,title,source,group})=>({id,title,source,group})),go,openDetails};
})();
