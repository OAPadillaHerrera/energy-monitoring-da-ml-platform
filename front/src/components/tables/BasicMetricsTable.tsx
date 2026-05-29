

import panelStyles from "../shared/styles/panelStyles.module.css";

type Props = {

  data: Record<string, number>;
};

export default function BasicMetricsTable({
  data
}: Props) {

  const sortedSystems = Object.entries(data)
    .map(
      ([system, value]) =>
        [system, Number(value)] as [string, number]
    )
    .sort((a, b) => b[1] - a[1]);

  return (

    <div className={panelStyles.tableContainer}>

      <table className={panelStyles.dataTable}>

        <thead>

          <tr>

            <th>
              System
            </th>

            <th
              style={{
                textAlign: "right",
                width: "220px",
                paddingRight: "18px"
              }}
            >
              Consumption (kWh)
            </th>

          </tr>

        </thead>

        <tbody>

          {
            sortedSystems.map(
              ([system, value], index) => (

                <tr key={index}>

                  <td>
                    {system}
                  </td>

                  <td
                    style={{
                      textAlign: "right",
                      width: "220px",
                      paddingRight: "18px"
                    }}
                  >
                    {value.toFixed(2)}
                  </td>

                </tr>

              )
            )
          }

        </tbody>

      </table>

    </div>
  );
}