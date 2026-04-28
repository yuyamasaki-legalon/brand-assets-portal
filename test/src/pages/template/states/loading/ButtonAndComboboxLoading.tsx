import {
  Link as AegisLink,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Combobox,
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

const comboboxOptions = [
  { label: "営業部", value: "sales" },
  { label: "法務部", value: "legal" },
  { label: "人事部", value: "hr" },
  { label: "経理部", value: "accounting" },
];

export default function ButtonAndComboboxLoading() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comboboxLoading, setComboboxLoading] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  const handleComboboxLoad = () => {
    setComboboxLoading(true);
    setTimeout(() => setComboboxLoading(false), 2000);
  };

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Button &amp; Combobox Loading</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
            {/* Button Loading */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">Button loading</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
                  <Text variant="body.small" color="subtle">
                    送信中は Button に loading を設定し、他の操作をすべて disabled にします。
                  </Text>
                  <div
                    style={{
                      display: "grid",
                      gap: "var(--aegis-space-medium)",
                      maxWidth: "var(--aegis-layout-width-small)",
                    }}
                  >
                    <FormControl required>
                      <FormControl.Label>案件名</FormControl.Label>
                      <TextField defaultValue="サンプル案件" disabled={isSubmitting} />
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>備考</FormControl.Label>
                      <TextField defaultValue="備考テキスト" disabled={isSubmitting} />
                    </FormControl>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <ButtonGroup>
                        <Button variant="plain" disabled={isSubmitting}>
                          キャンセル
                        </Button>
                        <Button loading={isSubmitting} onClick={handleSubmit}>
                          保存
                        </Button>
                      </ButtonGroup>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Combobox Loading */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">Combobox loading</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
                  <Text variant="body.small" color="subtle">
                    Combobox の loading prop を使ってオプションの非同期読み込みを表現します。
                  </Text>
                  <div style={{ maxWidth: "var(--aegis-layout-width-x4Small)" }}>
                    <FormControl>
                      <FormControl.Label>部署</FormControl.Label>
                      <Combobox
                        options={comboboxLoading ? [] : comboboxOptions}
                        loading={comboboxLoading}
                        placeholder="部署を選択"
                      />
                    </FormControl>
                  </div>
                  <div>
                    <Button variant="subtle" onClick={handleComboboxLoad}>
                      Loading を開始（2秒）
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div style={{ marginTop: "var(--aegis-space-xLarge)" }}>
            <AegisLink asChild>
              <Link to="/template/states/loading">← Back to Loading</Link>
            </AegisLink>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
