

import pandas as pd
from config.db import get_engine  

def load_dataset_from_db():

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

    df["timestamp"] = pd.to_datetime(df["timestamp"])

    return df