

"""
Voltage Repository

Handles persistence of hourly voltage profile records generated
by the simulation engine.
"""

import datetime
import logging
from typing import List, Tuple
from config.db import get_db_connection
from core.exceptions import RepositoryError

logger = logging.getLogger(__name__)

SQL_INSERT_HOURLY_VOLTAGE = """
INSERT INTO hourly_voltage_profile (
    timestamp,
    voltage_120v,
    voltage_240v,
    quality_flag
)
VALUES (%s, %s, %s, %s)
"""

SQL_GET_ALL_VOLTAGE_RECORDS = """
SELECT
    timestamp,
    voltage_120v,
    voltage_240v,
    quality_flag
FROM hourly_voltage_profile
ORDER BY timestamp ASC;
"""

def insert_hourly_voltage_bulk(
    records: List[Tuple[datetime.datetime, float, float, str]]
) -> None:

    if not records:
        return

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.executemany(SQL_INSERT_HOURLY_VOLTAGE, records)

        connection.commit()

    except Exception as exc:

        if connection:
            connection.rollback()

        logger.error(
            "Failed inserting hourly voltage records.",
            exc_info=exc,
        )

        raise RepositoryError(
            "Failed to insert hourly voltage records."
        ) from exc

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

def get_all_voltage_records() -> List[
    Tuple[datetime.datetime, float, float, str]
]:

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            SQL_GET_ALL_VOLTAGE_RECORDS
        )

        result = cursor.fetchall()

        return result if result else []

    except Exception as exc:

        logger.error(
            "Failed retrieving voltage records.",
            exc_info=exc,
        )

        raise RepositoryError(
            "Failed to fetch voltage records."
        ) from exc

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()