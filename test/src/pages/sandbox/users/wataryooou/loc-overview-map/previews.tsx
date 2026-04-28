import { Badge, StatusLabel, Text } from "@legalforce/aegis-react";

const SCALE = 0.45;
const INNER_WIDTH = 280 / SCALE;
const INNER_HEIGHT = 480 / SCALE;

function PreviewFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 280,
        height: 480,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: INNER_WIDTH,
          height: INNER_HEIGHT,
          transform: `scale(${SCALE})`,
          transformOrigin: "top left",
          backgroundColor: "var(--aegis-color-background-default)",
          padding: "var(--aegis-space-medium)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--aegis-space-small)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Placeholder({ width = "100%", height = 12 }: { width?: string | number; height?: number }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: "var(--aegis-radius-medium)",
        backgroundColor: "var(--aegis-color-surface-neutral-xSubtle)",
      }}
    />
  );
}

type StatusColor = "neutral" | "red" | "yellow" | "blue" | "teal" | "gray";

function TableRow({ hasStatus, statusColor }: { hasStatus?: boolean; statusColor?: StatusColor }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--aegis-space-small)",
        padding: "var(--aegis-space-xSmall) 0",
        borderBottom: "1px solid var(--aegis-color-border-default)",
      }}
    >
      <Placeholder width="30%" />
      <Placeholder width="20%" />
      <Placeholder width="25%" />
      {hasStatus && <StatusLabel color={statusColor ?? "teal"}>処理中</StatusLabel>}
    </div>
  );
}

export function DashboardPreview() {
  return (
    <PreviewFrame>
      <Text variant="title.xSmall">ダッシュボード</Text>
      <div style={{ display: "flex", gap: "var(--aegis-space-small)", marginTop: "var(--aegis-space-xSmall)" }}>
        {["42", "128", "7"].map((n) => (
          <div
            key={n}
            style={{
              flex: 1,
              padding: "var(--aegis-space-small)",
              borderRadius: "var(--aegis-radius-large)",
              backgroundColor: "var(--aegis-color-surface-neutral-xSubtle)",
              textAlign: "center",
            }}
          >
            <Text variant="title.medium">{n}</Text>
            <Placeholder width="60%" height={8} />
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--aegis-space-xSmall)",
          marginTop: "var(--aegis-space-xSmall)",
        }}
      >
        {["案件管理", "契約書管理", "検索", "AI アシスタント"].map((label) => (
          <div
            key={label}
            style={{
              padding: "var(--aegis-space-small)",
              borderRadius: "var(--aegis-radius-large)",
              border: "1px solid var(--aegis-color-border-default)",
            }}
          >
            <Text variant="label.small">{label}</Text>
          </div>
        ))}
      </div>
    </PreviewFrame>
  );
}

export function CaseListPreview() {
  return (
    <PreviewFrame>
      <Text variant="title.xSmall">案件一覧</Text>
      <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)" }}>
        <Badge color="information">すべて</Badge>
        <Badge color="neutral">担当者未入力</Badge>
        <Badge color="neutral">担当中</Badge>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {(["teal", "yellow", "red", "teal", "blue"] as const).map((color) => (
          <TableRow key={color} hasStatus statusColor={color} />
        ))}
      </div>
    </PreviewFrame>
  );
}

