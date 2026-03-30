

import joblib
import pandas as pd

from analytics.ml.alerting import evaluate_alert

def evaluate_risk(prob):
    if prob > 0.8:
        return "CRITICAL"
    elif prob > 0.5:
        return "HIGH"
    elif prob > 0.3:
        return "MEDIUM"
    else:
        return "LOW"

def predict_root_cause(model_path: str, dataset_path: str, n_samples: int = 5):
    
    model = joblib.load("/app/" + model_path)

    df_new = pd.read_csv(dataset_path)

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
    X_new = df_new[feature_columns]

    y_pred = model.predict(X_new)
    y_proba = model.predict_proba(X_new)

    probabilities_list = [dict(zip(model.classes_, p)) for p in y_proba]

    alerts_list = [
        evaluate_alert(pred, probs)
        for pred, probs in zip(y_pred, probabilities_list)
    ]

    results = pd.DataFrame({
        "predicted": y_pred,
        "probabilities": probabilities_list,
        "alerts": alerts_list
    })

    results["risk_level"] = results["probabilities"].apply(
    lambda p: evaluate_risk(p.get("grid_outage", 0))
    )

    def map_action(risk_level):
        if risk_level == "CRITICAL":
            return "trigger_alert"
        elif risk_level == "HIGH":
            return "log_warning"
        elif risk_level == "MEDIUM":
            return "monitor"
        else:
            return "none"

    results["action"] = results["risk_level"].apply(map_action)

    anomalies = results[results["predicted"] != "normal"]
    print(anomalies.head(10))

    print(f"\n=== First {n_samples} predictions ===")
    for i in range(min(n_samples, len(results))):
       
        print(f"\nSample {i}:")
        print("Predicted:", results["predicted"].iloc[i])
        print("Probabilities:", results["probabilities"].iloc[i])
        print(f"Risk Level: {results['risk_level'].iloc[i]}")
        print("Alerts:", results["alerts"].iloc[i])

    high_risk = results[
        results["probabilities"].apply(
            lambda p: p.get("grid_outage", 0) > 0.3
        )
    ]

    print("\n=== POTENTIAL RISKS (NO ALERT YET) ===")
    print(high_risk.head(10))

    return results

if __name__ == "__main__":
    predict_root_cause("root_cause_model.pkl", "ml_ready_dataset.csv", n_samples=5)