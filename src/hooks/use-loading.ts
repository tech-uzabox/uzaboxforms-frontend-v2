import { useState, useCallback } from 'react';

interface UseLoadingOptions {
  initialLoading?: boolean;
  loadingText?: string;
}

export const useLoading = (options: UseLoadingOptions = {}) => {
  const { initialLoading = false, loadingText } = options;
  const [loading, setLoading] = useState(initialLoading);
  const [loadingMessage, setLoadingMessage] = useState(loadingText || '');

  const startLoading = useCallback((message?: string) => {
    setLoading(true);
    if (message) {
      setLoadingMessage(message);
    }
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
    setLoadingMessage('');
  }, []);

  const withLoading = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    message?: string
  ): Promise<T> => {
    try {
      startLoading(message);
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    loading,
    loadingMessage,
    startLoading,
    stopLoading,
    withLoading,
    setLoadingMessage
  };
};

// Hook for managing multiple loading states
export const useMultiLoading = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const startLoading = useCallback((key: string) => {
    setLoadingStates(prev => ({ ...prev, [key]: true }));
  }, []);

  const stopLoading = useCallback((key: string) => {
    setLoadingStates(prev => ({ ...prev, [key]: false }));
  }, []);

  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const withLoading = useCallback(async <T>(
    key: string,
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    try {
      startLoading(key);
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading(key);
    }
  }, [startLoading, stopLoading]);

  return {
    loadingStates,
    startLoading,
    stopLoading,
    isLoading,
    withLoading
  };
};
