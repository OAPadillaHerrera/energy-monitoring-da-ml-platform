

"""
Daily Consumption Service

Aggregates hourly consumption records into daily totals per system
and persists the results using the daily consumption repository.

Responsibilities
----------------
- Validate hourly consumption records
- Aggregate consumption by (system_id, date)
- Persist aggregated daily totals

Design principles
-----------------
- Deterministic aggregation
- Explicit validation
- Clear separation between aggregation logic and persistence
"""

from collections import defaultdict
from datetime import datetime, date
from typing import List, Tuple, TypeAlias
from repositories.daily_consumption_repository import insert_daily_consumption
from core.exceptions import RepositoryError, ConfigurationError

HourlyRecord: TypeAlias = Tuple[int, datetime, float]
DailyRecord: TypeAlias = Tuple[int, date, float]

def build_daily_consumption_records(
    hourly_records: List[HourlyRecord],
) -> List[DailyRecord]:

    if not isinstance(hourly_records, list):
        raise ConfigurationError("hourly_records must be a list")

    if not hourly_records:
        raise ConfigurationError("hourly_records list is empty")

    totals: defaultdict[Tuple[int, date], float] = defaultdict(float)

    for record in hourly_records:

        if not isinstance(record, tuple) or len(record) != 3:
            raise ConfigurationError(
                f"Invalid hourly record format (expected 3 elements): {record}"
            )

        system_id, timestamp, consumption = record

        if not isinstance(system_id, int):
            raise ConfigurationError(f"Invalid system_id: {system_id}")

        if not isinstance(timestamp, datetime):
            raise ConfigurationError(f"Invalid timestamp: {timestamp}")

        if not isinstance(consumption, (int, float)):
            raise ConfigurationError(f"Invalid consumption value: {consumption}")

        key = (system_id, timestamp.date())
        totals[key] += float(consumption)

    daily_records: List[DailyRecord] = [
        (system_id, day, total)
        for (system_id, day), total in totals.items()
    ]

    try:
        insert_daily_consumption(daily_records)
    except Exception as exc:
        raise RepositoryError(
            "Failed to insert daily consumption records into repository"
        ) from exc

    return daily_records