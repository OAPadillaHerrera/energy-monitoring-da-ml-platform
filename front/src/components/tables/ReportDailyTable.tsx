

type Props = {
  data: Record<string, number>;
};

export default function ReportDailyTable({
  data
}: Props) {

  const rows = Object.entries(data)
    .map(([timestamp, consumption]) => ({
      timestamp,
      consumption: Number(consumption)
    }))
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() -
        new Date(b.timestamp).getTime()
    )
    .slice(-30);

  if (rows.length === 0) {
    return (
      <div>
        No daily data available.
      </div>
    );
  }

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);

    return date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  };

  return (
    <div
      style={{
        width: "100%",
        marginTop: "20px",
        overflowX: "auto"
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
            <th>
              Date
            </th>

            <th
              style={{
                textAlign: "right"
              }}
            >
              Consumption (kWh)
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={row.timestamp}
              style={{
                borderBottom: "1px solid #222"
              }}
            >
              <td>
                {formatDate(row.timestamp)}
              </td>

              <td
                style={{
                  textAlign: "right"
                }}
              >
                {row.consumption.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}