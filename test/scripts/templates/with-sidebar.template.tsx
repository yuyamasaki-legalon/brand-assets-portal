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
import { StartSidebar } from "../../../components/StartSidebar";

export const {{COMPONENT_NAME}} = () => {
  return (
    <PageLayout>
      <StartSidebar />
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
            This layout includes a sidebar with navigation items.
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
