

import pandas as pd

def filter_by_date_range(df, start_date, end_date):

    df["timestamp"] = pd.to_datetime(df["timestamp"])

    start_date = pd.to_datetime(start_date)
    end_date = pd.to_datetime(end_date) + pd.Timedelta(days=1)

    filtered_df = df[
        (df["timestamp"] >= start_date) &
        (df["timestamp"] < end_date)
    ]

    return filtered_df

def filter_by_system(df, system_name):

    filtered_df = df[df["system_name"] == system_name]

    return filtered_df
