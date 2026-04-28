import {
  LfAngleLeftLarge,
  LfArrowUpRightFromSquare,
  LfCloseLarge,
  LfEllipsisDot,
  LfGripDotVertical,
  LfMail,
  LfPen,
  LfPlusLarge,
  LfQuestionCircle,
  LfTrash,
} from "@legalforce/aegis-icons";
import {
  ActionList,
  Banner,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxCard,
  CheckboxGroup,
  ContentHeader,
  DatePicker,
  FileDrop,
  FormControl,
  Header,
  Icon,
  IconButton,
  Link,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  PageLayoutStickyContainer,
  Popover,
  Select,
  StatusLabel,
  Tab,
  Tag,
  Text,
  Textarea,
  TextField,
  Tooltip,
} from "@legalforce/aegis-react";
import { useState } from "react";

const FORM_NAME = "契約相談受付フォーム";

// モックデータ: フォーム入力項目
type InputAttribute = {
  id: string;
  label: string;
  required: boolean;
  type: "text" | "textarea" | "file" | "date";
  description?: string;
  inputFormatLabel?: string;
};

const contactInputAttributes: InputAttribute[] = [
  { id: "name", label: "名前", required: true, type: "text", inputFormatLabel: "テキスト（改行なし）" },
  { id: "email", label: "メールアドレス", required: true, type: "text", inputFormatLabel: "メールアドレス" },
  {
    id: "ccEmail",
    label: "共有先のメールアドレス",
    required: false,
    type: "text",
    description: "案件の詳細画面からメールを返信するときの「Cc」に指定されます。",
    inputFormatLabel: "メールアドレス（複数入力可能）",
  },
];

const customInputAttributes: InputAttribute[] = [
  { id: "caseTitle", label: "案件名", required: true, type: "text", inputFormatLabel: "テキスト（改行なし）" },
  {
    id: "requestContent",
    label: "依頼内容",
    required: false,
    type: "textarea",
    inputFormatLabel: "テキスト（改行あり）",
  },
  { id: "file", label: "ファイル", required: false, type: "file", inputFormatLabel: "ファイルアップロード" },
  { id: "deadline", label: "納期", required: false, type: "date", inputFormatLabel: "日付" },
];

const allAttributes = [...contactInputAttributes, ...customInputAttributes];

// モックデータ: 右ペインの追加可能な項目
type RightPaneItem = {
  id: string;
  label: string;
  status: "used" | "available" | "preset";
  description?: string;
};

const rightPaneInputItems: RightPaneItem[] = [
  { id: "ccEmail", label: "共有先のメールアドレス", status: "used" },
  { id: "freeInput", label: "自由入力（複数登録可）", status: "available" },
  {
    id: "aiCheck",
    label: "契約書のAI自動チェック",
    status: "available",
    description: "審査対象の契約書を1件アップロード可能",
  },
  { id: "fileUpload", label: "ファイルアップロード", status: "used" },
];

const rightPanePresetItems: RightPaneItem[] = [
  { id: "department", label: "依頼部署", status: "available" },
  { id: "deadline", label: "納期", status: "used" },
  { id: "mainAssignee", label: "案件担当者", status: "preset" },
  { id: "subAssignee", label: "副担当者", status: "available" },
  { id: "space", label: "案件の保存先", status: "preset" },
];

const rightPaneCustomItems: RightPaneItem[] = [
  { id: "urgency", label: "緊急度", status: "available" },
  { id: "counterparty", label: "取引先名", status: "available" },
  { id: "amount", label: "支払金額", status: "available" },
  { id: "company", label: "関連会社", status: "available" },
];

