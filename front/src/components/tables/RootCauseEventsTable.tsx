

type PredictionEvent = {
  timestamp: string;
  system_name?: string;

  prediction: string;

  risk_level: string;
  action: string;

  alerts?: {
    level: string;
    message: string;
  }[];
};

type Props = {
  data: PredictionEvent[];
  system?: string;
};

export default function RootCausePredictionTable({
  data,
  system
}: Props) {

  if (!data || data.length === 0) {
    return <div>No predictions available</div>;
  }

  const sorted = [...data]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    )
    .slice(0, 20);

  const formatTimestamp = (
    timestamp: string
  ): string => {

    const date = new Date(timestamp);

    const formattedDate =
      date.toLocaleDateString(
        "en-CA",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        }
      );

    const formattedTime =
      date.toLocaleTimeString(
        "en-GB",
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      );

    return `${formattedDate} ${formattedTime}`;
  };

  const getRiskColor = (
    risk: string
  ): string => {

    switch (risk) {

      case "LOW":
        return "#22c55e";

      case "MEDIUM":
        return "#eab308";

      case "HIGH":
        return "#f97316";

      case "CRITICAL":
        return "#ef4444";

      default:
        return "#ccc";
    }
  };

  const getAlertLabel = (
    alerts?: {
      level: string;
      message: string;
    }[]
  ): string => {

    if (!alerts || alerts.length === 0) {
      return "-";
    }

    return alerts
      .map(alert => alert.level)
      .join(", ");
  };

  return (

    <div
      style={{
        width: "100%",
        marginTop: "20px"
      }}
    >

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px"
        }}
      >

        <thead>

          <tr
            style={{
              textAlign: "left",
              borderBottom: "1px solid #333"
            }}
          >

            <th>Date</th>

            {!system && (
              <th>System</th>
            )}

            <th>Prediction</th>

            <th>Risk</th>

            <th>Action</th>

            <th>Alert</th>

          </tr>

        </thead>

        <tbody>

          {sorted.map((row, idx) => (

            <tr
              key={idx}
              style={{
                borderBottom: "1px solid #222"
              }}
            >

              <td>
                {formatTimestamp(row.timestamp)}
              </td>

              {!system && (
                <td>
                  {row.system_name ?? "-"}
                </td>
              )}

              <td>
                {row.prediction}
              </td>

              <td
                style={{
                  color: getRiskColor(
                    row.risk_level
                  ),
                  fontWeight: 600
                }}
              >
                {row.risk_level}
              </td>

              <td>
                {row.action}
              </td>

              <td>
                {getAlertLabel(row.alerts)}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}