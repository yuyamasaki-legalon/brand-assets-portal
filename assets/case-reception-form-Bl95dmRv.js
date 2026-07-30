var e=`import { LfAngleLeftLarge, LfCloseLarge, LfMenu, LfUpload } from "@legalforce/aegis-icons";
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
import { useTranslation } from "../../../../hooks";
import { type TranslationKey, translations } from "./data/translations";

const CaseReceptionFormTemplate = () => {
  const { t } = useTranslation<TranslationKey>(translations);
  const formTitle = t("pageTitle");
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
          <Tooltip title={t("menu")}>
            <IconButton variant="plain" aria-label={t("menu")}>
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
                <RouterLink to="/template">{t("backToList")}</RouterLink>
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
                  <DescriptionListTerm>{t("senderName")}</DescriptionListTerm>
                  <DescriptionListDetail>ryo watanabe</DescriptionListDetail>
                </DescriptionListItem>
                <DescriptionListItem>
                  <DescriptionListTerm>{t("emailAddress")}</DescriptionListTerm>
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
                  <FormControl.Label>{t("shareMailLabel")}</FormControl.Label>
                  <TextField
                    placeholder={t("inputPlaceholder")}
                    value={shareMail}
                    onChange={(event) => setShareMail(event.target.value)}
                  />
                </FormControl>

                <FormControl required>
                  <FormControl.Label>{t("caseName")}</FormControl.Label>
                  <TextField
                    placeholder={t("inputPlaceholder")}
                    value={caseTitle}
                    onChange={(event) => setCaseTitle(event.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormControl.Label>{t("requestContent")}</FormControl.Label>
                  <Textarea
                    placeholder={t("inputPlaceholder")}
                    value={requestContent}
                    onChange={(event) => setRequestContent(event.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormControl.Label>{t("fileLabel")}</FormControl.Label>
                  <FileDrop
                    multiple
                    uploadButtonTitle={t("uploadButton")}
                    progressLabel={t("uploadProgress")}
                    processingAction={<Button variant="subtle">{t("cancel")}</Button>}
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
                        {t("fileDropInstruction")}
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
                        <ButtonGroup key={\`\${file.name}-\${file.size}-\${file.lastModified}\`} attached variant="subtle">
                          <InformationCard
                            leading={
                              <Icon>
                                <LfUpload />
                              </Icon>
                            }
                          >
                            {file.name}
                          </InformationCard>
                          <Tooltip title={t("deleteTooltip")}>
                            <IconButton aria-label={t("removeFile")} onClick={() => handleRemoveFile(file)}>
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
                  <FormControl.Label>{t("dueDate")}</FormControl.Label>
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
                  {t("confirmSubmit")}
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
`;export{e as default};