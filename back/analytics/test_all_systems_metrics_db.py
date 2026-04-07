

from data.loaaders.db_loader import load_dataset_from_db
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

def test_all_systems_metrics():

    df = load_dataset_from_db()

    print("\n=== DATASET INFO ===")
    print(df.head())
    print(f"\nTotal rows: {len(df)}")

    assert not df.empty, "Dataset should not be empty"

    systems = df["system_name"].unique()

    print(f"\nTotal systems: {len(systems)}")

    for system in systems:

        print(f"\n==============================")
        print(f"=== SYSTEM: {system} ===")
        print(f"==============================")

        total = total_energy_by_system(df, system)
        avg = avg_consumption_by_system(df, system)
        peak = peak_consumption_by_system(df, system)
        minimum = min_consumption_by_system(df, system)

        print("\n--- CORE METRICS ---")
        print("Total:", total)
        print("Avg:", avg)
        print("Peak:", peak)
        print("Min:", minimum)

        assert total >= 0, f"Total energy invalid for {system}"
        assert peak >= minimum, f"Peak < Min for {system}"

        hourly = energy_by_hour_by_system(df, system)

        print("\n--- HOURLY ENERGY (first 5) ---")
        print(hourly.head())

        assert len(hourly) > 0, f"No hourly data for {system}"

        daily = daily_energy_by_system(df, system)

        print("\n--- DAILY ENERGY ---")
        print(daily)

        avg_daily = avg_daily_energy_by_system(df, system)

        print("\n--- AVG DAILY ENERGY ---")
        print(avg_daily)

        std = std_consumption_by_system(df, system)

        print("\n--- STD CONSUMPTION ---")
        print(std)

        profile = avg_hourly_profile_by_system(df, system)

        print("\n--- AVG HOURLY PROFILE (first 5) ---")
        print(profile.head())

        if total > 0:
            assert avg > 0, f"Avg consumption should be > 0 for {system}"

    print("\nALL SYSTEMS TEST PASSED")

if __name__ == "__main__":
    test_all_systems_metrics()