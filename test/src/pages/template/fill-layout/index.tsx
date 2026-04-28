import {
  LfAngleDownMiddle,
  LfAngleLeftLarge,
  LfBarSparkles,
  LfBook,
  LfCloseLarge,
  LfEllipsisDot,
  LfFile,
  LfInformationCircle,
  LfMagnifyingGlass,
  LfMenu,
  LfPlusLarge,
  LfScaleBalanced,
} from "@legalforce/aegis-icons";
import {
  Button,
  ButtonGroup,
  ContentHeader,
  ContentHeaderTitle,
  Divider,
  Header,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  PageLayoutSidebar,
  SideNavigation,
  StatusLabel,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type PaneType = "info" | "summary" | "file" | "case" | "reference" | "book";

const FillLayout = () => {
  const navigate = useNavigate();
  const [paneType, setPaneType] = useState<PaneType>("info");
  const [paneOpen, setPaneOpen] = useState(true);

  const currentPane = paneOpen ? paneType : undefined;

  const handleSelectPane = (nextPane: PaneType) => {
    setPaneType(nextPane);
    setPaneOpen(true);
  };

  return (
    <>
      <Header>
        <Header.Item>
          <Tooltip title="Menu">
            <IconButton variant="plain" aria-label="Menu">
              <Icon>
                <LfMenu />
              </Icon>
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" />
          <Tooltip title="Back">
            <IconButton variant="plain" aria-label="Back" onClick={() => navigate("/template")}>
              <Icon>
                <LfAngleLeftLarge />
              </Icon>
            </IconButton>
          </Tooltip>
        </Header.Item>
        <Header.Item>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
              <StatusLabel color="blue">Status Label</StatusLabel>
              <Header.Title>
                <Text variant="title.xxSmall">Title</Text>
              </Header.Title>
            </div>
            <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)" }}>
              <Text variant="body.small" color="subtle">
                SubText
              </Text>
              <Text variant="body.small" color="subtle">
                SubText
              </Text>
            </div>
          </div>
        </Header.Item>
        <Header.Spacer />
        <Header.Item>
          <Tooltip title="Search">
            <IconButton variant="plain" aria-label="Search">
              <Icon>
                <LfMagnifyingGlass />
              </Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Add">
            <IconButton variant="plain" aria-label="Add">
              <Icon>
                <LfPlusLarge />
              </Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Add">
            <IconButton variant="plain" aria-label="Add">
              <Icon>
                <LfPlusLarge />
              </Icon>
            </IconButton>
          </Tooltip>
          <ButtonGroup>
            <Button variant="subtle">Button</Button>
            <Button variant="solid">Button</Button>
            <Button variant="subtle" leading={LfPlusLarge} trailing={LfAngleDownMiddle}>
              Button
            </Button>
          </ButtonGroup>
          <Tooltip title="More">
            <IconButton variant="plain" aria-label="More">
              <Icon>
                <LfEllipsisDot />
              </Icon>
            </IconButton>
          </Tooltip>
        </Header.Item>
      </Header>

      <PageLayout>
        <PageLayoutContent variant="fill">
          <PageLayoutHeader>
            <ContentHeader>
              <ContentHeaderTitle>ContentHeader</ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>
          <PageLayoutBody>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "var(--aegis-space-small)",
                backgroundColor: "var(--aegis-color-background-warning-xSubtle)",
                borderRadius: "var(--aegis-radius-medium)",
              }}
            >
              <Text variant="body.medium" color="subtle">
                ToolBar
              </Text>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                minHeight: "var(--aegis-layout-width-x3Small)",
                backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
                borderRadius: "var(--aegis-radius-large)",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <Text variant="title.small" color="subtle">
                  Main Content
                </Text>
                <br />
                <Text variant="body.medium" color="subtle">
                  Auto
                </Text>
              </div>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>

        <PageLayoutPane position="end" resizable minWidth="large" width="large" open={paneOpen}>
          <PageLayoutHeader>
            <ContentHeader
              trailing={
                <Tooltip title="Close" placement="top">
                  <IconButton variant="plain" size="small" aria-label="Close" onClick={() => setPaneOpen(false)}>
                    <Icon>
                      <LfCloseLarge />
                    </Icon>
                  </IconButton>
                </Tooltip>
              }
            >
              <ContentHeaderTitle>ContentHeader</ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>
          <PageLayoutBody>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "var(--aegis-space-small)",
                backgroundColor: "var(--aegis-color-background-warning-xSubtle)",
                borderRadius: "var(--aegis-radius-medium)",
              }}
            >
              <Text variant="body.medium" color="subtle">
                ToolBar
              </Text>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                minHeight: "var(--aegis-layout-width-x3Small)",
                backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
                borderRadius: "var(--aegis-radius-large)",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <Text variant="title.small" color="subtle">
                  Pane Content
                </Text>
                <br />
                <Text variant="body.medium" color="subtle">
                  min-400
                </Text>
              </div>
            </div>
          </PageLayoutBody>
        </PageLayoutPane>

        <PageLayoutSidebar position="end">
          <SideNavigation>
            <SideNavigation.Group>
              <SideNavigation.Item
                icon={LfInformationCircle}
                onClick={() => handleSelectPane("info")}
                aria-current={currentPane === "info" ? true : undefined}
              />
              <SideNavigation.Item
                icon={LfBarSparkles}
                onClick={() => handleSelectPane("summary")}
                aria-current={currentPane === "summary" ? true : undefined}
              />
              <SideNavigation.Item
                icon={LfFile}
                onClick={() => handleSelectPane("file")}
                aria-current={currentPane === "file" ? true : undefined}
              />
            </SideNavigation.Group>
            <SideNavigation.Group>
              <SideNavigation.Item
                icon={LfScaleBalanced}
                onClick={() => handleSelectPane("reference")}
                aria-current={currentPane === "reference" ? true : undefined}
              />
              <SideNavigation.Item
                icon={LfBook}
                onClick={() => handleSelectPane("book")}
                aria-current={currentPane === "book" ? true : undefined}
              />
            </SideNavigation.Group>
          </SideNavigation>
        </PageLayoutSidebar>
      </PageLayout>
    </>
  );
};

export default FillLayout;
