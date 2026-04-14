

from flask import Blueprint, jsonify
from analytics.data.loaders.db_loader import load_energy_dataset_from_db

from analytics.metrics.basic_metrics import (
    total_consumption,
    average_consumption,
    consumption_by_system,
    consumption_by_hour
)

metrics_bp = Blueprint("metrics", __name__)

@metrics_bp.route("/basic", methods=["GET"])
def get_basic_metrics():

    df = load_energy_dataset_from_db()

    result = {
        "total_consumption": float(total_consumption(df)),
        "average_consumption": float(average_consumption(df)),
        "consumption_by_system": consumption_by_system(df).to_dict(),
        "consumption_by_hour": consumption_by_hour(df).to_dict()
    }

    return jsonify(result)