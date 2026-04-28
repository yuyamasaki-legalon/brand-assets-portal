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
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

type DisplayMode = "input" | "confirm" | "success";

export default function FormSubmission() {
  const [mode, setMode] = useState<DisplayMode>("input");
  const [caseName, setCaseName] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [shouldFail, setShouldFail] = useState(true);

  // beforeunload warning when form has unsaved changes
  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (mode === "input" || mode === "confirm") {
        e.preventDefault();
      }
    },
    [mode],
  );

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [handleBeforeUnload]);

  const handleConfirm = () => {
    setMode("confirm");
    setSubmitError(null);
  };

  const handleSubmit = () => {
    setIsPending(true);
    setSubmitError(null);
    setTimeout(() => {
      setIsPending(false);
      if (shouldFail) {
        setSubmitError("送信に失敗しました。時間をおいて再度お試しください。");
        setShouldFail(false);
      } else {
        setMode("success");
      }
    }, 1500);
  };

  const handleReset = () => {
    setMode("input");
    setCaseName("");
    setDescription("");
    setSubmitError(null);
    setShouldFail(true);
  };

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Form Submission</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
            {/* State Machine Diagram */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">状態遷移</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "flex", gap: "var(--aegis-space-small)", alignItems: "center" }}>
                  <Text variant="label.small" color={mode === "input" ? "default" : "subtle"}>
                    入力
                  </Text>
                  <Text variant="body.small" color="subtle">
                    →
                  </Text>
                  <Text variant="label.small" color={mode === "confirm" ? "default" : "subtle"}>
                    確認
                  </Text>
                  <Text variant="body.small" color="subtle">
                    →
                  </Text>
                  <Text variant="label.small" color={mode === "success" ? "default" : "subtle"}>
                    完了
                  </Text>
                </div>
              </CardBody>
            </Card>

            {/* Form Content */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">
                  {mode === "input" && "入力画面"}
                  {mode === "confirm" && "確認画面"}
                  {mode === "success" && "送信完了"}
                </Text>
              </CardHeader>
              <CardBody>
                <div
                  style={{
                    display: "grid",
                    gap: "var(--aegis-space-medium)",
                    maxWidth: "var(--aegis-layout-width-small)",
                  }}
                >
                  {mode === "input" && (
                    <>
                      <FormControl required>
                        <FormControl.Label>案件名</FormControl.Label>
                        <TextField
                          value={caseName}
                          onChange={(e) => setCaseName(e.target.value)}
                          placeholder="案件名を入力"
                        />
                      </FormControl>
                      <FormControl>
                        <FormControl.Label>概要</FormControl.Label>
                        <TextField
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="概要を入力"
                        />
                      </FormControl>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button onClick={handleConfirm} disabled={!caseName.trim()}>
                          確認
                        </Button>
                      </div>
                    </>
                  )}

                  {mode === "confirm" && (
                    <>
                      <div style={{ display: "grid", gap: "var(--aegis-space-small)" }}>
                        <div>
                          <Text variant="label.small" color="subtle" as="p">
                            案件名
                          </Text>
                          <Text variant="body.medium">{caseName}</Text>
                        </div>
                        <div>
                          <Text variant="label.small" color="subtle" as="p">
                            概要
                          </Text>
                          <Text variant="body.medium">{description || "（未入力）"}</Text>
                        </div>
                      </div>
                      <Text variant="body.small" color="subtle">
                        初回は送信失敗、リトライで成功します。
                      </Text>
                      {submitError && (
                        <Banner color="danger" size="small" closeButton={false}>
                          {submitError}
                        </Banner>
                      )}
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <ButtonGroup>
                          <Button variant="plain" disabled={isPending} onClick={() => setMode("input")}>
                            戻る
                          </Button>
                          <Button loading={isPending} onClick={handleSubmit}>
                            送信
                          </Button>
                        </ButtonGroup>
                      </div>
                    </>
                  )}

                  {mode === "success" && (
                    <>
                      <div
                        style={{
                          padding: "var(--aegis-space-large)",
                          backgroundColor: "var(--aegis-color-surface-success-xSubtle)",
                          borderRadius: "var(--aegis-radius-medium)",
                          textAlign: "center",
                        }}
                      >
                        <Text variant="body.medium" color="success">
                          送信が完了しました
                        </Text>
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button variant="subtle" onClick={handleReset}>
                          最初からやり直す
                        </Button>
                      </div>
                    </>
                  )}
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
