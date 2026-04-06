import { useEffect, useRef } from 'react';
import { track } from '../services/analyticsService';

interface UseScreenAnalyticsOptions {
  sessionId?: string;
  screenId: string | number;
}

/**
 * Fires a `screen_loaded` event when the screen mounts and a `screen_time`
 * event (with time_on_screen in seconds) when the screen unmounts.
 */
export function useScreenAnalytics({ sessionId, screenId }: UseScreenAnalyticsOptions): void {
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    startRef.current = Date.now();

    track({
      session_id: sessionId,
      event_type: 'screen_loaded',
      screen_id: screenId,
    });

    return () => {
      const elapsed = Math.round((Date.now() - startRef.current) / 1000);
      track({
        session_id: sessionId,
        event_type: 'screen_time',
        screen_id: screenId,
        time_on_screen: elapsed,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenId]);
}
