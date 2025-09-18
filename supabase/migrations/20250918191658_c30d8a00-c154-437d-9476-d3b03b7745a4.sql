-- Create sensor_readings table for storing all sensor data
CREATE TABLE public.sensor_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL,
  soil_moisture DECIMAL(5,2),
  pitch DECIMAL(8,4),
  roll DECIMAL(8,4), 
  temperature DECIMAL(5,2),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for better query performance
CREATE INDEX idx_sensor_readings_timestamp ON public.sensor_readings(timestamp DESC);
CREATE INDEX idx_sensor_readings_device_id ON public.sensor_readings(device_id);

-- Enable Row Level Security
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is environmental monitoring data)
CREATE POLICY "Allow all operations on sensor_readings" 
ON public.sensor_readings 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Insert sample data for demonstration
INSERT INTO public.sensor_readings (device_id, soil_moisture, pitch, roll, temperature, latitude, longitude, timestamp) VALUES
('SENSOR_001', 45.2, 2.1, -1.3, 23.5, 40.7128, -74.0060, now() - interval '1 hour'),
('SENSOR_001', 47.8, 1.8, -0.9, 24.1, 40.7130, -74.0058, now() - interval '50 minutes'),
('SENSOR_001', 43.1, 2.4, -1.1, 23.8, 40.7132, -74.0056, now() - interval '40 minutes'),
('SENSOR_001', 46.5, 1.9, -1.2, 24.3, 40.7134, -74.0054, now() - interval '30 minutes'),
('SENSOR_001', 48.2, 2.2, -0.8, 24.7, 40.7136, -74.0052, now() - interval '20 minutes'),
('SENSOR_001', 44.7, 2.0, -1.0, 24.2, 40.7138, -74.0050, now() - interval '10 minutes'),
('SENSOR_001', 46.9, 1.7, -1.4, 23.9, 40.7140, -74.0048, now()),
('SENSOR_002', 52.3, -0.5, 2.1, 22.1, 34.0522, -118.2437, now() - interval '1 hour'),
('SENSOR_002', 54.1, -0.8, 2.3, 22.8, 34.0524, -118.2435, now() - interval '50 minutes'),
('SENSOR_002', 51.7, -0.3, 1.9, 22.5, 34.0526, -118.2433, now() - interval '40 minutes'),
('SENSOR_002', 53.5, -0.6, 2.2, 23.2, 34.0528, -118.2431, now() - interval '30 minutes'),
('SENSOR_002', 55.2, -0.9, 2.4, 23.6, 34.0530, -118.2429, now() - interval '20 minutes'),
('SENSOR_002', 52.8, -0.4, 2.0, 23.1, 34.0532, -118.2427, now() - interval '10 minutes'),
('SENSOR_002', 54.6, -0.7, 2.1, 22.9, 34.0534, -118.2425, now());

-- Enable realtime for the table
ALTER TABLE public.sensor_readings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sensor_readings;