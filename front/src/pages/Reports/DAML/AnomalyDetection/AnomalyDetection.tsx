

import { useEffect, useState, type ChangeEvent } from "react";
import api from "../../../../services/api";
import layoutStyles from "../../../../components/shared/styles/layoutStyles.module.css";
import panelStyles from "../../../../components/shared/styles/panelStyles.module.css";
import tabStyles from "../../../../components/shared/styles/tabStyles.module.css";
import controlStyles from "../../../../components/shared/styles/controlStyles.module.css";
import ZScoreChartDAML from "../../../../components/charts/ZScoreChartDAML";
import DetectionChartDAML from "../../../../components/charts/DetectionChartDAML";
import ClassificationRootCauseChartDAML from "../../../../components/charts/ClassificationRootCauseChartDAML";
import ZScoreTableDAML from "../../../../components/tables/ZScoreTableDAML";
import DetectionTableDAML from "../../../../components/tables/DetectionTableDAML";
import ClassificationEventsTableDAML from "../../../../components/tables/ClassificationEventsTableDAML";
import { exportClassificationCSV, exportDetectionCSV, exportZScoreCSV } from "../../../../services/reports/damlExportCSV";
import { exportDetectionPDF, exportZScorePDF } from "../../../../services/reports/damlExportPDF";

type Mode = "zscore" | "detection" | "classification";

type ZScoreData = {
  compute_z_score_example: Record<string, number>;
  system?: string;
  z_score_consumption: Record<string, number>;
  z_score_by_system: Record<string, number>;
};

type DetectionData = {
  system?: string;
  all_systems_detection: Record<string, Record<string, number>>;
  by_system: Record<string, number>;
};

type ClassificationEvent = {
  system_name?: string;
  timestamp: string;
  anomaly_type: string;
  root_cause: string;
  z_score: number;
};

type ClassificationData = {
  classify_anomaly_examples: Record<string, string>;

  all_systems_summary: Record<
    string,
    ClassificationEvent[]
  >;

  all_systems_with_context: Record<
    string,
    ClassificationEvent[]
  >;

  root_cause_examples: Record<string, string>;

  full_pipeline: ClassificationEvent[];

  system?: string;

  by_system: ClassificationEvent[];

  context_classification: ClassificationEvent[];
};

type DetectionReport = {
  detect_anomalies_example: Record<string, string>;
  all_systems_detection: Record<
    string,
    Record<string, number>
  >;
  system?: string;
  by_system: Record<string, number>;
};

function AnomalyDetection() {
  const [mode, setMode] = useState<Mode>("zscore");
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [systemName, setSystemName] = useState("");
  const [executionMessage, setExecutionMessage] = useState("");
  const [zscoredata, setZscoreData] = useState<ZScoreData | null>(null);
  const [zscoreReport, setZscoreReport] = useState<ZScoreData | null>(null);
  const [detectiondata, setDetectionData] = useState<DetectionData | null>(null);
  const [detectionReport, setDetectionReport] = useState<DetectionReport | null>(null);
  const [classificationdata, setClassificationData] = useState<ClassificationData | null>(null);
  const [classificationReport, setClassificationReport] = useState<ClassificationData | null>(null);


  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const timeoutId = setTimeout(() => {

      const fetchAnomaly = async (): Promise<void> => {

        try {
          setLoading(true);
          setError(null);

          if (mode === "zscore") {

            const endpoint = systemName.trim()
              ? `/anomaly/zscore?name=${encodeURIComponent(systemName)}`
              : "/anomaly/zscore";

            const response = await api.get(endpoint);
            setZscoreData(response.data);
            setZscoreReport(response.data);
          }

          if (mode === "detection") {

            const endpoint = systemName.trim()
              ? `/anomaly/detection?name=${encodeURIComponent(systemName)}`
              : "/anomaly/detection";

            const response = await api.get(endpoint);

            setDetectionReport(response.data);
            setDetectionData(response.data);
          }

          if (mode === "classification") {

            const endpoint = systemName.trim()
              ? `/anomaly/classification?name=${encodeURIComponent(systemName)}`
              : "/anomaly/classification";

            const response = await api.get(endpoint);

            setClassificationReport(response.data);
            setClassificationData(response.data);
          }

        } catch (err) {
          console.error(err);
          setError("System not found.");
        } finally {
          setLoading(false);
        }
      };

      void fetchAnomaly();

    }, 700);

    return () => clearTimeout(timeoutId);

  }, [mode, systemName]);

 const handleRunDetection = (): void => {
 
     setExecutionMessage(
       systemName.trim()
         ? `${mode.toUpperCase()} Analysis executed for ${systemName}.`
         : `${mode.toUpperCase()} Analysis executed for all systems.`
     );
   };
 
   const handleSystemChange = (event: ChangeEvent<HTMLInputElement>): void => {
     setSystemName(event.target.value);
   };
 
