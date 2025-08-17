# GPS-Denied Drone Dashboard

A real-time monitoring dashboard for GPS-denied drone operations featuring live telemetry, obstacle detection, and system logs.

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation
```bash
npm install
```

### Running the Application

**Option 1: Run everything together (Recommended)**
```bash
npx concurrently "node server/websocket-server.js" "npm run dev"
```

**Option 2: Run separately**

Terminal 1 - Start the WebSocket server:
```bash
node server/websocket-server.js
```

Terminal 2 - Start the frontend:
```bash
npm run dev
```

The dashboard will be available at `http://localhost:8080`
The WebSocket server runs on `ws://localhost:8081`

## Features

- **Real-time Telemetry**: Live drone status including battery, altitude, speed, and orientation
- **Obstacle Detection**: Circular radar display showing nearby obstacles
- **Video Feed Placeholder**: Ready for drone camera integration
- **System Logs**: Auto-scrolling log panel with categorized messages
- **Dark Theme**: Aerospace-inspired dark UI with cyan accents

## Dashboard Sections

- **Overview**: Complete dashboard view with all panels
- **Drone Status**: Battery, flight mode, and connectivity status
- **Telemetry**: Detailed flight data and attitude indicators
- **Video Feed**: Placeholder for drone camera stream
- **Logs**: Real-time system and telemetry logs

## Customization

The dashboard is designed to be easily integrated with real drone telemetry systems. Simply modify the `useWebSocket` hook to connect to your actual drone's WebSocket endpoint.

## Tech Stack

- **Frontend**: React + Vite + TypeScript + TailwindCSS
- **Backend**: Node.js + WebSocket (ws library)
- **UI Components**: Shadcn/ui + Radix UI
- **Styling**: Custom drone-themed design system