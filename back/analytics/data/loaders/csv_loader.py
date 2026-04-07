

from pathlib import Path
import pandas as pd

DATA_PATH = Path(__file__).parent.parent / "datasets"

def load_energy_dataset() -> pd.DataFrame:

    hourly_file = DATA_PATH / "hourly_consumption.csv"
    systems_file = DATA_PATH / "systems.csv"

    if not hourly_file.exists():
        raise FileNotFoundError(f"Missing file: {hourly_file}")

    if not systems_file.exists():
        raise FileNotFoundError(f"Missing file: {systems_file}")

    hourly_df = pd.read_csv(hourly_file, parse_dates=["timestamp"])
    systems_df = pd.read_csv(systems_file)

    dataset = hourly_df.merge(
        systems_df,
        left_on="system_id",
        right_on="id",
        how="left"
    )

    dataset = dataset.rename(columns={"name": "system_name"})

    required_columns = ["timestamp", "system_name", "consumption_kwh"]
    dataset = dataset[required_columns]

    return dataset