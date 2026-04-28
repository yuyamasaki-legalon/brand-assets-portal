import { LfArrowUpRightFromSquare, LfQuestionCircle } from "@legalforce/aegis-icons";
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  Link,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Select,
  Text,
} from "@legalforce/aegis-react";
import { LocSidebarLayout } from "../../../_shared";
import { Navigation, NavigationHeader } from "../_shared";

// 保存先スペースのモックデータ
const spaceOptions = [
  { value: "sign-request", label: "署名依頼スペース" },
  { value: "contract-review", label: "契約審査" },
  { value: "nda", label: "NDA管理" },
  { value: "signed", label: "締結済み契約書" },
] as const;

export default function DefaultSpaceTemplate() {
  return (
    <LocSidebarLayout activeId="others">
      <PageLayout>
        <PageLayoutPane>
          <PageLayoutHeader>
            <NavigationHeader />
          </PageLayoutHeader>
          <PageLayoutBody>
            <Navigation currentPage="default-space" />
          </PageLayoutBody>
        </PageLayoutPane>
        <PageLayoutContent align="start" maxWidth="medium">
          <PageLayoutHeader>
            <Text as="h1" variant="title.large">
              署名依頼の保存先
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
                }}
              >
                <Text as="p" variant="body.medium">
                  署名依頼の保存先を指定できます。
                </Text>
                <div>
                  <Link
                    href="#"
                    leading={LfQuestionCircle}
                    trailing={LfArrowUpRightFromSquare}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    署名依頼保存先を設定する
                  </Link>
                </div>
              </div>

              {/* フォーム */}
              <Form>
                <FormGroup>
                  <FormControl>
                    <FormControl.Label>保存先</FormControl.Label>
                    <Select defaultValue="sign-request" options={spaceOptions} />
                  </FormControl>
                </FormGroup>
              </Form>

              {/* 保存ボタン */}
              <div>
                <Button disabled>保存</Button>
              </div>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
}
