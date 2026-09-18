

import panelStyles from "../shared/styles/panelStyles.module.css";

type Event = {
  system_name?: string;
  timestamp: string;
  anomaly_type: string;
  root_cause: string;
  z_score: number;
};

type Props = {
  data: Event[];
  system?: string;
};

export default function ClassificationEventsTable({
  data,
  system
}: Props) {

  if (!data || data.length === 0) {
    return (
      <div
         style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <span className={panelStyles.placeholderText}>
          No events available
        </span>
      </div>
    );
  }

  const sorted = [...data]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    )
    .slice(0, 20);

  const formatDate = (
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

  const getTypeColor = (
    type: string
  ) => {

    switch (type) {

      case "spike":
        return "#F59E0B";

      case "drop":
        return "#EF4444";

      default:
        return "#ccc";
    }
  };

  return (

    <div className={panelStyles.tableContainer}>

      <table className={panelStyles.dataTable}>

        <thead>

          <tr>

            <th className={panelStyles.timestampColumn}>
              Date
            </th>

            {!system && (
              <th className={panelStyles.systemColumn}>
                System
              </th>
            )}

            <th className={panelStyles.eventColumn}>
              Type
            </th>

            <th className={panelStyles.eventColumn}>
              Root Cause
            </th>

            <th
              className={`${panelStyles.eventColumn} ${panelStyles.zScoreHeader}`}
            >
              Z-Score
            </th>

          </tr>

        </thead>

        <tbody>

          {sorted.map(
            (row, idx) => (

              <tr key={idx}>

                <td
                  className={
                    panelStyles.timestampColumn
                  }
                >
                  {formatDate(
                    row.timestamp
                  )}
                </td>

                {!system && (
                  <td
                    className={
                      panelStyles.systemColumn
                    }
                  >
                    {row.system_name ?? "-"}
                  </td>
                )}

                <td
                  className={
                    panelStyles.eventColumn
                  }
                  style={{
                    color: getTypeColor(
                      row.anomaly_type
                    )
                  }}
                >
                  {row.anomaly_type}
                </td>

                <td
                  className={
                    panelStyles.eventColumn
                  }
                >
                  {row.root_cause}
                </td>

                <td
                  className={`${panelStyles.eventColumn} ${panelStyles.zScoreValue}`}
                >
                  {row.z_score.toFixed(2)}
                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>
  );
}