

type Props = {
  data: Record<string, number>;
};

export default function ZScoreTableDAML({
  data
}: Props) {

  const rows = Object.entries(data)
    .sort(
      ([a], [b]) =>
        new Date(a).getTime() -
        new Date(b).getTime()
    )
    .slice(-72);

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
              Z-Score
            </th>

          </tr>

        </thead>

        <tbody>

          {rows.map(([timestamp, value]) => (

            <tr
              key={timestamp}
              style={{
                borderBottom: "1px solid #222"
              }}
            >

              <td style={{ padding: "8px" }}>
                {new Date(timestamp).toLocaleString()}
              </td>

              <td
                style={{
                  padding: "8px",
                  textAlign: "right"
                }}
              >
                {value.toFixed(2)}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}