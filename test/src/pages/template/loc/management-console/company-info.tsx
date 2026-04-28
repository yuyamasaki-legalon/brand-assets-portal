import { LfPlusLarge, LfTrash } from "@legalforce/aegis-icons";
import {
  Accordion,
  Banner,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  ContentHeader,
  ContentHeaderTitle,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Divider,
  Form,
  FormControl,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
  Textarea,
  TextField,
  Tooltip,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { LocSidebarLayout } from "../_shared";
import { ManagementConsoleNavList } from "./_shared/ManagementConsoleNavList";

// Mock company data
const MOCK_COMPANIES = [
  {
    id: "company-1",
    name: "自社名",
    companyName: "株式会社サンプル",
    companyNameEn: "",
    otherNames: "",
    representative: "",
    businessDescription: "",
    address: "",
    isRelatedCompany: false,
  },
  {
    id: "company-2",
    name: "関連会社A",
    companyName: "関連会社A",
    companyNameEn: "",
    otherNames: "",
    representative: "",
    businessDescription: "",
    address: "",
    isRelatedCompany: true,
  },
  {
    id: "company-3",
    name: "関連会社B",
    companyName: "関連会社B",
    companyNameEn: "",
    otherNames: "",
    representative: "",
    businessDescription: "",
    address: "",
    isRelatedCompany: true,
  },
];

/** 自社情報ページ。 */
export const ManagementConsoleCompanyInfo = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  return (
    <LocSidebarLayout activeId="others">
      <PageLayout>
        <ManagementConsoleNavList activePage="company-info" />

        <PageLayoutContent>
          <PageLayoutHeader>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-medium)",
              }}
            >
              <ContentHeader>
                <ContentHeaderTitle>自社情報</ContentHeaderTitle>
              </ContentHeader>
              <Text variant="caption.medium">
                登録した情報は、契約書情報の自動抽出など、AI機能の精度を向上させるための情報として利用されます。
              </Text>
            </div>
          </PageLayoutHeader>
          <PageLayoutBody>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-large)",
              }}
            >
              <CompanyInfoImportStatusBanner />

              {/* 自動登録カード */}
              <AutoRegistrationCard />

              {/* 項目を設定ボタン */}
              <Button variant="subtle">項目を設定</Button>

              <Divider />

              {/* 会社一覧（アコーディオン） */}
              <Accordion multiple defaultIndex={[0]} bordered>
                {MOCK_COMPANIES.map((company) => (
                  <CompanyAccordionItem key={company.id} company={company} />
                ))}
              </Accordion>

              {/* 会社を追加ボタン */}
              <Button variant="subtle" width="full">
                さらに表示
              </Button>

              <Button variant="subtle" width="full" leading={LfPlusLarge} onClick={() => setAddDialogOpen(true)}>
                会社を追加
              </Button>

              <Divider />

              {/* CSV一括登録ボタン */}
              <Button variant="subtle">CSVで会社情報を一括登録</Button>
            </div>

            {/* 会社追加ダイアログ */}
            <AddCompanyDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
};

const CompanyInfoImportStatusBanner = () => (
  <Banner
    color="information"
    closeButton={false}
    action={<Button>再読み込み</Button>}
    aria-label="取り込みを開始しました"
  >
    <Text whiteSpace="pre-wrap">
      取り込みを開始しました。時間をおいて画面を更新してください。
      {"\n"}
      取り込みが完了するまでは、自社情報の編集はできません。
    </Text>
  </Banner>
);

// 自動登録カード
const AutoRegistrationCard = () => (
  <Card variant="outline">
    <CardBody>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--aegis-space-medium)",
        }}
      >
        <Text variant="body.medium">自社情報の自動登録はまだ行われていません</Text>
        <Button variant="subtle">自動で情報を更新</Button>
      </div>
    </CardBody>
  </Card>
);

