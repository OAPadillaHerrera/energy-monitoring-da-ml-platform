

def evaluate_risk(pred: str, probs: dict) -> str:
    p = probs.get(pred, 0)

    if pred == "normal":
        return "LOW"
    elif p > 0.8:
        return "CRITICAL"
    elif p > 0.5:
        return "HIGH"
    elif p > 0.3:
        return "MEDIUM"
    else:
        return "LOW"

def map_action(risk_level: str) -> str:
    if risk_level == "CRITICAL":
        return "trigger_alert"
    elif risk_level == "HIGH":
        return "log_warning"
    elif risk_level == "MEDIUM":
        return "monitor"
    else:
        return "none"