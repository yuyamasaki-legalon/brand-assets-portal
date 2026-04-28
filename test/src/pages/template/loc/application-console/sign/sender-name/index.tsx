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
  Text,
  TextField,
} from "@legalforce/aegis-react";
import { LocSidebarLayout } from "../../../_shared";
import { Navigation, NavigationHeader } from "../_shared";

export default function SenderNameTemplate() {
  return (
    <LocSidebarLayout activeId="others">
      <PageLayout>
        <PageLayoutPane>
          <PageLayoutHeader>
            <NavigationHeader />
          </PageLayoutHeader>
          <PageLayoutBody>
            <Navigation currentPage="sender-name" />
          </PageLayoutBody>
        </PageLayoutPane>
        <PageLayoutContent align="start" maxWidth="medium">
          <PageLayoutHeader>
            <Text as="h1" variant="title.large">
              差出人企業名
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
                  宛先に送信するメールに表示する差出人企業名を設定します。
                </Text>
                <div>
                  <Link
                    href="#"
                    leading={LfQuestionCircle}
                    trailing={LfArrowUpRightFromSquare}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    差出人企業名を設定する
                  </Link>
                </div>
              </div>

              {/* フォーム */}
              <Form>
                <FormGroup>
                  <FormControl required>
                    <FormControl.Label>差出人企業名</FormControl.Label>
                    <TextField placeholder="差出人企業名を入力" defaultValue="株式会社Example" />
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
