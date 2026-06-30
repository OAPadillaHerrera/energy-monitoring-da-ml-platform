

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

type Props = {
  data:
    | Record<string, Record<string, number>>
    | Record<string, number>;
  system?: string;
  title?: string;
};

export default function DetectionChartDAML({
  data,
  system,
  title
}: Props) {

  const isMultiSystem =
    !system &&
    typeof Object.values(data)[0] === "object";

  const formatDate = (ts: string) =>
    new Date(ts).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit"
    });

  const colors = [
    "#00c2ff",
    "#ff6384",
    "#36a2eb",
    "#4bc0c0",
    "#ff9f40",
    "#9966ff",
    "#ffcd56",
    "#c9cbcf"
  ];

  if (isMultiSystem) {

    const systems = data as Record<string, Record<string, number>>;

    const timestamps = Array.from(
      new Set(
        Object.values(systems).flatMap(s => Object.keys(s))
      )
    ).sort();

    const labels = timestamps.map(formatDate);

    const datasets = Object.entries(systems).map(
      ([name, values], i) => {

        const series = timestamps.map(
          ts => values[ts] ?? null
        );

        return {
          label: name,
          data: series,

          borderColor: colors[i % colors.length],
          backgroundColor: "transparent",

          borderWidth: 2,
          tension: 0.3,
          spanGaps: true,

          pointStyle: "rect",
          pointRadius: 3,
          pointHoverRadius: 7
        };
      }
    );

    const upperThreshold = {
      label: "Upper Threshold",
      data: timestamps.map(() => 2),

      borderColor: "#ef4444",
      borderDash: [8, 4],
      borderWidth: 2,

      pointRadius: 0,
      pointHoverRadius: 0,

      tension: 0
    };

    const lowerThreshold = {
      label: "Lower Threshold",
      data: timestamps.map(() => -2),

      borderColor: "#22c55e",
      borderDash: [8, 4],
      borderWidth: 2,

      pointRadius: 0,
      pointHoverRadius: 0,

      tension: 0
    };

    return (
      <div style={{ width: "100%", height: "100%" }}>
        <Line
          data={{
            labels,
            datasets: [...datasets, upperThreshold, lowerThreshold]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,

            interaction: {
              mode: "index",
              intersect: false
            },

            plugins: {
              legend: { display: true },

              tooltip: {
                enabled: true,
                mode: "index",
                intersect: false,

                callbacks: {
                  title: (items) => {
                    const i = items[0].dataIndex;
                    return timestamps[i];
                  },

                  label: (ctx) => {
                    const v = ctx.raw;

                    if (v === null || v === undefined) {
                      return `${ctx.dataset.label}: N/A`;
                    }

                    return `${ctx.dataset.label}: ${Number(v).toFixed(2)}`;
                  }
                }
              }
            },

            scales: {
              x: {
                ticks: { maxTicksLimit: 12 }
              },
              y: {
                title: {
                  display: true,
                  text: "Detection Score"
                }
              }
            }
          }}
        />
      </div>
    );
  }

  const values = data as Record<string, number>;

  const timestamps = Object.keys(values).sort();

  const labels = timestamps.map(formatDate);

  const series = timestamps.map(ts => values[ts]);

  const upperThreshold = timestamps.map(() => 2);
  const lowerThreshold = timestamps.map(() => -2);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: title ?? system ?? "Detection Score",
              data: series,

              borderColor: "#00c2ff",
              backgroundColor: "rgba(0,194,255,0.15)",

              borderWidth: 2,
              tension: 0.3,
              spanGaps: true,

              pointStyle: "rect",
              pointRadius: 3,
              pointHoverRadius: 7
            },

            {
              label: "Upper Threshold",
              data: upperThreshold,
              borderColor: "#ef4444",
              borderDash: [8, 4],
              borderWidth: 2,

              pointRadius: 0,
              pointHoverRadius: 0,
              tension: 0
            },

            {
              label: "Lower Threshold",
              data: lowerThreshold,
              borderColor: "#22c55e",
              borderDash: [8, 4],
              borderWidth: 2,

              pointRadius: 0,
              pointHoverRadius: 0,
              tension: 0
            }
          ]
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,

          interaction: {
            mode: "index",
            intersect: false
          },

          plugins: {
            legend: { display: true },

            tooltip: {
              enabled: true,
              mode: "index",
              intersect: false,

              callbacks: {
                title: (items) => {
                  const i = items[0].dataIndex;
                  return timestamps[i];
                },

                label: (ctx) => {
                  const v = ctx.raw;

                  if (v === null || v === undefined) {
                    return `${ctx.dataset.label}: N/A`;
                  }

                  return `${ctx.dataset.label}: ${Number(v).toFixed(2)}`;
                }
              }
            }
          },

          scales: {
            x: {
              ticks: { maxTicksLimit: 12 }
            },
            y: {
              title: {
                display: true,
                text: "Detection Score"
              }
            }
          }
        }}
      />
    </div>
  );
}