

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

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

export const exportBasicMetricsPDF = (
  report: BasicMetricsReport
): void => {

  if (!report) {
    return;
  }

  const systemLabels: Record<string, string> = {
    "Corporate Lighting System": "CLS",
    "Canopy Lighting System": "CaLS",
    "Perimeter Lighting System": "PLS",
    "Office and General Services System": "O&GSS",
    "Submersible Pump System": "SPS",
    "Fuel Dispenser System": "FDS",
    "Air Conditioning System - Server Room": "ACS-SR",
    "Customer Service Kiosk System - Refrigeration": "CSKS-R",
    "Air Conditioning System - Office Area": "ACS-OA",
    "Customer Service Kiosk System - Coffee Machine": "CSKS-CM",
    "Price Display System": "PDS"
  };

  const barColors = [
    "#00c2ff",
    "#ff4d4d",
    "#ffd500",
    "#7c4dff",
    "#00e676",
    "#ff9100",
    "#ff1744",
    "#00b0ff",
    "#76ff03",
    "#f50057",
    "#c51162"
  ];

  const systemRows =
    Object.entries(report.consumption_by_system)
      .map(
        ([system, value]) =>
          [system, Number(value)] as [string, number]
      )
      .sort(
        (a, b) => b[1] - a[1]
      );

  const systemChartLabels =
    systemRows.map(
      ([system]) =>
        systemLabels[system] || system
    );

  const systemChartValues =
    systemRows.map(
      ([, value]) => value
    );

  const systemCanvas =
    document.createElement("canvas");

  systemCanvas.width = 1200;
  systemCanvas.height = 500;

  const systemContext =
    systemCanvas.getContext("2d");

  if (!systemContext) {
    return;
  }

  systemContext.fillStyle = "#FFFFFF";

  systemContext.fillRect(
    0,
    0,
    systemCanvas.width,
    systemCanvas.height
  );

  const systemChart =
    new Chart(systemContext, {

      type: "bar",

      data: {

        labels: systemChartLabels,

        datasets: [

          {

            label:
              "Consumption (kWh)",

            data:
              systemChartValues,

            backgroundColor:
              systemChartLabels.map(
                (_, i) =>
                  barColors[
                    i % barColors.length
                  ]
              ),

            borderColor:
              systemChartLabels.map(
                (_, i) =>
                  barColors[
                    i % barColors.length
                  ]
              ),

            borderWidth: 3,

            borderRadius: 6

          }

        ]

      },

      options: {

        responsive: false,

        animation: false,

        plugins: {

          legend: {

            display: true

          }

        },

        scales: {

          x: {

            ticks: {

              maxRotation: 0,

              autoSkip: false

            }

          },

          y: {

            beginAtZero: true

          }

        }

      }

    });

  systemChart.update();

  const systemChartImage =
    systemCanvas.toDataURL(
      "image/png"
    );

  const pdf =
    new jsPDF(
      "p",
      "mm",
      "a4"
    );

  pdf.setFontSize(18);

  pdf.text(
    "Basic Metrics Report",
    14,
    18
  );

  pdf.setFontSize(10);

  pdf.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    25
  );

  pdf.setFontSize(14);

  pdf.text(
    "BASIC METRICS",
    14,
    35
  );

  pdf.setFontSize(11);

  pdf.text(
    `Total Consumption (kWh): ${report.total_consumption.toFixed(2)}`,
    14,
    43
  );

  pdf.text(
    `Average Consumption (kWh): ${report.average_consumption.toFixed(2)}`,
    14,
    50
  );

  pdf.setFontSize(14);

  pdf.text(
    "CONSUMPTION BY SYSTEM",
    14,
    62
  );

  pdf.addImage(
    systemChartImage,
    "PNG",
    14,
    68,
    180,
    75
  );

  autoTable(pdf, {

    startY: 148,

    head: [[

      "System",

      "Consumption (kWh)"

    ]],

    body:
      systemRows.map(
        ([system, value]) => [

          system,

          value.toFixed(2)

        ]
      )

  });

  pdf.addPage();

  const hourlyRows =
    Object.entries(
      report.consumption_by_hour
    )
      .map(
        ([hour, value]) =>
          [
            Number(hour),
            Number(value)
          ] as [number, number]
      )
      .sort(
        (a, b) =>
          a[0] - b[0]
      );

  const hourlyLabels =
    hourlyRows.map(
      ([hour]) =>
        hour
          .toString()
          .padStart(2, "0")
    );

  const hourlyValues =
    hourlyRows.map(
      ([, value]) => value
    );

  const hourlyCanvas =
    document.createElement(
      "canvas"
    );

  hourlyCanvas.width = 1200;

  hourlyCanvas.height = 500;

  const hourlyContext =
    hourlyCanvas.getContext(
      "2d"
    );

  if (!hourlyContext) {

    systemChart.destroy();

    return;

  }

  hourlyContext.fillStyle =
    "#FFFFFF";

  hourlyContext.fillRect(
    0,
    0,
    hourlyCanvas.width,
    hourlyCanvas.height
  );

  const hourlyChart =
    new Chart(
      hourlyContext,
      {

        type: "line",

        data: {

          labels:
            hourlyLabels,

          datasets: [

            {

              label:
                "Consumption (kWh)",

              data:
                hourlyValues,

              borderColor:
                "#00c2ff",

              backgroundColor:
                "rgba(0,194,255,0.18)",

              borderWidth: 2,

              tension: 0.35,

              fill: true,

              pointStyle:
                "rect",

              pointRadius: 4,

              pointHoverRadius: 6,

              pointBackgroundColor:
                "#00c2ff",

              pointBorderWidth: 0

            }

          ]

        },

        options: {

          responsive: false,

          animation: false,

          plugins: {

            legend: {

              display: true

            }

          },

          scales: {

            x: {

              ticks: {

                maxRotation: 0,

                autoSkip: false

              }

            },

            y: {

              beginAtZero: true

            }

          }

        }

      }
    );

  hourlyChart.update();

  const hourlyChartImage =
    hourlyCanvas.toDataURL(
      "image/png"
    );

  pdf.setFontSize(14);

  pdf.text(
    "CONSUMPTION BY HOUR",
    14,
    18
  );

  pdf.addImage(
    hourlyChartImage,
    "PNG",
    14,
    24,
    180,
    75
  );

  autoTable(pdf, {

    startY: 106,

    head: [[

      "Hour",

      "Consumption (kWh)"

    ]],

    body:
      hourlyRows.map(
        ([hour, value]) => [

          hour
            .toString()
            .padStart(2, "0"),

          value.toFixed(2)

        ]
      )

  });

  pdf.save(
    "basic-metrics-report.pdf"
  );

  systemChart.destroy();

  hourlyChart.destroy();

};

