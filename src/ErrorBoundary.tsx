import React from "react";

type Props = { children: React.ReactNode };

type State = { hasError: boolean; error?: Error; errorInfo?: React.ErrorInfo };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error } as State;
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You could log the error to an error reporting service here
    // console.error(error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 24,
            background: "#fff",
            color: "#000",
            minHeight: "100vh",
            fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
          }}
        >
          <h1 style={{ marginTop: 0 }}>خطأ في تشغيل التطبيق</h1>
          <p>حدث خطأ أثناء تحميل الصفحة. يرجى تفقد الكونسول للحصول على تفاصيل أكثر.</p>
          <details style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>
            <summary>تفاصيل الخطأ</summary>
            <div>
              {this.state.error?.message}
              {this.state.errorInfo?.componentStack && (
                <pre style={{ marginTop: 8 }}>{this.state.errorInfo.componentStack}</pre>
              )}
              {this.state.error?.stack && (
                <pre style={{ marginTop: 8 }}>{this.state.error.stack}</pre>
              )}
            </div>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
