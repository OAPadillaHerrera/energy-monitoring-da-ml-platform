

from analytics.data.dataset_loader_db import load_dataset_from_db
from analytics.system_metrics import (
    total_energy_by_system,
    avg_consumption_by_system,
    peak_consumption_by_system,
    min_consumption_by_system,
    energy_by_hour_by_system,
    daily_energy_by_system,
    std_consumption_by_system,
    avg_daily_energy_by_system,
    avg_hourly_profile_by_system,
)

def test_system_metrics_with_db():

    df = load_dataset_from_db()

    system_name = "Price Display System"

    print("\n=== SYSTEM SELECTED ===")
    print(system_name)

    print("\n=== TOTAL ENERGY ===")
    print(total_energy_by_system(df, system_name))

    print("\n=== AVG CONSUMPTION ===")
    print(avg_consumption_by_system(df, system_name))

    print("\n=== PEAK CONSUMPTION ===")
    print(peak_consumption_by_system(df, system_name))

    print("\n=== MIN CONSUMPTION ===")
    print(min_consumption_by_system(df, system_name))

    print("\n=== ENERGY BY HOUR ===")
    print(energy_by_hour_by_system(df, system_name).head())

    print("\n=== DAILY ENERGY ===")
    print(daily_energy_by_system(df, system_name))

    print("\n=== STD CONSUMPTION ===")
    print(std_consumption_by_system(df, system_name))

    print("\n=== AVG DAILY ENERGY ===")
    print(avg_daily_energy_by_system(df, system_name))

    print("\n=== AVG HOURLY PROFILE ===")
    print(avg_hourly_profile_by_system(df, system_name).head())

    assert not df.empty, "Dataset should not be empty"
    assert total_energy_by_system(df, system_name) > 0

if __name__ == "__main__":
    test_system_metrics_with_db()