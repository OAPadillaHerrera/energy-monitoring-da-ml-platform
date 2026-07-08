

type BasicMetricsReport = {
  total_consumption: number;
  average_consumption: number;
  consumption_by_system: Record<string, number>;
  consumption_by_hour: Record<string, number>;
};

type StationMetricsReport = {
  total_energy: number;
  average_consumption: number;
  peak_consumption: number;
  min_consumption: number;
  std_consumption: number;
  avg_daily_energy: number;
  energy_by_hour: Record<string, number>;
  daily_energy: Record<string, number>;
};

type SystemMetricsReport = {
  system: string;
  total_energy: number;
  average_consumption: number;
  peak_consumption: number;
  min_consumption: number;
  std_consumption: number;
  avg_daily_energy: number;
  energy_by_hour: Record<string, number>;
  daily_energy: Record<string, number>;
  avg_hourly_profile: Record<string, number>;
};

type EnergyMetricsReport = {
  load_factor: number;
  load_factor_by_system: Record<string, number>;
  system_ranking: Record<string, number>;
};

type ZScoreData = {
  compute_z_score_example: Record<string, number>;
  system?: string;
  z_score_consumption: Record<string, number>;
  z_score_by_system: Record<string, number>;
};

type DetectionReport = {
  detect_anomalies_example: Record<string, string>;
  all_systems_detection: Record<
    string,
    Record<string, number>
  >;
  system?: string;
  by_system: Record<string, number>;
};

type ClassificationEvent = {
  timestamp: string;
  z_score: number;
  anomaly_type: string;

  root_cause?: string;

  system_name?: string;

  voltage_120v?: number;
  voltage_240v?: number;

  quality_flag?: string;
};

type ClassificationData = {
  classify_anomaly_examples: Record<string, string>;

  all_systems_summary: Record<
    string,
    ClassificationEvent[]
  >;

  all_systems_with_context: Record<
    string,
    ClassificationEvent[]
  >;

  root_cause_examples: Record<
    string,
    string
  >;

  full_pipeline: ClassificationEvent[];

  system?: string;

  by_system: ClassificationEvent[];

  context_classification: ClassificationEvent[];
};

type Alert = {
  level: string;
  message: string;
};

type PredictionEvent = {
  timestamp: string;
  system_name?: string;
  prediction: string;
  risk_level: string;
  action: string;
  alerts: Alert[];
};

type RootCauseReport = {
  system?: string;
  by_system: PredictionEvent[];
  all_systems_prediction: Record<
    string,
    PredictionEvent[]
  >;
};

export const exportBasicMetricsCSV = (
  report: BasicMetricsReport
): void => {

  if (!report) {
    return;
  }

  let csv = "";

  csv += "=== BASIC METRICS ===\n\n";

  csv += "Metric,Value\n";
  csv += `Total Consumption (kWh),${report.total_consumption}\n`;
  csv += `Average Consumption (kWh),${report.average_consumption}\n\n`;

  csv += "=== CONSUMPTION BY SYSTEM ===\n\n";

  csv += "System,Consumption (kWh)\n";

  Object.entries(report.consumption_by_system).forEach(
    ([system, consumption]) => {

      csv += `${system},${consumption}\n`;

    }
  );

  csv += "\n";

  csv += "=== CONSUMPTION BY HOUR ===\n\n";

  csv += "Hour,Consumption (kWh)\n";

  Object.entries(report.consumption_by_hour).forEach(
    ([hour, consumption]) => {

      csv += `${hour},${consumption}\n`;

    }
  );

  const blob = new Blob(
    [csv],
    {
      type: "text/csv;charset=utf-8;"
    }
  );

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "basic-metrics-report.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);

};

export const exportStationMetricsCSV = (
  report: StationMetricsReport
): void => {

  if (!report) {
    return;
  }

  let csv = "";

  csv += "=== STATION METRICS ===\n\n";

  csv += "Metric,Value\n";
  csv += `Total Energy (kWh),${report.total_energy}\n`;
  csv += `Average Consumption (kWh),${report.average_consumption}\n`;
  csv += `Peak Consumption (kWh),${report.peak_consumption}\n`;
  csv += `Minimum Consumption (kWh),${report.min_consumption}\n`;
  csv += `Standard Deviation,${report.std_consumption}\n`;
  csv += `Average Daily Energy (kWh),${report.avg_daily_energy}\n\n`;

  csv += "=== ENERGY BY HOUR ===\n\n";

  csv += "Hour,Energy (kWh)\n";

  Object.entries(report.energy_by_hour).forEach(
    ([hour, energy]) => {

      csv += `${hour},${energy}\n`;

    }
  );

  csv += "\n";

  csv += "=== DAILY ENERGY ===\n\n";

  csv += "Date,Energy (kWh)\n";

  Object.entries(report.daily_energy).forEach(
    ([day, energy]) => {

      csv += `${day},${energy}\n`;

    }
  );

  const blob = new Blob(
    [csv],
    {
      type: "text/csv;charset=utf-8;"
    }
  );

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "station-metrics-report.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);

};

