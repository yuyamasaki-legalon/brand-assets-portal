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
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";
import { Placeholder } from "../../../components/Placeholder";

const WithResizablePane = () => {
  return (
    <PageLayout>
      <PageLayoutPane resizable minWidth="small" maxWidth="large" width="medium">
        <PageLayoutHeader>
          <ContentHeader size="medium">
            <ContentHeaderTitle>Resizable Pane</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Placeholder>Drag the edge of this pane to resize it. Min width: small, Max width: large</Placeholder>
        </PageLayoutBody>
        <PageLayoutFooter>
          <Placeholder>Pane Footer</Placeholder>
        </PageLayoutFooter>
      </PageLayoutPane>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>With Resizable Pane</ContentHeaderTitle>
            <ContentHeaderDescription>PageLayout with a resizable Pane</ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium">
            The pane on the left can be resized by dragging its edge. This is useful for layouts where users need to
            adjust the size of side panels.
          </Text>
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

export default WithResizablePane;
