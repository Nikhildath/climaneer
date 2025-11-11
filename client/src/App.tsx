import { useState, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { NavigationTabs } from "@/components/NavigationTabs";
import { Dashboard } from "@/pages/Dashboard";
import { Analytics } from "@/pages/Analytics";
import { Alerts } from "@/pages/Alerts";
import { History } from "@/pages/History";
import { SettingsModal } from "@/components/SettingsModal";
import { ExportModal } from "@/components/ExportModal";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { QuickActions } from "@/components/QuickActions";
import { DashboardSkeleton } from "@/components/LoadingSkeleton";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { 
  SensorReading,
  InsertSensorReading,
  SystemStatus, 
  Alert as AlertType, 
  Settings,
  InsertSettings,
  HistoryEntry,
  TrendData,
  ExportFormat
} from "@shared/schema";

function AppContent() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  // Mock data - will be replaced with API calls in Task 2
  const [sensorData] = useState<InsertSensorReading>({
    timestamp: new Date().toISOString(),
    soilMoisture: 65,
    airHumidity: 55,
    waterLevel: 75,
    pH: 6.8,
    airTemperature: 24,
    waterTemperature: 20,
    airQuality: 45,
    flowRate: 2.5,
    battery: 85,
  });

  const [systemStatus] = useState<SystemStatus>({
    uptime: 99.9,
    pumpStatus: "running",
    pumpRuntime: 125,
    controlMode: "automatic",
    networkSignal: "strong",
    dataUsage: 2.3,
  });

  const [alerts, setAlerts] = useState<AlertType[]>([
    {
      id: "1",
      type: "info",
      title: "System Started",
      message: "CLIMANEER dashboard is now online and monitoring sensors",
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: "2",
      type: "success",
      title: "Soil Moisture Optimal",
      message: "Soil moisture levels are within optimal range (65%)",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      read: true,
    },
  ]);

  const [settings, setSettings] = useState<Omit<Settings, "id">>({
    soundAlerts: true,
    pushNotifications: true,
    moistureThreshold: 30,
    batteryThreshold: 20,
    temperatureUnit: "celsius",
    pollInterval: 5000,
    darkMode: false,
  });

  const [history] = useState<HistoryEntry[]>([
    {
      id: "1",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      sensors: { ...sensorData, id: "s1", soilMoisture: 60, airTemperature: 23 },
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      sensors: { ...sensorData, id: "s2", soilMoisture: 58, airTemperature: 22 },
    },
  ]);

  const [trendData] = useState<TrendData>({
    timestamps: ["12:00", "13:00", "14:00", "15:00", "16:00"],
    moisture: [60, 62, 65, 63, 65],
    humidity: [50, 52, 55, 54, 55],
    temperature: [22, 23, 24, 24, 24],
    ph: [6.5, 6.7, 6.8, 6.8, 6.8],
    waterLevel: [78, 77, 76, 75, 75],
    flow: [2.3, 2.5, 2.5, 2.4, 2.5],
  });

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back Online",
        description: "Connection restored. Syncing data...",
        variant: "default",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline",
        description: "You're viewing cached data",
        variant: "destructive",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [toast]);

  // Pull-to-refresh simulation for mobile
  useEffect(() => {
    let touchStartY = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndY = e.changedTouches[0].clientY;
      const distance = touchEndY - touchStartY;
      
      // If swiped down at least 100px from top
      if (distance > 100 && window.scrollY === 0) {
        handleRefresh();
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const handleRefresh = async () => {
    toast({
      title: "Refreshing",
      description: "Updating sensor data...",
    });
    
    // In Task 2, this will call the API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Updated",
      description: "All sensor data refreshed",
    });
  };

  const handleSettingsSave = (newSettings: Omit<Settings, "id">) => {
    setSettings(newSettings);
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated",
    });
  };

  const handleExport = (format: ExportFormat) => {
    // In Task 2, this will call the API to generate the file
    toast({
      title: "Exporting Data",
      description: `Preparing ${format.toUpperCase()} file...`,
    });

    setTimeout(() => {
      const filename = `climaneer-data-${Date.now()}.${format}`;
      toast({
        title: "Export Complete",
        description: `Downloaded ${filename}`,
      });
      setExportOpen(false);
    }, 1500);
  };

  const handleAlertDismiss = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    toast({
      title: "Alert Dismissed",
      description: "Alert removed from list",
    });
  };

  const handleAlertMarkRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const handleClearAllAlerts = () => {
    setAlerts([]);
    toast({
      title: "Alerts Cleared",
      description: "All alerts have been removed",
    });
  };

  const unreadAlertCount = alerts.filter(a => !a.read).length;
  
  // Determine active tab from location
  const activeTab = location === "/" ? "dashboard" : location.substring(1);
  
  // Navigate to tab
  const handleTabChange = (tab: string) => {
    setLocation(tab === "dashboard" ? "/" : `/${tab}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          onSettingsClick={() => {}} 
          onRefresh={() => {}} 
          isOnline={isOnline}
        />
        <NavigationTabs 
          activeTab="dashboard" 
          onTabChange={() => {}} 
          alertCount={0}
        />
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Offline Indicator */}
      {!isOnline && <OfflineIndicator />}

      {/* Header */}
      <Header 
        onSettingsClick={() => setSettingsOpen(true)}
        onRefresh={handleRefresh}
        isOnline={isOnline}
      />

      {/* Navigation */}
      <NavigationTabs 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        alertCount={unreadAlertCount}
      />

      {/* Main Content */}
      <main className="min-h-[calc(100vh-8rem)]">
        <Switch>
          <Route path="/">
            <Dashboard 
              sensorData={sensorData}
              systemStatus={systemStatus}
            />
          </Route>
          
          <Route path="/analytics">
            <Analytics 
              trendData={trendData}
              isLoading={false}
            />
          </Route>
          
          <Route path="/alerts">
            <Alerts 
              alerts={alerts}
              onDismiss={handleAlertDismiss}
              onMarkRead={handleAlertMarkRead}
              onClearAll={handleClearAllAlerts}
            />
          </Route>
          
          <Route path="/history">
            <History 
              history={history}
              onExport={() => setExportOpen(true)}
            />
          </Route>
        </Switch>
      </main>

      {/* Quick Actions - Only on Dashboard */}
      {location === "/" && (
        <QuickActions 
          onExport={() => setExportOpen(true)}
          onRefresh={handleRefresh}
          onSettings={() => setSettingsOpen(true)}
        />
      )}

      {/* Modals */}
      <SettingsModal 
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSave={handleSettingsSave}
      />

      <ExportModal 
        open={exportOpen}
        onOpenChange={setExportOpen}
        onExport={handleExport}
        isExporting={false}
      />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
