

"""
Systems Configuration

Defines the static configuration of all systems and their components,
including nominal energy consumption, schedules, voltage levels,
and optional duration-based behavior.

This configuration acts as the domain definition layer for
SystemCalculator and ScheduleService.
"""

from typing import Dict, TypedDict
from core.exceptions import ConfigurationError

class ComponentConfig(TypedDict, total=False):
    description: str
    units: int
    nominal_consumption_kwh: float
    schedule: str
    voltage: int
    duration_hours: float

class SystemConfig(TypedDict):
    components: Dict[str, ComponentConfig]

SYSTEMS_CONFIG: Dict[str, SystemConfig] = {
    "price_display_system": {
        "components": {
            "price_display_modules": {
                "description": "LED price display modules",
                "nominal_consumption_kwh": 2.04,
                "schedule": "24_7",
                "voltage": 120,
            }
        }
    },
    "corporate_lighting_system": {
        "components": {
            "corporate_signage": {
                "description": "LED signage and corporate logo",
                "nominal_consumption_kwh": 0.84,
                "schedule": "nighttime",
                "voltage": 120,
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
                "voltage": 120,
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
                "voltage": 120,
            }
        }
    },
    "office_and_general_services": {
        "components": {
            "office_services": {
                "description": "Office equipment and general services",
                "nominal_consumption_kwh": 1.1,
                "schedule": "office_hours",
                "voltage": 120,
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
                "voltage": 240,
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
                "voltage": 120,
            }
        }
    },
    "air_conditioning_system": {
        "components": {
            "server_room": {
                "description": "Server room air conditioning",
                "nominal_consumption_kwh": 0.09183,
                "schedule": "24_7",
                "voltage": 120,
            },
            "office_area": {
                "description": "Office area air conditioning",
                "nominal_consumption_kwh": 0.09183,
                "schedule": "office_hours",
                "voltage": 120,
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
                "voltage": 120,
            },
            "coffee_machine": {
                "description": "Coffee machine",
                "nominal_consumption_kwh": 0.5,
                "schedule": "coffee_machine",
                "voltage": 120,
            },
        }
    },
}

def validate_systems_config() -> None:

    if not isinstance(SYSTEMS_CONFIG, dict) or not SYSTEMS_CONFIG:
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

            if not isinstance(nominal, (int, float)) or nominal <= 0:
                raise ConfigurationError(
                    f"{system_name}.{component_name} nominal_consumption_kwh must be > 0"
                )

            voltage = component.get("voltage")
            if voltage is None:
                raise ConfigurationError(
                    f"{system_name}.{component_name} missing voltage"
                )

            if not isinstance(voltage, int) or voltage <= 0:
                raise ConfigurationError(
                    f"{system_name}.{component_name} voltage must be a positive integer"
                )

            if "duration_hours" in component:
                duration = component["duration_hours"]
                if not isinstance(duration, (int, float)) or duration < 0:
                    raise ConfigurationError(
                        f"{system_name}.{component_name} duration_hours must be >= 0"
                    )

            if "units" in component:
                units = component["units"]
                if not isinstance(units, int) or units <= 0:
                    raise ConfigurationError(
                        f"{system_name}.{component_name} units must be a positive integer"
                    )

validate_systems_config()



