

type Event = {
  system_name?: string;
  timestamp: string;
  anomaly_type: string;
  root_cause: string;
  z_score: number;
};

type Props = {
  data: Event[];
  system?: string;
};

export default function ClassificationEventsTableDAML({
  data,
  system
}: Props) {

  if (!data || data.length === 0) {
    return (
      <div>
        No events available.
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

  const formatDate = (
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

  const getTypeColor = (
    type: string
  ): string => {

    switch (type) {

      case "spike":
        return "#ff9f40";

      case "drop":
        return "#ff6384";

      default:
        return "#ccc";

    }

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
              Type
            </th>

            <th style={{ padding: "8px" }}>
              Root Cause
            </th>

            <th
              style={{
                padding: "8px",
                textAlign: "right"
              }}
            >
              Z-Score
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
                {formatDate(row.timestamp)}
              </td>

              {!system && (

                <td style={{ padding: "8px" }}>
                  {row.system_name ?? "-"}
                </td>

              )}

              <td
                style={{
                  padding: "8px",
                  color: getTypeColor(
                    row.anomaly_type
                  )
                }}
              >
                {row.anomaly_type}
              </td>

              <td style={{ padding: "8px" }}>
                {row.root_cause}
              </td>

              <td
                style={{
                  padding: "8px",
                  textAlign: "right"
                }}
              >
                {row.z_score.toFixed(2)}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}