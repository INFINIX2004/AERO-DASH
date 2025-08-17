import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "./Sidebar";
import { DroneStatusCard } from "./DroneStatusCard";
import { TelemetryPanel } from "./TelemetryPanel";
import { RadarDisplay } from "./RadarDisplay";
import { VideoFeed } from "./VideoFeed";
import { LogsPanel } from "./LogsPanel";
import { MapDisplay } from "./MapDisplay";
import { useWebSocket } from "@/hooks/useWebSocket";

export const DashboardLayout = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const { telemetryData, logs, connectionStatus } = useWebSocket();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary/20 border border-primary/30 flex items-center justify-center">
              <div className="w-4 h-4 bg-primary rounded-full pulse-glow"></div>
            </div>
            <h1 className="text-xl font-bold tracking-tight">GPS-Denied Drone Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant={connectionStatus === 'connected' ? 'default' : 'destructive'}
              className={connectionStatus === 'connected' ? 'status-online' : 'status-offline'}
            >
              {connectionStatus === 'connected' ? 'ONLINE' : 'OFFLINE'}
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {activeSection === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="space-y-6">
                <DroneStatusCard telemetryData={telemetryData} />
                <TelemetryPanel telemetryData={telemetryData} />
              </div>
              <div className="space-y-6">
                <RadarDisplay obstacles={telemetryData?.obstacles || []} />
                <VideoFeed />
              </div>
              <div className="lg:col-span-2 xl:col-span-1">
                <LogsPanel logs={logs} />
              </div>
            </div>
          )}

          {activeSection === "drone-status" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DroneStatusCard telemetryData={telemetryData} />
              <TelemetryPanel telemetryData={telemetryData} />
            </div>
          )}

          {activeSection === "telemetry" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <TelemetryPanel telemetryData={telemetryData} detailed />
              </div>
              <RadarDisplay obstacles={telemetryData?.obstacles || []} />
            </div>
          )}

          {activeSection === "video-feed" && (
            <div className="max-w-4xl mx-auto">
              <VideoFeed fullscreen />
            </div>
          )}

          {activeSection === "map" && (
            <div className="max-w-6xl mx-auto">
              <MapDisplay position={telemetryData?.position} fullscreen />
            </div>
          )}

          {activeSection === "logs" && (
            <div className="max-w-6xl mx-auto">
              <LogsPanel logs={logs} fullscreen />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};