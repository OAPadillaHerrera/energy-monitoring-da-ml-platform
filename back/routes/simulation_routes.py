

"""
Simulation Routes Layer

Defines HTTP endpoints for energy simulation operations.
Delegates business logic to the application layer.

This module contains no business logic.
"""

import datetime
from flask import Blueprint, jsonify, request

from application.simulation_application import (
    run_daily_simulation,
    run_range_simulation
)

from core.exceptions import SimulationError, RepositoryError

simulation_bp = Blueprint('simulation', __name__)

@simulation_bp.route('/')
def index():
    return jsonify({
        "status": "ok",
        "message": "Energy monitoring system working correctly."
    }), 200

@simulation_bp.route('/daily', methods=['POST'])
def daily_simulation():
    try:
        result = run_daily_simulation()
        return jsonify(result), 200

    except (SimulationError, RepositoryError) as exc:
        return jsonify({"status": "error", "message": str(exc)}), 400

    except Exception:
        return jsonify({"status": "error", "message": "Unexpected server error"}), 500

@simulation_bp.route('/range', methods=['POST'])
def range_simulation():
    try:
        payload = request.get_json()

        if not payload or "start_date" not in payload or "end_date" not in payload:
            raise SimulationError("start_date and end_date are required.")

        try:
            start_date = datetime.date.fromisoformat(payload["start_date"])
            end_date = datetime.date.fromisoformat(payload["end_date"])
        except ValueError:
            raise SimulationError("Dates must be in ISO format (YYYY-MM-DD).")

        result = run_range_simulation(start_date, end_date)

        return jsonify(result), 200

    except (SimulationError, RepositoryError) as exc:
        return jsonify({"status": "error", "message": str(exc)}), 400

    except Exception:
        return jsonify({"status": "error", "message": "Unexpected server error"}), 500