

"""
Daily Consumption Service

Aggregates hourly consumption records into daily totals per system 
and inserts them into the database, with proper exception handling.
"""

from collections import defaultdict
from datetime import datetime, date
from typing import List, Tuple
from repositories.daily_consumption_repository import insert_daily_consumption
from core.exceptions import RepositoryError, ConfigurationError

def build_daily_consumption_records(
    hourly_records: List[Tuple[int, datetime, float]]
) -> List[Tuple[int, date, float]]:

    if not isinstance(hourly_records, list):
        raise ConfigurationError("hourly_records must be a list of tuples")

    totals: defaultdict[Tuple[int, date], float] = defaultdict(float)

    for record in hourly_records:
        try:
            system_id, timestamp, consumption = record
            if not isinstance(system_id, int):
                raise ConfigurationError(f"Invalid system_id: {system_id}")
            if not isinstance(timestamp, datetime):
                raise ConfigurationError(f"Invalid timestamp: {timestamp}")
            if not isinstance(consumption, (int, float)):
                raise ConfigurationError(f"Invalid consumption value: {consumption}")

            key = (system_id, timestamp.date())
            totals[key] += consumption

        except ValueError:
            raise ConfigurationError(f"Invalid hourly record format: {record}")

    daily_records: List[Tuple[int, date, float]] = [
        (system_id, day, total) for (system_id, day), total in totals.items()
    ]

    try:
        insert_daily_consumption(daily_records)
    except Exception as e:
        raise RepositoryError(
            "Failed to insert daily consumption records into the repository"
        ) from e

    return daily_records