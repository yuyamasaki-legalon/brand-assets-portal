import {
  Link as AegisLink,
  Card,
  CardBody,
  CardHeader,
  CardLink,
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";
import styles from "../index.module.css";

const previewImages = import.meta.glob("../thumbnails/pagelayout-*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;

type TemplateItem = {
  path: string;
  title: string;
  description: string;
  thumbnailFile: string;
};

const templates: TemplateItem[] = [
  {
    path: "/template/pagelayout/basic",
    title: "Basic Layout",
    description: "All PageLayout elements (Sidebar, Pane, Content)",
    thumbnailFile: "pagelayout-basic.webp",
  },
  {
    path: "/template/pagelayout/with-sidebar",
    title: "With Sidebar",
    description: "PageLayout with SideNavigation component",
    thumbnailFile: "pagelayout-with-sidebar.webp",
  },
  {
    path: "/template/pagelayout/with-pane",
    title: "With Pane",
    description: "PageLayout with toggleable Pane",
    thumbnailFile: "pagelayout-with-pane.webp",
  },
  {
    path: "/template/pagelayout/with-resizable-pane",
    title: "With Resizable Pane",
    description: "PageLayout with a resizable Pane",
    thumbnailFile: "pagelayout-with-resizable-pane.webp",
  },
  {
    path: "/template/pagelayout/scroll-inside",
    title: "Scroll Inside",
    description: "PageLayout with inside scroll behavior",
    thumbnailFile: "pagelayout-scroll-inside.webp",
  },
  {
    path: "/template/pagelayout/with-sticky-container",
    title: "With Sticky Container",
    description: "PageLayout with PageLayoutStickyContainer",
    thumbnailFile: "pagelayout-with-sticky-container.webp",
  },
  {
    path: "/template/pagelayout/with-sidebar-and-pane",
    title: "With Sidebar and Pane",
    description: "Right sidebar navigation with toggleable Pane",
    thumbnailFile: "pagelayout-with-sidebar-and-pane.webp",
  },
  {
    path: "/template/pagelayout/with-sidebar-and-pane-start",
    title: "With Sidebar and Pane (Start)",
    description: "Left sidebar navigation with toggleable Pane",
    thumbnailFile: "pagelayout-with-sidebar-and-pane-start.webp",
  },
];

const getRouteLabel = (item: TemplateItem) => item.path.replace("/template", "template");
const getPreviewSrc = (item: TemplateItem) => previewImages[`../thumbnails/${item.thumbnailFile}`];

const TemplateCard = ({ item }: { item: TemplateItem }) => {
  const previewSrc = getPreviewSrc(item);

  return (
    <Card className={styles.templateCard} variant="outline" size="medium">
      <CardHeader>
        <CardLink asChild>
          <Link to={item.path} className={styles.titleLink}>
            <Text as="span" variant="title.xSmall">
              {item.title}
            </Text>
          </Link>
        </CardLink>
        <Text as="p" variant="body.small" color="subtle" className={styles.routeLabel}>
          {getRouteLabel(item)}
        </Text>
      </CardHeader>
      <CardBody className={styles.cardBody}>
        <Link to={item.path} className={styles.previewLink} aria-hidden tabIndex={-1}>
          <div className={styles.previewFrame}>
            {previewSrc && <img className={styles.previewImage} src={previewSrc} alt="" loading="lazy" />}
          </div>
        </Link>
        <Text as="p" variant="body.small" className={styles.description}>
          {item.description}
        </Text>
      </CardBody>
    </Card>
  );
};

const PageLayoutTemplates = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>PageLayout Templates</ContentHeaderTitle>
            <ContentHeaderDescription>Various PageLayout patterns and use cases</ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div className={styles.cardGrid}>
            {templates.map((template) => (
              <TemplateCard key={template.path} item={template} />
            ))}
          </div>

          <div style={{ marginTop: "var(--aegis-space-xLarge)" }}>
            <AegisLink asChild>
              <Link to="/template">← Back to Templates</Link>
            </AegisLink>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};

export default PageLayoutTemplates;