export const exportStationMetricsPDF = (
  report: StationMetricsReport
): void => {

  if (!report) {
    return;
  }

  const hourlyRows =
    Object.entries(report.energy_by_hour)
      .map(
        ([timestamp, value]) => ({
          timestamp,
          value: Number(value)
        })
      )
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() -
          new Date(b.timestamp).getTime()
      )
      .slice(-72);

  const dailyRows =
    Object.entries(report.daily_energy)
      .map(
        ([date, value]) => ({
          date,
          value: Number(value)
        })
      )
      .sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      );

  const hourlyCanvas =
    document.createElement("canvas");

  hourlyCanvas.width = 1200;

  hourlyCanvas.height = 500;

  const hourlyContext =
    hourlyCanvas.getContext("2d");

  if (!hourlyContext) {
    return;
  }

  hourlyContext.fillStyle =
    "#FFFFFF";

  hourlyContext.fillRect(
    0,
    0,
    hourlyCanvas.width,
    hourlyCanvas.height
  );

  const hourlyChart =
    new Chart(hourlyContext, {

      type: "line",

      data: {

        labels:
          hourlyRows.map(
            (row) =>
              row.timestamp
          ),

        datasets: [

          {

            label:
              "Hourly Energy (kWh)",

            data:
              hourlyRows.map(
                (row) =>
                  row.value
              ),

            borderColor:
              "#00c2ff",

            backgroundColor:
              "rgba(0,194,255,0.18)",

            borderWidth: 2,

            tension: 0.35,

            fill: true,

            pointStyle: "rect",

            pointRadius: 4,

            pointHoverRadius: 6,

            pointBackgroundColor:
              "#00c2ff",

            pointBorderWidth: 0

          }

        ]

      },

      options: {

        responsive: false,

        animation: false,

        plugins: {

          legend: {

            display: true

          }

        },

        scales: {

          x: {

            ticks: {

              maxRotation: 0,

              autoSkip: true,

              maxTicksLimit: 12

            }

          },

          y: {

            beginAtZero: true

          }

        }

      }

    });

  hourlyChart.update();

  const hourlyImage =
    hourlyCanvas.toDataURL(
      "image/png"
    );

  const pdf =
    new jsPDF(
      "p",
      "mm",
      "a4"
    );

  pdf.setFontSize(18);

  pdf.text(
    "Station Metrics Report",
    14,
    18
  );

  pdf.setFontSize(10);

  pdf.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    25
  );

  pdf.setFontSize(14);

  pdf.text(
    "KPI Summary",
    14,
    35
  );

  autoTable(pdf, {

    startY: 40,

    head: [[
      "Metric",
      "Value"
    ]],

    body: [

      [
        "Total Energy (kWh)",
        report.total_energy.toFixed(2)
      ],

      [
        "Average Consumption (kWh)",
        report.average_consumption.toFixed(2)
      ],

      [
        "Peak Consumption (kWh)",
        report.peak_consumption.toFixed(2)
      ],

      [
        "Minimum Consumption (kWh)",
        report.min_consumption.toFixed(2)
      ],

      [
        "Standard Deviation",
        report.std_consumption.toFixed(2)
      ],

      [
        "Average Daily Energy (kWh)",
        report.avg_daily_energy.toFixed(2)
      ]

    ]

  });

    pdf.addImage(
    hourlyImage,
    "PNG",
    14,
    95,
    180,
    75
  );

  autoTable(pdf, {

    startY: 178,

    head: [[

      "Timestamp",

      "Energy (kWh)"

    ]],

    body:
      hourlyRows.map(
        (row) => [

          row.timestamp,

          row.value.toFixed(2)

        ]
      )

  });

  pdf.addPage();

  const dailyCanvas =
    document.createElement("canvas");

  dailyCanvas.width = 1200;

  dailyCanvas.height = 500;

  const dailyContext =
    dailyCanvas.getContext("2d");

  if (!dailyContext) {
    return;
  }

  dailyContext.fillStyle =
    "#FFFFFF";

  dailyContext.fillRect(
    0,
    0,
    dailyCanvas.width,
    dailyCanvas.height
  );

  const dailyChart =
    new Chart(dailyContext, {

      type: "line",

      data: {

        labels:
          dailyRows.map(
            (row) =>
              row.date
          ),

        datasets: [

          {

            label:
              "Daily Energy (kWh)",

            data:
              dailyRows.map(
                (row) =>
                  row.value
              ),

            borderColor:
              "#00c2ff",

            backgroundColor:
              "rgba(0,194,255,0.18)",

            borderWidth: 2,

            tension: 0.35,

            fill: true,

            pointStyle: "rect",

            pointRadius: 5,

            pointHoverRadius: 6,

            pointBackgroundColor:
              "#00c2ff",

            pointBorderWidth: 0

          }

        ]

      },

      options: {

        responsive: false,

        animation: false,

        plugins: {

          legend: {

            display: true

          }

        },

        scales: {

          x: {

            ticks: {

              maxRotation: 0,

              autoSkip: true,

              maxTicksLimit: 12

            }

          },

          y: {

            beginAtZero: true

          }

        }

      }

    });

  dailyChart.update();

  const dailyImage =
    dailyCanvas.toDataURL(
      "image/png"
    );

  pdf.setFontSize(16);

  pdf.text(
    "Daily Energy",
    14,
    18
  );

  pdf.addImage(
    dailyImage,
    "PNG",
    14,
    25,
    180,
    75
  );

    autoTable(pdf, {

    startY: 108,

    head: [[

      "Date",

      "Energy (kWh)"

    ]],

    body:
      dailyRows.map(
        (row) => [

          row.date,

          row.value.toFixed(2)

        ]
      )

  });

  pdf.save(
    "station-metrics-report.pdf"
  );

  hourlyChart.destroy();

  dailyChart.destroy();

};

