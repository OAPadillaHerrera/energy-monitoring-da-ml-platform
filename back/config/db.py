

"""
Database Connection Module

Provides database connection handling using environment configuration.
Designed for structured error handling and enterprise-ready architecture.
"""

import os
import logging
import pg8000
from dotenv import load_dotenv
from core.exceptions import ConfigurationError, RepositoryError

load_dotenv()

logger = logging.getLogger(__name__)

def conectar_db():

    required_vars = ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD", "DB_PORT"]

    missing_vars = [var for var in required_vars if not os.getenv(var)]

    if missing_vars:
        raise ConfigurationError(
            f"Missing required database configuration variables: {missing_vars}"
        )

    try:
        connection = pg8000.connect(
            host=os.getenv("DB_HOST"),
            database=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            port=int(os.getenv("DB_PORT"))
        )

        logger.info("Database connection established successfully.")
        return connection

    except Exception as exc:
        logger.error("Failed to connect to database.", exc_info=exc)
        raise RepositoryError("Database connection failed.") from exc