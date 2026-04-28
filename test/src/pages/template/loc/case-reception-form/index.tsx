import { LfAngleLeftLarge, LfCloseLarge, LfMenu, LfUpload } from "@legalforce/aegis-icons";
import {
  Button,
  ButtonGroup,
  ContentHeader,
  ContentHeaderTitle,
  DateField,
  DescriptionList,
  DescriptionListDetail,
  DescriptionListItem,
  DescriptionListTerm,
  FileDrop,
  Form,
  FormControl,
  Header,
  Icon,
  IconButton,
  InformationCard,
  Link,
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
import { Link as RouterLink } from "react-router-dom";

const CaseReceptionFormTemplate = () => {
  const formTitle = "ファイルアップロード依頼フォーム";
  const [shareMail, setShareMail] = useState("");
  const [caseTitle, setCaseTitle] = useState("");
  const [requestContent, setRequestContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<readonly File[]>([]);

  const contentWrapperStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-large)",
    inlineSize: "100%",
    maxInlineSize: "var(--aegis-layout-width-medium)",
    marginInline: "auto",
  } as const;

  const handleSelectFiles = (files: readonly File[]) => {
    setSelectedFiles(files);
  };

  const handleRemoveFile = (file: File) => {
    setSelectedFiles((prev) => prev.filter((selected) => selected !== file));
  };

  const isConfirmEnabled = caseTitle.trim().length > 0;

  return (
    <>
      <Header>
        <Header.Item>
          <Tooltip title="メニュー">
            <IconButton variant="plain" aria-label="メニュー">
              <Icon>
                <LfMenu />
              </Icon>
            </IconButton>
          </Tooltip>
        </Header.Item>
        <Header.Item>
          <Header.Title>
            <Text variant="title.xxSmall" numberOfLines={1}>
              {formTitle}
            </Text>
          </Header.Title>
        </Header.Item>
      </Header>

      <PageLayout>
        <PageLayoutContent>
          <PageLayoutHeader>
            <div style={contentWrapperStyle}>
              <Link asChild leading={LfAngleLeftLarge}>
                <RouterLink to="/template">案件受付フォーム一覧</RouterLink>
              </Link>
              <ContentHeader>
                <ContentHeaderTitle>{formTitle}</ContentHeaderTitle>
              </ContentHeader>
            </div>
          </PageLayoutHeader>
          <PageLayoutBody>
            <div style={contentWrapperStyle}>
              <DescriptionList>
                <DescriptionListItem>
                  <DescriptionListTerm>送信者名（メールの差出人）</DescriptionListTerm>
                  <DescriptionListDetail>ryo watanabe</DescriptionListDetail>
                </DescriptionListItem>
                <DescriptionListItem>
                  <DescriptionListTerm>メールアドレス</DescriptionListTerm>
                  <DescriptionListDetail>taro.yamada@example.com</DescriptionListDetail>
                </DescriptionListItem>
              </DescriptionList>

              <Form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-large)",
                }}
              >
                <FormControl>
                  <FormControl.Label>共有先のメールアドレス</FormControl.Label>
                  <TextField
                    placeholder="テキストを入力"
                    value={shareMail}
                    onChange={(event) => setShareMail(event.target.value)}
                  />
                </FormControl>

                <FormControl required>
                  <FormControl.Label>案件名</FormControl.Label>
                  <TextField
                    placeholder="テキストを入力"
                    value={caseTitle}
                    onChange={(event) => setCaseTitle(event.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormControl.Label>依頼内容</FormControl.Label>
                  <Textarea
                    placeholder="テキストを入力"
                    value={requestContent}
                    onChange={(event) => setRequestContent(event.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormControl.Label>ファイル</FormControl.Label>
                  <FileDrop
                    multiple
                    uploadButtonTitle="アップロード"
                    progressLabel="アップロード中..."
                    processingAction={<Button variant="subtle">キャンセル</Button>}
                    onSelectFiles={handleSelectFiles}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "var(--aegis-space-xSmall)",
                      }}
                    >
                      <Icon>
                        <LfUpload />
                      </Icon>
                      <Text variant="body.medium" color="subtle" whiteSpace="pre-wrap" style={{ textAlign: "center" }}>
                        ファイルをドラッグ＆ドロップするか{`\n`}ボタンから選択してアップロードできます。
                      </Text>
                    </div>
                  </FileDrop>

                  {selectedFiles.length > 0 ? (
                    <div
                      style={{
                        marginTop: "var(--aegis-space-medium)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--aegis-space-xSmall)",
                      }}
                    >
                      {selectedFiles.map((file) => (
                        <ButtonGroup key={`${file.name}-${file.size}-${file.lastModified}`} attached variant="subtle">
                          <InformationCard
                            leading={
                              <Icon>
                                <LfUpload />
                              </Icon>
                            }
                          >
                            {file.name}
                          </InformationCard>
                          <Tooltip title="削除">
                            <IconButton aria-label="ファイルを削除" onClick={() => handleRemoveFile(file)}>
                              <Icon>
                                <LfCloseLarge />
                              </Icon>
                            </IconButton>
                          </Tooltip>
                        </ButtonGroup>
                      ))}
                    </div>
                  ) : null}
                </FormControl>

                <FormControl>
                  <FormControl.Label>納期</FormControl.Label>
                  <DateField />
                </FormControl>
              </Form>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  size="large"
                  width="full"
                  disabled={!isConfirmEnabled}
                  style={{ maxWidth: "var(--aegis-layout-width-x4Small)" }}
                >
                  送信内容を確認
                </Button>
              </div>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </>
  );
};

export default CaseReceptionFormTemplate;
