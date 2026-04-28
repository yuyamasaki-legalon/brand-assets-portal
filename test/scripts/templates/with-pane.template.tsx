import { useState } from "react";
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
  Button,
  Link as AegisLink,
} from "@legalforce/aegis-react";
import { Placeholder } from "../../../components/Placeholder";

export const {{COMPONENT_NAME}} = () => {
  const [paneOpen, setPaneOpen] = useState(false);

  return (
    <PageLayout>
      <PageLayoutPane open={paneOpen} width="medium">
        <PageLayoutHeader>
          <ContentHeader size="medium">
            <ContentHeader.Title>Pane</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Placeholder>
            This is a pane that can be toggled open and closed.
          </Placeholder>
        </PageLayoutBody>
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
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            Click the button below to toggle the pane visibility.
          </Text>
          <Button onClick={() => setPaneOpen(!paneOpen)}>
            {paneOpen ? "Close" : "Open"} Pane
          </Button>
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
