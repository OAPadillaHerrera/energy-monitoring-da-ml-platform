

type Props = {
  data: Record<string, number>;
};

function groupByHour(data: Record<string, number>) {
  const hours = Array(24).fill(0);
  const counts = Array(24).fill(0);

  Object.entries(data).forEach(([timestamp, value]) => {
    const date = new Date(timestamp);

    if (isNaN(date.getTime())) return;

    const hour = date.getHours();

    if (hour >= 0 && hour < 24) {
      hours[hour] += Number(value);
      counts[hour] += 1;
    }
  });

  return hours.map((sum, i) =>
    counts[i] ? sum / counts[i] : 0
  );
}

export default function StationEnergyByHourTable({
  data
}: Props) {

  const hourly = groupByHour(data);

  const bg = "rgba(255,255,255,0.02)";
  const border = "1px solid rgba(255,255,255,0.06)";

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
          borderSpacing: 0,
          fontSize: "14px"
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                background: bg,
                padding: "8px",
                textAlign: "left",
                borderBottom: border
              }}
            >
              Hour
            </th>

            <th
              style={{
                background: bg,
                padding: "8px",
                textAlign: "right",
                whiteSpace: "nowrap",
                width: "1%",
                borderBottom: border
              }}
            >
              Avg Energy (kWh)
            </th>
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: 24 }, (_, hour) => (
            <tr key={hour}>
              <td
                style={{
                  padding: "8px",
                  background: bg,
                  borderBottom: "1px solid rgba(255,255,255,0.04)"
                }}
              >
                {hour}:00
              </td>

              <td
                style={{
                  padding: "8px",
                  textAlign: "right",
                  whiteSpace: "nowrap",
                  width: "1%",
                  background: bg,
                  borderBottom: "1px solid rgba(255,255,255,0.04)"
                }}
              >
                {hourly[hour].toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}