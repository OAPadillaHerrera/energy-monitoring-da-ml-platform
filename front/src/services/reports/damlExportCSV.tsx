

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

