

import ReportHourlyChart from "../../../components/charts/ReportHourlyChart";
import ReportHourlyTable from "../../../components/tables/ReportHourlyTable";
import ReportDailyChart from "../../../components/charts/ReportDailyChart";
import ReportDailyTable from "../../../components/tables/ReportDailyTable";

import type {
  ConsumptionData,
  SimulationMode,
  ViewMode
} from "./types";

type Props = {
  mode: Extract<SimulationMode, "hourly" | "daily">;
  viewMode: ViewMode;
  hourlyData: ConsumptionData | null;
  dailyData: ConsumptionData | null;
};

export default function Consumption({
  mode,
  viewMode,
  hourlyData,
  dailyData
}: Props) {
  if (mode === "hourly") {
    if (viewMode === "chart") {
      return (
        <div
          style={{
            width: "100%",
            height: "100%"
          }}
        >
          {hourlyData && (
            <ReportHourlyChart data={hourlyData} />
          )}
        </div>
      );
    }

    return (
      <div
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        {hourlyData && (
          <ReportHourlyTable data={hourlyData} />
        )}
      </div>
    );
  }

  if (viewMode === "chart") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        {dailyData && (
          <ReportDailyChart data={dailyData} />
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%"
      }}
    >
      {dailyData && (
        <ReportDailyTable data={dailyData} />
      )}
    </div>
  );
}