import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface OrganizationErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface OrganizationErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class OrganizationErrorBoundary extends React.Component<
  OrganizationErrorBoundaryProps,
  OrganizationErrorBoundaryState
> {
  constructor(props: OrganizationErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): OrganizationErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Organization Error Boundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error!} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback = ({ error, resetError }: { error: Error; resetError: () => void }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold mb-2">
        {t('processManagement.organizationChartError')}
      </h3>
      <p className="text-muted-foreground mb-4 max-w-md">
        {t('processManagement.organizationChartErrorDescription')}
      </p>
      <details className="mb-4 text-left max-w-md">
        <summary className="cursor-pointer text-sm text-muted-foreground">
          {t('processManagement.errorDetails')}
        </summary>
        <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
          {error.message}
        </pre>
      </details>
      <Button onClick={resetError} variant="outline">
        <RefreshCw className="mr-2 h-4 w-4" />
        {t('processManagement.tryAgain')}
      </Button>
    </div>
  );
};

export default OrganizationErrorBoundary;
