

from data.loaaders.db_loader import load_dataset_from_db
from analytics.diagnostic_metrics import classify_anomalies_all_systems

def test_anomaly_classification():

    df = load_dataset_from_db()

    results = classify_anomalies_all_systems(df)

    assert isinstance(results, dict)
    assert len(results) > 0 

    for anomalies in results.items():

        assert not anomalies.empty
        assert "z_score" in anomalies.columns
        assert "anomaly_type" in anomalies.columns
        assert anomalies["anomaly_type"].isin(["spike", "drop"]).all()

if __name__ == "__main__":
    test_anomaly_classification()