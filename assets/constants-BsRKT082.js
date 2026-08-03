var e=`import type { LocaleCode } from "./types";

export const localeOptions: { label: string; value: LocaleCode }[] = [
  { value: "en-US", label: "English (US)" },
  { value: "ja-JP", label: "日本語" },
];

export const spacingTokenOptions: { label: string; value: string }[] = [
  { label: "x3Small (2px)", value: "var(--aegis-space-x3Small)" },
  { label: "xxSmall (4px)", value: "var(--aegis-space-xxSmall)" },
  { label: "xSmall (8px)", value: "var(--aegis-space-xSmall)" },
  { label: "small (12px)", value: "var(--aegis-space-small)" },
  { label: "medium (16px)", value: "var(--aegis-space-medium)" },
  { label: "large (24px)", value: "var(--aegis-space-large)" },
  { label: "xLarge (32px)", value: "var(--aegis-space-xLarge)" },
  { label: "xxLarge (40px)", value: "var(--aegis-space-xxLarge)" },
  { label: "x3Large (56px)", value: "var(--aegis-space-x3Large)" },
  { label: "x4Large (64px)", value: "var(--aegis-space-x4Large)" },
  { label: "x5Large (80px)", value: "var(--aegis-space-x5Large)" },
];

export const getSpacingOptions = (currentValue: string) => {
  if (!currentValue || spacingTokenOptions.some((opt) => opt.value === currentValue)) {
    return spacingTokenOptions;
  }
  return [{ label: \`Current: \${currentValue}\`, value: currentValue }, ...spacingTokenOptions];
};

export const commonVariantOptions = ["solid", "outlined", "subtle", "plain"] as const;

export const variantClassPattern = /(?:^|[_-])variant-([A-Za-z0-9-]+)/;

export const getVariantOptions = (currentVariant: string) => {
  const options = new Set<string>(commonVariantOptions);
  options.add(currentVariant);

  return Array.from(options).map((variant) => ({
    label: variant,
    value: variant,
  }));
};
`;export{e as default};