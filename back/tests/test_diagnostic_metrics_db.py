

from analytics.data.dataset_loader_db import load_dataset_from_db
from analytics.diagnostic_metrics import (
    load_factor,
    load_factor_by_system,
    system_ranking,
    z_score_consumption,
    detect_anomalies,
)

def test_diagnostic_metrics():

    df = load_dataset_from_db()

    print("\n=== LOAD FACTOR (TOTAL) ===")
    print(load_factor(df))

    print("\n=== LOAD FACTOR BY SYSTEM ===")
    print(load_factor_by_system(df))

    print("\n=== SYSTEM RANKING ===")
    print(system_ranking(df))

    print("\n=== Z-SCORE ===")
    print(z_score_consumption(df).head())

    print("\n=== ANOMALIES ===")
    print(detect_anomalies(df))

    assert not df.empty

if __name__ == "__main__":
    test_diagnostic_metrics()