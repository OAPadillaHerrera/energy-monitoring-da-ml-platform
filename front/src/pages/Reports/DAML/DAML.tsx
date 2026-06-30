

import { useState } from "react";
import layoutStyles from "../../../components/shared/styles/layoutStyles.module.css";
import tabStyles from "../../../components/shared/styles/tabStyles.module.css";
import Metrics from "./Metrics/Metrics";
import AnomalyDetection from "./AnomalyDetection/AnomalyDetection";
import ML from "./ML/ML";

function DAML() {

  const [section, setSection] =
    useState<"metrics" | "anomaly" | "ml">("metrics");

  return (

    <section className={layoutStyles.mainPanel}>

      <div className={tabStyles.tabs}>

        <button
          className={
            section === "metrics"
              ? tabStyles.tabButtonActive
              : tabStyles.tabButton
          }
          onClick={() => setSection("metrics")}
        >
          Metrics
        </button>

        <button
          className={
            section === "anomaly"
              ? tabStyles.tabButtonActive
              : tabStyles.tabButton
          }
          onClick={() => setSection("anomaly")}
        >
          Anomaly
        </button>

        <button
          className={
            section === "ml"
              ? tabStyles.tabButtonActive
              : tabStyles.tabButton
          }
          onClick={() => setSection("ml")}
        >
          ML
        </button>

      </div>

      {section === "metrics" && (
        <Metrics />
      )}

      {section === "anomaly" && (
        <AnomalyDetection />
      )}

      {section === "ml" && (
        <ML />
      )}

    </section>

  );

}

export default DAML;