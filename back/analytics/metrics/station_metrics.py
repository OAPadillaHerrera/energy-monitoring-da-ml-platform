

import pandas as pd

def _hourly_energy(dataset: pd.DataFrame) -> pd.Series:
    return dataset.groupby("timestamp")["consumption_kwh"].sum()

def _daily_energy(dataset: pd.DataFrame) -> pd.Series:
    dates = pd.to_datetime(dataset["timestamp"]).dt.date
    return dataset.groupby(dates)["consumption_kwh"].sum()

def total_energy(dataset: pd.DataFrame) -> float:
    return dataset["consumption_kwh"].sum()

def avg_hourly_consumption(dataset: pd.DataFrame) -> float:
    return _hourly_energy(dataset).mean()

def peak_demand(dataset: pd.DataFrame) -> float:
    return _hourly_energy(dataset).max()

def min_demand(dataset: pd.DataFrame) -> float:
    return _hourly_energy(dataset).min()

def energy_by_hour(dataset: pd.DataFrame) -> pd.Series:
    return _hourly_energy(dataset)

def daily_energy(dataset: pd.DataFrame) -> pd.Series:
    return _daily_energy(dataset)

def avg_daily_energy(dataset: pd.DataFrame) -> float:
    return _daily_energy(dataset).mean()

def energy_by_system(dataset: pd.DataFrame) -> pd.Series:
    return dataset.groupby("system_name")["consumption_kwh"].sum()

def energy_share(dataset: pd.DataFrame) -> pd.Series:
    system_energy = energy_by_system(dataset)
    total = system_energy.sum()
    return (system_energy / total) * 100

def hourly_profile_by_system(dataset: pd.DataFrame) -> pd.DataFrame:
    return dataset.pivot_table(
        index="timestamp",
        columns="system_name",
        values="consumption_kwh",
        aggfunc="sum"
    )

def std_consumption(dataset: pd.DataFrame) -> float:
    return _hourly_energy(dataset).std()