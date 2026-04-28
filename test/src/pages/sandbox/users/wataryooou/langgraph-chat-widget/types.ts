/**
 * Type definitions for LangGraph Chat Widget Demo
 */

export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export type WidgetType = "info-card" | "form" | "list" | "action-buttons";

export interface InfoCardData {
  title: string;
  description: string;
  items?: Array<{ label: string; value: string }>;
}

export interface FormData {
  title: string;
  fields: Array<{
    label: string;
    placeholder: string;
    type: "text" | "email" | "number";
  }>;
}

export interface ListData {
  title: string;
  items: Array<{
    id: string;
    label: string;
    description?: string;
  }>;
}

export interface ActionButtonsData {
  title: string;
  buttons: Array<{
    label: string;
    action: string;
    variant?: "solid" | "subtle" | "plain" | "gutterless";
    color?: "inverse" | "danger" | "information" | "neutral";
  }>;
}

export type WidgetData = InfoCardData | FormData | ListData | ActionButtonsData;

export interface Widget {
  id: string;
  type: WidgetType;
  data: WidgetData;
}

/**
 * LangGraph state definition
 */
export interface ChatState {
  messages: Message[];
  currentWidget: Widget | null;
  conversationStep: number;
  userInput: string;
}

/**
 * Mock response pattern matching
 */
export interface ResponsePattern {
  keywords: string[];
  response: string;
  widget?: Widget;
}
