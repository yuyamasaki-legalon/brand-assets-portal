import { LegalOnLogoLight } from "@legalforce/aegis-logos/react";
import {
  Button,
  ButtonGroup,
  DateField,
  Footer,
  Form,
  FormControl,
  Header,
  Logo,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  Radio,
  RadioGroup,
  Select,
  Text,
  Textarea,
  TextField,
} from "@legalforce/aegis-react";

const categoryOptions = [
  { label: "契約書レビュー", value: "contractReview" },
  { label: "法律相談", value: "legalConsultation" },
  { label: "新規契約", value: "newContract" },
  { label: "その他", value: "other" },
];

const contentWrapperStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--aegis-space-xLarge)",
  inlineSize: "100%",
  maxInlineSize: "var(--aegis-layout-width-medium)",
  marginInline: "auto",
} as const;

/**
 * Form Template
 *
 * Form Layout を使った具体的なフォーム実装例。
 * FormControl の各種コンポーネント配置と送信/キャンセルボタンを含む。
 */
const FormTemplate = () => {
  return (
    <>
      <Header>
        <Header.Item>
          <Logo size="medium">
            <LegalOnLogoLight />
          </Logo>
        </Header.Item>
      </Header>

      <PageLayout>
        <PageLayoutContent>
          <PageLayoutBody>
            <div style={contentWrapperStyle}>
              <Text variant="title.small">依頼フォーム</Text>

              <Form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-large)",
                }}
              >
                <FormControl required>
                  <FormControl.Label>名前</FormControl.Label>
                  <TextField placeholder="山田 太郎" />
                </FormControl>

                <FormControl required>
                  <FormControl.Label>メールアドレス</FormControl.Label>
                  <TextField type="email" placeholder="taro.yamada@example.com" />
                </FormControl>

                <FormControl required>
                  <FormControl.Label>カテゴリー</FormControl.Label>
                  <Select options={categoryOptions} placeholder="選択してください" />
                </FormControl>

                <FormControl>
                  <FormControl.Label>優先度</FormControl.Label>
                  <RadioGroup defaultValue="medium" orientation="horizontal">
                    <Radio value="low">低</Radio>
                    <Radio value="medium">中</Radio>
                    <Radio value="high">高</Radio>
                  </RadioGroup>
                </FormControl>

                <FormControl>
                  <FormControl.Label>希望納期</FormControl.Label>
                  <DateField />
                </FormControl>

                <FormControl required>
                  <FormControl.Label>依頼内容</FormControl.Label>
                  <Textarea placeholder="依頼の詳細を入力してください" minRows={4} />
                </FormControl>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingBlockStart: "var(--aegis-space-medium)",
                  }}
                >
                  <ButtonGroup>
                    <Button variant="subtle" type="button">
                      キャンセル
                    </Button>
                    <Button variant="solid" type="submit">
                      送信する
                    </Button>
                  </ButtonGroup>
                </div>
              </Form>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>

      <Footer>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            inlineSize: "100%",
          }}
        >
          <Text variant="body.small" color="subtle">
            &copy; LegalOn Technologies
          </Text>
        </div>
      </Footer>
    </>
  );
};

export default FormTemplate;
