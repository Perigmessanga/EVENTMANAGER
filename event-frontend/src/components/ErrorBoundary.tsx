import React, { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <h1 className="text-xl font-bold">Oops! Erreur</h1>
            </div>
            <p className="text-muted-foreground mb-4">
              Une erreur inattendue s'est produite.
            </p>
            <details className="text-xs text-muted-foreground mb-4 p-3 bg-muted rounded">
              <summary className="cursor-pointer font-mono">Message d'erreur</summary>
              <pre className="mt-2 whitespace-pre-wrap break-words">
                {this.state.error?.message}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-primary-foreground rounded px-4 py-2 hover:bg-primary/90"
            >
              Rafraîchir la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
