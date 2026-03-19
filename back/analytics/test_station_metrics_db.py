

import pandas as pd

from analytics.data.dataset_loader_db import load_dataset_from_db
from analytics.station_metrics import (
    total_energy,
    avg_hourly_consumption,
    peak_demand,
    min_demand,
    energy_by_hour,
    daily_energy,
    avg_daily_energy,
    energy_by_system,
    energy_share,
    hourly_profile_by_system,
    std_consumption,
)

def test_station_metrics_with_db():

    df = load_dataset_from_db()

    print("\n=== DATAFRAME HEAD ===")
    print(df.head())

    print("\n=== TOTAL ENERGY ===")
    print(total_energy(df))

    print("\n=== AVG HOURLY CONSUMPTION ===")
    print(avg_hourly_consumption(df))

    print("\n=== PEAK DEMAND ===")
    print(peak_demand(df))

    print("\n=== MIN DEMAND ===")
    print(min_demand(df))

    print("\n=== ENERGY BY HOUR ===")
    print(energy_by_hour(df).head())

    print("\n=== DAILY ENERGY ===")
    print(daily_energy(df).head())

    print("\n=== AVG DAILY ENERGY ===")
    print(avg_daily_energy(df))

    print("\n=== ENERGY BY SYSTEM ===")
    print(energy_by_system(df))

    print("\n=== ENERGY SHARE (%) ===")
    print(energy_share(df))

    print("\n=== HOURLY PROFILE BY SYSTEM ===")
    print(hourly_profile_by_system(df).head())

    print("\n=== STD CONSUMPTION ===")
    print(std_consumption(df))

    assert not df.empty, "Dataset should not be empty"
    assert total_energy(df) > 0, "Total energy should be greater than 0"

if __name__ == "__main__":
    test_station_metrics_with_db()