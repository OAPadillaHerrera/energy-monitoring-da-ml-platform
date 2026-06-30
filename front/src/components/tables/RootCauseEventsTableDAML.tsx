

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

export default function RootCausePredictionTableDAML({
  data,
  system
}: Props) {

  if (!data || data.length === 0) {
    return (
      <div>
        No predictions available.
      </div>
    );
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
        marginTop: "20px",
        maxHeight: "320px",
        overflowY: "auto",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "6px"
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
              borderBottom: "1px solid #333",
              position: "sticky",
              top: 0,
              background: "#1b1b1b",
              zIndex: 1
            }}
          >

            <th style={{ padding: "8px" }}>
              Date
            </th>

            {!system && (

              <th style={{ padding: "8px" }}>
                System
              </th>

            )}

            <th style={{ padding: "8px" }}>
              Prediction
            </th>

            <th style={{ padding: "8px" }}>
              Risk
            </th>

            <th style={{ padding: "8px" }}>
              Action
            </th>

            <th style={{ padding: "8px" }}>
              Alert
            </th>

          </tr>

        </thead>

        <tbody>

          {sorted.map((row, index) => (

            <tr
              key={index}
              style={{
                borderBottom: "1px solid #222"
              }}
            >

              <td style={{ padding: "8px" }}>
                {formatTimestamp(row.timestamp)}
              </td>

              {!system && (

                <td style={{ padding: "8px" }}>
                  {row.system_name ?? "-"}
                </td>

              )}

              <td style={{ padding: "8px" }}>
                {row.prediction}
              </td>

              <td
                style={{
                  padding: "8px",
                  color: getRiskColor(row.risk_level),
                  fontWeight: 600
                }}
              >
                {row.risk_level}
              </td>

              <td style={{ padding: "8px" }}>
                {row.action}
              </td>

              <td style={{ padding: "8px" }}>
                {getAlertLabel(row.alerts)}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}