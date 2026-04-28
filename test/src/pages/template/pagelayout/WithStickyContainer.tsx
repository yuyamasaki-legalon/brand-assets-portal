import {
  Link as AegisLink,
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutFooter,
  PageLayoutHeader,
  PageLayoutStickyContainer,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";
import { Placeholder } from "../../../components/Placeholder";

const WithStickyContainer = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>With Sticky Container</ContentHeaderTitle>
            <ContentHeaderDescription>PageLayout with PageLayoutStickyContainer</ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <PageLayoutStickyContainer>
            <Text
              as="p"
              variant="body.medium"
              style={{
                padding: "var(--aegis-space-medium)",
                backgroundColor: "var(--aegis-color-background-information-subtle)",
              }}
            >
              This is a sticky container. It will remain visible at the top of the content area as you scroll down.
            </Text>
          </PageLayoutStickyContainer>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            Scroll down to see the sticky container behavior.
          </Text>
          <div style={{ minHeight: "150vh" }}>
            {Array.from({ length: 30 }, (_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: Static array with fixed length, index is safe to use
              <Placeholder key={`content-item-${index}`} style={{ marginBottom: "var(--aegis-space-small)" }}>
                Content Item {index + 1}
              </Placeholder>
            ))}
          </div>
        </PageLayoutBody>
        <PageLayoutFooter>
          <AegisLink asChild>
            <Link to="/template/pagelayout">← Back to PageLayout Templates</Link>
          </AegisLink>
        </PageLayoutFooter>
      </PageLayoutContent>
    </PageLayout>
  );
};

export default WithStickyContainer;
