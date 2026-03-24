

import pandas as pd
from analytics.filters import filter_by_system

def load_factor(dataset):

    hourly = dataset.groupby("timestamp")["consumption_kwh"].sum()

    return hourly.mean() / hourly.max()

def load_factor_by_system(dataset):

    grouped = dataset.groupby(["timestamp", "system_name"])["consumption_kwh"].sum().reset_index()

    results = {}

    for system in grouped["system_name"].unique():
        df_sys = grouped[grouped["system_name"] == system]
        avg = df_sys["consumption_kwh"].mean()
        peak = df_sys["consumption_kwh"].max()

        results[system] = avg / peak if peak != 0 else 0

    return pd.Series(results, name="load_factor")

def system_ranking(dataset):

    system_energy = dataset.groupby("system_name")["consumption_kwh"].sum()

    return system_energy.sort_values(ascending=False)

def z_score_consumption(dataset):

    hourly = dataset.groupby("timestamp")["consumption_kwh"].sum()

    mean = hourly.mean()
    std = hourly.std()

    z_scores = (hourly - mean) / std

    return z_scores

def detect_anomalies(dataset, threshold=2):

    z_scores = z_score_consumption(dataset)

    anomalies = z_scores[abs(z_scores) > threshold]

    return anomalies

def z_score_by_system(dataset, system_name):

    system_data = filter_by_system(dataset, system_name)

    hourly = system_data.groupby("timestamp")["consumption_kwh"].sum()

    mean = hourly.mean()
    std = hourly.std()

    return (hourly - mean) / std

def detect_anomalies_by_system(dataset, system_name, threshold=2):

    z_scores = z_score_by_system(dataset, system_name)

    anomalies = z_scores[abs(z_scores) > threshold]

    return anomalies

def detect_anomalies_all_systems(dataset, threshold=2):

    systems = dataset["system_name"].unique()

    results = {}

    for system in systems:
        anomalies = detect_anomalies_by_system(dataset, system, threshold)

        if not anomalies.empty:
            results[system] = anomalies

    return results

def classify_anomaly(z_score, threshold=2):

    if z_score >= threshold:
        return "spike"
    
    elif z_score <= -threshold:
        return "drop"
    
    return "normal"

def classify_anomalies_by_system(dataset, system_name, threshold=2):

    anomalies = detect_anomalies_by_system(dataset, system_name, threshold)

    if anomalies.empty:
        return anomalies

    result = anomalies.to_frame(name="z_score")

    result["anomaly_type"] = result["z_score"].apply(
        lambda z: classify_anomaly(z, threshold)
    )

    return result

def classify_anomalies_all_systems(dataset, threshold=2):

    systems = dataset["system_name"].unique()

    results = {}

    for system in systems:
        classified = classify_anomalies_by_system(dataset, system, threshold)

        if not classified.empty:
            results[system] = classified

    return results

def determine_root_cause(
    anomaly_type,
    voltage_status,
    voltage_120v=None,
    voltage_240v=None
):

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

def classify_anomalies_with_context(dataset, system_name, threshold=2):

    from analytics.diagnostic_metrics import detect_anomalies_by_system

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

def classify_anomalies_with_context_all_systems(dataset, threshold=2):

    systems = dataset["system_name"].unique()

    results = {}

    for system in systems:

        classified = classify_anomalies_with_context(dataset, system, threshold)

        if not classified.empty:
            results[system] = classified

    return results
