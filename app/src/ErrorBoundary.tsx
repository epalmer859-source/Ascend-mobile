import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div style={{ padding: 40, maxWidth: 600, margin: '0 auto', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#E2CDB9', marginBottom: 16 }}>Something went wrong</h1>
          <pre style={{ background: '#1a1a1a', padding: 16, borderRadius: 8, overflow: 'auto', color: '#fff', fontSize: 14 }}>
            {this.state.error.message}
          </pre>
          <p style={{ color: '#888', marginTop: 16 }}>
            Check the browser console for the full error.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
