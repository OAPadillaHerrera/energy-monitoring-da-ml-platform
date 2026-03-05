

"""
Schedule Service

Provides utilities to resolve system schedules and determine
whether a system (or component) is active at a given timestamp.

Integrates system configuration (SYSTEMS_CONFIG) with
working schedule definitions (WORKING_SCHEDULES).
"""

import datetime
from typing import List
from domain_config.systems_config import SYSTEMS_CONFIG
from domain_config.working_schedules import WORKING_SCHEDULES
from core.exceptions import ConfigurationError

class ScheduleService:

    COMPONENT_SEPARATOR = " - "

    @staticmethod
    def get_all_system_names() -> List[str]:

        names: List[str] = []

        for system_name, config in SYSTEMS_CONFIG.items():

            components = config["components"]

            if len(components) == 1:
                names.append(system_name)

            else:
                for component_name in components:
                    names.append(
                        f"{system_name}{ScheduleService.COMPONENT_SEPARATOR}{component_name}"
                    )

        return names

    @staticmethod
    def get_schedule_for_system_name(system_name: str) -> str:

        if not isinstance(system_name, str) or not system_name.strip():
            raise ConfigurationError("system_name must be a non-empty string")

        try:

            if ScheduleService.COMPONENT_SEPARATOR not in system_name:

                components = SYSTEMS_CONFIG[system_name]["components"]
                component_config = next(iter(components.values()))

                return component_config["schedule"]

            parent_name, component_name = system_name.split(
                ScheduleService.COMPONENT_SEPARATOR, 1
            )

            return SYSTEMS_CONFIG[parent_name]["components"][component_name]["schedule"]

        except KeyError as exc:

            raise ConfigurationError(
                f"Invalid system name or component reference: '{system_name}'"
            ) from exc

    @staticmethod
    def is_system_active(
        schedule_name: str,
        timestamp: datetime.datetime
    ) -> bool:

        if not isinstance(schedule_name, str) or not schedule_name.strip():
            raise ConfigurationError("schedule_name must be a non-empty string")

        if not isinstance(timestamp, datetime.datetime):
            raise ConfigurationError("timestamp must be a datetime object")

        try:
            schedule = WORKING_SCHEDULES[schedule_name]

        except KeyError as exc:

            raise ConfigurationError(
                f"Schedule '{schedule_name}' is not defined"
            ) from exc

        return (
            timestamp.weekday() in schedule["days"]
            and timestamp.hour in schedule["hours"]
        )

    @staticmethod
    def is_system_name_active(
        system_name: str,
        timestamp: datetime.datetime
    ) -> bool:

        schedule_name = ScheduleService.get_schedule_for_system_name(system_name)

        return ScheduleService.is_system_active(schedule_name, timestamp)