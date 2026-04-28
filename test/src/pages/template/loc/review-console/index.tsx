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

type ReviewConsoleItem = {
  title: string;
  description: string;
  to: string;
};

const reviewConsoleItems: ReviewConsoleItem[] = [
  {
    title: "LegalOn アラート",
    description: "ルールグループ一覧と詳細設定",
    to: "/template/loc/review-console/rules",
  },
  {
    title: "My Playbooks",
    description: "Third-Party / First-Party プレイブック管理",
    to: "/template/loc/review-console/my-playbook",
  },
];

export default function ReviewConsolePage() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Review Console</ContentHeaderTitle>
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
            {reviewConsoleItems.map((item) => (
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
