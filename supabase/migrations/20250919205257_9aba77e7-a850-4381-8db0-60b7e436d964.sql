-- Drop the existing table and recreate with new schema
DROP TABLE IF EXISTS public.sensor_readings;

-- Create the new sensor_readings table with the specified schema
CREATE TABLE public.sensor_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  node_id INT NOT NULL,
  packet_no INT NOT NULL,
  accel_x INT NULL,
  accel_y INT NULL,
  accel_z INT NULL,
  gyro_x INT NULL,
  gyro_y INT NULL,
  gyro_z INT NULL,
  temperature NUMERIC(5,2) NULL,
  soil_raw INT NULL,
  soil_moisture NUMERIC(5,2) NULL,
  latitude NUMERIC(10,8) NULL,
  longitude NUMERIC(11,8) NULL,
  rssi INT NULL,
  snr NUMERIC(5,2) NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT sensor_readings_pkey PRIMARY KEY (id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sensor_readings_node_id ON public.sensor_readings(node_id);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_created_at ON public.sensor_readings(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on sensor_readings" 
ON public.sensor_readings 
FOR ALL 
USING (true) 
WITH CHECK (true);