import { Link } from "react-router-dom";
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutBody,
  PageLayoutFooter,
  ContentHeader,
  Text,
  Link as AegisLink,
} from "@legalforce/aegis-react";
import { Placeholder } from "../../../components/Placeholder";

export const {{COMPONENT_NAME}} = () => {
  return (
    <PageLayout scrollBehavior="inside">
      <PageLayoutContent scrollBehavior="inside">
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>{{PAGE_TITLE}}</ContentHeader.Title>
            <ContentHeader.Description>
              {{PAGE_DESCRIPTION}}
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            This layout uses the &quot;inside&quot; scroll behavior. The content
            scrolls within the body area while the header and footer remain
            fixed.
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
