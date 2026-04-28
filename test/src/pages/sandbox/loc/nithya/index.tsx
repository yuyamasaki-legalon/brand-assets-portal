import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Link as AegisLink,
  Card,
  CardBody,
  Code,
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

export function UserNithyaSandbox() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>nithya’s Sandbox</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            Your space for experiments and prototypes. Add pages as you like.
          </Text>

          <Accordion style={{ marginBottom: "var(--aegis-space-large)" }}>
            <AccordionItem>
              <AccordionButton>
                <Text as="p" variant="label.medium">
                  How to add pages
                </Text>
              </AccordionButton>
              <AccordionPanel>
                <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
                  To create a new page in this sandbox, run:
                </Text>
                <Code
                  style={{
                    display: "block",
                    marginBottom: "var(--aegis-space-medium)",
                  }}
                >
                  pnpm sandbox:create
                </Code>
                <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
                  When prompted, choose “User environment” and select nithya.
                </Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(var(--aegis-layout-width-x5Small), 1fr))",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            <Card>
              <CardBody>
                <Text variant="body.small">No pages yet</Text>
              </CardBody>
            </Card>
          </div>

          <AegisLink asChild>
            <Link to="/sandbox/loc">← Back to LegalOn Sandbox</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
