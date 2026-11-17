import {
  Banner,
  Button,
  ButtonGroup,
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogStickyContainer,
  FormControl,
  NavList,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Select,
  Table,
  TableContainer,
  Text,
  TextField,
} from "@legalforce/aegis-react";
import { useRef, useState } from "react";
import styles from "./catalog-admin.module.css";
import type { Catalog, CatalogAsset, Product } from "./catalog-types";
import { getDriveDownloadLink, getDriveFileId } from "./drive-file";
import { compareProductFilters } from "./product-filter-order";
import { useCatalog } from "./use-catalog";

export function CatalogManagement({ onClose }: { onClose: () => void }) {
  const api = useCatalog("admin");
  return <CatalogAdmin {...api} onClose={onClose} />;
}

type Props = {
  catalog: Catalog;
  connected: boolean;
  canEdit: boolean;
  error: string;
  save: (data: Catalog) => Promise<Catalog>;
  reload: () => Promise<void>;
  onClose: () => void;
  authMode: "local" | "production" | "unavailable";
  email: string;
  needsLogin: boolean;
  login: () => void;
  logout: () => Promise<void>;
};
const publicationLabel = { draft: "下書き", published: "公開中" };
const productStates = [
  { value: "active", label: "提供中（フィルターに表示）" },
  { value: "ended", label: "終了（フィルターから非表示）" },
];
const formatOptions = ["PNG", "JPG", "SVG", "PDF", "AI", "PSD", "PPT", "MP4"].map((value) => ({ value, label: value }));

