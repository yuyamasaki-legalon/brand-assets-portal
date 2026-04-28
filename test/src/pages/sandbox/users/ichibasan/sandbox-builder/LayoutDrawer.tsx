import { Checkbox, CheckboxGroup, Drawer, Switch, Text } from "@legalforce/aegis-react";
import type React from "react";
import type { LayoutKey } from "./types";

const drawerRow: React.CSSProperties = { display: "flex", gap: "var(--aegis-space-xSmall)", alignItems: "flex-start" };
const drawerSection: React.CSSProperties = { display: "flex", gap: "var(--aegis-space-medium)" };
const drawerLabel: React.CSSProperties = { flex: "0 0 160px" };
const drawerDivider: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid var(--aegis-color-border-neutral-subtle)",
  margin: 0,
};

interface LayoutDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  layout: Record<LayoutKey, boolean>;
  toggle: (key: LayoutKey) => void;
  groupValue: (...keys: LayoutKey[]) => LayoutKey[];
  groupChange: (...keys: LayoutKey[]) => (values: string[]) => void;
  iconNavStart: boolean;
  setIconNavStart: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LayoutDrawer = ({
  open,
  onOpenChange,
  layout,
  toggle,
  groupValue,
  groupChange,
  iconNavStart,
  setIconNavStart,
}: LayoutDrawerProps) => {
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      position="end"
      style={{ "--aegis-resizable-inline-size": "400px" } as React.CSSProperties}
    >
      <Drawer.Header>
        <strong>Customize PageLayout</strong>
      </Drawer.Header>
      <Drawer.Body>
        {/* Sidebar / Outside Layout */}
        <div style={drawerSection}>
          <div style={drawerLabel}>
            <Text as="p" variant="title.x3Small" color="subtle">
              Sidebar
            </Text>
            <Text as="p" variant="title.x3Small" color="subtle" style={{ fontWeight: "normal" }}>
              Outside Layout
            </Text>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
            <div style={drawerRow}>
              <div style={{ flex: 1 }}>
                <Checkbox
                  size="small"
                  style={{ width: "100%" }}
                  checked={layout.outerSidebarStart}
                  onChange={() => toggle("outerSidebarStart")}
                >
                  Start
                </Checkbox>
              </div>
              <CheckboxGroup
                size="small"
                style={{ flex: 1 }}
                value={groupValue("outerSidebarStartHeader", "outerSidebarStartFooter")}
                onChange={groupChange("outerSidebarStartHeader", "outerSidebarStartFooter")}
              >
                <Checkbox value="outerSidebarStartHeader" disabled={!layout.outerSidebarStart}>
                  Header
                </Checkbox>
                <Checkbox value="outerSidebarStartFooter" disabled={!layout.outerSidebarStart}>
                  Footer
                </Checkbox>
              </CheckboxGroup>
            </div>
            <Switch
              size="small"
              color="information"
              labelPosition="start"
              checked={iconNavStart}
              onChange={() => setIconNavStart((v) => !v)}
              disabled={!layout.outerSidebarStart}
            >
              Icon Sidebar
            </Switch>
            <hr style={drawerDivider} />
            <div style={drawerRow}>
              <div style={{ flex: 1 }}>
                <Checkbox
                  size="small"
                  style={{ width: "100%" }}
                  checked={layout.outerSidebarEnd}
                  onChange={() => toggle("outerSidebarEnd")}
                >
                  End
                </Checkbox>
              </div>
              <CheckboxGroup
                size="small"
                style={{ flex: 1 }}
                value={groupValue("outerSidebarEndHeader", "outerSidebarEndFooter")}
                onChange={groupChange("outerSidebarEndHeader", "outerSidebarEndFooter")}
              >
                <Checkbox value="outerSidebarEndHeader" disabled={!layout.outerSidebarEnd}>
                  Header
                </Checkbox>
                <Checkbox value="outerSidebarEndFooter" disabled={!layout.outerSidebarEnd}>
                  Footer
                </Checkbox>
              </CheckboxGroup>
            </div>
          </div>
        </div>

        <hr style={drawerDivider} />

        {/* Pagelayout */}
        <div style={drawerSection}>
          <div style={drawerLabel}>
            <Text variant="title.x3Small" color="subtle">
              Pagelayout
            </Text>
          </div>
          <CheckboxGroup
            size="small"
            style={{ flex: 1 }}
            value={groupValue("globalHeader", "globalFooter")}
            onChange={groupChange("globalHeader", "globalFooter")}
          >
            <Checkbox value="globalHeader">Header</Checkbox>
            <Checkbox value="globalFooter">Footer</Checkbox>
          </CheckboxGroup>
        </div>

        <hr style={drawerDivider} />

        {/* content */}
        <div style={drawerSection}>
          <div style={drawerLabel}>
            <Text variant="title.x3Small" color="subtle">
              content
            </Text>
          </div>
          <CheckboxGroup
            size="small"
            style={{ flex: 1 }}
            value={groupValue("contentHeader", "contentFooter")}
            onChange={groupChange("contentHeader", "contentFooter")}
          >
            <Checkbox value="contentHeader">Header</Checkbox>
            <Checkbox value="contentFooter">Footer</Checkbox>
          </CheckboxGroup>
        </div>

        <hr style={drawerDivider} />

        {/* Pane */}
        <div style={drawerSection}>
          <div style={drawerLabel}>
            <Text variant="title.x3Small" color="subtle">
              Pane
            </Text>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
            <div style={drawerRow}>
              <div style={{ flex: 1 }}>
                <Checkbox
                  size="small"
                  style={{ width: "100%" }}
                  checked={layout.paneStart}
                  onChange={() => toggle("paneStart")}
                >
                  Start
                </Checkbox>
              </div>
              <CheckboxGroup
                size="small"
                style={{ flex: 1 }}
                value={groupValue("paneStartHeader", "paneStartFooter")}
                onChange={groupChange("paneStartHeader", "paneStartFooter")}
              >
                <Checkbox value="paneStartHeader" disabled={!layout.paneStart}>
                  Header
                </Checkbox>
                <Checkbox value="paneStartFooter" disabled={!layout.paneStart}>
                  Footer
                </Checkbox>
              </CheckboxGroup>
            </div>
            <hr style={drawerDivider} />
            <div style={drawerRow}>
              <div style={{ flex: 1 }}>
                <Checkbox
                  size="small"
                  style={{ width: "100%" }}
                  checked={layout.paneEnd}
                  onChange={() => toggle("paneEnd")}
                >
                  End
                </Checkbox>
              </div>
              <CheckboxGroup
                size="small"
                style={{ flex: 1 }}
                value={groupValue("paneEndHeader", "paneEndFooter")}
                onChange={groupChange("paneEndHeader", "paneEndFooter")}
              >
                <Checkbox value="paneEndHeader" disabled={!layout.paneEnd}>
                  Header
                </Checkbox>
                <Checkbox value="paneEndFooter" disabled={!layout.paneEnd}>
                  Footer
                </Checkbox>
              </CheckboxGroup>
            </div>
          </div>
        </div>

        <hr style={drawerDivider} />

        {/* Sidebar / Inside Layout */}
        <div style={drawerSection}>
          <div style={drawerLabel}>
            <Text as="p" variant="title.x3Small" color="subtle">
              Sidebar
            </Text>
            <Text as="p" variant="title.x3Small" color="subtle" style={{ fontWeight: "normal" }}>
              Inside Layout
            </Text>
          </div>
          <CheckboxGroup
            size="small"
            style={{ flex: 1 }}
            value={groupValue("innerSidebarStart", "innerSidebarEnd")}
            onChange={groupChange("innerSidebarStart", "innerSidebarEnd")}
          >
            <Checkbox value="innerSidebarStart">Start</Checkbox>
            <Checkbox value="innerSidebarEnd">End</Checkbox>
          </CheckboxGroup>
        </div>
      </Drawer.Body>
    </Drawer>
  );
};
