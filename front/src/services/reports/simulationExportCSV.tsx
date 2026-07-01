

export const exportHourlyCSV = (
  data: Record<string, number> | null
): void => {

  if (!data) {
    return;
  }

  const rows = Object.entries(data)
    .sort(
      ([a], [b]) =>
        new Date(a).getTime() -
        new Date(b).getTime()
    );

  let csv =
    "Timestamp,Energy Consumption (kWh)\n";

  rows.forEach(
    ([timestamp, value]) => {

      csv +=
        `${timestamp},${value}\n`;

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
    "hourly-data-report.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);

};

export const exportEventCSV = (
  events: {
    timestamp: string;
    system_id: string;
    event_type: string;
  }[]
): void => {

  if (events.length === 0) {
    return;
  }

  let csv =
    "Timestamp,System,Event Type\n";

  events.forEach((event) => {

    csv +=
      `${event.timestamp},${event.system_id},${event.event_type}\n`;

  });

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
    "event-records-report.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);

};

export const exportDailyCSV = (
  data: Record<string, number>
): void => {

  const rows = Object.entries(data);

  if (rows.length === 0) {
    return;
  }

  let csv =
    "Date,Energy Consumption (kWh)\n";

  rows.forEach(([date, value]) => {

    csv +=
      `${date},${value}\n`;

  });

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
    "daily-totals-report.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);

};

export const exportVoltageCSV = (
  data: {
    timestamp: string;
    voltage_120v: number;
    voltage_240v: number;
    quality_flag: string;
  }[]
): void => {

  if (data.length === 0) {
    return;
  }

  let csv =
    "Timestamp,Voltage 120V,Voltage 240V,Quality Flag\n";

  data.forEach((row) => {

    csv +=
      `${row.timestamp},${row.voltage_120v},${row.voltage_240v},${row.quality_flag}\n`;

  });

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
    "voltage-records-report.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);

};