// 会社アコーディオンアイテム
interface CompanyAccordionItemProps {
  company: (typeof MOCK_COMPANIES)[number];
}

const CompanyAccordionItem = ({ company }: CompanyAccordionItemProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <Accordion.Item>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Accordion.Button iconPosition="start">
          <Text variant="label.medium.bold">{company.name}</Text>
        </Accordion.Button>
        {company.isRelatedCompany && (
          <Tooltip title={`${company.name}を削除`}>
            <IconButton
              size="small"
              variant="plain"
              color="danger"
              aria-label={`${company.name}を削除`}
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Icon>
                <LfTrash />
              </Icon>
            </IconButton>
          </Tooltip>
        )}
      </div>
      <Accordion.Panel>
        <CompanyForm company={company} />
      </Accordion.Panel>

      {/* 削除ダイアログ */}
      {company.isRelatedCompany && (
        <DeleteCompanyDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} companyName={company.name} />
      )}
    </Accordion.Item>
  );
};

// 会社フォーム
const CompanyForm = ({ company }: { company: (typeof MOCK_COMPANIES)[number] }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--aegis-space-medium)",
    }}
  >
    <Form>
      <FormControl required>
        <FormControl.Label>会社名</FormControl.Label>
        <TextField defaultValue={company.companyName} placeholder="会社名を入力" />
      </FormControl>
      <FormControl>
        <FormControl.Label>英語会社名</FormControl.Label>
        <TextField defaultValue={company.companyNameEn} placeholder="英語の会社名を入力" />
      </FormControl>
      <FormControl>
        <FormControl.Label>その他の会社名</FormControl.Label>
        <Textarea defaultValue={company.otherNames} placeholder="その他の会社名を入力" />
      </FormControl>
      <FormControl>
        <FormControl.Label>代表者名</FormControl.Label>
        <Textarea defaultValue={company.representative} placeholder="代表者名を入力" />
      </FormControl>
      <FormControl>
        <FormControl.Label>事業内容</FormControl.Label>
        <Textarea defaultValue={company.businessDescription} placeholder="事業内容を入力" />
      </FormControl>
      <FormControl>
        <FormControl.Label>住所</FormControl.Label>
        <Textarea defaultValue={company.address} placeholder="住所を入力" />
      </FormControl>
    </Form>
  </div>
);

// 会社追加ダイアログ
const AddCompanyDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [name, setName] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent width="large">
        <DialogHeader>
          <ContentHeader>
            <ContentHeaderTitle>会社を追加</ContentHeaderTitle>
          </ContentHeader>
        </DialogHeader>
        <DialogBody>
          <Form>
            <FormControl required>
              <FormControl.Label>会社名</FormControl.Label>
              <TextField value={name} onChange={(e) => setName(e.target.value)} placeholder="会社名を入力" clearable />
            </FormControl>
          </Form>
        </DialogBody>
        <DialogFooter>
          <ButtonGroup>
            <Button variant="plain" onClick={() => onOpenChange(false)}>
              キャンセル
            </Button>
            <Button disabled={!name.trim()} onClick={() => onOpenChange(false)}>
              追加
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// 会社削除ダイアログ
const DeleteCompanyDialog = ({
  open,
  onOpenChange,
  companyName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyName: string;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent width="large">
      <DialogHeader>
        <ContentHeader>
          <ContentHeaderTitle>会社を削除しますか？</ContentHeaderTitle>
        </ContentHeader>
      </DialogHeader>
      <DialogBody>
        <div
          style={{
            padding: "var(--aegis-space-medium)",
            backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
            borderRadius: "var(--aegis-radius-medium)",
          }}
        >
          <Text variant="data.medium.bold">{companyName}</Text>
        </div>
      </DialogBody>
      <DialogFooter>
        <ButtonGroup>
          <Button variant="plain" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button color="danger" onClick={() => onOpenChange(false)}>
            削除
          </Button>
        </ButtonGroup>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