const zscoreChartData =
  zscoredata
    ? (
        zscoredata.system
          ? zscoredata.z_score_by_system
          : zscoredata.z_score_consumption
      )
    : null; 

const zscoreTableData =
  zscoreChartData;

const detectionChartData =
  detectiondata
    ? (
        detectiondata.system
          ? detectiondata.by_system
          : detectiondata.all_systems_detection
      )
    : null;

const detectionTableData =
  detectiondata?.system
    ? detectiondata.by_system
    : null;

const classificationEvents: ClassificationEvent[] =
  classificationdata
    ? (
        systemName.trim()
          ? Object.values(
              classificationdata.context_classification ?? {}
            ).flat()
          : classificationdata.full_pipeline
      )
    : [];

const classificationRootCauseData =
  classificationEvents;

const classificationEventsTableData =
  classificationEvents;

const handleExportCSV = (): void => {

  if (
    mode === "zscore" &&
    zscoreReport
  ) {

    exportZScoreCSV(
      zscoreReport
    );

    setExecutionMessage(
      "Z-Score CSV exported successfully."
    );

    return;
  }

  if (
    mode === "detection" &&
    detectionReport
  ) {

    exportDetectionCSV(
      detectionReport
    );

    setExecutionMessage(
      "Detection CSV exported successfully."
    );

    return;
  }

  if (
    mode === "classification" &&
    classificationReport
  ) {

    exportClassificationCSV(
      classificationReport
    );

    setExecutionMessage(
      "Classification CSV exported successfully."
    );

    return;
  }

  setExecutionMessage(
    "CSV export not implemented for this report yet."
  );

};

const handleExportPDF = (): void => {

  if (
    mode === "zscore" &&
    zscoreReport
  ) {

    exportZScorePDF(
      zscoreReport
    );

    setExecutionMessage(
      "Z-Score Anomaly PDF exported successfully."
    );

    return;
  }

  if (
    mode === "detection" &&
    detectionReport
  ) {

    exportDetectionPDF(
      detectionReport
    );

    setExecutionMessage(
      "Detection Anomaly PDF exported successfully."
    );

    return;
  }

  setExecutionMessage(
      "PDF export not implemented for this report yet."
  );

};

