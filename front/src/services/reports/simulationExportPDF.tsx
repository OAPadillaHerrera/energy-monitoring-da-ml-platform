

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export const exportHourlyPDF = (
  data: Record<string, number> | null
): void => {

  if (!data) {
    return;
  }

  const rows = Object.entries(data)
    .map(
      ([timestamp, value]) =>
        [timestamp, Number(value)] as [string, number]
    )
    .sort(
      (a, b) =>
        new Date(a[0]).getTime() -
        new Date(b[0]).getTime()
    )
    .slice(-72);

  const labels = rows.map(
    ([timestamp]) => timestamp
  );

  const values = rows.map(
    ([, value]) => value
  );

  const canvas =
    document.createElement("canvas");

  canvas.width = 1200;
  canvas.height = 500;

  const context =
    canvas.getContext("2d");

  if (!context) {
    return;
  }

  context.fillStyle = "#FFFFFF";

  context.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  const chart = new Chart(context, {

    type: "line",

    data: {

      labels,

      datasets: [
        {

          label:
            "Hourly Consumption (kWh)",

          data: values,

          borderColor:
            "#00c2ff",

          backgroundColor:
            "rgba(0, 194, 255, 0.18)",

          borderWidth: 2,

          tension: 0.35,

          fill: true,

          pointStyle: "rect",

          pointRadius: 4,

          pointHoverRadius: 7,

          pointBackgroundColor:
            "#00c2ff",

          pointBorderWidth: 0,

          pointHoverBackgroundColor:
            "transparent",

          pointHoverBorderColor:
            "#00c2ff",

          pointHoverBorderWidth: 2

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

  chart.update();

  const chartImage =
    canvas.toDataURL("image/png");

  const pdf =
    new jsPDF("p", "mm", "a4");

  pdf.setFontSize(18);

  pdf.text(
    "Hourly Energy Consumption Report",
    14,
    18
  );

  pdf.setFontSize(10);

  pdf.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    25
  );

  pdf.addImage(
    chartImage,
    "PNG",
    14,
    32,
    180,
    75
  );

  autoTable(pdf, {

    startY: 115,

    head: [[
      "Timestamp",
      "Energy Consumption (kWh)"
    ]],

    body: rows.map(
      ([timestamp, value]) => [

        timestamp,

        value.toFixed(2)

      ]
    )

  });

  pdf.save(
    "hourly-data-report.pdf"
  );

  chart.destroy();

};

export const exportEventPDF = (
  events: {
    timestamp: string;
    system_id: string;
    event_type: string;
  }[]
): void => {

  if (events.length === 0) {
    return;
  }

  const pdf =
    new jsPDF("p", "mm", "a4");

  pdf.setFontSize(18);

  pdf.text(
    "Event Records Report",
    14,
    18
  );

  pdf.setFontSize(10);

  pdf.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    25
  );

  autoTable(pdf, {

    startY: 35,

    head: [[
      "Timestamp",
      "System",
      "Event Type"
    ]],

    body: events.map(
      (event) => [

        event.timestamp,

        event.system_id,

        event.event_type

      ]
    )

  });

  pdf.save(
    "event-records-report.pdf"
  );

};

export const exportDailyPDF = (
  data: Record<string, number>
): void => {

  const rows = Object.entries(data)
    .map(
      ([date, value]) =>
        [date, Number(value)] as [string, number]
    )
    .sort(
      (a, b) =>
        new Date(a[0]).getTime() -
        new Date(b[0]).getTime()
    )
    .slice(-30);

  if (rows.length === 0) {
    return;
  }

  const labels = rows.map(
    ([date]) => date
  );

  const values = rows.map(
    ([, value]) => value
  );

  const canvas =
    document.createElement("canvas");

  canvas.width = 1200;
  canvas.height = 500;

  const context =
    canvas.getContext("2d");

  if (!context) {
    return;
  }

  context.fillStyle = "#FFFFFF";

  context.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  const chart = new Chart(context, {

    type: "line",

    data: {

      labels,

      datasets: [
        {

          label:
            "Daily Consumption (kWh)",

          data: values,

          borderColor:
            "#00c2ff",

          backgroundColor:
            "rgba(0, 194, 255, 0.18)",

          borderWidth: 2,

          tension: 0.35,

          fill: true,

          pointStyle: "rect",

          pointRadius: 4,

          pointHoverRadius: 7,

          pointBackgroundColor:
            "#00c2ff",

          pointBorderWidth: 0,

          pointHoverBackgroundColor:
            "transparent",

          pointHoverBorderColor:
            "#00c2ff",

          pointHoverBorderWidth: 2

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

  chart.update();

  const chartImage =
    canvas.toDataURL("image/png");

  const pdf =
    new jsPDF("p", "mm", "a4");

  pdf.setFontSize(18);

  pdf.text(
    "Daily Energy Totals Report",
    14,
    18
  );

  pdf.setFontSize(10);

  pdf.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    25
  );

  pdf.addImage(
    chartImage,
    "PNG",
    14,
    32,
    180,
    75
  );

  autoTable(pdf, {

    startY: 115,

    head: [[
      "Date",
      "Energy Consumption (kWh)"
    ]],

    body: rows.map(
      ([date, value]) => [

        date,

        value.toFixed(2)

      ]
    )

  });

  pdf.save(
    "daily-totals-report.pdf"
  );

  chart.destroy();

};

export const exportVoltagePDF = (
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

  const grouped = new Map<
    string,
    {
      v120: number[];
      v240: number[];
    }
  >();

  data.forEach((item) => {

    const day =
      item.timestamp.split("T")[0];

    if (!grouped.has(day)) {

      grouped.set(day, {
        v120: [],
        v240: []
      });

    }

    const values =
      grouped.get(day);

    if (!values) {
      return;
    }

    values.v120.push(
      Number(item.voltage_120v)
    );

    values.v240.push(
      Number(item.voltage_240v)
    );

  });

  const avg = (
    values: number[]
  ): number =>

    values.length
      ? values.reduce(
          (a, b) => a + b,
          0
        ) / values.length
      : 0;

  const chartRows =
  Array.from(grouped.entries())
    .map(([day, values]) => ({

      day,

      voltage120:
        avg(values.v120),

      voltage240:
        avg(values.v240)

    }))
    .sort(
      (a, b) =>
        new Date(a.day).getTime() -
        new Date(b.day).getTime()
    );

  const currentMonth =
    chartRows.at(-1)?.day.slice(0, 7);

  const monthlyRows =
    chartRows.filter(
      (row) =>
        row.day.startsWith(currentMonth ?? "")
    );

  const tableRows =
    data
      .slice(-72)
      .reverse();

  if (chartRows.length === 0) {
    return;
  }

  const canvas =
    document.createElement("canvas");

  canvas.width = 1200;

  canvas.height = 500;

  const context =
    canvas.getContext("2d");

  if (!context) {
    return;
  }

  context.fillStyle =
    "#FFFFFF";

  context.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  const chart =
    new Chart(context, {

      type: "line",

      data: {

        labels:
          monthlyRows.map(
            (row) => row.day
          ),

        datasets: [

          {

            label:
              "120V (Avg)",

            data:
              monthlyRows.map(
                (row) =>
                  row.voltage120
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

          },

          {

            label:
              "240V (Avg)",

            data:
              monthlyRows.map(
                (row) =>
                  row.voltage240
              ),

            borderColor:
              "#ffb020",

            backgroundColor:
              "rgba(255,176,32,0.18)",

            borderWidth: 2,

            tension: 0.35,

            fill: true,

            pointStyle: "rect",

            pointRadius: 5,

            pointHoverRadius: 6,

            pointBackgroundColor:
              "#ffb020",

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

            beginAtZero: false

          }

        }

      }

    });

  chart.update();

  const chartImage =
    canvas.toDataURL("image/png");

  const pdf =
    new jsPDF(
      "p",
      "mm",
      "a4"
    );

  pdf.setFontSize(18);

  pdf.text(
    "Voltage Records Report",
    14,
    18
  );

  pdf.setFontSize(10);

  pdf.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    25
  );

  pdf.addImage(
    chartImage,
    "PNG",
    14,
    32,
    180,
    75
  );

  autoTable(pdf, {

    startY: 115,

    head: [[

      "Timestamp",

      "Voltage 120V",

      "Voltage 240V",

      "Quality Flag"

    ]],

    body:
      tableRows.map(
        (row) => [

          row.timestamp,

          Number(
            row.voltage_120v
          ).toFixed(2),

          Number(
            row.voltage_240v
          ).toFixed(2),

          row.quality_flag

        ]
      )

  });

  pdf.save(
    "voltage-records-report.pdf"
  );

  chart.destroy();

};