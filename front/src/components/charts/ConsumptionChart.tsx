

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
};

export default function ConsumptionChart({ data }: Props) {

  const sorted = Object.entries(data)
    .map(([hour, value]) => [Number(hour), Number(value)] as [number, number])
    .sort((a, b) => a[0] - b[0]);

  const labels = sorted.map(([hour]) => `${hour}:00`);
  const values = sorted.map(([, value]) => value);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Consumption (kWh)",
        data: values,
        borderWidth: 2,
        tension: 0.4,

        pointStyle: "rect",
        pointRadius: 4,
        pointHoverRadius: 8,

        pointBackgroundColor: "rgba(0, 194, 255, 0.25)",
        pointBorderColor: "#00c2ff",
        pointBorderWidth: 1,

        borderColor: "#00c2ff",
        backgroundColor: "rgba(0, 194, 255, 0.15)",

        fill: true
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

    hover: {
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

        mode: "index" as const,
        intersect: false,

        callbacks: {
          label: (context: any) => {
            return `Consumption: ${context.parsed.y} kWh`;
          }
        }
      }
    },

    scales: {
      x: {
        ticks: {
          maxRotation: 0
        }
      },
      y: {
        beginAtZero: true
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
      <Line data={chartData} options={options} />
    </div>
  );
}