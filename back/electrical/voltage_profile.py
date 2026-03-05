

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

class VoltageProfile:
    def __init__(self) -> None:
        self.profile_120v: Dict[int, float] = {}
        self.profile_240v: Dict[int, float] = {}
        self.quality_flags: Dict[int, str] = {}

        self.current_month: Optional[Tuple[int, int]] = None

        self.outage_start: Optional[datetime.datetime] = None
        self.outage_end: Optional[datetime.datetime] = None

        self.brownout_start: Optional[datetime.datetime] = None
        self.brownout_end: Optional[datetime.datetime] = None

        self.severe_brownout_start: Optional[datetime.datetime] = None
        self.severe_brownout_end: Optional[datetime.datetime] = None

        self.overvolt_start: Optional[datetime.datetime] = None
        self.overvolt_end: Optional[datetime.datetime] = None

        self.severe_overvolt_start: Optional[datetime.datetime] = None
        self.severe_overvolt_end: Optional[datetime.datetime] = None

    def overlaps_any_event(self, start: datetime.datetime, end: datetime.datetime) -> bool:
        events = [
            (self.outage_start, self.outage_end),
            (self.brownout_start, self.brownout_end),
            (self.severe_brownout_start, self.severe_brownout_end),
            (self.overvolt_start, self.overvolt_end),
            (self.severe_overvolt_start, self.severe_overvolt_end),
        ]
        for ev_start, ev_end in events:
            if ev_start and ev_end and start < ev_end and end > ev_start:
                return True
        return False

    @staticmethod
    def is_in_range(ts: datetime.datetime, start: Optional[datetime.datetime], end: Optional[datetime.datetime]) -> bool:
        return start is not None and end is not None and start <= ts < end

    def reset_month_if_needed(self, simulation_date: datetime.date) -> None:
        if not isinstance(simulation_date, datetime.date):
            raise SimulationError("simulation_date must be a datetime.date instance")

        month_key: Tuple[int, int] = (simulation_date.year, simulation_date.month)
        if self.current_month != month_key:
            self.current_month = month_key
            self.outage_start = self.outage_end = None
            self.brownout_start = self.brownout_end = None
            self.severe_brownout_start = self.severe_brownout_end = None
            self.overvolt_start = self.overvolt_end = None
            self.severe_overvolt_start = self.severe_overvolt_end = None

    def generate_event_once(self) -> Tuple[datetime.datetime, datetime.datetime]:
        if not self.current_month:
            raise SimulationError("Month context not initialized before generating events")

        for _ in range(10):
            day = random.randint(*EVENT_DAY_RANGE)
            hour = random.randint(*EVENT_HOUR_RANGE)
            duration = random.randint(*EVENT_DURATION_RANGE)

            start = datetime.datetime(self.current_month[0], self.current_month[1], day, hour)
            end = start + datetime.timedelta(hours=duration)

            if not self.overlaps_any_event(start, end):
                return start, end

        return start, end

    def generate_monthly_events_if_needed(self) -> None:
        if not self.current_month:
            raise SimulationError("Month context not initialized before generating monthly events")

        if not self.outage_start:
            self.outage_start, self.outage_end = self.generate_event_once()
        if not self.severe_brownout_start:
            self.severe_brownout_start, self.severe_brownout_end = self.generate_event_once()
        if not self.brownout_start:
            self.brownout_start, self.brownout_end = self.generate_event_once()
        if not self.severe_overvolt_start:
            self.severe_overvolt_start, self.severe_overvolt_end = self.generate_event_once()
        if not self.overvolt_start:
            self.overvolt_start, self.overvolt_end = self.generate_event_once()

    def generate_daily_profile(self, simulation_date: datetime.date) -> None:
        if not isinstance(simulation_date, datetime.date):
            raise SimulationError("simulation_date must be a datetime.date instance")

        self.reset_month_if_needed(simulation_date)
        self.generate_monthly_events_if_needed()

        self.profile_120v.clear()
        self.profile_240v.clear()
        self.quality_flags.clear()

        for hour in range(24):
            timestamp = datetime.datetime.combine(simulation_date, datetime.time(hour=hour))

            if self.is_in_range(timestamp, self.outage_start, self.outage_end):
                self.profile_120v[hour] = 0.0
                self.profile_240v[hour] = 0.0
                self.quality_flags[hour] = "grid_outage"

            elif self.is_in_range(timestamp, self.severe_brownout_start, self.severe_brownout_end):
                deviation = random.uniform(SEVERE_BROWNOUT_MIN_120V / NOMINAL_120V, SEVERE_BROWNOUT_MAX_120V / NOMINAL_120V)
                self.profile_120v[hour] = NOMINAL_120V * deviation
                self.profile_240v[hour] = NOMINAL_240V * deviation
                self.quality_flags[hour] = "brownout_severe"

            elif self.is_in_range(timestamp, self.brownout_start, self.brownout_end):
                deviation = random.uniform(BROWNOUT_MIN_120V / NOMINAL_120V, BROWNOUT_MAX_120V / NOMINAL_120V)
                self.profile_120v[hour] = NOMINAL_120V * deviation
                self.profile_240v[hour] = NOMINAL_240V * deviation
                self.quality_flags[hour] = "brownout"

            elif self.is_in_range(timestamp, self.severe_overvolt_start, self.severe_overvolt_end):
                deviation = random.uniform(SEVERE_OVERVOLT_MIN_120V / NOMINAL_120V, SEVERE_OVERVOLT_MAX_120V / NOMINAL_120V)
                self.profile_120v[hour] = NOMINAL_120V * deviation
                self.profile_240v[hour] = NOMINAL_240V * deviation
                self.quality_flags[hour] = "overvoltage_severe"

            elif self.is_in_range(timestamp, self.overvolt_start, self.overvolt_end):
                deviation = random.uniform(OVERVOLT_MIN_120V / NOMINAL_120V, OVERVOLT_MAX_120V / NOMINAL_120V)
                self.profile_120v[hour] = NOMINAL_120V * deviation
                self.profile_240v[hour] = NOMINAL_240V * deviation
                self.quality_flags[hour] = "overvoltage"

            else:
                deviation = random.uniform(MIN_120V / NOMINAL_120V, MAX_120V / NOMINAL_120V)
                self.profile_120v[hour] = NOMINAL_120V * deviation
                self.profile_240v[hour] = NOMINAL_240V * deviation
                self.quality_flags[hour] = "normal"

    def get_voltage_120v(self, hour: int) -> float:
        if hour not in self.profile_120v:
            raise SimulationError(f"Voltage 120V for hour {hour} not generated")
        return self.profile_120v[hour]

    def get_voltage_240v(self, hour: int) -> float:
        if hour not in self.profile_240v:
            raise SimulationError(f"Voltage 240V for hour {hour} not generated")
        return self.profile_240v[hour]

    def get_quality_flag(self, hour: int) -> str:
        if hour not in self.quality_flags:
            raise SimulationError(f"Quality flag for hour {hour} not generated")
        return self.quality_flags[hour]
