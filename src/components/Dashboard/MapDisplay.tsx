import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Fix for default markers in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface DronePosition {
  latitude: number;
  longitude: number;
  heading: number;
}

interface MapDisplayProps {
  position?: DronePosition;
  fullscreen?: boolean;
}

export const MapDisplay = ({ position, fullscreen = false }: MapDisplayProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Default position (San Francisco)
  const defaultPosition = { latitude: 37.7749, longitude: -122.4194, heading: 0 };
  const currentPosition = position || defaultPosition;

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    mapRef.current = L.map(mapContainerRef.current).setView(
      [currentPosition.latitude, currentPosition.longitude],
      15
    );

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);

    // Add drone marker with custom icon
    const droneIcon = L.divIcon({
      html: `<div class="drone-marker">
        <div class="drone-icon">🛸</div>
        ${currentPosition.heading !== undefined ? 
          `<div class="drone-heading" style="transform: rotate(${currentPosition.heading}deg)">➤</div>` : 
          ''
        }
      </div>`,
      className: 'custom-drone-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    markerRef.current = L.marker(
      [currentPosition.latitude, currentPosition.longitude],
      { icon: droneIcon }
    ).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update marker position and heading when position changes
  useEffect(() => {
    if (mapRef.current && markerRef.current && position) {
      const newLatLng = L.latLng(position.latitude, position.longitude);
      
      // Update marker position
      markerRef.current.setLatLng(newLatLng);
      
      // Update marker icon with new heading
      const droneIcon = L.divIcon({
        html: `<div class="drone-marker">
          <div class="drone-icon">🛸</div>
          ${position.heading !== undefined ? 
            `<div class="drone-heading" style="transform: rotate(${position.heading}deg)">➤</div>` : 
            ''
          }
        </div>`,
        className: 'custom-drone-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      
      markerRef.current.setIcon(droneIcon);
      
      // Smoothly pan to new position
      mapRef.current.panTo(newLatLng, { animate: true, duration: 1 });
    }
  }, [position]);

  return (
    <Card className={`${fullscreen ? 'h-[calc(100vh-8rem)]' : 'h-80'}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary pulse-glow"></div>
          Drone Position
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          ref={mapContainerRef}
          className={`w-full ${fullscreen ? 'h-[calc(100vh-12rem)]' : 'h-64'} relative`}
        />
        
        {position && (
          <div className="absolute bottom-2 left-2 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-2 text-xs space-y-1 z-[1000]">
            <div className="text-muted-foreground">
              Lat: {position.latitude.toFixed(6)}
            </div>
            <div className="text-muted-foreground">
              Lng: {position.longitude.toFixed(6)}
            </div>
            {position.heading !== undefined && (
              <div className="text-muted-foreground">
                Heading: {Math.round(position.heading)}°
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};