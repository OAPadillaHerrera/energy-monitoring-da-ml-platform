

from pathlib import Path

from flask import Blueprint, jsonify, request
from analytics.ml.inference.run_root_cause_pipeline import run_root_cause_pipeline
from analytics.data.processing.build_ml_dataset import build_ml_dataset

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