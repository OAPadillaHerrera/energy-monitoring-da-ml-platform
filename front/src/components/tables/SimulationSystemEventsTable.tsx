

import panelStyles from "../shared/styles/panelStyles.module.css";

type SystemEventRecord = {
  timestamp: string;
  system_id: string;
  event_type: string;
};

type Props = {
  events: SystemEventRecord[];
};

export default function SimulationSystemEventsTable({
  events
}: Props) {

  const systemLabels: Record<string, string> = {

    "1": "Price Display System",
    "2": "Corporate Lighting System",
    "3": "Canopy Lighting System",
    "4": "Perimeter Lighting System",
    "5": "Office and General Services System",
    "6": "Submersible Pump System",
    "7": "Fuel Dispenser System",
    "8": "Air Conditioning System - Server Room",
    "9": "Customer Service Kiosk System - Refrigeration",
    "10": "Air Conditioning System - Office Area",
    "11": "Customer Service Kiosk System - Coffee Machine"

  };

  const eventTypeLabels: Record<string, string> = {

    monthly_zero_consumption:
      "Monthly Zero Consumption"

  };

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

  return (

    <div className={panelStyles.tableContainer}>

      <table className={panelStyles.dataTable}>

        <thead>

          <tr>

            <th className={panelStyles.timestampColumn}>
              Timestamp
            </th>

            <th className={panelStyles.systemColumn}>
              System
            </th>

            <th className={panelStyles.eventColumn}>
              Event Type
            </th>

          </tr>

        </thead>

        <tbody>

          {
            events.map((event, index) => (

              <tr key={index}>

                <td className={panelStyles.timestampColumn}>
                  {
                    formatTimestamp(
                      event.timestamp
                    )
                  }
                </td>

                <td className={panelStyles.systemColumn}>
                  {
                    systemLabels[event.system_id] ||
                    event.system_id
                  }
                </td>

                <td className={panelStyles.eventColumn}>
                  {
                    eventTypeLabels[event.event_type] ||
                    event.event_type
                  }
                </td>

              </tr>

            ))
          }

        </tbody>

      </table>

    </div>
  );
}

