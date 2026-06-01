

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

type Props = {
  data: Record<string, number>;
};

export default function EnergySystemRankingPieChart({
  data
}: Props) {

  const labels = Object.keys(data);

  const values = Object.values(data);

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

  const options = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        position: "right" as const
      },

      tooltip: {

        callbacks: {

          label: (context: any) => {

            const value = context.parsed;

            return `${context.label}: ${value.toFixed(2)} kWh`;
          }
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
      <Pie
        data={chartData}
        options={options}
      />
    </div>
  );
}