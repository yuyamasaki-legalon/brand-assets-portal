import {
  LfArrowUpRightFromSquare,
  LfEllipsisDot,
  LfMail,
  LfPen,
  LfPlusLarge,
  LfQuestionCircle,
  LfWarningTriangle,
} from "@legalforce/aegis-icons";
import {
  ActionList,
  Avatar,
  Banner,
  Button,
  ButtonGroup,
  Icon,
  IconButton,
  Link,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Popover,
  StatusLabel,
  Table,
  TableContainer,
  Tag,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { LocSidebarLayout } from "../../_shared";
import { Navigation, NavigationHeader } from "../_shared";

// サンプルデータ
type FormStatus = "published" | "unpublished" | "internalPublished";

type CaseReceptionForm = {
  id: string;
  name: string;
  status: FormStatus;
  contactTools: ("mail" | "teams")[];
  teamsIntegrated?: boolean;
  legalEscalationStatus: "enabled" | "disabled";
  updatedBy: {
    name: string;
    avatarUrl?: string;
  };
  updatedAt: string;
};

const sampleForms: CaseReceptionForm[] = [
  {
    id: "1",
    name: "問い合わせフォーム",
    status: "published",
    contactTools: ["mail"],
    legalEscalationStatus: "disabled",
    updatedBy: { name: "田中太郎" },
    updatedAt: "2024/12/20 10:30",
  },
  {
    id: "2",
    name: "契約相談フォーム",
    status: "internalPublished",
    contactTools: ["mail"],
    legalEscalationStatus: "enabled",
    updatedBy: { name: "鈴木花子" },
    updatedAt: "2024/12/19 15:45",
  },
  {
    id: "3",
    name: "法務相談フォーム",
    status: "published",
    contactTools: ["mail", "teams"],
    teamsIntegrated: false,
    legalEscalationStatus: "disabled",
    updatedBy: { name: "佐藤次郎" },
    updatedAt: "2024/12/18 09:00",
  },
  {
    id: "4",
    name: "NDA締結依頼フォーム",
    status: "internalPublished",
    contactTools: ["mail"],
    legalEscalationStatus: "enabled",
    updatedBy: { name: "山田一郎" },
    updatedAt: "2024/12/17 14:20",
  },
  {
    id: "5",
    name: "取引先審査依頼フォーム",
    status: "internalPublished",
    contactTools: ["mail"],
    legalEscalationStatus: "disabled",
    updatedBy: { name: "高橋美咲" },
    updatedAt: "2024/12/16 11:15",
  },
];

const MAX_FORM_COUNT = 100;

const statusConfig: Record<
  FormStatus,
  { variant: "fill" | "outline"; color: "yellow" | "blue" | "neutral"; label: string }
> = {
  published: { variant: "fill", color: "yellow", label: "公開中：誰でも投稿可能" },
  unpublished: { variant: "outline", color: "neutral", label: "非公開" },
  internalPublished: { variant: "fill", color: "blue", label: "公開中：マターマネジメントのユーザー" },
};

// 連絡方法タグ
const ContactTypeTags = ({
  contactTools,
  teamsIntegrated = true,
}: {
  contactTools: ("mail" | "teams")[];
  teamsIntegrated?: boolean;
}) => {
  return (
    <div style={{ display: "flex", gap: "var(--aegis-space-xxSmall)" }}>
      {contactTools.includes("mail") && (
        <Tag variant="outline" size="small" leading={LfMail}>
          メール
        </Tag>
      )}
      {contactTools.includes("teams") &&
        (teamsIntegrated ? (
          <Tag variant="outline" size="small">
            Microsoft Teams
          </Tag>
        ) : (
          <Popover trigger="hover" arrow placement="bottom">
            <Popover.Anchor>
              <Text as="span">
                <Tag variant="fill" color="red" size="small" leading={LfWarningTriangle}>
                  Microsoft Teams（未連携）
                </Tag>
              </Text>
            </Popover.Anchor>
            <Popover.Content width="medium">
              <Popover.Body>
                <Text>外部連携設定を行うまでは、Teamsを使った案件投稿および依頼者への連絡は行えません。</Text>
              </Popover.Body>
            </Popover.Content>
          </Popover>
        ))}
    </div>
  );
};

// AI自動チェックステータスラベル
const LegalEscalationStatusLabel = ({ status }: { status: "enabled" | "disabled" }) => {
  if (status === "enabled") {
    return (
      <StatusLabel variant="fill" color="teal" size="small">
        利用する
      </StatusLabel>
    );
  }
  return (
    <StatusLabel variant="outline" color="neutral" size="small">
      利用しない
    </StatusLabel>
  );
};

// フォーム行
const FormRow = ({ form }: { form: CaseReceptionForm }) => {
  const config = statusConfig[form.status];

  return (
    <Table.Row hover={false}>
      <Table.Cell width="auto" verticalAlign="middle" />
      <Table.Cell width="small" verticalAlign="middle">
        <Tooltip onlyOnOverflow title={form.name}>
          <Text numberOfLines={1} whiteSpace="normal">
            {form.name}
          </Text>
        </Tooltip>
      </Table.Cell>
      <Table.Cell width="auto" verticalAlign="middle">
        <StatusLabel size="small" variant={config.variant} color={config.color}>
          {config.label}
        </StatusLabel>
      </Table.Cell>
      <Table.Cell width="small" verticalAlign="middle">
        <ContactTypeTags contactTools={form.contactTools} teamsIntegrated={form.teamsIntegrated} />
      </Table.Cell>
      <Table.Cell width="auto" verticalAlign="middle">
        <LegalEscalationStatusLabel status={form.legalEscalationStatus} />
      </Table.Cell>
      <Table.Cell width="xxSmall" verticalAlign="middle">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
          <Avatar name={form.updatedBy.name} size="xSmall" src={form.updatedBy.avatarUrl} />
          <Tooltip onlyOnOverflow title={form.updatedBy.name}>
            <Text numberOfLines={1} whiteSpace="normal">
              {form.updatedBy.name}
            </Text>
          </Tooltip>
        </div>
      </Table.Cell>
      <Table.Cell width="auto" verticalAlign="middle">
        <Text>{form.updatedAt}</Text>
      </Table.Cell>
      <Table.ActionCell>
        <ButtonGroup>
          <Button
            as="a"
            href="/template/loc/application-console/case-reception-form/edit"
            leading={LfPen}
            size="small"
            variant="subtle"
          >
            編集
          </Button>
          <Menu placement="bottom-end">
            <Menu.Anchor>
              <Tooltip title="メニューを表示">
                <IconButton aria-label="メニューを表示" size="small" variant="subtle">
                  <Icon>
                    <LfEllipsisDot />
                  </Icon>
                </IconButton>
              </Tooltip>
            </Menu.Anchor>
            <Menu.Box width="auto">
              <ActionList size="large">
                <ActionList.Group>
                  <ActionList.Item>
                    <ActionList.Body>フォームのURLをコピー</ActionList.Body>
                  </ActionList.Item>
                  {(form.status === "unpublished" || form.status === "published") && (
                    <ActionList.Item>
                      <ActionList.Body>フォームのURLを再生成</ActionList.Body>
                    </ActionList.Item>
                  )}
                  {(form.status === "published" || form.status === "internalPublished") && (
                    <ActionList.Item>
                      <ActionList.Body>非公開にする</ActionList.Body>
                    </ActionList.Item>
                  )}
                  <ActionList.Item>
                    <ActionList.Body>複製</ActionList.Body>
                  </ActionList.Item>
                </ActionList.Group>
                <ActionList.Group>
                  <ActionList.Item color="danger">
                    <ActionList.Body>削除</ActionList.Body>
                  </ActionList.Item>
                </ActionList.Group>
              </ActionList>
            </Menu.Box>
          </Menu>
        </ButtonGroup>
      </Table.ActionCell>
    </Table.Row>
  );
};

const CaseReceptionFormTemplate = () => {
  const canAddForm = sampleForms.length < MAX_FORM_COUNT;

  return (
    <LocSidebarLayout activeId="cases">
      <PageLayout>
        <PageLayoutPane>
          <PageLayoutHeader>
            <NavigationHeader />
          </PageLayoutHeader>
          <PageLayoutBody>
            <Navigation currentPage="case-reception-form" />
          </PageLayoutBody>
        </PageLayoutPane>
        <PageLayoutContent align="start">
          <PageLayoutHeader>
            <Text as="h1" variant="title.large">
              案件受付フォーム
            </Text>
          </PageLayoutHeader>
          <PageLayoutBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxLarge)" }}>
              {/* リードセクション */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-large)",
                  maxWidth: "var(--aegis-layout-width-medium)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-xSmall)",
                  }}
                >
                  <Text variant="body.medium">
                    案件受付フォームを、{MAX_FORM_COUNT}個まで作成できます。
                    <br />
                    フォームの各項目は、LegalOn上の案件が持つ情報と連携しています。
                  </Text>
                  <div>
                    <Link href="#" leading={LfQuestionCircle} trailing={LfArrowUpRightFromSquare} target="_blank">
                      案件受付フォームの作成
                    </Link>
                  </div>
                </div>
                <Banner color="warning" size="medium" closeButton={false}>
                  <Text variant="body.medium">
                    「公開中：誰でも投稿可能」のフォームを利用するには、次のいずれかの設定が必要です。
                    <ul style={{ margin: "var(--aegis-space-xSmall) 0 0 var(--aegis-space-medium)", padding: 0 }}>
                      <li>
                        <Link href="#">IPアドレス制限の設定</Link>
                        ：フォームへのアクセスを制限
                      </li>
                      <li>
                        <Link href="#" trailing={LfArrowUpRightFromSquare} target="_blank">
                          Googleとの通信の許可
                        </Link>
                        ：reCAPTCHAによる保護を有効化
                      </li>
                    </ul>
                  </Text>
                </Banner>
              </div>

              {/* フォーム一覧 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-large)",
                }}
              >
                <Button leading={LfPlusLarge} disabled={!canAddForm}>
                  フォームを追加
                </Button>
                <TableContainer>
                  <Table>
                    <Table.Head>
                      <Table.Row>
                        <Table.BadgeCell />
                        <Table.Cell>フォーム名</Table.Cell>
                        <Table.Cell>公開範囲</Table.Cell>
                        <Table.Cell>依頼者との連絡方法</Table.Cell>
                        <Table.Cell>AI自動チェック</Table.Cell>
                        <Table.Cell>最終更新者</Table.Cell>
                        <Table.Cell>最終更新日時</Table.Cell>
                        <Table.ActionCell />
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {sampleForms.map((form) => (
                        <FormRow key={form.id} form={form} />
                      ))}
                    </Table.Body>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
};

export default CaseReceptionFormTemplate;
