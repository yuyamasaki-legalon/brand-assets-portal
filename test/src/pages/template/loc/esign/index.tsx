import {
  LfAngleLeftLarge,
  LfArrowDownLong,
  LfCalendar,
  LfCloseLarge,
  LfCloseSmall,
  LfMagnifyingGlassMinus,
  LfMagnifyingGlassPlus,
  LfPen,
  LfPlusLarge,
  LfSquareCheck,
  LfStamp,
  LfText,
  LfTrash,
  LfUpload,
  LfUserPlus,
  LfWarningRhombus,
  LfWarningTriangle,
} from "@legalforce/aegis-icons";
import {
  Accordion,
  ActionList,
  Badge,
  Button,
  ButtonGroup,
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
  Dialog,
  Divider,
  EmptyState,
  FormControl,
  Header,
  Icon,
  IconButton,
  InformationCard,
  InformationCardDescription,
  InformationCardGroup,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  PageLayoutStickyContainer,
  Popover,
  Radio,
  RadioGroup,
  Select,
  StatusLabel,
  Stepper,
  Tag,
  Text,
  Textarea,
  TextField,
  Toolbar,
  Tooltip,
} from "@legalforce/aegis-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type Recipient = {
  id: string;
  name: string;
  email: string;
  company: string;
  companyName: string;
  departmentName: string;
  role: "signer" | "viewer";
  companyType: "own" | "other";
  emailSubject: string;
  emailBody: string;
};

type RecipientGroup = {
  id: string;
  recipients: Recipient[];
};

type SignSubject = {
  id: string;
  type: "signatureBox" | "textBox" | "dateBox" | "checkBox";
  label: string;
  assignee: string;
  x: number;
  y: number;
  color: string;
};

type EnvelopeFile = {
  id: string;
  name: string;
  type: "contractDocument" | "otherFile";
  status?: { label: string; color: "yellow" | "neutral"; variant: "fill" | "outline" };
  signSubjects: SignSubject[];
};

type ScaleOption = 0.25 | 0.5 | 0.75 | 1 | 1.5 | 2;

const initialFiles: EnvelopeFile[] = [
  {
    id: "contract-main",
    name: "業務委託契約書_v3.pdf",
    type: "contractDocument",
    status: { label: "自社ドラフト", color: "yellow", variant: "fill" },
    signSubjects: [
      {
        id: "sig-1",
        type: "signatureBox",
        label: "署名（山田 太郎）",
        assignee: "山田 太郎",
        x: 32,
        y: 96,
        color: "#E0ECFF",
      },
      {
        id: "txt-1",
        type: "textBox",
        label: "氏名（山田 太郎）",
        assignee: "山田 太郎",
        x: 32,
        y: 176,
        color: "#E8F7EF",
      },
      {
        id: "date-1",
        type: "dateBox",
        label: "日付（自動入力）",
        assignee: "自社 法務",
        x: 32,
        y: 256,
        color: "#FFF4E5",
      },
    ],
  },
  {
    id: "attachment-1",
    name: "合意事項一覧_参考資料.xlsx",
    type: "otherFile",
    signSubjects: [],
  },
];

const initialRecipientGroups: RecipientGroup[] = [
  {
    id: "group-1",
    recipients: [
      {
        id: "recipient-1",
        name: "山田 太郎",
        email: "taro.yamada@example.com",
        company: "自社 / 法務部",
        companyName: "LegalOn Technologies株式会社",
        departmentName: "法務部",
        role: "signer",
        companyType: "own",
        emailSubject: "［demo］業務委託契約（成果物あり、（個別契約））20220713（1）.docx",
        emailBody: "",
      },
      {
        id: "recipient-2",
        name: "佐藤 花子",
        email: "hanako.sato@example.com",
        company: "取引先 / 経営企画部",
        companyName: "株式会社フラワー",
        departmentName: "経営企画部",
        role: "viewer",
        companyType: "other",
        emailSubject: "［demo］業務委託契約（成果物あり、（個別契約））20220713（1）.docx",
        emailBody: "",
      },
    ],
  },
  {
    id: "group-2",
    recipients: [
      {
        id: "recipient-3",
        name: "加藤 次郎",
        email: "jiro.kato@example.com",
        company: "取引先 / 管理部",
        companyName: "株式会社サンプル",
        departmentName: "管理部",
        role: "signer",
        companyType: "other",
        emailSubject: "［demo］業務委託契約（成果物あり、（個別契約））20220713（1）.docx",
        emailBody: "",
      },
    ],
  },
];

const signatureColors: Record<SignSubject["type"], string> = {
  signatureBox: "#E0ECFF",
  textBox: "#E8F7EF",
  dateBox: "#FFF4E5",
  checkBox: "#F2F4F7",
};

const pageLayoutWrapperStyle = {
  paddingTop: "var(--aegis-space-medium)",
} as const;

const formContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--aegis-space-large)",
} as const;

const bodyContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--aegis-space-large)",
} as const;

const nextButtonWrapperStyle = { display: "flex", alignSelf: "flex-end" } as const;
const fileListWrapperStyle = { display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" } as const;
const emptyStateWrapperStyle = {
  border: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
} as const;
const recipientsBlockHeaderStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--aegis-space-xSmall)",
  padding: "var(--aegis-space-small)",
  backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
} as const;
const recipientItemStyle = {
  display: "flex",
  columnGap: "var(--aegis-space-xSmall)",
  alignItems: "center",
  minHeight: "var(--aegis-size-x8Large)",
  padding: "var(--aegis-space-xSmall)",
} as const;
const recipientInfoStyle = { display: "flex", flex: 1, flexDirection: "column", width: 0 } as const;
const recipientTailStyle = { display: "flex", gap: "var(--aegis-space-small)", alignItems: "center" } as const;
const listStyle = { paddingLeft: "var(--aegis-space-medium)" } as const;

