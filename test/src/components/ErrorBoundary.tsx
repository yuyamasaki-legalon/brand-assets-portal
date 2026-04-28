import { Button, Text } from "@legalforce/aegis-react";
import type React from "react";
import type { ReactNode } from "react";
import { Component } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary component to catch errors in child components
 * and prevent the entire app from crashing.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    // Reload the page to reset the app state
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            padding: "2rem",
            maxWidth: "600px",
            margin: "2rem auto",
          }}
        >
          <div
            style={{
              padding: "1rem",
              border: "1px solid #e74c3c",
              borderRadius: "4px",
              backgroundColor: "#fee",
              marginBottom: "1rem",
            }}
          >
            <Text as="p" variant="body.medium">
              ページの読み込み中にエラーが発生しました
            </Text>
            <div style={{ marginTop: "0.5rem" }}>
              <Text as="p" variant="body.small">
                {this.state.error?.message || "不明なエラー"}
              </Text>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button onClick={this.handleReset}>ページをリロード</Button>
            <Button
              variant="subtle"
              onClick={() => {
                window.history.back();
              }}
            >
              前のページに戻る
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
