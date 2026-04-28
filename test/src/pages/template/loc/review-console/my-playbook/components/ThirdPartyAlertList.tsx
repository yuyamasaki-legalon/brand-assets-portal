import { ActionList, Text } from "@legalforce/aegis-react";
import type { PlaybookAlert } from "../mock/data";

interface Props {
  alerts: PlaybookAlert[];
  selectedAlertId: string | null;
  onSelectAlert: (alertId: string) => void;
}

export const ThirdPartyAlertList = ({ alerts, selectedAlertId, onSelectAlert }: Props) => {
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
          key={alert.playbookAlertId}
          onClick={() => onSelectAlert(alert.playbookAlertId)}
          selected={alert.playbookAlertId === selectedAlertId}
        >
          <ActionList.Body>
            <Text numberOfLines={2}>
              {index + 1}. {alert.playbookInstruction}
            </Text>
          </ActionList.Body>
        </ActionList.Item>
      ))}
    </ActionList>
  );
};
