

"""
Monthly Zero Consumption Event Engine

Generates a single synthetic zero-consumption event per month
for one eligible system, constrained by:

- Working schedule
- Voltage events
- Maximum 28-day month model

Design notes:
- One event per month maximum.
- No persistence logic.
- Simulation-only module.

This module is intentionally minimal and stable.
"""

import random
import datetime
from schedules.schedule_service import ScheduleService
from domain_config.working_schedules import WORKING_SCHEDULES
from electrical.voltage_profile import VoltageProfile
from core.exceptions import SimulationError

EXCLUDED_SYSTEMS = {
    "submersible_pump_system",
    "fuel_dispenser_system",
}

DURATION_BY_SCHEDULE = {
    "24_7": (1, 2),
    "nighttime": (1, 2),
    "office_hours": (1, 2),
    "coffee_machine": (1, 1),
}

class MonthlyZeroConsumptionEvent:

    EVENT_TYPE = "monthly_zero_consumption"

    def __init__(self) -> None:
        self.current_month: tuple[int, int] | None = None
        self.system_name: str | None = None
        self.start: datetime.datetime | None = None
        self.end: datetime.datetime | None = None

    def reset_month_if_needed(self, simulation_date: datetime.date) -> None:

        if not isinstance(simulation_date, datetime.date):
            raise SimulationError("simulation_date must be a datetime.date instance")

        month_key = (simulation_date.year, simulation_date.month)

        if self.current_month != month_key:
            self.current_month = month_key
            self.system_name = None
            self.start = None
            self.end = None

    def _build_active_timestamps_for_month(
        self,
        year: int,
        month: int,
        schedule_name: str,
    ) -> list[datetime.datetime]:

        if schedule_name not in WORKING_SCHEDULES:
            raise SimulationError(f"Unknown schedule: {schedule_name}")

        schedule = WORKING_SCHEDULES[schedule_name]
        active_days = set(schedule["days"])
        active_hours = set(schedule["hours"])

        timestamps: list[datetime.datetime] = []

        try:
            for day in range(1, 29):
                for hour in range(24):
                    ts = datetime.datetime(year, month, day, hour)
                    if ts.weekday() in active_days and ts.hour in active_hours:
                        timestamps.append(ts)
        except Exception as e:
            raise SimulationError(
                "Failed building active timestamps for schedule"
            ) from e

        return timestamps

    def _is_range_within_schedule(
        self,
        start: datetime.datetime,
        end: datetime.datetime,
        schedule_name: str,
    ) -> bool:

        if schedule_name not in WORKING_SCHEDULES:
            raise SimulationError(f"Unknown schedule: {schedule_name}")

        schedule = WORKING_SCHEDULES[schedule_name]
        active_days = set(schedule["days"])
        active_hours = set(schedule["hours"])

        ts = start
        while ts < end:
            if ts.weekday() not in active_days or ts.hour not in active_hours:
                return False
            ts += datetime.timedelta(hours=1)

        return True

    def _overlaps_voltage_events(
        self,
        voltage_profile: VoltageProfile,
        start: datetime.datetime,
        end: datetime.datetime,
    ) -> bool:

        if not isinstance(voltage_profile, VoltageProfile):
            raise SimulationError("voltage_profile must be a VoltageProfile instance")

        events = [
            (voltage_profile.outage_start, voltage_profile.outage_end),
            (voltage_profile.brownout_start, voltage_profile.brownout_end),
            (voltage_profile.severe_brownout_start, voltage_profile.severe_brownout_end),
            (voltage_profile.overvolt_start, voltage_profile.overvolt_end),
            (voltage_profile.severe_overvolt_start, voltage_profile.severe_overvolt_end),
        ]

        for ev_start, ev_end in events:
            if ev_start and ev_end:
                if start < ev_end and end > ev_start:
                    return True

        return False

    def _build_candidates(self) -> list[tuple[str, str]]:

        try:
            system_names = ScheduleService.get_all_system_names()
        except Exception as e:
            raise SimulationError(
                "Failed retrieving system names from ScheduleService"
            ) from e

        candidates: list[tuple[str, str]] = []

        for system_name in system_names:
            if system_name in EXCLUDED_SYSTEMS:
                continue

            try:
                schedule_name = ScheduleService.get_schedule_for_system_name(system_name)
            except Exception as e:
                raise SimulationError(
                    f"Failed retrieving schedule for system: {system_name}"
                ) from e

            candidates.append((system_name, schedule_name))

        return candidates

    def generate_monthly_event_if_needed(
        self,
        simulation_date: datetime.date,
        voltage_profile: VoltageProfile,
    ) -> None:

        if not isinstance(simulation_date, datetime.date):
            raise SimulationError("simulation_date must be a datetime.date instance")

        if not isinstance(voltage_profile, VoltageProfile):
            raise SimulationError("voltage_profile must be a VoltageProfile instance")

        self.reset_month_if_needed(simulation_date)

        if self.start and self.end and self.system_name:
            return

        year = simulation_date.year
        month = simulation_date.month

        candidates = self._build_candidates()

        if not candidates:
            raise SimulationError("No eligible systems available for zero consumption event")

        for _ in range(200):

            chosen_system, schedule_name = random.choice(candidates)

            active_ts = self._build_active_timestamps_for_month(
                year,
                month,
                schedule_name,
            )

            if not active_ts:
                continue

            start = random.choice(active_ts)

            duration_range = DURATION_BY_SCHEDULE.get(schedule_name, (1, 2))
            duration_hours = random.randint(
                duration_range[0],
                duration_range[1],
            )

            end = start + datetime.timedelta(hours=duration_hours)

            if end.day > 28:
                continue

            if not self._is_range_within_schedule(start, end, schedule_name):
                continue

            if self._overlaps_voltage_events(voltage_profile, start, end):
                continue

            self.system_name = chosen_system
            self.start = start
            self.end = end
            return

        raise SimulationError(
            "Unable to generate valid zero-consumption event after 200 attempts"
        )

    def is_system_down(
        self,
        system_name: str,
        timestamp: datetime.datetime,
    ) -> bool:

        if not isinstance(timestamp, datetime.datetime):
            raise SimulationError("timestamp must be a datetime.datetime instance")

        if not self.system_name or not self.start or not self.end:
            return False

        if system_name != self.system_name:
            return False

        return self.start <= timestamp < self.end

    def get_event_timestamps(self) -> list[datetime.datetime]:

        if not self.start or not self.end:
            return []

        timestamps: list[datetime.datetime] = []
        ts = self.start

        while ts < self.end:
            timestamps.append(ts)
            ts += datetime.timedelta(hours=1)

        return timestamps