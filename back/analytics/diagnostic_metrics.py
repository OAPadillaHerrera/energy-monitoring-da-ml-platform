

import pandas as pd
from typing import Dict
from analytics.filters import filter_by_system
from config.settings import ANOMALY_Z_THRESHOLD

def load_factor(dataset: pd.DataFrame) -> float:
    hourly = dataset.groupby("timestamp")["consumption_kwh"].sum()
    return hourly.mean() / hourly.max()

def load_factor_by_system(dataset: pd.DataFrame) -> pd.Series:
    grouped = dataset.groupby(["timestamp", "system_name"])["consumption_kwh"].sum().reset_index()

    results = {}

    for system in grouped["system_name"].unique():
        df_sys = grouped[grouped["system_name"] == system]
        avg = df_sys["consumption_kwh"].mean()
        peak = df_sys["consumption_kwh"].max()

        results[system] = avg / peak if peak != 0 else 0

    return pd.Series(results, name="load_factor")

def system_ranking(dataset: pd.DataFrame) -> pd.Series:
    return dataset.groupby("system_name")["consumption_kwh"].sum().sort_values(ascending=False)

def compute_z_score(series: pd.Series) -> pd.Series:
    mean = series.mean()
    std = series.std()
    return (series - mean) / std

def z_score_consumption(dataset: pd.DataFrame) -> pd.Series:
    hourly = dataset.groupby("timestamp")["consumption_kwh"].sum()
    return compute_z_score(hourly)

def z_score_by_system(dataset: pd.DataFrame, system_name: str) -> pd.Series:
    system_data = filter_by_system(dataset, system_name)
    hourly = system_data.groupby("timestamp")["consumption_kwh"].sum()
    return compute_z_score(hourly)

def detect_anomalies(z_scores: pd.Series, threshold: float = ANOMALY_Z_THRESHOLD) -> pd.Series:
    return z_scores[abs(z_scores) > threshold]

def detect_anomalies_by_system(
    dataset: pd.DataFrame,
    system_name: str,
    threshold: float = ANOMALY_Z_THRESHOLD
) -> pd.Series:

    z_scores = z_score_by_system(dataset, system_name)
    return detect_anomalies(z_scores, threshold)

def detect_anomalies_all_systems(
    dataset: pd.DataFrame,
    threshold: float = ANOMALY_Z_THRESHOLD
) -> Dict[str, pd.Series]:

    results = {}

    for system in dataset["system_name"].unique():
        anomalies = detect_anomalies_by_system(dataset, system, threshold)

        if not anomalies.empty:
            results[system] = anomalies

    return results

def classify_anomaly(z_score: float, threshold: float = ANOMALY_Z_THRESHOLD) -> str:
    if z_score >= threshold:
        return "spike"
    elif z_score <= -threshold:
        return "drop"
    return "normal"

def classify_anomalies_by_system(
    dataset: pd.DataFrame,
    system_name: str,
    threshold: float = ANOMALY_Z_THRESHOLD
) -> pd.DataFrame:

    anomalies = detect_anomalies_by_system(dataset, system_name, threshold)

    if anomalies.empty:
        return anomalies

    result = anomalies.to_frame(name="z_score")

    result["anomaly_type"] = result["z_score"].apply(
        lambda z: classify_anomaly(z, threshold)
    )

    return result

def classify_anomalies_all_systems(
    dataset: pd.DataFrame,
    threshold: float = ANOMALY_Z_THRESHOLD
) -> Dict[str, pd.DataFrame]:

    results = {}

    for system in dataset["system_name"].unique():
        classified = classify_anomalies_by_system(dataset, system, threshold)

        if not classified.empty:
            results[system] = classified

    return results

def determine_root_cause(
    anomaly_type: str,
    voltage_status: str,
    voltage_120v: float | None = None,
    voltage_240v: float | None = None
) -> str:

    if voltage_120v == 0 and voltage_240v == 0:
        return "grid_outage"

    if voltage_status in ["brownout", "brownout_severe"]:
        return "grid_issue"

    if voltage_status in ["overvoltage", "overvoltage_severe"]:
        return "voltage_instability"

    if anomaly_type == "drop":
        return "equipment_issue"

    if anomaly_type == "spike":
        return "demand_spike"

    return "normal"

def classify_anomalies_with_context(
    dataset: pd.DataFrame,
    system_name: str,
    threshold: float = ANOMALY_Z_THRESHOLD
) -> pd.DataFrame:

    anomalies = detect_anomalies_by_system(dataset, system_name, threshold)

    if anomalies.empty:
        return anomalies

    result = anomalies.to_frame(name="z_score")

    system_data = dataset[dataset["system_name"] == system_name]

    result = result.merge(
        system_data[["timestamp", "voltage_120v", "voltage_240v", "quality_flag"]],
        left_index=True,
        right_on="timestamp",
        how="left"
    )

    result["anomaly_type"] = result["z_score"].apply(
        lambda z: classify_anomaly(z, threshold)
    )

    result["root_cause"] = result.apply(
        lambda row: determine_root_cause(
            row["anomaly_type"],
            row["quality_flag"],
            row["voltage_120v"],
            row["voltage_240v"]
        ),
        axis=1
    )

    result.set_index("timestamp", inplace=True)

    return result

def classify_anomalies_with_context_all_systems(
    dataset: pd.DataFrame,
    threshold: float = ANOMALY_Z_THRESHOLD
) -> Dict[str, pd.DataFrame]:

    results = {}

    for system in dataset["system_name"].unique():
        classified = classify_anomalies_with_context(dataset, system, threshold)

        if not classified.empty:
            results[system] = classified

    return results