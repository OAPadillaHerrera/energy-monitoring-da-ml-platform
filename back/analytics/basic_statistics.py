

from dataset_loader import load_dataset

def total_consumption():

    df = load_dataset()

    total = df["consumption_kwh"].sum()

    return total

def average_consumption():

    df = load_dataset()

    average = df["consumption_kwh"].mean()

    return average