import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Navigation, Gauge, Compass } from "lucide-react";

interface TelemetryData {
  altitude: number;
  speed: number;
  heading: number;
  pitch: number;
  roll: number;
  yaw: number;
}

interface TelemetryPanelProps {
  telemetryData?: TelemetryData;
  detailed?: boolean;
}

export const TelemetryPanel = ({ telemetryData, detailed = false }: TelemetryPanelProps) => {
  const altitude = telemetryData?.altitude || 0;
  const speed = telemetryData?.speed || 0;
  const heading = telemetryData?.heading || 0;
  const pitch = telemetryData?.pitch || 0;
  const roll = telemetryData?.roll || 0;
  const yaw = telemetryData?.yaw || 0;

  const primaryMetrics = [
    { label: "Altitude", value: `${altitude.toFixed(1)}m`, icon: Navigation },
    { label: "Speed", value: `${speed.toFixed(1)} m/s`, icon: Gauge },
    { label: "Heading", value: `${heading.toFixed(0)}°`, icon: Compass },
  ];

  const orientationMetrics = [
    { label: "Pitch", value: `${pitch.toFixed(1)}°` },
    { label: "Roll", value: `${roll.toFixed(1)}°` },
    { label: "Yaw", value: `${yaw.toFixed(1)}°` },
  ];

  return (
    <Card className="data-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Telemetry Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Metrics */}
        <div className={`grid gap-4 ${detailed ? 'grid-cols-1' : 'grid-cols-3'}`}>
          {primaryMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="telemetry-label">{metric.label}</span>
                </div>
                <div className="telemetry-value">{metric.value}</div>
              </div>
            );
          })}
        </div>

        {/* Orientation Data */}
        {detailed && (
          <div className="border-t border-border pt-6">
            <h4 className="telemetry-label mb-4">Orientation</h4>
            <div className="grid grid-cols-3 gap-4">
              {orientationMetrics.map((metric) => (
                <div key={metric.label} className="text-center space-y-2">
                  <span className="telemetry-label">{metric.label}</span>
                  <div className="text-lg font-mono font-semibold text-primary">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attitude Indicator (simplified) */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-center">
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-b from-primary/20 to-primary/5 border-2 border-primary/30">
              <div 
                className="absolute inset-4 bg-primary/40 rounded-full border border-primary/60"
                style={{
                  transform: `rotate(${roll}deg)`,
                  transition: 'transform 0.3s ease'
                }}
              >
                <div className="absolute top-1/2 left-1/2 w-1 h-6 bg-primary -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              <div className="absolute top-2 left-1/2 w-0.5 h-2 bg-foreground -translate-x-1/2"></div>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-2">Attitude Indicator</p>
        </div>
      </CardContent>
    </Card>
  );
};