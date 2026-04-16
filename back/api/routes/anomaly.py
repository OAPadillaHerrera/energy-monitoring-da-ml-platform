

import pandas as pd
from flask import Blueprint, jsonify, request
from analytics.data.loaders.db_loader import load_energy_dataset_from_db

from analytics.anomaly.zscore import (
    compute_z_score,
    z_score_consumption,
    z_score_by_system
)

from analytics.anomaly.detection import (
    detect_anomalies,
    detect_anomalies_by_system,
    detect_anomalies_all_systems
)

from analytics.anomaly.classification import (
    classify_anomaly,
    classify_anomalies_by_system,
    classify_anomalies_all_systems,
    determine_root_cause,
    classify_anomalies_with_context,
    anomaly_classification
)

anomaly_bp = Blueprint("anomaly", __name__)

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

@anomaly_bp.route("/zscore", methods=["GET"])
def get_zscore():

    system_name = request.args.get("name")

    df = load_energy_dataset_from_db()
    df["system_name"] = df["system_name"].str.strip()

    result = {
        "compute_z_score_example": serialize_series(
            compute_z_score(pd.Series([1, 2, 3, 4, 5]))
        ),

        "z_score_consumption": serialize_series(
            z_score_consumption(df)
        )
    }

    if system_name:
        if system_name not in df["system_name"].unique():
            return jsonify({"error": "System not found"}), 404

        result["system"] = system_name
        result["z_score_by_system"] = serialize_series(
            z_score_by_system(df, system_name)
        )
    else:
        result["z_score_by_system"] = {}

    return jsonify(result)

@anomaly_bp.route("/detection", methods=["GET"])
def get_anomaly_detection():

    system_name = request.args.get("name")

    df = load_energy_dataset_from_db()
    df["system_name"] = df["system_name"].str.strip()

    result = {
        "detect_anomalies_example": {
            str(x): "anomaly" if detect_anomalies(pd.Series([x])) is not None else "normal"
            for x in [-3, -2, -1, 0, 1, 2, 3]
        },

        "all_systems_detection": {
            system: serialize_series(series)
            for system, series in detect_anomalies_all_systems(df).items()
        }
    }

    if system_name:
        if system_name not in df["system_name"].unique():
            return jsonify({"error": "System not found"}), 404

        result["system"] = system_name
        result["by_system"] = serialize_series(
            detect_anomalies_by_system(df, system_name)
        )
    else:
        result["by_system"] = {}

    return jsonify(result)

@anomaly_bp.route("/classification", methods=["GET"])
def get_anomaly_classification():

    system_name = request.args.get("name")

    df = load_energy_dataset_from_db()
    df["system_name"] = df["system_name"].str.strip()

    result = {
        "classify_anomaly_examples": {
            str(x): classify_anomaly(x)
            for x in [-3, -2, -1, 0, 1, 2, 3]
        },

        "by_system": (
            serialize_df(classify_anomalies_by_system(df, system_name))
            if system_name else {}
        ),

        "all_systems_summary": {
            system: serialize_df(df_sys)
            for system, df_sys in classify_anomalies_all_systems(df).items()
        },

        "root_cause_examples": {
            "grid_outage": determine_root_cause("spike", "normal", 0, 0),
            "brownout": determine_root_cause("drop", "brownout"),
            "overvoltage": determine_root_cause("spike", "overvoltage"),
            "equipment_issue": determine_root_cause("drop", "normal"),
        },

        "context_classification": (
            serialize_df(classify_anomalies_with_context(df, system_name))
            if system_name else {}
        ),

        "full_pipeline": serialize_df(anomaly_classification(df))
    }

    return jsonify(result)

