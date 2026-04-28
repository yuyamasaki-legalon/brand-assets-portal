import { LfArrowUpRightFromSquare, LfQuestionCircle } from "@legalforce/aegis-icons";
import {
  Button,
  FormControl,
  Link,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Select,
  Text,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { LocSidebarLayout } from "../../../_shared";
import { Navigation, NavigationHeader } from "../_shared";

// 月数オプション（閲覧権限のある契約書の通知期間）
const monthOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "6", label: "6" },
  { value: "12", label: "12" },
];

// 日数オプション（契約担当者の通知日数）
const dayOptions = [
  { value: "7", label: "7" },
  { value: "14", label: "14" },
  { value: "30", label: "30" },
  { value: "60", label: "60" },
  { value: "90", label: "90" },
  { value: "180", label: "180" },
];

export default function NotificationTemplate() {
  const [viewerMonths, setViewerMonths] = useState("1");
  const [assigneeDays, setAssigneeDays] = useState("60");

  return (
    <LocSidebarLayout activeId="others">
      <PageLayout>
        <PageLayoutPane>
          <PageLayoutHeader>
            <NavigationHeader />
          </PageLayoutHeader>
          <PageLayoutBody>
            <Navigation currentPage="notification" />
          </PageLayoutBody>
        </PageLayoutPane>
        <PageLayoutContent align="start" maxWidth="medium">
          <PageLayoutHeader>
            <Text as="h1" variant="title.large">
              期限通知
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
                  契約書の期限通知を社内の運用に適したタイミングに変更できます。
                </Text>
                <div>
                  <Link
                    href="#"
                    leading={LfQuestionCircle}
                    trailing={LfArrowUpRightFromSquare}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    期限通知時期の変更方法について
                  </Link>
                </div>
              </div>

              {/* セクション1: 閲覧権限のある契約書 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-xSmall)",
                }}
              >
                <FormControl>
                  <FormControl.Label>閲覧権限のある契約書</FormControl.Label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--aegis-space-xSmall)",
                    }}
                  >
                    <div style={{ width: "var(--aegis-layout-width-x7Small)" }}>
                      <Select
                        options={monthOptions}
                        value={viewerMonths}
                        onChange={(value) => setViewerMonths(value ?? "1")}
                      />
                    </div>
                    <Text variant="body.medium">ヶ月以内</Text>
                  </div>
                </FormControl>
                <Text as="p" variant="label.medium" color="subtle">
                  更新拒絶期限日または契約終了日までの期間が{viewerMonths}
                  ヶ月以内である契約書の一覧を、毎月1日に送信します。
                </Text>
              </div>

              {/* セクション2: 契約担当者になっている契約書 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-xSmall)",
                }}
              >
                <Text as="h2" variant="title.small">
                  契約担当者になっている契約書
                </Text>
                <FormControl>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--aegis-space-xSmall)",
                    }}
                  >
                    <div style={{ width: "var(--aegis-layout-width-x7Small)" }}>
                      <Select
                        options={dayOptions}
                        value={assigneeDays}
                        onChange={(value) => setAssigneeDays(value ?? "60")}
                      />
                    </div>
                    <Text variant="body.medium">日前</Text>
                  </div>
                </FormControl>
                <Text as="p" variant="label.medium" color="subtle" whiteSpace="pre-wrap">
                  {`契約書の更新拒絶期限日または契約終了日の${assigneeDays}日前になると、その契約書の一覧を送信します。\nこの日数は、契約書ごとに個別に変更することも可能です。`}
                </Text>
              </div>

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
