import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-50 text-red-900 min-h-screen font-mono whitespace-pre-wrap">
                    <h1 className="text-2xl font-bold mb-4">Something went wrong (Runtime Error)</h1>
                    <div className="bg-white p-4 border border-red-300 rounded shadow text-sm mb-4">
                        <p className="font-bold">{this.state.error?.toString()}</p>
                    </div>
                    <details className="text-xs bg-red-100 p-4 rounded overflow-auto max-h-96">
                        <summary className="mb-2 cursor-pointer font-bold">Stack Trace</summary>
                        {this.state.errorInfo?.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}
