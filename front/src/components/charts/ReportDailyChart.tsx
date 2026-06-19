

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

export default function ReportDailyChart({
  data
}: Props) {

  const sorted = Object.entries(data)
    .map(
      ([label, value]) =>
        [label, Number(value)] as [string, number]
    )
    .sort(
      (a, b) =>
        new Date(a[0]).getTime() -
        new Date(b[0]).getTime()
    );

  const filtered = sorted.slice(-30);

  const labels = filtered.map(
    ([label]) => label
  );

  const values = filtered.map(
    ([, value]) => value
  );

  const chartData = {

    labels,

    datasets: [
      {
        label: "Daily Consumption (kWh)",

        data: values,

        borderColor: "#00c2ff",

        backgroundColor:
          "rgba(0, 194, 255, 0.18)",

        borderWidth: 2,

        tension: 0.35,

        fill: true,

        pointStyle: "rect",

        pointRadius: 4,

        pointHoverRadius: 7,

        pointBackgroundColor: "#00c2ff",

        pointBorderWidth: 0,

        pointHoverBackgroundColor:
          "transparent",

        pointHoverBorderColor:
          "#00c2ff",

        pointHoverBorderWidth: 2
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