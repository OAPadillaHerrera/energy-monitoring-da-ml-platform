

from flask import Blueprint, jsonify, request

from analytics.anomaly.service import (
    get_zscore_metrics,
    get_detection_metrics,
    get_classification_metrics
)

anomaly_bp = Blueprint("anomaly", __name__)

@anomaly_bp.route("/zscore", methods=["GET"])
def get_zscore():

    system_name = request.args.get("name")

    return jsonify(
        get_zscore_metrics(system_name)
    ), 200

@anomaly_bp.route("/detection", methods=["GET"])
def get_detection():

    system_name = request.args.get("name")

    return jsonify(
        get_detection_metrics(system_name)
    ), 200

@anomaly_bp.route("/classification", methods=["GET"])
def get_classification():

    system_name = request.args.get("name")

    return jsonify(
        get_classification_metrics(system_name)
    ), 200

