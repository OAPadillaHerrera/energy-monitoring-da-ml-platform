

from analytics.ml.training.train_root_cause_model import train_root_cause_model
import pandas as pd

def test_train_root_cause_model():

    model = train_root_cause_model()

    assert model is not None

    assert hasattr(model, "predict")

    sample = pd.DataFrame([{
        "consumption_kwh": 10,
        "voltage_120v": 120,
        "voltage_240v": 240,
        "hour": 12,
        "weekday": 2,
        "rolling_mean_24h": 10,
        "delta_consumption": 0,
        "voltage_diff": 0,
    }])

    prediction = model.predict(sample)

    assert len(prediction) == 1

    valid_classes = [
        "normal",
        "grid_issue",
        "grid_outage",
        "voltage_instability",
        "equipment_issue",
        "demand_spike",
    ]

    assert prediction[0] in valid_classes

    print("\nModel test passed successfully")

if __name__ == "__main__":
    test_train_root_cause_model()


