

def evaluate_risk(prob: float) -> str:
    if prob > 0.8:
        return "CRITICAL"
    elif prob > 0.5:
        return "HIGH"
    elif prob > 0.3:
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