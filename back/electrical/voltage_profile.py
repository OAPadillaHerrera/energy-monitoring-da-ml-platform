

"""
Voltage Profile Simulation Engine

Generates synthetic hourly voltage profiles (120V / 240V) including:
- Normal operation
- Grid outage
- Brownout (mild / severe)
- Overvoltage (mild / severe)

Design notes:
- Events are generated once per month.
- Daily endpoint may repeat events within the same month (acceptable by design).
- Range endpoint is authoritative for dataset generation (DA/ML-ready).
- No persistence logic.
"""

import random
import datetime
from typing import Dict, Optional, Tuple
from core.exceptions import SimulationError

NOMINAL_120V = 120.0
NOMINAL_240V = 240.0

MIN_120V = 114
MAX_120V = 126

MIN_240V = 228
MAX_240V = 252

BROWNOUT_MIN_120V = 108
BROWNOUT_MAX_120V = 113.5

BROWNOUT_MIN_240V = 216
BROWNOUT_MAX_240V = 227

SEVERE_BROWNOUT_MIN_120V = 95
SEVERE_BROWNOUT_MAX_120V = 107.9

SEVERE_BROWNOUT_MIN_240V = 190
SEVERE_BROWNOUT_MAX_240V = 215.9

OVERVOLT_MIN_120V = 126.1
OVERVOLT_MAX_120V = 132.0

OVERVOLT_MIN_240V = 252.1
OVERVOLT_MAX_240V = 264.0

SEVERE_OVERVOLT_MIN_120V = 132.1
SEVERE_OVERVOLT_MAX_120V = 140.0

SEVERE_OVERVOLT_MIN_240V = 264.1
SEVERE_OVERVOLT_MAX_240V = 280.0

EVENT_DAY_RANGE: Tuple[int, int] = (1, 28)
EVENT_HOUR_RANGE: Tuple[int, int] = (0, 23)
EVENT_DURATION_RANGE: Tuple[int, int] = (1, 24)

EVENT_TYPES = (
    "outage",
    "severe_brownout",
    "brownout",
    "severe_overvolt",
    "overvolt",
)

