import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Battery, Wifi, Settings2, AlertTriangle, AlertCircle, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DroneError {
  id: string;
  type: 'preflight' | 'ekf' | 'sensor' | 'system';
  severity: 'warning' | 'error' | 'critical';
  message: string;
  timestamp: string;
}

interface TelemetryData {
  battery: number;
  mode: string;
  connectivity: string;
  signal_strength: number;
  errors?: DroneError[];
}

interface DroneStatusCardProps {
  telemetryData?: TelemetryData;
}

export const DroneStatusCard = ({ telemetryData }: DroneStatusCardProps) => {
  const battery = telemetryData?.battery || 0;
  const mode = telemetryData?.mode || "Unknown";
  const connectivity = telemetryData?.connectivity || "Disconnected";
  const signalStrength = telemetryData?.signal_strength || 0;
  const errors = telemetryData?.errors || [];

  // Mock some errors for demonstration (in real implementation, these would come from telemetry)
  const mockErrors: DroneError[] = [
    {
      id: "ekf1",
      type: "ekf",
      severity: "warning",
      message: "EKF variance high - GPS signal weak",
      timestamp: new Date().toISOString()
    },
    {
      id: "sensor1", 
      type: "sensor",
      severity: "error",
      message: "Barometer reading inconsistent",
      timestamp: new Date().toISOString()
    }
  ];

  const allErrors = [...errors, ...mockErrors];

  const getBatteryStatus = (level: number) => {
    if (level > 50) return "status-online";
    if (level > 20) return "status-warning";
    return "status-offline";
  };

  const getConnectivityStatus = (conn: string) => {
    if (conn === "Connected") return "status-online";
    if (conn === "Weak") return "status-warning";
    return "status-offline";
  };

  const getErrorIcon = (type: DroneError['type']) => {
    switch (type) {
      case 'preflight': return AlertTriangle;
      case 'ekf': return AlertCircle;
      case 'sensor': return AlertTriangle;
      case 'system': return X;
      default: return AlertTriangle;
    }
  };

  const getErrorVariant = (severity: DroneError['severity']) => {
    switch (severity) {
      case 'warning': return 'default';
      case 'error': return 'secondary';  
      case 'critical': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <Card className="data-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-primary" />
          Drone Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Battery */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-muted-foreground" />
              <span className="telemetry-label">Battery</span>
            </div>
            <Badge className={getBatteryStatus(battery)}>
              {battery}%
            </Badge>
          </div>
          <Progress 
            value={battery} 
            className="h-2"
            data-battery-level={battery > 50 ? 'good' : battery > 20 ? 'warning' : 'critical'}
          />
        </div>

        {/* Flight Mode */}
        <div className="flex items-center justify-between">
          <span className="telemetry-label">Flight Mode</span>
          <Badge variant="outline" className="text-primary border-primary/30">
            {mode.toUpperCase()}
          </Badge>
        </div>

        {/* Connectivity */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-muted-foreground" />
              <span className="telemetry-label">Connectivity</span>
            </div>
            <Badge className={getConnectivityStatus(connectivity)}>
              {connectivity.toUpperCase()}
            </Badge>
          </div>
          <Progress 
            value={signalStrength} 
            className="h-2"
          />
          <div className="text-xs text-muted-foreground text-right">
            Signal: {signalStrength}%
          </div>
        </div>

        {/* Error Display Section */}
        {allErrors.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="telemetry-label text-destructive">System Errors</span>
              <Badge variant="destructive" className="text-xs">
                {allErrors.length}
              </Badge>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {allErrors.map((error) => {
                const ErrorIcon = getErrorIcon(error.type);
                return (
                  <Alert key={error.id} className="py-2">
                    <ErrorIcon className="h-3 w-3" />
                    <AlertDescription className="text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{error.type.toUpperCase()}:</span>
                        <Badge variant={getErrorVariant(error.severity)} className="text-xs h-5">
                          {error.severity}
                        </Badge>
                      </div>
                      <div className="mt-1 text-muted-foreground">
                        {error.message}
                      </div>
                    </AlertDescription>
                  </Alert>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};