export function CaseDetailPreview() {
  return (
    <PreviewFrame>
      <Text variant="title.xSmall">案件詳細</Text>
      <div style={{ display: "flex", gap: "var(--aegis-space-medium)", flex: 1 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
          {["案件名", "担当者", "ステータス", "作成日", "期限", "メモ"].map((label) => (
            <div key={label}>
              <Text variant="label.small" color="subtle">
                {label}
              </Text>
              <Placeholder height={10} />
            </div>
          ))}
        </div>
        <div
          style={{
            width: 80,
            backgroundColor: "var(--aegis-color-surface-neutral-xSubtle)",
            borderRadius: "var(--aegis-radius-large)",
            padding: "var(--aegis-space-xSmall)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--aegis-space-xSmall)",
          }}
        >
          <Text variant="label.small" color="subtle">
            タイムライン
          </Text>
          {[1, 2, 3].map((i) => (
            <Placeholder key={i} height={8} />
          ))}
        </div>
      </div>
    </PreviewFrame>
  );
}

export function ContractListPreview() {
  return (
    <PreviewFrame>
      <Text variant="title.xSmall">契約書管理</Text>
      <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)" }}>
        <Badge color="information">すべて</Badge>
        <Badge color="neutral">レビュー待ち</Badge>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <TableRow key={i} />
        ))}
      </div>
    </PreviewFrame>
  );
}

export function FileDetailPreview() {
  return (
    <PreviewFrame>
      <Text variant="title.xSmall">ファイル詳細</Text>
      <div style={{ display: "flex", gap: "var(--aegis-space-medium)", flex: 1 }}>
        <div
          style={{
            flex: 2,
            backgroundColor: "var(--aegis-color-surface-neutral-xSubtle)",
            borderRadius: "var(--aegis-radius-large)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 200,
          }}
        >
          <Text variant="body.small" color="subtle">
            Document Viewer
          </Text>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
          {["ファイル名", "種別", "ステータス", "更新日"].map((label) => (
            <div key={label}>
              <Text variant="label.small" color="subtle">
                {label}
              </Text>
              <Placeholder height={10} />
            </div>
          ))}
        </div>
      </div>
    </PreviewFrame>
  );
}

export function ReviewPreview() {
  return (
    <PreviewFrame>
      <Text variant="title.xSmall">レビュー</Text>
      <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)" }}>
        <Badge color="danger">重大 2</Badge>
        <Badge color="warning">注意 5</Badge>
        <Badge color="information">情報 3</Badge>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
        {["利益相反条項の確認", "秘密保持義務の範囲", "損害賠償の上限", "契約解除条件", "準拠法の確認"].map((item) => (
          <div
            key={item}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--aegis-space-xSmall)",
              padding: "var(--aegis-space-xSmall)",
              borderRadius: "var(--aegis-radius-medium)",
              border: "1px solid var(--aegis-color-border-default)",
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "var(--aegis-radius-small)",
                border: "1.5px solid var(--aegis-color-border-neutral)",
                flexShrink: 0,
              }}
            />
            <Text variant="body.xSmall">{item}</Text>
          </div>
        ))}
      </div>
    </PreviewFrame>
  );
}

export function EsignPreview() {
  const steps = ["書類確認", "署名者設定", "内容確認", "送信"];
  return (
    <PreviewFrame>
      <Text variant="title.xSmall">電子契約</Text>
      <div style={{ display: "flex", gap: "var(--aegis-space-xxSmall)", marginBottom: "var(--aegis-space-xSmall)" }}>
        {steps.map((step, i) => (
          <div key={step} style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xxSmall)" }}>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "var(--aegis-radius-full)",
                backgroundColor:
                  i === 0 ? "var(--aegis-color-surface-information)" : "var(--aegis-color-surface-neutral-xSubtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text variant="label.small">{i + 1}</Text>
            </div>
            <Text variant="label.small" color={i === 0 ? undefined : "subtle"}>
              {step}
            </Text>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Placeholder width="40%" height={8} />
            <div
              style={{
                marginTop: 4,
                height: 28,
                borderRadius: "var(--aegis-radius-medium)",
                border: "1px solid var(--aegis-color-border-default)",
              }}
            />
          </div>
        ))}
      </div>
    </PreviewFrame>
  );
}

