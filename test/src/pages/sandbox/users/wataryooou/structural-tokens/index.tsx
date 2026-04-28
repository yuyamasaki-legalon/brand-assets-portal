import {
  Card,
  CardBody,
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
  Divider,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { useEffect, useRef, useState } from "react";

/* ─── Space Scale ─── */

const spaceTokens = [
  { name: "space.x3Small", token: "--aegis-space-x3Small", value: "2px" },
  { name: "space.xxSmall", token: "--aegis-space-xxSmall", value: "4px" },
  { name: "space.semiXxSmall", token: "--aegis-space-semiXxSmall", value: "6px" },
  { name: "space.xSmall", token: "--aegis-space-xSmall", value: "8px" },
  { name: "space.small", token: "--aegis-space-small", value: "12px" },
  { name: "space.medium", token: "--aegis-space-medium", value: "16px" },
  { name: "space.large", token: "--aegis-space-large", value: "24px" },
  { name: "space.xLarge", token: "--aegis-space-xLarge", value: "32px" },
  { name: "space.xxLarge", token: "--aegis-space-xxLarge", value: "40px" },
  { name: "space.x3Large", token: "--aegis-space-x3Large", value: "56px" },
  { name: "space.x4Large", token: "--aegis-space-x4Large", value: "64px" },
  { name: "space.x5Large", token: "--aegis-space-x5Large", value: "80px" },
] as const;

const SpaceScale = () => (
  <section>
    <Text as="p" variant="label.medium" style={{ letterSpacing: "0.1em", marginBottom: "var(--aegis-space-medium)" }}>
      SPACE SCALE
    </Text>
    <div style={{ display: "flex", flexDirection: "column" }}>
      {spaceTokens.map((t) => (
        <div
          key={t.name}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "var(--aegis-space-xSmall) 0",
            borderBottom: "1px solid var(--aegis-color-border-default)",
          }}
        >
          <Text
            variant="body.small"
            style={{ width: "200px", flexShrink: 0, color: "var(--aegis-color-foreground-default)" }}
          >
            {t.name}
          </Text>
          <div
            style={{
              width: `var(${t.token})`,
              height: `var(${t.token})`,
              backgroundColor: "var(--aegis-color-background-brand-bold)",
              borderRadius: "var(--aegis-radius-small)",
              flexShrink: 0,
            }}
          />
        </div>
      ))}
    </div>
  </section>
);

/* ─── Radius ─── */

const radiusTokens = [
  { name: "small", token: "--aegis-radius-small", value: "2 px" },
  { name: "medium", token: "--aegis-radius-medium", value: "4 px \u00b7 default" },
  { name: "large", token: "--aegis-radius-large", value: "8 px" },
  { name: "xLarge", token: "--aegis-radius-xLarge", value: "12 px" },
  { name: "full", token: "--aegis-radius-full", value: "pills & chips" },
] as const;

const RadiusShowcase = () => (
  <section>
    <Text as="p" variant="label.medium" style={{ letterSpacing: "0.1em", marginBottom: "var(--aegis-space-medium)" }}>
      RADIUS
    </Text>
    <div style={{ display: "flex", gap: "var(--aegis-space-medium)", flexWrap: "wrap" }}>
      {radiusTokens.map((t) => (
        <Card key={t.name} style={{ flex: "1 1 160px", maxWidth: "200px" }}>
          <CardBody>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--aegis-space-small)",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "var(--aegis-color-background-brand-bold)",
                  borderRadius: `var(${t.token})`,
                }}
              />
              <Text variant="label.medium">{t.name}</Text>
              <Text variant="body.xSmall" style={{ color: "var(--aegis-color-foreground-subtle)" }}>
                {t.value}
              </Text>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  </section>
);

/* ─── Depth ─── */

const depthTokens = [
  {
    name: "depth.low",
    shadow: "0 1px 10px rgba(0, 0, 0, 0.05), 0 4px 5px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.09)",
    description: "Cards on hover",
  },
  {
    name: "depth.medium",
    shadow:
      "0 3px 14px 2px rgba(0, 0, 0, 0.05), 0 8px 10px 1px rgba(0, 0, 0, 0.05), 0 5px 5px -3px rgba(0, 0, 0, 0.09)",
    description: "Popovers, menus",
  },
  {
    name: "depth.high",
    shadow:
      "0 6px 30px 5px rgba(0, 0, 0, 0.05), 0 16px 24px 2px rgba(0, 0, 0, 0.05), 0 8px 10px -5px rgba(0, 0, 0, 0.09)",
    description: "Dialogs, sheets",
  },
] as const;

