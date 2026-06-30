

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

type Event = {
  prediction: string;
};

type Props = {
  data: Event[];
};

export default function RootCausePredictionChartDAML({
  data
}: Props) {

  if (!data || data.length === 0) {
    return null;
  }

  const counts: Record<string, number> = {};

  data.forEach((row) => {

    counts[row.prediction] =
      (counts[row.prediction] ?? 0) + 1;

  });

  const labels = Object.keys(counts);

  const values = Object.values(counts);

  const colors = labels.map((label) => {

    switch (label.toLowerCase()) {

      case "demand_spike":
        return "#f59e0b";

      case "grid_outage":
        return "#ef4444";

      case "voltage_instability":
        return "#8b5cf6";

      case "grid_issue":
        return "#06b6d4";

      default:
        return "#94a3b8";

    }

  });

  return (

    <div
      style={{
        width: "100%",
        height: "320px"
      }}
    >

      <Bar
        data={{
          labels,

          datasets: [
            {
              label: "Predictions",
              data: values,
              backgroundColor: colors,
              borderWidth: 1
            }
          ]
        }}

        options={{
          responsive: true,
          maintainAspectRatio: false,

          plugins: {

            legend: {
              display: false
            }

          },

          scales: {

            x: {

              title: {
                display: true,
                text: "Prediction"
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