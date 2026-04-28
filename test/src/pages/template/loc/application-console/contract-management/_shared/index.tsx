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
        コントラクトマネジメント
      </Text>
    </div>
  );
};

// ナビゲーションコンポーネント
export const Navigation = ({ currentPage }: { currentPage?: string }) => {
  return (
    <NavList>
      <NavList.Group>
        <NavList.Item
          href="/template/loc/application-console/contract-management/custom-attribute-definition"
          aria-current={currentPage === "custom-attribute-definition" ? "page" : undefined}
        >
          契約カスタム項目
        </NavList.Item>
        <NavList.Item
          href="/template/loc/application-console/contract-management/inhouse-id-auto-numbering"
          aria-current={currentPage === "inhouse-id-auto-numbering" ? "page" : undefined}
        >
          管理番号の自動採番
        </NavList.Item>
        <NavList.Item
          href="/template/loc/application-console/contract-management/notification"
          aria-current={currentPage === "notification" ? "page" : undefined}
        >
          期限通知
        </NavList.Item>
        <NavList.Item
          href="/template/loc/application-console/contract-management/esign-integration"
          aria-current={currentPage === "esign-integration" ? "page" : undefined}
        >
          電子契約サービス連携
        </NavList.Item>
      </NavList.Group>
    </NavList>
  );
};
