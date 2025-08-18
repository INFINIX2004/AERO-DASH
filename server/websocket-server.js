import WebSocket, { WebSocketServer } from 'ws';
import express from 'express';

const app = express();
const port = 8081;

// Create WebSocket server
const wss = new WebSocketServer({ port });

// Mock telemetry data generator
let telemetryData = {
  battery: 85,
  mode: 'Auto',
  connectivity: 'Connected',
  signal_strength: 78,
  altitude: 25.3,
  speed: 12.5,
  heading: 45,
  pitch: 2.1,
  roll: -1.8,
  yaw: 45.2,
  position: {
    latitude: 37.7749, // San Francisco starting position
    longitude: -122.4194,
    heading: 45
  },
  obstacles: [
    { id: '1', angle: 30, distance: 45, type: 'static' },
    { id: '2', angle: 120, distance: 78, type: 'dynamic' },
    { id: '3', angle: 250, distance: 23, type: 'static' }
  ]
};

const logCategories = ['NAVIGATION', 'SENSOR', 'BATTERY', 'CONNECTION', 'OBSTACLE'];
const logLevels = ['info', 'warning', 'error'];
const logMessages = {
  NAVIGATION: [
    'GPS signal lost, switching to visual navigation',
    'Waypoint reached, proceeding to next target',
    'Course correction applied',
    'Landing sequence initiated'
  ],
  SENSOR: [
    'IMU calibration complete',
    'Lidar obstacle detected',
    'Camera focus adjusted',
    'Magnetometer drift compensation applied'
  ],
  BATTERY: [
    'Battery temperature normal',
    'Power consumption optimized',
    'Low battery warning threshold reached',
    'Charging system status normal'
  ],
  CONNECTION: [
    'Telemetry link established',
    'Data transmission rate optimized',
    'Signal strength fluctuation detected',
    'Communication protocol updated'
  ],
  OBSTACLE: [
    'Obstacle avoidance maneuver executed',
    'Clear path confirmed',
    'Dynamic obstacle tracked',
    'Safety perimeter maintained'
  ]
};

// Generate random telemetry updates
const updateTelemetry = () => {
  // Simulate realistic drone telemetry changes
  telemetryData.battery = Math.max(0, telemetryData.battery - Math.random() * 0.5);
  telemetryData.altitude += (Math.random() - 0.5) * 2;
  telemetryData.speed += (Math.random() - 0.5) * 3;
  telemetryData.heading += (Math.random() - 0.5) * 5;
  telemetryData.pitch += (Math.random() - 0.5) * 2;
  telemetryData.roll += (Math.random() - 0.5) * 2;
  telemetryData.yaw += (Math.random() - 0.5) * 3;
  telemetryData.signal_strength += (Math.random() - 0.5) * 10;
  
  // Update drone position (simulate movement)
  const movementSpeed = 0.00005; // Small increments for GPS coordinates
  const direction = telemetryData.position.heading * (Math.PI / 180);
  telemetryData.position.latitude += Math.cos(direction) * movementSpeed * (Math.random() + 0.5);
  telemetryData.position.longitude += Math.sin(direction) * movementSpeed * (Math.random() + 0.5);
  telemetryData.position.heading = telemetryData.heading;
  
  // Keep values in realistic ranges
  telemetryData.altitude = Math.max(0, Math.min(100, telemetryData.altitude));
  telemetryData.speed = Math.max(0, Math.min(25, telemetryData.speed));
  telemetryData.heading = ((telemetryData.heading % 360) + 360) % 360;
  telemetryData.pitch = Math.max(-30, Math.min(30, telemetryData.pitch));
  telemetryData.roll = Math.max(-30, Math.min(30, telemetryData.roll));
  telemetryData.yaw = ((telemetryData.yaw % 360) + 360) % 360;
  telemetryData.signal_strength = Math.max(0, Math.min(100, telemetryData.signal_strength));
  
  // Update connectivity based on signal strength
  if (telemetryData.signal_strength > 70) {
    telemetryData.connectivity = 'Connected';
  } else if (telemetryData.signal_strength > 30) {
    telemetryData.connectivity = 'Weak';
  } else {
    telemetryData.connectivity = 'Disconnected';
  }
  
  // Randomly update obstacles
  if (Math.random() > 0.8) {
    telemetryData.obstacles = telemetryData.obstacles.map(obstacle => ({
      ...obstacle,
      angle: (obstacle.angle + (Math.random() - 0.5) * 10) % 360,
      distance: Math.max(10, Math.min(100, obstacle.distance + (Math.random() - 0.5) * 20))
    }));
  }
};

const generateLog = () => {
  const category = logCategories[Math.floor(Math.random() * logCategories.length)];
  const messages = logMessages[category];
  const message = messages[Math.floor(Math.random() * messages.length)];
  
  let level = 'info';
  if (telemetryData.battery < 20) level = 'warning';
  if (telemetryData.battery < 10) level = 'error';
  if (telemetryData.connectivity === 'Disconnected') level = 'error';
  if (telemetryData.connectivity === 'Weak') level = 'warning';
  if (Math.random() > 0.9) level = logLevels[Math.floor(Math.random() * logLevels.length)];
  
  return {
    level,
    category,
    message
  };
};

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  // Send initial telemetry data
  ws.send(JSON.stringify({
    type: 'telemetry',
    payload: telemetryData
  }));
  
  // Send welcome log
  ws.send(JSON.stringify({
    type: 'log',
    payload: {
      level: 'info',
      category: 'CONNECTION',
      message: 'Drone telemetry stream initiated'
    }
  }));
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Broadcast telemetry updates every 1 second
setInterval(() => {
  updateTelemetry();
  
  const telemetryMessage = JSON.stringify({
    type: 'telemetry',
    payload: telemetryData
  });
  
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(telemetryMessage);
    }
  });
}, 1000);

// Broadcast log messages every 2-5 seconds
setInterval(() => {
  if (Math.random() > 0.3) { // 70% chance to generate a log
    const logMessage = JSON.stringify({
      type: 'log',
      payload: generateLog()
    });
    
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(logMessage);
      }
    });
  }
}, 2000 + Math.random() * 3000);

console.log(`WebSocket server running on port ${port}`);
console.log('Mock telemetry data will be broadcast to connected clients');

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down WebSocket server...');
  wss.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});
