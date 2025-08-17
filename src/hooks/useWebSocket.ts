import { useState, useEffect, useRef } from 'react';

interface TelemetryData {
  battery: number;
  mode: string;
  connectivity: string;
  signal_strength: number;
  altitude: number;
  speed: number;
  heading: number;
  pitch: number;
  roll: number;
  yaw: number;
  position?: {
    latitude: number;
    longitude: number;
    heading: number;
  };
  obstacles: Array<{
    id: string;
    angle: number;
    distance: number;
    type: string;
  }>;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  category: string;
}

export const useWebSocket = (url: string = 'ws://localhost:8081') => {
  const [telemetryData, setTelemetryData] = useState<TelemetryData | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    try {
      setConnectionStatus('connecting');
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        setConnectionStatus('connected');
        addLog('info', 'CONNECTION', 'WebSocket connected to telemetry server');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'telemetry') {
            setTelemetryData(data.payload);
          } else if (data.type === 'log') {
            addLog(data.payload.level, data.payload.category, data.payload.message);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        setConnectionStatus('disconnected');
        addLog('warning', 'CONNECTION', 'WebSocket connection lost. Attempting to reconnect...');
        
        // Auto-reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        addLog('error', 'CONNECTION', 'WebSocket connection error occurred');
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setConnectionStatus('disconnected');
      addLog('error', 'CONNECTION', 'Failed to establish WebSocket connection');
    }
  };

  const addLog = (level: LogEntry['level'], category: string, message: string) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      level,
      message,
      category
    };

    setLogs(prevLogs => {
      const updatedLogs = [...prevLogs, newLog];
      // Keep only the last 100 log entries
      return updatedLogs.slice(-100);
    });
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url]);

  return {
    telemetryData,
    logs,
    connectionStatus,
    reconnect: connect
  };
};
