

type Props = {
  data: Record<string, number>;
};

export default function ReportHourlyTable({
  data
}: Props) {

  const rows = Object.entries(data)
    .map(
      ([timestamp, consumption]) => ({
        timestamp,
        consumption: Number(consumption)
      })
    )
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() -
        new Date(b.timestamp).getTime()
    )
    .slice(-72);

  if (rows.length === 0) {

    return (
      <div>
        No hourly data available.
      </div>
    );
  }

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
                {formatTimestamp(
                  row.timestamp
                )}
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