const scaleSequence: ScaleOption[] = [0.25, 0.5, 0.75, 1, 1.5, 2];

const toolbarScaleOptions: { label: string; value: ScaleOption }[] = [
  { label: "25%", value: 0.25 },
  { label: "50%", value: 0.5 },
  { label: "75%", value: 0.75 },
  { label: "100%", value: 1 },
  { label: "150%", value: 1.5 },
  { label: "200%", value: 2 },
];

const basePageWidth = 720;
const basePageHeight = 960;

const spaceOptions = [
  { label: "契約書 / 契約管理 / LegalOn", value: "legalon-shared" },
  { label: "取引先 / 株式会社シロクマ商事", value: "client-sirokuma" },
  { label: "個人の保存先", value: "personal" },
];

const buildCompanyDisplay = (companyType: Recipient["companyType"], companyName?: string, departmentName?: string) => {
  const base = companyType === "own" ? "自社" : "取引先";
  const department = departmentName?.trim();
  const company = companyName?.trim();
  if (department) {
    return `${base} / ${department}`;
  }
  if (company) {
    return `${base} / ${company}`;
  }
  return base;
};

const ESignTemplate = () => {
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<EnvelopeFile[]>(initialFiles);
  const [recipientGroups, setRecipientGroups] = useState<RecipientGroup[]>(initialRecipientGroups);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [envelopeTitle, setEnvelopeTitle] = useState("業務委託契約書の締結依頼");
  const [notes, setNotes] = useState("取引先と合意した内容を反映済み。送信前に最終チェックしてください。");
  const [space, setSpace] = useState(spaceOptions[0].value);
  const [scale, setScale] = useState<ScaleOption>(1);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<{ groupId: string; recipientId: string } | null>(null);

  const currentFile = files[selectedFileIndex];

  const isBasicInfoValid =
    files.some((file) => file.type === "contractDocument") && envelopeTitle.trim().length > 0 && space.length > 0;
  const isRecipientsValid = recipientGroups.every((group) =>
    group.recipients.some((recipient) => recipient.role === "signer"),
  );
  const isSignSubjectsValid = files.some((file) => file.type === "contractDocument" && file.signSubjects.length > 0);
  const isConfirmationValid = isBasicInfoValid && isRecipientsValid && isSignSubjectsValid;

  const stepValidityStatus = useMemo(
    () => ({
      firstStep: isBasicInfoValid,
      secondStep: isRecipientsValid,
      thirdStep: isSignSubjectsValid,
      fourthStep: isConfirmationValid,
    }),
    [isBasicInfoValid, isConfirmationValid, isRecipientsValid, isSignSubjectsValid],
  );

  const availableNextStep = useCallback(
    (targetStep: number): boolean => {
      switch (targetStep) {
        case 0:
          return stepValidityStatus.firstStep;
        case 1:
          return availableNextStep(0) && stepValidityStatus.secondStep;
        case 2:
          return availableNextStep(1) && stepValidityStatus.thirdStep;
        case 3:
          return availableNextStep(2) && stepValidityStatus.fourthStep;
        default:
          return false;
      }
    },
    [stepValidityStatus],
  );

  const handleNextStep = () => {
    if (step < 3) {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleStepChange = (index: number) => {
    const canMove =
      index === 0 ||
      (index === 1 && availableNextStep(0)) ||
      (index === 2 && availableNextStep(1)) ||
      (index === 3 && availableNextStep(2));
    if (canMove) {
      setStep(index);
    }
  };

  const handleAddFile = () => {
    setFiles((prev) => {
      const next: EnvelopeFile = {
        id: `new-file-${prev.length + 1}`,
        name: `添付ファイル_${prev.length + 1}.pdf`,
        type: "contractDocument",
        status: { label: "下書き", color: "neutral", variant: "outline" },
        signSubjects: [],
      };
      setSelectedFileIndex(prev.length);
      return [...prev, next];
    });
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => {
      const next = prev.filter((file) => file.id !== id);
      if (next.length === 0) return prev;
      if (selectedFileIndex >= next.length) {
        setSelectedFileIndex(next.length - 1);
      }
      return next;
    });
  };

  const handleAddRecipientGroup = () => {
    setRecipientGroups((prev) => [
      ...prev,
      {
        id: `group-${prev.length + 1}`,
        recipients: [
          {
            id: `recipient-${prev.reduce((count, group) => count + group.recipients.length, 0) + 1}`,
            name: "新しい受信者",
            email: "new.recipient@example.com",
            company: "取引先 / 未設定",
            companyName: "新規の取引先",
            departmentName: "",
            role: "signer",
            companyType: "other",
            emailSubject: envelopeTitle,
            emailBody: "",
          },
        ],
      },
    ]);
  };

  const handleAddRecipient = (groupId: string) => {
    setRecipientGroups((prev) => {
      const nextIndex = prev.reduce((count, group) => count + group.recipients.length, 0) + 1;
      return prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              recipients: [
                ...group.recipients,
                {
                  id: `recipient-${nextIndex}`,
                  name: "新しい受信者",
                  email: "new.recipient@example.com",
                  company: "取引先 / 未設定",
                  companyName: "新規の取引先",
                  departmentName: "",
                  role: "signer",
                  companyType: "other",
                  emailSubject: envelopeTitle,
                  emailBody: "",
                },
              ],
            }
          : group,
      );
    });
  };

  const handleRemoveRecipientGroup = (groupId: string) => {
    setRecipientGroups((prev) => prev.filter((group) => group.id !== groupId));
    if (editingRecipient?.groupId === groupId) {
      setEditingRecipient(null);
    }
  };

  const handleRemoveRecipient = (groupId: string, recipientId: string) => {
    setRecipientGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? { ...group, recipients: group.recipients.filter((recipient) => recipient.id !== recipientId) }
          : group,
      ),
    );
    if (editingRecipient?.recipientId === recipientId) {
      setEditingRecipient(null);
    }
  };

  const handleAddSignSubject = (type: SignSubject["type"]) => {
    setFiles((prev) =>
      prev.map((file, index) => {
        if (index !== selectedFileIndex) return file;
        const nextIndex = file.signSubjects.length;
        const nextY = 96 + nextIndex * 88;
        const labelMap: Record<SignSubject["type"], string> = {
          signatureBox: "署名",
          textBox: "テキスト",
          dateBox: "日付",
          checkBox: "チェックボックス",
        };
        return {
          ...file,
          signSubjects: [
            ...file.signSubjects,
            {
              id: `${file.id}-sign-subject-${nextIndex + 1}`,
              type,
              label: `${labelMap[type]}（${file.type === "contractDocument" ? "自社 法務" : "参考"}）`,
              assignee: "自社 法務",
              x: 32,
              y: nextY,
              color: signatureColors[type],
            },
          ],
        };
      }),
    );
  };

  const handleRemoveSignSubject = (fileId: string, subjectId: string) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? { ...file, signSubjects: file.signSubjects.filter((subject) => subject.id !== subjectId) }
          : file,
      ),
    );
  };

  const handleOpenRecipientEditor = (groupId: string, recipientId: string) => {
    setEditingRecipient({ groupId, recipientId });
  };

  const handleCloseRecipientEditor = () => {
    setEditingRecipient(null);
  };

  const handleUpdateRecipient = (groupId: string, recipientId: string, updated: Partial<Recipient>) => {
    setRecipientGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              recipients: group.recipients.map((recipient) => {
                if (recipient.id !== recipientId) return recipient;
                const next = { ...recipient, ...updated };
                const companyDisplay = buildCompanyDisplay(
                  updated.companyType ?? recipient.companyType,
                  updated.companyName ?? recipient.companyName,
                  updated.departmentName ?? recipient.departmentName,
                );
                return { ...next, company: companyDisplay };
              }),
            }
          : group,
      ),
    );
  };

  const editingRecipientData = useMemo(() => {
    if (!editingRecipient) return null;
    const targetGroup = recipientGroups.find((group) => group.id === editingRecipient.groupId);
    const targetRecipient = targetGroup?.recipients.find((recipient) => recipient.id === editingRecipient.recipientId);
    return targetRecipient ?? null;
  }, [editingRecipient, recipientGroups]);

  useEffect(() => {
    if (step !== 1) {
      setEditingRecipient(null);
    }
  }, [step]);

  const renderNextStepButton = (stepNumber: number, isValid: boolean, onClick: () => void) => {
    if (isValid) {
      return (
        <Button variant="solid" aria-label="次の署名依頼作成ステップに進む" onClick={onClick}>
          次へ
        </Button>
      );
    }

    if (stepNumber === 1 || stepNumber === 2) {
      return (
        <Popover trigger="hover" closeButton={false} arrow>
          <Popover.Anchor>
            <Button variant="solid" aria-label="次の署名依頼作成ステップに進む" disabled>
              次へ
            </Button>
          </Popover.Anchor>
          <Popover.Content>
            <Popover.Body>
              <Text>以下の場合は次に進むことができません。</Text>
              <ul style={listStyle}>
                <li>
                  {stepNumber === 1
                    ? "「署名者」を設定していない署名依頼ステップがある。"
                    : "入力項目を配置していない「署名ファイル」がある。"}
                </li>
                <li>
                  {stepNumber === 1 ? "受信者情報で入力不備がある。" : "入力項目の設定フィールドで入力不備がある。"}
                </li>
              </ul>
            </Popover.Body>
          </Popover.Content>
        </Popover>
      );
    }

    return (
      <Button variant="solid" aria-label="次の署名依頼作成ステップに進む" disabled>
        次へ
      </Button>
    );
  };

  const renderFileCards = ({
    removable,
    showStatusLabel = true,
    showPreview = false,
  }: {
    removable: boolean;
    showStatusLabel?: boolean;
    showPreview?: boolean;
  }) => (
    <InformationCardGroup>
      {files.map((file) => (
        <ButtonGroup key={file.id} attached variant="subtle">
          <InformationCard
            leading={
              <Icon>
                <LfUpload />
              </Icon>
            }
            trailing={
              <>
                {showStatusLabel && file.status ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xxSmall)" }}>
                    {file.status.color === "yellow" ? (
                      <Icon color="warning">
                        <LfWarningRhombus />
                      </Icon>
                    ) : null}
                    <StatusLabel color={file.status.color} variant={file.status.variant}>
                      {file.status.label}
                    </StatusLabel>
                  </div>
                ) : null}
                {showStatusLabel ? (
                  <Text variant="caption.small" whiteSpace="nowrap" color="subtle">
                    {file.type === "contractDocument" ? "署名ファイル" : "参考ファイル"}
                  </Text>
                ) : null}
                {showPreview ? (
                  <Button color="neutral" variant="subtle" size="xSmall">
                    プレビュー
                  </Button>
                ) : null}
              </>
            }
          >
            {file.name}
            {!showStatusLabel ? (
              <InformationCardDescription>
                {file.type === "contractDocument"
                  ? file.status
                    ? `署名ファイル（${file.status.label}）`
                    : "署名ファイル"
                  : "参考ファイル"}
              </InformationCardDescription>
            ) : null}
          </InformationCard>
          {removable ? (
            <Tooltip title="削除">
              <IconButton aria-label="ファイルを削除" onClick={() => handleRemoveFile(file.id)}>
                <Icon>
                  <LfCloseSmall />
                </Icon>
              </IconButton>
            </Tooltip>
          ) : null}
        </ButtonGroup>
      ))}
    </InformationCardGroup>
  );

  const renderBasicInfoStep = () => (
    <PageLayoutContent maxWidth="medium">
      <div style={formContainerStyle}>
        <ContentHeader>
          <ContentHeaderTitle as="h1">
            <Text variant="title.small">基本情報の入力</Text>
          </ContentHeaderTitle>
        </ContentHeader>

        <div style={bodyContainerStyle}>
          <div style={fileListWrapperStyle}>
            <FormControl required>
              <FormControl.Label>ファイル</FormControl.Label>
              {files.length > 0 ? (
                renderFileCards({ removable: true, showStatusLabel: true, showPreview: false })
              ) : (
                <div style={emptyStateWrapperStyle}>
                  <EmptyState
                    size="small"
                    action={
                      <Button leading={LfPlusLarge} variant="subtle" width="full" onClick={handleAddFile}>
                        ファイルを追加
                      </Button>
                    }
                  >
                    <Text whiteSpace="pre-wrap">
                      署名依頼をするファイルを追加してください。
                      {"\n"}また、署名をしない添付ファイルがある場合は［参考ファイル］として追加してください。
                    </Text>
                  </EmptyState>
                </div>
              )}
            </FormControl>
            {files.length > 0 ? (
              <Button leading={LfPlusLarge} variant="subtle" width="full" onClick={handleAddFile}>
                ファイルを追加
              </Button>
            ) : null}
          </div>

          <FormControl required>
            <FormControl.Label>署名依頼タイトル</FormControl.Label>
            <TextField
              placeholder="署名依頼タイトルを入力"
              value={envelopeTitle}
              onChange={(event) => setEnvelopeTitle(event.target.value)}
            />
            <FormControl.Caption>
              署名依頼タイトルはメール件名に使われます。受信者ごとのメール件名を［受信者の設定］画面で変更できます。
            </FormControl.Caption>
          </FormControl>

          <FormControl>
            <FormControl.Label>差出人企業名</FormControl.Label>
            <Text>LegalOn Technologies株式会社</Text>
            <FormControl.Caption>
              差出人企業名の設定に関しては、サービス管理者までお問い合わせください。
            </FormControl.Caption>
          </FormControl>

          <Divider />

          <FormControl required>
            <FormControl.Label>保存先</FormControl.Label>
            <Select
              options={spaceOptions}
              placeholder="保存先を選択"
              value={space}
              onChange={(value) => setSpace(value)}
            />
            <FormControl.Caption>
              選択した保存先に、署名依頼を保存します。その保存先に閲覧権限を持つユーザーは、署名依頼を閲覧できます。
            </FormControl.Caption>
          </FormControl>

          <Divider />

          <FormControl>
            <FormControl.Label>備考</FormControl.Label>
            <Textarea placeholder="備考を入力" value={notes} onChange={(event) => setNotes(event.target.value)} />
            <FormControl.Caption>取引先には送信されない社内の管理情報です。</FormControl.Caption>
          </FormControl>
        </div>

        <div style={nextButtonWrapperStyle}>{renderNextStepButton(0, isBasicInfoValid, handleNextStep)}</div>
      </div>
    </PageLayoutContent>
  );

  const renderRecipientGroup = (group: RecipientGroup, index: number) => (
    <div
      key={group.id}
      style={{
        border: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={recipientsBlockHeaderStyle}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Text as="h2" variant="title.xSmall" color="bold" style={{ flex: 1 }}>
            署名依頼ステップ：{index + 1}
          </Text>
          <Button variant="subtle" leading={<Icon source={LfUserPlus} />} onClick={() => handleAddRecipient(group.id)}>
            追加
          </Button>
          <Tooltip title="ステップを削除">
            <IconButton
              aria-label={`署名依頼ステップ${index + 1}を削除`}
              variant="plain"
              icon={LfTrash}
              onClick={() => handleRemoveRecipientGroup(group.id)}
            />
          </Tooltip>
        </div>
        {!group.recipients.some((recipient) => recipient.role === "signer") ? (
          <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xxSmall)" }}>
            <Icon color="danger">
              <LfWarningTriangle />
            </Icon>
            <Text variant="caption.small" color="danger">
              署名依頼の各ステップごとに、1名以上の「署名者」を設定することが必須です。
            </Text>
          </div>
        ) : null}
      </div>

      {group.recipients.map((recipient) => (
        <div
          key={recipient.id}
          style={{
            ...recipientItemStyle,
            borderTop: "1px solid var(--aegis-color-border-subtle)",
            backgroundColor: "var(--aegis-color-background-surface)",
          }}
        >
          <div
            style={{
              alignSelf: "stretch",
              width: "var(--aegis-space-small)",
              borderRadius: "var(--aegis-radius-pill)",
              backgroundColor: "var(--aegis-color-border-default)",
            }}
          />
          <div style={{ display: "flex", flex: 1, columnGap: "var(--aegis-space-xSmall)", alignItems: "center" }}>
            <div style={recipientInfoStyle}>
              <Tooltip title={recipient.name} disabled={recipient.name.length === 0}>
                <Text variant="body.medium.bold" numberOfLines={1}>
                  {recipient.name}
                </Text>
              </Tooltip>
              <Tooltip title={recipient.email} disabled={recipient.email.length === 0}>
                <Text variant="body.medium" numberOfLines={1} color="subtle">
                  {recipient.email}
                </Text>
              </Tooltip>
              <Tooltip title={recipient.company} disabled={recipient.company.length === 0}>
                <Text variant="body.medium" numberOfLines={1} color="subtle">
                  {recipient.company}
                </Text>
              </Tooltip>
            </div>

            <div style={recipientTailStyle}>
              <Text variant="caption.small" color="subtle">
                {recipient.companyType === "own" ? "自社" : "取引先"}
              </Text>
              {recipient.role === "signer" ? <Tag variant="fill">署名者</Tag> : <Tag>参照者</Tag>}
              <Tooltip title="編集">
                <IconButton
                  aria-label="編集"
                  variant="subtle"
                  icon={LfPen}
                  onClick={() => handleOpenRecipientEditor(group.id, recipient.id)}
                />
              </Tooltip>
              <Divider orientation="vertical" />
              <Tooltip title="削除">
                <IconButton
                  aria-label="削除"
                  variant="plain"
                  icon={LfCloseLarge}
                  onClick={() => handleRemoveRecipient(group.id, recipient.id)}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderRecipientsStep = () => (
    <>
      <PageLayoutContent maxWidth="medium">
        <div style={formContainerStyle}>
          <ContentHeader>
            <ContentHeaderTitle as="h1">
              <Text variant="title.medium" color="bold">
                受信者の設定
              </Text>
            </ContentHeaderTitle>
          </ContentHeader>

          <div style={bodyContainerStyle}>
            {recipientGroups.length === 0 ? (
              <EmptyState title="受信者が設定されていません">
                ［＋署名依頼ステップを追加］ボタンから受信者を追加してください。
              </EmptyState>
            ) : (
              recipientGroups.map((group, index) => renderRecipientGroup(group, index))
            )}

            <Button leading={LfPlusLarge} width="full" variant="subtle" onClick={handleAddRecipientGroup}>
              署名依頼ステップを追加
            </Button>
          </div>

          <div style={nextButtonWrapperStyle}>{renderNextStepButton(1, isRecipientsValid, handleNextStep)}</div>
        </div>
      </PageLayoutContent>
      {renderRecipientEditorPane()}
    </>
  );

  const renderRecipientEditorPane = () => {
    if (!editingRecipient || !editingRecipientData) return null;

    const messageLength = editingRecipientData.emailBody.length;

    return (
      <PageLayoutPane position="end" width="xxLarge" open>
        <PageLayoutHeader>
          <ContentHeader
            trailing={
              <Tooltip title="閉じる">
                <IconButton
                  aria-label="閉じる"
                  icon={LfCloseLarge}
                  variant="plain"
                  onClick={handleCloseRecipientEditor}
                />
              </Tooltip>
            }
          >
            <ContentHeaderTitle as="h2">受信者の設定</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
            <FormControl required>
              <FormControl.Label>受信者の種別</FormControl.Label>
              <RadioGroup
                orientation="horizontal"
                value={editingRecipientData.companyType}
                onChange={(value) =>
                  value
                    ? handleUpdateRecipient(editingRecipient.groupId, editingRecipient.recipientId, {
                        companyType: value as Recipient["companyType"],
                      })
                    : undefined
                }
              >
                <Radio value="own">自社</Radio>
                <Radio value="other">取引先</Radio>
              </RadioGroup>
            </FormControl>

            <FormControl required>
              <FormControl.Label>
                名前
                <Text color="danger">＊</Text>
              </FormControl.Label>
              <TextField
                placeholder="受信者の名前を入力"
                value={editingRecipientData.name}
                onChange={(event) =>
                  handleUpdateRecipient(editingRecipient.groupId, editingRecipient.recipientId, {
                    name: event.target.value,
                  })
                }
              />
            </FormControl>

            <FormControl required>
              <FormControl.Label>
                メールアドレス
                <Text color="danger">＊</Text>
              </FormControl.Label>
              <TextField
                placeholder="メールアドレスを入力"
                value={editingRecipientData.email}
                onChange={(event) =>
                  handleUpdateRecipient(editingRecipient.groupId, editingRecipient.recipientId, {
                    email: event.target.value,
                  })
                }
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>会社名</FormControl.Label>
              <TextField
                placeholder="会社名を入力"
                value={editingRecipientData.companyName}
                onChange={(event) =>
                  handleUpdateRecipient(editingRecipient.groupId, editingRecipient.recipientId, {
                    companyName: event.target.value,
                  })
                }
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>部署名</FormControl.Label>
              <TextField
                placeholder="部署名を入力"
                value={editingRecipientData.departmentName}
                onChange={(event) =>
                  handleUpdateRecipient(editingRecipient.groupId, editingRecipient.recipientId, {
                    departmentName: event.target.value,
                  })
                }
              />
            </FormControl>

            <FormControl required>
              <FormControl.Label>受信者の役割</FormControl.Label>
              <RadioGroup
                orientation="horizontal"
                value={editingRecipientData.role}
                onChange={(value) =>
                  value
                    ? handleUpdateRecipient(editingRecipient.groupId, editingRecipient.recipientId, {
                        role: value as Recipient["role"],
                      })
                    : undefined
                }
              >
                <Radio value="signer">署名者</Radio>
                <Radio value="viewer">参照者</Radio>
              </RadioGroup>
            </FormControl>

            <FormControl required>
              <FormControl.Label>
                依頼メール件名
                <Text color="danger">＊</Text>
              </FormControl.Label>
              <TextField
                value={editingRecipientData.emailSubject}
                onChange={(event) =>
                  handleUpdateRecipient(editingRecipient.groupId, editingRecipient.recipientId, {
                    emailSubject: event.target.value,
                  })
                }
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>依頼メッセージ</FormControl.Label>
              <Textarea
                placeholder="依頼メッセージを入力"
                maxLength={1000}
                value={editingRecipientData.emailBody}
                onChange={(event) =>
                  handleUpdateRecipient(editingRecipient.groupId, editingRecipient.recipientId, {
                    emailBody: event.target.value,
                  })
                }
              />
              <Text variant="caption.small" color="subtle" style={{ alignSelf: "flex-end" }}>
                {messageLength}/1000
              </Text>
            </FormControl>
          </div>
        </PageLayoutBody>
      </PageLayoutPane>
    );
  };

  const renderSignSubjectsStep = () => (
    <>
      <PageLayoutPane>
        <PageLayoutHeader>
          <ContentHeader size="medium">
            <ContentHeaderTitle as="h2">署名依頼ファイル</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <ActionList>
            {files.map((file, index) => (
              <ActionList.Item
                key={file.id}
                selected={index === selectedFileIndex}
                onClick={() => setSelectedFileIndex(index)}
              >
                <ActionList.Body
                  leading={
                    <Icon>
                      <LfUpload />
                    </Icon>
                  }
                  trailing={<Badge count={file.signSubjects.length} />}
                >
                  <Tooltip title={file.name} onlyOnOverflow>
                    <Text numberOfLines={1} variant="component.medium">
                      {file.name}
                    </Text>
                  </Tooltip>
                  <ActionList.Description>
                    {file.type === "contractDocument" ? "署名ファイル" : "参考ファイル"}
                  </ActionList.Description>
                </ActionList.Body>
              </ActionList.Item>
            ))}
          </ActionList>
        </PageLayoutBody>
      </PageLayoutPane>

      <PageLayoutContent>
        <PageLayoutBody style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
          <PageLayoutStickyContainer>
            <Toolbar>
              {currentFile.type === "contractDocument" ? (
                <ButtonGroup variant="subtle">
                  <Button leading={LfStamp} onClick={() => handleAddSignSubject("signatureBox")}>
                    署名
                  </Button>
                  <Button leading={LfText} onClick={() => handleAddSignSubject("textBox")}>
                    テキスト
                  </Button>
                  <Button leading={LfCalendar} onClick={() => handleAddSignSubject("dateBox")}>
                    日付
                  </Button>
                  <Button leading={LfSquareCheck} onClick={() => handleAddSignSubject("checkBox")}>
                    チェックボックス
                  </Button>
                </ButtonGroup>
              ) : (
                <Text variant="label.medium">参考ファイルは編集できません。</Text>
              )}

              <Toolbar.Spacer />

              <Tooltip title="最後のページへ">
                <IconButton aria-label="最後のページへ" icon={LfArrowDownLong} />
              </Tooltip>
              <Divider />
              <ButtonGroup>
                <Tooltip title="縮小">
                  <IconButton
                    aria-label="縮小"
                    icon={LfMagnifyingGlassMinus}
                    disabled={scale === scaleSequence[0]}
                    onClick={() =>
                      setScale((prev) => {
                        const currentIndex = scaleSequence.indexOf(prev);
                        const nextIndex = Math.max(currentIndex - 1, 0);
                        return scaleSequence[nextIndex];
                      })
                    }
                  />
                </Tooltip>
                <Tooltip title="拡大">
                  <IconButton
                    aria-label="拡大"
                    icon={LfMagnifyingGlassPlus}
                    disabled={scale === scaleSequence[scaleSequence.length - 1]}
                    onClick={() =>
                      setScale((prev) => {
                        const currentIndex = scaleSequence.indexOf(prev);
                        const nextIndex = Math.min(currentIndex + 1, scaleSequence.length - 1);
                        return scaleSequence[nextIndex];
                      })
                    }
                  />
                </Tooltip>
                <Select
                  aria-label="表示倍率"
                  variant="gutterless"
                  width="auto"
                  options={toolbarScaleOptions.map((option) => ({
                    label: option.label,
                    value: option.value.toString(),
                  }))}
                  value={scale.toString()}
                  onChange={(value) => {
                    const matched = toolbarScaleOptions.find((option) => option.value.toString() === value);
                    if (matched) {
                      setScale(matched.value);
                    }
                  }}
                />
              </ButtonGroup>
            </Toolbar>
          </PageLayoutStickyContainer>

          <div
            style={{
              display: "grid",
              placeItems: "center",
              overflow: "auto",
              backgroundColor: "var(--aegis-color-background-surface)",
              border: "1px solid var(--aegis-color-border-default)",
              borderRadius: "var(--aegis-radius-large)",
              padding: "var(--aegis-space-large)",
            }}
          >
            <div style={{ position: "relative", width: basePageWidth * scale, minHeight: basePageHeight * scale }}>
              <div
                style={{
                  position: "relative",
                  width: basePageWidth,
                  minHeight: basePageHeight,
                  backgroundColor: "white",
                  border: "1px solid var(--aegis-color-border-default)",
                  borderRadius: "var(--aegis-radius-medium)",
                  padding: "var(--aegis-space-large)",
                  boxShadow: "0 20px 48px rgba(15, 23, 42, 0.12)",
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
                  <Text variant="title.xxSmall" color="bold">
                    {currentFile?.name}
                  </Text>
                  <Text color="subtle" style={{ lineHeight: 1.7 }}>
                    第1条（目的）本契約は、甲が乙に対し業務を委託する際の条件を定めるものである。{`\n`}
                    第2条（業務内容）甲は乙に対し、別紙に定める業務を委託し、乙はこれを受託する。
                  </Text>
                </div>

                {currentFile?.signSubjects.map((subject) => {
                  const IconComponent =
                    subject.type === "signatureBox"
                      ? LfStamp
                      : subject.type === "textBox"
                        ? LfText
                        : subject.type === "dateBox"
                          ? LfCalendar
                          : LfSquareCheck;

                  return (
                    <Tag
                      key={subject.id}
                      variant="fill"
                      style={{
                        position: "absolute",
                        top: subject.y,
                        left: subject.x,
                        backgroundColor: subject.color,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "var(--aegis-space-xxSmall)",
                      }}
                      onClick={() => handleRemoveSignSubject(currentFile.id, subject.id)}
                    >
                      <Icon>
                        <IconComponent />
                      </Icon>
                      {subject.label}
                    </Tag>
                  );
                })}

                {currentFile?.signSubjects.length === 0 ? (
                  <EmptyState size="small" style={{ position: "absolute", inset: "auto 0 0 0" }}>
                    <Text color="subtle">署名項目が未配置です。ツールバーから追加してください。</Text>
                  </EmptyState>
                ) : null}
              </div>
            </div>
          </div>

          <div style={nextButtonWrapperStyle}>{renderNextStepButton(2, isSignSubjectsValid, handleNextStep)}</div>
        </PageLayoutBody>
      </PageLayoutContent>
    </>
  );

  const renderSendButton = (size?: "large") => (
    <Button
      variant="solid"
      size={size}
      disabled={!isConfirmationValid}
      aria-label="署名依頼を送信する"
      onClick={() => setSendDialogOpen(true)}
    >
      送信
    </Button>
  );

  const renderConfirmationStep = () => {
    const selectedSpaceLabel = spaceOptions.find((option) => option.value === space)?.label ?? "未選択";

    return (
      <PageLayoutContent maxWidth="medium">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xLarge)" }}>
          <ContentHeader>
            <ContentHeaderTitle as="h1">
              <Text variant="title.medium">依頼内容の確認</Text>
            </ContentHeaderTitle>
            <ContentHeaderDescription>
              依頼内容をご確認の上、設定した送信先へ署名依頼を送信してください。
            </ContentHeaderDescription>
          </ContentHeader>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
              <ContentHeader>
                <ContentHeaderTitle as="h2">
                  <Text variant="title.small">基本情報</Text>
                </ContentHeaderTitle>
              </ContentHeader>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
                <div>
                  <ContentHeader>
                    <ContentHeaderTitle as="h3">
                      <Text variant="title.xxSmall">ファイル</Text>
                    </ContentHeaderTitle>
                  </ContentHeader>
                  {renderFileCards({ removable: false, showStatusLabel: false, showPreview: true })}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                  <ContentHeader>
                    <ContentHeaderTitle as="h3">
                      <Text variant="title.xxSmall">署名依頼タイトル</Text>
                    </ContentHeaderTitle>
                  </ContentHeader>
                  {envelopeTitle.trim().length === 0 ? (
                    <Text color="disabled.inverse">未入力</Text>
                  ) : (
                    <Text>{envelopeTitle}</Text>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                  <ContentHeader>
                    <ContentHeaderTitle as="h3">
                      <Text variant="title.xxSmall">差出人企業名</Text>
                    </ContentHeaderTitle>
                  </ContentHeader>
                  <Text>LegalOn Technologies株式会社</Text>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                  <ContentHeader>
                    <ContentHeaderTitle as="h3">
                      <Text variant="title.xxSmall">備考</Text>
                    </ContentHeaderTitle>
                  </ContentHeader>
                  {notes.trim().length === 0 ? <Text color="disabled.inverse">未入力</Text> : <Text>{notes}</Text>}
                </div>
              </div>
            </div>

            <Divider />

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
              <ContentHeader>
                <ContentHeaderTitle as="h2">
                  <Text variant="title.small">受信者情報</Text>
                </ContentHeaderTitle>
              </ContentHeader>
              {recipientGroups.map((group, index) => (
                <div
                  key={group.id}
                  style={{
                    border: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-background-neutral-subtle)",
                  }}
                >
                  <div
                    style={{
                      padding: "var(--aegis-space-small)",
                      backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
                    }}
                  >
                    <Text variant="title.xSmall">受信順 {index + 1}</Text>
                  </div>
                  <div style={{ padding: "var(--aegis-space-small)" }}>
                    <Accordion size="large" multiple>
                      {group.recipients.map((recipient) => (
                        <Accordion.Item key={recipient.id}>
                          <Accordion.Button>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: "var(--aegis-space-small)",
                                width: "100%",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "var(--aegis-space-xxSmall)",
                                  minWidth: 0,
                                }}
                              >
                                <Text as="h4" style={{ overflowWrap: "anywhere" }}>
                                  {recipient.name}
                                </Text>
                                <Text variant="caption.medium" color="subtle" style={{ overflowWrap: "anywhere" }}>
                                  {recipient.email}
                                </Text>
                                <Text variant="caption.small" color="subtle" style={{ overflowWrap: "anywhere" }}>
                                  {buildCompanyDisplay(
                                    recipient.companyType,
                                    recipient.companyName,
                                    recipient.departmentName,
                                  )}
                                </Text>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "var(--aegis-space-small)",
                                  alignItems: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <Text variant="caption.small" color="subtle">
                                  {recipient.companyType === "own" ? "自社" : "取引先"}
                                </Text>
                                {recipient.role === "signer" ? (
                                  <Tag variant="fill" size="small">
                                    署名者
                                  </Tag>
                                ) : (
                                  <Tag size="small">参照者</Tag>
                                )}
                              </div>
                            </div>
                          </Accordion.Button>
                          <Accordion.Panel>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--aegis-space-small)",
                                paddingInline: "var(--aegis-space-medium)",
                                paddingTop: "var(--aegis-space-small)",
                                paddingBottom: "var(--aegis-space-medium)",
                              }}
                            >
                              <Text variant="title.xxSmall">依頼メール件名</Text>
                              <Text>{recipient.emailSubject || "未入力"}</Text>
                              <Text variant="title.xxSmall">依頼メッセージ</Text>
                              {recipient.emailBody === defaultEmailBody ? (
                                <Text color="disabled.inverse">未入力</Text>
                              ) : (
                                <Text>{recipient.emailBody}</Text>
                              )}
                            </div>
                          </Accordion.Panel>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  </div>
                </div>
              ))}
            </div>

            <Divider />

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
              <ContentHeader>
                <ContentHeaderTitle as="h2">
                  <Text variant="title.small">保存先</Text>
                </ContentHeaderTitle>
              </ContentHeader>
              <Text>{selectedSpaceLabel}</Text>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>{renderSendButton()}</div>
          </div>
        </div>
      </PageLayoutContent>
    );
  };

  const renderConfirmCloseDialog = () => (
    <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
      <Tooltip placement="bottom-start" title="署名依頼作成を中止">
        <IconButton
          aria-label="閉じる"
          icon={LfAngleLeftLarge}
          variant="subtle"
          onClick={() => setCloseDialogOpen(true)}
        />
      </Tooltip>
      <Dialog.Content width="xLarge">
        <Dialog.Header>
          <ContentHeader>
            <ContentHeaderTitle as="h1">署名依頼作成を中止しますか？</ContentHeaderTitle>
            <ContentHeaderDescription>
              <Text color="subtle">作成した内容は保存されません。</Text>
            </ContentHeaderDescription>
          </ContentHeader>
        </Dialog.Header>
        <Dialog.Footer>
          <ButtonGroup>
            <Button variant="plain" onClick={() => setCloseDialogOpen(false)}>
              キャンセル
            </Button>
            <Button color="danger" onClick={() => setCloseDialogOpen(false)}>
              中止
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );

  const renderSendDialog = () => (
    <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
      <Dialog.Content width="xLarge">
        <Dialog.Header>
          <ContentHeader>
            <ContentHeaderTitle as="h1">署名依頼を送信しますか？</ContentHeaderTitle>
            <ContentHeaderDescription>
              <Text color="subtle">指定した宛先へ署名依頼を送信します</Text>
            </ContentHeaderDescription>
          </ContentHeader>
        </Dialog.Header>
        <Dialog.Footer>
          <ButtonGroup>
            <Button variant="plain" onClick={() => setSendDialogOpen(false)}>
              キャンセル
            </Button>
            <Button variant="solid" onClick={() => setSendDialogOpen(false)}>
              送信
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );

  const isCurrentStepValid =
    step === 0
      ? isBasicInfoValid
      : step === 1
        ? isRecipientsValid
        : step === 2
          ? isSignSubjectsValid
          : isConfirmationValid;

  const defaultEmailBody = "";

  const headerSub = (
    <div style={{ display: "flex", width: "100%" }}>
      <Header.Spacer />
      <Header.Item>
        <div style={{ inlineSize: "var(--aegis-layout-width-medium)" }}>
          <Stepper onChange={handleStepChange} index={step}>
            {[
              { label: "基本情報の入力", disabled: false },
              { label: "受信者の設定", disabled: !stepValidityStatus.firstStep },
              { label: "入力項目の設定", disabled: !stepValidityStatus.firstStep || !stepValidityStatus.secondStep },
              {
                label: "依頼内容の確認",
                disabled:
                  !stepValidityStatus.firstStep || !stepValidityStatus.secondStep || !stepValidityStatus.thirdStep,
              },
            ].map((attribute, index) => (
              <Stepper.Item
                key={attribute.label}
                disabled={attribute.disabled}
                status={availableNextStep(index) ? "completed" : "normal"}
                title={attribute.label}
              />
            ))}
          </Stepper>
        </div>
      </Header.Item>
      <Header.Spacer />
    </div>
  );

  return (
    <>
      <Header sub={headerSub}>
        <Header.Item>{renderConfirmCloseDialog()}</Header.Item>
        <Header.Item>
          <Header.Title>署名依頼を作成</Header.Title>
        </Header.Item>
        <Header.Spacer />
        <Header.Item>
          {step === 3 ? renderSendButton("large") : renderNextStepButton(step, isCurrentStepValid, handleNextStep)}
        </Header.Item>
      </Header>

      <div style={pageLayoutWrapperStyle}>
        <PageLayout>
          {step === 0 ? renderBasicInfoStep() : null}
          {step === 1 ? renderRecipientsStep() : null}
          {step === 2 ? renderSignSubjectsStep() : null}
          {step === 3 ? renderConfirmationStep() : null}
        </PageLayout>
      </div>

      {renderSendDialog()}
    </>
  );
};

export default ESignTemplate;
