

type VoltageRecord = {
  timestamp: string;
  voltage_120v: number;
  voltage_240v: number;
  quality_flag: string;
};

type Props = {
  data: VoltageRecord[];
};

export default function ReportVoltageTable({ data }: Props) {
  const rows = [...data]
    .map((item) => ({
      ...item,
      voltage_120v: Number(item.voltage_120v),
      voltage_240v: Number(item.voltage_240v)
    }))
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() -
        new Date(b.timestamp).getTime()
    )
    .slice(-72);

  if (rows.length === 0) {
    return <div>No voltage data available.</div>;
  }

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);

    const formattedDate = date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });

    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit"
    });

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
          fontSize: "14px",
          tableLayout: "fixed" 
        }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid #333" }}>
            <th style={{ textAlign: "left", width: "40%" }}>
              Date
            </th>

            <th style={{ textAlign: "right", width: "20%" }}>
              120V
            </th>

            <th style={{ textAlign: "right", width: "20%" }}>
              240V
            </th>

            <th style={{ textAlign: "center", width: "20%" }}>
              Quality
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={row.timestamp}
              style={{ borderBottom: "1px solid #222" }}
            >
              <td style={{ textAlign: "left" }}>
                {formatTimestamp(row.timestamp)}
              </td>

              <td style={{ textAlign: "right" }}>
                {row.voltage_120v.toFixed(2)}
              </td>

              <td style={{ textAlign: "right" }}>
                {row.voltage_240v.toFixed(2)}
              </td>

              <td style={{ textAlign: "center" }}>
                {row.quality_flag}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}