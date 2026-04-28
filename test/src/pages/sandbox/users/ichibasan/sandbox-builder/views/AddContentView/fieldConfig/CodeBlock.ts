import type { FieldConfig } from "./base";

export const CodeBlockConfig: FieldConfig[] = [
  // --- Content ---
  {
    key: "text",
    label: "Text",
    type: "textarea",
    defaultValue: `function greet(name) {\n  return "Hello, " + name + "!";\n}\n\ngreet("World");`,
  },
];
