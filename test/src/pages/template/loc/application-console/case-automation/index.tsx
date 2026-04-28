import { LfArrowUpRightFromSquare, LfQuestionCircle } from "@legalforce/aegis-icons";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Combobox,
  DescriptionList,
  DescriptionListDetail,
  DescriptionListItem,
  DescriptionListTerm,
  Divider,
  Form,
  FormControl,
  FormGroup,
  Link,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Radio,
  RadioGroup,
  Switch,
  Text,
  Textarea,
} from "@legalforce/aegis-react";
import { useId, useState } from "react";
import { LocSidebarLayout } from "../../_shared";
import { Navigation, NavigationHeader } from "../_shared";

// スイッチ付きセクション
const ToggleSection = ({
  label,
  description,
  defaultChecked = false,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) => {
  const labelId = useId();
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--aegis-space-xxSmall)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Text id={labelId} variant="label.large.bold">
          {label}
        </Text>
        <Switch
          aria-labelledby={labelId}
          color="information"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
      </div>
      <Text variant="label.medium" color="subtle" whiteSpace="pre-wrap">
        {description}
      </Text>
    </div>
  );
};

// 更問設定セクション
const AdditionalQuestionSection = () => {
  const labelId = useId();
  const defaultRadioLabelId = useId();
  const [checked, setChecked] = useState(true);
  const [sourceType, setSourceType] = useState<string>("default");

  const formOptions = [
    { label: "案件受付フォーム1", value: "form-1" },
    { label: "案件受付フォーム2", value: "form-2" },
    { label: "テストフォーム", value: "form-3" },
  ];

  return (
    <Form>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--aegis-space-xxSmall)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Text id={labelId} variant="label.large.bold">
            依頼メールへの自動返信
          </Text>
          <Switch
            aria-labelledby={labelId}
            color="information"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
        </div>
        <Text variant="label.medium" color="subtle" whiteSpace="pre-wrap">
          {
            "案件受付メールアドレスを通して依頼を受け付けたとき、必要な情報が揃っているか確認します。\n不足があれば質問メールを自動送信します。"
          }
        </Text>
      </div>
      <FormGroup
        sub={
          sourceType === "caseReceptionForm" ? (
            <FormControl>
              <FormControl.Label>判定基準にする案件受付フォーム</FormControl.Label>
              <Combobox options={formOptions} value="form-1" onChange={() => {}} />
              <FormControl.Caption>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-xxSmall)",
                  }}
                >
                  選択したフォームで設定されている項目リストを基準に判定します。
                  <div>
                    <Link href="#" trailing={LfArrowUpRightFromSquare} target="_blank" rel="noopener noreferrer">
                      フォームを確認・編集する
                    </Link>
                  </div>
                </div>
              </FormControl.Caption>
            </FormControl>
          ) : null
        }
      >
        <FormControl>
          <FormControl.Label>不足がないかチェックする項目</FormControl.Label>
          <RadioGroup value={sourceType} onChange={(value) => setSourceType(value ?? "default")}>
            <Radio aria-labelledby={defaultRadioLabelId} value="default">
              <Text id={defaultRadioLabelId}>標準プリセット項目</Text>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                leading={LfQuestionCircle}
                trailing={LfArrowUpRightFromSquare}
                color="information"
              >
                <Text variant="body.small">項目の詳細</Text>
              </Link>
            </Radio>
            <Radio value="caseReceptionForm">カスタマイズ（案件受付フォーム準拠）</Radio>
          </RadioGroup>
        </FormControl>
      </FormGroup>
    </Form>
  );
};

