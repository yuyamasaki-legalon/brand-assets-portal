import { LfArrowUpRightFromSquare, LfQuestionCircle } from "@legalforce/aegis-icons";
import {
  Button,
  DescriptionList,
  DescriptionListDetail,
  DescriptionListItem,
  DescriptionListTerm,
  Link,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Text,
} from "@legalforce/aegis-react";
import { LocSidebarLayout } from "../../_shared";
import { Navigation, NavigationHeader } from "../_shared";

const CaseReceptionSpaceTemplate = () => {
  return (
    <LocSidebarLayout activeId="cases">
      <PageLayout>
        <PageLayoutPane>
          <PageLayoutHeader>
            <NavigationHeader />
          </PageLayoutHeader>
          <PageLayoutBody>
            <Navigation currentPage="case-reception-space" />
          </PageLayoutBody>
        </PageLayoutPane>
        <PageLayoutContent align="start" maxWidth="medium">
          <PageLayoutHeader>
            <Text as="h1" variant="title.large">
              案件受付ワークスペース
            </Text>
          </PageLayoutHeader>
          <PageLayoutBody>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-large)",
              }}
            >
              {/* リードテキスト */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-xSmall)",
                  paddingBlockEnd: "var(--aegis-space-medium)",
                }}
              >
                <Text as="p" variant="component.medium">
                  案件受付メールアドレスに対して新規メールを送信したときに、案件が作成されるワークスペースを指定できます。
                </Text>
                <div>
                  <Link
                    href="#"
                    leading={LfQuestionCircle}
                    trailing={LfArrowUpRightFromSquare}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    案件受付時に案件が作成されるワークスペースの設定
                  </Link>
                </div>
              </div>

              {/* スペース設定（閲覧モード） */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-xxLarge)",
                }}
              >
                <DescriptionList>
                  <DescriptionListItem>
                    <DescriptionListTerm>ワークスペース</DescriptionListTerm>
                    <DescriptionListDetail>デフォルトスペース</DescriptionListDetail>
                  </DescriptionListItem>
                </DescriptionList>
                <div>
                  <Button>編集</Button>
                </div>
              </div>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
};

export default CaseReceptionSpaceTemplate;
