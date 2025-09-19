import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, TrendingUp } from "lucide-react";

interface SensorData {
  id: string;
  nodeId: number;
  soil_moisture?: number;
  accel_x?: number;
  accel_y?: number;
  accel_z?: number;
  gyro_x?: number;
  gyro_y?: number;
  gyro_z?: number;
  temperature?: number;
  timestamp: string;
}

interface SensorChartProps {
  data: SensorData[];
}

export const SensorChart = ({ data }: SensorChartProps) => {
  // Group data by node for better visualization
  const nodeData = data.reduce((acc, reading) => {
    if (!acc[reading.nodeId]) {
      acc[reading.nodeId] = [];
    }
    acc[reading.nodeId].push({
      ...reading,
      time: new Date(reading.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      timestamp: new Date(reading.timestamp).getTime()
    });
    return acc;
  }, {} as Record<number, any[]>);

  // Sort each node's data by timestamp
  Object.keys(nodeData).forEach(nodeId => {
    nodeData[nodeId as any].sort((a, b) => a.timestamp - b.timestamp);
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
            <TabsTrigger value="accel" className="data-[state=active]:bg-sensor-accent data-[state=active]:text-background">
              Accelerometer
            </TabsTrigger>
            <TabsTrigger value="gyro" className="data-[state=active]:bg-sensor-accent data-[state=active]:text-background">
              Gyroscope
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
                  dataKey="soil_moisture" 
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

          <TabsContent value="accel" className="mt-6">
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
                  dataKey="accel_x" 
                  stroke="hsl(var(--sensor-accent))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--sensor-accent))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Accel X (m/s²)"
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="accel_y" 
                  stroke="hsl(var(--sensor-success))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--sensor-success))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Accel Y (m/s²)"
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="accel_z" 
                  stroke="hsl(var(--sensor-warning))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--sensor-warning))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Accel Z (m/s²)"
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="gyro" className="mt-6">
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
                  dataKey="gyro_x" 
                  stroke="hsl(var(--sensor-accent))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--sensor-accent))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Gyro X (°/s)"
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="gyro_y" 
                  stroke="hsl(var(--sensor-success))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--sensor-success))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Gyro Y (°/s)"
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="gyro_z" 
                  stroke="hsl(var(--sensor-warning))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--sensor-warning))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Gyro Z (°/s)"
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};