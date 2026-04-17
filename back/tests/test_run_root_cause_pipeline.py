

from ml.inference.run_root_cause_pipeline import run_root_cause_pipeline
from analytics.data.processing.build_ml_dataset import build_ml_dataset

def test_run_root_cause_pipeline():
    
    df = build_ml_dataset()

    results = run_root_cause_pipeline(
        "models/root_cause_model.pkl",
        df
    )
    
    assert not results.empty
    assert "prediction" in results.columns
    assert "probabilities" in results.columns
    assert len(results) > 0
    
    valid_classes = ["normal", "demand_spike", "grid_outage"]
    for pred in results["prediction"].iloc[:5]:
        assert pred in valid_classes

    print("\nPredict root cause test passed successfully")

if __name__ == "__main__":
    test_run_root_cause_pipeline()