

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

export default function BasicMetricsChartDAML({
  data
}: Props) {

  const systemLabels: Record<string, string> = {
    "Corporate Lighting System": "CLS",
    "Canopy Lighting System": "CaLS",
    "Perimeter Lighting System": "PLS",
    "Office and General Services System": "O&GSS",
    "Submersible Pump System": "SPS",
    "Fuel Dispenser System": "FDS",
    "Air Conditioning System - Server Room": "ACS-SR",
    "Customer Service Kiosk System - Refrigeration": "CSKS-R",
    "Air Conditioning System - Office Area": "ACS-OA",
    "Customer Service Kiosk System - Coffee Machine": "CSKS-CM",
    "Price Display System": "PDS"
  };

  const barColors = [
    "#00c2ff",
    "#ff4d4d",
    "#ffd500",
    "#7c4dff",
    "#00e676",
    "#ff9100",
    "#ff1744",
    "#00b0ff",
    "#76ff03",
    "#f50057",
    "#c51162"
  ];

  const sorted = Object.entries(data)
    .map(([system, value]) => [system, Number(value)] as [string, number])
    .sort((a, b) => b[1] - a[1]);

  const labels = sorted.map(
    ([system]) => systemLabels[system] || system
  );

  const rawValues = sorted.map(([, value]) => value);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Consumption (kWh)",

        data: rawValues,

        backgroundColor: labels.map(
          (_, i) => barColors[i % barColors.length]
        ),

        borderColor: labels.map(
          (_, i) => barColors[i % barColors.length]
        ),

        borderWidth: 3,

        borderRadius: 6,

        minBarLength: 4,

        barThickness: 34,
        maxBarThickness: 44
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
        backgroundColor: "#111",
        titleColor: "#fff",
        bodyColor: "#fff",

        callbacks: {
          title: (items: any) => {
            const index = items[0].dataIndex;
            return sorted[index][0];
          },

          label: (context: any) => {
            const original = rawValues[context.dataIndex];
            return `Consumption: ${original.toFixed(2)} kWh`;
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
          font: { size: 11 }
        },
        grid: {
          display: false
        }
      },

      y: {
        beginAtZero: true,
        grace: "10%",
        grid: {
          color: "rgba(255,255,255,0.08)"
        }
      }
    },

    hover: {
      mode: "nearest" as const,
      animationDuration: 200
    },

    elements: {
      bar: {
        borderSkipped: false
      }
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}