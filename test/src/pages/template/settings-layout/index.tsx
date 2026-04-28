import { LfArrowUpRightFromSquare, LfPen, LfPlusLarge, LfQuestionCircle } from "@legalforce/aegis-icons";
import {
  Banner,
  Button,
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
  Divider,
  Icon,
  Link,
  NavList,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Switch,
  Table,
  TableContainer,
  Text,
} from "@legalforce/aegis-react";

// Setting row component for table-based layout
function SettingRow({ label, value, onEdit }: { label: string; value?: string; onEdit?: () => void }) {
  return (
    <Table.Row hover={false}>
      <Table.Cell as="td">
        <Text variant="component.medium.bold">{label}</Text>
      </Table.Cell>
      <Table.Cell as="td">
        <Text variant="body.medium">{value ?? "—"}</Text>
      </Table.Cell>
      <Table.Cell textAlign="end" as="td">
        {onEdit ? (
          <Button
            variant="subtle"
            size="small"
            color="neutral"
            leading={
              <Icon size="small">
                <LfPen />
              </Icon>
            }
            onClick={onEdit}
          >
            変更
          </Button>
        ) : null}
      </Table.Cell>
    </Table.Row>
  );
}

export default function SettingsLayout() {
  return (
    <PageLayout>
      <PageLayoutPane position="start">
        <PageLayoutHeader>
          <Text as="h2" variant="title.large">
            Settings
          </Text>
        </PageLayoutHeader>
        <PageLayoutBody>
          <NavList>
            <NavList.Group title="Account">
              <NavList.Item aria-current="page">Profile</NavList.Item>
              <NavList.Item>Security</NavList.Item>
              <NavList.Item>Notifications</NavList.Item>
            </NavList.Group>
            <NavList.Group title="Organization">
              <NavList.Item>Users</NavList.Item>
              <NavList.Item>Groups</NavList.Item>
              <NavList.Item>Permissions</NavList.Item>
            </NavList.Group>
            <NavList.Group title="Integrations">
              <NavList.Item>Slack</NavList.Item>
              <NavList.Item>SSO</NavList.Item>
              <NavList.Item>API Keys</NavList.Item>
            </NavList.Group>
          </NavList>
        </PageLayoutBody>
      </PageLayoutPane>

      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Profile Settings</ContentHeaderTitle>
            <ContentHeaderDescription>Manage your account profile and preferences</ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-xxLarge)",
            }}
          >
            {/* Description section with help link */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-xSmall)",
              }}
            >
              <Text>
                Update your profile information below.
                <br />
                Changes will be reflected across all services.
              </Text>
              <Link href="#">
                <Text
                  as="span"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--aegis-space-xxSmall)",
                  }}
                >
                  <Icon size="small">
                    <LfQuestionCircle />
                  </Icon>
                  Help documentation
                  <Icon size="small">
                    <LfArrowUpRightFromSquare />
                  </Icon>
                </Text>
              </Link>
            </div>

            {/* Warning banner example */}
            <Banner color="warning" closeButton={false}>
              <Text>Some settings may require administrator approval to change.</Text>
            </Banner>

            {/* Account info section - Table-based settings */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-medium)",
              }}
            >
              <Text as="h3" variant="body.large.bold">
                Account Information
              </Text>
              <TableContainer>
                <Table size="small">
                  <Table.Body>
                    <SettingRow label="User ID" value="user-12345678" />
                    <SettingRow label="Email" value="user@example.com" onEdit={() => {}} />
                    <SettingRow label="Phone" value="+81-90-1234-5678" onEdit={() => {}} />
                    <SettingRow label="Password" value="••••••••" onEdit={() => {}} />
                  </Table.Body>
                </Table>
              </TableContainer>
            </div>

            <Divider />

            {/* Toggle settings section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-medium)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-xSmall)",
                }}
              >
                <Text as="h3" variant="body.large.bold">
                  Security Settings
                </Text>
                <Text color="subtle">Configure security options for your account.</Text>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-medium)",
                }}
              >
                <Switch labelPosition="end">Two-factor authentication</Switch>
                <Switch labelPosition="end" defaultChecked>
                  Email notifications for login
                </Switch>
                <Switch labelPosition="end">Require password change every 90 days</Switch>
              </div>
            </div>

            <Divider />

            {/* List section with add button */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-medium)",
              }}
            >
              <Text as="h3" variant="body.large.bold">
                Connected Services
              </Text>
              <Button leading={LfPlusLarge} variant="solid" size="medium" style={{ alignSelf: "flex-start" }}>
                Add Connection
              </Button>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-xxSmall)",
                  padding: "var(--aegis-space-medium)",
                  backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
                  borderRadius: "var(--aegis-radius-medium)",
                }}
              >
                <Text color="subtle">No connected services yet.</Text>
                <Text color="subtle">Add integrations to sync your data.</Text>
              </div>
            </div>

            {/* Save button */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "var(--aegis-space-small)",
              }}
            >
              <Button variant="plain">Cancel</Button>
              <Button variant="solid">Save Changes</Button>
            </div>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