class VoltageProfile:

    def __init__(self) -> None:

        self.profile_120v: Dict[int, float] = {}
        self.profile_240v: Dict[int, float] = {}
        self.quality_flags: Dict[int, str] = {}

        self.current_month: Optional[Tuple[int, int]] = None

        self.events: Dict[str, Tuple[Optional[datetime.datetime], Optional[datetime.datetime]]] = {
            event: (None, None) for event in EVENT_TYPES
        }

    def overlaps_any_event(
        self,
        start: datetime.datetime,
        end: datetime.datetime,
    ) -> bool:

        for ev_start, ev_end in self.events.values():

            if ev_start and ev_end and start < ev_end and end > ev_start:
                return True

        return False

    @staticmethod
    def is_in_range(
        ts: datetime.datetime,
        start: Optional[datetime.datetime],
        end: Optional[datetime.datetime],
    ) -> bool:

        return start is not None and end is not None and start <= ts < end

    def reset_month_if_needed(self, simulation_date: datetime.date) -> None:

        if not isinstance(simulation_date, datetime.date):
            raise SimulationError("simulation_date must be a datetime.date instance")

        month_key = (simulation_date.year, simulation_date.month)

        if self.current_month != month_key:

            self.current_month = month_key
            self.events = {event: (None, None) for event in EVENT_TYPES}

    def generate_event_once(self) -> Tuple[datetime.datetime, datetime.datetime]:

        if not self.current_month:
            raise SimulationError(
                "Month context not initialized before generating events"
            )

        for _ in range(10):

            day = random.randint(*EVENT_DAY_RANGE)
            hour = random.randint(*EVENT_HOUR_RANGE)
            duration = random.randint(*EVENT_DURATION_RANGE)

            start = datetime.datetime(
                self.current_month[0],
                self.current_month[1],
                day,
                hour,
            )

            end = start + datetime.timedelta(hours=duration)

            if not self.overlaps_any_event(start, end):
                return start, end

        raise SimulationError(
            "Unable to generate non-overlapping voltage event after multiple attempts"
        )

    def generate_monthly_events_if_needed(self) -> None:

        if not self.current_month:
            raise SimulationError(
                "Month context not initialized before generating monthly events"
            )

        for event_type in EVENT_TYPES:

            start, _ = self.events[event_type]

            if start is None:

                new_start, new_end = self.generate_event_once()
                self.events[event_type] = (new_start, new_end)

    def generate_daily_profile(self, simulation_date: datetime.date) -> None:

        if not isinstance(simulation_date, datetime.date):
            raise SimulationError("simulation_date must be a datetime.date instance")

        self.reset_month_if_needed(simulation_date)
        self.generate_monthly_events_if_needed()

        self.profile_120v.clear()
        self.profile_240v.clear()
        self.quality_flags.clear()

        for hour in range(24):

            timestamp = datetime.datetime.combine(
                simulation_date,
                datetime.time(hour=hour),
            )

            voltage_120v, voltage_240v, flag = self._compute_voltage(timestamp)

            self.profile_120v[hour] = voltage_120v
            self.profile_240v[hour] = voltage_240v
            self.quality_flags[hour] = flag

    def _compute_voltage(
        self,
        timestamp: datetime.datetime,
    ) -> Tuple[float, float, str]:

        outage_start, outage_end = self.events["outage"]

        if self.is_in_range(timestamp, outage_start, outage_end):
            return 0.0, 0.0, "grid_outage"

        severe_brownout_start, severe_brownout_end = self.events["severe_brownout"]

        if self.is_in_range(timestamp, severe_brownout_start, severe_brownout_end):

            deviation = random.uniform(
                SEVERE_BROWNOUT_MIN_120V / NOMINAL_120V,
                SEVERE_BROWNOUT_MAX_120V / NOMINAL_120V,
            )

            return (
                NOMINAL_120V * deviation,
                NOMINAL_240V * deviation,
                "brownout_severe",
            )

        brownout_start, brownout_end = self.events["brownout"]

        if self.is_in_range(timestamp, brownout_start, brownout_end):

            deviation = random.uniform(
                BROWNOUT_MIN_120V / NOMINAL_120V,
                BROWNOUT_MAX_120V / NOMINAL_120V,
            )

            return (
                NOMINAL_120V * deviation,
                NOMINAL_240V * deviation,
                "brownout",
            )

        severe_overvolt_start, severe_overvolt_end = self.events["severe_overvolt"]

        if self.is_in_range(timestamp, severe_overvolt_start, severe_overvolt_end):

            deviation = random.uniform(
                SEVERE_OVERVOLT_MIN_120V / NOMINAL_120V,
                SEVERE_OVERVOLT_MAX_120V / NOMINAL_120V,
            )

            return (
                NOMINAL_120V * deviation,
                NOMINAL_240V * deviation,
                "overvoltage_severe",
            )

        overvolt_start, overvolt_end = self.events["overvolt"]

        if self.is_in_range(timestamp, overvolt_start, overvolt_end):

            deviation = random.uniform(
                OVERVOLT_MIN_120V / NOMINAL_120V,
                OVERVOLT_MAX_120V / NOMINAL_120V,
            )

            return (
                NOMINAL_120V * deviation,
                NOMINAL_240V * deviation,
                "overvoltage",
            )

        deviation = random.uniform(
            MIN_120V / NOMINAL_120V,
            MAX_120V / NOMINAL_120V,
        )

        return (
            NOMINAL_120V * deviation,
            NOMINAL_240V * deviation,
            "normal",
        )

    def _get_profile_value(self, profile: Dict, hour: int, label: str):
        if hour not in profile:
            raise SimulationError(f"{label} for hour {hour} not generated")
        return profile[hour]

    def get_voltage_120v(self, hour: int) -> float:
        return self._get_profile_value(self.profile_120v, hour, "Voltage 120V")

    def get_voltage_240v(self, hour: int) -> float:
        return self._get_profile_value(self.profile_240v, hour, "Voltage 240V")

    def get_quality_flag(self, hour: int) -> str:
        return self._get_profile_value(self.quality_flags, hour, "Quality flag")

    @property
    def outage_start(self):
        return self.events["outage"][0]

    @property
    def outage_end(self):
        return self.events["outage"][1]

    @property
    def brownout_start(self):
        return self.events["brownout"][0]

    @property
    def brownout_end(self):
        return self.events["brownout"][1]

    @property
    def severe_brownout_start(self):
        return self.events["severe_brownout"][0]

    @property
    def severe_brownout_end(self):
        return self.events["severe_brownout"][1]

    @property
    def overvolt_start(self):
        return self.events["overvolt"][0]

    @property
    def overvolt_end(self):
        return self.events["overvolt"][1]

    @property
    def severe_overvolt_start(self):
        return self.events["severe_overvolt"][0]

    @property
    def severe_overvolt_end(self):
        return self.events["severe_overvolt"][1]