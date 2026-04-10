

from analytics.data.loaders.csv_loader import load_energy_dataset

from metrics.system_metrics import (
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

def test_system_metrics_basic():

    dataset = load_energy_dataset()

    assert not dataset.empty, "Dataset should not be empty"

    systems = dataset["system_name"].unique()
    assert len(systems) > 0, "No systems found in dataset"

    for system in systems:

        total = total_energy_by_system(dataset, system)
        avg = avg_consumption_by_system(dataset, system)
        peak = peak_consumption_by_system(dataset, system)
        min_val = min_consumption_by_system(dataset, system)

        assert total >= 0
        assert avg >= 0
        assert peak >= 0
        assert min_val >= 0
        assert peak >= min_val

        hourly = energy_by_hour_by_system(dataset, system)
        daily = daily_energy_by_system(dataset, system)
        std = std_consumption_by_system(dataset, system)
        avg_daily = avg_daily_energy_by_system(dataset, system)
        hourly_profile = avg_hourly_profile_by_system(dataset, system)

        assert not hourly.empty
        assert not daily.empty
        assert std >= 0
        assert avg_daily >= 0
        assert len(hourly_profile) <= 24

if __name__ == "__main__":
    test_system_metrics_basic()