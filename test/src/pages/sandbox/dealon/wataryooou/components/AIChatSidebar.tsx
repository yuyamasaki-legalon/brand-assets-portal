import { LfHistory, LfPlusLarge, LfSend } from "@legalforce/aegis-icons";
import {
  Button,
  ButtonGroup,
  ContentHeader,
  Icon,
  IconButton,
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarTrigger,
  Text,
  Textarea,
  Tooltip,
} from "@legalforce/aegis-react";

export function AIChatSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <ContentHeader
          size="medium"
          trailing={
            <ButtonGroup>
              <Tooltip title="履歴">
                <IconButton aria-label="履歴" variant="plain" size="small">
                  <Icon>
                    <LfHistory />
                  </Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title="新規">
                <IconButton aria-label="新規" variant="plain" size="small">
                  <Icon>
                    <LfPlusLarge />
                  </Icon>
                </IconButton>
              </Tooltip>
              <SidebarTrigger />
            </ButtonGroup>
          }
        >
          <ContentHeader.Title>AIエージェントに相談</ContentHeader.Title>
        </ContentHeader>
      </SidebarHeader>
      <SidebarBody>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--aegis-space-medium)",
            padding: "var(--aegis-space-large)",
            height: "100%",
          }}
        >
          <Text variant="title.medium">AIエージェントに質問してください</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "var(--aegis-space-small)",
            }}
          >
            <Button variant="subtle" size="small">
              売上未達分析（デモ）
            </Button>
            <Button variant="subtle" size="small">
              ROI試算資料を作成
            </Button>
            <Button variant="subtle" size="small">
              次のステップを提案
            </Button>
          </div>
        </div>
      </SidebarBody>
      <div
        style={{
          padding: "var(--aegis-space-medium)",
        }}
      >
        <Textarea
          placeholder="AIエージェントに質問する..."
          minRows={1}
          maxRows={4}
          trailing={
            <div style={{ padding: "var(--aegis-space-xSmall)", display: "flex", justifyContent: "flex-end" }}>
              <Tooltip title="送信">
                <IconButton aria-label="送信" size="small">
                  <Icon>
                    <LfSend />
                  </Icon>
                </IconButton>
              </Tooltip>
            </div>
          }
        />
      </div>
    </Sidebar>
  );
}
