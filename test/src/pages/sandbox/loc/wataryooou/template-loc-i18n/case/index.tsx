import { LfDownload, LfEllipsisDot, LfFilter, LfFilterAlt, LfMail, LfPlusLarge } from "@legalforce/aegis-icons";
import {
  ActionList,
  Avatar,
  Badge,
  Button,
  Checkbox,
  ContentHeader,
  Divider,
  Drawer,
  Form,
  FormControl,
  Icon,
  IconButton,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutStickyContainer,
  RangeDateField,
  Search,
  Select,
  StatusLabel,
  Tab,
  Table,
  TableContainer,
  TagPicker,
  Text,
  TextField,
  Toolbar,
  ToolbarSpacer,
  Tooltip,
} from "@legalforce/aegis-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../../../../../hooks";
import { LocSidebarLayout } from "../_shared";
import { type TranslationKey, translations } from "./data/translations";

// Sample data (mock)
const sampleCases = [
  {
    id: "2024-03-0020",
    title: "業務委託契約書のレビュー依頼",
    status: "法務確認中",
    dueDate: "2024/11/08",
    updatedAt: "2025/10/22 18:30",
    requester: "山田 太郎",
    department: "営業部",
  },
  {
    id: "2024-06-0008",
    title: "秘密保持契約書の確認",
    status: "依頼者確認待ち",
    dueDate: "2024/12/15",
    updatedAt: "2025/10/15 17:11",
    requester: "佐藤 花子",
    department: "開発部",
  },
  {
    id: "2025-09-0002",
    title: "新規取引先との基本契約書作成",
    status: "対応中",
    dueDate: "2025/01/20",
    updatedAt: "2025/09/04 13:29",
    requester: "鈴木 一郎",
    department: "経理部",
  },
  {
    id: "2025-08-0052",
    title: "サービス利用規約の改定",
    status: "未着手",
    dueDate: "2025/08/29",
    updatedAt: "2025/08/27 15:07",
    requester: "田中 美咲",
    department: "企画部",
  },
  {
    id: "2025-08-0051",
    title: "ライセンス契約に関する相談",
    status: "完了",
    dueDate: "2025/09/10",
    updatedAt: "2025/08/27 15:06",
    requester: "高橋 健太",
    department: "開発部",
  },
];

const statusCounts = [
  { labelKey: "statusLegalReview" as TranslationKey, count: 45 },
  { labelKey: "statusRequesterWaiting" as TranslationKey, count: 28 },
  { labelKey: "statusNotStarted" as TranslationKey, count: 156 },
  { labelKey: "statusInProgress" as TranslationKey, count: 37 },
  { labelKey: "statusCompleted" as TranslationKey, count: 999 },
  { labelKey: "statusReturned" as TranslationKey, count: 8 },
];

const SegmentItem = ({
  label,
  count,
  t,
}: {
  label: TranslationKey;
  count: number;
  t: (key: TranslationKey) => string;
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        justifyContent: "center",
      }}
    >
      <dt style={{ textAlign: "center" }}>
        <Text variant="body.medium" color="subtle" whiteSpace="nowrap">
          {t(label)}
        </Text>
      </dt>
      <dd style={{ margin: 0, textAlign: "center" }}>
        <Text variant="body.xxLarge.bold">{count < 1000 ? count : "999+"}</Text>
      </dd>
    </div>
  );
};

