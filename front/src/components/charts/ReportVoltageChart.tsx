

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

type VoltageRecord = {
  timestamp: string;
  voltage_120v: number;
  voltage_240v: number;
  quality_flag: string;
};

type Props = {
  data: VoltageRecord[];
};

const CHART_FONT = "Cascadia Code";

function formatTimestamp(timestamp: string): string {
  return timestamp
    .replace("T", " ")
    .replace(
      /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}):\d{2}$/,
      "$1"
    );
}

export default function ReportVoltageChart({
  data
}: Props) {
  const latestRecords = [...data]
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() -
        new Date(b.timestamp).getTime()
    )
    .slice(-72);

  const chartData = {
    labels: latestRecords.map((item) =>
      formatTimestamp(item.timestamp)
    ),
    datasets: [
      {
        data: latestRecords.map((item) =>
          Number(item.voltage_120v)
        ),
        borderColor: "#00c2ff",
        backgroundColor: "rgba(0, 194, 255, 0.18)",
        borderWidth: 2,
        tension: 0.35,
        fill: true,
        pointStyle: "rect" as const,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: "#00FF88",
        pointHoverBackgroundColor: "rgba(0, 194, 255, 0)",
        pointBorderColor: "#00c2ff",
        pointHoverBorderColor: "#00c2ff",
        pointBorderWidth: 1,
        pointHoverBorderWidth: 2
      },
      {
        data: latestRecords.map((item) =>
          Number(item.voltage_240v)
        ),
        borderColor: "#00FF88",
        backgroundColor: "rgba(0, 255, 136, 0.18)",
        borderWidth: 2,
        tension: 0.35,
        fill: true,
        pointStyle: "rect" as const,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: "#00c2ff",
        pointHoverBackgroundColor: "rgba(0, 255, 136, 0)",
        pointBorderColor: "#00FF88",
        pointHoverBorderColor: "#00FF88",
        pointBorderWidth: 1,
        pointHoverBorderWidth: 2
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
        display: false
      },
      tooltip: {
        enabled: true,
        displayColors: true,
        backgroundColor: "rgba(0, 0, 0, 0.90)",
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
          title: (tooltipItems) =>
            formatTimestamp(
              String(tooltipItems[0].label)
            ),
          label: (context) => {
            const value = context.parsed.y;

            return `Voltage: ${
              value === null ? "0.00" : value.toFixed(2)
            } V`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
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
          maxTicksLimit: 12,
          color: "rgba(255, 255, 255, 0.70)",
          font: {
            family: CHART_FONT,
            size: 15,
            weight: 400
          }
        },
        grid: {
          display: true,
          color: "rgba(255, 255, 255, 0.25)",
          lineWidth: 1
        }
      },
      y: {
        beginAtZero: false,
        ticks: {
          color: "rgba(255, 255, 255, 0.70)",
          font: {
            family: CHART_FONT,
            size: 15,
            weight: 400
          },
          callback: (value) =>
            `${Number(value).toLocaleString()} V`
        },
        grid: {
          display: true,
          color: "rgba(255, 255, 255, 0.25)",
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

