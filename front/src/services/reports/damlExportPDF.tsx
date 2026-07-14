

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

