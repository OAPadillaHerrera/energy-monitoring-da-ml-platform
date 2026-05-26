

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
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
    .sort((a, b) => b[1] - a[1]);

  const labels = sorted.map(
    ([system]) =>
      systemLabels[system] || system
  );

  const originalValues = sorted.map(
    ([, value]) => value
  );

  const adjustedValues =
    originalValues.map((value) => {

      if (value < 10) {
        return value + 120;
      }

      if (value < 40) {
        return value + 80;
      }

      if (value < 100) {
        return value + 45;
      }

      if (value < 250) {
        return value + 20;
      }

      return value;
    });

  const chartData = {

    labels,

    datasets: [
      {
        label: "Consumption (kWh)",

        data: adjustedValues,

        borderWidth: 1,

        borderColor: "#00c2ff",

        backgroundColor:
          "rgba(0, 194, 255, 0.28)",

        hoverBackgroundColor:
          "rgba(0, 194, 255, 0.5)",

        borderRadius: 5,

        barThickness: 36,

        maxBarThickness: 44,

        categoryPercentage: 0.84,

        barPercentage: 0.94
      }
    ]
  };

  const options = {

    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      mode: "nearest" as const,
      intersect: true
    },

    plugins: {

      legend: {
        display: true
      },

      tooltip: {

        enabled: true,

        displayColors: false,

        callbacks: {

          title: (tooltipItems: any) => {

            const index =
              tooltipItems[0].dataIndex;

            return sorted[index][0];
          },

          label: (context: any) => {

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

        ticks: {

          maxRotation: 0,

          minRotation: 0,

          autoSkip: false,

          font: {
            size: 11
          }
        },

        grid: {

          display: false
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

      <Bar
        data={chartData}
        options={options}
      />

    </div>
  );
}