

from data.loaaders.db_loader import load_dataset_from_db
from analytics.diagnostic_metrics import classify_anomalies_with_context_all_systems

def test_anomalies_with_context():

    df = load_dataset_from_db()

    results = classify_anomalies_with_context_all_systems(df)

    if not results:
        print("No anomalies detected.")
        return

    for system, anomalies in results.items():

        print(f"\n=== {system} ===")
        print(anomalies)

    assert isinstance(results, dict)

if __name__ == "__main__":
    test_anomalies_with_context()
