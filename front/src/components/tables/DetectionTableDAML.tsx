

type Props = {
  data:
    | Record<string, number>
    | Record<string, Record<string, number>>;
};

export default function DetectionTableDAML({
  data
}: Props) {

  const rows: {
    timestamp: string;
    score: number;
  }[] = [];

  for (const [, value] of Object.entries(data)) {

    if (typeof value === "number") {

      rows.push({
        timestamp: String(Object.keys({ [Object.keys(data).find(k => data[k as keyof typeof data] === value)!]: value })[0]),
        score: value
      });

    } else {

      const values = value as Record<string, number>;

      for (const [timestamp, score] of Object.entries(values)) {

        rows.push({
          timestamp,
          score
        });

      }

    }

  }

  rows.sort(
    (a, b) =>
      new Date(a.timestamp).getTime() -
      new Date(b.timestamp).getTime()
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
              Timestamp
            </th>

            <th
              style={{
                padding: "8px",
                textAlign: "right"
              }}
            >
              Detection Score
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

              <td style={{ padding: "8px" }}>
                {new Date(row.timestamp).toLocaleString()}
              </td>

              <td
                style={{
                  padding: "8px",
                  textAlign: "right"
                }}
              >
                {row.score.toFixed(2)}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}