import { LfCloseLarge, LfFile, LfInformationCircle, LfSetting } from "@legalforce/aegis-icons";
import {
  Link as AegisLink,
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutFooter,
  PageLayoutHeader,
  PageLayoutPane,
  PageLayoutSidebar,
  SideNavigation,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Placeholder } from "../../../components/Placeholder";

type PaneType = "info" | "files" | "settings";

/**
 * PageLayout with Left Sidebar Navigation and Toggleable Pane
 *
 * Key points:
 * - PageLayout.Pane and PageLayout.Sidebar must be DIRECT children of PageLayout
 * - Use position="start" for left-side placement
 * - Do NOT wrap them in separate components (causes layout calculation issues)
 * - Use aria-current for selection state (paneOpen && paneType === "xxx" ? true : undefined)
 * - Same item click toggles Pane closed; different item switches content
 */
const WithSidebarAndPaneStart = () => {
  const [paneOpen, setPaneOpen] = useState(false);
  const [paneType, setPaneType] = useState<PaneType>("info");

  const handleSelectPane = (nextPane: PaneType) => {
    if (paneOpen && paneType === nextPane) {
      // Same item clicked → close Pane
      setPaneOpen(false);
    } else {
      // Different item or Pane closed → open/switch
      setPaneType(nextPane);
      setPaneOpen(true);
    }
  };

  const handleClosePane = () => {
    setPaneOpen(false);
  };

  const getPaneTitle = (): string => {
    switch (paneType) {
      case "info":
        return "Information";
      case "files":
        return "Files";
      case "settings":
        return "Settings";
    }
  };

  const renderPaneContent = () => {
    switch (paneType) {
      case "info":
        return (
          <Placeholder>
            <Text variant="body.medium">Information panel content goes here.</Text>
          </Placeholder>
        );
      case "files":
        return (
          <Placeholder>
            <Text variant="body.medium">File list and management content goes here.</Text>
          </Placeholder>
        );
      case "settings":
        return (
          <Placeholder>
            <Text variant="body.medium">Settings and configuration content goes here.</Text>
          </Placeholder>
        );
    }
  };

  return (
    <PageLayout>
      {/* Sidebar: always visible - must be direct child of PageLayout */}
      <PageLayoutSidebar position="start">
        <SideNavigation aria-label="Side panel navigation">
          <SideNavigation.Group>
            <SideNavigation.Item
              icon={LfInformationCircle}
              onClick={() => handleSelectPane("info")}
              aria-current={paneOpen && paneType === "info" ? true : undefined}
            >
              Information
            </SideNavigation.Item>
            <SideNavigation.Item
              icon={LfFile}
              onClick={() => handleSelectPane("files")}
              aria-current={paneOpen && paneType === "files" ? true : undefined}
            >
              Files
            </SideNavigation.Item>
            <SideNavigation.Item
              icon={LfSetting}
              onClick={() => handleSelectPane("settings")}
              aria-current={paneOpen && paneType === "settings" ? true : undefined}
            >
              Settings
            </SideNavigation.Item>
          </SideNavigation.Group>
        </SideNavigation>
      </PageLayoutSidebar>

      {/* Pane: toggleable - must be direct child of PageLayout */}
      <PageLayoutPane position="start" width="medium" resizable open={paneOpen}>
        <PageLayoutHeader>
          <ContentHeader
            size="medium"
            action={
              <Tooltip title="Close">
                <IconButton variant="plain" size="small" aria-label="Close pane" onClick={handleClosePane}>
                  <Icon>
                    <LfCloseLarge />
                  </Icon>
                </IconButton>
              </Tooltip>
            }
          >
            <ContentHeaderTitle>{getPaneTitle()}</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>{renderPaneContent()}</PageLayoutBody>
      </PageLayoutPane>

      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>With Sidebar and Pane (Start)</ContentHeaderTitle>
            <ContentHeaderDescription>
              Left sidebar navigation with toggleable Pane (correct pattern)
            </ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            Click the icons in the left sidebar to toggle the Pane. Clicking the same icon again will close the Pane.
          </Text>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            This template demonstrates the correct pattern for combining PageLayout.Sidebar (with SideNavigation) and
            PageLayout.Pane on the left side:
          </Text>
          <ul style={{ marginBottom: "var(--aegis-space-medium)", paddingLeft: "var(--aegis-space-large)" }}>
            <li>
              <Text variant="body.medium">Both Pane and Sidebar use position="start" for left placement</Text>
            </li>
            <li>
              <Text variant="body.medium">Sidebar and Pane are declared before Content in JSX order</Text>
            </li>
            <li>
              <Text variant="body.medium">Tooltip placement is "right" (opposite of sidebar position)</Text>
            </li>
            <li>
              <Text variant="body.medium">Use aria-current for selection state highlighting</Text>
            </li>
          </ul>
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

export default WithSidebarAndPaneStart;
