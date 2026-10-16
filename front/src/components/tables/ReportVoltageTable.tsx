

import panelStyles from "../shared/styles/panelStyles.module.css";

import type {
  VoltageRecord
} from "../../pages/Reports/Simulation/types";

type Props = {
  data: VoltageRecord[];
};

export default function ReportVoltageTable({
  data
}: Props) {
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

  const formatTimestamp = (
    timestamp: string
  ): string => {
    const date = new Date(timestamp);

    const formattedDate =
      date.toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });

    const formattedTime =
      date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
      });

    return `${formattedDate} ${formattedTime}`;
  };

  if (rows.length === 0) {
    return (
      <div className={panelStyles.placeholderText}>
        No voltage data available.
      </div>
    );
  }

  return (
    <div
      className={panelStyles.tableContainer}
      style={{
        width: "100%",
        minWidth: 0,
        alignSelf: "stretch"
      }}
    >
      <table
        className={`${panelStyles.dataTable} ${panelStyles.compactDataTable}`}
        style={{
          width: "100%",
          minWidth: 0,
          tableLayout: "fixed"
        }}
      >
        <colgroup>
          <col style={{ width: "40%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "20%" }} />
        </colgroup>

        <thead>
          <tr>
            <th
              className={panelStyles.compactSystemColumn}
              style={{ textAlign: "left" }}
            >
              Timestamp
            </th>

            <th style={{ textAlign: "right" }}>
              120V
            </th>

            <th style={{ textAlign: "right" }}>
              240V
            </th>

            <th style={{ textAlign: "right" }}>
              Quality
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.timestamp}>
              <td
                className={panelStyles.compactSystemColumn}
                style={{ textAlign: "left" }}
              >
                {formatTimestamp(row.timestamp)}
              </td>

              <td style={{ textAlign: "right" }}>
                {row.voltage_120v.toFixed(2)}
              </td>

              <td style={{ textAlign: "right" }}>
                {row.voltage_240v.toFixed(2)}
              </td>

              <td style={{ textAlign: "right" }}>
                {row.quality_flag}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


