

import panelStyles from "../shared/styles/panelStyles.module.css";

type Props = {
  data: Record<string, number>;
};

export default function ReportDailyTable({
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
        a.timestamp.localeCompare(b.timestamp)
    )
    .slice(-30);

  const formatDate = (
    timestamp: string
  ): string => {
    if (/^\d{4}-\d{2}-\d{2}/.test(timestamp)) {
      return timestamp.slice(0, 10);
    }

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return timestamp;
    }

    return date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC"
    });
  };

  if (rows.length === 0) {
    return (
      <div className={panelStyles.placeholderText}>
        No daily data available.
      </div>
    );
  }

  return (
    <div className={panelStyles.tableContainer}>
      <table
        className={`${panelStyles.dataTable} ${panelStyles.compactDataTable}`}
      >
        <thead>
          <tr>
            <th className={panelStyles.compactSystemColumn}>
              Date
            </th>

            <th
              className={`${panelStyles.compactValueColumn} ${panelStyles.basicConsumptionHeader} ${panelStyles.numericHeader}`}
            >
              Avg Consumption (kWh)
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.timestamp}>
              <td className={panelStyles.compactSystemColumn}>
                {formatDate(row.timestamp)}
              </td>

              <td
                className={`${panelStyles.compactValueColumn} ${panelStyles.basicConsumptionValue} ${panelStyles.numericValue}`}
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
