

import pandas as pd
from filters import filter_by_system

def total_energy_by_system(dataset, system_name):

    system_data = filter_by_system(dataset, system_name)

    return system_data["consumption_kwh"].sum()

def avg_consumption_by_system(dataset, system_name):

    system_data = filter_by_system(dataset, system_name)

    return system_data["consumption_kwh"].mean()

def peak_consumption_by_system(dataset, system_name):

    system_data = filter_by_system(dataset, system_name)

    return system_data["consumption_kwh"].max()

def min_consumption_by_system(dataset, system_name):

    system_data = filter_by_system(dataset, system_name)

    return system_data["consumption_kwh"].min()

def energy_by_hour_by_system(dataset, system_name):

    system_data = filter_by_system(dataset, system_name)

    return system_data.groupby("timestamp")["consumption_kwh"].sum()

def daily_energy_by_system(dataset, system_name):

    hourly_energy = energy_by_hour_by_system(dataset, system_name)

    hourly_energy.index = pd.to_datetime(hourly_energy.index)
    daily_energy = hourly_energy.groupby(hourly_energy.index.date).sum()

    return daily_energy

def std_consumption_by_system(dataset, system_name):

    hourly = energy_by_hour_by_system(dataset, system_name)

    return hourly.std()

def avg_daily_energy_by_system(dataset, system_name):

    daily = daily_energy_by_system(dataset, system_name)

    return daily.mean()

def avg_hourly_profile_by_system(dataset, system_name):

    hourly = energy_by_hour_by_system(dataset, system_name)

    hourly.index = pd.to_datetime(hourly.index)

    hourly = hourly.to_frame()

    hourly["hour"] = hourly.index.hour

    return hourly.groupby("hour")["consumption_kwh"].mean()