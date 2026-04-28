export interface UpdateFileMeta {
  period: string; // "2026年1月"
  date: string; // "2026-01"
  commitCount: number;
}

export interface UpdateItem {
  title: string;
  tag: string; // "Template", "DX" etc.
  description: string; // 技術的な説明
  impact: string; // 非エンジニア向け（これにより:）
}

export interface UpdateSection {
  meta: UpdateFileMeta;
  items: UpdateItem[];
}
