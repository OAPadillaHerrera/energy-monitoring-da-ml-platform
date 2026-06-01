

type Props = {
  data: Record<string, number>;
};

export default function EnergyLoadFactorTable({
  data
}: Props) {

  return (
    <table>
      <thead>
        <tr>
          <th>System</th>
          <th>Load Factor</th>
        </tr>
      </thead>

      <tbody>
        {Object.entries(data).map(([system, value]) => (
          <tr key={system}>
            <td>{system}</td>

            <td
              style={{
                textAlign: "right"
              }}
            >
              {(value * 100).toFixed(1)}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}