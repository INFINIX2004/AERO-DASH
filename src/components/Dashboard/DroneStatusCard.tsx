import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Battery, Wifi, Settings2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TelemetryData {
  battery: number;
  mode: string;
  connectivity: string;
  signal_strength: number;
}

interface DroneStatusCardProps {
  telemetryData?: TelemetryData;
}

export const DroneStatusCard = ({ telemetryData }: DroneStatusCardProps) => {
  const battery = telemetryData?.battery || 0;
  const mode = telemetryData?.mode || "Unknown";
  const connectivity = telemetryData?.connectivity || "Disconnected";
  const signalStrength = telemetryData?.signal_strength || 0;

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
      </CardContent>
    </Card>
  );
};