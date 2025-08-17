# GPS-Denied Drone Dashboard - Quick Start

## 🚀 Run the Complete System

**Single command to start everything:**
```bash
npx concurrently "node server/websocket-server.js" "npm run dev"
```

This starts:
- WebSocket server on `ws://localhost:8081` (mock telemetry)
- React dashboard on `http://localhost:8080`

## 🎯 What You Get

### Dashboard Features
- **Real-time Telemetry**: Battery %, altitude, speed, orientation
- **Obstacle Radar**: SVG-based circular proximity display
- **Video Feed**: Placeholder ready for camera stream integration
- **Live Logs**: Auto-scrolling system messages
- **Dark Theme**: Aerospace-inspired cyan/dark design

### Mock Data Server
- Realistic telemetry simulation
- Dynamic obstacle tracking
- Automatic log generation
- WebSocket real-time updates

## 🔧 Integration with Real Drone

### Update WebSocket Connection
Edit `src/hooks/useWebSocket.ts`:
```typescript
const { telemetryData, logs, connectionStatus } = useWebSocket('ws://your-drone-ip:port');
```

### Expected Data Format
Your drone should send JSON messages:
```json
{
  "type": "telemetry",
  "payload": {
    "battery": 85,
    "mode": "Auto",
    "connectivity": "Connected",
    "signal_strength": 78,
    "altitude": 25.3,
    "speed": 12.5,
    "heading": 45,
    "pitch": 2.1,
    "roll": -1.8,
    "yaw": 45.2,
    "obstacles": [
      {"id": "1", "angle": 30, "distance": 45, "type": "static"}
    ]
  }
}
```

## 📱 Navigation
- **Overview**: Complete dashboard view
- **Drone Status**: Battery and connectivity details
- **Telemetry**: Detailed flight data with attitude indicator
- **Video Feed**: Camera stream (placeholder)
- **Logs**: Real-time system messages

## 🎨 Customization
The design system is fully customizable through `src/index.css`. All colors use HSL format and semantic tokens for easy theming.

That's it! Your GPS-denied drone dashboard is ready for operation. 🛸