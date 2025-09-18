import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface SensorCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  status: "normal" | "warning" | "critical";
  trend?: "up" | "down" | "stable";
  deviceId: string;
}

export const SensorCard = ({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  status, 
  trend, 
  deviceId 
}: SensorCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "warning": return "bg-sensor-warning";
      case "critical": return "bg-sensor-danger";
      default: return "bg-sensor-success";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "warning": return "Warning";
      case "critical": return "Critical";
      default: return "Normal";
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up": return "↗";
      case "down": return "↘";
      default: return "→";
    }
  };

  return (
    <Card className="bg-gradient-panel border-border shadow-panel hover:shadow-glow transition-all duration-300 animate-slide-up">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-sensor-text-secondary">
          {title}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={`text-xs ${getStatusColor(status)} text-background`}>
            {getStatusLabel(status)}
          </Badge>
          <Icon className="h-4 w-4 text-sensor-accent" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-sensor-text-primary">
              {typeof value === 'number' ? value.toFixed(1) : value}
            </span>
            <span className="text-xs text-sensor-text-secondary">{unit}</span>
          </div>
          {trend && (
            <span className="text-sm text-sensor-text-secondary">
              {getTrendIcon(trend)}
            </span>
          )}
        </div>
        <div className="mt-2">
          <span className="text-xs text-sensor-text-secondary">Device: {deviceId}</span>
        </div>
      </CardContent>
    </Card>
  );
};