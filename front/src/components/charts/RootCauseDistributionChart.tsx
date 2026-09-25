

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  type ChartOptions
} from "chart.js";

import {
  type CSSProperties
} from "react";

import { Bar } from "react-chartjs-2";

import panelStyles from "../shared/styles/panelStyles.module.css";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

type PredictionEvent = {
  prediction: string;
};

type Props = {
  data: PredictionEvent[];
};

const BAR_COLORS = [
  "#3B82F6",
  "#22C55E",
  "#F59E0B",
  "#A855F7",
  "#EF4444",
  "#06B6D4",
  "#84CC16",
  "#EC4899",
  "#F97316",
  "#14B8A6",
  "#8B5CF6"
];

const CHART_FONT = "Cascadia Code";

const chartContainerStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  minWidth: 0,
  overflow: "hidden",
  position: "relative"
};

function RootCausePredictionChart({
  data
}: Props) {
  if (data.length === 0) {
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
        <span
          className={panelStyles.placeholderText}
        >
          No root cause prediction data available
        </span>
      </div>
    );
  }

  const counts: Record<string, number> = {};

  data.forEach(
    (item) => {
      const key =
        item.prediction ?? "unknown";

      counts[key] =
        (counts[key] || 0) + 1;
    }
  );

  const labels =
    Object.keys(counts);

  const values =
    Object.values(counts);

  const barColors =
    labels.map(
      (_, index) =>
        BAR_COLORS[
          index % BAR_COLORS.length
        ]
    );

  const chartData = {
    labels,

    datasets: [
      {
        label: "Root Cause Prediction Frequency",

        data: values,

        borderWidth: 1,

        borderColor: barColors,

        backgroundColor: barColors,

        hoverBackgroundColor: barColors,

        hoverBorderColor: "#FFFFFF",

        hoverBorderWidth: 2,

        borderRadius: 2,

        barThickness: 44,

        maxBarThickness: 56,

        categoryPercentage: 0.82,

        barPercentage: 0.90
      }
    ]
  };

  const options:
    ChartOptions<"bar"> = {
    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      mode: "nearest",
      intersect: true
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
          title: (
            tooltipItems
          ) => {
            return (
              tooltipItems[0]
                .label ?? ""
            );
          },

          label: (
            context
          ) => {
            const value =
              context.parsed.y;

            if (
              value === null
            ) {
              return "Count: 0";
            }

            return `Count: ${value}`;
          }
        }
      }
    },

    scales: {
      x: {
        title: {
          display: true,

          text: "Root Cause",

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
          maxRotation: 45,

          minRotation: 0,

          autoSkip: true,

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
        beginAtZero: true,

        ticks: {
          color:
            "rgba(255,255,255,0.70)",

          font: {
            family: CHART_FONT,
            size: 15,
            weight: 400
          },

          callback(value) {
            return Number(
              value
            ).toLocaleString();
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
      <Bar
        data={chartData}
        options={options}
      />
    </div>
  );
}

export default RootCausePredictionChart;