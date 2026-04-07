

from data.processing.build_ml_dataset import build_ml_dataset

def test_build_ml_dataset():

    df = build_ml_dataset()

    assert not df.empty, "ML dataset should not be empty"

    expected_columns = [
        "timestamp",
        "system_name",
        "consumption_kwh",
        "voltage_120v",
        "voltage_240v",
        "quality_flag",
        "z_score",
        "anomaly_type",
        "root_cause",
        "hour",
        "weekday",
        "rolling_mean_24h",
        "delta_consumption",
        "voltage_diff",
    ]

    for col in expected_columns:
        assert col in df.columns, f"Missing column: {col}"

    assert df["anomaly_type"].isin(["normal", "spike", "drop"]).all(), \
        "Invalid values found in anomaly_type"

    assert df["root_cause"].isin([
        "normal",
        "grid_issue",
        "grid_outage",
        "voltage_instability",
        "equipment_issue",
        "demand_spike",
    ]).all(), "Invalid values found in root_cause"

    print("\nML dataset validated successfully")

if __name__ == "__main__":
    test_build_ml_dataset()