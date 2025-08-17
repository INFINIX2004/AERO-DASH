import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar } from "lucide-react";

interface Obstacle {
  id: string;
  angle: number;
  distance: number;
  type: string;
}

interface RadarDisplayProps {
  obstacles: Obstacle[];
}

export const RadarDisplay = ({ obstacles }: RadarDisplayProps) => {
  const radarSize = 200;
  const centerX = radarSize / 2;
  const centerY = radarSize / 2;
  const maxRadius = radarSize / 2 - 20;

  return (
    <Card className="data-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radar className="w-5 h-5 text-primary" />
          Obstacle Proximity
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative">
          <svg width={radarSize} height={radarSize} className="border border-primary/30 rounded-full">
            {/* Background circles */}
            <defs>
              <radialGradient id="radarGradient" cx="50%" cy="50%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
              </radialGradient>
            </defs>
            
            <circle cx={centerX} cy={centerY} r={maxRadius} fill="url(#radarGradient)" />
            
            {/* Range circles */}
            {[0.25, 0.5, 0.75, 1].map((factor, i) => (
              <circle
                key={i}
                cx={centerX}
                cy={centerY}
                r={maxRadius * factor}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth={1}
                opacity={0.3}
              />
            ))}
            
            {/* Cross lines */}
            <line
              x1={centerX}
              y1={20}
              x2={centerX}
              y2={radarSize - 20}
              stroke="hsl(var(--primary))"
              strokeWidth={1}
              opacity={0.3}
            />
            <line
              x1={20}
              y1={centerY}
              x2={radarSize - 20}
              y2={centerY}
              stroke="hsl(var(--primary))"
              strokeWidth={1}
              opacity={0.3}
            />
            
            {/* Rotating sweep line */}
            <line
              x1={centerX}
              y1={centerY}
              x2={centerX}
              y2={20}
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              opacity={0.8}
              className="radar-sweep"
              style={{ transformOrigin: `${centerX}px ${centerY}px` }}
            />
            
            {/* Obstacles */}
            {obstacles.map((obstacle) => {
              const angle = (obstacle.angle * Math.PI) / 180;
              const distance = Math.min(obstacle.distance / 100, 1); // Normalize to 0-1
              const radius = maxRadius * distance;
              
              const x = centerX + radius * Math.sin(angle);
              const y = centerY - radius * Math.cos(angle);
              
              return (
                <g key={obstacle.id}>
                  <circle
                    cx={x}
                    cy={y}
                    r={4}
                    fill="hsl(var(--warning))"
                    className="pulse-glow"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={8}
                    fill="none"
                    stroke="hsl(var(--warning))"
                    strokeWidth={1}
                    opacity={0.5}
                  />
                </g>
              );
            })}
            
            {/* Center dot (drone position) */}
            <circle
              cx={centerX}
              cy={centerY}
              r={3}
              fill="hsl(var(--primary))"
              className="pulse-glow"
            />
          </svg>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <span className="telemetry-label">Obstacles</span>
            <div className="text-lg font-mono font-semibold text-warning">
              {obstacles.length}
            </div>
          </div>
          <div>
            <span className="telemetry-label">Range</span>
            <div className="text-lg font-mono font-semibold text-primary">
              100m
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};