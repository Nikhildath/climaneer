# CLIMANEER Dashboard

## Project Overview
CLIMANEER is a modern, responsive smart agriculture platform for intelligent water management and crop monitoring. Built with React, TypeScript, and a full-stack architecture, it provides real-time sensor monitoring, analytics, alerts, and data export capabilities.

## Recent Changes (Task 1 - Schema & Frontend)
**Date**: Current Session
**Status**: ✅ Complete

### What Was Built
1. **Data Schema** (`shared/schema.ts`)
   - Comprehensive TypeScript interfaces for all sensor data
   - Alert, settings, history, and statistics schemas
   - Export format types

2. **Design System**
   - Configured `tailwind.config.ts` with emerald/teal color theme
   - Custom animations (pulse-glow, float, shimmer, slide-in/out)
   - Glassmorphism utilities, gradient text, responsive breakpoints
   - Updated `index.html` with proper metadata and font loading

3. **React Components** (15+ components)
   - **Header**: Theme toggle, connection status, refresh, settings
   - **NavigationTabs**: Sticky tabs with badge counters, mobile-optimized
   - **SensorCard**: Reusable card for all sensor types with visualizations
   - **StatusCard**: System, pump, battery, network status displays
   - **ProgressRing**: Circular progress visualization
   - **WaterTankVisualization**: Animated tank level display
   - **PHScaleVisualization**: pH scale gradient indicator
   - **TemperatureGauge**: Temperature bar gauge
   - **AQIBar**: Air quality index bar
   - **SettingsModal**: Complete settings configuration panel
   - **AlertNotification**: Alert cards with dismiss/read functionality
   - **LoadingSkeleton**: Shimmer loading states
   - **OfflineIndicator**: Banner for offline mode
   - **QuickActions**: Floating action buttons
   - **ExportModal**: CSV/JSON export selector

4. **Pages** (4 main views)
   - **Dashboard**: 8 sensor cards + 4 status cards + statistics
   - **Analytics**: Charts, trends, and time range comparison
   - **Alerts**: Alert management with filtering
   - **History**: Searchable data table with mobile cards view

### Features Implemented
✅ Comprehensive mobile responsiveness (320px - 1920px+)
✅ Dark/Light theme with persistence
✅ Offline mode detection with indicator
✅ Pull-to-refresh for mobile
✅ Touch-optimized navigation
✅ Settings panel with thresholds and preferences
✅ Data export modal (CSV/JSON)
✅ Toast notifications system
✅ Quick action floating buttons
✅ Loading skeletons
✅ Alert system with read/unread status
✅ Searchable history with mobile/desktop layouts

## Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Routing**: wouter (lightweight React router)
- **State**: React hooks (useState, useEffect)
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: shadcn/ui
- **Icons**: Lucide React + Font Awesome
- **Forms**: react-hook-form with Zod validation
- **HTTP**: React Query (TanStack Query)

### Design Principles
- Material Design + Fluent Design hybrid
- Glassmorphic cards with subtle backdrop blur
- Gradient accents (emerald to teal)
- Emerald (#10b981) for positive metrics
- Cyan (#06b6d4) for neutral/info
- Amber (#f59e0b) for warnings
- Red (#ef4444) for critical alerts

### Responsive Breakpoints
- **Mobile**: 320px - 640px (single column, stacked cards)
- **Tablet**: 641px - 1024px (2-column grid)
- **Desktop**: 1025px+ (multi-column dashboard)

### Mobile Optimizations
- Collapsible header on scroll
- Horizontal tab scrolling with snap points
- Pull-to-refresh gesture
- Touch-optimized controls (44px minimum)
- Reduced animation complexity
- Bottom quick actions panel

## Project Structure

```
client/src/
├── components/
│   ├── ui/              # shadcn UI components
│   ├── Header.tsx       # Main header with theme toggle
│   ├── NavigationTabs.tsx
│   ├── SensorCard.tsx
│   ├── StatusCard.tsx
│   ├── ProgressRing.tsx
│   ├── WaterTankVisualization.tsx
│   ├── PHScaleVisualization.tsx
│   ├── TemperatureGauge.tsx
│   ├── AQIBar.tsx
│   ├── SettingsModal.tsx
│   ├── AlertNotification.tsx
│   ├── LoadingSkeleton.tsx
│   ├── OfflineIndicator.tsx
│   ├── QuickActions.tsx
│   └── ExportModal.tsx
├── pages/
│   ├── Dashboard.tsx    # Main dashboard view
│   ├── Analytics.tsx    # Charts and trends
│   ├── Alerts.tsx       # Alert management
│   └── History.tsx      # Data history table
├── App.tsx              # Main app component
└── index.css            # Global styles (unchanged)

shared/
└── schema.ts            # TypeScript schemas and types

server/
└── (To be implemented in Task 2)
```

## User Preferences
- User prefers modern, responsive design with mobile-first approach
- Comprehensive media query support for all screen sizes
- Premium visual quality with emerald/teal color scheme
- Data export functionality (CSV/JSON)
- Offline mode support
- Real-time sensor monitoring
- Settings panel for customization

## Next Steps (Task 2 - Backend)
- [ ] Implement in-memory storage interface
- [ ] Create API endpoints for sensor data CRUD
- [ ] Build alerts management endpoints
- [ ] Add settings persistence
- [ ] Implement data export generation (CSV/JSON)
- [ ] Create service worker for offline caching
- [ ] Add real-time data simulation/polling

## Development Guidelines
- Keep `index.css` unchanged - use `tailwind.config.ts` for design tokens
- Follow Material Design + Fluent Design principles
- All interactive elements must have 44px minimum touch targets
- Use existing shadcn components when available
- Maintain comprehensive mobile responsiveness
- Test across all breakpoints (320px, 640px, 1024px, 1920px)

## Color Variables (Emerald/Teal Theme)
Light mode:
- Primary: `158 64% 35%` (Emerald)
- Accent: `187 85% 53%` (Cyan)
- Background: `210 20% 98%`
- Card: `210 17% 96%`

Dark mode:
- Primary: `158 64% 45%` (Brighter Emerald)
- Accent: `187 85% 53%` (Cyan)
- Background: `222 47% 7%`
- Card: `222 47% 8%`
