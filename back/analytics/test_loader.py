

from data.loaaders.csv_loader import load_energy_dataset

def test_load_energy_dataset():
    df = load_energy_dataset()

    assert df is not None
    assert not df.empty

    assert "timestamp" in df.columns
    assert "system_name" in df.columns
    assert "consumption_kwh" in df.columns

    assert df["timestamp"].dtype.kind == "M"  

    assert df["timestamp"].notnull().all()
    assert df["system_name"].notnull().all()
    assert df["consumption_kwh"].notnull().all()

if __name__ == "__main__":
    test_load_energy_dataset()
    print("\nDataset loader test passed successfully")
