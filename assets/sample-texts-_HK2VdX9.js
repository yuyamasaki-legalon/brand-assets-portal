var e=`/**
 * Sample texts for Typography Lab preview.
 * All sections have both Japanese and English variants.
 */

export type LocaleKey = "ja" | "en";

export type SampleTexts = {
  pageHero: string;

  sections: {
    heading: {
      title: string;
      description: string;
      titleLarge: string;
      titleMedium: string;
      titleSmall: string;
      titleXSmall: string;
    };
    body: {
      title: string;
      description: string;
      xLarge: string;
      large: string;
      medium: string;
      small: string;
      xSmall: string;
    };
    paragraph: {
      title: string;
      /** Short introductory label rendered as document.title before the long-form body. */
      documentTitleLabel: string;
      paragraphs: string[];
    };
    descriptionList: {
      title: string;
      items: { term: string; detail: string }[];
    };
    caption: {
      title: string;
      lead: string;
      caption1: string;
      caption2: string;
    };
    rules: {
      title: string;
      items: { heading: string; summary: string; detail: string }[];
    };
    list: {
      title: string;
      items: string[];
    };
    component: {
      title: string;
      description: string;
      buttonPrimary: string;
      buttonSecondary: string;
      buttonDanger: string;
      selectPlaceholder: string;
      selectOptions: { label: string; value: string }[];
      textFieldPlaceholder: string;
      textFieldLabel: string;
      tabLabels: string[];
    };
    table: {
      title: string;
      columns: string[];
      rows: string[][];
    };
  };
};

export const SAMPLE_TEXTS: Record<LocaleKey, SampleTexts> = {
  ja: {
    pageHero: "Konnichiwa Aegis!!",

    sections: {
      heading: {
        title: "Title Variant Scale / 見出しスケール",
        description:
          "各 title variant（large → xSmall）のフォントサイズスケールを確認します。サイズは Aegis variant に固定。font-weight・letter-spacing・line-height は Lab 設定が適用されます。",
        titleLarge: "Title Large: 大見出し — Primary Heading for UI Typography Rendering and Layout",
        titleMedium: "Title Medium: 中見出し — Section Heading for Structure and Visual Hierarchy",
        titleSmall: "Title Small: 小見出し — Subsection Heading for Content Grouping",
        titleXSmall: "Title xSmall: 補助見出し — Minor Heading for Secondary Information",
      },
      body: {
        title: "Body Text / 通常テキスト",
        description:
          "通常のUIテキストは、設定説明や操作ガイドなどに使用します。短く簡潔でありながら、複数行になった場合でも読みやすさを維持することが重要です。",
        xLarge:
          "body.xLarge: この設定はすべての端末に即時反映されます。ユーザーの操作に応じて、リアルタイムで表示内容が更新されます。",
        large:
          "body.large: この設定はすべての端末に即時反映されます。ユーザーの操作に応じて、リアルタイムで表示内容が更新されます。",
        medium:
          "body.medium: この設定はすべての端末に即時反映されます。ユーザーの操作に応じて、リアルタイムで表示内容が更新されます。",
        small:
          "body.small: この設定はすべての端末に即時反映されます。ユーザーの操作に応じて、リアルタイムで表示内容が更新されます。",
        xSmall:
          "body.xSmall: この設定はすべての端末に即時反映されます。ユーザーの操作に応じて、リアルタイムで表示内容が更新されます。",
      },
      paragraph: {
        title: "Paragraph / 長文テキスト",
        documentTitleLabel: "タイポグラフィ設計方針 — Document Body サンプル",
        paragraphs: [
          "デザインシステムにおけるUIテキストは、単なる情報の羅列ではなく、ユーザーの理解を支援する重要なインターフェースの一部です。",
          "特に複雑な業務画面では、information hierarchy（情報階層）を適切に設計し、どの情報がprimaryでどれがsecondaryなのかを明確にする必要があります。Aegisでは、日本語とEnglishの混在環境においても一貫した可読性を維持するため、font-sizeやline-height、letter-spacingといった基本的なタイポグラフィ要素を体系的に管理します。また、font-weightだけに依存せず、spacingやcolor、layoutとの組み合わせによって視認性を最適化します。",
          "さらに、UIテキストは短文・長文・数値・ラベルなど複数のコンテキストで使用されるため、それぞれに適したtoken設計が求められます。例えば、Body Textはreadabilityを重視し、Labelはscanしやすさ、Dataはrecognitionの速さを優先します。このように用途ごとに役割を定義することで、全体として一貫したuser experienceを実現します。",
          "長期的に運用されるデザインシステムでは、個別の画面最適化ではなく、再利用可能な typography rule を定義することが重要です。これにより、異なるチームや機能間でも一貫したUI品質を維持できます。",
        ],
      },
      descriptionList: {
        title: "Description List / 用語リスト",
        items: [
          {
            term: "Title",
            detail: "ページ見出しや主要なセクション見出しとして使用し、最も強い視覚的階層を表現します。",
          },
          {
            term: "Document Title",
            detail: "記事やドキュメント内の見出しとして使用し、本文との関係性を保ちながら階層を示します。",
          },
          {
            term: "Body",
            detail: "通常のUIテキストや説明文に使用し、可読性と情報密度のバランスを重視します。",
          },
          {
            term: "Label",
            detail: "フォーム項目名や設定名称として使用し、短く識別しやすいことが求められます。",
          },
          {
            term: "Document Body",
            detail: "長文コンテンツや記事本文に使用し、読みやすさを最優先に設計されます。",
          },
          {
            term: "Caption",
            detail: "補足情報や注意書きに使用し、主情報より弱い視覚的強度で表示します。",
          },
          {
            term: "Data",
            detail: "数値や指標の表示に使用し、認識の速さと正確性が重要です。",
          },
          {
            term: "Component",
            detail: "ボタンやメニューなどのUI要素内で使用し、操作性と可読性の両立が求められます。",
          },
        ],
      },
      caption: {
        title: "Caption / 補足テキスト",
        lead: "この情報はリアルタイムで更新され、ユーザーの操作やシステムの状態に応じて即座に表示内容が変化します。そのため、常に最新の状態を確認しながら操作を行うことが推奨されます。",
        caption1: "表示内容は端末や環境によって異なる場合があります。",
        caption2: "最終更新: 2026-04-28 14:32",
      },
      rules: {
        title: "Typography Rules / 設計ルール",
        items: [
          {
            heading: "テキストサイズ (text-size)",
            summary: "テキストサイズは情報の階層と利用コンテキストに基づいて決定されます。",
            detail:
              "主要な情報は大きく、補助的な情報は小さく設計することで、ユーザーが瞬時に重要度を判断できるようにします。また、異なるデバイスや画面サイズでも一貫した視認性を維持することが前提となります。",
          },
          {
            heading: "ラインハイト (line-height)",
            summary: "ラインハイトは可読性に直接影響する重要な要素であり、特に長文では適切な行間が必要です。",
            detail:
              "狭すぎると読みにくく、広すぎると情報のまとまりが失われるため、テキストの用途に応じて最適なバランスを設定します。UIテキストでは密度、ドキュメントでは読みやすさを優先します。",
          },
          {
            heading: "レタースペーシング (letter-spacing)",
            summary: "レタースペーシングは文字の密度と視認性を調整するために使用されます。",
            detail:
              "見出しではやや詰めることで強い印象を与え、小さいテキストではわずかに広げることで読みやすさを向上させます。特に日本語では過度な調整を避け、自然な文字組を維持することが重要です。",
          },
        ],
      },
      list: {
        title: "UI List / 箇条書き",
        items: [
          "フォントファミリーの違い（Hiragino / Noto / Inter）の確認",
          "日本語とEnglishのレンダリング差の比較",
          "font-weight（400 / 500 / 600 / 700）の見え方の検証",
          "line-heightによる可読性の変化の確認",
          "letter-spacingによる密度と視認性の変化",
          "大見出しと本文の階層バランスの確認",
          "Captionや小サイズテキストの可読性チェック",
          "Data（数値）の認識しやすさの確認",
        ],
      },
      component: {
        title: "Component Text / UIコンポーネント",
        description:
          "ボタン・セレクト・テキストフィールド・タブなど、UIコンポーネント内のラベル文字を確認します。component typeの設定がそのまま継承されます。",
        buttonPrimary: "保存する",
        buttonSecondary: "キャンセル",
        buttonDanger: "削除する",
        selectPlaceholder: "選択してください",
        selectOptions: [
          { label: "オプション A", value: "a" },
          { label: "オプション B", value: "b" },
          { label: "オプション C", value: "c" },
        ],
        textFieldPlaceholder: "テキストを入力",
        textFieldLabel: "フィールドラベル",
        tabLabels: ["概要", "詳細", "設定", "履歴"],
      },
      table: {
        title: "Table / テーブル",
        columns: ["テキスト種別", "用途", "推奨サイズ", "行間"],
        rows: [
          ["Title", "ページ・セクション見出し", "20px", "1.3"],
          ["Document Title", "記事・文書見出し", "18px", "1.35"],
          ["Body", "UIテキスト・説明文", "14px", "1.6"],
          ["Document Body", "長文・記事本文", "14px", "1.75"],
          ["Label", "フォームラベル・設定名", "14px", "1.4"],
          ["Caption", "補足・注意書き", "12px", "1.5"],
          ["Data", "数値・指標", "14px", "1.2"],
          ["Component", "ボタン・選択肢ラベル", "12px", "1.4"],
        ],
      },
    },
  },

  en: {
    pageHero: "Hello Aegis!!",

    sections: {
      heading: {
        title: "Title Variant Scale",
        description:
          "Compare each title variant (large → xSmall) by font-size scale. Size is pinned to the Aegis variant value. Font-weight, letter-spacing, and line-height follow Lab settings.",
        titleLarge: "Title Large: Primary Heading — UI Typography Rendering and Layout Balance",
        titleMedium: "Title Medium: Section Heading — Structure and Visual Hierarchy for UI",
        titleSmall: "Title Small: Subsection Heading — Content Grouping and Readability",
        titleXSmall: "Title xSmall: Minor Heading — Secondary Information and Context",
      },
      body: {
        title: "Body Text",
        description:
          "Body text is used for descriptions, guides, and explanations. It must stay readable even across multiple lines.",
        xLarge:
          "body.xLarge: Changes take effect immediately across all devices. The display updates in real time as users interact.",
        large:
          "body.large: Changes take effect immediately across all devices. The display updates in real time as users interact.",
        medium:
          "body.medium: Changes take effect immediately across all devices. The display updates in real time as users interact.",
        small:
          "body.small: Changes take effect immediately across all devices. The display updates in real time as users interact.",
        xSmall:
          "body.xSmall: Changes take effect immediately across all devices. The display updates in real time as users interact.",
      },
      paragraph: {
        title: "Paragraph",
        documentTitleLabel: "Typography Design Principles — Document Body Sample",
        paragraphs: [
          "UI text in a design system is not merely a list of information — it is a critical part of the interface that supports user comprehension.",
          "Especially in complex business screens, designing proper information hierarchy is essential: clearly distinguishing primary from secondary information. Aegis manages fundamental typography properties — font-size, line-height, and letter-spacing — systematically to maintain consistent readability even in mixed Japanese and English environments. Rather than relying on font-weight alone, visual clarity is optimized through combinations with spacing, color, and layout.",
          "UI text appears in multiple contexts — short phrases, long paragraphs, numeric values, and labels — each requiring its own token design. For example, Body Text prioritizes readability, Labels prioritize scannability, and Data prioritizes recognition speed. Defining distinct roles for each use case creates a coherent user experience overall.",
          "In a long-lived design system, defining reusable typography rules matters more than optimizing individual screens. This approach ensures consistent UI quality across different teams and features.",
        ],
      },
      descriptionList: {
        title: "Description List",
        items: [
          {
            term: "Title",
            detail: "Used for page headings and major section headings, expressing the strongest visual hierarchy.",
          },
          {
            term: "Document Title",
            detail:
              "Used for article and document headings, maintaining hierarchy while preserving relation to body text.",
          },
          {
            term: "Body",
            detail: "Used for regular UI text and descriptions, balancing readability with information density.",
          },
          {
            term: "Label",
            detail: "Used for form field names and setting titles — must be short and easy to identify.",
          },
          {
            term: "Document Body",
            detail: "Used for long-form content and article body text, designed with readability as the top priority.",
          },
          {
            term: "Caption",
            detail:
              "Used for supplementary information and notes, displayed with lower visual emphasis than main content.",
          },
          {
            term: "Data",
            detail: "Used for numeric values and metrics — recognition speed and accuracy are paramount.",
          },
          {
            term: "Component",
            detail: "Used inside UI elements like buttons and menus — must balance operability with readability.",
          },
        ],
      },
      caption: {
        title: "Caption",
        lead: "This information updates in real time, reflecting user actions and system state instantly. It is recommended to always verify the latest status before proceeding.",
        caption1: "Display may vary by device and environment.",
        caption2: "Last updated: 2026-04-28 14:32",
      },
      rules: {
        title: "Typography Rules",
        items: [
          {
            heading: "Text Size (text-size)",
            summary: "Text size is determined by the information hierarchy and usage context.",
            detail:
              "Primary information is displayed larger, supplementary information smaller, allowing users to judge importance at a glance. Consistent visibility across different devices and screen sizes is a prerequisite.",
          },
          {
            heading: "Line Height (line-height)",
            summary:
              "Line height directly affects readability, especially in long-form text where proper spacing is essential.",
            detail:
              "Too tight and text becomes hard to read; too loose and coherence is lost. The optimal balance is set based on the text's purpose. UI text prioritizes density; documents prioritize readability.",
          },
          {
            heading: "Letter Spacing (letter-spacing)",
            summary: "Letter spacing adjusts character density and legibility.",
            detail:
              "Tighter spacing on headings creates a strong impression; slight widening on small text improves readability. For Japanese text in particular, avoid excessive adjustments and maintain natural character composition.",
          },
        ],
      },
      list: {
        title: "UI List",
        items: [
          "Verifying font family differences (Hiragino / Noto / Inter)",
          "Comparing rendering differences between Japanese and English",
          "Checking font-weight appearance (400 / 500 / 600 / 700)",
          "Observing readability changes from line-height adjustment",
          "Checking density and legibility changes from letter-spacing",
          "Verifying hierarchy balance between headings and body text",
          "Checking readability of Caption and small-size text",
          "Confirming recognition speed for Data (numeric) text",
        ],
      },
      component: {
        title: "Component Text",
        description:
          "Review label text inside UI components — buttons, selects, text fields, and tabs. The component type settings apply directly.",
        buttonPrimary: "Save",
        buttonSecondary: "Cancel",
        buttonDanger: "Delete",
        selectPlaceholder: "Select an option",
        selectOptions: [
          { label: "Option A", value: "a" },
          { label: "Option B", value: "b" },
          { label: "Option C", value: "c" },
        ],
        textFieldPlaceholder: "Enter text",
        textFieldLabel: "Field label",
        tabLabels: ["Overview", "Details", "Settings", "History"],
      },
      table: {
        title: "Table",
        columns: ["Text Type", "Usage", "Recommended Size", "Line Height"],
        rows: [
          ["Title", "Page / section headings", "20px", "1.3"],
          ["Document Title", "Article / document headings", "18px", "1.35"],
          ["Body", "UI text / descriptions", "14px", "1.6"],
          ["Document Body", "Long-form / article body", "14px", "1.75"],
          ["Label", "Form labels / setting names", "14px", "1.4"],
          ["Caption", "Supplementary notes", "12px", "1.5"],
          ["Data", "Numeric values / metrics", "14px", "1.2"],
          ["Component", "Button / option labels", "12px", "1.4"],
        ],
      },
    },
  },
};
`;export{e as default};