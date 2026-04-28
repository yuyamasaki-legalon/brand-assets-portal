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
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";
import { Placeholder } from "../../../components/Placeholder";

const ScrollInsideLayout = () => {
  return (
    <PageLayout scrollBehavior="inside">
      <PageLayoutContent scrollBehavior="inside">
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Scroll Inside Layout</ContentHeaderTitle>
            <ContentHeaderDescription>PageLayout with inside scroll behavior</ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            This layout uses the &quot;inside&quot; scroll behavior. The content scrolls within the body area while the
            header and footer remain fixed.
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

export default ScrollInsideLayout;
