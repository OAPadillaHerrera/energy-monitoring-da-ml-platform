

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
  type ChartOptions
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

type Props = {
  data: Record<string, number>;
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

export default function SystemConsumptionChart({
  data
}: Props) {

  const systemLabels: Record<string, string> = {

    "Corporate Lighting System":
      "CLS",

    "Canopy Lighting System":
      "CaLS",

    "Perimeter Lighting System":
      "PLS",

    "Office and General Services System":
      "O&GSS",

    "Submersible Pump System":
      "SPS",

    "Fuel Dispenser System":
      "FDS",

    "Air Conditioning System - Server Room":
      "ACS - SR",

    "Customer Service Kiosk System - Refrigeration":
      "CSKS - R",

    "Air Conditioning System - Office Area":
      "ACS - OA",

    "Customer Service Kiosk System - Coffee Machine":
      "CSKS - CM",

    "Price Display System":
      "PDS"

  };

  const sorted = Object.entries(data)

    .map(
      ([system, value]) =>
        [system, Number(value)] as [string, number]
    )

    .sort(
      (a, b) => b[1] - a[1]
    );

  const labels = sorted.map(
    ([system]) =>
      systemLabels[system] || system
  );

  const originalValues = sorted.map(
    ([, value]) => value
  );

  const chartData = {

    labels,

    datasets: [

      {

        label:
          "Consumption (kWh)",

        data:
          originalValues,

        borderWidth:
          1,

        borderColor:
          BAR_COLORS,

        backgroundColor:
          BAR_COLORS,

        hoverBackgroundColor:
          BAR_COLORS,

        hoverBorderColor:
          "#FFFFFF",

        hoverBorderWidth:
          2,

        borderRadius:
          0,

        barThickness:
          50,

        maxBarThickness:
          60,

        categoryPercentage:
          0.90,

        barPercentage:
          1.0

      }

    ]

  };

  const options: ChartOptions<"bar"> = {

        responsive:
      true,

    maintainAspectRatio:
      false,

    interaction: {

      mode:
        "nearest",

      intersect:
        true

    },

    plugins: {

      title: {

        display:
          true,

        text:
          "Consumption (kWh)",

        color:
          "#FFFFFF",      

        font: {

          family:
            "Cascadia Code",

          size:
            18,

          weight:
            400

        },

        padding: {

          bottom:
            20

        }

      },

      legend: {

        display:
          false

      },

      tooltip: {

        enabled:
          true,

        displayColors:
          false,

        backgroundColor:
          "rgba(0,0,0,0.90)",

        padding:
          14,

        titleFont: {

          family:
            "Cascadia Code",

          size:
            16,

          weight:
            400

        },

        bodyFont: {

          family:
            "Cascadia Code",

          size:
            15,

          weight:
            400

        },

        titleColor:
          "#FFFFFF",

        bodyColor:
          "#FFFFFF",

        callbacks: {

          title: (
            tooltipItems
          ) => {

            const index =
              tooltipItems[0].dataIndex;

            return sorted[index][0];

          },

          label: (
            context
          ) => {

            const originalValue =
              originalValues[
                context.dataIndex
              ];

            return `Consumption: ${originalValue.toFixed(2)} kWh`;

          }

        }

      }

    },

    scales: {

      x: {

        title: {

          display:
            true,

          text:
            "Systems",

          color:
            "#FFFFFF",

          font: {

            family:
              "Cascadia Code",

            size:
              16,

            weight:
              400

          },

          padding: {

            top:
              12

          }

        },

        ticks: {

          maxRotation:
            0,

          minRotation:
            0,

          autoSkip:
            false,

           color:
            "rgba(255,255,255,0.70)",

          font: {

            family:
              "Cascadia Code",

            size:
              15,

            weight:
              400

          }

        },

        grid: {

          display: true,

          color: "rgba(255,255,255,0.25)",

          lineWidth: 1,

        }

      },

      y: {

        type:
          "logarithmic",

        min:
          1,

        title: {

          display:
            true,

          text:
            "Energy (kWh)",

          color:
            "#FFFFFF",

          font: {

            family:
              "Cascadia Code",

            size:
              16,

            weight:
              400

          },

          padding: {

            bottom:
              12

          }

        },

        ticks: {

          color:
            "rgba(255,255,255,0.70)",

          font: {

            family:
              "Cascadia Code",

            size:
              15,

            weight:
              400

          },

          callback(value) {

            return Number(value).toLocaleString();

          }

        },

        grid: {

          display: true,

          color: "rgba(255,255,255,0.25)",

          lineWidth: 1,

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

      <Bar
        data={chartData}
        options={options}
      />

    </div>

  );

}

