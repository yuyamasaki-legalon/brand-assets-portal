import {
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";

export function WorkOnUser2() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>WorkOn - user2</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text>user2 の WorkOn 実験用ページです。</Text>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
