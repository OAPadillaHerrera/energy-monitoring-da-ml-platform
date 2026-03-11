

"""
Systems Configuration

Defines the static configuration of all electrical systems and their components.

This module acts as the domain definition layer for:
- SystemCalculator
- ScheduleService

Design principles
-----------------
- Configuration is declarative and validated at import time.
- Nominal consumption values represent TOTAL hourly consumption per component.
- The `units` field is informational only and does NOT affect energy calculations.
- Systems may optionally define duration-based behavior via `duration_hours`.

Validation ensures that configuration errors are detected early during
application startup rather than at runtime.
"""

from typing import Dict, Mapping, TypedDict, Final
from types import MappingProxyType
from core.exceptions import ConfigurationError

VOLTAGE_120V: Final = 120
VOLTAGE_240V: Final = 240

class ComponentConfig(TypedDict, total=False):
    description: str
    units: int
    nominal_consumption_kwh: float
    schedule: str
    voltage: int
    duration_hours: float
    slot_distribution: bool

class SystemConfig(TypedDict):
    components: Dict[str, ComponentConfig]

SYSTEMS_CONFIG: Final[Mapping[str, SystemConfig]] = MappingProxyType({

    "price_display_system": {
        "components": {
            "price_display_modules": {
                "description": "LED price display modules",
                "nominal_consumption_kwh": 2.04,
                "schedule": "24_7",
                "voltage": VOLTAGE_120V,
            }
        }
    },

    "corporate_lighting_system": {
        "components": {
            "corporate_signage": {
                "description": "LED signage and corporate logo",
                "nominal_consumption_kwh": 0.84,
                "schedule": "nighttime",
                "voltage": VOLTAGE_120V,
            }
        }
    },

    "canopy_lighting_system": {
        "components": {
            "canopy_lamps": {
                "description": "27 canopy lamps",
                "units": 27,
                "nominal_consumption_kwh": 2.052,
                "schedule": "nighttime",
                "voltage": VOLTAGE_120V,
            }
        }
    },

    "perimeter_lighting_system": {
        "components": {
            "perimeter_luminaires": {
                "description": "5 perimeter luminaires",
                "units": 5,
                "nominal_consumption_kwh": 0.275,
                "schedule": "nighttime",
                "voltage": VOLTAGE_120V,
            }
        }
    },

    "office_and_general_services": {
        "components": {
            "office_services": {
                "description": "Office equipment and general services",
                "nominal_consumption_kwh": 1.1,
                "schedule": "office_hours",
                "voltage": VOLTAGE_120V,
            }
        }
    },

    "submersible_pump_system": {
        "components": {
            "pumps": {
                "description": "3 submersible pumps",
                "units": 3,
                "nominal_consumption_kwh": 0.577,
                "schedule": "24_7",
                "duration_hours": 2.04 / 24,
                "slot_distribution": True,
                "voltage": VOLTAGE_240V,
            }
        }
    },

    "fuel_dispenser_system": {
        "components": {
            "dispensers": {
                "description": "5 fuel dispensers",
                "units": 5,
                "nominal_consumption_kwh": 0.0275,
                "schedule": "24_7",
                "duration_hours": 2.05 / 24,
                "slot_distribution": True,
                "voltage": VOLTAGE_240V,
            }
        }
    },

    "air_conditioning_system": {
        "components": {
            "server_room": {
                "description": "Server room air conditioning",
                "nominal_consumption_kwh": 0.09183,
                "schedule": "24_7",
                "voltage": VOLTAGE_120V,
            },
            "office_area": {
                "description": "Office area air conditioning",
                "nominal_consumption_kwh": 0.09183,
                "schedule": "office_hours",
                "voltage": VOLTAGE_120V,
            },
        }
    },

    "customer_service_kiosk_system": {
        "components": {
            "refrigeration": {
                "description": "3 beverage coolers",
                "units": 3,
                "nominal_consumption_kwh": 0.125,
                "schedule": "24_7",
                "voltage": VOLTAGE_120V,
            },
            "coffee_machine": {
                "description": "Coffee machine",
                "nominal_consumption_kwh": 0.5,
                "schedule": "coffee_machine",
                "voltage": VOLTAGE_120V,
            },
        }
    },
})

def _validate_nominal_consumption(system: str, component: str, value: float) -> None:
    if not isinstance(value, (int, float)) or value <= 0:
        raise ConfigurationError(
            f"{system}.{component} nominal_consumption_kwh must be > 0"
        )

def _validate_voltage(system: str, component: str, value: int) -> None:
    if not isinstance(value, int) or value <= 0:
        raise ConfigurationError(
            f"{system}.{component} voltage must be a positive integer"
        )

def _validate_schedule(system: str, component: str, value: str) -> None:
    if not isinstance(value, str) or not value:
        raise ConfigurationError(
            f"{system}.{component} must define a valid schedule"
        )

def _validate_optional_fields(system: str, component: str, config: ComponentConfig) -> None:

    if "duration_hours" in config:
        duration = config["duration_hours"]
        if not isinstance(duration, (int, float)) or duration <= 0:
            raise ConfigurationError(
                f"{system}.{component} duration_hours must be > 0"
            )

    if "units" in config:
        units = config["units"]
        if not isinstance(units, int) or units <= 0:
            raise ConfigurationError(
                f"{system}.{component} units must be a positive integer (informational field)"
            )

    if "slot_distribution" in config:
        slot_distribution = config["slot_distribution"]
        if not isinstance(slot_distribution, bool):
            raise ConfigurationError(
                f"{system}.{component} slot_distribution must be a boolean"
            )

def validate_systems_config() -> None:

    if not SYSTEMS_CONFIG:
        raise ConfigurationError("SYSTEMS_CONFIG must be a non-empty dictionary")

    for system_name, system in SYSTEMS_CONFIG.items():

        if not isinstance(system, dict):
            raise ConfigurationError(
                f"System '{system_name}' definition must be a dictionary"
            )

        components = system.get("components")

        if not isinstance(components, dict) or not components:
            raise ConfigurationError(
                f"System '{system_name}' must define at least one component"
            )

        for component_name, component in components.items():

            if not isinstance(component, dict):
                raise ConfigurationError(
                    f"{system_name}.{component_name} must be a dictionary"
                )

            nominal = component.get("nominal_consumption_kwh")
            if nominal is None:
                raise ConfigurationError(
                    f"{system_name}.{component_name} missing nominal_consumption_kwh"
                )
            _validate_nominal_consumption(system_name, component_name, nominal)

            voltage = component.get("voltage")
            if voltage is None:
                raise ConfigurationError(
                    f"{system_name}.{component_name} missing voltage"
                )
            _validate_voltage(system_name, component_name, voltage)

            schedule = component.get("schedule")
            if schedule is None:
                raise ConfigurationError(
                    f"{system_name}.{component_name} missing schedule"
                )
            _validate_schedule(system_name, component_name, schedule)

            _validate_optional_fields(system_name, component_name, component)

validate_systems_config()