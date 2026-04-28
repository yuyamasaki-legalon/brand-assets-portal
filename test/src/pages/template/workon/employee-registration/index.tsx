import { LfCloseLarge, LfPen, LfPlusLarge, LfTrash } from "@legalforce/aegis-icons";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  ContentHeader,
  ContentHeaderTitle,
  DatePicker,
  DescriptionList,
  DescriptionListDetail,
  DescriptionListItem,
  DescriptionListTerm,
  Divider,
  Footer,
  FooterSpacer,
  FormControl,
  FormGroup,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Select,
  Stepper,
  Table,
  TableContainer,
  Tag,
  Text,
  TextField,
  Tooltip,
} from "@legalforce/aegis-react";
import { useState } from "react";

// ========================================
// モックデータ
// ========================================
const steps = [
  { id: "employee-info", label: "従業員情報登録" },
  { id: "insurance", label: "社会保険、等級登録" },
  { id: "payment", label: "支給・控除登録" },
  { id: "form-document", label: "フォーム・ドキュメント送付設定" },
  { id: "confirmation", label: "登録内容確認" },
];

const employmentTypeOptions = [
  { label: "正社員", value: "fulltime" },
  { label: "契約社員", value: "contract" },
  { label: "パート・アルバイト", value: "parttime" },
  { label: "派遣社員", value: "dispatch" },
  { label: "業務委託", value: "outsource" },
];

const branchOptions = [
  { label: "本社", value: "headquarters" },
  { label: "大阪支社", value: "osaka" },
  { label: "名古屋支社", value: "nagoya" },
  { label: "福岡支社", value: "fukuoka" },
];

const occupationOptions = [
  { label: "エンジニア", value: "engineer" },
  { label: "デザイナー", value: "designer" },
  { label: "営業", value: "sales" },
  { label: "人事", value: "hr" },
  { label: "経理", value: "accounting" },
];

const workingStyleOptions = [
  { label: "フレックスタイム制", value: "flex" },
  { label: "固定時間制", value: "fixed" },
  { label: "裁量労働制", value: "discretionary" },
];

const paymentTermOptions = [
  { label: "月末締め・翌月25日払い", value: "monthly-25" },
  { label: "15日締め・当月25日払い", value: "semi-monthly-25" },
  { label: "月末締め・翌月末払い", value: "monthly-end" },
];

const positionOptions = [
  { label: "代表取締役", value: "ceo" },
  { label: "取締役", value: "director" },
  { label: "部長", value: "manager" },
  { label: "課長", value: "section_chief" },
  { label: "主任", value: "supervisor" },
  { label: "一般社員", value: "staff" },
];

const departmentOptions = [
  { label: "経営企画部（A001）", value: "planning" },
  { label: "人事部（A002）", value: "hr" },
  { label: "開発部（B001）", value: "development" },
  { label: "営業部（C001）", value: "sales" },
];

const provisionOptions = [
  { label: "基本給", value: "base" },
  { label: "役職手当", value: "position" },
  { label: "住宅手当", value: "housing" },
  { label: "通勤手当", value: "commute" },
  { label: "時間外手当", value: "overtime" },
];

const deductionOptions = [
  { label: "健康保険", value: "health" },
  { label: "厚生年金", value: "pension" },
  { label: "雇用保険", value: "employment" },
  { label: "所得税", value: "income_tax" },
  { label: "住民税", value: "resident_tax" },
];

const formOptions = [
  { label: "入社時提出書類一式", value: "onboarding" },
  { label: "給与振込口座届", value: "bank_account" },
  { label: "扶養控除等申告書", value: "dependent" },
];

// 詳細情報のモックデータ
const employmentTypeDetails: Record<
  string,
  { classification: string; attendance: boolean; payroll: boolean; salaryForm: string }
> = {
  fulltime: { classification: "雇用：正社員", attendance: true, payroll: true, salaryForm: "月給" },
  contract: { classification: "雇用：契約社員", attendance: true, payroll: true, salaryForm: "月給" },
  parttime: { classification: "雇用：パート・アルバイト", attendance: true, payroll: true, salaryForm: "時給" },
  dispatch: { classification: "非雇用：派遣", attendance: false, payroll: false, salaryForm: "-" },
  outsource: { classification: "非雇用：業務委託", attendance: false, payroll: false, salaryForm: "-" },
};

