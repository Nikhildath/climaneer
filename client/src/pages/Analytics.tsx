import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendData } from "@shared/schema";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChartSkeleton } from "@/components/LoadingSkeleton";

interface AnalyticsProps {
  trendData: TrendData | null;
  isLoading?: boolean;
}

export function Analytics({ trendData, isLoading }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h");

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold">Analytics Dashboard</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Sensor trends and historical data</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex gap-2" data-testid="time-range-selector">
          <Button
            variant={timeRange === "24h" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("24h")}
            data-testid="button-24h"
          >
            24H
          </Button>
          <Button
            variant={timeRange === "7d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("7d")}
            data-testid="button-7d"
          >
            7D
          </Button>
          <Button
            variant={timeRange === "30d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("30d")}
            data-testid="button-30d"
          >
            30D
          </Button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sensor Trends Chart */}
        <Card className="p-6" data-testid="chart-sensor-trends">
          <h3 className="text-lg font-semibold mb-4">Sensor Trends</h3>
          <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">Chart visualization for {timeRange}</p>
              <p className="text-sm text-muted-foreground">
                {trendData ? `${trendData.timestamps.length} data points` : "Loading..."}
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-chart-1" />
              <span className="text-muted-foreground">Soil Moisture</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-chart-2" />
              <span className="text-muted-foreground">Air Humidity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-chart-3" />
              <span className="text-muted-foreground">Temperature</span>
            </div>
          </div>
        </Card>

        {/* Water Usage Chart */}
        <Card className="p-6" data-testid="chart-water-usage">
          <h3 className="text-lg font-semibold mb-4">Water Usage</h3>
          <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">Usage chart for {timeRange}</p>
              <p className="text-sm text-muted-foreground">Total: 0 L</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-xl font-bold">0 L</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-xl font-bold">0 L</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-xl font-bold">0 L</p>
            </div>
          </div>
        </Card>

        {/* pH Trends Chart */}
        <Card className="p-6" data-testid="chart-ph-trends">
          <h3 className="text-lg font-semibold mb-4">pH Level Trends</h3>
          <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">pH trends for {timeRange}</p>
              <p className="text-sm text-muted-foreground">
                {trendData ? `Range: ${Math.min(...trendData.ph).toFixed(1)} - ${Math.max(...trendData.ph).toFixed(1)}` : "Loading..."}
              </p>
            </div>
          </div>
        </Card>

        {/* Temperature Comparison Chart */}
        <Card className="p-6" data-testid="chart-temperature-comparison">
          <h3 className="text-lg font-semibold mb-4">Temperature Comparison</h3>
          <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">Air vs Water temperature</p>
              <p className="text-sm text-muted-foreground">
                {trendData ? `${trendData.timestamps.length} readings` : "Loading..."}
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Air Temperature</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-cyan-500" />
              <span className="text-muted-foreground">Water Temperature</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Avg Soil Moisture</p>
          <p className="text-2xl font-bold gradient-text">
            {trendData ? (trendData.moisture.reduce((a, b) => a + b, 0) / trendData.moisture.length).toFixed(1) : "0"}%
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Avg Temperature</p>
          <p className="text-2xl font-bold gradient-text">
            {trendData ? (trendData.temperature.reduce((a, b) => a + b, 0) / trendData.temperature.length).toFixed(1) : "0"}°C
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Avg Humidity</p>
          <p className="text-2xl font-bold gradient-text">
            {trendData ? (trendData.humidity.reduce((a, b) => a + b, 0) / trendData.humidity.length).toFixed(1) : "0"}%
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Avg pH Level</p>
          <p className="text-2xl font-bold gradient-text">
            {trendData ? (trendData.ph.reduce((a, b) => a + b, 0) / trendData.ph.length).toFixed(1) : "0"}
          </p>
        </Card>
      </div>
    </div>
  );
}
