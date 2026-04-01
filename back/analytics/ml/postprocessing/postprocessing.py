

import pandas as pd

def extract_confidence(probabilities: dict, prediction: str) -> float:

    return probabilities.get(prediction, 0.0)

def format_prediction_output(
    predictions,
    probabilities_list,
    risk_levels,
    actions,
    alerts_list
) -> pd.DataFrame:

    formatted_rows = []

    for pred, probs, risk, action, alerts in zip(
        predictions,
        probabilities_list,
        risk_levels,
        actions,
        alerts_list
    ):
        confidence = extract_confidence(probs, pred)

        formatted_rows.append({
            "prediction": pred,
            "confidence": confidence,
            "probabilities": probs,   
            "risk_level": risk,
            "action": action,
            "alerts": alerts
        })

    return pd.DataFrame(formatted_rows)