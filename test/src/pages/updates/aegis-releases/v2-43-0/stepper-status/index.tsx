import {
  Link as AegisLink,
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Stepper,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

const ALL_STATUSES = ["normal", "completed", "loading", "error"] as const;
const ALL_SIZES = ["medium", "small"] as const;

const statusLabels: Record<(typeof ALL_STATUSES)[number], string> = {
  normal: "normal（デフォルト: ステップ番号表示）",
  completed: "completed（チェックマーク）",
  loading: "loading（回転アイコン）",
  error: "error（警告アイコン）",
};

export const StepperStatus = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Stepper.Item loading / error ステータス</ContentHeader.Title>
            <ContentHeader.Description>
              v2.43.0: Stepper.Item に loading と error ステータスを追加
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            Stepper.Item の status prop に &quot;loading&quot; と &quot;error&quot; が追加されました。medium
            サイズでは回転矢印 / 警告三角アイコン、small サイズでも同様のアイコンが表示されます。
          </Text>

          {ALL_SIZES.map((size) => (
            <div key={size} style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
              <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
                size=&quot;{size}&quot;
              </Text>
              <Stepper defaultIndex={null} orientation="vertical" readOnly size={size}>
                {ALL_STATUSES.map((status) => (
                  <Stepper.Item key={status} status={status} title={statusLabels[status]}>
                    <Text variant="body.small">ステップの内容がここに表示されます</Text>
                  </Stepper.Item>
                ))}
              </Stepper>
            </div>
          ))}

          <div
            style={{
              padding: "var(--aegis-space-medium)",
              backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
              borderRadius: "var(--aegis-radius-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              注意事項
            </Text>
            <Text as="p" variant="body.small">
              - loading ステータスは回転アニメーション付きアイコンを表示
            </Text>
            <Text as="p" variant="body.small">
              - error ステータスは警告三角アイコンを表示
            </Text>
            <Text as="p" variant="body.small">
              - readOnly モードでステータスの視覚的な違いを確認するのに適している
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-43-0">← Back to v2.43.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
