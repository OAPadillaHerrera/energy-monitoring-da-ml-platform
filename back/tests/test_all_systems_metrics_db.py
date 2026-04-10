

from analytics.data.loaders.db_loader import load_energy_dataset_from_db

from analytics.metrics.system_metrics import (
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

    df = load_energy_dataset_from_db()

    assert not df.empty, "Dataset should not be empty"

    systems = df["system_name"].unique()

    for system in systems:

        total = total_energy_by_system(df, system)
        avg = avg_consumption_by_system(df, system)
        peak = peak_consumption_by_system(df, system)
        minimum = min_consumption_by_system(df, system)

        assert total >= 0
        assert peak >= minimum

        hourly = energy_by_hour_by_system(df, system)
        assert len(hourly) > 0

        daily = daily_energy_by_system(df, system)
        assert len(daily) > 0

        avg_daily = avg_daily_energy_by_system(df, system)
        assert avg_daily >= 0

        std = std_consumption_by_system(df, system)
        assert std >= 0

        profile = avg_hourly_profile_by_system(df, system)
        assert len(profile) > 0

        if total > 0:
            assert avg > 0

    print("ALL SYSTEMS TEST PASSED")

if __name__ == "__main__":
    test_all_systems_metrics()