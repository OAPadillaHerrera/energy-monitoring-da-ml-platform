

import pandas as pd
from config.db import get_engine  

def load_dataset_from_db():

    engine = get_engine()

    query = """
    SELECT 
        hc.timestamp,
        s.name AS system_name,
        hc.consumption_kwh
    FROM hourly_consumption hc
    JOIN systems s ON hc.system_id = s.id
    """

    df = pd.read_sql(query, engine)

    df["timestamp"] = pd.to_datetime(df["timestamp"])

    return df