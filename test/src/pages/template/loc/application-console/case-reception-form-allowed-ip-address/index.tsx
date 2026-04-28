import { LfArrowUpRightFromSquare, LfQuestionCircle } from "@legalforce/aegis-icons";
import {
  Banner,
  Button,
  Link,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Table,
  TableContainer,
  Text,
} from "@legalforce/aegis-react";
import { LocSidebarLayout } from "../../_shared";
import { Navigation, NavigationHeader } from "../_shared";

const sampleIPAddresses = [
  { id: "1", ipAddress: "192.168.1.0/24" },
  { id: "2", ipAddress: "10.0.0.0/8" },
  { id: "3", ipAddress: "172.16.0.0/12" },
];

const CaseReceptionFormAllowedIPAddressTemplate = () => {
  return (
    <LocSidebarLayout activeId="cases">
      <PageLayout>
        <PageLayoutPane>
          <PageLayoutHeader>
            <NavigationHeader />
          </PageLayoutHeader>
          <PageLayoutBody>
            <Navigation currentPage="case-reception-form-allowed-ip-address" />
          </PageLayoutBody>
        </PageLayoutPane>
        <PageLayoutContent align="start" maxWidth="medium">
          <PageLayoutHeader>
            <Text as="h1" variant="title.large">
              案件受付フォームのIPアドレス制限
            </Text>
          </PageLayoutHeader>
          <PageLayoutBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxLarge)" }}>
              {/* リードセクション */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-large)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-xSmall)",
                  }}
                >
                  <Text as="p" variant="component.medium">
                    案件受付フォームへのアクセスを、許可したIPアドレスに制限できます。
                  </Text>
                  <div>
                    <Link
                      href="#"
                      leading={LfQuestionCircle}
                      trailing={LfArrowUpRightFromSquare}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      案件受付フォームへアクセスできるIPアドレスを制限する
                    </Link>
                  </div>
                </div>
                <Banner closeButton={false}>
                  <Text variant="body.medium">
                    IPアドレスによる制限が難しい場合は、依頼者の
                    <Link href="/template/loc/application-console/case-mail-allowed-domain">ドメイン制限の設定</Link>
                    だけでも推奨します。これにより、なりすましメールによる情報漏洩を防げます。
                  </Text>
                </Banner>
              </div>

              {/* 設定 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-medium)",
                }}
              >
                <Button>設定</Button>
                <TableContainer>
                  <Table>
                    <Table.Head>
                      <Table.Row>
                        <Table.Cell>IPアドレス</Table.Cell>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {sampleIPAddresses.map((ip) => (
                        <Table.Row key={ip.id} hover={false}>
                          <Table.Cell>{ip.ipAddress}</Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
};

export default CaseReceptionFormAllowedIPAddressTemplate;
