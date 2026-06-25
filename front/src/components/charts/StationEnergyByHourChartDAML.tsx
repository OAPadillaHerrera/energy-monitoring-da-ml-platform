

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

function groupByHour(data: Record<string, number>) {
  const hours = Array(24).fill(0);
  const counts = Array(24).fill(0);

  Object.entries(data).forEach(([timestamp, value]) => {
    const hour = new Date(timestamp).getHours();

    hours[hour] += Number(value);
    counts[hour] += 1;
  });

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
      <Line data={chartData} options={options} />
    </div>
  );
}