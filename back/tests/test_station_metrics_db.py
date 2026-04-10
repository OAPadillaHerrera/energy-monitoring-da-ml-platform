

import pandas as pd

from analytics.data.loaders.db_loader import load_energy_dataset_from_db

from analytics.metrics.station_metrics import (
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

    df = load_energy_dataset_from_db()

    assert not df.empty, "Dataset should not be empty"

    total = total_energy(df)
    avg_hourly = avg_hourly_consumption(df)
    peak = peak_demand(df)
    minimum = min_demand(df)

    assert total > 0
    assert peak >= minimum
    assert avg_hourly > 0

    hourly = energy_by_hour(df)
    daily = daily_energy(df)

    assert isinstance(hourly, pd.Series)
    assert isinstance(daily, pd.Series)
    assert len(hourly) > 0
    assert len(daily) > 0

    avg_daily = avg_daily_energy(df)
    std = std_consumption(df)

    assert avg_daily > 0
    assert std >= 0

    system_energy = energy_by_system(df)
    share = energy_share(df)

    assert isinstance(system_energy, pd.Series)
    assert isinstance(share, pd.Series)
    assert abs(share.sum() - 100) < 1e-6  # porcentaje total ≈ 100%

    profile = hourly_profile_by_system(df)

    assert isinstance(profile, pd.DataFrame)
    assert len(profile) > 0

if __name__ == "__main__":
    test_station_metrics_with_db()

