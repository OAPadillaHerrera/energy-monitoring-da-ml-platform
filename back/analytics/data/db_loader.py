

from typing import Optional
import pandas as pd
from sqlalchemy.engine import Engine
from config.db import get_engine

def load_energy_dataset_from_db(engine: Optional[Engine] = None) -> pd.DataFrame:

    if engine is None:
        engine = get_engine()

    query = """
    SELECT 
        hc.timestamp,
        s.name AS system_name,
        hc.consumption_kwh,
        hvp.voltage_120v,
        hvp.voltage_240v,
        hvp.quality_flag
    FROM hourly_consumption hc
    JOIN systems s ON hc.system_id = s.id
    LEFT JOIN hourly_voltage_profile hvp
        ON hc.timestamp = hvp.timestamp
    """

    df = pd.read_sql(query, engine)

    if df.empty:
        raise ValueError("Query returned empty dataset")

    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")

    required_columns = [
        "timestamp",
        "system_name",
        "consumption_kwh",
        "voltage_120v",
        "voltage_240v",
    ]

    missing_cols = [col for col in required_columns if col not in df.columns]
    if missing_cols:
        raise ValueError(f"Missing expected columns: {missing_cols}")

    return df