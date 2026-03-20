

from analytics.data.dataset_loader_db import load_dataset_from_db
from analytics.diagnostic_metrics import detect_anomalies_by_system

def test_anomalies_by_system():

    df = load_dataset_from_db()

    systems = df["system_name"].unique()

    for system in systems:

        anomalies = detect_anomalies_by_system(df, system)

        print(f"\n=== {system} ===")
        print(anomalies)

if __name__ == "__main__":
    test_anomalies_by_system()