export const exportSystemMetricsPDF = (
  report: SystemMetricsReport
): void => {

  if (!report) {
    return;
  }

  const hourlyRows =
    Object.entries(report.energy_by_hour)
      .map(
        ([timestamp, value]) => ({
          timestamp,
          value: Number(value)
        })
      )
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() -
          new Date(b.timestamp).getTime()
      )
      .slice(-72);

  const dailyRows =
    Object.entries(report.daily_energy)
      .map(
        ([date, value]) => ({
          date,
          value: Number(value)
        })
      )
      .sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      );

  const profileRows =
    Object.entries(report.avg_hourly_profile)
      .map(
        ([hour, value]) => ({
          hour,
          value: Number(value)
        })
      )
      .sort(
        (a, b) =>
          Number(a.hour) -
          Number(b.hour)
      );

  const hourlyCanvas =
    document.createElement("canvas");

  hourlyCanvas.width = 1200;

  hourlyCanvas.height = 500;

  const hourlyContext =
    hourlyCanvas.getContext("2d");

  if (!hourlyContext) {
    return;
  }

  hourlyContext.fillStyle =
    "#FFFFFF";

  hourlyContext.fillRect(
    0,
    0,
    hourlyCanvas.width,
    hourlyCanvas.height
  );

  const hourlyChart =
    new Chart(hourlyContext, {

      type: "line",

      data: {

        labels:
          hourlyRows.map(
            (row) =>
              row.timestamp
          ),

        datasets: [

          {

            label:
              "Hourly Energy (kWh)",

            data:
              hourlyRows.map(
                (row) =>
                  row.value
              ),

            borderColor:
              "#00c2ff",

            backgroundColor:
              "rgba(0,194,255,0.18)",

            borderWidth: 2,

            tension: 0.35,

            fill: true,

            pointStyle: "rect",

            pointRadius: 4,

            pointHoverRadius: 6,

            pointBackgroundColor:
              "#00c2ff",

            pointBorderWidth: 0

          }

        ]

      },

      options: {

        responsive: false,

        animation: false,

        plugins: {

          legend: {

            display: true

          }

        },

        scales: {

          x: {

            ticks: {

              maxRotation: 0,

              autoSkip: true,

              maxTicksLimit: 12

            }

          },

          y: {

            beginAtZero: true

          }

        }

      }

    });

  hourlyChart.update();

  const hourlyImage =
    hourlyCanvas.toDataURL(
      "image/png"
    );

  const pdf =
    new jsPDF(
      "p",
      "mm",
      "a4"
    );

  pdf.setFontSize(18);

  pdf.text(
    "System Metrics Report",
    14,
    18
  );

  pdf.setFontSize(11);

  pdf.text(
    `System: ${report.system}`,
    14,
    26
  );

  pdf.setFontSize(10);

  pdf.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    33
  );

  pdf.setFontSize(14);

  pdf.text(
    "KPI Summary",
    14,
    43
  );

  autoTable(pdf, {

    startY: 48,

    head: [[
      "Metric",
      "Value"
    ]],

    body: [

      [
        "Total Energy (kWh)",
        report.total_energy.toFixed(2)
      ],

      [
        "Average Consumption (kWh)",
        report.average_consumption.toFixed(2)
      ],

      [
        "Peak Consumption (kWh)",
        report.peak_consumption.toFixed(2)
      ],

      [
        "Minimum Consumption (kWh)",
        report.min_consumption.toFixed(2)
      ],

      [
        "Standard Deviation",
        report.std_consumption.toFixed(2)
      ],

      [
        "Average Daily Energy (kWh)",
        report.avg_daily_energy.toFixed(2)
      ]

    ]

  });

    pdf.addImage(
    hourlyImage,
    "PNG",
    14,
    103,
    180,
    75
  );

  autoTable(pdf, {

    startY: 186,

    head: [[

      "Timestamp",

      "Energy (kWh)"

    ]],

    body:
      hourlyRows.map(
        (row) => [

          row.timestamp,

          row.value.toFixed(2)

        ]
      )

  });

  pdf.addPage();

  const dailyCanvas =
    document.createElement("canvas");

  dailyCanvas.width = 1200;

  dailyCanvas.height = 500;

  const dailyContext =
    dailyCanvas.getContext("2d");

  if (!dailyContext) {
    return;
  }

  dailyContext.fillStyle =
    "#FFFFFF";

  dailyContext.fillRect(
    0,
    0,
    dailyCanvas.width,
    dailyCanvas.height
  );

  const dailyChart =
    new Chart(dailyContext, {

      type: "line",

      data: {

        labels:
          dailyRows.map(
            (row) =>
              row.date
          ),

        datasets: [

          {

            label:
              "Daily Energy (kWh)",

            data:
              dailyRows.map(
                (row) =>
                  row.value
              ),

            borderColor:
              "#00c2ff",

            backgroundColor:
              "rgba(0,194,255,0.18)",

            borderWidth: 2,

            tension: 0.35,

            fill: true,

            pointStyle: "rect",

            pointRadius: 5,

            pointHoverRadius: 6,

            pointBackgroundColor:
              "#00c2ff",

            pointBorderWidth: 0

          }

        ]

      },

      options: {

        responsive: false,

        animation: false,

        plugins: {

          legend: {

            display: true

          }

        },

        scales: {

          x: {

            ticks: {

              maxRotation: 0,

              autoSkip: true,

              maxTicksLimit: 12

            }

          },

          y: {

            beginAtZero: true

          }

        }

      }

    });

  dailyChart.update();

  const dailyImage =
    dailyCanvas.toDataURL(
      "image/png"
    );

  pdf.setFontSize(16);

  pdf.text(
    "Daily Energy",
    14,
    18
  );

  pdf.addImage(
    dailyImage,
    "PNG",
    14,
    25,
    180,
    75
  );

  autoTable(pdf, {

    startY: 108,

    head: [[

      "Date",

      "Energy (kWh)"

    ]],

    body:
      dailyRows.map(
        (row) => [

          row.date,

          row.value.toFixed(2)

        ]
      )

  });

  pdf.addPage();

  const profileCanvas =
    document.createElement("canvas");

  profileCanvas.width = 1200;

  profileCanvas.height = 500;

  const profileContext =
    profileCanvas.getContext("2d");

  if (!profileContext) {
    return;
  }

  profileContext.fillStyle =
    "#FFFFFF";

  profileContext.fillRect(
    0,
    0,
    profileCanvas.width,
    profileCanvas.height
  );

  const profileChart =
    new Chart(profileContext, {

      type: "line",

      data: {

        labels:
          profileRows.map(
            (row) =>
              `${row.hour}:00`
          ),

        datasets: [

          {

            label:
              "Average Hourly Profile (kWh)",

            data:
              profileRows.map(
                (row) =>
                  row.value
              ),

            borderColor:
              "#00c2ff",

            backgroundColor:
              "rgba(0,194,255,0.18)",

            borderWidth: 2,

            tension: 0.35,

            fill: true,

            pointStyle: "rect",

            pointRadius: 5,

            pointHoverRadius: 6,

            pointBackgroundColor:
              "#00c2ff",

            pointBorderWidth: 0

          }

        ]

      },

      options: {

        responsive: false,

        animation: false,

        plugins: {

          legend: {

            display: true

          }

        },

        scales: {

          x: {

            ticks: {

              maxRotation: 0,

              autoSkip: false

            }

          },

          y: {

            beginAtZero: true

          }

        }

      }

    });

  profileChart.update();

  const profileImage =
    profileCanvas.toDataURL(
      "image/png"
    );

  pdf.setFontSize(16);

  pdf.text(
    "Average Hourly Profile",
    14,
    18
  );

  pdf.addImage(
    profileImage,
    "PNG",
    14,
    25,
    180,
    75
  );

  autoTable(pdf, {

    startY: 108,

    head: [[

      "Hour",

      "Average Energy (kWh)"

    ]],

    body:
      profileRows.map(
        (row) => [

          `${row.hour}:00`,

          row.value.toFixed(2)

        ]
      )

  });

  pdf.save(
    "system-metrics-report.pdf"
  );

  hourlyChart.destroy();

  dailyChart.destroy();

  profileChart.destroy();

};

