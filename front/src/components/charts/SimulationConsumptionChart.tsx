

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
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

      return `${label}:00`;
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

        pointStyle: "rect",

        pointRadius: 5,

        pointHoverRadius: 6,

        pointBackgroundColor: "#00c2ff",

        pointBorderWidth: 0
      }
    ]
  };

  const options = {

    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      mode: "index" as const,
      intersect: false
    },

    plugins: {

      legend: {
        display: true
      },

      tooltip: {

        enabled: true,

        displayColors: false,

        callbacks: {

          label: (context: any) => {

            return `${context.parsed.y.toFixed(2)} kWh`;
          }
        }
      }
    },

    scales: {

      x: {

        ticks: {

          maxRotation: 0,

          autoSkip: true,

          maxTicksLimit:
            mode === "daily"
              ? 24
              : 12
        },

        grid: {
          color:
            "rgba(255,255,255,0.04)"
        }
      },

      y: {

        beginAtZero: true,

        grid: {
          color:
            "rgba(255,255,255,0.05)"
        }
      }
    }
  };

  return (

    <div
      style={{
        width: "100%",
        height: "100%",
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