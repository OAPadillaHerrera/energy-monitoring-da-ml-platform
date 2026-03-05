

"""
Working Schedules Configuration

Defines the allowed working days and active hours for each schedule.
Used by ScheduleService to determine whether a system is active
at a given timestamp.
"""

from typing import Dict, List, TypedDict
from core.exceptions import ConfigurationError

class ScheduleConfig(TypedDict):
    days: List[int]
    hours: List[int]

WORKING_SCHEDULES: Dict[str, ScheduleConfig] = {
    "24_7": {
        "days": [0, 1, 2, 3, 4, 5, 6],
        "hours": list(range(0, 24)),
    },
    "office_hours": {
        "days": [0, 1, 2, 3, 4],
        "hours": list(range(8, 12)) + list(range(13, 17)),
    },
    "nighttime": {
        "days": [0, 1, 2, 3, 4, 5, 6],
        "hours": list(range(18, 24)) + list(range(0, 6)),
    },
    "coffee_machine": {
        "days": [0, 1, 2, 3, 4, 5, 6],
        "hours": list(range(6, 7)),
    },
}

def validate_working_schedules() -> None:

    if not isinstance(WORKING_SCHEDULES, dict) or not WORKING_SCHEDULES:
        raise ConfigurationError("WORKING_SCHEDULES must be a non-empty dictionary")

    for schedule_name, schedule in WORKING_SCHEDULES.items():

        if not isinstance(schedule, dict):
            raise ConfigurationError(
                f"Schedule '{schedule_name}' definition must be a dictionary"
            )

        days = schedule.get("days")
        hours = schedule.get("hours")

        if not isinstance(days, list) or not days:
            raise ConfigurationError(
                f"Schedule '{schedule_name}' must define a non-empty list of days"
            )

        if not isinstance(hours, list) or not hours:
            raise ConfigurationError(
                f"Schedule '{schedule_name}' must define a non-empty list of hours"
            )

        if len(set(days)) != len(days):
            raise ConfigurationError(
                f"Schedule '{schedule_name}' contains duplicate day values"
            )

        if len(set(hours)) != len(hours):
            raise ConfigurationError(
                f"Schedule '{schedule_name}' contains duplicate hour values"
            )

        for day in days:
            if not isinstance(day, int) or day < 0 or day > 6:
                raise ConfigurationError(
                    f"Schedule '{schedule_name}' has invalid day value: {day}"
                )

        for hour in hours:
            if not isinstance(hour, int) or hour < 0 or hour > 23:
                raise ConfigurationError(
                    f"Schedule '{schedule_name}' has invalid hour value: {hour}"
                )

validate_working_schedules()