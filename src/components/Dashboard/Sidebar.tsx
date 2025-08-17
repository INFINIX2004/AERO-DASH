import { cn } from "@/lib/utils";
import { 
  Activity, 
  Radar, 
  Settings, 
  Video, 
  FileText,
  BarChart3,
  Home
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "drone-status", label: "Drone Status", icon: Activity },
  { id: "telemetry", label: "Telemetry", icon: BarChart3 },
  { id: "video-feed", label: "Video Feed", icon: Video },
  { id: "logs", label: "Logs", icon: FileText },
];

export const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  return (
    <aside className="w-64 bg-card/30 border-r border-border backdrop-blur-sm">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground/80 uppercase tracking-wider text-sm">
          Navigation
        </h2>
      </div>
      
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                "text-left font-medium",
                isActive 
                  ? "bg-primary/20 text-primary border border-primary/30 data-glow" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <div className="p-3 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-success pulse-glow"></div>
            System Active
          </div>
        </div>
      </div>
    </aside>
  );
};