export function SearchPreview() {
  return (
    <PreviewFrame>
      <Text variant="title.xSmall">検索</Text>
      <div
        style={{
          height: 36,
          borderRadius: "var(--aegis-radius-large)",
          border: "2px solid var(--aegis-color-border-information)",
          display: "flex",
          alignItems: "center",
          padding: "0 var(--aegis-space-small)",
        }}
      >
        <Text variant="body.small" color="subtle">
          キーワードを入力...
        </Text>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              padding: "var(--aegis-space-small)",
              borderRadius: "var(--aegis-radius-large)",
              border: "1px solid var(--aegis-color-border-default)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-xxSmall)",
            }}
          >
            <Placeholder width="60%" height={10} />
            <Placeholder width="90%" height={8} />
            <Placeholder width="40%" height={8} />
          </div>
        ))}
      </div>
    </PreviewFrame>
  );
}

export function TemplatesPreview() {
  return (
    <PreviewFrame>
      <Text variant="title.xSmall">ひな形</Text>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--aegis-space-xSmall)",
          flex: 1,
        }}
      >
        {["秘密保持契約", "業務委託契約", "売買契約", "ライセンス契約"].map((name) => (
          <div
            key={name}
            style={{
              padding: "var(--aegis-space-small)",
              borderRadius: "var(--aegis-radius-large)",
              border: "1px solid var(--aegis-color-border-default)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-xxSmall)",
            }}
          >
            <Text variant="label.small">{name}</Text>
            <Placeholder width="80%" height={8} />
            <Placeholder width="50%" height={8} />
          </div>
        ))}
      </div>
    </PreviewFrame>
  );
}

export function ReviewConsolePreview() {
  return (
    <PreviewFrame>
      <Text variant="title.xSmall">審査基準</Text>
      <div style={{ display: "flex", gap: "var(--aegis-space-medium)", flex: 1 }}>
        <div
          style={{
            width: 120,
            display: "flex",
            flexDirection: "column",
            gap: "var(--aegis-space-xxSmall)",
            borderRight: "1px solid var(--aegis-color-border-default)",
            paddingRight: "var(--aegis-space-small)",
          }}
        >
          {["基本ルール", "秘密保持", "損害賠償", "知的財産", "準拠法"].map((rule) => (
            <div
              key={rule}
              style={{
                padding: "var(--aegis-space-xxSmall) var(--aegis-space-xSmall)",
                borderRadius: "var(--aegis-radius-medium)",
              }}
            >
              <Text variant="body.xSmall">{rule}</Text>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
          <Text variant="label.small">ルール詳細</Text>
          <Placeholder height={10} />
          <Placeholder height={10} />
          <Placeholder width="70%" height={10} />
        </div>
      </div>
    </PreviewFrame>
  );
}

export function LoaPreview() {
  return (
    <PreviewFrame>
      <Text variant="title.xSmall">LOA</Text>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)", flex: 1 }}>
        {/* User message */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              maxWidth: "70%",
              padding: "var(--aegis-space-xSmall) var(--aegis-space-small)",
              borderRadius: "var(--aegis-radius-large)",
              backgroundColor: "var(--aegis-color-surface-information)",
            }}
          >
            <Text variant="body.xSmall">この契約書のリスクを分析してください</Text>
          </div>
        </div>
        {/* AI message */}
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <div
            style={{
              maxWidth: "70%",
              padding: "var(--aegis-space-xSmall) var(--aegis-space-small)",
              borderRadius: "var(--aegis-radius-large)",
              backgroundColor: "var(--aegis-color-surface-neutral-xSubtle)",
            }}
          >
            <Text variant="body.xSmall">分析結果をお伝えします。主要なリスクポイントは3つあります...</Text>
          </div>
        </div>
        {/* User message */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              maxWidth: "70%",
              padding: "var(--aegis-space-xSmall) var(--aegis-space-small)",
              borderRadius: "var(--aegis-radius-large)",
              backgroundColor: "var(--aegis-color-surface-information)",
            }}
          >
            <Text variant="body.xSmall">詳しく教えてください</Text>
          </div>
        </div>
      </div>
    </PreviewFrame>
  );
}
