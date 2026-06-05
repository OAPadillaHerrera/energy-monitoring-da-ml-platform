

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

type Event = {
  root_cause: string;
};

type Props = {
  data: Event[];
};

export default function ClassificationRootCauseChart({ data }: Props) {

  if (!data || data.length === 0) {
    return <div>No classification data available</div>;
  }

  const counts: Record<string, number> = {};

  data.forEach(item => {
    const key = item.root_cause ?? "unknown";
    counts[key] = (counts[key] || 0) + 1;
  });

  const labels = Object.keys(counts);
  const values = Object.values(counts);

  return (
    <div style={{ width: "100%", height: "320px" }}>

      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Root Cause Frequency",
              data: values,
              backgroundColor: "#00c2ff",
              borderRadius: 4
            }
          ]
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,

          plugins: {
            legend: {
              display: false
            },

            tooltip: {
              callbacks: {
                label: (ctx) => {
                  return `Count: ${ctx.raw}`;
                }
              }
            }
          },

          scales: {
            x: {
              ticks: {
                maxRotation: 45,
                minRotation: 0
              }
            },

            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Occurrences"
              }
            }
          }
        }}
      />

    </div>
  );
}