const DepthShowcase = () => (
  <section>
    <Text as="p" variant="label.medium" style={{ letterSpacing: "0.1em", marginBottom: "var(--aegis-space-medium)" }}>
      DEPTH
    </Text>
    <div style={{ display: "flex", gap: "var(--aegis-space-medium)", flexWrap: "wrap" }}>
      {depthTokens.map((t) => (
        <div
          key={t.name}
          style={{
            flex: "1 1 240px",
            padding: "var(--aegis-space-xLarge) var(--aegis-space-large)",
            backgroundColor: "var(--aegis-color-background-default)",
            borderRadius: "var(--aegis-radius-large)",
            boxShadow: t.shadow,
            textAlign: "center",
          }}
        >
          <Text as="p" variant="label.medium">
            {t.name}
          </Text>
          <Text as="p" variant="body.xSmall" style={{ color: "var(--aegis-color-foreground-subtle)" }}>
            {t.description}
          </Text>
        </div>
      ))}
    </div>
  </section>
);

/* ─── Motion ─── */

const motionTokens = [
  { name: "x2Fast", token: "--aegis-motion-duration-x2Fast", value: "160 ms", usage: "hover, focus" },
  { name: "xFast", token: "--aegis-motion-duration-xFast", value: "240 ms", usage: "tooltip, badge" },
  { name: "fast", token: "--aegis-motion-duration-fast", value: "320 ms", usage: "menu, dropdown" },
  { name: "normal", token: "--aegis-motion-duration-normal", value: "400 ms", usage: "dialog, drawer" },
] as const;

const MotionDot = ({ token, durationMs }: { token: string; durationMs: number }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;

    let animationId: number;
    let start: number | null = null;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = (timestamp - start) % durationMs;
      const progress = elapsed / durationMs;

      if (dotRef.current && trackRef.current) {
        const trackWidth = trackRef.current.offsetWidth;
        const dotSize = 16;
        const maxX = trackWidth - dotSize;
        dotRef.current.style.transform = `translateX(${progress * maxX}px)`;
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [durationMs, playing]);

  return (
    <Card
      style={{ flex: "1 1 200px", cursor: "pointer" }}
      onClick={() => setPlaying((p) => !p)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setPlaying((p) => !p);
      }}
    >
      <CardBody>
        <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
          {token}
        </Text>
        <div
          ref={trackRef}
          style={{
            position: "relative",
            height: "4px",
            backgroundColor: "var(--aegis-color-background-brand-bold)",
            borderRadius: "var(--aegis-radius-full)",
            marginBottom: "var(--aegis-space-small)",
          }}
        >
          <div
            ref={dotRef}
            style={{
              position: "absolute",
              top: "-6px",
              width: "16px",
              height: "16px",
              backgroundColor: "var(--aegis-color-background-brand-bold)",
              borderRadius: "var(--aegis-radius-full)",
              border: "2px solid var(--aegis-color-background-default)",
            }}
          />
        </div>
      </CardBody>
    </Card>
  );
};

const MotionShowcase = () => (
  <section>
    <div style={{ display: "flex", alignItems: "baseline", gap: "var(--aegis-space-small)", flexWrap: "wrap" }}>
      <Text as="p" variant="label.medium" style={{ letterSpacing: "0.1em" }}>
        MOTION
      </Text>
      <Text as="p" variant="body.xSmall" style={{ color: "var(--aegis-color-foreground-subtle)" }}>
        SYNCED LOOPS — COMPARE HOW FAR EACH DOT TRAVELS IN ITS TOKEN&apos;S DURATION
      </Text>
    </div>
    <Divider style={{ margin: "var(--aegis-space-small) 0 var(--aegis-space-medium)" }} />
    <div style={{ display: "flex", gap: "var(--aegis-space-medium)", flexWrap: "wrap" }}>
      {motionTokens.map((t) => (
        <div key={t.name} style={{ flex: "1 1 200px" }}>
          <MotionDot token={t.name} durationMs={Number.parseInt(t.value, 10)} />
          <Text
            as="p"
            variant="body.xSmall"
            style={{
              color: "var(--aegis-color-foreground-subtle)",
              marginTop: "var(--aegis-space-xxSmall)",
              paddingLeft: "var(--aegis-space-small)",
            }}
          >
            {t.value} &middot; {t.usage}
          </Text>
        </div>
      ))}
    </div>
  </section>
);

/* ─── Page ─── */

export const StructuralTokens = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Spacing, Radius, Depth, Motion</ContentHeaderTitle>
            <ContentHeaderDescription>STRUCTURAL TOKENS</ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-x3Large)" }}>
            <SpaceScale />
            <RadiusShowcase />
            <DepthShowcase />
            <MotionShowcase />
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
