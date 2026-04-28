import { LfCloseLarge, LfFile, LfPlusLarge } from "@legalforce/aegis-icons";
import {
  ActionList,
  Button,
  ButtonGroup,
  ContentHeader,
  ContentHeaderTitle,
  FileDrop,
  FormControl,
  Icon,
  IconButton,
  InformationCard,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  SelectButton,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import type { CSSProperties } from "react";
import { useState } from "react";
import { LocSidebarLayout } from "../../_shared/LocSidebarLayout";

// Mock data
const MOCK_SPACES = [
  { id: "space-1", name: "全社" },
  { id: "space-2", name: "法務部" },
  { id: "space-3", name: "営業部" },
];

const MOCK_STATUSES = [
  { id: "reviewing", name: "レビュー中" },
  { id: "completed", name: "完了" },
  { id: "action-required", name: "要対応" },
  { id: "none", name: "なし" },
];

const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".doc"] as const;

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-medium)",
  },
  fileDropContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xxSmall)",
    width: "100%",
  },
  uploadButtonWrapper: {
    display: "flex",
    justifyContent: "flex-end",
  },
} satisfies Record<string, CSSProperties>;

const ContractReviewUploadTemplate = () => {
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("なし");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const selectedSpaceName = MOCK_SPACES.find((s) => s.id === selectedSpace)?.name;

  const handleSelectFiles = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const submitDisabled = !selectedSpace || !selectedFile;

  return (
    <LocSidebarLayout activeId="review">
      <PageLayout>
        <PageLayoutContent align="center" maxWidth="medium" as="main">
          <PageLayoutHeader>
            <ContentHeader>
              <ContentHeaderTitle>契約書レビュー</ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>
          <PageLayoutBody>
            <div style={styles.root}>
              {/* 保存先 (Space) Select */}
              <FormControl required>
                <FormControl.Label>保存先</FormControl.Label>
                <Menu placement="bottom">
                  <Menu.Anchor>
                    <SelectButton placeholder={selectedSpaceName ?? "未選択"} />
                  </Menu.Anchor>
                  <Menu.Box width="match-to-anchor">
                    <ActionList>
                      <ActionList.Group>
                        {MOCK_SPACES.map((space) => (
                          <ActionList.Item key={space.id} onClick={() => setSelectedSpace(space.id)}>
                            <ActionList.Body>{space.name}</ActionList.Body>
                          </ActionList.Item>
                        ))}
                      </ActionList.Group>
                    </ActionList>
                  </Menu.Box>
                </Menu>
              </FormControl>

              {/* ステータス Select */}
              <FormControl>
                <FormControl.Label>ステータス</FormControl.Label>
                <Menu placement="bottom">
                  <Menu.Anchor>
                    <SelectButton placeholder={selectedStatus} disabled={!selectedSpace} />
                  </Menu.Anchor>
                  <Menu.Box width="match-to-anchor">
                    <ActionList>
                      <ActionList.Group>
                        {MOCK_STATUSES.map((status) => (
                          <ActionList.Item key={status.id} onClick={() => setSelectedStatus(status.name)}>
                            <ActionList.Body>{status.name}</ActionList.Body>
                          </ActionList.Item>
                        ))}
                      </ActionList.Group>
                    </ActionList>
                  </Menu.Box>
                </Menu>
              </FormControl>

              {/* ファイルエリア */}
              {selectedFile ? (
                <ButtonGroup attached variant="subtle">
                  <InformationCard
                    leading={
                      <Icon>
                        <LfFile />
                      </Icon>
                    }
                  >
                    <InformationCard.Body>
                      <InformationCard.Title>{selectedFile.name}</InformationCard.Title>
                    </InformationCard.Body>
                  </InformationCard>
                  <Tooltip title="削除">
                    <IconButton aria-label={`${selectedFile.name} を削除`} variant="subtle" onClick={handleRemoveFile}>
                      <Icon>
                        <LfCloseLarge />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                </ButtonGroup>
              ) : (
                <div style={styles.fileDropContainer}>
                  <FileDrop
                    uploadButtonTitle="契約書を選択"
                    maxFiles={1}
                    accept={[...ALLOWED_EXTENSIONS]}
                    disabled={!selectedSpace}
                    onSelectFiles={handleSelectFiles}
                    processingAction={<Button>キャンセル</Button>}
                  >
                    <Text variant="body.medium" color="subtle" whiteSpace="pre-wrap" style={{ textAlign: "center" }}>
                      {"契約書をドロップするか\nボタンから選択してアップロードできます。"}
                    </Text>
                  </FileDrop>
                  <Text color="subtle" variant="caption.small">
                    レビュー可能なファイル形式: {ALLOWED_EXTENSIONS.join(",")}
                  </Text>
                </div>
              )}

              {/* アップロードボタン */}
              <div style={styles.uploadButtonWrapper}>
                <Button
                  variant="solid"
                  size="medium"
                  leading={
                    <Icon>
                      <LfPlusLarge />
                    </Icon>
                  }
                  disabled={submitDisabled}
                >
                  アップロード
                </Button>
              </div>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
};

export default ContractReviewUploadTemplate;
