import { LegalOnLogoLight } from "@legalforce/aegis-logos/react";
import { Footer, Header, Logo, PageLayout, PageLayoutBody, PageLayoutContent, Text } from "@legalforce/aegis-react";

const FormLayoutTemplate = () => {
  return (
    <>
      <Header>
        <Header.Item>
          <Logo size="medium">
            <LegalOnLogoLight />
          </Logo>
        </Header.Item>
      </Header>

      <PageLayout style={{ flex: 1 }}>
        <PageLayoutContent>
          <PageLayoutBody
            style={{
              backgroundColor: "#f5f0ed",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                inlineSize: "100%",
                maxInlineSize: "var(--aegis-layout-width-medium)",
                marginInline: "auto",
                blockSize: "100%",
                backgroundColor: "#f0e6dc",
              }}
            >
              <Text variant="title.small">Main Content</Text>
              <Text variant="body.medium" color="subtle">
                Auto
              </Text>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>

      <Footer>
        <div
          style={{
            blockSize: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            inlineSize: "100%",
            backgroundColor: "#f8e0d8",
          }}
        >
          <Text variant="body.medium" color="subtle">
            Footer - 1920
          </Text>
        </div>
      </Footer>
    </>
  );
};

export default FormLayoutTemplate;
