

"""
SystemCalculator Service

Calculates energy consumption for systems and their components.

Handles:
- Per-system and per-component calculations
- Voltage-based scaling
- Duration-based consumption using slot factors
- Zero-voltage scenarios (grid outage or zero event)

Design principles
-----------------
- Deterministic calculations
- Strict configuration validation
- Explicit error handling
- Support for both aggregated and component-level queries
"""

import datetime
from typing import Dict, Union, Tuple
from domain_config.systems_config import SYSTEMS_CONFIG
from electrical.consumption_slots import get_slot_factor
from core.exceptions import ConfigurationError

class SystemCalculator:

    COMPONENT_SEPARATOR = " - "

    @staticmethod
    def calculate(
        system_name: str,
        voltage_120v: float,
        voltage_240v: float,
        timestamp: datetime.datetime,
    ) -> Union[float, Dict[str, float]]:

        SystemCalculator._validate_inputs(system_name, timestamp)

        try:

            system, component = SystemCalculator._parse_system_name(system_name)

            if component is not None:
                config = SYSTEMS_CONFIG[system]["components"][component]

                return SystemCalculator._calculate_component(
                    config,
                    system,
                    component,
                    voltage_120v,
                    voltage_240v,
                    timestamp,
                )

            components_config = SYSTEMS_CONFIG[system]["components"]

        except KeyError:
            raise ConfigurationError(
                f"Invalid system or component name: '{system_name}'"
            )

        if len(components_config) > 1:

            results: Dict[str, float] = {}

            for component_name, component_config in components_config.items():

                results[component_name] = SystemCalculator._calculate_component(
                    component_config,
                    system,
                    component_name,
                    voltage_120v,
                    voltage_240v,
                    timestamp,
                )

            return results

        component_name, component_config = next(iter(components_config.items()))

        return SystemCalculator._calculate_component(
            component_config,
            system,
            component_name,
            voltage_120v,
            voltage_240v,
            timestamp,
        )

    @staticmethod
    def _calculate_component(
        config: dict,
        system_name: str,
        component_name: str,
        voltage_120v: float,
        voltage_240v: float,
        timestamp: datetime.datetime,
    ) -> float:

        nominal_power = config.get("nominal_consumption_kwh")

        if nominal_power is None:
            raise ConfigurationError(
                f"{system_name}.{component_name} missing nominal_consumption_kwh"
            )

        nominal_voltage = config.get("voltage")

        if not isinstance(nominal_voltage, int) or nominal_voltage <= 0:
            raise ConfigurationError(
                f"{system_name}.{component_name} invalid nominal voltage"
            )

        applied_voltage = (
            voltage_240v if nominal_voltage == 240 else voltage_120v
        )

        if applied_voltage <= 0:
            return 0.0

        if "duration_hours" in config:

            duration_hours = config["duration_hours"]

            if duration_hours <= 0:
                raise ConfigurationError(
                    f"{system_name}.{component_name} has invalid duration_hours={duration_hours}. Must be > 0."
                )

            equivalent_daily_hours = duration_hours * 24
            daily_energy = nominal_power * equivalent_daily_hours

            slot_factor = get_slot_factor(system_name, timestamp)

            if slot_factor is None:
                raise ConfigurationError(
                    f"Missing consumption slot for {system_name}.{component_name} at {timestamp}"
                )

            return daily_energy * (applied_voltage / nominal_voltage) * slot_factor

        return nominal_power * (applied_voltage / nominal_voltage)

    @staticmethod
    def _parse_system_name(system_name: str) -> Tuple[str, str | None]:

        if SystemCalculator.COMPONENT_SEPARATOR not in system_name:
            return system_name, None

        parent_name, component_name = system_name.split(
            SystemCalculator.COMPONENT_SEPARATOR,
            1,
        )

        return parent_name, component_name

    @staticmethod
    def _validate_inputs(system_name: str, timestamp: datetime.datetime) -> None:

        if not isinstance(system_name, str) or not system_name.strip():
            raise ConfigurationError("system_name must be a non-empty string")

        if not isinstance(timestamp, datetime.datetime):
            raise ConfigurationError("timestamp must be a datetime object")
