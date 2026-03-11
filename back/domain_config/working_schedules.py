

"""
Working Schedules Configuration

Defines the allowed working days and active hours for each schedule.
Used by ScheduleService to determine whether a system is active
at a given timestamp.

Design principles
-----------------
- Schedules define when a system is allowed to operate.
- Days follow Python's weekday convention: Monday=0, Sunday=6.
- Hours are expressed using 24-hour format (0–23).
- Configuration is validated at import time to detect errors early.
"""

from typing import Dict, Sequence, TypedDict
from core.exceptions import ConfigurationError

VALID_DAYS = set(range(7))
VALID_HOURS = set(range(24))

class ScheduleConfig(TypedDict):
    days: Sequence[int]
    hours: Sequence[int]

WORKING_SCHEDULES: Dict[str, ScheduleConfig] = {

    "24_7": {
        "days": list(range(7)),
        "hours": list(range(24)),
    },

    "office_hours": {
        "days": [0, 1, 2, 3, 4],
        "hours": list(range(8, 12)) + list(range(13, 17)),
    },

    "nighttime": {
        "days": list(range(7)),
        "hours": list(range(18, 24)) + list(range(0, 6)),
    },

    "coffee_machine": {
        "days": list(range(7)),
        "hours": [6],
    },
}

def _validate_days(schedule_name: str, days: Sequence[int]) -> None:

    if not isinstance(days, Sequence) or not days:
        raise ConfigurationError(
            f"Schedule '{schedule_name}' must define a non-empty sequence of days"
        )

    if len(set(days)) != len(days):
        raise ConfigurationError(
            f"Schedule '{schedule_name}' contains duplicate day values"
        )

    for day in days:
        if day not in VALID_DAYS:
            raise ConfigurationError(
                f"Schedule '{schedule_name}' has invalid day value: {day}"
            )

def _validate_hours(schedule_name: str, hours: Sequence[int]) -> None:

    if not isinstance(hours, Sequence) or not hours:
        raise ConfigurationError(
            f"Schedule '{schedule_name}' must define a non-empty sequence of hours"
        )

    if len(set(hours)) != len(hours):
        raise ConfigurationError(
            f"Schedule '{schedule_name}' contains duplicate hour values"
        )

    for hour in hours:
        if hour not in VALID_HOURS:
            raise ConfigurationError(
                f"Schedule '{schedule_name}' has invalid hour value: {hour}"
            )

def validate_working_schedules() -> None:

    if not isinstance(WORKING_SCHEDULES, dict) or not WORKING_SCHEDULES:
        raise ConfigurationError("WORKING_SCHEDULES must be a non-empty dictionary")

    for schedule_name, schedule_config in WORKING_SCHEDULES.items():

        if not isinstance(schedule_config, dict):
            raise ConfigurationError(
                f"Schedule '{schedule_name}' definition must be a dictionary"
            )

        days = schedule_config.get("days")
        hours = schedule_config.get("hours")

        if days is None:
            raise ConfigurationError(
                f"Schedule '{schedule_name}' missing 'days' definition"
            )

        if hours is None:
            raise ConfigurationError(
                f"Schedule '{schedule_name}' missing 'hours' definition"
            )

        _validate_days(schedule_name, days)
        _validate_hours(schedule_name, hours)

validate_working_schedules()