export default function CatalogAdmin({
  catalog,
  connected: apiConnected,
  canEdit,
  error,
  save,
  reload,
  onClose,
  authMode,
  email,
  needsLogin,
  login,
  logout,
}: Props) {
  const connected = apiConnected && canEdit;
  const [section, setSection] = useState("assets");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [asset, setAsset] = useState<CatalogAsset | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [baseRevision, setBaseRevision] = useState(catalog.revision);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ asset: CatalogAsset; revision: number } | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const thumbnailInput = useRef<HTMLInputElement>(null);
  const products = [...catalog.products].sort((a, b) => a.order - b.order);
  const filtered = catalog.assets.filter((a) =>
    `${a.title} ${a.brand} ${products.find((p) => p.id === a.brand)?.label || ""} ${a.assetType}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const displayed = filtered.slice(page * 20, (page + 1) * 20);
  const [confirmEnd, setConfirmEnd] = useState(false);

  function editAsset(a: CatalogAsset) {
    setAsset({
      ...a,
      driveUrl: getDriveFileId(a.driveUrl)
        ? a.driveUrl
        : a.driveId
          ? `https://drive.google.com/file/d/${a.driveId}/view`
          : a.driveUrl,
    });
    setBaseRevision(catalog.revision);
    setMessage("");
  }
  function editProduct(p: Product) {
    setProduct({ ...p });
    setBaseRevision(catalog.revision);
    setConfirmEnd(false);
    setMessage("");
  }
  async function persist(next: Catalog, done: () => void) {
    setBusy(true);
    setMessage("");
    try {
      await save(next);
      done();
      setMessage("保存しました。公開データとフィルターに反映されています。");
      setFailed(false);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "保存できません。");
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }
  async function saveAsset() {
    if (!asset) return;
    if (!asset.title.trim() || !asset.assetType.trim()) {
      setMessage("名前とカテゴリを入力してください。");
      setFailed(true);
      return;
    }
    if (asset.publication === "published" && catalog.products.find((p) => p.id === asset.brand)?.state === "ended") {
      setMessage("終了したプロダクトには公開できません。下書きで保存するかプロダクトを再開してください。");
      setFailed(true);
      return;
    }
    const driveId = getDriveFileId(asset.driveUrl);
    if (!driveId) {
      setMessage("Google Driveのファイルリンクを入力してください。フォルダーや他サイトのリンクは登録できません。");
      setFailed(true);
      return;
    }
    const next = {
      ...asset,
      title: asset.title.trim(),
      driveUrl: asset.driveUrl?.trim(),
      driveId,
      downloadUrl: getDriveDownloadLink(driveId),
      updatedAt: new Date().toISOString(),
    };
    await persist(
      {
        ...catalog,
        revision: baseRevision,
        assets: catalog.assets.some((a) => a.id === next.id)
          ? catalog.assets.map((a) => (a.id === next.id ? next : a))
          : [...catalog.assets, next],
      },
      () => setAsset(null),
    );
  }
  async function deleteAsset() {
    if (!deleteTarget || busy || !connected) return;
    setBusy(true);
    setDeleteError("");
    try {
      const next = {
        ...catalog,
        revision: deleteTarget.revision,
        assets: catalog.assets.filter((a) => a.id !== deleteTarget.asset.id),
        deletedAssetIds: [deleteTarget.asset.id],
      };
      await save(next);
      setPage(0);
      setDeleteTarget(null);
      setMessage("掲載を削除しました。Google Driveの原本は削除していません。");
      setFailed(false);
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "掲載を削除できませんでした。");
    } finally {
      setBusy(false);
    }
  }
  async function saveProduct() {
    if (!product) return;
    const existing = catalog.products.find((p) => p.id === product.id);
    if (existing?.state === "active" && product.state === "ended" && !confirmEnd) {
      setConfirmEnd(true);
      return;
    }
    await persist(
      {
        ...catalog,
        revision: baseRevision,
        products: existing
          ? catalog.products.map((p) => (p.id === product.id ? product : p))
          : [...catalog.products, product],
      },
      () => {
        setProduct(null);
        setConfirmEnd(false);
      },
    );
  }
  const field = (
    label: string,
    key: "title" | "assetType" | "driveUrl" | "thumbnailUrl" | "description" | "usageRights" | "owner" | "expiresAt",
    required = false,
  ) =>
    asset && (
      <FormControl required={required}>
        <FormControl.Label>{label}</FormControl.Label>
        <TextField
          value={asset[key] || ""}
          type={key === "expiresAt" ? "date" : "text"}
          onChange={(e) => setAsset({ ...asset, [key]: e.target.value })}
        />
      </FormControl>
    );
  return (
    <PageLayout>
      <PageLayoutPane position="start" open width="medium">
        <PageLayoutHeader>
          <Text as="h2" variant="title.medium">
            アセット管理
          </Text>
        </PageLayoutHeader>
        <PageLayoutBody>
          <NavList>
            <NavList.Item
              aria-current={section === "assets" ? "page" : undefined}
              onClick={() => {
                setSection("assets");
                setAsset(null);
                setProduct(null);
              }}
            >
              アセット
            </NavList.Item>
            <NavList.Item
              aria-current={section === "products" ? "page" : undefined}
              onClick={() => {
                setSection("products");
                setAsset(null);
                setProduct(null);
              }}
            >
              プロダクト・フィルター
            </NavList.Item>
          </NavList>
          <Button variant="plain" disabled={busy} onClick={onClose}>
            ポータルへ戻る
          </Button>
        </PageLayoutBody>
      </PageLayoutPane>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>
              {section === "assets" ? "アセットの登録・公開" : "プロダクト・フィルター管理"}
            </ContentHeaderTitle>
            <ContentHeaderDescription>
              {section === "assets"
                ? "登録した素材は、公開するとポータルに表示されます。"
                : "提供中のプロダクトを左フィルターに表示します。終了しても素材は保存されます。"}
            </ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div className={styles.stack}>
            <Banner color={connected ? "information" : "warning"} closeButton={false}>
              <Text>
                {connected
                  ? authMode === "production"
                    ? `会社Googleアカウントでログイン中：${email}。保存内容は共有カタログに反映されます。`
                    : "ローカル開発環境：データはこのPCに保存されます。本番には自動反映されません。"
                  : apiConnected && !canEdit
                    ? "閲覧専用です。CMSの変更権限は管理担当者に限定されています。"
                    : error || "管理APIに接続中です。"}
              </Text>
            </Banner>
            {message && (
              <Banner color={failed ? "danger" : "success"} closeButton={false}>
                <Text role="status">{message}</Text>
              </Banner>
            )}
            <div className={styles.actions}>
              {authMode === "production" && needsLogin && (
                <Button variant="solid" onClick={login}>
                  会社のGoogleアカウントでログイン
                </Button>
              )}
              {authMode === "production" && email && (
                <Button variant="plain" disabled={busy} onClick={() => void logout()}>
                  ログアウト
                </Button>
              )}
              <Button variant="plain" disabled={busy} onClick={() => void reload()}>
                最新データを読み込む
              </Button>
              {!asset && !product && !needsLogin && (
                <Button
                  variant="solid"
                  disabled={!connected || busy}
                  onClick={() => {
                    if (section === "assets")
                      editAsset({
                        id: `cms-${crypto.randomUUID()}`,
                        title: "",
                        brand: products.find((p) => p.state === "active")?.id || "Shared",
                        assetType: "ロゴ",
                        fileFormat: "PNG",
                        status: "current",
                        publication: "draft",
                        assetDomain: "brand",
                        updatedAt: new Date().toISOString(),
                      });
                    else
                      editProduct({
                        id: `product-${crypto.randomUUID()}`,
                        label: "",
                        state: "active",
                        order: products.length,
                      });
                  }}
                >
                  {section === "assets" ? "アセットを登録" : "プロダクトを追加"}
                </Button>
              )}
            </div>

            {asset ? (
              <div className={styles.editor}>
                <Text as="h3" variant="title.medium">
                  {catalog.assets.some((a) => a.id === asset.id) ? "アセットを編集" : "新しいアセット"}
                </Text>
                <div className={styles.fields}>
                  {field("アセット名", "title", true)}
                  <FormControl required>
                    <FormControl.Label>プロダクト</FormControl.Label>
                    <Select
                      options={[...products].sort(compareProductFilters).map((p) => ({
                        value: p.id,
                        label: `${p.label}${p.state === "ended" ? "（終了）" : ""}`,
                      }))}
                      value={asset.brand}
                      onChange={(value) => setAsset({ ...asset, brand: value })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>領域</FormControl.Label>
                    <Select
                      options={[
                        { value: "brand", label: "ブランド" },
                        { value: "corporate", label: "コーポレート" },
                      ]}
                      value={asset.assetDomain || "brand"}
                      onChange={(value) => setAsset({ ...asset, assetDomain: value as CatalogAsset["assetDomain"] })}
                    />
                  </FormControl>
                  {field("カテゴリ", "assetType", true)}
                  <FormControl>
                    <FormControl.Label>ファイル形式</FormControl.Label>
                    <Select
                      options={formatOptions}
                      value={asset.fileFormat}
                      onChange={(value) => setAsset({ ...asset, fileFormat: value as CatalogAsset["fileFormat"] })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>公開状態</FormControl.Label>
                    <Select
                      options={[
                        { value: "draft", label: "下書き" },
                        { value: "published", label: "公開" },
                      ]}
                      value={asset.publication || "published"}
                      onChange={(value) => setAsset({ ...asset, publication: value as CatalogAsset["publication"] })}
                    />
                  </FormControl>
                  {field("Google Driveのファイルリンク", "driveUrl", true)}
                  {field("説明", "description")}
                  {field("管理担当", "owner")}
                  {field("利用条件・加工可否", "usageRights")}
                  {field("利用期限（空欄で期限なし）", "expiresAt")}
                  <FormControl>
                    <FormControl.Label>素材の状態</FormControl.Label>
                    <Select
                      options={[
                        { value: "current", label: "現行" },
                        { value: "deprecated", label: "非推奨" },
                        { value: "archived", label: "アーカイブ" },
                      ]}
                      value={asset.status}
                      onChange={(value) => setAsset({ ...asset, status: value as CatalogAsset["status"] })}
                    />
                  </FormControl>
                  {field("サムネイルURL（HTTPS）", "thumbnailUrl")}
                </div>
                <Text color="subtle">
                  画像は下のボタンから登録できます。資料・動画などの原本はGoogle
                  Driveへ置き、ファイルリンクを必ず指定してください。ダウンロード先はこのリンクから自動設定されます。
                </Text>
                <input
                  ref={thumbnailInput}
                  className={styles.fileInput}
                  type="file"
                  accept="image/png,image/jpeg"
                  aria-label="サムネイル画像"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 512 * 1024 || !["image/png", "image/jpeg"].includes(file.type)) {
                      setFailed(true);
                      setMessage("サムネイルは512KB以下のPNGまたはJPGを選んでください。");
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = () => setAsset({ ...asset, thumbnailUrl: String(reader.result) });
                    reader.readAsDataURL(file);
                  }}
                />
                <Button variant="subtle" onClick={() => thumbnailInput.current?.click()}>
                  サムネイル画像を登録
                </Button>
                {asset.thumbnailUrl && (
                  <img
                    className={styles.preview}
                    src={asset.thumbnailUrl}
                    alt={`${asset.title || "登録素材"}のサムネイル`}
                  />
                )}
                <ButtonGroup>
                  <Button variant="plain" disabled={busy} onClick={() => setAsset(null)}>
                    キャンセル
                  </Button>
                  <Button variant="solid" loading={busy} disabled={!connected} onClick={() => void saveAsset()}>
                    保存して反映
                  </Button>
                </ButtonGroup>
              </div>
            ) : product ? (
              <div className={styles.editor}>
                <Text as="h3" variant="title.medium">
                  プロダクトを編集
                </Text>
                <FormControl required>
                  <FormControl.Label>表示名</FormControl.Label>
                  <TextField
                    value={product.label}
                    onChange={(e) => setProduct({ ...product, label: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <FormControl.Label>状態</FormControl.Label>
                  <Select
                    options={productStates}
                    value={product.state}
                    onChange={(value) => {
                      setProduct({ ...product, state: value as Product["state"] });
                      setConfirmEnd(false);
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormControl.Label>表示順（小さい順）</FormControl.Label>
                  <TextField
                    type="number"
                    value={String(product.order)}
                    onChange={(e) => setProduct({ ...product, order: Number(e.target.value) })}
                  />
                </FormControl>
                <Text>
                  {catalog.assets.filter((a) => a.brand === product.id).length}
                  件の関連素材があります。名前を変更しても素材との紐づけは維持されます。
                </Text>
                {confirmEnd && (
                  <Banner color="warning" closeButton={false}>
                    <Text>
                      このプロダクトをフィルターと通常一覧から非表示にします。関連素材は保持され、「提供中」に戻すと再表示できます。
                    </Text>
                  </Banner>
                )}
                <ButtonGroup>
                  <Button variant="plain" disabled={busy} onClick={() => setProduct(null)}>
                    キャンセル
                  </Button>
                  <Button variant="solid" loading={busy} disabled={!connected} onClick={() => void saveProduct()}>
                    {confirmEnd ? "終了して非表示にする" : "保存して反映"}
                  </Button>
                </ButtonGroup>
              </div>
            ) : section === "products" ? (
              <TableContainer>
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Cell>表示名</Table.Cell>
                      <Table.Cell>状態</Table.Cell>
                      <Table.Cell>表示順</Table.Cell>
                      <Table.Cell>素材数</Table.Cell>
                      <Table.ActionCell />
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {products.map((p) => (
                      <Table.Row key={p.id}>
                        <Table.Cell>{p.label}</Table.Cell>
                        <Table.Cell>{p.state === "active" ? "提供中" : "終了・非表示"}</Table.Cell>
                        <Table.Cell>{p.order}</Table.Cell>
                        <Table.Cell>{catalog.assets.filter((a) => a.brand === p.id).length}</Table.Cell>
                        <Table.ActionCell>
                          <Button variant="subtle" disabled={!connected} onClick={() => editProduct(p)}>
                            編集
                          </Button>
                        </Table.ActionCell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </TableContainer>
            ) : (
              <>
                <FormControl>
                  <FormControl.Label>アセットを検索</FormControl.Label>
                  <TextField
                    type="search"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(0);
                    }}
                  />
                </FormControl>
                <Text>{filtered.length}件</Text>
                <TableContainer>
                  <Table>
                    <Table.Head>
                      <Table.Row>
                        <Table.Cell>アセット名</Table.Cell>
                        <Table.Cell>プロダクト</Table.Cell>
                        <Table.Cell>公開状態</Table.Cell>
                        <Table.ActionCell />
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {displayed.map((a) => (
                        <Table.Row key={a.id}>
                          <Table.Cell>{a.title}</Table.Cell>
                          <Table.Cell>{products.find((p) => p.id === a.brand)?.label || a.brand}</Table.Cell>
                          <Table.Cell>
                            {a.status === "archived" ? "アーカイブ" : publicationLabel[a.publication || "published"]}
                          </Table.Cell>
                          <Table.ActionCell>
                            <Button variant="subtle" disabled={!connected || busy} onClick={() => editAsset(a)}>
                              編集
                            </Button>
                            <Button
                              variant="plain"
                              color="danger"
                              disabled={!connected || busy}
                              aria-label={`${a.title}の掲載を削除`}
                              onClick={() => {
                                setDeleteTarget({ asset: a, revision: catalog.revision });
                                setDeleteError("");
                              }}
                            >
                              掲載を削除
                            </Button>
                          </Table.ActionCell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </TableContainer>
                {!filtered.length && <Text>該当するアセットはありません。</Text>}
                <ButtonGroup>
                  <Button variant="plain" disabled={page === 0} onClick={() => setPage(page - 1)}>
                    前へ
                  </Button>
                  <Text>
                    {page + 1} / {Math.max(1, Math.ceil(filtered.length / 20))}
                  </Text>
                  <Button
                    variant="plain"
                    disabled={(page + 1) * 20 >= filtered.length}
                    onClick={() => setPage(page + 1)}
                  >
                    次へ
                  </Button>
                </ButtonGroup>
              </>
            )}
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
      <Dialog
        open={deleteTarget !== null}
        closeOnEsc={!busy}
        onOpenChange={(open) => {
          if (!open && !busy) setDeleteTarget(null);
        }}
      >
        <DialogContent width="small">
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>掲載を削除しますか？</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <Text as="p">{deleteTarget?.asset.title}</Text>
            <Text as="p">CMSの登録とログイン後のポータル一覧から削除します。Google Driveの原本は削除しません。</Text>
            <Text as="p">画面からは元に戻せません。復元が必要な場合は管理者に連絡してください。</Text>
            {deleteError && (
              <DialogStickyContainer position="bottom">
                <Banner color="danger" closeButton={false}>
                  {deleteError}
                </Banner>
              </DialogStickyContainer>
            )}
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain" disabled={busy} onClick={() => setDeleteTarget(null)}>
                キャンセル
              </Button>
              <Button color="danger" loading={busy} disabled={!connected} onClick={() => void deleteAsset()}>
                掲載を削除
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
