

"""
Simulation Application Layer

This module orchestrates daily and range energy simulations.
It coordinates domain services, repositories, and data persistence.
"""

import datetime
import time
from typing import Dict, List, Tuple

from services.simulation_service import (
    generate_daily_simulation,
    generate_range_simulation
)

from repositories.system_repository import get_systems_map
from repositories.consumption_repository import (
    insert_hourly_consumption,
    get_latest_consumption_date
)

from repositories.voltage_repository import insert_hourly_voltage_bulk
from repositories.system_events_repository import insert_system_events
from services.daily_consumption_service import build_daily_consumption_records
from electrical.voltage_profile import VoltageProfile
from electrical.zero_consumption_events import MonthlyZeroConsumptionEvent
from core.exceptions import SimulationError

def _create_simulation_context() -> Tuple[VoltageProfile, MonthlyZeroConsumptionEvent]:
   
    return VoltageProfile(), MonthlyZeroConsumptionEvent()

def _get_next_simulation_date() -> datetime.date:
   
    today = datetime.date.today()
    latest_date = get_latest_consumption_date()

    return (
        latest_date + datetime.timedelta(days=1)
        if latest_date
        else today
    )

def _build_hourly_records(
    daily_data: List[Tuple[str, float, datetime.datetime]],
    systems_map: Dict[str, int]
) -> List[Tuple[int, datetime.datetime, float]]:

    hourly_records: List[Tuple[int, datetime.datetime, float]] = []

    for system_name, consumption, timestamp in daily_data:

        system_id = systems_map.get(system_name)

        if system_id is None:
            continue

        hourly_records.append(
            (system_id, timestamp, consumption)
        )

    return hourly_records

def run_daily_simulation() -> Dict:

    voltage_profile, zero_event = _create_simulation_context()
    systems_map = get_systems_map()

    simulation_date = _get_next_simulation_date()

    daily_data, voltage_records, event_records = generate_daily_simulation(
        simulation_date,
        voltage_profile,
        zero_event,
        systems_map
    )

    if voltage_records:
        insert_hourly_voltage_bulk(voltage_records)

    if event_records:
        insert_system_events(event_records)

    hourly_records = _build_hourly_records(daily_data, systems_map)

    insert_hourly_consumption(hourly_records)

    daily_records = build_daily_consumption_records(hourly_records)

    return {
        "status": "ok",
        "simulation_date": simulation_date.isoformat(),
        "hours_generated": 24,
        "hourly_records_inserted": len(hourly_records),
        "daily_records_inserted": len(daily_records)
    }

def run_range_simulation(
    start_date: datetime.date,
    end_date: datetime.date
) -> Dict:

    if start_date > end_date:
        raise SimulationError("start_date cannot be after end_date.")

    start_total = time.time()

    voltage_profile, zero_event = _create_simulation_context()
    systems_map = get_systems_map()

    latest_date = get_latest_consumption_date()

    first_missing_date = (
        latest_date + datetime.timedelta(days=1)
        if latest_date
        else start_date
    )

    effective_start = max(start_date, first_missing_date)

    if effective_start > end_date:
        return {
            "status": "ok",
            "message": "No new days generated.",
            "hourly_records_inserted": 0,
            "daily_records_inserted": 0
        }

    start_sim = time.time()

    result = generate_range_simulation(
        effective_start,
        end_date,
        voltage_profile,
        zero_event,
        systems_map
    )

    end_sim = time.time()

    if result["voltage_records"]:
        insert_hourly_voltage_bulk(result["voltage_records"])

    if result["event_records"]:
        insert_system_events(result["event_records"])

    all_hourly_consumption = _build_hourly_records(
        result["hourly_data"],
        systems_map
    )

    start_insert = time.time()

    insert_hourly_consumption(all_hourly_consumption)

    end_insert = time.time()

    all_daily_records = build_daily_consumption_records(all_hourly_consumption)

    end_total = time.time()

    return {
        "status": "ok",
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "effective_start_date": effective_start.isoformat(),
        "hourly_records_inserted": len(all_hourly_consumption),
        "daily_records_inserted": len(all_daily_records),
        "simulation_time_seconds": round(end_sim - start_sim, 4),
        "insert_time_seconds": round(end_insert - start_insert, 4),
        "total_time_seconds": round(end_total - start_total, 4)
    }