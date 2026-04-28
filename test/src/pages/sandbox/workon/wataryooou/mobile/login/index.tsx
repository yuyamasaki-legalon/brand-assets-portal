import { LfEye } from "@legalforce/aegis-icons";
import { LegalOnLogoSymbolLight } from "@legalforce/aegis-logos/react";
import {
  Link as AegisLink,
  Button,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  Text,
  TextField,
  Tooltip,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
        padding: "var(--aegis-space-xLarge)",
      }}
    >
      <div style={{ width: "64px", height: "64px" }}>
        <LegalOnLogoSymbolLight />
      </div>

      <Text
        as="h1"
        variant="title.small"
        style={{ marginTop: "var(--aegis-space-large)", marginBottom: "var(--aegis-space-xLarge)" }}
      >
        ユーザーログイン
      </Text>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)", width: "100%" }}>
        <TextField type="email" placeholder="メールアドレス" aria-label="メールアドレス" />

        <TextField
          type={showPassword ? "text" : "password"}
          placeholder="パスワード"
          trailing={
            <Tooltip title={showPassword ? "パスワードを非表示" : "パスワードを表示"}>
              <IconButton
                aria-label={showPassword ? "パスワードを非表示" : "パスワードを表示"}
                variant="plain"
                size="small"
                onClick={() => setShowPassword(!showPassword)}
              >
                <Icon>
                  <LfEye />
                </Icon>
              </IconButton>
            </Tooltip>
          }
        />

        <Button width="full" style={{ marginTop: "var(--aegis-space-xSmall)" }}>
          ログイン
        </Button>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button variant="plain">パスワードを忘れた方</Button>
        </div>
      </div>
    </div>
  );
}

export function LoginPage() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutBody>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--aegis-space-large)",
              paddingBlock: "var(--aegis-space-xLarge)",
            }}
          >
            {/* Mobile phone frame */}
            <div
              style={{
                width: "375px",
                height: "740px",
                borderRadius: "var(--aegis-space-xLarge)",
                border: "8px solid #1a1a1a",
                backgroundColor: "var(--aegis-color-background-default)",
                overflow: "hidden",
              }}
            >
              <LoginScreen />
            </div>

            <AegisLink asChild>
              <Link to="/sandbox/workon/wataryooou/mobile">Back to mobile</Link>
            </AegisLink>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