export const exportEnergyMetricsPDF = (
  report: EnergyMetricsReport
): void => {

  if (!report) {
    return;
  }

  const loadFactorRows =
    Object.entries(report.load_factor_by_system)
      .map(
        ([system, value]) => ({
          system,
          value: Number(value)
        })
      )
      .sort(
        (a, b) =>
          b.value - a.value
      );

  const rankingRows =
    Object.entries(report.system_ranking)
      .map(
        ([system, value]) => ({
          system,
          value: Number(value)
        })
      )
      .sort(
        (a, b) =>
          b.value - a.value
      );

  const loadCanvas =
    document.createElement("canvas");

  loadCanvas.width = 1200;

  loadCanvas.height = 500;

  const loadContext =
    loadCanvas.getContext("2d");

  if (!loadContext) {
    return;
  }

  loadContext.fillStyle =
    "#FFFFFF";

  loadContext.fillRect(
    0,
    0,
    loadCanvas.width,
    loadCanvas.height
  );

  const loadChart =
    new Chart(loadContext, {

      type: "bar",

      data: {

        labels:
          loadFactorRows.map(
            row => row.system
          ),

        datasets: [

          {

            label:
              "Load Factor",

            data:
              loadFactorRows.map(
                row =>
                  row.value * 100
              ),

            backgroundColor: [
              "#00c2ff",
              "#00e396",
              "#feb019",
              "#ff4560",
              "#775dd0",
              "#3f51b5",
              "#4caf50",
              "#ff9800",
              "#e91e63",
              "#9c27b0",
              "#546e7a"
            ],

            borderWidth: 1

          }

        ]

      },

      options: {

        responsive: false,

        animation: false,

        indexAxis: "y",

        plugins: {

          legend: {

            display: false

          },

          tooltip: {

            callbacks: {

              label: (context: any) =>
                `${Number(
                  context.parsed.x
                ).toFixed(1)}%`

            }

          }

        },

        scales: {

          x: {

            beginAtZero: true,

            ticks: {

              callback: (value: any) =>
                `${value}%`

            }

          },

          y: {

            grid: {

              display: false

            }

          }

        }

      }

    });

  loadChart.update();

  const loadImage =
    loadCanvas.toDataURL(
      "image/png"
    );

  const pdf =
    new jsPDF(
      "p",
      "mm",
      "a4"
    );

  pdf.setFontSize(18);

  pdf.text(
    "Energy Metrics Report",
    14,
    18
  );

  pdf.setFontSize(10);

  pdf.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    26
  );

  pdf.setFontSize(14);

  pdf.text(
    "Overall Load Factor",
    14,
    38
  );

  autoTable(pdf, {

    startY: 43,

    head: [[
      "Metric",
      "Value"
    ]],

    body: [[
      "Load Factor",
      `${(report.load_factor * 100).toFixed(1)}%`
    ]]

  });

  pdf.setFontSize(14);

  pdf.text(
    "Load Factor by System",
    14,
    68
  );

  pdf.addImage(
    loadImage,
    "PNG",
    14,
    73,
    180,
    80
  );

  autoTable(pdf, {

    startY: 160,

    head: [[

      "System",

      "Load Factor"

    ]],

    body:
      loadFactorRows.map(
        (row) => [

          row.system,

          `${(row.value * 100).toFixed(1)}%`

        ]
      )

  });

  pdf.addPage();

  const rankingCanvas =
    document.createElement("canvas");

  rankingCanvas.width = 1200;

  rankingCanvas.height = 500;

  const rankingContext =
    rankingCanvas.getContext("2d");

  if (!rankingContext) {
    return;
  }

  rankingContext.fillStyle =
    "#FFFFFF";

  rankingContext.fillRect(
    0,
    0,
    rankingCanvas.width,
    rankingCanvas.height
  );

  const rankingChart =
    new Chart(rankingContext, {

      type: "bar",

      data: {

        labels:
          rankingRows.map(
            row => row.system
          ),

        datasets: [

          {

            label:
              "Energy Consumption",

            data:
              rankingRows.map(
                row =>
                  row.value
              ),

            backgroundColor: [
              "#00c2ff",
              "#00e396",
              "#feb019",
              "#ff4560",
              "#775dd0",
              "#3f51b5",
              "#4caf50",
              "#ff9800",
              "#e91e63",
              "#9c27b0",
              "#546e7a"
            ],

            borderWidth: 1

          }

        ]

      },

      options: {

        responsive: false,

        animation: false,

        indexAxis: "y",

        plugins: {

          legend: {

            display: false

          },

          tooltip: {

            callbacks: {

              label: (context: any) =>
                `${Number(
                  context.parsed.x
                ).toFixed(2)} kWh`

            }

          }

        },

        scales: {

          x: {

            beginAtZero: true,

            ticks: {

              callback: (value: any) =>
                `${value} kWh`

            }

          },

          y: {

            grid: {

              display: false

            }

          }

        }

      }

    });

  rankingChart.update();

  const rankingImage =
    rankingCanvas.toDataURL(
      "image/png"
    );

  pdf.setFontSize(16);

  pdf.text(
    "System Ranking",
    14,
    18
  );

  pdf.addImage(
    rankingImage,
    "PNG",
    14,
    25,
    180,
    85
  );

    autoTable(pdf, {

    startY: 118,

    head: [[

      "System",

      "Energy Consumption (kWh)"

    ]],

    body:
      rankingRows.map(
        (row) => [

          row.system,

          row.value.toFixed(2)

        ]
      )

  });

  pdf.save(
    "energy-metrics-report.pdf"
  );

  loadChart.destroy();

  rankingChart.destroy();

};

