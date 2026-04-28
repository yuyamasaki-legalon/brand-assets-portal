import { LfArrowUpRightFromSquare, LfPen, LfQuestionCircle } from "@legalforce/aegis-icons";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  Link,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Select,
  Text,
  TextField,
} from "@legalforce/aegis-react";
import { useMemo, useState } from "react";
import { LocSidebarLayout } from "../../../_shared";
import { Navigation, NavigationHeader } from "../_shared";

// 桁数オプション
const digitOptions = [
  { value: "3", label: "3桁" },
  { value: "4", label: "4桁" },
  { value: "5", label: "5桁" },
  { value: "6", label: "6桁" },
  { value: "7", label: "7桁" },
];

export default function InhouseIdAutoNumberingTemplate() {
  const [uploadTrigger, setUploadTrigger] = useState(false);
  const [statusTriggers, setStatusTriggers] = useState<string[]>([]);
  const [prefix, setPrefix] = useState("");
  const [digits, setDigits] = useState("5");
  const [nextNumber] = useState("1");

  const toggleStatus = (value: string) =>
    setStatusTriggers((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  const preview = useMemo(() => {
    const digitCount = Number.parseInt(digits, 10);
    const start = Number.parseInt(nextNumber, 10);
    const numberPart =
      Number.isFinite(start) && Number.isFinite(digitCount) ? String(Math.max(start, 0)).padStart(digitCount, "0") : "";
    return `${prefix}${numberPart}`;
  }, [prefix, digits, nextNumber]);

  return (
    <LocSidebarLayout activeId="others">
      <PageLayout>
        <PageLayoutPane>
          <PageLayoutHeader>
            <NavigationHeader />
          </PageLayoutHeader>
          <PageLayoutBody>
            <Navigation currentPage="inhouse-id-auto-numbering" />
          </PageLayoutBody>
        </PageLayoutPane>
        <PageLayoutContent align="start" maxWidth="medium">
          <PageLayoutHeader>
            <Text as="h1" variant="title.large">
              管理番号の自動採番
            </Text>
          </PageLayoutHeader>
          <PageLayoutBody>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-xLarge)",
              }}
            >
              {/* リードテキスト */}
              <Text as="p" variant="body.medium" whiteSpace="pre-wrap">
                {
                  "管理番号の採番を行うタイミングや、採番のルールを設定します。\n自動で付与される番号同士は重複しませんが、手動で入力済みの番号とは重複する場合があります。"
                }
              </Text>

              {/* セクション1: 自動採番のタイミング */}
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
                    gap: "var(--aegis-space-xxSmall)",
                  }}
                >
                  <Text as="h2" variant="title.small">
                    自動採番のタイミング
                  </Text>
                  <div>
                    <Link
                      href="#"
                      leading={LfQuestionCircle}
                      trailing={LfArrowUpRightFromSquare}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      自動採番のタイミングについて
                    </Link>
                  </div>
                </div>

                {/* 新規アップロードした時 */}
                <FormControl>
                  <FormControl.Label>新規アップロードした時</FormControl.Label>
                  <CheckboxGroup>
                    <Checkbox checked={uploadTrigger} onChange={(e) => setUploadTrigger(e.target.checked)}>
                      契約書をアップロードした時
                    </Checkbox>
                  </CheckboxGroup>
                </FormControl>

                {/* 契約書にステータスを付与した時 */}
                <FormControl>
                  <FormControl.Label>契約書にステータスを付与した時</FormControl.Label>
                  <CheckboxGroup>
                    <Checkbox checked={statusTriggers.includes("approved")} onChange={() => toggleStatus("approved")}>
                      ［承認版］になった時
                    </Checkbox>
                    <Checkbox checked={statusTriggers.includes("scheduled")} onChange={() => toggleStatus("scheduled")}>
                      ［締結予定版］になった時
                    </Checkbox>
                    <Checkbox checked={statusTriggers.includes("agreed")} onChange={() => toggleStatus("agreed")}>
                      ［締結版］になった時
                    </Checkbox>
                  </CheckboxGroup>
                </FormControl>
              </div>

              {/* セクション2: 採番のルール */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-medium)",
                }}
              >
                <Text as="h2" variant="title.small">
                  採番のルール
                </Text>

                <FormControl>
                  <FormControl.Label>接頭辞</FormControl.Label>
                  <TextField placeholder="テキストを入力" value={prefix} onChange={(e) => setPrefix(e.target.value)} />
                </FormControl>

                <FormControl>
                  <FormControl.Label>桁数</FormControl.Label>
                  <div style={{ display: "flex", gap: "var(--aegis-space-small)", alignItems: "center" }}>
                    <Select options={digitOptions} value={digits} onChange={(value) => setDigits(value ?? "5")} />
                    <Text variant="body.medium">{"0".repeat(Number.parseInt(digits, 10))}</Text>
                  </div>
                </FormControl>

                {/* 次回採番される番号 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-xxSmall)",
                  }}
                >
                  <Text variant="label.medium">次回採番される番号</Text>
                  <Text variant="body.medium">{nextNumber}</Text>
                  <div>
                    <Button variant="subtle" size="small" leading={LfPen}>
                      編集
                    </Button>
                  </div>
                </div>

                {/* プレビュー */}
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
                  <Text variant="label.medium" color="subtle">
                    管理番号のプレビュー
                  </Text>
                  <Text as="p" variant="body.large">
                    {preview || "（接頭辞または桁数を設定してください）"}
                  </Text>
                </div>
              </div>

              {/* 保存ボタン */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-xxSmall)",
                }}
              >
                <div>
                  <Button disabled>保存</Button>
                </div>
                <Text variant="label.small" color="subtle">
                  保存を押すと、ルールが反映され採番が開始されます。
                </Text>
              </div>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
}
