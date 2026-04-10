

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

def test_system_metrics_with_db():

    df = load_energy_dataset_from_db()

    system_name = "Price Display System"

    assert not df.empty

    total = total_energy_by_system(df, system_name)
    avg = avg_consumption_by_system(df, system_name)
    peak = peak_consumption_by_system(df, system_name)
    min_val = min_consumption_by_system(df, system_name)

    assert total > 0
    assert avg >= 0
    assert peak >= min_val

    hourly = energy_by_hour_by_system(df, system_name)
    daily = daily_energy_by_system(df, system_name)
    std = std_consumption_by_system(df, system_name)
    avg_daily = avg_daily_energy_by_system(df, system_name)
    hourly_profile = avg_hourly_profile_by_system(df, system_name)

    assert not hourly.empty
    assert not daily.empty
    assert std >= 0
    assert avg_daily >= 0
    assert len(hourly_profile) <= 24