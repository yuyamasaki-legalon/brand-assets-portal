---
notion_page_id: "25e31669-5712-808a-b55a-ffc2e3ccf715"
---
# Layouts（画面レイアウト）

この章では、プロダクトで共通して利用される、画面全体の骨格となるレイアウトの定義を行います。

# 3.1 基本原則

* **【ルール】** すべての画面レイアウトは、デザインシステム「Aegis」が提供する`PageLayout`コンポーネントをベースに構築します。
    * **（理由）** プロダクト全体のレイアウトに一貫性を持たせ、開発効率を向上させるためです。また、`PageLayout`コンポーネントは、ヘッダー、サイドバー、メインコンテンツ領域などの配置を柔軟に制御できるよう設計されており、将来の機能拡張にも対応しやすくなります。
    * **【補足】** `PageLayout`コンポーネントの全体構成は以下の通りです。
      ```mermaid
      graph LR;
        PageLayout("
          <table border='1' cellspacing='0' cellpadding='10' style='border-collapse: collapse;'>
            <tr>
              <td valign='top'>
                <b>Sidebar</b>
              </td>
              <td valign='top'>
                <table border='1' cellspacing='0' cellpadding='5' width='100%' style='border-collapse: collapse;'>
                  <tr><td align='center'><b>Header</b></td></tr>
                  <tr>
                    <td valign='top' align='center'>
                      <table border='1' cellspacing='0' cellpadding='5' width='100%' style='border-collapse: collapse;'>
                        <tr>
                          <td valign='top'>SideNav<br/>(Start)</td>
                          <td valign='top'>
                            <b>Pane(Start)</b>
                          </td>
                          <td valign='top'>
                            <b>Main</b>
                          </td>
                          <td valign='top'>
                            <b>Pane(End)</b>
                          </td>
                          <td valign='top'>SideNav<br/>(End)</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr><td align='center'><b>Footer</b></td></tr>
                </table>
              </td>
            </tr>
          </table>
        ");
      ```
    * **【補足】** `Footer` Slotは、複数ステップに渡る設定画面（ウィザード形式）の「次へ」「戻る」ボタンや、ページ全体の変更を確定する「保存」ボタンなど、画面下部に固定で表示したい主要なアクションを配置するために利用します。
    > 【公式ドキュメント】
    > - [PageLayoutのお話](https://www.notion.so/legalforce/PageLayout-cc9f3cac73b14ba7b2b093320eb6187d)
* **【ルール】** `Sidebar`と`SideNav(Start)`を同時に使用してはいけません。
    * **（理由）** `Sidebar`と`SideNav(Start)`は、どちらもマウスホバーに反応して表示状態が変化するインタラクションを持つ可能性があります。これらを併用すると、ユーザーが`Sidebar`内の要素を操作しようとした際に、意図せず`SideNav`が反応してしまい、操作を妨げる原因となるためです。
* **【ルール】** `PageLayout`コンポーネントが提供するセマンティックな領域（ランドマーク）を意図通りに利用します。
    * **（理由）** `PageLayout`は、スクリーンリーダーの利用者がページ全体の構造を把握し、主要なセクション（ヘッダー、ナビゲーション、メインコンテンツなど）へ直接移動できるよう、HTMLのランドマークを適切に出力する責務を負っているためです。これにより、キーボード操作におけるフォーカス順序の論理性を担保します。

# 3.2 レスポンシブ対応

* **【ルール】** すべてのページは、PCブラウザのウィンドウ幅`1280px`での表示を担保します。
    * **（理由）** ユーザーがコンテンツ全体を一度に視認でき、快適に操作できる標準的な画面サイズを保証するためです。
* **【指針】** ウィンドウ幅が`1920px`に達するまではコンテンツエリアを拡張し、それ以上の場合はページ全体の幅を固定して左右に余白を表示することを推奨します。
    * **（理由）** 横幅が人間の視界に一度に収まる範囲を超えると、左右の端にあるコンテンツが認識されにくくなり、ユーザーが重要な情報を見落とす原因となります。コンテンツの可読性と発見性を両立するため、原則として最大幅を設けます。
    * **【補足】** ただし、利用者の画面解像度がほぼ特定されている社内ツールなど、多様なウィンドウ幅を考慮する必要がない場合は、画面全体に表示する方が有用なケースもあります。
* **【ルール】** ウィンドウ幅が`1280px`より小さい場合でも、レイアウトが崩れず、主要な機能が利用できることを保証します。
    * **（理由）** 閲覧環境に依存せず、すべてのユーザーがプロダクトのコアな機能を利用できる状態を担保するためです。
    * **【補足】** 現状のAegis `PageLayout`コンポーネントの実装では、ウィンドウ幅が`1000px`を下回ると、ページ全体に水平スクロールが発生します。
    > NOTE: この水平スクロールの仕様は、将来的にアクセシビリティ要件（WCAG 2.1 達成基準 1.4.10 Reflow）との整合性をより高めるために、変更される可能性があります。
    > TODO: 各プロダクトチームは、本ガイドラインを参考にターゲットユーザーと利用状況を考慮し、デザインシステムAGとの協議の上で正式な最小サポート幅を決定してください。

# 3.3 基本レイアウトパターン

* **【指針】** 多くの画面はオブジェクト指向UIの考え方に基づき、「オブジェクトの一覧」と「各オブジェクトの詳細・編集」という基本的な構造で設計されます。レイアウトパターンを選択する際は、まずこの原則に立ち返り、ユーザーに提示する情報が「一覧」なのか「詳細」なのかを明確に定義してください。適切な情報設計がなされていれば、採用すべきレイアウトパターンは自ずと定まります。

ここでは、この「一覧/詳細」モデルを基本としつつ、設定画面やチャットUIといった特定の用途に特化したものを含め、代表的なレイアウトパターンをいくつか紹介します。`PageLayout`コンポーネントが提供する各Slotの組み合わせは、プロダクトの特性や要件に応じて柔軟に決定され、例えば`Header`や`Sidebar`の有無は、各プロダクトのナビゲーション戦略に依存します。

* **パターン1: 一覧画面**
    * **構成要素 (Slot):** `Header`, `Sidebar`, `Main`
    * **用途:** データの一覧表示や、管理画面の基本的なレイアウトとして使用します。左側の`Sidebar`にはナビゲーションメニューを配置します。
    * **レイアウト図:**
      ```mermaid
      graph LR;
        PageLayout("
          <table border='1' cellspacing='0' cellpadding='10' style='border-collapse: collapse;'>
            <tr>
              <td valign='top'>
                <b>Sidebar</b>
              </td>
              <td valign='top'>
                <table border='1' cellspacing='0' cellpadding='5' width='100%' style='border-collapse: collapse;'>
                  <tr><td align='center'><b>Header</b></td></tr>
                  <tr>
                    <td valign='top' align='center'>
                      <table border='1' cellspacing='0' cellpadding='5' width='100%' style='border-collapse: collapse;'>
                        <tr>
                          <td valign='top'>
                            <b>Main</b>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        ");
      ```

* **パターン1.1: 一覧 ＋ 詳細表示**
    * **構成要素 (Slot):** `Header`, `Sidebar`, `Main`, `Pane(End)`
    * **用途:** `Main`エリアに表示された一覧（テーブルなど）から特定の項目を選択した際に、その詳細情報を画面右側の`Pane(End)`に表示します。画面遷移することなく、一覧と詳細を同時に確認できるため、効率的なデータ閲覧や編集が可能です。
    * **レイアウト図:**
      ```mermaid
      graph LR;
        PageLayout("
          <table border='1' cellspacing='0' cellpadding='10' style='border-collapse: collapse;'>
            <tr>
              <td valign='top'>
                <b>Sidebar</b>
              </td>
              <td valign='top'>
                <table border='1' cellspacing='0' cellpadding='5' width='100%' style='border-collapse: collapse;'>
                  <tr><td align='center'><b>Header</b></td></tr>
                  <tr>
                    <td valign='top' align='center'>
                      <table border='1' cellspacing='0' cellpadding='5' width='100%' style='border-collapse: collapse;'>
                        <tr>
                          <td valign='top'>
                            <b>Main</b>
                          </td>
                          <td valign='top'>
                            <b>Pane(End)</b>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        ");
      ```

* **パターン2: 詳細・編集画面**
    * **構成要素 (Slot):** `Header`, `Main`, `Pane(End)`, `SideNav(End)`
    * **用途:** 一覧から選択した特定のアイテムの詳細情報を表示したり、編集したりする画面で使用します。右側の`Pane`には関連情報や編集フォームを配置し、`Pane`内の情報量が多い場合には`SideNav(End)`でページ内ナビゲーションを提供できます。
    * **【補足】** 編集画面など、ページ内での操作が多くなる場合は、`Header`のオプションである`SubHeader`に`Toolbar`を配置することで、ユーザーがアクションを見つけやすくなります。
    * **レイアウト図:**
      ```mermaid
      graph LR;
        PageLayout("
          <table border='1' cellspacing='0' cellpadding='10' style='border-collapse: collapse;'>
            <tr>
              <td valign='top'>
                <table border='1' cellspacing='0' cellpadding='5' width='100%' style='border-collapse: collapse;'>
                  <tr><td align='center'><b>Header</b></td></tr>
                  <tr>
                    <td valign='top' align='center'>
                      <table border='1' cellspacing='0' cellpadding='5' width='100%' style='border-collapse: collapse;'>
                        <tr>
                          <td valign='top'>
                            <b>Main</b>
                          </td>
                          <td valign='top'>
                            <b>Pane(End)</b>
                          </td>
                          <td valign='top'>SideNav<br/>(End)</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        ");
      ```

* **【指針】** `SideNav(End)`は、`Pane(End)`内のコンテンツに対するページ内ナビゲーションとして利用できますが、その追加は慎重に検討してください。
    * **（理由）** コンテンツを過度に分割し、`SideNav(End)`のメニュー項目が増えすぎると、ユーザーは情報の全体像を把握しにくくなり、かえって目的の機能や情報を見つけづらくなります。ナビゲーションは、ユーザーを助けるために存在しますが、不必要に複雑化すると認知負荷を高める原因となります。

* **パターン3: 設定画面**
    * **構成要素 (Slot):** `Header`, `Sidebar`, `Pane(Start)`, `Main`
    * **用途:** ユーザー設定やシステム設定など、複数のカテゴリに分かれた設定項目を持つ画面で使用します。グローバルナビゲーション（`Sidebar`）には「設定」のような大項目のみを配置し、設定ページ遷移後に`Pane(Start)`に`NavList`コンポーネントを配置して、詳細な設定項目へのナビゲーションを提供します。
    * **レイアウト図:**
      ```mermaid
      graph LR;
        PageLayout("
          <table border='1' cellspacing='0' cellpadding='10' style='border-collapse: collapse;'>
            <tr>
              <td valign='top'>
                <b>Sidebar</b>
              </td>
              <td valign='top'>
                <table border='1' cellspacing='0' cellpadding='5' width='100%' style='border-collapse: collapse;'>
                  <tr><td align='center'><b>Header</b></td></tr>
                  <tr>
                    <td valign='top' align='center'>
                      <table border='1' cellspacing='0' cellpadding='5' width='100%' style='border-collapse: collapse;'>
                        <tr>
                          <td valign='top'>
                            <b>Pane(Start)</b>
                          </td>
                          <td valign='top'>
                            <b>Main</b>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        ");
      ```

* **パターン4: Chat UI**
    * **構成要素 (Slot):** `Header`, `Sidebar`, `Main`, `Pane(End)`
    * **用途:** チャット形式のインターフェースを持つ画面で使用します。`Main`エリアでチャットの対話を行い、`Pane(End)`でその対話を通じて生成された成果物（ドキュメント、データなど）を表示する構成を基本とします。
    * **レイアウト図:**
      ```mermaid
      graph LR;
        PageLayout("
          <table border='1' cellspacing='0' cellpadding='10' style='border-collapse: collapse;'>
            <tr>
              <td valign='top'>
                <b>Sidebar</b>
              </td>
              <td valign='top'>
                <table border='1' cellspacing='0' cellpadding='5' width='100%' style='border-collapse: collapse;'>
                  <tr><td align='center'><b>Header</b></td></tr>
                  <tr>
                    <td valign='top' align='center'>
                      <table border='1' cellspacing='0' cellpadding='5' width='100%' style='border-collapse: collapse;'>
                        <tr>
                          <td valign='top'>
                            <b>Main</b>
                          </td>
                          <td valign='top'>
                            <b>Pane(End)</b>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        ");
      ```

* **パターン5: ダイアログ**
    * **構成:** `Dialog`コンポーネントを利用
    * **用途:** 短いタスクや、ユーザーに確認を求める際に、現在の画面の上に重ねて表示します。
    * **【補足】** `Dialog`を表示する際、背景のコンテンツは操作不能であることを示すために半透明のオーバーレイで覆われます。`Dialog`自体にも影（Shadow）が適用されます。
    * **レイアウト図:**
      ```mermaid
      graph TD
          subgraph Screen
              style Screen fill:#ccc,stroke:#999,stroke-dasharray: 5 5
              BG["Background Content"]
          end
          subgraph Dialog
             Header
             Body
             Footer
          end
          Header --> Body --> Footer
      ```

# 3.4 スマートフォン対応

* **【ルール】** ネイティブアプリ（iOS/Android）開発においては、UIコンポーネントのコード提供は行わず、デザイントークン（色、タイポグラフィなど）のみを提供します。
    * **（理由）** 各OSが提供する標準UIコンポーネントの利用を基本とし、プラットフォームごとの最適なユーザー体験を優先するためです。
* **【指針】** Aegisは、将来的にはモバイルウェブ（スマートフォンブラウザ）での利用をサポートすることを目指します。
    * **（理由）** PC向けに構築された資産を最大限に活用し、多様な利用シーンに対応するためです。
    * **【補足】** `PageLayout`コンポーネントをはじめとするAegisの各コンポーネントは、今後レスポンシブ対応を進めていく予定です。現状では、スマートフォンなどの狭い画面幅でレイアウトが最適化されないケースがあります。
    > NOTE: 現状でスマートフォン対応が必須となる場合は、個別の設計・実装が必要となります。必ず事前にデザインシステムAGまで相談してください。
    > 【公式ドキュメント】
    > - [Aegis デザインシステム モバイル展開における役割](https://www.notion.so/legalforce/Aegis-1e6316695712802ebff7f1ed0d3924ca)