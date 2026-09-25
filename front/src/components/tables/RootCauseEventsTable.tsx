

import panelStyles from "../shared/styles/panelStyles.module.css";

type PredictionEvent = {
  timestamp: string;
  system_name?: string;

  prediction: string;

  risk_level: string;
  action: string;

  alerts?: {
    level: string;
    message: string;
  }[];
};

type Props = {
  data: PredictionEvent[];
  system?: string;
};

export default function RootCausePredictionTable({
  data,
  system
}: Props) {
  if (data.length === 0) {
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

  const getRiskColor = (
    risk: string
  ): string => {
    switch (risk) {
      case "LOW":
        return "#22C55E";

      case "MEDIUM":
        return "#EAB308";

      case "HIGH":
        return "#F97316";

      case "CRITICAL":
        return "#EF4444";

      default:
        return "#CCC";
    }
  };

  const getAlertLabel = (
    alerts?: {
      level: string;
      message: string;
    }[]
  ): string => {
    if (!alerts || alerts.length === 0) {
      return "-";
    }

    return alerts
      .map(
        (alert) => alert.level
      )
      .join(", ");
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
              Prediction
            </th>

            <th className={panelStyles.eventColumn}>
              Risk
            </th>

            <th className={panelStyles.eventColumn}>
              Action
            </th>

            <th className={panelStyles.eventColumn}>
              Alert
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
                >
                  {row.prediction}
                </td>

                <td
                  className={
                    panelStyles.eventColumn
                  }
                  style={{
                    color: getRiskColor(
                      row.risk_level
                    ),
                    fontWeight: 600
                  }}
                >
                  {row.risk_level}
                </td>

                <td
                  className={
                    panelStyles.eventColumn
                  }
                >
                  {row.action}
                </td>

                <td
                  className={
                    panelStyles.eventColumn
                  }
                >
                  {getAlertLabel(
                    row.alerts
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}