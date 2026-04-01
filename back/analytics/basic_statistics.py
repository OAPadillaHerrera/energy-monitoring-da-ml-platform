

import pandas as pd
from data.csv_loader import load_dataset

def total_consumption():

    df = load_dataset()

    total = df["consumption_kwh"].sum()

    return total

def average_consumption():

    df = load_dataset()

    average = df["consumption_kwh"].mean()

    return average

def consumption_by_system():

    df = load_dataset()

    consumption = df.groupby("system_name")["consumption_kwh"].sum()

    return consumption

def consumption_by_hour():

    df = load_dataset()

    df["timestamp"] = pd.to_datetime(df["timestamp"])

    consumption = df.groupby(df["timestamp"].dt.hour)["consumption_kwh"].sum()

    return consumption