

from config.settings import ALERT_THRESHOLDS

def evaluate_alert(prediction, probabilities):

    alerts = []

    if prediction == "grid_outage" and probabilities.get("grid_outage", 0) > ALERT_THRESHOLDS["grid_outage"]:
        alerts.append({
            "level": "CRITICAL",
            "message": "Possible grid outage detected"
        })

    elif prediction == "demand_spike" and probabilities.get("demand_spike", 0) > ALERT_THRESHOLDS["demand_spike"]:
        alerts.append({
            "level": "WARNING",
            "message": "High demand spike detected"

           })

    return alerts


