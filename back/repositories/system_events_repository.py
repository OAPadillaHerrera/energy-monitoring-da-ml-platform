

"""
System Events Repository

Handles persistence and queries for system events.
"""

import datetime
from typing import List, Tuple, Optional

from config.db import conectar_db
from core.exceptions import RepositoryError

def insert_system_events(
    records: List[Tuple[datetime.datetime, int, str]]
) -> None:

    if not records:
        return

    connection = None
    cursor = None

    try:
        connection = conectar_db()
        cursor = connection.cursor()

        query = """
            INSERT INTO system_events (
                timestamp,
                system_id,
                event_type
            )
            VALUES (%s, %s, %s)
        """

        cursor.executemany(query, records)
        connection.commit()

    except Exception as exc:
        if connection:
            connection.rollback()
        raise RepositoryError("Failed to insert system events.") from exc

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

def get_latest_system_event_date() -> Optional[datetime.date]:

    connection = None
    cursor = None

    try:
        connection = conectar_db()
        cursor = connection.cursor()

        query = """
            SELECT MAX(DATE(timestamp))
            FROM system_events;
        """

        cursor.execute(query)
        result = cursor.fetchone()

        if result and result[0]:
            return result[0]

        return None

    except Exception as exc:
        raise RepositoryError("Failed to fetch latest system event date.") from exc

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

def exists_system_event_in_month(
    year: int,
    month: int,
    event_type: str
) -> bool:

    connection = None
    cursor = None

    try:
        connection = conectar_db()
        cursor = connection.cursor()

        query = """
            SELECT 1
            FROM system_events
            WHERE event_type = %s
              AND EXTRACT(YEAR FROM timestamp) = %s
              AND EXTRACT(MONTH FROM timestamp) = %s
            LIMIT 1;
        """

        cursor.execute(query, (event_type, year, month))
        result = cursor.fetchone()

        return result is not None

    except Exception as exc:
        raise RepositoryError("Failed to check system event existence.") from exc

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

