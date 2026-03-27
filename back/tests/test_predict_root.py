

from analytics.ml.predict_root_cause import predict_root_cause

def test_predict_root_cause():
    results = predict_root_cause("root_cause_model.pkl", "ml_ready_dataset.csv", n_samples=5)
    
    assert not results.empty
    assert "predicted" in results.columns
    assert "probabilities" in results.columns
    assert len(results) > 0
    
    valid_classes = ["normal", "demand_spike", "grid_outage"]
    for pred in results["predicted"].iloc[:5]:
        assert pred in valid_classes

    print("\nPredict root cause test passed successfully")

if __name__ == "__main__":
    test_predict_root_cause()