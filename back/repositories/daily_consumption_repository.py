

"""
Daily Consumption Repository

Handles persistence of aggregated daily consumption records.
"""

import datetime
from typing import List, Tuple
from config.db import conectar_db
from core.exceptions import RepositoryError

def insert_daily_consumption(
    records: List[Tuple[int, datetime.date, float]]
) -> None:

    if not records:
        return

    connection = None
    cursor = None

    try:
        connection = conectar_db()
        cursor = connection.cursor()

        query = """
            INSERT INTO daily_consumption (
                system_id,
                date,
                total_consumption_kwh
            )
            VALUES (%s, %s, %s)
        """
        cursor.executemany(query, records)

        connection.commit()

    except Exception as exc:
        if connection:
            connection.rollback()

        raise RepositoryError(
            "Failed to insert daily consumption records."
        ) from exc

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()
