import { NavList } from "@legalforce/aegis-react";
import type { JSX } from "react";

export const Navigation = (): JSX.Element => {
  return (
    <NavList>
      <NavList.Group title="案件情報のカスタマイズ">
        <NavList.Item aria-current="page">案件ステータス</NavList.Item>
        <NavList.Item>案件カスタム項目</NavList.Item>
      </NavList.Group>
      <NavList.Group title="通知">
        <NavList.Item>依頼者へのメール通知</NavList.Item>
      </NavList.Group>
      <NavList.Group title="マターマネジメントエージェント">
        <NavList.Item>AIエージェントによる案件自動対応</NavList.Item>
      </NavList.Group>
      <NavList.Group title="案件の依頼">
        <NavList.Item>案件受付フォーム</NavList.Item>
        <NavList.Item>案件受付メールアドレス</NavList.Item>
        <NavList.Item>案件受付ワークスペース</NavList.Item>
      </NavList.Group>
      <NavList.Group title="セキュリティー">
        <NavList.Item>案件受付フォームのIPアドレス制限</NavList.Item>
        <NavList.Item>ドメイン制限</NavList.Item>
      </NavList.Group>
    </NavList>
  );
};
