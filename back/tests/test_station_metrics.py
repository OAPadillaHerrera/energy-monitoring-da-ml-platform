

import pandas as pd

from analytics.data.loaders.csv_loader import load_energy_dataset
from analytics.filters import filter_by_date_range

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
    std_consumption
)

def test_station_metrics_with_csv():

    df = load_energy_dataset()

    assert not df.empty, "Dataset should not be empty"

    df = filter_by_date_range(df, "2026-01-01", "2026-01-01")

    assert not df.empty, "Filtered dataset should not be empty"

    total = total_energy(df)
    avg_hourly = avg_hourly_consumption(df)
    peak = peak_demand(df)
    minimum = min_demand(df)

    assert total >= 0
    assert peak >= minimum
    assert avg_hourly >= 0

    hourly = energy_by_hour(df)
    daily = daily_energy(df)

    assert isinstance(hourly, pd.Series)
    assert isinstance(daily, pd.Series)

    avg_daily = avg_daily_energy(df)
    std = std_consumption(df)

    assert avg_daily >= 0
    assert std >= 0

    by_system = energy_by_system(df)
    share = energy_share(df)

    assert isinstance(by_system, pd.Series)
    assert isinstance(share, pd.Series)

    if len(share) > 0:
        assert abs(share.sum() - 100) < 1e-6

    profile = hourly_profile_by_system(df)

    assert isinstance(profile, pd.DataFrame)
    assert len(profile) > 0

if __name__ == "__main__":
    test_station_metrics_with_csv()
