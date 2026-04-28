export type MfaMethodType = "sms" | "email" | "qr";
export type MfaMethod = { id: string; type: MfaMethodType; label: string };

export const MFA_TYPE_OPTIONS: { value: MfaMethodType; label: string }[] = [
  { value: "sms", label: "SMS" },
  { value: "email", label: "メール" },
  { value: "qr", label: "QRコード" },
];

export const getMfaTypeLabel = (type: MfaMethodType): string =>
  MFA_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;
