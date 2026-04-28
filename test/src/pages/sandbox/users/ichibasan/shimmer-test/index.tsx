import {
  ContentHeader,
  Divider,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Text,
} from "@legalforce/aegis-react";
import { type ComponentProps, type CSSProperties, useMemo } from "react";
import styles from "./index.module.css";

type ShimmerTextColor = ComponentProps<typeof Text>["color"];
type ShimmerMotionConfig = {
  angle: string;
  durationMultiplier: number;
  startPosition: string;
  endPosition: string;
  backgroundSize: string;
  highlightCenter: string;
  highlightWidth: string;
};

const DEFAULT_MOTION_CONFIG: ShimmerMotionConfig = {
  angle: "75deg",
  durationMultiplier: 8,
  startPosition: "0%",
  endPosition: "-200%",
  backgroundSize: "200%",
  highlightCenter: "70%",
  highlightWidth: "80%",
};

const ShimmerText = ({ children, color }: { children: string; color?: ShimmerTextColor }) => {
  return (
    <Text color={color}>
      <span className={styles.shimmerText} data-text={children}>
        {children}
      </span>
    </Text>
  );
};

export const ShimmerTest = () => {
  const shimmerStyle = useMemo(
    () =>
      ({
        "--shimmer-angle": DEFAULT_MOTION_CONFIG.angle,
        "--shimmer-duration-multiplier": String(DEFAULT_MOTION_CONFIG.durationMultiplier),
        "--shimmer-start-position": DEFAULT_MOTION_CONFIG.startPosition,
        "--shimmer-end-position": DEFAULT_MOTION_CONFIG.endPosition,
        "--shimmer-background-size": DEFAULT_MOTION_CONFIG.backgroundSize,
        "--shimmer-highlight-center": DEFAULT_MOTION_CONFIG.highlightCenter,
        "--shimmer-highlight-width": DEFAULT_MOTION_CONFIG.highlightWidth,
      }) as CSSProperties,
    [],
  );
  const cssExampleText = useMemo(
    () => `.shimmerText {
  --shimmer-angle: ${DEFAULT_MOTION_CONFIG.angle};
  --shimmer-duration-multiplier: ${DEFAULT_MOTION_CONFIG.durationMultiplier};
  --shimmer-start-position: ${DEFAULT_MOTION_CONFIG.startPosition};
  --shimmer-end-position: ${DEFAULT_MOTION_CONFIG.endPosition};
  --shimmer-background-size: ${DEFAULT_MOTION_CONFIG.backgroundSize};
  --shimmer-highlight-center: ${DEFAULT_MOTION_CONFIG.highlightCenter};
  --shimmer-highlight-width: ${DEFAULT_MOTION_CONFIG.highlightWidth};
}

.shimmerText::after {
  background-image: linear-gradient(
    var(--shimmer-angle),
    transparent calc(var(--shimmer-highlight-center) - (var(--shimmer-highlight-width) / 2)),
    color-mix(in srgb, var(--aegis-color-palette-scale-white-1000) 92%, transparent) var(--shimmer-highlight-center),
    transparent calc(var(--shimmer-highlight-center) + (var(--shimmer-highlight-width) / 2))
  );
  background-position: var(--shimmer-start-position) 0;
  background-size: var(--shimmer-background-size) 100%;
  animation: shimmerSweep
    calc(var(--aegis-motion-duration-fast) * var(--shimmer-duration-multiplier))
    var(--aegis-motion-easing-default)
    infinite;
}`,
    [],
  );
  const jsExampleText = useMemo(
    () => `const shimmerStyle = {
  "--shimmer-angle": "${DEFAULT_MOTION_CONFIG.angle}",
  "--shimmer-duration-multiplier": "${DEFAULT_MOTION_CONFIG.durationMultiplier}",
  "--shimmer-start-position": "${DEFAULT_MOTION_CONFIG.startPosition}",
  "--shimmer-end-position": "${DEFAULT_MOTION_CONFIG.endPosition}",
  "--shimmer-background-size": "${DEFAULT_MOTION_CONFIG.backgroundSize}",
  "--shimmer-highlight-center": "${DEFAULT_MOTION_CONFIG.highlightCenter}",
  "--shimmer-highlight-width": "${DEFAULT_MOTION_CONFIG.highlightWidth}",
} as React.CSSProperties;

<Text color="danger">
  <span className={styles.shimmerText} data-text="Thinking..." style={shimmerStyle}>
    Thinking...
  </span>
</Text>`,
    [],
  );

  return (
    <PageLayout>
      <PageLayoutContent style={{ maxWidth: "var(--aegis-layout-width-small)", marginInline: "auto" }}>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Shimmer Test</ContentHeader.Title>
            <ContentHeader.Description>Shimmer preview samples</ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div
            style={{
              ...shimmerStyle,
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-medium)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-medium)",
              }}
            >
              <ShimmerText color="bold">
                ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890~!@#$%^&amp;*()_+
              </ShimmerText>
              <ShimmerText color="subtle">
                ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890~!@#$%^&amp;*()_+
              </ShimmerText>
              <ShimmerText color="information">
                ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890~!@#$%^&amp;*()_+
              </ShimmerText>
              <ShimmerText color="warning">
                ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890~!@#$%^&amp;*()_+
              </ShimmerText>
              <ShimmerText color="danger">
                ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890~!@#$%^&amp;*()_+
              </ShimmerText>
            </div>
            <Divider />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-medium)",
              }}
            >
              <ShimmerText>Thinking...</ShimmerText>
              <ShimmerText>Analyzing...</ShimmerText>
              <ShimmerText>Generating...</ShimmerText>
              <ShimmerText>Processing...</ShimmerText>
              <ShimmerText color="subtle">Thinking...</ShimmerText>
              <ShimmerText color="subtle">Analyzing...</ShimmerText>
              <ShimmerText color="subtle">Generating...</ShimmerText>
              <ShimmerText color="subtle">Processing...</ShimmerText>
            </div>
            <Divider />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-medium)",
              }}
            >
              <ShimmerText>考えています...</ShimmerText>
              <ShimmerText>解析しています...</ShimmerText>
              <ShimmerText>生成しています...</ShimmerText>
              <ShimmerText>処理しています...</ShimmerText>
              <ShimmerText color="subtle">考えています...</ShimmerText>
              <ShimmerText color="subtle">解析しています...</ShimmerText>
              <ShimmerText color="subtle">生成しています...</ShimmerText>
              <ShimmerText color="subtle">処理しています...</ShimmerText>
            </div>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
      <PageLayoutPane position="end" width="large" maxWidth="xxLarge" variant="outline">
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Code</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
            <Text variant="label.medium">css版</Text>
            <textarea
              aria-label="Shimmer CSS example"
              readOnly
              value={cssExampleText}
              style={{
                width: "100%",
                minHeight: "260px",
                padding: "var(--aegis-space-small)",
                border: "1px solid var(--aegis-color-border-neutral)",
                borderRadius: "var(--aegis-radius-medium)",
                backgroundColor: "var(--aegis-color-background-neutral-subtle)",
                color: "var(--aegis-color-foreground-default)",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
                fontSize: "var(--aegis-font-size-body-small)",
                lineHeight: "1.5",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
            <Text variant="label.medium">js版</Text>
            <textarea
              aria-label="Shimmer JS example"
              readOnly
              value={jsExampleText}
              style={{
                width: "100%",
                minHeight: "220px",
                padding: "var(--aegis-space-small)",
                border: "1px solid var(--aegis-color-border-neutral)",
                borderRadius: "var(--aegis-radius-medium)",
                backgroundColor: "var(--aegis-color-background-neutral-subtle)",
                color: "var(--aegis-color-foreground-default)",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
                fontSize: "var(--aegis-font-size-body-small)",
                lineHeight: "1.5",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>
        </PageLayoutBody>
      </PageLayoutPane>
    </PageLayout>
  );
};
