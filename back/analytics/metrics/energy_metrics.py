

import pandas as pd

def load_factor(dataset: pd.DataFrame) -> float:
    hourly = dataset.groupby("timestamp")["consumption_kwh"].sum()

    peak = hourly.max()
    if peak == 0:
        return 0.0

    return hourly.mean() / peak

def load_factor_by_system(dataset: pd.DataFrame) -> pd.Series:
    grouped = dataset.groupby(
        ["timestamp", "system_name"]
    )["consumption_kwh"].sum().reset_index()

    results = {}

    for system in grouped["system_name"].unique():
        df_sys = grouped[grouped["system_name"] == system]
        avg = df_sys["consumption_kwh"].mean()
        peak = df_sys["consumption_kwh"].max()

        results[system] = avg / peak if peak != 0 else 0.0

    return pd.Series(results, name="load_factor")

def system_ranking(dataset: pd.DataFrame) -> pd.Series:
    system_energy = dataset.groupby("system_name")["consumption_kwh"].sum()

    return system_energy.sort_values(ascending=False)