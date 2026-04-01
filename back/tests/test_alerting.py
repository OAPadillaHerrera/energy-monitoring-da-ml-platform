

from analytics.ml.alerting.alerting import evaluate_alert

def test_grid_outage_critical_alert():
    prediction = "grid_outage"
    probabilities = {"grid_outage": 0.8}

    alerts = evaluate_alert(prediction, probabilities)

    assert len(alerts) == 1
    assert alerts[0]["level"] == "CRITICAL"
    assert "grid outage" in alerts[0]["message"].lower()

def test_demand_spike_warning_alert():
    prediction = "demand_spike"
    probabilities = {"demand_spike": 0.7}

    alerts = evaluate_alert(prediction, probabilities)

    assert len(alerts) == 1
    assert alerts[0]["level"] == "WARNING"

def test_no_alert_when_probability_low():
    prediction = "grid_outage"
    probabilities = {"grid_outage": 0.4}

    alerts = evaluate_alert(prediction, probabilities)

    assert alerts == []

def test_no_alert_for_normal_prediction():
    prediction = "normal"
    probabilities = {"normal": 0.99}

    alerts = evaluate_alert(prediction, probabilities)

    assert alerts == []

if __name__ == "__main__":
    test_grid_outage_critical_alert()
    test_demand_spike_warning_alert()
    test_no_alert_when_probability_low()
    test_no_alert_for_normal_prediction()
    print("All alerting tests passed")