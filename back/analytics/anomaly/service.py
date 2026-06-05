

import pandas as pd
from analytics.data.loaders.db_loader import load_energy_dataset_from_db
from core.exceptions import ApplicationError

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
    classify_anomalies_with_context,
    classify_anomalies_with_context_all_systems,  
    determine_root_cause,
    anomaly_classification
)

def _get_clean_dataset() -> pd.DataFrame:
    df = load_energy_dataset_from_db()

    if df is None or df.empty:
        raise ApplicationError("Energy dataset is empty or unavailable")

    required_columns = {"system_name", "consumption_kwh", "timestamp"}
    missing = required_columns - set(df.columns)

    if missing:
        raise ApplicationError(f"Missing required columns: {missing}")

    df["system_name"] = df["system_name"].astype(str).str.strip()
    df["timestamp"] = pd.to_datetime(df["timestamp"])

    return df

def _serialize_series(series):
    if series is None or series.empty:
        return {}

    series = series.copy()
    series.index = series.index.map(str)
    return series.astype(float).to_dict()

def _serialize_df(df):
    if df is None or df.empty:
        return []

    df = df.copy()
    df.index = df.index.map(str)
    return df.reset_index().to_dict(orient="records")

def get_zscore_metrics(system_name: str | None = None):
    df = _get_clean_dataset()

    result = {
        "compute_z_score_example": _serialize_series(
            compute_z_score(pd.Series([1, 2, 3, 4, 5]))
        ),
        "z_score_consumption": _serialize_series(
            z_score_consumption(df)
        ),
    }

    if system_name:
        if system_name not in df["system_name"].unique():
            raise ApplicationError(f"System '{system_name}' not found")

        result["system"] = system_name
        result["z_score_by_system"] = _serialize_series(
            z_score_by_system(df, system_name)
        )
    else:
        result["z_score_by_system"] = {}

    return result

def get_detection_metrics(system_name: str | None = None):
    df = _get_clean_dataset()

    result = {
        "detect_anomalies_example": {
            str(x): "anomaly" if not detect_anomalies(pd.Series([x])).empty else "normal"
            for x in [-3, -2, -1, 0, 1, 2, 3]
        },

        "all_systems_detection": {
            system: _serialize_series(series)
            for system, series in detect_anomalies_all_systems(df).items()
        }
    }

    if system_name:
        if system_name not in df["system_name"].unique():
            raise ApplicationError(f"System '{system_name}' not found")

        result["system"] = system_name
        result["by_system"] = _serialize_series(
            detect_anomalies_by_system(df, system_name)
        )
    else:
        result["by_system"] = {}

    return result

def get_classification_metrics(system_name: str | None = None):
    df = _get_clean_dataset()

    result = {
        "classify_anomaly_examples": {
            str(x): classify_anomaly(x)
            for x in [-3, -2, -1, 0, 1, 2, 3]
        },

        "all_systems_summary": {
            system: _serialize_df(df_sys)
            for system, df_sys in classify_anomalies_all_systems(df).items()
        },

        "all_systems_with_context": {
            system: _serialize_df(df_sys)
            for system, df_sys in classify_anomalies_with_context_all_systems(df).items()
        },

        "root_cause_examples": {
            "grid_outage": determine_root_cause("spike", "normal", 0, 0),
            "brownout": determine_root_cause("drop", "brownout"),
            "overvoltage": determine_root_cause("spike", "overvoltage"),
            "equipment_issue": determine_root_cause("drop", "normal"),
        },

        "full_pipeline": _serialize_df(
            anomaly_classification(df)
        )
    }

    if system_name:
        if system_name not in df["system_name"].unique():
            raise ApplicationError(f"System '{system_name}' not found")

        result["system"] = system_name

        result["by_system"] = _serialize_df(
            classify_anomalies_by_system(df, system_name)
        )

        result["context_classification"] = _serialize_df(
            classify_anomalies_with_context(df, system_name)
        )
    else:
        result["by_system"] = {}
        result["context_classification"] = {}

    return result