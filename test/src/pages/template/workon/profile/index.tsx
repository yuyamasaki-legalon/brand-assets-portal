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

type ProfileMenuItem = {
  title: string;
  description: string;
  to: string;
};

const profileMenuItems: ProfileMenuItem[] = [
  {
    title: "従業員情報",
    description: "基本情報、所属・役職の確認",
    to: "/template/workon/profile/employee",
  },
  {
    title: "個人情報",
    description: "住所・連絡先、銀行口座、緊急連絡先など",
    to: "/template/workon/profile/personal-info",
  },
  {
    title: "付加情報",
    description: "在留資格、障害者情報、勤労学生など",
    to: "/template/workon/profile/additional-info",
  },
  {
    title: "税・保険",
    description: "雇用保険、社会保険、住民税、所得税",
    to: "/template/workon/profile/tax-insurance",
  },
  {
    title: "配偶者・家族",
    description: "家族情報の登録・管理",
    to: "/template/workon/profile/family-info",
  },
  {
    title: "支給・控除",
    description: "支給項目、控除項目の確認",
    to: "/template/workon/profile/payment-deduction",
  },
  {
    title: "給与・賞与明細",
    description: "給与明細、賞与明細、源泉徴収票",
    to: "/template/workon/profile/salary-bonus-detail",
  },
  {
    title: "休職歴",
    description: "休職履歴の確認・管理",
    to: "/template/workon/profile/leave-of-absence",
  },
  {
    title: "異動歴",
    description: "所属歴、出向歴、等級の履歴",
    to: "/template/workon/profile/department-assignment",
  },
  {
    title: "カスタム項目",
    description: "カスタム項目の確認・管理",
    to: "/template/workon/profile/custom",
  },
];

export default function WorkOnProfilePage() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>プロフィール</ContentHeaderTitle>
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
            {profileMenuItems.map((item) => (
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
