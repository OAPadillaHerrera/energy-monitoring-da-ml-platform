

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

type VoltageRecord = {
  timestamp: string;
  voltage_120v: number;
  voltage_240v: number;
  quality_flag: string;
};

type Props = {
  data: VoltageRecord[];
};

const CHART_FONT = "Cascadia Code";

export default function SimulationVoltageChart({
  data
}: Props) {

  const grouped = new Map<
    string,
    { v120: number[]; v240: number[] }
  >();

  data.forEach((item) => {

    const day =
      item.timestamp.split("T")[0];

    if (!grouped.has(day)) {

      grouped.set(
        day,
        {
          v120: [],
          v240: []
        }
      );

    }

    grouped.get(day)!.v120.push(
      Number(item.voltage_120v)
    );

    grouped.get(day)!.v240.push(
      Number(item.voltage_240v)
    );

  });

  const avg = (arr: number[]) =>
    arr.length
      ? arr.reduce(
          (a, b) => a + b,
          0
        ) / arr.length
      : 0;

  const sorted =
    Array.from(grouped.entries())
      .map(([day, values]) => ({
        day,
        v120: avg(values.v120),
        v240: avg(values.v240)
      }))
      .sort(
        (a, b) =>
          new Date(a.day).getTime() -
          new Date(b.day).getTime()
      );

  const labels =
    sorted.map(
      (item) => item.day
    );

  const voltage120 =
    sorted.map(
      (item) => item.v120
    );

  const voltage240 =
    sorted.map(
      (item) => item.v240
    );

  const chartData = {

    labels,

    datasets: [
      {
        label: "120V (Avg)",

        data: voltage120,

        borderColor: "#00c2ff",

        backgroundColor:
          "rgba(0, 194, 255, 0.18)",

        borderWidth: 2,

        tension: 0.35,

        fill: true,

        pointStyle: "rect" as const,

        pointRadius: 5,

        pointHoverRadius: 8,

        pointBackgroundColor:
          "#00c2ff",

        pointHoverBackgroundColor:
          "rgba(0, 194, 255, 0)",

        pointBorderColor:
          "#00c2ff",

        pointHoverBorderColor:
          "#00c2ff",

        pointBorderWidth: 1,

        pointHoverBorderWidth: 2
      },

      {
        label: "240V (Avg)",

        data: voltage240,

        borderColor: "#ffb020",

        backgroundColor:
          "rgba(255, 176, 32, 0.18)",

        borderWidth: 2,

        tension: 0.35,

        fill: true,

        pointStyle: "rect" as const,

        pointRadius: 5,

        pointHoverRadius: 8,

        pointBackgroundColor:
          "#ffb020",

        pointHoverBackgroundColor:
          "rgba(255, 176, 32, 0)",

        pointBorderColor:
          "#ffb020",

        pointHoverBorderColor:
          "#ffb020",

        pointBorderWidth: 1,

        pointHoverBorderWidth: 2
      }
    ]
  };

  const options: ChartOptions<"line"> = {

    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      mode: "index",
      intersect: false
    },

    plugins: {

      legend: {
        display: true,

        labels: {
          color: "#FFFFFF",

          font: {
            family: CHART_FONT,
            size: 15,
            weight: 400
          }
        }
      },

      tooltip: {

        enabled: true,

        displayColors: false,

        backgroundColor:
          "rgba(0,0,0,0.90)",

        padding: 14,

        titleFont: {
          family: CHART_FONT,
          size: 16,
          weight: 400
        },

        bodyFont: {
          family: CHART_FONT,
          size: 15,
          weight: 400
        },

        titleColor: "#FFFFFF",

        bodyColor: "#FFFFFF",

        callbacks: {

          title: (tooltipItems) => {
            return tooltipItems[0].label;
          },

          label: (context) => {

            const value =
              context.parsed.y;

            if (value === null) {
              return "0.00 V";
            }

            return `${value.toFixed(2)} V`;
          }
        }
      }
    },

    scales: {

      x: {

        title: {

          display: true,

          text: "Date",

          color: "#FFFFFF",

          font: {
            family: CHART_FONT,
            size: 16,
            weight: 400
          },

          padding: {
            top: 12
          }
        },

        ticks: {

          maxRotation: 0,

          minRotation: 0,

          autoSkip: true,

          maxTicksLimit: 12,

          color:
            "rgba(255,255,255,0.70)",

          font: {
            family: CHART_FONT,
            size: 15,
            weight: 400
          }
        },

        grid: {

          display: true,

          color:
            "rgba(255,255,255,0.25)",

          lineWidth: 1
        }
      },

      y: {

        beginAtZero: false,

        ticks: {

          color:
            "rgba(255,255,255,0.70)",

          font: {
            family: CHART_FONT,
            size: 15,
            weight: 400
          },

          callback(value) {
            return `${Number(value).toLocaleString()} V`;
          }
        },

        grid: {

          display: true,

          color:
            "rgba(255,255,255,0.25)",

          lineWidth: 1
        }
      }
    }
  };

  return (

    <div
      style={{
        width: "100%",
        height: "100%",
        minWidth: 0,
        overflow: "hidden",
        position: "relative"
      }}
    >

      <Line
        data={chartData}
        options={options}
      />

    </div>
  );
}

