

import pandas as pd

from analytics.metrics.basic_metrics import (
    total_consumption,
    average_consumption,
    consumption_by_system,
    consumption_by_hour
)

def test_basic_metrics():

    total = total_consumption()
    assert isinstance(total, float)
    assert total > 0

    average = average_consumption()
    assert isinstance(average, float)
    assert average > 0

    system_consumption = consumption_by_system()
    assert isinstance(system_consumption, pd.Series)
    assert system_consumption.name == "consumption_kwh"
    assert not system_consumption.empty

    hourly_consumption = consumption_by_hour()
    assert isinstance(hourly_consumption, pd.Series)
    assert not hourly_consumption.empty