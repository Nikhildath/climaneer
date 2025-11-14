// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users;
  sensorReadings;
  alerts;
  settings;
  maxReadingsHistory;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.sensorReadings = [];
    this.alerts = /* @__PURE__ */ new Map();
    this.maxReadingsHistory = 1e3;
    this.settings = {
      soundAlerts: true,
      pushNotifications: true,
      moistureThreshold: 30,
      batteryThreshold: 20,
      temperatureUnit: "celsius",
      pollInterval: 5e3,
      darkMode: false
    };
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Sensor reading methods
  async createSensorReading(reading) {
    const id = randomUUID();
    const timestamp2 = reading.timestamp || (/* @__PURE__ */ new Date()).toISOString();
    const sensorReading = { ...reading, id, timestamp: timestamp2 };
    this.sensorReadings.push(sensorReading);
    if (this.sensorReadings.length > this.maxReadingsHistory) {
      this.sensorReadings = this.sensorReadings.slice(-this.maxReadingsHistory);
    }
    return sensorReading;
  }
  async getLatestSensorReading() {
    if (this.sensorReadings.length === 0) return void 0;
    return this.sensorReadings[this.sensorReadings.length - 1];
  }
  async getSensorReadingHistory(limit = 100) {
    return this.sensorReadings.slice(-limit).reverse();
  }
  async getTrendData(hours = 24) {
    const now = Date.now();
    const cutoffTime = now - hours * 60 * 60 * 1e3;
    const recentReadings = this.sensorReadings.filter(
      (r) => new Date(r.timestamp).getTime() > cutoffTime
    );
    if (recentReadings.length === 0) {
      return {
        timestamps: [],
        moisture: [],
        humidity: [],
        temperature: [],
        ph: [],
        waterLevel: [],
        flow: []
      };
    }
    return {
      timestamps: recentReadings.map((r) => r.timestamp),
      moisture: recentReadings.map((r) => r.soilMoisture),
      humidity: recentReadings.map((r) => r.airHumidity),
      temperature: recentReadings.map((r) => r.airTemperature),
      ph: recentReadings.map((r) => r.pH),
      waterLevel: recentReadings.map((r) => r.waterLevel),
      flow: recentReadings.map((r) => r.flowRate)
    };
  }
  // Alert methods
  async getAlerts() {
    return Array.from(this.alerts.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  async createAlert(insertAlert) {
    const id = randomUUID();
    const timestamp2 = insertAlert.timestamp || (/* @__PURE__ */ new Date()).toISOString();
    const alert = {
      ...insertAlert,
      id,
      timestamp: timestamp2,
      read: insertAlert.read ?? false
    };
    this.alerts.set(id, alert);
    return alert;
  }
  async markAlertAsRead(id) {
    const alert = this.alerts.get(id);
    if (!alert) return void 0;
    const updatedAlert = { ...alert, read: true };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }
  async deleteAlert(id) {
    return this.alerts.delete(id);
  }
  // Settings methods
  async getSettings() {
    return { ...this.settings };
  }
  async updateSettings(updates) {
    this.settings = { ...this.settings, ...updates };
    return { ...this.settings };
  }
  // Statistics methods
  async getStatistics() {
    if (this.sensorReadings.length === 0) {
      return {
        waterUsed: 0,
        pumpRuntime: 0,
        efficiency: 0,
        averageMoisture: 0,
        averageTemperature: 0
      };
    }
    const recentReadings = this.sensorReadings.slice(-100);
    const avgMoisture = recentReadings.reduce((sum, r) => sum + r.soilMoisture, 0) / recentReadings.length;
    const avgTemp = recentReadings.reduce((sum, r) => sum + r.airTemperature, 0) / recentReadings.length;
    const totalFlow = recentReadings.reduce((sum, r) => sum + r.flowRate, 0);
    return {
      waterUsed: totalFlow,
      pumpRuntime: 125.5,
      // Mock data
      efficiency: Math.min(95, Math.round(avgMoisture * 1.2)),
      averageMoisture: Math.round(avgMoisture * 10) / 10,
      averageTemperature: Math.round(avgTemp * 10) / 10
    };
  }
  async getSystemStatus() {
    return {
      uptime: 99.9,
      pumpStatus: "running",
      pumpRuntime: 125.5,
      controlMode: "automatic",
      networkSignal: "strong",
      dataUsage: 2.3
    };
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, varchar, text, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var sensorReadings = pgTable("sensor_readings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timestamp: timestamp("timestamp", { mode: "string" }).notNull(),
  soilMoisture: real("soil_moisture").notNull(),
  airHumidity: real("air_humidity").notNull(),
  waterLevel: real("water_level").notNull(),
  pH: real("ph").notNull(),
  airTemperature: real("air_temperature").notNull(),
  waterTemperature: real("water_temperature").notNull(),
  airQuality: integer("air_quality").notNull(),
  flowRate: real("flow_rate").notNull(),
  battery: real("battery").notNull()
});
var insertSensorReadingSchema = createInsertSchema(sensorReadings, {
  soilMoisture: z.number().min(0).max(100),
  airHumidity: z.number().min(0).max(100),
  waterLevel: z.number().min(0).max(100),
  pH: z.number().min(0).max(14),
  battery: z.number().min(0).max(100),
  airQuality: z.number().min(0),
  flowRate: z.number().min(0)
}).omit({ id: true });
var systemStatusSchema = z.object({
  uptime: z.number(),
  pumpStatus: z.enum(["running", "stopped", "error"]),
  pumpRuntime: z.number(),
  controlMode: z.enum(["automatic", "manual"]),
  networkSignal: z.enum(["strong", "medium", "weak"]),
  dataUsage: z.number()
});
var alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type", { enum: ["info", "warning", "danger", "success"] }).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp", { mode: "string" }).notNull(),
  read: boolean("read").notNull().default(false)
});
var insertAlertSchema = createInsertSchema(alerts).omit({ id: true });
var settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  soundAlerts: boolean("sound_alerts").notNull().default(true),
  pushNotifications: boolean("push_notifications").notNull().default(true),
  moistureThreshold: real("moisture_threshold").notNull().default(30),
  batteryThreshold: real("battery_threshold").notNull().default(20),
  temperatureUnit: varchar("temperature_unit", { enum: ["celsius", "fahrenheit"] }).notNull().default("celsius"),
  pollInterval: integer("poll_interval").notNull().default(5e3),
  darkMode: boolean("dark_mode").notNull().default(false)
});
var insertSettingsSchema = createInsertSchema(settings, {
  moistureThreshold: z.number().min(0).max(100),
  batteryThreshold: z.number().min(0).max(100),
  pollInterval: z.number().min(1e3).max(6e4)
}).omit({ id: true });
var exportFormatSchema = z.enum(["csv", "json"]);
var statisticsSchema = z.object({
  waterUsed: z.number(),
  pumpRuntime: z.number(),
  efficiency: z.number(),
  averageMoisture: z.number(),
  averageTemperature: z.number()
});
var trendDataSchema = z.object({
  timestamps: z.array(z.string()),
  moisture: z.array(z.number()),
  humidity: z.array(z.number()),
  temperature: z.array(z.number()),
  ph: z.array(z.number()),
  waterLevel: z.array(z.number()),
  flow: z.array(z.number())
});

