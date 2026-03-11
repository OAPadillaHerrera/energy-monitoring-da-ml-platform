

"""
System Events Repository

Handles persistence and queries for system events.
"""

import datetime
import logging
from typing import List, Tuple, Optional
from config.db import get_db_connection
from core.exceptions import RepositoryError

logger = logging.getLogger(__name__)

SQL_INSERT_SYSTEM_EVENTS = """
INSERT INTO system_events (
    timestamp,
    system_id,
    event_type
)
VALUES (%s, %s, %s)
"""

SQL_GET_LATEST_SYSTEM_EVENT_DATE = """
SELECT MAX(DATE(timestamp))
FROM system_events;
"""

SQL_EXISTS_SYSTEM_EVENT_IN_MONTH = """
SELECT 1
FROM system_events
WHERE event_type = %s
  AND EXTRACT(YEAR FROM timestamp) = %s
  AND EXTRACT(MONTH FROM timestamp) = %s
LIMIT 1;
"""

def insert_system_events(
    records: List[Tuple[datetime.datetime, int, str]]
) -> None:

    if not records:
        return

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.executemany(SQL_INSERT_SYSTEM_EVENTS, records)

        connection.commit()

    except Exception as exc:

        if connection:
            connection.rollback()

        logger.error(
            "Failed inserting system event records.",
            exc_info=exc,
        )

        raise RepositoryError(
            "Failed to insert system event records."
        ) from exc

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

def get_latest_system_event_date() -> Optional[datetime.date]:

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(SQL_GET_LATEST_SYSTEM_EVENT_DATE)

        result = cursor.fetchone()

        return result[0] if result and result[0] else None

    except Exception as exc:

        logger.error(
            "Failed retrieving latest system event date.",
            exc_info=exc,
        )

        raise RepositoryError(
            "Failed to fetch latest system event date."
        ) from exc

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
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            SQL_EXISTS_SYSTEM_EVENT_IN_MONTH,
            (event_type, year, month)
        )

        result = cursor.fetchone()

        return result is not None

    except Exception as exc:

        logger.error(
            "Failed checking system event existence.",
            exc_info=exc,
        )

        raise RepositoryError(
            "Failed to check system event existence."
        ) from exc

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

