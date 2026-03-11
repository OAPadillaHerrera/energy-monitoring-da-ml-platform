

"""
Database Connection Module

Provides database connection handling using environment configuration.
"""

import os
import logging
import pg8000
from core.exceptions import ConfigurationError, RepositoryError

logger = logging.getLogger(__name__)

def _load_db_config() -> dict:

    required_vars = [
        "DB_HOST",
        "DB_NAME",
        "DB_USER",
        "DB_PASSWORD",
        "DB_PORT",
    ]

    config = {var: os.getenv(var) for var in required_vars}

    missing_vars = [key for key, value in config.items() if not value]

    if missing_vars:
        raise ConfigurationError(
            f"Missing required database configuration variables: {missing_vars}"
        )

    config["DB_PORT"] = int(config["DB_PORT"])

    return config

def get_db_connection():

    config = _load_db_config()

    try:
        connection = pg8000.connect(
            host=config["DB_HOST"],
            database=config["DB_NAME"],
            user=config["DB_USER"],
            password=config["DB_PASSWORD"],
            port=config["DB_PORT"],
        )

        logger.info("Database connection established successfully.")

        return connection

    except Exception as exc:
        logger.error("Failed to connect to database.", exc_info=exc)

        raise RepositoryError("Database connection failed.") from exc