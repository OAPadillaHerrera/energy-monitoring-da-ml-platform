

import joblib
import pandas as pd

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

    results = pd.DataFrame({
        "predicted": y_pred,
        "probabilities": [dict(zip(model.classes_, p)) for p in y_proba]
    })

    print(f"\n=== First {n_samples} predictions ===")
    for i in range(min(n_samples, len(results))):
        print(f"Sample {i}: Predicted = {results['predicted'].iloc[i]}, Probabilities = {results['probabilities'].iloc[i]}")

    return results

if __name__ == "__main__":
    predict_root_cause("root_cause_model.pkl", "ml_ready_dataset.csv")
