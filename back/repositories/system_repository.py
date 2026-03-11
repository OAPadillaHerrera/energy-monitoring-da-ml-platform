

"""
System Repository

Provides system ID resolution from the database.
"""

import logging
from typing import Dict
from config.db import get_db_connection
from core.exceptions import RepositoryError

logger = logging.getLogger(__name__)

SQL_GET_SYSTEMS = """
SELECT id, name
FROM systems;
"""

SYSTEM_NAME_MAP: Dict[str, str] = {
    "price_display_system": "Price Display System",
    "corporate_lighting_system": "Corporate Lighting System",
    "canopy_lighting_system": "Canopy Lighting System",
    "perimeter_lighting_system": "Perimeter Lighting System",
    "office_and_general_services": "Office and General Services System",
    "submersible_pump_system": "Submersible Pump System",
    "fuel_dispenser_system": "Fuel Dispenser System",
    "air_conditioning_system - server_room": "Air Conditioning System - Server Room",
    "air_conditioning_system - office_area": "Air Conditioning System - Office Area",
    "customer_service_kiosk_system - refrigeration": "Customer Service Kiosk System - Refrigeration",
    "customer_service_kiosk_system - coffee_machine": "Customer Service Kiosk System - Coffee Machine",
}

def get_systems_map() -> Dict[str, int]:

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(SQL_GET_SYSTEMS)

        systems = cursor.fetchall()

    except Exception as exc:

        logger.error(
            "Failed loading systems from database.",
            exc_info=exc,
        )

        raise RepositoryError(
            "Failed to load systems from database."
        ) from exc

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

    db_name_to_id: Dict[str, int] = {}

    for system_id, name in systems:
        db_name_to_id[name] = system_id

    systems_map: Dict[str, int] = {}

    for internal_name, db_name in SYSTEM_NAME_MAP.items():

        system_id = db_name_to_id.get(db_name)

        if system_id is None:

            logger.warning(
                "System '%s' not found in database.",
                db_name,
            )

            continue

        systems_map[internal_name] = system_id

    return systems_map





    