// server/routes.ts
import { fromZodError } from "zod-validation-error";
function validateBody(schema, body) {
  const result = schema.safeParse(body);
  if (!result.success) {
    const validationError = fromZodError(result.error);
    throw Object.assign(new Error(validationError.message), { status: 400 });
  }
  return result.data;
}
async function registerRoutes(app2) {
  app2.post("/api/sensor-readings", async (req, res) => {
    try {
      const data = validateBody(insertSensorReadingSchema, req.body);
      const reading = await storage.createSensorReading(data);
      res.json(reading);
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  });
  app2.get("/api/sensor-readings/latest", async (_req, res) => {
    try {
      const reading = await storage.getLatestSensorReading();
      if (!reading) {
        res.status(404).json({ message: "No sensor readings found" });
        return;
      }
      res.json(reading);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/sensor-readings/history", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 100;
      const readings = await storage.getSensorReadingHistory(limit);
      res.json(readings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/sensor-readings/trends", async (req, res) => {
    try {
      const hours = req.query.hours ? parseInt(req.query.hours) : 24;
      const trends = await storage.getTrendData(hours);
      res.json(trends);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/alerts", async (_req, res) => {
    try {
      const alerts2 = await storage.getAlerts();
      res.json(alerts2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/alerts", async (req, res) => {
    try {
      const data = validateBody(insertAlertSchema, req.body);
      const alert = await storage.createAlert(data);
      res.json(alert);
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  });
  app2.patch("/api/alerts/:id/read", async (req, res) => {
    try {
      const alert = await storage.markAlertAsRead(req.params.id);
      if (!alert) {
        res.status(404).json({ message: "Alert not found" });
        return;
      }
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.delete("/api/alerts/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAlert(req.params.id);
      if (!deleted) {
        res.status(404).json({ message: "Alert not found" });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/settings", async (_req, res) => {
    try {
      const settings2 = await storage.getSettings();
      res.json(settings2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.put("/api/settings", async (req, res) => {
    try {
      const data = validateBody(insertSettingsSchema.partial(), req.body);
      const settings2 = await storage.updateSettings(data);
      res.json(settings2);
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  });
  app2.get("/api/statistics", async (_req, res) => {
    try {
      const stats = await storage.getStatistics();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/system-status", async (_req, res) => {
    try {
      const status = await storage.getSystemStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/export", async (req, res) => {
    try {
      const formatParam = Array.isArray(req.query.format) ? req.query.format[0] : req.query.format;
      const format = validateBody(exportFormatSchema, formatParam || "json");
      const readings = await storage.getSensorReadingHistory(1e3);
      if (format === "csv") {
        const escapeCsvValue = (value) => {
          if (value === null || value === void 0) {
            return "";
          }
          const str = String(value);
          if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        };
        const headers = ["timestamp", "soilMoisture", "airHumidity", "waterLevel", "pH", "airTemperature", "waterTemperature", "airQuality", "flowRate", "battery"];
        const csv = [
          headers.join(","),
          ...readings.map((r) => [
            escapeCsvValue(r.timestamp),
            escapeCsvValue(r.soilMoisture),
            escapeCsvValue(r.airHumidity),
            escapeCsvValue(r.waterLevel),
            escapeCsvValue(r.pH),
            escapeCsvValue(r.airTemperature),
            escapeCsvValue(r.waterTemperature),
            escapeCsvValue(r.airQuality),
            escapeCsvValue(r.flowRate),
            escapeCsvValue(r.battery)
          ].join(","))
        ].join("\n");
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="climaneer-export-${Date.now()}.csv"`);
        res.send(csv);
      } else {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="climaneer-export-${Date.now()}.json"`);
        res.json({ readings, exportedAt: (/* @__PURE__ */ new Date()).toISOString() });
      }
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  });
  app2.post("/api/simulate-reading", async (_req, res) => {
    try {
      const reading = await storage.createSensorReading({
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        soilMoisture: Math.round(55 + Math.random() * 20),
        // 55-75%
        airHumidity: Math.round(45 + Math.random() * 20),
        // 45-65%
        waterLevel: Math.round(70 + Math.random() * 15),
        // 70-85%
        pH: Math.round((6.5 + Math.random() * 0.6) * 10) / 10,
        // 6.5-7.1
        airTemperature: Math.round((22 + Math.random() * 4) * 10) / 10,
        // 22-26°C
        waterTemperature: Math.round((18 + Math.random() * 4) * 10) / 10,
        // 18-22°C
        airQuality: Math.round(30 + Math.random() * 30),
        // 30-60 AQI
        flowRate: Math.round((2 + Math.random() * 1) * 10) / 10,
        // 2-3 L/min
        battery: Math.max(20, Math.round(80 + Math.random() * 15))
        // 80-95%
      });
      res.json(reading);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import fs from "fs";
var removeFaviconPlugin = {
  name: "remove-favicon",
  closeBundle() {
    const faviconPath = path.resolve(import.meta.dirname, "dist/public/favicon.ico");
    if (fs.existsSync(faviconPath)) {
      fs.unlinkSync(faviconPath);
      console.log("\u2713 Favicon removed");
    }
  }
};
var vite_config_default = defineConfig({
  base: "/",
  plugins: [
    react(),
    removeFaviconPlugin,
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  const listenOpts = { port, host: "0.0.0.0" };
  if (process.platform !== "win32") {
    listenOpts.reusePort = true;
  }
  server.listen(listenOpts, () => {
    log(`serving on port ${port}`);
  });
})();
