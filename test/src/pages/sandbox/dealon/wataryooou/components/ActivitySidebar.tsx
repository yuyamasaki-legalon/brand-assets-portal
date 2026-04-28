import { LfEllipsisDot, LfUser } from "@legalforce/aegis-icons";
import {
  ButtonGroup,
  ContentHeader,
  Icon,
  IconButton,
  PageLayoutBody,
  PageLayoutHeader,
  PageLayoutPane,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { activities, activityTypeColors } from "../mock/data";

export function ActivitySidebar() {
  return (
    <PageLayoutPane position="start" width="medium" resizable minWidth="small" maxWidth="large">
      <PageLayoutHeader>
        <ContentHeader
          size="medium"
          trailing={
            <ButtonGroup>
              <Tooltip title="ユーザー">
                <IconButton aria-label="ユーザー" variant="plain" size="small">
                  <Icon>
                    <LfUser />
                  </Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title="AI">
                <IconButton aria-label="AI" variant="plain" size="small">
                  <Icon>
                    <LfEllipsisDot />
                  </Icon>
                </IconButton>
              </Tooltip>
            </ButtonGroup>
          }
        >
          <ContentHeader.Title>アクティビティ</ContentHeader.Title>
        </ContentHeader>
      </PageLayoutHeader>
      <PageLayoutBody>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
          {activities.map((activity) => (
            <div
              key={activity.id}
              style={{
                display: "flex",
                gap: "var(--aegis-space-small)",
                padding: "var(--aegis-space-small)",
              }}
            >
              {/* Color dot indicator */}
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: activityTypeColors[activity.type],
                  flexShrink: 0,
                  marginTop: "6px",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-x3Small)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
                  <Text variant="label.small.bold">{activity.typeLabel}</Text>
                  <Text variant="body.xSmall" color="subtle">
                    {activity.datetime}
                  </Text>
                </div>
                <Text variant="body.small">{activity.company}</Text>
                <Text variant="body.xSmall" color="subtle">
                  {activity.description}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </PageLayoutBody>
    </PageLayoutPane>
  );
}
