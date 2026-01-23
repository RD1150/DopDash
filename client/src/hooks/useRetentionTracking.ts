import { useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

/**
 * Hook to silently track user retention metrics
 * Records a session on app load for each authenticated user
 * Used to calculate D1/D7/D30 retention rates
 */
export function useRetentionTracking() {
  const { isAuthenticated } = useAuth();
  const recordSession = trpc.retention.recordSession.useMutation();

  useEffect(() => {
    if (isAuthenticated && !recordSession.isPending) {
      // Record session silently - no UI feedback needed
      recordSession.mutate(undefined, {
        onError: (error) => {
          // Silently fail - don't disrupt user experience
          console.debug('[Retention] Session recording failed:', error.message);
        },
      });
    }
  }, [isAuthenticated]);

  return null;
}
