var e=`import { LfAngleDownMiddle, LfBuilding, LfFolder, LfStar } from "@legalforce/aegis-icons";
import {
  Link as AegisLink,
  Breadcrumb,
  ContentHeader,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

export const BreadcrumbIconButtonSizeDemo = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Breadcrumb IconButton size</ContentHeader.Title>
            <ContentHeader.Description>
              v2.51.1: Breadcrumb.Item 内の IconButton 子要素サイズ override を削除
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            これまで Breadcrumb.Item は内部 CSS で IconButton の子要素に <code>block-size: auto</code>{" "}
            を強制していたため、Button / Link と IconButton の高さがそろわないことがありました。v2.51.1 ではその
            override が削除され、IconButton も ButtonContext から提供される xSmall サイズに従い、Breadcrumb 内の Button
            / Link と同じ高さで表示されます。
          </Text>

          <div style={{ marginBottom: "var(--aegis-space-large)" }}>
            <Text as="h3" variant="title.xSmall" style={{ marginBottom: "var(--aegis-space-small)" }}>
              IconButton を leading / trailing に置いた Breadcrumb
            </Text>
            <div
              style={{
                padding: "var(--aegis-space-medium)",
                backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
                borderRadius: "var(--aegis-radius-medium)",
              }}
            >
              <Breadcrumb>
                <Breadcrumb.Item href="#" leading={<LfBuilding />}>
                  Workspace
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  href="#"
                  leading={<LfFolder />}
                  trailing={
                    <IconButton aria-label="Pin folder" variant="plain">
                      <LfStar />
                    </IconButton>
                  }
                >
                  Folder A
                </Breadcrumb.Item>
                <Breadcrumb.Button trailing={<LfAngleDownMiddle />}>Subfolder</Breadcrumb.Button>
                <Breadcrumb.Item href="#" aria-current="page">
                  Current page
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-large)" }}>
            上記の Folder A の trailing に置かれた IconButton と、隣の Subfolder の Breadcrumb.Button、Workspace /
            Folder A / Current page の Link テキストが、同じ baseline / 高さで並ぶことを確認できます。
          </Text>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-51-1">← Back to v2.51.1</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
`;export{e as default};