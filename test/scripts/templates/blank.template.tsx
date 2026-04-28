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
          <Text as="p" variant="body.medium">
            Start building your custom layout here.
          </Text>
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
