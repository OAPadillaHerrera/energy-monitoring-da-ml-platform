

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

import panelStyles from "../shared/styles/panelStyles.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

type Props = {
  data: Record<string, Record<string, number>>;
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

const SYSTEM_COLORS = [
  "#00c2ff",
  "#ff6384",
  "#36a2eb",
  "#4bc0c0",
  "#ff9f40",
  "#9966ff",
  "#ffcd56",
  "#c9cbcf"
];

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

function DetectionChart({
  data
}: Props) {

  const hasData =
    Object.keys(data).length > 0 &&
    Object.values(data).some(
      (values) =>
        Object.keys(values).length > 0
    );

  if (!hasData) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <span className={panelStyles.placeholderText}>
          No detection data available
        </span>
      </div>
    );
  }

  const systems = data;

  const timestamps = Array.from(
    new Set(
      Object.values(systems).flatMap(
        (values) => Object.keys(values)
      )
    )
  )
    .sort()
    .slice(-72);

  const formattedLabels =
    timestamps.map(
      (timestamp) =>
        formatTimestamp(timestamp)
    );

  const datasets =
    Object.entries(systems).map(
      ([name, values], index) => {

        const systemColor =
          SYSTEM_COLORS[
            index % SYSTEM_COLORS.length
          ];

        const series =
          timestamps.map(
            (timestamp) =>
              values[timestamp] ?? null
          );

        return {
          label: name,

          data: series,

          borderColor: systemColor,

          borderWidth: 1,

          tension: 0.35,

          fill: false,

          spanGaps: true,

          pointStyle: "rect" as const,

          pointRadius: 5,

          pointHoverRadius: 8,

          pointBackgroundColor:
            systemColor,

          pointHoverBackgroundColor:
            "rgba(0, 0, 0, 0)",

          pointBorderColor:
            systemColor,

          pointHoverBorderColor:
            systemColor,

          pointBorderWidth: 1,

          pointHoverBorderWidth: 2
        };
      }
    );

  const upperThreshold =
    timestamps.map(() => 2);

  const lowerThreshold =
    timestamps.map(() => -2);

  const chartData = {

    labels: formattedLabels,

    datasets: [

      ...datasets,

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

  const options:
    ChartOptions<"line"> = {

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
              return `${context.dataset.label}: N/A`;
            }

            if (
              context.dataset.label ===
              "Upper Threshold (+2)"
            ) {
              return `Upper Threshold: +${value.toFixed(2)}`;
            }

            if (
              context.dataset.label ===
              "Lower Threshold (-2)"
            ) {
              return `Lower Threshold: ${value.toFixed(2)}`;
            }

            return `${context.dataset.label}: ${value.toFixed(2)}`;
          },

          labelColor: (context) => {

            if (
              context.dataset.label ===
              "Upper Threshold (+2)"
            ) {
              return {
                borderColor: "#ef4444",
                backgroundColor: "#ef4444"
              };
            }

            if (
              context.dataset.label ===
              "Lower Threshold (-2)"
            ) {
              return {
                borderColor: "#10b981",
                backgroundColor: "#10b981"
              };
            }

            const datasetIndex =
              context.datasetIndex;

            const systemColor =
              SYSTEM_COLORS[
                datasetIndex %
                SYSTEM_COLORS.length
              ];

            return {
              borderColor: systemColor,
              backgroundColor: systemColor
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

export default DetectionChart;







