

import panelStyles from "../shared/styles/panelStyles.module.css";

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

  if (rows.length === 0) {
    return (
      <div className={panelStyles.placeholderText}>
        No hourly data available.
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
              Timestamp
            </th>

            <th
              className={`${panelStyles.compactValueColumn} ${panelStyles.basicConsumptionHeader} ${panelStyles.numericHeader}`}
            >
              Consumption (kWh)
            </th>

          </tr>

        </thead>

        <tbody>

          {rows.map((row) => (

            <tr key={row.timestamp}>

              <td className={panelStyles.compactSystemColumn}>
                {formatTimestamp(row.timestamp)}
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



