

from flask import Blueprint, jsonify, request
from analytics.data.loaders.db_loader import load_energy_dataset_from_db

from analytics.metrics.basic_metrics import (
    total_consumption,
    average_consumption,
    consumption_by_system,
    consumption_by_hour
)

from analytics.metrics.system_metrics import (
    total_energy_by_system,
    avg_consumption_by_system,
    peak_consumption_by_system,
    min_consumption_by_system,
    energy_by_hour_by_system,
    daily_energy_by_system,
    std_consumption_by_system,
    avg_daily_energy_by_system,
    avg_hourly_profile_by_system
)

from analytics.metrics.station_metrics import (
    total_energy,
    avg_hourly_consumption,
    peak_demand,
    min_demand,
    energy_by_hour,
    daily_energy,
    std_consumption,
    avg_daily_energy
)

metrics_bp = Blueprint("metrics", __name__)

def serialize_series(series):

    series = series.copy()

    series.index = series.index.map(lambda x: str(x))

    series = series.astype(float)

    return dict(series)

@metrics_bp.route("/basic", methods=["GET"])
def get_basic_metrics():

    df = load_energy_dataset_from_db()

    result = {
        "total_consumption": float(total_consumption(df)),
        "average_consumption": float(average_consumption(df)),
        "consumption_by_system": serialize_series(consumption_by_system(df)),
        "consumption_by_hour": serialize_series(consumption_by_hour(df))
    }

    return jsonify(result)

@metrics_bp.route("/station", methods=["GET"])
def get_station_metrics():

    df = load_energy_dataset_from_db()

    result = {
        "total_energy": float(total_energy(df)),
        "average_consumption": float(avg_hourly_consumption(df)),
        "peak_consumption": float(peak_demand(df)),
        "min_consumption": float(min_demand(df)),
        "std_consumption": float(std_consumption(df)),
        "avg_daily_energy": float(avg_daily_energy(df)),

        "energy_by_hour": serialize_series(
            energy_by_hour(df)
        ),

        "daily_energy": serialize_series(
            daily_energy(df)
        )
    }

    return jsonify(result)

@metrics_bp.route("/system", methods=["GET"])
def get_system_metrics():

    system_name = request.args.get("name")

    if not system_name:
        return jsonify({"error": "Missing system name"}), 400

    df = load_energy_dataset_from_db()

    df["system_name"] = df["system_name"].str.strip()

    if system_name not in df["system_name"].unique():
        return jsonify({"error": "System not found"}), 404

    result = {
        "system": system_name,
        "total_energy": float(total_energy_by_system(df, system_name)),
        "average_consumption": float(avg_consumption_by_system(df, system_name)),
        "peak_consumption": float(peak_consumption_by_system(df, system_name)),
        "min_consumption": float(min_consumption_by_system(df, system_name)),
        "std_consumption": float(std_consumption_by_system(df, system_name)),
        "avg_daily_energy": float(avg_daily_energy_by_system(df, system_name)),

        "energy_by_hour": serialize_series(
            energy_by_hour_by_system(df, system_name)
        ),

        "daily_energy": serialize_series(
            daily_energy_by_system(df, system_name)
        ),

        "avg_hourly_profile": serialize_series(
            avg_hourly_profile_by_system(df, system_name)
        )
    }

    return jsonify(result)