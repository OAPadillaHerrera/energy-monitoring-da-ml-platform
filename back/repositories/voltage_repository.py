

"""
Voltage Repository

Handles persistence of hourly voltage profile records.
"""

import datetime
from typing import List, Tuple

from config.db import conectar_db
from core.exceptions import RepositoryError

def insert_hourly_voltage_bulk(
    records: List[Tuple[datetime.datetime, float, float, str]]
) -> None:

    if not records:
        return

    connection = None
    cursor = None

    try:
        connection = conectar_db()
        cursor = connection.cursor()

        query = """
            INSERT INTO hourly_voltage_profile (
                timestamp,
                voltage_120v,
                voltage_240v,
                quality_flag
            )
            VALUES (%s, %s, %s, %s)
        """

        cursor.executemany(query, records)
        connection.commit()

    except Exception as exc:
        if connection:
            connection.rollback()
        raise RepositoryError("Failed to insert hourly voltage records.") from exc

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

