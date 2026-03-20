

import pandas as pd

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