export const exportZScorePDF = (
  report: ZScoreData
): void => {

  if (!report) {
    return;
  }

  const computeRows =
    Object.entries(report.compute_z_score_example)
      .map(
        ([value, score]) => ({
          value,
          score: Number(score)
        })
      );

  const consumptionRows =
    Object.entries(report.z_score_consumption)
      .sort(
        ([a], [b]) =>
          new Date(a).getTime() -
          new Date(b).getTime()
      )
      .slice(-72);

  const systemRows =
    Object.entries(report.z_score_by_system)
      .sort(
        ([a], [b]) =>
          new Date(a).getTime() -
          new Date(b).getTime()
      )
      .slice(-72);

  const computeCanvas =
    document.createElement("canvas");

  computeCanvas.width = 1200;

  computeCanvas.height = 500;

  const computeContext =
    computeCanvas.getContext("2d");

  if (!computeContext) {
    return;
  }

  computeContext.fillStyle =
    "#FFFFFF";

  computeContext.fillRect(
    0,
    0,
    computeCanvas.width,
    computeCanvas.height
  );

  const computeChart =
    new Chart(computeContext, {

      type: "bar",

      data: {

        labels:
          computeRows.map(
            row => row.value
          ),

        datasets: [

          {

            label:
              "Compute Z-Score Example",

            data:
              computeRows.map(
                row => row.score
              ),

            backgroundColor:
              "#00c2ff",

            borderWidth: 1

          }

        ]

      },

      options: {

        responsive: false,

        animation: false,

        plugins: {

          legend: {

            display: false

          },

          tooltip: {

            callbacks: {

              label: (context: any) =>
                Number(
                  context.parsed.y
                ).toFixed(2)

            }

          }

        },

        scales: {

          y: {

            beginAtZero: false,

            title: {

              display: true,

              text: "Z-Score"

            }

          }

        }

      }

    });

  computeChart.update();

  const computeImage =
    computeCanvas.toDataURL(
      "image/png"
    );

  const pdf =
    new jsPDF(
      "p",
      "mm",
      "a4"
    );

  pdf.setFontSize(18);

  pdf.text(
    "Z-Score Analysis Report",
    14,
    18
  );

  pdf.setFontSize(10);

  pdf.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    26
  );

  if (report.system) {

    pdf.text(
      `System: ${report.system}`,
      14,
      32
    );

  }

  pdf.setFontSize(14);

  pdf.text(
    "Compute Z-Score Example",
    14,
    report.system ? 42 : 38
  );

  pdf.addImage(
    computeImage,
    "PNG",
    14,
    report.system ? 47 : 43,
    180,
    70
  );

  autoTable(pdf, {

    startY:
      report.system ? 123 : 119,

    head: [[

      "Value",

      "Z-Score"

    ]],

    body:
      computeRows.map(
        row => [

          row.value,

          row.score.toFixed(2)

        ]
      )

  });

    pdf.addPage();

  const consumptionCanvas =
    document.createElement("canvas");

  consumptionCanvas.width = 1200;

  consumptionCanvas.height = 500;

  const consumptionContext =
    consumptionCanvas.getContext("2d");

  if (!consumptionContext) {
    return;
  }

  consumptionContext.fillStyle =
    "#FFFFFF";

  consumptionContext.fillRect(
    0,
    0,
    consumptionCanvas.width,
    consumptionCanvas.height
  );

  const consumptionLabels =
    consumptionRows.map(
      ([timestamp]) =>
        new Date(timestamp).toLocaleString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            hour: "2-digit"
          }
        )
    );

  const consumptionValues =
    consumptionRows.map(
      ([, score]) =>
        Number(score)
    );

  const upperThreshold =
    consumptionValues.map(
      () => 2
    );

  const lowerThreshold =
    consumptionValues.map(
      () => -2
    );

  const consumptionChart =
    new Chart(consumptionContext, {

      type: "line",

      data: {

        labels:
          consumptionLabels,

        datasets: [

          {

            label:
              "Z-Score",

            data:
              consumptionValues,

            borderColor:
              "#00c2ff",

            backgroundColor:
              "rgba(99,102,241,0.20)",

            tension: 0.3,

            pointRadius: 0,

            fill: false

          },

          {

            label:
              "Upper Threshold (+2)",

            data:
              upperThreshold,

            borderColor:
              "#ef4444",

            borderDash: [8, 8],

            pointRadius: 0,

            fill: false

          },

          {

            label:
              "Lower Threshold (-2)",

            data:
              lowerThreshold,

            borderColor:
              "#10b981",

            borderDash: [8, 8],

            pointRadius: 0,

            fill: false

          }

        ]

      },

      options: {

        responsive: false,

        animation: false,

        plugins: {

          legend: {

            display: true

          }

        },

        scales: {

          y: {

            title: {

              display: true,

              text: "Z-Score"

            }

          },

          x: {

            ticks: {

              maxTicksLimit: 12

            }

          }

        }

      }

    });

  consumptionChart.update();

  const consumptionImage =
    consumptionCanvas.toDataURL(
      "image/png"
    );

  pdf.setFontSize(16);

  pdf.text(
    "Z-Score Consumption",
    14,
    18
  );

  pdf.addImage(
    consumptionImage,
    "PNG",
    14,
    25,
    180,
    80
  );

  autoTable(pdf, {

    startY: 113,

    head: [[

      "Timestamp",

      "Z-Score"

    ]],

    body:
      consumptionRows.map(
        ([timestamp, score]) => [

          new Date(timestamp)
            .toLocaleString(),

          Number(score)
            .toFixed(2)

        ]
      )

  });

    if (systemRows.length > 0) {

    pdf.addPage();

    const systemCanvas =
      document.createElement("canvas");

    systemCanvas.width = 1200;

    systemCanvas.height = 500;

    const systemContext =
      systemCanvas.getContext("2d");

    if (!systemContext) {
      return;
    }

    systemContext.fillStyle =
      "#FFFFFF";

    systemContext.fillRect(
      0,
      0,
      systemCanvas.width,
      systemCanvas.height
    );

    const systemLabels =
      systemRows.map(
        ([timestamp]) =>
          new Date(timestamp).toLocaleString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              hour: "2-digit"
            }
          )
      );

    const systemValues =
      systemRows.map(
        ([, score]) =>
          Number(score)
      );

    const upperThreshold =
      systemValues.map(
        () => 2
      );

    const lowerThreshold =
      systemValues.map(
        () => -2
      );

    const systemChart =
      new Chart(systemContext, {

        type: "line",

        data: {

          labels:
            systemLabels,

          datasets: [

            {

              label:
                "Z-Score",

              data:
                systemValues,

              borderColor:
                "#00c2ff",

              backgroundColor:
                "rgba(99,102,241,0.20)",

              tension: 0.3,

              pointRadius: 0,

              fill: false

            },

            {

              label:
                "Upper Threshold (+2)",

              data:
                upperThreshold,

              borderColor:
                "#ef4444",

              borderDash: [8, 8],

              pointRadius: 0,

              fill: false

            },

            {

              label:
                "Lower Threshold (-2)",

              data:
                lowerThreshold,

              borderColor:
                "#10b981",

              borderDash: [8, 8],

              pointRadius: 0,

              fill: false

            }

          ]

        },

        options: {

          responsive: false,

          animation: false,

          plugins: {

            legend: {

              display: true

            }

          },

          scales: {

            y: {

              title: {

                display: true,

                text: "Z-Score"

              }

            },

            x: {

              ticks: {

                maxTicksLimit: 12

              }

            }

          }

        }

      });

    systemChart.update();

    const systemImage =
      systemCanvas.toDataURL(
        "image/png"
      );

    pdf.setFontSize(16);

    pdf.text(
      "Z-Score by System",
      14,
      18
    );

    pdf.addImage(
      systemImage,
      "PNG",
      14,
      25,
      180,
      80
    );

    autoTable(pdf, {

      startY: 113,

      head: [[

        "Timestamp",

        "Z-Score"

      ]],

      body:
        systemRows.map(
          ([timestamp, score]) => [

            new Date(timestamp)
              .toLocaleString(),

            Number(score)
              .toFixed(2)

          ]
        )

    });

    systemChart.destroy();

  }

  pdf.save(
    "zscore-analysis-report.pdf"
  );

  computeChart.destroy();

  consumptionChart.destroy();

};

