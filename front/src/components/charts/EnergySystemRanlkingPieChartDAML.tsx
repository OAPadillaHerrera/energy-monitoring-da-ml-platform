

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartOptions
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

type Props = {
  data: Record<string, number>;
};

export default function EnergySystemRankingChartDAML({
  data
}: Props) {

  const sortedSystems = Object.entries(data)
    .map(
      ([system, value]) =>
        [system, Number(value)] as [string, number]
    )
    .sort((a, b) => b[1] - a[1]);

  const labels = sortedSystems.map(
    ([system]) => system
  );

  const values = sortedSystems.map(
    ([, value]) => value
  );

  const chartData = {

    labels,

    datasets: [
      {
        label: "Energy Consumption",

        data: values,

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
          "#9c27b0"
        ],

        borderWidth: 1
      }
    ]
  };

  const options: ChartOptions<"bar"> = {

    responsive: true,

    maintainAspectRatio: false,

    indexAxis: "y",

    plugins: {

      legend: {
        display: false
      },

      tooltip: {

        callbacks: {

          label: (context) =>
            `${Number(
              context.parsed.x
            ).toFixed(2)} kWh`
        }
      }
    },

    scales: {

      x: {

        beginAtZero: true,

        grid: {
          color:
            "rgba(255,255,255,0.05)"
        },

        ticks: {
          callback: (value) =>
            `${value} kWh`
        }
      },

      y: {

        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "320px",
        position: "relative"
      }}
    >
      <Bar
        data={chartData}
        options={options}
      />
    </div>
  );
}