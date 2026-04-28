import {
  Link as AegisLink,
  ContentHeader,
  FormControl,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
  Textarea,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const TextareaImprovements = () => {
  const max = 20;
  const [normalText, setNormalText] = useState("");
  const [errorText, setErrorText] = useState(
    "これは20文字を超えるエラー状態のテキストです。カウントラベルの色が赤くなります。",
  );

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Textarea 改善</ContentHeader.Title>
            <ContentHeader.Description>
              v2.45.0: TextareaCountLabel のエラー時カラー修正 + row gap 追加
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            TextareaCountLabel がエラー状態（文字数超過）のときに適切なエラーカラーで表示されるよう修正されました。
            また、leading/trailing とテキストボックス間に row gap が追加されました。
          </Text>

          {/* エラー時の CountLabel カラー */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            CountLabel エラー時カラー（文字数超過で赤色表示）
          </Text>
          <div
            style={{
              maxWidth: "var(--aegis-layout-width-small)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            <FormControl error={errorText.length > max}>
              <FormControl.Label>コメント（最大 {max} 文字）</FormControl.Label>
              <Textarea
                value={errorText}
                onChange={(e) => setErrorText(e.currentTarget.value)}
                trailing={<Textarea.CountLabel count={errorText.length} max={max} />}
              />
              {errorText.length > max && <FormControl.Caption>{max} 文字以内で入力してください</FormControl.Caption>}
            </FormControl>
          </div>

          {/* 通常状態の CountLabel */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            CountLabel 通常状態
          </Text>
          <div
            style={{
              maxWidth: "var(--aegis-layout-width-small)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            <FormControl error={normalText.length > max}>
              <FormControl.Label>メモ（最大 {max} 文字）</FormControl.Label>
              <Textarea
                value={normalText}
                onChange={(e) => setNormalText(e.currentTarget.value)}
                trailing={<Textarea.CountLabel count={normalText.length} max={max} />}
                placeholder="テキストを入力してください"
              />
            </FormControl>
          </div>

          {/* row gap のデモ */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            leading / trailing と テキストボックス間の row gap
          </Text>
          <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
            trailing（CountLabel）とテキスト入力エリアの間に適切なスペースが確保されています。
          </Text>
          <div
            style={{
              maxWidth: "var(--aegis-layout-width-small)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            <Textarea
              defaultValue={"行1\n行2\n行3\n行4\n行5"}
              minRows={3}
              maxRows={5}
              trailing={<Textarea.CountLabel count={15} max={100} />}
            />
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
              修正内容
            </Text>
            <Text as="p" variant="body.small">
              - v2.44.x 以前: TextareaCountLabel がエラー時でもデフォルトカラーのまま表示
            </Text>
            <Text as="p" variant="body.small">
              - v2.45.0: エラー状態で CountLabel が danger カラーに切り替わる
            </Text>
            <Text as="p" variant="body.small">
              - v2.45.0: leading/trailing とテキストボックス間に row gap を追加し、常にスペースを確保
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-45-0">← Back to v2.45.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
