

import {
  useEffect,
  useState
} from "react";

import layoutStyles from "../../../components/shared/styles/layoutStyles.module.css";
import panelStyles from "../../../components/shared/styles/panelStyles.module.css";
import api from "../../../services/api";
import SimulationSystemEventsTable from "../../../components/tables/SimulationSystemEventsTable";

type SystemEventRecord = {
  timestamp: string;
  system_id: string;
  event_type: string;
};

function SystemEvents() {

  const [events, setEvents] =
    useState<SystemEventRecord[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {

    const fetchSystemEvents =
      async (): Promise<void> => {

        try {

          setLoading(true);

          setError(null);

          const response =
            await api.get(
              "/simulation/system-events"
            );

          setEvents(response.data);

        } catch (error: any) {

          console.error(
            "Failed loading system events:",
            error
          );

          setError(
            error?.response?.data?.message ||
            error.message ||
            "Failed loading system events."
          );

        } finally {

          setLoading(false);
        }
      };

    void fetchSystemEvents();

  }, []);

  const showPlaceholder =
    loading ||
    Boolean(error) ||
    events.length === 0;

  return (

    <>

      <div className={layoutStyles.sectionHeading}>

        <h2>System Events</h2>

        <span>
          Zero-consumption events
        </span>

      </div>

      <section className={panelStyles.tablePanel}>

        <div className={panelStyles.panelHeader}>
          System Event Records
        </div>

        {
          showPlaceholder && (

            <div className={panelStyles.tablePlaceholder}>

              <div className={panelStyles.chartGrid}></div>

              {
                loading && (

                  <span className={panelStyles.placeholderText}>
                    Loading system events...
                  </span>

                )
              }

              {
                !loading &&
                error && (

                  <span className={panelStyles.placeholderText}>
                    Error: {error}
                  </span>

                )
              }

              {
                !loading &&
                !error &&
                events.length === 0 && (

                  <span className={panelStyles.placeholderText}>
                    Waiting for Simulation execution...
                  </span>

                )
              }

            </div>

          )
        }

        {
          !loading &&
          !error &&
          events.length > 0 && (

            <SimulationSystemEventsTable
              events={events}
            />

          )
        }

      </section>

    </>
  );
}

export default SystemEvents;