// ヘッダー
const EditHeader = () => {
  return (
    <Header>
      <Header.Item>
        <a href="/template/loc/application-console/case-reception-form">
          <Tooltip title="案件受付フォームの一覧に戻る">
            <IconButton aria-label="案件受付フォームの一覧に戻る">
              <Icon>
                <LfAngleLeftLarge />
              </Icon>
            </IconButton>
          </Tooltip>
        </a>
      </Header.Item>
      <Header.Item>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}>
          <Header.Title>
            <Tooltip onlyOnOverflow title={FORM_NAME}>
              <Text variant="title.xxSmall" numberOfLines={1}>
                {FORM_NAME}
              </Text>
            </Tooltip>
          </Header.Title>
          <StatusLabel size="small" variant="fill" color="blue">
            公開中：マターマネジメントのユーザー
          </StatusLabel>
        </div>
      </Header.Item>
      <Header.Spacer />
      <Header.Item>
        <ButtonGroup>
          <Button variant="subtle">非公開で保存</Button>
          <Button variant="solid">変更内容を公開</Button>
          <Menu placement="bottom-end">
            <Menu.Anchor>
              <Tooltip title="メニューを表示">
                <IconButton aria-label="メニューを表示" variant="plain">
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
                    <ActionList.Body>公開リンクをコピー</ActionList.Body>
                  </ActionList.Item>
                </ActionList.Group>
                <ActionList.Item color="danger">
                  <ActionList.Body>削除</ActionList.Body>
                </ActionList.Item>
              </ActionList>
            </Menu.Box>
          </Menu>
        </ButtonGroup>
      </Header.Item>
    </Header>
  );
};

// 連絡方法セクション（フォーム画面タブ）
const ContactMethodSection = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
      <Text as="h2" variant="title.xSmall">
        依頼者との連絡方法
      </Text>
      <Tag size="small" variant="outline" leading={LfMail}>
        メール
      </Tag>
    </div>
  );
};

// 入力項目プレビュー行
const InputAttributeRow = ({
  attribute,
  draggable = false,
  isEditing = false,
  onClickEdit,
}: {
  attribute: InputAttribute;
  draggable?: boolean;
  isEditing?: boolean;
  onClickEdit?: (id: string) => void;
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--aegis-space-xSmall)",
        padding: "var(--aegis-space-medium) var(--aegis-space-xSmall)",
        borderRadius: "var(--aegis-radius-medium)",
        backgroundColor: isEditing ? "var(--aegis-color-background-neutral-subtlest-opaque-pressed)" : undefined,
      }}
    >
      {draggable && (
        <div style={{ paddingTop: "var(--aegis-space-xxSmall)", cursor: "grab" }}>
          <Icon size="small" color="subtle">
            <LfGripDotVertical />
          </Icon>
        </div>
      )}
      <div style={{ flex: 1 }}>
        <FormControl required={attribute.required}>
          <FormControl.Label style={{ paddingInlineEnd: "var(--aegis-size-x4Large)" }}>
            {attribute.label}
          </FormControl.Label>
          <div style={{ display: "flex", gap: "var(--aegis-space-medium)" }}>
            <div style={{ flexGrow: 1, pointerEvents: "none" }}>
              {attribute.type === "textarea" && <Textarea placeholder="これはプレビューです" readOnly tabIndex={-1} />}
              {attribute.type === "file" && (
                <FileDrop sub="最大10件までアップロードできます。" uploadButtonTitle="アップロード" />
              )}
              {attribute.type === "date" && <DatePicker />}
              {attribute.type === "text" && <TextField placeholder="これはプレビューです" readOnly tabIndex={-1} />}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Tooltip title={`${attribute.label}を編集`}>
                <IconButton
                  aria-label={`${attribute.label}を編集`}
                  aria-pressed={isEditing}
                  variant="subtle"
                  onClick={() => onClickEdit?.(attribute.id)}
                >
                  <Icon>
                    <LfPen />
                  </Icon>
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </FormControl>
      </div>
    </div>
  );
};

