import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Signal, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VideoFeedProps {
  fullscreen?: boolean;
}

export const VideoFeed = ({ fullscreen = false }: VideoFeedProps) => {
  const aspectRatio = fullscreen ? "aspect-video" : "aspect-video";

  return (
    <Card className={`data-glow ${fullscreen ? 'h-full' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            Video Feed
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="status-online">
              <Signal className="w-3 h-3 mr-1" />
              LIVE
            </Badge>
            {!fullscreen && (
              <Button variant="ghost" size="sm">
                <Maximize2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`${aspectRatio} bg-muted/20 border border-border rounded-lg flex items-center justify-center relative overflow-hidden`}>
          {/* Placeholder grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Video placeholder content */}
          <div className="text-center space-y-4 z-10">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
              <Video className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Camera Feed</h3>
              <p className="text-sm text-muted-foreground">
                Drone camera stream will appear here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                1920×1080 @ 30fps
              </p>
            </div>
          </div>
          
          {/* Recording indicator */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1">
              <div className="w-2 h-2 rounded-full bg-destructive pulse-glow"></div>
              <span className="text-xs font-mono">REC</span>
            </div>
          </div>
          
          {/* Status overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <span className="telemetry-label">Resolution</span>
                  <span className="text-primary font-mono">1920×1080</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="telemetry-label">FPS</span>
                  <span className="text-primary font-mono">30</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="telemetry-label">Bitrate</span>
                  <span className="text-primary font-mono">2.4 Mbps</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};