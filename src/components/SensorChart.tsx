import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, TrendingUp } from "lucide-react";

interface SensorData {
  id: string;
  deviceId: string;
  soilMoisture?: number;
  pitch?: number;
  roll?: number;
  temperature?: number;
  timestamp: string;
}

interface SensorChartProps {
  data: SensorData[];
}

export const SensorChart = ({ data }: SensorChartProps) => {
  // Group data by device for better visualization
  const deviceData = data.reduce((acc, reading) => {
    if (!acc[reading.deviceId]) {
      acc[reading.deviceId] = [];
    }
    acc[reading.deviceId].push({
      ...reading,
      time: new Date(reading.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      timestamp: new Date(reading.timestamp).getTime()
    });
    return acc;
  }, {} as Record<string, any[]>);

  // Sort each device's data by timestamp
  Object.keys(deviceData).forEach(deviceId => {
    deviceData[deviceId].sort((a, b) => a.timestamp - b.timestamp);
  });

  // Combine all data for multi-device charts
  const combinedData = data
    .map(reading => ({
      ...reading,
      time: new Date(reading.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      timestamp: new Date(reading.timestamp).getTime()
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-sensor-panel border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sensor-text-primary font-medium">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}${entry.unit || ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartConfig = {
    height: 300,
    margin: { top: 20, right: 30, left: 20, bottom: 5 }
  };

  return (
    <Card className="bg-gradient-panel border-border shadow-panel">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-sensor-text-primary">
          <Activity className="h-5 w-5 text-sensor-accent" />
          <span>Sensor Data Over Time</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="temperature" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-sensor-bg">
            <TabsTrigger value="temperature" className="data-[state=active]:bg-sensor-accent data-[state=active]:text-background">
              Temperature
            </TabsTrigger>
            <TabsTrigger value="moisture" className="data-[state=active]:bg-sensor-accent data-[state=active]:text-background">
              Soil Moisture
            </TabsTrigger>
            <TabsTrigger value="orientation" className="data-[state=active]:bg-sensor-accent data-[state=active]:text-background">
              Orientation
            </TabsTrigger>
            <TabsTrigger value="combined" className="data-[state=active]:bg-sensor-accent data-[state=active]:text-background">
              All Sensors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="temperature" className="mt-6">
            <ResponsiveContainer width="100%" height={chartConfig.height}>
              <LineChart data={combinedData} margin={chartConfig.margin}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--sensor-text-secondary))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--sensor-text-secondary))"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="hsl(var(--sensor-accent))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--sensor-accent))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Temperature (°C)"
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="moisture" className="mt-6">
            <ResponsiveContainer width="100%" height={chartConfig.height}>
              <LineChart data={combinedData} margin={chartConfig.margin}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--sensor-text-secondary))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--sensor-text-secondary))"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="soilMoisture" 
                  stroke="hsl(var(--sensor-success))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--sensor-success))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Soil Moisture (%)"
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="orientation" className="mt-6">
            <ResponsiveContainer width="100%" height={chartConfig.height}>
              <LineChart data={combinedData} margin={chartConfig.margin}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--sensor-text-secondary))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--sensor-text-secondary))"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="pitch" 
                  stroke="hsl(var(--sensor-accent))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--sensor-accent))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Pitch (°)"
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="roll" 
                  stroke="hsl(var(--sensor-success))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--sensor-success))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Roll (°)"
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="combined" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-sensor-text-secondary mb-2">Temperature & Moisture</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--sensor-text-secondary))" fontSize={10} />
                    <YAxis stroke="hsl(var(--sensor-text-secondary))" fontSize={10} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="hsl(var(--sensor-accent))"
                      strokeWidth={1.5}
                      dot={false}
                      name="Temperature (°C)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="soilMoisture" 
                      stroke="hsl(var(--sensor-success))"
                      strokeWidth={1.5}
                      dot={false}
                      name="Soil Moisture (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="text-sm font-medium text-sensor-text-secondary mb-2">Pitch & Roll</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--sensor-text-secondary))" fontSize={10} />
                    <YAxis stroke="hsl(var(--sensor-text-secondary))" fontSize={10} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="pitch" 
                      stroke="hsl(var(--sensor-warning))"
                      strokeWidth={1.5}
                      dot={false}
                      name="Pitch (°)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="roll" 
                      stroke="hsl(var(--sensor-danger))"
                      strokeWidth={1.5}
                      dot={false}
                      name="Roll (°)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};