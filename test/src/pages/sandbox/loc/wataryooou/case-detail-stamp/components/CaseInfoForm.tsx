import { Button, DateField, Divider, Form, FormControl, Select, Text } from "@legalforce/aegis-react";
import type { SelectOption } from "../types";

interface CaseInfoFormProps {
  caseType: string;
  status: string;
  assignee: string;
  department: string;
  requester: string;
  caseTypeOptions: SelectOption[];
  statusOptions: SelectOption[];
  assigneeOptions: SelectOption[];
  departmentOptions: SelectOption[];
  subAssignees: string[];
  space: string;
  onCaseTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onAssigneeChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onRequesterChange: (value: string) => void;
}

export function CaseInfoForm({
  caseType,
  status,
  assignee,
  department,
  requester,
  caseTypeOptions,
  statusOptions,
  assigneeOptions,
  departmentOptions,
  subAssignees,
  space,
  onCaseTypeChange,
  onStatusChange,
  onAssigneeChange,
  onDepartmentChange,
  onRequesterChange,
}: CaseInfoFormProps) {
  return (
    <Form>
      <FormControl>
        <FormControl.Label>案件タイプ</FormControl.Label>
        <Select options={caseTypeOptions} value={caseType} onChange={(value) => onCaseTypeChange(value)} />
      </FormControl>

      <FormControl>
        <FormControl.Label>案件ステータス</FormControl.Label>
        <Select options={statusOptions} value={status} onChange={(value) => onStatusChange(value)} />
      </FormControl>

      <FormControl>
        <FormControl.Label>案件担当者</FormControl.Label>
        <Select options={assigneeOptions} value={assignee} onChange={(value) => onAssigneeChange(value)} />
      </FormControl>

      <FormControl>
        <FormControl.Label>副担当者</FormControl.Label>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--aegis-space-xxSmall)",
          }}
        >
          {subAssignees.map((name) => (
            <Text key={name} variant="body.medium">
              {name}
            </Text>
          ))}
        </div>
      </FormControl>

      <FormControl>
        <FormControl.Label>依頼部署</FormControl.Label>
        <Select options={departmentOptions} value={department} onChange={(value) => onDepartmentChange(value)} />
      </FormControl>

      <FormControl>
        <FormControl.Label>依頼者</FormControl.Label>
        <Select options={assigneeOptions} value={requester} onChange={(value) => onRequesterChange(value)} />
      </FormControl>

      <FormControl>
        <FormControl.Label>納期</FormControl.Label>
        <DateField defaultValue={new Date("2024-11-08")} />
      </FormControl>

      <FormControl>
        <FormControl.Label>保存先</FormControl.Label>
        <Text variant="body.medium">{space}</Text>
      </FormControl>

      <Button variant="subtle" style={{ width: "100%" }}>
        案件を移動
      </Button>

      <Divider />

      <FormControl>
        <FormControl.Label>緊急度（テスト（Update））</FormControl.Label>
        <Select options={[]} placeholder="選択してください" />
      </FormControl>
    </Form>
  );
}
