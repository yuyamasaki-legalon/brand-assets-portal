import {
  Link as AegisLink,
  Card,
  CardBody,
  CardHeader,
  CardLink,
  ContentHeader,
  ContentHeaderTitle,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

type SettingItem = {
  title: string;
  description: string;
  to: string;
};

const settingItems: SettingItem[] = [
  {
    title: "従業員を招待",
    description: "従業員をシステムに招待します",
    to: "/template/workon/setting/invite",
  },
  {
    title: "アカウント設定",
    description: "アカウント情報、パスワード、2要素認証の設定",
    to: "/template/workon/setting/account",
  },
  {
    title: "権限管理",
    description: "権限の作成・編集・削除、権限保持者の管理",
    to: "/template/workon/setting/permission-management",
  },
];

export default function WorkOnSettingPage() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>設定</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(var(--aegis-layout-width-x5Small), 1fr))",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            {settingItems.map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <CardLink asChild>
                    <Link to={item.to}>
                      <Text variant="title.xSmall">{item.title}</Text>
                    </Link>
                  </CardLink>
                </CardHeader>
                <CardBody>
                  <Text variant="body.small">{item.description}</Text>
                </CardBody>
              </Card>
            ))}
          </div>

          <AegisLink asChild>
            <Link to="/template">← Back to Templates</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
