var e=`import {
  LfCloseLarge,
  LfEllipsisDot,
  LfInformation,
  LfPen,
  LfSetting,
  LfTrash,
  LfWarningTriangle,
} from "@legalforce/aegis-icons";
import {
  Badge,
  Banner,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Combobox,
  ContentHeader,
  DateField,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogStickyContainer,
  EmptyState,
  FormControl,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuTrigger,
  NavList,
  Pagination,
  Popover,
  PopoverAnchor,
  PopoverBody,
  PopoverContent,
  SegmentedControl,
  Select,
  Skeleton,
  Stepper,
  snackbar,
  Tab,
  Table,
  TableContainer,
  Tag,
  Text,
  Textarea,
  TextField,
  Tooltip,
} from "@legalforce/aegis-react";
import { createContext, type ReactNode, useContext, useState } from "react";

/**
 * Side-by-side Bad / Good comparison. Renders both at once in stacked panels.
 */
export interface AntiPatternCompareDemo {
  kind?: "compare";
  bad: () => ReactNode;
  good: () => ReactNode;
  /** Optional caption rendered under the Bad preview to highlight what's wrong visually. */
  badNote?: string;
  /** Optional caption rendered under the Good preview to highlight the fix. */
  goodNote?: string;
}

/**
 * Custom preview that takes over the comparison panel. Used for anti-patterns
 * where the Bad / Good rendering can't both be visible at once — most notably
 * Dialog anti-patterns where the real \`<Dialog>\` is a modal portal.
 */
export interface AntiPatternCustomDemo {
  kind: "custom";
  render: () => ReactNode;
}

export type AntiPatternDemo = AntiPatternCompareDemo | AntiPatternCustomDemo;

/**
 * Lets nested demos (typically inside the patterns Drawer) request that a real
 * \`<Dialog>\` be mounted at the PatternsPage root level. This is the only way to
 * avoid base-ui's "nested dialog" detection which suppresses the backdrop when
 * a Dialog is rendered inside another modal surface like Drawer.
 */
export interface DialogStageHandle {
  show: (content: ReactNode) => void;
  hide: () => void;
  closeDrawer: () => void;
}

export const DialogStageContext = createContext<DialogStageHandle | null>(null);

const useDialogStage = (): DialogStageHandle => {
  const stage = useContext(DialogStageContext);
  if (!stage) {
    throw new Error("DialogStageContext is not provided. Wrap the patterns page with DialogStageContext.Provider.");
  }
  return stage;
};

// AP-BADGE-001 -------------------------------------------------------------
const BadgeAsLabelBad = () => (
  <div style={{ display: "flex", gap: "var(--aegis-space-small)", alignItems: "center", flexWrap: "wrap" }}>
    <Badge color="information">最新</Badge>
    <Badge color="information">Updated 4 min ago</Badge>
    <Badge color="danger">12</Badge>
  </div>
);

const BadgeAsLabelGood = () => (
  <div style={{ display: "flex", gap: "var(--aegis-space-small)", alignItems: "center", flexWrap: "wrap" }}>
    <Tag size="small" color="blue">
      最新
    </Tag>
    <Text variant="body.small" color="subtle">
      Updated 4 min ago
    </Text>
    <Badge color="danger" count={12} />
  </div>
);

// AP-BANNER-001 ------------------------------------------------------------
const BannerWithIconBad = () => (
  <Banner color="danger" closeButton={false}>
    <Icon>
      <LfWarningTriangle />
    </Icon>
    エラーが発生しました
  </Banner>
);

const BannerWithIconGood = () => (
  <Banner color="danger" closeButton={false}>
    エラーが発生しました
  </Banner>
);

// AP-BANNER-002 ------------------------------------------------------------
const BannerColorMismatchBad = () => (
  <Banner color="information" closeButton={false}>
    保存に失敗しました
  </Banner>
);

const BannerColorMismatchGood = () => (
  <Banner color="danger" closeButton={false}>
    保存に失敗しました。再度お試しください。
  </Banner>
);

// AP-BUTTON-002 ------------------------------------------------------------
const ButtonInlineWidthBad = () => (
  <Button variant="solid" style={{ width: "200px" }}>
    Submit
  </Button>
);

const ButtonInlineWidthGood = () => (
  <Button variant="solid" width="full">
    Submit
  </Button>
);

// AP-BUTTON-003 ------------------------------------------------------------
const MultipleSolidBad = () => (
  <ButtonGroup>
    <Button variant="solid">保存</Button>
    <Button variant="solid">送信</Button>
  </ButtonGroup>
);

const MultipleSolidGood = () => (
  <ButtonGroup>
    <Button variant="plain">キャンセル</Button>
    <Button variant="solid">保存</Button>
  </ButtonGroup>
);

// AP-BUTTON-004 ------------------------------------------------------------
const ButtonLeadingInteractiveBad = () => (
  <Button
    variant="solid"
    leading={
      <IconButton aria-label="情報" size="xSmall" variant="plain">
        <Icon>
          <LfInformation />
        </Icon>
      </IconButton>
    }
  >
    Submit
  </Button>
);

const ButtonLeadingInteractiveGood = () => (
  <Button
    variant="solid"
    leading={
      <Icon>
        <LfInformation />
      </Icon>
    }
  >
    Submit
  </Button>
);

// AP-BUTTON-005 ------------------------------------------------------------
const ButtonStyleOverrideBad = () => (
  <Button
    variant="solid"
    style={{
      backgroundColor: "#007bff",
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      border: "2px solid #0056b3",
    }}
  >
    Submit
  </Button>
);

const ButtonStyleOverrideGood = () => (
  <Button variant="solid" color="neutral">
    Submit
  </Button>
);

// AP-BUTTON-006 ------------------------------------------------------------
const DangerForCancelBad = () => (
  <ButtonGroup>
    <Button variant="solid" color="danger">
      キャンセル
    </Button>
    <Button variant="solid">保存</Button>
  </ButtonGroup>
);

const DangerForCancelGood = () => (
  <ButtonGroup>
    <Button variant="plain">キャンセル</Button>
    <Button variant="solid" color="danger">
      削除する
    </Button>
  </ButtonGroup>
);

// AP-CARD-001 --------------------------------------------------------------
const CardOverInteractiveBad = () => (
  <Card
    variant="outline"
    onClick={() => {}}
    role="button"
    tabIndex={0}
    style={{ cursor: "pointer", padding: "var(--aegis-space-medium)" }}
  >
    <Text variant="body.medium.bold" style={{ display: "block" }}>
      契約書プロジェクト
    </Text>
    <div
      style={{
        display: "flex",
        gap: "var(--aegis-space-xSmall)",
        marginTop: "var(--aegis-space-small)",
      }}
    >
      <Button onClick={(event) => event.stopPropagation()} size="small">
        アクション
      </Button>
      <Link href="#" onClick={(event) => event.stopPropagation()}>
        詳細
      </Link>
    </div>
  </Card>
);

const CardOverInteractiveGood = () => (
  <Card variant="outline">
    <CardHeader>
      <Text variant="body.medium.bold">契約書プロジェクト</Text>
    </CardHeader>
    <CardBody>
      <Text variant="body.small" color="subtle">
        2026年5月時点で進行中の業務委託契約書プロジェクト。
      </Text>
    </CardBody>
    <CardFooter>
      <ButtonGroup>
        <Button variant="plain" size="small">
          アクション
        </Button>
      </ButtonGroup>
    </CardFooter>
  </Card>
);

// AP-CHECKBOX-001 ----------------------------------------------------------
const CheckboxNoFormControlBad = () => <Checkbox>利用規約に同意する</Checkbox>;

const CheckboxNoFormControlGood = () => (
  <FormControl>
    <Checkbox>利用規約に同意する</Checkbox>
  </FormControl>
);

// AP-COMBOBOX-001 ----------------------------------------------------------
const comboboxOptions = [
  { value: "legal", label: "法務" },
  { value: "sales", label: "営業" },
  { value: "hr", label: "人事" },
];

const ComboboxNoFormControlBad = () => (
  <div style={{ maxWidth: "var(--aegis-layout-width-x4Small)" }}>
    <Combobox options={comboboxOptions} placeholder="部署を選択" />
  </div>
);

const ComboboxNoFormControlGood = () => (
  <div style={{ maxWidth: "var(--aegis-layout-width-x4Small)" }}>
    <FormControl>
      <FormControl.Label>部署</FormControl.Label>
      <Combobox options={comboboxOptions} placeholder="部署を選択" />
    </FormControl>
  </div>
);

// ---- Inline Dialog panel ------------------------------------------------
// Dialog/DialogContent uses a Portal so it can't render inside the drawer
// preview. Instead we wrap real DialogHeader/Body/Footer/StickyContainer in a
// styled <div> that mimics an opened DialogContent — keeping the Bad/Good
// contrast visible without a modal overlay. Inside the panel everything is a
// real Aegis component.
const DialogPanel = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      border: "1px solid var(--aegis-color-border-default)",
      borderRadius: "var(--aegis-radius-large)",
      background: "var(--aegis-color-background-default)",
      boxShadow: "var(--aegis-shadow-overlay, 0 8px 24px rgba(0,0,0,0.08))",
      overflow: "hidden",
      maxWidth: "var(--aegis-layout-width-xSmall)",
    }}
  >
    {children}
  </div>
);

// AP-CONTENTHEADER-001 -----------------------------------------------------
const ContentHeaderTrailingActionBad = () => (
  <DialogPanel>
    <DialogHeader>
      <ContentHeader trailing={<Button variant="solid">保存</Button>}>
        <ContentHeader.Title>編集</ContentHeader.Title>
      </ContentHeader>
    </DialogHeader>
    <DialogBody>
      <Text variant="body.small">フォーム内容...</Text>
    </DialogBody>
    <DialogFooter>
      <Text variant="body.small" color="subtle">
        （フッターにアクション無し）
      </Text>
    </DialogFooter>
  </DialogPanel>
);

const ContentHeaderTrailingActionGood = () => (
  <DialogPanel>
    <DialogHeader>
      <ContentHeader>
        <ContentHeader.Title>編集</ContentHeader.Title>
      </ContentHeader>
    </DialogHeader>
    <DialogBody>
      <Text variant="body.small">フォーム内容...</Text>
    </DialogBody>
    <DialogFooter>
      <ButtonGroup>
        <Button variant="plain">キャンセル</Button>
        <Button variant="solid">保存</Button>
      </ButtonGroup>
    </DialogFooter>
  </DialogPanel>
);

// AP-CUSTOM-UI-001 ---------------------------------------------------------
const CustomUiBad = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
    <input
      type="text"
      placeholder="名前を入力"
      style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", width: "240px" }}
    />
    <button
      type="button"
      style={{
        padding: "8px 12px",
        background: "#333",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        width: "fit-content",
      }}
    >
      更新
    </button>
  </div>
);

const CustomUiGood = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
    <FormControl>
      <FormControl.Label>名前</FormControl.Label>
      <TextField placeholder="名前を入力" />
    </FormControl>
    <Button variant="solid" style={{ width: "fit-content" }}>
      更新
    </Button>
  </div>
);

// AP-DATEFIELD-001 ---------------------------------------------------------
const DateFieldNoFormControlBad = () => (
  <div style={{ maxWidth: "var(--aegis-layout-width-x4Small)" }}>
    <DateField />
  </div>
);

const DateFieldNoFormControlGood = () => (
  <div style={{ maxWidth: "var(--aegis-layout-width-x4Small)" }}>
    <FormControl>
      <FormControl.Label>開始日</FormControl.Label>
      <DateField />
    </FormControl>
  </div>
);

// ---- Live Dialog comparison preview -------------------------------------
// Drawer 内部で <Dialog> を開くと base-ui が "nested dialog" と判定して
// backdrop を抑制してしまうため、PatternsPage のトップレベルに mount される
// DialogStageContext 経由で Dialog を出す。表示時には Drawer を閉じて、
// Dialog が viewport 全体を backdrop で覆えるようにする。
interface DialogSide {
  triggerLabel: string;
  content: ReactNode;
  note: string;
}

const DialogPreview = ({ bad, good }: { bad: DialogSide; good: DialogSide }) => {
  const stage = useDialogStage();
  const [view, setView] = useState<"bad" | "good">("bad");

  const showSide = (which: "bad" | "good") => {
    setView(which);
    stage.closeDrawer();
    stage.show(which === "bad" ? bad.content : good.content);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
      <SegmentedControl
        size="small"
        index={view === "bad" ? 0 : 1}
        onChange={(index) => setView(index === 0 ? "bad" : "good")}
      >
        <SegmentedControl.Button>✕ Bad</SegmentedControl.Button>
        <SegmentedControl.Button>✓ Good</SegmentedControl.Button>
      </SegmentedControl>

      <Button variant="solid" onClick={() => showSide(view)}>
        {view === "bad" ? bad.triggerLabel : good.triggerLabel}
      </Button>

      <Text variant="body.small" color="subtle">
        {view === "bad" ? \`❌ \${bad.note}\` : \`✅ \${good.note}\`}
      </Text>

      <Text variant="body.small" color="subtle">
        ※ クリックすると Drawer が閉じて実際の Aegis Dialog がモーダルで開きます。閉じると一覧に戻ります。
      </Text>
    </div>
  );
};

// AP-DIALOG-001 ------------------------------------------------------------
const DialogNoHeaderPreview = () => (
  <DialogPreview
    bad={{
      triggerLabel: "Bad Dialog を再表示",
      note: "DialogHeader が無い。タイトルが視覚的にも支援技術にも伝わらない（WCAG 4.1.2）。",
      content: (
        <DialogContent>
          <DialogBody>
            <Text>本当に削除しますか？</Text>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain">キャンセル</Button>
              <Button variant="solid">削除</Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      ),
    }}
    good={{
      triggerLabel: "Good Dialog を再表示",
      note: "DialogHeader + ContentHeader.Title で目的を明示。閉じるボタンも自動付与。",
      content: (
        <DialogContent>
          <DialogHeader>
            <ContentHeader>
              <ContentHeader.Title>削除の確認</ContentHeader.Title>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <Text>本当に削除しますか？</Text>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain">キャンセル</Button>
              <Button variant="solid">削除</Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      ),
    }}
  />
);

// AP-DIALOG-002 ------------------------------------------------------------
// AP-DIALOG-002 demo 用の長尺フォーム。Bad / Good で同じ量のフィールドを並べ、
// スクロールが発生する状況を作って Banner の挙動差を実感できるようにする。
const tallFormFields = [
  { label: "件名", value: "業務委託契約書 v3" },
  { label: "取引先", value: "株式会社サンプル" },
  { label: "案件カテゴリ", value: "業務委託" },
  { label: "担当者", value: "山田 太郎" },
  { label: "契約開始日", value: "2026-05-01" },
  { label: "契約終了日", value: "2027-04-30" },
  { label: "契約金額（税抜）", value: "1,200,000" },
  { label: "消費税率", value: "10%" },
  { label: "支払サイト", value: "月末締め翌月末払い" },
  { label: "請求書送付先", value: "経理部 田中花子" },
  { label: "管理番号", value: "CTR-2026-0042" },
  { label: "更新区分", value: "新規" },
  { label: "契約形態", value: "定期" },
  { label: "自動更新", value: "あり" },
  { label: "更新通知日数", value: "60" },
  { label: "保管期限", value: "2032-04-30" },
  { label: "保管場所", value: "法務部 ファイルサーバ" },
  { label: "電子署名", value: "Adobe Sign" },
  { label: "印紙税区分", value: "課税対象外" },
  { label: "備考", value: "" },
] as const;

const TallDialogForm = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
    {tallFormFields.map((field) => (
      <FormControl key={field.label}>
        <FormControl.Label>{field.label}</FormControl.Label>
        <TextField defaultValue={field.value} />
      </FormControl>
    ))}
  </div>
);

const DialogBannerInBodyPreview = () => (
  <DialogPreview
    bad={{
      triggerLabel: "Bad Dialog を再表示",
      note: "Banner が DialogBody の通常コンテンツとして配置されている。下にスクロールすると Banner が画面外に消え、エラーに気付かずに保存してしまう。",
      content: (
        <DialogContent>
          <DialogHeader>
            <ContentHeader>
              <ContentHeader.Title>編集</ContentHeader.Title>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
              <Banner color="danger" closeButton={false}>
                入力内容にエラーがあります
              </Banner>
              <TallDialogForm />
            </div>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain">キャンセル</Button>
              <Button variant="solid">保存</Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      ),
    }}
    good={{
      triggerLabel: "Good Dialog を再表示",
      note: "DialogBody 内の末尾に DialogStickyContainer（bottom）を置く。スクロールしても Banner が Footer 直前に張り付いて見え続ける。",
      content: (
        <DialogContent>
          <DialogHeader>
            <ContentHeader>
              <ContentHeader.Title>編集</ContentHeader.Title>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
              <TallDialogForm />
              <DialogStickyContainer position="bottom">
                <Banner color="danger" closeButton={false}>
                  入力内容にエラーがあります
                </Banner>
              </DialogStickyContainer>
            </div>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain">キャンセル</Button>
              <Button variant="solid">保存</Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      ),
    }}
  />
);

// AP-DIALOG-003 ------------------------------------------------------------
const DialogMultipleSolidPreview = () => (
  <DialogPreview
    bad={{
      triggerLabel: "Bad Dialog を再表示",
      note: "Footer に solid Button が 2 つ。プライマリの判断ができない。",
      content: (
        <DialogContent>
          <DialogHeader>
            <ContentHeader>
              <ContentHeader.Title>保存</ContentHeader.Title>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <Text variant="body.small">内容を確認してください</Text>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="solid">保存</Button>
              <Button variant="solid">送信</Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      ),
    }}
    good={{
      triggerLabel: "Good Dialog を再表示",
      note: "solid は 1 つだけ。副次アクションは plain に下げる。",
      content: (
        <DialogContent>
          <DialogHeader>
            <ContentHeader>
              <ContentHeader.Title>保存</ContentHeader.Title>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <Text variant="body.small">内容を確認してください</Text>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain">キャンセル</Button>
              <Button variant="solid">保存</Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      ),
    }}
  />
);

// AP-DIALOG-004 ------------------------------------------------------------
const DialogFullscreenComplexPreview = () => (
  <DialogPreview
    bad={{
      triggerLabel: "Bad Dialog を再表示",
      note: 'width="full" の DialogContent に複雑なフォームを詰め込むと、保存先と離脱挙動が直感的でなくなる。',
      content: (
        <DialogContent width="full">
          <DialogHeader>
            <ContentHeader>
              <ContentHeader.Title>新規契約書作成</ContentHeader.Title>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
              <FormControl>
                <FormControl.Label>タイトル</FormControl.Label>
                <TextField />
              </FormControl>
              <FormControl>
                <FormControl.Label>取引先</FormControl.Label>
                <TextField />
              </FormControl>
              <FormControl>
                <FormControl.Label>本文</FormControl.Label>
                <Textarea />
              </FormControl>
              <Text variant="body.small" color="subtle">
                ... 大量のフィールドが続く
              </Text>
            </div>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain">キャンセル</Button>
              <Button variant="solid">作成</Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      ),
    }}
    good={{
      triggerLabel: "Good — 専用ページのリンクを開く",
      note: "複雑な作成フローは Dialog ではなく専用ページに遷移させる（Dialog は閲覧用に留める）。",
      content: (
        <DialogContent>
          <DialogHeader>
            <ContentHeader>
              <ContentHeader.Title>作成方法のご案内</ContentHeader.Title>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
              <Text variant="body.small">複雑な作成フローは Dialog ではなく専用ページで実行します。</Text>
              <Link href="#">
                <Text variant="body.medium">新規契約書を作成ページへ →</Text>
              </Link>
            </div>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain">閉じる</Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      ),
    }}
  />
);

// AP-DRAWER-001 ------------------------------------------------------------
const FakeDrawerShell = ({
  showHeader,
  showDoubleClose,
  children,
}: {
  showHeader: boolean;
  showDoubleClose?: boolean;
  children: ReactNode;
}) => (
  <div
    style={{
      border: "1px solid var(--aegis-color-border-default)",
      borderRadius: "var(--aegis-radius-large)",
      background: "var(--aegis-color-background-default)",
      overflow: "hidden",
      maxWidth: "var(--aegis-layout-width-x3Small)",
    }}
  >
    {showHeader && (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "var(--aegis-space-medium)",
          borderBottom: "1px solid var(--aegis-color-border-default)",
        }}
      >
        <Text variant="title.xSmall">詳細</Text>
        <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)" }}>
          {showDoubleClose && (
            <Tooltip title="閉じる">
              <IconButton aria-label="閉じる (手動)" variant="plain" size="small">
                <Icon>
                  <LfCloseLarge />
                </Icon>
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="閉じる">
            <IconButton aria-label="閉じる (自動)" variant="plain" size="small">
              <Icon>
                <LfCloseLarge />
              </Icon>
            </IconButton>
          </Tooltip>
        </div>
      </div>
    )}
    <div style={{ padding: "var(--aegis-space-medium)" }}>{children}</div>
  </div>
);

const DrawerNoHeaderBad = () => (
  <FakeDrawerShell showHeader={false}>
    <Text variant="body.small">内容</Text>
  </FakeDrawerShell>
);

const DrawerNoHeaderGood = () => (
  <FakeDrawerShell showHeader>
    <Text variant="body.small">内容</Text>
  </FakeDrawerShell>
);

// AP-DRAWER-002 ------------------------------------------------------------
const DrawerDoubleCloseBad = () => (
  <FakeDrawerShell showHeader showDoubleClose>
    <Text variant="body.small">詳細情報</Text>
  </FakeDrawerShell>
);

const DrawerDoubleCloseGood = () => (
  <FakeDrawerShell showHeader>
    <Text variant="body.small">詳細情報</Text>
  </FakeDrawerShell>
);

// AP-EMPTYSTATE-001 --------------------------------------------------------
const EmptyStateNoTitleBad = () => <EmptyState size="medium">データがありません</EmptyState>;

const EmptyStateNoTitleGood = () => (
  <EmptyState size="medium" title="検索結果なし">
    条件に一致するデータが見つかりませんでした。
  </EmptyState>
);

// AP-FORMCONTROL-001 -------------------------------------------------------
const FormControlMissingBad = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--aegis-space-small)",
      maxWidth: "var(--aegis-layout-width-x4Small)",
    }}
  >
    <TextField placeholder="検索キーワード" />
    <Select placeholder="部署" options={comboboxOptions} />
  </div>
);

const FormControlMissingGood = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--aegis-space-medium)",
      maxWidth: "var(--aegis-layout-width-x4Small)",
    }}
  >
    <FormControl>
      <FormControl.Label>検索キーワード</FormControl.Label>
      <TextField placeholder="例: 業務委託" />
    </FormControl>
    <FormControl>
      <FormControl.Label>部署</FormControl.Label>
      <Select placeholder="部署を選択" options={comboboxOptions} />
    </FormControl>
  </div>
);

// AP-FORMCONTROL-002 -------------------------------------------------------
const FormControlNoLabelBad = () => (
  <div style={{ maxWidth: "var(--aegis-layout-width-x4Small)" }}>
    <FormControl>
      <TextField placeholder="入力してください" />
    </FormControl>
  </div>
);

const FormControlNoLabelGood = () => (
  <div style={{ maxWidth: "var(--aegis-layout-width-x4Small)" }}>
    <FormControl>
      <FormControl.Label>メールアドレス</FormControl.Label>
      <TextField placeholder="user@example.com" />
    </FormControl>
  </div>
);

// AP-FORMCONTROL-003 -------------------------------------------------------
const FormControlErrorNoCaptionBad = () => (
  <div style={{ maxWidth: "var(--aegis-layout-width-x4Small)" }}>
    <FormControl error>
      <FormControl.Label>メールアドレス</FormControl.Label>
      <TextField defaultValue="invalid-email" />
    </FormControl>
  </div>
);

const FormControlErrorNoCaptionGood = () => (
  <div style={{ maxWidth: "var(--aegis-layout-width-x4Small)" }}>
    <FormControl error>
      <FormControl.Label>メールアドレス</FormControl.Label>
      <TextField defaultValue="invalid-email" />
      <FormControl.Caption>メールアドレスの形式が正しくありません</FormControl.Caption>
    </FormControl>
  </div>
);

// AP-FORMCONTROL-004 -------------------------------------------------------
const FormControlManualRequiredBad = () => (
  <div style={{ maxWidth: "var(--aegis-layout-width-x4Small)" }}>
    <FormControl>
      <FormControl.Label>メール *</FormControl.Label>
      <TextField />
    </FormControl>
  </div>
);

const FormControlManualRequiredGood = () => (
  <div style={{ maxWidth: "var(--aegis-layout-width-x4Small)" }}>
    <FormControl required>
      <FormControl.Label>メール</FormControl.Label>
      <TextField />
    </FormControl>
  </div>
);

// AP-ICONBUTTON-001 --------------------------------------------------------
const IconButtonNoTooltipBad = () => (
  <IconButton aria-label="削除">
    <Icon>
      <LfTrash />
    </Icon>
  </IconButton>
);

const IconButtonNoTooltipGood = () => (
  <Tooltip title="削除">
    <IconButton aria-label="削除">
      <Icon>
        <LfTrash />
      </Icon>
    </IconButton>
  </Tooltip>
);

// AP-LINK-001 --------------------------------------------------------------
const LinkIconAsChildBad = () => (
  <Link href="#">
    <Icon>
      <LfSetting />
    </Icon>
    設定
  </Link>
);

const LinkIconAsChildGood = () => (
  <Link
    href="#"
    leading={
      <Icon>
        <LfSetting />
      </Icon>
    }
  >
    設定
  </Link>
);

// AP-MENU-001 --------------------------------------------------------------
const MenuDivTriggerBad = () => (
  <Menu>
    <MenuTrigger>
      <div style={{ cursor: "pointer", padding: "var(--aegis-space-xSmall) var(--aegis-space-small)" }}>
        <Text variant="body.medium">メニューを開く</Text>
      </div>
    </MenuTrigger>
    <MenuContent>
      <MenuGroup>
        <MenuItem>項目1</MenuItem>
        <MenuItem>項目2</MenuItem>
      </MenuGroup>
    </MenuContent>
  </Menu>
);

const MenuDivTriggerGood = () => (
  <Menu>
    <MenuTrigger>
      <Tooltip title="メニュー">
        <IconButton aria-label="メニューを開く" variant="plain">
          <Icon>
            <LfEllipsisDot />
          </Icon>
        </IconButton>
      </Tooltip>
    </MenuTrigger>
    <MenuContent>
      <MenuGroup>
        <MenuItem>項目1</MenuItem>
        <MenuItem>項目2</MenuItem>
      </MenuGroup>
    </MenuContent>
  </Menu>
);

// AP-PAGINATION-001 --------------------------------------------------------
const PaginationCustomBad = () => {
  const [page, setPage] = useState(2);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
      <button
        type="button"
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        style={{ padding: "4px 12px", border: "1px solid #ccc", borderRadius: "4px", background: "white" }}
      >
        前へ
      </button>
      <span>{page} / 10</span>
      <button
        type="button"
        onClick={() => setPage((p) => Math.min(10, p + 1))}
        style={{ padding: "4px 12px", border: "1px solid #ccc", borderRadius: "4px", background: "white" }}
      >
        次へ
      </button>
    </div>
  );
};

const PaginationCustomGood = () => {
  const [page, setPage] = useState(2);
  return <Pagination page={page} pageSize={10} totalCount={100} onChange={setPage} />;
};

// AP-POPOVER-001 -----------------------------------------------------------
const PopoverDivTriggerBad = () => (
  <Popover trigger="hover" arrow>
    <PopoverAnchor>
      <span
        style={{
          cursor: "pointer",
          padding: "var(--aegis-space-xSmall) var(--aegis-space-small)",
          display: "inline-block",
        }}
      >
        <Text variant="body.medium">ホバーで開く</Text>
      </span>
    </PopoverAnchor>
    <PopoverContent width="small">
      <PopoverBody>
        <Text variant="body.small">div トリガーはキーボードユーザーが開けない。</Text>
      </PopoverBody>
    </PopoverContent>
  </Popover>
);

const PopoverDivTriggerGood = () => (
  <Popover trigger="hover" arrow>
    <PopoverAnchor>
      <Button variant="plain">ホバーで開く</Button>
    </PopoverAnchor>
    <PopoverContent width="small">
      <PopoverBody>
        <Text variant="body.small">Button トリガーはキーボードからも開ける。</Text>
      </PopoverBody>
    </PopoverContent>
  </Popover>
);

// AP-SEGMENTEDCONTROL-001 --------------------------------------------------
const SegmentedControlOverflowBad = () => (
  <SegmentedControl>
    <SegmentedControl.Button>項目1</SegmentedControl.Button>
    <SegmentedControl.Button>項目2</SegmentedControl.Button>
    <SegmentedControl.Button>項目3</SegmentedControl.Button>
    <SegmentedControl.Button>項目4</SegmentedControl.Button>
    <SegmentedControl.Button>項目5</SegmentedControl.Button>
    <SegmentedControl.Button>項目6</SegmentedControl.Button>
  </SegmentedControl>
);

const SegmentedControlOverflowGood = () => (
  <SegmentedControl>
    <SegmentedControl.Button>すべて</SegmentedControl.Button>
    <SegmentedControl.Button>有効</SegmentedControl.Button>
    <SegmentedControl.Button>無効</SegmentedControl.Button>
  </SegmentedControl>
);

// AP-SELECT-001 ------------------------------------------------------------
const SelectNoFormControlBad = () => (
  <div style={{ maxWidth: "var(--aegis-layout-width-x4Small)" }}>
    <Select
      placeholder="通貨を選択"
      options={[
        { value: "jpy", label: "JPY" },
        { value: "usd", label: "USD" },
      ]}
    />
  </div>
);

const SelectNoFormControlGood = () => (
  <div style={{ maxWidth: "var(--aegis-layout-width-x4Small)" }}>
    <FormControl>
      <FormControl.Label>通貨</FormControl.Label>
      <Select
        placeholder="通貨を選択"
        options={[
          { value: "jpy", label: "JPY" },
          { value: "usd", label: "USD" },
        ]}
      />
    </FormControl>
  </div>
);

// AP-SNACKBAR-001 ----------------------------------------------------------
const SnackbarForErrorBad = () => (
  <Button
    variant="subtle"
    color="danger"
    onClick={() => snackbar.show({ message: "保存に失敗しました", color: "danger" })}
  >
    Snackbar でエラーを表示（Bad）
  </Button>
);

const SnackbarForErrorGood = () => (
  <Banner color="danger" closeButton={false}>
    保存に失敗しました。再度お試しください。
  </Banner>
);

// AP-SPAN-001 --------------------------------------------------------------
const RawSpanBad = () => <span>テキスト内容</span>;
const RawSpanGood = () => <Text>テキスト内容</Text>;

// AP-STATES-001 ------------------------------------------------------------
const StatesIncompleteBad = () => (
  <TableContainer>
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Cell>名前</Table.Cell>
          <Table.Cell>ID</Table.Cell>
        </Table.Row>
      </Table.Head>
      <Table.Body>{/* data?.map で空。loading / empty / error 未考慮 */}</Table.Body>
    </Table>
  </TableContainer>
);

const StatesIncompleteGood = () => (
  <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
    <div>
      <Text
        variant="label.small.bold"
        color="subtle"
        style={{ display: "block", marginBottom: "var(--aegis-space-xxSmall)" }}
      >
        Loading
      </Text>
      <output aria-busy="true" aria-live="polite" style={{ display: "block" }}>
        <Skeleton width="100%" height={20} />
        <div style={{ height: "var(--aegis-space-xSmall)" }} />
        <Skeleton width="100%" height={20} />
      </output>
    </div>
    <div>
      <Text
        variant="label.small.bold"
        color="subtle"
        style={{ display: "block", marginBottom: "var(--aegis-space-xxSmall)" }}
      >
        Empty
      </Text>
      <EmptyState size="small" title="データがありません" />
    </div>
    <div>
      <Text
        variant="label.small.bold"
        color="subtle"
        style={{ display: "block", marginBottom: "var(--aegis-space-xxSmall)" }}
      >
        Error
      </Text>
      <Banner color="danger" closeButton={false}>
        データの取得に失敗しました
      </Banner>
    </div>
  </div>
);

// AP-STEPPER-001 -----------------------------------------------------------
const StepperTooManyBad = () => (
  <Stepper>
    <Stepper.Item title="Step 1" status="completed" />
    <Stepper.Item title="Step 2" status="completed" />
    <Stepper.Item title="Step 3" status="completed" />
    <Stepper.Item title="Step 4" />
    <Stepper.Item title="Step 5" />
    <Stepper.Item title="Step 6" />
    <Stepper.Item title="Step 7" />
    <Stepper.Item title="Step 8" />
  </Stepper>
);

const StepperTooManyGood = () => (
  <Stepper>
    <Stepper.Item title="基本情報" status="completed" />
    <Stepper.Item title="詳細設定" />
    <Stepper.Item title="確認" />
  </Stepper>
);

// AP-TABLE-001 -------------------------------------------------------------
const TableNoHeadBad = () => (
  <TableContainer>
    <Table>
      <Table.Body>
        <Table.Row>
          <Table.Cell>田中太郎</Table.Cell>
          <Table.Cell>tanaka@example.com</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>佐藤花子</Table.Cell>
          <Table.Cell>sato@example.com</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </TableContainer>
);

const TableNoHeadGood = () => (
  <TableContainer>
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Cell>名前</Table.Cell>
          <Table.Cell>メール</Table.Cell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>田中太郎</Table.Cell>
          <Table.Cell>tanaka@example.com</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>佐藤花子</Table.Cell>
          <Table.Cell>sato@example.com</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </TableContainer>
);

// AP-TABLE-002 -------------------------------------------------------------
const TableButtonInCellBad = () => (
  <TableContainer>
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Cell>名前</Table.Cell>
          <Table.Cell>操作</Table.Cell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>田中太郎</Table.Cell>
          <Table.Cell>
            <Button size="xSmall">編集</Button>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </TableContainer>
);

const TableButtonInCellGood = () => (
  <TableContainer>
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Cell>名前</Table.Cell>
          <Table.ActionCell />
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>田中太郎</Table.Cell>
          <Table.ActionCell>
            <Tooltip title="編集">
              <IconButton aria-label="編集" size="xSmall" variant="plain">
                <Icon>
                  <LfPen />
                </Icon>
              </IconButton>
            </Tooltip>
          </Table.ActionCell>
        </Table.Row>
      </Table.Body>
    </Table>
  </TableContainer>
);

// AP-TABS-001 --------------------------------------------------------------
const TabsAsNavBad = () => (
  <Tab.Group>
    <Tab.List>
      <Tab>概要 (/overview)</Tab>
      <Tab>詳細 (/detail)</Tab>
      <Tab>設定 (/settings)</Tab>
    </Tab.List>
  </Tab.Group>
);

const TabsAsNavGood = () => (
  <NavList style={{ width: "var(--aegis-layout-width-x5Small)" }}>
    <NavList.Item as="a" href="#overview">
      概要
    </NavList.Item>
    <NavList.Item as="a" href="#detail">
      詳細
    </NavList.Item>
    <NavList.Item as="a" href="#settings">
      設定
    </NavList.Item>
  </NavList>
);

// AP-TOOLTIP-001 -----------------------------------------------------------
const longText =
  "この行はとても長いタイトルです。コンテナの幅を超えると省略され、ホバー時にフルテキストが見えないと困ります。";

const TooltipOverflowBad = () => (
  <div style={{ maxWidth: "var(--aegis-layout-width-x3Small)" }}>
    <Text variant="body.medium" numberOfLines={1}>
      {longText}
    </Text>
  </div>
);

const TooltipOverflowGood = () => (
  <div style={{ maxWidth: "var(--aegis-layout-width-x3Small)" }}>
    <Tooltip title={longText} onlyOnOverflow placement="top-start">
      <Text variant="body.medium" numberOfLines={1}>
        {longText}
      </Text>
    </Tooltip>
  </div>
);

// Registry -----------------------------------------------------------------
export const antiPatternDemos: Record<string, AntiPatternDemo> = {
  "AP-BADGE-001": {
    bad: BadgeAsLabelBad,
    good: BadgeAsLabelGood,
    badNote: "Badge にテキストや日時を入れている。数値も children として渡している。",
    goodNote: "ラベルは Tag、補足文は Text、件数は Badge の count prop に渡す。",
  },
  "AP-BANNER-001": {
    bad: BannerWithIconBad,
    good: BannerWithIconGood,
    badNote: "color prop で自動表示されるアイコンに加えて手動アイコンが並び、二重表示になる。",
    goodNote: "color prop に任せる。children にはメッセージのみ。",
  },
  "AP-BANNER-002": {
    bad: BannerColorMismatchBad,
    good: BannerColorMismatchGood,
    badNote: "エラーメッセージなのに color が information（青系）になっており、深刻度が伝わらない。",
    goodNote: 'エラーは color="danger" を使い、視覚的にもセマンティクスとしても危険を示す。',
  },
  "AP-BUTTON-002": {
    bad: ButtonInlineWidthBad,
    good: ButtonInlineWidthGood,
    badNote: "style.width で固定値を当てるとレスポンシブが壊れる。",
    goodNote: 'width="full" を使えば親幅に追従する。',
  },
  "AP-BUTTON-003": {
    bad: MultipleSolidBad,
    good: MultipleSolidGood,
    badNote: "solid Button が 2 つあり、どちらがプライマリかわからない。",
    goodNote: "プライマリは solid 1 つ。副次アクションは plain や subtle に下げる。",
  },
  "AP-BUTTON-004": {
    bad: ButtonLeadingInteractiveBad,
    good: ButtonLeadingInteractiveGood,
    badNote: "Button の中にネストされた IconButton（ボタン in ボタン）。フォーカスとクリック領域が衝突する。",
    goodNote: "leading にはアイコンのみ。インタラクティブ要素は外に出す。",
  },
  "AP-BUTTON-005": {
    bad: ButtonStyleOverrideBad,
    good: ButtonStyleOverrideGood,
    badNote: "背景色・ボーダー・影を直接上書きしている。ダークモードやテーマ変更で壊れる。",
    goodNote: "variant と color prop に任せる。ブランドカラーが Aegis 全体で一貫する。",
  },
  "AP-BUTTON-006": {
    bad: DangerForCancelBad,
    good: DangerForCancelGood,
    badNote: 'キャンセルに color="danger"。ユーザーは無害なボタンに警戒感を覚える。',
    goodNote: "danger は不可逆な操作（削除など）にだけ使う。キャンセルは plain。",
  },
  "AP-CARD-001": {
    bad: CardOverInteractiveBad,
    good: CardOverInteractiveGood,
    badNote: "Card 全体がクリック可能なのに、中にもボタンと Link がある。キーボード操作とイベント伝播が複雑化。",
    goodNote: "CardHeader / Body / Footer の構造を使い、アクションは Footer の ButtonGroup に集約する。",
  },
  "AP-CHECKBOX-001": {
    bad: CheckboxNoFormControlBad,
    good: CheckboxNoFormControlGood,
    badNote: "FormControl の外に置くと、エラー状態や required prop での統一管理ができない。",
    goodNote: "FormControl でラップし、フォームのライフサイクルに乗せる。",
  },
  "AP-COMBOBOX-001": {
    bad: ComboboxNoFormControlBad,
    good: ComboboxNoFormControlGood,
    badNote: "ラベルが無く、スクリーンリーダーがフィールドの目的を読み上げられない（WCAG 3.3.2）。",
    goodNote: "FormControl.Label でラベルを付ける。",
  },
  "AP-CONTENTHEADER-001": {
    bad: ContentHeaderTrailingActionBad,
    good: ContentHeaderTrailingActionGood,
    badNote: "Dialog のメインアクション「保存」がヘッダー右端にあり、ユーザーが見落としやすい。",
    goodNote: "メインアクションは DialogFooter に集約する。",
  },
  "AP-CUSTOM-UI-001": {
    bad: CustomUiBad,
    good: CustomUiGood,
    badNote: "生の input / button。フォーカスリングや disabled スタイル、サイズトークンが Aegis と一致しない。",
    goodNote: "TextField + Button を使い、デザイントークン・a11y・キーボード操作を Aegis に任せる。",
  },
  "AP-DATEFIELD-001": {
    bad: DateFieldNoFormControlBad,
    good: DateFieldNoFormControlGood,
    badNote: "ラベルが無く、何の日付を入力するフィールドかわからない（WCAG 3.3.2）。",
    goodNote: "FormControl.Label で目的を明示する。",
  },
  "AP-DIALOG-001": { kind: "custom", render: DialogNoHeaderPreview },
  "AP-DIALOG-002": { kind: "custom", render: DialogBannerInBodyPreview },
  "AP-DIALOG-003": { kind: "custom", render: DialogMultipleSolidPreview },
  "AP-DIALOG-004": { kind: "custom", render: DialogFullscreenComplexPreview },
  "AP-DRAWER-001": {
    bad: DrawerNoHeaderBad,
    good: DrawerNoHeaderGood,
    badNote: "Drawer のヘッダーが無く、目的とタイトルが視覚的・支援技術的に伝わらない。",
    goodNote: "Drawer.Header でタイトルを明示し、閉じるボタンも自動提供される。",
  },
  "AP-DRAWER-002": {
    bad: DrawerDoubleCloseBad,
    good: DrawerDoubleCloseGood,
    badNote: "Drawer.Header が自動で出す閉じるボタンに加え、ContentHeader.trailing でも閉じるボタンを置いている。",
    goodNote: "閉じるボタンは Drawer.Header の自動提供分のみに任せる。",
  },
  "AP-EMPTYSTATE-001": {
    bad: EmptyStateNoTitleBad,
    good: EmptyStateNoTitleGood,
    badNote: "title が無いと支援技術に「何が空なのか」が伝わらない。",
    goodNote: "title で文脈を明示し、children で補足説明をする。",
  },
  "AP-FORMCONTROL-001": {
    bad: FormControlMissingBad,
    good: FormControlMissingGood,
    badNote: "ラベルなしの素の TextField / Select。何を入力する欄かわからない。",
    goodNote: "FormControl + FormControl.Label でラベルを明示する。",
  },
  "AP-FORMCONTROL-002": {
    bad: FormControlNoLabelBad,
    good: FormControlNoLabelGood,
    badNote: "FormControl はあるが Label が無い。スクリーンリーダーがフィールドの目的を伝えられない。",
    goodNote: "FormControl.Label を必ず含める。",
  },
  "AP-FORMCONTROL-003": {
    bad: FormControlErrorNoCaptionBad,
    good: FormControlErrorNoCaptionGood,
    badNote: "赤くなっているが、何のエラーかわからずユーザーは修正できない。",
    goodNote: "FormControl.Caption でエラー内容を具体的に伝える。",
  },
  "AP-FORMCONTROL-004": {
    bad: FormControlManualRequiredBad,
    good: FormControlManualRequiredGood,
    badNote: "ラベルに「*」を手書きしている。スクリーンリーダーには必須として伝わらない。",
    goodNote: "FormControl の required prop を使う。スタイルも a11y も自動で揃う。",
  },
  "AP-ICONBUTTON-001": {
    bad: IconButtonNoTooltipBad,
    good: IconButtonNoTooltipGood,
    badNote: "ホバーしてもラベルが表示されず、視覚的に目的が伝わらない。",
    goodNote: "Tooltip でラップしてホバー時にラベルを表示する。",
  },
  "AP-LINK-001": {
    bad: LinkIconAsChildBad,
    good: LinkIconAsChildGood,
    badNote: "Icon を children に直接書くと、Link の内部レイアウトに乗らず縦位置がずれる。",
    goodNote: "leading prop でアイコンを渡す。Link 側で間隔と位置を制御してくれる。",
  },
  "AP-MENU-001": {
    bad: MenuDivTriggerBad,
    good: MenuDivTriggerGood,
    badNote: "div トリガーはキーボードユーザーが Tab で到達できず、Enter / Space でも開けない。",
    goodNote: "IconButton や Button をトリガーにする。Tooltip でラベルも補足。",
  },
  "AP-PAGINATION-001": {
    bad: PaginationCustomBad,
    good: PaginationCustomGood,
    badNote: "自前の prev/next ボタン。総数・現在ページの構造、a11y、キーボード操作が不十分。",
    goodNote: "Aegis Pagination を使う。情報量・操作性・a11y がまとめて担保される。",
  },
  "AP-POPOVER-001": {
    bad: PopoverDivTriggerBad,
    good: PopoverDivTriggerGood,
    badNote: "div トリガーはキーボード操作不能。フォーカスリングも出ない。",
    goodNote: "Button トリガーにする。フォーカスもキーボード操作も自動で動く。",
  },
  "AP-SEGMENTEDCONTROL-001": {
    bad: SegmentedControlOverflowBad,
    good: SegmentedControlOverflowGood,
    badNote: "選択肢が 6 つ。横幅を圧迫し、ラベルも判別しにくい。",
    goodNote: "5 つ以下に絞る。多い場合は Select や Tabs を検討する。",
  },
  "AP-SELECT-001": {
    bad: SelectNoFormControlBad,
    good: SelectNoFormControlGood,
    badNote: "ラベル無しの素の Select。何を選ぶプルダウンかわからない。",
    goodNote: "FormControl + Label で目的を明示する。",
  },
  "AP-SNACKBAR-001": {
    bad: SnackbarForErrorBad,
    good: SnackbarForErrorGood,
    badNote: "エラーを Snackbar で流すと数秒で消え、ユーザーが見逃すか操作できない。",
    goodNote: "重要なエラーは Banner で常時表示し、ユーザーが対応できる時間を確保する。",
  },
  "AP-SPAN-001": {
    bad: RawSpanBad,
    good: RawSpanGood,
    badNote: "生の span。タイポグラフィトークンが当たらず、フォント・色・行間がバラつく。",
    goodNote: "Text を使う。variant でタイポグラフィが揃う。",
  },
  "AP-STATES-001": {
    bad: StatesIncompleteBad,
    good: StatesIncompleteGood,
    badNote: "success の状態しか描画していない。読み込み中・空・エラーが区別できない。",
    goodNote: "Skeleton (loading) / EmptyState (empty) / Banner (error) の 3 状態を明示的に実装する。",
  },
  "AP-STEPPER-001": {
    bad: StepperTooManyBad,
    good: StepperTooManyGood,
    badNote: "8 ステップ。横に伸びすぎて、各ステップが何かを覚えていられない。",
    goodNote: "7 以下に絞る。論理単位でグループ化して各ステップに意味を持たせる。",
  },
  "AP-TABLE-001": {
    bad: TableNoHeadBad,
    good: TableNoHeadGood,
    badNote: "ヘッダー行が無く、列が何を表すか判別できない（WCAG 1.3.1）。",
    goodNote: "Table.Head を必ず含めて列の意味を明示する。",
  },
  "AP-TABLE-002": {
    bad: TableButtonInCellBad,
    good: TableButtonInCellGood,
    badNote: "通常 Cell に Button を直接置くと、行の縦位置・余白が崩れ、操作領域の意味づけも曖昧になる。",
    goodNote: "Table.ActionCell に置き、IconButton + Tooltip でアクション列だと明示する。",
  },
  "AP-TABS-001": {
    bad: TabsAsNavBad,
    good: TabsAsNavGood,
    badNote: "Tabs はページ内の表示切替用。URL 遷移に使うとブラウザの戻る・履歴と整合しない。",
    goodNote: "ページ遷移には NavList や SideNavigation を使う。",
  },
  "AP-TOOLTIP-001": {
    bad: TooltipOverflowBad,
    good: TooltipOverflowGood,
    badNote: "省略されたテキスト全文を確認する手段が無い。ホバーしても何も出ない。",
    goodNote: "Tooltip onlyOnOverflow でラップすると、省略時のみフルテキストが表示される。",
  },
};
`;export{e as default};