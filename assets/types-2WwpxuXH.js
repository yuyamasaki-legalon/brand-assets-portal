var e=`import type { MutableRefObject } from "react";
import type { ThemeName } from "../../themes";

export type LocaleCode = "en-US" | "ja-JP";

export interface EditableProp {
  path: string;
  label: string;
  value: string;
  valueType: "string" | "number" | "boolean" | "expression";
}

export interface EditableVariantTarget {
  id: string;
  componentName: string;
  currentVariant: string;
  supportsVariant?: boolean;
  labelHint?: string | null;
  order?: number;
  openLine?: number;
  openColumn?: number;
  textValue?: string | null;
  gapValue?: string | null;
  marginValue?: string | null;
  paddingValue?: string | null;
  editableProps?: EditableProp[];
  currentIconName?: string | null;
  line: number;
  column: number;
}

export interface AnalyzeVariantResponse {
  ok: boolean;
  editableVariants?: EditableVariantTarget[];
  availableIcons?: string[];
  error?: string;
}

export interface FloatingSourceCodeViewerProps {
  currentPath: string;
  filePath: string;
  githubUrl: string;
  aegisComponents: string[];
  liveEditorEnabled: boolean;
  locale: LocaleCode;
  onLocaleChange: (locale: LocaleCode) => void;
  theme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
  isThemeAutoDetected: boolean;
  launcherVisible: boolean;
  onLauncherVisibilityChange: (visible: boolean) => void;
  adjacentMarkdownFiles: string[];
  fetchMarkdownContent: (path: string) => Promise<string>;
  onOpenSettingsRef?: MutableRefObject<(() => void) | null>;
  onPickEditableRef?: MutableRefObject<(() => void) | null>;
}
`;export{e as default};