export const exportSystemMetricsCSV = (
  report: SystemMetricsReport
): void => {

  if (!report) {
    return;
  }

  let csv = "";

  csv += "=== SYSTEM METRICS ===\n\n";

  csv += "Metric,Value\n";
  csv += `system,${report.system}\n`;
  csv += `total_energy,${report.total_energy}\n`;
  csv += `average_consumption,${report.average_consumption}\n`;
  csv += `peak_consumption,${report.peak_consumption}\n`;
  csv += `min_consumption,${report.min_consumption}\n`;
  csv += `std_consumption,${report.std_consumption}\n`;
  csv += `avg_daily_energy,${report.avg_daily_energy}\n\n`;

  csv += "=== ENERGY BY HOUR ===\n\n";

  csv += "Hour,Energy (kWh)\n";

  Object.entries(report.energy_by_hour).forEach(
    ([hour, energy]) => {

      csv += `${hour},${energy}\n`;

    }
  );

  csv += "\n";

  csv += "=== DAILY ENERGY ===\n\n";

  csv += "Date,Energy (kWh)\n";

  Object.entries(report.daily_energy).forEach(
    ([day, energy]) => {

      csv += `${day},${energy}\n`;

    }
  );

  csv += "\n";

  csv += "=== AVG HOURLY PROFILE ===\n\n";

  csv += "Hour,Average Consumption (kWh)\n";

  Object.entries(report.avg_hourly_profile).forEach(
    ([hour, value]) => {

      csv += `${hour},${value}\n`;

    }
  );

  const blob = new Blob(
    [csv],
    {
      type: "text/csv;charset=utf-8;"
    }
  );

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "system-metrics-report.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);

};

export const exportEnergyMetricsCSV = (
  report: EnergyMetricsReport
): void => {

  if (!report) {
    return;
  }

  let csv = "";

  csv += "=== ENERGY METRICS ===\n\n";

  csv += "Metric,Value\n";
  csv += `load_factor,${report.load_factor}\n\n`;

  csv += "=== LOAD FACTOR BY SYSTEM ===\n\n";

  csv += "System,Load Factor\n";

  Object.entries(report.load_factor_by_system).forEach(
    ([system, factor]) => {

      csv += `${system},${factor}\n`;

    }
  );

  csv += "\n";

  csv += "=== SYSTEM RANKING ===\n\n";

  csv += "System,Consumption (kWh)\n";

  Object.entries(report.system_ranking).forEach(
    ([system, energy]) => {

      csv += `${system},${energy}\n`;

    }
  );

  const blob = new Blob(
    [csv],
    {
      type: "text/csv;charset=utf-8;"
    }
  );

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "energy-metrics-report.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);

};

export const exportZScoreCSV = (
  report: ZScoreData
): void => {

  if (!report) {
    return;
  }

  let csv = "";

  csv += "=== Z-SCORE ANALYSIS ===\n\n";

  if (report.system) {

    csv += `System,${report.system}\n\n`;

  }

  csv += "=== COMPUTE Z SCORE EXAMPLE ===\n\n";

  csv += "Value,Z-Score\n";

  Object.entries(report.compute_z_score_example).forEach(
    ([value, score]) => {

      csv += `${value},${score}\n`;

    }
  );

  csv += "\n";

  csv += "=== Z SCORE CONSUMPTION ===\n\n";

  csv += "Timestamp,Z-Score\n";

  Object.entries(report.z_score_consumption).forEach(
    ([timestamp, score]) => {

      csv += `${timestamp},${score}\n`;

    }
  );

  csv += "\n";

  if (Object.keys(report.z_score_by_system).length > 0) {

    csv += "=== Z SCORE BY SYSTEM ===\n\n";

    csv += "Timestamp,Z-Score\n";

    Object.entries(report.z_score_by_system).forEach(
      ([timestamp, score]) => {

        csv += `${timestamp},${score}\n`;

      }
    );

  }

  const blob = new Blob(
    [csv],
    {
      type: "text/csv;charset=utf-8;"
    }
  );

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "zscore-analysis-report.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);

};

