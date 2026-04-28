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
      <Text as="h2" variant="title.large">
        マターマネジメント
      </Text>
    </div>
  );
};

// ナビゲーションコンポーネント
export const Navigation = ({ currentPage }: { currentPage?: string }) => {
  return (
    <NavList>
      <NavList.Group title="案件情報のカスタマイズ">
        <NavList.Item
          href="/template/loc/application-console"
          aria-current={currentPage === "case-status" ? "page" : undefined}
        >
          案件ステータス
        </NavList.Item>
        <NavList.Item
          href="/template/loc/application-console/case-custom-attribute"
          aria-current={currentPage === "case-custom-attribute" ? "page" : undefined}
        >
          案件カスタム項目
        </NavList.Item>
      </NavList.Group>
      <NavList.Group title="通知">
        <NavList.Item
          href="/template/loc/application-console/case-notification-config"
          aria-current={currentPage === "case-notification-config" ? "page" : undefined}
        >
          依頼者へのメール通知
        </NavList.Item>
      </NavList.Group>
      <NavList.Group title="マターマネジメントエージェント">
        <NavList.Item
          href="/template/loc/application-console/case-automation"
          aria-current={currentPage === "case-automation" ? "page" : undefined}
        >
          AIエージェントによる案件自動対応
        </NavList.Item>
      </NavList.Group>
      <NavList.Group title="案件の依頼">
        <NavList.Item
          href="/template/loc/application-console/case-reception-form"
          aria-current={currentPage === "case-reception-form" ? "page" : undefined}
        >
          案件受付フォーム
        </NavList.Item>
        <NavList.Item
          href="/template/loc/application-console/reception-mail-address"
          aria-current={currentPage === "reception-mail-address" ? "page" : undefined}
        >
          案件受付メールアドレス
        </NavList.Item>
        <NavList.Item
          href="/template/loc/application-console/case-reception-space"
          aria-current={currentPage === "case-reception-space" ? "page" : undefined}
        >
          案件受付ワークスペース
        </NavList.Item>
      </NavList.Group>
      <NavList.Group title="セキュリティー">
        <NavList.Item
          href="/template/loc/application-console/case-reception-form-allowed-ip-address"
          aria-current={currentPage === "case-reception-form-allowed-ip-address" ? "page" : undefined}
        >
          案件受付フォームのIPアドレス制限
        </NavList.Item>
        <NavList.Item
          href="/template/loc/application-console/case-mail-allowed-domain"
          aria-current={currentPage === "case-mail-allowed-domain" ? "page" : undefined}
        >
          ドメイン制限
        </NavList.Item>
      </NavList.Group>
    </NavList>
  );
};
