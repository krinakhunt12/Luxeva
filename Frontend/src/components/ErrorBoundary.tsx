import React from 'react';
import ErrorPage from '../pages/ErrorPage';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error: Error | null };

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // TODO: send to remote logging service
    console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage message={this.state.error?.message || 'An unexpected error occurred.'} details={this.state.error?.stack} />;
    }
    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
