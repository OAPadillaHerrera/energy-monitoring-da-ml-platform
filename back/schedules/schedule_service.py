

"""
Schedule Service

Provides utilities for resolving system schedules and determining
whether a system or component is active at a given timestamp.

This service connects:

- SYSTEMS_CONFIG (system/component definitions)
- WORKING_SCHEDULES (schedule definitions)

Responsibilities
----------------
- Resolve schedules for systems and components
- Provide system name expansion for multi-component systems
- Determine activity status based on timestamp and schedule

Design principles
-----------------
- Read-only configuration sources
- Explicit validation
- Deterministic behavior
"""

import datetime
from typing import List, Tuple
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

        ScheduleService._validate_system_name(system_name)

        try:

            system, component = ScheduleService._parse_system_name(system_name)

            if component is None:
                components = SYSTEMS_CONFIG[system]["components"]
                component_config = next(iter(components.values()))
            else:
                component_config = SYSTEMS_CONFIG[system]["components"][component]

            return component_config["schedule"]

        except KeyError as exc:
            raise ConfigurationError(
                f"Invalid system or component reference: '{system_name}'"
            ) from exc

    @staticmethod
    def is_system_active(
        schedule_name: str,
        timestamp: datetime.datetime
    ) -> bool:

        ScheduleService._validate_schedule_name(schedule_name)
        ScheduleService._validate_timestamp(timestamp)

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

    @staticmethod
    def _parse_system_name(system_name: str) -> Tuple[str, str | None]:

        if ScheduleService.COMPONENT_SEPARATOR not in system_name:
            return system_name, None

        parent_name, component_name = system_name.split(
            ScheduleService.COMPONENT_SEPARATOR,
            1
        )

        return parent_name, component_name

    @staticmethod
    def _validate_system_name(system_name: str) -> None:

        if not isinstance(system_name, str) or not system_name.strip():
            raise ConfigurationError(
                "system_name must be a non-empty string"
            )

    @staticmethod
    def _validate_schedule_name(schedule_name: str) -> None:

        if not isinstance(schedule_name, str) or not schedule_name.strip():
            raise ConfigurationError(
                "schedule_name must be a non-empty string"
            )

    @staticmethod
    def _validate_timestamp(timestamp: datetime.datetime) -> None:

        if not isinstance(timestamp, datetime.datetime):
            raise ConfigurationError(
                "timestamp must be a datetime object"
            )