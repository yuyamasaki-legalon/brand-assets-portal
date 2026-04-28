import { SegmentedControl } from "@legalforce/aegis-react";
import { useLocale } from "../hooks/useLocale";

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  const currentIndex = locale === "ja-JP" ? 0 : 1;

  return (
    <SegmentedControl index={currentIndex} onChange={(index) => setLocale(index === 0 ? "ja-JP" : "en-US")}>
      <SegmentedControl.Button>日本語</SegmentedControl.Button>
      <SegmentedControl.Button>English</SegmentedControl.Button>
    </SegmentedControl>
  );
}