export const exportDetectionPDF = (
  report: DetectionReport
): void => {

  if (!report) {
    return;
  }

  const exampleRows =
    Object.entries(report.detect_anomalies_example).map(
      ([value, classification]) => ({
        value,
        classification
      })
    );

  const allSystemRows =
    Object.entries(report.all_systems_detection)
      .flatMap(([system, values]) =>
        Object.entries(values).map(
          ([timestamp, score]) => ({
            system,
            timestamp,
            score: Number(score)
          })
        )
      )
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() -
          new Date(b.timestamp).getTime()
      )
      .slice(-72);

  const bySystemRows =
    Object.entries(report.by_system)
      .sort(
        ([a], [b]) =>
          new Date(a).getTime() -
          new Date(b).getTime()
      )
      .slice(-72);

  const pdf =
    new jsPDF(
      "p",
      "mm",
      "a4"
    );

  pdf.setFontSize(18);

  pdf.text(
    "Detection Analysis Report",
    14,
    18
  );

  pdf.setFontSize(10);

  pdf.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    26
  );

  if (report.system) {

    pdf.text(
      `System: ${report.system}`,
      14,
      32
    );

  }

  pdf.setFontSize(14);

  pdf.text(
    "Detect Anomalies Example",
    14,
    report.system ? 42 : 38
  );

  autoTable(pdf, {

    startY:
      report.system ? 48 : 44,

    head: [[
      "Value",
      "Classification"
    ]],

    body:
      exampleRows.map(
        row => [
          row.value,
          row.classification
        ]
      )

  });

  pdf.addPage();

  const allSystemsCanvas =
    document.createElement("canvas");

  allSystemsCanvas.width = 1200;

  allSystemsCanvas.height = 500;

  const allSystemsContext =
    allSystemsCanvas.getContext("2d");

  if (!allSystemsContext) {
    return;
  }

  allSystemsContext.fillStyle =
    "#FFFFFF";

  allSystemsContext.fillRect(
    0,
    0,
    allSystemsCanvas.width,
    allSystemsCanvas.height
  );

  const groupedSystems: Record<
    string,
    {
      timestamp: string;
      score: number;
    }[]
  > = {};

  allSystemRows.forEach(row => {

    if (!groupedSystems[row.system]) {

      groupedSystems[row.system] = [];

    }

    groupedSystems[row.system].push({
      timestamp: row.timestamp,
      score: row.score
    });

  });

  const timestamps =
    Array.from(
      new Set(
        allSystemRows.map(
          row => row.timestamp
        )
      )
    ).sort();

  const labels =
    timestamps.map(
      timestamp =>
        new Date(timestamp).toLocaleString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            hour: "2-digit"
          }
        )
    );

    const colors = [
    "#00c2ff",
    "#ff4d4d",
    "#ffd500",
    "#7c4dff",
    "#00e676",
    "#ff9100",
    "#ff1744",
    "#00b0ff",
    "#76ff03",
    "#f50057",
    "#c51162"
  ];

   const datasets =
    Object.entries(groupedSystems).map(
      ([system, values], index) => ({

        label: system,

        data:
          timestamps.map(timestamp => {

            const point =
              values.find(
                value =>
                  value.timestamp === timestamp
              );

            return point
              ? point.score
              : null;

          }),

        borderColor:
          colors[
            index % colors.length
          ],

        backgroundColor:
          "transparent",

        borderWidth: 2,

        tension: 0.3,

        spanGaps: true,

        pointRadius: 2,

        pointHoverRadius: 4,

        fill: false

      })
    );

  const upperThreshold =
    timestamps.map(() => 2);

  const lowerThreshold =
    timestamps.map(() => -2);

  const allSystemsChart =
    new Chart(allSystemsContext, {

      type: "line",

      data: {

        labels,

        datasets: [

          ...datasets,

          {

            label:
              "Upper Threshold (+2)",

            data:
              upperThreshold,

            borderColor:
              "#ef4444",

            borderDash: [8, 8],

            pointRadius: 0,

            fill: false

          },

          {

            label:
              "Lower Threshold (-2)",

            data:
              lowerThreshold,

            borderColor:
              "#10b981",

            borderDash: [8, 8],

            pointRadius: 0,

            fill: false

          }

        ]

      },

      options: {

        responsive: false,

        animation: false,

        plugins: {

          legend: {

            display: true

          }

        },

        scales: {

          y: {

            title: {

              display: true,

              text:
                "Detection Score"

            }

          },

          x: {

            ticks: {

              maxTicksLimit: 12

            }

          }

        }

      }

    });

  allSystemsChart.update();

  const allSystemsImage =
    allSystemsCanvas.toDataURL(
      "image/png"
    );

  pdf.setFontSize(16);

  pdf.text(
    "All Systems Detection",
    14,
    18
  );

  pdf.addImage(
    allSystemsImage,
    "PNG",
    14,
    25,
    180,
    80
  );

  autoTable(pdf, {

    startY: 113,

    head: [[

      "System",

      "Timestamp",

      "Detection Score"

    ]],

    body:
      allSystemRows.map(
        row => [

          row.system,

          new Date(
            row.timestamp
          ).toLocaleString(),

          row.score.toFixed(2)

        ]
      )

  });

  if (
    bySystemRows.length > 0
  ) {

    pdf.addPage();

    const systemCanvas =
      document.createElement(
        "canvas"
      );

    systemCanvas.width = 1200;

    systemCanvas.height = 500;

    const systemContext =
      systemCanvas.getContext("2d");

    if (!systemContext) {
      return;
    }

    systemContext.fillStyle =
      "#FFFFFF";

    systemContext.fillRect(
      0,
      0,
      systemCanvas.width,
      systemCanvas.height
    );
    
        const systemLabels =
      bySystemRows.map(
        ([timestamp]) =>
          new Date(timestamp).toLocaleString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              hour: "2-digit"
            }
          )
      );

    const systemValues =
      bySystemRows.map(
        ([, score]) =>
          Number(score)
      );

    const upperThreshold =
      systemValues.map(
        () => 2
      );

    const lowerThreshold =
      systemValues.map(
        () => -2
      );

    const systemChart =
      new Chart(systemContext, {

        type: "line",

        data: {

          labels:
            systemLabels,

          datasets: [

            {

              label:
                "Detection Score",

              data:
                systemValues,

              borderColor:
                "#00c2ff",

              backgroundColor:
                "rgba(0,194,255,0.20)",

              tension: 0.3,

              pointRadius: 2,

              pointHoverRadius: 4,

              fill: false

            },

            {

              label:
                "Upper Threshold (+2)",

              data:
                upperThreshold,

              borderColor:
                "#ef4444",

              borderDash: [8, 8],

              pointRadius: 0,

              fill: false

            },

            {

              label:
                "Lower Threshold (-2)",

              data:
                lowerThreshold,

              borderColor:
                "#10b981",

              borderDash: [8, 8],

              pointRadius: 0,

              fill: false

            }

          ]

        },

        options: {

          responsive: false,

          animation: false,

          plugins: {

            legend: {

              display: true

            }

          },

          scales: {

            y: {

              title: {

                display: true,

                text:
                  "Detection Score"

              }

            },

            x: {

              ticks: {

                maxTicksLimit: 12

              }

            }

          }

        }

      });

    systemChart.update();

    const systemImage =
      systemCanvas.toDataURL(
        "image/png"
      );

    pdf.setFontSize(16);

    pdf.text(
      "Detection by System",
      14,
      18
    );

    pdf.addImage(
      systemImage,
      "PNG",
      14,
      25,
      180,
      80
    );

    autoTable(pdf, {

      startY: 113,

      head: [[

        "Timestamp",

        "Detection Score"

      ]],

      body:
        bySystemRows.map(
          ([timestamp, score]) => [

            new Date(timestamp)
              .toLocaleString(),

            Number(score)
              .toFixed(2)

          ]
        )

    });

    systemChart.destroy();

  }

  pdf.save(
    "detection-analysis-report.pdf"
  );

  allSystemsChart.destroy();

};

