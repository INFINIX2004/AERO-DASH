import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  category: string;
}

interface LogsPanelProps {
  logs: LogEntry[];
  fullscreen?: boolean;
}

export const LogsPanel = ({ logs, fullscreen = false }: LogsPanelProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case 'error':
        return 'status-offline';
      case 'warning':
        return 'status-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Card className={`data-glow ${fullscreen ? 'h-full' : 'h-96'}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            System Logs
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{logs.length} entries</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          ref={scrollRef}
          className={`overflow-y-auto p-4 space-y-2 ${fullscreen ? 'h-96' : 'h-64'}`}
        >
          {logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No log entries yet</p>
              <p className="text-xs">Waiting for telemetry data...</p>
            </div>
          ) : (
            logs.map((log) => (
              <div 
                key={log.id} 
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/50 hover:bg-muted/30 transition-colors"
              >
                <div className="flex flex-col items-center gap-1 min-w-0">
                  <Badge className={`text-xs ${getLevelBadgeClass(log.level)}`}>
                    {log.level.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    {formatTimestamp(log.timestamp)}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {log.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground font-mono leading-relaxed">
                    {log.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};