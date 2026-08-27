

import {
  Chart as ChartJS,
  CategoryScale,
  LogarithmicScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartOptions
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LogarithmicScale,
  BarElement,
  Tooltip,
  Legend
);

type Props = {
  data: Record<string, number>;
};

type SystemConsumption = {
  system: string;
  label: string;
  value: number;
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

const SYSTEM_LABELS: Record<string, string> = {
  "Corporate Lighting System": "CLS",
  "Canopy Lighting System": "CaLS",
  "Perimeter Lighting System": "PLS",
  "Office and General Services System": "O&GSS",
  "Submersible Pump System": "SPS",
  "Fuel Dispenser System": "FDS",
  "Air Conditioning System - Server Room": "ACS - SR",
  "Customer Service Kiosk System - Refrigeration": "CSKS - R",
  "Air Conditioning System - Office Area": "ACS - OA",
  "Customer Service Kiosk System - Coffee Machine": "CSKS - CM",
  "Price Display System": "PDS"
};

const createChartOptions = (
  systems: SystemConsumption[]
): ChartOptions<"bar"> => ({
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

      backgroundColor: "rgba(0,0,0,0.90)",

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
          const index = tooltipItems[0].dataIndex;

          return systems[index].system;
        },

        label: (context) => {
          const system = systems[context.dataIndex];

          return `Consumption: ${system.value.toFixed(2)} kWh`;
        }
      }
    }
  },

  scales: {
    x: {
      title: {
        display: true,

        text: "Systems",

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

        autoSkip: false,

        color: "rgba(255,255,255,0.70)",

        font: {
          family: CHART_FONT,
          size: 15,
          weight: 400
        }
      },

      grid: {
        display: true,

        color: "rgba(255,255,255,0.25)",

        lineWidth: 1
      }
    },

    y: {
      type: "logarithmic",

      min: 1,

      ticks: {
        color: "rgba(255,255,255,0.70)",

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

        color: "rgba(255,255,255,0.25)",

        lineWidth: 1
      }
    }
  }
});

export default function SystemConsumptionChart({
  data
}: Props) {
  const sortedSystems: SystemConsumption[] = Object.entries(data)
    .map(([system, value]) => ({
      system,
      label: SYSTEM_LABELS[system] ?? system,
      value
    }))
    .sort((a, b) => b.value - a.value);

  const chartData = {
    labels: sortedSystems.map(
      (system) => system.label
    ),

    datasets: [
      {
        label: "Consumption (kWh)",

        data: sortedSystems.map(
          (system) => system.value
        ),

        borderWidth: 1,

        borderColor: BAR_COLORS,

        backgroundColor: BAR_COLORS,

        hoverBackgroundColor: BAR_COLORS,

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

  const options = createChartOptions(
    sortedSystems
  );

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
      <Bar
        data={chartData}
        options={options}
      />
    </div>
  );
}