export const CasePage = () => {
  const { t } = useTranslation<TranslationKey>(translations);
  const [filterOpen, setFilterOpen] = useState(false);
  // biome-ignore lint/style/noNonNullAssertion: Drawer component requires non-null RefObject
  const drawerRoot = useRef<HTMLDivElement>(null!);
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate("/sandbox/loc/wataryooou/template-loc-i18n/case/detail");
  };

  const statusOptions = [
    { label: t("statusLegalReview"), value: "legal_review" },
    { label: t("statusRequesterWaiting"), value: "requester_pending" },
    { label: t("statusNotStarted"), value: "not_started" },
    { label: t("statusInProgress"), value: "in_progress" },
    { label: t("statusCompleted"), value: "completed" },
    { label: t("statusReturned"), value: "returned" },
  ];

  const classificationOptions = [
    { label: "契約書レビュー", value: "contract_review" },
    { label: "法務相談", value: "legal_consultation" },
    { label: "訴訟対応", value: "litigation" },
    { label: "その他", value: "other" },
  ];

  const assigneeOptions = [
    { label: "Taro Yamada", value: "yamada" },
    { label: "Hanako Sato", value: "sato" },
    { label: "Ichiro Suzuki", value: "suzuki" },
  ];

  const departmentOptions = [
    { label: "QA", value: "qa" },
    { label: "法マネ", value: "legal_mane" },
    { label: "test2", value: "test2" },
  ];

  return (
    <LocSidebarLayout activeId="cases">
      <PageLayout>
        <PageLayoutContent>
          <PageLayoutHeader>
            <ContentHeader
              trailing={
                <div style={{ display: "flex", gap: "var(--aegis-space-xxSmall)" }}>
                  <Button leading={LfPlusLarge} variant="solid" size="medium">
                    {t("createCase")}
                  </Button>
                  <Tooltip title="mail">
                    <IconButton aria-label="mail">
                      <Icon>
                        <LfMail />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                </div>
              }
            >
              <ContentHeader.Title>{t("pageTitle")}</ContentHeader.Title>
            </ContentHeader>
          </PageLayoutHeader>
          <PageLayoutBody>
            {/* Stats Section */}
            <div
              style={{
                display: "flex",
                gap: "var(--aegis-space-large)",
                alignItems: "flex-start",
                paddingBlock: "var(--aegis-space-xSmall)",
                margin: 0,
              }}
            >
              <dl style={{ margin: 0 }}>
                <SegmentItem label="assigneeUnset" count={852} t={t} />
              </dl>

              <Divider orientation="vertical" style={{ alignSelf: "stretch" }} />

              <dl
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--aegis-space-large)",
                  margin: 0,
                }}
              >
                {statusCounts.map((item) => (
                  <SegmentItem key={item.labelKey} label={item.labelKey} count={item.count} t={t} />
                ))}
              </dl>
            </div>

            {/* Tab and Table */}
            <Tab.Group variant="plain">
              <PageLayoutStickyContainer>
                <Toolbar>
                  <div style={{ overflow: "hidden" }}>
                    <Tab.List>
                      <Tab trailing={<Badge color="danger" count={23} />}>
                        <Text whiteSpace="nowrap" numberOfLines={1}>
                          {t("all")}
                        </Text>
                      </Tab>
                      <Tab>
                        <Text whiteSpace="nowrap" numberOfLines={1}>
                          {t("assigneeUnset")}
                        </Text>
                      </Tab>
                      <Tab trailing={<Badge color="danger" count={21} />}>
                        <Text whiteSpace="nowrap" numberOfLines={1}>
                          {t("inCharge")}
                        </Text>
                      </Tab>
                      <Tab>
                        <Text whiteSpace="nowrap" numberOfLines={1}>
                          {t("unnamed")}
                        </Text>
                      </Tab>
                    </Tab.List>
                  </div>
                  <ToolbarSpacer />
                  <Button
                    variant={filterOpen ? "subtle" : "plain"}
                    leading={
                      <Icon>
                        <LfFilter />
                      </Icon>
                    }
                    onClick={() => setFilterOpen(true)}
                  >
                    {t("filter")}
                  </Button>
                  <Search placeholder={t("search")} shrinkOnBlur />
                  <Menu placement="bottom-end">
                    <Menu.Anchor>
                      <Tooltip title={t("moreOptions")} placement="top">
                        <IconButton size="medium" aria-label={t("moreOptions")}>
                          <Icon>
                            <LfEllipsisDot />
                          </Icon>
                        </IconButton>
                      </Tooltip>
                    </Menu.Anchor>
                    <Menu.Box width="small">
                      <ActionList size="large">
                        <ActionList.Group>
                          <ActionList.Item>
                            <ActionList.Body leading={LfFilterAlt} aria-label={t("customizeDisplay")}>
                              {t("customizeDisplay")}
                            </ActionList.Body>
                          </ActionList.Item>
                        </ActionList.Group>
                        <ActionList.Group>
                          <ActionList.Item>
                            <ActionList.Body leading={LfDownload} aria-label={t("downloadCsv")}>
                              {t("downloadCsv")}
                            </ActionList.Body>
                          </ActionList.Item>
                        </ActionList.Group>
                      </ActionList>
                    </Menu.Box>
                  </Menu>
                </Toolbar>
              </PageLayoutStickyContainer>

              <Tab.Panels ref={drawerRoot}>
                <Tab.Panel>
                  <TableContainer stickyHeader>
                    <Table>
                      <Table.Head>
                        <Table.Row>
                          <Table.BadgeCell />
                          <Table.Cell as="th">{t("caseId")}</Table.Cell>
                          <Table.Cell as="th">{t("caseName")}</Table.Cell>
                          <Table.Cell as="th">{t("caseStatus")}</Table.Cell>
                          <Table.Cell as="th">
                            <Table.SortLabel>{t("dueDate")}</Table.SortLabel>
                          </Table.Cell>
                          <Table.Cell as="th">
                            <Table.SortLabel direction="desc">{t("updatedAt")}</Table.SortLabel>
                          </Table.Cell>
                          <Table.Cell as="th">{t("requester")}</Table.Cell>
                          <Table.Cell as="th">{t("requesterDepartment")}</Table.Cell>
                        </Table.Row>
                      </Table.Head>
                      <Table.Body>
                        {sampleCases.map((caseItem) => (
                          <Table.Row key={caseItem.id} style={{ cursor: "pointer" }} onClick={handleRowClick}>
                            <Table.BadgeCell />
                            <Table.Cell>{caseItem.id}</Table.Cell>
                            <Table.Cell maxWidth="medium">
                              <Tooltip title={caseItem.title} placement="top-start" onlyOnOverflow>
                                <Text>{caseItem.title}</Text>
                              </Tooltip>
                            </Table.Cell>
                            <Table.Cell>
                              <StatusLabel>{caseItem.status}</StatusLabel>
                            </Table.Cell>
                            <Table.Cell>
                              <Text variant="component.medium">{caseItem.dueDate}</Text>
                            </Table.Cell>
                            <Table.Cell>
                              <Text variant="component.medium">{caseItem.updatedAt}</Text>
                            </Table.Cell>
                            <Table.Cell>
                              <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                                <Avatar size="xSmall" name={caseItem.requester} />
                                <Text variant="component.medium">{caseItem.requester}</Text>
                              </div>
                            </Table.Cell>
                            <Table.Cell>
                              <Text variant="component.medium">{caseItem.department}</Text>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  </TableContainer>
                </Tab.Panel>
                <Tab.Panel>
                  <Text>{t("assigneeUnset")}</Text>
                </Tab.Panel>
                <Tab.Panel>
                  <Text>{t("inCharge")}</Text>
                </Tab.Panel>
                <Tab.Panel>
                  <Text>{t("unnamed")}</Text>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </PageLayoutBody>
        </PageLayoutContent>

        {/* Filter Drawer */}
        <Drawer open={filterOpen} onOpenChange={setFilterOpen} position="end" root={drawerRoot} lockScroll={false}>
          <Drawer.Header>
            <ContentHeader>
              <ContentHeader.Title>{t("filter")}</ContentHeader.Title>
            </ContentHeader>
          </Drawer.Header>
          <Drawer.Body>
            <Form>
              <FormControl>
                <FormControl.Label>{t("caseIdName")}</FormControl.Label>
                <FormControl.Toolbar ghost>
                  <Button size="xSmall" variant="gutterless">
                    {t("clear")}
                  </Button>
                </FormControl.Toolbar>
                <TextField placeholder={t("caseIdName")} />
              </FormControl>

              <FormControl>
                <FormControl.Label>{t("caseType")}</FormControl.Label>
                <FormControl.Toolbar ghost>
                  <Button size="xSmall" variant="gutterless">
                    {t("clear")}
                  </Button>
                </FormControl.Toolbar>
                <Select placeholder={t("caseType")} options={classificationOptions} />
              </FormControl>

              <FormControl>
                <FormControl.Label>{t("caseStatus")}</FormControl.Label>
                <FormControl.Toolbar ghost>
                  <Button size="xSmall" variant="gutterless">
                    {t("clear")}
                  </Button>
                </FormControl.Toolbar>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                  <TagPicker options={statusOptions} placeholder={t("caseStatus")} />
                  <Checkbox>{t("excludeClosed")}</Checkbox>
                </div>
              </FormControl>

              <Divider />

              <FormControl>
                <FormControl.Label>{t("mainAssignee")}</FormControl.Label>
                <FormControl.Toolbar ghost>
                  <Button size="xSmall" variant="gutterless">
                    {t("clear")}
                  </Button>
                </FormControl.Toolbar>
                <Select placeholder={t("mainAssignee")} options={assigneeOptions} />
              </FormControl>

              <FormControl>
                <FormControl.Label>{t("subAssignee")}</FormControl.Label>
                <FormControl.Toolbar ghost>
                  <Button size="xSmall" variant="gutterless">
                    {t("clear")}
                  </Button>
                </FormControl.Toolbar>
                <TagPicker options={assigneeOptions} placeholder={t("subAssignee")} />
              </FormControl>

              <Divider />

              <FormControl>
                <FormControl.Label>{t("requesterDepartment")}</FormControl.Label>
                <FormControl.Toolbar ghost>
                  <Button size="xSmall" variant="gutterless">
                    {t("clear")}
                  </Button>
                </FormControl.Toolbar>
                <Select placeholder={t("requesterDepartment")} options={departmentOptions} />
              </FormControl>

              <FormControl>
                <FormControl.Label>{t("requester")}</FormControl.Label>
                <FormControl.Toolbar ghost>
                  <Button size="xSmall" variant="gutterless">
                    {t("clear")}
                  </Button>
                </FormControl.Toolbar>
                <Select placeholder={t("requester")} options={assigneeOptions} />
              </FormControl>

              <Divider />

              <FormControl>
                <FormControl.Label>{t("dueDate")}</FormControl.Label>
                <FormControl.Toolbar ghost>
                  <Button size="xSmall" variant="gutterless">
                    {t("clear")}
                  </Button>
                </FormControl.Toolbar>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                  <RangeDateField />
                  <Checkbox>{t("relativeDate")}</Checkbox>
                </div>
              </FormControl>

              <FormControl>
                <FormControl.Label>{t("createdAt")}</FormControl.Label>
                <FormControl.Toolbar ghost>
                  <Button size="xSmall" variant="gutterless">
                    {t("clear")}
                  </Button>
                </FormControl.Toolbar>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                  <RangeDateField />
                  <Checkbox>{t("relativeDate")}</Checkbox>
                </div>
              </FormControl>

              <FormControl>
                <FormControl.Label>{t("updatedAt")}</FormControl.Label>
                <FormControl.Toolbar ghost>
                  <Button size="xSmall" variant="gutterless">
                    {t("clear")}
                  </Button>
                </FormControl.Toolbar>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                  <RangeDateField />
                  <Checkbox>{t("relativeDate")}</Checkbox>
                </div>
              </FormControl>
            </Form>
          </Drawer.Body>
          <Divider />
          <Drawer.Footer>
            <div style={{ marginLeft: "auto" }}>
              <Button variant="subtle" onClick={() => setFilterOpen(false)}>
                {t("resetFilter")}
              </Button>
            </div>
          </Drawer.Footer>
        </Drawer>
      </PageLayout>
    </LocSidebarLayout>
  );
};

export default CasePage;
