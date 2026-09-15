

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  type ChartOptions
} from "chart.js";

import {
  type CSSProperties
} from "react";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

type Props = {
  data: Record<string, number>;
  title?: string;
};

const CHART_FONT = "Cascadia Code";

const chartContainerStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  minWidth: 0,
  overflow: "hidden",
  position: "relative"
};

function formatTimestamp(
  timestamp: string
): string {

  const date = new Date(timestamp);

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  const hour =
    String(
      date.getHours()
    ).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:00`;
}

function ZScoreChart({
  data,
  title
}: Props) {

  const labels = Object.keys(data)
    .sort()
    .slice(-72);

  const values = labels.map(
    (key) => data[key]
  );

  const upperThreshold = labels.map(
    () => 2
  );

  const lowerThreshold = labels.map(
    () => -2
  );

  const formattedLabels = labels.map(
    (label) =>
      formatTimestamp(label)
  );

  const chartData = {
    labels: formattedLabels,

    datasets: [

      {
        label: title ?? "Z-Score",

        data: values,

        borderColor: "#00c2ff",

        borderWidth: 1,

        tension: 0.35,

        fill: false,

        pointRadius: 0,

        pointHoverRadius: 0
      },

      {
        label: "Upper Threshold (+2)",

        data: upperThreshold,

        borderColor: "#ef4444",

        borderWidth: 1,

        borderDash: [],

        pointRadius: 0,

        pointHoverRadius: 0,

        fill: false
      },

      {
        label: "Lower Threshold (-2)",

        data: lowerThreshold,

        borderColor: "#10b981",

        borderWidth: 1,

        borderDash: [],

        pointRadius: 0,

        pointHoverRadius: 0,

        fill: false
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
              return `${context.dataset.label}: 0.00`;
            }

            if (context.datasetIndex === 0) {
              return `Z-Score: ${value.toFixed(2)}`;
            }

            if (context.datasetIndex === 1) {
              return `Upper Threshold: +${value.toFixed(2)}`;
            }

            return `Lower Threshold: ${value.toFixed(2)}`;
          },

          labelColor: (context) => {

            if (context.datasetIndex === 0) {
              return {
                borderColor: "#00c2ff",
                backgroundColor: "#00c2ff"
              };
            }

            if (context.datasetIndex === 1) {
              return {
                borderColor: "#ef4444",
                backgroundColor: "#ef4444"
              };
            }

            return {
              borderColor: "#10b981",
              backgroundColor: "#10b981"
            };
          }
        }
      }
    },

    scales: {

      x: {

        title: {

          display: true,

          text: "Time",

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
      style={chartContainerStyle}
    >
      <Line
        data={chartData}
        options={options}
      />
    </div>
  );
}

export default ZScoreChart;