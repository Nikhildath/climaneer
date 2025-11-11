import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ExportFormat } from "@shared/schema";
import { useState } from "react";
import { FileJson, FileSpreadsheet, Download } from "lucide-react";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (format: ExportFormat) => void;
  isExporting?: boolean;
}

export function ExportModal({ open, onOpenChange, onExport, isExporting }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>("csv");

  const handleExport = () => {
    onExport(format);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" data-testid="export-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Download className="h-6 w-6 text-primary" />
            Export Data
          </DialogTitle>
          <DialogDescription>
            Choose a format to export your sensor history data
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <RadioGroup value={format} onValueChange={(value) => setFormat(value as ExportFormat)}>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setFormat("csv")}>
                <RadioGroupItem value="csv" id="csv" data-testid="radio-csv" />
                <div className="flex items-center gap-3 flex-1">
                  <FileSpreadsheet className="h-8 w-8 text-emerald-500" />
                  <div className="flex-1">
                    <Label htmlFor="csv" className="text-base font-semibold cursor-pointer">
                      CSV (Excel)
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Compatible with Excel, Google Sheets
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setFormat("json")}>
                <RadioGroupItem value="json" id="json" data-testid="radio-json" />
                <div className="flex items-center gap-3 flex-1">
                  <FileJson className="h-8 w-8 text-cyan-500" />
                  <div className="flex-1">
                    <Label htmlFor="json" className="text-base font-semibold cursor-pointer">
                      JSON
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      For developers and data analysis
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting} data-testid="button-export">
            {isExporting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Import at the top
import { RefreshCw } from "lucide-react";
