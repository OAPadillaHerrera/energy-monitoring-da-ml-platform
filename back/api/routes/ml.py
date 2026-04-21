

from flask import Blueprint, jsonify, request

from analytics.ml.service import (
    get_root_cause_metrics,
    get_alerting_metrics,
    get_business_metrics
)

ml_bp = Blueprint("ml", __name__)

@ml_bp.route("/root-cause", methods=["GET"])
def get_root_cause():

    system_name = request.args.get("name")

    return jsonify(
        get_root_cause_metrics(system_name)
    ), 200

@ml_bp.route("/alerting", methods=["GET"])
def get_alerting():

    return jsonify(
        get_alerting_metrics()
    ), 200

@ml_bp.route("/business", methods=["GET"])
def get_business():

    return jsonify(
        get_business_metrics()
    ), 200