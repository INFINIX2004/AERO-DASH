# Welcome to this project

## Project info

This is a GPS-Denied Drone Dashboard that displays real-time telemetry data, obstacle detection, system logs, and flight status.

**⚠️ Important: Currently Using Demo Data**
The dashboard currently connects to a mock WebSocket server (`server/websocket-server.js`) that generates simulated drone data for demonstration purposes. See the "Replacing Demo Data with Real Backend" section below for production deployment instructions.

## Demo Data vs Real Backend

### Current Demo Data Setup
- **Mock Server**: `server/websocket-server.js` generates fake telemetry and log data
- **WebSocket Connection**: Frontend connects to `ws://localhost:8081`
- **Data Flow**: Mock server broadcasts telemetry every 1 second and logs every 2-5 seconds
- **Connect/Disconnect**: Button in dashboard controls connection to mock server

### Replacing Demo Data with Real Backend

To connect this dashboard to your real drone backend:

#### 1. Update WebSocket Connection
Edit `src/hooks/useWebSocket.ts`:
```typescript
// Change this line (around line 35):
export const useWebSocket = (url: string = 'ws://localhost:8081') => {
// To your real WebSocket endpoint:
export const useWebSocket = (url: string = 'wss://your-drone-api.com/telemetry') => {
```

#### 2. Data Structure Requirements
Your real backend must send WebSocket messages in this format:
```json
// Telemetry data message
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
    "position": {
      "latitude": 37.7749,
      "longitude": -122.4194,
      "heading": 45
    },
    "obstacles": [
      {"id": "1", "angle": 30, "distance": 45, "type": "static"}
    ]
  }
}

// Log message
{
  "type": "log",
  "payload": {
    "level": "info", // "info" | "warning" | "error"
    "category": "NAVIGATION", // or any category
    "message": "Your log message here"
  }
}
```

#### 3. Environment Variables (Optional)
Create a `.env` file in your project root for configuration:
```env
VITE_WEBSOCKET_URL=wss://your-drone-api.com/telemetry
VITE_API_KEY=your_api_key_here
```

Then update `src/hooks/useWebSocket.ts`:
```typescript
const defaultUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8081';
export const useWebSocket = (url: string = defaultUrl) => {
```

#### 4. Authentication (If Required)
If your backend requires authentication, modify the WebSocket connection in `src/hooks/useWebSocket.ts`:
```typescript
const connect = () => {
  const wsUrl = new URL(url);
  wsUrl.searchParams.append('token', 'your-auth-token');
  wsRef.current = new WebSocket(wsUrl.toString());
  // ... rest of connection logic
};
```

#### 5. Files You Need to Modify
- `src/hooks/useWebSocket.ts` - Change WebSocket URL and add auth if needed
- `.env` (create new) - Add environment variables for your backend
- `src/components/Dashboard/DroneStatusCard.tsx` - Modify error handling if your error format differs
- `server/websocket-server.js` - Replace entirely with your real backend (or delete)

#### 6. Backend API Requirements
Your real backend WebSocket server should:
- Accept WebSocket connections on your chosen endpoint
- Send initial telemetry data when client connects
- Broadcast telemetry updates at regular intervals (recommended: 1-2 seconds)
- Send log messages as they occur
- Handle connection/disconnection gracefully

#### 7. Testing Your Integration
1. Update the WebSocket URL in `useWebSocket.ts`
2. Start your real backend WebSocket server
3. Run `npm run dev` (without the mock server)
4. Use the Connect/Disconnect button to test the connection
5. Verify telemetry data displays correctly
6. Check that logs appear in the logs panel

## How can I edit this code?

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
