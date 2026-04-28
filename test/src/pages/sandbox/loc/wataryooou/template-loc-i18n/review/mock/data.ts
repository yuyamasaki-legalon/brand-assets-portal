export type CheckpointStatus = "analyzing" | "met" | "unmet";

export type Severity = "low" | "medium" | "high";

export interface Checkpoint {
  id: string;
  instruction: string;
  status: CheckpointStatus;
  severity: Severity;
}

export interface Playbook {
  id: string;
  name: string;
  checkpoints: Checkpoint[];
}

export interface AlertCounts {
  low: number;
  medium: number;
  high: number;
}

export const MOCK_PLAYBOOKS: Playbook[] = [
  {
    id: "pb-1",
    name: "Intake Agent NDAテスト用 (copy)",
    checkpoints: [
      {
        id: "cp-1",
        instruction: "秘密情報の定義が定められていること",
        status: "met",
        severity: "high",
      },
      {
        id: "cp-2",
        instruction:
          "開示者が開示した一切の情報が秘密情報として定義されていること(開示者が秘密である旨を明示した情報を除く）",
        status: "unmet",
        severity: "high",
      },
      {
        id: "cp-3",
        instruction: "秘密情報の内容が正確であることを保証していないこと",
        status: "met",
        severity: "high",
      },
      {
        id: "cp-4",
        instruction: "秘密情報を契約の目的以外で使用することを禁止する旨が定められていること",
        status: "met",
        severity: "high",
      },
      {
        id: "cp-5",
        instruction:
          "秘密情報を複製または改変することを禁止していること(開示者の承諾が条件となっている場合には基準を満たす）",
        status: "unmet",
        severity: "high",
      },
      {
        id: "cp-6",
        instruction: "契約終了時の秘密情報の返還または破棄義務が定められていること",
        status: "analyzing",
        severity: "high",
      },
      {
        id: "cp-7",
        instruction: "秘密保持義務の存続期間が定められていること",
        status: "analyzing",
        severity: "medium",
      },
    ],
  },
];

export const MOCK_ALERT_COUNTS: AlertCounts = {
  low: 0,
  medium: 0,
  high: 7,
};
