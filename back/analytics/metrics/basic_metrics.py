

import pandas as pd

def total_consumption(dataset: pd.DataFrame) -> float:
    return dataset["consumption_kwh"].sum()

def average_consumption(dataset: pd.DataFrame) -> float:
    return dataset["consumption_kwh"].mean()

def consumption_by_system(dataset: pd.DataFrame) -> pd.Series:
    return dataset.groupby("system_name")["consumption_kwh"].sum()

def consumption_by_hour(dataset: pd.DataFrame) -> pd.Series:
    df = dataset.copy()
    df["timestamp"] = pd.to_datetime(df["timestamp"])

    return df.groupby(df["timestamp"].dt.hour)["consumption_kwh"].sum()