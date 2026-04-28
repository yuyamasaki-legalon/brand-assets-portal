import {
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
} from "@legalforce/aegis-react";
import { ActivityDashboard } from "./ActivityDashboard";

export default function AnalyticsPage() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Analytics</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <ActivityDashboard />
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
