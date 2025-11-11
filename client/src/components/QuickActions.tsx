import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Settings, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  onExport: () => void;
  onRefresh: () => void;
  onSettings: () => void;
  className?: string;
}

export function QuickActions({ onExport, onRefresh, onSettings, className }: QuickActionsProps) {
  return (
    <div className={cn("fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-40 flex flex-col gap-3", className)}>
      <Button
        size="icon"
        variant="outline"
        className="rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-card border-2"
        onClick={onExport}
        data-testid="quick-action-export"
        title="Export Data"
      >
        <Download className="h-5 w-5" />
      </Button>
      
      <Button
        size="icon"
        variant="outline"
        className="rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-card border-2"
        onClick={onRefresh}
        data-testid="quick-action-refresh"
        title="Refresh Data"
      >
        <RefreshCw className="h-5 w-5" />
      </Button>
      
      <Button
        size="icon"
        variant="outline"
        className="rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-card border-2"
        onClick={onSettings}
        data-testid="quick-action-settings"
        title="Settings"
      >
        <Settings className="h-5 w-5" />
      </Button>
      
      <div className="h-px w-full bg-border my-1" />
      
      <Button
        size="icon"
        className="rounded-full shadow-glow-emerald hover:shadow-glow-lg transition-all hover:scale-110 bg-gradient-to-br from-emerald-500 to-cyan-500 p-4"
        data-testid="quick-action-auto-mode"
        title="Enable Auto Mode"
      >
        <Zap className="h-6 w-6" />
      </Button>
    </div>
  );
}
