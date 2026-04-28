import {
  Link as AegisLink,
  Button,
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  snackbar,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

export const SnackbarSmallScale = () => {
  const showNeutral = () => {
    snackbar.show({ message: "Neutral snackbar message", color: "neutral", icon: true });
  };

  const showDanger = () => {
    snackbar.show({ message: "Danger snackbar message", color: "danger", icon: true });
  };

  const showWithAction = () => {
    snackbar.show({
      message: "Snackbar with action",
      color: "neutral",
      icon: true,
      action: <Button>Undo</Button>,
    });
  };

  const showWithClose = () => {
    snackbar.show({
      message: "Snackbar with close button",
      color: "danger",
      icon: true,
      autoDismiss: false,
    });
  };

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Snackbar Small Scale</ContentHeader.Title>
            <ContentHeader.Description>
              v2.38.1: Provider の scale="small" 時に Snackbar のスタイルが最適化されました
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            v2.38.1 では、Provider の <code>scale="small"</code> 時に Snackbar
            のパディング・ボタンサイズ・閉じるアイコンがコンパクトになるよう最適化されました。
            以下のボタンで各バリエーションを確認できます。
          </Text>

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            Snackbar バリエーション
          </Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--aegis-space-small)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <Button onClick={showNeutral}>Neutral</Button>
            <Button onClick={showDanger} color="danger">
              Danger
            </Button>
            <Button onClick={showWithAction} variant="subtle">
              With Action
            </Button>
            <Button onClick={showWithClose} variant="subtle" color="danger">
              With Close
            </Button>
          </div>

          <div
            style={{
              padding: "var(--aegis-space-medium)",
              backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
              borderRadius: "var(--aegis-radius-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              変更内容
            </Text>
            <Text as="p" variant="body.small">
              - v2.38.0 以前: Snackbar は Provider の scale に関係なく同じサイズで表示
            </Text>
            <Text as="p" variant="body.small">
              - v2.38.1: scale="small" 時にパディング・ボタンサイズ・閉じるボタンがコンパクトになり、Snackbar
              全体の幅も画面サイズに合わせて調整されます
            </Text>
            <Text as="p" variant="body.small" style={{ marginTop: "var(--aegis-space-xSmall)" }}>
              ※ scale は app レベルの Provider で設定されます。このデモではアプリの現在の scale で Snackbar
              が表示されます
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-38-1">← Back to v2.38.1</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