// フォーム画面タブ
const InputAttributeForm = ({
  editingId,
  onClickEdit,
}: {
  editingId: string | null;
  onClickEdit: (id: string) => void;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
      <Card variant="plain">
        <CardBody>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "var(--aegis-space-medium) var(--aegis-space-xSmall)",
            }}
          >
            <Text variant="title.medium">{FORM_NAME}</Text>
            <Tooltip title="フォーム名と説明を編集">
              <IconButton aria-label="フォーム名と説明を編集" icon={LfPen} size="small" variant="subtle" />
            </Tooltip>
          </div>
        </CardBody>
      </Card>

      <Card variant="plain">
        <CardBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
            <ContactMethodSection />
            {contactInputAttributes.map((attr) => (
              <InputAttributeRow
                key={attr.id}
                attribute={attr}
                isEditing={editingId === attr.id}
                onClickEdit={onClickEdit}
              />
            ))}
          </div>
        </CardBody>
      </Card>

      <Card variant="plain">
        <CardBody>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {customInputAttributes.map((attr) => (
              <InputAttributeRow
                key={attr.id}
                attribute={attr}
                draggable
                isEditing={editingId === attr.id}
                onClickEdit={onClickEdit}
              />
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

// 設定タブ
const PresetAttributeForm = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
      <Card variant="plain">
        <CardBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
            <ContentHeader size="medium">
              <ContentHeader.Title>完了画面の編集</ContentHeader.Title>
            </ContentHeader>
            <Text variant="body.medium">
              フォームを送信した後に表示される画面に、カスタマイズしたテキストを表示できます。
            </Text>
          </div>
          <div style={{ marginTop: "var(--aegis-space-medium)" }}>
            <FormControl>
              <FormControl.Label>完了メッセージ</FormControl.Label>
              <Textarea placeholder="完了メッセージを入力" />
            </FormControl>
          </div>
        </CardBody>
      </Card>

      <Card variant="plain">
        <CardBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
            <ContentHeader size="medium">
              <ContentHeader.Title>案件作成時に自動で登録される情報</ContentHeader.Title>
            </ContentHeader>
            <Text variant="body.medium">
              これらの設定は非公開です。フォーム画面などの公開する画面からは見えません。
            </Text>
          </div>
          <div
            style={{
              marginTop: "var(--aegis-space-medium)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-large)",
            }}
          >
            <FormControl>
              <FormControl.Label>案件分類</FormControl.Label>
              <Select
                options={[
                  { value: "contract", label: "契約審査" },
                  { value: "consultation", label: "法務相談" },
                ]}
                placeholder="選択してください"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>案件担当者</FormControl.Label>
              <Select
                options={[
                  { value: "1", label: "サンプル担当者A" },
                  { value: "2", label: "サンプル担当者B" },
                ]}
                placeholder="選択してください"
              />
            </FormControl>
            <Button leading={LfPlusLarge} variant="subtle" size="large" width="full">
              項目を追加
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

// 右ペイン: 追加可能な項目
const AddableAttributeItem = ({ item }: { item: RightPaneItem }) => {
  return (
    <Card size="small" variant="outline">
      <CardHeader
        trailing={
          <Tooltip title={`${item.label}を追加`}>
            <IconButton aria-label={`${item.label}を追加`} size="small" variant="subtle">
              <Icon>
                <LfPlusLarge />
              </Icon>
            </IconButton>
          </Tooltip>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-x3Small)" }}>
          <Text variant="body.medium.bold">{item.label}</Text>
          {item.description && (
            <Text variant="body.small" color="subtle">
              {item.description}
            </Text>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

// 右ペイン: 使用中の項目
const DeletableAttributeItem = ({ item }: { item: RightPaneItem }) => {
  return (
    <Card size="small" variant="fill">
      <CardHeader
        trailing={
          <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)", alignItems: "center" }}>
            <Text variant="body.small" color="subtle" whiteSpace="nowrap">
              使用中
            </Text>
            <Tooltip title={`${item.label}を削除`}>
              <IconButton aria-label={`${item.label}を削除`} size="small" variant="subtle" color="danger">
                <Icon>
                  <LfTrash />
                </Icon>
              </IconButton>
            </Tooltip>
          </div>
        }
      >
        <Text variant="body.medium.bold">{item.label}</Text>
      </CardHeader>
    </Card>
  );
};

// 右ペイン: 設定で使用中の項目
const UnavailableAttributeItem = ({ item }: { item: RightPaneItem }) => {
  return (
    <Card size="small" variant="fill">
      <CardHeader
        trailing={
          <Text variant="body.small" color="subtle" whiteSpace="nowrap">
            設定で使用中
          </Text>
        }
      >
        <Text variant="body.medium.bold" color="disabled">
          {item.label}
        </Text>
      </CardHeader>
    </Card>
  );
};

// 右ペイン項目のルーティング
const RightPaneListItem = ({ item }: { item: RightPaneItem }) => {
  if (item.status === "used") return <DeletableAttributeItem item={item} />;
  if (item.status === "preset") return <UnavailableAttributeItem item={item} />;
  return <AddableAttributeItem item={item} />;
};

// 右ペイン: 項目の編集フォーム
const EditInputForm = ({ attribute, onClose }: { attribute: InputAttribute; onClose: () => void }) => {
  return (
    <>
      <PageLayoutHeader>
        <ContentHeader
          size="medium"
          trailing={
            <Tooltip title="閉じる">
              <IconButton aria-label="閉じる" variant="plain" onClick={onClose}>
                <Icon>
                  <LfCloseLarge />
                </Icon>
              </IconButton>
            </Tooltip>
          }
        >
          <ContentHeader.Title>項目の編集</ContentHeader.Title>
        </ContentHeader>
      </PageLayoutHeader>
      <PageLayoutBody>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xLarge)" }}>
          {/* 説明文 */}
          {attribute.description && <Text variant="body.medium">{attribute.description}</Text>}

          {/* フォームフィールド */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
            {/* 項目名 */}
            <FormControl required>
              <FormControl.Label>項目名</FormControl.Label>
              <TextField defaultValue={attribute.label} placeholder="項目名を入力" />
            </FormControl>

            {/* 項目の説明 */}
            <FormControl>
              <FormControl.Label>項目の説明</FormControl.Label>
              <Textarea placeholder="項目の説明を入力" />
              <FormControl.Caption>
                <Text variant="body.small" color="subtle">
                  項目の説明は、このテキストのようにして項目の下に表示されます。
                </Text>
              </FormControl.Caption>
            </FormControl>

            {/* 入力必須 */}
            <FormControl>
              <FormControl.Label>入力必須</FormControl.Label>
              <Checkbox defaultChecked={attribute.required}>入力を必須にする</Checkbox>
            </FormControl>

            {/* 項目の入力形式 */}
            <FormControl>
              <FormControl.Label>項目の入力形式</FormControl.Label>
              <Text variant="body.medium">{attribute.inputFormatLabel}</Text>
            </FormControl>
          </div>

          {/* 削除ボタン */}
          <div style={{ marginLeft: "auto" }}>
            <Button variant="subtle" leading={LfTrash} color="danger">
              削除
            </Button>
          </div>
        </div>
      </PageLayoutBody>
    </>
  );
};

// 右ペイン: フォームの項目一覧（デフォルト）
const AddInputPane = ({ onClose }: { onClose: () => void }) => {
  const [contactMethods, setContactMethods] = useState(["mail", "teams"]);
  const teamsSelected = contactMethods.includes("teams");

  return (
    <>
      <PageLayoutHeader>
        <ContentHeader
          size="medium"
          trailing={
            <Tooltip title="閉じる">
              <IconButton aria-label="閉じる" icon={LfCloseLarge} size="small" variant="plain" onClick={onClose} />
            </Tooltip>
          }
        >
          <ContentHeader.Title>フォームの項目</ContentHeader.Title>
        </ContentHeader>
      </PageLayoutHeader>
      <PageLayoutBody>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
          {/* 連絡方法の設定 */}
          <FormControl>
            <FormControl.Label>
              <Text variant="title.xSmall">フォーム回答後の依頼者の連絡方法</Text>
            </FormControl.Label>
            <CheckboxGroup value={contactMethods} onChange={setContactMethods}>
              <CheckboxCard value="mail" variant="outline">
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-x3Small)" }}>
                  <Text variant="body.medium">メール</Text>
                  <Text variant="body.small" color="subtle">
                    依頼者のメールアドレス宛に通知が届き、以降依頼者はメールの返信でやり取りします。
                  </Text>
                </div>
              </CheckboxCard>
              <CheckboxCard value="teams" variant="outline">
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "var(--aegis-space-small)",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-x3Small)" }}>
                    <Text variant="body.medium">Microsoft Teams</Text>
                    <Text variant="body.small" color="subtle">
                      依頼者のMicrosoft Teams宛に通知が届き、以降依頼者はTeams上の返信でやり取りします。
                    </Text>
                  </div>
                  <Popover trigger="hover" arrow placement="top">
                    <Popover.Anchor>
                      <IconButton aria-label="Microsoft Teamsからの案件投稿・連絡方法の説明を表示" variant="plain">
                        <Icon>
                          <LfQuestionCircle />
                        </Icon>
                      </IconButton>
                    </Popover.Anchor>
                    <Popover.Content width="medium">
                      <Popover.Body>
                        <Text whiteSpace="pre-wrap">
                          Microsoft Teams側からの設定、投稿の方法は、以下のヘルプを参照ください。
                        </Text>
                        <div style={{ marginBlockStart: "var(--aegis-space-small)" }}>
                          <Link href="#" leading={LfQuestionCircle} trailing={LfArrowUpRightFromSquare}>
                            Teamsからの案件投稿
                          </Link>
                        </div>
                      </Popover.Body>
                    </Popover.Content>
                  </Popover>
                </div>
              </CheckboxCard>
            </CheckboxGroup>
          </FormControl>
          {teamsSelected && (
            <Banner color="warning" size="small" closeButton={false}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <Text>外部連携設定を行うまでは、Teamsを使った案件投稿および依頼者への連絡は行えません。</Text>
                <div>
                  <Link href="#" leading={LfQuestionCircle} trailing={LfArrowUpRightFromSquare}>
                    Microsoft Teamsの連携方法
                  </Link>
                </div>
              </div>
            </Banner>
          )}

          {/* 入力項目 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
            <Text variant="body.medium.bold">入力項目</Text>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
              {rightPaneInputItems.map((item) => (
                <RightPaneListItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* プリセット項目 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
            {rightPanePresetItems.map((item) => (
              <RightPaneListItem key={item.id} item={item} />
            ))}
          </div>

          {/* カスタム項目 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
            {rightPaneCustomItems.map((item) => (
              <RightPaneListItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </PageLayoutBody>
    </>
  );
};

// 右ペイン
const RightPane = ({ editingId, onClose }: { editingId: string | null; onClose: () => void }) => {
  const editingAttribute = editingId ? allAttributes.find((a) => a.id === editingId) : null;

  return (
    <PageLayoutPane position="end" width="large" resizable open>
      {editingAttribute ? (
        <EditInputForm attribute={editingAttribute} onClose={onClose} />
      ) : (
        <AddInputPane onClose={onClose} />
      )}
    </PageLayoutPane>
  );
};

export const CaseReceptionFormEditTemplate = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleClickEdit = (id: string) => {
    setEditingId(id === editingId ? null : id);
  };

  const handleClosePane = () => {
    setEditingId(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <EditHeader />
      <PageLayout>
        <PageLayoutContent variant="fill">
          <PageLayoutBody>
            <div
              style={{
                width: "100%",
                maxWidth: "var(--aegis-layout-width-small)",
                marginInline: "auto",
              }}
            >
              <Tab.Group variant="plain" index={activeTab} onChange={setActiveTab}>
                <PageLayoutStickyContainer>
                  <Tab.List>
                    <Tab>フォーム画面</Tab>
                    <Tab>設定</Tab>
                  </Tab.List>
                </PageLayoutStickyContainer>
                <Tab.Panels>
                  <Tab.Panel>
                    <InputAttributeForm editingId={editingId} onClickEdit={handleClickEdit} />
                  </Tab.Panel>
                  <Tab.Panel>
                    <PresetAttributeForm />
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
        <RightPane editingId={editingId} onClose={handleClosePane} />
      </PageLayout>
    </div>
  );
};

export default CaseReceptionFormEditTemplate;
