

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

type Props = {
  data: Record<string, number>;
  title?: string;
};

function ZScoreChart({ data, title }: Props) {

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
      new Date(label).toLocaleString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          hour: "2-digit"
        }
      )
  );

  const chartData = {

    labels: formattedLabels,

    datasets: [

      {
        label: title ?? "Z-Score",
        data: values,
        borderColor: "#00c2ff",
        backgroundColor:
          "rgba(99,102,241,0.2)",
        tension: 0.3,
        pointRadius: 0
      },

      {
        label: "Upper Threshold (+2)",
        data: upperThreshold,
        borderColor: "#ef4444",
        borderDash: [8, 8],
        pointRadius: 0
      },

      {
        label: "Lower Threshold (-2)",
        data: lowerThreshold,
        borderColor: "#10b981",
        borderDash: [8, 8],
        pointRadius: 0
      }
    ]
  };

  const options = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        display: true
      },

      tooltip: {
        enabled: true
      }
    },

    scales: {

      y: {

        title: {

          display: true,

          text: "Z-Score"
        }
      },

      x: {

        ticks: {

          maxTicksLimit: 12
        }
      }
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%"
      }}
    >
      <Line
        data={chartData}
        options={options}
      />
    </div>
  );
}

export default ZScoreChart;