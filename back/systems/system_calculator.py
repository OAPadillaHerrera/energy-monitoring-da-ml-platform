

"""
SystemCalculator Service

Calculates energy consumption for systems and their components,
handling outages and zero-consumption events (voltages may be zero).

Design notes:
- Handles per-component and per-system calculation.
- Accounts for slot-based consumption if duration_hours is defined.
- Robust against zero voltage (system down).
- Raises ConfigurationError for invalid configurations.
"""

import datetime
from typing import Dict, Union
from domain_config.systems_config import SYSTEMS_CONFIG
from electrical.consumption_slots import get_slot_factor
from core.exceptions import ConfigurationError

class SystemCalculator:

    @staticmethod
    def calculate(
        system_name: str,
        voltage_120v: float,
        voltage_240v: float,
        timestamp: datetime.datetime
    ) -> Union[float, Dict[str, float]]:

        if not isinstance(system_name, str) or not system_name:
            raise ConfigurationError("system_name must be a non-empty string")

        if not isinstance(timestamp, datetime.datetime):
            raise ConfigurationError("timestamp must be a datetime object")

        try:

            if " - " in system_name:
                parent_name, component_name = system_name.split(" - ", 1)
                config = SYSTEMS_CONFIG[parent_name]["components"][component_name]

                return SystemCalculator._calculate_single(
                    config,
                    parent_name,
                    component_name,
                    voltage_120v,
                    voltage_240v,
                    timestamp,
                )

            components_config = SYSTEMS_CONFIG[system_name]["components"]

        except KeyError:
            raise ConfigurationError(
                f"Invalid system or component name: '{system_name}'"
            )

        if len(components_config) > 1:
            results: Dict[str, float] = {}
            for component_name, component_config in components_config.items():
                results[component_name] = SystemCalculator._calculate_single(
                    component_config,
                    system_name,
                    component_name,
                    voltage_120v,
                    voltage_240v,
                    timestamp,
                )
            return results

        component_name, component_config = next(iter(components_config.items()))

        return SystemCalculator._calculate_single(
            component_config,
            system_name,
            component_name,
            voltage_120v,
            voltage_240v,
            timestamp,
        )

    @staticmethod
    def _calculate_single(
        config: dict,
        parent_name: str,
        component_name: str,
        voltage_120v: float,
        voltage_240v: float,
        timestamp: datetime.datetime,
    ) -> float:

        if "nominal_consumption_kwh" not in config:
            raise ConfigurationError(
                f"{parent_name}.{component_name} missing nominal_consumption_kwh"
            )

        nominal_power: float = config["nominal_consumption_kwh"]
        nominal_voltage: int = config["voltage"]

        if nominal_voltage <= 0:
            raise ConfigurationError(
                f"{parent_name}.{component_name} invalid nominal voltage"
            )

        applied_voltage: float = voltage_240v if nominal_voltage == 240 else voltage_120v

        if applied_voltage <= 0:
            return 0.0

        if "duration_hours" in config:
            duration_hours = config["duration_hours"]

            if duration_hours <= 0:
                raise ConfigurationError(
                    f"{parent_name}.{component_name} has invalid duration_hours={duration_hours}. Must be > 0."
                )

            equivalent_daily_hours: float = duration_hours * 24
            daily_energy: float = nominal_power * equivalent_daily_hours

            slot_factor = get_slot_factor(parent_name, timestamp)

            if slot_factor is None:
                raise ConfigurationError(
                    f"Missing consumption slot for {parent_name}.{component_name} at {timestamp}"
                )

            return daily_energy * (applied_voltage / nominal_voltage) * slot_factor

        return nominal_power * (applied_voltage / nominal_voltage)