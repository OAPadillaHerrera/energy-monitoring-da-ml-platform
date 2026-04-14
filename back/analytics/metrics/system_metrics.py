

import pandas as pd
from data.filters import filter_by_system

def total_energy_by_system(dataset: pd.DataFrame, system_name: str) -> float:
    system_data = filter_by_system(dataset, system_name)
    return system_data["consumption_kwh"].sum()

def avg_consumption_by_system(dataset: pd.DataFrame, system_name: str) -> float:
    system_data = filter_by_system(dataset, system_name)
    return system_data["consumption_kwh"].mean()

def peak_consumption_by_system(dataset: pd.DataFrame, system_name: str) -> float:
    system_data = filter_by_system(dataset, system_name)
    return system_data["consumption_kwh"].max()

def min_consumption_by_system(dataset: pd.DataFrame, system_name: str) -> float:
    system_data = filter_by_system(dataset, system_name)
    return system_data["consumption_kwh"].min()

def energy_by_hour_by_system(dataset: pd.DataFrame, system_name: str) -> pd.Series:
    system_data = filter_by_system(dataset, system_name)
    return system_data.groupby("timestamp")["consumption_kwh"].sum()

def daily_energy_by_system(dataset: pd.DataFrame, system_name: str) -> pd.Series:
    hourly_energy = energy_by_hour_by_system(dataset, system_name)

    daily_energy = (
        hourly_energy
        .groupby(pd.to_datetime(hourly_energy.index).date)
        .sum()
    )

    return daily_energy

def std_consumption_by_system(dataset: pd.DataFrame, system_name: str) -> float:
    hourly = energy_by_hour_by_system(dataset, system_name)
    return hourly.std()

def avg_daily_energy_by_system(dataset: pd.DataFrame, system_name: str) -> float:
    daily = daily_energy_by_system(dataset, system_name)
    return daily.mean()

def avg_hourly_profile_by_system(dataset: pd.DataFrame, system_name: str) -> pd.Series:
    hourly = energy_by_hour_by_system(dataset, system_name)

    df_hourly = hourly.to_frame(name="consumption_kwh")
    df_hourly["hour"] = pd.to_datetime(df_hourly.index).hour

    return df_hourly.groupby("hour")["consumption_kwh"].mean()