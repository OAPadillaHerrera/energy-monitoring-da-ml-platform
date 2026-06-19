

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

type VoltageRecord = {
  timestamp: string;
  voltage_120v: number;
  voltage_240v: number;
  quality_flag: string;
};

type Props = {
  data: VoltageRecord[];
};

export default function ReportVoltageChart({
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

      grouped.set(day, {
        v120: [],
        v240: []
      });
    }

    grouped.get(day)!.v120.push(
      Number(item.voltage_120v)
    );

    grouped.get(day)!.v240.push(
      Number(item.voltage_240v)
    );
  });

  const avg = (values: number[]) =>
    values.length
      ? values.reduce(
          (a, b) => a + b,
          0
        ) / values.length
      : 0;

  const rows = Array.from(
    grouped.entries()
  )
    .map(([day, values]) => ({
      day,
      voltage120: avg(values.v120),
      voltage240: avg(values.v240)
    }))
    .sort(
      (a, b) =>
        new Date(a.day).getTime() -
        new Date(b.day).getTime()
    );

  const chartData = {

    labels: rows.map(
      (row) => row.day
    ),

    datasets: [
      {
        label: "120V (Avg)",

        data: rows.map(
          (row) => row.voltage120
        ),

        borderColor: "#00c2ff",

        backgroundColor:
          "rgba(0,194,255,0.18)",

        borderWidth: 2,

        tension: 0.35,

        fill: true,

        pointStyle: "rect",

        pointRadius: 5,

        pointHoverRadius: 6,

        pointBackgroundColor:
          "#00c2ff",

        pointBorderWidth: 0
      },

      {
        label: "240V (Avg)",

        data: rows.map(
          (row) => row.voltage240
        ),

        borderColor: "#ffb020",

        backgroundColor:
          "rgba(255,176,32,0.18)",

        borderWidth: 2,

        tension: 0.35,

        fill: true,

        pointStyle: "rect",

        pointRadius: 5,

        pointHoverRadius: 6,

        pointBackgroundColor:
          "#ffb020",

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

          label: (
            context: any
          ) =>
            `${context.parsed.y.toFixed(2)} V`
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

        beginAtZero: false,

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
