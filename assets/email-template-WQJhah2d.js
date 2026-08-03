import{$ as e,$o as t,Bt as n,Fn as ee,In as r,K as te,Lt as i,Mn as a,Pn as o,Pt as s,Rt as c,Sn as l,Ti as u,b as d,bn as ne,ct as f,fn as p,is as m,kr as re,kt as h,mr as g,nt as ie,or as _,ot as v,pi as y,pn as b,qn as x,rt as ae,st as oe,tn as se,ts as S,u as ce,ui as le,ur as C,vn as w,yn as T,za as E,zt as D}from"./dist-BI4q01Zl.js";import{t as ue}from"./box-vyN7l65K.js";import{t as de}from"./magnifying-glass-DtuRKJzX.js";var O=m(S(),1),k={contract:`契約関連`,consultation:`法務相談`,notification:`通知`,reminder:`リマインド`,other:`その他`},A={contract:`blue`,consultation:`teal`,notification:`yellow`,reminder:`orange`,other:`neutral`},fe=[{id:`TPL-001`,title:`契約書レビュー完了通知`,category:`contract`,subject:`【法務部】契約書レビュー完了のご連絡`,body:`お疲れ様です。法務部の{{担当者名}}です。

ご依頼いただいておりました下記契約書のレビューが完了いたしましたのでご連絡いたします。

案件番号：{{案件番号}}
契約書名：{{契約書名}}

レビュー結果をご確認のうえ、ご不明点等がございましたらお気軽にお問い合わせください。

よろしくお願いいたします。`,updatedAt:`2025/01/15`,createdBy:`山田 太郎`},{id:`TPL-002`,title:`契約書修正依頼`,category:`contract`,subject:`【法務部】契約書の修正についてのお願い`,body:`お疲れ様です。法務部の{{担当者名}}です。

ご提出いただきました下記契約書について、修正をお願いしたい箇所がございます。

案件番号：{{案件番号}}
契約書名：{{契約書名}}

■ 修正箇所
{{修正箇所の詳細}}

修正後、再度ご提出いただけますようお願いいたします。
ご質問がございましたら、お気軽にご連絡ください。

よろしくお願いいたします。`,updatedAt:`2025/01/14`,createdBy:`山田 太郎`},{id:`TPL-003`,title:`NDA締結依頼`,category:`contract`,subject:`【法務部】秘密保持契約書（NDA）の締結について`,body:`お疲れ様です。法務部の{{担当者名}}です。

{{相手方企業名}}様との取引開始にあたり、秘密保持契約書（NDA）の締結が必要となります。

下記の内容をご確認いただき、問題がなければ署名をお願いいたします。

■ 契約概要
・契約当事者：当社 / {{相手方企業名}}
・秘密保持期間：{{期間}}
・対象情報：{{対象情報の範囲}}

締結期限：{{期限日}}

ご不明点がございましたら、お気軽にお問い合わせください。

よろしくお願いいたします。`,updatedAt:`2025/01/10`,createdBy:`佐藤 花子`},{id:`TPL-004`,title:`法務相談受付確認`,category:`consultation`,subject:`【法務部】法務相談の受付確認`,body:`お疲れ様です。法務部の{{担当者名}}です。

ご相談いただきありがとうございます。下記の内容で受け付けいたしました。

案件番号：{{案件番号}}
相談内容：{{相談概要}}
担当者：{{担当者名}}

回答予定日：{{回答予定日}}

内容を確認のうえ、回答させていただきます。
追加情報が必要な場合は、別途ご連絡いたします。

よろしくお願いいたします。`,updatedAt:`2025/01/08`,createdBy:`佐藤 花子`},{id:`TPL-005`,title:`法務相談回答`,category:`consultation`,subject:`【法務部】法務相談への回答`,body:`お疲れ様です。法務部の{{担当者名}}です。

ご相談いただいた件について回答いたします。

案件番号：{{案件番号}}

■ 回答内容
{{回答内容}}

■ 留意事項
{{留意事項}}

上記内容についてご不明点がございましたら、お気軽にお問い合わせください。

よろしくお願いいたします。`,updatedAt:`2025/01/05`,createdBy:`鈴木 一郎`},{id:`TPL-006`,title:`案件ステータス変更通知`,category:`notification`,subject:`【法務部】案件ステータス変更のお知らせ`,body:`お疲れ様です。法務部の{{担当者名}}です。

下記案件のステータスが変更されましたのでお知らせいたします。

案件番号：{{案件番号}}
案件名：{{案件名}}
変更前ステータス：{{変更前ステータス}}
変更後ステータス：{{変更後ステータス}}

詳細はマターマネジメントシステムよりご確認ください。

よろしくお願いいたします。`,updatedAt:`2025/01/03`,createdBy:`鈴木 一郎`},{id:`TPL-007`,title:`契約更新通知`,category:`notification`,subject:`【法務部】契約更新時期のお知らせ`,body:`お疲れ様です。法務部の{{担当者名}}です。

下記契約の更新時期が近づいておりますのでお知らせいたします。

■ 契約情報
・契約書名：{{契約書名}}
・相手方：{{相手方企業名}}
・現契約期間：{{契約開始日}} ～ {{契約終了日}}
・自動更新：{{自動更新の有無}}

更新・解約の判断が必要な場合は、{{対応期限日}}までにご連絡ください。

よろしくお願いいたします。`,updatedAt:`2024/12/28`,createdBy:`田中 美咲`},{id:`TPL-008`,title:`納期リマインド（3日前）`,category:`reminder`,subject:`【法務部】案件納期のリマインド（3日前）`,body:`お疲れ様です。法務部の{{担当者名}}です。

下記案件の納期が3日後に迫っておりますので、リマインドいたします。

案件番号：{{案件番号}}
案件名：{{案件名}}
納期：{{納期日}}

対応状況をご確認いただき、期限内の完了にご協力をお願いいたします。
延長が必要な場合は、早めにご相談ください。

よろしくお願いいたします。`,updatedAt:`2024/12/25`,createdBy:`田中 美咲`},{id:`TPL-009`,title:`納期超過通知`,category:`reminder`,subject:`【法務部】案件納期超過のお知らせ`,body:`お疲れ様です。法務部の{{担当者名}}です。

下記案件が納期を超過しておりますので、ご確認をお願いいたします。

案件番号：{{案件番号}}
案件名：{{案件名}}
納期：{{納期日}}（{{超過日数}}日超過）

至急、対応状況のご確認と完了見込み日のご連絡をお願いいたします。

よろしくお願いいたします。`,updatedAt:`2024/12/20`,createdBy:`高橋 健太`},{id:`TPL-010`,title:`社外向け契約書送付`,category:`other`,subject:`契約書の送付について`,body:`{{相手方担当者名}} 様

いつもお世話になっております。
{{自社名}}の{{担当者名}}でございます。

先日お打ち合わせさせていただきました件につきまして、契約書を送付いたします。

■ 契約書名：{{契約書名}}
■ 部数：{{部数}}
■ ご返送期限：{{返送期限日}}

内容をご確認いただき、問題がなければ署名・捺印のうえご返送くださいますようお願いいたします。

ご不明点等がございましたら、お気軽にお問い合わせください。

何卒よろしくお願い申し上げます。`,updatedAt:`2024/12/18`,createdBy:`高橋 健太`}],j=t(),M=Object.keys(k).map(e=>({value:e,label:k[e]})),N={title:``,category:`contract`,subject:``,body:``},pe=[{id:`title`,name:`テンプレート名`,getValue:e=>e.title,renderCell:({value:e})=>(0,j.jsx)(p,{leading:(0,j.jsx)(g,{children:(0,j.jsx)(u,{})}),children:(0,j.jsx)(b,{title:e,placement:`top-start`,onlyOnOverflow:!0,children:(0,j.jsx)(_,{numberOfLines:1,children:e})})}),sortable:!0},{id:`category`,name:`カテゴリ`,getValue:e=>k[e.category],renderCell:({row:e})=>(0,j.jsx)(p,{children:(0,j.jsx)(d,{color:A[e.category],variant:`outline`,children:k[e.category]})}),sortable:!0},{id:`subject`,name:`件名`,getValue:e=>e.subject,renderCell:({value:e})=>(0,j.jsx)(p,{children:(0,j.jsx)(b,{title:e,placement:`top-start`,onlyOnOverflow:!0,children:(0,j.jsx)(_,{numberOfLines:1,children:e})})}),sortable:!0},{id:`createdBy`,name:`作成者`,getValue:e=>e.createdBy,sortable:!0},{id:`updatedAt`,name:`更新日`,getValue:e=>e.updatedAt,sortable:!0}];function P(){let[t,m]=(0,O.useState)(fe),[S,P]=(0,O.useState)(``),[F,I]=(0,O.useState)(``),[L,R]=(0,O.useState)(1),[z,B]=(0,O.useState)(!1),[me,V]=(0,O.useState)(!1),[he,H]=(0,O.useState)(!1),[U,W]=(0,O.useState)(null),[G,K]=(0,O.useState)(null),[q,ge]=(0,O.useState)(null),[J,Y]=(0,O.useState)(N),X=(0,O.useMemo)(()=>{let e=S.trim().toLowerCase();return t.filter(t=>e?t.title.toLowerCase().includes(e)||t.subject.toLowerCase().includes(e)||t.createdBy.toLowerCase().includes(e):!0).filter(e=>F?e.category===F:!0)},[t,S,F]),Z=X.slice((L-1)*5,L*5),Q=S.trim()!==``||F!==``,_e=e=>{P(e.target.value),R(1)},ve=(e,t)=>{if(t===`go-to-first`){R(1);return}R(e)},ye=()=>{W(null),Y(N),B(!0)},$=e=>{W(e),Y({title:e.title,category:e.category,subject:e.subject,body:e.body}),B(!0)},be=e=>{K(e),V(!0)},xe=e=>{ge(e),H(!0)},Se=()=>{if(!(!J.title.trim()||!J.subject.trim())){if(U)m(e=>e.map(e=>e.id===U.id?{...e,title:J.title,category:J.category,subject:J.subject,body:J.body,updatedAt:new Date().toLocaleDateString(`ja-JP`,{year:`numeric`,month:`2-digit`,day:`2-digit`})}:e));else{let e=`TPL-${String(t.length+1).padStart(3,`0`)}`;m(t=>[{id:e,title:J.title,category:J.category,subject:J.subject,body:J.body,updatedAt:new Date().toLocaleDateString(`ja-JP`,{year:`numeric`,month:`2-digit`,day:`2-digit`}),createdBy:`自分`},...t])}B(!1),R(1)}},Ce=()=>{G&&(m(e=>e.filter(e=>e.id!==G.id)),V(!1),K(null),R(1))},we=e=>{let n=`TPL-${String(t.length+1).padStart(3,`0`)}`;m(t=>[{...e,id:n,title:`${e.title}（コピー）`,updatedAt:new Date().toLocaleDateString(`ja-JP`,{year:`numeric`,month:`2-digit`,day:`2-digit`}),createdBy:`自分`},...t]),R(1)},Te={id:`actions`,name:null,width:`fit`,renderCell:({row:e})=>(0,j.jsx)(p,{children:(0,j.jsxs)(x,{children:[(0,j.jsx)(b,{title:`プレビュー`,children:(0,j.jsx)(C,{size:`small`,variant:`plain`,leading:(0,j.jsx)(g,{size:`small`,children:(0,j.jsx)(u,{})}),onClick:()=>xe(e)})}),(0,j.jsx)(b,{title:`編集`,children:(0,j.jsx)(C,{size:`small`,variant:`plain`,leading:(0,j.jsx)(g,{size:`small`,children:(0,j.jsx)(y,{})}),onClick:()=>$(e)})}),(0,j.jsx)(b,{title:`複製`,children:(0,j.jsx)(C,{size:`small`,variant:`plain`,leading:(0,j.jsx)(g,{size:`small`,children:(0,j.jsx)(E,{})}),onClick:()=>we(e)})}),(0,j.jsx)(b,{title:`削除`,children:(0,j.jsx)(C,{size:`small`,variant:`plain`,color:`danger`,leading:(0,j.jsx)(g,{size:`small`,children:(0,j.jsx)(re,{})}),onClick:()=>be(e)})})]})}),sortable:!1,pinnable:!1,hideable:!1,resizable:!1,reorderable:!1},Ee=[...pe,Te];return(0,j.jsxs)(ie,{children:[(0,j.jsxs)(oe,{children:[(0,j.jsx)(v,{children:(0,j.jsxs)(w,{trailing:(0,j.jsx)(C,{leading:(0,j.jsx)(g,{children:(0,j.jsx)(le,{})}),variant:`solid`,size:`medium`,onClick:ye,children:`新規作成`}),children:[(0,j.jsx)(T,{children:`メールテンプレート`}),(0,j.jsx)(ne,{children:`メール送信時に使用するテンプレートを管理します。テンプレートを活用して、メール作成の効率化を図りましょう。`})]})}),(0,j.jsxs)(f,{children:[(0,j.jsx)(ae,{children:(0,j.jsxs)(ee,{children:[(0,j.jsx)(a,{options:[{value:``,label:`すべてのカテゴリ`},...M],value:F,onChange:e=>{I(e),R(1)},placeholder:`カテゴリで絞り込み`,style:{minWidth:`var(--aegis-layout-width-x6Small)`}}),(0,j.jsx)(r,{}),(0,j.jsx)(te,{placeholder:`テンプレート名・件名・作成者で検索`,shrinkOnBlur:!0,value:S,onChange:_e})]})}),Z.length>0?(0,j.jsxs)(`div`,{style:{display:`grid`,gap:`var(--aegis-space-medium)`},children:[(0,j.jsx)(se,{columns:Ee,rows:Z,getRowId:e=>e.id,stickyHeader:!0,defaultSorting:[{id:`updatedAt`,desc:!0}]}),(0,j.jsx)(e,{page:L,pageSize:5,totalCount:X.length,onChange:ve})]}):(0,j.jsx)(h,{title:Q?`条件に一致するテンプレートがありません`:`テンプレートがありません`,visual:Q?(0,j.jsx)(de,{}):(0,j.jsx)(ue,{}),children:(0,j.jsx)(_,{children:Q?`検索条件を変更して、もう一度お試しください。`:`「新規作成」ボタンからテンプレートを追加してください。`})})]})]}),(0,j.jsx)(s,{open:z,onOpenChange:B,children:(0,j.jsxs)(D,{style:{width:`var(--aegis-layout-width-large)`},children:[(0,j.jsx)(i,{children:(0,j.jsx)(w,{children:(0,j.jsx)(T,{children:U?`テンプレートを編集`:`テンプレートを新規作成`})})}),(0,j.jsx)(n,{children:(0,j.jsxs)(`div`,{style:{display:`grid`,gap:`var(--aegis-space-large)`},children:[(0,j.jsxs)(o,{required:!0,children:[(0,j.jsx)(o.Label,{children:`テンプレート名`}),(0,j.jsx)(l,{value:J.title,onChange:e=>Y(t=>({...t,title:e.target.value})),placeholder:`例：契約書レビュー完了通知`})]}),(0,j.jsxs)(o,{required:!0,children:[(0,j.jsx)(o.Label,{children:`カテゴリ`}),(0,j.jsx)(a,{options:M,value:J.category,onChange:e=>Y(t=>({...t,category:e}))})]}),(0,j.jsxs)(o,{required:!0,children:[(0,j.jsx)(o.Label,{children:`件名`}),(0,j.jsx)(l,{value:J.subject,onChange:e=>Y(t=>({...t,subject:e.target.value})),placeholder:`例：【法務部】契約書レビュー完了のご連絡`})]}),(0,j.jsxs)(o,{children:[(0,j.jsx)(o.Label,{children:`本文`}),(0,j.jsx)(ce,{value:J.body,onChange:e=>Y(t=>({...t,body:e.target.value})),placeholder:`テンプレート本文を入力してください。
変数は {{変数名}} の形式で記述できます。`,minRows:12})]})]})}),(0,j.jsx)(c,{children:(0,j.jsxs)(x,{children:[(0,j.jsx)(C,{variant:`plain`,onClick:()=>B(!1),children:`キャンセル`}),(0,j.jsx)(C,{variant:`solid`,onClick:Se,disabled:!J.title.trim()||!J.subject.trim(),children:U?`保存`:`作成`})]})})]})}),(0,j.jsx)(s,{open:me,onOpenChange:V,children:(0,j.jsxs)(D,{children:[(0,j.jsx)(i,{children:(0,j.jsx)(w,{children:(0,j.jsx)(T,{children:`テンプレートを削除`})})}),(0,j.jsxs)(n,{children:[(0,j.jsxs)(_,{whiteSpace:`pre-line`,children:[`以下のテンプレートを削除します。`,`
`,`この操作は元に戻せません。`]}),G&&(0,j.jsx)(`div`,{style:{marginTop:`var(--aegis-space-medium)`,padding:`var(--aegis-space-medium)`,backgroundColor:`var(--aegis-color-background-neutral-xSubtle)`,borderRadius:`var(--aegis-radius-medium)`},children:(0,j.jsx)(_,{variant:`body.medium.bold`,children:G.title})})]}),(0,j.jsx)(c,{children:(0,j.jsxs)(x,{children:[(0,j.jsx)(C,{variant:`plain`,onClick:()=>V(!1),children:`キャンセル`}),(0,j.jsx)(C,{color:`danger`,onClick:Ce,children:`削除`})]})})]})}),(0,j.jsx)(s,{open:he,onOpenChange:H,children:(0,j.jsxs)(D,{style:{width:`var(--aegis-layout-width-large)`},children:[(0,j.jsx)(i,{children:(0,j.jsx)(w,{children:(0,j.jsx)(T,{children:`テンプレートプレビュー`})})}),(0,j.jsx)(n,{children:q&&(0,j.jsxs)(`div`,{style:{display:`grid`,gap:`var(--aegis-space-large)`},children:[(0,j.jsxs)(`div`,{style:{display:`grid`,gap:`var(--aegis-space-xSmall)`},children:[(0,j.jsx)(_,{variant:`body.small`,color:`subtle`,children:`テンプレート名`}),(0,j.jsx)(_,{variant:`body.medium.bold`,children:q.title})]}),(0,j.jsxs)(`div`,{style:{display:`grid`,gap:`var(--aegis-space-xSmall)`},children:[(0,j.jsx)(_,{variant:`body.small`,color:`subtle`,children:`カテゴリ`}),(0,j.jsx)(`div`,{children:(0,j.jsx)(d,{color:A[q.category],variant:`outline`,children:k[q.category]})})]}),(0,j.jsxs)(`div`,{style:{display:`grid`,gap:`var(--aegis-space-xSmall)`},children:[(0,j.jsx)(_,{variant:`body.small`,color:`subtle`,children:`件名`}),(0,j.jsx)(_,{variant:`body.medium`,children:q.subject})]}),(0,j.jsxs)(`div`,{style:{display:`grid`,gap:`var(--aegis-space-xSmall)`},children:[(0,j.jsx)(_,{variant:`body.small`,color:`subtle`,children:`本文`}),(0,j.jsx)(`div`,{style:{padding:`var(--aegis-space-medium)`,backgroundColor:`var(--aegis-color-background-neutral-xSubtle)`,borderRadius:`var(--aegis-radius-medium)`},children:(0,j.jsx)(_,{variant:`body.medium`,whiteSpace:`pre-wrap`,children:q.body})})]}),(0,j.jsxs)(`div`,{style:{display:`flex`,gap:`var(--aegis-space-large)`},children:[(0,j.jsxs)(`div`,{style:{display:`grid`,gap:`var(--aegis-space-xSmall)`},children:[(0,j.jsx)(_,{variant:`body.small`,color:`subtle`,children:`作成者`}),(0,j.jsx)(_,{variant:`body.medium`,children:q.createdBy})]}),(0,j.jsxs)(`div`,{style:{display:`grid`,gap:`var(--aegis-space-xSmall)`},children:[(0,j.jsx)(_,{variant:`body.small`,color:`subtle`,children:`更新日`}),(0,j.jsx)(_,{variant:`body.medium`,children:q.updatedAt})]})]})]})}),(0,j.jsx)(c,{children:(0,j.jsxs)(x,{children:[(0,j.jsx)(C,{variant:`plain`,onClick:()=>H(!1),children:`閉じる`}),q&&(0,j.jsx)(C,{variant:`subtle`,leading:(0,j.jsx)(g,{size:`small`,children:(0,j.jsx)(y,{})}),onClick:()=>{H(!1),$(q)},children:`編集`})]})})]})})]})}export{P as EmailTemplatePage};