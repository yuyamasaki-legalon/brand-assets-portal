import { LfArrowUpRightFromSquare } from "@legalforce/aegis-icons";
import {
  ContentHeader,
  ContentHeaderTitle,
  Divider,
  Link,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  StatusLabel,
  snackbar,
  Table,
  TableContainer,
  Tag,
  Text,
} from "@legalforce/aegis-react";
import { LocSidebarLayout } from "../_shared";
import { ManagementConsoleNavList } from "./_shared/ManagementConsoleNavList";
import {
  formatUsage,
  getAlertLevel,
  MOCK_COMMON_USAGE,
  MOCK_MODULE_LICENSES,
  MOCK_OPTION_LICENSES,
  MOCK_TENANT,
  type ModuleLicense,
  type OptionLicense,
} from "./mock/licenseData";

// TenantContractPlan Component
const TenantContractPlan = () => {
  return (
    <div>
      <ContentHeader size="small">
        <ContentHeaderTitle>ライセンス</ContentHeaderTitle>
      </ContentHeader>
      <dl
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--aegis-space-xSmall)",
          marginTop: "var(--aegis-space-medium)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "var(--aegis-space-x5Large)",
          }}
        >
          <dt style={{ width: "var(--aegis-size-x13Large)" }}>
            <Text variant="body.medium" color="subtle">
              テナント名
            </Text>
          </dt>
          <dd>
            <Text variant="body.medium">{MOCK_TENANT.name}</Text>
          </dd>
        </div>
        <div
          style={{
            display: "flex",
            gap: "var(--aegis-space-x5Large)",
          }}
        >
          <dt style={{ width: "var(--aegis-size-x13Large)" }}>
            <Text variant="body.medium" color="subtle">
              テナントID
            </Text>
          </dt>
          <dd>
            <Text variant="body.medium">{MOCK_TENANT.id}</Text>
          </dd>
        </div>
        <div
          style={{
            display: "flex",
            gap: "var(--aegis-space-x5Large)",
          }}
        >
          <dt style={{ width: "var(--aegis-size-x13Large)" }}>
            <Text variant="body.medium" color="subtle">
              契約プラン
            </Text>
          </dt>
          <dd>
            <Tag variant="fill" color="blue">
              {MOCK_TENANT.plan}
            </Tag>
          </dd>
        </div>
      </dl>
    </div>
  );
};

