

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
};

export default function SystemEnergyByHourChart({
  data
}: Props) {
  const hourly = Array.from(
    { length: 24 },
    (_, hour) => Number(data[String(hour)] ?? 0)
  );

  const labels = Array.from(
    { length: 24 },
    (_, i) => `${i}:00`
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Avg Energy by Hour of Day (kWh)",
        data: hourly,
        borderColor: "#00c2ff",
        backgroundColor: "rgba(0, 194, 255, 0.18)",
        borderWidth: 2,
        tension: 0.35,
        fill: true,
        pointStyle: "rect" as const,
        pointRadius: 5,
        pointHoverRadius: 6,
        pointBackgroundColor: "#00c2ff",
        pointBorderWidth: 0
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
        display: true
      },

      tooltip: {
        enabled: true,
        displayColors: false,

        callbacks: {
          label: (context) =>
            `${Number(context.parsed.y).toFixed(2)} kWh`
        }
      }
    },

    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 12
        },

        grid: {
          color: "rgba(255,255,255,0.04)"
        }
      },

      y: {
        beginAtZero: true,

        grid: {
          color: "rgba(255,255,255,0.05)"
        },

        ticks: {
          callback: (value) => `${value} kWh`
        }
      }
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "260px",
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