export const exportDetectionCSV = (
  report: DetectionReport
): void => {

  if (!report) {
    return;
  }

  let csv = "";

  csv += "=== DETECTION ANALYSIS ===\n\n";

  if (report.system) {

    csv += `System,${report.system}\n\n`;

  }

  csv += "=== DETECT ANOMALIES EXAMPLE ===\n\n";

  csv += "Value,Classification\n";

  Object.entries(report.detect_anomalies_example).forEach(
    ([value, classification]) => {

      csv += `${value},${classification}\n`;

    }
  );

  csv += "\n";

  csv += "=== ALL SYSTEMS DETECTION ===\n\n";

  csv += "System,Timestamp,Z-Score\n";

  Object.entries(report.all_systems_detection).forEach(
    ([system, anomalies]) => {

      Object.entries(anomalies).forEach(
        ([timestamp, score]) => {

          csv += `${system},${timestamp},${score}\n`;

        }
      );

    }
  );

  csv += "\n";

  if (Object.keys(report.by_system).length > 0) {

    csv += "=== BY SYSTEM ===\n\n";

    csv += "Timestamp,Z-Score\n";

    Object.entries(report.by_system).forEach(
      ([timestamp, score]) => {

        csv += `${timestamp},${score}\n`;

      }
    );

  }

  const blob = new Blob(
    [csv],
    {
      type: "text/csv;charset=utf-8;"
    }
  );

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "detection-analysis-report.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);

};

export const exportClassificationCSV = (
  report: ClassificationData
): void => {

  if (!report) {
    return;
  }

  let csv = "";

  csv += "=== CLASSIFICATION ANALYSIS ===\n\n";

  csv += "=== CLASSIFICATION EXAMPLES ===\n\n";

  csv += "Z-Score,Classification\n";

  Object.entries(report.classify_anomaly_examples).forEach(
    ([score, classification]) => {

      csv += `${score},${classification}\n`;

    }
  );

  csv += "\n";

  csv += "=== ROOT CAUSE EXAMPLES ===\n\n";

  csv += "Scenario,Root Cause\n";

  Object.entries(report.root_cause_examples).forEach(
    ([scenario, cause]) => {

      csv += `${scenario},${cause}\n`;

    }
  );

  csv += "\n";

  if (!report.system) {

    csv += "=== FULL PIPELINE ===\n\n";

    csv +=
      "System,Timestamp,Z-Score,Anomaly Type,Root Cause\n";

    report.full_pipeline.forEach(
      (event) => {

        csv +=
          `${event.system_name ?? ""},` +
          `${event.timestamp},` +
          `${event.z_score},` +
          `${event.anomaly_type},` +
          `${event.root_cause ?? ""}\n`;

      }
    );

  } else {

    csv += `System,${report.system}\n\n`;

    csv += "=== BY SYSTEM ===\n\n";

    csv +=
      "Timestamp,Z-Score,Anomaly Type\n";

    report.by_system.forEach(
      (event) => {

        csv +=
          `${event.timestamp},` +
          `${event.z_score},` +
          `${event.anomaly_type}\n`;

      }
    );

    csv += "\n";

    csv +=
      "=== CONTEXT CLASSIFICATION ===\n\n";

    csv +=
      "Timestamp,Z-Score,Anomaly Type,Root Cause,Voltage 120V,Voltage 240V,Quality Flag\n";

    report.context_classification.forEach(
      (event) => {

        csv +=
          `${event.timestamp},` +
          `${event.z_score},` +
          `${event.anomaly_type},` +
          `${event.root_cause ?? ""},` +
          `${event.voltage_120v ?? ""},` +
          `${event.voltage_240v ?? ""},` +
          `${event.quality_flag ?? ""}\n`;

      }
    );

  }

  const blob = new Blob(
    [csv],
    {
      type: "text/csv;charset=utf-8;"
    }
  );

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "classification-analysis-report.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);

};

export const exportRootCauseCSV = (
  report: RootCauseReport
): void => {

  if (!report) {
    return;
  }

  let csv = "";

  csv += "=== ROOT CAUSE ANALYSIS ===\n\n";

  if (report.system) {

    csv += `System,${report.system}\n\n`;

    csv +=
      "Timestamp,Prediction,Risk Level,Action,Alerts\n";

    report.by_system.forEach((event) => {

      const alerts = event.alerts
        .map(
          (alert) =>
            `${alert.level}: ${alert.message}`
        )
        .join(" | ");

      csv +=
        `${event.timestamp},${event.prediction},${event.risk_level},${event.action},"${alerts}"\n`;

    });

  } else {

    Object.entries(
      report.all_systems_prediction
    ).forEach(([system, events]) => {

      csv += `=== ${system} ===\n\n`;

      csv +=
        "Timestamp,Prediction,Risk Level,Action,Alerts\n";

      events.forEach((event) => {

        const alerts = event.alerts
          .map(
            (alert) =>
              `${alert.level}: ${alert.message}`
          )
          .join(" | ");

        csv +=
          `${event.timestamp},${event.prediction},${event.risk_level},${event.action},"${alerts}"\n`;

      });

      csv += "\n";

    });

  }

  const blob = new Blob(
    [csv],
    {
      type: "text/csv;charset=utf-8;"
    }
  );

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "root-cause-analysis-report.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);

};