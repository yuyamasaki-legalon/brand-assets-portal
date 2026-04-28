import {
  Link as AegisLink,
  Banner,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  ContentHeaderTitle,
  FormControl,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
  TextField,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";

type FormErrors = {
  name?: string;
  email?: string;
  fileName?: string;
};

export default function FormValidation() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!name.trim()) {
      newErrors.name = "案件名は必須です";
    }
    if (!email.trim()) {
      newErrors.email = "メールアドレスは必須です";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "有効なメールアドレスを入力してください";
    }
    if (fileName.length > 50) {
      newErrors.fileName = "ファイル名は50文字以内で入力してください";
    }
    return newErrors;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const newErrors = validate();
    setErrors(newErrors);
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setFileName("");
    setErrors({});
    setSubmitted(false);
  };

  const errorCount = Object.keys(errors).length;

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Form Validation</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">フォームバリデーション</Text>
              </CardHeader>
              <CardBody>
                <div
                  style={{
                    display: "grid",
                    gap: "var(--aegis-space-medium)",
                    maxWidth: "var(--aegis-layout-width-small)",
                  }}
                >
                  <FormControl required error={submitted && !!errors.name}>
                    <FormControl.Label>案件名</FormControl.Label>
                    <TextField value={name} onChange={(e) => setName(e.target.value)} placeholder="案件名を入力" />
                    {submitted && errors.name && <FormControl.Caption>{errors.name}</FormControl.Caption>}
                  </FormControl>

                  <FormControl required error={submitted && !!errors.email}>
                    <FormControl.Label>メールアドレス</FormControl.Label>
                    <TextField
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@example.com"
                      type="email"
                    />
                    {submitted && errors.email && <FormControl.Caption>{errors.email}</FormControl.Caption>}
                  </FormControl>

                  <FormControl error={submitted && !!errors.fileName}>
                    <FormControl.Label>ファイル名</FormControl.Label>
                    <TextField
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="50文字以内"
                    />
                    {submitted && errors.fileName ? (
                      <FormControl.Caption>{errors.fileName}</FormControl.Caption>
                    ) : (
                      <FormControl.Caption>{fileName.length}/50</FormControl.Caption>
                    )}
                  </FormControl>

                  {submitted && errorCount > 0 && (
                    <Banner color="danger" size="small" closeButton={false}>
                      {errorCount}件のエラーがあります。内容を確認してください。
                    </Banner>
                  )}

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <ButtonGroup>
                      <Button variant="plain" onClick={handleReset}>
                        リセット
                      </Button>
                      <Button onClick={handleSubmit}>バリデーション実行</Button>
                    </ButtonGroup>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Text variant="title.xSmall">パターン説明</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", gap: "var(--aegis-space-small)" }}>
                  <Text variant="body.small">
                    <Text as="span" variant="body.small.bold">
                      インラインエラー
                    </Text>
                    : FormControl の error prop + FormControl.Caption でエラーメッセージ表示
                  </Text>
                  <Text variant="body.small">
                    <Text as="span" variant="body.small.bold">
                      必須チェック
                    </Text>
                    : FormControl の required prop で必須マーク表示
                  </Text>
                  <Text variant="body.small">
                    <Text as="span" variant="body.small.bold">
                      文字数制限
                    </Text>
                    : 文字数カウンタ + 超過時エラー表示
                  </Text>
                  <Text variant="body.small">
                    <Text as="span" variant="body.small.bold">
                      サマリー Banner
                    </Text>
                    : フォーム下部にエラー件数を Banner で表示
                  </Text>
                </div>
              </CardBody>
            </Card>
          </div>

          <div style={{ marginTop: "var(--aegis-space-xLarge)" }}>
            <AegisLink asChild>
              <Link to="/template/states/error">← Back to Error</Link>
            </AegisLink>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
