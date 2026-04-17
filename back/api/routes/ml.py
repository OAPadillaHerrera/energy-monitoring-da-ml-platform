

from pathlib import Path
from flask import Blueprint, jsonify, request
from analytics.ml.inference.run_root_cause_pipeline import run_root_cause_pipeline
from analytics.data.processing.build_ml_dataset import build_ml_dataset
from analytics.ml.alerting.alerting import evaluate_alert

ml_bp = Blueprint("ml", __name__)

def serialize_df(df):
    if df is None or df.empty:
        return {}

    df = df.copy()
    df.index = df.index.map(str)
    return df.reset_index().to_dict(orient="records")

def serialize_series(series):
    if series is None or series.empty:
        return {}

    series = series.copy()
    series.index = series.index.map(str)
    return series.astype(object).to_dict()

@ml_bp.route("/root-cause", methods=["GET"])
def get_root_cause_pipeline():

    system_name = request.args.get("name")

    df = build_ml_dataset()
    df["system_name"] = df["system_name"].str.strip()

    model_path = Path("/app/models/root_cause_model.pkl")

    result = {
        "pipeline_example": {
            "note": "This endpoint runs ML root cause pipeline (model + business logic + alerts)"
        },

        "all_systems_prediction": {
            system: serialize_df(
                run_root_cause_pipeline(model_path, df[df["system_name"] == system])
            )
            for system in df["system_name"].unique()
        }
    }

    if system_name:

        if system_name not in df["system_name"].unique():
            return jsonify({"error": "System not found"}), 404

        system_df = df[df["system_name"] == system_name]

        result["system"] = system_name

        result["by_system"] = serialize_df(
            run_root_cause_pipeline(model_path, system_df)
        )

    else:
        result["by_system"] = {}

    return jsonify(result)

@ml_bp.route("/alerting", methods=["GET"])
def get_alerting():

    df = build_ml_dataset()

    result = {
        "alert_examples": {
            "grid_outage_high": evaluate_alert(
                "grid_outage",
                {"grid_outage": 0.9}
            ),
            "demand_spike_high": evaluate_alert(
                "demand_spike",
                {"demand_spike": 0.8}
            ),
            "no_alert_case": evaluate_alert(
                "normal",
                {"normal": 0.99}
            )
        },

        "dataset_alerts_sample": []
    }

    sample_df = df.head(10)

    alerts_output = []

    for idx, _ in sample_df.iterrows():

        alerts = evaluate_alert(
            "normal",
            {"normal": 1.0}
        )

        alerts_output.append({
            "index": str(idx),
            "alerts": alerts
        })

    result["dataset_alerts_sample"] = alerts_output

    return jsonify(result)