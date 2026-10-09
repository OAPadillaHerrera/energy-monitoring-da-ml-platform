

import panelStyles from "../shared/styles/panelStyles.module.css";

type Props = {
  data: Record<string, number>;
};

export default function EnergyLoadFactorTable({
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

      <table
        className={`${panelStyles.dataTable} ${panelStyles.compactDataTable}`}
      >

        <thead>

          <tr>

            <th className={panelStyles.compactSystemColumn}>
              System
            </th>

            <th
              className={`${panelStyles.compactValueColumn} ${panelStyles.basicConsumptionHeader}`}
            >
              Load Factor
            </th>

          </tr>

        </thead>

        <tbody>

          {sortedSystems.map(
            ([system, value]) => (

              <tr key={system}>

                <td className={panelStyles.compactSystemColumn}>
                  {system}
                </td>

                <td
                  className={`${panelStyles.compactValueColumn} ${panelStyles.basicConsumptionValue}`}
                >
                  <span>
                    {(value * 100).toFixed(2)}
                  </span>
                  <span className={panelStyles.percentageUnit}>
                    %
                  </span>
                </td>

              </tr>
            )
          )}

        </tbody>

      </table>

    </div>
  );
}