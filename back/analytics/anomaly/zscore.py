

import pandas as pd
from analytics.filters import filter_by_system

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