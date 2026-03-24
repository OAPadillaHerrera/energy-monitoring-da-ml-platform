

from analytics.data.dataset_loader_db import load_dataset_from_db
from analytics.diagnostic_metrics import classify_anomalies_all_systems


def test_anomaly_classification():

    df = load_dataset_from_db()

    results = classify_anomalies_all_systems(df)

    # Validación básica de estructura
    assert isinstance(results, dict)
    assert len(results) > 0  # Debe haber al menos un sistema con anomalías

    for system, anomalies in results.items():

        # Cada sistema debe tener resultados válidos
        assert not anomalies.empty

        # Validar columnas esperadas
        assert "z_score" in anomalies.columns
        assert "anomaly_type" in anomalies.columns

        # Validar tipos de anomalía
        assert anomalies["anomaly_type"].isin(["spike", "drop"]).all()


if __name__ == "__main__":
    test_anomaly_classification()