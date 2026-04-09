import { useEffect, useRef, useState, useCallback } from 'react';

const MAX_RETRIES = 5;
const RETRY_DELAY = 3000;

interface SSECallbacks {
  onNewOrder?: (data: unknown) => void;
  onOrderStatusChanged?: (data: unknown) => void;
  onOrderDeleted?: (data: unknown) => void;
  onSessionCompleted?: (data: unknown) => void;
}

export function useSSE(
  storeId: number | null,
  token: string | null,
  callbacks: SSECallbacks,
) {
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  const disconnect = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const connect = useCallback(() => {
    if (!storeId || !token) return;

    disconnect();

    const url = `/api/admin/sse/orders?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onopen = () => {
      setIsConnected(true);
      retryCountRef.current = 0;
    };

    es.addEventListener('new-order', (event) => {
      try {
        const data = JSON.parse(event.data);
        callbacksRef.current.onNewOrder?.(data);
      } catch { /* ignore */ }
    });

    es.addEventListener('order-status-changed', (event) => {
      try {
        const data = JSON.parse(event.data);
        callbacksRef.current.onOrderStatusChanged?.(data);
      } catch { /* ignore */ }
    });

    es.addEventListener('order-deleted', (event) => {
      try {
        const data = JSON.parse(event.data);
        callbacksRef.current.onOrderDeleted?.(data);
      } catch { /* ignore */ }
    });

    es.addEventListener('table-session-completed', (event) => {
      try {
        const data = JSON.parse(event.data);
        callbacksRef.current.onSessionCompleted?.(data);
      } catch { /* ignore */ }
    });

    es.onerror = () => {
      setIsConnected(false);
      es.close();
      eventSourceRef.current = null;

      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current++;
        retryTimerRef.current = setTimeout(() => {
          connect();
        }, RETRY_DELAY);
      }
    };
  }, [storeId, token, disconnect]);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { isConnected, disconnect };
}
