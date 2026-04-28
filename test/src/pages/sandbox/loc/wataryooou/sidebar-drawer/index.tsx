import {
  LfApps,
  LfChart,
  LfCloseLarge,
  LfFile,
  LfFilter,
  LfHome,
  LfInformationCircle,
  LfProfile,
  LfSetting,
} from "@legalforce/aegis-icons";
import {
  Button,
  ContentHeader,
  ContentHeaderTitle,
  Divider,
  Drawer,
  FormControl,
  Icon,
  IconButton,
  Menu,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Select,
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  Switch,
  Tag,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { useRef, useState } from "react";
import styles from "./index.module.css";

const drawerWidthOptions = [
  { value: "xLarge", label: "xLarge" },
  { value: "large", label: "large" },
  { value: "medium", label: "medium" },
  { value: "small", label: "small" },
] as const;

type DrawerWidth = (typeof drawerWidthOptions)[number]["value"];

const drawerPositionOptions = [
  { value: "start", label: "start" },
  { value: "end", label: "end" },
  { value: "bottom", label: "bottom" },
] as const;

type DrawerPosition = (typeof drawerPositionOptions)[number]["value"];

const drawerSampleOptions = [
  { value: "a", label: "オプション A" },
  { value: "b", label: "オプション B" },
  { value: "c", label: "オプション C" },
] as const;

const mockActivities = [
  {
    id: "1",
    category: "案件",
    timestamp: "10分前",
    title: "NDA契約書レビュー",
    description: "ステータスが「確認中」に変更されました",
  },
  {
    id: "2",
    category: "コメント",
    timestamp: "30分前",
    title: "業務委託契約書",
    description: "田中さんがコメントを追加しました",
  },
  { id: "3", category: "承認", timestamp: "1時間前", title: "秘密保持契約", description: "承認フローが完了しました" },
  {
    id: "4",
    category: "案件",
    timestamp: "2時間前",
    title: "ライセンス契約",
    description: "新しい案件が作成されました",
  },
  {
    id: "5",
    category: "コメント",
    timestamp: "3時間前",
    title: "売買契約書",
    description: "佐藤さんが修正を依頼しました",
  },
];

const menuItems = [
  { icon: LfHome, label: "ホーム" },
  { icon: LfFile, label: "ドキュメント" },
  { icon: LfChart, label: "レポート" },
  { icon: LfProfile, label: "ユーザー" },
];

export const SidebarDrawer = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paneOpen, setPaneOpen] = useState(true);
  const [drawerWidth, setDrawerWidth] = useState<DrawerWidth>("medium");
  const [drawerPosition, setDrawerPosition] = useState<DrawerPosition>("end");
  const [drawerResizable, setDrawerResizable] = useState(false);

  // biome-ignore lint/style/noNonNullAssertion: Drawer component requires non-null RefObject
  const drawerRoot = useRef<HTMLDivElement>(null!);

  return (
    <SidebarProvider defaultOpen>
      <SidebarInset>
        <PageLayout ref={drawerRoot}>
          <PageLayoutContent>
            <PageLayoutHeader>
              <ContentHeader>
                <ContentHeader.Title>Sidebar + Pane + Drawer</ContentHeader.Title>
                <ContentHeader.Description>Sidebar + PageLayoutPane + Drawer の構成サンプル</ContentHeader.Description>
              </ContentHeader>
            </PageLayoutHeader>
            <PageLayoutBody>
              <div className={styles.stackLarge}>
                <section>
                  <Text as="p" variant="title.xSmall" className={styles.sectionTitle}>
                    Drawer Props
                  </Text>
                  <div className={styles.controlGrid}>
                    <FormControl>
                      <FormControl.Label>width</FormControl.Label>
                      <Select
                        options={drawerWidthOptions}
                        value={drawerWidth}
                        onChange={(v) => setDrawerWidth(v as DrawerWidth)}
                      />
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>position</FormControl.Label>
                      <Select
                        options={drawerPositionOptions}
                        value={drawerPosition}
                        onChange={(v) => setDrawerPosition(v as DrawerPosition)}
                      />
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>resizable</FormControl.Label>
                      <Switch checked={drawerResizable} onChange={() => setDrawerResizable((prev) => !prev)} />
                    </FormControl>
                  </div>
                </section>

                <div className={styles.actions}>
                  <Button
                    variant="subtle"
                    leading={
                      <Icon>
                        <LfFilter />
                      </Icon>
                    }
                    onClick={() => setDrawerOpen(true)}
                  >
                    Drawer を開く
                  </Button>
                  <Button
                    variant="subtle"
                    leading={
                      <Icon>
                        <LfInformationCircle />
                      </Icon>
                    }
                    onClick={() => setPaneOpen((prev) => !prev)}
                  >
                    {paneOpen ? "Pane を閉じる" : "Pane を開く"}
                  </Button>
                </div>

                <section>
                  <Text as="p" variant="title.xSmall" className={styles.sectionTitle}>
                    コンテンツエリア
                  </Text>
                  <Text as="p" variant="body.medium">
                    Sidebar の開閉、Pane の表示切替、Drawer の表示を組み合わせて、レイアウトの挙動を確認してください。
                  </Text>
                </section>
              </div>
            </PageLayoutBody>
          </PageLayoutContent>

          <Drawer
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            width={drawerWidth}
            position={drawerPosition}
            resizable={drawerResizable}
            root={drawerRoot}
            lockScroll={false}
          >
            <Drawer.Header>Drawer パネル</Drawer.Header>
            <Drawer.Body>
              <div className={styles.stackMedium}>
                <Text as="p" variant="body.medium">
                  Drawer はオーバーレイで表示されます。一時的な操作やフィルターに使用します。
                </Text>
                <FormControl>
                  <FormControl.Label>サンプル入力</FormControl.Label>
                  <Select options={drawerSampleOptions} />
                </FormControl>
                <FormControl>
                  <FormControl.Label>有効化</FormControl.Label>
                  <Switch />
                </FormControl>
              </div>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="subtle" onClick={() => setDrawerOpen(false)}>
                閉じる
              </Button>
            </Drawer.Footer>
          </Drawer>

          <PageLayoutPane position="end" width="medium" resizable open={paneOpen} onOpenChange={setPaneOpen}>
            <PageLayoutHeader>
              <ContentHeader
                size="medium"
                action={
                  <Tooltip title="閉じる">
                    <IconButton
                      variant="plain"
                      size="small"
                      aria-label="Pane を閉じる"
                      onClick={() => setPaneOpen(false)}
                    >
                      <Icon>
                        <LfCloseLarge />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                }
              >
                <ContentHeader.Title>Pane</ContentHeader.Title>
              </ContentHeader>
            </PageLayoutHeader>
            <PageLayoutBody>
              <div className={styles.stackMedium}>
                <Text as="p" variant="body.medium">
                  PageLayoutPane は常駐パネルとして使います。Sidebar の内側に配置されます。
                </Text>
                <FormControl>
                  <FormControl.Label>メモ</FormControl.Label>
                  <Select options={drawerSampleOptions} />
                </FormControl>
              </div>
            </PageLayoutBody>
          </PageLayoutPane>
        </PageLayout>
      </SidebarInset>

      <Sidebar behavior="push" collapsible="offcanvas" side="inline-end">
        <SidebarHeader>
          <ContentHeader
            size="large"
            leading={
              <Menu>
                <MenuTrigger>
                  <Tooltip title="メニュー">
                    <IconButton aria-label="メニュー" variant="plain" size="large">
                      <Icon>
                        <LfApps />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                </MenuTrigger>
                <MenuContent side="bottom" align="start">
                  <MenuGroup>
                    {menuItems.map((item) => (
                      <MenuItem
                        key={item.label}
                        leading={
                          <Icon>
                            <item.icon />
                          </Icon>
                        }
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                  </MenuGroup>
                  <MenuSeparator />
                  <MenuGroup>
                    <MenuItem
                      leading={
                        <Icon>
                          <LfSetting />
                        </Icon>
                      }
                    >
                      設定
                    </MenuItem>
                  </MenuGroup>
                </MenuContent>
              </Menu>
            }
          >
            <ContentHeaderTitle>SAMPLE</ContentHeaderTitle>
          </ContentHeader>
        </SidebarHeader>
        <SidebarHeader>
          <ContentHeader size="small">
            <ContentHeaderTitle>アクティビティ</ContentHeaderTitle>
          </ContentHeader>
        </SidebarHeader>
        <SidebarBody>
          <div className={styles.activityList}>
            {mockActivities.map((activity, index) => (
              <div key={activity.id}>
                <div className={styles.activityItem}>
                  <div className={styles.activityHeader}>
                    <Tag size="small" variant="fill">
                      {activity.category}
                    </Tag>
                    <Text variant="body.xSmall" color="subtle">
                      {activity.timestamp}
                    </Text>
                  </div>
                  <Text variant="body.small.bold">{activity.title}</Text>
                  <Text variant="body.small" color="subtle">
                    {activity.description}
                  </Text>
                </div>
                {index < mockActivities.length - 1 && <Divider />}
              </div>
            ))}
          </div>
        </SidebarBody>
      </Sidebar>
    </SidebarProvider>
  );
};
