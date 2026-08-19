import { Component, type ContextType, type ErrorInfo, type ReactNode } from 'react';
import { LocaleContext } from '../i18n/LocaleContext';
import { logger } from '../infrastructure/logger';

interface Props {
  readonly children: ReactNode;
}

interface State {
  readonly hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public static contextType = LocaleContext;
  public declare context: ContextType<typeof LocaleContext>;
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
      const { copy } = this.context.messages;
      return (
        <main className="fatal-error" role="alert">
          <img src="/logo.svg" alt="" width="72" height="72" />
          <h1>{copy.fatalError.title}</h1>
          <p>{copy.fatalError.body}</p>
          <button
            className="primary-button"
            type="button"
            onClick={() => window.location.reload()}
          >
            {copy.fatalError.reload}
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}
