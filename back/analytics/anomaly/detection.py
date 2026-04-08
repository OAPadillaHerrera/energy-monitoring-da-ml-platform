

from typing import Dict
import pandas as pd
from config.settings import ANOMALY_Z_THRESHOLD
from analytics.anomaly.zscore import z_score_by_system

def detect_anomalies(z_scores: pd.Series, threshold: float = ANOMALY_Z_THRESHOLD) -> pd.Series:
    z_scores = pd.to_numeric(z_scores, errors="coerce")
    return z_scores[abs(z_scores) > threshold]

def detect_anomalies_by_system(
    dataset: pd.DataFrame,
    system_name: str,
    threshold: float = ANOMALY_Z_THRESHOLD
) -> pd.Series:

    z_scores = z_score_by_system(dataset, system_name)
    return detect_anomalies(z_scores, threshold)

def detect_anomalies_all_systems(
    dataset: pd.DataFrame,
    threshold: float = ANOMALY_Z_THRESHOLD
) -> Dict[str, pd.Series]:

    results = {}

    for system in dataset["system_name"].unique():
        anomalies = detect_anomalies_by_system(dataset, system, threshold)

        if not anomalies.empty:
            results[system] = anomalies

    return results