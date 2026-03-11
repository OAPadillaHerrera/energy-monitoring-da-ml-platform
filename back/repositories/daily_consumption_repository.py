

"""
Daily Consumption Repository

Handles persistence of aggregated daily consumption records.
"""

import datetime
import logging
from typing import List, Tuple
from config.db import get_db_connection
from core.exceptions import RepositoryError

logger = logging.getLogger(__name__)

SQL_INSERT_DAILY_CONSUMPTION = """
INSERT INTO daily_consumption (
    system_id,
    date,
    total_consumption_kwh
)
VALUES (%s, %s, %s)
"""

def insert_daily_consumption(
    records: List[Tuple[int, datetime.date, float]]
) -> None:

    if not records:
        return

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.executemany(SQL_INSERT_DAILY_CONSUMPTION, records)

        connection.commit()

    except Exception as exc:

        if connection:
            connection.rollback()

        logger.error(
            "Failed inserting daily consumption records.",
            exc_info=exc,
        )

        raise RepositoryError(
            "Failed to insert daily consumption records."
        ) from exc

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()
