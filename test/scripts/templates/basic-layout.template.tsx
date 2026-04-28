import { Link } from "react-router-dom";
import {
  PageLayout,
  PageLayoutSidebar,
  PageLayoutPane,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutBody,
  PageLayoutFooter,
  ContentHeader,
  Link as AegisLink,
} from "@legalforce/aegis-react";
import { Placeholder } from "../../../components/Placeholder";

export const {{COMPONENT_NAME}} = () => {
  return (
    <PageLayout>
      <PageLayoutSidebar aria-label="Start Sidebar">
        <Placeholder style={{ height: 200 }}>Sidebar</Placeholder>
      </PageLayoutSidebar>
      <PageLayoutPane>
        <PageLayoutHeader>
          <Placeholder>Pane(Start):Header</Placeholder>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Placeholder>Pane(Start):Body</Placeholder>
        </PageLayoutBody>
        <PageLayoutFooter>
          <Placeholder>Pane(Start):Footer</Placeholder>
        </PageLayoutFooter>
      </PageLayoutPane>
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
          <Placeholder>Content:Body</Placeholder>
        </PageLayoutBody>
        <PageLayoutFooter>
          <AegisLink asChild>
            <Link to="/sandbox">← Back to Sandbox</Link>
          </AegisLink>
        </PageLayoutFooter>
      </PageLayoutContent>
      <PageLayoutPane position="end" aria-label="End Pane">
        <PageLayoutHeader>
          <Placeholder>Pane(End):Header</Placeholder>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Placeholder>Pane(End):Body</Placeholder>
        </PageLayoutBody>
        <PageLayoutFooter>
          <Placeholder>Pane(End):Footer</Placeholder>
        </PageLayoutFooter>
      </PageLayoutPane>
      <PageLayoutSidebar position="end" aria-label="End Sidebar">
        <Placeholder style={{ height: 200 }}>Sidebar</Placeholder>
      </PageLayoutSidebar>
    </PageLayout>
  );
};
