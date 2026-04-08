

from analytics.data.loaders.db_loader import load_energy_dataset_from_db
from analytics.diagnostic_metrics import (
    z_score_consumption,
    detect_anomalies,
)

from analytics.metrics.energy_metrics import (
    load_factor,
    load_factor_by_system,
    system_ranking,
)

def test_diagnostic_metrics():

    df = load_energy_dataset_from_db()

    print("\n=== LOAD FACTOR (TOTAL) ===")
    print(load_factor(df))

    print("\n=== LOAD FACTOR BY SYSTEM ===")
    print(load_factor_by_system(df))

    print("\n=== SYSTEM RANKING ===")
    print(system_ranking(df))

    print("\n=== Z-SCORE ===")
    z_scores = z_score_consumption(df)
    print(z_scores.head())

    print("\n=== ANOMALIES ===")
    anomalies = detect_anomalies(z_scores)
    print(anomalies)

    assert not df.empty

if __name__ == "__main__":
    test_diagnostic_metrics()