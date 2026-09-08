

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

import {
  type CSSProperties
} from "react";

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

type Props = {
  data: Record<string, number>;
};

const CHART_FONT = "Cascadia Code";

const chartContainerStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  minWidth: 0,
  overflow: "hidden",
  position: "relative"
};

function groupByHour(
  data: Record<string, number>
): number[] {
  const hours = Array(24).fill(0);
  const counts = Array(24).fill(0);

  Object.entries(data).forEach(
    ([timestamp, value]) => {
      const hour = new Date(timestamp).getHours();

      hours[hour] += Number(value);
      counts[hour] += 1;
    }
  );

  return hours.map((sum, i) =>
    counts[i] ? sum / counts[i] : 0
  );
}

export default function StationEnergyByHourChart({
  data
}: Props) {

  const hourly = groupByHour(data);

  const labels = Array.from(
    { length: 24 },
    (_, i) => `${String(i).padStart(2, "0")}:00`
  );

  const chartData = {
    labels,

    datasets: [
      {
        label:
          "Avg Energy by Hour of Day (kWh)",

        data: hourly,

        borderColor: "#00c2ff",

        backgroundColor:
          "rgba(0, 194, 255, 0.18)",

        borderWidth: 2,

        tension: 0.35,

        fill: true,

        pointStyle: "rect" as const,

        pointRadius: 5,

        pointHoverRadius: 8,

        pointBackgroundColor: "#A855F7",

        pointHoverBackgroundColor:
          "rgba(0, 194, 255, 0)",

        pointBorderColor: "#00c2ff",

        pointHoverBorderColor: "#00c2ff",

        pointBorderWidth: 1,

        pointHoverBorderWidth: 2
      }
    ]
  };

  const options: ChartOptions<"line"> = {

    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      mode: "nearest",
      intersect: true
    },

    plugins: {

      legend: {
        display: false
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
              return "Consumption: 0.00 kWh";
            }

            return `Consumption: ${value.toFixed(2)} kWh`;
          }
        }
      }
    },

    scales: {

      x: {

        title: {

          display: true,

          text: "Hours",

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

          maxTicksLimit: 24,

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

        beginAtZero: true,

        ticks: {

          color:
            "rgba(255,255,255,0.70)",

          font: {
            family: CHART_FONT,
            size: 15,
            weight: 400
          },

          callback(value) {
            return Number(value).toLocaleString();
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
      style={chartContainerStyle}
    >
      <Line
        data={chartData}
        options={options}
      />
    </div>
  );
}