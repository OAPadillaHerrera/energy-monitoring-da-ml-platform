

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

export default function ClassificationEventsTable({
  data,
  system
}: Props) {

  if (!data || data.length === 0) {
    return <div>No events available</div>;
  }

  const sorted = [...data]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    )
    .slice(0, 20);

 const formatDate= (
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

  const getTypeColor = (type: string) => {
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

            <th>Type</th>

            <th>Root Cause</th>

            <th>Z-Score</th>

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
                {formatDate(row.timestamp)}
              </td>

              {!system && (
                <td>
                  {row.system_name ?? "-"}
                </td>
              )}

              <td
                style={{
                  color: getTypeColor(row.anomaly_type)
                }}
              >
                {row.anomaly_type}
              </td>

              <td>
                {row.root_cause}
              </td>

              <td>
                {row.z_score.toFixed(2)}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}