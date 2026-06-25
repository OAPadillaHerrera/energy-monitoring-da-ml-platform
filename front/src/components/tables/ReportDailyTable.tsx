

type Props = {
  data: Record<string, number>;
};

function groupByHour(data: Record<string, number>) {
  const hours = Array(24).fill(0);
  const counts = Array(24).fill(0);

  Object.entries(data).forEach(([timestamp, value]) => {
    const date = new Date(timestamp);

    if (isNaN(date.getTime())) return;

    const hour = date.getHours(); // 👈 igual que tu gráfica

    hours[hour] += Number(value);
    counts[hour] += 1;
  });

  return hours.map((sum, i) =>
    counts[i] ? sum / counts[i] : 0
  );
}

export default function StationEnergyByHourTable({
  data
}: Props) {

  const hourly = groupByHour(data);

  const rows = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    value: hourly[hour]
  }));

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
          fontSize: "14px",
          minWidth: "320px"
        }}
      >
        <thead>
          <tr
            style={{
              textAlign: "left",
              borderBottom: "1px solid #333"
            }}
          >
            <th>Hour</th>

            <th style={{ textAlign: "right" }}>
              Avg Energy (kWh)
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={row.hour}
              style={{
                borderBottom: "1px solid #222"
              }}
            >
              <td>{row.hour}:00</td>

              <td style={{ textAlign: "right" }}>
                {row.value.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}