// CommonUsageStatus Component
const CommonUsageStatus = () => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--aegis-space-xSmall)",
        }}
      >
        <ContentHeader size="small">
          <ContentHeaderTitle>テナント</ContentHeaderTitle>
        </ContentHeader>
        <Link
          href="#"
          trailing={LfArrowUpRightFromSquare}
          onClick={(e) => {
            e.preventDefault();
            snackbar.show({ message: "外部リンクを開きました" });
          }}
        >
          <Text variant="body.small">テナント共通ライセンスについて</Text>
        </Link>
      </div>

      <div
        style={{
          border: "1px solid var(--aegis-color-border-default)",
          borderRadius: "var(--aegis-radius-medium)",
          padding: "var(--aegis-space-small)",
          marginTop: "var(--aegis-space-medium)",
        }}
      >
        <TableContainer>
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Cell>ライセンス</Table.Cell>
                <Table.Cell textAlign="end">利用数 / 上限数</Table.Cell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {MOCK_COMMON_USAGE.map((quota) => {
                const alertLevel = getAlertLevel(quota.current, quota.max);
                const displayValue =
                  quota.max === null ? (
                    <Text variant="body.medium">無制限</Text>
                  ) : (
                    <Text variant="body.medium" color={alertLevel === "danger" ? "danger" : "default"}>
                      {formatUsage(quota.current, quota.max)}
                    </Text>
                  );

                return (
                  <Table.Row key={quota.name}>
                    <Table.Cell>
                      <Text variant="body.medium">{quota.name}</Text>
                    </Table.Cell>
                    <Table.Cell textAlign="end">{displayValue}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

// ModuleUsageStatus Component
interface ModuleUsageStatusProps {
  module: ModuleLicense;
}

const ModuleUsageStatus = ({ module }: ModuleUsageStatusProps) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--aegis-space-medium)",
        }}
      >
        <ContentHeader size="small">
          <ContentHeaderTitle>{module.name}</ContentHeaderTitle>
        </ContentHeader>
        {module.isTrial && <StatusLabel>トライアル</StatusLabel>}
      </div>
      <Text variant="body.small" color="subtle" style={{ marginTop: "var(--aegis-space-xSmall)" }}>
        有効期間: {module.period.start} 〜 {module.period.end}
      </Text>

      {/* User Types Table */}
      <div
        style={{
          border: "1px solid var(--aegis-color-border-default)",
          borderRadius: "var(--aegis-radius-medium)",
          padding: "var(--aegis-space-small)",
          marginTop: "var(--aegis-space-medium)",
        }}
      >
        <TableContainer>
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Cell>ユーザータイプ</Table.Cell>
                <Table.Cell textAlign="end">利用数 / 上限数</Table.Cell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {module.userTypes.map((userType) => {
                const alertLevel = getAlertLevel(userType.current, userType.max);
                return (
                  <Table.Row key={userType.name}>
                    <Table.Cell>
                      <Text variant="body.medium">{userType.name}</Text>
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                      <Text variant="body.medium" color={alertLevel === "danger" ? "danger" : "default"}>
                        {formatUsage(userType.current, userType.max)}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </TableContainer>
      </div>

      {/* Usage Counts Table */}
      {module.usageCounts && module.usageCounts.length > 0 && (
        <div
          style={{
            border: "1px solid var(--aegis-color-border-default)",
            borderRadius: "var(--aegis-radius-medium)",
            padding: "var(--aegis-space-small)",
            marginTop: "var(--aegis-space-medium)",
          }}
        >
          <TableContainer>
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Cell>実行数</Table.Cell>
                  <Table.Cell textAlign="end">利用数 / 上限数</Table.Cell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {module.usageCounts.map((usage) => {
                  const alertLevel = getAlertLevel(usage.current, usage.max);
                  return (
                    <Table.Row key={usage.name}>
                      <Table.Cell>
                        <Text variant="body.medium">{usage.name}</Text>
                      </Table.Cell>
                      <Table.Cell textAlign="end">
                        <Text variant="body.medium" color={alertLevel === "danger" ? "danger" : "default"}>
                          {formatUsage(usage.current, usage.max)}
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
};

const OptionUsageStatus = ({ options }: { options: OptionLicense[] }) => {
  if (options.length === 0) return null;

  return (
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
          alignItems: "center",
          gap: "var(--aegis-space-xSmall)",
        }}
      >
        <ContentHeader size="small">
          <ContentHeaderTitle>オプション</ContentHeaderTitle>
        </ContentHeader>
        <Link
          href="#"
          trailing={LfArrowUpRightFromSquare}
          onClick={(e) => {
            e.preventDefault();
            snackbar.show({ message: "外部リンクを開きました" });
          }}
        >
          <Text variant="body.small">オプションライセンスについて</Text>
        </Link>
      </div>

      <div
        style={{
          border: "1px solid var(--aegis-color-border-default)",
          borderRadius: "var(--aegis-radius-medium)",
          padding: "var(--aegis-space-small)",
        }}
      >
        <TableContainer>
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Cell>ライセンス</Table.Cell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {options.map((option) => (
                <Table.Row key={option.id}>
                  <Table.Cell>
                    <Text variant="body.medium">{option.name}</Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

// Main Component
export const ManagementConsoleIndex = () => {
  return (
    <LocSidebarLayout activeId="others">
      <PageLayout>
        {/* Left Sidebar Navigation */}
        <ManagementConsoleNavList activePage="license" />

        {/* Main Content */}
        <PageLayoutContent>
          <PageLayoutHeader>
            <ContentHeader>
              <ContentHeaderTitle>ライセンス</ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>
          <PageLayoutBody>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-x4Large)",
              }}
            >
              {/* Tenant Contract Plan */}
              <TenantContractPlan />

              <Divider />

              {/* Common Usage Status */}
              <CommonUsageStatus />

              <Divider />

              {/* Module Licenses */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--aegis-space-xSmall)",
                    marginBottom: "var(--aegis-space-large)",
                  }}
                >
                  <ContentHeader size="small">
                    <ContentHeaderTitle>モジュール</ContentHeaderTitle>
                  </ContentHeader>
                  <Link
                    href="#"
                    trailing={LfArrowUpRightFromSquare}
                    onClick={(e) => {
                      e.preventDefault();
                      snackbar.show({ message: "外部リンクを開きました" });
                    }}
                  >
                    <Text variant="body.small">モジュールライセンスについて</Text>
                  </Link>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-xxLarge)",
                  }}
                >
                  {MOCK_MODULE_LICENSES.map((module) => (
                    <ModuleUsageStatus key={module.id} module={module} />
                  ))}
                </div>
              </div>

              <Divider />

              {/* Option Licenses */}
              <OptionUsageStatus options={MOCK_OPTION_LICENSES} />

              <Divider />

              <Text variant="caption.xSmall" color="subtle">
                Management Consoleは、ライセンス使用状況とテナント情報を管理するための画面です。
              </Text>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
};
