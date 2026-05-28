

"""
Simulation Routes Layer

Defines HTTP endpoints for energy simulation operations.
Delegates business logic to the application layer.

This module contains no business logic.
"""

import datetime
import logging
from flask import Blueprint, jsonify, request

from application.simulation_application import (
    run_daily_simulation,
    run_range_simulation,
    get_system_events
)

from core.exceptions import SimulationError

logger = logging.getLogger(__name__)

simulation_bp = Blueprint("simulation", __name__)

@simulation_bp.route("/")
def index():

    return jsonify({
        "status": "ok",
        "message": "Energy monitoring system working correctly."
    }), 200

@simulation_bp.route("/daily", methods=["POST"])
def daily_simulation():

    logger.info("Daily simulation endpoint called.")

    result = run_daily_simulation()

    return jsonify(result), 200

@simulation_bp.route("/range", methods=["POST"])
def range_simulation():

    logger.info("Range simulation endpoint called.")

    payload = request.get_json(silent=True)

    if payload is None:
        raise SimulationError("Request body must contain JSON.")

    start_date_str = payload.get("start_date")
    end_date_str = payload.get("end_date")

    if not start_date_str or not end_date_str:
        raise SimulationError("start_date and end_date are required.")

    try:

        start_date = datetime.date.fromisoformat(start_date_str)
        end_date = datetime.date.fromisoformat(end_date_str)

    except ValueError as exc:

        raise SimulationError(
            "Dates must be in ISO format (YYYY-MM-DD)."
        ) from exc

    result = run_range_simulation(start_date, end_date)

    return jsonify(result), 200

@simulation_bp.route("/system-events", methods=["GET"])
def system_events():

    logger.info("System events endpoint called.")

    result = get_system_events()

    return jsonify(result), 200