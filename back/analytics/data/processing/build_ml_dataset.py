

import pandas as pd
from analytics.data.loaders.db_loader import load_energy_dataset_from_db

from analytics.diagnostic_metrics import (
    classify_anomalies_with_context_all_systems
)

def build_ml_dataset() -> pd.DataFrame:

    df = load_energy_dataset_from_db()

    anomalies_dict = classify_anomalies_with_context_all_systems(df)

    anomalies_list = []

    for system, anomalies in anomalies_dict.items():

        if anomalies.empty:
            continue

        temp = anomalies.copy()
        temp["system_name"] = system
        temp.reset_index(inplace=True)

        anomalies_list.append(temp)

    if anomalies_list:
        anomalies_df = pd.concat(anomalies_list, ignore_index=True)
    else:
        anomalies_df = pd.DataFrame()

    df_full = df.merge(
        anomalies_df[
            [
                "timestamp",
                "system_name",
                "z_score",
                "anomaly_type",
                "root_cause"
            ]
        ],
        on=["timestamp", "system_name"],
        how="left"
    )

    df_full["anomaly_type"] = df_full["anomaly_type"].fillna("normal")
    df_full["root_cause"] = df_full["root_cause"].fillna("normal")
    df_full["z_score"] = df_full["z_score"].fillna(0)

    df_full["hour"] = df_full["timestamp"].dt.hour
    df_full["weekday"] = df_full["timestamp"].dt.weekday

    df_full["rolling_mean_24h"] = (
        df_full.groupby("system_name")["consumption_kwh"]
        .transform(lambda x: x.rolling(24, min_periods=1).mean())
    )

    df_full["delta_consumption"] = (
        df_full["consumption_kwh"] - df_full["rolling_mean_24h"]
    )

    df_full["voltage_diff"] = (
        df_full["voltage_240v"] - (df_full["voltage_120v"] * 2)
    )

    df_full = df_full.sort_values(by=["system_name", "timestamp"])

    df_full.to_csv("ml_ready_dataset.csv", index=False)

    print("Dataset ML generado: ml_ready_dataset.csv")
    print(df_full.head())

    print("\n=== DISTRIBUCIÓN ROOT CAUSE ===")
    print(df_full["root_cause"].value_counts())

    print("\n=== DISTRIBUCIÓN ANOMALY TYPE ===")
    print(df_full["anomaly_type"].value_counts())

    return df_full

if __name__ == "__main__":
    build_ml_dataset()