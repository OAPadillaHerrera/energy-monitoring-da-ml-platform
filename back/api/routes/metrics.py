

from flask import Blueprint, jsonify, request

from analytics.metrics.service import (
    get_basic_metrics,
    get_station_metrics,
    get_system_metrics,
    get_energy_metrics
)

metrics_bp = Blueprint("metrics", __name__)

@metrics_bp.route("/basic", methods=["GET"])
def get_basic():
    return jsonify(get_basic_metrics()), 200

@metrics_bp.route("/station", methods=["GET"])
def get_station():
    return jsonify(get_station_metrics()), 200

@metrics_bp.route("/system", methods=["GET"])
def get_system():

    system_name = request.args.get("name")

    if not system_name:
        return jsonify({"error": "Missing system name"}), 400

    return jsonify(get_system_metrics(system_name)), 200

@metrics_bp.route("/energy", methods=["GET"])
def get_energy():
    return jsonify(get_energy_metrics()), 200