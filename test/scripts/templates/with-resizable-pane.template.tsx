import { Link } from "react-router-dom";
import {
  PageLayout,
  PageLayoutPane,
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
    <PageLayout>
      <PageLayoutPane resizable minWidth="small" maxWidth="large" width="medium">
        <PageLayoutHeader>
          <ContentHeader size="medium">
            <ContentHeader.Title>Resizable Pane</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Placeholder>
            Drag the edge of this pane to resize it. Min width: small, Max
            width: large
          </Placeholder>
        </PageLayoutBody>
        <PageLayoutFooter>
          <Placeholder>Pane Footer</Placeholder>
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
          <Text as="p" variant="body.medium">
            The pane on the left can be resized by dragging its edge. This is
            useful for layouts where users need to adjust the size of side
            panels.
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
