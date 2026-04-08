

from analytics.data.loaders.db_loader import load_energy_dataset_from_db
from analytics.anomaly.detection import detect_anomalies_by_system

def test_anomalies_by_system():

    df = load_energy_dataset_from_db()

    systems = df["system_name"].unique()

    for system in systems:

        anomalies = detect_anomalies_by_system(df, system)

        print(f"\n=== {system} ===")
        print(anomalies)

if __name__ == "__main__":
    test_anomalies_by_system()