

export type SimulationMode =
  | "hourly"
  | "events"
  | "daily"
  | "voltage";

export type ViewMode = "chart" | "table";

export type SystemEventRecord = {
  timestamp: string;
  system_id: string;
  event_type: string;
};

export type VoltageRecord = {
  timestamp: string;
  voltage_120v: number;
  voltage_240v: number;
  quality_flag: string;
};

export type BasicMetricsData = {
  consumption_by_system: Record<string, number>;
};