// フォーム依頼時の契約書AI自動チェック
const LegalEscalationSection = () => {
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
          flexDirection: "column",
          gap: "var(--aegis-space-xSmall)",
        }}
      >
        <Text variant="title.xSmall">フォーム依頼時の契約書AI自動チェック</Text>
        <Text variant="label.medium" color="subtle">
          依頼時に添付された契約書を、プレイブック（契約審査基準）をもとにAIがチェックします。法務対応の要否を自動で判定し、依頼者へ結果をメールで返信します。
        </Text>
      </div>

      {/* 各フォームでの利用設定 */}
      <Card size="medium">
        <CardHeader>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-xSmall)",
            }}
          >
            <Text variant="label.medium.bold">各フォームでの利用設定</Text>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-xxSmall)",
              }}
            >
              <Text variant="body.medium">
                自動チェック機能を利用するには、各フォームの作成画面で設定する必要があります。
              </Text>
              <div>
                <Link href="#" trailing={LfArrowUpRightFromSquare} target="_blank" rel="noopener noreferrer">
                  案件受付フォームの設定画面
                </Link>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 判定結果メールのテンプレート */}
      <Card size="medium">
        <CardHeader>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-xSmall)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text variant="body.medium.bold">判定結果メールのテンプレート</Text>
              <Button variant="gutterless" size="small" leading={LfQuestionCircle}>
                メールの表示例
              </Button>
            </div>
            <Text variant="label.medium" color="subtle">
              AIの判定結果（法務対応が必要・不要）に応じて、依頼者に送信されるメール文面を設定します。
            </Text>
          </div>
        </CardHeader>
        <CardBody>
          <DescriptionList size="large">
            <DescriptionListItem orientation="horizontal">
              <DescriptionListTerm>件名</DescriptionListTerm>
              <DescriptionListDetail>
                {"[LegalOn] ご相談いただいた契約書の確認が完了しました - 法務対応が{必要 / 不要}"}
              </DescriptionListDetail>
            </DescriptionListItem>
            <DescriptionListItem orientation="horizontal">
              <DescriptionListTerm>メール本文</DescriptionListTerm>
              <DescriptionListDetail>
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
                      gap: "var(--aegis-space-small)",
                    }}
                  >
                    【判定結果】
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--aegis-space-large)",
                      }}
                    >
                      <FormControl>
                        <FormControl.Label>判定：法務対応が必要な場合</FormControl.Label>
                        <Textarea
                          defaultValue="ご相談内容について、法的判断や慎重な解釈が必要と考えられるため、法務部門にて対応を進めております。法務部からの回答をお待ちください。"
                          aria-label="法務対応が必要な場合のメール文面"
                        />
                      </FormControl>
                      <FormControl>
                        <FormControl.Label>判定：法務対応が不要な場合</FormControl.Label>
                        <Textarea
                          defaultValue="ご相談内容について、特段の懸念点は確認されませんでした。ただし、×や△の項目がある場合は、事業部でのご確認および最終的なご判断をお願いいたします。"
                          aria-label="法務対応が不要な場合のメール文面"
                        />
                      </FormControl>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-small)",
                    }}
                  >
                    【結果の詳細】
                    <Card size="small" variant="fill">
                      AIによる判定結果とその理由が自動で記入されます。
                    </Card>
                  </div>
                </div>
              </DescriptionListDetail>
            </DescriptionListItem>
          </DescriptionList>
        </CardBody>
      </Card>
    </div>
  );
};

const CaseAutomationTemplate = () => {
  return (
    <LocSidebarLayout activeId="cases">
      <PageLayout>
        <PageLayoutPane>
          <PageLayoutHeader>
            <NavigationHeader />
          </PageLayoutHeader>
          <PageLayoutBody>
            <Navigation currentPage="case-automation" />
          </PageLayoutBody>
        </PageLayoutPane>
        <PageLayoutContent align="start" maxWidth="medium">
          <PageLayoutHeader>
            <Text as="h1" variant="title.large">
              AIエージェントによる案件自動対応
            </Text>
          </PageLayoutHeader>
          <PageLayoutBody>
            {/* リードテキスト */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-xSmall)",
                paddingBlockEnd: "var(--aegis-space-medium)",
              }}
            >
              <Text as="p" variant="body.medium">
                メールや案件受付フォームからの依頼に対し、AIエージェントが行う自動対応の内容を設定します。
              </Text>
              <div>
                <Link
                  href="#"
                  leading={LfQuestionCircle}
                  trailing={LfArrowUpRightFromSquare}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  マターマネジメントエージェントについて
                </Link>
              </div>
            </div>

            {/* 設定セクション */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-xxLarge)",
              }}
            >
              <ToggleSection
                label="案件担当者の割り当て"
                description="担当者を自動で選定し、案件を割り当てます。"
                defaultChecked
              />
              <Divider />
              <AdditionalQuestionSection />
              <Divider />
              <ToggleSection
                label="メール依頼時の案件タイプ自動判定"
                description="依頼内容を分析し、契約審査や法務相談などの案件タイプを自動で判定・設定します。"
                defaultChecked
              />
              <Divider />
              <LegalEscalationSection />
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
};

export default CaseAutomationTemplate;
