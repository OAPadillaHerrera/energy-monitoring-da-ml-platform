

import pandas as pd

def filter_by_date_range(
    df: pd.DataFrame,
    start_date: str | pd.Timestamp,
    end_date: str | pd.Timestamp
) -> pd.DataFrame:

    df_copy = df.copy()

    df_copy["timestamp"] = pd.to_datetime(df_copy["timestamp"])

    start_date = pd.to_datetime(start_date)
    end_date = pd.to_datetime(end_date) + pd.Timedelta(days=1)

    filtered_df = df_copy[
        (df_copy["timestamp"] >= start_date) &
        (df_copy["timestamp"] < end_date)
    ]

    return filtered_df

def filter_by_system(
    df: pd.DataFrame,
    system_name: str
) -> pd.DataFrame:

    return df[df["system_name"] == system_name]