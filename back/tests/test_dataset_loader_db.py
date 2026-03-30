

import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from analytics.data.dataset_loader_db import load_dataset_from_db

def test_load_dataset():

    df = load_dataset_from_db()

    print("\n=== DATAFRAME HEAD ===")
    print(df.head())

    print("\n=== DATA TYPES ===")
    print(df.dtypes)

    print("\n=== FIRST TIMESTAMP VALUE ===")
    print(df["timestamp"].iloc[0])

    print("\n=== UNIQUE TIMESTAMPS (first 5) ===")
    print(df["timestamp"].unique()[:5])

    df["timestamp_str"] = df["timestamp"].dt.strftime("%Y-%m-%d %H:%M:%S")

    print("\n=== FORMATTED TIMESTAMPS ===")
    print(df[["timestamp_str", "system_name", "consumption_kwh"]].head())

    assert not df.empty, "The DataFrame should not be empty"
    assert "timestamp" in df.columns
    assert "system_name" in df.columns
    assert "consumption_kwh" in df.columns

if __name__ == "__main__":
    test_load_dataset()