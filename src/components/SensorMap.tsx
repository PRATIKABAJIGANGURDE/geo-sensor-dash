import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Settings } from "lucide-react";

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

export const SensorMap = ({ locations }: SensorMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const initializeMap = (token: string) => {
    if (!mapContainer.current || !token) return;

    setIsLoading(true);
    mapboxgl.accessToken = token;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: locations.length > 0 ? [locations[0].longitude, locations[0].latitude] : [-74.0060, 40.7128],
        zoom: 10,
        pitch: 45,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      map.current.on('load', () => {
        setIsLoading(false);
        addSensorMarkers();
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setIsLoading(false);
      });

    } catch (error) {
      console.error('Failed to initialize map:', error);
      setIsLoading(false);
    }
  };

  const addSensorMarkers = () => {
    if (!map.current) return;

    locations.forEach((location) => {
      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.cssText = `
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: linear-gradient(135deg, hsl(188 95% 55%), hsl(158 75% 45%));
        border: 2px solid hsl(210 40% 98%);
        box-shadow: 0 0 10px hsl(188 95% 55% / 0.5);
        cursor: pointer;
        animation: pulse 2s infinite;
      `;

      // Create popup content
      const popupContent = `
        <div style="color: hsl(210 40% 98%); background: hsl(222 20% 5%); padding: 8px; border-radius: 6px;">
          <strong style="color: hsl(188 95% 55%);">${location.deviceId}</strong><br/>
          <small>Last update: ${new Date(location.timestamp).toLocaleString()}</small><br/>
          ${location.temperature ? `<small>Temp: ${location.temperature}°C</small><br/>` : ''}
          ${location.soilMoisture ? `<small>Moisture: ${location.soilMoisture}%</small>` : ''}
        </div>
      `;

      const popup = new mapboxgl.Popup({ 
        offset: 25,
        className: 'sensor-popup'
      }).setHTML(popupContent);

      new mapboxgl.Marker(markerElement)
        .setLngLat([location.longitude, location.latitude])
        .setPopup(popup)
        .addTo(map.current!);
    });
  };

  const handleSubmitToken = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_token', mapboxToken);
      setShowTokenInput(false);
      initializeMap(mapboxToken);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
      setShowTokenInput(false);
      initializeMap(savedToken);
    }

    return () => {
      map.current?.remove();
    };
  }, [locations]);

  if (showTokenInput) {
    return (
      <Card className="bg-gradient-panel border-border shadow-panel">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-sensor-text-primary">
            <Settings className="h-5 w-5 text-sensor-accent" />
            <span>Map Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mapbox-token" className="text-sensor-text-secondary">
              Mapbox Public Token
            </Label>
            <Input
              id="mapbox-token"
              type="password"
              placeholder="pk.ey..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="bg-sensor-bg border-border text-sensor-text-primary"
            />
            <p className="text-xs text-sensor-text-secondary">
              Get your token from{" "}
              <a 
                href="https://mapbox.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sensor-accent hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
          <Button 
            onClick={handleSubmitToken}
            disabled={!mapboxToken.trim()}
            className="w-full bg-gradient-primary text-background hover:opacity-90"
          >
            Initialize Map
          </Button>
        </CardContent>
      </Card>
    );
  }

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
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-sensor-bg/80 z-10">
              <div className="text-sensor-text-primary">Loading map...</div>
            </div>
          )}
          <div ref={mapContainer} className="absolute inset-0 rounded-b-lg overflow-hidden" />
        </div>
      </CardContent>
    </Card>
  );
};