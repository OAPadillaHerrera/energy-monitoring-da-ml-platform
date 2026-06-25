

type Props = {
  data: Record<string, number>;
};

export default function SystemEnergyByHourTable({
  data
}: Props) {

  const hourly = Array.from(
    { length: 24 },
    (_, hour) =>
      Number(data[String(hour)] ?? 0)
  );

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
              Hour
            </th>

            <th
              style={{
                textAlign: "right",
                padding: "8px"
              }}
            >
              Avg Energy (kWh)
            </th>
          </tr>
        </thead>

        <tbody>
          {Array.from(
            { length: 24 },
            (_, hour) => (
              <tr
                key={hour}
                style={{
                  borderBottom: "1px solid #222"
                }}
              >
                <td
                  style={{
                    padding: "8px"
                  }}
                >
                  {hour}:00
                </td>

                <td
                  style={{
                    textAlign: "right",
                    padding: "8px"
                  }}
                >
                  {hourly[hour].toFixed(2)}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}