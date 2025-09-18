import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface SensorLocation {
  id: string;
  deviceId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  temperature?: number;
  soilMoisture?: number;
}

interface SensorMapProps {
  locations: SensorLocation[];
}

// Fix leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom sensor marker icon
const sensorIcon = new L.DivIcon({
  html: `<div style="
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, hsl(188 95% 55%), hsl(158 75% 45%));
    border: 2px solid hsl(210 40% 98%);
    box-shadow: 0 0 10px hsl(188 95% 55% / 0.5);
    animation: pulse 2s infinite;
  "></div>`,
  className: 'custom-sensor-marker',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export const SensorMap = ({ locations }: SensorMapProps) => {
  // Default center - NYC coordinates, or first sensor location if available
  const defaultCenter: [number, number] = locations.length > 0 
    ? [locations[0].latitude, locations[0].longitude]
    : [40.7128, -74.0060];

  return (
    <Card className="bg-gradient-panel border-border shadow-panel h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-sensor-text-primary">
          <MapPin className="h-5 w-5 text-sensor-accent" />
          <span>Sensor Locations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-96">
          <MapContainer
            center={defaultCenter}
            zoom={10}
            className="absolute inset-0 rounded-b-lg overflow-hidden"
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((location) => (
              <Marker
                key={location.id}
                position={[location.latitude, location.longitude]}
                icon={sensorIcon}
              >
                <Popup className="sensor-popup">
                  <div style={{ color: 'hsl(210 40% 98%)', background: 'hsl(222 20% 5%)', padding: '8px', borderRadius: '6px' }}>
                    <strong style={{ color: 'hsl(188 95% 55%)' }}>{location.deviceId}</strong><br/>
                    <small>Last update: {new Date(location.timestamp).toLocaleString()}</small><br/>
                    {location.temperature && <small>Temp: {location.temperature}°C</small>}<br/>
                    {location.soilMoisture && <small>Moisture: {location.soilMoisture}%</small>}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};