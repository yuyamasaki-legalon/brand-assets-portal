import { ActionList, Text } from "@legalforce/aegis-react";
import type { FirstPartyPlaybookAlert } from "../mock/data";

interface Props {
  alerts: FirstPartyPlaybookAlert[];
  selectedAlertId: string | null;
  onSelectAlert: (alertId: string) => void;
}

export const FirstPartyAlertList = ({ alerts, selectedAlertId, onSelectAlert }: Props) => {
  if (alerts.length === 0) {
    return (
      <div style={{ padding: "var(--aegis-space-medium)" }}>
        <Text color="subtle">チェックポイントがありません</Text>
      </div>
    );
  }

  return (
    <ActionList size="large">
      {alerts.map((alert, index) => (
        <ActionList.Item
          key={alert.firstPartyPlaybookAlertId}
          onClick={() => onSelectAlert(alert.firstPartyPlaybookAlertId)}
          selected={alert.firstPartyPlaybookAlertId === selectedAlertId}
        >
          <ActionList.Body>
            <Text variant="body.medium.bold" numberOfLines={1}>
              {index + 1}. [{alert.articleTitle}]{alert.issueTitle}
            </Text>
          </ActionList.Body>
        </ActionList.Item>
      ))}
    </ActionList>
  );
};
