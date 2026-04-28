import {
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";

export function LocUser1() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>LegalOn - user1</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text>user1 の LegalOn 実験用ページです。</Text>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
