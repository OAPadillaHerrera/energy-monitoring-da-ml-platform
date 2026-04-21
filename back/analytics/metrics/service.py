

import pandas as pd
from analytics.data.loaders.db_loader import load_energy_dataset_from_db
from core.exceptions import ApplicationError

from analytics.metrics.basic_metrics import (
    total_consumption,
    average_consumption,
    consumption_by_system,
    consumption_by_hour
)

from analytics.metrics.system_metrics import (
    total_energy_by_system,
    avg_consumption_by_system,
    peak_consumption_by_system,
    min_consumption_by_system,
    energy_by_hour_by_system,
    daily_energy_by_system,
    std_consumption_by_system,
    avg_daily_energy_by_system,
    avg_hourly_profile_by_system
)

from analytics.metrics.station_metrics import (
    total_energy,
    avg_hourly_consumption,
    peak_demand,
    min_demand,
    energy_by_hour,
    daily_energy,
    std_consumption,
    avg_daily_energy
)

from analytics.metrics.energy_metrics import (
    load_factor,
    load_factor_by_system,
    system_ranking
)

def _get_clean_dataset() -> pd.DataFrame:

    df = load_energy_dataset_from_db()

    if df is None or df.empty:
        raise ApplicationError("Energy dataset is empty or unavailable")

    required_columns = {"system_name", "consumption_kwh", "timestamp"}
    missing = required_columns - set(df.columns)

    if missing:
        raise ApplicationError(f"Missing required columns: {missing}")

    df["system_name"] = df["system_name"].astype(str).str.strip()

    return df

def _serialize_series(series):

    series = series.copy()
    series.index = series.index.map(lambda x: str(x))
    series = series.astype(float)

    return dict(series)

def get_basic_metrics():
    df = _get_clean_dataset()

    return {
        "total_consumption": float(total_consumption(df)),
        "average_consumption": float(average_consumption(df)),
        "consumption_by_system": _serialize_series(consumption_by_system(df)),
        "consumption_by_hour": _serialize_series(consumption_by_hour(df)),
    }

def get_station_metrics():
    df = _get_clean_dataset()

    return {
        "total_energy": float(total_energy(df)),
        "average_consumption": float(avg_hourly_consumption(df)),
        "peak_consumption": float(peak_demand(df)),
        "min_consumption": float(min_demand(df)),
        "std_consumption": float(std_consumption(df)),
        "avg_daily_energy": float(avg_daily_energy(df)),
        "energy_by_hour": _serialize_series(energy_by_hour(df)),
        "daily_energy": _serialize_series(daily_energy(df)),
    }

def get_system_metrics(system_name: str):
    df = _get_clean_dataset()

    if system_name not in df["system_name"].unique():
        raise ApplicationError(f"System '{system_name}' not found")

    return {
        "system": system_name,
        "total_energy": float(total_energy_by_system(df, system_name)),
        "average_consumption": float(avg_consumption_by_system(df, system_name)),
        "peak_consumption": float(peak_consumption_by_system(df, system_name)),
        "min_consumption": float(min_consumption_by_system(df, system_name)),
        "std_consumption": float(std_consumption_by_system(df, system_name)),
        "avg_daily_energy": float(avg_daily_energy_by_system(df, system_name)),
        "energy_by_hour": _serialize_series(energy_by_hour_by_system(df, system_name)),
        "daily_energy": _serialize_series(daily_energy_by_system(df, system_name)),
        "avg_hourly_profile": _serialize_series(avg_hourly_profile_by_system(df, system_name)),
    }

def get_energy_metrics():
    df = _get_clean_dataset()

    return {
        "load_factor": float(load_factor(df)),
        "load_factor_by_system": _serialize_series(load_factor_by_system(df)),
        "system_ranking": _serialize_series(system_ranking(df)),
    }