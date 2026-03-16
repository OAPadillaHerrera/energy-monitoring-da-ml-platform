

from pathlib import Path
import pandas as pd

DATA_PATH = Path(__file__).parent / "datasets"

def load_dataset():

    hourly_file = DATA_PATH / "hourly_consumption.csv"
    systems_file = DATA_PATH / "systems.csv"

    hourly_df = pd.read_csv(hourly_file, parse_dates=["timestamp"])
    systems_df = pd.read_csv(systems_file)

    dataset = hourly_df.merge(
        systems_df,
        left_on="system_id",
        right_on="id",
        how="left"
    )

    dataset = dataset.rename(columns={"name": "system_name"})

    dataset = dataset[["timestamp", "system_name", "consumption_kwh"]]

    return dataset