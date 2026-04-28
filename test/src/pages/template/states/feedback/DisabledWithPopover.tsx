import {
  Link as AegisLink,
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
  Popover,
  Text,
  TextField,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function DisabledWithPopover() {
  const [requiredField, setRequiredField] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPermission] = useState(false);

  const isRequiredEmpty = !requiredField.trim();

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Disabled + Popover</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
            {/* Pattern 1: Required field empty */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">パターン1: 必須項目未入力で disabled</Text>
              </CardHeader>
              <CardBody>
                <div
                  style={{
                    display: "grid",
                    gap: "var(--aegis-space-medium)",
                    maxWidth: "var(--aegis-layout-width-small)",
                  }}
                >
                  <Text variant="body.small" color="subtle">
                    必須項目が未入力の場合、ボタンを disabled にし、Popover で理由を表示します。
                  </Text>
                  <FormControl required>
                    <FormControl.Label>案件名</FormControl.Label>
                    <TextField
                      value={requiredField}
                      onChange={(e) => setRequiredField(e.target.value)}
                      placeholder="案件名を入力"
                    />
                  </FormControl>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <ButtonGroup>
                      <Button variant="plain">キャンセル</Button>
                      {isRequiredEmpty ? (
                        <Popover trigger="hover" arrow placement="top-end" closeButton={false}>
                          <Popover.Anchor>
                            <Button disabled>保存</Button>
                          </Popover.Anchor>
                          <Popover.Content width="small">
                            <Popover.Body>
                              <Text variant="body.small">必須項目を入力してください</Text>
                            </Popover.Body>
                          </Popover.Content>
                        </Popover>
                      ) : (
                        <Button onClick={handleSubmit}>保存</Button>
                      )}
                    </ButtonGroup>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Pattern 2: No permission */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">パターン2: 権限不足で disabled</Text>
              </CardHeader>
              <CardBody>
                <div
                  style={{
                    display: "grid",
                    gap: "var(--aegis-space-medium)",
                    maxWidth: "var(--aegis-layout-width-small)",
                  }}
                >
                  <Text variant="body.small" color="subtle">
                    ユーザーに操作権限がない場合、ボタンを disabled にし、Popover で理由を表示します。
                  </Text>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    {!hasPermission ? (
                      <Popover trigger="hover" arrow placement="top-end" closeButton={false}>
                        <Popover.Anchor>
                          <Button disabled>編集</Button>
                        </Popover.Anchor>
                        <Popover.Content width="small">
                          <Popover.Body>
                            <Text variant="body.small">この操作を行う権限がありません</Text>
                          </Popover.Body>
                        </Popover.Content>
                      </Popover>
                    ) : (
                      <Button>編集</Button>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Pattern 3: Processing */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">パターン3: 処理中で disabled</Text>
              </CardHeader>
              <CardBody>
                <div
                  style={{
                    display: "grid",
                    gap: "var(--aegis-space-medium)",
                    maxWidth: "var(--aegis-layout-width-small)",
                  }}
                >
                  <Text variant="body.small" color="subtle">
                    処理中はボタンに loading を表示します。Popover は不要で、Button の loading prop を使います。
                  </Text>
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
              </CardBody>
            </Card>
          </div>

          <div style={{ marginTop: "var(--aegis-space-xLarge)" }}>
            <AegisLink asChild>
              <Link to="/template/states/feedback">← Back to Feedback</Link>
            </AegisLink>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