return (

  <section className={layoutStyles.mainPanel}>

    <section className={panelStyles.chartPanel}>

      <div className={panelStyles.panelHeader}>

        {mode === "zscore" &&
          "Z-Score Analysis Report"}

        {mode === "detection" &&
          "Detection Analysis Report"}

        {mode === "classification" &&
          "Classification Analysis Report"}

      </div>

      <div
        className={panelStyles.chartPlaceholder}
        style={{
          alignItems: "stretch",
          justifyContent: "flex-start"
        }}
      >

        {loading && (

          <span className={panelStyles.placeholderText}>
            Loading anomaly report...
          </span>

        )}

        {error && (

          <span className={panelStyles.placeholderText}>
            {error}
          </span>

        )}

        {!loading &&
          !error &&
          mode === "zscore" &&
          zscoreChartData && (

            viewMode === "chart"

              ? (

                <div
                  style={{
                    width: "100%",
                    height: "320px"
                  }}
                >

                  <ZScoreChartDAML
                    data={zscoreChartData}
                  />

                </div>

              )

              : (

                zscoreTableData && (

                  <ZScoreTableDAML
                    data={zscoreTableData}
                  />

                )

              )

        )}

        {!loading &&
          !error &&
          mode === "detection" &&
          detectionChartData && (

            viewMode === "chart"

              ? (

                <div
                  style={{
                    width: "100%",
                    height: "320px"
                  }}
                >

                  <DetectionChartDAML
                    data={detectionChartData}
                  />

                </div>

              )

              : (

                detectionTableData && (

                  <DetectionTableDAML
                    data={detectionTableData}
                  />

                )

              )

        )}

        {!loading &&
          !error &&
          mode === "classification" &&
          classificationEvents.length > 0 && (

            viewMode === "chart"

              ? (

                <div
                  style={{
                    width: "100%",
                    height: "320px"
                  }}
                >

                  <ClassificationRootCauseChartDAML
                    data={classificationRootCauseData}
                  />

                </div>

              )

              : (

                <div
                  style={{
                    width: "100%"
                  }}
                >

                  <ClassificationEventsTableDAML
                    data={classificationEventsTableData}
                    system={
                      systemName.trim() || undefined
                    }
                  />

                </div>

              )

        )}

      </div>

    </section>

    <section className={panelStyles.controlPanel}>

      <div className={panelStyles.panelHeader}>
        Report Configuration
      </div>

      <div className={controlStyles.controlContent}>

        <div className={tabStyles.tabs}>

          <button
            className={
              mode === "zscore"
                ? tabStyles.tabButtonActive
                : tabStyles.tabButton
            }
            onClick={() => setMode("zscore")}
          >
            Z-Score
          </button>

          <button
            className={
              mode === "detection"
                ? tabStyles.tabButtonActive
                : tabStyles.tabButton
            }
            onClick={() => setMode("detection")}
          >
            Detection
          </button>

          <button
            className={
              mode === "classification"
                ? tabStyles.tabButtonActive
                : tabStyles.tabButton
            }
            onClick={() => setMode("classification")}
          >
            Classification
          </button>

        </div>

        <div className={controlStyles.rangeInputs}>

          <div className={controlStyles.inputGroup}>

            <input
              type="text"
              className={controlStyles.input}
              placeholder="System Name"
              value={systemName}
              onChange={handleSystemChange}
            />

            <div className={controlStyles.inputLabel}>
              System Name
            </div>

          </div>

        </div>

        <div className={tabStyles.tabs}>

          <button
            className={
              viewMode === "chart"
                ? tabStyles.tabButtonActive
                : tabStyles.tabButton
            }
            onClick={() => setViewMode("chart")}
          >
            Chart View
          </button>

          <button
            className={
              viewMode === "table"
                ? tabStyles.tabButtonActive
                : tabStyles.tabButton
            }
            onClick={() => setViewMode("table")}
          >
            Table View
          </button>

        </div>

        <button
          className={controlStyles.runButton}
          onClick={handleRunDetection}
        >
          Generate Report
        </button>

        <div className={tabStyles.tabs}>

          <button
            className={controlStyles.runButton}
            onClick={handleExportCSV}
          >
            Export CSV
          </button>

          <button
            className={controlStyles.runButton}
            onClick={handleExportPDF}
          >
            Export PDF
          </button>

        </div>

        {executionMessage && (

          <div className={controlStyles.executionInfo}>

            <span>
              Report execution status:
            </span>

            <strong>
              {executionMessage}
            </strong>

          </div>

        )}

      </div>

    </section>

  </section>

);

}

export default AnomalyDetection;