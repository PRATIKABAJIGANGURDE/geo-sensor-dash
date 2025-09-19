import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SensorCard } from "./SensorCard";
import { SensorMap } from "./SensorMap";
import { SensorChart } from "./SensorChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Thermometer, 
  Droplets, 
  Compass, 
  RotateCcw, 
  Wifi, 
  WifiOff,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SensorReading {
  id: string;
  node_id: number;
  packet_no: number;
  accel_x?: number;
  accel_y?: number;
  accel_z?: number;
  gyro_x?: number;
  gyro_y?: number;
  gyro_z?: number;
  temperature?: number;
  soil_raw?: number;
  soil_moisture?: number;
  latitude?: number;
  longitude?: number;
  rssi?: number;
  snr?: number;
  created_at: string;
}

export const Dashboard = () => {
  const [sensorData, setSensorData] = useState<SensorReading[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchSensorData = async () => {
    try {
      const { data, error } = await supabase
        .from('sensor_readings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setSensorData(data || []);
      setLastUpdate(new Date());
      setIsConnected(true);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      setIsConnected(false);
      toast({
        title: "Connection Error",
        description: "Failed to fetch sensor data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSensorData();

    // Set up real-time subscription
    const subscription = supabase
      .channel('sensor_readings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sensor_readings'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchSensorData();
          toast({
            title: "Data Updated",
            description: "New sensor reading received",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Get latest readings for each node
  const getLatestReadings = () => {
    const nodeReadings: Record<number, SensorReading> = {};
    
    sensorData.forEach(reading => {
      if (!nodeReadings[reading.node_id] || 
          new Date(reading.created_at) > new Date(nodeReadings[reading.node_id].created_at)) {
        nodeReadings[reading.node_id] = reading;
      }
    });
    
    return Object.values(nodeReadings);
  };

  const latestReadings = getLatestReadings();

  // Get locations for map
  const sensorLocations = latestReadings
    .filter(reading => reading.latitude && reading.longitude)
    .map(reading => ({
      id: reading.id,
      node_id: reading.node_id,
      latitude: reading.latitude!,
      longitude: reading.longitude!,
      timestamp: reading.created_at,
      temperature: reading.temperature,
      soil_moisture: reading.soil_moisture,
    }));

  // Status determination helper
  const getStatus = (type: string, value?: number) => {
    if (value === undefined || value === null) return "normal";
    
    switch (type) {
      case "temperature":
        if (value > 30 || value < 10) return "critical";
        if (value > 28 || value < 15) return "warning";
        return "normal";
      case "moisture":
        if (value < 20 || value > 80) return "critical";
        if (value < 30 || value > 70) return "warning";
        return "normal";
      case "accel":
        if (Math.abs(value) > 2000) return "critical";
        if (Math.abs(value) > 1000) return "warning";
        return "normal";
      case "gyro":
        if (Math.abs(value) > 250) return "critical";
        if (Math.abs(value) > 100) return "warning";
        return "normal";
      default:
        return "normal";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sensor-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="h-12 w-12 text-sensor-accent animate-spin mx-auto" />
          <p className="text-sensor-text-primary text-lg">Loading sensor data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sensor-bg">
      {/* Header */}
      <header className="bg-gradient-panel border-b border-border shadow-panel">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-sensor-text-primary">
                GeoSensor Dashboard
              </h1>
              <p className="text-sensor-text-secondary mt-1">
                Real-time environmental monitoring system
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge 
                variant={isConnected ? "default" : "destructive"}
                className={isConnected ? "bg-sensor-success" : "bg-sensor-danger"}
              >
                {isConnected ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
              <Button 
                onClick={fetchSensorData}
                size="sm"
                variant="outline"
                className="border-sensor-accent text-sensor-accent hover:bg-sensor-accent hover:text-background"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
          {lastUpdate && (
            <p className="text-xs text-sensor-text-secondary mt-2">
              Last update: {lastUpdate.toLocaleString()}
            </p>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Sensor Cards Grid */}
        <section>
          <h2 className="text-xl font-semibold text-sensor-text-primary mb-6">
            Latest Sensor Readings
          </h2>
          {latestReadings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sensor-text-secondary">No sensor data available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestReadings.map((reading) => (
                <div key={reading.id} className="space-y-4">
                  {reading.temperature !== null && reading.temperature !== undefined && (
                    <SensorCard
                      title="Temperature"
                      value={reading.temperature}
                      unit="°C"
                      icon={Thermometer}
                      status={getStatus("temperature", reading.temperature)}
                      deviceId={`Node ${reading.node_id}`}
                    />
                  )}
                  {reading.soil_moisture !== null && reading.soil_moisture !== undefined && (
                    <SensorCard
                      title="Soil Moisture"
                      value={reading.soil_moisture}
                      unit="%"
                      icon={Droplets}
                      status={getStatus("moisture", reading.soil_moisture)}
                      deviceId={`Node ${reading.node_id}`}
                    />
                  )}
                  {reading.accel_x !== null && reading.accel_x !== undefined && (
                    <SensorCard
                      title="Accel X"
                      value={reading.accel_x}
                      unit="m/s²"
                      icon={Compass}
                      status={getStatus("accel", reading.accel_x)}
                      deviceId={`Node ${reading.node_id}`}
                    />
                  )}
                  {reading.gyro_x !== null && reading.gyro_x !== undefined && (
                    <SensorCard
                      title="Gyro X"
                      value={reading.gyro_x}
                      unit="°/s"
                      icon={RotateCcw}
                      status={getStatus("gyro", reading.gyro_x)}
                      deviceId={`Node ${reading.node_id}`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Map and Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Map */}
          <section>
            <SensorMap locations={sensorLocations} />
          </section>

          {/* Charts */}
          <section>
            <SensorChart data={sensorData.map(reading => ({
              id: reading.id,
              nodeId: reading.node_id,
              soil_moisture: reading.soil_moisture,
              accel_x: reading.accel_x,
              accel_y: reading.accel_y,
              accel_z: reading.accel_z,
              gyro_x: reading.gyro_x,
              gyro_y: reading.gyro_y,
              gyro_z: reading.gyro_z,
              temperature: reading.temperature,
              timestamp: reading.created_at
            }))} />
          </section>
        </div>
      </main>
    </div>
  );
};