

"""
Consumption Repository
Handles persistence of hourly consumption records.
"""

import io
import datetime
import logging
from typing import List, Tuple, Optional
from config.db import get_db_connection
from core.exceptions import RepositoryError

logger = logging.getLogger(__name__)

SQL_COPY_HOURLY_CONSUMPTION = """
COPY hourly_consumption (system_id, timestamp, consumption_kwh)
FROM STDIN WITH (FORMAT CSV)
"""

SQL_GET_LATEST_CONSUMPTION_DATE = """
SELECT MAX(DATE(timestamp))
FROM hourly_consumption;
"""

def insert_hourly_consumption(
    records: List[Tuple[int, datetime.datetime, float]]
) -> None:

    if not records:
        return

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        buffer = io.StringIO()

        for record in records:

            if len(record) != 3:
                raise RepositoryError(
                    f"Invalid hourly consumption record format: {record}"
                )

            system_id, timestamp, consumption = record

            line = f"{system_id},{timestamp},{consumption}\n"
            buffer.write(line)

        buffer.seek(0)

        cursor.execute(SQL_COPY_HOURLY_CONSUMPTION, stream=buffer)

        connection.commit()

    except Exception as exc:

        if connection:
            connection.rollback()

        logger.error(
            "Failed inserting hourly consumption records.",
            exc_info=exc,
        )

        raise RepositoryError(
            "Failed to insert hourly consumption records."
        ) from exc

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

def get_latest_consumption_date() -> Optional[datetime.date]:

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(SQL_GET_LATEST_CONSUMPTION_DATE)

        result = cursor.fetchone()

        return result[0] if result and result[0] else None

    except Exception as exc:

        logger.error(
            "Failed retrieving latest consumption date.",
            exc_info=exc,
        )

        raise RepositoryError(
            "Failed to fetch latest consumption date."
        ) from exc

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()
