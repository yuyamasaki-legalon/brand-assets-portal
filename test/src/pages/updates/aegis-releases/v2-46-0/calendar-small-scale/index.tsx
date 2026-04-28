import {
  Link as AegisLink,
  Calendar,
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  RangeCalendar,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";
import { useScale } from "../../../../../contexts/ScaleContext";

const BASE_PATH = "/updates/aegis-releases/v2-46-0/calendar-small-scale";

export const CalendarSmallScale = () => {
  const { scale } = useScale();
  const isSmall = scale === "small";

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Calendar / RangeCalendar small scale 対応</ContentHeaderTitle>
            <ContentHeaderDescription>
              v2.46.0: Calendar と RangeCalendar が small scale レイアウトに対応
            </ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            Calendar と RangeCalendar が scale=&quot;small&quot; 時のレイアウトに対応しました。また、ナビゲーション
            Select トリガーのクリック領域が拡張され、ラベル部分も含むようになりました。
          </Text>

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            現在のスケール: {isSmall ? "small" : "medium"}
          </Text>
          <div
            style={{
              display: "flex",
              gap: "var(--aegis-space-large)",
              flexWrap: "wrap",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            <div>
              <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
                Calendar
              </Text>
              <Calendar />
            </div>
            <div>
              <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
                RangeCalendar
              </Text>
              <RangeCalendar />
            </div>
          </div>

          <div style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
            <AegisLink asChild>
              <Link to={isSmall ? BASE_PATH : `${BASE_PATH}?scale=small`}>
                {isSmall ? "medium スケールで表示" : "small スケールで表示"}
              </Link>
            </AegisLink>
          </div>

          <div
            style={{
              padding: "var(--aegis-space-medium)",
              backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
              borderRadius: "var(--aegis-radius-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              変更点
            </Text>
            <Text as="p" variant="body.small">
              - Calendar / RangeCalendar が small scale レイアウトに対応
            </Text>
            <Text as="p" variant="body.small">
              - ナビゲーション Select トリガーのクリック領域を拡張し、ラベル部分を含むように変更
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-46-0">← Back to v2.46.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
