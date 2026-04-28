import {
  Link as AegisLink,
  Button,
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
import { useState } from "react";
import { Link } from "react-router-dom";
import { Placeholder } from "../../../components/Placeholder";

const WithPane = () => {
  const [paneOpen, setPaneOpen] = useState(false);

  return (
    <PageLayout>
      <PageLayoutPane open={paneOpen} width="medium">
        <PageLayoutHeader>
          <ContentHeader size="medium">
            <ContentHeaderTitle>Pane</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Placeholder>This is a pane that can be toggled open and closed.</Placeholder>
        </PageLayoutBody>
      </PageLayoutPane>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>With Pane</ContentHeaderTitle>
            <ContentHeaderDescription>PageLayout with toggleable Pane</ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            Click the button below to toggle the pane visibility.
          </Text>
          <Button onClick={() => setPaneOpen(!paneOpen)}>{paneOpen ? "Close" : "Open"} Pane</Button>
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

export default WithPane;
