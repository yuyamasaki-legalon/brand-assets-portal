import { LfAngleDownMiddle, LfTranslate } from "@legalforce/aegis-icons";
import {
  Banner,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
  Icon,
  IconButton,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import type { ComponentProps } from "react";

type SplitButtonProps = {
  variant: ComponentProps<typeof ButtonGroup>["variant"];
  size: ComponentProps<typeof ButtonGroup>["size"];
};

function SplitButton({ variant, size }: SplitButtonProps) {
  return (
    <ButtonGroup attached variant={variant} color="information" size={size}>
      <Button onClick={() => console.log("Translate to English")}>Translate to English</Button>
      <Menu>
        <MenuTrigger>
          <IconButton aria-label="More translation options">
            <Icon>
              <LfAngleDownMiddle />
            </Icon>
          </IconButton>
        </MenuTrigger>
        <MenuContent side="bottom" align="end">
          <MenuItem
            leading={
              <Icon>
                <LfTranslate />
              </Icon>
            }
            onClick={() => console.log("Translate to other language")}
          >
            Translate to other language
          </MenuItem>
        </MenuContent>
      </Menu>
    </ButtonGroup>
  );
}

export const SplitButtonBanner = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>SplitButton in Banner</ContentHeaderTitle>
            <ContentHeaderDescription>
              Information Banner with SplitButton (ButtonGroup attached + Menu)
            </ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
            {/* Medium Banner (main use case) - subtle buttons */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">Medium Banner (subtle button)</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
                  <Banner
                    color="information"
                    inline
                    closeButton={false}
                    action={<SplitButton variant="subtle" size="small" />}
                  >
                    Translate and save as English?
                  </Banner>
                  <Text variant="body.small" color="subtle">
                    medium Banner + inline: text and action on one line.
                  </Text>
                </div>
              </CardBody>
            </Card>

            {/* Large Banner (reference) - solid buttons */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">Large Banner (solid button)</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
                  <Banner
                    color="information"
                    size="large"
                    closeButton={false}
                    action={<SplitButton variant="solid" size="small" />}
                  >
                    Translate and save as English?
                  </Banner>
                  <Text variant="body.small" color="subtle">
                    large Banner uses solid variant buttons per Banner guidelines.
                  </Text>
                </div>
              </CardBody>
            </Card>

            {/* Small Banner */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">Small Banner (subtle button)</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
                  <Banner
                    color="information"
                    size="small"
                    inline
                    closeButton={false}
                    action={<SplitButton variant="subtle" size="xSmall" />}
                  >
                    Translate and save as English?
                  </Banner>
                  <Text variant="body.small" color="subtle">
                    small Banner + inline for Pane/Dialog use cases.
                  </Text>
                </div>
              </CardBody>
            </Card>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
