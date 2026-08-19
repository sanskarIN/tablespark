import { Component, type ErrorInfo, type ReactNode } from 'react';
import { logger } from '../infrastructure/logger';

interface Props {
  readonly children: ReactNode;
}

interface State {
  readonly hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, info: ErrorInfo): void {
    logger.error('ui_error_boundary', {
      errorType: error.name,
      componentDepth: info.componentStack?.split('\n').length ?? 0,
    });
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main className="fatal-error" role="alert">
          <img src="/logo.svg" alt="" width="72" height="72" />
          <h1>TableSpark hit an unexpected error</h1>
          <p>
            Your local learning data has not been intentionally cleared. Reload the app to try
            again.
          </p>
          <button
            className="primary-button"
            type="button"
            onClick={() => window.location.reload()}
          >
            Reload TableSpark
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}
