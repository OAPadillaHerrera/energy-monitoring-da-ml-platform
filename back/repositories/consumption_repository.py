

"""
Consumption Repository
Handles persistence of hourly consumption records.
"""

import io
import datetime
from typing import List, Tuple, Optional
from config.db import conectar_db
from core.exceptions import RepositoryError

def insert_hourly_consumption(
    records: List[Tuple[int, datetime.datetime, float]]
) -> None:

    if not records:
        return

    connection = None
    cursor = None

    try:
        connection = conectar_db()
        cursor = connection.cursor()

        buffer = io.StringIO()

        for system_id, timestamp, consumption in records:
            buffer.write(f"{system_id},{timestamp},{consumption}\n")

        buffer.seek(0)

        cursor.execute(
            """
            COPY hourly_consumption (system_id, timestamp, consumption_kwh)
            FROM STDIN WITH (FORMAT CSV)
            """,
            stream=buffer,
        )

        connection.commit()

    except Exception as exc:
        if connection:
            connection.rollback()
        raise RepositoryError("Failed to insert hourly consumption records.") from exc

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

def get_latest_consumption_date() -> Optional[datetime.date]:

    connection = None
    cursor = None

    try:
        connection = conectar_db()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT MAX(DATE(timestamp))
            FROM hourly_consumption;
            """
        )

        result = cursor.fetchone()

        if result and result[0]:
            return result[0]

        return None

    except Exception as exc:
        raise RepositoryError("Failed to fetch latest consumption date.") from exc

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()