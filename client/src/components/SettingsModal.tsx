import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Settings as SettingsType } from "@shared/schema";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: Omit<SettingsType, "id">;
  onSave: (settings: Omit<SettingsType, "id">) => void;
}

export function SettingsModal({ open, onOpenChange, settings, onSave }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<Omit<SettingsType, "id">>(settings);

  const handleSave = () => {
    onSave(localSettings);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto" data-testid="settings-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl">Settings</DialogTitle>
          <DialogDescription>
            Configure your CLIMANEER dashboard preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Notifications Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <Separator />
            
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label htmlFor="sound-alerts" className="text-base">Sound Alerts</Label>
                <p className="text-sm text-muted-foreground">Play sound for critical alerts</p>
              </div>
              <Switch
                id="sound-alerts"
                checked={localSettings.soundAlerts}
                onCheckedChange={(checked) => 
                  setLocalSettings({ ...localSettings, soundAlerts: checked })
                }
                data-testid="switch-sound-alerts"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Enable browser notifications</p>
              </div>
              <Switch
                id="push-notifications"
                checked={localSettings.pushNotifications}
                onCheckedChange={(checked) => 
                  setLocalSettings({ ...localSettings, pushNotifications: checked })
                }
                data-testid="switch-push-notifications"
              />
            </div>
          </div>

          {/* Thresholds Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Alert Thresholds</h3>
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="moisture-threshold">Low Soil Moisture (%)</Label>
              <Input
                id="moisture-threshold"
                type="number"
                min="0"
                max="100"
                value={localSettings.moistureThreshold}
                onChange={(e) => 
                  setLocalSettings({ ...localSettings, moistureThreshold: Number(e.target.value) })
                }
                data-testid="input-moisture-threshold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="battery-threshold">Critical Battery Level (%)</Label>
              <Input
                id="battery-threshold"
                type="number"
                min="0"
                max="100"
                value={localSettings.batteryThreshold}
                onChange={(e) => 
                  setLocalSettings({ ...localSettings, batteryThreshold: Number(e.target.value) })
                }
                data-testid="input-battery-threshold"
              />
            </div>
          </div>

          {/* Preferences Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preferences</h3>
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="temperature-unit">Temperature Unit</Label>
              <select
                id="temperature-unit"
                value={localSettings.temperatureUnit}
                onChange={(e) => 
                  setLocalSettings({ ...localSettings, temperatureUnit: e.target.value as "celsius" | "fahrenheit" })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                data-testid="select-temperature-unit"
              >
                <option value="celsius">Celsius (°C)</option>
                <option value="fahrenheit">Fahrenheit (°F)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="poll-interval">Data Refresh Interval (seconds)</Label>
              <Input
                id="poll-interval"
                type="number"
                min="1"
                max="60"
                value={localSettings.pollInterval / 1000}
                onChange={(e) => 
                  setLocalSettings({ ...localSettings, pollInterval: Number(e.target.value) * 1000 })
                }
                data-testid="input-poll-interval"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel} data-testid="button-cancel-settings">
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="button-save-settings">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