export const exportClassificationPDF = (
  report: ClassificationData
): void => {

  if (!report) {
    return;
  }

  const classificationRows =
    Object.entries(report.classify_anomaly_examples)
      .map(
        ([score, classification]) => ({
          score,
          classification
        })
      );

  const rootCauseRows =
    Object.entries(report.root_cause_examples)
      .map(
        ([scenario, cause]) => ({
          scenario,
          cause
        })
      );

  const fullPipelineRows =
    [...report.full_pipeline]
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() -
          new Date(b.timestamp).getTime()
      )
      .slice(-72);

  const bySystemRows =
  Array.isArray(report.by_system)
    ? report.by_system
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() -
            new Date(b.timestamp).getTime()
        )
        .slice(-72)
    : [];

  const contextRows =
  Array.isArray(report.context_classification)
    ? report.context_classification
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() -
            new Date(b.timestamp).getTime()
        )
        .slice(-72)
    : [];

  const classificationCanvas =
    document.createElement("canvas");

  classificationCanvas.width = 1200;

  classificationCanvas.height = 500;

  const classificationContext =
    classificationCanvas.getContext("2d");

  if (!classificationContext) {
    return;
  }

  classificationContext.fillStyle =
    "#FFFFFF";

  classificationContext.fillRect(
    0,
    0,
    classificationCanvas.width,
    classificationCanvas.height
  );

  const barColors = [
    "#00c2ff",
    "#ff4d4d",
    "#ffd500",
    "#7c4dff",
    "#00e676",
    "#ff9100",
    "#ff1744",
    "#00b0ff",
    "#76ff03",
    "#f50057",
    "#c51162"
  ];

  const classificationChart =
    new Chart(classificationContext, {

      type: "bar",

      data: {

        labels:
          classificationRows.map(
            row => row.score
          ),

        datasets: [

          {

            label:
              "Classification Examples",

            data:
              classificationRows.map(
                (_, index) => index + 1
              ),

            backgroundColor:
              barColors.slice(
                0,
                classificationRows.length
              ),

            borderWidth: 1

          }

        ]

      },

      options: {

        responsive: false,

        animation: false,

        plugins: {

          legend: {

            display: false

          },

          tooltip: {

            callbacks: {

              label: (context: any) =>
                classificationRows[
                  context.dataIndex
                ].classification

            }

          }

        },

        scales: {

          y: {

            beginAtZero: true,

            ticks: {

              precision: 0

            },

            title: {

              display: true,

              text: "Example"

            }

          }

        }

      }

    });

  classificationChart.update();

  const classificationImage =
    classificationCanvas.toDataURL(
      "image/png"
    );

  const pdf =
    new jsPDF(
      "p",
      "mm",
      "a4"
    );

  pdf.setFontSize(18);

  pdf.text(
    "Classification Analysis Report",
    14,
    18
  );

  pdf.setFontSize(10);

  pdf.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    26
  );

  if (report.system) {

    pdf.text(
      `System: ${report.system}`,
      14,
      32
    );

  }

  pdf.setFontSize(14);

  pdf.text(
    "Classification Examples",
    14,
    report.system ? 42 : 38
  );

  pdf.addImage(
    classificationImage,
    "PNG",
    14,
    report.system ? 47 : 43,
    180,
    70
  );

  autoTable(pdf, {

    startY:
      report.system ? 123 : 119,

    head: [[

      "Z-Score",

      "Classification"

    ]],

    body:
      classificationRows.map(
        row => [

          row.score,

          row.classification

        ]
      )

  });

    pdf.addPage();

  pdf.setFontSize(16);

  pdf.text(
    "Root Cause Examples",
    14,
    18
  );

  autoTable(pdf, {

    startY: 25,

    head: [[

      "Scenario",

      "Root Cause"

    ]],

    body:
      rootCauseRows.map(
        row => [

          row.scenario,

          row.cause

        ]
      )

  });

  pdf.addPage();

  const frequency: Record<string, number> = {};

  (
    report.system
      ? bySystemRows
      : fullPipelineRows
  ).forEach(event => {

    const key =
      event.root_cause ??
      "Unknown";

    frequency[key] =
      (frequency[key] ?? 0) + 1;

  });

  const frequencyLabels =
    Object.keys(frequency);

  const frequencyValues =
    Object.values(frequency);

  const frequencyCanvas =
    document.createElement("canvas");

  frequencyCanvas.width = 1200;

  frequencyCanvas.height = 500;

  const frequencyContext =
    frequencyCanvas.getContext("2d");

  if (!frequencyContext) {
    return;
  }

  frequencyContext.fillStyle =
    "#FFFFFF";

  frequencyContext.fillRect(
    0,
    0,
    frequencyCanvas.width,
    frequencyCanvas.height
  );

  const frequencyChart =
    new Chart(frequencyContext, {

      type: "bar",

      data: {

        labels:
          frequencyLabels,

        datasets: [

          {

            label:
              "Root Cause Frequency",

            data:
              frequencyValues,

            backgroundColor:
              barColors.slice(
                0,
                frequencyLabels.length
              ),

            borderWidth: 1

          }

        ]

      },

      options: {

        responsive: false,

        animation: false,

        plugins: {

          legend: {

            display: false

          }

        },

        scales: {

          y: {

            beginAtZero: true,

            ticks: {

              precision: 0

            },

            title: {

              display: true,

              text: "Occurrences"

            }

          },

          x: {

            ticks: {

              maxRotation: 45,

              minRotation: 0

            }

          }

        }

      }

    });

  frequencyChart.update();

  const frequencyImage =
    frequencyCanvas.toDataURL(
      "image/png"
    );

  pdf.setFontSize(16);

  pdf.text(
    "Root Cause Frequency",
    14,
    18
  );

  pdf.addImage(
    frequencyImage,
    "PNG",
    14,
    25,
    180,
    80
  );

  autoTable(pdf, {

    startY: 113,

    head: [[

      "Root Cause",

      "Occurrences"

    ]],

    body:
      frequencyLabels.map(
        (label, index) => [

          label,

          frequencyValues[index]

        ]
      )

  });

    pdf.addPage();

  pdf.setFontSize(16);

  pdf.text(
    report.system
      ? "Classification Events by System"
      : "Classification Events",
    14,
    18
  );

  autoTable(pdf, {

    startY: 25,

    head: [[

      ...(report.system
        ? []
        : ["System"]),

      "Timestamp",

      "Anomaly Type",

      "Root Cause",

      "Z-Score"

    ]],

    body:
      (report.system
        ? bySystemRows
        : fullPipelineRows
      ).map(event => [

        ...(report.system
          ? []
          : [event.system_name ?? "-"]),

        new Date(
          event.timestamp
        ).toLocaleString(),

        event.anomaly_type,

        event.root_cause ?? "-",

        event.z_score.toFixed(2)

      ])

  });

  if (
    report.system &&
    contextRows.length > 0
  ) {

    pdf.addPage();

    pdf.setFontSize(16);

    pdf.text(
      "Context Classification",
      14,
      18
    );

    autoTable(pdf, {

      startY: 25,

      head: [[

        "Timestamp",

        "Z-Score",

        "Type",

        "Root Cause",

        "120V",

        "240V",

        "Quality"

      ]],

      body:
        contextRows.map(event => [

          new Date(
            event.timestamp
          ).toLocaleString(),

          event.z_score.toFixed(2),

          event.anomaly_type,

          event.root_cause ?? "-",

          event.voltage_120v ?? "",

          event.voltage_240v ?? "",

          event.quality_flag ?? ""

        ])

    });

  }

  pdf.save(
    "classification-analysis-report.pdf"
  );

  classificationChart.destroy();

  frequencyChart.destroy();

};




