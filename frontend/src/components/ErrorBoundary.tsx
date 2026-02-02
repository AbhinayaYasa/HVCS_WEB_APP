import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
          <h1>Something went wrong</h1>
          <pre style={{
            background: 'var(--color-surface)',
            padding: '1rem',
            borderRadius: 8,
            overflow: 'auto',
            color: '#dc3545',
          }}>
            {this.state.error.message}
          </pre>
          <p style={{ color: 'var(--color-text-muted)' }}>
            If you see &quot;Firebase&quot; or &quot;apiKey&quot; above, add your Firebase env vars in Vercel: Project Settings → Environment Variables. Add VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, etc.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
