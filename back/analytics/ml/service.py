

from pathlib import Path
import pandas as pd
from analytics.data.processing.build_ml_dataset import build_ml_dataset
from analytics.ml.inference.run_root_cause_pipeline import run_root_cause_pipeline
from analytics.ml.alerting.alerting import evaluate_alert
from analytics.ml.business.business_logic import evaluate_risk, map_action
from core.exceptions import ApplicationError

def _get_clean_dataset() -> pd.DataFrame:
    df = build_ml_dataset()

    if df is None or df.empty:
        raise ApplicationError("ML dataset is empty or unavailable")

    if "system_name" not in df.columns:
        raise ApplicationError("Missing required column: system_name")

    df["system_name"] = df["system_name"].astype(str).str.strip()

    return df

def _get_model_path() -> Path:
    model_path = Path("/app/models/root_cause_model.pkl")

    if not model_path.exists():
        raise ApplicationError(
            "Root cause model not found at /app/models/root_cause_model.pkl"
        )

    return model_path

def _serialize_df(df):
    if df is None or df.empty:
        return []

    df = df.copy()
    df.index = df.index.map(str)
    return df.reset_index().to_dict(orient="records")

def _build_business_output(pred: str, prob: float):
    probs = {pred: prob}
    risk = evaluate_risk(pred, probs)

    return {
        "prediction": pred,
        "probabilities": probs,
        "risk_level": risk,
        "action": map_action(risk)
    }

def get_root_cause_metrics(system_name: str | None = None):
    df = _get_clean_dataset()
    model_path = _get_model_path()

    result = {
        "pipeline_example": {
            "note": "Runs ML root cause pipeline (model + business logic + alerts)"
        },

        "all_systems_prediction": {
            system: _serialize_df(
                run_root_cause_pipeline(
                    model_path,
                    df[df["system_name"] == system]
                )
            )
            for system in df["system_name"].unique()
        }
    }

    if system_name:
        if system_name not in df["system_name"].unique():
            raise ApplicationError(f"System '{system_name}' not found")

        result["system"] = system_name

        result["by_system"] = _serialize_df(
            run_root_cause_pipeline(
                model_path,
                df[df["system_name"] == system_name]
            )
        )
    else:
        result["by_system"] = {}

    return result

def get_alerting_metrics():
    df = _get_clean_dataset()

    return {
        "alert_examples": {
            "grid_outage_high": evaluate_alert(
                "grid_outage", {"grid_outage": 0.95}
            ),
            "demand_spike_high": evaluate_alert(
                "demand_spike", {"demand_spike": 0.9}
            ),
            "no_alert_case": evaluate_alert(
                "normal", {"normal": 0.99}
            )
        },

        "dataset_alerts_sample": [
            {
                "index": str(i),
                "alerts": evaluate_alert("normal", {"normal": 0.99})
            }
            for i in df.index[:10]
        ]
    }

def get_business_metrics():
    df = _get_clean_dataset()

    return {
        "risk_examples": {
            "low": evaluate_risk("normal", {"normal": 0.99}),
            "medium": evaluate_risk("demand_spike", {"demand_spike": 0.4}),
            "high": evaluate_risk("demand_spike", {"demand_spike": 0.6}),
            "critical": evaluate_risk("grid_outage", {"grid_outage": 0.95}),
        },

        "action_examples": {
            "low": map_action("LOW"),
            "medium": map_action("MEDIUM"),
            "high": map_action("HIGH"),
            "critical": map_action("CRITICAL"),
        },

        "dataset_business_sample": [
            {
                "index": str(i),
                **_build_business_output("normal", 0.99)
            }
            for i in df.index[:10]
        ]
    }