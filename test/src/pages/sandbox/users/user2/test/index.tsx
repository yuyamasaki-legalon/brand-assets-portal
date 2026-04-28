import {
  Link as AegisLink,
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutFooter,
  PageLayoutHeader,
  PageLayoutPane,
  PageLayoutSidebar,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";
import { Placeholder } from "../../../../../components/Placeholder";

export const Test = () => {
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
            <ContentHeader.Title>test</ContentHeader.Title>
            <ContentHeader.Description>Sandbox experimental page</ContentHeader.Description>
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
