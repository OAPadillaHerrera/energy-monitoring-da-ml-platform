

import joblib
import pandas as pd
from analytics.ml.alerting.alerting import evaluate_alert
from analytics.data.processing.build_ml_dataset import build_ml_dataset
from analytics.ml.business.business_logic import evaluate_risk, map_action
from analytics.ml.postprocessing.postprocessing import format_prediction_output

def run_root_cause_pipeline(model_path: str, df: pd.DataFrame):

    model = joblib.load(model_path)

    feature_columns = [
        "consumption_kwh",
        "voltage_120v",
        "voltage_240v",
        "hour",
        "weekday",
        "rolling_mean_24h",
        "delta_consumption",
        "voltage_diff",
    ]

    X_new = df[feature_columns]

    y_pred = model.predict(X_new)
    y_proba = model.predict_proba(X_new)

    probabilities_list = [
        dict(zip(model.classes_, p))
        for p in y_proba
    ]

    risk_levels = [
        evaluate_risk(pred, probs)
        for pred, probs in zip(y_pred, probabilities_list)
    ]

    actions = [
        map_action(r)
        for r in risk_levels
    ]

    alerts_list = [
        evaluate_alert(pred, probs)
        for pred, probs in zip(y_pred, probabilities_list)
    ]

    results = format_prediction_output(
    y_pred,
    probabilities_list,
    risk_levels,
    actions,
    alerts_list
    )

    results["timestamp"] = df["timestamp"].values
    results["system_name"] = df["system_name"].values

    return results

if __name__ == "__main__":

    df = build_ml_dataset()

    results = run_root_cause_pipeline(
        "models/root_cause_model.pkl",
        df
    )

    n_samples = 5

    print(f"\n=== First {n_samples} predictions ===")
    print(results.head(n_samples))