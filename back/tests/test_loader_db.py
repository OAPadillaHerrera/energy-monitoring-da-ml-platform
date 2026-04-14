

from analytics.data.loaders.db_loader import load_energy_dataset_from_db

def test_load_energy_dataset_from_db():
    df = load_energy_dataset_from_db()

    assert df is not None
    assert not df.empty

    assert "timestamp" in df.columns
    assert "system_name" in df.columns
    assert "consumption_kwh" in df.columns

    assert df["timestamp"].notnull().all()
    assert df["system_name"].notnull().all()

    assert df["timestamp"].dtype.kind == "M"

if __name__ == "__main__":
    test_load_energy_dataset_from_db()
    print("\nDB dataset loader test passed successfully")