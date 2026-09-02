

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

type Props = {
  data: Record<string, number>;
  mode: "daily" | "range";
};

const CHART_FONT = "Cascadia Code";

export default function SimulationConsumptionChart({
  data,
  mode
}: Props) {

  const sorted = Object.entries(data)
    .map(
      ([label, value]) =>
        [label, Number(value)] as [string, number]
    )
    .sort((a, b) => {

      if (mode === "daily") {
        return Number(a[0]) - Number(b[0]);
      }

      return (
        new Date(a[0]).getTime() -
        new Date(b[0]).getTime()
      );
    });

  const labels = sorted.map(([label]) => {

    if (mode === "daily") {
      return `${String(label).split(":")[0].padStart(2, "0")}:00`;
    }

    return label;
  });

  const values = sorted.map(
    ([, value]) => value
  );

  const chartData = {
    labels,

    datasets: [
      {
        label:
          mode === "daily"
            ? "Hourly Consumption (kWh)"
            : "Daily Consumption (kWh)",

        data: values,

        borderColor: "#00c2ff",

        backgroundColor:
          "rgba(0, 194, 255, 0.18)",

        borderWidth: 2,

        tension: 0.35,

        fill: true,

        pointStyle: "rect" as const,

        pointRadius: 5,

        pointHoverRadius: 8,

        pointBackgroundColor: "#FB923C",

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

        displayColors: true,

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

          text:
            mode === "daily"
              ? "Hours"
              : "Date",

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

          maxTicksLimit:
            mode === "daily"
              ? 24
              : 12,

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






