

from flask import Blueprint, jsonify

from analytics.dashboard.service import (
    get_dashboard_summary
)

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/summary", methods=["GET"])
def get_summary():
    return jsonify(get_dashboard_summary()), 200