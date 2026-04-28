import { LfClip, LfLayoutHorizon, LfSend, LfSetting } from "@legalforce/aegis-icons";
import {
  ButtonGroup,
  ContentHeader,
  ContentHeaderTitle,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutFooter,
  PageLayoutHeader,
  PageLayoutPane,
  Textarea,
  Tooltip,
} from "@legalforce/aegis-react";
import type { FC } from "react";
import { useState } from "react";
import { Placeholder } from "../../components/Placeholder";
import { StartSidebar } from "../../components/StartSidebar";

export const ChatTemplate: FC = () => {
  const [paneOpen, setPaneOpen] = useState(false);
  return (
    <PageLayout scrollBehavior="inside">
      <StartSidebar />
      <PageLayoutContent scrollBehavior="inside">
        <PageLayoutHeader>
          <ContentHeader
            size="medium"
            trailing={
              <Tooltip title="Open">
                <IconButton size="small" aria-label="Open" onClick={() => setPaneOpen((prev) => !prev)}>
                  <Icon>
                    <LfLayoutHorizon />
                  </Icon>
                </IconButton>
              </Tooltip>
            }
          >
            <ContentHeaderTitle>Chat</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div
            style={{
              inlineSize: "100%",
              maxInlineSize: "var(--aegis-layout-width-large)",
              marginInline: "auto",
              display: "flex",
              flexDirection: "column",
              alignContent: "flex-start",
              rowGap: "var(--aegis-space-small)",
            }}
          >
            {Array.from({ length: 30 }, (_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: Static array with fixed length, index is safe to use
              <Placeholder key={`placeholder-${index}`}>Placeholder</Placeholder>
            ))}
          </div>
        </PageLayoutBody>
        <PageLayoutFooter gutterless>
          <div
            style={{
              inlineSize: "100%",
              maxInlineSize: "var(--aegis-layout-width-large)",
              marginInline: "auto",
            }}
          >
            <Textarea
              aria-label="メッセージ入力"
              placeholder="Type your message"
              minRows={2}
              maxRows={10}
              trailing={
                <div
                  style={{
                    inlineSize: "100%",
                    padding: "var(--aegis-space-xSmall)",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <ButtonGroup variant="plain" size="small">
                    <Tooltip title="Attach">
                      <IconButton aria-label="Attach">
                        <Icon>
                          <LfClip />
                        </Icon>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Settings">
                      <IconButton aria-label="Settings">
                        <Icon>
                          <LfSetting />
                        </Icon>
                      </IconButton>
                    </Tooltip>
                  </ButtonGroup>
                  <Tooltip title="Send">
                    <IconButton size="small" aria-label="Send">
                      <Icon>
                        <LfSend />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                </div>
              }
            />
          </div>
        </PageLayoutFooter>
      </PageLayoutContent>
      <PageLayoutPane position="end" open={paneOpen} resizable maxWidth="x5Large" minWidth="small" width="large">
        <PageLayoutBody>
          <Placeholder>Pane</Placeholder>
        </PageLayoutBody>
      </PageLayoutPane>
    </PageLayout>
  );
};

export default ChatTemplate;
