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
  PageLayoutPane,
  PageLayoutSidebar,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";
import { Placeholder } from "../../../components/Placeholder";

const BasicLayout = () => {
  return (
    <PageLayout>
      <PageLayoutSidebar aria-label="Start Sidebar">
        <Placeholder style={{ height: "var(--aegis-layout-width-x6Small)" }}>Sidebar</Placeholder>
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
            <ContentHeaderTitle>Basic Layout</ContentHeaderTitle>
            <ContentHeaderDescription>All PageLayout elements (Sidebar, Pane, Content)</ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Placeholder>Content:Body</Placeholder>
        </PageLayoutBody>
        <PageLayoutFooter>
          <AegisLink asChild>
            <Link to="/template/pagelayout">← Back to PageLayout Templates</Link>
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
        <Placeholder style={{ height: "var(--aegis-layout-width-x6Small)" }}>Sidebar</Placeholder>
      </PageLayoutSidebar>
    </PageLayout>
  );
};

export default BasicLayout;
