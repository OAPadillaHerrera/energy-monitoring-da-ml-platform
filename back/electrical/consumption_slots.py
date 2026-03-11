

"""
Fuel & Pump Consumption Profile

Defines the temporal distribution of energy consumption for
specific systems using configurable time slots.

Responsibilities
----------------
- Define hourly distribution profiles for selected systems.
- Validate slot configuration at application startup.
- Provide slot-based consumption factors used by SystemCalculator.

Design notes
------------
- This module DOES NOT define energy consumption values.
- Nominal consumption and duration are defined in systems_config.
- Only the time distribution (slot factors) is handled here.
- Deterministic behavior. No persistence logic.
"""

import datetime
from typing import TypedDict
from core.exceptions import SimulationError
from domain_config.systems_config import SYSTEMS_CONFIG

class TimeSlot(TypedDict):
    name: str
    start: int
    end: int
    percentage: float

TIME_SLOTS: dict[str, list[TimeSlot]] = {

    "mon_fri": [
        {"name": "low",    "start": 0,  "end": 7,  "percentage": 0.18},
        {"name": "high",   "start": 7,  "end": 11, "percentage": 0.28},
        {"name": "medium", "start": 11, "end": 17, "percentage": 0.20},
        {"name": "high",   "start": 17, "end": 20, "percentage": 0.28},
        {"name": "low",    "start": 20, "end": 24, "percentage": 0.06},
    ],

    "saturday": [
        {"name": "low",    "start": 0,  "end": 7,  "percentage": 0.25},
        {"name": "high",   "start": 7,  "end": 11, "percentage": 0.35},
        {"name": "medium", "start": 11, "end": 13, "percentage": 0.20},
        {"name": "low",    "start": 13, "end": 24, "percentage": 0.20},
    ],

    "sunday": [
        {"name": "low", "start": 0, "end": 24, "percentage": 1.00},
    ],
}

def _validate_slot_structure(day_type: str, slot: TimeSlot) -> None:

    start = slot["start"]
    end = slot["end"]
    percentage = slot["percentage"]

    if not (0 <= start < 24):
        raise SimulationError(
            f"Invalid start hour in {day_type}: {slot}"
        )

    if not (0 < end <= 24):
        raise SimulationError(
            f"Invalid end hour in {day_type}: {slot}"
        )

    if start >= end:
        raise SimulationError(
            f"start must be < end in {day_type}: {slot}"
        )

    if not (0 <= percentage <= 1):
        raise SimulationError(
            f"Invalid percentage in {day_type}: {slot}"
        )

def _validate_time_slots() -> None:

    for day_type, slots in TIME_SLOTS.items():

        total_percentage = 0.0

        for slot in slots:
            _validate_slot_structure(day_type, slot)
            total_percentage += slot["percentage"]

        if round(total_percentage, 8) != 1.0:
            raise SimulationError(
                f"Percentages for {day_type} must sum to 1.0 "
                f"(got {total_percentage})"
            )

_validate_time_slots()

def _system_uses_slot_profile(system_name: str) -> bool:
    """
    Determines if any component of the system uses slot distribution.
    """

    config = SYSTEMS_CONFIG.get(system_name)

    if not config:
        return False

    components = config.get("components", {})

    for component in components.values():
        if component.get("slot_distribution", False):
            return True

    return False

def get_day_type(timestamp: datetime.datetime) -> str:

    if not isinstance(timestamp, datetime.datetime):
        raise SimulationError(
            "timestamp must be a datetime.datetime instance"
        )

    weekday = timestamp.weekday()

    if weekday < 5:
        return "mon_fri"
    elif weekday == 5:
        return "saturday"
    else:
        return "sunday"

def get_slot_factor(
    system_name: str,
    timestamp: datetime.datetime,
) -> float | None:

    if not isinstance(timestamp, datetime.datetime):
        raise SimulationError(
            "timestamp must be a datetime.datetime instance"
        )

    if not _system_uses_slot_profile(system_name):
        return None

    day_type = get_day_type(timestamp)

    if day_type not in TIME_SLOTS:
        raise SimulationError(
            f"Invalid day type configuration: {day_type}"
        )

    current_hour = timestamp.hour
    slots = TIME_SLOTS[day_type]

    for slot in slots:

        if slot["start"] <= current_hour < slot["end"]:

            hours_in_slot = slot["end"] - slot["start"]

            if hours_in_slot <= 0:
                raise SimulationError(
                    f"Invalid slot configuration: {slot}"
                )

            return slot["percentage"] / hours_in_slot

    raise SimulationError(
        f"No time slot matched for hour {current_hour} "
        f"on day type {day_type}"
    )