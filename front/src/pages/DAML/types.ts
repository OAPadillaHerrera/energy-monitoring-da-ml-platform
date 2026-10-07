

export type BasicMetricsData = {
  total_consumption: number;
  average_consumption: number;
  consumption_by_system: Record<string, number>;
};

export type StationMetricsData = {
  total_energy: number;
  average_consumption: number;
  peak_consumption: number;
  min_consumption: number;
  std_consumption: number;
  avg_daily_energy: number;
  energy_by_hour: Record<string, number>;
  daily_energy: Record<string, number>;
};

export type SystemMetricsData = {
  total_energy: number;
  average_consumption: number;
  peak_consumption: number;
  min_consumption: number;
  std_consumption: number;
  avg_daily_energy: number;
  avg_hourly_profile: Record<string, number>;
};

export type EnergyMetricsData = {
  load_factor: number;
  load_factor_by_system: Record<string, number>;
  system_ranking: Record<string, number>;
};

export type MetricsBasicResponse = {
  consumption_by_system: Record<string, number>;
};

export type ZScoreData = {
  system?: string;
  z_score_consumption: Record<string, number>;
  z_score_by_system: Record<string, number>;
};

export type DetectionData = {
  system?: string;
  all_systems_detection: Record<string, Record<string, number>>;
  by_system: Record<string, number>;
};

export type ClassificationEvent = {
  system_name?: string;
  timestamp: string;
  anomaly_type: string;
  root_cause: string;
  z_score: number;
};

export type ClassificationData = {
  system?: string;
  full_pipeline: ClassificationEvent[];
  context_classification: Record<
    string,
    ClassificationEvent[]
  >;
};

export type Alert = {
  level: string;
  message: string;
};

export type PredictionEvent = {
  timestamp: string;
  system_name?: string;
  prediction: string;
  risk_level: string;
  action: string;
  alerts: Alert[];
};

export type RootCauseData = {
  system?: string;
  by_system: PredictionEvent[];
  all_systems_prediction: Record<
    string,
    PredictionEvent[]
  >;
};