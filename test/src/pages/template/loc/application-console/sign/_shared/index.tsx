import { LfAngleLeft } from "@legalforce/aegis-icons";
import { IconButton, NavList, Text, Tooltip } from "@legalforce/aegis-react";

// ナビゲーションヘッダーコンポーネント
export const NavigationHeader = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--aegis-space-xSmall)",
      }}
    >
      <Tooltip title="戻る">
        <IconButton aria-label="戻る" icon={LfAngleLeft} size="medium" variant="plain" />
      </Tooltip>
      <Text as="h2" variant="title.medium">
        サイン
      </Text>
    </div>
  );
};

// ナビゲーションコンポーネント
export const Navigation = ({ currentPage }: { currentPage?: string }) => {
  return (
    <NavList>
      <NavList.Group title="署名依頼">
        <NavList.Item
          href="/template/loc/application-console/sign/sender-name"
          aria-current={currentPage === "sender-name" ? "page" : undefined}
        >
          差出人企業名
        </NavList.Item>
        <NavList.Item
          href="/template/loc/application-console/sign/default-space"
          aria-current={currentPage === "default-space" ? "page" : undefined}
        >
          署名依頼の保存先
        </NavList.Item>
      </NavList.Group>
      <NavList.Group title="承認申請">
        <NavList.Item
          href="/template/loc/application-console/sign/sign-workflow-form"
          aria-current={currentPage === "sign-workflow-form" ? "page" : undefined}
        >
          承認申請フォーム
        </NavList.Item>
      </NavList.Group>
    </NavList>
  );
};
