

import {
  useEffect,
  useState
} from "react";

import layoutStyles from "../../../components/shared/styles/layoutStyles.module.css";
import panelStyles from "../../../components/shared/styles/panelStyles.module.css";
import api from "../../../services/api";
import SimulationVoltageChart from "../../../components/charts/SimulationVoltageChart";

type VoltageRecord = {
  timestamp: string;
  voltage_120v: number;
  voltage_240v: number;
  quality_flag: string;
};

function Voltage() {

  const [data, setData] =
    useState<VoltageRecord[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {

    const fetchVoltage =
      async (): Promise<void> => {

        try {

          setLoading(true);
          setError(null);

          const response =
            await api.get(
              "/simulation/voltage"
            );

          setData(response.data);

        } catch (error: any) {

          console.error(
            "Failed loading voltage records:",
            error
          );

          setError(
            error?.response?.data?.message ||
            error.message ||
            "Failed loading voltage records."
          );

        } finally {

          setLoading(false);
        }
      };

    void fetchVoltage();

  }, []);

  return (

    <section className={layoutStyles.mainPanel}>

      <div className={layoutStyles.sectionHeading}>

        <h2>Voltage</h2>

        <span>
          Voltage monitoring and voltage quality - Daily average values
        </span>

      </div>

      <section className={panelStyles.chartPanel}>

        <div className={panelStyles.panelHeader}>
          Voltage Monitoring Records
        </div>

        <div className={panelStyles.chartPlaceholder}>

          <div className={panelStyles.chartGrid}></div>

          {
            loading && (

              <span className={panelStyles.placeholderText}>
                Loading voltage data...
              </span>

            )
          }

          {
            error && (

              <span className={panelStyles.placeholderText}>
                Error: {error}
              </span>

            )
          }

          {
            !loading &&
            !error &&
            data.length === 0 && (

              <span className={panelStyles.placeholderText}>
                Waiting for Simulation execution...
              </span>

            )
          }

          {
            !loading &&
            !error &&
            data.length > 0 && (

              <SimulationVoltageChart
                data={data}
              />

            )
          }

        </div>

      </section>

    </section>
  );
}

export default Voltage;