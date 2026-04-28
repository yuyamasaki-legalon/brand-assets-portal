import { Link } from "react-router-dom";
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutBody,
  PageLayoutFooter,
  PageLayoutStickyContainer,
  ContentHeader,
  Text,
  Link as AegisLink,
} from "@legalforce/aegis-react";
import { Placeholder } from "../../../components/Placeholder";

export const {{COMPONENT_NAME}} = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>{{PAGE_TITLE}}</ContentHeader.Title>
            <ContentHeader.Description>
              {{PAGE_DESCRIPTION}}
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <PageLayoutStickyContainer>
            <Text as="p" variant="body.medium" style={{
              padding: "var(--aegis-space-medium)",
              backgroundColor: "var(--aegis-color-background-information-subtle)"
            }}>
              This is a sticky container. It will remain visible at the top of
              the content area as you scroll down.
            </Text>
          </PageLayoutStickyContainer>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            Scroll down to see the sticky container behavior.
          </Text>
          <div style={{ minHeight: "150vh" }}>
            {Array.from({ length: 30 }, (_, index) => (
              <Placeholder key={index} style={{ marginBottom: "var(--aegis-space-small)" }}>
                Content Item {index + 1}
              </Placeholder>
            ))}
          </div>
        </PageLayoutBody>
        <PageLayoutFooter>
          <AegisLink asChild>
            <Link to="/sandbox">← Back to Sandbox</Link>
          </AegisLink>
        </PageLayoutFooter>
      </PageLayoutContent>
    </PageLayout>
  );
};