const workingStyleDetails: Record<string, { system: string; workTime: string; breakTime: string; laborTime: string }> =
  {
    flex: { system: "フレックスタイム制", workTime: "-", breakTime: "12:00 - 13:00", laborTime: "8時間" },
    fixed: { system: "固定時間制", workTime: "09:00 - 18:00", breakTime: "12:00 - 13:00", laborTime: "-" },
    discretionary: { system: "裁量労働制", workTime: "-", breakTime: "-", laborTime: "8時間" },
  };

const paymentTermDetails: Record<string, { cutOff: string; paymentDay: string; insuranceMonth: string }> = {
  "monthly-25": { cutOff: "当月末日", paymentDay: "翌月25日", insuranceMonth: "翌月" },
  "semi-monthly-25": { cutOff: "当月15日", paymentDay: "当月25日", insuranceMonth: "当月" },
  "monthly-end": { cutOff: "当月末日", paymentDay: "翌月末日", insuranceMonth: "翌月" },
};

// ========================================
// Step 1: 従業員情報登録
// ========================================
function Step1Content({
  employmentType,
  setEmploymentType,
  workingStyle,
  setWorkingStyle,
  paymentTerm,
  setPaymentTerm,
  isLeader,
  setIsLeader,
  subDepartments,
  setSubDepartments,
}: {
  employmentType: string;
  setEmploymentType: (v: string) => void;
  workingStyle: string;
  setWorkingStyle: (v: string) => void;
  paymentTerm: string;
  setPaymentTerm: (v: string) => void;
  isLeader: boolean;
  setIsLeader: (v: boolean) => void;
  subDepartments: { id: string; positionId: string; departmentId: string; isLeader: boolean }[];
  setSubDepartments: React.Dispatch<
    React.SetStateAction<{ id: string; positionId: string; departmentId: string; isLeader: boolean }[]>
  >;
}): React.ReactNode {
  const empDetail = employmentTypeDetails[employmentType];
  const workDetail = workingStyleDetails[workingStyle];
  const payDetail = paymentTermDetails[paymentTerm];

  return (
    <>
      <PageLayoutHeader>
        <ContentHeader>
          <ContentHeaderTitle>
            <Text variant="title.large" color="bold">
              従業員情報登録
            </Text>
          </ContentHeaderTitle>
        </ContentHeader>
      </PageLayoutHeader>

      <PageLayoutBody>
        <Text variant="body.medium">入社する方の情報を入力してください。</Text>

        {/* 基本情報 Card */}
        <Card variant="outline">
          <CardBody style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
            <FormControl>
              <FormControl.Label>
                <Text variant="title.small" color="bold">
                  基本情報
                </Text>
              </FormControl.Label>
            </FormControl>

            <FormGroup>
              <FormControl>
                <FormControl.Label>ビジネスネームの姓</FormControl.Label>
                <TextField placeholder="姓を入力" />
              </FormControl>
              <FormControl>
                <FormControl.Label>ビジネスネームの名</FormControl.Label>
                <TextField placeholder="名を入力" />
              </FormControl>
            </FormGroup>

            <FormControl>
              <FormControl.Label>従業員番号</FormControl.Label>
              <TextField placeholder="従業員番号を入力" />
              <FormControl.Caption>10桁の英数字</FormControl.Caption>
            </FormControl>

            <FormControl>
              <FormControl.Label>社用メールアドレス</FormControl.Label>
              <TextField type="email" placeholder="社用メールアドレスを入力" />
            </FormControl>

            <FormControl>
              <FormControl.Label>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                  社用電話番号
                  <Text variant="caption.medium" color="subtle">
                    任意
                  </Text>
                </div>
              </FormControl.Label>
              <TextField type="tel" placeholder="社用電話番号を入力" />
            </FormControl>
          </CardBody>
        </Card>

        {/* 入力依頼用メールアドレス Card */}
        <Card variant="outline">
          <CardBody style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
            <FormControl>
              <FormControl.Label>
                <Text variant="title.small" color="bold">
                  入力依頼用メールアドレス
                </Text>
              </FormControl.Label>
            </FormControl>

            <FormControl>
              <TextField type="email" placeholder="メールアドレスを入力" />
              <FormControl.Caption>従業員本人に入力を依頼する際の送信先メールアドレス</FormControl.Caption>
            </FormControl>
          </CardBody>
        </Card>

        {/* 詳細情報 Card */}
        <Card variant="outline">
          <CardBody style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
            <FormControl>
              <FormControl.Label>
                <Text variant="title.small" color="bold">
                  詳細情報
                </Text>
              </FormControl.Label>
            </FormControl>

            <FormControl>
              <FormControl.Label>入社日</FormControl.Label>
              <DatePicker size="medium" granularity="day" />
            </FormControl>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
              <FormControl>
                <FormControl.Label>雇用形態</FormControl.Label>
                <Select
                  placeholder="雇用形態を選択"
                  options={employmentTypeOptions}
                  value={employmentType || null}
                  onChange={(v) => setEmploymentType(v ?? "")}
                />
              </FormControl>
              {empDetail && (
                <DescriptionList size="small">
                  <DescriptionListItem orientation="horizontal">
                    <DescriptionListTerm width="xxLarge">
                      <Text variant="title.xxSmall" color="bold">
                        就業区分
                      </Text>
                    </DescriptionListTerm>
                    <DescriptionListDetail>{empDetail.classification}</DescriptionListDetail>
                  </DescriptionListItem>
                  <DescriptionListItem orientation="horizontal">
                    <DescriptionListTerm width="xxLarge">
                      <Text variant="title.xxSmall" color="bold">
                        勤怠管理対象
                      </Text>
                    </DescriptionListTerm>
                    <DescriptionListDetail>{empDetail.attendance ? "対象" : "対象外"}</DescriptionListDetail>
                  </DescriptionListItem>
                  <DescriptionListItem orientation="horizontal">
                    <DescriptionListTerm width="xxLarge">
                      <Text variant="title.xxSmall" color="bold">
                        給与計算対象
                      </Text>
                    </DescriptionListTerm>
                    <DescriptionListDetail>{empDetail.payroll ? "対象" : "対象外"}</DescriptionListDetail>
                  </DescriptionListItem>
                  <DescriptionListItem orientation="horizontal">
                    <DescriptionListTerm width="xxLarge">
                      <Text variant="title.xxSmall" color="bold">
                        給与支払形態
                      </Text>
                    </DescriptionListTerm>
                    <DescriptionListDetail>{empDetail.salaryForm}</DescriptionListDetail>
                  </DescriptionListItem>
                </DescriptionList>
              )}
            </div>

            <FormControl>
              <FormControl.Label>事業所・勤務地</FormControl.Label>
              <Select placeholder="事業所・勤務地を選択" options={branchOptions} />
            </FormControl>

            <FormControl>
              <FormControl.Label>職種</FormControl.Label>
              <Select placeholder="職種を選択" options={occupationOptions} />
            </FormControl>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
              <FormControl>
                <FormControl.Label>勤務形態</FormControl.Label>
                <Select
                  placeholder="勤務形態を選択"
                  options={workingStyleOptions}
                  value={workingStyle || null}
                  onChange={(v) => setWorkingStyle(v ?? "")}
                />
              </FormControl>
              {workDetail && (
                <DescriptionList size="small">
                  <DescriptionListItem orientation="horizontal">
                    <DescriptionListTerm width="xxLarge">
                      <Text variant="title.xxSmall" color="bold">
                        労働時間制
                      </Text>
                    </DescriptionListTerm>
                    <DescriptionListDetail>{workDetail.system}</DescriptionListDetail>
                  </DescriptionListItem>
                  <DescriptionListItem orientation="horizontal">
                    <DescriptionListTerm width="xxLarge">
                      <Text variant="title.xxSmall" color="bold">
                        就業時間
                      </Text>
                    </DescriptionListTerm>
                    <DescriptionListDetail>{workDetail.workTime}</DescriptionListDetail>
                  </DescriptionListItem>
                  <DescriptionListItem orientation="horizontal">
                    <DescriptionListTerm width="xxLarge">
                      <Text variant="title.xxSmall" color="bold">
                        休憩時間
                      </Text>
                    </DescriptionListTerm>
                    <DescriptionListDetail>{workDetail.breakTime}</DescriptionListDetail>
                  </DescriptionListItem>
                  <DescriptionListItem orientation="horizontal">
                    <DescriptionListTerm width="xxLarge">
                      <Text variant="title.xxSmall" color="bold">
                        所定労働時間
                      </Text>
                    </DescriptionListTerm>
                    <DescriptionListDetail>{workDetail.laborTime}</DescriptionListDetail>
                  </DescriptionListItem>
                </DescriptionList>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
              <FormControl>
                <FormControl.Label>締日支払形態</FormControl.Label>
                <Select
                  placeholder="締日支払形態を選択"
                  options={paymentTermOptions}
                  value={paymentTerm || null}
                  onChange={(v) => setPaymentTerm(v ?? "")}
                />
              </FormControl>
              {payDetail && (
                <DescriptionList size="small">
                  <DescriptionListItem orientation="horizontal">
                    <DescriptionListTerm width="xxLarge">
                      <Text variant="title.xxSmall" color="bold">
                        勤怠締日
                      </Text>
                    </DescriptionListTerm>
                    <DescriptionListDetail>{payDetail.cutOff}</DescriptionListDetail>
                  </DescriptionListItem>
                  <DescriptionListItem orientation="horizontal">
                    <DescriptionListTerm width="xxLarge">
                      <Text variant="title.xxSmall" color="bold">
                        支払日
                      </Text>
                    </DescriptionListTerm>
                    <DescriptionListDetail>{payDetail.paymentDay}</DescriptionListDetail>
                  </DescriptionListItem>
                  <DescriptionListItem orientation="horizontal">
                    <DescriptionListTerm width="xxLarge">
                      <Text variant="title.xxSmall" color="bold">
                        社会保険料徴収月
                      </Text>
                    </DescriptionListTerm>
                    <DescriptionListDetail>{payDetail.insuranceMonth}</DescriptionListDetail>
                  </DescriptionListItem>
                </DescriptionList>
              )}
            </div>
          </CardBody>
        </Card>

        {/* 所属部署 Card */}
        <Card variant="outline">
          <CardBody style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
            <FormControl>
              <FormControl.Label>
                <Text variant="title.small" color="bold">
                  所属部署
                </Text>
              </FormControl.Label>
            </FormControl>

            {/* 主務 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
              <FormControl.Label>主務</FormControl.Label>
              <FormControl>
                <FormControl.Label>役職</FormControl.Label>
                <Select placeholder="役職を選択" options={positionOptions} />
              </FormControl>
              <Checkbox checked={isLeader} onChange={(e) => setIsLeader(e.target.checked)}>
                組織長
              </Checkbox>
              <FormControl>
                <FormControl.Label>部署</FormControl.Label>
                <Select placeholder="部署を選択" options={departmentOptions} />
              </FormControl>
            </div>

            {/* 兼務 */}
            {subDepartments.map((sub, index) => (
              <div key={sub.id} style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                <DescriptionList>
                  <DescriptionListItem>
                    <DescriptionListTerm
                      trailing={
                        <Tooltip title="兼務を削除">
                          <IconButton
                            aria-label="兼務を削除"
                            variant="plain"
                            size="small"
                            color="neutral"
                            onClick={() => {
                              setSubDepartments((prev) => prev.filter((_, i) => i !== index));
                            }}
                          >
                            <Icon size="small">
                              <LfTrash />
                            </Icon>
                          </IconButton>
                        </Tooltip>
                      }
                    >
                      兼務
                    </DescriptionListTerm>
                  </DescriptionListItem>
                </DescriptionList>
                <FormControl>
                  <FormControl.Label>役職</FormControl.Label>
                  <Select placeholder="役職を選択" options={positionOptions} />
                </FormControl>
                <Checkbox
                  checked={sub.isLeader}
                  onChange={(e) => {
                    setSubDepartments((prev) =>
                      prev.map((item, i) => (i === index ? { ...item, isLeader: e.target.checked } : item)),
                    );
                  }}
                >
                  組織長
                </Checkbox>
                <FormControl>
                  <FormControl.Label>部署</FormControl.Label>
                  <Select placeholder="部署を選択" options={departmentOptions} />
                </FormControl>
              </div>
            ))}

            <Button
              variant="subtle"
              leading={
                <Icon>
                  <LfPlusLarge />
                </Icon>
              }
              onClick={() => {
                setSubDepartments((prev) => [
                  ...prev,
                  { id: crypto.randomUUID(), positionId: "", departmentId: "", isLeader: false },
                ]);
              }}
            >
              兼務を追加
            </Button>
          </CardBody>
        </Card>
      </PageLayoutBody>
    </>
  );
}

// ========================================
// Step 2: 社会保険、等級登録
// ========================================
function Step2Content(): React.ReactNode {
  return (
    <>
      <PageLayoutHeader>
        <ContentHeader>
          <ContentHeaderTitle>
            <Text variant="title.large" color="bold">
              社会保険、等級登録
            </Text>
          </ContentHeaderTitle>
        </ContentHeader>
      </PageLayoutHeader>

      <PageLayoutBody>
        <div>
          <Text variant="body.medium" as="p">
            <Text variant="title.xxSmall" as="span" color="bold">
              山田 太郎
            </Text>
            さんの社会保険、等級を登録してください。
          </Text>
        </div>

        <Card variant="outline">
          <CardBody style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
            <FormControl>
              <FormControl.Label>
                <Text variant="title.small" color="bold">
                  社会保険
                </Text>
              </FormControl.Label>
            </FormControl>

            <FormControl>
              <FormControl.Label>雇用保険取得日</FormControl.Label>
              <DatePicker size="medium" granularity="day" />
            </FormControl>

            <FormControl>
              <FormControl.Label>社会保険取得日</FormControl.Label>
              <DatePicker size="medium" granularity="day" />
            </FormControl>
          </CardBody>
        </Card>
      </PageLayoutBody>
    </>
  );
}

// ========================================
// Step 3: 支給・控除登録
// ========================================
function Step3Content({
  provisions,
  setProvisions,
  deductions,
  setDeductions,
}: {
  provisions: { id: string; itemId: string; amount: string }[];
  setProvisions: React.Dispatch<React.SetStateAction<{ id: string; itemId: string; amount: string }[]>>;
  deductions: { id: string; itemId: string; amount: string }[];
  setDeductions: React.Dispatch<React.SetStateAction<{ id: string; itemId: string; amount: string }[]>>;
}): React.ReactNode {
  return (
    <>
      <PageLayoutHeader>
        <ContentHeader>
          <ContentHeaderTitle>
            <Text variant="title.large" color="bold">
              支給・控除登録
            </Text>
          </ContentHeaderTitle>
        </ContentHeader>
      </PageLayoutHeader>

      <PageLayoutBody>
        <Text variant="body.medium" as="p">
          <Text variant="title.xxSmall" as="span" color="bold">
            山田 太郎
          </Text>
          さんの支給・控除を登録してください。
        </Text>

        <Text variant="title.xSmall" as="span" color="bold">
          支給項目
        </Text>

        {provisions.map((item) => (
          <div key={item.id} style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
            <FormControl>
              <FormControl.Label>支給項目名</FormControl.Label>
              <Select placeholder="支給項目を選択" options={provisionOptions} />
            </FormControl>
            <FormControl>
              <FormControl.Label>支給金額</FormControl.Label>
              <TextField type="number" placeholder="金額を入力" trailing="円" />
            </FormControl>
          </div>
        ))}

        <Button
          variant="subtle"
          color="neutral"
          leading={
            <Icon>
              <LfPlusLarge />
            </Icon>
          }
          onClick={() => setProvisions((prev) => [...prev, { id: crypto.randomUUID(), itemId: "", amount: "" }])}
        >
          支給項目を追加
        </Button>

        <Text variant="title.xSmall" as="span" color="bold">
          控除項目
        </Text>

        {deductions.map((item) => (
          <div key={item.id} style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
            <FormControl>
              <FormControl.Label>控除項目名</FormControl.Label>
              <Select placeholder="控除項目を選択" options={deductionOptions} />
            </FormControl>
            <FormControl>
              <FormControl.Label>控除金額</FormControl.Label>
              <TextField type="number" placeholder="金額を入力" trailing="円" />
            </FormControl>
          </div>
        ))}

        <Button
          variant="subtle"
          color="neutral"
          leading={
            <Icon>
              <LfPlusLarge />
            </Icon>
          }
          onClick={() => setDeductions((prev) => [...prev, { id: crypto.randomUUID(), itemId: "", amount: "" }])}
        >
          控除項目を追加
        </Button>
      </PageLayoutBody>
    </>
  );
}

// ========================================
// Step 4: フォーム・ドキュメント送付設定
// ========================================
function Step4Content({
  selectedForm,
  setSelectedForm,
}: {
  selectedForm: string;
  setSelectedForm: (v: string) => void;
}): React.ReactNode {
  const selectedFormLabel = formOptions.find((opt) => opt.value === selectedForm)?.label;

  return (
    <>
      <PageLayoutHeader>
        <ContentHeader>
          <ContentHeaderTitle>
            <Text variant="title.large" color="bold">
              フォーム・ドキュメント送付設定
            </Text>
          </ContentHeaderTitle>
        </ContentHeader>
      </PageLayoutHeader>

      <PageLayoutBody>
        <Text variant="body.medium" as="p" whiteSpace="pre-line">
          <Text variant="title.xxSmall" as="span" color="bold">
            山田 太郎
          </Text>
          さんに送付するフォーム・ドキュメントを設定してください。
        </Text>

        <FormControl>
          <FormControl.Label>フォーム</FormControl.Label>
          <Select
            placeholder="フォームを追加"
            options={formOptions}
            value={selectedForm || null}
            onChange={(v) => setSelectedForm(v ?? "")}
          />
        </FormControl>

        {selectedForm && <Divider />}

        {selectedForm && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
            <Text variant="title.xSmall" as="span" color="bold">
              {selectedFormLabel}
            </Text>
            <FormControl>
              <FormControl.Label>送付日</FormControl.Label>
              <DatePicker size="medium" granularity="day" />
            </FormControl>
            <FormControl>
              <FormControl.Label>回答期限</FormControl.Label>
              <DatePicker size="medium" granularity="minute" />
            </FormControl>
          </div>
        )}
      </PageLayoutBody>
    </>
  );
}

// ========================================
// Step 5: 登録内容確認
// ========================================
function Step5Content(): React.ReactNode {
  return (
    <>
      <PageLayoutHeader>
        <ContentHeader>
          <ContentHeaderTitle>
            <Text variant="title.large" color="bold">
              登録内容確認
            </Text>
          </ContentHeaderTitle>
        </ContentHeader>
      </PageLayoutHeader>

      <PageLayoutBody>
        <Text variant="body.medium" as="p">
          以下の内容で
          <Text variant="title.xxSmall" as="span" color="bold">
            山田 太郎
          </Text>
          さんの入社手続きを登録します。
        </Text>

        {/* 基本情報 */}
        <Card variant="fill">
          <CardHeader
            trailing={
              <Button
                variant="subtle"
                color="neutral"
                leading={
                  <Icon size="small">
                    <LfPen />
                  </Icon>
                }
              >
                編集
              </Button>
            }
          >
            <Text variant="title.xSmall" as="span" color="bold">
              基本情報
            </Text>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell as="td" width="xSmall">
                      ビジネスネーム
                    </Table.Cell>
                    <Table.Cell as="td">山田 太郎</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>従業員番号</Table.Cell>
                    <Table.Cell>EMP001234</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>社用メールアドレス</Table.Cell>
                    <Table.Cell>yamada.taro@example.com</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>社用電話番号</Table.Cell>
                    <Table.Cell>03-1234-5678</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>

        {/* 入力依頼用メールアドレス */}
        <Card variant="fill">
          <CardHeader
            trailing={
              <Button
                variant="subtle"
                color="neutral"
                leading={
                  <Icon size="small">
                    <LfPen />
                  </Icon>
                }
              >
                編集
              </Button>
            }
          >
            <Text variant="title.xSmall" as="span" color="bold">
              入力依頼用メールアドレス
            </Text>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell as="td" width="xSmall">
                      メールアドレス
                    </Table.Cell>
                    <Table.Cell as="td">yamada.taro.personal@example.com</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>

        {/* 詳細情報 */}
        <Card variant="fill">
          <CardHeader
            trailing={
              <Button
                variant="subtle"
                color="neutral"
                leading={
                  <Icon size="small">
                    <LfPen />
                  </Icon>
                }
              >
                編集
              </Button>
            }
          >
            <Text variant="title.xSmall" as="span" color="bold">
              詳細情報
            </Text>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell as="td" width="xSmall">
                      入社日
                    </Table.Cell>
                    <Table.Cell as="td">2024年4月1日</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>雇用形態</Table.Cell>
                    <Table.Cell>正社員</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>事業所・勤務地</Table.Cell>
                    <Table.Cell>本社</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>職種</Table.Cell>
                    <Table.Cell>エンジニア</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>勤務形態</Table.Cell>
                    <Table.Cell>フレックスタイム制</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>締日支払形態</Table.Cell>
                    <Table.Cell>月末締め・翌月25日払い</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>

        {/* 所属部署 */}
        <Card variant="fill">
          <CardHeader
            trailing={
              <Button
                variant="subtle"
                color="neutral"
                leading={
                  <Icon size="small">
                    <LfPen />
                  </Icon>
                }
              >
                編集
              </Button>
            }
          >
            <Text variant="title.xSmall" as="span" color="bold">
              所属部署
            </Text>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Cell as="th">区分</Table.Cell>
                    <Table.Cell as="th">役職</Table.Cell>
                    <Table.Cell as="th">部署</Table.Cell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>主務</Table.Cell>
                    <Table.Cell>
                      主任{" "}
                      <Tag variant="fill" size="small" color="neutral">
                        組織長
                      </Tag>
                    </Table.Cell>
                    <Table.Cell>開発部（B001）</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>

        {/* 社会保険 */}
        <Card variant="fill">
          <CardHeader
            trailing={
              <Button
                variant="subtle"
                color="neutral"
                leading={
                  <Icon size="small">
                    <LfPen />
                  </Icon>
                }
              >
                編集
              </Button>
            }
          >
            <Text variant="title.xSmall" as="span" color="bold">
              社会保険
            </Text>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell as="td" width="xSmall">
                      雇用保険取得日
                    </Table.Cell>
                    <Table.Cell as="td">2024年4月1日</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>社会保険取得日</Table.Cell>
                    <Table.Cell>2024年4月1日</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>

        {/* 支給項目 */}
        <Card variant="fill">
          <CardHeader
            trailing={
              <Button
                variant="subtle"
                color="neutral"
                leading={
                  <Icon size="small">
                    <LfPen />
                  </Icon>
                }
              >
                編集
              </Button>
            }
          >
            <Text variant="title.xSmall" as="span" color="bold">
              支給項目
            </Text>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Cell as="th">項目名</Table.Cell>
                    <Table.Cell as="th">金額</Table.Cell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>基本給</Table.Cell>
                    <Table.Cell>300,000円</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>住宅手当</Table.Cell>
                    <Table.Cell>30,000円</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>

        {/* 控除項目 */}
        <Card variant="fill">
          <CardHeader
            trailing={
              <Button
                variant="subtle"
                color="neutral"
                leading={
                  <Icon size="small">
                    <LfPen />
                  </Icon>
                }
              >
                編集
              </Button>
            }
          >
            <Text variant="title.xSmall" as="span" color="bold">
              控除項目
            </Text>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Cell as="th">項目名</Table.Cell>
                    <Table.Cell as="th">金額</Table.Cell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>健康保険</Table.Cell>
                    <Table.Cell>15,000円</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>厚生年金</Table.Cell>
                    <Table.Cell>27,000円</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>

        {/* フォーム・ドキュメント送付 */}
        <Card variant="fill">
          <CardHeader
            trailing={
              <Button
                variant="subtle"
                color="neutral"
                leading={
                  <Icon size="small">
                    <LfPen />
                  </Icon>
                }
              >
                編集
              </Button>
            }
          >
            <Text variant="title.xSmall" as="span" color="bold">
              フォーム・ドキュメント送付
            </Text>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Cell as="th">フォーム名</Table.Cell>
                    <Table.Cell as="th">送付日</Table.Cell>
                    <Table.Cell as="th">回答期限</Table.Cell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>入社時提出書類一式</Table.Cell>
                    <Table.Cell>2024年3月15日</Table.Cell>
                    <Table.Cell>2024年3月25日 17:00</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      </PageLayoutBody>
    </>
  );
}

// ========================================
// メインコンポーネント
// ========================================
export default function EmployeeRegistrationPage(): React.ReactNode {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 の状態
  const [employmentType, setEmploymentType] = useState("");
  const [workingStyle, setWorkingStyle] = useState("");
  const [paymentTerm, setPaymentTerm] = useState("");
  const [isLeader, setIsLeader] = useState(false);
  const [subDepartments, setSubDepartments] = useState<
    { id: string; positionId: string; departmentId: string; isLeader: boolean }[]
  >([]);

  // Step 3 の状態
  const [provisions, setProvisions] = useState<{ id: string; itemId: string; amount: string }[]>([
    { id: crypto.randomUUID(), itemId: "", amount: "" },
  ]);
  const [deductions, setDeductions] = useState<{ id: string; itemId: string; amount: string }[]>([
    { id: crypto.randomUUID(), itemId: "", amount: "" },
  ]);

  // Step 4 の状態
  const [selectedForm, setSelectedForm] = useState("");

  const renderStepContent = (): React.ReactNode => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Content
            employmentType={employmentType}
            setEmploymentType={setEmploymentType}
            workingStyle={workingStyle}
            setWorkingStyle={setWorkingStyle}
            paymentTerm={paymentTerm}
            setPaymentTerm={setPaymentTerm}
            isLeader={isLeader}
            setIsLeader={setIsLeader}
            subDepartments={subDepartments}
            setSubDepartments={setSubDepartments}
          />
        );
      case 2:
        return <Step2Content />;
      case 3:
        return (
          <Step3Content
            provisions={provisions}
            setProvisions={setProvisions}
            deductions={deductions}
            setDeductions={setDeductions}
          />
        );
      case 4:
        return <Step4Content selectedForm={selectedForm} setSelectedForm={setSelectedForm} />;
      case 5:
        return <Step5Content />;
      default:
        return (
          <Step1Content
            employmentType={employmentType}
            setEmploymentType={setEmploymentType}
            workingStyle={workingStyle}
            setWorkingStyle={setWorkingStyle}
            paymentTerm={paymentTerm}
            setPaymentTerm={setPaymentTerm}
            isLeader={isLeader}
            setIsLeader={setIsLeader}
            subDepartments={subDepartments}
            setSubDepartments={setSubDepartments}
          />
        );
    }
  };

  return (
    <>
      <PageLayout scrollBehavior="inside">
        <PageLayoutPane variant="fill">
          <PageLayoutHeader>
            <ContentHeader size="small">
              <ContentHeaderTitle>入社手続き</ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>
          <PageLayoutBody>
            <Stepper orientation="vertical" readOnly index={currentStep - 1}>
              {steps.map((step, index) => (
                <Stepper.Item key={step.id} title={step.label}>
                  <Button
                    variant="subtle"
                    color="neutral"
                    size="small"
                    disabled={index >= currentStep}
                    onClick={() => setCurrentStep(index + 1)}
                  >
                    修正
                  </Button>
                </Stepper.Item>
              ))}
            </Stepper>
          </PageLayoutBody>
        </PageLayoutPane>

        <PageLayoutContent maxWidth="small" align="center">
          {renderStepContent()}
        </PageLayoutContent>
      </PageLayout>

      <Footer>
        <ButtonGroup>
          <Button
            size="large"
            variant="subtle"
            leading={
              <Icon>
                <LfCloseLarge />
              </Icon>
            }
          >
            保存して閉じる
          </Button>
          <Button size="large" variant="plain" color="danger">
            キャンセル
          </Button>
        </ButtonGroup>

        <FooterSpacer />

        <ButtonGroup>
          <Button
            size="large"
            variant="subtle"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => prev - 1)}
          >
            戻る
          </Button>
          {currentStep < 5 ? (
            <Button size="large" onClick={() => setCurrentStep((prev) => prev + 1)}>
              次へ
            </Button>
          ) : (
            <Button size="large">登録</Button>
          )}
        </ButtonGroup>
      </Footer>
    </>
  );
}
